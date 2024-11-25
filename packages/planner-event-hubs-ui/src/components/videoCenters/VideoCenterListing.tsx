import { useMutation, useQuery } from '@apollo/client';
import Header from '@components/Header';
import VideoCenterCreateModal from '@components/videoCenters/create/VideoCenterCreateModal';
import ViewVideoCenters from '@components/videoCenters/listing/ViewVideoCenters';
import ScrollViewWithBars from '@cvent/carina/components/ScrollViewWithBars/ScrollViewWithBars';
import { ActionType } from '@cvent/carina/components/Templates/utils/helpers';
import { Hub, HubsPagingResponse, PagingResponse } from '@cvent/planner-event-hubs-model/types';
import { useDefaultLanguageSetting } from '@hooks/DefaultLanguageProvider';
import useInfiniteScroll from '@hooks/useInfiniteScroll';
import { VIDEO_CENTER_LIST_LIMIT } from '@utils/constants';
import { GET_VIDEO_HUBS, DELETE_VIDEO_HUB } from '@cvent/planner-event-hubs-model/operations/hub';
import { LoggerFactory } from '@cvent/logging/LoggerFactory';
import LoadingWrapper from '@components/common/loading/LoadingWrapper';
import { useTranslate } from 'nucleus-text';
import { useCallback, useRef, useState } from 'react';

const LOG = LoggerFactory.create('Events-plus-listing');

function VideoCenterListing(): JSX.Element {
  const { translate } = useTranslate();
  const videoCenterTableRef = useRef(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [videoCentersData, setVideoCentersData] = useState<Array<Hub>>([]);
  const [videoCentersPagination, setVideoCentersPagination] = useState<PagingResponse>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [initialLoadingComplete, setInitialLoadingComplete] = useState(false);

  const {
    fetchMore,
    refetch: refetchVideoCenters,
    error
  } = useQuery(GET_VIDEO_HUBS, {
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first',
    variables: {
      input: { limit: VIDEO_CENTER_LIST_LIMIT }
    },
    onCompleted: ({ hubs }: { hubs: HubsPagingResponse }) => {
      setVideoCentersData(hubs.data);
      setVideoCentersPagination(hubs.paging);
      setInitialLoadingComplete(true);
    },
    onError: apolloError => {
      setInitialLoadingComplete(true);
      LOG.error(apolloError, 'Failed to get event plus hubs');
    }
  });

  const defaultLang = useDefaultLanguageSetting();

  const loadMore = useCallback(async () => {
    const nextToken = videoCentersPagination?.nextToken;
    if (!isLoadingMore && nextToken) {
      setIsLoadingMore(true);
      await fetchMore({
        variables: {
          input: {
            token: nextToken
          }
        },
        updateQuery: (prev, { fetchMoreResult }: { fetchMoreResult? }) => {
          if (!fetchMoreResult?.hubs?.data) return prev;
          setVideoCentersData(existingCenterList => [...existingCenterList, ...fetchMoreResult.hubs.data]);
          setVideoCentersPagination(fetchMoreResult.hubs.paging);

          return {
            hubs: {
              ...fetchMoreResult.hubs,
              data: [...prev.hubs.data, ...fetchMoreResult.hubs.data]
            }
          };
        }
      });
      setIsLoadingMore(false);
    }
  }, [videoCentersPagination, isLoadingMore, fetchMore]);

  useInfiniteScroll(loadMore, videoCenterTableRef, {
    bottomScrollLeft: 100,
    immediate: true
  });

  const [deleteVideoHubMutation] = useMutation(DELETE_VIDEO_HUB);
  const handleDeleteVideoCenter = useCallback(
    (videoCenterId: string) => {
      deleteVideoHubMutation({
        variables: { input: { id: videoCenterId } },
        onCompleted: () => {
          setVideoCentersData(existingList => existingList.filter(hub => hub.id !== videoCenterId));
          // setIsVideoCenterDeleteSuccess(true); // TODO: add alert
        },
        onError: () => {
          // setIsVideoCenterDeleteSuccess(false); // TODO: add alert
        }
      });
    },
    [deleteVideoHubMutation]
  );

  const headerActions: ActionType[] = [
    {
      value: translate('video_hubs_header_action_create_text'),
      onClick: (): void => setIsCreateModalOpen(true),
      label: translate('video_hubs_header_action_create_text')
    }
  ];

  const videoCenterListingHeader: JSX.Element = (
    <Header title={translate('video_hubs_header_title')} actions={headerActions} />
  );

  const eventsPlusListingRenderer = (): JSX.Element => (
    <>
      <ViewVideoCenters
        videoHubs={videoCentersData}
        loadingVideoCentersList={!initialLoadingComplete && videoCentersData.length === 0}
        headerActions={headerActions}
        deleteVideoCenter={handleDeleteVideoCenter}
      />
      <VideoCenterCreateModal
        isModalOpen={isCreateModalOpen}
        setIsModalOpen={setIsCreateModalOpen}
        defaultLanguage={defaultLang?.DefaultCultureCode}
        refetchVideoCenters={refetchVideoCenters}
      />
    </>
  );

  return (
    <ScrollViewWithBars
      forwardScrollViewRef={videoCenterTableRef}
      header={videoCenterListingHeader}
      css={{ zIndex: 1 }}
    >
      <LoadingWrapper loading={!initialLoadingComplete} renderer={eventsPlusListingRenderer} errors={[error]} />
    </ScrollViewWithBars>
  );
}

export default VideoCenterListing;

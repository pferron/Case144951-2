import ChannelsTable from '@components/channels/listing/ChannelsTable';
import React, { useCallback, useMemo, useState, useRef, useEffect } from 'react';
import { Breadcrumbs, Breadcrumb as Crumb } from '@cvent/carina/components/Breadcrumbs';
import {
  ASC,
  CHANNEL_LIST_LIMIT,
  CHANNEL_ORDER,
  CHANNEL_TITLE,
  CHANNEL_URL,
  CHANNELS_PATH_PARAM_KEY,
  CHANNELS_URL,
  HUB_OVERVIEW_URL,
  VIDEO_HUB_INFORMATION_URL,
  VIDEO_HUB_PATH_PARAM_KEY,
  VIDEO_HUBS_URL
} from '@utils/constants';
import Header from '@components/Header';
import { useTranslate } from 'nucleus-text';
import { TemplateActions as Actions } from '@cvent/carina/components/Templates/TemplateActions';
import ChannelModal from '@components/channels/create/ChannelModal';
import HeroBuild from '@cvent/carina/components/Illustrations/HeroBuild';
import { ChannelPageStyle } from '@components/channels/style';
import { useStyle } from '@hooks/useStyle';
import { ActionType } from '@cvent/carina/components/Templates/utils/helpers';
import { injectTestId } from '@cvent/nucleus-test-automation';
import { Alerts, PageAlert } from '@cvent/carina/components/Alert';
import { useRouter } from 'next/router';
import { ChannelListingType } from '@components/channels/type/channel';
import useInfiniteScroll from '@hooks/useInfiniteScroll';
import ScrollViewWithBars from '@cvent/carina/components/ScrollViewWithBars/ScrollViewWithBars';
import { useMutation, useQuery } from '@apollo/client';
import LoadingWrapper from '@components/common/loading/LoadingWrapper';
import { ChannelStatus, Paging, PlannerPaginatedChannels } from '@cvent/planner-event-hubs-model/types';
import { useAppFeatures } from '@components/AppFeaturesProvider';
import Row from '@cvent/carina/components/Row';
import Col from '@cvent/carina/components/Col';
import { LoggerFactory } from '@cvent/logging/LoggerFactory';
import StatusText from '@components/common/StatusText';
import { Catalog } from '@cvent/drag-and-drop-catalog/dist/types/catalogTypes';
import NavigationConfirmationModal from '@components/common/NavigationConfirmationModal';
import { useChannelsPageActionsApi } from '@metrics/client/react/useChannelsPageActionsApi';
import {
  createChannelMutation,
  deleteChannelMutation,
  updateChannelOrderMutation,
  getPlannerPaginatedChannelsQuery
} from '@cvent/planner-event-hubs-model/operations/channel';
import { BreadCrumb } from '@components/common/BreadCrumb';
import { useCenterInfo } from '@hooks/useCenterInfo';
import getConfig from 'next/config';

type FilterInput = {
  limit?: number | undefined;
  sort?: string | undefined;
  token?: string | undefined;
};

const LOG = LoggerFactory.create('Channels-listing');

function ChannelListing({ videoHubId, hubTitle }: Props): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const { translate } = useTranslate();
  const { container, emptyPageContainer, emptyPageContentHeader, emptyPageContentBody } = useStyle(ChannelPageStyle);
  const channelTableRef = useRef(null);
  const [channels, setChannels] = useState<Array<ChannelListingType>>([]);
  const [channelPagination, setChannelPagination] = useState<Paging>(null);
  const [loadingMoreChannel, setLoadingMoreChannels] = useState<boolean>(false);
  const [deletingChannel, setDeletingChannel] = useState<boolean>(false);
  const [creatingChannel, setCreatingChannel] = useState<boolean>();
  const [isChannelDeleteSuccess, setIsChannelDeleteSuccess] = useState<boolean>();
  const router = useRouter();
  const { query = {} } = router;
  const { isSuccess } = query;
  const [isDraggable, setIsDraggable] = useState<boolean>(false);
  const [isChannelReorderSuccess, setIsChannelReorderSuccess] = useState<boolean>(undefined);
  const [showNavigationConfirmationModal, setShowNavigationConfirmationModal] = useState(false);
  const [isPageEdited, setIsPageEdited] = useState<boolean>(false);
  const [initialLoadingComplete, setInitialLoadingComplete] = useState(false);
  const { hubOverviewFeature } = useAppFeatures();
  const { createChannelButtonClicked, createButtonClicked } = useChannelsPageActionsApi();
  const [channelCatalog, setChannelCatalog] = useState<Catalog>({
    id: 'channelsCatalog',
    sections: [
      {
        id: 'channelsList',
        title: 'channelsList',
        itemCount: 0,
        content: null,
        items: []
      }
    ]
  });
  const channelOrderMap = useMemo(() => new Map<string, ChannelListingType>(), []);
  // FIREBALL
  /* eslint-disable */
  const DraggableChannelRow = useMemo(
    () =>
      function (rowData: ChannelListingType): JSX.Element {
        const { title, status } = rowData;
        return (
          <Row>
            <Col width={2 / 3} css={{ wordBreak: 'break-word' }}>
              {title}
            </Col>
            <Col width={1 / 3}>
              <StatusText isActive={status === ChannelStatus.Active} />
            </Col>
          </Row>
        );
      },
    []
  );

  const {
    fetchMore: fetchMoreChannels,
    refetch: refetchChannels,
    error
  } = useQuery<{ getPlannerPaginatedChannels: PlannerPaginatedChannels }, { hubId: string; filterInput: FilterInput }>(
    getPlannerPaginatedChannelsQuery,
    {
      fetchPolicy: 'network-only',
      nextFetchPolicy: 'network-only',
      variables: {
        hubId: videoHubId,
        filterInput: {
          limit: CHANNEL_LIST_LIMIT,
          sort: `${CHANNEL_ORDER}:${ASC},${CHANNEL_TITLE}:${ASC}`
        }
      },
      notifyOnNetworkStatusChange: true,
      onCompleted: ({ getPlannerPaginatedChannels }: { getPlannerPaginatedChannels: PlannerPaginatedChannels }) => {
        const { data, paging } = getPlannerPaginatedChannels;
        // when channels are fetched after delete they have some duplicate items which are already visible on UI
        // therefore filtering newly fetched data to get channels which are not present on UI
        const filteredData = !deletingChannel ? data : data.filter(channel => !channelOrderMap.has(channel.id));
        const draggableItems = filteredData.map(channel => ({
          id: channel.id,
          content: <DraggableChannelRow {...channel} />,
          displayName: channel.title
        }));
        const newChannelCatalog: Catalog = {
          ...channelCatalog,
          sections: [
            {
              ...channelCatalog.sections[0],
              itemCount: channelCatalog.sections[0].itemCount + data.length,
              items:
                loadingMoreChannel || deletingChannel
                  ? [...channelCatalog.sections[0].items, ...draggableItems]
                  : draggableItems
            }
          ]
        };
        setChannelCatalog(newChannelCatalog);

        if (loadingMoreChannel || deletingChannel) {
          setLoadingMoreChannels(false);
          setDeletingChannel(false);
          setChannels(existingChannelList => [...existingChannelList, ...filteredData]);
        } else {
          setChannels(filteredData);
        }
        setInitialLoadingComplete(true);
        setChannelPagination(paging);
      },
      onError: apolloError => {
        setInitialLoadingComplete(true);
        LOG.error(apolloError, 'Failed to get Channels');
      }
    }
  );

  const loadMoreChannel = useCallback(async () => {
    if (channelPagination?.nextToken && !loadingMoreChannel && !deletingChannel) {
      setLoadingMoreChannels(true);
      await fetchMoreChannels({
        variables: {
          hubId: videoHubId,
          filterInput: {
            token: channelPagination.nextToken
          }
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) {
            setLoadingMoreChannels(false);
            setChannels(prev.getPlannerPaginatedChannels.data);
            setChannelPagination(prev.getPlannerPaginatedChannels.paging);
          } else {
            setChannels([
              ...prev.getPlannerPaginatedChannels.data,
              ...fetchMoreResult.getPlannerPaginatedChannels.data
            ]);
            setChannelPagination(fetchMoreResult.getPlannerPaginatedChannels.paging);
            setLoadingMoreChannels(false);
          }
          return {
            getPlannerPaginatedChannels: {
              ...fetchMoreResult.getPlannerPaginatedChannels,
              data: [...prev.getPlannerPaginatedChannels.data, ...fetchMoreResult.getPlannerPaginatedChannels.data]
            }
          };
        }
      });
    }
  }, [channelPagination, loadingMoreChannel, videoHubId, fetchMoreChannels, deletingChannel]);

  useInfiniteScroll(loadMoreChannel, channelTableRef, {
    bottomScrollLeft: 100,
    immediate: true
  });

  const [createChannel] = useMutation(createChannelMutation);

  const [deleteChannel] = useMutation(deleteChannelMutation);

  const [updateChannelsOrder, { loading: updatingChannelsOrder }] = useMutation(updateChannelOrderMutation, {
    onCompleted: data => {
      const updatedOrderList = data.updateChannelOrder;
      const updatedList = updatedOrderList.map(channel => ({
        ...channelOrderMap.get(channel.id),
        order: channel.order
      }));
      setChannels(updatedList);
      setIsChannelReorderSuccess(true);
    },
    onError: () => {
      setIsChannelReorderSuccess(false);
    }
  });

  const handleDeleteChannel = useCallback(
    (channelId: string) => {
      setDeletingChannel(true);
      deleteChannel({
        variables: {
          channelId
        },
        onCompleted: () => {
          setChannelCatalog(catalog => ({
            ...catalog,
            sections: [
              {
                ...catalog.sections[0],
                itemCount: catalog.sections[0].itemCount - 1,
                items: catalog.sections[0].items.filter(channel => channel.id !== channelId)
              }
            ]
          }));
          setChannels(existingChannelList => existingChannelList.filter(channel => channel.id !== channelId));
          refetchChannels({
            hubId: videoHubId,
            filterInput: {
              token: channelPagination.currentToken
            }
          });
          setIsChannelDeleteSuccess(true);
          setDeletingChannel(false);
        },
        onError: () => {
          setDeletingChannel(false);
          setIsChannelDeleteSuccess(false);
        }
      });
    },
    [deleteChannel, refetchChannels, videoHubId, channelPagination]
  );
  const { publicRuntimeConfig } = getConfig();
  const hub = useCenterInfo();
  const hubShortUrl = !hub?.hubUrl || hub?.hubUrl == '' ? `${publicRuntimeConfig.VIDEO_HUB_WEB}` : hub.hubUrl;
  const hubDomain = new URL(hubShortUrl).hostname;
  const shortUrlDomain = new URL(hubShortUrl).hostname;
  const redirectDomain = new URL(`${publicRuntimeConfig.CVENT_SHORT_URL}`).hostname;
  const customDomain = shortUrlDomain !== redirectDomain ? hubDomain : null;
  const onSave = useCallback(
    (name: string, description: string): void => {
      // call create channel mutation
      setCreatingChannel(true);
      createChannel({
        variables: {
          hubId: videoHubId,
          title: name,
          description,
          customDomain: customDomain
        },
        onCompleted: ({ createChannel: { id: channelId } }) => {
          const redirection = CHANNEL_URL.replace(VIDEO_HUB_PATH_PARAM_KEY, videoHubId).replace(
            CHANNELS_PATH_PARAM_KEY,
            channelId
          );
          router.replace(redirection);
        }
      });
      createButtonClicked({
        channelName: name,
        channelDescription: description
      });
    },
    [createChannel, router, videoHubId]
  );

  useEffect(() => {
    channels.forEach(channel => channelOrderMap.set(channel.id, channel));
  }, [channels, channelOrderMap]);

  const handleOnCreateChannel = (): void => {
    setIsOpen(true);
    createChannelButtonClicked({});
  };

  const headerActions: ActionType[] = useMemo(() => {
    if (channels.length > 1) {
      return [
        {
          value: translate('reorder_channel_button_label'),
          onClick: (): void => {
            setIsDraggable(true);
          },
          label: translate('reorder_channel_button_label'),
          appearance: 'lined'
        },
        {
          value: translate('create_channel_button_label'),
          onClick: (): void => handleOnCreateChannel(),
          label: translate('create_channel_button_label'),
          appearance: 'filled'
        }
      ];
    }
    return [
      {
        value: translate('create_channel_button_label'),
        onClick: (): void => handleOnCreateChannel(),
        label: translate('create_channel_button_label')
      }
    ];
  }, [translate, channels]);

  const reorderingHeaderActions: ActionType[] = useMemo(
    () => [
      {
        value: translate('cancel_button'),
        onClick: (): void => {
          const draggableItems = channels.map(channel => ({
            id: channel.id,
            content: <DraggableChannelRow {...channel} />,
            displayName: channel.title
          }));
          const newChannelCatalog: Catalog = {
            ...channelCatalog,
            sections: [
              {
                ...channelCatalog.sections[0],
                itemCount: channels.length,
                items: draggableItems
              }
            ]
          };
          setChannelCatalog(newChannelCatalog);
          setIsDraggable(false);
          setIsPageEdited(false);
        },
        label: translate('cancel_button'),
        appearance: 'lined'
      },
      {
        value: translate('channel_reordering_save_button_text'),
        onClick: (): void => {
          const channelOrdersList = channelCatalog.sections[0].items.map((channel, index) => ({
            id: channel.id,
            existingOrder: channelOrderMap.get(channel.id).order,
            order: index + 1
          }));
          updateChannelsOrder({
            variables: {
              hubId: videoHubId,
              channelOrderInputList: channelOrdersList
            }
          });
          setIsDraggable(false);
          setIsPageEdited(false);
        },
        label: translate('channel_reordering_save_button_text'),
        appearance: 'filled'
      }
    ],
    [translate, videoHubId, updateChannelsOrder, channelCatalog, channels, channelOrderMap, DraggableChannelRow]
  );

  const headerBreadCrumbs: JSX.Element = (
    <Breadcrumbs>
      <BreadCrumb url={VIDEO_HUBS_URL}>{translate('video_hubs_header_title')}</BreadCrumb>
      <BreadCrumb
        url={
          hubOverviewFeature
            ? HUB_OVERVIEW_URL.replace(VIDEO_HUB_PATH_PARAM_KEY, videoHubId)
            : VIDEO_HUB_INFORMATION_URL.replace(VIDEO_HUB_PATH_PARAM_KEY, videoHubId)
        }
      >
        {hubTitle}
      </BreadCrumb>
      <Crumb>{translate('channels')}</Crumb>
    </Breadcrumbs>
  );

  const emptyPage: JSX.Element = useMemo(
    () => (
      <div css={emptyPageContainer} {...injectTestId('empty-channel-page-container')}>
        <HeroBuild height={319} width={324} title={translate('empty_channel_page_message')} />
        <div css={emptyPageContentHeader}>{translate('empty_channel_page_header')}</div>
        <div css={emptyPageContentBody}>{translate('empty_channel_page_message')}</div>
        <Actions testID="create-channel-page-button" actions={headerActions} position="center" />
      </div>
    ),
    [emptyPageContainer, emptyPageContentBody, emptyPageContentHeader, headerActions, translate]
  );

  const viewChannelsList = useMemo(
    (): JSX.Element => (
      <ChannelsTable
        channels={channels}
        loadingMoreChannel={loadingMoreChannel}
        deleteChannel={handleDeleteChannel}
        isDraggable={isDraggable}
        scrollViewRef={channelTableRef}
        channelCatalog={channelCatalog}
        setChannelCatalog={setChannelCatalog}
        setIsPageEdited={setIsPageEdited}
      />
    ),
    [channels, loadingMoreChannel, handleDeleteChannel, isDraggable, channelTableRef, channelCatalog]
  );

  const showAlert = useCallback(
    (successParam: string | string[]): JSX.Element => {
      let success = null;
      if (typeof successParam === 'string') {
        success = successParam;
      } else {
        const successMessage = successParam[0];
        success = successMessage;
      }
      if (success !== 'true' && success !== 'false') return;
      const appearance = success === 'true' ? 'success' : 'danger';
      const content = success === 'true' ? translate('channel_delete_success') : translate('channel_delete_error');
      const testId = `channel-deletion-${appearance}`;
      return (
        <div css={{ margin: '0 1.5rem 1rem 1.5rem' }}>
          <Alerts
            variant="page"
            isRtl={false}
            testID={testId}
            alerts={[
              {
                appearance,
                content,
                dismissible: true,
                id: '0',
                isRtl: false,
                onDismiss: () => {
                  setIsChannelDeleteSuccess(undefined);
                  router.replace(CHANNELS_URL.replace(VIDEO_HUB_PATH_PARAM_KEY, videoHubId), undefined, {
                    shallow: true
                  });
                }
              }
            ]}
          />
        </div>
      );
    },
    [router, translate, videoHubId]
  );

  const channelListPageBody = useCallback(
    () => (
      <div css={container}>
        {(isSuccess !== undefined || isChannelDeleteSuccess !== undefined) &&
          showAlert(isChannelDeleteSuccess?.toString() ?? isSuccess)}
        {isChannelReorderSuccess !== undefined && (
          <div css={{ margin: '0 1.5rem 1.5rem' }}>
            <PageAlert
              testID={isChannelReorderSuccess ? 'channel-reorder-success-alert' : 'channel-reorder-fail-alert'}
              appearance={isChannelReorderSuccess ? 'success' : 'danger'}
              content={
                isChannelReorderSuccess
                  ? translate('channel_order_save_alert_message')
                  : translate('channel_ordering_failure_alert_message')
              }
              onDismiss={() => setIsChannelReorderSuccess(undefined)}
            />
          </div>
        )}
        {channels.length > 0 && (
          <p css={{ padding: '0 1.5rem', margin: '0 0 1.5rem 0' }}>{translate('channel_list_description')}</p>
        )}
        <ChannelModal isModalOpen={isOpen} setIsModalOpen={setIsOpen} onSave={onSave} />
        {channels?.length > 0 ? viewChannelsList : emptyPage}
        <NavigationConfirmationModal
          isOpen={showNavigationConfirmationModal}
          setIsOpen={setShowNavigationConfirmationModal}
          bodyText={translate('page-navigation-confirmation-body')}
          preventLeave={isPageEdited}
          testID="channel-page"
        />
      </div>
    ),
    [
      isPageEdited,
      showNavigationConfirmationModal,
      isChannelReorderSuccess,
      channels?.length,
      container,
      isChannelDeleteSuccess,
      emptyPage,
      isOpen,
      isSuccess,
      onSave,
      showAlert,
      viewChannelsList,
      translate
    ]
  );

  const channelListingHeader: JSX.Element = (
    <Header
      title={translate('channels')}
      actions={isDraggable ? reorderingHeaderActions : headerActions}
      breadCrumbs={headerBreadCrumbs}
    />
  );

  return (
    <ScrollViewWithBars forwardScrollViewRef={channelTableRef} header={channelListingHeader}>
      <LoadingWrapper
        loading={
          !loadingMoreChannel &&
          (creatingChannel || deletingChannel || updatingChannelsOrder || !initialLoadingComplete)
        }
        renderer={channelListPageBody}
        errors={[error]}
      />
    </ScrollViewWithBars>
  );
}

interface Props {
  videoHubId: string;
  hubTitle: string;
}

export default ChannelListing;

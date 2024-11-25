import Header from '@components/Header';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Breadcrumbs, Breadcrumb as Crumb } from '@cvent/carina/components/Breadcrumbs';
import {
  CHANNELS_URL,
  CHANNEL_PAGE_HEADER_Z_INDEX,
  VIDEO_HUB_PATH_PARAM_KEY,
  VIDEO_HUBS_URL,
  VIDEO_HUB_INFORMATION_URL,
  TAB,
  HUB_OVERVIEW_URL
} from '@utils/constants';
import Tabs from '@cvent/carina/components/Tabs/Tabs';
import { ChannelInformation } from '@components/channels/information/ChannelInformation';
import { useTranslate } from 'nucleus-text';
import DeleteChannel from '@components/channels/delete/DeleteChannel';
import { useRouter } from 'next/router';
import { ActionType } from '@cvent/carina/components/Templates/utils/helpers';
import { ChannelPageStyle } from '@components/channels/style';
import { useStyle } from '@hooks/useStyle';
import ScrollViewWithBars from '@cvent/carina/components/ScrollViewWithBars/ScrollViewWithBars';
import ChannelCatalogContainer from '@components/channels/videos/ChannelCatalogContainer';
import { PageAlert } from '@cvent/carina/components/Alert';
import { NetworkStatus, useMutation, useQuery } from '@apollo/client';
import { LoggerFactory } from '@cvent/logging/LoggerFactory';
import LoadingWrapper from '@components/common/loading/LoadingWrapper';
import { redirectClientSide, updateUrlQueryParam } from '@utils/redirect';
import { ChannelInformationType } from '@components/channels/type/channel';
import { isChannelActive } from '@utils/channelHelper';
// TODO: Events removed from tab for MVP
// import EventsCatalogContainer from './events/EventsCatalogContainer';
import StatusText from '@components/common/StatusText';
import NavigationConfirmationModal from '@components/common/NavigationConfirmationModal';
import ConfirmationModal from '@components/common/ConfirmationModal';
import useQueryParams from '@hooks/useQueryParam';
import {
  getCatalogQuery,
  getChannelQuery,
  deleteChannelMutation
} from '@cvent/planner-event-hubs-model/operations/channel';
import { useAppFeatures } from '@components/AppFeaturesProvider';
import { useChannelsPageActionsApi } from '@metrics/client/react/useChannelsPageActionsApi';
import { BreadCrumb } from '@components/common/BreadCrumb';
import { logApolloError } from '../../apollo/ErrorApolloLink';

const LOG = LoggerFactory.create('Channel');

function Channel({ videoHubId, channelId, hubTitle }: Props): JSX.Element {
  const { translate } = useTranslate();
  const { tab } = useQueryParams();
  const [selectedTab, setSelectedTab] = useState<number>(tab === '1' ? 1 : 0);
  const [nextSelectedTab, setNextSelectedTab] = useState<number>(tab === '1' ? 1 : 0);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [channelData, setChannelData] = useState<ChannelInformationType>(null);
  const [deletingChannel, setDeletingChannel] = useState<boolean>(false);
  const [isPageEdited, setIsPageEdited] = useState<boolean>(false);
  const [showNavigationConfirmationModal, setShowNavigationConfirmationModal] = useState(false);
  const [showTabSwitchModal, setShowTabSwitchModal] = useState(false);
  const router = useRouter();
  const { headerTab, channelInformationContainer } = useStyle(ChannelPageStyle);
  const ref = useRef<HTMLInputElement>(null);
  const { hubOverviewFeature } = useAppFeatures();
  const { deleteChannelButtonClicked } = useChannelsPageActionsApi();
  const submitRef: React.MutableRefObject<HTMLButtonElement> = useRef(null);

  const setCatalogInChannelData = useCallback(
    catalogId => {
      if (catalogId !== channelData.catalogId) {
        setChannelData(existingChannelData => ({
          ...existingChannelData,
          catalogId
        }));
      }
    },
    [channelData]
  );
  const switchTab = (value): void => {
    const newUrl = updateUrlQueryParam(router.asPath, TAB, value);
    setSelectedTab(value);
    window.history.replaceState({ ...window.history.state }, '', newUrl);
    // Re-fetches the data only if the channel tab is selected
    if (value === 0) {
      channelDataRefetch();
    }
  };
  const updateTab = (value, _option): void => {
    if (isPageEdited) {
      setShowTabSwitchModal(true);
      setNextSelectedTab(value);
    } else {
      switchTab(value);
    }
  };

  // Delete channel mutation call
  const [deleteChannelMutationCall] = useMutation(deleteChannelMutation);

  // GET channel query call
  const {
    loading: loadingChannel,
    refetch: channelDataRefetch,
    networkStatus,
    error: getChannelError
  } = useQuery(getChannelQuery, {
    variables: { channelId },
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first',
    notifyOnNetworkStatusChange: true,
    onCompleted: getChannelData => {
      const { getChannelInformation } = getChannelData;
      setChannelData({
        ...getChannelInformation,
        status: getChannelInformation.status
      });
    }
  });

  const {
    loading: loadingCatalog,
    data: catalogData,
    error: getCatalogError
  } = useQuery(getCatalogQuery, {
    skip: !channelData?.catalogId,
    variables: { catalogId: channelData?.catalogId }
  });

  const isVideoPresent = !!catalogData?.getCatalog?.sections.find(channelCatalog => channelCatalog?.videos?.length > 0);

  const hiddenChannelBanner = useMemo(
    () => (
      <div css={{ paddingBottom: '1.5rem' }}>
        <PageAlert
          testID="channel-hidden-banner"
          appearance="info"
          content={translate('channel_hidden_banner_text', {
            channelName: channelData?.title
          })}
          dismissible={false}
        />
      </div>
    ),
    [channelData?.title, translate]
  );

  const channelPageTabs = (): JSX.Element => (
    <div css={channelInformationContainer}>
      <div css={headerTab}>
        {isChannelActive(channelData) && !isVideoPresent && hiddenChannelBanner}
        {selectedTab === 0 && channelData && (
          <ChannelInformation
            channelData={channelData}
            channelId={channelId}
            networkStatus={networkStatus}
            isPageEdited={isPageEdited}
            setIsPageEdited={setIsPageEdited}
            submitRef={submitRef}
          />
        )}
        {/* {selectedTab === 1 && <EventsCatalogContainer />} */}
        {selectedTab === 1 && channelData && (
          <ChannelCatalogContainer
            channelData={channelData}
            containerRef={ref}
            setCatalogInChannelData={setCatalogInChannelData}
            setIsPageEdited={setIsPageEdited}
            submitRef={submitRef}
          />
        )}
      </div>
      {deleteModal && <DeleteChannel deleteChannel={deleteChannel} setIsModalOpen={setDeleteModal} />}
      <NavigationConfirmationModal
        isOpen={showNavigationConfirmationModal}
        setIsOpen={setShowNavigationConfirmationModal}
        bodyText={translate('page-navigation-confirmation-body')}
        preventLeave={isPageEdited}
        testID="channel-page"
      />
      {/*  Tab switch navigation confirmation pop up */}
      <ConfirmationModal
        header={translate('tab-navigation-confirmation-header')}
        content={translate('tab-navigation-confirmation-body')}
        cancelText={translate('Navigation-Confirmation-Modal-Leave-Button-Text')}
        confirmationText={translate('Navigation-Confirmation-Modal-Stay-Button-Text')}
        confirmationAction={() => setShowTabSwitchModal(false)}
        cancelAction={() => {
          setIsPageEdited(false);
          switchTab(nextSelectedTab);
        }}
        setIsModalOpen={setShowTabSwitchModal}
        isModalOpen={showTabSwitchModal}
        defaultConfirmationAction
      />
    </div>
  );

  const headerActions: ActionType[] = [
    {
      value: translate('delete_button'),
      onClick: (): void => {
        setDeleteModal(true);
        deleteChannelButtonClicked({
          triggerLocation: 'Channel Information Page'
        });
      },
      appearance: 'lined'
    },
    {
      value: translate('channels_save_button_label'),
      onClick: (): void => {
        submitRef?.current?.click();
      },
      appearance: 'filled',
      disabled: !isPageEdited
    }
  ];

  const headerBreadCrumbs = (
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
      <BreadCrumb url={CHANNELS_URL.replace(VIDEO_HUB_PATH_PARAM_KEY, videoHubId)}>{translate('channels')}</BreadCrumb>
      <Crumb>{channelData?.title}</Crumb>
    </Breadcrumbs>
  );

  const tabs = (
    <Tabs
      options={[
        { label: translate('channel_information_tab_header'), value: 0, testID: 'channel_information_tab_header' },
        // { label: translate('channel_events_tab_header'), value: 1, testID: 'channel_events_tab_header' },
        { label: translate('channel_video_tab_header'), value: 1, testID: 'channel_video_tab_header' }
      ]}
      selected={selectedTab}
      onUpdate={updateTab}
      removeBottomBorder
    />
  );

  const deleteChannel = async (): Promise<void> => {
    setDeleteModal(false);
    setDeletingChannel(true);
    const { data: deleteChannelData } = await deleteChannelMutationCall({
      variables: { channelId },
      onError: apolloError => {
        logApolloError(apolloError, LOG);
      }
    });
    deleteChannelButtonClicked({
      triggerLocation: 'Delete Channel Modal'
    });
    const redirectUrl = CHANNELS_URL.replace(VIDEO_HUB_PATH_PARAM_KEY, videoHubId);
    await redirectClientSide(router, redirectUrl, { isSuccess: !!deleteChannelData });
  };

  const channelHeader: JSX.Element = (
    <div css={{ position: 'relative', zIndex: CHANNEL_PAGE_HEADER_Z_INDEX }}>
      <Header
        title={channelData?.title}
        actions={headerActions}
        breadCrumbs={headerBreadCrumbs}
        tabs={tabs}
        statusLabel={<StatusText isActive={isChannelActive(channelData)} />}
      />
    </div>
  );

  const headerTabSection = (): JSX.Element => (
    <ScrollViewWithBars forwardScrollViewRef={ref} header={channelHeader}>
      {channelPageTabs()}
    </ScrollViewWithBars>
  );

  return (
    <LoadingWrapper
      loading={(loadingChannel || deletingChannel || loadingCatalog) && networkStatus !== NetworkStatus.refetch}
      renderer={headerTabSection}
      errors={[getChannelError, getCatalogError]}
    />
  );
}

interface Props {
  videoHubId: string;
  channelId: string;
  hubTitle: string;
}
export default Channel;

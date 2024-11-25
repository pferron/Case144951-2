import { useQuery } from '@apollo/client';
import Header from '@components/Header';
import BannerTemplates from '@components/banners/BannerTemplates';
import LoadingWrapper from '@components/common/loading/LoadingWrapper';
import { BannerStyles } from '@components/videoCenters/style';
import { Breadcrumbs, Breadcrumb as Crumb } from '@cvent/carina/components/Breadcrumbs';
import EmptyBoxes from '@cvent/carina/components/Illustrations/EmptyBoxes';
import Modal from '@cvent/carina/components/Modal';
import ScrollViewWithBars from '@cvent/carina/components/ScrollViewWithBars/ScrollViewWithBars';
import Tabs from '@cvent/carina/components/Tabs/Tabs';
import { IllustrationContent } from '@cvent/carina/components/Templates/IllustrationContent';
import { IllustrationHeader } from '@cvent/carina/components/Templates/IllustrationHeader';
import { IllustrationNotice } from '@cvent/carina/components/Templates/IllustrationNotice';
import { TemplateActions as Actions } from '@cvent/carina/components/Templates/TemplateActions';
import { ActionType } from '@cvent/carina/components/Templates/utils/helpers';
import { injectTestId } from '@cvent/nucleus-test-automation';
import useBreakpoints from '@hooks/useBreakpoints';
import { useStyle } from '@hooks/useStyle';
import {
  BANNERS_URL,
  VIDEO_HUBS_URL,
  VIDEO_HUB_INFORMATION_URL,
  VIDEO_HUB_PATH_PARAM_KEY,
  HUB_OVERVIEW_URL
} from '@utils/constants';
import { GET_BANNERS_ASSOCIATIONS, GET_BANNERS } from '@cvent/planner-event-hubs-model/operations/banner';
import { useTranslate } from 'nucleus-text';
import { useCallback, useMemo, useState } from 'react';
import { useBannersPageActionsApi } from '@metrics/client/react/useBannersPageActionsApi';
import { useAppFeatures } from '@components/AppFeaturesProvider';
import BannerPlacementLists from './BannerPlacementLists';
import ViewBanners from './listing/ViewBanners';

interface VideoCenterBannersProps {
  videoCenterId: string;
  videoCenterTitle: string;
}

function VideoCenterBanners({ videoCenterId, videoCenterTitle }: VideoCenterBannersProps): JSX.Element {
  const BANNERS_TAB = 1;
  const PAGES_TAB = 2;
  const [selectedTab, setSelectedTab] = useState<string | number>(BANNERS_TAB);
  const { isS } = useBreakpoints();
  const { translate } = useTranslate();
  const { container, modalContent, emptyContainer, emptyHeader, emptyContent } = useStyle(BannerStyles);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState<boolean>(false);
  const { hubOverviewFeature } = useAppFeatures();

  const {
    data,
    loading: getBannersLoading,
    error: getBannersError,
    refetch: refetchBanners
  } = useQuery(GET_BANNERS, {
    fetchPolicy: 'cache-and-network',
    variables: {
      bannerFilter: {
        centerId: videoCenterId,
        filterInput: {}
      }
    }
  });
  const bannerListData = data?.banners;
  const currentBannerNames = bannerListData?.data.map(banner => banner.name);
  const { createBannerButtonClicked } = useBannersPageActionsApi();
  const {
    loading: bannersAssociationLoading,
    refetch: refetchPages,
    error: getBannerAssociationError
  } = useQuery(GET_BANNERS_ASSOCIATIONS, {
    variables: {
      bannerAssociationSearch: {
        centerId: videoCenterId
      }
    }
  });

  const switchTab = (value): void => {
    setSelectedTab(value);
    if (value === 1) {
      refetchBanners();
    } else {
      refetchPages();
    }
  };
  const onSelectTab = (value: string | number): void => {
    setSelectedTab(value);
    switchTab(value);
  };

  const tabsLayout =
    bannerListData?.data.length > 0 ? (
      <div {...injectTestId('banners-and-pages')}>
        <Tabs
          onUpdate={value => onSelectTab(value)}
          options={[
            {
              label: translate('Banners-Tab-Label'),
              value: BANNERS_TAB
            },
            {
              label: translate('Banners-Pages-Tab-Label'),
              value: PAGES_TAB
            }
          ]}
          testID="TabPanels"
          selected={selectedTab}
        />
      </div>
    ) : null;

  const headerActions: ActionType[] = useMemo(
    () => [
      {
        value: translate('banner_create_text'),
        onClick: (): void => {
          setIsTemplateModalOpen(true);
          createBannerButtonClicked({});
        },
        label: translate('banner_create_text')
      }
    ],
    [translate, createBannerButtonClicked]
  );

  const headerBreadCrumbs: JSX.Element = (
    <Breadcrumbs>
      <Crumb href={VIDEO_HUBS_URL}>{translate('video_hubs_header_title')}</Crumb>
      <Crumb
        href={
          hubOverviewFeature
            ? HUB_OVERVIEW_URL.replace(VIDEO_HUB_PATH_PARAM_KEY, videoCenterId)
            : VIDEO_HUB_INFORMATION_URL.replace(VIDEO_HUB_PATH_PARAM_KEY, videoCenterId)
        }
      >
        {videoCenterTitle}
      </Crumb>
      <Crumb href={BANNERS_URL.replace(VIDEO_HUB_PATH_PARAM_KEY, videoCenterId)}>
        {translate('media_center_banners_page_title')}
      </Crumb>
    </Breadcrumbs>
  );

  const emptyPage: JSX.Element = useMemo(
    () => (
      <IllustrationNotice
        css={emptyContainer}
        testID="empty-channel-page-container"
        illustration={EmptyBoxes}
        aria-label={translate('Banner-Image-No-Banner-Illustration-Accessibility-Label')}
        title={translate('Banner-Image-No-Banner-Illustration-Title')}
      >
        <IllustrationHeader css={emptyHeader}>{translate('empty_page_banner_message_header')}</IllustrationHeader>
        <IllustrationContent css={emptyContent}>{translate('empty_page_banner_message_content')}</IllustrationContent>
        <Actions actions={headerActions} position="center" />
      </IllustrationNotice>
    ),
    [emptyContainer, emptyHeader, emptyContent, headerActions, translate]
  );

  const bannersListBody = useCallback(() => {
    if (selectedTab === BANNERS_TAB) {
      return (
        <div css={container} {...injectTestId('banner-list')}>
          {bannerListData?.data.length > 0 ? <ViewBanners bannersList={bannerListData?.data} /> : emptyPage}
        </div>
      );
    }
    return (
      <div css={container} {...injectTestId('banner-page-list')}>
        <BannerPlacementLists />
      </div>
    );
  }, [container, bannerListData?.data, emptyPage, selectedTab]);

  const videoCenterBannerHeader: JSX.Element = (
    <Header
      title={translate('media_center_banners_page_title')}
      actions={headerActions}
      breadCrumbs={headerBreadCrumbs}
      tabs={tabsLayout}
    />
  );
  return (
    <div>
      <ScrollViewWithBars header={videoCenterBannerHeader}>
        <LoadingWrapper
          loading={getBannersLoading || bannersAssociationLoading}
          renderer={bannersListBody}
          errors={[getBannersError, getBannerAssociationError]}
        />
      </ScrollViewWithBars>

      <Modal
        format={isS ? 'fullscreen' : 'l'}
        css={modalContent}
        isOpen={isTemplateModalOpen}
        testID="banners-template-selection"
        aria-label={translate('Banner-Create-Banner-Template-Modal-Accessibility-Label')}
      >
        <BannerTemplates onDismiss={() => setIsTemplateModalOpen(false)} currentNames={currentBannerNames} />
      </Modal>
    </div>
  );
}

export default VideoCenterBanners;

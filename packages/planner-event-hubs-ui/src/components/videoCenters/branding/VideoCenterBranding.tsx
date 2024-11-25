import { useMutation, useQuery } from '@apollo/client';
import Header from '@components/Header';
import CardContainer from '@components/common/CardContainer';
import { NewImage } from '@components/common/imageUpload/types';
import { InformationStyles } from '@components/videoCenters/style';
import { PageAlert } from '@cvent/carina/components/Alert';
import { Breadcrumbs } from '@cvent/carina/components/Breadcrumbs';
import LoadingWrapper from '@components/common/loading/LoadingWrapper';
import { LoggerFactory } from '@cvent/logging/LoggerFactory';
import { injectTestId } from '@cvent/nucleus-test-automation';
import {
  HubUpdate,
  NavigationAlignment,
  NavigationLinkHighlightStyle,
  ShortUrlPage,
  Theme
} from '@cvent/planner-event-hubs-model/types';
import { useUserPermissions } from '@hooks/UserPermissionsProvider';
import { useStyle } from '@hooks/useStyle';
import {
  HUB_OVERVIEW_URL,
  UPCOMING_EVENTS,
  VIDEO_HUB_INFORMATION_URL,
  VIDEO_HUB_PATH_PARAM_KEY,
  VIDEO_HUB_THEMING_URL,
  VIDEO_HUBS_URL,
  TAB
} from '@utils/constants';
import {
  getAccountAndCustomFontInformation,
  getHubCustomizationsQuery,
  GET_VIDEO_HUB,
  UPDATE_VIDEO_HUB
} from '@cvent/planner-event-hubs-model/operations/hub';
import { isEmpty, isEqual, omit } from 'lodash';
import { useTranslate } from 'nucleus-text';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAppFeatures } from '@components/AppFeaturesProvider';
import { BrandingImages } from '@components/videoCenters/branding/BrandingImages';
import { useBrandingPageActionsApi } from '@metrics/client/react/useBrandingPageActionsApi';
import NavigationConfirmationModal from '@components/common/NavigationConfirmationModal';
import { BreadCrumb } from '@components/common/BreadCrumb';
import { DEFAULT_FONT_ID } from '@components/videoCenters/branding/constants';
import ScrollViewWithBars from '@cvent/carina/components/ScrollViewWithBars/ScrollViewWithBars';
import Tabs from '@cvent/carina/components/Tabs/Tabs';
import BrandingNavigation from '@components/videoCenters/branding/BrandingNavigation';
import BrandingCustomHeader from '@components/videoCenters/branding/BrandingCustomHeader';
import { Tooltip } from '@cvent/carina/components/Tooltip';
import Button from '@cvent/carina/components/Button';
import { BrandingAdvancedOptions, BrandingCustomNavigation } from '@utils/types';
import { updateUrlQueryParam } from '@utils/redirect';
import { useRouter } from 'next/router';
import useQueryParams from '@hooks/useQueryParam';
import ConfirmationModal from '@components/common/ConfirmationModal';
import { fetchAndCreateShortUrlByTag } from '@cvent/planner-event-hubs-model/src/operations/shortUrl';
import { useCenterInfo } from '@hooks/useCenterInfo';
import { getCenterFeatures } from '@cvent/planner-event-hubs-model/src/operations/hub';
import BrandingContentWrapper from './BrandingContentWrapper';
import { useVideoCenterBrandingStyles } from './styles';
import { getCustomFonts, getMoodText, isBackgroundColorOverridden } from './utils';

const LOG = LoggerFactory.create('VideoCenterBranding');

interface Props {
  centerId: string;
  centerTitle: string;
}

const omitFromQuery = newHubData => {
  const omitAttributes = ['status', '__typename', 'config.__typename', 'theme.__typename', 'calendar.__typename'];
  return omit(newHubData, omitAttributes);
};

function VideoCenterBranding({ centerId, centerTitle }: Props): JSX.Element {
  const { translate } = useTranslate();
  const { container, bodyContainer, alertContainer } = useStyle(InformationStyles);
  const { titleContainer } = useVideoCenterBrandingStyles();
  const userPermission = useUserPermissions();
  const { hubOverviewFeature } = useAppFeatures();
  const [themeState, setThemeState] = useState<Theme>({});
  const [showAlertSuccess, setShowAlertSuccess] = useState(false);
  const [showFailureAlert, setShowFailureAlert] = useState(false);
  const [newImage, setNewImage] = useState<NewImage>(null);
  const { brandingSaveButtonClicked } = useBrandingPageActionsApi();
  const ref = useRef<HTMLInputElement>(null);
  const [navigationDisabled, setNavigationDisabled] = useState<boolean>(false);
  const [customHeaderDisabled, setCustomHeaderDisabled] = useState<boolean>(false);
  const { tab } = useQueryParams();
  const router = useRouter();
  const [showNavigationConfirmationModal, setShowNavigationConfirmationModal] = useState<boolean>(false);
  const [showTabSwitchModal, setShowTabSwitchModal] = useState<boolean>(false);
  const [nextSelectedTab, setNextSelectedTab] = useState<number>(0);
  const [isPageEdited, setIsPageEdited] = useState<boolean>(false);
  const { calendarId } = useCenterInfo();

  const headerBreadCrumbs: JSX.Element = (
    <Breadcrumbs>
      <BreadCrumb url={VIDEO_HUBS_URL}>{translate('video_hubs_header_title')}</BreadCrumb>
      <BreadCrumb
        url={
          hubOverviewFeature
            ? HUB_OVERVIEW_URL.replace(VIDEO_HUB_PATH_PARAM_KEY, centerId)
            : VIDEO_HUB_INFORMATION_URL.replace(VIDEO_HUB_PATH_PARAM_KEY, centerId)
        }
      >
        {centerTitle}
      </BreadCrumb>
      <BreadCrumb url={VIDEO_HUB_THEMING_URL.replace(VIDEO_HUB_PATH_PARAM_KEY, centerId)}>
        {translate('video_hub_branding_page_title')}
      </BreadCrumb>
    </Breadcrumbs>
  );

  // Fetch theme
  const {
    data,
    loading: fetchingData,
    error
  } = useQuery(GET_VIDEO_HUB, {
    variables: { hubID: { id: centerId } },
    onError: apolloError => {
      LOG.error(apolloError.networkError);
      LOG.error(apolloError.graphQLErrors);
    }
  });

  const { data: customFontAndAccountInformation } = useQuery(getAccountAndCustomFontInformation, {
    onCompleted: fontAndAccountInformation => {
      setCustomHeaderDisabled(
        !fontAndAccountInformation?.accountConfig?.AccountFeatures?.GeneralFeatures?.AllowCodeSnippets || false
      );
    }
  });

  const customFonts = useMemo(() => getCustomFonts(customFontAndAccountInformation), [customFontAndAccountInformation]);

  const getSelectedTab = useCallback(
    (loadedTab): number => {
      if (loadedTab === '1') {
        return 1;
      }
      if (loadedTab === '2' && userPermission?.EventsPlusCustomHeader) {
        return 2;
      }
      return 0;
    },
    [userPermission?.EventsPlusCustomHeader]
  );
  const [selectedTab, setSelectedTab] = useState<number | string>(getSelectedTab(tab));
  const initialHub = data?.hub;
  const initialTheme = useMemo(() => {
    const theme = { ...data?.hub?.theme } || {};
    const activeHeadingFont =
      customFonts?.find(customFont => customFont.id === theme?.headingsFont)?.id || DEFAULT_FONT_ID;
    const activeBodyFont = customFonts?.find(customFont => customFont.id === theme?.bodyFont)?.id || DEFAULT_FONT_ID;
    theme.headingsFont = activeHeadingFont;
    theme.bodyFont = activeBodyFont;
    return theme;
  }, [customFonts, data?.hub?.theme]);

  useMemo(() => {
    setThemeState(initialTheme);
  }, [initialTheme]);

  const onSubmitColors = () => {
    if (initialTheme !== themeState) {
      onSaveTheme();
    }
  };

  // Save theme
  const [saveTheme, { loading: updatingData }] = useMutation(UPDATE_VIDEO_HUB);
  const onSaveTheme = useCallback((): void => {
    const newTheme = initialTheme !== themeState ? themeState : initialTheme;
    newTheme.headingsFont = newTheme.headingsFont === DEFAULT_FONT_ID ? null : newTheme.headingsFont;
    newTheme.bodyFont = newTheme.bodyFont === DEFAULT_FONT_ID ? null : newTheme.bodyFont;
    let newHubData: HubUpdate = {
      ...initialHub,
      theme: newTheme
    };
    if (newImage) {
      newHubData = {
        ...initialHub,
        theme: {
          ...newTheme,
          newLogoImageUrl: newImage.croppedUrl || newImage.url,
          newLogoOriginalImageUrl: newImage.url
        }
      };
    }
    const hubToSave = omitFromQuery(newHubData);
    saveTheme({
      variables: { input: hubToSave },
      refetchQueries: [GET_VIDEO_HUB],
      optimisticResponse: { hubUpdate: newHubData },
      onCompleted: () => {
        setNewImage(null);
        setShowAlertSuccess(true);
      },
      onError: apolloError => {
        LOG.error(`Error while updating hub branding data for hub [${centerId}] with error : `, apolloError);
        setShowFailureAlert(true);
      },
      update(cache) {
        cache.writeQuery({
          query: GET_VIDEO_HUB,
          variables: { hubID: { id: centerId } },
          data: { hub: newHubData }
        });
      }
    });

    const isBgOverridden = isBackgroundColorOverridden({
      bgColor: newTheme?.backgroundColor,
      primaryColor: newTheme?.mainColor,
      safeMode: newTheme?.safeMode,
      moodTheme: getMoodText(newTheme?.moodColor)
    });

    if (initialTheme !== themeState) {
      brandingSaveButtonClicked({
        primaryColor: newTheme?.mainColor,
        secondaryColor: newTheme?.actionColor,
        selectYourMood: getMoodText(newTheme?.moodColor),
        safeColorMode: newTheme?.safeMode,
        backgroundColor: newTheme?.backgroundColor,
        overrideBackgroundColor: isBgOverridden
      });
    }
  }, [initialHub, initialTheme, themeState, saveTheme, centerId, newImage, brandingSaveButtonClicked]);

  const { data: hubCustomizationData, loading: loadingHubCustomizationData } = useQuery(getHubCustomizationsQuery, {
    variables: {
      id: {
        id: centerId
      }
    },
    onCompleted: customizationData => {
      setNavigationDisabled(!customizationData?.getHubCustomizations?.showNavigation);
    }
  });

  const { data: centerFeatures, loading: fetchingCenterFeatures } = useQuery(getCenterFeatures, {
    variables: {
      id: {
        id: centerId
      }
    }
  });

  const { data: shortUrlData, loading: fetchingShortUrls } = useQuery(fetchAndCreateShortUrlByTag, {
    variables: { videoCenterId: centerId }
  });

  const shortUrlMap = useMemo(() => {
    const resMap = new Map<string, string>();
    shortUrlData?.fetchAndCreateShortUrlByTag?.forEach(shortUrlResponse => {
      resMap.set(shortUrlResponse.pageName, shortUrlResponse.shortUrl);
    });
    return resMap;
  }, [shortUrlData]);

  const switchTab = useCallback(
    (value): void => {
      const newUrl = updateUrlQueryParam(router.asPath, TAB, value);
      setSelectedTab(value);
      window.history.replaceState({ ...window.history.state }, '', newUrl);
    },
    [router.asPath]
  );

  const updateTab = (value, _option): void => {
    if (isPageEdited) {
      setShowTabSwitchModal(true);
      setNextSelectedTab(value);
    } else {
      switchTab(value);
    }
  };

  const isThemeUpdated = useMemo(() => {
    const updated = !isEqual(initialTheme, themeState);
    setIsPageEdited(updated);
    return updated;
  }, [initialTheme, themeState]);

  useEffect(() => {
    if ((selectedTab === 1 && navigationDisabled) || (selectedTab === 2 && customHeaderDisabled)) {
      switchTab(0);
    }
  }, [customHeaderDisabled, navigationDisabled, selectedTab, switchTab]);

  function renderDisabledTabWithTooltip({ optionContent, ...props }) {
    return (
      <Tooltip
        text={
          optionContent.value === 1
            ? translate('custom_navigation_tab_disabled_tooltip')
            : translate('custom_header_tab_disabled_tooltip')
        }
        arrowLabel={
          optionContent.value === 1
            ? translate('custom_navigation_tab_disabled_tooltip_arrow_label')
            : translate('custom_header_tab_disabled_tooltip_arrow_label')
        }
        portal
        trigger={
          <div>
            <Button appearance="ghost" {...props} disabled={optionContent.disabled} text={optionContent.label} />
          </div>
        }
      />
    );
  }

  const tabOptions = [
    { label: translate('events_plus_theme_tab_label'), value: 0, testID: 'branding_theme_tab' },
    {
      label: translate('events_plus_branding_navigation_tab_label'),
      value: 1,
      testID: 'branding_navigation_tab',
      renderLink: navigationDisabled ? renderDisabledTabWithTooltip : null,
      disabled: navigationDisabled
    }
  ];

  const tabs = (
    <Tabs
      options={
        userPermission?.EventsPlusCustomHeader
          ? tabOptions.concat({
              label: translate('events_plus_custom_header_tab_label'),
              value: 2,
              testID: 'branding_custom_header_tab',
              renderLink: customHeaderDisabled ? renderDisabledTabWithTooltip : null,
              disabled: customHeaderDisabled
            })
          : tabOptions
      }
      selected={selectedTab}
      onUpdate={updateTab}
      removeBottomBorder
    />
  );

  const brandingThemeContainer = (
    <div css={bodyContainer} {...injectTestId('theming-container')}>
      {showAlertSuccess && (
        <div css={alertContainer}>
          <PageAlert
            appearance="success"
            id="1"
            content={translate('video_hub_alert_update_success')}
            dismissible
            onDismiss={() => setShowAlertSuccess(false)}
            isRtl={false}
            testID="video-hub-alert-form-error"
          />
        </div>
      )}
      {showFailureAlert && (
        <div css={alertContainer}>
          <PageAlert
            appearance="danger"
            id="2"
            content={translate('video_hub_branding_save_error')}
            dismissible
            onDismiss={() => setShowFailureAlert(false)}
            isRtl={false}
            testID="video-hub-alert-form-error"
          />
        </div>
      )}
      {!(fetchingData || updatingData) && !isEmpty(themeState) && (
        <>
          <CardContainer testID="theming-images">
            <BrandingImages
              hubId={initialHub.id}
              favicon={initialTheme?.faviconUrl}
              logoOriginalUrl={initialTheme?.logoOriginalImageUrl}
              logoImageUrl={initialTheme?.logoImageUrl}
              logoAltText={themeState?.logoAltText}
              themeState={themeState}
              setThemeState={setThemeState}
              setIsPageEdited={setIsPageEdited}
              onSuccess={async () => setShowAlertSuccess(true)}
              onFailure={async () => setShowFailureAlert(true)}
            />
          </CardContainer>
          <BrandingContentWrapper
            themeState={themeState}
            setThemeState={setThemeState}
            onSaveTheme={onSubmitColors}
            isThemeUpdated={isThemeUpdated}
            customFonts={customFonts}
          />
        </>
      )}
    </div>
  );

  const brandingHeader: JSX.Element = (
    <div css={titleContainer}>
      <Header title={translate('video_hub_branding_page_title')} breadCrumbs={headerBreadCrumbs} tabs={tabs} />
    </div>
  );

  const features = useMemo(() => {
    const featureMap = new Map();
    centerFeatures?.getCenterFeatures?.map(i => featureMap.set(i.code, i.enabled));
    return featureMap;
  }, [centerFeatures?.getCenterFeatures]);

  const customNavigationData = useMemo(() => {
    const customizations: BrandingCustomNavigation = {
      logo: {
        isEnabled: hubCustomizationData?.getHubCustomizations?.showLogo
      },
      loginRegistration: {
        url: shortUrlMap.get(ShortUrlPage.Registration) || '',
        isEnabled: hubCustomizationData?.getHubCustomizations?.showLogin
      },
      homePage: {
        url: shortUrlMap.get(ShortUrlPage.Home) || '',
        isEnabled: hubCustomizationData?.getHubCustomizations?.showHomePage
      },
      channels: {
        isEnabled: hubCustomizationData?.getHubCustomizations?.showChannels,
        url: shortUrlMap.get(ShortUrlPage.Channels) || ''
      },
      videos: {
        url: shortUrlMap.get(ShortUrlPage.Videos) || '',
        isEnabled: hubCustomizationData?.getHubCustomizations?.showVideos
      },
      defaultLandingPage: hubCustomizationData?.getHubCustomizations?.defaultLandingPage
    };

    if (features.get(UPCOMING_EVENTS) && calendarId) {
      customizations.upcomingEvents = {
        url: shortUrlMap.get(ShortUrlPage.Upcomingevents) || '',
        isEnabled: hubCustomizationData?.getHubCustomizations?.showUpcomingEvents
      };
    }
    return customizations;
  }, [
    calendarId,
    features,
    hubCustomizationData?.getHubCustomizations?.showChannels,
    hubCustomizationData?.getHubCustomizations?.showHomePage,
    hubCustomizationData?.getHubCustomizations?.showLogin,
    hubCustomizationData?.getHubCustomizations?.showLogo,
    hubCustomizationData?.getHubCustomizations?.showUpcomingEvents,
    hubCustomizationData?.getHubCustomizations?.showVideos,
    hubCustomizationData?.getHubCustomizations?.defaultLandingPage,
    shortUrlMap
  ]);

  const brandingAdvancedOptionsData = useMemo(() => {
    const advancedOptions: BrandingAdvancedOptions = {
      navigationAlignment:
        hubCustomizationData?.getHubCustomizations?.navigationAlignment || NavigationAlignment.Center,
      navigationLinkHighlightStyle:
        hubCustomizationData?.getHubCustomizations?.navigationLinkHighlightStyle || NavigationLinkHighlightStyle.Filled,
      navigationLinkTextSize: String(hubCustomizationData?.getHubCustomizations?.navigationLinkTextSize || 12),
      navigationHeaderLeftPadding: String(hubCustomizationData?.getHubCustomizations.navigationHeaderLeftPadding ?? 16),
      navigationHeaderRightPadding: String(
        hubCustomizationData?.getHubCustomizations.navigationHeaderRightPadding ?? 16
      ),
      navigationHeaderMaxWidth: String(hubCustomizationData?.getHubCustomizations?.navigationHeaderMaxWidth || '')
    };
    return advancedOptions;
  }, [
    hubCustomizationData?.getHubCustomizations?.navigationAlignment,
    hubCustomizationData?.getHubCustomizations?.navigationHeaderLeftPadding,
    hubCustomizationData?.getHubCustomizations?.navigationHeaderMaxWidth,
    hubCustomizationData?.getHubCustomizations?.navigationHeaderRightPadding,
    hubCustomizationData?.getHubCustomizations?.navigationLinkHighlightStyle,
    hubCustomizationData?.getHubCustomizations?.navigationLinkTextSize
  ]);

  const brandingRendererWithTabs = (): JSX.Element => (
    <ScrollViewWithBars forwardScrollViewRef={ref} header={brandingHeader}>
      <div css={container}>
        {selectedTab === 0 && brandingThemeContainer}
        {selectedTab === 1 && !navigationDisabled && (
          <BrandingNavigation
            hubId={centerId}
            customNavigation={customNavigationData}
            advancedOptions={brandingAdvancedOptionsData}
            setIsPageEdited={setIsPageEdited}
          />
        )}
        {selectedTab === 2 && !customHeaderDisabled && (
          <BrandingCustomHeader
            hubId={centerId}
            hubCustomizationData={hubCustomizationData?.getHubCustomizations}
            customNavigation={customNavigationData}
            advancedOptions={brandingAdvancedOptionsData}
            setNavigationDisabled={setNavigationDisabled}
            setIsPageEdited={setIsPageEdited}
          />
        )}
        <NavigationConfirmationModal
          isOpen={showNavigationConfirmationModal}
          setIsOpen={setShowNavigationConfirmationModal}
          bodyText={translate('page-navigation-confirmation-body')}
          preventLeave={isPageEdited}
          testID="events-plus-branding-page"
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
            setThemeState(initialTheme);
          }}
          setIsModalOpen={setShowTabSwitchModal}
          isModalOpen={showTabSwitchModal}
          defaultConfirmationAction
        />
      </div>
    </ScrollViewWithBars>
  );

  return (
    <LoadingWrapper
      loading={
        fetchingData || updatingData || loadingHubCustomizationData || fetchingShortUrls || fetchingCenterFeatures
      }
      renderer={brandingRendererWithTabs}
      errors={[error]}
    />
  );
}

export default VideoCenterBranding;

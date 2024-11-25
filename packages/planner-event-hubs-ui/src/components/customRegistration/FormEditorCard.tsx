import React, { type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslate } from 'nucleus-text';
import { useStyle } from '@hooks/useStyle';
import { CustomRegistrationCardContainerStyle, FormEditorCardStyle } from '@components/customRegistration/style';
import ScrollViewWithBars from '@cvent/carina/components/ScrollViewWithBars/ScrollViewWithBars';
import StaticTableFormFields from '@components/customRegistration/StaticTableFormFields';
import AddFieldMenu from '@components/customRegistration/AddFieldMenu';
import { injectTestId } from '@cvent/nucleus-test-automation';
import { useMutation, useQuery } from '@apollo/client';
import { LoggerFactory } from '@cvent/auth-client';
import {
  getAccountAndCustomFontInformation,
  getHubCodeSnippets,
  getRegistrationFormSettings,
  GET_HUB_SETTINGS,
  UPDATE_BACKGROUND_IMAGES,
  UPDATE_HUB_SETTINGS,
  UPDATE_REGISTRATION_FORM_SETTINGS,
  UPDATE_VIDEO_HUB
} from '@cvent/planner-event-hubs-model/operations/hub';
import { getAccountCodeSnippets } from '@cvent/planner-event-hubs-model/operations/snapshot';
import removeTypename from '@utils/removeTypename';
import LoadingWrapper from '@components/common/loading/LoadingWrapper';
import { DEFAULT_REGISTRATION_FORM_ORDER } from '@components/customRegistration/FormCustomisationConstants';
import BackgroundAppearanceCard from '@components/customRegistration/BackgroundAppearanceCard';
import { AccountCodeSnippet, Hub, LoginType, Settings } from '@cvent/planner-event-hubs-model/types';
import { useAppFeatures } from '@components/AppFeaturesProvider';
import { NewImage } from '@components/common/imageUpload/types';
import { TargetWebPages } from '@components/tracking-codes/TrackingCodes';
import { useCenterInfo } from '@hooks/useCenterInfo';
import { convertFont, CustomFont } from '@utils/fontUtils';
import Header from '@components/Header';
import useQueryParams from '@hooks/useQueryParam';
import { useRouter } from 'next/router';
import { updateUrlQueryParam } from '@utils/redirect';
import {
  BAD_REQUEST_ERROR_MESSAGE,
  CUSTOM_REGISTRATION_URL,
  HUB_OVERVIEW_URL,
  TAB,
  VIDEO_HUB_INFORMATION_URL,
  VIDEO_HUB_PATH_PARAM_KEY,
  VIDEO_HUBS_URL
} from '@utils/constants';
import { ActionType } from '@cvent/carina/components/Templates/utils/helpers';

import { BreadCrumb } from '@components/common/BreadCrumb';
import { Breadcrumbs } from '@cvent/carina/components/Breadcrumbs';
import Tabs from '@cvent/carina/components/Tabs/Tabs';
import EditSsoLogin from '@components/customRegistration/EditSsoLogin';
import { isEqual, omit } from 'lodash';
import ConfirmationModal from '@components/common/ConfirmationModal';
import NavigationConfirmationModal from '@components/common/NavigationConfirmationModal';
import { PageAlert } from '@cvent/carina/components/Alert';
import { accountConfig as getAccountConfig } from '@cvent/planner-event-hubs-model/operations/coreSOA';
import ReorderableTableFormFields from './ReorderableTableFormFields';

const LOG = LoggerFactory.create('FormEditorCard');

function FormEditorCard({ hubId, hubTitle }: Props): React.JSX.Element {
  const { hubOverviewFeature, singleSignOnFeature } = useAppFeatures();
  const [updateProfileSettingsMutation, { loading: updatingProfileSettingsMutation }] =
    useMutation(UPDATE_HUB_SETTINGS);
  const [saveLoginMethod, { loading: updatingLoginMethodLoading }] = useMutation(UPDATE_VIDEO_HUB);
  const styles = useStyle(FormEditorCardStyle);
  const { translate } = useTranslate();
  const [selectedFields, setSelectedFields] = useState([] as FieldData[]);
  const originalSelectedFields = useRef(selectedFields);
  const { theme: centerTheme, config: centerConfigs, videoCenterData } = useCenterInfo();
  const [showTabSwitchModal, setShowTabSwitchModal] = useState<boolean>(false);
  const [isPageEdited, setIsPageEdited] = useState<boolean>(false);
  const [nextSelectedTab, setNextSelectedTab] = useState<number>(0);
  const [ssoOriginalSettings, setOriginalSsoSettings] = useState({
    loginMethod: centerConfigs?.loginType ?? LoginType.MagicLink,
    organisationId: centerConfigs?.organizationId ?? ''
  } as LoginMethodFields);
  const [ssoSettings, setSsoSettings] = useState(ssoOriginalSettings);
  const [errorAltText, setErrorAltText] = useState(false);
  const [showNavigationConfirmationModal, setShowNavigationConfirmationModal] = useState<boolean>(false);
  const [originalSettings, setOriginalSettings] = useState({
    showLogo: false,
    backgroundImage: {
      url: centerTheme?.backgroundOriginalImageUrl,
      croppedUrl: centerTheme?.backgroundImageUrl
    },
    newBackgroundImage: {
      url: centerTheme?.backgroundOriginalImageUrl,
      croppedUrl: centerTheme?.backgroundImageUrl
    },
    decorativeImage: true,
    backgroundImageAltText: centerTheme?.backgroundImageAltText || ''
  } as BackGroundPreviewData);
  const [showAlertSuccess, setShowAlertSuccess] = useState(false);
  const [showFailureAlert, setShowFailureAlert] = useState(false);
  const [failureAlertContent, setFailureAlertContent] = useState('');

  const originalAppearanceFields = useRef(originalSettings);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [privacySettings, setPrivacySettings] = useState<Settings>({
    termsLinkText: '',
    cventPrivacyPolicyLinkText: '',
    displayCventPrivacyPolicy: false,
    privacyPolicyLinkText: '',
    allowTurnOffCookies: false,
    allowTurnOffGoogleAnalytics: false,
    ccpaDoNotSellUrlEnabled: false,
    ccpaEnableDoNotSell: false,
    ccpaLinkText: ''
  });
  const [accountCodeSnippets, setAccountCodeSnippets] = useState([]);
  const [codeSnippets, setCodeSnippets] = useState([]);
  const [headingsFont, setHeadingsFont] = useState<CustomFont>({
    fallbackFont: null,
    name: null,
    styles: []
  });
  const [bodyFont, setBodyFont] = useState<CustomFont>({
    fallbackFont: null,
    name: null,
    styles: []
  });
  const { tab } = useQueryParams();
  const router = useRouter();
  const [error, setError] = useState(false);
  const [serverError, setServerError] = useState(false);
  const isOrganisationIdValid =
    ssoSettings.loginMethod === LoginType.Sso
      ? Boolean(ssoSettings.organisationId) && ssoSettings.organisationId.trim()
      : true;

  const isBackgroundImageAltTextValid =
    originalSettings?.decorativeImage === true ||
    (Boolean(originalSettings?.backgroundImageAltText) && originalSettings?.backgroundImageAltText?.trim().length > 0);
  const isSsoSettingsUpdated = !isEqual(ssoSettings, ssoOriginalSettings);
  const isRegistrationFormUpdated = !isEqual(originalSelectedFields.current, selectedFields);
  const isAppearanceSettingsUpdated = !isEqual(originalAppearanceFields.current, originalSettings);
  useEffect(() => {
    if (!isSsoSettingsUpdated) {
      setServerError(false);
    }
    if (isSsoSettingsUpdated || isRegistrationFormUpdated || isAppearanceSettingsUpdated) {
      setIsPageEdited(true);
    } else {
      setIsPageEdited(false);
    }
  }, [isSsoSettingsUpdated, isRegistrationFormUpdated, isAppearanceSettingsUpdated, setServerError]);

  const getSelectedTab = useCallback(
    (loadedTab): number => {
      if (singleSignOnFeature && loadedTab === '1') {
        return 1;
      }
      return 0;
    },
    [singleSignOnFeature]
  );
  const [selectedTab, setSelectedTab] = useState<number | string>(getSelectedTab(tab));

  const switchTab = useCallback(
    (value): void => {
      const newUrl = updateUrlQueryParam(router.asPath, TAB, value);
      setSelectedTab(value);
      window.history.replaceState({ ...window.history.state }, '', newUrl);
    },
    [router.asPath]
  );
  const updateTab = (value, _option): void => {
    if (isSsoSettingsUpdated || isRegistrationFormUpdated || isAppearanceSettingsUpdated) {
      setShowTabSwitchModal(true);
      setNextSelectedTab(value);
    } else {
      setShowFailureAlert(false);
      setShowAlertSuccess(false);
      setFailureAlertContent('');
      switchTab(value);
    }
  };

  const headerBreadCrumbs: JSX.Element = (
    <Breadcrumbs>
      <BreadCrumb url={VIDEO_HUBS_URL}>{translate('video_hubs_header_title')}</BreadCrumb>
      <BreadCrumb
        url={
          hubOverviewFeature
            ? HUB_OVERVIEW_URL.replace(VIDEO_HUB_PATH_PARAM_KEY, hubId)
            : VIDEO_HUB_INFORMATION_URL.replace(VIDEO_HUB_PATH_PARAM_KEY, hubId)
        }
      >
        {hubTitle}
      </BreadCrumb>
      <BreadCrumb url={CUSTOM_REGISTRATION_URL.replace(VIDEO_HUB_PATH_PARAM_KEY, hubId)}>
        {translate('custom_registration_side_nav_text')}
      </BreadCrumb>
    </Breadcrumbs>
  );

  const tabOptions = [
    { label: translate('custom_registration_heading_text'), value: 0, testID: 'custom_registration_tab' }
  ];

  const { loading: fetchingAccountConfigs, data: accountConfig } = useQuery(getAccountConfig);
  const allowOAuth = accountConfig?.accountConfig?.AccountFeatures?.GeneralFeatures?.AllowOAuth;

  useEffect(() => {
    if (selectedTab === 1 && !allowOAuth) {
      setSelectedTab(0);
    }
  }, [selectedTab, allowOAuth]);

  const tabs = (
    <Tabs
      options={
        singleSignOnFeature && allowOAuth
          ? tabOptions.concat({
              label: translate('sso_login_tab_text'),
              value: 1,
              testID: 'sso-login-tab'
            })
          : tabOptions
      }
      selected={selectedTab}
      onUpdate={updateTab}
      removeBottomBorder
    />
  );

  const onLoginMethodSave = useCallback(async (): Promise<void> => {
    setError(false);
    setServerError(false);
    const newHubData = {
      ...videoCenterData?.hub,
      config: {
        ...centerConfigs,
        loginType: ssoSettings.loginMethod,
        organizationId: ssoSettings.loginMethod === LoginType.Sso ? ssoSettings.organisationId : null
      }
    };

    const hubToSave = omitFromQuery(newHubData);

    await saveLoginMethod({
      variables: {
        input: hubToSave
      },
      onError: apolloError => {
        LOG.error(`Error while Login type for hub [${hubId}], error : `, apolloError);
        if (apolloError.message === BAD_REQUEST_ERROR_MESSAGE) {
          setServerError(true);
        } else {
          setShowFailureAlert(true);
          setFailureAlertContent(translate('custom_registration_network_error_text'));
        }
      },
      onCompleted: _data => {
        if (ssoSettings.loginMethod === LoginType.MagicLink) {
          setOriginalSsoSettings(prev => ({
            ...prev,
            loginMethod: LoginType.MagicLink,
            organisationId: ''
          }));
          setSsoSettings(prev => ({
            ...prev,
            loginMethod: LoginType.MagicLink,
            organisationId: ''
          }));
        } else {
          setOriginalSsoSettings(ssoSettings);
        }
        setShowAlertSuccess(true);
      }
    });
  }, [centerConfigs, hubId, ssoSettings, videoCenterData, saveLoginMethod, translate]);

  const { data: hubSettingsData, loading: fetchingHubSettings } = useQuery(GET_HUB_SETTINGS, {
    variables: {
      id: {
        id: hubId
      }
    },
    onCompleted: hubData => {
      setOriginalSettings(prevState => ({
        ...prevState,
        showLogo: hubData?.getHubSettings.showLogo,
        decorativeImage: hubData?.getHubSettings.decorativeImage
      }));
      setPrivacySettings(prevState => ({
        ...prevState,
        termsLinkText: hubData?.getHubSettings.termsLinkText,
        cventPrivacyPolicyLinkText: hubData?.getHubSettings.cventPrivacyPolicyLinkText,
        displayCventPrivacyPolicy: hubData?.getHubSettings.displayCventPrivacyPolicy,
        privacyPolicyLinkText: hubData?.getHubSettings.privacyPolicyLinkText,
        allowTurnOffCookies: hubData?.getHubSettings.allowTurnOffCookies,
        allowTurnOffGoogleAnalytics: hubData?.getHubSettings.allowTurnOffGoogleAnalytics,
        ccpaDoNotSellUrlEnabled: hubData?.getHubSettings?.ccpaDoNotSellUrlEnabled,
        ccpaEnableDoNotSell: hubData?.getHubSettings?.ccpaEnableDoNotSell,
        ccpaLinkText: hubData?.getHubSettings?.ccpaLinkText
      }));
      originalAppearanceFields.current = {
        ...originalAppearanceFields.current,
        showLogo: hubData?.getHubSettings.showLogo,
        decorativeImage: hubData?.getHubSettings.decorativeImage
      };
    },
    onError: apolloError => {
      LOG.error(apolloError, 'Failed to get hub settings', hubId);
    }
  });

  const { loading: fetchingData } = useQuery(getAccountCodeSnippets, {
    fetchPolicy: 'cache-and-network',
    onCompleted: data => {
      setAccountCodeSnippets(data?.getAccountCodeSnippets?.accountCodeSnippets);
    },
    onError: apolloError => {
      LOG.error(apolloError, 'Failed to account code snippets for hub ', hubId);
    }
  });

  const { loading: fetchingVideoCenterCodeSnippets } = useQuery(getHubCodeSnippets, {
    fetchPolicy: 'cache-and-network',
    skip: fetchingData,
    variables: {
      hubId
    },
    onCompleted: data => {
      const hubCodeSnippet = data?.getHubCodeSnippets;

      const accountCodeSnippetMap = new Map<string, AccountCodeSnippet>();
      accountCodeSnippets.forEach(accountSnippet =>
        accountCodeSnippetMap.set(accountSnippet.codeSnippetId, accountSnippet)
      );
      const hubAssociatedSnippets = hubCodeSnippet
        .filter(codeSnippet => accountCodeSnippets.some(element => codeSnippet.codeSnippetId === element.codeSnippetId))
        .map(codeSnippet => ({
          ...codeSnippet,
          applicableOn: codeSnippet.applicableOn,
          addToAllPages: codeSnippet.targetWebPages.includes(TargetWebPages.AllVcPages),
          addToLoginPage: codeSnippet.targetWebPages.includes(TargetWebPages.Login),
          addToSingleVideoPage: codeSnippet.targetWebPages.includes(TargetWebPages.SingleVideosPage),
          name: accountCodeSnippetMap.get(codeSnippet.codeSnippetId).codeSnippetName,
          dataTagCode: accountCodeSnippetMap.get(codeSnippet.codeSnippetId).codeSnippetDataTagCode,
          status: accountCodeSnippetMap.get(codeSnippet.codeSnippetId).codeSnippetStatus,
          disableCodeSnippets: accountCodeSnippetMap.get(codeSnippet.codeSnippetId).isDropCodeSnippetToCookieBannerTied
        }));
      setCodeSnippets(hubAssociatedSnippets);
    },
    onError: apolloError => {
      LOG.error(apolloError, `Failed to get code snippets associated with hub ${hubId}`);
    }
  });

  const { loading: fetchingRegistrationFormSettings } = useQuery(getRegistrationFormSettings, {
    variables: {
      input: {
        hubId
      }
    },
    onError: apolloError => {
      LOG.error(apolloError, `Failed to get registration form settings for hub ${hubId}`);
    },
    onCompleted: data => {
      let formFieldSettings = data?.getRegistrationFormSettings?.data || [];
      formFieldSettings = removeTypename(formFieldSettings);
      formFieldSettings = formFieldSettings.sort((a, b) => a.order - b.order);
      formFieldSettings = formFieldSettings.filter(i => i.included !== false);
      setSelectedFields(formFieldSettings);
      originalSelectedFields.current = formFieldSettings;
    }
  });

  const { data: customFontInformation, loading: customFontsLoading } = useQuery(getAccountAndCustomFontInformation, {
    onCompleted: () => {
      const activeFonts =
        (customFontInformation?.accountConfig?.AccountFeatures?.GeneralFeatures?.AllowCustomFonts &&
          customFontInformation?.getAccountSnapshot?.customFonts?.filter(customFont => customFont.isActive)) ||
        [];
      const activeHeadingFont = activeFonts.find(customFont => customFont.id === centerTheme?.headingsFont);
      const activeBodyFont = activeFonts.find(customFont => customFont.id === centerTheme?.bodyFont);
      setBodyFont(convertFont(activeBodyFont));
      setHeadingsFont(convertFont(activeHeadingFont));
    }
  });

  const isAllowTurnOffCodeSnippets = useMemo(
    () => codeSnippets.filter(snippet => snippet.disableCodeSnippets).length > 0,
    [codeSnippets]
  );

  const [updateRegistrationFormMutation, { loading: updatingRegistrationFormFields }] = useMutation(
    UPDATE_REGISTRATION_FORM_SETTINGS
  );

  const [updateBackgroundImagesMutation, { loading: updatingBackgroundImage }] = useMutation(UPDATE_BACKGROUND_IMAGES);

  const onSaveRegistrationFormFields = useCallback(async (): Promise<void> => {
    if (isRegistrationFormUpdated) {
      let initialOrder = 1;
      const order = new Set();
      const updatedFormFields = Array.from(selectedFields).map(i => {
        order.add(initialOrder);
        return { code: i.code, order: initialOrder++, required: i.required, included: true };
      });

      // fields that are not present in form needs to be added with included false
      const removedFormFields = DEFAULT_REGISTRATION_FORM_ORDER.filter(el =>
        Array.from(selectedFields).every(f => f.code !== el.code)
      );
      removedFormFields.forEach(removedField => {
        if (!order.has(removedField.order)) {
          // traversing order value 1 to 4 to add fields that are not in updatedFormFields
          for (let i = 1; i <= 4; i++) {
            if (!order.has(i)) {
              const field = removedField;
              field.order = i;
              field.included = false;
              order.add(i);
              updatedFormFields.push(field);
              break;
            }
          }
        }
      });
      await updateRegistrationFormMutation({
        variables: {
          input: {
            hubId,
            data: updatedFormFields
          }
        },
        onError: apolloError => {
          LOG.error(apolloError, `Failed to update registration form settings for hub ${hubId}`);
          setShowFailureAlert(true);
          setFailureAlertContent(translate('custom_registration_network_error_text'));
        },
        onCompleted: data => {
          let formFieldSettings = data?.updateRegistrationFormSettings?.data || [];
          formFieldSettings = removeTypename(formFieldSettings);
          formFieldSettings = formFieldSettings.sort((a, b) => a.order - b.order);
          formFieldSettings = formFieldSettings.filter(i => i.included !== false);
          originalSelectedFields.current = formFieldSettings;
          setSelectedFields(formFieldSettings);
          setShowAlertSuccess(true);
        }
      });
    }
  }, [selectedFields, hubId, updateRegistrationFormMutation, isRegistrationFormUpdated, translate]);

  const shouldUpdateBackgroundImages = (
    originalSettingsInput,
    currentFields,
    isDecorativeImage,
    isNewBackGroundOriginalImage
  ) => {
    const { backgroundImage, newBackgroundImage, backgroundImageAltText } = originalSettingsInput;
    return (
      backgroundImage?.url !== newBackgroundImage?.url ||
      backgroundImage?.croppedUrl !== newBackgroundImage?.croppedUrl ||
      isDecorativeImage !== currentFields.decorativeImage ||
      backgroundImageAltText !== currentFields.backgroundImageAltText ||
      !isNewBackGroundOriginalImage
    );
  };

  const shouldUpdateSettings = (originalSettingsInput, currentAppearanceFieldsInput, isNewBackGroundOriginalImage) =>
    originalSettingsInput.showLogo !== currentAppearanceFieldsInput.showLogo ||
    originalSettingsInput.decorativeImage !== currentAppearanceFieldsInput.decorativeImage ||
    !isNewBackGroundOriginalImage;

  const getUpdatedDecorativeImage = (originalSettingsInput, isNewBackGroundOriginalImage) =>
    !isNewBackGroundOriginalImage ? true : originalSettingsInput.decorativeImage;

  const onAppearanceFieldsSave = useCallback(async (): Promise<void> => {
    setError(false);
    setErrorAltText(false);
    const isDecorativeImage = originalSettings?.decorativeImage;
    const isNewBackGroundOriginalImage = !!originalSettings?.newBackgroundImage?.url;
    if (
      shouldUpdateBackgroundImages(
        originalSettings,
        originalAppearanceFields.current,
        isDecorativeImage,
        isNewBackGroundOriginalImage
      )
    ) {
      await updateBackgroundImagesMutation({
        variables: {
          input: {
            hubId,
            backgroundImageUrl: isNewBackGroundOriginalImage ? originalSettings.backgroundImage.croppedUrl : null,
            backgroundOriginalImageUrl: isNewBackGroundOriginalImage ? originalSettings.backgroundImage.url : null,
            newBackgroundImageUrl: isNewBackGroundOriginalImage
              ? originalSettings?.newBackgroundImage?.croppedUrl || originalSettings?.newBackgroundImage?.url
              : null,
            newBackgroundOriginalImageUrl: isNewBackGroundOriginalImage
              ? originalSettings?.newBackgroundImage?.url
              : null,
            backgroundImageAltText:
              originalSettings?.decorativeImage || !isNewBackGroundOriginalImage
                ? null
                : originalSettings?.backgroundImageAltText.trim()
          }
        },
        onError: apolloError => {
          LOG.error(`Error while saving background images for hub [${hubId}], error : `, apolloError);
          setShowFailureAlert(true);
          setFailureAlertContent(translate('custom_registration_network_error_text'));
        },
        onCompleted: (data: { updateBackgroundImages: Hub }) => {
          setOriginalSettings(prevState => ({
            ...prevState,
            backgroundImage: {
              url: data?.updateBackgroundImages?.theme?.backgroundOriginalImageUrl,
              croppedUrl: data?.updateBackgroundImages?.theme?.backgroundImageUrl
            },
            newBackgroundImage: {
              url: data?.updateBackgroundImages?.theme?.backgroundOriginalImageUrl,
              croppedUrl: data?.updateBackgroundImages?.theme?.backgroundImageUrl
            },
            backgroundImageAltText: data?.updateBackgroundImages?.theme?.backgroundImageAltText
          }));
          originalAppearanceFields.current = {
            ...originalAppearanceFields.current,
            backgroundImage: {
              url: data?.updateBackgroundImages?.theme?.backgroundOriginalImageUrl,
              croppedUrl: data?.updateBackgroundImages?.theme?.backgroundImageUrl
            },
            newBackgroundImage: {
              url: data?.updateBackgroundImages?.theme?.backgroundOriginalImageUrl,
              croppedUrl: data?.updateBackgroundImages?.theme?.backgroundImageUrl
            },
            backgroundImageAltText: data?.updateBackgroundImages?.theme?.backgroundImageAltText
          };
          setShowAlertSuccess(true);
        }
      });
    }

    if (shouldUpdateSettings(originalSettings, originalAppearanceFields.current, isNewBackGroundOriginalImage)) {
      const settingsToUpdate = removeTypename(hubSettingsData.getHubSettings);
      await updateProfileSettingsMutation({
        variables: {
          input: {
            id: hubId,
            hubSettings: {
              ...settingsToUpdate,
              showLogo: originalSettings.showLogo,
              decorativeImage: getUpdatedDecorativeImage(originalSettings, isNewBackGroundOriginalImage)
            }
          }
        },
        onError: apolloError => {
          LOG.error(`Error while updating hub data for hub [${hubId}] with error : `, apolloError);
          setShowFailureAlert(true);
          setFailureAlertContent(translate('custom_registration_network_error_text'));
        },
        onCompleted: (data: { hubUpdateSettings: Settings }) => {
          setOriginalSettings(prevState => ({
            ...prevState,
            showLogo: data?.hubUpdateSettings?.showLogo,
            decorativeImage: data?.hubUpdateSettings?.decorativeImage
          }));
          originalAppearanceFields.current = {
            ...originalAppearanceFields.current,
            showLogo: data?.hubUpdateSettings?.showLogo,
            decorativeImage: data?.hubUpdateSettings?.decorativeImage
          };
          setShowAlertSuccess(true);
        }
      });
    }
  }, [
    hubSettingsData,
    originalSettings,
    updateBackgroundImagesMutation,
    updateProfileSettingsMutation,
    hubId,
    translate
  ]);

  const omitFromQuery = newHubData => {
    const omitAttributes = ['status', '__typename', 'config.__typename', 'theme.__typename', 'calendar.__typename'];
    return omit(newHubData, omitAttributes);
  };

  const registrationFormContainer = (): JSX.Element => (
    <>
      {!singleSignOnFeature && showAlertSuccess && !showFailureAlert && (
        <div css={{ margin: '1.5rem' }}>
          <PageAlert
            appearance="success"
            content={translate('custom_registration_alert_update_success')}
            dismissible
            onDismiss={() => setShowAlertSuccess(false)}
            testID="custom-registration-alert-form-success"
          />
        </div>
      )}
      {!singleSignOnFeature && showFailureAlert && (
        <div css={{ margin: '1.5rem' }}>
          <PageAlert
            appearance="danger"
            content={failureAlertContent}
            dismissible
            onDismiss={() => {
              setShowFailureAlert(false);
              setFailureAlertContent('');
              setShowAlertSuccess(false);
            }}
            testID="custom-registration-alert-form-error"
          />
        </div>
      )}
      <CardContainer testID="custom-registration-form-container">
        <div>
          <div css={styles.bodyContainerEdit}>
            <h2 css={{ marginTop: '0' }}>{translate('custom_registration_form_header')}</h2>
          </div>
          <p css={styles.description}>{translate('custom_registration_form_header_helper_text')}</p>
          <StaticTableFormFields />
          <ReorderableTableFormFields selectedFields={selectedFields} setSelectedFields={setSelectedFields} />
          <AddFieldMenu selectedFields={selectedFields} setSelectedFields={setSelectedFields} />
          <NavigationConfirmationModal
            isOpen={showNavigationConfirmationModal}
            setIsOpen={setShowNavigationConfirmationModal}
            bodyText={translate('page-navigation-confirmation-body')}
            preventLeave={isPageEdited}
            testID="events-plus-branding-page"
          />
        </div>
      </CardContainer>
      <BackgroundAppearanceCard
        hubId={hubId}
        originalSettings={originalSettings}
        setOriginalSettings={setOriginalSettings}
        isPreviewModalOpen={isPreviewModalOpen}
        setIsPreviewModalOpen={setIsPreviewModalOpen}
        privacySettings={privacySettings}
        isAllowTurnOffCodeSnippets={isAllowTurnOffCodeSnippets}
        headingsFont={headingsFont}
        bodyFont={bodyFont}
        errorAltText={errorAltText && !isBackgroundImageAltTextValid}
        setErrorAltText={setErrorAltText}
      />
    </>
  );

  const headerActions: ActionType[] = useMemo(
    () => [
      {
        value: translate('login_settings_page_save_button'),
        appearance: 'filled',
        onClick: (): void => {
          setShowFailureAlert(false);
          setShowAlertSuccess(false);
          setFailureAlertContent('');
          if (selectedTab === 1) {
            if (isOrganisationIdValid) {
              onLoginMethodSave();
            } else {
              setError(true);
            }
          } else if (isBackgroundImageAltTextValid) {
            onSaveRegistrationFormFields();
            onAppearanceFieldsSave();
          } else {
            setErrorAltText(true);
            setShowFailureAlert(true);
            setFailureAlertContent(
              translate('custom_registration_add_alert_text', {
                fieldName: translate('background_image_alt_text')
              })
            );
          }
        },
        disabled:
          selectedTab === 1 ? !isSsoSettingsUpdated : !isRegistrationFormUpdated && !isAppearanceSettingsUpdated,
        label: translate('login_settings_page_save_button')
      }
    ],
    [
      isOrganisationIdValid,
      translate,
      selectedTab,
      onLoginMethodSave,
      onSaveRegistrationFormFields,
      onAppearanceFieldsSave,
      isAppearanceSettingsUpdated,
      isRegistrationFormUpdated,
      isSsoSettingsUpdated,
      isBackgroundImageAltTextValid
    ]
  );

  const loginSettingsRendererWithTabs = (): JSX.Element => (
    <>
      {showAlertSuccess && !showFailureAlert && (
        <div css={{ margin: '1.5rem' }}>
          <PageAlert
            appearance="success"
            content={translate('custom_registration_alert_update_success')}
            dismissible
            onDismiss={() => setShowAlertSuccess(false)}
            testID="custom-registration-alert-form-success"
          />
        </div>
      )}
      {showFailureAlert && (
        <div css={{ margin: '1.5rem' }}>
          <PageAlert
            appearance="danger"
            content={failureAlertContent}
            dismissible
            onDismiss={() => {
              setShowFailureAlert(false);
              setFailureAlertContent('');
              setShowAlertSuccess(false);
            }}
            testID="custom-registration-alert-form-error"
          />
        </div>
      )}
      {selectedTab === 0 && registrationFormContainer()}
      {selectedTab === 1 && (
        <>
          <EditSsoLogin
            setSsoSettings={setSsoSettings}
            ssoSettings={ssoSettings}
            isOrganisationIdValid={isOrganisationIdValid}
            error={error}
            serverError={serverError}
          />
          <NavigationConfirmationModal
            isOpen={showNavigationConfirmationModal}
            setIsOpen={setShowNavigationConfirmationModal}
            bodyText={translate('page-navigation-confirmation-body')}
            preventLeave={isPageEdited}
            testID="events-plus-branding-page"
          />
        </>
      )}
      <ConfirmationModal
        header={translate('custom_registration_leave_confirmation_modal_header')}
        content={translate('custom_registration_leave_confirmation_modal_body')}
        cancelText={translate('custom_registration_leave_confirmation_modal_leave_button_text')}
        confirmationText={translate('custom_registration_leave_confirmation_modal_stay_button_text')}
        confirmationAction={() => setShowTabSwitchModal(false)}
        cancelAction={() => {
          setSelectedFields(originalSelectedFields.current);
          setSsoSettings(ssoOriginalSettings);
          setOriginalSettings(originalAppearanceFields.current);
          setError(false);
          setServerError(false);
          setShowFailureAlert(false);
          setShowAlertSuccess(false);
          setFailureAlertContent('');
          switchTab(nextSelectedTab);
          switchTab(nextSelectedTab);
        }}
        setIsModalOpen={setShowTabSwitchModal}
        isModalOpen={showTabSwitchModal}
        defaultConfirmationAction
      />
    </>
  );

  const LoginSettingsHeader: JSX.Element = (
    <div css={styles.titleContainer}>
      <Header
        title={translate('custom_registration_side_nav_text')}
        breadCrumbs={headerBreadCrumbs}
        tabs={singleSignOnFeature ? tabs : null}
        actions={headerActions}
      />
    </div>
  );

  return (
    <div css={styles.outerContainer}>
      <ScrollViewWithBars forceStickyHeader header={LoginSettingsHeader}>
        <LoadingWrapper
          loading={
            fetchingRegistrationFormSettings ||
            updatingRegistrationFormFields ||
            fetchingHubSettings ||
            updatingProfileSettingsMutation ||
            customFontsLoading ||
            updatingBackgroundImage ||
            fetchingVideoCenterCodeSnippets ||
            fetchingData ||
            updatingLoginMethodLoading ||
            fetchingAccountConfigs
          }
          renderer={singleSignOnFeature ? loginSettingsRendererWithTabs : registrationFormContainer}
          id="registration-form-settings-loading-spinner"
          ariaLabel={translate('loading_registration_form_settings')}
        />
      </ScrollViewWithBars>
    </div>
  );
}

function CardContainer({ children, testID }: CardProps): JSX.Element {
  const styles = useStyle(CustomRegistrationCardContainerStyle);
  return (
    <div css={styles.bodyContainerEdit} {...injectTestId(testID)}>
      {children}
    </div>
  );
}
interface CardProps {
  children: ReactNode;
  testID: string;
}

export interface FieldData {
  code: string;
  order: number;
  required: boolean;
  isLocked?: boolean; // Set to true for FirstName, LastName and Email fields which cannot be altered
  included: boolean;
}

export interface LoginMethodFields {
  loginMethod: LoginType;
  organisationId: string;
}

interface Props {
  hubId: string;
  hubTitle: string;
}

export interface BackGroundPreviewData {
  showLogo: boolean;
  backgroundImage: NewImage;
  newBackgroundImage: NewImage;
  decorativeImage: boolean;
  backgroundImageAltText: string;
}
export default FormEditorCard;

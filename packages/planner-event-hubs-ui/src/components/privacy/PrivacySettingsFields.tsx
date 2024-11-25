import React, { useCallback, useEffect, useState } from 'react';
import { PrivacySettings } from '@components/privacy/type/PrivacySettings';
import isURL from 'validator/lib/isURL';
import { sanitizeUrl } from '@utils/santizeUrl';
import EditCookieNotificationFields from '@components/privacy/EditCookieNotificationFields';
import EditCCPAFields from '@components/privacy/EditCCPAFields';
import EditTermsOfUseFields from '@components/privacy/EditTermsOfUseFields';
import EditPrivacyPolicyFields from '@components/privacy/EditPrivacyPolicyFields';
import EditSearchEngineVisibilityFields from '@components/privacy/EditSearchEngineVisibilityFields';
import { useAppFeatures } from '@components/AppFeaturesProvider';
import { PageAlert } from '@cvent/carina/components/Alert';
import { useTranslate } from 'nucleus-text';
import { useStyle } from '@hooks/useStyle';
import { injectTestId } from '@cvent/nucleus-test-automation';
import { PrivacySettingsStyle } from '@components/privacy/style';
import { useCenterInfo } from '@hooks/useCenterInfo';
import { VIDEO_HUB_STATUS_ACTIVE } from '@utils/constants';

function PrivacySettingsFields({
  privacySettings: originalSettings,
  infoContent,
  onSave: originalOnSave,
  setPrivacySettings,
  isSaveButtonClicked,
  setShowAlertSuccess,
  setIsSaveButtonClicked,
  setIsPageEdited,
  allowTermsEdit
}: Props): JSX.Element {
  const { translate } = useTranslate();
  const { alertContainer } = useStyle(PrivacySettingsStyle);
  const { searchEngineVisibility } = useAppFeatures();
  const [error, setError] = useState(false);
  const [errorCustomCookieList, setErrorCustomCookieList] = useState(false);
  const [errorTermsOfUse, setErrorTermsOfUse] = useState(false);
  const [errorCcpa, setErrorCcpa] = useState(false);
  const [showFailureAlert, setShowFailureAlert] = useState(false);
  const { hubStatus } = useCenterInfo();

  // validations
  const isCventLinkTextValid =
    Boolean(originalSettings.cventPrivacyPolicyLinkText) && originalSettings.cventPrivacyPolicyLinkText.trim();
  const isPrivacyUrlValid = Boolean(originalSettings.privacyPolicyUrl) && isURL(originalSettings.privacyPolicyUrl);
  const isPrivacyLinkTextValid =
    Boolean(originalSettings.privacyPolicyLinkText) && originalSettings.privacyPolicyLinkText.trim();
  const isCustomCookieLinkTextValid =
    Boolean(originalSettings?.cookieLists?.customLinkText) && originalSettings?.cookieLists?.customLinkText.trim();
  const isCustomCookieUrlValid =
    Boolean(originalSettings?.cookieLists?.customUrl) && isURL(originalSettings?.cookieLists?.customUrl);
  const validateCustomCookieList = originalSettings?.cookieLists?.enableCustom
    ? isCustomCookieLinkTextValid && isCustomCookieUrlValid
    : true;

  const validateCventPrivacy = originalSettings.displayCventPrivacyPolicy ? isCventLinkTextValid : true;
  const validatePrivacy = originalSettings.displayPrivacyPolicy ? isPrivacyUrlValid && isPrivacyLinkTextValid : true;

  const maxCharacters = 20000;
  const charLeft = maxCharacters - (originalSettings.termsText?.length || 0);
  const isTermsLinkTextValid = Boolean(originalSettings.termsLinkText) && originalSettings.termsLinkText.trim();
  const isTermsLinkContentValid = Boolean(originalSettings.termsText) && originalSettings.termsText.trim();
  const isTermsBodyValid = Boolean(originalSettings.termsText) && charLeft >= 0;

  const validateTermsDetails = originalSettings.displayTermsLinkOnFooter
    ? isTermsLinkTextValid && isTermsBodyValid
    : true;

  const isCcpaBodyValid =
    originalSettings.ccpaLinkExplanationText && originalSettings.ccpaLinkExplanationText.trim().length > 0;
  const isCcpaLinkTextValid = originalSettings.ccpaLinkText && originalSettings.ccpaLinkText.trim().length > 0;
  const isCcpaButtonTextValid =
    originalSettings.ccpaSubmitButtonText && originalSettings.ccpaSubmitButtonText.trim().length > 0;
  const isCcpaConfirmationTextValid =
    originalSettings.ccpaConfirmationText && originalSettings.ccpaConfirmationText.trim().length > 0;
  const isCcpaDnsUrlValid = Boolean(originalSettings.ccpaDoNotSellUrl) && isURL(originalSettings.ccpaDoNotSellUrl);
  const validateCcpaField = originalSettings.ccpaEnableDoNotSell ? isCcpaBodyValid : true;
  const validateCcpaLinkTextField = originalSettings.ccpaEnableDoNotSell ? isCcpaLinkTextValid : true;
  const validateCcpaButtonTextField = originalSettings.ccpaEnableDoNotSell ? isCcpaButtonTextValid : true;
  const validateCcpaConfirmationTextField = originalSettings.ccpaEnableDoNotSell ? isCcpaConfirmationTextValid : true;
  const validateCcpaDnsUrlField =
    originalSettings.ccpaEnableDoNotSell && originalSettings.ccpaDoNotSellUrlEnabled ? isCcpaDnsUrlValid : true;

  const [invalidField, setInvalidField] = useState('');
  const [invalidFieldType, setInvalidFieldType] = useState('');

  const fieldValidators = useCallback(
    () => [
      {
        condition: originalSettings.ccpaEnableDoNotSell && originalSettings.ccpaDoNotSellUrlEnabled,
        isValid: isCcpaDnsUrlValid,
        fieldName: 'ccpa_dns_share_url_text'
      },
      {
        condition: originalSettings.ccpaEnableDoNotSell,
        isValid: isCcpaConfirmationTextValid,
        fieldName: 'privacy_ccpa_confirmation_text'
      },
      {
        condition: originalSettings.ccpaEnableDoNotSell,
        isValid: isCcpaButtonTextValid,
        fieldName: 'privacy_ccpa_button_text'
      },
      {
        condition: originalSettings.ccpaEnableDoNotSell,
        isValid: isCcpaBodyValid,
        fieldName: 'ccpa_explanation_text'
      },
      {
        condition: originalSettings.ccpaEnableDoNotSell,
        isValid: isCcpaLinkTextValid,
        fieldName: 'privacy_ccpa_link_text'
      },
      {
        condition: originalSettings.displayTermsLinkOnFooter,
        isValid: isTermsLinkContentValid,
        fieldName: 'privacy_termsofuse_content'
      },
      {
        condition: originalSettings.displayTermsLinkOnFooter,
        isValid: isTermsLinkTextValid,
        fieldName: 'privacy_termsofuse_linktext'
      },
      {
        condition: originalSettings.displayPrivacyPolicy,
        isValid: isPrivacyLinkTextValid,
        fieldName: 'privacy_your_privacy_link_text'
      },
      {
        condition: originalSettings.displayPrivacyPolicy,
        isValid: isPrivacyUrlValid,
        fieldName: 'privacy_your_privacy_link_label'
      },
      {
        condition: originalSettings.displayCventPrivacyPolicy,
        isValid: isCventLinkTextValid,
        fieldName: 'privacy_cvent_privacy_link_text'
      },
      {
        condition: originalSettings?.cookieLists?.enableCustom,
        isValid: isCustomCookieLinkTextValid,
        fieldName: 'custom_cookie_link_text'
      },
      {
        condition: originalSettings?.cookieLists?.enableCustom,
        isValid: isCustomCookieUrlValid,
        fieldName: 'custom_cookie_url_text'
      }
    ],
    [
      isCventLinkTextValid,
      isPrivacyUrlValid,
      isPrivacyLinkTextValid,
      isTermsLinkTextValid,
      isTermsLinkContentValid,
      isCcpaLinkTextValid,
      isCcpaBodyValid,
      isCcpaButtonTextValid,
      isCcpaConfirmationTextValid,
      isCcpaDnsUrlValid,
      originalSettings,
      isCustomCookieLinkTextValid,
      isCustomCookieUrlValid
    ]
  );

  const validateFields = useCallback(() => {
    const validators = fieldValidators();
    validators.forEach(validator => {
      if (validator.condition && !validator.isValid) {
        setInvalidField(translate(validator.fieldName));
        if (
          validator.fieldName === 'ccpa_dns_share_url_text' ||
          validator.fieldName === 'privacy_your_privacy_link_label' ||
          validator.fieldName === 'custom_cookie_url_text'
        )
          setInvalidFieldType('privacy_settings_add_alert_text_invalid_link');
        else setInvalidFieldType('privacy_settings_add_alert_text');
      }
    });
  }, [fieldValidators, translate]);

  const onSave = useCallback(() => {
    validateFields();
    if (!validateTermsDetails) {
      setErrorTermsOfUse(true);
      setShowFailureAlert(true);
      setShowAlertSuccess(false);
    }
    if (
      !(
        validateCcpaField &&
        validateCcpaLinkTextField &&
        validateCcpaButtonTextField &&
        validateCcpaConfirmationTextField &&
        validateCcpaDnsUrlField
      )
    ) {
      setErrorCcpa(true);
      setShowFailureAlert(true);
      setShowAlertSuccess(false);
    }
    if (!(validateCventPrivacy && validatePrivacy)) {
      setError(true);
      setShowFailureAlert(true);
      setShowAlertSuccess(false);
    }
    if (!validateCustomCookieList) {
      setErrorCustomCookieList(true);
      setShowFailureAlert(true);
      setShowAlertSuccess(false);
    }
    if (
      validateCventPrivacy &&
      validatePrivacy &&
      validateCustomCookieList &&
      validateTermsDetails &&
      validateCcpaField &&
      validateCcpaLinkTextField &&
      validateCcpaButtonTextField &&
      validateCcpaConfirmationTextField &&
      validateCcpaDnsUrlField
    ) {
      let sanitizedPrivacyUrl = null;
      let sanitizedCcpaDnsUrl = null;
      let sanitizedCustomCookieListUrl = null;
      if (originalSettings.privacyPolicyUrl) {
        sanitizedPrivacyUrl = sanitizeUrl(originalSettings.privacyPolicyUrl);
      }
      if (originalSettings.ccpaDoNotSellUrl) {
        sanitizedCcpaDnsUrl = sanitizeUrl(originalSettings.ccpaDoNotSellUrl);
      }

      if (originalSettings?.cookieLists?.customUrl) {
        sanitizedCustomCookieListUrl = sanitizeUrl(originalSettings?.cookieLists?.customUrl);
      }
      setShowFailureAlert(false);
      originalOnSave({
        ...originalSettings,
        privacyPolicyUrl: sanitizedPrivacyUrl,
        ccpaDoNotSellUrl: sanitizedCcpaDnsUrl,
        cookieLists: {
          ...originalSettings.cookieLists,
          customUrl: sanitizedCustomCookieListUrl
        }
      });
      setIsPageEdited(false);
    } else {
      setIsPageEdited(true);
    }
  }, [
    validateFields,
    originalSettings,
    validateTermsDetails,
    validateCustomCookieList,
    validateCcpaField,
    validateCcpaLinkTextField,
    validateCcpaButtonTextField,
    validateCcpaConfirmationTextField,
    validateCcpaDnsUrlField,
    validateCventPrivacy,
    validatePrivacy,
    setShowAlertSuccess,
    originalOnSave,
    setIsPageEdited
  ]);

  useEffect(() => {
    if (isSaveButtonClicked) {
      onSave();
      setIsSaveButtonClicked(false);
    }
  }, [isSaveButtonClicked, onSave, setIsSaveButtonClicked]);

  return (
    <>
      {showFailureAlert && (
        <div css={{ padding: '1.5rem' }} {...injectTestId('privacy-settings-error-alert-container')}>
          <div css={alertContainer}>
            <PageAlert
              appearance="danger"
              content={translate(invalidFieldType, {
                fieldName: invalidField
              })}
              dismissible
              onDismiss={() => setShowFailureAlert(false)}
              testID="privacy-settings-form-alert-error"
            />
          </div>
        </div>
      )}
      <EditPrivacyPolicyFields
        privacySettings={originalSettings}
        setPrivacySettings={setPrivacySettings}
        infoContent={infoContent}
        setIsPageEdited={setIsPageEdited}
        error={error}
      />
      <EditTermsOfUseFields
        privacySettings={originalSettings}
        setPrivacySettings={setPrivacySettings}
        infoContent={infoContent}
        setIsPageEdited={setIsPageEdited}
        allowTermsEdit={allowTermsEdit}
        errorTermsOfUse={errorTermsOfUse}
      />
      <EditCookieNotificationFields
        privacySettings={originalSettings}
        infoContent={infoContent}
        setIsPageEdited={setIsPageEdited}
        setPrivacySettings={setPrivacySettings}
        error={error}
        errorCustomCookieList={errorCustomCookieList}
      />
      <EditCCPAFields
        privacySettings={originalSettings}
        setPrivacySettings={setPrivacySettings}
        infoContent={infoContent}
        setIsPageEdited={setIsPageEdited}
        errorCcpa={errorCcpa}
      />
      {searchEngineVisibility && hubStatus === VIDEO_HUB_STATUS_ACTIVE && (
        <EditSearchEngineVisibilityFields
          privacySettings={originalSettings}
          setPrivacySettings={setPrivacySettings}
          setIsPageEdited={setIsPageEdited}
        />
      )}
    </>
  );
}

interface Props {
  privacySettings: PrivacySettings;
  infoContent: Map<string, string>;
  onSave: (boolean) => void;
  isSaveButtonClicked: boolean;
  setIsPageEdited: (isPageEdited: boolean) => void;
  setShowAlertSuccess: (showAlertSuccess: boolean) => void;
  setIsSaveButtonClicked: (isSaveButtonClicked: boolean) => void;
  setPrivacySettings: React.Dispatch<React.SetStateAction<PrivacySettings>>;
  allowTermsEdit: boolean;
}

export default PrivacySettingsFields;

import React, { useState } from 'react';
import PrivacySettingsFields from '@components/privacy/PrivacySettingsFields';
import { PrivacySettings } from '@components/privacy/type/PrivacySettings';
import { injectTestId } from '@cvent/nucleus-test-automation';

function PrivacyContainer({
  privacySettings: originalSettings,
  infoContent,
  onUpdate,
  allowTermsEdit,
  setIsPageEdited,
  isSaveButtonClicked,
  setShowAlertSuccess,
  setIsSaveButtonClicked
}: Props): JSX.Element {
  // privacy policy helper methods
  const onSavePrivacyPolicy = updatedSettings => {
    onUpdate(updatedSettings);
    setIsPageEdited(false);
  };

  const [privacySettings, setPrivacySettings] = useState(originalSettings);

  return (
    <div {...injectTestId('privacy-settings-container')}>
      <PrivacySettingsFields
        privacySettings={privacySettings}
        setPrivacySettings={setPrivacySettings}
        infoContent={infoContent}
        onSave={onSavePrivacyPolicy}
        isSaveButtonClicked={isSaveButtonClicked}
        setShowAlertSuccess={setShowAlertSuccess}
        setIsSaveButtonClicked={setIsSaveButtonClicked}
        setIsPageEdited={setIsPageEdited}
        allowTermsEdit={allowTermsEdit}
      />
    </div>
  );
}

interface Props {
  privacySettings: PrivacySettings;
  infoContent: Map<string, string>;
  onUpdate: (PrivacySettings) => void;
  allowTermsEdit: boolean;
  setIsPageEdited: (isPageEdited: boolean) => void;
  isSaveButtonClicked: boolean;
  setShowAlertSuccess: (showAlertSuccess: boolean) => void;
  setIsSaveButtonClicked: (isSaveButtonClicked: boolean) => void;
}

export default PrivacyContainer;

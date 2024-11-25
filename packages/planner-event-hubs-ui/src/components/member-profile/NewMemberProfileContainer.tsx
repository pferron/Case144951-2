import React, { useCallback, useEffect, useState } from 'react';
import { injectTestId } from '@cvent/nucleus-test-automation';
import { ProfileSettings } from '@components/privacy/type/PrivacySettings';
import { useTranslate } from 'nucleus-text';
import NewEditProfileCardDesign from '@components/member-profile/NewEditProfileCardDesign';
import {
  FULL_NAME,
  getBorderOptionsArray,
  getBrandingOptionsArray,
  getAlignmentOptionsArray,
  getCardContent
} from '@components/member-profile/ProfileDesignOptions';
import {
  EventBrandingOptions,
  ValidProfileCardBorder,
  ValidProfileCardContentAlignments
} from '@cvent/multi-dimensional-profile/utils/cardDesignUtils';
import { getProfileDetails } from '@utils/getProfileDetails';
import ProfileCardModal from '@components/member-profile/ProfileCardModal';
import { useTheme } from '@cvent/carina/components/ThemeProvider/useTheme';
import { CardDesign } from '@cvent/multi-dimensional-profile/types/Profile';
import NewEditMemberProfileFields from '@components/member-profile/NewEditMemberProfileFields';
import { isEqual } from 'lodash';

function NewMemberProfileContainer({
  settings,
  onUpdate,
  logoImageUrl,
  isSaveButtonClicked,
  setIsSaveButtonClicked,
  setIsPageEdited
}: Props): React.JSX.Element {
  const [isPreviewProfile, setIsPreviewProfile] = useState(false);
  const [profileSettings, setProfileSettings] = useState(settings);
  const { translate } = useTranslate();
  const theme = useTheme();

  const cardDesign: CardDesign = {
    eventBranding: profileSettings?.profileCard?.branding.toLowerCase() as EventBrandingOptions,
    border: profileSettings?.profileCard?.border.toLowerCase() as ValidProfileCardBorder,
    alignment: profileSettings?.profileCard?.alignment.toLowerCase() as ValidProfileCardContentAlignments
  };

  useEffect(() => {
    if (isEqual(profileSettings, settings)) {
      setIsPageEdited(false);
    } else {
      setIsPageEdited(true);
    }
  }, [profileSettings, settings, setIsPageEdited]);

  const profileData = getProfileDetails(profileSettings);
  const cardContent = getCardContent(translate);
  const viewProfileCardArray = [];
  viewProfileCardArray.push(
    getBorderOptionsArray(theme, translate, true, true).find(iterator => iterator.value === cardDesign.border)
  );
  viewProfileCardArray.push(
    getBrandingOptionsArray(theme, translate, true, true).find(iterator => iterator.value === cardDesign.eventBranding)
  );
  viewProfileCardArray.push(
    getAlignmentOptionsArray(theme, translate, true, true).find(iterator => iterator.value === cardDesign.alignment)
  );

  const onSave = useCallback(() => {
    onUpdate(profileSettings);
  }, [onUpdate, profileSettings]);

  if (isSaveButtonClicked) {
    onSave();
    setIsSaveButtonClicked(false);
  }

  return (
    <>
      <div {...injectTestId('profile-card-design-container')}>
        <NewEditProfileCardDesign
          setIsPreviewProfile={setIsPreviewProfile}
          profileSettings={profileSettings}
          setProfileSettings={setProfileSettings}
        />
      </div>
      <div {...injectTestId('member-profile-fields-container')}>
        <NewEditMemberProfileFields
          cardContent={cardContent}
          profileSettings={profileSettings}
          setProfileSettings={setProfileSettings}
        />
      </div>
      {isPreviewProfile && (
        <ProfileCardModal
          onDismiss={(): void => setIsPreviewProfile(false)}
          profileData={profileData}
          profileCardModalIsOpen={isPreviewProfile}
          logoImageUrl={logoImageUrl}
          cardDesign={cardDesign}
          formattedFullName={FULL_NAME}
        />
      )}
    </>
  );
}
interface Props {
  settings: ProfileSettings;
  onUpdate: (profileSettings: ProfileSettings) => void;
  logoImageUrl: string;
  isSaveButtonClicked: boolean;
  setIsSaveButtonClicked: (isSaveButtonClicked: boolean) => void;
  setIsPageEdited: (isPageEdited: boolean) => void;
}

export default NewMemberProfileContainer;

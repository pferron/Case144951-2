import React, { useState } from 'react';
import { injectTestId } from '@cvent/nucleus-test-automation';
import { ProfileSettings } from '@components/privacy/type/PrivacySettings';
import EditMemberProfileFields from '@components/member-profile/EditMemberProfileFields';
import MemberProfileFields from '@components/member-profile/MemberProfileFields';
import { useTranslate } from 'nucleus-text';
import ProfileCardDesign from '@components/member-profile/ProfileCardDesign';
import EditProfileCardDesign from '@components/member-profile/EditProfileCardDesign';
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

function MemberProfileContainer({ settings, onUpdate, logoImageUrl }: Props): JSX.Element {
  const [isPreviewProfile, setIsPreviewProfile] = useState(false);
  const [editMemberProfileFields, setEditMemberProfileFields] = useState(false);
  const [editProfileCardDesign, setEditProfileCardDesign] = useState(false);
  const [profileSettings, setProfileSettings] = useState(settings);
  const { translate } = useTranslate();
  const theme = useTheme();

  const cardDesign: CardDesign = {
    eventBranding: profileSettings?.profileCard?.branding.toLowerCase() as EventBrandingOptions,
    border: profileSettings?.profileCard?.border.toLowerCase() as ValidProfileCardBorder,
    alignment: profileSettings?.profileCard?.alignment.toLowerCase() as ValidProfileCardContentAlignments
  };

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

  // member profile fields helper methods
  const onSaveMemberProfileFields = updatedSettings => {
    onUpdate(updatedSettings);
    setEditMemberProfileFields(false);
  };
  const onEditMemberProfileFields = () => {
    setEditMemberProfileFields(true);
  };
  const onCancelMemberProfileFields = () => {
    setEditMemberProfileFields(false);
    setProfileSettings(settings);
  };

  // profile card design helper methods
  const onSaveProfileCardDesign = (updatedSettings): void => {
    onUpdate(updatedSettings);
    setEditProfileCardDesign(false);
  };
  const onEditProfileCardDesign = (): void => {
    setEditProfileCardDesign(true);
  };
  const onCancelProfileCardDesign = (): void => {
    setEditProfileCardDesign(false);
    setProfileSettings(settings);
  };

  return (
    <>
      <div {...injectTestId('profile-card-design-container')}>
        {editProfileCardDesign ? (
          <EditProfileCardDesign
            setIsPreviewProfile={setIsPreviewProfile}
            onSave={onSaveProfileCardDesign}
            onCancel={onCancelProfileCardDesign}
            borderOptionsArray={getBorderOptionsArray(theme, translate)}
            brandingOptionsArray={getBrandingOptionsArray(theme, translate)}
            alignmentOptionsArray={getAlignmentOptionsArray(theme, translate)}
            profileSettings={profileSettings}
            setProfileSettings={setProfileSettings}
          />
        ) : (
          <ProfileCardDesign
            setIsPreviewProfile={setIsPreviewProfile}
            onEdit={onEditProfileCardDesign}
            viewProfileCardArray={viewProfileCardArray}
            disabled={editMemberProfileFields}
          />
        )}
      </div>
      <div {...injectTestId('member-profile-fields-container')}>
        {editMemberProfileFields ? (
          <EditMemberProfileFields
            onSave={onSaveMemberProfileFields}
            onCancel={onCancelMemberProfileFields}
            cardContent={cardContent}
            profileSettings={profileSettings}
            setProfileSettings={setProfileSettings}
          />
        ) : (
          <MemberProfileFields
            onEdit={onEditMemberProfileFields}
            disabled={editProfileCardDesign}
            profileSettings={profileSettings}
            cardContent={cardContent}
          />
        )}
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

export interface ProfileCardContent {
  title: string;
  body: string;
  required?: boolean;
  switchValue?: string;
  actions?: React.ReactNode;
  testID: string;
  allowCardValue?: string;
}
export interface OptionItems {
  label: string;
  value: string;
  disabled: boolean;
  icon: React.ReactElement;
  testID: string;
  headerText?: string;
}

interface Props {
  settings: ProfileSettings;
  onUpdate: (profileSettings: ProfileSettings) => void;
  logoImageUrl: string;
}

export default MemberProfileContainer;

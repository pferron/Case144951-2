import { ProfileSettings } from '@components/privacy/type/PrivacySettings';
import CardContainer from '@components/privacy/CardContainer';
import { useStyle } from '@hooks/useStyle';
import { EditProfileCardDesignStyle } from '@components/member-profile/style';
import React, { Dispatch, SetStateAction } from 'react';
import { OptionItems } from '@components/member-profile/MemberProfileContainer';
import DesignControlsGroup from '@cvent/multi-dimensional-profile/planner/edit/DesignControlsGroup';
import { useTranslate } from 'nucleus-text';
import PreviewLink from '@components/member-profile/PreviewLink';

function EditProfileCardDesign({
  onSave: originalOnSave,
  onCancel,
  brandingOptionsArray,
  alignmentOptionsArray,
  borderOptionsArray,
  setIsPreviewProfile,
  profileSettings,
  setProfileSettings
}: Props): JSX.Element {
  const { translate } = useTranslate();
  const styles = useStyle(EditProfileCardDesignStyle);
  const onSave = (): void => {
    originalOnSave(profileSettings);
  };
  const onClickBorder = (value: string): void => {
    const borderDesignCard = { ...profileSettings.profileCard, border: value.toUpperCase() };
    setProfileSettings({ ...profileSettings, profileCard: borderDesignCard });
  };
  const onClickBranding = (value: string): void => {
    const brandingDesignCard = { ...profileSettings.profileCard, branding: value.toUpperCase() };
    setProfileSettings({ ...profileSettings, profileCard: brandingDesignCard });
  };
  const onClickAlignment = (value: string): void => {
    const alignmentDesignCard = { ...profileSettings.profileCard, alignment: value.toUpperCase() };
    setProfileSettings({ ...profileSettings, profileCard: alignmentDesignCard });
  };
  return (
    <CardContainer testID="edit-profile-design" onSave={onSave} onCancel={onCancel}>
      <div>
        <h3 css={styles.title}>{translate('profile_card_design')}</h3>
        <div css={styles.sectionContainer}>
          <DesignControlsGroup
            options={borderOptionsArray}
            describedBy={translate('border_label')}
            type="border"
            accessibilityLabel={translate('border_label')}
            onClick={onClickBorder}
            selected={profileSettings.profileCard.border.toLowerCase()}
            testID="border"
            headerText={translate('profile_card_border')}
          />
        </div>
        <div css={styles.sectionContainer}>
          <DesignControlsGroup
            options={brandingOptionsArray}
            describedBy={translate('branding_label')}
            type="branding"
            accessibilityLabel={translate('branding_label')}
            onClick={onClickBranding}
            selected={profileSettings.profileCard.branding.toLowerCase()}
            testID="branding"
            headerText={translate('profile_card_branding')}
          />
        </div>
        <div css={styles.sectionContainer}>
          <DesignControlsGroup
            options={alignmentOptionsArray}
            describedBy={translate('alignment_label')}
            type="alignment"
            accessibilityLabel={translate('alignment_label')}
            onClick={onClickAlignment}
            selected={profileSettings.profileCard.alignment.toLowerCase()}
            testID="alignment"
            headerText={translate('profile_card_alignment')}
          />
        </div>
        <PreviewLink setIsPreviewProfile={setIsPreviewProfile} />
      </div>
    </CardContainer>
  );
}

interface Props {
  setIsPreviewProfile: Dispatch<SetStateAction<boolean>>;
  profileSettings: ProfileSettings;
  setProfileSettings: Dispatch<SetStateAction<ProfileSettings>>;
  onSave: (value: boolean | ProfileSettings) => void;
  onCancel: (value: boolean) => void;
  borderOptionsArray: Array<OptionItems>;
  brandingOptionsArray: Array<OptionItems>;
  alignmentOptionsArray: Array<OptionItems>;
}

export default EditProfileCardDesign;

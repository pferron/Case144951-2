import { ProfileSettings } from '@components/privacy/type/PrivacySettings';
import CardContainerEditEnabled from '@components/privacy/CardContainerEditEnabled';
import { useStyle } from '@hooks/useStyle';
import { EditProfileCardDesignStyle } from '@components/member-profile/style';
import React, { Dispatch, SetStateAction } from 'react';
import DesignControlsGroup from '@cvent/multi-dimensional-profile/planner/edit/DesignControlsGroup';
import { useTranslate } from 'nucleus-text';
import PreviewLink from '@components/member-profile/PreviewLink';
import {
  getBorderOptionSlanted,
  getBorderOptionStraight,
  getBrandingOptionLogo,
  getBrandingOptionNone,
  getAlignmentOptionCenter,
  getAlignmentOptionLeft
} from '@components/member-profile/ProfileDesignOptions';
import { useTheme } from '@cvent/carina/components/ThemeProvider/useTheme';
import { RadioGroup } from '@cvent/carina/components/RadioGroup';
import FormElement from '@cvent/carina/components/FormElement/FormElement';
import { ALIGNMENT_CENTER, BORDER_SLANTED, BRANDING_LOGO } from '@utils/constants';

function NewEditProfileCardDesign({ setIsPreviewProfile, profileSettings, setProfileSettings }: Props): JSX.Element {
  const { translate } = useTranslate();
  const theme = useTheme();

  const styles = useStyle(EditProfileCardDesignStyle);

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
    <CardContainerEditEnabled testID="edit-profile-design">
      <div>
        <h3 css={styles.title}>{translate('profile_card_design')}</h3>
        <div css={styles.cardStyles}>
          <div css={styles.sectionContainerNew}>
            <DesignControlsGroup
              options={
                profileSettings.profileCard.border.toLowerCase() === BORDER_SLANTED
                  ? getBorderOptionSlanted(theme, translate)
                  : getBorderOptionStraight(theme, translate)
              }
              describedBy={translate('border_label')}
              type="border"
              accessibilityLabel={translate('border_label')}
              onClick={onClickBorder}
              testID="border"
            />
            <FormElement css={{ paddingLeft: '3rem' }}>
              <FormElement.Label label={translate('profile_card_border')} labelFor="border" />
              <RadioGroup
                name={translate('profile_card_border')}
                id="profile-design-border"
                testID="profile-design-border"
                aria-label={translate('profile_card_border')}
                options={[
                  { label: translate('profile_design_slanted_label'), value: 'slanted' },
                  { label: translate('profile_design_horizontal_label'), value: 'straight' }
                ]}
                onUpdate={onClickBorder}
                selected={profileSettings.profileCard.border.toLowerCase()}
              />
            </FormElement>
          </div>
          <div css={styles.sectionContainerNew}>
            <DesignControlsGroup
              options={
                profileSettings.profileCard.branding.toLowerCase() === BRANDING_LOGO
                  ? getBrandingOptionLogo(theme, translate)
                  : getBrandingOptionNone(theme, translate)
              }
              describedBy={translate('branding_label')}
              type="branding"
              accessibilityLabel={translate('branding_label')}
              onClick={onClickBranding}
              testID="branding"
            />
            <FormElement css={{ paddingLeft: '3rem' }}>
              <FormElement.Label label={translate('profile_card_branding')} labelFor="branding" />
              <RadioGroup
                name={translate('profile_card_branding')}
                id="profile-design-branding"
                testID="profile-design-branding"
                aria-label={translate('profile_card_branding')}
                options={[
                  { label: translate('profile_design_logo_label'), value: 'logo' },
                  { label: translate('profile_design_none_label'), value: 'none' }
                ]}
                onUpdate={onClickBranding}
                selected={profileSettings.profileCard.branding.toLowerCase()}
              />
            </FormElement>
          </div>
          <div css={styles.sectionContainerNew}>
            <DesignControlsGroup
              options={
                profileSettings.profileCard.alignment.toLowerCase() === ALIGNMENT_CENTER
                  ? getAlignmentOptionCenter(theme, translate)
                  : getAlignmentOptionLeft(theme, translate)
              }
              describedBy={translate('alignment_label')}
              type="alignment"
              accessibilityLabel={translate('alignment_label')}
              onClick={onClickAlignment}
              testID="alignment"
            />
            <FormElement css={{ paddingLeft: '3rem' }}>
              <FormElement.Label label={translate('profile_card_alignment')} labelFor="alignment" />
              <RadioGroup
                name={translate('profile_card_alignment')}
                id="profile-design-alignment"
                testID="profile-design-alignment"
                aria-label={translate('profile_card_alignment')}
                options={[
                  { label: translate('profile_design_center_label'), value: 'center' },
                  { label: translate('profile_design_left_label'), value: 'left' }
                ]}
                onUpdate={onClickAlignment}
                selected={profileSettings.profileCard.alignment.toLowerCase()}
              />
            </FormElement>
          </div>
        </div>
        <PreviewLink setIsPreviewProfile={setIsPreviewProfile} />
      </div>
    </CardContainerEditEnabled>
  );
}

interface Props {
  setIsPreviewProfile: Dispatch<SetStateAction<boolean>>;
  profileSettings: ProfileSettings;
  setProfileSettings: Dispatch<SetStateAction<ProfileSettings>>;
}

export default NewEditProfileCardDesign;

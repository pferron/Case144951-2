import { BackgroundThemeProvider } from '@cvent/blocks/components/BlockThemeProvider';
import { TextLink } from '@cvent/carina/components/TextLink';
import { ProfileCard, SocialLinks, MessageTemplate } from '@cvent/multi-dimensional-profile';
import React, { useMemo } from 'react';
import { AttendeeProfile, CardDesign } from '@cvent/multi-dimensional-profile/types/Profile';
import { useAppFeatures } from '@components/AppFeaturesProvider';
import { useStyle } from '@hooks/useStyle';
import { ProfileStyles } from '@components/member-profile/style';
import { Settings } from '@cvent/planner-event-hubs-model/types';
import useBreakpoints from '@hooks/useBreakpoints';
import useTheme from '@cvent/blocks/hooks/useTheme';
import { FULL_NAME, getPreviewContent } from '@components/member-profile/ProfileDesignOptions';
import { Button } from '@cvent/carina/components/Button';
import { PROFILE_MOBILE_WIDTH } from '@utils/constants';
import { LockIcon } from '@cvent/carina/components/Icon';
import { EditQuantity, getEditableFieldsQuantity } from '@utils/getEditableFieldsQuantity';
import { useTranslate } from 'nucleus-text';

type SocialMediaLinks = {
  facebookUrl?: string;
  twitterUrl?: string;
  linkedInUrl?: string;
  websiteUrl?: string;
};

interface Props {
  cardDesign: CardDesign;
  profileData: AttendeeProfile;
  logoImageUrl: string;
  hubSettings: Settings;
  socialMediaLinks: SocialMediaLinks;
}

function MemberProfileView({
  cardDesign,
  profileData,
  logoImageUrl,
  hubSettings,
  socialMediaLinks
}: Props): React.JSX.Element {
  const styles = useStyle(ProfileStyles);
  const { cookieNotificationFeature } = useAppFeatures();
  const { translate } = useTranslate();
  const content = getPreviewContent(translate);
  const { widthWindow } = useBreakpoints();
  const profileCard = hubSettings?.profileCard;
  const onClickBlankMethod = () => null;
  // using custom width for isMobile to make Preview Same as Member Side
  const isMobile = useMemo(() => widthWindow <= PROFILE_MOBILE_WIDTH, [widthWindow]);
  const profileCardEditable = getEditableFieldsQuantity(
    new Map([
      [profileCard?.allowCompanyEdit, profileCard?.showCompany],
      [profileCard?.allowJobTitleEdit, profileCard?.showJobTitle],
      [profileCard?.allowNameEdit, profileCard?.showName]
    ])
  );
  const { backgroundColor } = useTheme();

  const profileFieldsEditable = getEditableFieldsQuantity(
    new Map([[profileCard?.showSocialMediaLinks, profileCard?.allowSocialMediaEdit]])
  );
  const showRestrictedEditMessage =
    profileCardEditable === EditQuantity.NONE && profileFieldsEditable === EditQuantity.NONE;

  return (
    <>
      <div css={styles.whiteRect}>
        <div css={styles.buttonStyle}>
          <Button
            text={translate('member_profile_preview_button')}
            onClick={onClickBlankMethod}
            appearance="lined"
            size="m"
            testID="member-profile-preview-button"
            aria-label={translate('member_profile_preview_button')}
          />
          {profileCard?.showSocialMediaLinks && profileCard?.allowSocialMediaEdit && (
            <Button
              text={translate('member_profile_edit_button')}
              onClick={onClickBlankMethod}
              appearance="filled"
              size="m"
              testID="member-profile-edit-button"
              aria-label={translate('member_profile_edit_button')}
            />
          )}
        </div>
        <div css={styles.cardStyle}>
          {showRestrictedEditMessage && (
            <div css={styles.message}>
              <MessageTemplate
                icon={<LockIcon size="m" />}
                message={translate('member_profile_restricted_edit_message')}
                backgroundColor={backgroundColor.active}
                testID="member-profile-restricted-edit"
                setWidth
              />
            </div>
          )}
          <ProfileCard
            profile={profileData}
            testID="member-profile-card"
            formattedFullName={FULL_NAME}
            isVisible
            logoImageUrl={logoImageUrl}
            cardDesign={cardDesign}
          />
          <BackgroundThemeProvider>
            <div css={styles.additionalDetailsStyle}>
              {hubSettings?.ccpaEnableDoNotSell &&
                (!cookieNotificationFeature ||
                  (cookieNotificationFeature && !hubSettings?.ccpaDoNotSellUrlEnabled)) && (
                  <TextLink
                    onClick={(): void => null}
                    neutral
                    testID="profile-ccpa-link"
                    css={styles.ccpaTextStyle}
                    role="button"
                  >
                    {cookieNotificationFeature ? hubSettings?.ccpaLinkText : translate('privacy_ccpa_donotsellmyinfo')}
                  </TextLink>
                )}
              {cookieNotificationFeature &&
                hubSettings?.ccpaEnableDoNotSell &&
                hubSettings?.ccpaDoNotSellUrlEnabled && (
                  <TextLink
                    neutral
                    target="_blank"
                    rel="noopener noreferrer"
                    testID="profile-ccpa-link"
                    css={styles.ccpaTextStyle}
                  >
                    {hubSettings?.ccpaLinkText}
                  </TextLink>
                )}
            </div>
            {isMobile && (
              <div css={styles.mobileSocialLinks}>
                {profileCard?.showSocialMediaLinks && (
                  <SocialLinks
                    facebookUrl={socialMediaLinks?.facebookUrl}
                    linkedInUrl={socialMediaLinks?.linkedInUrl}
                    twitterUrl={socialMediaLinks?.twitterUrl}
                    isLoggedInUser
                    title={translate('member_profile_social_links_title')}
                    accessibilityLabels={content.socialLinks.socialAccessibilityLabels}
                    noSocialLinksText={translate('member_profile_social_form_text')}
                    testID="member-profile-social-links"
                    isTabletCustomWidth
                  />
                )}
              </div>
            )}
          </BackgroundThemeProvider>
        </div>
      </div>
      <BackgroundThemeProvider>
        {!isMobile && (
          <div css={styles.bottomSection}>
            <div css={styles.cardWidthStyle} />
            <div css={styles.bottomRight}>
              {profileCard?.showSocialMediaLinks && (
                <SocialLinks
                  facebookUrl={socialMediaLinks?.facebookUrl}
                  linkedInUrl={socialMediaLinks?.linkedInUrl}
                  twitterUrl={socialMediaLinks?.twitterUrl}
                  isLoggedInUser
                  title={translate('member_profile_social_links_title')}
                  accessibilityLabels={content.socialLinks.socialAccessibilityLabels}
                  noSocialLinksText={translate('member_profile_social_form_text')}
                  testID="member-profile-social-links"
                  isTabletCustomWidth
                />
              )}
            </div>
          </div>
        )}
      </BackgroundThemeProvider>
    </>
  );
}
export default MemberProfileView;

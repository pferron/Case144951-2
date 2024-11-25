import React from 'react';
import { AppSwitcherIcon } from '@cvent/carina/components/Icon';
import { injectTestId } from '@cvent/nucleus-test-automation';
import { useTranslate } from 'nucleus-text';
import useBreakpoints from '@hooks/useBreakpoints';
import ResponsiveImage from '@cvent/carina/components/legacy/Image/ResponsiveImage';
import { useStyle } from '@hooks/useStyle';
import { MemberProfileHeaderStyle } from '@components/member-profile/style';
import profileImage from '../../../public/profile.png';

interface Props {
  logoImageUrl: string;
  logoAltText: string;
}

function ViewProfileHeader({ logoImageUrl, logoAltText }: Props): JSX.Element {
  const { translate } = useTranslate();
  const {
    headerContainer,
    logoStyle,
    headerListStyle,
    headerItemStyle,
    profileAvtarButtonStyle,
    avatarContainer,
    avatarImage,
    appSwitcherStyle,
    headerItemContainer
  } = useStyle(MemberProfileHeaderStyle);
  const { isMobileOrTablet } = useBreakpoints();
  const globalNav = [
    {
      title: translate('preview_profile_header_home'),
      index: '0',
      testId: 'home-test-id'
    },
    {
      title: translate('preview_profile_header_channel'),
      index: '1',
      testId: 'channels-test-id'
    },
    {
      title: translate('preview_profile_upcoming_event'),
      index: '2',
      testId: 'upcoming-events-test-id'
    },
    {
      title: translate('preview_profile_header_videos'),
      index: '3',
      testId: 'videos-test-id'
    }
  ];
  return (
    <div {...injectTestId('view-profile-header')} css={{ height: '4.375rem' }}>
      <div css={headerContainer}>
        <div css={logoStyle}>
          <div css={{ width: '6.813rem', height: '2.5rem' }} {...injectTestId('header-logo')}>
            {logoImageUrl && <img src={logoImageUrl} alt={logoAltText} css={{ height: '2.5rem' }} />}
          </div>
        </div>
        {!isMobileOrTablet ? (
          <>
            <div css={headerListStyle}>
              {globalNav.map(item => (
                <div key={item.index} css={headerItemContainer}>
                  <div css={headerItemStyle}>{item.title}</div>
                </div>
              ))}
            </div>
            <button type="button" {...injectTestId('member-profile-icon')} css={profileAvtarButtonStyle}>
              <div css={avatarContainer}>
                <ResponsiveImage
                  src={profileImage.src}
                  alt="member-profile-avtar-image"
                  css={avatarImage}
                  width={32}
                  height={32}
                  testID="page-header-menu-avatar"
                />
              </div>
            </button>
          </>
        ) : (
          <div css={appSwitcherStyle}>
            <AppSwitcherIcon size="xl" />
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewProfileHeader;

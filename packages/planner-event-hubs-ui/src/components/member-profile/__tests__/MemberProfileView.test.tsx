import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import 'jest-axe/extend-expect';
import { screen } from 'nucleus-text/testing-library/screen';
import MemberProfileView from '@components/member-profile/MemberProfileView';
import { CardDesign, ProfileData } from '@cvent/multi-dimensional-profile/types/Profile';
import { Settings } from '@cvent/planner-event-hubs-model/types';
import { axe } from 'jest-axe';

const cardDesign = {
  eventBranding: 'LOGO',
  border: 'SLANTED',
  alignment: 'CENTER'
};
const profileData: ProfileData = {
  id: 'profileId',
  firstName: 'Renae Carter',
  lastName: 'Monroe',
  prefix: 'Mrs.',
  designation: 'PhD',
  profileImageUrl: 'profileImage.src'
};
const hubSettings: Settings = {
  ccpaEnableDoNotSell: true,
  ccpaDoNotSellUrlEnabled: true,
  ccpaLinkText: 'Donot Touch',
  registrationSettings: {
    allowAllContactsRegistration: false,
    allowContactGroupsRegistration: false,
    allowContactTypesRegistration: false,
    blockContactsRegistration: false,
    blockListRegistration: false
  },
  profileCard: {
    border: 'SLANTED',
    branding: 'LOGO',
    alignment: 'CENTER',
    showName: true,
    allowNameEdit: true,
    showJobTitle: true,
    allowJobTitleEdit: true,
    showCompany: true,
    allowCompanyEdit: true,
    showHeadline: true,
    allowHeadlineEdit: true,
    showSocialMediaLinks: true,
    allowSocialMediaEdit: true,
    showPronouns: true,
    allowPronounsEdit: true
  },
  showLogo: false,
  decorativeImage: true,
  allowTurnOffCookies: true
};

const socialMediaLinks = {
  facebookUrl: 'https://www.facebook.com',
  linkedInUrl: 'https://www.linkedin.com',
  twitterUrl: 'https://www.twitter.com',
  websiteUrl: 'https://www.website.com'
};

const cookieNotificationFeature = [
  {
    name: 'cookieNotificationFeature',
    enabled: true,
    experimentVersion: '1001'
  }
];

describe('Profile Preview Page component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('renders profile preview component', async () => {
    const { container } = render(
      <TestWrapper appFeatures={cookieNotificationFeature}>
        <MockedProvider>
          <MemberProfileView
            cardDesign={cardDesign as CardDesign}
            profileData={profileData}
            logoImageUrl=""
            hubSettings={hubSettings}
            socialMediaLinks={socialMediaLinks}
          />
        </MockedProvider>
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Mrs. Ranae Carter Monroe, PhD')).toBeInTheDocument();
    });
    expect(screen.getByRole('button', { key: 'member_profile_preview_button' })).toBeInTheDocument();
    expect(screen.getByRole('button', { key: 'member_profile_edit_button' })).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });
});

import React from 'react';
import { fireEvent, render, within, waitFor, RenderResult } from '@testing-library/react';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import MemberProfileSettings from '@components/member-profile/MemberProfileSettings';
import { GET_HUB_SETTINGS, GET_VIDEO_HUB } from '@cvent/planner-event-hubs-model/operations/hub';
import { MockedProvider } from '@apollo/client/testing';
import hubSettings from '@components/member-profile/__tests__/fixtures/hubSettings.json';
import centerInformation from '@components/member-profile/__tests__/fixtures/centerInformation.json';
import ProfileCardModal from '@components/member-profile/ProfileCardModal';
import { AppFeaturesProvider } from '@components/AppFeaturesProvider';
import {
  EventBrandingOptions,
  ValidProfileCardBorder,
  ValidProfileCardContentAlignments
} from '@cvent/multi-dimensional-profile/utils/cardDesignUtils';
import 'jest-axe/extend-expect';
import { axe } from 'jest-axe';
import { screen } from 'nucleus-text/testing-library/screen';

jest.mock('next/router', () => ({
  useRouter: jest.fn()
}));

interface RouterProps {
  pathname: string;
  route: string;
  query: {
    isSuccess: boolean;
  };
  replace: () => void;
}

jest.mock('next/router', () => ({
  useRouter(): RouterProps {
    return {
      pathname: '/path',
      route: '/route',
      query: { isSuccess: true },
      replace: jest.fn()
    };
  }
}));

const mocksProfilePublic = [
  {
    request: {
      query: GET_HUB_SETTINGS,
      variables: {
        id: {
          id: 'test-video-center'
        }
      }
    },
    result: {
      data: hubSettings
    }
  }
];

const mocks = [
  {
    request: {
      query: GET_HUB_SETTINGS,
      variables: {
        id: {
          id: 'test-video-center'
        }
      }
    },
    result: {
      data: hubSettings
    }
  },
  {
    request: {
      query: GET_VIDEO_HUB,
      variables: {
        hubID: {
          id: 'test-video-center'
        }
      }
    },
    result: {
      data: centerInformation
    }
  }
];
const appFeatures = [
  {
    name: 'videoCenterInformationFeature',
    enabled: true,
    experimentVersion: '1001'
  }
];
const onDismiss = jest.fn();
const mockProfileData = {
  id: 'f2335725-f640-4668-bec5-b262341a1543',
  firstName: 'Michael',
  lastName: 'Scott',
  prefix: 'Mr.',
  designation: 'Regional Manager',
  title: 'RM',
  company: 'Dunder Mifflin Inc'
};
const formattedFullName = 'Mrs. Ranae Carter Monroe, PhD';
const cardDesign = {
  border: ValidProfileCardBorder.Straight,
  eventBranding: EventBrandingOptions.Logo,
  alignment: ValidProfileCardContentAlignments.Left
};
const logoImageUrl = 'bluecorp-logo.bb215fc5.png';
const testSetup = (isOpen: boolean): RenderResult => {
  return render(
    <TestWrapper>
      <ProfileCardModal
        onDismiss={onDismiss}
        profileData={mockProfileData}
        profileCardModalIsOpen={isOpen}
        logoImageUrl={logoImageUrl}
        cardDesign={cardDesign}
        formattedFullName={formattedFullName}
      />
    </TestWrapper>
  );
};

describe('Member Profile', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders member profile fields component', async () => {
    render(
      <TestWrapper>
        <MockedProvider mocks={mocksProfilePublic}>
          <AppFeaturesProvider value={appFeatures}>
            <MemberProfileSettings videoCenterId="test-video-center" videoCenterTitle="test" />
          </AppFeaturesProvider>
        </MockedProvider>
      </TestWrapper>
    );
    await waitFor(() => {
      expect(screen.getByTestId('member-profile-fields-container')).toBeInTheDocument();
    });

    const editMemberProfileContainer = within(screen.getByTestId('edit-member-profile-fields'));
    expect(editMemberProfileContainer.getByText(/Company/i)).toBeInTheDocument();
    return (
      <TestWrapper>
        <MockedProvider mocks={mocks}>
          <AppFeaturesProvider value={appFeatures}>
            <MemberProfileSettings videoCenterId="test-video-center" videoCenterTitle="test" />
          </AppFeaturesProvider>
        </MockedProvider>
      </TestWrapper>
    );
  });

  it('renders profile card design component in edit mode', async () => {
    render(
      <TestWrapper>
        <MockedProvider mocks={mocks}>
          <AppFeaturesProvider value={appFeatures}>
            <MemberProfileSettings videoCenterId="test-video-center" videoCenterTitle="test" />
          </AppFeaturesProvider>
        </MockedProvider>
      </TestWrapper>
    );
    await waitFor(() => {
      expect(screen.getByTestId('profile-card-design-container')).toBeInTheDocument();
    });

    expect(await screen.findByTextKey('profile_card_design')).toBeInTheDocument();
    expect(await screen.findByTextKey('profile_card_border')).toBeInTheDocument();
    expect(await screen.findByTextKey('profile_card_branding')).toBeInTheDocument();
    expect(await screen.findByTextKey('profile_card_alignment')).toBeInTheDocument();
    const previewLink = await screen.findByTextKey('profile_card_preview');
    expect(previewLink).toBeInTheDocument();
    fireEvent.click(previewLink);
    await waitFor(() => {
      expect(screen.getByTestId('profile-card')).toBeInTheDocument();
    });
    const dismissButton = screen.getByTestId('member-details-dismiss-button');
    fireEvent.click(dismissButton);
    expect(await screen.findByTextKey('features_member_profile_preview_button')).toBeInTheDocument();
    expect(await screen.findByTextKey('features_member_profile_save_button')).toBeInTheDocument();
    // HUB-151797
    // expect(await axe(container)).toHaveNoViolations();
  });

  it('renders profile card radio buttons in edit mode', async () => {
    render(
      <TestWrapper>
        <MockedProvider mocks={mocks}>
          <AppFeaturesProvider value={appFeatures}>
            <MemberProfileSettings videoCenterId="test-video-center" videoCenterTitle="test" />
          </AppFeaturesProvider>
        </MockedProvider>
      </TestWrapper>
    );
    await waitFor(() => {
      expect(screen.getByTestId('profile-card-design-container')).toBeInTheDocument();
    });

    expect(await screen.findByTextKey('profile_card_design')).toBeInTheDocument();
    const borderSlantedRadiobutton = await screen.findByTestId('profile-design-border__slanted');
    expect(borderSlantedRadiobutton).toBeInTheDocument();
    const borderHorizontalRadiobutton = await screen.findByTestId('profile-design-border__straight');
    expect(borderHorizontalRadiobutton).toBeInTheDocument();
    fireEvent.click(borderHorizontalRadiobutton);
    const brandingLogoRadiobutton = await screen.findByTestId('profile-design-branding__logo');
    expect(brandingLogoRadiobutton).toBeInTheDocument();
    const brandingNoLogoRadiobutton = await screen.findByTestId('profile-design-branding__none');
    expect(brandingNoLogoRadiobutton).toBeInTheDocument();
    fireEvent.click(brandingNoLogoRadiobutton);
    const previewLink = await screen.findByTextKey('profile_card_preview');
    expect(previewLink).toBeInTheDocument();
    fireEvent.click(previewLink);
    await waitFor(() => {
      expect(screen.getByTestId('profile-card')).toBeInTheDocument();
    });
    expect(screen.queryByTestId('design-profile-card-logo-image')).not.toBeInTheDocument();
    const dismissButton = screen.getByTestId('member-details-dismiss-button');
    fireEvent.click(dismissButton);
    expect(screen.queryByTestId('profile-card')).not.toBeInTheDocument();
    fireEvent.click(brandingLogoRadiobutton);
    fireEvent.click(previewLink);
    await waitFor(() => {
      expect(screen.getByTestId('profile-card')).toBeInTheDocument();
    });
    expect(screen.getByTestId('design-profile-card-logo-image')).toBeInTheDocument();
    // HUB-151797
    // expect(await axe(container)).toHaveNoViolations();
  });

  it('opening of modal on clicking on see preview', async () => {
    const { baseElement } = testSetup(true);
    expect(baseElement).toMatchSnapshot();
    expect(await screen.findByTestId('profile-card')).toBeInTheDocument();
    expect(await screen.findByTestId('member-details-dismiss-button')).toBeInTheDocument();
    expect(await screen.findByText(/Preview/i)).toBeInTheDocument();
    expect(await axe(baseElement)).toHaveNoViolations();
  });
  it('profile card modal is not opened', async () => {
    const { baseElement } = testSetup(false);
    expect(screen.queryByTestId('profile-card-test-id')).not.toBeInTheDocument();
    expect(await axe(baseElement)).toHaveNoViolations();
  });
});

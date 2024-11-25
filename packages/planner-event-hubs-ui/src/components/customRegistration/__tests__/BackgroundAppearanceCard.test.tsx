import { fireEvent, render, waitFor } from '@testing-library/react';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import { screen } from 'nucleus-text/testing-library/screen';
import BackgroundAppearanceCard from '@components/customRegistration/BackgroundAppearanceCard';
import { GET_HUB_SETTINGS } from '@cvent/planner-event-hubs-model/operations/hub';
import { MockedProvider } from '@apollo/client/testing';
import { CustomFont } from '@cvent/planner-event-hubs-model/types';
import 'jest-axe/extend-expect';
import { axe } from 'jest-axe';

const setIsPreviewModalOpen = jest.fn;
const mocks = [
  {
    request: {
      query: GET_HUB_SETTINGS,
      variables: {
        id: {
          id: 'hubId'
        }
      }
    },
    result: {
      data: {
        getHubSettings: {
          displayCventPrivacyPolicy: false,
          cventPrivacyPolicyLinkText: 'hello 2',
          displayPrivacyPolicy: false,
          privacyPolicyUrl: '',
          privacyPolicyLinkText: '',
          displayTermsLinkOnFooter: false,
          termsLinkText: '',
          displayTermsOnLogin: false,
          termsText: 'knfkjsakjfnjks',
          notifyUsersAboutCookie: false,
          displayCventPrivacyPolicyInCookie: false,
          allowTurnOffCookies: false,
          ccpaEnableDoNotSell: false,
          ccpaLinkText: 'Do Not Sell My Personal Information',
          ccpaDoNotSellUrl: 'www.cvent.com',
          ccpaLinkExplanationText: 'ccpa explanation Text',
          memberProfilePublic: false,
          profileCard: null,
          guestVisibility: 'HOMEPAGE_PUBLIC',
          registrationSettings: {
            allowAllContactsRegistration: false,
            allowContactGroupsRegistration: false,
            allowContactTypesRegistration: false,
            blockContactsRegistration: false,
            blockListRegistration: false
          },
          showLogo: false,
          registrationBackground: 'DEFAULT'
        }
      }
    }
  }
];

const originalSettings = {
  showLogo: false,
  backgroundImage: {
    url: 'https://silo606-custom.core.cvent.org/f6d746482c09496fa3e3e3f6cd1503a0/video-center/55113f0a-9f28-4257-8c0e-3ca34f44c4b9/banner/48b8279e-36af-4324-b5b3-2055911a815a/connections.png',
    croppedUrl:
      'https://images-lower.cvent.com/S606/f6d746482c09496fa3e3e3f6cd1503a0/video-center/55113f0a-9f28-4257-8c0e-3ca34f44c4b9/banner/48b8279e-36af-4324-b5b3-2055911a815a/69f8c46a294a908fff6c5c83df6af5c8!_!56c9871d97eb0444b64299d9a13a6225.png'
  },
  newBackgroundImage: {
    url: 'https://silo606-custom.core.cvent.org/f6d746482c09496fa3e3e3f6cd1503a0/video-center/55113f0a-9f28-4257-8c0e-3ca34f44c4b9/banner/48b8279e-36af-4324-b5b3-2055911a815a/connections.png',
    croppedUrl:
      'https://images-lower.cvent.com/S606/f6d746482c09496fa3e3e3f6cd1503a0/video-center/55113f0a-9f28-4257-8c0e-3ca34f44c4b9/banner/48b8279e-36af-4324-b5b3-2055911a815a/69f8c46a294a908fff6c5c83df6af5c8!_!56c9871d97eb0444b64299d9a13a6225.png'
  },
  decorativeImage: false,
  backgroundImageAltText: 'Black Image'
};

const headingCustomFont: CustomFont = {
  id: 'eabe1e7e-fd73-4b68-bf49-b6423f5d69da',
  fontFamily: 'FireballHeading',
  fallbackFontId: 4,
  fallbackFont: 'Arial',
  files: [
    {
      url: 'https://custom.t2.cvent.com/D3F4F6FF65B64E99A58CEF1D8F73A6E9/files/67ccc3a44045461ba2cbd1df6d7e7c5a.woff',
      fontStyle: 'normal',
      fontWeight: 900
    }
  ],
  isActive: true
};

const bodyTextCustomFont: CustomFont = {
  id: 'eabe1e7e-fd73-4b68-bf49-b6423f5d69da',
  fontFamily: 'FireballBodyText',
  fallbackFontId: 4,
  fallbackFont: 'Arial',
  files: [
    {
      url: 'https://custom.t2.cvent.com/D3F4F6FF65B64E99A58CEF1D8F73A6E9/files/67ccc3a44045461ba2cbd1df6d7e7c5a.woff',
      fontStyle: 'normal',
      fontWeight: 900
    }
  ],
  isActive: true
};

describe('Background Appearance Card', () => {
  it('renders Background Appearance Card', async () => {
    const mockfn = jest.fn();
    const { container } = render(
      <MockedProvider mocks={mocks}>
        <TestWrapper>
          <BackgroundAppearanceCard
            hubId="hubId"
            originalSettings={originalSettings}
            setOriginalSettings={mockfn}
            privacySettings={{}}
            isAllowTurnOffCodeSnippets={false}
            isPreviewModalOpen={false}
            setIsPreviewModalOpen={setIsPreviewModalOpen}
            headingsFont={headingCustomFont}
            bodyFont={bodyTextCustomFont}
          />
        </TestWrapper>
      </MockedProvider>
    );
    expect(await screen.findByTextKey('custom_registration_appearance_heading')).toBeInTheDocument();
    expect(await screen.findByTextKey('custom_registration_logo')).toBeInTheDocument();
    expect(await screen.findByTextKey('custom_registration_appearance_text')).toBeInTheDocument();
    expect(await screen.findByTextKey('custom_registration_background')).toBeInTheDocument();
    expect(await screen.findByTextKey('custom_registration_background_style')).toBeInTheDocument();
    expect(await screen.findByTextKey('custom_registration_appearance_preview_button_text')).toBeInTheDocument();
    const LogoCheckbox = await screen.findByRole('checkbox');
    expect(LogoCheckbox).toBeInTheDocument();
    expect(screen.getByTestId('uploaded-image')).toBeInTheDocument();
    expect(await screen.findByTextKey('decorative_image_question_text')).toBeInTheDocument();
    expect(screen.getByText('Black Image')).toBeInTheDocument();
    const deleteButton = screen.getByTestId('image-delete-button');
    expect(deleteButton).toBeInTheDocument();
    fireEvent.click(deleteButton);
    expect(await axe(container)).toHaveNoViolations();
    await waitFor(() => {
      expect(screen.getByTestId('image-icon')).toBeInTheDocument();
    });
  });
});

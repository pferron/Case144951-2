import React from 'react';
import { render } from '@testing-library/react';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import { screen } from 'nucleus-text/testing-library/screen';
import 'jest-axe/extend-expect';
import { axe } from 'jest-axe';
import PreviewModal from '@components/customRegistration/PreviewModal';
import { BackGroundStyle, CustomFont, Settings } from '@cvent/planner-event-hubs-model/types';
import { BackGroundPreviewData } from '@components/customRegistration/FormEditorCard';

const setIsModalOpen = jest.fn();
const privacySettings: Settings = {
  termsLinkText: 'Terms Of Use',
  cventPrivacyPolicyLinkText: 'Privacy Policy',
  privacyPolicyLinkText: 'Test Policy',
  displayCventPrivacyPolicy: true,
  allowTurnOffCookies: true,
  allowTurnOffGoogleAnalytics: false
};
const backgroundPreviewDetails: BackGroundPreviewData = {
  showLogo: true,
  backGroundStyle: BackGroundStyle.Default,
  backgroundImage: null,
  newBackgroundImage: null
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

jest.mock('@hooks/useCenterInfo', () => {
  const originalModule = jest.requireActual('@hooks/useCenterInfo');
  return {
    __esModule: true,
    ...originalModule,
    useCenterInfo: jest.fn().mockReturnValue({
      theme: {
        actionColor: '#1a6137',
        backgroundColor: '#1ce6e6',
        logoImageRelativePath: null,
        logoImageUrl:
          'https://images-lower.cvent.com/S606/f6d746482c09496fa3e3e3f6cd1503a0/video-center/55113f0a-9f28-4257-8c0e-3ca34f44c4b9/banner/48b8279e-36af-4324-b5b3-2055911a815a/69f8c46a294a908fff6c5c83df6af5c8!_!56c9871d97eb0444b64299d9a13a6225.png',
        logoAltText: null,
        mainColor: '#1622e6',
        logoOriginalImageUrl: '',
        moodColor: 'white',
        safeMode: false,
        faviconUrl: '',
        headingsFont: null,
        bodyFont: null
      }
    })
  };
});

const cookieNotificationFeature = [
  {
    name: 'cookieNotificationFeature',
    enabled: true,
    experimentVersion: '1001'
  }
];

describe('Background Image Preview Modal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Render Background Image Preview Modal', async () => {
    const { container } = render(
      <TestWrapper appFeatures={cookieNotificationFeature}>
        <PreviewModal
          isOpen
          setIsModalOpen={setIsModalOpen}
          backGroundPreviewDetails={backgroundPreviewDetails}
          privacySettings={privacySettings}
          isAllowTurnOffCodeSnippets
          headingsFont={headingCustomFont}
          bodyFont={bodyTextCustomFont}
        />
      </TestWrapper>
    );
    expect(await screen.findByTextKey('background_image_preview_heading')).toBeInTheDocument();

    expect(await screen.findByTestId('registration-form-logo')).toBeInTheDocument();

    const firstName = await screen.findByRole('textbox', {
      key: 'registration_form_first_name_text'
    });
    expect(firstName).toBeInTheDocument();
    const lastName = await screen.findByRole('textbox', {
      key: 'registration_form_last_name_text'
    });
    expect(lastName).toBeInTheDocument();
    const email = await screen.findByRole('textbox', {
      key: 'registration_form_email_text'
    });
    expect(email).toBeInTheDocument();

    const acceptButton = await screen.findByRole('button', {
      key: 'registration_form_next_button'
    });
    expect(acceptButton).toBeInTheDocument();

    expect(
      await screen.findByTextKey('registration_form_footer_manage_preference_modal_link_text')
    ).toBeInTheDocument();
    expect(await screen.findByText('Terms Of Use')).toBeInTheDocument();
    expect(await screen.findByText('Privacy Policy')).toBeInTheDocument();
    expect(await screen.findByText('Test Policy')).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });
});

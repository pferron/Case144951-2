import React from 'react';
import { fireEvent, render, within, waitFor } from '@testing-library/react';
import { screen } from 'nucleus-text/testing-library/screen';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import userEvent from '@testing-library/user-event';
import PrivacySettings from '@components/privacy/PrivacySettings';
import { MockedProvider } from '@apollo/client/testing';
import {
  getHubTermsEditPermission,
  GET_HUB_SETTINGS,
  UPDATE_HUB_SETTINGS
} from '@cvent/planner-event-hubs-model/operations/hub';
import { axe } from 'jest-axe';
import { VIDEO_HUB_STATUS_ACTIVE } from '@utils/constants';
import enUS from '../../../../locales/en-US.json';
import 'jest-axe/extend-expect';

const cookieNotificationFeature = [
  {
    name: 'cookieNotificationFeature',
    enabled: true,
    experimentVersion: '1001'
  }
];

const cookieListFeature = [
  {
    name: 'cookieListFeature',
    enabled: true,
    experimentVersion: '1001'
  }
];

const searchEngineVisibility = [
  {
    name: 'searchEngineVisibility',
    enabled: true,
    experimentVersion: '1001'
  }
];

interface RouterProps {
  pathname: string;
  route: string;
  query: {
    isSuccess: boolean;
  };
}

jest.mock('next/router', () => ({
  useRouter(): RouterProps {
    return {
      pathname: '/path',
      route: '/route',
      query: { isSuccess: true }
    };
  }
}));

jest.mock('@hooks/useCenterInfo', () => ({
  useCenterInfo: () => {
    return {
      hubStatus: VIDEO_HUB_STATUS_ACTIVE
    };
  }
}));

const mocks = [
  {
    request: {
      query: GET_HUB_SETTINGS,
      variables: {
        id: {
          id: 'test-video-hub'
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
          ccpaLinkExplanationText: 'ccpa explanation text',
          memberProfilePublic: false,
          profileCard: null
        }
      }
    }
  },

  {
    request: {
      query: GET_HUB_SETTINGS,
      variables: {
        id: {
          id: 'cookie-list-test-video-hub'
        }
      }
    },
    result: {
      data: {
        getHubSettings: {
          displayCventPrivacyPolicy: false,
          cventPrivacyPolicyLinkText: 'hello 2',
          displayPrivacyPolicy: true,
          privacyPolicyUrl: 'www.privacyPolicy.com',
          privacyPolicyLinkText: 'privacy policy',
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
          ccpaLinkExplanationText: 'ccpa explanation text',
          memberProfilePublic: false,
          profileCard: null,
          cookieLists: {
            enableCvent: true,
            cventUrl: 'https://www.cvent.com/en/appcookies',
            enableCustom: true,
            customUrl: 'https://www.customCookieUrl.com',
            customLinkText: 'custom cookie link text'
          }
        }
      }
    }
  },
  {
    request: {
      query: GET_HUB_SETTINGS,
      variables: {
        id: {
          id: 'test-video-hub-ccpa'
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
          ccpaEnableDoNotSell: true,
          ccpaConfirmationText: 'confirmation text',
          ccpaSubmitButtonText: 'ccpa do no sell',
          ccpaDoNotSellUrlEnabled: true,
          ccpaLinkText: 'Do Not Sell My Personal Information',
          ccpaDoNotSellUrl: 'www.cvent.com',
          ccpaLinkExplanationText: 'ccpa explanation text',
          memberProfilePublic: false,
          profileCard: null
        }
      }
    }
  },
  {
    request: {
      query: UPDATE_HUB_SETTINGS,
      variables: {
        input: {
          id: 'cookie-list-test-video-hub',
          hubSettings: {
            displayCventPrivacyPolicy: false,
            cventPrivacyPolicyLinkText: '',
            displayPrivacyPolicy: true,
            privacyPolicyUrl: 'https://www.privacyPolicy.com',
            privacyPolicyLinkText: 'privacy policy',
            displayTermsLinkOnFooter: false,
            termsLinkText: '',
            displayTermsOnLogin: false,
            termsText: '',
            notifyUsersAboutCookie: false,
            displayCventPrivacyPolicyInCookie: false,
            allowTurnOffCookies: false,
            ccpaEnableDoNotSell: false,
            ccpaLinkText: 'Do Not Sell My Personal Information',
            ccpaDoNotSellUrl: '',
            ccpaLinkExplanationText:
              'If You Are a California resident, you have the right to opt-out of the “sale” or “sharing” of your personal information. If you are a resident of other states like Virginia, Colorado, Utah, and Connecticut, such states may or will provide similar consumer rights. By selecting “Do Not Sell or Share My Personal Information” below you are making a choice to limit the data we share about you with other companies. You can learn more about for your privacy rights, other methods of submitting your opt-out requests, and how we handle your personal information in our privacy policy.',
            memberProfilePublic: false,
            profileCard: null,
            cookieLists: {
              enableCvent: true,
              cventUrl: 'https://www.cvent.com/en/appcookies',
              enableCustom: true,
              customUrl: 'https://www.newCookieListUrl.com',
              customLinkText: 'custom cookie link text'
            }
          }
        }
      }
    },
    result: {
      data: {
        getHubSettings: {
          displayCventPrivacyPolicy: false,
          cventPrivacyPolicyLinkText: 'hello 2',
          displayPrivacyPolicy: true,
          privacyPolicyUrl: 'www.privacyPolicy.com',
          privacyPolicyLinkText: 'privacy policy',
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
          ccpaLinkExplanationText: 'ccpa explanation text',
          memberProfilePublic: false,
          profileCard: null,
          cookieLists: {
            enableCvent: true,
            cventUrl: 'https://www.cvent.com/en/appcookies',
            enableCustom: true,
            customUrl: 'https://www.customCookieUrl.com',
            customLinkText: 'custom cookie link text'
          }
        }
      }
    }
  },
  {
    request: {
      query: UPDATE_HUB_SETTINGS,
      variables: {
        input: {
          id: 'test-video-hub-ccpa',
          hubSettings: {
            displayCventPrivacyPolicy: false,
            cventPrivacyPolicyLinkText: '',
            displayPrivacyPolicy: false,
            privacyPolicyUrl: '',
            privacyPolicyLinkText: '',
            displayTermsLinkOnFooter: false,
            termsLinkText: '',
            displayTermsOnLogin: false,
            termsText: '',
            notifyUsersAboutCookie: false,
            displayCventPrivacyPolicyInCookie: false,
            allowTurnOffCookies: false,
            ccpaEnableDoNotSell: true,
            ccpaConfirmationText: 'confirmation text',
            ccpaSubmitButtonText: 'ccpa do no sell',
            ccpaDoNotSellUrlEnabled: true,
            ccpaLinkText: 'New Link Text here',
            ccpaDoNotSellUrl: 'https://www.cvent.com',
            ccpaLinkExplanationText: 'ccpa explanation text',
            memberProfilePublic: false,
            profileCard: null,
            cookieLists: { customUrl: null }
          }
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
          ccpaLinkExplanationText: 'ccpa explanation text',
          memberProfilePublic: false,
          profileCard: null,
          showLogo: true,
          registrationBackground: 'DEFAULT'
        }
      }
    }
  },
  {
    request: {
      query: GET_HUB_SETTINGS,
      variables: {
        id: {
          id: 'test-video-hub-privacy-settings'
        }
      }
    },
    result: {
      data: {
        getHubSettings: {
          displayCventPrivacyPolicy: true,
          cventPrivacyPolicyLinkText: 'hello 2',
          displayPrivacyPolicy: true,
          privacyPolicyUrl: 'www.google.com',
          privacyPolicyLinkText: 'Link Text',
          displayTermsLinkOnFooter: true,
          termsLinkText: '',
          displayTermsOnLogin: false,
          termsText: '',
          notifyUsersAboutCookie: true,
          displayCventPrivacyPolicyInCookie: false,
          allowTurnOffCookies: false,
          ccpaEnableDoNotSell: true,
          ccpaConfirmationText: 'confirmation text',
          ccpaSubmitButtonText: 'ccpa do no sell',
          ccpaDoNotSellUrlEnabled: false,
          ccpaLinkText: 'Do Not Sell My Personal Information',
          ccpaDoNotSellUrl: 'www.cvent.com',
          ccpaLinkExplanationText: 'ccpa explanation text',
          memberProfilePublic: false,
          profileCard: null
        }
      }
    }
  },
  {
    request: {
      query: getHubTermsEditPermission,
      variables: {
        id: {
          id: 'test-video-hub'
        }
      }
    },
    result: {
      data: {
        getHubTermsEditPermission: 'NOT_ALLOWED'
      }
    }
  }
];

describe('Privacy Settings', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders privacy policy component', async () => {
    const { container } = render(
      <TestWrapper>
        <MockedProvider mocks={mocks}>
          <PrivacySettings videoHubId="test-video-hub" videoHubTitle="test" />
        </MockedProvider>
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId('privacy-settings-container')).toBeInTheDocument();
    });
    const privacyComponent = within(screen.getByTestId('edit-privacy-policy-fields'));
    expect(privacyComponent).toBeDefined();
    expect(await screen.findByTextKey('privacy_display_your_privacy')).toBeInTheDocument();
    expect(await screen.findByTextKey('privacy_display_cvent_privacy')).toBeInTheDocument();
    expect(screen.getByTestId('edit-privacy-policy-fields')).toBeInTheDocument();
    expect(await screen.findByTextKey('privacy_display_your_privacy')).toBeInTheDocument();
    const policyCard = within(screen.getByTestId('edit-privacy-policy-fields'));
    expect(policyCard).toBeDefined();
    const displayCventPrivacyPolicyYes = policyCard.getByTestId('cvent-privacy-radio__1');
    const displayCventPrivacyPolicyNo = policyCard.getByTestId('cvent-privacy-radio__0');
    const displayYourPrivacyPolicyYes = policyCard.getByTestId('your-privacy-radio__1');
    const displayYourPrivacyPolicyNo = policyCard.getByTestId('your-privacy-radio__0');
    expect(displayCventPrivacyPolicyYes).not.toBeChecked();
    expect(displayCventPrivacyPolicyNo).toBeChecked();
    expect(displayYourPrivacyPolicyYes).not.toBeChecked();
    expect(displayYourPrivacyPolicyNo).toBeChecked();

    // link text input visible as per the radio selection
    const input = screen.queryByRole('textbox', { name: /cvent-privacy-link-text-input/i });
    expect(input).not.toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders cookie notification component with cookieList feature on', async () => {
    const { container } = render(
      <TestWrapper appFeatures={cookieListFeature}>
        <MockedProvider mocks={mocks}>
          <PrivacySettings videoHubId="cookie-list-test-video-hub" videoHubTitle="test" />
        </MockedProvider>
      </TestWrapper>
    );
    await waitFor(() => {
      expect(screen.getByTestId('privacy-settings-container')).toBeInTheDocument();
    });
    expect(await screen.findByTextKey('privacy_notify_users_about_cookies')).toBeInTheDocument();
    expect(await screen.findByTextKey('cookie_notification_display_cookie_text')).toBeInTheDocument();
    const cookieComponent = within(screen.getByTestId('edit-cookie-notification-fields'));
    expect(cookieComponent).toBeDefined();
    expect(await screen.findByTextKey('cookie_notification_display_cookie_text')).toBeInTheDocument();
    expect(await screen.findByTextKey('your_company_privacy_policy_text')).toBeInTheDocument();
    expect(await screen.findByTextKey('your_company_cookie_list_text')).toBeInTheDocument();
    expect(await screen.findByTextKey('cvent_cookie_list_text')).toBeInTheDocument();

    const cookieListUrlInput = await screen.findByRole('textbox', {
      key: 'privacy_your_cookie_list_url_label'
    });
    expect(cookieListUrlInput).toHaveValue('https://www.customCookieUrl.com');

    await userEvent.clear(cookieListUrlInput);
    await userEvent.type(cookieListUrlInput, 'www.newCookieListUrl.com');
    const saveButton = screen.getByTestId('header-actions__save');
    expect(saveButton).toBeInTheDocument();
    fireEvent.click(saveButton);
    await waitFor(() => {
      expect(cookieListUrlInput).toHaveValue('www.newCookieListUrl.com');
    });
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders privacy policy component - edit enabled', async () => {
    const { container } = render(
      <TestWrapper>
        <MockedProvider mocks={mocks}>
          <PrivacySettings videoHubId="test-video-hub-privacy-settings" videoHubTitle="test" />
        </MockedProvider>
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId('privacy-settings-container')).toBeInTheDocument();
    });
    const privacyComponent = within(screen.getByTestId('edit-privacy-policy-fields'));
    expect(privacyComponent).toBeDefined();

    const privacyPolicyLinkTextbox = await screen.findByRole('textbox', {
      key: 'cvent-privacy-link-text-input'
    });
    expect(privacyPolicyLinkTextbox).toBeInTheDocument();
    expect(privacyPolicyLinkTextbox).toHaveValue('hello 2');

    await userEvent.clear(privacyPolicyLinkTextbox);
    const saveButton = screen.getByTestId('header-actions__save');
    expect(saveButton).toBeInTheDocument();
    await fireEvent.click(saveButton);
    await waitFor(() => {
      expect(
        screen.getByTextKey('privacy_settings_add_alert_text', {
          fieldName: 'Link text'
        })
      ).toBeInTheDocument();
    });
    await userEvent.type(privacyPolicyLinkTextbox, 'New Link Text here');
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders invalid privacy policy url error', async () => {
    const { container } = render(
      <TestWrapper>
        <MockedProvider mocks={mocks}>
          <PrivacySettings videoHubId="test-video-hub-privacy-settings" videoHubTitle="test" />
        </MockedProvider>
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId('privacy-settings-container')).toBeInTheDocument();
    });

    const privacyComponent = within(screen.getByTestId('edit-privacy-policy-fields'));
    expect(privacyComponent).toBeDefined();
    const saveButton = screen.getByTestId('header-actions__save');
    expect(saveButton).toBeInTheDocument();

    const privacyPolicyUrlTextbox = await screen.findByRole('textbox', {
      key: 'privacy_your_privacy_link_label'
    });
    expect(privacyPolicyUrlTextbox).toBeInTheDocument();
    await userEvent.clear(privacyPolicyUrlTextbox);

    fireEvent.click(saveButton);
    await waitFor(() => {
      expect(privacyComponent.getByText('Invalid URL')).toBeInTheDocument();
    });
    expect(
      await screen.findByTextKey('privacy_settings_add_alert_text_invalid_link', {
        fieldName: 'Privacy policy URL'
      })
    ).toBeInTheDocument();
    await userEvent.type(privacyPolicyUrlTextbox, 'www.google.com');
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders cookie notifications page -edit enabled', async () => {
    const { container } = render(
      <TestWrapper>
        <MockedProvider mocks={mocks}>
          <PrivacySettings videoHubId="test-video-hub-privacy-settings" videoHubTitle="test" />
        </MockedProvider>
      </TestWrapper>
    );
    await waitFor(() => {
      expect(screen.getByTestId('privacy-settings-container')).toBeInTheDocument();
    });
    expect(await screen.findByTextKey('privacy_notify_users_about_cookies')).toBeInTheDocument();
    const cookieComponent = within(screen.getByTestId('edit-cookie-notification-fields'));
    expect(cookieComponent).toBeDefined();

    const cookieCard = within(screen.getByTestId('edit-cookie-notification-fields'));
    expect(cookieCard).toBeDefined();
    const notifyAboutCookieYes = cookieCard.getByTestId('cvent-cookie-radio__1');
    const notifyAboutCookieNo = cookieCard.getByTestId('cvent-cookie-radio__0');
    expect(notifyAboutCookieYes).toBeChecked();
    expect(notifyAboutCookieNo).not.toBeChecked();
    expect(await screen.findByTextKey('privacy_display_link_cookie')).toBeInTheDocument();
    expect(await screen.findByTextKey('privacy_allow_turnoff_cookies')).toBeInTheDocument();

    const displayCventPolicyYes = cookieCard.getByTestId('cvent-privacy-radio__1');
    const displayCventPolicyNo = cookieCard.getByTestId('cvent-privacy-radio__0');
    expect(displayCventPolicyYes).not.toBeChecked();
    expect(displayCventPolicyNo).toBeChecked();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders ccpa enabled page', async () => {
    const { container } = render(
      <TestWrapper appFeatures={cookieNotificationFeature}>
        <MockedProvider mocks={mocks}>
          <PrivacySettings videoHubId="test-video-hub-ccpa" videoHubTitle="test" />
        </MockedProvider>
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId('privacy-settings-container')).toBeInTheDocument();
    });
    const ccpaComponent = within(screen.getByTestId('edit-ccpa-fields'));
    expect(await screen.findByTextKey('privacy_ccpa_donotsell')).toBeInTheDocument();
    expect(await screen.findByTextKey('privacy_ccpa_link_text')).toBeInTheDocument();
    expect(await screen.findByTextKey('ccpa_explanation_text')).toBeInTheDocument();
    expect(ccpaComponent.getByText(/ccpa explanation text/)).toBeInTheDocument();
    expect(await screen.findByTextKey('privacy_ccpa_button_text')).toBeInTheDocument();
    expect(await screen.findByTextKey('privacy_ccpa_confirmation_text')).toBeInTheDocument();
    expect(await screen.findByTextKey('ccpa_dns_share_url_text')).toBeInTheDocument();
    expect(await screen.findByTextKey('ccpa_enable_dns_link_text')).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders ccpa enabled page radio buttons and textbox in edit state', async () => {
    const { container } = render(
      <TestWrapper appFeatures={cookieNotificationFeature}>
        <MockedProvider mocks={mocks}>
          <PrivacySettings videoHubId="test-video-hub-ccpa" videoHubTitle="test" />
        </MockedProvider>
      </TestWrapper>
    );

    const ccpaLinkTextbox = await screen.findByRole('textbox', {
      key: 'privacy_ccpa_link_text'
    });
    expect(ccpaLinkTextbox).toBeInTheDocument();
    expect(ccpaLinkTextbox).toHaveValue('Do Not Sell My Personal Information');
    await userEvent.clear(ccpaLinkTextbox);
    const saveButton = screen.getByTestId('header-actions__save');
    expect(saveButton).toBeInTheDocument();
    fireEvent.click(saveButton);
    await waitFor(() => {
      expect(
        screen.getByTextKey('privacy_settings_add_alert_text', {
          fieldName: 'Link Text'
        })
      ).toBeInTheDocument();
    });
    await userEvent.type(ccpaLinkTextbox, 'New Link Text here');
    expect(ccpaLinkTextbox).toHaveValue('New Link Text here');
    fireEvent.click(saveButton);
    await waitFor(() => {
      expect(screen.getByTextKey('privacy_settings_update_alert_text')).toBeInTheDocument();
    });
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders ccpa enabled page button textbox in edit state', async () => {
    const { container } = render(
      <TestWrapper appFeatures={cookieNotificationFeature}>
        <MockedProvider mocks={mocks}>
          <PrivacySettings videoHubId="test-video-hub-ccpa" videoHubTitle="test" />
        </MockedProvider>
      </TestWrapper>
    );

    const ccpaButtonTextbox = await screen.findByRole('textbox', {
      key: 'privacy_ccpa_button_text'
    });
    expect(ccpaButtonTextbox).toBeInTheDocument();
    expect(ccpaButtonTextbox).toHaveValue('ccpa do no sell');
    await userEvent.clear(ccpaButtonTextbox);
    await userEvent.type(ccpaButtonTextbox, 'New Button Text here');
    expect(ccpaButtonTextbox).toHaveValue('New Button Text here');
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders ccpa enabled page confirmation textbox in edit state', async () => {
    const { container } = render(
      <TestWrapper appFeatures={cookieNotificationFeature}>
        <MockedProvider mocks={mocks}>
          <PrivacySettings videoHubId="test-video-hub-ccpa" videoHubTitle="test" />
        </MockedProvider>
      </TestWrapper>
    );

    const ccpaConfirmationTextbox = await screen.findByRole('textbox', {
      key: 'privacy_ccpa_confirmation_text'
    });
    expect(ccpaConfirmationTextbox).toBeInTheDocument();
    expect(ccpaConfirmationTextbox).toHaveValue('confirmation text');
    await userEvent.clear(ccpaConfirmationTextbox);
    await userEvent.type(ccpaConfirmationTextbox, 'Thank you for confirmation');
    expect(ccpaConfirmationTextbox).toHaveValue('Thank you for confirmation');

    await userEvent.clear(ccpaConfirmationTextbox);
    const saveButton = screen.getByTestId('header-actions__save');
    expect(saveButton).toBeInTheDocument();
    fireEvent.click(saveButton);
    await waitFor(() => {
      expect(
        screen.getByTextKey('privacy_settings_add_alert_text', {
          fieldName: 'Confirmation Text'
        })
      ).toBeInTheDocument();
    });
    await userEvent.type(ccpaConfirmationTextbox, 'Thank you for confirmation');
    expect(await axe(container)).toHaveNoViolations();
  }, 40000);

  it('renders ccpa enabled page - dns URL in edit state', async () => {
    const { container } = render(
      <TestWrapper appFeatures={cookieNotificationFeature}>
        <MockedProvider mocks={mocks}>
          <PrivacySettings videoHubId="test-video-hub-ccpa" videoHubTitle="test" />
        </MockedProvider>
      </TestWrapper>
    );
    const ccpaEnabledDnsLink = await screen.findByTestId('ccpa-dns-link-radio__div__1');
    expect(ccpaEnabledDnsLink).toBeEnabled();

    const ccpaDnsUrlTextbox = await screen.findByRole('textbox', {
      key: 'ccpa_dns_share_url_text'
    });
    expect(ccpaDnsUrlTextbox).toBeInTheDocument();
    expect(ccpaDnsUrlTextbox).toHaveValue('www.cvent.com');
    await userEvent.clear(ccpaDnsUrlTextbox);
    await userEvent.type(ccpaDnsUrlTextbox, 'google.com');
    expect(ccpaDnsUrlTextbox).toHaveValue('google.com');
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders ccpa enabled page - shows invalid url error for empty url', async () => {
    const { container } = render(
      <TestWrapper appFeatures={cookieNotificationFeature}>
        <MockedProvider mocks={mocks}>
          <PrivacySettings videoHubId="test-video-hub-ccpa" videoHubTitle="test" />
        </MockedProvider>
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId('privacy-settings-container')).toBeInTheDocument();
    });
    const ccpaComponent = within(screen.getByTestId('edit-ccpa-fields'));
    expect(ccpaComponent).toBeDefined();
    const ccpaExplanationTextbox = screen.getByTestId('ccpa-explanation-text-fieldset');
    expect(ccpaExplanationTextbox).toBeInTheDocument();
    const ccpaEnabledDnsLink = await screen.findByTestId('ccpa-dns-link-radio__div__1');
    expect(ccpaEnabledDnsLink).toBeEnabled();

    const ccpaDnsUrlTextbox = await screen.findByRole('textbox', {
      key: 'ccpa_dns_share_url_text'
    });
    expect(ccpaDnsUrlTextbox).toBeInTheDocument();
    await userEvent.clear(ccpaDnsUrlTextbox);

    const saveButton = screen.getByTestId('header-actions__save');
    expect(saveButton).toBeInTheDocument();
    fireEvent.click(saveButton);
    await waitFor(() => {
      expect(ccpaComponent.getByText('Invalid URL')).toBeInTheDocument();
    });
    expect(
      await screen.findByTextKey('privacy_settings_add_alert_text_invalid_link', {
        fieldName: 'Do Not Sell or Share URL'
      })
    ).toBeInTheDocument();
    const dismissButton = await screen.findByRole('button', {
      key: 'Dismiss'
    });
    expect(dismissButton).toBeInTheDocument();
    fireEvent.click(dismissButton);
    expect(dismissButton).not.toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders ccpa enabled page without ccpa dns link enabled', async () => {
    const { container } = render(
      <TestWrapper appFeatures={cookieNotificationFeature}>
        <MockedProvider mocks={mocks}>
          <PrivacySettings videoHubId="test-video-hub-privacy-settings" videoHubTitle="test" />
        </MockedProvider>
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId('privacy-settings-container')).toBeInTheDocument();
    });
    const ccpaComponent = within(screen.getByTestId('edit-ccpa-fields'));
    expect(ccpaComponent).toBeDefined();
    expect(await screen.findByTextKey('privacy_ccpa_donotsell')).toBeInTheDocument();

    expect(await screen.findByTextKey('ccpa_enable_dns_link_text')).toBeInTheDocument();
    expect(screen.queryByTextKey('ccpa-dns-url-text-question')).not.toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders ccpa enabled page -edit enabled', async () => {
    const { container } = render(
      <TestWrapper>
        <MockedProvider mocks={mocks}>
          <PrivacySettings videoHubId="test-video-hub-ccpa" videoHubTitle="test" />
        </MockedProvider>
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId('privacy-settings-container')).toBeInTheDocument();
    });
    expect(await screen.findByTextKey('privacy_ccpa_donotsell')).toBeInTheDocument();
    const editCcpaComponent = within(screen.getByTestId('edit-ccpa-fields'));
    expect(editCcpaComponent).toBeDefined();
    expect(await screen.findByTestId('ccpa-radio-group')).toBeInTheDocument();
    const displayCCPAYes = editCcpaComponent.getByTestId('ccpa-radio-group__1');
    const displayCCPANo = editCcpaComponent.getByTestId('ccpa-radio-group__0');
    expect(displayCCPAYes).toBeChecked();
    expect(displayCCPANo).not.toBeChecked();
    expect(await screen.findByTextKey('ccpa_explanation_text')).toBeInTheDocument();
    expect(await screen.findByTextKey('privacy_ccpa_link_text')).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders terms of use component page - edit disabled', async () => {
    const { container } = render(
      <TestWrapper>
        <MockedProvider mocks={mocks}>
          <PrivacySettings videoHubId="test-video-hub" videoHubTitle="test" />
        </MockedProvider>
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId('privacy-settings-container')).toBeInTheDocument();
    });
    expect(await screen.findByTextKey('privacy_termsofuse_displayfooterlink')).toBeInTheDocument();
    const termsOfUseComponent = within(screen.getByTestId('edit-termsofuse-fields'));
    expect(termsOfUseComponent).toBeDefined();
    const displayTermsOnFooterAnswer = screen.getByTestId('termsofuse-linkinfooter-radio__div__0');
    expect(displayTermsOnFooterAnswer).toHaveTextContent(enUS.privacy_setttings_option_no);
    const firstInput = screen.queryByRole('textbox', { name: /cvent-termsofuse-link-text-input/i });
    expect(firstInput).not.toBeInTheDocument();
    const displayTermsOnLoginAnswer = screen.queryByTestId('displayTermsOnLogin-answer');
    expect(displayTermsOnLoginAnswer).not.toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders terms of use component page - edit enabled', async () => {
    const mock = {
      request: {
        query: getHubTermsEditPermission,
        variables: {
          id: {
            id: 'test-video-hub'
          }
        }
      },
      result: {
        data: {
          getHubTermsEditPermission: 'ALLOWED'
        }
      }
    };
    const localMocks = [mocks[0], mock];
    const { container } = render(
      <TestWrapper>
        <MockedProvider mocks={localMocks}>
          <PrivacySettings videoHubId="test-video-hub" videoHubTitle="test" />
        </MockedProvider>
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId('privacy-settings-container')).toBeInTheDocument();
    });
    expect(await screen.findByTextKey('privacy_termsofuse_displayfooterlink')).toBeInTheDocument();
    const editTermsOfUseComponent = within(screen.getByTestId('edit-termsofuse-fields'));
    expect(editTermsOfUseComponent).toBeDefined();
    const displayTermsOnFooterYes = editTermsOfUseComponent.getByTestId('termsofuse-linkinfooter-radio__1');
    const displayTermsOnFooterNo = editTermsOfUseComponent.getByTestId('termsofuse-linkinfooter-radio__0');
    expect(displayTermsOnFooterYes).not.toBeChecked();
    expect(displayTermsOnFooterNo).toBeChecked();
    fireEvent.click(displayTermsOnFooterYes);
    const displayTermsOnLoginYes = editTermsOfUseComponent.getByTestId('termsofuse-displayvisitorlogin-radio__1');
    const displayTermsOnLoginNo = editTermsOfUseComponent.getByTestId('termsofuse-displayvisitorlogin-radio__0');
    expect(displayTermsOnLoginYes).not.toBeChecked();
    expect(displayTermsOnLoginNo).toBeChecked();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders terms of use component page - link text and content enabled', async () => {
    const { container } = render(
      <TestWrapper>
        <MockedProvider mocks={mocks}>
          <PrivacySettings videoHubId="test-video-hub-privacy-settings" videoHubTitle="test" />
        </MockedProvider>
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId('privacy-settings-container')).toBeInTheDocument();
    });
    expect(await screen.findByTextKey('privacy_termsofuse_displayfooterlink')).toBeInTheDocument();
    const termsOfUseComponent = within(screen.getByTestId('edit-termsofuse-fields'));
    expect(termsOfUseComponent).toBeDefined();

    const termsOfUseLinkTextbox = await screen.findByRole('textbox', {
      key: 'cvent-termsofuse-link-text-input'
    });
    expect(termsOfUseLinkTextbox).toBeInTheDocument();
    await userEvent.type(termsOfUseLinkTextbox, 'Link Text');
    expect(termsOfUseLinkTextbox).toHaveValue('Link Text');

    await userEvent.clear(termsOfUseLinkTextbox);
    const saveButton = screen.getByTestId('header-actions__save');
    expect(saveButton).toBeInTheDocument();
    fireEvent.click(saveButton);
    await waitFor(() => {
      expect(
        screen.getByTextKey('privacy_settings_add_alert_text', {
          fieldName: 'Link text'
        })
      ).toBeInTheDocument();
    });
    await userEvent.type(termsOfUseLinkTextbox, 'New Link Text');
    expect(termsOfUseLinkTextbox).toHaveValue('New Link Text');
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders search engine visibility component when hub is active', async () => {
    const { container } = render(
      <TestWrapper appFeatures={searchEngineVisibility}>
        <MockedProvider mocks={mocks}>
          <PrivacySettings videoHubId="test-video-hub-privacy-settings" videoHubTitle="test" />
        </MockedProvider>
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId('privacy-settings-container')).toBeInTheDocument();
    });
    expect(await screen.findByTextKey('privacy_search_engine_visibility_heading')).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });
});

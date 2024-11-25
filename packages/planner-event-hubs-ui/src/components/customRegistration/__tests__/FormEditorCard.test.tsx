import { fireEvent, render, waitFor } from '@testing-library/react';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import React from 'react';
import { screen } from 'nucleus-text/testing-library/screen';
import FormEditorCard from '@components/customRegistration/FormEditorCard';
import {
  getAccountAndCustomFontInformation,
  getHubCodeSnippets,
  getRegistrationFormSettings,
  GET_HUB_SETTINGS,
  UPDATE_BACKGROUND_IMAGES,
  UPDATE_HUB_SETTINGS,
  UPDATE_REGISTRATION_FORM_SETTINGS,
  UPDATE_VIDEO_HUB
} from '@cvent/planner-event-hubs-model/operations/hub';
import { getAccountCodeSnippets } from '@cvent/planner-event-hubs-model/operations/snapshot';
import { MockedProvider } from '@apollo/client/testing';
import { BackGroundStyle } from '@cvent/planner-event-hubs-model/types';
import { AppFeaturesProvider } from '@components/AppFeaturesProvider';
import { accountConfig } from '@cvent/planner-event-hubs-model/src/operations/coreSOA';
import { accountCodeSnippet } from '@components/tracking-codes/fixtures/CodeSnippetData';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import 'jest-axe/extend-expect';

const singleSignOnFeatureOn = [
  {
    name: 'singleSignOnFeature',
    enabled: true,
    experimentVersion: '1001'
  },
  {
    name: 'cookieNotificationFeature',
    enabled: true,
    experimentVersion: '1001'
  }
];

const singleSignOnFeatureOff = [
  {
    name: 'singleSignOnFeature',
    enabled: false,
    experimentVersion: '1001'
  },
  {
    name: 'cookieNotificationFeature',
    enabled: true,
    experimentVersion: '1001'
  }
];

interface RouterProps {
  asPath: string;
  pathname: string;
  route: string;
  query: {
    isSuccess: boolean;
    'video-center': string;
  };
  replace: () => void;
}

const hubId = 'hubId';
const hubTitle = 'test';
jest.mock('next/router', () => ({
  useRouter(): RouterProps {
    return {
      asPath: 'eventsplus',
      pathname: '/path',
      route: '/route',
      query: { isSuccess: true, 'video-center': hubId },
      replace: jest.fn()
    };
  }
}));

jest.mock('next/config', () => () => ({
  publicRuntimeConfig: {
    VIDEO_HUB_WEB: 'https://dummy.com/'
  }
}));

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
        bodyFont: null,
        backgroundImageAltText: 'Black Image',
        backgroundImageUrl:
          'https://images-lower.cvent.com/S606/f6d746482c09496fa3e3e3f6cd1503a0/video-center/55113f0a-9f28-4257-8c0e-3ca34f44c4b9/banner/48b8279e-36af-4324-b5b3-2055911a815a/69f8c46a294a908fff6c5c83df6af5c8!_!56c9871d97eb0444b64299d9a13a6225.png',
        backgroundOriginalImageUrl:
          'https://silo606-custom.core.cvent.org/f6d746482c09496fa3e3e3f6cd1503a0/video-center/55113f0a-9f28-4257-8c0e-3ca34f44c4b9/banner/48b8279e-36af-4324-b5b3-2055911a815a/connections.png'
      },
      config: {
        loginType: 'SSO',
        organizationId: 'TestId'
      }
    })
  };
});

const mocks = [
  {
    request: {
      query: getRegistrationFormSettings,
      variables: {
        input: {
          hubId
        }
      }
    },
    result: {
      data: {
        getRegistrationFormSettings: {
          data: [
            {
              included: true,
              order: 1,
              code: 'JOB_TITLE',
              required: false
            },
            {
              included: true,
              order: 2,
              code: 'COMPANY',
              required: false
            },
            {
              included: true,
              order: 3,
              code: 'PHONE_NUMBER',
              required: false
            }
          ]
        }
      }
    }
  },
  {
    request: {
      query: GET_HUB_SETTINGS,
      variables: {
        id: {
          id: hubId
        }
      }
    },
    result: {
      data: {
        getHubSettings: {
          guestVisibility: 'VIDEO_PLAYBACK_PRIVATE',
          registrationSettings: {
            allowAllContactsRegistration: false,
            allowContactGroupsRegistration: false,
            allowContactTypesRegistration: false,
            blockContactsRegistration: false,
            blockListRegistration: false,
            allowedEmailDomain: 'ANY_DOMAIN'
          },
          showLogo: false,
          registrationBackground: 'DEFAULT',
          decorativeImage: true
        }
      }
    }
  },
  {
    request: {
      query: GET_HUB_SETTINGS,
      variables: {
        id: {
          id: 'testDeleteImage'
        }
      }
    },
    result: {
      data: {
        getHubSettings: {
          guestVisibility: 'VIDEO_PLAYBACK_PRIVATE',
          registrationSettings: {
            allowAllContactsRegistration: false,
            allowContactGroupsRegistration: false,
            allowContactTypesRegistration: false,
            blockContactsRegistration: false,
            blockListRegistration: false,
            allowedEmailDomain: 'ANY_DOMAIN'
          },
          showLogo: true,
          registrationBackground: 'IMAGE',
          decorativeImage: false,
          ccpaDoNotSellUrlEnabled: true,
          ccpaDoNotSellUrl: 'www.test.com',
          ccpaEnableDoNotSell: true,
          ccpaLinkText: 'test'
        }
      }
    }
  },
  {
    request: {
      query: UPDATE_REGISTRATION_FORM_SETTINGS,
      variables: {
        input: {
          hubId,
          data: [
            {
              included: true,
              order: 1,
              code: 'JOB_TITLE',
              required: false
            },
            {
              included: true,
              order: 2,
              code: 'COMPANY',
              required: false
            },
            {
              included: true,
              order: 3,
              code: 'ADDRESS',
              required: false
            },
            {
              included: false,
              order: 4,
              code: 'PHONE_NUMBER',
              required: false
            }
          ]
        }
      }
    },
    result: {
      data: {
        updateRegistrationFormSettings: {
          data: [
            {
              included: true,
              order: 1,
              code: 'JOB_TITLE',
              required: false
            },
            {
              included: true,
              order: 2,
              code: 'COMPANY',
              required: false
            },
            {
              included: true,
              order: 3,
              code: 'ADDRESS',
              required: false
            },
            {
              included: false,
              order: 3,
              code: 'PHONE_NUMBER',
              required: false
            }
          ]
        }
      }
    }
  },
  {
    request: {
      query: GET_HUB_SETTINGS,
      variables: {
        id: {
          id: 'testPreview'
        }
      }
    },
    result: {
      data: {
        getHubSettings: {
          showLogo: true,
          registrationBackground: 'IMAGE'
        }
      }
    }
  },
  {
    request: {
      query: accountConfig
    },
    result: {
      data: {
        accountConfig: {
          AccountFeatures: {
            GeneralFeatures: {
              AllowCodeSnippets: true,
              AllowGoogleAnalytics: true,
              AllowOAuth: true
            }
          }
        }
      }
    }
  },
  {
    request: {
      query: getAccountCodeSnippets
    },
    result: {
      data: {
        getAccountCodeSnippets: {
          allowCodeSnippets: true,
          accountCodeSnippets: accountCodeSnippet
        }
      }
    }
  },
  {
    request: {
      query: getHubCodeSnippets,
      variables: {
        hubId: 'testPreview'
      }
    },
    result: {
      data: {
        getHubCodeSnippets: [
          {
            codeSnippetId: '3ce1554f-5ecc-4182-b838-e20ad46c8a7b',
            applicableOn: 'ALL_PAGES',
            targetWebPages: ['ALL_VC_PAGES', 'LOGIN']
          }
        ]
      }
    }
  },
  {
    request: {
      query: getAccountAndCustomFontInformation
    },
    result: {
      data: {
        getAccountSnapshot: {
          customFonts: [
            {
              id: 'dbfdda94-e15e-448e-94f1-af817cd312b2',
              fontFamily: 'NotoSansKawi',
              fallbackFontId: 4,
              fallbackFont: 'Arial',
              files: [
                {
                  url: 'https://custom.t2.cvent.com/807375F205AE484B973E19C4467DA80F/files/2ee22065261d4ae7ba78e9e9ec7aee82.ttf',
                  fontStyle: 'normal',
                  fontWeight: 400
                }
              ],
              isActive: true
            },
            {
              id: '3bf18695-81f5-4b5b-ac0a-cf1e69d17c0c',
              fontFamily: 'Agbalumo',
              fallbackFontId: 4,
              fallbackFont: 'Arial',
              files: [
                {
                  url: 'https://custom.t2.cvent.com/807375F205AE484B973E19C4467DA80F/files/b68a7dc0ea304ff49b38a4f5a0b61491.ttf',
                  fontStyle: 'normal',
                  fontWeight: 400
                }
              ],
              isActive: true
            }
          ]
        },
        accountConfig: {
          AccountFeatures: {
            GeneralFeatures: {
              AllowCustomFonts: true,
              AllowCodeSnippets: true,
              AllowOAuth: true
            }
          }
        }
      }
    }
  },
  {
    request: {
      query: UPDATE_VIDEO_HUB,
      variables: {
        input: {
          config: {
            loginType: 'SSO',
            organizationId: 'OneLogin'
          }
        }
      }
    },
    result: {
      data: {
        hubUpdate: hubId
      }
    }
  },
  {
    request: {
      query: UPDATE_HUB_SETTINGS,
      variables: {
        input: {
          id: 'testDeleteImage',
          hubSettings: {
            guestVisibility: 'VIDEO_PLAYBACK_PRIVATE',
            registrationSettings: {
              allowAllContactsRegistration: false,
              allowContactGroupsRegistration: false,
              allowContactTypesRegistration: false,
              blockContactsRegistration: false,
              blockListRegistration: false,
              allowedEmailDomain: 'ANY_DOMAIN'
            },
            showLogo: false,
            registrationBackground: BackGroundStyle.Image,
            decorativeImage: false
          }
        }
      }
    },
    result: {
      data: {
        hubUpdateSettings: {
          guestVisibility: 'VIDEO_PLAYBACK_PRIVATE',
          registrationSettings: {
            allowAllContactsRegistration: false,
            allowContactGroupsRegistration: false,
            allowContactTypesRegistration: false,
            blockContactsRegistration: false,
            blockListRegistration: false,
            allowedEmailDomain: 'ANY_DOMAIN'
          },
          showLogo: false,
          registrationBackground: BackGroundStyle.Image,
          decorativeImage: false
        }
      }
    }
  },
  {
    request: {
      query: UPDATE_BACKGROUND_IMAGES,
      variables: {
        input: {
          hubId: 'testDeleteImage',
          backgroundImageUrl: null,
          backgroundOriginalImageUrl: null,
          newBackgroundImageUrl: null,
          newBackgroundOriginalImageUrl: null,
          backgroundImageAltText: 'alt text'
        }
      }
    },
    result: {
      data: {
        updateBackgroundImages: {
          theme: {
            backgroundImageUrl: null,
            backgroundOriginalImageUrl: null,
            backgroundImageAltText: 'alt text'
          }
        }
      }
    }
  },
  {
    request: {
      query: UPDATE_VIDEO_HUB,
      variables: {
        input: {
          config: {
            loginType: 'SSO',
            organizationId: 'Test'
          }
        }
      }
    },
    result: {
      errors: [new Error('some error occurred')],
      data: { hubUpdate: null }
    }
  },
  {
    request: {
      query: getRegistrationFormSettings,
      variables: {
        input: {
          hubId: 'serverError'
        }
      }
    },
    result: {
      data: {
        getRegistrationFormSettings: {
          data: [
            {
              included: true,
              order: 1,
              code: 'JOB_TITLE',
              required: false
            },
            {
              included: true,
              order: 2,
              code: 'COMPANY',
              required: false
            },
            {
              included: true,
              order: 3,
              code: 'PHONE_NUMBER',
              required: false
            }
          ]
        }
      }
    }
  },
  {
    request: {
      query: UPDATE_REGISTRATION_FORM_SETTINGS,
      variables: {
        input: {
          hubId: 'serverError',
          data: [
            { code: 'JOB_TITLE', order: 1, required: false, included: true },
            { code: 'COMPANY', order: 2, required: false, included: true },
            { code: 'ADDRESS', order: 3, required: false, included: false },
            { code: 'PHONE_NUMBER', order: 4, required: false, included: false }
          ]
        }
      }
    },
    result: {
      errors: [new Error('some error occurred')],
      data: { updateRegistrationFormSettings: null }
    }
  }
];

const mocksWithOAuthDisabled = [
  {
    request: {
      query: accountConfig
    },
    result: {
      data: {
        accountConfig: {
          AccountFeatures: {
            GeneralFeatures: {
              AllowOAuth: false
            }
          }
        }
      }
    }
  },
  {
    request: {
      query: getRegistrationFormSettings,
      variables: {
        input: {
          hubId
        }
      }
    },
    result: {
      data: {
        getRegistrationFormSettings: {
          data: [
            {
              included: true,
              order: 1,
              code: 'JOB_TITLE',
              required: false
            },
            {
              included: true,
              order: 2,
              code: 'COMPANY',
              required: false
            },
            {
              included: true,
              order: 3,
              code: 'PHONE_NUMBER',
              required: false
            }
          ]
        }
      }
    }
  },
  {
    request: {
      query: GET_HUB_SETTINGS,
      variables: {
        id: {
          id: hubId
        }
      }
    },
    result: {
      data: {
        getHubSettings: {
          guestVisibility: 'VIDEO_PLAYBACK_PRIVATE',
          registrationSettings: {
            allowAllContactsRegistration: false,
            allowContactGroupsRegistration: false,
            allowContactTypesRegistration: false,
            blockContactsRegistration: false,
            blockListRegistration: false,
            allowedEmailDomain: 'ANY_DOMAIN'
          },
          showLogo: false,
          registrationBackground: 'DEFAULT',
          decorativeImage: true
        }
      }
    }
  }
];

describe('FormEditorCard Tests', () => {
  it('renders Form Editor Card', async () => {
    const { container } = render(
      <TestWrapper>
        <MockedProvider mocks={mocks}>
          <AppFeaturesProvider value={singleSignOnFeatureOn}>
            <FormEditorCard hubId={hubId} hubTitle="test" />
          </AppFeaturesProvider>
        </MockedProvider>
      </TestWrapper>
    );
    expect(await screen.findByTextKey('custom_registration_form_header')).toBeInTheDocument();
    expect(await screen.findByTextKey('custom_registration_form_header_helper_text')).toBeInTheDocument();
    expect(await screen.findByTextKey('custom_registration_form_field_text_field_code_first_name')).toBeInTheDocument();
    expect(await screen.findByTextKey('custom_registration_form_field_text_field_code_last_name')).toBeInTheDocument();
    expect(await screen.findByTextKey('custom_registration_form_field_text_field_code_email')).toBeInTheDocument();
    expect(await screen.findByTextKey('custom_registration_form_field_text_field_code_job_title')).toBeInTheDocument();
    expect(await screen.findByTextKey('custom_registration_form_field_text_field_code_company')).toBeInTheDocument();
    expect(await screen.findByTextKey('custom_registration_checkbox_showlogo_text')).toBeInTheDocument();

    const phoneNumberText = await screen.findByTextKey('custom_registration_form_field_text_field_code_number');
    expect(phoneNumberText).toBeInTheDocument();

    const saveButton = screen.getByRole('button', { key: 'login_settings_page_save_button' });
    expect(saveButton).toBeInTheDocument();
    expect(saveButton).toBeDisabled();

    const deleteOption = screen.getByTestId('custom-reg-reorderable-delete-button-PHONE_NUMBER');
    fireEvent.click(deleteOption);

    await waitFor(() => {
      expect(phoneNumberText).not.toBeInTheDocument();
    });

    const addFieldButton = screen.getByTestId('custom-registration-form-add-field-button');
    expect(addFieldButton).toBeInTheDocument();
    fireEvent.click(addFieldButton);
    await waitFor(() => {
      expect(screen.getByTestId('registration-form-field-magazine-magazine')).toBeInTheDocument();
    });

    const AddressOption = screen.getByTestId('registration-form-field-magazine-option-3');
    fireEvent.click(AddressOption);
    await waitFor(async () => {
      expect(await screen.findByTextKey('custom_registration_form_field_text_field_code_address')).toBeInTheDocument();
    });
    fireEvent.click(saveButton);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders failure page alert when registration form  settings call fails', async () => {
    const { container } = render(
      <TestWrapper>
        <MockedProvider mocks={mocks}>
          <AppFeaturesProvider value={singleSignOnFeatureOn}>
            <FormEditorCard hubId="serverError" hubTitle="test" />
          </AppFeaturesProvider>
        </MockedProvider>
      </TestWrapper>
    );
    expect(await screen.findByTextKey('custom_registration_form_header')).toBeInTheDocument();
    expect(await screen.findByTextKey('custom_registration_form_header_helper_text')).toBeInTheDocument();
    expect(await screen.findByTextKey('custom_registration_form_field_text_field_code_first_name')).toBeInTheDocument();
    const saveButton = screen.getByRole('button', { key: 'login_settings_page_save_button' });
    expect(saveButton).toBeInTheDocument();
    expect(saveButton).toBeDisabled();
    const deleteOption = screen.getByTestId('custom-reg-reorderable-delete-button-PHONE_NUMBER');
    fireEvent.click(deleteOption);
    expect(saveButton).toBeEnabled();
    fireEvent.click(saveButton);
    await waitFor(() => {
      expect(screen.getByTestId('custom-registration-alert-form-error')).toBeInTheDocument();
    });
    expect(await screen.findByTextKey('custom_registration_network_error_text')).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders failure page alert when registration form settings call fails with singleSignOnFeature Off', async () => {
    const { container } = render(
      <TestWrapper>
        <MockedProvider mocks={mocks}>
          <AppFeaturesProvider value={singleSignOnFeatureOff}>
            <FormEditorCard hubId="serverError" hubTitle="test" />
          </AppFeaturesProvider>
        </MockedProvider>
      </TestWrapper>
    );
    expect(await screen.findByTextKey('custom_registration_form_header')).toBeInTheDocument();
    expect(await screen.findByTextKey('custom_registration_form_header_helper_text')).toBeInTheDocument();
    expect(await screen.findByTextKey('custom_registration_form_field_text_field_code_first_name')).toBeInTheDocument();
    const saveButton = screen.getByRole('button', { key: 'login_settings_page_save_button' });
    expect(saveButton).toBeInTheDocument();
    expect(saveButton).toBeDisabled();
    const deleteOption = screen.getByTestId('custom-reg-reorderable-delete-button-PHONE_NUMBER');
    fireEvent.click(deleteOption);
    expect(saveButton).toBeEnabled();
    fireEvent.click(saveButton);
    await waitFor(() => {
      expect(screen.getByTestId('custom-registration-alert-form-error')).toBeInTheDocument();
    });
    expect(await screen.findByTextKey('custom_registration_network_error_text')).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders background image and delete image', async () => {
    const { container } = render(
      <TestWrapper>
        <MockedProvider mocks={mocks}>
          <AppFeaturesProvider value={singleSignOnFeatureOn}>
            <FormEditorCard hubId="testDeleteImage" hubTitle={hubTitle} />
          </AppFeaturesProvider>
        </MockedProvider>
      </TestWrapper>
    );
    expect(await screen.findByTextKey('custom_registration_appearance_heading')).toBeInTheDocument();
    expect(await screen.findByTextKey('custom_registration_checkbox_showlogo_text')).toBeInTheDocument();

    const saveButton = screen.getByRole('button', { key: 'login_settings_page_save_button' });
    expect(saveButton).toBeInTheDocument();
    expect(saveButton).toBeDisabled();

    const image = await screen.findByTestId('uploaded-image');
    expect(image).toBeInTheDocument();

    const LogoCheckbox = await screen.findByTestId('Background-Preview-Logo');
    expect(LogoCheckbox).toBeInTheDocument();
    expect(LogoCheckbox).toBeChecked();
    fireEvent.click(LogoCheckbox);

    const decorativeImageRadioGroup = screen.getByTestId('decorative-image');
    expect(await screen.findByTextKey('decorative_image_question_text')).toBeInTheDocument();
    expect(screen.getByText('Black Image')).toBeInTheDocument();
    expect(decorativeImageRadioGroup).toBeInTheDocument();

    const backgroundAltTextInput = screen.getByTestId('background-image-alt-text-input-textarea');
    expect(backgroundAltTextInput).toBeInTheDocument();
    await userEvent.clear(backgroundAltTextInput);
    await userEvent.type(backgroundAltTextInput, 'Plain Image');
    await waitFor(() => {
      expect(screen.getByText('Plain Image')).toBeInTheDocument();
    });

    const deleteButton = await screen.findByTestId('image-delete-button');
    expect(deleteButton).toBeInTheDocument();
    fireEvent.click(deleteButton);
    await waitFor(() => {
      expect(image).not.toBeInTheDocument();
    });
    expect(saveButton).toBeEnabled();
    fireEvent.click(saveButton);
    await waitFor(() => {
      expect(decorativeImageRadioGroup).not.toBeInTheDocument();
    });
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders background image preview modal', async () => {
    const { container } = render(
      <TestWrapper>
        <MockedProvider mocks={mocks}>
          <AppFeaturesProvider value={singleSignOnFeatureOn}>
            <FormEditorCard hubId="testPreview" hubTitle={hubTitle} />
          </AppFeaturesProvider>
        </MockedProvider>
      </TestWrapper>
    );
    expect(await screen.findByTextKey('custom_registration_appearance_heading')).toBeInTheDocument();
    expect(await screen.findByTextKey('custom_registration_checkbox_showlogo_text')).toBeInTheDocument();

    const image = await screen.findByTestId('uploaded-image');
    expect(image).toBeInTheDocument();
    const backgroundPreviewButton = await screen.findByTestId('Background-preview');
    expect(backgroundPreviewButton).toBeInTheDocument();
    fireEvent.click(backgroundPreviewButton);

    await new Promise(resolve => {
      setTimeout(resolve, 100);
    });

    expect(await screen.findByTestId('background-preview-modal-header')).toBeInTheDocument();
    const logo = await screen.findByTestId('registration-form-logo');
    expect(logo).toBeInTheDocument();

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

    expect(await screen.findByTestId('background-preview-modal-footer')).toBeInTheDocument();
    expect(
      await screen.findByTextKey('registration_form_footer_manage_preference_modal_link_text')
    ).toBeInTheDocument();

    const closeModalButton = await screen.findByTestId('preview-modal-cross-button');

    fireEvent.click(closeModalButton);

    await new Promise(resolve => {
      setTimeout(resolve, 100);
    });

    const LogoCheckbox = await screen.findByTestId('Background-Preview-Logo');
    expect(LogoCheckbox).toBeInTheDocument();
    expect(LogoCheckbox).toBeChecked();
    fireEvent.click(LogoCheckbox);

    fireEvent.click(backgroundPreviewButton);
    await waitFor(() => {
      expect(logo).not.toBeInTheDocument();
    });
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders edit SSO Login', async () => {
    const { container } = render(
      <TestWrapper>
        <MockedProvider mocks={mocks}>
          <AppFeaturesProvider value={singleSignOnFeatureOn}>
            <FormEditorCard hubId={hubId} hubTitle={hubTitle} />
          </AppFeaturesProvider>
        </MockedProvider>
      </TestWrapper>
    );
    expect(await screen.findByTextKey('custom_registration_form_header')).toBeInTheDocument();
    expect(await screen.findByTextKey('custom_registration_form_header_helper_text')).toBeInTheDocument();

    const ssoLoginTabBtn = await screen.findByTestId('sso-login-tab');
    expect(ssoLoginTabBtn).toBeInTheDocument();
    fireEvent.click(ssoLoginTabBtn);

    await waitFor(() => {
      expect(ssoLoginTabBtn).toHaveAttribute('aria-selected', 'true');
    });
    const ssoEditCard = await screen.findByTestId('edit-sso-login-fields');
    expect(ssoEditCard).toBeInTheDocument();
    expect(await screen.findByTextKey('sso_login_info_text')).toBeInTheDocument();

    const saveButton = screen.getByRole('button', { key: 'login_settings_page_save_button' });
    expect(saveButton).toBeInTheDocument();
    expect(saveButton).toBeDisabled();

    const magicLinkRadiobutton = await screen.findByTextKey('sso_login_login_type_magic_link_option');
    expect(magicLinkRadiobutton).toBeInTheDocument();
    expect(await screen.findByRole('button', { key: 'sso_login_magic_link_tooltip' })).toBeInTheDocument();

    const ssoLoginRadiobutton = screen.getByTestId('sso-login-method-settings-radio__div__SSO');
    expect(ssoLoginRadiobutton).toBeInTheDocument();

    const organisationIdTextbox = await screen.findByRole('textbox');
    expect(organisationIdTextbox).toBeInTheDocument();
    await userEvent.clear(organisationIdTextbox);

    fireEvent.click(saveButton);
    await waitFor(async () => {
      expect(await screen.findByTextKey('sso_login_invalid_organisation_id_error')).toBeInTheDocument();
    });

    await userEvent.type(organisationIdTextbox, 'OneLogin');
    fireEvent.click(saveButton);
    await waitFor(() => {
      expect(screen.getByTestId('custom-registration-alert-form-success')).toBeInTheDocument();
    });

    expect(await screen.findByTextKey('custom_registration_alert_update_success')).toBeInTheDocument();
    const dismissButton = screen.getByTestId('custom-registration-alert-form-success-dismiss-button');
    fireEvent.click(dismissButton);
    expect(dismissButton).not.toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('hides SSO Login tab when O-Auth is disabled', async () => {
    const { container } = render(
      <TestWrapper>
        <MockedProvider mocks={mocksWithOAuthDisabled}>
          <AppFeaturesProvider value={singleSignOnFeatureOn}>
            <FormEditorCard hubId={hubId} hubTitle={hubTitle} />
          </AppFeaturesProvider>
        </MockedProvider>
      </TestWrapper>
    );
    expect(await screen.findByTextKey('custom_registration_form_header')).toBeInTheDocument();
    expect(await screen.findByTextKey('custom_registration_form_header_helper_text')).toBeInTheDocument();

    await waitFor(async () => {
      expect(screen.queryByTestId('sso-login-tab')).not.toBeInTheDocument();
    });
    expect(screen.queryByTestId('edit-sso-login-fields')).not.toBeInTheDocument();
    expect(await screen.findByTestId('custom_registration_tab')).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders tab leave confirmation modal', async () => {
    const { container } = render(
      <TestWrapper>
        <MockedProvider mocks={mocks}>
          <AppFeaturesProvider value={singleSignOnFeatureOn}>
            <FormEditorCard hubId={hubId} hubTitle={hubTitle} />
          </AppFeaturesProvider>
        </MockedProvider>
      </TestWrapper>
    );
    expect(await screen.findByTextKey('custom_registration_form_header')).toBeInTheDocument();
    expect(await screen.findByTextKey('custom_registration_form_header_helper_text')).toBeInTheDocument();

    const ssoLoginTabBtn = await screen.findByTestId('sso-login-tab');
    expect(ssoLoginTabBtn).toBeInTheDocument();
    fireEvent.click(ssoLoginTabBtn);

    await waitFor(() => {
      expect(ssoLoginTabBtn).toHaveAttribute('aria-selected', 'true');
    });

    const ssoEditCard = await screen.findByTestId('edit-sso-login-fields');
    expect(ssoEditCard).toBeInTheDocument();

    const organisationIdTextbox = await screen.findByRole('textbox');
    expect(organisationIdTextbox).toBeInTheDocument();
    await userEvent.clear(organisationIdTextbox);

    const customRegistrationTabBtn = await screen.findByTestId('custom_registration_tab');
    expect(organisationIdTextbox).toBeInTheDocument();
    fireEvent.click(customRegistrationTabBtn);

    expect(await screen.findByTestId('confirmation-modal')).toBeInTheDocument();
    expect(await screen.findByTextKey('custom_registration_leave_confirmation_modal_header')).toBeInTheDocument();
    expect(await screen.findByTextKey('custom_registration_leave_confirmation_modal_header')).toBeInTheDocument();

    expect(
      await screen.findByRole('button', { key: 'custom_registration_leave_confirmation_modal_stay_button_text' })
    ).toBeInTheDocument();
    const leaveButton = await screen.findByRole('button', {
      key: 'custom_registration_leave_confirmation_modal_leave_button_text'
    });
    expect(leaveButton).toBeInTheDocument();
    fireEvent.click(leaveButton);
    expect(await screen.findByTextKey('custom_registration_form_header')).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders failure page alert when sso call fails', async () => {
    const { container } = render(
      <TestWrapper>
        <MockedProvider mocks={mocks}>
          <AppFeaturesProvider value={singleSignOnFeatureOn}>
            <FormEditorCard hubId="ssoError" hubTitle={hubTitle} />
          </AppFeaturesProvider>
        </MockedProvider>
      </TestWrapper>
    );
    expect(await screen.findByTextKey('custom_registration_form_header')).toBeInTheDocument();
    expect(await screen.findByTextKey('custom_registration_form_header_helper_text')).toBeInTheDocument();

    const ssoLoginTabBtn = await screen.findByTestId('sso-login-tab');
    expect(ssoLoginTabBtn).toBeInTheDocument();
    fireEvent.click(ssoLoginTabBtn);

    await waitFor(() => {
      expect(ssoLoginTabBtn).toHaveAttribute('aria-selected', 'true');
    });
    const ssoEditCard = await screen.findByTestId('edit-sso-login-fields');
    expect(ssoEditCard).toBeInTheDocument();
    expect(await screen.findByTextKey('sso_login_info_text')).toBeInTheDocument();

    const saveButton = screen.getByRole('button', { key: 'login_settings_page_save_button' });
    expect(saveButton).toBeInTheDocument();

    const organisationIdTextbox = await screen.findByRole('textbox');
    expect(organisationIdTextbox).toBeInTheDocument();
    await userEvent.clear(organisationIdTextbox);

    await userEvent.type(organisationIdTextbox, 'Test');

    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByTestId('custom-registration-alert-form-error')).toBeInTheDocument();
    });
    expect(await screen.findByTextKey('custom_registration_network_error_text')).toBeInTheDocument();
    const dismissButton = screen.getByTestId('custom-registration-alert-form-error-dismiss-button');
    fireEvent.click(dismissButton);
    expect(dismissButton).not.toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });
});

import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import ProfilePreview from '@components/member-profile/ProfilePreview';
import 'jest-axe/extend-expect';
import {
  GET_HUB_SETTINGS,
  GET_VIDEO_HUB,
  getAccountAndCustomFontInformation,
  getHubCodeSnippets
} from '@cvent/planner-event-hubs-model/operations/hub';
import { accountConfig } from '@cvent/planner-event-hubs-model/src/operations/coreSOA';
import { getAccountCodeSnippets } from '@cvent/planner-event-hubs-model/operations/snapshot';
import { accountCodeSnippet } from '@components/tracking-codes/fixtures/CodeSnippetData';
import useQueryParams from '@hooks/useQueryParam';
import { VIDEO_HUB_PATH_PARAM } from '@utils/constants';
import { screen } from 'nucleus-text/testing-library/screen';
import userEvent from '@testing-library/user-event';

const hubId = 'testHubId';
const accountId = '1234';
const mocks = [
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
          registrationBackground: 'DEFAULT',
          decorativeImage: true,
          allowTurnOffCookies: true
        }
      }
    }
  },
  {
    request: {
      query: GET_VIDEO_HUB,
      variables: { hubID: { id: hubId } }
    },
    result: {
      data: {
        hub: {
          id: hubId,
          status: 'Inactive',
          config: {
            ownerEmail: 'mbrady@cvent.com',
            ownerFirstName: 'Mike',
            ownerLastName: 'Brady',
            title: 'Test Video Center Two',
            url: '',
            locale: '',
            helpEmailAddress: ''
          },
          theme: {
            actionColor: '#fefefe',
            backgroundColor: '#f4f4f4',
            logoImageRelativePath: '',
            logoImageUrl: 'https://lower-images.cvent.com/test!_!hash.jpg',
            logoOriginalImageUrl: 'https://lower-images.cvent.com/test.jpg',
            mainColor: '#d11d1d',
            logoAltText: 'alt-text',
            moodColor: '#FFFFFF',
            safeMode: false,
            faviconUrl: 'https://dummy-url'
          }
        }
      },
      loading: false
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
              AllowGoogleAnalytics: true
            }
          }
        }
      }
    }
  },
  {
    request: {
      query: getAccountCodeSnippets,
      variables: {
        accountID: accountId
      }
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
        hubId
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
              AllowCodeSnippets: true
            }
          }
        }
      }
    }
  }
];

jest.mock('@hooks/useQueryParam');
(useQueryParams as jest.Mock).mockReturnValue({
  [VIDEO_HUB_PATH_PARAM]: hubId
});

describe('Profile Preview Page component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('renders profile preview component', async () => {
    render(
      <TestWrapper>
        <MockedProvider mocks={mocks}>
          <ProfilePreview accountId={accountId} />
        </MockedProvider>
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId('view-profile-header')).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByRole('button', { key: 'member_profile_edit_button' })).toBeInTheDocument();
    });
    expect(screen.getByRole('button', { key: 'member_profile_preview_button' })).toBeInTheDocument();
    expect(screen.getByTextKey('privacy_visibility_hidden_title')).toBeInTheDocument();
    const visibilitySwitch = screen.getByTestId('privacy-toggle-visibility-switch');
    expect(visibilitySwitch).toBeInTheDocument();
    userEvent.click(visibilitySwitch);
    await waitFor(() => {
      expect(screen.getByTextKey('privacy_visibility_visible_title')).toBeInTheDocument();
    });
    expect(screen.getByTestId('member-profile-social-links-wrapper-container')).toBeInTheDocument();
    expect(screen.getByTestId('footer-manage-cookie-preferences')).toBeInTheDocument();
    // HUB-151797
    // expect(await axe(container)).toHaveNoViolations();
  });
});

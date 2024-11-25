import { render } from '@testing-library/react';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import { MockedProvider } from '@apollo/client/testing';
import React from 'react';
import BrandingCustomHeaderPreviewModal from '@components/videoCenters/branding/preview/BrandingCustomHeaderPreviewModal';
import { screen } from 'nucleus-text/testing-library/screen';
import { GET_VIDEO_HUB, getAccountAndCustomFontInformation } from '@cvent/planner-event-hubs-model/operations/hub';
import 'jest-axe/extend-expect';
import { axe } from 'jest-axe';

const customNavigationData = {
  logo: {
    isEnabled: false
  },
  loginRegistration: {
    url: 'https://cvent.com',
    isEnabled: true
  },
  homePage: {
    url: 'https://google.com',
    isEnabled: false
  },
  upcomingEvents: {
    url: 'https://yahoo.com',
    isEnabled: true
  },
  channels: {
    isEnabled: true,
    url: 'https://bing.com'
  },
  videos: {
    url: 'https://duckduckgo.com',
    isEnabled: false
  }
};

const mocks = [
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
  },
  {
    request: {
      query: GET_VIDEO_HUB,
      variables: { hubID: { id: 'test' } }
    },
    result: {
      data: {
        hub: {
          id: 'test-video-hub',
          status: 'Inactive',
          config: {
            ownerEmail: 'mbrady@cvent.com',
            ownerFirstName: 'Mike',
            ownerLastName: 'Brady',
            title: 'Test Video Center One',
            url: 'https://google.com',
            locale: 'en-US',
            helpEmailAddress: 'help@cvent.com'
          },
          theme: {
            actionColor: '#1C1C1D',
            backgroundColor: '#F4F4F4',
            logoImageRelativePath: null,
            logoImageUrl:
              'https://images-lower.cvent.com/T2/a5d2b9bbad7a4afa81b9915692481089/video-center/f6269cb8-d9d9-427f-b40c-864da41ef878/logo/f6269cb8-d9d9-427f-b40c-864da41ef878/48b0e1f0b27e750a0261f27978391d8e!_!434b0fd052cbf40d377c533d693b6a71.png',
            logoOriginalImageUrl:
              'https://custom.t2.cvent.com/a5d2b9bbad7a4afa81b9915692481089/video-center/f6269cb8-d9d9-427f-b40c-864da41ef878/logo/f6269cb8-d9d9-427f-b40c-864da41ef878/screenshot-2023-08-04-at-8.29.30-pm.png',
            logoAltText: 'test alt text',
            mainColor: '#3d4c5c',
            moodColor: '#FFFFFF',
            safeMode: false,
            faviconUrl:
              'https://custom.t2.cvent.com/a5d2b9bbad7a4afa81b9915692481089/video-center/f6269cb8-d9d9-427f-b40c-864da41ef878/favicon/f6269cb8-d9d9-427f-b40c-864da41ef878/2d3d1951-6a9c-458f-9c3a-64c221014858.ico',
            headingsFont: '4fb6340a-2c90-49d9-9d1d-a28c20f16a51',
            bodyFont: '4fb6340a-2c90-49d9-9d1d-a28c20f16a51',
            __typename: 'Theme'
          }
        }
      }
    }
  }
];

jest.mock('next/router', () => ({
  useRouter() {
    return {
      pathname: '/path',
      route: '/route',
      query: { isSuccess: true, 'video-center': 'test' },
      replace: jest.fn()
    };
  }
}));

jest.mock('react-frame-component');

describe('Branding Custom Header Preview Modal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should render custom header preview modal', async () => {
    const { container } = render(
      <MockedProvider mocks={mocks}>
        <TestWrapper>
          <BrandingCustomHeaderPreviewModal isOpen setIsOpen={jest.fn} customNavigation={customNavigationData} />
        </TestWrapper>
      </MockedProvider>
    );
    expect(
      await screen.findByRole('heading', { level: 2, key: 'events_plus_custom_header_preview_modal_heading' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { key: 'events_plus_custom_header_preview_modal_desktop_view_button_text' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { key: 'events_plus_custom_header_preview_modal_mobile_view_button_text' })
    ).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });
});

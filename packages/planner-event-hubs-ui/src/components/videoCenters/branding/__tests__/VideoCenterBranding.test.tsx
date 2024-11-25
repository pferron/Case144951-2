import React from 'react';
import { render, waitFor, fireEvent, within } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import {
  getAccountAndCustomFontInformation,
  getHubCustomizationsQuery,
  GET_VIDEO_HUB,
  UPDATE_VIDEO_HUB,
  getCenterFeatures
} from '@cvent/planner-event-hubs-model/operations/hub';
import VideoCenterBranding from '@components/videoCenters/branding/VideoCenterBranding';
import { UserPermissionsContext } from '@hooks/UserPermissionsProvider';
import { screen } from 'nucleus-text/testing-library/screen';
import { fetchAndCreateShortUrlByTag } from '@cvent/planner-event-hubs-model/src/operations/shortUrl';
import enUS from '../../../../../locales/en-US.json';

const testHubId = 'test-video-hub';
jest.mock('next/router', () => ({
  useRouter() {
    return {
      asPath: 'eventsplus',
      pathname: '/path',
      route: '/route',
      query: { isSuccess: true, 'video-center': testHubId },
      replace: jest.fn()
    };
  }
}));

jest.mock('@components/videoCenters/branding/preview/NavigationHeader', () => {
  return {
    __esModule: true, // this property makes it work
    default: props => {
      return <div>{props.navigationAlignment}</div>;
    }
  };
});

jest.mock('next/config', () => () => ({
  publicRuntimeConfig: {
    VIDEO_HUB_WEB: 'https://dummy.com/'
  }
}));

const getVideoMock = {
  request: {
    query: GET_VIDEO_HUB,
    context: { clientName: 'video-hub' },
    variables: { hubID: { id: 'test-video-hub' } }
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
          url: '',
          locale: '',
          helpEmailAddress: ''
        },
        theme: {
          actionColor: '#fefefe',
          backgroundColor: '#f4f4f4',
          logoImageRelativePath: '',
          logoImageUrl: '',
          logoOriginalImageUrl: '',
          mainColor: '#d11d1d',
          logoAltText: '',
          moodColor: '#FFFFFF',
          safeMode: false,
          faviconUrl: 'https://dummy-url',
          headingsFont: '',
          bodyFont: ''
        },
        calendar: {
          id: 'dummy-id'
        }
      }
    },
    loading: false
  }
};

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn()
  }))
});

const mocks = [
  getVideoMock,
  {
    request: {
      query: GET_VIDEO_HUB,
      variables: { hubID: { id: 'test-video-hub-with-logo' } }
    },
    result: {
      data: {
        hub: {
          id: 'test-video-hub-with-logo',
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
      variables: {
        input: {
          id: 'test-video-hub-with-logo',
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
            logoImageUrl: null,
            logoOriginalImageUrl: null,
            headingsFont: null,
            bodyFont: null,
            mainColor: '#d11d1d',
            logoAltText: 'alt-text',
            moodColor: '#FFFFFF',
            safeMode: false,
            newLogoImageUrl: null,
            newLogoOriginalImageUrl: null,
            faviconUrl: 'https://dummy-url'
          }
        }
      },
      query: UPDATE_VIDEO_HUB
    },
    result: {
      data: {
        hubUpdate: {
          id: 'test-video-hub-with-logo',
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
            logoImageUrl: '',
            logoOriginalImageUrl: '',
            mainColor: '#d11d1d',
            logoAltText: 'alt-text',
            moodColor: '#FFFFFF',
            safeMode: false,
            faviconUrl: 'https://dummy-url'
          }
        }
      }
    }
  },
  {
    request: {
      query: fetchAndCreateShortUrlByTag,
      variables: { videoCenterId: 'test-video-hub' }
    },
    result: {
      data: {
        fetchAndCreateShortUrlByTag: [
          {
            shortUrl: 'https://t2-penguin.seevent.com/demoint',
            pageName: 'home',
            __typename: 'ShortUrlByTag'
          },
          {
            shortUrl: 'https://t2-penguin.seevent.com/LXBZe5',
            pageName: 'upcomingEvents',
            __typename: 'ShortUrlByTag'
          },
          {
            shortUrl: 'https://t2-penguin.seevent.com/Q1NgEZ',
            pageName: 'channels',
            __typename: 'ShortUrlByTag'
          },
          {
            shortUrl: 'https://t2-penguin.seevent.com/wr18NE',
            pageName: 'videos',
            __typename: 'ShortUrlByTag'
          }
        ]
      },
      loading: false
    }
  }
];

const mocksWithOutFavIcon = [
  {
    request: {
      query: GET_VIDEO_HUB,
      context: { clientName: 'video-hub' },
      variables: { hubID: { id: 'test-video-hub' } }
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
            url: '',
            locale: '',
            helpEmailAddress: ''
          },
          theme: {
            actionColor: '#fefefe',
            backgroundColor: '#f4f4f4',
            logoImageRelativePath: '',
            logoImageUrl: '',
            logoOriginalImageUrl: '',
            mainColor: '#d11d1d',
            logoAltText: '',
            moodColor: '#FFFFFF',
            safeMode: false
          }
        }
      },
      loading: false
    }
  }
];

const getCenterFeaturesMock = (upcomingEventsFlag = false) => ({
  request: {
    query: getCenterFeatures,
    variables: {
      id: {
        id: testHubId
      }
    }
  },
  result: {
    data: {
      getCenterFeatures: [
        {
          code: 'YOUR_EVENTS',
          enabled: false,
          __typename: 'Feature'
        },
        {
          code: 'MESSAGING',
          enabled: false,
          __typename: 'Feature'
        },
        {
          code: 'CONNECTIONS',
          enabled: false,
          __typename: 'Feature'
        },
        {
          code: 'UPCOMING_EVENTS',
          enabled: upcomingEventsFlag,
          __typename: 'Feature'
        },
        {
          code: 'PROFILE_SETUP',
          enabled: true,
          __typename: 'Feature'
        }
      ]
    }
  }
});
const getHubCustomizationMock = {
  request: {
    query: getHubCustomizationsQuery,
    variables: {
      id: {
        id: testHubId
      }
    }
  },
  result: {
    data: {
      getHubCustomizations: {
        headerHtml:
          '<div>\n<h1>demo</h1>demo\n<h1>demo</h1>\n    <h1>demo</h1>\n<h2>hello</h2>\n<h2>hello</h2>\n</div>',
        headerCss: 'center{hkjj}',
        headerJavascript: 'This is test Javascript',
        showCustomHeader: false,
        showLogo: true,
        showLogin: true,
        showHomePage: true,
        showUpcomingEvents: true,
        showChannels: true,
        showVideos: true,
        showNavigation: true,
        navigationAlignment: 'Center',
        __typename: 'Customizations'
      }
    }
  }
};

const mocksWithCustomFontsAndAccountFeatures = {
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
};

const userPermission = { VideoCenter: true, EventsPlusCustomHeader: true };

describe('Video Center Theming', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Renders Video Center Branding Page', async () => {
    render(
      <TestWrapper>
        <MockedProvider mocks={mocksWithOutFavIcon}>
          <UserPermissionsContext.Provider value={userPermission}>
            <VideoCenterBranding centerId="test-video-hub" centerTitle="Test Video Center One" />
          </UserPermissionsContext.Provider>
        </MockedProvider>
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId('theming-container')).toBeInTheDocument();
    });

    // Branding
    expect(await screen.findByTestId('branding-theming-color-picker')).toBeInTheDocument();
    expect(await screen.findByTestId('theme-change-preview')).toBeInTheDocument();
    expect(await screen.findByTestId('branding-theming-advanced-setting')).toBeInTheDocument();

    // Branding Images
    const brandingImage = await screen.findByTestId('theming-images');
    expect(brandingImage).toBeInTheDocument();
    expect(await within(brandingImage).findByText(enUS.video_hub_branding_page_save_changes)).toBeInTheDocument();
    // Logo
    const brandingImageLogo = await within(brandingImage).findByTestId('video_hub_theming_logo');
    expect(await within(brandingImageLogo).findByText(enUS.video_hub_branding_logo_image_header)).toBeInTheDocument();
    expect(await within(brandingImageLogo).findByText(enUS.image_upload_button)).toBeInTheDocument();
    expect(
      await within(brandingImageLogo).findByText(enUS.video_hub_branding_logo_image_recommended_dimension_text)
    ).toBeInTheDocument();
    expect(
      await within(brandingImageLogo).findByText(enUS.video_hub_branding_logo_image_supported_fileType)
    ).toBeInTheDocument();

    // favicon
    const brandingImageFavicon = await within(brandingImage).findByTestId('video_hub_theming_favicon');
    expect(
      await within(brandingImageFavicon).findByText(enUS.video_hub_branding_favicon_image_header)
    ).toBeInTheDocument();
    expect(await within(brandingImageFavicon).findByText(enUS.image_upload_button)).toBeInTheDocument();
    expect(
      await within(brandingImageFavicon).findByText(enUS.video_hub_branding_favicon_image_recommended_dimension_text)
    ).toBeInTheDocument();
    expect(
      await within(brandingImageFavicon).findByText(enUS.video_hub_branding_favicon_image_supported_fileType)
    ).toBeInTheDocument();
  });

  it('displays the logo and favicon image & filename in the images card', async () => {
    render(
      <MockedProvider mocks={mocks}>
        <TestWrapper>
          <UserPermissionsContext.Provider value={userPermission}>
            <VideoCenterBranding centerId="test-video-hub-with-logo" centerTitle="Test Video Center Two" />
          </UserPermissionsContext.Provider>
        </TestWrapper>
      </MockedProvider>
    );

    // Branding Images
    const brandingImage = await screen.findByTestId('theming-images');
    expect(brandingImage).toBeInTheDocument();
    expect(await within(brandingImage).findByText(enUS.video_hub_branding_page_save_changes)).toBeInTheDocument();
    // Logo
    const brandingImageLogo = await within(brandingImage).findByTestId('video_hub_theming_logo');
    expect(await within(brandingImageLogo).findByTestId('uploaded-image-element')).toBeInTheDocument();
    const logoAltText = await within(brandingImageLogo).findByDisplayValue('alt-text');
    expect(logoAltText).toBeInTheDocument();

    // favicon
    const brandingImageFavicon = await within(brandingImage).findByTestId('video_hub_theming_favicon');
    expect(await within(brandingImageFavicon).findByTestId('uploaded-image-element')).toBeInTheDocument();
  });

  it('removes the logo/favicon image & filename from the images card', async () => {
    render(
      <TestWrapper>
        <MockedProvider mocks={mocks}>
          <UserPermissionsContext.Provider value={userPermission}>
            <VideoCenterBranding centerId="test-video-hub-with-logo" centerTitle="Test Video Center Two" />
          </UserPermissionsContext.Provider>
        </MockedProvider>
      </TestWrapper>
    );

    // Branding Images
    const brandingImage = await screen.findByTestId('theming-images');
    expect(brandingImage).toBeInTheDocument();
    expect(await within(brandingImage).findByText(enUS.video_hub_branding_page_save_changes)).toBeInTheDocument();
    // Logo
    const brandingImageLogo = await within(brandingImage).findByTestId('video_hub_theming_logo');
    expect(await within(brandingImageLogo).findByTestId('uploaded-image-element')).toBeInTheDocument();
    const deleteLogoBtn = within(brandingImageLogo).getByTestId('image-delete-button');
    fireEvent.click(deleteLogoBtn);
    expect(await within(brandingImageLogo).findByText(enUS.image_upload_button)).toBeInTheDocument();
    expect(within(brandingImageLogo).queryByTestId('uploaded-image-element')).not.toBeInTheDocument();

    // favicon
    const brandingImageFavicon = await within(brandingImage).findByTestId('video_hub_theming_favicon');
    expect(await within(brandingImageFavicon).findByTestId('uploaded-image-element')).toBeInTheDocument();
    const deleteFaviconBtn = within(brandingImageFavicon).getByTestId('image-delete-button');
    fireEvent.click(deleteFaviconBtn);
    expect(await within(brandingImageFavicon).findByText(enUS.image_upload_button)).toBeInTheDocument();
    expect(within(brandingImageFavicon).queryByTestId('uploaded-image-element')).not.toBeInTheDocument();
  });
});

describe('verify header features', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Verify the Branding page tabs for navigation/custom header', async () => {
    render(
      <TestWrapper>
        <MockedProvider
          mocks={[...mocks, getHubCustomizationMock, getCenterFeaturesMock(), mocksWithCustomFontsAndAccountFeatures]}
        >
          <UserPermissionsContext.Provider value={userPermission}>
            <VideoCenterBranding centerId={testHubId} centerTitle="Test Video Center Two" />
          </UserPermissionsContext.Provider>
        </MockedProvider>
      </TestWrapper>
    );

    // Branding Title
    const title = await screen.findByText(enUS.video_hub_branding_page_title);
    expect(title).toBeInTheDocument();

    // Branding Theme
    const tabTheme = await screen.findByTestId('branding_theme_tab');
    expect(tabTheme).toBeInTheDocument();
    expect(tabTheme).toHaveAttribute('aria-selected', 'true');
    expect(await within(tabTheme).findByText(enUS.events_plus_theme_tab_label)).toBeInTheDocument();
    // Branding Navigation
    const tabNavigation = await screen.findByTestId('branding_navigation_tab');
    expect(tabNavigation).toBeInTheDocument();
    expect(await screen.findByText(enUS.events_plus_branding_navigation_tab_label)).toBeInTheDocument();
    fireEvent.click(tabNavigation);
    expect(tabNavigation).toHaveAttribute('aria-selected', 'true');

    // Branding Custom Header
    const tabCustomHeader = await screen.findByTestId('branding_custom_header_tab');
    expect(tabCustomHeader).toBeInTheDocument();
    expect(tabCustomHeader).toBeEnabled();
    expect(await screen.findByText(enUS.events_plus_custom_header_tab_label)).toBeInTheDocument();
    fireEvent.click(tabCustomHeader);
    expect(tabCustomHeader).toHaveAttribute('aria-selected', 'true');
  });

  it('Verify Events+ navigation URLs', async () => {
    render(
      <TestWrapper>
        <MockedProvider
          mocks={[...mocks, getHubCustomizationMock, getCenterFeaturesMock(), mocksWithCustomFontsAndAccountFeatures]}
        >
          <UserPermissionsContext.Provider value={userPermission}>
            <VideoCenterBranding centerId={testHubId} centerTitle="Test Video Center Two" />
          </UserPermissionsContext.Provider>
        </MockedProvider>
      </TestWrapper>
    );

    // Branding Custom Header
    const tabCustomHeader = await screen.findByRole('tab', {
      name: enUS.events_plus_custom_header_tab_label
    });
    expect(tabCustomHeader).toBeInTheDocument();
    expect(tabCustomHeader).toBeEnabled();
    expect(await screen.findByText(enUS.events_plus_custom_header_tab_label)).toBeInTheDocument();
    fireEvent.click(tabCustomHeader);
    expect(tabCustomHeader).toHaveAttribute('aria-selected', 'true');

    const hideEventsPlusNavigationButton = screen.getByRole('button', { name: /hide events\+ navigation toggle/i });
    expect(hideEventsPlusNavigationButton).toBeInTheDocument();
    fireEvent.click(hideEventsPlusNavigationButton);
    await waitFor(async () => {
      expect(
        screen.getByRole('row', { name: /home https:\/\/t2-penguin\.seevent\.com\/demoint/i })
      ).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('row', { name: /home https:\/\/t2-penguin\.seevent\.com\/demoint/i }));
  });
  it('Verify the custom header tab is disabled when code snippet is off', async () => {
    const mocksForOffCodeSnippet = { ...mocksWithCustomFontsAndAccountFeatures };
    mocksForOffCodeSnippet.result.data.accountConfig.AccountFeatures.GeneralFeatures.AllowCodeSnippets = false;
    render(
      <TestWrapper>
        <MockedProvider mocks={[...mocks, getHubCustomizationMock, getCenterFeaturesMock(), mocksForOffCodeSnippet]}>
          <UserPermissionsContext.Provider value={userPermission}>
            <VideoCenterBranding centerId={testHubId} centerTitle="Test Video Center Two" />
          </UserPermissionsContext.Provider>
        </MockedProvider>
      </TestWrapper>
    );
    // Branding Title
    const title = await screen.findByText(enUS.video_hub_branding_page_title);
    expect(title).toBeInTheDocument();

    // Branding Theme
    const tabTheme = await screen.findByTestId('branding_theme_tab');
    expect(tabTheme).toBeInTheDocument();
    expect(tabTheme).toHaveAttribute('aria-selected', 'true');

    expect(await within(tabTheme).findByText(enUS.events_plus_theme_tab_label)).toBeInTheDocument();
    // Branding Navigation
    const tabNavigation = await screen.findByTestId('branding_navigation_tab');
    expect(tabNavigation).toBeInTheDocument();
    expect(await screen.findByText(enUS.events_plus_branding_navigation_tab_label)).toBeInTheDocument();
    fireEvent.click(tabNavigation);
    expect(tabNavigation).toHaveAttribute('aria-selected', 'true');

    // Branding Custom Header
    const tabCustomHeader = await screen.findByTestId('branding_custom_header_tab');
    expect(tabCustomHeader).toBeInTheDocument();
    // expect(tabCustomHeader).toBeDisabled();
    fireEvent.mouseOver(tabCustomHeader);
    // expect(await screen.findByTextKey('custom_header_tab_disabled_tooltip')).toBeInTheDocument();
    // fireEvent.click(tabCustomHeader);
    // expect(tabCustomHeader.getAttribute('aria-selected')).toBe('true');
  });

  it('Verify the custom header tab is not displayed when EventsPlusCustomHeader user role is not enabled', async () => {
    render(
      <TestWrapper>
        <MockedProvider
          mocks={[...mocks, getHubCustomizationMock, getCenterFeaturesMock(), mocksWithCustomFontsAndAccountFeatures]}
        >
          <UserPermissionsContext.Provider value={{ ...userPermission, EventsPlusCustomHeader: false }}>
            <VideoCenterBranding centerId={testHubId} centerTitle="Test Video Center Two" />
          </UserPermissionsContext.Provider>
        </MockedProvider>
      </TestWrapper>
    );
    // Branding Title
    const title = await screen.findByText(enUS.video_hub_branding_page_title);
    expect(title).toBeInTheDocument();

    // Branding Theme Tab
    const tabTheme = await screen.findByTestId('branding_theme_tab');
    expect(tabTheme).toBeInTheDocument();
    expect(tabTheme).toHaveAttribute('aria-selected', 'true');

    expect(await within(tabTheme).findByText(enUS.events_plus_theme_tab_label)).toBeInTheDocument();
    // Branding Navigation Tab
    const tabNavigation = await screen.findByTestId('branding_navigation_tab');
    expect(tabNavigation).toBeInTheDocument();
    expect(await screen.findByText(enUS.events_plus_branding_navigation_tab_label)).toBeInTheDocument();
    fireEvent.click(tabNavigation);
    expect(tabNavigation).toHaveAttribute('aria-selected', 'true');

    // Branding Custom Header Tab not displayed
    const tabCustomHeader = screen.queryByTestId('branding_custom_header_tab');
    expect(tabCustomHeader).not.toBeInTheDocument();
  });

  it('Verify upcoming events is not shown in navigation table when feature is off', async () => {
    render(
      <TestWrapper>
        <MockedProvider
          mocks={[...mocks, getHubCustomizationMock, getCenterFeaturesMock(), mocksWithCustomFontsAndAccountFeatures]}
        >
          <UserPermissionsContext.Provider value={userPermission}>
            <VideoCenterBranding centerId={testHubId} centerTitle="Test Video Center Two" />
          </UserPermissionsContext.Provider>
        </MockedProvider>
      </TestWrapper>
    );

    // Branding Title
    const title = await screen.findByText(enUS.video_hub_branding_page_title);
    expect(title).toBeInTheDocument();

    // Branding Theme
    const tabTheme = await screen.findByTestId('branding_theme_tab');
    expect(tabTheme).toBeInTheDocument();
    // Branding Navigation
    const tabNavigation = await screen.findByTestId('branding_navigation_tab');
    expect(tabNavigation).toBeInTheDocument();
    expect(await screen.findByTextKey('events_plus_branding_navigation_tab_label')).toBeInTheDocument();
    fireEvent.click(tabNavigation);
    expect(tabNavigation).toHaveAttribute('aria-selected', 'true');

    expect(await screen.findByTextKey('custom_navigation_table_login_registration')).toBeInTheDocument();
    expect(await screen.findByTextKey('custom_navigation_table_home')).toBeInTheDocument();
    expect(await screen.findByTextKey('custom_navigation_table_channels')).toBeInTheDocument();
    expect(await screen.findByTextKey('custom_navigation_table_videos')).toBeInTheDocument();
    expect(screen.queryByTextKey('custom_navigation_table_upcoming_events')).not.toBeInTheDocument();
  });

  it('Verify upcoming events is visible in navigation table when feature is on', async () => {
    render(
      <TestWrapper>
        <MockedProvider
          mocks={[
            ...mocks,
            getHubCustomizationMock,
            getCenterFeaturesMock(true),
            mocksWithCustomFontsAndAccountFeatures
          ]}
        >
          <UserPermissionsContext.Provider value={userPermission}>
            <VideoCenterBranding centerId={testHubId} centerTitle="Test Video Center Two" />
          </UserPermissionsContext.Provider>
        </MockedProvider>
      </TestWrapper>
    );

    // Branding Title
    const title = await screen.findByText(enUS.video_hub_branding_page_title);
    expect(title).toBeInTheDocument();

    // Branding Theme
    const tabTheme = await screen.findByTestId('branding_theme_tab');
    expect(tabTheme).toBeInTheDocument();
    // Branding Navigation
    const tabNavigation = await screen.findByTestId('branding_navigation_tab');
    expect(tabNavigation).toBeInTheDocument();
    expect(await screen.findByTextKey('events_plus_branding_navigation_tab_label')).toBeInTheDocument();
    fireEvent.click(tabNavigation);
    expect(tabNavigation).toHaveAttribute('aria-selected', 'true');

    expect(await screen.findByTextKey('custom_navigation_table_login_registration')).toBeInTheDocument();
    expect(await screen.findByTextKey('custom_navigation_table_home')).toBeInTheDocument();
    expect(await screen.findByTextKey('custom_navigation_table_channels')).toBeInTheDocument();
    expect(await screen.findByTextKey('custom_navigation_table_videos')).toBeInTheDocument();
    expect(await screen.findByTextKey('custom_navigation_table_upcoming_events')).toBeInTheDocument();
  });
});

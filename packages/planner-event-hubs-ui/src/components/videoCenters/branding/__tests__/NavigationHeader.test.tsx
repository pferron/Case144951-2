import React from 'react';
import 'jest-axe/extend-expect';
import { render } from '@testing-library/react';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import { axe } from 'jest-axe';
import { NavigationAlignment, NavigationLinkHighlightStyle } from '@cvent/planner-event-hubs-model/types';
import { GET_VIDEO_HUB } from '@cvent/planner-event-hubs-model/operations/hub';
import { MockedProvider } from '@apollo/client/testing';
import NavigationHeader, { Header } from '@components/videoCenters/branding/preview/NavigationHeader';
import { screen } from 'nucleus-text/testing-library/screen';

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
const customNavigationData = {
  logo: {
    isEnabled: true
  },
  loginRegistration: {
    url: 'https://cvent.com',
    isEnabled: true
  },
  homePage: {
    url: 'https://google.com',
    isEnabled: true
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
    isEnabled: true
  }
};

const advancedOptionsDataWithLeftAlignment = {
  navigationAlignment: NavigationAlignment.Left,
  navigationLinkHighlightStyle: NavigationLinkHighlightStyle.Filled,
  navigationLinkTextSize: '16'
};

const advancedOptionsDataWithCenterAlignment = {
  navigationAlignment: NavigationAlignment.Center,
  navigationLinkHighlightStyle: NavigationLinkHighlightStyle.Filled,
  navigationLinkTextSize: '16'
};

const advancedOptionsDataWithRightAlignment = {
  navigationAlignment: NavigationAlignment.Right,
  navigationLinkHighlightStyle: NavigationLinkHighlightStyle.Filled,
  navigationLinkTextSize: '16'
};

const videoHubMock = {
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
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Branding Navigation header preview', () => {
  it('Verify the header is rendered correctly with all items and center aligned', async () => {
    const { container } = render(
      <MockedProvider mocks={[videoHubMock]}>
        <TestWrapper>
          <NavigationHeader
            customNavigation={customNavigationData}
            advancedOptions={advancedOptionsDataWithCenterAlignment}
          />
        </TestWrapper>
      </MockedProvider>
    );
    expect(await screen.findByTestId('navigation-header-preview')).toBeInTheDocument();
    expect(await screen.findByTestId('navigation-logo-preview')).toBeInTheDocument();
    expect(await screen.findByTestId('navigation-login-preview')).toBeInTheDocument();
    expect(await screen.findByTextKey('custom_navigation_header_preview_login_link_text')).toBeInTheDocument();
    expect(await screen.findByTextKey('custom_navigation_header_preview_register_link_text')).toBeInTheDocument();
    expect(
      await screen.findByRole('menuitem', { key: 'custom_navigation_header_preview_home_text' })
    ).toBeInTheDocument();
    expect(
      await screen.findByRole('menuitem', { key: 'custom_navigation_header_preview_upcoming_events_text' })
    ).toBeInTheDocument();
    expect(
      await screen.findByRole('menuitem', { key: 'custom_navigation_header_preview_channels_text' })
    ).toBeInTheDocument();
    expect(
      await screen.findByRole('menuitem', { key: 'custom_navigation_header_preview_videos_text' })
    ).toBeInTheDocument();
    const headerContent = await screen.findByTestId('navigation-menu-preview');
    expect(headerContent).toHaveStyle('justify-content: Center');
    expect(screen.getByText(/home/i)).toHaveStyle("font-family: 'Helvetica','Arial'");
    expect(await axe(container)).toHaveNoViolations();
  });
  it('Verify the header is rendered correctly with all items and right alignment', async () => {
    const { container } = render(
      <MockedProvider mocks={[videoHubMock]}>
        <TestWrapper>
          <NavigationHeader
            customNavigation={customNavigationData}
            advancedOptions={advancedOptionsDataWithRightAlignment}
          />
        </TestWrapper>
      </MockedProvider>
    );
    expect(await screen.findByTestId('navigation-header-preview')).toBeInTheDocument();
    expect(await screen.findByTestId('navigation-logo-preview')).toBeInTheDocument();
    expect(await screen.findByTestId('navigation-login-preview')).toBeInTheDocument();
    expect(await screen.findByTextKey('custom_navigation_header_preview_login_link_text')).toBeInTheDocument();
    expect(await screen.findByTextKey('custom_navigation_header_preview_register_link_text')).toBeInTheDocument();
    expect(
      await screen.findByRole('menuitem', { key: 'custom_navigation_header_preview_home_text' })
    ).toBeInTheDocument();
    expect(
      await screen.findByRole('menuitem', { key: 'custom_navigation_header_preview_upcoming_events_text' })
    ).toBeInTheDocument();
    expect(
      await screen.findByRole('menuitem', { key: 'custom_navigation_header_preview_channels_text' })
    ).toBeInTheDocument();
    expect(
      await screen.findByRole('menuitem', { key: 'custom_navigation_header_preview_videos_text' })
    ).toBeInTheDocument();
    const headerContent = await screen.findByTestId('navigation-menu-preview');
    expect(headerContent).toHaveStyle('justify-content: Right');
    expect(await axe(container)).toHaveNoViolations();
  });
  it('Verify the header is rendered correctly with all items and left aligned', async () => {
    const { container } = render(
      <MockedProvider mocks={[videoHubMock]}>
        <TestWrapper>
          <NavigationHeader
            customNavigation={customNavigationData}
            advancedOptions={advancedOptionsDataWithLeftAlignment}
          />
        </TestWrapper>
      </MockedProvider>
    );
    expect(await screen.findByTestId('navigation-header-preview')).toBeInTheDocument();
    expect(await screen.findByTestId('navigation-logo-preview')).toBeInTheDocument();
    expect(await screen.findByTestId('navigation-login-preview')).toBeInTheDocument();
    expect(await screen.findByTextKey('custom_navigation_header_preview_login_link_text')).toBeInTheDocument();
    expect(await screen.findByTextKey('custom_navigation_header_preview_register_link_text')).toBeInTheDocument();
    expect(
      await screen.findByRole('menuitem', { key: 'custom_navigation_header_preview_home_text' })
    ).toBeInTheDocument();
    expect(
      await screen.findByRole('menuitem', { key: 'custom_navigation_header_preview_upcoming_events_text' })
    ).toBeInTheDocument();
    expect(
      await screen.findByRole('menuitem', { key: 'custom_navigation_header_preview_channels_text' })
    ).toBeInTheDocument();
    expect(
      await screen.findByRole('menuitem', { key: 'custom_navigation_header_preview_videos_text' })
    ).toBeInTheDocument();
    const headerContent = await screen.findByTestId('navigation-menu-preview');
    expect(headerContent).toHaveStyle('justify-content: Left');
    expect(await axe(container)).toHaveNoViolations();
  });
  it('Verify the header is rendered correctly without logo', async () => {
    const customNavigationDataWithoutLogo = {
      ...customNavigationData,
      logo: {
        isEnabled: false
      }
    };
    const { container } = render(
      <MockedProvider mocks={[videoHubMock]}>
        <TestWrapper>
          <NavigationHeader
            customNavigation={customNavigationDataWithoutLogo}
            advancedOptions={advancedOptionsDataWithLeftAlignment}
          />
        </TestWrapper>
      </MockedProvider>
    );
    expect(await screen.findByTestId('navigation-header-preview')).toBeInTheDocument();
    expect(await screen.findByTestId('navigation-login-preview')).toBeInTheDocument();
    expect(screen.queryByTestId('navigation-logo-preview')).not.toBeInTheDocument();
    expect(
      await screen.findByRole('menuitem', { key: 'custom_navigation_header_preview_home_text' })
    ).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });
  it('Verify the header is rendered correctly without login links', async () => {
    const customNavigationDataWithoutLogo = {
      ...customNavigationData,
      loginRegistration: {
        isEnabled: false
      }
    };
    const { container } = render(
      <MockedProvider mocks={[videoHubMock]}>
        <TestWrapper>
          <NavigationHeader
            customNavigation={customNavigationDataWithoutLogo}
            advancedOptions={advancedOptionsDataWithLeftAlignment}
          />
        </TestWrapper>
      </MockedProvider>
    );
    expect(await screen.findByTestId('navigation-header-preview')).toBeInTheDocument();
    expect(await screen.findByTestId('navigation-logo-preview')).toBeInTheDocument();
    expect(screen.queryByTestId('navigation-login-preview')).not.toBeInTheDocument();
    expect(
      await screen.findByRole('menuitem', { key: 'custom_navigation_header_preview_home_text' })
    ).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });
  it('Verify the header is rendered correctly without any menu item', async () => {
    const customNavigationDataWithoutMenu = {
      ...customNavigationData,
      channels: {
        isEnabled: false
      },
      homePage: {
        isEnabled: false
      },
      videos: {
        isEnabled: false
      },
      upcomingEvents: {
        isEnabled: false
      }
    };
    const { container } = render(
      <MockedProvider mocks={[videoHubMock]}>
        <TestWrapper>
          <NavigationHeader
            customNavigation={customNavigationDataWithoutMenu}
            advancedOptions={advancedOptionsDataWithLeftAlignment}
          />
        </TestWrapper>
      </MockedProvider>
    );
    expect(await screen.findByTestId('navigation-login-preview')).toBeInTheDocument();
    expect(await screen.findByTestId('navigation-logo-preview')).toBeInTheDocument();
    expect(await screen.findByTextKey('custom_navigation_header_preview_login_link_text')).toBeInTheDocument();
    expect(await screen.findByTestId('navigation-menu-preview')).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });
  it('Verify the header is rendered correctly without home in menu', async () => {
    const customNavigationDataWithoutHome = {
      ...customNavigationData,
      homePage: {
        isEnabled: false
      }
    };
    const { container } = render(
      <MockedProvider mocks={[videoHubMock]}>
        <TestWrapper>
          <NavigationHeader
            customNavigation={customNavigationDataWithoutHome}
            advancedOptions={advancedOptionsDataWithLeftAlignment}
          />
        </TestWrapper>
      </MockedProvider>
    );
    expect(await screen.findByTestId('navigation-header-preview')).toBeInTheDocument();
    expect(await screen.findByTestId('navigation-login-preview')).toBeInTheDocument();
    expect(await screen.findByTestId('navigation-logo-preview')).toBeInTheDocument();
    expect(
      await screen.findByRole('menuitem', { key: 'custom_navigation_header_preview_upcoming_events_text' })
    ).toBeInTheDocument();
    expect(
      await screen.findByRole('menuitem', { key: 'custom_navigation_header_preview_channels_text' })
    ).toBeInTheDocument();
    expect(
      await screen.findByRole('menuitem', { key: 'custom_navigation_header_preview_videos_text' })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('menuitem', { key: 'custom_navigation_header_preview_home_text' })
    ).not.toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });
  it('Verify the header is rendered correctly without upcoming events', async () => {
    const customNavigationDataWithoutUpcomingEvents = {
      ...customNavigationData,
      upcomingEvents: {
        isEnabled: false
      }
    };
    const { container } = render(
      <MockedProvider mocks={[videoHubMock]}>
        <TestWrapper>
          <NavigationHeader
            customNavigation={customNavigationDataWithoutUpcomingEvents}
            advancedOptions={advancedOptionsDataWithLeftAlignment}
          />
        </TestWrapper>
      </MockedProvider>
    );
    expect(await screen.findByTestId('navigation-header-preview')).toBeInTheDocument();
    expect(await screen.findByTestId('navigation-login-preview')).toBeInTheDocument();
    expect(await screen.findByTestId('navigation-logo-preview')).toBeInTheDocument();
    expect(
      await screen.findByRole('menuitem', { key: 'custom_navigation_header_preview_home_text' })
    ).toBeInTheDocument();
    expect(
      await screen.findByRole('menuitem', { key: 'custom_navigation_header_preview_channels_text' })
    ).toBeInTheDocument();
    expect(
      await screen.findByRole('menuitem', { key: 'custom_navigation_header_preview_videos_text' })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('menuitem', { key: 'custom_navigation_header_preview_upcoming_events_text' })
    ).not.toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });
  it('Verify the header is rendered correctly without videos', async () => {
    const customNavigationDataWithoutVideos = {
      ...customNavigationData,
      videos: {
        isEnabled: false
      }
    };
    const { container } = render(
      <MockedProvider mocks={[videoHubMock]}>
        <TestWrapper>
          <NavigationHeader
            customNavigation={customNavigationDataWithoutVideos}
            advancedOptions={advancedOptionsDataWithLeftAlignment}
          />
        </TestWrapper>
      </MockedProvider>
    );
    expect(await screen.findByTestId('navigation-header-preview')).toBeInTheDocument();
    expect(await screen.findByTestId('navigation-login-preview')).toBeInTheDocument();
    expect(await screen.findByTestId('navigation-logo-preview')).toBeInTheDocument();
    expect(
      await screen.findByRole('menuitem', { key: 'custom_navigation_header_preview_home_text' })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('menuitem', { key: 'custom_navigation_header_preview_videos_text' })
    ).not.toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });
  it('Verify the header is rendered correctly without channels', async () => {
    const customNavigationDataWithoutChannels = {
      ...customNavigationData,
      channels: {
        isEnabled: false
      }
    };
    const { container } = render(
      <MockedProvider mocks={[videoHubMock]}>
        <TestWrapper>
          <NavigationHeader
            customNavigation={customNavigationDataWithoutChannels}
            advancedOptions={advancedOptionsDataWithLeftAlignment}
          />
        </TestWrapper>
      </MockedProvider>
    );
    expect(await screen.findByTestId('navigation-header-preview')).toBeInTheDocument();
    expect(await screen.findByTestId('navigation-login-preview')).toBeInTheDocument();
    expect(await screen.findByTestId('navigation-logo-preview')).toBeInTheDocument();
    expect(
      await screen.findByRole('menuitem', { key: 'custom_navigation_header_preview_home_text' })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('menuitem', { key: 'custom_navigation_header_preview_channels_text' })
    ).not.toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('Verify the header is rendered correct with no scrollInSmallDevice to false', async () => {
    render(
      <MockedProvider mocks={[videoHubMock]}>
        <TestWrapper>
          <Header
            advancedOptions={advancedOptionsDataWithLeftAlignment}
            scrollInSmallDevice={false}
            customNavigation={customNavigationData}
            logoAltText="TEST"
            logoImageUrl="https://google.com"
          />
        </TestWrapper>
      </MockedProvider>
    );
    const component = await screen.findByTestId('navigation-header-preview');
    expect(component).toBeInTheDocument();
    expect(component).toHaveStyle('overflow-x: hidden');
  });

  it('Verify the header is rendered correct with no scrollInSmallDevice to true', async () => {
    render(
      <MockedProvider mocks={[videoHubMock]}>
        <TestWrapper>
          <Header
            advancedOptions={advancedOptionsDataWithLeftAlignment}
            scrollInSmallDevice
            customNavigation={customNavigationData}
            logoAltText="TEST"
            logoImageUrl="https://google.com"
          />
        </TestWrapper>
      </MockedProvider>
    );
    const component = await screen.findByTestId('navigation-header-preview');
    expect(component).toBeInTheDocument();
    expect(component).toHaveStyle('overflow-x: auto');
  });

  it('Verify the header is rendered correct with no scrollInSmallDevice to null', async () => {
    render(
      <MockedProvider mocks={[videoHubMock]}>
        <TestWrapper>
          <Header
            advancedOptions={advancedOptionsDataWithLeftAlignment}
            customNavigation={customNavigationData}
            logoAltText="TEST"
            logoImageUrl="https://google.com"
          />
        </TestWrapper>
      </MockedProvider>
    );
    const component = await screen.findByTestId('navigation-header-preview');
    expect(component).toBeInTheDocument();
    expect(component).toHaveStyle('overflow-x: auto');
  });
});

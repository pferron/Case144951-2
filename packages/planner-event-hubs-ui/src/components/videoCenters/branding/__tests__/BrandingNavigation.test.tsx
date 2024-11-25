import React from 'react';
import 'jest-axe/extend-expect';
import { fireEvent, render, waitFor, within } from '@testing-library/react';
import { screen } from 'nucleus-text/testing-library/screen';
import BrandingNavigation from '@components/videoCenters/branding/BrandingNavigation';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import { AppFeaturesProvider } from '@components/AppFeaturesProvider';
// import { axe } from 'jest-axe';
import {
  DefaultLandingPage,
  NavigationAlignment,
  NavigationLinkHighlightStyle
} from '@cvent/planner-event-hubs-model/types';
import { GET_VIDEO_HUB, upsertHubCustomizationsMutation } from '@cvent/planner-event-hubs-model/operations/hub';
import { MockedProvider } from '@apollo/client/testing';
import { InMemoryCache } from '@apollo/client';

jest.mock('@components/videoCenters/branding/preview/NavigationHeader', () => {
  return {
    __esModule: true, // this property makes it work
    default: props => {
      return <div>{props.navigationAlignment}</div>;
    }
  };
});
const hubId = 'test-hub-id';

const defaultLandingPageFeature = [
  {
    name: 'defaultLandingPageFeature',
    enabled: true,
    experimentVersion: '1001'
  }
];

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
  },
  defaultLandingPage: DefaultLandingPage.Videos
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

const advancedOptionsData = {
  navigationAlignment: NavigationAlignment.Left,
  navigationLinkHighlightStyle: NavigationLinkHighlightStyle.Filled,
  navigationLinkTextSize: '16',
  navigationHeaderLeftPadding: '16',
  navigationHeaderRightPadding: '16',
  navigationHeaderMaxWidth: null
};

const advancedOptionsData2 = {
  navigationAlignment: NavigationAlignment.Center,
  navigationLinkHighlightStyle: NavigationLinkHighlightStyle.Filled,
  navigationLinkTextSize: '13',
  navigationHeaderLeftPadding: '16',
  navigationHeaderRightPadding: '16',
  navigationHeaderMaxWidth: null
};

const advancedOptionsData3 = {
  navigationAlignment: NavigationAlignment.Center,
  navigationLinkHighlightStyle: NavigationLinkHighlightStyle.Filled,
  navigationLinkTextSize: '13',
  navigationHeaderLeftPadding: '25',
  navigationHeaderRightPadding: '25',
  navigationHeaderMaxWidth: null
};

const advancedOptionsData4 = {
  navigationAlignment: NavigationAlignment.Center,
  navigationLinkHighlightStyle: NavigationLinkHighlightStyle.Filled,
  navigationLinkTextSize: '13',
  navigationHeaderLeftPadding: '16',
  navigationHeaderRightPadding: '16',
  navigationHeaderMaxWidth: '1098'
};

const videoHubMock = {
  request: {
    query: GET_VIDEO_HUB,
    variables: { hubID: { id: hubId } }
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
          actionColor: '',
          backgroundColor: '',
          logoImageRelativePath: '',
          logoImageUrl: '',
          logoOriginalImageUrl: '',
          mainColor: ''
        }
      }
    }
  }
};
const customizationResult = {
  data: {
    upsertHubCustomizations: {
      headerHtml: '<div>\n<h1>demo</h1>demo\n<h1>demo</h1>\n    <h1>demo</h1>\n<h2>hello</h2>\n<h2>hello</h2>\n</div>',
      headerCss: 'center{hkjj}',
      headerJavascript: 'This is test Javascript',
      showCustomHeader: false,
      showLogo: true,
      showLogin: false,
      showHomePage: true,
      showUpcomingEvents: true,
      showChannels: true,
      showVideos: true,
      showNavigation: true,
      navigationAlignment: 'Left',
      navigationLinkHighlightStyle: 'Filled',
      navigationLinkTextSize: 16,
      navigationHeaderLeftPadding: 16,
      navigationHeaderRightPadding: 16,
      navigationHeaderMaxWidth: null,
      defaultLandingPage: DefaultLandingPage.UpcomingEvents,
      __typename: 'Customizations'
    }
  }
};

const upsertCustomizationMock = {
  request: {
    query: upsertHubCustomizationsMutation,
    variables: {
      id: {
        id: hubId
      },
      input: {
        navigationAlignment: 'Left',
        showLogin: false,
        showLogo: false,
        showChannels: true,
        showHomePage: false,
        showVideos: false,
        showUpcomingEvents: true,
        navigationLinkHighlightStyle: 'Filled',
        navigationLinkTextSize: 16,
        navigationHeaderLeftPadding: 16,
        navigationHeaderRightPadding: 16,
        navigationHeaderMaxWidth: null,
        defaultLandingPage: DefaultLandingPage.Videos
      }
    }
  },
  result: customizationResult
};

const setIsPageEdited = () => {
  // no-code
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Branding Navigation', () => {
  it('Verify the page is rendered correctly with provided values', async () => {
    render(
      <MockedProvider mocks={[videoHubMock]}>
        <TestWrapper>
          <AppFeaturesProvider value={defaultLandingPageFeature}>
            <BrandingNavigation
              hubId={hubId}
              customNavigation={customNavigationData}
              advancedOptions={advancedOptionsData}
              setIsPageEdited={setIsPageEdited}
            />
          </AppFeaturesProvider>
        </TestWrapper>
      </MockedProvider>
    );
    const preview = await screen.findByTextKey('custom_navigation_preview');
    expect(preview).toBeInTheDocument();

    const customNavigation = await screen.findByTextKey('custom_navigation_sub_header');
    expect(customNavigation).toBeInTheDocument();
    const customNavSubHeader = await screen.findByTextKey('custom_navigation_sub_header');
    expect(customNavSubHeader).toBeInTheDocument();
    // HomePage
    const customNavHomePage = await screen.findByTestId('custom-navigation-table-row-2');
    expect(customNavHomePage).toBeInTheDocument();
    const linkHomepage = await within(customNavHomePage).findByTestId('custom-navigation-link-copy-button');
    expect(linkHomepage).toBeInTheDocument();

    const defaultLandingPage = await screen.findByTestId('default-landing-page-dropDown');
    expect(defaultLandingPage).toBeInTheDocument();
    expect(defaultLandingPage).toBeEnabled();
    expect(defaultLandingPage).toHaveTextContent(DefaultLandingPage.Videos);
    // Navigation Alignment
    const customNavigationAlignment = await screen.findByTestId('radio-navigation-alignment');
    expect(customNavigationAlignment).toBeInTheDocument();
    // Navigation Link Highlight Style
    const customNavigationHighlightStyle = await screen.findByTestId('radio-navigation-link-highlight-style');
    expect(customNavigationHighlightStyle).toBeInTheDocument();
    // headings-font-size-dropdown
    const customNavigationLinkFontSize = await screen.findByTestId('navigation-font-size-dropdown');
    expect(customNavigationLinkFontSize).toBeInTheDocument();
    const navigationAlignmentLeft = await screen.findByTextKey('custom_navigation_alignment_left');
    expect(navigationAlignmentLeft).toBeInTheDocument();
    const navigationHighLightStyleFilled = await screen.findByTextKey('custom_navigation_highlight_style_filled');
    expect(navigationHighLightStyleFilled).toBeInTheDocument();
    // expect(await axe(container)).toHaveNoViolations(); Tile Aria attribure, table header missing
  });

  it('Verify the publish button is toggled when changes are made to custom navigation grid and calls save', async () => {
    const cache = new InMemoryCache();

    render(
      <MockedProvider mocks={[videoHubMock, upsertCustomizationMock]} cache={cache}>
        <TestWrapper>
          <BrandingNavigation
            hubId={hubId}
            customNavigation={customNavigationData}
            advancedOptions={advancedOptionsData}
            setIsPageEdited={setIsPageEdited}
          />
        </TestWrapper>
      </MockedProvider>
    );
    const writeQueryMock = jest.spyOn(cache, 'writeQuery');

    // HomePage
    const customNavHomePage = await screen.findByTestId('custom-navigation-table-row-2');
    expect(customNavHomePage).toBeInTheDocument();
    const buttonsHomepage = await within(customNavHomePage).findAllByRole('button');
    expect(buttonsHomepage.length).toBe(2);
    const toggleHomepage = buttonsHomepage[0];
    expect(toggleHomepage).toBeEnabled();
    const publishButton = await screen.findByRole('button', { key: 'custom_navigation_publish' });
    expect(publishButton).toBeInTheDocument();
    expect(publishButton).toBeDisabled();
    fireEvent.click(toggleHomepage);
    expect(publishButton).toBeEnabled();
    fireEvent.click(toggleHomepage);
    expect(publishButton).toBeDisabled();

    // Login Registration
    const customNavLoginPage = await screen.findByTestId('custom-navigation-table-row-1');
    expect(customNavLoginPage).toBeInTheDocument();
    const buttonsLoginpage = await within(customNavLoginPage).findAllByRole('button');
    expect(buttonsLoginpage.length).toBe(2);
    const toggleLoginpage = buttonsLoginpage[0];
    expect(toggleLoginpage).toBeEnabled();
    fireEvent.click(toggleLoginpage);
    expect(publishButton).toBeEnabled();
    fireEvent.click(publishButton);
    await waitFor(() => {
      expect(writeQueryMock).toHaveBeenCalledTimes(1);
    });
  });

  it('Verify the publish button is toggled when changes are made to navigation alignment grid', async () => {
    const upsertCustomizationMockforAlignmentChange = {
      request: {
        query: upsertHubCustomizationsMutation,
        variables: {
          id: {
            id: hubId
          },
          input: {
            navigationAlignment: 'Left',
            showLogin: true,
            showLogo: false,
            showChannels: true,
            showHomePage: false,
            showVideos: false,
            navigationLinkHighlightStyle: 'Filled',
            navigationLinkTextSize: 13,
            navigationHeaderLeftPadding: 16,
            navigationHeaderRightPadding: 16,
            navigationHeaderMaxWidth: null,
            showUpcomingEvents: true,
            defaultLandingPage: DefaultLandingPage.Videos
          }
        }
      },
      result: customizationResult
    };

    const cache = new InMemoryCache();
    render(
      <MockedProvider mocks={[videoHubMock, upsertCustomizationMockforAlignmentChange]} cache={cache}>
        <TestWrapper>
          <BrandingNavigation
            hubId={hubId}
            customNavigation={customNavigationData}
            advancedOptions={advancedOptionsData2}
            setIsPageEdited={setIsPageEdited}
          />
        </TestWrapper>
      </MockedProvider>
    );
    const writeQueryMock = jest.spyOn(cache, 'writeQuery');

    // Navigation Alignment
    const navigationAlignmentLeft = await screen.findByTextKey('custom_navigation_alignment_left');
    expect(navigationAlignmentLeft).toBeInTheDocument();
    const publishButton = await screen.findByRole('button', { key: 'custom_navigation_publish' });
    expect(publishButton).toBeInTheDocument();
    expect(publishButton).toBeDisabled();
    fireEvent.click(navigationAlignmentLeft);
    expect(publishButton).toBeEnabled();
    fireEvent.click(publishButton);
    await waitFor(() => {
      expect(writeQueryMock).toHaveBeenCalledTimes(1);
    });
  });

  it('Verify the publish button is toggled when changes are made to navigation highlight style', async () => {
    const upsertCustomizationMockforHighlightStyleChange = {
      request: {
        query: upsertHubCustomizationsMutation,
        variables: {
          id: {
            id: hubId
          },
          input: {
            navigationAlignment: 'Center',
            showLogin: true,
            showLogo: false,
            showChannels: true,
            showHomePage: false,
            showVideos: false,
            navigationLinkHighlightStyle: 'Underline',
            navigationLinkTextSize: 13,
            showUpcomingEvents: true,
            navigationHeaderLeftPadding: 16,
            navigationHeaderRightPadding: 16,
            navigationHeaderMaxWidth: null,
            defaultLandingPage: DefaultLandingPage.Videos
          }
        }
      },
      result: customizationResult
    };

    const cache = new InMemoryCache();
    render(
      <MockedProvider mocks={[videoHubMock, upsertCustomizationMockforHighlightStyleChange]} cache={cache}>
        <TestWrapper>
          <BrandingNavigation
            hubId={hubId}
            customNavigation={customNavigationData}
            advancedOptions={advancedOptionsData2}
            setIsPageEdited={setIsPageEdited}
          />
        </TestWrapper>
      </MockedProvider>
    );
    const writeQueryMock = jest.spyOn(cache, 'writeQuery');

    // Navigation Alignment
    const navigationAlignmentUnderlined = await screen.findByTextKey('custom_navigation_highlight_style_underline');
    expect(navigationAlignmentUnderlined).toBeInTheDocument();
    const publishButton = await screen.findByRole('button', { key: 'custom_navigation_publish' });
    expect(publishButton).toBeInTheDocument();
    expect(publishButton).toBeDisabled();
    fireEvent.click(navigationAlignmentUnderlined);
    expect(publishButton).toBeEnabled();
    fireEvent.click(publishButton);
    await waitFor(() => {
      expect(writeQueryMock).toHaveBeenCalledTimes(1);
    });
  });

  it('Verify the publish button is toggled when changes are made to navigation spacing padding', async () => {
    const upsertCustomizationMockforHighlightStyleChange = {
      request: {
        query: upsertHubCustomizationsMutation,
        variables: {
          id: {
            id: hubId
          },
          input: {
            navigationAlignment: 'Center',
            showLogin: true,
            showLogo: false,
            showChannels: true,
            showHomePage: false,
            showVideos: false,
            navigationLinkHighlightStyle: 'Filled',
            navigationLinkTextSize: 13,
            showUpcomingEvents: true,
            navigationHeaderLeftPadding: 16,
            navigationHeaderRightPadding: 16,
            navigationHeaderMaxWidth: null,
            defaultLandingPage: DefaultLandingPage.Videos
          }
        }
      },
      result: customizationResult
    };

    const cache = new InMemoryCache();
    render(
      <MockedProvider mocks={[videoHubMock, upsertCustomizationMockforHighlightStyleChange]} cache={cache}>
        <TestWrapper>
          <BrandingNavigation
            hubId={hubId}
            customNavigation={customNavigationData}
            advancedOptions={advancedOptionsData3}
            setIsPageEdited={setIsPageEdited}
          />
        </TestWrapper>
      </MockedProvider>
    );
    const writeQueryMock = jest.spyOn(cache, 'writeQuery');

    // Navigation Alignment
    const navigationHeaderPadding = await screen.findByTestId('branding-horizontal-padding-text-box');
    expect(navigationHeaderPadding).toBeInTheDocument();
    const publishButton = await screen.findByRole('button', { key: 'custom_navigation_publish' });
    expect(publishButton).toBeInTheDocument();
    expect(publishButton).toBeDisabled();
    const restoreDefault = await screen.findAllByTextKey('events_plus_advance_options_restore_defaults');
    expect(restoreDefault[0]).toBeInTheDocument();
    const paddingLabel = await screen.findByTextKey('events_plus_advance_options_horizontal_padding_info_label');
    expect(paddingLabel).toBeInTheDocument();
    fireEvent.click(restoreDefault[0]);
    expect(publishButton).toBeEnabled();
    fireEvent.click(publishButton);
    await waitFor(() => {
      expect(writeQueryMock).toHaveBeenCalledTimes(1);
    });
  });
  it('Verify the publish button is toggled when changes are made to navigation spacing max width', async () => {
    const upsertCustomizationMockforHighlightStyleChange = {
      request: {
        query: upsertHubCustomizationsMutation,
        variables: {
          id: {
            id: hubId
          },
          input: {
            navigationAlignment: 'Center',
            showLogin: true,
            showLogo: false,
            showChannels: true,
            showHomePage: false,
            showVideos: false,
            navigationLinkHighlightStyle: 'Filled',
            navigationLinkTextSize: 13,
            showUpcomingEvents: true,
            navigationHeaderLeftPadding: 16,
            navigationHeaderRightPadding: 16,
            navigationHeaderMaxWidth: null,
            defaultLandingPage: DefaultLandingPage.Videos
          }
        }
      },
      result: customizationResult
    };

    const cache = new InMemoryCache();
    render(
      <MockedProvider mocks={[videoHubMock, upsertCustomizationMockforHighlightStyleChange]} cache={cache}>
        <TestWrapper>
          <BrandingNavigation
            hubId={hubId}
            customNavigation={customNavigationData}
            advancedOptions={advancedOptionsData4}
            setIsPageEdited={setIsPageEdited}
          />
        </TestWrapper>
      </MockedProvider>
    );
    const writeQueryMock = jest.spyOn(cache, 'writeQuery');

    // Navigation Alignment
    const navigationHeaderPadding = await screen.findByTestId('branding-max-width-text-box');
    expect(navigationHeaderPadding).toBeInTheDocument();
    const publishButton = await screen.findByRole('button', { key: 'custom_navigation_publish' });
    expect(publishButton).toBeInTheDocument();
    expect(publishButton).toBeDisabled();
    const restoreDefault = await screen.findAllByTextKey('events_plus_advance_options_restore_defaults');
    expect(restoreDefault[0]).toBeInTheDocument();
    const paddingLabel = await screen.findByTextKey('events_plus_advance_options_max_width_info_label');
    expect(paddingLabel).toBeInTheDocument();
    fireEvent.click(restoreDefault[0]);
    expect(publishButton).toBeEnabled();
    fireEvent.click(publishButton);
    await waitFor(() => {
      expect(writeQueryMock).toHaveBeenCalledTimes(1);
    });
  });

  it('Verify default landing page dropdown', async () => {
    const customNavHomePageEnabled = customNavigationData;
    customNavHomePageEnabled.homePage.isEnabled = true;

    render(
      <MockedProvider mocks={[videoHubMock]}>
        <TestWrapper>
          <AppFeaturesProvider value={defaultLandingPageFeature}>
            <BrandingNavigation
              hubId={hubId}
              customNavigation={customNavHomePageEnabled}
              advancedOptions={advancedOptionsData}
              setIsPageEdited={setIsPageEdited}
            />
          </AppFeaturesProvider>
        </TestWrapper>
      </MockedProvider>
    );

    // HomePage
    const customNavHomePage = await screen.findByTestId('custom-navigation-table-row-2');
    expect(customNavHomePage).toBeInTheDocument();
    const buttonsHomepage = await within(customNavHomePage).findAllByRole('button');
    expect(buttonsHomepage.length).toBe(2);
    const toggleHomepage = buttonsHomepage[0];
    expect(toggleHomepage).toBeEnabled();
    const publishButton = await screen.findByRole('button', { key: 'custom_navigation_publish' });
    expect(publishButton).toBeInTheDocument();
    expect(publishButton).toBeDisabled();
    fireEvent.click(toggleHomepage);

    const helpCircleIcon = await screen.findByTestId('landing-page-help-icon-help-circle-icon');
    expect(helpCircleIcon).toBeInTheDocument();
    fireEvent.click(helpCircleIcon);
    expect(await screen.findByTextKey('landing_page_dropdown_help_icon_text')).toBeInTheDocument();

    const defaultLandingPage = await screen.findByTestId('default-landing-page-dropDown');
    expect(defaultLandingPage).toBeInTheDocument();
    expect(defaultLandingPage).toBeEnabled();
    fireEvent.click(defaultLandingPage);

    const UpcomingEventsLandingPage = await screen.findByTestId('default-landing-page-dropDown-option-1');
    fireEvent.click(UpcomingEventsLandingPage);
    expect(publishButton).toBeEnabled();
  });
});

import React from 'react';
import {
  getHubCustomizationsQuery,
  upsertHubCustomizationsMutation,
  getAccountAndCustomFontInformation
} from '@cvent/planner-event-hubs-model/operations/hub';
import { fireEvent, render, within } from '@testing-library/react';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import { MockedProvider } from '@apollo/client/testing';
import BrandingCustomHeader from '@components/videoCenters/branding/BrandingCustomHeader';
import { screen } from 'nucleus-text/testing-library/screen';
import { Customizations } from '@cvent/planner-event-hubs-model/types';

const customization: Customizations = {
  headerHtml: '<h1>This is a test HTML</h1> ',
  headerCss: 'This is test CSS.',
  headerJavascript: 'This is test Script',
  showCustomHeader: true,
  showNavigation: true
};

const updatedCustomization = {
  ...customization,
  headerCss: 'Updating CSS'
};

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

const setNavigationDisabled = () => {
  // no-code
};

const setIsPageEdited = () => {
  // no-code
};

const mockWithCustomHeader = [
  {
    request: {
      query: getHubCustomizationsQuery,
      variables: {
        id: {
          id: 'dummy-id'
        }
      }
    },
    result: {
      data: {
        getHubCustomizations: customization
      }
    }
  },
  {
    request: {
      query: upsertHubCustomizationsMutation,
      variables: {
        id: {
          id: 'dummy-id'
        },
        input: updatedCustomization
      }
    },
    result: {
      data: {
        upsertHubCustomizations: updatedCustomization
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

describe('Branding Custom Header', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should render custom header card', async () => {
    render(
      <TestWrapper>
        <MockedProvider mocks={mockWithCustomHeader}>
          <BrandingCustomHeader
            hubId="dummy-id"
            hubCustomizationData={customization}
            customNavigation={customNavigationData}
            setNavigationDisabled={setNavigationDisabled}
            setIsPageEdited={setIsPageEdited}
          />
        </MockedProvider>
      </TestWrapper>
    );
    // ToDo: Uncomment in https://jira.cvent.com/browse/HUB-138212
    // expect(await screen.findByTextKey('events_plus_custom_header_page_alert_heading')).toBeInTheDocument();
    // expect(await screen.findByTextKey('events_plus_custom_header_page_alert_info_text')).toBeInTheDocument();
    expect(await screen.findByTextKey('events_plus_custom_header_html_heading')).toBeInTheDocument();
    expect(screen.getByTestId('headerHtml-textarea')).toHaveTextContent('<h1>This is a test HTML</h1>');
    expect(await screen.findByTextKey('events_plus_custom_header_css_heading')).toBeInTheDocument();
    const cssTextArea = screen.getByTestId('headerCss-textarea');
    expect(cssTextArea).toHaveTextContent('This is test CSS');
    expect(await screen.findByTextKey('events_plus_custom_header_script_heading')).toBeInTheDocument();
    expect(screen.getByTestId('headerJavascript-textarea')).toHaveTextContent('This is test Script');
    const publishButton = screen.getByRole('button', { key: 'events_plus_custom_header_publish_button' });
    expect(publishButton).toBeInTheDocument();
    const previewButton = screen.getByRole('button', { key: 'events_plus_custom_header_preview_button' });
    expect(previewButton).toBeInTheDocument();
    expect(previewButton).toBeEnabled();
  });

  it('Should render Custom header preview modal when preview button is clicked', async () => {
    render(
      <TestWrapper>
        <MockedProvider mocks={mockWithCustomHeader}>
          <BrandingCustomHeader
            hubId="dummy-id"
            hubCustomizationData={customization}
            customNavigation={customNavigationData}
            setNavigationDisabled={setNavigationDisabled}
            setIsPageEdited={setIsPageEdited}
          />
        </MockedProvider>
      </TestWrapper>
    );
    // ToDo: Uncomment in https://jira.cvent.com/browse/HUB-138212
    // expect(await screen.findByTextKey('events_plus_custom_header_page_alert_heading')).toBeInTheDocument();
    const previewButton = screen.getByRole('button', { key: 'events_plus_custom_header_preview_button' });
    expect(previewButton).toBeInTheDocument();
    expect(previewButton).toBeEnabled();
    fireEvent.click(previewButton);
    expect(screen.getByTestId('custom-header-preview-modal')).toBeInTheDocument();
    expect(screen.getByTestId('custom-header-preview-modal-close-button')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Preview/i })).toBeInTheDocument();
  });

  it('Should render hide events+ navigation card when navigation is visible', async () => {
    render(
      <TestWrapper>
        <MockedProvider mocks={mockWithCustomHeader}>
          <BrandingCustomHeader
            hubId="dummy-id"
            hubCustomizationData={customization}
            customNavigation={customNavigationData}
            setNavigationDisabled={setNavigationDisabled}
            setIsPageEdited={setIsPageEdited}
          />
        </MockedProvider>
      </TestWrapper>
    );
    expect(await screen.findByTextKey('events_plus_custom_header_hide_navigation_heading')).toBeInTheDocument();
    expect(await screen.findByTextKey('events_plus_custom_header_hide_navigation_info_text')).toBeInTheDocument();
    const toggleButton = screen.getByRole('button', {
      key: 'events_plus_custom_header_hide_navigation_toggle'
    });
    expect(toggleButton).toBeInTheDocument();
    const saveButton = screen.getByRole('button', { key: 'events_plus_custom_header_hide_navigation_save_button' });
    expect(saveButton).toBeInTheDocument();
    expect(saveButton).toBeDisabled();
    expect(screen.queryByTestId('events-plus-navigation-table')).not.toBeInTheDocument();
  });

  it('Should render hide events+ navigation card with navigation table when navigation is hidden', async () => {
    render(
      <TestWrapper>
        <MockedProvider mocks={mockWithCustomHeader}>
          <BrandingCustomHeader
            hubId="dummy-id"
            hubCustomizationData={{ ...customization, showNavigation: false }}
            customNavigation={customNavigationData}
            setNavigationDisabled={setNavigationDisabled}
            setIsPageEdited={setIsPageEdited}
          />
        </MockedProvider>
      </TestWrapper>
    );
    expect(
      await screen.findByRole('heading', {
        level: 3,
        key: 'events_plus_custom_header_navigation_table_url_column_heading'
      })
    ).toBeInTheDocument();
    expect(screen.getByTestId('events-plus-navigation-table')).toBeInTheDocument();
    const homePage = await screen.findByTestId('events-plus-navigation-table-row-2');
    expect(homePage).toBeInTheDocument();
    const linkHomepage = await within(homePage).findByTestId('events-plus-navigation-link-copy-button');
    expect(linkHomepage).toBeInTheDocument();
  });

  it('Should enable publish button for custom header card on input change and save on clicking', async () => {
    render(
      <TestWrapper>
        <MockedProvider mocks={mockWithCustomHeader}>
          <BrandingCustomHeader
            hubId="dummy-id"
            hubCustomizationData={customization}
            customNavigation={customNavigationData}
            setNavigationDisabled={setNavigationDisabled}
            setIsPageEdited={setIsPageEdited}
          />
        </MockedProvider>
      </TestWrapper>
    );
    // ToDo: Uncomment in https://jira.cvent.com/browse/HUB-138212
    // expect(await screen.findByTextKey('events_plus_custom_header_page_alert_heading')).toBeInTheDocument();
    const cssTextArea = screen.getByTestId('headerCss-textarea');
    fireEvent.change(cssTextArea, { target: { value: 'Updating CSS' } });
    expect(cssTextArea).toHaveTextContent('Updating CSS');
    const publishButton = screen.getByRole('button', { key: 'events_plus_custom_header_publish_button' });
    expect(publishButton).toBeEnabled();
    fireEvent.click(publishButton);
    expect(cssTextArea).toHaveTextContent('Updating CSS');
  });
});

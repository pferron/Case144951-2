import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import { screen } from 'nucleus-text/testing-library/screen';
import { Theme } from '@cvent/planner-event-hubs-model/types';
import { DEFAULT_FONT_ID } from '@components/videoCenters/branding/constants';
import BrandingContentWrapper from '../BrandingContentWrapper';

const mockThemeState: Theme = {
  actionColor: '#116ce1',
  backgroundColor: '#000000',
  logoImageRelativePath: null,
  logoImageUrl: 'logo.image.url.png',
  logoOriginalImageUrl: 'logo.image.url.png',
  logoAltText: 'Video Center',
  mainColor: '#325289',
  moodColor: '#212121',
  safeMode: false,
  headingsFont: DEFAULT_FONT_ID,
  bodyFont: DEFAULT_FONT_ID
};
const mockSetThemeState = jest.fn();
const mockOnSaveTheme = jest.fn();

describe('testing Branding and Theme', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const customFonts = [
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
  ];

  const emptyCustomFonts = [];

  it('Should render the color picker and preview', async () => {
    render(
      <TestWrapper>
        <BrandingContentWrapper
          customFonts={emptyCustomFonts}
          themeState={mockThemeState}
          setThemeState={mockSetThemeState}
          onSaveTheme={mockOnSaveTheme}
          isThemeUpdated={false}
        />
      </TestWrapper>
    );
    expect(await screen.findByTestId('block-theming-selection')).toBeInTheDocument();
    expect(screen.getByTestId('branding-theming-color-picker')).toBeInTheDocument();
    expect(screen.getByTestId('branding-theming-moods')).toBeInTheDocument();
    expect(screen.getByTestId('branding-theming-advanced-setting')).toBeInTheDocument();
    expect(screen.getByTestId('theme-change-preview')).toBeInTheDocument();
    /* Axe test fails becuase of carina Tiles component which we don't have control
      CARINA-9200
    */
  });

  it('Save button should be disabled when there is no change made in theme', async () => {
    render(
      <TestWrapper>
        <BrandingContentWrapper
          customFonts={customFonts}
          themeState={mockThemeState}
          setThemeState={mockSetThemeState}
          onSaveTheme={mockOnSaveTheme}
          isThemeUpdated={false}
        />
      </TestWrapper>
    );
    const saveBtn = await screen.findByRole('button', { key: 'video_hub_branding_page_save_changes' });
    expect(saveBtn).toBeDisabled();
  });

  it('Changing moods should call the setTheme function', async () => {
    render(
      <TestWrapper>
        <BrandingContentWrapper
          customFonts={customFonts}
          themeState={mockThemeState}
          setThemeState={mockSetThemeState}
          onSaveTheme={mockOnSaveTheme}
          isThemeUpdated={false}
        />
      </TestWrapper>
    );
    const colorMoodTile = await screen.findByTestId('brand-mood-color');
    fireEvent.click(colorMoodTile);
    expect(mockSetThemeState).toHaveBeenCalled();
  });

  it('Changing safeMode checkbox should call setTheme function', async () => {
    render(
      <TestWrapper>
        <BrandingContentWrapper
          customFonts={customFonts}
          themeState={mockThemeState}
          setThemeState={mockSetThemeState}
          onSaveTheme={mockOnSaveTheme}
          isThemeUpdated={false}
        />
      </TestWrapper>
    );
    const safeModeCheckbox = await screen.findByTestId('safe-mode-preview');
    fireEvent.click(safeModeCheckbox);
    expect(mockSetThemeState).toHaveBeenCalled();
  });

  it('Should display fonts section when feature enable', async () => {
    render(
      <TestWrapper>
        <BrandingContentWrapper
          customFonts={customFonts}
          themeState={mockThemeState}
          setThemeState={mockSetThemeState}
          onSaveTheme={mockOnSaveTheme}
          isThemeUpdated={false}
        />
      </TestWrapper>
    );
    await waitFor(
      async () => {
        expect(await screen.findByTextKey('events_plus_custom_font_title')).toBeInTheDocument();
      },
      {
        interval: 100,
        timeout: 10000
      }
    );
    const customFontTitle = await screen.findByTextKey('events_plus_custom_font_title');
    expect(customFontTitle).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'custom-font-info-text' })).toBeInTheDocument();
    const customFontDescription = await screen.findByTextKey('events_plus_custom_font_description');
    expect(customFontDescription).toBeInTheDocument();
    const headingDropdownButton = await screen.findByLabelTextKey(
      'events_plus_custom_font_headings_dropdown_accessibility_label'
    );
    expect(headingDropdownButton).toBeInTheDocument();
    expect(headingDropdownButton).toHaveTextContent('Helvetica (default)');
    fireEvent.click(headingDropdownButton);
    const headingFontMenuItems = await screen.findAllByRole('menuitemradio');
    expect(headingFontMenuItems[0]).toHaveTextContent('Agbalumo');
    expect(headingFontMenuItems[1]).toHaveTextContent('NotoSansKawi');
    fireEvent.click(headingFontMenuItems[1]);
    const bodyTextDropdownButton = await screen.findByLabelTextKey(
      'events_plus_custom_font_body_text_dropdown_accessibility_label'
    );
    expect(bodyTextDropdownButton).toBeInTheDocument();
    expect(bodyTextDropdownButton).toHaveTextContent('Helvetica (default)');
    fireEvent.click(bodyTextDropdownButton);
    const bodyTextFontMenuItems = await screen.findAllByRole('menuitemradio');
    expect(bodyTextFontMenuItems[0]).toHaveTextContent('Agbalumo');
    expect(bodyTextFontMenuItems[1]).toHaveTextContent('NotoSansKawi');
    fireEvent.click(bodyTextFontMenuItems[0]);
    await waitFor(() => {
      expect(mockSetThemeState).toHaveBeenCalledTimes(2);
    });
  });

  it('Should display fonts section when feature enable and only Helvetica when no custom fonts available', async () => {
    render(
      <TestWrapper>
        <BrandingContentWrapper
          customFonts={emptyCustomFonts}
          themeState={mockThemeState}
          setThemeState={mockSetThemeState}
          onSaveTheme={mockOnSaveTheme}
          isThemeUpdated={false}
        />
      </TestWrapper>
    );
    await waitFor(
      async () => {
        expect(await screen.findByTextKey('events_plus_custom_font_title')).toBeInTheDocument();
      },
      {
        interval: 100,
        timeout: 10000
      }
    );
    const customFontTitle = await screen.findByTextKey('events_plus_custom_font_title');
    expect(customFontTitle).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'custom-font-info-text' })).toBeInTheDocument();
    const customFontDescription = await screen.findByTextKey('events_plus_custom_font_description');
    expect(customFontDescription).toBeInTheDocument();
    const headingDropdownButton = await screen.findByLabelTextKey(
      'events_plus_custom_font_headings_dropdown_accessibility_label'
    );
    expect(headingDropdownButton).toBeInTheDocument();
    expect(headingDropdownButton).toHaveTextContent('Helvetica (default)');
    fireEvent.click(headingDropdownButton);
    const headingFontMenuItems = await screen.findAllByRole('menuitemradio');
    expect(headingFontMenuItems[0]).toHaveTextContent('Helvetica (default)');
    const bodyTextDropdownButton = await screen.findByLabelTextKey(
      'events_plus_custom_font_body_text_dropdown_accessibility_label'
    );
    expect(bodyTextDropdownButton).toBeInTheDocument();
    expect(bodyTextDropdownButton).toHaveTextContent('Helvetica (default)');
    fireEvent.click(headingDropdownButton);
    const bodyTextFontMenuItems = await screen.findAllByRole('menuitemradio');
    expect(bodyTextFontMenuItems[0]).toHaveTextContent('Helvetica (default)');
  });
});

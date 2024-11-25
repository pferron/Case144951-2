import React from 'react';
import { screen, render, fireEvent } from '@testing-library/react';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import MoodsSection from '../MoodsSection';

const mockThemeState = {
  actionColor: '#116ce1',
  backgroundColor: '#000000',
  logoImageRelativePath: null,
  logoImageUrl: 'logo.image.url.png',
  logoOriginalImageUrl: 'logo.image.url.png',
  logoAltText: 'Video Center',
  mainColor: '#325289',
  moodColor: '#FFFFFF',
  safeMode: false
};
const mockSetThemeState = jest.fn();
const mockSetMoodTheme = jest.fn();

describe('Testing Mood selection in branding page', () => {
  it('Should render mood selection options', async () => {
    render(
      <TestWrapper>
        <MoodsSection
          themeState={mockThemeState}
          moodTheme="Light"
          isBgOverridden={false}
          setMoodTheme={mockSetMoodTheme}
          setThemeState={mockSetThemeState}
        />
      </TestWrapper>
    );
    expect(await screen.findByTestId('branding-theming-moods')).toBeInTheDocument();
    expect(screen.getByTestId('brand-mood-light')).toBeInTheDocument();
    expect(screen.getByTestId('brand-mood-night')).toBeInTheDocument();
    expect(screen.getByTestId('brand-mood-color')).toBeInTheDocument();
    /* Axe test fails becuase of carina Tiles component which we don't have control
      CARINA-9200
    */
  });

  it('Should have a selected attribute on selected mood', async () => {
    render(
      <TestWrapper>
        <MoodsSection
          themeState={mockThemeState}
          moodTheme="Light"
          isBgOverridden={false}
          setMoodTheme={mockSetMoodTheme}
          setThemeState={mockSetThemeState}
        />
      </TestWrapper>
    );
    expect(await screen.findByTestId('branding-theming-moods')).toBeInTheDocument();
    const lightMood = screen.getByTestId('brand-mood-light');
    expect(lightMood.getAttribute('aria-selected')).toBeTruthy();
  });
  it('Should call setMood and setThemeState upon changig mood', async () => {
    render(
      <TestWrapper>
        <MoodsSection
          themeState={mockThemeState}
          moodTheme="Light"
          isBgOverridden={false}
          setMoodTheme={mockSetMoodTheme}
          setThemeState={mockSetThemeState}
        />
      </TestWrapper>
    );
    expect(await screen.findByTestId('branding-theming-moods')).toBeInTheDocument();
    const nightMood = screen.getByTestId('brand-mood-night');
    fireEvent.click(nightMood);
    expect(mockSetMoodTheme).toHaveBeenCalled();
    expect(mockSetThemeState).toHaveBeenCalled();
  });
});

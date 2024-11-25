import React from 'react';
import 'jest-axe/extend-expect';
import { axe } from 'jest-axe';
import { render, fireEvent } from '@testing-library/react';
import { screen } from 'nucleus-text/testing-library/screen';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import AdvancedSettings from '../AdvancedSettings';

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
const mockonBgColorChange = jest.fn();
const mockRestoreDefault = jest.fn();

describe('testing Advanced Settings in branding page', () => {
  it('Should render fine', async () => {
    const { container } = render(
      <TestWrapper>
        <AdvancedSettings
          bgColor="#ffffff"
          themeState={mockThemeState}
          isBgColorOverridden={false}
          onBgColorChange={mockonBgColorChange}
          restoreDefault={mockRestoreDefault}
          setThemeState={mockSetThemeState}
        />
      </TestWrapper>
    );
    expect(await screen.findByTestId('branding-theming-advanced-setting')).toBeInTheDocument();
    expect(await screen.findByTextKey('video_hub_branding_safe_mode_title')).toBeInTheDocument();
    expect(screen.getByTextKey('video_hub_branding_override_background')).toBeInTheDocument();
    expect(screen.getByTextKey('video_hub_branding_change_background')).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('Updating safeMode checkbox should call setTheme function', async () => {
    const { container } = render(
      <TestWrapper>
        <AdvancedSettings
          bgColor="#ffffff"
          themeState={mockThemeState}
          isBgColorOverridden={false}
          onBgColorChange={mockonBgColorChange}
          restoreDefault={mockRestoreDefault}
          setThemeState={mockSetThemeState}
        />
      </TestWrapper>
    );
    expect(await screen.findByTestId('branding-theming-advanced-setting')).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
    const safeModeCheckbox = screen.getByRole('checkbox');
    fireEvent.click(safeModeCheckbox);
    expect(mockSetThemeState).toHaveBeenCalled();
  });

  it('Should render restore default button when the bgcolor is overriden', async () => {
    const { container } = render(
      <TestWrapper>
        <AdvancedSettings
          bgColor="#ffffff"
          themeState={mockThemeState}
          isBgColorOverridden
          onBgColorChange={mockonBgColorChange}
          restoreDefault={mockRestoreDefault}
          setThemeState={mockSetThemeState}
        />
      </TestWrapper>
    );
    expect(await screen.findByTestId('branding-theming-advanced-setting')).toBeInTheDocument();
    expect(await screen.findByTextKey('video_hub_branding_restore_default')).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });
});

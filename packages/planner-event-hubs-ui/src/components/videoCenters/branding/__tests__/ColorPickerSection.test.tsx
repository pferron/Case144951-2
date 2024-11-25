import React from 'react';
import { screen, render, waitFor, fireEvent } from '@testing-library/react';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import user from '@testing-library/user-event';
import ColorPickerSection from '../ColorPickerSection';

const mockThemeState = {
  actionColor: '#116ce1',
  backgroundColor: '#000000',
  logoImageRelativePath: null,
  logoImageUrl: 'logo.image.url.png',
  logoOriginalImageUrl: 'logo.image.url.png',
  logoAltText: 'Video Center',
  mainColor: '#325289',
  moodColor: '#212121',
  safeMode: false
};
const mockSetThemeState = jest.fn();

describe('testing ColorPicker section', () => {
  it('Should render the color picker', async () => {
    render(
      <TestWrapper>
        <ColorPickerSection
          themeState={mockThemeState}
          setThemeState={mockSetThemeState}
          isBgOverridden={false}
          moodTheme="Light"
        />
      </TestWrapper>
    );
    expect(await screen.findByTestId('branding-theming-color-picker')).toBeInTheDocument();
    expect(screen.getByTestId('mood-theme-primary-color')).toBeInTheDocument();
    expect(screen.getByTestId('mood-theme-secondary-color')).toBeInTheDocument();
    /* Axe test fails becuase of Blocks ColorBox component which we don't have control 
      HUB-134612
    */
  });

  it('Changing color should call setTheme function', async () => {
    render(
      <TestWrapper>
        <ColorPickerSection
          themeState={mockThemeState}
          setThemeState={mockSetThemeState}
          isBgOverridden={false}
          moodTheme="Light"
        />
      </TestWrapper>
    );
    expect(await screen.findByTestId('branding-theming-color-picker')).toBeInTheDocument();
    const colorInput = await screen.findByRole('textbox', { name: 'Edit primary color #325289' });
    user.click(colorInput);
    user.clear(colorInput);
    fireEvent.change(colorInput, { target: { value: 'e1e1e1' } });
    user.keyboard('{Enter}');
    await waitFor(() => {
      expect(mockSetThemeState).toHaveBeenCalled();
    });
  });
});

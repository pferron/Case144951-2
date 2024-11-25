import React, { ReactNode } from 'react';
import { ThemeProvider as V0ThemeProvider } from '@cvent/carina/components/ThemeProvider/ThemeProvider';
import { ThemeProvider as V1ThemeProvider } from '@cvent/carina/components/ThemeProvider';
import { getDefaultTheme, getDarkTheme } from '@cvent/carina/utils/tokens';
// import { getDefaultTheme as v1GetDefaultTheme, getDarkTheme as v1GetDarkTheme } from '@cvent/carina/utils/tokens';

interface Props {
  children: ReactNode;
}
function V0DefaultThemeProvider({ children }: Props): JSX.Element {
  return <V0ThemeProvider theme={getDefaultTheme()}>{children}</V0ThemeProvider>;
}

function V1DefaultThemeProvider({ children }: Props): JSX.Element {
  return <V1ThemeProvider theme={getDefaultTheme()}>{children}</V1ThemeProvider>;
}

function V0DarkThemeProvider({ children }: Props): JSX.Element {
  return <V0ThemeProvider theme={getDarkTheme()}>{children}</V0ThemeProvider>;
}

function V1DarkThemeProvider({ children }: Props): JSX.Element {
  return <V1ThemeProvider theme={getDarkTheme()}>{children}</V1ThemeProvider>;
}

export {
  V0DefaultThemeProvider,
  V0DarkThemeProvider,
  getDefaultTheme,
  getDarkTheme,
  V0ThemeProvider,
  V1DefaultThemeProvider,
  V1DarkThemeProvider,
  V1ThemeProvider
};

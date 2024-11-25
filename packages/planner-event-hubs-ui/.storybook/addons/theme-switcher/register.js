import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import addons, { types, makeDecorator } from '@storybook/addons';
import { FORCE_RE_RENDER } from '@storybook/core-events';
import { ThemeProvider } from '@emotion/react';
import { ThemeProvider as CarinaThemeProvider } from '@cvent/carina/components/ThemeProvider/ThemeProvider';
import { getDefaultTheme, getDarkTheme } from '@cvent/carina/utils/tokens';

import getTheme from '../../theme';

function getLocalTheme() {
  const savedTheme = window.localStorage.getItem('sb-theme') || 'light';
  const theme = getTheme(savedTheme);

  return [savedTheme, theme];
}

function setLocalTheme({ api, theme = getLocalTheme()[0], rerender = false }) {
  window.localStorage.setItem('sb-theme', theme);

  api.setOptions({
    theme: getLocalTheme()[1]
  });

  if (rerender) {
    setTimeout(() => {
      addons.getChannel().emit(FORCE_RE_RENDER);
    }, 0);
  }
}

addons.register('storybook/theme-switcher', api => {
  addons.add('storybook/theme-switcher', {
    title: 'theme-switcher',
    type: types.TOOL,
    match: ({ viewMode }) => viewMode === 'story',
    render: () => <ThemeSwitcher api={api} />
  });
});

export const withTheme = () =>
  makeDecorator({
    name: 'withTheme',
    parameterName: 'theme',
    skipIfNoParametersOrOptions: false,
    allowDeprecatedUsage: false,
    wrapper: (getStory, context) => {
      const themeName = window.localStorage.getItem('sb-theme') || 'light';
      const theme = themeName === 'dark' ? getDarkTheme() : getDefaultTheme();

      return (
        <ThemeProvider theme={getLocalTheme()[1]}>
          <CarinaThemeProvider key={themeName} theme={theme}>
            {getStory(context)}
          </CarinaThemeProvider>
        </ThemeProvider>
      );
    }
  });

export const ThemeSwitcher = ({ api }) => {
  const [activeTheme, setTheme] = useState('light');
  const theme = activeTheme === 'dark' ? 'light' : 'dark';
  const color = activeTheme === 'light' ? 'black' : 'white';
  const icons = {
    light:
      'M96.06 454.35c.01 6.29 1.87 12.45 5.36 17.69l17.09 25.69a31.99 31.99 0 0 0 26.64 14.28h61.71a31.99 31.99 0 0 0 26.64-14.28l17.09-25.69a31.989 31.989 0 0 0 5.36-17.69l.04-38.35H96.01l.05 38.35zM0 176c0 44.37 16.45 84.85 43.56 115.78 16.52 18.85 42.36 58.23 52.21 91.45.04.26.07.52.11.78h160.24c.04-.26.07-.51.11-.78 9.85-33.22 35.69-72.6 52.21-91.45C335.55 260.85 352 220.37 352 176 352 78.61 272.91-.3 175.45 0 73.44.31 0 82.97 0 176zm176-80c-44.11 0-80 35.89-80 80 0 8.84-7.16 16-16 16s-16-7.16-16-16c0-61.76 50.24-112 112-112 8.84 0 16 7.16 16 16s-7.16 16-16 16z',
    dark: 'M176 80c-52.94 0-96 43.06-96 96 0 8.84 7.16 16 16 16s16-7.16 16-16c0-35.3 28.72-64 64-64 8.84 0 16-7.16 16-16s-7.16-16-16-16zM96.06 459.17c0 3.15.93 6.22 2.68 8.84l24.51 36.84c2.97 4.46 7.97 7.14 13.32 7.14h78.85c5.36 0 10.36-2.68 13.32-7.14l24.51-36.84c1.74-2.62 2.67-5.7 2.68-8.84l.05-43.18H96.02l.04 43.18zM176 0C73.72 0 0 82.97 0 176c0 44.37 16.45 84.85 43.56 115.78 16.64 18.99 42.74 58.8 52.42 92.16v.06h48v-.12c-.01-4.77-.72-9.51-2.15-14.07-5.59-17.81-22.82-64.77-62.17-109.67-20.54-23.43-31.52-53.15-31.61-84.14-.2-73.64 59.67-128 127.95-128 70.58 0 128 57.42 128 128 0 30.97-11.24 60.85-31.65 84.14-39.11 44.61-56.42 91.47-62.1 109.46a47.507 47.507 0 0 0-2.22 14.3v.1h48v-.05c9.68-33.37 35.78-73.18 52.42-92.16C335.55 260.85 352 220.37 352 176 352 78.8 273.2 0 176 0z'
  };

  useEffect(() => {
    setLocalTheme({
      api: api,
      theme: activeTheme,
      rerender: true
    });
  }, [activeTheme]);

  return (
    <div>
      <svg
        aria-hidden="true"
        focusable="false"
        role="img"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 352 512"
        style={{ height: '15px' }}
      >
        <path fill={color} d={icons[theme]} />
      </svg>
    </div>
  );
};

ThemeSwitcher.propTypes = {
  api: PropTypes.any.isRequired
};
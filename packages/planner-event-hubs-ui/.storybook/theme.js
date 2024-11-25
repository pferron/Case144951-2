import { create } from '@storybook/theming';
import { getDefaultTheme, getDarkTheme } from '@cvent/carina/utils/tokens';
import lightLogo from './public/images/nx-logo-light.svg';
import darkLogo from './public/images/nx-logo-dark.svg';

const themes = {
  light: getDefaultTheme(),
  dark: getDarkTheme()
};

export default themeName => {
  const theme = themes[themeName];
  const notTheme = themes[themeName === 'light' ? 'dark' : 'light'];

  return create({
    brandImage: themeName === 'light' ? lightLogo : darkLogo,

    base: themeName,

    appBg: theme.backgroundColor.base,
    appContentBg: theme.backgroundColor.base,
    appBorderColor: theme.borderColor.soft,
    appBorderRadius: theme.size.border.radius.twoX,

    colorPrimary: theme.font.color.brand.base,
    colorSecondary: theme.font.color.interactive.base,

    fontBase: theme.font.base.family,
    fontCode: theme.font.mono.family,

    textColor: theme.font.color.base,
    textInverseColor: notTheme.font.color.base,

    barTextColor: theme.font.color.base,
    barSelectedColor: theme.font.color.brand.base,
    barBg: theme.backgroundColor.base,

    inputBg: theme.backgroundColor.base,
    inputBorder: theme.borderColor.soft,
    inputTextColor: theme.font.color.base,
    inputBorderRadius: theme.size.border.radius.twoX
  });
};

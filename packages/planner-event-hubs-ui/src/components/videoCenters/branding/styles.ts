import { CSSObject } from '@emotion/react';
import useTheme from '@cvent/blocks/hooks/useTheme';

import useBreakpoints from '@hooks/useBreakpoints';

export const useColorPickerStyles = (): Record<string, CSSObject> => {
  const { font, spacing, colors } = useTheme();
  const { isL } = useBreakpoints();
  return {
    container: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      flexDirection: isL ? 'column' : 'row'
    },
    colorBoxStyle: {
      width: isL ? '100%' : '40%',
      flexGrow: 1
    },
    swapIcon: {
      transform: isL ? 'rotate(90deg)' : 'none'
    },
    contrastWarning: {
      color: colors.danger[45],
      display: 'flex',
      marginLeft: spacing['5'],
      marginTop: spacing['3'],
      alignItems: 'center'
    },
    constrastWarningText: {
      margin: spacing['3']
    },
    subtitle: {
      fontWeight: font.base.weight.bold,
      marginBottom: spacing['4'],
      marginTop: 0
    },
    subtext: {
      fontSize: font.base.size.m,
      marginBottom: spacing['4']
    }
  };
};

export const useMoodsStyles = (): Record<string, CSSObject> => {
  const { font, spacing } = useTheme();
  return {
    subtitle: {
      fontWeight: font.base.weight.bold,
      marginBottom: spacing['4'],
      color: font.color.base
    },
    subtext: {
      fontSize: font.base.size.m,
      marginBottom: spacing['4'],
      color: font.color.base
    }
  };
};

export const useMoodThemeModalStyles = (boxBackground: string): Record<string, CSSObject> => {
  const { font, spacing, size, borderColor } = useTheme();
  return {
    subtitle: {
      fontWeight: font.base.weight.bold,
      marginBottom: spacing['4'],
      color: font.color.base
    },
    buttonsContainer: {
      display: 'flex',
      marginLeft: 38,
      flexWrap: 'wrap',
      marginTop: spacing['1'],
      marginBottom: spacing['4']
    },
    checkboxTitle: {
      fontWeight: font.base.weight.bold,
      display: 'flex'
    },
    checkboxInput: {
      marginRight: 30,
      width: 24,
      height: 24,
      marginTop: spacing['2']
    },
    checkboxSubtitle: {
      marginLeft: 54
    },
    backgroundTitle: {
      fontWeight: font.base.weight.bold,
      lineHeight: font.lineHeight.heading,
      marginLeft: 28,
      marginBottom: spacing['1']
    },
    backgroundSubTitle: {
      marginLeft: 28
    },
    safeModeSection: {
      marginBottom: spacing['5']
    },
    backgroundSettings: {
      display: 'flex'
    },
    backgroundColorBox: {
      backgroundColor: boxBackground,
      width: 26,
      height: 26,
      cursor: 'pointer',
      border: `${size.border.base}px solid ${borderColor.base}`,
      borderRadius: size.border.radius.threeX
    }
  };
};

export const useBrandContentStyles = (): Record<string, CSSObject> => {
  const { font, spacing } = useTheme();
  return {
    headerContainer: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%'
    },
    title: {
      fontWeight: font.base.weight.bold,
      marginBottom: spacing['5'],
      fontSize: font.base.size[7]
    }
  };
};

export const useVideoCenterBrandingStyles = (): Record<string, CSSObject> => {
  const { font } = useTheme();
  return {
    titleContainer: {
      h1: {
        fontSize: font.base.size[9] // Blocks font-size is overriding the fontSize for h1 on this page. Changing it back to keep it consistent.
      }
    }
  };
};

export const useBrandImagesStyles = (): Record<string, CSSObject> => {
  const { font, spacing } = useTheme();
  return {
    sectionTitle: {
      fontWeight: font.base.weight.regular,
      color: font.color.base,
      marginTop: spacing['4'],
      marginBottom: spacing['3']
    },
    sectionSubTitle: {
      fontWeight: font.base.weight.regular,
      marginBottom: spacing['5'],
      fontSize: font.base.size.s,
      marginTop: 0
    },
    headerContainer: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%'
    },
    title: {
      fontWeight: font.base.weight.bold,
      marginBottom: spacing['5'],
      fontSize: font.base.size[7]
    }
  };
};

export const useBrandingNavigationStyles = (): Record<string, CSSObject> => {
  const { spacing, backgroundColor, font, size } = useTheme();
  return {
    container: {
      padding: spacing['6'],
      marginBottom: spacing['6'],
      backgroundColor: backgroundColor.neutral.focus
    },
    navigationContainer: {
      padding: spacing['7']
    },
    customNavigation: {
      marginBottom: spacing['7']
    },
    customNavigationHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 0
    },
    customNavigationSubHeader: {
      fontSize: font.base.size['4'],
      color: font.color.soft
    },
    customNavigationAppearanceSubHeader: {
      fontSize: font.base.size['3'],
      color: font.color.soft,
      marginBottom: '0.5rem'
    },
    navigationAlignmentContainerStyle: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      alignSelf: 'stretch'
    },
    navigationAlignmentContentStyle: {
      display: 'flex',
      flexDirection: 'row',
      width: '100%',
      gap: spacing['5'],
      flexWrap: 'wrap'
    },
    navigationAlignmentBaseStyle: {
      flexDirection: 'column',
      flexGrow: 1
    },
    navigationAlignmentElementContainerStyle: {
      display: 'flex',
      gap: '0.125rem',
      marginRight: spacing['3']
    },
    logo: {
      display: 'flex',
      padding: '0rem 0.75rem',
      background: '#5274A7',
      fontSize: font.base.size['0'],
      color: font.color.fill,
      borderRadius: '0.125rem',
      marginRight: spacing['3']
    },
    navigationRectangle: {
      background: '#FFF',
      borderRadius: '0.5rem',
      width: spacing['8'],
      opacity: '0.5',
      height: '0.938rem'
    },
    navigationAlignmentElementBase: {
      display: 'flex',
      padding: '0.5rem 0.625rem',
      background: '#325289'
    },
    navigationAlignmentElementLeft: {
      justifyContent: 'flex-start'
    },
    navigationAlignmentElementRight: {
      justifyContent: 'flex-end'
    },
    navigationAlignmentElementCenter: {
      justifyContent: 'space-between'
    },
    navigationAlignmentElementText: {
      textAlign: 'center',
      paddingTop: spacing['3'],
      margin: 0,
      fontSize: font.base.size['4']
    },
    previewHeader: {
      marginTop: 0,
      marginBottom: spacing['5'],
      fontSize: font.base.size.h2
    },
    customNavigationHeaderContent: {
      marginTop: 0,
      marginBottom: 0
    },
    navigationAlignmentHeaderContent: {
      marginTop: spacing['6'],
      marginBottom: spacing['5']
    },
    advancedOptionsHeaderContent: {
      marginTop: spacing['7'],
      marginBottom: spacing['5']
    },
    advancedOptionsSpacingHeaderContent: {
      marginTop: spacing['7'],
      marginBottom: spacing['2']
    },
    bodyContainer: {
      flexGrow: 1,
      overflowY: 'auto',
      minHeight: '100%',
      padding: '2rem',
      borderRadius: size.border.radius.threeX,
      marginTop: '2rem',
      height: '100%',
      backgroundColor: backgroundColor.base
    },
    landingPageHeaderStyle: {
      fontFamily: 'Rubik',
      fontSize: '1rem',
      textAlign: 'left',
      marginTop: '2rem',
      display: 'flex'
    },
    defaultLandingPageContainer: {
      height: '4rem',
      marginTop: '1rem',
      width: '18.75rem'
    },
    landingPageHelpIconStyle: {
      marginLeft: '0.5rem',
      marginTop: '0.25rem',
      alignSelf: 'flex-start'
    }
  };
};

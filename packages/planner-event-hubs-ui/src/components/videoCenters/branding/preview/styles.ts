import { CSSObject } from '@emotion/react';
import useTheme from '@cvent/blocks/hooks/useTheme';
import { NavigationLinkHighlightStyle } from '@cvent/planner-event-hubs-model/types';
import { BrandingAdvancedOptions } from '@utils/types';

export const useThemeChangePreviewStyles = (): Record<string, CSSObject> => {
  const theme = useTheme();
  return {
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      alignContent: 'center'
    },
    moodSection: {
      title: {
        fontWeight: theme.font.base.weight.bold,
        lineHeight: theme.font.lineHeight.base,
        marginBottom: theme.spacing[2]
      },
      text: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        marginBottom: theme.spacing[6]
      },
      card: {
        justifyContent: 'flex-start',
        width: '100%',
        padding: theme.spacing[4],
        paddingBottom: theme.spacing[8]
      }
    },
    backGroundSection: {
      maxWidth: 1448,
      margin: 'auto'
    },
    fontBold: {
      fontWeight: theme.font.base.weight.bold
    },
    subtitle: {
      fontSize: theme.font.base.size[1],
      fontWeight: theme.font.base.weight.bold,
      lineHeight: theme.font.lineHeight.base,
      marginBottom: theme.spacing[2]
    },
    profile: {
      width: 20,
      height: 20,
      borderRadius: '50%',
      backgroundColor: theme.backgroundColor.base
    },
    logoShadow: {
      width: 56,
      height: 24,
      borderRadius: theme.size.border.radius.twoX,
      backgroundColor: theme.backgroundColor.base
    },
    navItems: {
      width: 48,
      height: 10,
      borderRadius: theme.size.border.radius.fiveX,
      alignSelf: 'center',
      backgroundColor: theme.backgroundColor.base
    },
    bannerSection: {
      display: 'flex',
      padding: 24,
      margin: 24,
      flexDirection: 'column'
    },
    bannerTitle: {
      fontSize: theme.font.base.size[8]
    },
    bannerSubTitle: {
      fontSize: theme.font.base.size[2],
      marginTop: 8
    },
    bannerBtnContainer: {
      paddingTop: 20,
      display: 'flex',
      justifyContent: 'space-between'
    }
  };
};

export const usePreviewCarousleStyles = (alignItems: string): Record<string, CSSObject> => {
  const theme = useTheme();
  return {
    itemContainer: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8
    },
    item: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems,
      paddingBottom: 12,
      borderRadius: 20,
      flexGrow: 1,
      position: 'relative'
    },
    itemTitle: {
      fontSize: '1.5rem',
      margin: '12px 0'
    },
    itemImage: {
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      marginBottom: 10,
      width: '100%'
    },
    itemImageBottomBorder: {
      borderBottomLeftRadius: 10,
      borderBottomRightRadius: 10
    },
    titleStyle: {
      color: theme.font.color.interactive.base,
      fontWeight: theme.font.base.weight.bold
    }
  };
};

export const useNavigationPreviewStyles = (
  advancedOptions: BrandingAdvancedOptions,
  bodyTextFontFamily: string
): Record<string, CSSObject> => {
  const theme = useTheme();
  const menuLinkHover = {
    textDecoration: 'none',
    borderRadius: theme.size.border.radius.fiveX,
    backgroundColor: theme.backgroundColor.brand.hover
  };
  const menuLinkHoverUnderline = {
    textDecoration: advancedOptions.navigationLinkHighlightStyle
  };
  const menuLinkHoverNone = {
    textDecoration: advancedOptions.navigationLinkHighlightStyle
  };
  return {
    headerContainer: {
      width: '100%',
      overflowY: 'hidden',
      justifyContent: 'center',
      overflowX: 'scroll',
      display: 'flex',
      flexDirection: 'column'
    },
    headerContent: {
      position: 'relative',
      width: '100%',
      height: '4.375rem',
      fontSize: theme.font.base.size.m,
      display: 'flex',
      padding: '0.625rem',
      justifyContent: 'left',
      margin: '0 auto'
    },
    innerContainer: {
      position: 'relative',
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center'
    },
    logoImageSize: {
      height: '3rem',
      maxWidth: '16rem',
      marginRight: '1.5rem',
      marginTop: '0.675rem'
    },
    menuContainer: {
      alignItems: 'center',
      justifyContent: advancedOptions.navigationAlignment,
      display: 'flex',
      flexGrow: 1
    },
    menuList: {
      alignItems: 'center',
      display: 'flex',
      listStyle: 'none',
      justifyContent: 'center',
      textDecoration: 'none',
      padding: '0 0.25rem',
      margin: 0
    },
    menuListItem: {
      display: 'flex',
      alignItems: 'center',
      textDecoration: 'none',
      padding: '0 0.25rem'
    },
    menuLink: {
      fontFamily: bodyTextFontFamily,
      padding: '0.5625rem 0.75rem',
      height: '100%',
      width: '100%',
      alignItems: 'center',
      cursor: 'pointer',
      '&:hover':
        // eslint-disable-next-line no-nested-ternary
        advancedOptions.navigationLinkHighlightStyle === NavigationLinkHighlightStyle.Filled
          ? menuLinkHover
          : advancedOptions.navigationLinkHighlightStyle === NavigationLinkHighlightStyle.Underline
          ? menuLinkHoverUnderline
          : menuLinkHoverNone,
      '&:focus':
        // eslint-disable-next-line no-nested-ternary
        advancedOptions.navigationLinkHighlightStyle === NavigationLinkHighlightStyle.Filled
          ? menuLinkHover
          : advancedOptions.navigationLinkHighlightStyle === NavigationLinkHighlightStyle.Underline
          ? menuLinkHoverUnderline
          : menuLinkHoverNone,
      fontSize: String(0.0831 * Number(advancedOptions.navigationLinkTextSize)).concat('rem')
    },
    loginContainer: {
      display: 'flex',
      alignItems: 'center',
      marginLeft: '1.5rem',
      fontSize: String(0.0831 * Number(advancedOptions.navigationLinkTextSize)).concat('rem')
    },
    loginLinkCenterAlignmentStyles: {
      marginLeft: '1.5rem',
      position: 'absolute',
      right: 0,
      alignItems: 'center',
      padding: '1rem'
    },
    loginLink: {
      fontFamily: bodyTextFontFamily,
      padding: '0.5625rem 0.75rem',
      cursor: 'pointer',
      '&:hover':
        // eslint-disable-next-line no-nested-ternary
        advancedOptions.navigationLinkHighlightStyle === NavigationLinkHighlightStyle.Filled
          ? menuLinkHover
          : advancedOptions.navigationLinkHighlightStyle === NavigationLinkHighlightStyle.Underline
          ? menuLinkHoverUnderline
          : menuLinkHoverNone,
      '&:focus':
        // eslint-disable-next-line no-nested-ternary
        advancedOptions.navigationLinkHighlightStyle === NavigationLinkHighlightStyle.Filled
          ? menuLinkHover
          : advancedOptions.navigationLinkHighlightStyle === NavigationLinkHighlightStyle.Underline
          ? menuLinkHoverUnderline
          : menuLinkHoverNone
    }
  };
};

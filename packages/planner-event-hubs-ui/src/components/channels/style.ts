import { useContext, useMemo } from 'react';
import { CSSObject } from '@emotion/react';
import { Theme } from '@cvent/carina/components/ThemeProvider';
import useBreakpoints from '@hooks/useBreakpoints';
import { ThemeContext } from '@cvent/carina/components/ThemeProvider/ThemeContext';

export const CreateChannelModalStyles = (theme: Theme): Record<string, CSSObject> => {
  const { font } = theme;
  return useMemo(
    () => ({
      container: {
        padding: '1.5rem'
      },
      headerStyle: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
      },
      disabledText: {
        marginTop: 0,
        fontSize: font.base.size.s,
        color: font.color.disabled
      }
    }),
    [font]
  );
};

export const ChannelPageStyle = (theme: Theme): Record<string, CSSObject> => {
  const { isMobileOrTablet } = useBreakpoints();
  const { backgroundColor, font } = theme;
  return useMemo(
    () => ({
      container: {
        flexGrow: 1,
        overflowY: 'auto',
        minHeight: '100%',
        backgroundColor: backgroundColor.neutral.focus,
        paddingTop: '1.5rem'
      },
      emptyPageContainer: {
        paddingTop: '1rem',
        paddingBottom: '1rem',
        display: 'flex',
        flexDirection: 'column',
        alignContent: 'space-around',
        alignItems: 'center'
      },
      emptyPageContentHeader: {
        width: isMobileOrTablet ? '95%' : '55%',
        fontSize: '1.31rem',
        marginTop: '0',
        marginBottom: '1rem',
        textAlign: 'center'
      },
      emptyPageContentBody: {
        fontSize: font.base.size.m,
        marginBottom: '2.5rem',
        textAlign: 'center'
      },
      headerTab: { padding: '1.5rem 1.5rem 3.438rem 1.5rem' },
      channelInformationContainer: {
        flexGrow: 1,
        overflowY: 'auto',
        minHeight: '100%',
        backgroundColor: backgroundColor.neutral.focus
      }
    }),
    [isMobileOrTablet, backgroundColor, font]
  );
};

export const ViewChannelsStyle = (theme: Theme): Record<string, CSSObject> => {
  const { font } = theme;
  const appTheme = useContext(ThemeContext);

  return useMemo(
    () => ({
      tableFont: {
        fontSize: font.base.size.m,
        fontWeight: font.base.weight.regular,
        wordBreak: 'break-word'
      },
      trashContainer: {
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
        alignItems: 'center'
      },
      tableContainer: {
        margin: '0 1.5rem 7rem 1.5rem'
      },
      footer: {
        marginTop: 8,
        fontSize: appTheme.font.base.size.s,
        color: appTheme.font.color.soft
      },
      singleChannelLink: {
        textDecoration: 'none',
        color: theme.font.color.brand.base,
        '&:hover': {
          textDecoration: 'underline'
        }
      }
    }),
    [font]
  );
};

export const CreateCatalogModalStyle = (theme: Theme): Record<string, CSSObject> => {
  const { isMobile, isMobileOrTablet, isDesktop } = useBreakpoints();
  const { borderColor, backgroundColor } = theme;
  return useMemo(
    () => ({
      gradientTop: {
        height: 4,
        width: '100%',
        background: `linear-gradient(
          90deg,
          ${backgroundColor.brand.fill.base} 0%,
          ${backgroundColor.accent.fill.base} 95%
        );`
      },
      content: {
        paddingLeft: isMobileOrTablet ? '1rem' : '20%',
        paddingRight: isMobileOrTablet ? '1rem' : '20%',
        paddingTop: isMobileOrTablet ? '0.5%' : '1%'
      },
      separator: {
        height: 1,
        width: '100%',
        background: borderColor.soft
      },
      sectionNameForm: {
        width: isMobile ? '100%' : '71%'
      },
      FilterControlBarStyle: {
        marginLeft: isDesktop ? 0 : -3
      },
      sectionTableTitleStyle: {
        marginBottom: '0.5rem'
      },
      sectionTableHelpTextStyle: {
        marginTop: '0rem',
        marginBottom: '0.5rem',
        color: theme.font.color.soft,
        fontSize: theme.font.base.size.m
      }
    }),
    [
      backgroundColor.brand.fill.base,
      backgroundColor.accent.fill.base,
      isMobileOrTablet,
      borderColor.soft,
      isMobile,
      isDesktop,
      theme.font.color.soft,
      theme.font.base.size.m
    ]
  );
};

import { Theme } from '@cvent/carina/components/ThemeProvider';
import { CSSObject } from '@emotion/react';
import { useMemo } from 'react';
import useBreakpoints from '@hooks/useBreakpoints';

export const VideoHighlightsStyle = (theme: Theme): Record<string, CSSObject> => {
  const { isMobileOrTablet, isMobile } = useBreakpoints();
  return useMemo(
    () => ({
      outerContainer: {
        flexGrow: 1,
        overflowY: 'auto',
        height: '100%',
        backgroundColor: theme.backgroundColor.focus
      },
      innerContainer: {
        display: 'flex',
        margin: isMobileOrTablet ? '1.5rem 0rem' : '1.5rem',
        background: theme.backgroundColor.base,
        flexWrap: 'wrap',
        overflow: 'hidden',
        flexDirection: 'column',
        padding: '2rem',
        borderRadius: isMobileOrTablet ? '0rem' : '0.25rem'
      },
      listContainer: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%'
      },
      titleContainer: {
        h1: {
          fontSize: theme.font.base.size[9] // Blocks font-size is overriding the fontSize for h1 on this page. Changing it back to keep it consistent.
        }
      },
      filterBarContainer: {
        display: 'flex',
        paddingBottom: '1rem'
      },
      dateFilterDropdownStyle: {
        lineHeight: theme.font.lineHeight.base,
        fontWeight: theme.font.base.weight.bold,
        fontSize: theme.font.base.size.s,
        width: isMobileOrTablet ? '33%' : '19%',
        marginBottom: '0.5rem',
        marginLeft: '0.5rem'
      },
      filterPillsContainer: {
        paddingBottom: '0.5rem',
        display: 'flex',
        flexFlow: 'wrap',
        alignItems: 'center',
        button: { paddingLeft: 0, minWidth: 0, paddingRight: 0 },
        '& > button:last-of-type': {
          paddingRight: '0.5rem',
          paddingLeft: '0.5rem'
        }
      },
      clearAllButton: {
        paddingBottom: '0.50rem',
        button: {
          paddingLeft: '0.50rem',
          paddingRight: '0.50rem'
        }
      }
    }),
    [
      theme.backgroundColor.focus,
      isMobile,
      isMobileOrTablet,
      theme.font.color.soft,
      theme.font.base.size.s,
      theme.borderColor.hover,
      theme.borderColor.base,
      theme.font.color.danger.base,
      theme.backgroundColor.warning.focus
    ]
  );
};

export const VideoTableStyle = (theme: Theme): Record<string, CSSObject> => {
  const { isMobileOrTablet, isMobile } = useBreakpoints();
  return useMemo(
    () => ({
      normalText: {
        fontSize: theme.font.base.size.s,
        width: isMobileOrTablet ? '70%' : '80%',
        wordBreak: 'break-all',
        alignSelf: 'center'
      },
      nameColumn: {
        display: 'flex',
        justifyContent: 'space-between',
        marginRight: '1.25rem',
        overflowY: 'hidden',
        overflowX: 'hidden',
        paddingTop: '0.5rem',
        paddingBottom: '0.5rem'
      },
      tableWrapper: {
        margin: '1.5rem'
      },
      roundedTable: {
        borderRadius: '1rem',
        overflow: 'inherit'
      },
      thumbnailContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        maxHeight: '9.375rem',
        overflow: 'hidden'
      },
      thumbnailImage: {
        width: '5.25rem',
        height: '3rem',
        borderRadius: '0.25rem'
      }
    }),
    [
      theme.backgroundColor.focus,
      isMobile,
      isMobileOrTablet,
      theme.font.color.soft,
      theme.font.base.size.s,
      theme.borderColor.hover,
      theme.borderColor.base,
      theme.font.color.danger.base,
      theme.backgroundColor.warning.focus
    ]
  );
};

export const AudienceEngagementStyles = (theme: Theme): Record<string, CSSObject> => {
  const { isMobileOrTablet } = useBreakpoints();
  return useMemo(
    () => ({
      pagesModal: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '80vh',
        width: '80vw',
        backgroundColor: theme.backgroundColor.base,
        padding: '2rem',
        borderRadius: '0.625 rem',
        overflow: 'visible',
        '& > div:first-of-type': {
          overflow: 'visible'
        }
      },
      outerContainer: {
        flexGrow: 1,
        overflowY: 'auto',
        height: '100%',
        backgroundColor: theme.backgroundColor.base
      },
      listContainer: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%'
      },
      filterBarContainer: {
        display: 'flex',
        paddingBottom: '1rem'
      },
      dateFilterDropdownStyle: {
        lineHeight: theme.font.lineHeight.base,
        fontWeight: theme.font.base.weight.bold,
        fontSize: theme.font.base.size.s,
        width: isMobileOrTablet ? '33%' : '19%',
        marginBottom: '0.5rem',
        marginLeft: '0.5rem'
      },
      filterPillsContainer: {
        paddingBottom: '0.5rem',
        display: 'flex',
        flexFlow: 'wrap',
        alignItems: 'center',
        button: { paddingLeft: 0, minWidth: 0, paddingRight: 0 },
        '& > button:last-of-type': {
          paddingRight: '0.5rem',
          paddingLeft: '0.5rem'
        }
      },
      clearAllButton: {
        paddingBottom: '0.50rem',
        button: {
          paddingLeft: '0.50rem',
          paddingRight: '0.50rem'
        }
      },
      mostEngagedTitle: {
        fontSize: theme.font.base.size.s,
        color: theme.font.color.soft
      },
      downloadCsvButtonStyle: {
        fontWeight: theme.font.base.weight.medium,
        fontSize: theme.font.base.size.m,
        cursor: 'pointer',
        padding: '0.5rem 1rem',
        borderRadius: '0.25rem'
      },
      modalTopStyle: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }
    }),
    [theme.backgroundColor.focus, theme.font.color.soft, theme.font.base.size.s]
  );
};

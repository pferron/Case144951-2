import { Theme } from '@cvent/carina/components/ThemeProvider';
import { CSSObject } from '@emotion/react';
import { useMemo } from 'react';
import useBreakpoints from '@hooks/useBreakpoints';

export const MemberListStyle = (theme: Theme): Record<string, CSSObject> => {
  const { isMobileOrTablet } = useBreakpoints();
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
        flexDirection: 'column'
      },
      searchBarStyle: {
        marginTop: '1.5rem',
        marginLeft: 'auto',
        marginRight: '1.5rem',
        marginBottom: '1.5rem'
      },
      listContainer: {
        margin: '0rem 1.5rem 1.5rem 1.5rem',
        background: theme.backgroundColor.base,
        paddingTop: '1rem',
        paddingBottom: '1rem'
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
        fontSize: theme.font.base.size.m,
        marginBottom: '2.5rem',
        textAlign: 'center'
      },
      tableWrapper: {
        margin: '1.5rem'
      },
      normalText: {
        fontSize: theme.font.base.size.s,
        marginLeft: '.4rem',
        width: isMobileOrTablet ? '70%' : '80%',
        wordBreak: 'break-all',
        alignSelf: 'center'
      },
      popoverText: {
        fontSize: theme.font.base.size.s,
        marginLeft: '.4rem'
      },
      modalHeader: {
        fontSize: '0.75rem',
        fontWeight: 500,
        marginBottom: '0.75rem'
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
      infoIcon: {
        cursor: 'pointer',
        marginRight: '0.3rem'
      },
      infoButton: {
        marginLeft: '0.2rem',
        padding: '0.1rem',
        background: 'inherit',
        border: 'none',
        cursor: 'pointer',
        ':hover': {
          backgroundColor: theme.backgroundColor.interactive.surface
        }
      },
      searchButton: {
        cursor: 'pointer',
        ':hover': {
          backgroundColor: theme.backgroundColor.base
        },
        borderRadius: '0.3125rem'
      },
      clearSearchButton: {
        paddingRight: '0.3rem',
        cursor: 'pointer',
        ':hover': {
          backgroundColor: theme.backgroundColor.base
        },
        marginRight: '0.2rem',
        marginLeft: '-0.6rem',
        borderRadius: '0.3125rem'
      },
      searchButtonContainer: {
        flexDirection: 'row',
        display: 'flex',
        marginTop: '-0.3rem'
      },
      totalMembersLabelStyle: {
        padding: '0 1.8rem',
        margin: '0 0 1.5rem 0',
        fontSize: theme.font.base.size.m,
        fontWeight: theme.font.base.weight.bold
      }
    }),
    [theme.backgroundColor.focus, theme.backgroundColor.base, theme.font.base.size, isMobileOrTablet]
  );
};

export const MemberDetailsStyle = (theme: Theme): Record<string, CSSObject> => {
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
        background: 'white',
        flexWrap: 'wrap',
        maxHeight: '57.5rem',
        overflow: 'hidden',
        flexDirection: 'column',
        padding: '2rem',
        borderRadius: isMobileOrTablet ? '0rem' : '0.25rem'
      },
      container: {
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'space-between',
        width: isMobileOrTablet ? '100%' : '70%',
        minWidth: '50%'
      },
      fieldContainer: {
        display: 'flex',
        flexDirection: 'column',
        padding: isMobile ? '0.5rem 0rem' : '0.75rem 0rem',
        minWidth: '50%',
        paddingRight: '2.5rem'
      },
      fieldValueStyle: {
        fontSize: '1rem',
        overflowWrap: 'break-word'
      },
      fieldStyle: {
        fontSize: '0.76rem',
        color: theme.font.color.soft
      },
      loginHeadingStyle: {
        margin: '-0.125rem',
        paddingRight: '0.25rem',
        marginBottom: '1rem'
      },
      loginLinkButtonStyle: {
        button: {
          height: '2.5rem',
          width: '9.938rem'
        }
      },
      linkNoteStyle: {
        color: theme.font.color.soft,
        paddingBottom: '1rem',
        marginTop: '1rem'
      },
      linkContainer: {
        display: 'flex',
        maxWidth: '36.25rem',
        width: isMobileOrTablet ? '90%' : '100%'
      },
      textBoxContainer: {
        display: 'flex',
        border: `0.063rem solid ${theme.borderColor.base}`,
        width: isMobileOrTablet ? '50%' : '60%',
        justifyContent: 'space-between'
      },
      buttonContainer: {
        display: 'flex',
        button: {
          height: '2.5rem',
          marginLeft: '1rem'
        }
      },
      urlContainer: {
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        flex: 1,
        lineHeight: '2.5rem',
        height: '2.5rem',
        paddingRight: '1rem',
        paddingLeft: '1rem',
        fontSize: theme.font.base.size.s,
        maxWidth: '85%'
      },
      copyIconContainer: {
        display: 'flex',
        alignItems: 'center',
        marginRight: '0.5rem',
        cursor: 'pointer'
      },
      copyButtonStyle: {
        background: 'transparent',
        color: theme.borderColor.hover,
        border: 'none',
        cursor: 'pointer',
        marginTop: '0.25rem'
      },
      errorLinkStyle: {
        fontSize: '0.875rem',
        wordWrap: 'break-word',
        color: theme.font.color.danger.base
      },
      limitExceedContainerStyle: {
        display: 'flex',
        flexDirection: 'row',
        paddingBottom: '1rem',
        marginTop: '1rem'
      },
      linkGenerateErrorStyle: {
        fontSize: '0.875rem',
        wordWrap: 'break-word'
      },
      linkGenerateContainerStyle: {
        display: 'flex',
        background: theme.backgroundColor.warning.focus,
        flexWrap: 'wrap',
        overflow: 'hidden',
        padding: '1rem',
        borderRadius: '0.25rem',
        marginBottom: '1rem'
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

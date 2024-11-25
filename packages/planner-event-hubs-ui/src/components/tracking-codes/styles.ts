import { Theme } from '@cvent/carina/types/theme';
import { CSSObject } from '@emotion/react';
import { useMemo } from 'react';
import { COLOR } from '@components/constants';
import chroma from 'chroma-js';

export const TrackingCodesStyle = (theme: Theme): Record<string, CSSObject> => {
  return useMemo(
    () => ({
      outerContainer: {
        flexGrow: 1,
        overflowY: 'auto',
        height: '100%',
        backgroundColor: theme.backgroundColor.focus
      },
      headerContainer: {
        lineHeight: '1.875rem',
        margin: 0,
        marginBottom: '1rem'
      },
      saveButtonStyle: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%'
      },
      descriptionStyle: {
        marginBottom: '2rem',
        color: theme.font.color.soft,
        fontSize: theme.font.base.size.m,
        alignSelf: 'stretch'
      },
      alertWrapperStyles: {
        padding: '1.5rem 1.5rem 0rem 1.5rem'
      }
    }),
    [theme]
  );
};

export const CodeSnippetsStyle = (theme: Theme): Record<string, CSSObject> => {
  return useMemo(
    () => ({
      bodyListStyle: {
        margin: '1.5rem',
        marginBottom: 0,
        height: 'fit-content'
      },
      noCodeSnippetsTextStyle: {
        background: COLOR,
        alignItems: 'center',
        padding: '1.5rem 0rem',
        textAlign: 'center',
        fontSize: theme.font.base.size.m,
        lineHeight: '1.313rem'
      },
      saveButtonStyle: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%'
      },
      popOverContainer: {
        paddingLeft: '0.2rem',
        marginTop: '0.125rem',
        cursor: 'pointer'
      },
      popperStyle: {
        margin: '0.15rem 0 0 0',
        cursor: 'pointer',
        paddingTop: '0.5rem',
        paddingLeft: '0.5rem'
      },
      popperBodyStyles: {
        padding: '1rem',
        backgroundColor: theme.backgroundColor.base,
        maxWidth: '20rem',
        borderRadius: '0.625rem'
      },
      disableCodeSnippetsStyle: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
      },
      popContentStyle: {
        border: 0,
        backgroundColor: 'transparent',
        paddingLeft: '0.292rem'
      },
      popoverBoldStyle: {
        fontSize: '1.125rem',
        lineHeight: '1.68rem',
        fontWeight: '600',
        color: theme.font.color.soft
      },
      disabledCard: {
        backgroundColor: chroma(theme.backgroundColor.base).alpha(0.15).hex(),
        opacity: 0.15
      }
    }),
    [theme]
  );
};

export const CodeSnippetsModalStyles = (theme: Theme): Record<string, CSSObject> => {
  return useMemo(
    () => ({
      headerStyle: {
        display: 'flex',
        flexDirection: 'row',
        margin: '0rem 1.5rem 0rem 1.5rem'
      },
      modalTitle: {
        fontSize: '1.5rem',
        color: theme.font.color.base,
        width: '100%',
        margin: '1.5rem 0rem 1rem 0rem',
        fontWeight: '400'
      },
      modalStyle: {
        color: theme.font.color.base,
        marginLeft: '1.5rem',
        width: '45.5rem',
        height: '31.5rem'
      },
      dismissButtonStyle: {
        position: 'relative',
        alignItems: 'center',
        marginTop: '1.2rem'
      },
      tableContainer: {
        marginLeft: '1.5rem',
        marginRight: '1.5rem'
      },
      buttonContainer: {
        marginTop: '2rem',
        marginLeft: '1.5rem',
        marginRight: '1.5rem',
        marginBottom: '1.5rem',
        display: 'flex',
        flexDirection: 'row-reverse'
      },
      nextButton: {
        marginLeft: '0.5rem'
      }
    }),
    [theme]
  );
};

export const SnippetsSettingsModalStyles = (theme: Theme): Record<string, CSSObject> => {
  return useMemo(
    () => ({
      headerStyle: {
        display: 'flex',
        flexDirection: 'row',
        padding: '0.15rem'
      },
      modalTitle: {
        fontSize: '1.5rem',
        color: theme.font.color.base,
        width: '100%',
        fontWeight: '400'
      },
      dismissButtonStyle: {
        position: 'relative',
        alignItems: 'center'
      },
      bodyStyle: {
        margin: '1.5rem'
      },
      modalStyle: {
        color: theme.font.color.base,
        width: '25rem',
        height: '33.875rem'
      },
      buttonContainer: {
        display: 'flex',
        flexDirection: 'row-reverse',
        marginTop: '2rem',
        padding: '0.15rem'
      },
      saveButton: {
        marginLeft: '0.5rem'
      },
      labelStyle: {
        margin: '0 0.2rem 0.25rem 0',
        fontSize: '13 px',
        lineHeight: '19.5 px',
        fontWeight: '400',
        color: theme.font.color.soft
      },
      popoverStyle: {
        margin: '0.15rem 0 0 0',
        cursor: 'pointer'
      },
      popoverBoldStyle: {
        fontSize: '1.125rem',
        lineHeight: '1.68rem',
        fontWeight: '600',
        color: theme.font.color.soft
      },
      columnStyle: {
        marginTop: '1rem'
      }
    }),
    [theme]
  );
};

export const SnippetSettingsConfirmationModalStyles = (theme: Theme): Record<string, CSSObject> => {
  return useMemo(
    () => ({
      headerStyle: {
        display: 'flex',
        flexDirection: 'row',
        marginBottom: '1rem',
        padding: '0.15rem'
      },
      modalTitle: {
        fontSize: '1.5rem',
        color: theme.font.color.base,
        width: '100%',
        fontWeight: '400'
      },
      bodyStyle: {
        margin: '1.5rem 1.5rem 1.5rem 1.5rem'
      },
      buttonContainer: {
        marginTop: '1.5rem',
        display: 'flex',
        flexDirection: 'row-reverse',
        padding: '0.15rem'
      },
      modalStyle: {
        width: '25rem'
      },
      saveButton: {
        marginLeft: '0.5rem'
      }
    }),
    [theme]
  );
};
export const SnippetModalStyles = (theme: Theme): Record<string, CSSObject> => {
  return useMemo(
    () => ({
      bodyStyle: {
        margin: '1.5rem 1.5rem 1.5rem 1.5rem'
      },
      buttonContainer: {
        marginTop: '1.5rem',
        display: 'flex',
        flexDirection: 'row-reverse',
        padding: '0.15rem'
      },
      modalStyle: {
        width: '25rem'
      },
      saveButton: {
        marginLeft: '0.5rem'
      },
      headerTitleStyle: {
        display: 'flex',
        flexDirection: 'row',
        marginBottom: '1rem',
        padding: '0.15rem',
        fontSize: '1.5rem',
        color: theme.font.color.base,
        width: '100%',
        fontWeight: '400'
      }
    }),
    [theme]
  );
};

export const MeasurementIdStyles = (theme: Theme): Record<string, CSSObject> => {
  return {
    noCodeMessage: {
      textAlign: 'center',
      fontSize: theme.font.base.size.m,
      marginBottom: 0
    },
    labelHeader: {
      display: 'flex',
      flexDirection: 'row',
      columnGap: '0.25rem',
      alignItems: 'center'
    },
    label: {
      color: theme.font.color.soft
    },
    popperBodyStyles: {
      maxWidth: '19rem',
      padding: '1rem',
      backgroundColor: theme.backgroundColor.base
    },
    textboxStyle: {
      width: '20rem',
      backgroundColor: theme.backgroundColor.base
    },
    textValueStyle: {
      fontSize: theme.font.base.size.m
    }
  };
};

export const PopperStyles = (theme: Theme): Record<string, CSSObject> => {
  return {
    popperBodyStyles: {
      padding: '1rem',
      backgroundColor: theme.backgroundColor.base,
      borderRadius: '0.625rem'
    }
  };
};

export const TrackingParametersStyle = (theme: Theme): Record<string, CSSObject> => {
  return useMemo(
    () => ({
      outerContainer: {
        flexGrow: 1,
        overflowY: 'auto',
        height: '100%',
        backgroundColor: theme.backgroundColor.focus
      },
      headerContainer: {
        lineHeight: '1.875rem',
        margin: 0,
        marginBottom: '1rem'
      },
      descriptionStyle: {
        marginBottom: '2rem',
        color: theme.font.color.soft,
        fontSize: theme.font.base.size.m,
        alignSelf: 'stretch'
      },
      duplicateKeyDescriptionStyle: {
        marginBottom: '0.5rem',
        color: theme.font.color.soft,
        fontSize: theme.font.base.size.s,
        alignSelf: 'stretch'
      },
      alertWrapperStyles: {
        padding: '1.5rem 1.5rem 0rem 1.5rem'
      },
      noParametersTextStyle: {
        alignItems: 'center',
        padding: '1rem',
        textAlign: 'start',
        fontSize: theme.font.base.size.m,
        color: theme.font.color.soft,
        lineHeight: '1.5rem'
      },
      tableFont: {
        fontSize: theme.font.base.size.m,
        fontWeight: theme.font.base.weight.regular,
        wordBreak: 'break-word'
      },
      trashContainer: {
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
        alignItems: 'center'
      }
    }),
    [theme]
  );
};

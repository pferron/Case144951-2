import { Theme } from '@cvent/carina/types/theme';
import { CSSObject } from '@emotion/react';
import { useMemo } from 'react';
import useBreakpoints from '@hooks/useBreakpoints';
import chroma from 'chroma-js';
import useTheme from '@cvent/blocks/hooks/useTheme';

export const CustomRegistrationStyle = (theme: Theme): Record<string, CSSObject> =>
  useMemo(
    () => ({
      outerContainer: {
        flexGrow: 1,
        overflowY: 'auto',
        height: '100%',
        backgroundColor: theme.backgroundColor.focus
      },
      errorTextContainer: {
        display: 'flex',
        justifyContent: 'center',
        textAlign: 'center'
      }
    }),
    [theme]
  );

export const FormEditorCardStyle = (theme: Theme): Record<string, CSSObject> => {
  const { font } = useTheme();
  const { isMobile } = useBreakpoints();
  return useMemo(
    () => ({
      outerContainer: {
        flexGrow: 1,
        overflowY: 'auto',
        height: '100%',
        backgroundColor: theme.backgroundColor.focus
      },
      titleContainer: {
        h1: {
          fontSize: font.base.size[9] // Blocks font-size is overriding the fontSize for h1 on this page. Changing it back to keep it consistent.
        }
      },
      description: {
        color: theme.font.color.soft,
        fontSize: '1rem',
        marginBottom: '1.5rem'
      },
      buttonContainer: {
        display: 'flex',
        flexDirection: 'row-reverse',
        zIndex: 1,
        marginRight: '-0.75rem'
      },
      bodyContainerEdit: {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '0',
        marginBottom: '-1rem'
      },
      bodyContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '2rem',
        marginBottom: '-1rem'
      },
      decorativeImageTextStyle: {
        color: theme.font.color.soft,
        fontWeight: font.base.weight.medium,
        fontSize: '1rem',
        marginTop: '1rem',
        marginBottom: '1rem'
      },
      flyout: {
        marginLeft: '0.2rem',
        marginTop: '0.06rem',
        alignSelf: isMobile ? 'center' : 'flex-start'
      },
      questionContainer: {
        display: 'flex'
      },
      characterCount: {
        fontSize: font.base.size.xs,
        color: font.color.soft,
        marginTop: '0.8rem',
        marginBottom: '0.8rem'
      },
      negativeCharCount: {
        color: font.color.danger.base
      },
      previewCardHeadingStyle: { marginTop: '1.5rem', marginBottom: '0.5rem' },
      previewCardTextStyle: {
        color: theme.font.color.soft,
        fontSize: '1rem',
        marginTop: '1rem'
      },
      previewCardFieldValue: {
        fontSize: '1rem'
      }
    }),
    [theme, font, isMobile]
  );
};

export const CustomRegistrationCardContainerStyle = (theme: Theme): Record<string, CSSObject> => {
  const { isMobile, isMobileOrTablet } = useBreakpoints();
  return useMemo(
    () => ({
      bodyContainerEdit: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column-reverse',
        padding: isMobileOrTablet ? '1.5rem' : '2rem',
        backgroundColor: theme.backgroundColor.base,
        borderWidth: theme.size.border.base,
        borderColor: theme.borderColor.neutral.fill.base,
        margin: isMobile ? '1.5rem 0' : '1.5rem',
        borderRadius: isMobile ? null : theme.size.border.radius.fiveX,
        boxShadow: `0rem 0.25rem 1rem -0.25rem ${theme.depth.boxShadow[1].color}`
      },
      disabledCard: {
        backgroundColor: chroma(theme.backgroundColor.base).alpha(0.15).hex(),
        opacity: 0.15,
        '> *:first-of-type': {
          backgroundColor: 'transparent',
          boxShadow: 'none'
        }
      },
      bodyContainer: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column-reverse',
        padding: isMobileOrTablet ? '1.5rem' : '2rem',
        backgroundColor: theme.backgroundColor.base,
        borderWidth: theme.size.border.base,
        borderColor: theme.borderColor.neutral.fill.base,
        margin: isMobile ? '1.5rem 0' : '1.5rem',
        borderRadius: isMobile ? null : theme.size.border.radius.twoX
      },
      buttonContainer: {
        display: 'flex',
        flexDirection: 'row-reverse',
        alignSelf: 'flex-end',
        zIndex: 1,
        marginRight: '-0.75rem'
      },
      spacer: {
        width: isMobileOrTablet ? 0 : '1rem'
      }
    }),
    [theme, isMobile, isMobileOrTablet]
  );
};

export const AddFieldMenuStyle = (): Record<string, CSSObject> =>
  useMemo(
    () => ({
      addFieldButtonStyle: {
        marginTop: '1.5rem'
      },
      magazineStyle: {
        position: 'unset',
        minWidth: '300px',
        paddingLeft: 0,
        paddingRight: 0
      }
    }),
    []
  );

export const ReorderableTableFormFieldsStyle = (theme: Theme): Record<string, CSSObject> =>
  useMemo(
    () => ({
      checkboxLabelStyle: {
        margin: '0.2rem 0.2rem 0.2rem -1.3rem',
        alignItems: 'center',
        display: 'flex',
        color: theme.font.color.base,
        fontSize: theme.font.base.size.s,
        justifyContent: 'center',
        fontWeight: theme.font.base.weight.regular
      },
      editCheckBoxStyles: {
        paddingRight: '0.4rem',
        marginRight: '-1.8rem',
        marginLeft: '1.5rem'
      },
      trashButtonStyles: {
        padding: '0rem',
        color: 'red',
        border: '0px solid',
        marginLeft: '2.7rem',
        '&amp;:hover': {
          color: 'red',
          backgroundColor: 'transparent',
          border: '0px solid'
        }
      },
      appendedTable: {
        color: theme.font.color.base,
        fontSize: theme.font.base.size.s,
        fontWeight: '400',
        marginTop: '-6px',
        'div[role=cell]': {
          width: 'unset',
          minWidth: 'unset'
        }
      },
      tableLabelStyle: {
        color: theme.font.color.base,
        fontSize: theme.font.base.size.s
      }
    }),
    [theme]
  );

export const StaticFormFieldsStyle = (theme: Theme): Record<string, CSSObject> =>
  useMemo(
    () => ({
      checkboxLabelStyle: {
        margin: '0rem 4.5rem 0rem -1.5rem',
        alignItems: 'center',
        display: 'flex',
        color: theme.font.color.soft,
        fontSize: '14px',
        justifyContent: 'center'
      },
      checkBoxLabelText: {
        color: theme.font.color.soft
      },
      checkboxLabelStyleRight: {
        margin: '0rem -0.5rem 0rem -2rem',
        alignItems: 'center',
        display: 'flex',
        color: theme.font.color.soft,
        fontSize: '14px',
        justifyContent: 'center'
      },
      nonInteractiveTable: {
        'div[role=row]': {
          backgroundColor: 'white',
          cursor: 'not-allowed'
        },
        'div[role=cell]': {
          color: theme.font.color.soft
        }
      },
      tableLabelStyleLockedFields: {
        paddingLeft: '2rem',
        color: theme.font.color.soft,
        fontSize: theme.font.base.size.s
      },
      tableLabelStyle: {
        paddingLeft: '2rem',
        color: theme.font.color.base,
        fontSize: theme.font.base.size.s
      }
    }),
    [theme]
  );

export const FooterStyles = (theme: Theme): Record<string, CSSObject> => {
  const { isMobile } = useBreakpoints();
  return useMemo(
    () => ({
      linkTextStyle: {
        textDecoration: 'none'
      },
      containerStyle: {
        width: '100%',
        fontSize: theme.font.base.size.xxs,
        fontWeight: theme.font.base.weight.regular,
        display: 'flex',
        justifyContent: isMobile ? 'center' : 'flex-end',
        padding: '0.6rem 1rem 0.6rem 1rem',
        flexDirection: isMobile ? 'column' : 'row'
      },
      rightContainerStyle: {
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: isMobile ? 'center' : 'flex-end',
        wordBreak: 'break-all'
      }
    }),
    [isMobile, theme]
  );
};

export const PreviewModalStyles = (theme: Theme): Record<string, CSSObject> => {
  const { isMobile } = useBreakpoints();
  return useMemo(
    () => ({
      modal: {
        backgroundSize: 'cover',
        objectFit: 'contain',
        backgroundAttachment: 'fixed',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center'
      },
      containerStyle: {
        display: 'flex',
        flexDirection: 'column',
        rowGap: '2rem',
        alignItems: 'center',
        paddingTop: isMobile ? '1.5rem' : '4.844rem'
      },
      logoStyle: {
        cursor: 'pointer',
        height: '5.625rem',
        objectFit: 'contain'
      },
      cardContainerStyle: {
        display: 'flex',
        justifyContent: 'center'
      },
      title: {
        fontSize: '1.875rem',
        fontWeight: '400',
        textAlign: 'center',
        marginTop: 0
      },
      heading: {
        fontSize: '1.125rem',
        fontWeight: '400',
        textAlign: 'center',
        marginTop: '1rem',
        marginBottom: '1rem'
      },
      buildLogo: {
        height: '100%',
        width: '100%',
        display: 'flex',
        alignItems: 'center'
      },
      headerContainer: {
        display: 'flex',
        backgroundColor: 'rgba(0, 0, 0, 0.3)'
      },
      headerInnerContainer: {
        margin: '1rem 1.5rem 1rem 1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%'
      },
      previewText: {
        margin: '0rem',
        paddingTop: '0.4rem',
        color: '#fff',
        fontSize: theme.font.base.size['7'],
        fontWeight: theme.font.base.weight.regular
      }
    }),
    [isMobile, theme]
  );
};

export const CustomRegistrationEditableCardContainerStyle = (
  theme: Theme,
  additionalParams: Record<string, string>
): Record<string, CSSObject> => {
  const { isMobile } = useBreakpoints();
  return useMemo(
    () => ({
      card: {
        backgroundColor: additionalParams?.color ?? theme.backgroundColor.base,
        borderWidth: theme.size.border.base,
        borderColor: theme.borderColor.neutral.fill.base,
        margin: isMobile ? '1.5rem 0' : '1.5rem',
        borderRadius: isMobile ? null : theme.size.border.radius.twoX
      },
      bodyContainer: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column-reverse',
        padding: isMobile ? '1.5rem' : '2rem'
      },
      childrenContainer: {
        marginTop: '-2.25rem'
      },
      buttonContainer: {
        display: 'flex',
        flexDirection: 'row-reverse',
        alignSelf: 'flex-end',
        height: '2rem',
        zIndex: 1,
        marginRight: '-0.75rem'
      },
      disabledCard: {
        backgroundColor: chroma(theme.backgroundColor.base).alpha(0.15).hex(),
        opacity: 0.15
      }
    }),
    [additionalParams, theme, isMobile]
  );
};

export const EditSsoLoginStyle = (theme: Theme): Record<string, CSSObject> => {
  const { font } = theme;
  const { isMobile } = useBreakpoints();
  return useMemo(
    () => ({
      title: {
        fontWeight: font.base.weight.regular,
        margin: 0,
        padding: 0,
        marginBottom: '1.5rem',
        maxWidth: isMobile ? '65%' : '80%',
        fontSize: '1.5rem'
      },
      infoText: {
        fontWeight: font.base.weight.regular,
        margin: 0,
        padding: 0,
        marginBottom: '1.5rem',
        maxWidth: isMobile ? '65%' : '80%',
        fontSize: '1rem',
        color: theme.font.color.soft
      },
      textboxStyle: {
        width: '18.75rem',
        backgroundColor: theme.backgroundColor.base
      },
      tooltipStyle: {
        padding: '1.1rem 0.5rem 0.6rem 0.2rem',
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        maxHeight: '45%'
      }
    }),
    [font, isMobile, theme]
  );
};

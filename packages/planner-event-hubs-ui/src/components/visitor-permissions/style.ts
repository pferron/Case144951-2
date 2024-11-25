import { Theme } from '@cvent/carina/components/ThemeProvider';
import { CSSObject } from '@emotion/react';
import { useMemo } from 'react';
import useBreakpoints from '@hooks/useBreakpoints';
import chroma from 'chroma-js';

export const VisitorPermissionsStyle = (theme: Theme): Record<string, CSSObject> => {
  return useMemo(
    () => ({
      container: {
        flexGrow: 1,
        overflowY: 'auto',
        height: '100%',
        backgroundColor: theme.backgroundColor.focus
      }
    }),
    [theme]
  );
};

export const VisitorPermissionsFieldStyles = (theme: Theme): Record<string, CSSObject> => {
  const { font } = theme;
  const { isMobile } = useBreakpoints();
  return useMemo(
    () => ({
      title: {
        fontWeight: font.base.weight.regular,
        margin: 0,
        marginTop: '.3rem',
        marginBottom: '.3rem',
        maxWidth: isMobile ? '90%' : '80%'
      },
      sectionContainer: {
        display: 'flex',
        flexDirection: 'column'
      },
      horizontalLine: {
        width: '100%',
        height: '0rem',
        marginTop: '1.5rem',
        borderTop: `0.063rem solid ${theme.borderColor.soft}`
      },
      description: {
        color: font.color.soft,
        fontSize: '1rem',
        marginBottom: 0
      },
      additionalInfo: {
        fontSize: '0.875rem',
        margin: 0
      },
      firstRegistrationTextContainer: {
        marginTop: '-0.8rem'
      },
      emailDomainPopOver: {
        display: 'flex',
        flexDirection: 'row'
      }
    }),
    [font, isMobile, theme.borderColor.soft]
  );
};

export const OverrideSettingsModalStyles = (theme: Theme): Record<string, CSSObject> => {
  const { font } = theme;
  return useMemo(
    () => ({
      header: {
        fontSize: font.base.size.h2,
        color: font.color.base,
        wordWrap: 'break-word',
        margin: '0rem 2rem 0rem 2rem'
      },
      body: {
        color: font.color.soft,
        lineHeight: '1.5rem',
        margin: '0 2rem',
        whiteSpace: 'pre-wrap'
      },
      buttons: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        margin: '2rem 2rem 1.5rem 1rem'
      },
      declineButton: { margin: '0 0.5rem 0 0' }
    }),
    [font.base.size.h2, font.color.base, font.color.soft]
  );
};

export const RegistrationTextContainerStyle = (theme: Theme): Record<string, CSSObject> => {
  const { font } = theme;
  return useMemo(
    () => ({
      question: {
        marginTop: '2rem',
        color: font.color.soft,
        fontSize: font.base.size.xs,
        marginBottom: '0.5rem'
      },
      answer: {
        fontSize: font.base.size.m,
        wordWrap: 'break-word',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.5rem'
      },
      questionContainer: {
        display: 'flex'
      }
    }),
    [font]
  );
};

export const EditEmailDomainFieldsStyle = (theme: Theme): Record<string, CSSObject> => {
  const { font } = theme;
  const { isMobile } = useBreakpoints();
  return useMemo(
    () => ({
      title: {
        fontWeight: font.base.weight.regular,
        margin: 0,
        marginTop: '.3rem',
        marginBottom: '.3rem',
        maxWidth: isMobile ? '90%' : '80%'
      },
      description: {
        color: font.color.soft,
        fontSize: '1rem'
      },
      smallHeading: {
        color: font.color.soft,
        fontSize: font.base.size.xxs,
        paddingTop: '.3rem'
      },
      button: {
        display: 'flex',
        padding: '0.5rem 1.5rem',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '0.5rem',
        flex: '1 0 0',
        marginTop: '0.5625rem'
      },
      button2: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minWidth: '4.875rem',
        width: '4.875rem',
        height: '2.5rem',
        justifyContent: 'center',
        gap: '0.5'
      },
      span: {
        padding: '0.1rem',
        flexDirection: 'row',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      },
      pills: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.5rem',
        marginTop: '0.5rem'
      },
      popoverStyle: {
        margin: '0.15rem 0 0 0',
        cursor: 'pointer',
        paddingTop: '0.5rem',
        paddingLeft: '0.5rem'
      },
      popperBodyStyles: {
        padding: '1rem',
        backgroundColor: theme.backgroundColor.base,
        maxWidth: '20rem'
      },
      popoverBoldStyle: {
        fontSize: '1.125rem',
        lineHeight: '1.68rem',
        fontWeight: '600',
        color: theme.font.color.soft
      },
      publicRadio: {
        display: 'flex',
        flexDirection: 'row'
      }
    }),
    [font, isMobile]
  );
};
export const EditAllowContactListFieldsStyle = (theme: Theme): Record<string, CSSObject> => {
  const { font } = theme;
  const { isMobile } = useBreakpoints();
  return useMemo(
    () => ({
      title: {
        fontWeight: font.base.weight.regular,
        margin: 0,
        marginTop: '.3rem',
        marginBottom: '.3rem',
        maxWidth: isMobile ? '90%' : '80%'
      },
      normalHeading: {
        color: font.color.soft,
        fontSize: '1rem',
        marginTop: '1rem',
        marginBottom: '1rem'
      },
      textBox: {
        width: '18.75rem',
        marginTop: '1.5rem'
      },
      multiSelect: {
        position: 'relative'
      },
      multiSelectCheckbox: {
        marginTop: '.5rem'
      },
      checkBox: {
        marginTop: '0.5rem'
      },
      chevronDown: {
        marginTop: '-0.64rem'
      },
      searchContactGroupButton: {
        marginTop: '0.5rem'
      },
      errorTextNoSelection: {
        marginTop: '0.25rem'
      }
    }),
    [font, isMobile]
  );
};

export const EditVisibilityStyle = (theme: Theme): Record<string, CSSObject> => {
  const { font } = theme;
  const { isMobile } = useBreakpoints();
  return useMemo(
    () => ({
      title: {
        fontWeight: font.base.weight.regular,
        margin: 0,
        marginTop: '.3rem',
        marginBottom: '.3rem',
        maxWidth: isMobile ? '90%' : '80%'
      },
      description: {
        color: font.color.soft,
        fontSize: '1rem',
        marginTop: '1rem',
        marginBottom: '1rem'
      },
      publicRadio: {
        display: 'flex',
        flexDirection: 'row'
      },
      tooltip: {
        paddingTop: '0.5rem',
        paddingLeft: '0.5rem'
      }
    }),
    [font, isMobile]
  );
};

export const RegistrationCardContainerStyle = (
  theme: Theme,
  additionalParams: Record<string, string>
): Record<string, CSSObject> => {
  const { isMobile, isMobileOrTablet } = useBreakpoints();
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
        padding: isMobileOrTablet ? '1.5rem' : '2rem'
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
      spacer: {
        width: isMobileOrTablet ? 0 : '1rem'
      },
      disabledCard: {
        backgroundColor: chroma(theme.backgroundColor.base).alpha(0.15).hex(),
        opacity: 0.15
      },
      editCard: {
        backgroundColor: additionalParams?.color ?? theme.backgroundColor.base,
        borderWidth: theme.size.border.base,
        borderColor: theme.borderColor.neutral.fill.base,
        margin: isMobile ? '1.5rem 0' : '1.5rem',
        borderRadius: isMobile ? null : theme.size.border.radius.fiveX,
        boxShadow: `0rem 0.25rem 1rem -0.25rem ${theme.depth.boxShadow[1].color}`
      }
    }),
    [additionalParams, theme, isMobile, isMobileOrTablet]
  );
};

export const ContactGroupModalStyle = (theme: Theme): Record<string, CSSObject> => {
  return useMemo(
    () => ({
      headerStyle: {
        display: 'flex',
        flexDirection: 'row'
      },
      modalTitle: {
        marginTop: '1.5rem',
        marginBottom: '0rem',
        fontSize: '1.5rem',
        color: theme.font.color.base,
        marginLeft: '1.5rem',
        width: '85%'
      },
      dismissButtonStyle: {
        position: 'relative',
        marginTop: '1.2rem'
      },
      searchContainer: {
        display: 'flex',
        flexDirection: 'row',
        marginTop: '1.5rem',
        marginLeft: '1.5rem',
        marginRight: '1.5rem',
        marginBottom: '1.5rem'
      },
      searchTextBox: {
        width: '75%',
        paddingRight: '1.5rem'
      },
      tableContainer: {
        marginLeft: '1.5rem',
        marginRight: '1.5rem'
      },
      buttonContainer: {
        marginTop: '1rem',
        marginLeft: '1.5rem',
        marginRight: '1.5rem',
        marginBottom: '1.5rem',
        display: 'flex',
        flexDirection: 'row-reverse'
      },
      searchButton: {
        boxShadow: `0rem 0.25rem 1rem -0.25rem ${theme.depth.boxShadow[1].color}`,
        borderColor: theme.borderColor.interactive.base,
        color: theme.font.color.interactive.base
      },
      saveButton: {
        marginLeft: '0.5rem'
      },
      maxSelected: {
        marginLeft: '1.5rem',
        marginTop: '-0.5rem',
        marginBottom: '0.5rem'
      },
      tableContent: {
        wordBreak: 'break-all'
      }
    }),
    [theme]
  );
};

export const VisitorPermissionsContainerStyle = (): Record<string, CSSObject> => {
  const { isMobile } = useBreakpoints();
  return useMemo(
    () => ({
      alertStyle: {
        margin: isMobile ? '1.5rem 0' : '1.5rem 1.5rem 1rem 1.5rem'
      }
    }),
    [isMobile]
  );
};

import { CSSObject } from '@emotion/react';
import { useMemo } from 'react';
import { Theme } from '@cvent/carina/components/ThemeProvider';
import useBreakpoints from '@hooks/useBreakpoints';

// TO DO: RESOLVE IMPORT
// eslint-disable-next-line import/no-unresolved
import chroma from 'chroma-js';

export const PrivacySettingsStyle = (theme: Theme): Record<string, CSSObject> => {
  return useMemo(
    () => ({
      container: {
        flexGrow: 1,
        overflowY: 'auto',
        height: '100%',
        backgroundColor: theme.backgroundColor.focus
      },
      alertContainer: {
        paddingBottom: '1.5rem',
        marginBottom: '-3rem'
      }
    }),
    [theme]
  );
};

export const CardContainerStyle = (
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
      }
    }),
    [additionalParams, theme, isMobile, isMobileOrTablet]
  );
};

export const PrivacyPolicyFieldsStyle = (theme: Theme): Record<string, CSSObject> => {
  const { font } = theme;
  const { isMobile } = useBreakpoints();
  return useMemo(
    () => ({
      title: {
        fontWeight: font.base.weight.regular,
        margin: 0,
        padding: 0,
        marginBottom: '1.5rem',
        maxWidth: isMobile ? '65%' : '80%'
      },
      sectionContainer: {
        display: 'flex',
        flexDirection: 'column',
        rowGap: '1rem'
      }
    }),
    [font, isMobile]
  );
};

export const EditPrivacyPolicyFieldsStyle = (theme: Theme): Record<string, CSSObject> => {
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
        fontSize: font.base.size.h3
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
      }
    }),
    [font, isMobile]
  );
};

export const TextContainerStyle = (theme: Theme): Record<string, CSSObject> => {
  const { font } = theme;
  const { isMobile } = useBreakpoints();
  return useMemo(
    () => ({
      question: {
        color: font.color.soft,
        fontSize: font.base.size.xs
      },
      answer: {
        fontSize: font.base.size.m
      },
      flyout: {
        marginLeft: '0.2rem',
        marginTop: '0.06rem',
        alignSelf: isMobile ? 'center' : 'flex-start'
      },
      questionContainer: {
        display: 'flex'
      }
    }),
    [font, isMobile]
  );
};

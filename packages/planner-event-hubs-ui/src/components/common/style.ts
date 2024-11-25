import { CSSObject } from '@emotion/react';
import { useMemo } from 'react';
import { Theme } from '@cvent/carina/types/theme';
import { Theme as V1Theme } from '@cvent/carina/components/ThemeProvider';

// TO DO: RESOLVE IMPORT
// eslint-disable-next-line import/no-unresolved
import chroma from 'chroma-js';

export const CardContainerStyles = (theme: Theme): Record<string, CSSObject> => {
  return useMemo(
    () => ({
      cardWrapper: {
        height: '100%',
        paddingBottom: '1.5rem',
        '> *:first-of-type': {
          boxShadow: 'none',
          border: 'none',
          maxHeight: 'fit-content',
          borderRadius: theme.size.border.radius.twoX
        }
      },
      enabledCard: {
        height: '100%',
        paddingBottom: '1.5rem',
        '> *:first-of-type': {
          maxHeight: 'fit-content'
        },
        borderRadius: theme.size.border.radius.fiveX
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
        flexDirection: 'column',
        padding: '2rem'
      },
      childrenContainer: {
        marginTop: '-2rem'
      },
      cardTitle: {
        maxWidth: '80%',
        margin: '0.25rem 0 0.5rem 0'
      },
      cardText: {
        fontSize: '1rem',
        color: theme.font.color.soft
      },
      sectionHeader: {
        borderTop: `1px solid ${theme.borderColor.soft}`,
        marginTop: 25
      },
      sectionTitle: {
        padding: 0,
        fontWeight: theme.font.base.weight.regular,
        color: theme.font.color.base
      },
      subSectionTitle: {
        padding: 0,
        fontWeight: theme.font.base.weight.regular,
        color: theme.font.color.base,
        marginBottom: '.5rem'
      },
      sectionText: {
        margin: 0,
        color: theme.font.color.soft
      },
      buttonContainer: {
        display: 'flex',
        flexDirection: 'row-reverse',
        alignSelf: 'flex-end',
        zIndex: 1,
        marginRight: '-0.1rem'
      },
      spacer: {
        width: '0.5rem'
      }
    }),
    [theme]
  );
};

export const ConfirmationModalStyles = (theme: Theme): Record<string, CSSObject> => {
  const { font } = theme;
  return useMemo(
    () => ({
      modalHeaderStyles: {
        fontSize: '1.5rem',
        fontWeight: font.base.weight.regular
      },
      modalContentStyles: {
        color: font.color.soft
      }
    }),
    [font]
  );
};

export const TableStyles = (theme: Theme): Record<string, CSSObject> => {
  const { font, backgroundColor } = theme;
  return useMemo(
    () => ({
      emptyState: {
        paddingTop: 16,
        paddingBottom: 16,
        textAlign: 'center',
        fontSize: font.base.size.s,
        color: font.color.focus,
        backgroundColor: backgroundColor.surface
      }
    }),
    [font, backgroundColor]
  );
};

export const LibraryConfirmationModalStyles = (theme: V1Theme): Record<string, CSSObject> => {
  const { font } = theme;
  return useMemo(
    () => ({
      modalHeaderStyles: {
        fontSize: '1.5rem',
        fontWeight: font.base.weight.regular
      },
      modalContentStyles: {
        color: font.color.soft
      }
    }),
    [font]
  );
};

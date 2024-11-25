import { useMemo } from 'react';
import { Theme } from '@cvent/carina/components/ThemeProvider';
import useBreakpoints from '@hooks/useBreakpoints';
import { CSSObject } from '@emotion/react/dist/emotion-react.cjs';

export const MediaUploadStyles = (theme: Theme): Record<string, CSSObject> => {
  const { isMobileOrTablet } = useBreakpoints();
  const { font } = theme;
  return useMemo(
    () => ({
      container: {
        display: 'flex',
        flexDirection: 'column',
        flexWrap: 'wrap',
        padding: isMobileOrTablet ? '2rem' : '2.75rem 12.5rem 4.46rem 12.5rem',
        maxWidth: '100%',
        alignItems: 'flex-end'
      },
      cardContainer: {
        padding: '1.5rem'
      },
      imageContainer: { flexGrow: 1, overflowY: 'auto', minHeight: '100%' },
      buttonStyle: {
        paddingTop: '1.5rem',
        display: 'flex',
        width: '100%',
        justifyContent: 'flex-end',
        flexWrap: 'wrap'
      },
      iconStyle: {
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'flex-end',
        flexDirection: 'column',
        paddingRight: '2rem',
        paddingTop: '2rem'
      },
      cancelButtonStyle: {
        marginRight: isMobileOrTablet ? '0.313rem' : '0.625rem'
      },
      imageLabelStyle: {
        display: 'flex',
        color: font.color.soft,
        paddingBottom: '0.5rem'
      },
      imageDescriptionStyle: {
        color: font.color.soft,
        marginBottom: 24
      },
      imageHeader: { marginTop: 0, marginBottom: 16 }
    }),
    [isMobileOrTablet, font]
  );
};

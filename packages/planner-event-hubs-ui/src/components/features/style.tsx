import { Theme } from '@cvent/carina/types/theme';
import useBreakpoints from '@hooks/useBreakpoints';
import { CSSObject } from '@emotion/react';
import { useMemo } from 'react';

export const FeatureStyle = (theme: Theme): Record<string, CSSObject> => {
  const { isMobile } = useBreakpoints();
  return useMemo(
    () => ({
      container: {
        flexGrow: 1,
        overflowY: 'auto',
        height: '100%',
        backgroundColor: theme.backgroundColor.focus
      },
      cardContainer: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: '100%',
        padding: isMobile ? '1rem 0' : '1.5rem',
        columnGap: '2rem',
        rowGap: '2rem'
      }
    }),
    [theme, isMobile]
  );
};

export const Style = (theme: Theme): Record<string, CSSObject> => {
  const { isMobile, isMobileOrTablet } = useBreakpoints();
  return useMemo(
    () => ({
      card: {
        width: isMobileOrTablet ? '100%' : 'calc((100% - 2rem)/2)',
        padding: isMobile ? '0 0 1.125rem 0' : '1.25rem',
        backgroundColor: theme.backgroundColor.base,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
      },
      titleStyle: {
        fontSize: theme.font.base.size.h3,
        paddingLeft: '1.25rem',
        wordBreak: 'break-word'
      },
      contentContainer: {
        flexDirection: isMobileOrTablet ? 'row' : 'column'
      },
      imageStyle: {
        alignSelf: isMobileOrTablet ? 'center' : '',
        flexShrink: 0,
        marginBottom: isMobileOrTablet ? '0.5rem' : ''
      },
      buttonStyle: {
        padding: '1.25rem 1.25rem 0.625rem 1.25rem',
        width: '95%'
      },
      descriptionStyle: {
        fontSize: theme.font.base.size.s,
        color: theme.font.color.soft,
        fontWeight: theme.font.base.weight.regular,
        paddingLeft: '1.25rem',
        marginTop: '0.5rem'
      },
      imageAndBodyContainer: {
        display: 'flex',
        flexDirection: isMobileOrTablet ? 'column' : 'row',
        width: '85%'
      },
      switchContainer: {
        margin: isMobileOrTablet ? '8.23rem 1rem 0 0' : '0.2rem'
      }
    }),
    [theme, isMobile, isMobileOrTablet]
  );
};

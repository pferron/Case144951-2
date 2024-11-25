import { useMemo } from 'react';
import { CSSObject } from '@emotion/react';
import { Theme } from '@cvent/carina/types/theme';
import useBreakpoints from '@hooks/useBreakpoints';

export const FooterStyles = (theme: Theme): Record<string, CSSObject> => {
  const { isMobile } = useBreakpoints();
  return useMemo(
    () => ({
      linkTextStyle: {
        color: 'inherit',
        textDecoration: 'none'
      },
      containerStyle: {
        width: '100%',
        backgroundColor: theme.backgroundColor?.surface,
        fontSize: theme.font.base.size.xxs,
        fontWeight: theme.font.base.weight.regular,
        color: theme.font.color.soft,
        display: 'flex',
        justifyContent: isMobile ? 'center' : 'space-between',
        padding: '0.6rem 1rem 0.6rem 1rem',
        flexDirection: isMobile ? 'column' : 'row'
      },
      leftContainerStyle: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: isMobile ? 'column' : 'row'
      },
      rightContainerStyle: {
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: isMobile ? 'center' : 'flex-end'
      },
      cventTextStyle: { whiteSpace: 'nowrap', margin: isMobile ? '0rem 0rem 0.3rem 0.5rem' : '0rem 0rem 0rem 1rem' },
      divider: {
        color: 'inherit'
      }
    }),
    [isMobile, theme]
  );
};

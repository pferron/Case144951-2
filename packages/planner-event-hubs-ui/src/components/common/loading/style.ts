import { CSSObject } from '@emotion/react';
import useBreakpoints from '@hooks/useBreakpoints';
import { useMemo } from 'react';

export const Style = (): Record<string, CSSObject> => {
  const { isMobile } = useBreakpoints();

  return useMemo(
    () => ({
      loadingWrapper: {
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      },
      loadSpinner: {
        size: isMobile ? 'm' : 'l'
      }
    }),
    [isMobile]
  );
};

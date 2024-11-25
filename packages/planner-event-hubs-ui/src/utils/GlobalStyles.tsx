import React, { useContext, useMemo } from 'react';
import { Global } from '@emotion/react';
import { ThemeContext } from '@cvent/carina/components/ThemeProvider/ThemeContext';
import { GlobalTypography } from '@cvent/carina/components/Typography/GlobalTypography';
import type { Theme } from '@cvent/carina/types/theme';
import type { Interpolation } from '@emotion/react';

// GlobalStyles component; accepts a hook containing an app's additional custom global styles
export function GlobalStyles(): JSX.Element {
  const theme = useContext(ThemeContext);
  const globalStyles: Interpolation<Theme> = useMemo(
    () => ({
      '*': { boxSizing: 'border-box' }
    }),
    []
  );

  // Log the Carina theme object for reference
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
    console.info(
      '%cCarina Theme Reference',
      `
      padding: .25rem .5rem;
      margin: .5rem 0;
      color: ${theme.font.color.brand.base};
      font-family: ${theme.font.base.family};
      font-size: ${theme.font.base.size.s};
      background: ${theme.backgroundColor.base};
      border-left: 4px solid ${theme.backgroundColor.accent.fill.surface};
    `,
      theme
    );
  }

  return (
    <>
      <GlobalTypography />
      <Global styles={globalStyles} />
    </>
  );
}

export default GlobalStyles;

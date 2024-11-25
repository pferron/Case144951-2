import React, { useMemo } from 'react';
import { CSSObject, Global } from '@emotion/react';
import { GlobalTypography } from '@cvent/carina/components/Typography/GlobalTypography';
import useBlockTheme from '@cvent/blocks/hooks/useTheme';

export function GlobalStyles(): JSX.Element {
  const theme = useBlockTheme();
  const { palette, backgroundColor, font } = theme;
  const customBackground = palette?.background || backgroundColor?.surface;

  const globalStyles = useMemo<CSSObject>(
    () => ({
      '*': { boxSizing: 'border-box' },
      html: {
        height: '100%'
      },
      body: {
        backgroundColor: customBackground,
        height: '100%'
      },
      '#__next': {
        height: '100%'
      }
    }),
    [customBackground]
  );

  // Log the Carina theme object for reference
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    // FIREBALL
    // eslint-disable-next-line   no-console
    console.info(
      '%cCarina Theme Reference',
      `
      padding: .25rem .5rem;
      margin: .5rem 0;
      color: ${font.color.brand.base};
      font-family: ${font.base.family};
      font-size: ${font.base.size.s};
      background: ${backgroundColor.base};
      border-left: 4px solid ${backgroundColor.accent.fill.surface};
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

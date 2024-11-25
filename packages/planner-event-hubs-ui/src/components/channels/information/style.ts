import { CSSObject } from '@emotion/react';
import { useMemo } from 'react';
import { Theme } from '@cvent/carina/components/ThemeProvider';
import useBreakpoints from '@hooks/useBreakpoints';

export const ChannelInformationModalStyles = (theme: Theme): Record<string, CSSObject> => {
  const { isMobile } = useBreakpoints();
  const { font } = theme;
  return useMemo(
    () => ({
      cardBodyStyles: {
        padding: '0.75rem 1.5rem 1.5rem 1.25rem',
        height: '100%',
        width: '100%'
      },
      formStyles: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
      },
      formContentStyles: {
        paddingTop: '1rem'
      },
      buttonStyles: {
        display: 'flex'
      },
      cancelButtonStyles: {
        marginRight: isMobile ? '0rem' : '1rem'
      },
      imageLabelStyles: {
        display: 'flex',
        color: font.color.disabled,
        paddingBottom: '0.5rem'
      },
      tooltipButtonStyles: {
        marginLeft: '0.2rem',
        padding: '0.1rem',
        background: 'inherit',
        border: 'none'
      }
    }),
    [font.color.disabled, isMobile]
  );
};

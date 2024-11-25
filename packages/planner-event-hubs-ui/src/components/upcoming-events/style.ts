import { CSSObject } from '@emotion/react';
import { useMemo } from 'react';
import { Theme } from '@cvent/carina/components/ThemeProvider';
import useBreakpoints from '@hooks/useBreakpoints';

export const UpcomingEventsStyle = (theme: Theme): Record<string, CSSObject> => {
  const { isMobileOrTablet } = useBreakpoints();
  const { font } = theme;

  return useMemo(
    () => ({
      container: {
        flexGrow: 1,
        overflowY: 'auto',
        height: '100%',
        backgroundColor: theme.backgroundColor.focus
      },
      calendarSelectionStyle: {
        flexBasis: isMobileOrTablet ? '100%' : '66%',
        padding: !isMobileOrTablet ? '1.5rem 1rem 0 1.5rem' : '1rem 1rem 0 1rem'
      },
      manageCalendarStyle: {
        flexBasis: isMobileOrTablet ? '100%' : '33%',
        padding: isMobileOrTablet ? '0 1rem' : '1.5rem 0 0 0 '
      },
      title: {
        fontSize: theme.font.base.size.h3,
        paddingLeft: 0,
        paddingBottom: 16,
        wordBreak: 'break-word'
      },
      body: {
        marginBottom: 24,
        fontFamily: font.base.family,
        fontSize: font.base.size.m,
        fontWeight: font.base.weight.regular,
        color: font.color.soft
      },
      form: {
        width: '50%',
        fontSize: font.base.size.s
      }
    }),
    [
      theme,
      font.base.family,
      font.base.weight.regular,
      font.color.soft,
      font.base.size.m,
      font.base.size.s,
      isMobileOrTablet
    ]
  );
};

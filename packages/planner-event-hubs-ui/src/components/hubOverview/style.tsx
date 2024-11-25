import { Theme } from '@cvent/carina/types/theme';
import { CSSObject } from '@emotion/react';
import { useMemo } from 'react';
import useBreakpoints from '@hooks/useBreakpoints';

export const HubOverviewStyle = (theme: Theme): Record<string, CSSObject> =>
  useMemo(
    () => ({
      outerContainer: {
        flexGrow: 1,
        overflowY: 'auto',
        height: '100%',
        backgroundColor: theme.backgroundColor.focus
      },
      dropDownFilter: {
        paddingLeft: theme.spacing['6'],
        paddingTop: theme.spacing['7'],
        paddingRight: theme.spacing['4'],
        paddingBottom: theme.spacing['3'],
        borderRadius: '1.125rem'
      },
      errorTextContainer: {
        display: 'flex',
        justifyContent: 'center',
        textAlign: 'center',
        flexDirection: 'column'
      },
      innerContainer: {
        margin: '1.5rem',
        background: theme.backgroundColor.base,
        borderRadius: '0.5rem',
        display: 'flex',
        justifyContent: 'flex-start',
        flexDirection: 'column',
        padding: '1.5rem'
      },
      cardContainerStyles: {
        marginTop: theme.spacing['6']
      },
      cardBodyStyles: {
        margin: theme.spacing['6'],
        minHeight: '25.9rem'
      },
      summaryTileCardBody: {
        padding: theme.spacing['5'],
        width: '100%',
        minHeight: '8.1rem'
      },
      summaryTileTitleStyle: {
        margin: '0',
        lineHeight: theme.font.lineHeight.base,
        fontWeight: theme.font.base.weight.bold,
        fontSize: theme.font.base.size.m
      },
      summaryTileBodyStyle: {
        margin: '0',
        fontSize: theme.font.base.size.h2,
        fontWeight: theme.font.base.weight.regular
      },
      summaryTileFooterStyle: {
        fontSize: theme.font.base.size.s,
        fontWeight: theme.font.base.weight.bold,
        lineHeight: theme.font.lineHeight.list,
        color: '#008600',
        display: 'flex',
        marginTop: '0.25rem'
      },
      summaryTilesContainer: {
        paddingTop: theme.spacing['6'],
        paddingBottom: theme.spacing['3']
      },
      pieChartComponentStyles: {
        display: 'flex',
        alignItems: 'center',
        marginTop: '3rem'
      },
      totalViewByDeviceTextStyle: {
        fontSize: theme.font.base.size.h4,
        paddingBottom: '0.5rem'
      },
      loadingSpinnerStyle: {
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
        margin: '3rem',
        textAlign: 'center',
        columnGap: '0.5rem'
      },
      errorCardContainer: {
        margin: '1rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      },
      errorContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      },
      emptyStateStyle: {
        margin: '1.25rem',
        fontSize: theme.font.base.size.h2,
        fontWeight: theme.font.base.weight.regular,
        lineHeight: theme.font.lineHeight.base
      },
      topMetricsHeadingStyle: { margin: '0', fontWeight: '500', padding: '0.5rem 0 0 0' },
      topMetricsHelpPopperContainerStyle: { display: 'flex', flexDirection: 'row', padding: '0.5rem 0 0 0' },
      topMetricsHelpPopperStyle: { padding: '0.4rem 1rem 0 0', height: 'fit-content', cursor: 'pointer' },
      pieChartHeaderContainer: { display: 'flex', flexDirection: 'row', justifyContent: 'space-between' },
      topMetricsCardsContainer: { display: 'flex', flexDirection: 'row', justifyContent: 'space-between' },
      topMetricsCardHeadingStyle: {
        margin: '0',
        lineHeight: theme.font.lineHeight.base,
        fontWeight: theme.font.base.weight.bold,
        fontSize: theme.font.base.size.m,
        width: 'fit-content',
        display: 'flex'
      }
    }),
    [theme]
  );

export const HubOverviewTopVideoStyle = (theme: Theme): Record<string, CSSObject> => {
  const { isMobileOrTablet } = useBreakpoints();
  return useMemo(
    () => ({
      topVideosCard: {
        paddingBottom: 8,
        paddingLeft: isMobileOrTablet ? 24 : 0,
        paddingRight: 24,
        width: isMobileOrTablet ? 'auto' : '50%'
      },
      summaryTileCardBody: {
        width: '100%',
        minHeight: '19rem',
        marginRight: '1.875rem',
        marginBottom: '2rem'
      },
      hubOverviewViews: {
        color: theme.font.color.soft
      },

      summaryTileTitleStyle: {
        lineHeight: theme.font.lineHeight.base,
        fontWeight: theme.font.base.weight.regular,
        fontSize: theme.font.base.size.l,
        marginLeft: '2rem',
        marginBottom: '1rem'
      },
      headingTitleStyle: {
        lineHeight: theme.font.lineHeight.base,
        fontWeight: theme.font.base.weight.bold,
        fontSize: theme.font.base.size.s,
        marginBottom: '0.5rem',
        marginLeft: '1.5rem'
      },
      headingRankNameStyle: {
        lineHeight: theme.font.lineHeight.base,
        fontWeight: theme.font.base.weight.bold,
        fontSize: theme.font.base.size.s,
        marginTop: '1.25rem',
        marginLeft: '1.5rem'
      },
      viewMoreButtonStyle: {
        fontWeight: theme.font.base.weight.medium,
        fontSize: theme.font.base.size.m,
        cursor: 'pointer',
        padding: '0.5rem 1rem',
        borderRadius: '0.25rem'
      },
      videoNameStyle: {
        marginBottom: '1rem',
        marginLeft: '1.5rem',
        wordWrap: 'break-word'
      },
      successStyle: {
        color: theme.font.color.success.base,
        marginLeft: '1.5rem'
      },
      dangerStyle: {
        color: theme.font.color.danger.base,
        marginLeft: '1.5rem'
      },
      headingDateStyle: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        lineHeight: theme.font.lineHeight.base,
        fontWeight: theme.font.base.weight.bold,
        fontSize: theme.font.base.size.s,
        marginBottom: '0.5rem',
        marginLeft: '1.5rem'
      },
      headingTitleContainer: {
        display: 'flex'
      },
      summaryTileFooterStyle: {
        margin: '0',
        fontSize: theme.font.base.size.s,
        fontWeight: theme.font.base.weight.bold,
        lineHeight: theme.font.lineHeight.list,
        display: 'flex',
        marginTop: '0.25rem'
      },
      summaryTileFooterStyleNewComponent: {
        margin: '0',
        fontSize: theme.font.base.size.s,
        fontWeight: theme.font.base.weight.bold,
        lineHeight: theme.font.lineHeight.list,
        display: 'flex',
        marginTop: '0.25rem',
        justifyContent: 'flex-end'
      }
    }),
    [
      isMobileOrTablet,
      theme.font.base.size.l,
      theme.font.base.size.s,
      theme.font.base.weight.bold,
      theme.font.base.weight.regular,
      theme.font.color.soft,
      theme.font.lineHeight.base,
      theme.font.lineHeight.list,
      theme.font.base.size.m,
      theme.font.base.weight.medium,
      theme.font.color.success.base,
      theme.font.color.danger.base
    ]
  );
};

export const DatePickerModalStyle = (): Record<string, CSSObject> => ({
  datePickerModalTitle: {
    display: 'flex'
  },
  datePickerContentContainer: {
    width: '80%',
    marginRight: 'auto',
    marginLeft: 'auto'
  },
  datePickerContainer: {
    width: '100%'
  }
});

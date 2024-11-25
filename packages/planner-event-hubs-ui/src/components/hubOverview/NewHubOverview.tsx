import React, { CSSProperties, useCallback, useEffect, useMemo, useState } from 'react';
import { Breadcrumbs, Breadcrumb as Crumb } from '@cvent/carina/components/Breadcrumbs';
import { useTranslate } from 'nucleus-text';
import {
  DESKTOP_DEVICE_TYPE,
  DEVICE_TYPE,
  HUB_OVERVIEW_URL,
  MOBILE_DEVICE_TYPE,
  SECONDS_IN_HOUR,
  TABLET_DEVICE_TYPE,
  VIDEO_HUB_INFORMATION_URL,
  VIDEO_HUB_PATH_PARAM_KEY,
  VIDEO_HUBS_URL
} from '@utils/constants';
import Header from '@components/Header';
import { IllustrationNotice } from '@cvent/carina/components/Templates';
import HeroErrorShrug from '@cvent/carina/components/Illustrations/HeroErrorShrug';
import { useStyle } from '@hooks/useStyle';
import { HubOverviewStyle } from '@components/hubOverview/style';
import { Row } from '@cvent/carina/components/Row';
import { injectTestId } from '@cvent/nucleus-test-automation';
import HubOverViewLineChartContainer from '@components/hubOverview/HubOverViewLineChartContainer';
import { useAppFeatures } from '@components/AppFeaturesProvider';
import useBreakpoints from '@hooks/useBreakpoints';
import { useQuery } from '@apollo/client';
import {
  getTotalViewsQuery,
  getRegistrationCount,
  averageViewDurationByHubId,
  viewsByDeviceType,
  topFiveVideosViewedByHubId
} from '@cvent/planner-event-hubs-model/src/operations/analytics';
import { getDataForTimeframeCategory, getDatetimesForAnalytics, getPercentageDifference } from '@utils/analyticsUtil';
import { AnalyticsData, TopVideos, ViewsBySourceResponse } from '@cvent/planner-event-hubs-model/types';
import DatePickerModal from '@components/hubOverview/DatePickerModal';
import { subMonths } from 'date-fns';
import { ACTIVE_HUB } from '@components/constants';
import { useMeasurePageLoad, usePageActions } from '@cvent/sli-nextjs-metrics';
import { CardContainer } from '@cvent/carina/components/Card';
import { Switch } from '@cvent/carina/components/Switch';
import { Dropdown } from '@cvent/carina/components/Dropdown';
import { TopMetricsCard } from '@components/hubOverview/TopMetricsCard';
import { HelpInfoPopper } from '@components/hubOverview/HelpInfoPopper';
import { InfoIcon } from '@cvent/carina/components/Icon';
import { useTheme } from '@cvent/carina/components/ThemeProvider/useTheme';
import NewPieChartContainer from '@components/hubOverview/NewPieChartContainer';
import { NewHubOverviewVideoCard } from '@components/hubOverview/NewHubOverviewVideoCard';
import { onDateApplyHandler } from '@components/videoEngagement/DateRangeOptions';

interface Props {
  hubId: string;
  hubTitle: string;
  hubStatus: string;
  earliestDate?: Date;
}

function NewHubOverview({ hubId, hubTitle, hubStatus }: Props): JSX.Element {
  const { translate } = useTranslate();
  const styles = useStyle(HubOverviewStyle);
  const { hubOverviewFeature, videoAnalyticsMaterializedViewsPipeline: materializedViewsPipelineFeature } =
    useAppFeatures();
  const { isMobileOrTablet } = useBreakpoints();
  const [currentViewsData, setCurrentViewsData] = useState<AnalyticsData>(null);
  const [previousViewsData, setPreviousViewsData] = useState<AnalyticsData>(null);
  const [currentViewDurationData, setCurrentViewDurationData] = useState<AnalyticsData>(null);
  const [previousViewDurationData, setPreviousViewDurationData] = useState<AnalyticsData>(null);
  const [currentRegistrationCountData, setCurrentRegistrationCountData] = useState<AnalyticsData>(null);
  const [previousRegistrationCountData, setPreviousRegistrationCountData] = useState<AnalyticsData>(null);
  const [viewsByDeviceTypeData, setViewsByDeviceTypeData] = useState<ViewsBySourceResponse>(null);
  const [topFiveVideosViewedData, setTopFiveVideosViewedData] = useState<[TopVideos]>(null);
  const [tryAgain, setTryAgain] = useState(false);
  const [compare, setCompare] = useState(false);
  const [error, setError] = useState({
    prevTotalViewsError: false,
    totalViewsError: false,
    registrationCountError: false,
    prevRegistrationCountError: false,
    viewDurationError: false,
    prevViewDurationError: false,
    viewsDeviceError: false,
    topVideosError: false
  });
  let isHubActive = false;
  if (hubStatus === ACTIVE_HUB) {
    isHubActive = true;
  }
  const showFullPageError =
    error.totalViewsError &&
    error.registrationCountError &&
    error.viewDurationError &&
    error.viewsDeviceError &&
    error.topVideosError;

  const { getBaseProps } = usePageActions();
  const baseProps = getBaseProps();
  const { font } = useTheme();
  const pieChartData = [
    {
      value: viewsByDeviceTypeData?.desktopViews || 0,
      group: DEVICE_TYPE,
      category: DESKTOP_DEVICE_TYPE
    },
    {
      value: viewsByDeviceTypeData?.tabletViews || 0,
      group: DEVICE_TYPE,
      category: TABLET_DEVICE_TYPE
    },
    {
      value: viewsByDeviceTypeData?.mobileViews || 0,
      group: DEVICE_TYPE,
      category: MOBILE_DEVICE_TYPE
    }
  ];

  const headerBreadCrumbs: JSX.Element = (
    <Breadcrumbs>
      <Crumb href={VIDEO_HUBS_URL}>{translate('video_hubs_header_title')}</Crumb>
      <Crumb
        href={
          hubOverviewFeature
            ? HUB_OVERVIEW_URL.replace(VIDEO_HUB_PATH_PARAM_KEY, hubId)
            : VIDEO_HUB_INFORMATION_URL.replace(VIDEO_HUB_PATH_PARAM_KEY, hubId)
        }
      >
        {hubTitle}
      </Crumb>
      <Crumb>{translate('hub_overview_side_nav_text')}</Crumb>
    </Breadcrumbs>
  );

  const HubOverviewErrorPage: JSX.Element = useMemo(
    () => (
      <IllustrationNotice testID="hub-overview-error-container" illustration={HeroErrorShrug}>
        <div css={styles.errorTextContainer}>
          <h2 css={{ margin: '1.5rem 0rem 0rem 0rem' }}>
            {translate(!isHubActive ? 'hub_overview_inactive_hub_error_header' : 'hub_overview_error_text')}
          </h2>
          {!isHubActive && (
            <h2 css={{ marginTop: '1.5rem', fontSize: '1.313rem' }}>
              {translate('hub_overview_inactive_hub_error_text')}
            </h2>
          )}
        </div>
      </IllustrationNotice>
    ),
    [translate, styles, isHubActive]
  );

  const [datePickerModalIsOpen, setDatePickerModalIsOpen] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState(translate('hub_overview_date_picker_last_30_days'));
  const [selectedDateRange, setSelectedDateRange] = useState({ value: 'last_30_days' });

  const [datePickerModalPieChartIsOpen, setDatePickerModalPieChartIsOpen] = useState(false);
  const [selectedTimeframePieChart, setSelectedTimeframePieChart] = useState(
    translate('hub_overview_date_picker_last_30_days')
  );

  const [datePickerModalVideoHighlights, setDatePickerModalVideoHighlights] = useState(false);
  const [selectedTimeframeVideoHighlights, setSelectedTimeframeVideoHighlights] = useState(
    translate('hub_overview_date_picker_last_30_days')
  );
  const [selectedDateRangePieChart, setSelectedDateRangePieChart] = useState({ value: 'last_30_days' });
  const [selectedDateRangeVideoHighlights, setSelectedDateRangeVideoHighlights] = useState({ value: 'last_30_days' });

  const today = new Date();
  const earliestDate = subMonths(today, 11);
  const [getDateForAnalytics, setDateForAnalytics] = useState(null);
  const [getDateForAnalyticsPieChart, setDateForAnalyticsPieChart] = useState(null);
  const [getDateForVideoHighlights, setDateForVideoHighlights] = useState(null);

  const getStartDate = useCallback(option => {
    switch (option) {
      case 'last_7_days':
        return 7;
      case 'last_30_days':
        return 30;
      case 'last_3_months':
        return 90;
      case 'last_6_months':
        return 180;
      case 'last_12_months':
        return 365;
      default:
        return null;
    }
  }, []);

  const dateRangeOptionsForTopMetrics = useMemo(
    () => [
      {
        label: translate('hub_overview_date_picker_last_7_days'),
        value: 'last_7_days'
      },
      {
        label: translate('hub_overview_date_picker_last_30_days'),
        value: 'last_30_days'
      },
      {
        label: translate('hub_overview_date_picker_last_3_months'),
        value: 'last_3_months'
      },
      {
        label: translate('hub_overview_date_picker_last_6_months'),
        value: 'last_6_months'
      },
      {
        label: translate('hub_overview_date_picker_last_12_months'),
        value: 'last_12_months'
      },
      {
        label: translate('hub_overview_date_picker_custom_date_range'),
        value: 'custom_date_range'
      }
    ],
    [translate]
  );

  const dateRangeOptionsForPieChart = useMemo(
    () => [
      {
        label: translate('hub_overview_date_picker_last_12_months'),
        value: 'last_12_months'
      },
      {
        label: translate('hub_overview_date_picker_last_7_days'),
        value: 'last_7_days'
      },
      {
        label: translate('hub_overview_date_picker_last_30_days'),
        value: 'last_30_days'
      },
      {
        label: translate('hub_overview_date_picker_last_3_months'),
        value: 'last_3_months'
      },
      {
        label: translate('hub_overview_date_picker_last_6_months'),
        value: 'last_6_months'
      },
      {
        label: translate('hub_overview_date_picker_custom_date_range'),
        value: 'custom_date_range'
      }
    ],
    [translate]
  );

  const dateRangeOptionsForVideoHighlights = useMemo(
    () => [
      {
        label: translate('hub_overview_date_picker_last_12_months'),
        value: 'last_12_months'
      },
      {
        label: translate('hub_overview_date_picker_last_7_days'),
        value: 'last_7_days'
      },
      {
        label: translate('hub_overview_date_picker_last_30_days'),
        value: 'last_30_days'
      },
      {
        label: translate('hub_overview_date_picker_last_3_months'),
        value: 'last_3_months'
      },
      {
        label: translate('hub_overview_date_picker_last_6_months'),
        value: 'last_6_months'
      },
      {
        label: translate('hub_overview_date_picker_custom_date_range'),
        value: 'custom_date_range'
      }
    ],
    [translate]
  );

  const handleDateSelection = useCallback(
    selection => {
      if (selection === 'custom_date_range') {
        setDatePickerModalIsOpen(true);
      } else {
        const newStartDate = getStartDate(selection);
        setDateForAnalytics(newStartDate);
        setSelectedTimeframe(dateRangeOptionsForTopMetrics.find(option => option.value === selection).label);
        const customDateRangeOption = dateRangeOptionsForTopMetrics.find(
          option => option.value === 'custom_date_range'
        );
        if (customDateRangeOption) {
          customDateRangeOption.label = translate('hub_overview_date_picker_custom_date_range');
        }
      }
    },
    [
      setDatePickerModalIsOpen,
      getStartDate,
      setDateForAnalytics,
      setSelectedTimeframe,
      dateRangeOptionsForTopMetrics,
      translate
    ]
  );

  const handleDateSelectionPieChart = useCallback(
    selection => {
      if (selection === 'custom_date_range') {
        setDatePickerModalPieChartIsOpen(true);
      } else {
        const newStartDate = getStartDate(selection);
        setDateForAnalyticsPieChart(newStartDate);
        setSelectedTimeframePieChart(dateRangeOptionsForPieChart.find(option => option.value === selection).label);
        const customDateRangeOption = dateRangeOptionsForPieChart.find(option => option.value === 'custom_date_range');
        if (customDateRangeOption) {
          customDateRangeOption.label = translate('hub_overview_date_picker_custom_date_range');
        }
      }
    },
    [
      setDatePickerModalPieChartIsOpen,
      getStartDate,
      setDateForAnalyticsPieChart,
      setSelectedTimeframePieChart,
      dateRangeOptionsForPieChart,
      translate
    ]
  );

  const handleDateSelectionVideoHighlights = useCallback(
    selection => {
      if (selection === 'custom_date_range') {
        setDatePickerModalVideoHighlights(true);
      } else {
        const newStartDate = getStartDate(selection);
        setDateForVideoHighlights(newStartDate);
        setSelectedTimeframeVideoHighlights(
          dateRangeOptionsForVideoHighlights.find(option => option.value === selection).label
        );
        const customDateRangeOption = dateRangeOptionsForVideoHighlights.find(
          option => option.value === 'custom_date_range'
        );
        if (customDateRangeOption) {
          customDateRangeOption.label = translate('hub_overview_date_picker_custom_date_range');
        }
      }
    },
    [
      setDatePickerModalVideoHighlights,
      getStartDate,
      setDateForVideoHighlights,
      setSelectedTimeframeVideoHighlights,
      dateRangeOptionsForVideoHighlights,
      translate
    ]
  );

  const { currentStartDate, currentEndDate, previousStartDate, previousEndDate } = getDatetimesForAnalytics(
    getDateForAnalytics,
    selectedTimeframe
  );

  const pieChartDates = getDatetimesForAnalytics(getDateForAnalyticsPieChart, selectedTimeframePieChart);

  const { refetch: refetchingOldViews, loading: fetchingOldViews } = useQuery(getTotalViewsQuery, {
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-and-network',
    variables: {
      input: {
        hubId,
        startDate: previousStartDate,
        endDate: previousEndDate,
        pipeline: materializedViewsPipelineFeature ? 'v2' : 'v1'
      }
    },
    onCompleted: data => {
      setError(prev => ({
        ...prev,
        prevTotalViewsError: false
      }));
      if (data?.totalViewsByHubId?.serverError) {
        setError(prev => ({
          ...prev,
          prevTotalViewsError: true
        }));
      } else {
        setPreviousViewsData(data?.totalViewsByHubId);
      }
    }
  });

  const { refetch: refetchingViews, loading: fetchingViews } = useQuery(getTotalViewsQuery, {
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-and-network',
    variables: {
      input: {
        hubId,
        startDate: currentStartDate,
        endDate: currentEndDate,
        pipeline: materializedViewsPipelineFeature ? 'v2' : 'v1'
      }
    },
    onCompleted: data => {
      setError(prev => ({
        ...prev,
        totalViewsError: false
      }));
      if (data?.totalViewsByHubId?.serverError) {
        setError(prev => ({
          ...prev,
          totalViewsError: true
        }));
      } else {
        setCurrentViewsData(data?.totalViewsByHubId);
      }
    }
  });

  const { refetch: reFetchingOldRegistrationCount, loading: fetchingOldRegistrationCount } = useQuery(
    getRegistrationCount,
    {
      fetchPolicy: 'network-only',
      nextFetchPolicy: 'cache-and-network',
      variables: {
        input: {
          hubId,
          startDate: previousStartDate,
          endDate: previousEndDate
        }
      },
      onCompleted: data => {
        setError(prev => ({
          ...prev,
          prevRegistrationCountError: false
        }));
        if (data?.getRegistrationCount?.serverError) {
          setError(prev => ({
            ...prev,
            prevRegistrationCountError: true
          }));
        } else {
          setPreviousRegistrationCountData(data?.getRegistrationCount);
        }
      }
    }
  );

  const { refetch: reFetchingViewsByDeviceType, loading: fetchingViewsByDeviceType } = useQuery(viewsByDeviceType, {
    variables: {
      input: {
        hubId,
        startDate: pieChartDates.currentStartDate,
        endDate: pieChartDates.currentEndDate,
        pipeline: materializedViewsPipelineFeature ? 'v2' : 'v1'
      }
    },
    onCompleted: data => {
      setError(prev => ({
        ...prev,
        viewsDeviceError: false
      }));
      if (data?.viewsByDeviceType?.serverError) {
        setError(prev => ({
          ...prev,
          viewsDeviceError: true
        }));
      } else {
        setViewsByDeviceTypeData(data?.viewsByDeviceType);
      }
    }
  });

  const { refetch: refetchingRegistrationCount, loading: fetchingRegistrationCount } = useQuery(getRegistrationCount, {
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-and-network',
    variables: {
      input: {
        hubId,
        startDate: currentStartDate,
        endDate: currentEndDate
      }
    },
    onCompleted: data => {
      setError(prev => ({
        ...prev,
        registrationCountError: false
      }));
      if (data?.getRegistrationCount?.serverError) {
        setError(prev => ({
          ...prev,
          registrationCountError: true
        }));
      } else {
        setCurrentRegistrationCountData(data?.getRegistrationCount);
      }
    }
  });

  const { refetch: reFetchingOldViewDuration, loading: previousViewDurationLoading } = useQuery(
    averageViewDurationByHubId,
    {
      fetchPolicy: 'network-only',
      nextFetchPolicy: 'cache-and-network',
      variables: {
        input: {
          hubId,
          startDate: previousStartDate,
          endDate: previousEndDate,
          pipeline: materializedViewsPipelineFeature ? 'v2' : 'v1'
        }
      },
      onCompleted: data => {
        setError(prev => ({
          ...prev,
          prevViewDurationError: false
        }));
        if (data?.averageViewDurationByHubId?.serverError) {
          setError(prev => ({
            ...prev,
            prevViewDurationError: true
          }));
        } else {
          setPreviousViewDurationData(data?.averageViewDurationByHubId);
        }
      }
    }
  );

  const { refetch: reFetchingViewDuration, loading: currentViewDurationLoading } = useQuery(
    averageViewDurationByHubId,
    {
      fetchPolicy: 'network-only',
      nextFetchPolicy: 'cache-and-network',
      variables: {
        input: {
          hubId,
          startDate: currentStartDate,
          endDate: currentEndDate,
          pipeline: materializedViewsPipelineFeature ? 'v2' : 'v1'
        }
      },
      onCompleted: data => {
        setError(prev => ({
          ...prev,
          viewDurationError: false
        }));
        if (data?.averageViewDurationByHubId?.serverError) {
          setError(prev => ({
            ...prev,
            viewDurationError: true
          }));
        } else {
          setCurrentViewDurationData(data?.averageViewDurationByHubId);
        }
      }
    }
  );

  const topVideosDates = getDatetimesForAnalytics(getDateForVideoHighlights, selectedTimeframeVideoHighlights);

  const { refetch: reFetchingTopVideos, loading: topFiveVideosViewedLoading } = useQuery(topFiveVideosViewedByHubId, {
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-and-network',
    variables: {
      input: {
        hubId,
        startDate: topVideosDates.currentStartDate,
        endDate: topVideosDates.currentEndDate,
        pipeline: materializedViewsPipelineFeature ? 'v2' : 'v1'
      }
    },
    onCompleted: data => {
      setError(prev => ({
        ...prev,
        topVideosError: false
      }));
      if (data?.topFiveVideosViewedByHubId?.serverError) {
        setError(prev => ({
          ...prev,
          topVideosError: true
        }));
      } else {
        setTopFiveVideosViewedData(data?.topFiveVideosViewedByHubId?.topVideos);
      }
    }
  });

  const viewsDifference = getPercentageDifference(previousViewsData?.total ?? 0, currentViewsData?.total ?? 0);
  const currentViewsArray = useMemo(
    () => getDataForTimeframeCategory(currentViewsData)[0]?.dataArray ?? [],
    [currentViewsData]
  );
  const previousViewsArray = useMemo(
    () => getDataForTimeframeCategory(previousViewsData)[0]?.dataArray ?? [],
    [previousViewsData]
  );
  const currentViewDurationArray = useMemo(
    () => getDataForTimeframeCategory(currentViewDurationData)[0]?.dataArray ?? [],
    [currentViewDurationData]
  );
  const previousViewDurationArray = useMemo(
    () => getDataForTimeframeCategory(previousViewDurationData)[0]?.dataArray ?? [],
    [previousViewDurationData]
  );

  const currentViewDurationInHoursArray = currentViewDurationArray.map(contact => ({
    ...contact,
    value: Math.round(contact.value / SECONDS_IN_HOUR)
  }));
  const previousViewDurationInHoursArray = previousViewDurationArray.map(contact => ({
    ...contact,
    value: Math.round(contact.value / SECONDS_IN_HOUR)
  }));

  const averageWatchDuration = currentViewDurationInHoursArray.reduce(
    (accumulator, currentItem) => accumulator + currentItem.value,
    0
  );

  const previousAverageWatchDuration = previousViewDurationInHoursArray.reduce(
    (accumulator, currentItem) => accumulator + currentItem.value,
    0
  );

  const averageViewDurationDifference = getPercentageDifference(previousAverageWatchDuration, averageWatchDuration);

  const registrationCountDifference = getPercentageDifference(
    previousRegistrationCountData?.total ?? 0,
    currentRegistrationCountData?.total ?? 0
  );
  const currentRegistrationCountArray = useMemo(
    () => getDataForTimeframeCategory(currentRegistrationCountData)[0]?.dataArray ?? [],
    [currentRegistrationCountData]
  );
  const previousRegistrationCountArray = useMemo(
    () => getDataForTimeframeCategory(previousRegistrationCountData)[0]?.dataArray ?? [],
    [previousRegistrationCountData]
  );

  const handleErrors = useCallback(() => {
    if (error.prevTotalViewsError) {
      refetchingOldViews();
    } else if (error.totalViewsError) {
      refetchingViews();
    } else if (error.registrationCountError) {
      refetchingRegistrationCount();
    } else if (error.prevRegistrationCountError) {
      reFetchingOldRegistrationCount();
    } else if (error.viewDurationError) {
      reFetchingViewDuration();
    } else if (error.prevViewDurationError) {
      reFetchingOldViewDuration();
    } else if (error.viewsDeviceError) {
      reFetchingViewsByDeviceType();
    } else if (error.topVideosError) {
      reFetchingTopVideos();
    }
  }, [
    error,
    refetchingOldViews,
    refetchingViews,
    refetchingRegistrationCount,
    reFetchingOldRegistrationCount,
    reFetchingViewDuration,
    reFetchingOldViewDuration,
    reFetchingTopVideos,
    reFetchingViewsByDeviceType
  ]);

  useEffect(() => {
    if (selectedTimeframe !== translate('hub_overview_date_picker_last_12_months')) {
      setPreviousViewsData(null);
      setPreviousViewDurationData(null);
      setPreviousRegistrationCountData(null);
    }
  }, [selectedTimeframe, translate]);

  useEffect(() => {
    handleErrors();
  }, [tryAgain, handleErrors]);

  useMeasurePageLoad({
    pageIsLoading: (): boolean =>
      fetchingViews ||
      fetchingOldViews ||
      fetchingOldRegistrationCount ||
      fetchingRegistrationCount ||
      previousViewDurationLoading ||
      currentViewDurationLoading,
    data: { ...baseProps }
  });
  const showComparisonGraph = selectedTimeframe === translate('hub_overview_date_picker_last_12_months');
  return (
    <>
      <Header title={translate('hub_overview_heading_text')} breadCrumbs={headerBreadCrumbs} />
      <div css={styles.outerContainer}>
        {!isHubActive || showFullPageError ? (
          HubOverviewErrorPage
        ) : (
          <>
            <div css={{ margin: '1.5rem' }}>
              <CardContainer responsive>
                <div css={{ padding: '1.5rem', width: '100%' }}>
                  <div css={{ display: 'flex', flexDirection: 'column' }}>
                    <div css={{ display: 'flex', justifyContent: 'space-between' }}>
                      <h2 css={styles.topMetricsHeadingStyle}>{translate('hub_overview_top_metrics_text')}</h2>
                      <div css={styles.topMetricsHelpPopperContainerStyle}>
                        <HelpInfoPopper
                          testID="top-metrics-info-tooltip"
                          helpText={translate('hub_overview_top_metrics_tooltip_text')}
                          accessibilityLabel={translate('hub_overview_top_metrics_tooltip_text')}
                          hoverElement={<InfoIcon size="s" color={font.color.soft} />}
                          placement="left-start"
                          style={styles.topMetricsHelpPopperStyle as CSSProperties}
                        />
                        <p css={{ margin: '0.25rem 1rem 0 0' }}>{translate('hub_overview_compare_switch_text')}</p>
                        <Switch
                          css={{ margin: '0.25rem 0' }}
                          aria-label={translate('hub_overview_compare_switch_text')}
                          value={compare}
                          onUpdate={() => setCompare(newValue => !newValue)}
                          role="switch"
                          {...injectTestId(`top-metrics-compare-switch`)}
                        />
                        <div
                          css={{
                            margin: '-0.625rem 0 0 1rem',
                            width: selectedDateRange.value === 'custom_date_range' ? '15.5rem' : '10.333rem'
                          }}
                        >
                          <Dropdown
                            id="top-metrics-date-dropdown"
                            labelText={translate('hub_overview_date_range_dropdown_label')}
                            onUpdate={value => {
                              setSelectedDateRange({ value });
                              handleDateSelection(value);
                            }}
                            options={dateRangeOptionsForTopMetrics}
                            selected={selectedDateRange}
                            variant="outline"
                            testID="top-metrics-date-dropdown"
                          />
                        </div>
                      </div>
                    </div>
                    <DatePickerModal
                      testID="custom-range"
                      isOpen={datePickerModalIsOpen}
                      earliestDate={earliestDate}
                      onApply={(startDate, endDate) => {
                        onDateApplyHandler(
                          startDate,
                          endDate,
                          setSelectedTimeframe,
                          setDatePickerModalIsOpen,
                          setDateForAnalytics,
                          dateRangeOptionsForTopMetrics,
                          setSelectedDateRange
                        );
                      }}
                      onCancel={() => {
                        setDatePickerModalIsOpen(false);
                        setSelectedDateRange({
                          value: dateRangeOptionsForTopMetrics.find(option => option.label === selectedTimeframe).value
                        });
                      }}
                    />
                  </div>
                  <div css={{ margin: '2.25rem 0' }} {...injectTestId('hub-overview-container')}>
                    <Row>
                      <TopMetricsCard
                        isLoading={fetchingViews || fetchingOldViews}
                        testId="total-view-card"
                        title={translate('hub_overview_total_view_card_heading')}
                        body={translate('hub_overview_total_view_card_views_text', {
                          totalVideoViews: currentViewsData?.total ?? 0
                        })}
                        error={error.totalViewsError || error.prevTotalViewsError}
                        footer={viewsDifference}
                        tryAgain={() => setTryAgain(!tryAgain)}
                        helpText={translate('hub_overview_total_views_helptext')}
                        showDivider
                      />
                      <TopMetricsCard
                        isLoading={fetchingOldRegistrationCount || fetchingRegistrationCount}
                        testId="total-registrations-card"
                        title={translate('hub_overview_total_registration_card_heading')}
                        error={error.registrationCountError || error.prevRegistrationCountError}
                        tryAgain={() => setTryAgain(!tryAgain)}
                        body={translate('hub_overview_total_registration_card_member_text', {
                          memberCount: currentRegistrationCountData?.total ?? 0
                        })}
                        footer={registrationCountDifference}
                        helpText={translate('hub_overview_total_members_helptext')}
                        showDivider={!isMobileOrTablet}
                      />
                      <TopMetricsCard
                        isLoading={previousViewDurationLoading || currentViewDurationLoading}
                        testId="average-view-duration-card"
                        title={translate('hub_overview_average_time_duration_card_heading')}
                        body={translate('hub_overview_average_time_duration_card_hours_text', {
                          averageWatchDuration
                        })}
                        error={error.viewDurationError || error.prevViewDurationError}
                        footer={averageViewDurationDifference}
                        tryAgain={() => setTryAgain(!tryAgain)}
                        helpText={translate('hub_overview_average_view_duration_helptext')}
                        paddingTop={isMobileOrTablet ? 24 : 0}
                      />
                    </Row>
                  </div>
                  <HubOverViewLineChartContainer
                    isLoadingData={
                      fetchingViews ||
                      fetchingOldViews ||
                      fetchingOldRegistrationCount ||
                      fetchingRegistrationCount ||
                      previousViewDurationLoading ||
                      currentViewDurationLoading
                    }
                    currentViewsData={currentViewsArray}
                    previousViewsData={showComparisonGraph ? previousViewsArray : []}
                    currentRegistrationCountData={currentRegistrationCountArray}
                    previousRegistrationCountData={showComparisonGraph ? previousRegistrationCountArray : []}
                    previousViewDurationData={showComparisonGraph ? previousViewDurationInHoursArray : []}
                    currentViewDurationData={currentViewDurationInHoursArray}
                    error={error}
                    tryAgain={() => setTryAgain(!tryAgain)}
                  />
                </div>
              </CardContainer>
            </div>
            <div css={{ flexDirection: isMobileOrTablet ? 'column' : 'row', display: 'flex' }}>
              <NewPieChartContainer
                pieChartData={pieChartData}
                totalViews={viewsByDeviceTypeData?.totalViews || 0}
                isLoadingData={fetchingViewsByDeviceType}
                error={error.viewsDeviceError}
                dateRangeOptions={dateRangeOptionsForPieChart}
                tryAgain={() => setTryAgain(!tryAgain)}
                selectedDateRange={selectedDateRangePieChart}
                setSelectedDateRange={setSelectedDateRangePieChart}
                handleDateSelection={handleDateSelectionPieChart}
              />
              <DatePickerModal
                testID="custom-range-pie-chart"
                isOpen={datePickerModalPieChartIsOpen}
                earliestDate={earliestDate}
                onApply={(startDate, endDate) => {
                  onDateApplyHandler(
                    startDate,
                    endDate,
                    setSelectedTimeframePieChart,
                    setDatePickerModalPieChartIsOpen,
                    setDateForAnalyticsPieChart,
                    dateRangeOptionsForPieChart,
                    setSelectedDateRangePieChart
                  );
                }}
                onCancel={() => {
                  setDatePickerModalPieChartIsOpen(false);
                  setSelectedDateRangePieChart({
                    value: dateRangeOptionsForPieChart.find(option => option.label === selectedTimeframePieChart).value
                  });
                }}
              />
              <NewHubOverviewVideoCard
                hubId={hubId}
                topFiveVideosViewedData={topFiveVideosViewedData}
                isLoadingData={topFiveVideosViewedLoading}
                testId="top-video-card"
                error={error.topVideosError}
                tryAgain={() => setTryAgain(!tryAgain)}
                dateRangeOptions={dateRangeOptionsForVideoHighlights}
                handleDateSelection={handleDateSelectionVideoHighlights}
                selectedDateRange={selectedDateRangeVideoHighlights}
                setSelectedDateRange={setSelectedDateRangeVideoHighlights}
              />
              <DatePickerModal
                testID="custom-range-video-highlights"
                isOpen={datePickerModalVideoHighlights}
                earliestDate={earliestDate}
                onApply={(startDate, endDate) => {
                  onDateApplyHandler(
                    startDate,
                    endDate,
                    setSelectedTimeframeVideoHighlights,
                    setDatePickerModalVideoHighlights,
                    setDateForVideoHighlights,
                    dateRangeOptionsForVideoHighlights,
                    setSelectedDateRangeVideoHighlights
                  );
                }}
                onCancel={() => {
                  setDatePickerModalVideoHighlights(false);
                  setSelectedDateRangeVideoHighlights({
                    value: dateRangeOptionsForVideoHighlights.find(
                      option => option.label === selectedTimeframeVideoHighlights
                    ).value
                  });
                }}
              />
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default NewHubOverview;

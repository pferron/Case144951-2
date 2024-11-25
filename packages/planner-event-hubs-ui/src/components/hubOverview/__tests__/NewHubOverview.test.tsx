import { fireEvent, render, waitFor } from '@testing-library/react';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import React from 'react';
import { screen } from 'nucleus-text/testing-library/screen';
import { getTotalViewsQuery, getRegistrationCount } from '@cvent/planner-event-hubs-model/operations/analytics';
import { getDatetimesForAnalytics, getYAxisTickValues } from '@utils/analyticsUtil';
import { MockedProvider } from '@apollo/client/testing';
import {
  averageViewDurationByHubId,
  topFiveVideosViewedByHubId,
  viewsByDeviceType
} from '@cvent/planner-event-hubs-model/src/operations/analytics';
import HubOverViewLineChart from '@components/hubOverview/HubOverViewLineChart';
import {
  totalViewsDataPoints,
  totalMembersDataPoints,
  totalViewDurationDataPoints
} from '@components/hubOverview/__tests__/fixtures/hubOverviewLineCartsData';
import { ACTIVE_HUB } from '@components/constants';
import 'jest-axe/extend-expect';
import { axe } from 'jest-axe';
import NewHubOverview from '@components/hubOverview/NewHubOverview';
import userEvent from '@testing-library/user-event';

const { currentStartDate, currentEndDate, previousStartDate, previousEndDate } = getDatetimesForAnalytics(30, '');
const { currentStartDate: current7DaysStart, currentEndDate: current7DaysEnd } = getDatetimesForAnalytics(7, '');

const appFeaturesWithPiplineTrue = [
  {
    name: 'renovateHubOverviewFeature',
    enabled: true,
    experimentVersion: '1'
  },
  {
    name: 'videoAnalyticsMaterializedViewsPipeline',
    enabled: true,
    experimentVersion: '1'
  },
  {
    name: 'hubOverviewFeature',
    enabled: true,
    experimentVersion: '1'
  }
];

const appFeaturesWithPiplineFalse = [
  {
    name: 'renovateHubOverviewFeature',
    enabled: true,
    experimentVersion: '1'
  },
  {
    name: 'videoAnalyticsMaterializedViewsPipeline',
    enabled: false,
    experimentVersion: '1'
  },
  {
    name: 'hubOverviewFeature',
    enabled: true,
    experimentVersion: '1'
  }
];

const getMocks = (pipeline?: string) => [
  {
    request: {
      query: getTotalViewsQuery,
      fetchPolicy: 'network-only',
      nextFetchPolicy: 'cache-and-network',
      variables: {
        input: {
          hubId: 'test-video-hub',
          startDate: currentStartDate,
          endDate: currentEndDate,
          pipeline
        }
      }
    },
    result: {
      data: {
        totalViewsByHubId: {
          perDay: null,
          perWeek: null,
          perMonth: [
            {
              date: '2023-10-01T00:00:00.000Z',
              value: 4
            },
            {
              date: '2023-10-01T00:00:00.000Z',
              value: 3
            }
          ],
          total: 7
        }
      }
    }
  },
  {
    request: {
      query: getTotalViewsQuery,
      fetchPolicy: 'network-only',
      nextFetchPolicy: 'cache-and-network',
      variables: {
        input: {
          hubId: 'test-video-hub',
          startDate: previousStartDate,
          endDate: previousEndDate,
          pipeline
        }
      }
    },
    result: {
      data: {
        totalViewsByHubId: {
          perDay: null,
          perWeek: null,
          perMonth: [
            {
              date: '2022-10-01T00:00:00.000Z',
              value: 1
            },
            {
              date: '2022-09-01T00:00:00.000Z',
              value: 7
            }
          ],
          total: 8
        }
      }
    }
  },
  {
    request: {
      query: getRegistrationCount,
      fetchPolicy: 'network-only',
      nextFetchPolicy: 'cache-and-network',
      variables: {
        input: {
          hubId: 'test-video-hub',
          startDate: currentStartDate,
          endDate: currentEndDate
        }
      }
    },
    result: {
      data: {
        getRegistrationCount: {
          perDay: null,
          perWeek: null,
          perMonth: [
            {
              date: '2023-10-01T00:00:00.000Z',
              value: 4
            },
            {
              date: '2023-10-01T00:00:00.000Z',
              value: 3
            }
          ],
          total: 7
        }
      }
    }
  },
  {
    request: {
      query: getRegistrationCount,
      fetchPolicy: 'network-only',
      nextFetchPolicy: 'cache-and-network',
      variables: {
        input: {
          hubId: 'test-video-hub',
          startDate: previousStartDate,
          endDate: previousEndDate
        }
      }
    },
    result: {
      data: {
        getRegistrationCount: {
          perDay: null,
          perWeek: null,
          perMonth: [
            {
              date: '2023-10-01T00:00:00.000Z',
              value: 4
            },
            {
              date: '2022-09-01T00:00:00.000Z',
              value: 3
            }
          ],
          total: 7
        }
      }
    }
  },
  {
    request: {
      query: averageViewDurationByHubId,
      fetchPolicy: 'network-only',
      nextFetchPolicy: 'cache-and-network',
      variables: {
        input: {
          hubId: 'test-video-hub',
          startDate: currentEndDate,
          endDate: currentEndDate,
          pipeline
        }
      }
    },
    result: {
      data: {
        averageViewDurationByHubId: {
          perDay: null,
          perWeek: null,
          perMonth: [
            {
              date: '2022-10-01T00:00:00.000Z',
              value: 1000
            },
            {
              date: '2022-09-01T00:00:00.000Z',
              value: 700
            }
          ],
          total: 1700
        }
      }
    }
  },
  {
    request: {
      query: averageViewDurationByHubId,
      fetchPolicy: 'network-only',
      nextFetchPolicy: 'cache-and-network',
      variables: {
        input: {
          hubId: 'test-video-hub',
          startDate: previousStartDate,
          endDate: previousEndDate,
          pipeline
        }
      }
    },
    result: {
      data: {
        averageViewDurationByHubId: {
          perDay: null,
          perWeek: null,
          perMonth: [
            {
              date: '2022-10-01T00:00:00.000Z',
              value: 100
            },
            {
              date: '2022-09-01T00:00:00.000Z',
              value: 72
            }
          ],
          total: 172
        }
      }
    }
  },
  {
    request: {
      query: viewsByDeviceType,
      fetchPolicy: 'network-only',
      nextFetchPolicy: 'cache-and-network',
      variables: {
        input: {
          hubId: 'test-video-hub',
          startDate: previousStartDate,
          endDate: previousEndDate,
          pipeline
        }
      }
    },
    result: {
      data: {
        viewsByDeviceType: {
          desktopViews: 1,
          tabletViews: 2,
          mobileViews: 3,
          totalViews: 6
        }
      }
    }
  },
  {
    request: {
      query: topFiveVideosViewedByHubId,
      fetchPolicy: 'network-only',
      nextFetchPolicy: 'cache-and-network',
      variables: {
        input: {
          hubId: 'test-video-hub',
          startDate: currentStartDate,
          endDate: currentEndDate,
          pipeline
        }
      }
    },
    result: {
      data: {
        topFiveVideosViewedByHubId: {
          topVideos: [
            {
              videoId: '396dc2e8-7b34-43af-aff9-2cd5e3a0f02f',
              videoName: 'video-bogus',
              totalViews: 1,
              currentPosition: 1,
              previousPosition: 2
            },
            {
              videoId: '5ab5d17e-5b86-4085-aded-0ca586e63ac6',
              videoName: 'video123.mp4',
              totalViews: 1,
              currentPosition: 2,
              previousPosition: 3
            }
          ],
          serverError: null
        }
      }
    }
  },
  {
    request: {
      query: topFiveVideosViewedByHubId,
      fetchPolicy: 'network-only',
      nextFetchPolicy: 'cache-and-network',
      variables: {
        input: {
          hubId: 'test-video-hub',
          startDate: current7DaysStart,
          endDate: current7DaysEnd,
          pipeline
        }
      }
    },
    result: {
      data: {
        topFiveVideosViewedByHubId: {
          topVideos: [
            {
              videoId: '396dc2e8-7b34-43af-aff9-2cd5e3a0f02f',
              videoName: 'video-bogus',
              totalViews: 1,
              currentPosition: 1,
              previousPosition: 2
            },
            {
              videoId: '5ab5d17e-5b86-4085-aded-0ca586e63ac6',
              videoName: 'video123.mp4',
              totalViews: 1,
              currentPosition: 2,
              previousPosition: 3
            }
          ],
          serverError: null
        }
      }
    }
  },
  {
    request: {
      query: topFiveVideosViewedByHubId,
      fetchPolicy: 'network-only',
      nextFetchPolicy: 'cache-and-network',
      variables: {
        input: {
          hubId: 'test-video-hub-error',
          startDate: currentStartDate,
          endDate: currentEndDate,
          pipeline
        }
      }
    },
    result: {
      data: {
        topFiveVideosViewedByHubId: {
          topVideos: [],
          serverError: true
        }
      }
    }
  }
];

describe('New Hub Overview', () => {
  it('renders Hub Overview error page', async () => {
    render(
      <TestWrapper appFeatures={appFeaturesWithPiplineFalse}>
        <MockedProvider mocks={getMocks('v1')}>
          <NewHubOverview hubId="test-video-hub" hubTitle="Demo Video Hub" hubStatus="Inactive" />
        </MockedProvider>
      </TestWrapper>
    );
    await waitFor(() => {
      expect(screen.getByTextKey('hub_overview_inactive_hub_error_header')).toBeInTheDocument();
    });
    expect(screen.getByTestId('hub-overview-error-container')).toBeInTheDocument();
    // HUB-151797
    // expect(await axe(container)).toHaveNoViolations();
  });

  it('renders Hub Overview with analytics cards', async () => {
    render(
      <TestWrapper appFeatures={appFeaturesWithPiplineFalse}>
        <MockedProvider mocks={getMocks('v1')}>
          <NewHubOverview hubId="test-video-hub" hubTitle="Demo Video Hub" hubStatus={ACTIVE_HUB} />
        </MockedProvider>
      </TestWrapper>
    );
    await waitFor(() => {
      expect(screen.getByTestId('total-view-card')).toBeInTheDocument();
    });
    expect(screen.getByTestId('total-registrations-card')).toBeInTheDocument();
    expect(screen.getByTestId('average-view-duration-card')).toBeInTheDocument();
    expect(screen.getByTestId('line-charts-container')).toBeInTheDocument();
    expect(screen.getByTextKey('hub_overview_top_metrics_text')).toBeInTheDocument();
  });

  it('renders Hub Overview with analytics cards - V2 pipeline', async () => {
    render(
      <TestWrapper appFeatures={appFeaturesWithPiplineTrue}>
        <MockedProvider mocks={getMocks('v2')}>
          <NewHubOverview hubId="test-video-hub" hubTitle="Demo Video Hub" hubStatus={ACTIVE_HUB} />
        </MockedProvider>
      </TestWrapper>
    );
    await waitFor(() => {
      expect(screen.getByTestId('total-view-card')).toBeInTheDocument();
    });
    expect(screen.getByTestId('total-registrations-card')).toBeInTheDocument();
    expect(screen.getByTestId('average-view-duration-card')).toBeInTheDocument();
    expect(screen.getByTestId('line-charts-container')).toBeInTheDocument();
    expect(screen.getByTextKey('hub_overview_top_metrics_text')).toBeInTheDocument();
    // HUB-151797
    // expect(await axe(container)).toHaveNoViolations();
  });

  it('renders Top Videos Card', async () => {
    render(
      <TestWrapper appFeatures={appFeaturesWithPiplineFalse}>
        <MockedProvider mocks={getMocks('v1')}>
          <NewHubOverview hubId="test-video-hub" hubTitle="Demo Video Hub" hubStatus={ACTIVE_HUB} />
        </MockedProvider>
      </TestWrapper>
    );
    expect(screen.getByTestId('loading-overview-top-five-video-spinner')).toBeInTheDocument();
    expect(await screen.findByTextKey('hub_overview_top_videos_title')).toBeInTheDocument();
  });

  it('renders Top Videos Card - V2 pipeline', async () => {
    render(
      <TestWrapper appFeatures={appFeaturesWithPiplineTrue}>
        <MockedProvider mocks={getMocks('v2')}>
          <NewHubOverview hubId="test-video-hub" hubTitle="Demo Video Hub" hubStatus={ACTIVE_HUB} />
        </MockedProvider>
      </TestWrapper>
    );
    expect(screen.getByTestId('loading-overview-top-five-video-spinner')).toBeInTheDocument();
    expect(await screen.findByTextKey('hub_overview_top_videos_title')).toBeInTheDocument();
  });

  it('renders top metrics date range dropdown', async () => {
    render(
      <TestWrapper appFeatures={appFeaturesWithPiplineFalse}>
        <MockedProvider mocks={getMocks('v1')}>
          <NewHubOverview hubId="test-video-hub" hubTitle="Demo Video Hub" hubStatus={ACTIVE_HUB} />
        </MockedProvider>
      </TestWrapper>
    );
    expect(screen.getByTextKey('hub_overview_top_metrics_text')).toBeInTheDocument();
    expect(screen.getByTextKey('hub_overview_compare_switch_text')).toBeInTheDocument();
    const dropDownButton = screen.getByTestId('top-metrics-date-dropdown');
    expect(dropDownButton).toBeInTheDocument();
    expect(dropDownButton).toBeEnabled();
    expect(dropDownButton).toHaveTextContent('Last 30 days');
    fireEvent.click(dropDownButton);
    await waitFor(() => {
      expect(screen.getByTestId('top-metrics-date-dropdown-magazine')).toBeInTheDocument();
    });
    expect(screen.getByTextKey('hub_overview_date_picker_last_7_days')).toBeInTheDocument();
    expect(screen.getByTextKey('hub_overview_date_picker_last_12_months')).toBeInTheDocument();
    expect(screen.getByTextKey('hub_overview_date_picker_last_3_months')).toBeInTheDocument();
    expect(screen.getByTextKey('hub_overview_date_picker_last_6_months')).toBeInTheDocument();
    expect(screen.getByTextKey('hub_overview_date_picker_custom_date_range')).toBeInTheDocument();
    const optionSixMonths = screen.getByTestId('top-metrics-date-dropdown-option-3');
    fireEvent.click(optionSixMonths);
    await waitFor(() => {
      expect(dropDownButton).toHaveTextContent('Last 6 months');
    });
    fireEvent.click(dropDownButton);
    await waitFor(() => {
      expect(screen.getByTestId('top-metrics-date-dropdown-magazine')).toBeInTheDocument();
    });
    const yearOption = screen.getByTestId('top-metrics-date-dropdown-option-4');
    fireEvent.click(yearOption);
    await waitFor(() => {
      expect(dropDownButton).toHaveTextContent('Last 12 months');
    });
    // HUB-151797
    // expect(await axe(container)).toHaveNoViolations();
  });

  it('renders top metrics date range picker', async () => {
    render(
      <TestWrapper appFeatures={appFeaturesWithPiplineFalse}>
        <MockedProvider mocks={getMocks('v1')}>
          <NewHubOverview hubId="test-video-hub" hubTitle="Demo Video Hub" hubStatus={ACTIVE_HUB} />
        </MockedProvider>
      </TestWrapper>
    );
    expect(screen.getByTextKey('hub_overview_top_metrics_text')).toBeInTheDocument();
    const dropDownButton = screen.getByTestId('top-metrics-date-dropdown');
    expect(dropDownButton).toBeInTheDocument();
    expect(dropDownButton).toBeEnabled();
    fireEvent.click(dropDownButton);
    await waitFor(() => {
      expect(screen.getByTestId('top-metrics-date-dropdown-magazine')).toBeInTheDocument();
    });
    const customDateRangeButton = screen.getByTextKey('hub_overview_date_picker_custom_date_range');
    await fireEvent.click(customDateRangeButton);
    await waitFor(() => {
      expect(screen.getByTestId('date-picker-modal')).toBeInTheDocument();
    });
    expect(screen.getByTestId('custom-range-date-picker-modal-header')).toBeInTheDocument();
    expect(screen.getByTestId('custom-range-date-picker-container')).toBeInTheDocument();
    const customDateRangeCloseButton = screen.getByTestId('custom-range-date-picker-modal-close-button');
    expect(customDateRangeCloseButton).toBeInTheDocument();
    expect(screen.getByTextKey('hub_overview_date_picker_cancel_button')).toBeInTheDocument();
    expect(screen.getByTextKey('hub_overview_date_picker_apply_button')).toBeInTheDocument();
    fireEvent.click(customDateRangeCloseButton);
    fireEvent.click(dropDownButton);
    await waitFor(() => {
      expect(screen.getByTestId('top-metrics-date-dropdown-magazine')).toBeInTheDocument();
    });
    const optionDays = screen.getByTestId('top-metrics-date-dropdown-option-1');
    fireEvent.click(optionDays);
  });

  it('renders views by device type pie chart', async () => {
    render(
      <TestWrapper appFeatures={appFeaturesWithPiplineFalse}>
        <MockedProvider mocks={getMocks('v1')}>
          <NewHubOverview hubId="test-video-hub" hubTitle="Demo Video Hub" hubStatus={ACTIVE_HUB} />
        </MockedProvider>
      </TestWrapper>
    );
    expect(screen.getByTestId('loading-overview-pie-chart-spinner')).toBeInTheDocument();
    const dropDownButton = screen.getByTestId('pie-chart-date-range-dropdown');
    expect(dropDownButton).toBeInTheDocument();
    expect(dropDownButton).toBeEnabled();
    expect(dropDownButton).toHaveTextContent('Last 30 days');
  });

  it('renders views by device type pie chart - V2 pipeline', async () => {
    render(
      <TestWrapper appFeatures={appFeaturesWithPiplineTrue}>
        <MockedProvider mocks={getMocks('v2')}>
          <NewHubOverview hubId="test-video-hub" hubTitle="Demo Video Hub" hubStatus={ACTIVE_HUB} />
        </MockedProvider>
      </TestWrapper>
    );
    expect(screen.getByTestId('loading-overview-pie-chart-spinner')).toBeInTheDocument();
    const dropDownButton = screen.getByTestId('pie-chart-date-range-dropdown');
    expect(dropDownButton).toBeInTheDocument();
    expect(dropDownButton).toBeEnabled();
    expect(dropDownButton).toHaveTextContent('Last 30 days');
    // HUB-151797
    // expect(await axe(container)).toHaveNoViolations();
  });

  it('renders pie chart date range dropdown', async () => {
    render(
      <TestWrapper appFeatures={appFeaturesWithPiplineFalse}>
        <MockedProvider mocks={getMocks('v1')}>
          <NewHubOverview hubId="test-video-hub" hubTitle="Demo Video Hub" hubStatus={ACTIVE_HUB} />
        </MockedProvider>
      </TestWrapper>
    );
    expect(screen.getByTextKey('hub_overview_pie_chart_card_heading')).toBeInTheDocument();
    const dropDownButton = screen.getByTestId('pie-chart-date-range-dropdown');
    expect(dropDownButton).toBeInTheDocument();
    expect(dropDownButton).toBeEnabled();
    expect(dropDownButton).toHaveTextContent('Last 30 days');
    fireEvent.click(dropDownButton);
    await waitFor(() => {
      expect(screen.getByTestId('pie-chart-date-range-dropdown-magazine')).toBeInTheDocument();
    });
    expect(screen.getByTextKey('hub_overview_date_picker_last_7_days')).toBeInTheDocument();
    expect(screen.getByTextKey('hub_overview_date_picker_last_12_months')).toBeInTheDocument();
    expect(screen.getByTextKey('hub_overview_date_picker_last_3_months')).toBeInTheDocument();
    expect(screen.getByTextKey('hub_overview_date_picker_last_6_months')).toBeInTheDocument();
    expect(screen.getByTextKey('hub_overview_date_picker_custom_date_range')).toBeInTheDocument();
    const optionSixMonths = screen.getByTestId('pie-chart-date-range-dropdown-option-4');
    fireEvent.click(optionSixMonths);
    // HUB-151797
    // expect(await axe(container)).toHaveNoViolations();
  });

  // eslint-disable-next-line jest/no-disabled-tests
  it.skip('renders pie chart date range picker', async () => {
    render(
      <TestWrapper appFeatures={appFeaturesWithPiplineFalse}>
        <MockedProvider mocks={getMocks('v1')}>
          <NewHubOverview hubId="test-video-hub" hubTitle="Demo Video Hub" hubStatus={ACTIVE_HUB} />
        </MockedProvider>
      </TestWrapper>
    );
    expect(screen.getByTextKey('hub_overview_pie_chart_card_heading')).toBeInTheDocument();
    const dropDownButton = screen.getByTestId('pie-chart-date-range-dropdown');
    expect(dropDownButton).toBeInTheDocument();
    expect(dropDownButton).toBeEnabled();
    expect(dropDownButton).toHaveTextContent('Last 30 days');
    fireEvent.click(dropDownButton);
    await waitFor(() => {
      expect(screen.getByTestId('pie-chart-date-range-dropdown-magazine')).toBeInTheDocument();
    });
    expect(screen.getByTextKey('hub_overview_date_picker_last_7_days')).toBeInTheDocument();
    expect(screen.getByTextKey('hub_overview_date_picker_last_12_months')).toBeInTheDocument();
    expect(screen.getByTextKey('hub_overview_date_picker_last_3_months')).toBeInTheDocument();
    expect(screen.getByTextKey('hub_overview_date_picker_last_6_months')).toBeInTheDocument();
    expect(screen.getByTextKey('hub_overview_date_picker_custom_date_range')).toBeInTheDocument();
    const customDateRangeButton = screen.getByTextKey('hub_overview_date_picker_custom_date_range');
    await fireEvent.click(customDateRangeButton);
    await waitFor(() => {
      expect(screen.getByTestId('custom-range-pie-chart')).toBeInTheDocument();
    });
    expect(screen.getByTestId('custom-range-pie-chart-date-picker-modal-header')).toBeInTheDocument();
    expect(screen.getByTestId('custom-range-pie-chart-date-picker-container')).toBeInTheDocument();
    const customDateRangeCancelButton = screen.getByTestId('custom-range-pie-chart-date-picker-modal-cancel-button');
    expect(customDateRangeCancelButton).toBeInTheDocument();
    expect(screen.getByTestId('custom-range-pie-chart-date-picker-modal-close-button')).toBeInTheDocument();
    expect(screen.getByTextKey('hub_overview_date_picker_apply_button')).toBeInTheDocument();
    fireEvent.click(customDateRangeCancelButton);
    fireEvent.click(dropDownButton);
    await waitFor(() => {
      expect(screen.getByTestId('pie-chart-date-range-dropdown-magazine')).toBeInTheDocument();
    });
    const optionDays = screen.getByTestId('pie-chart-date-range-dropdown-option-1');
    fireEvent.click(optionDays);
  });

  it('renders hub-overview line chart for total views', async () => {
    const { container } = render(
      <TestWrapper appFeatures={appFeaturesWithPiplineFalse}>
        <MockedProvider mocks={getMocks('v1')}>
          <HubOverViewLineChart
            data={totalViewsDataPoints.ViewsDataPointsPerMonth}
            category="total-view"
            yAxisLabel="Views"
          />
        </MockedProvider>
      </TestWrapper>
    );
    expect(screen.getByTestId('hub-overview-total-view-graph')).toBeInTheDocument();
    expect(getYAxisTickValues(totalViewsDataPoints.ViewsDataPointsPerMonth)).toEqual([0, 10, 20, 30]);
    expect(getYAxisTickValues(totalViewsDataPoints.ViewsDataPointsPerWeek)).toEqual([1, 2, 3, 4, 5]);
    expect(getYAxisTickValues(totalViewsDataPoints.ViewsDataPointsPerDay)).toEqual([1, 2, 3, 4, 5]);
    expect(getYAxisTickValues(totalViewsDataPoints.CustomDateRangeViewsDataPoints)).toEqual([0, 5, 10]);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders hub-overview line chart for total views - V2 pipeline', async () => {
    render(
      <TestWrapper appFeatures={appFeaturesWithPiplineTrue}>
        <MockedProvider mocks={getMocks('v2')}>
          <HubOverViewLineChart
            data={totalViewsDataPoints.ViewsDataPointsPerMonth}
            category="total-view"
            yAxisLabel="Views"
          />
        </MockedProvider>
      </TestWrapper>
    );
    expect(screen.getByTestId('hub-overview-total-view-graph')).toBeInTheDocument();
  });

  it('renders hub-overview line chart for total members', async () => {
    const { container } = render(
      <TestWrapper appFeatures={appFeaturesWithPiplineFalse}>
        <MockedProvider mocks={getMocks('v1')}>
          <HubOverViewLineChart
            data={totalMembersDataPoints.MembersDataPointsPerMonth}
            category="total-registration"
            yAxisLabel="Members"
          />
        </MockedProvider>
      </TestWrapper>
    );
    expect(screen.getByTestId('hub-overview-total-registration-graph')).toBeInTheDocument();
    expect(getYAxisTickValues(totalMembersDataPoints.MembersDataPointsPerMonth)).toEqual([0, 10, 20, 30, 40]);
    expect(getYAxisTickValues(totalMembersDataPoints.MembersDataPointsPerWeek)).toEqual([0, 5, 10]);
    expect(getYAxisTickValues(totalMembersDataPoints.MembersDataPointsPerDay)).toEqual([1, 2, 3, 4, 5]);
    expect(getYAxisTickValues(totalMembersDataPoints.CustomDateRangeMembersDataPoints)).toEqual([1, 2, 3, 4, 5]);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders hub-overview line chart for total members - V2 pipeline', async () => {
    render(
      <TestWrapper appFeatures={appFeaturesWithPiplineTrue}>
        <MockedProvider mocks={getMocks('v2')}>
          <HubOverViewLineChart
            data={totalMembersDataPoints.MembersDataPointsPerMonth}
            category="total-registration"
            yAxisLabel="Members"
          />
        </MockedProvider>
      </TestWrapper>
    );
    expect(screen.getByTestId('hub-overview-total-registration-graph')).toBeInTheDocument();
  });

  it('renders hub-overview line chart for total view duration', async () => {
    const { container } = render(
      <TestWrapper appFeatures={appFeaturesWithPiplineFalse}>
        <MockedProvider mocks={getMocks('v1')}>
          <HubOverViewLineChart
            data={totalViewDurationDataPoints.ViewDurationDataPointsPerMonth}
            category="average-duration"
            yAxisLabel="Watch duration"
          />
        </MockedProvider>
      </TestWrapper>
    );
    expect(screen.getByTestId('hub-overview-average-duration-graph')).toBeInTheDocument();
    expect(getYAxisTickValues(totalViewDurationDataPoints.ViewDurationDataPointsPerMonth)).toEqual([0, 5, 10]);
    expect(getYAxisTickValues(totalViewDurationDataPoints.ViewDurationDataPointsPerWeek)).toEqual([1, 2, 3, 4, 5]);
    expect(getYAxisTickValues(totalViewDurationDataPoints.ViewDurationDataPointsPerDay)).toEqual([1, 2, 3, 4, 5]);
    expect(getYAxisTickValues(totalViewDurationDataPoints.CustomDateRangeViewDurationDataPoints)).toEqual([
      0, 5, 10, 15, 20
    ]);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders hub-overview line chart for total view duration - V2 pipeline', async () => {
    render(
      <TestWrapper appFeatures={appFeaturesWithPiplineTrue}>
        <MockedProvider mocks={getMocks('v2')}>
          <HubOverViewLineChart
            data={totalViewDurationDataPoints.ViewDurationDataPointsPerMonth}
            category="average-duration"
            yAxisLabel="Watch duration"
          />
        </MockedProvider>
      </TestWrapper>
    );
    expect(screen.getByTestId('hub-overview-average-duration-graph')).toBeInTheDocument();
  });

  it('handles custom date range selection in video card', async () => {
    render(
      <TestWrapper appFeatures={appFeaturesWithPiplineFalse}>
        <MockedProvider mocks={getMocks('v1')}>
          <NewHubOverview hubId="test-video-hub" hubTitle="Demo Video Hub" hubStatus={ACTIVE_HUB} />
        </MockedProvider>
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId('top-videos-date-range-dropdown')).toBeInTheDocument();
    });

    const dropDownButton = screen.getByTestId('top-videos-date-range-dropdown');
    fireEvent.click(dropDownButton);

    const option = screen.getByTestId('top-videos-date-range-dropdown-option-5');
    fireEvent.click(option);
    const customDateRangeButton = screen.getByText('Custom date range');
    await userEvent.click(customDateRangeButton);
    await waitFor(() => {
      expect(screen.getByTestId('custom-range-video-highlights')).toBeInTheDocument();
    });
  });

  it('handles error state for video card in NewHubOverviewVideoCard', async () => {
    render(
      <TestWrapper appFeatures={appFeaturesWithPiplineTrue}>
        <MockedProvider mocks={getMocks('v2')}>
          <NewHubOverview hubId="test-video-hub-error" hubTitle="Demo Video Hub" hubStatus={ACTIVE_HUB} />
        </MockedProvider>
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTextKey('hub_overview_card_error_text')).toBeInTheDocument();
    });
    const tryAgainBtn = await screen.findByRole('button', { key: 'hub_overview_card_try_again_button' });
    expect(tryAgainBtn).toBeInTheDocument();

    await userEvent.click(tryAgainBtn);
  });

  it('handles date range selection for video highlights', async () => {
    render(
      <TestWrapper appFeatures={appFeaturesWithPiplineFalse}>
        <MockedProvider mocks={getMocks('v1')}>
          <NewHubOverview hubId="test-video-hub" hubTitle="Demo Video Hub" hubStatus={ACTIVE_HUB} />
        </MockedProvider>
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId('top-videos-date-range-dropdown')).toBeInTheDocument();
    });
    const dropDownButton = screen.getByTestId('top-videos-date-range-dropdown');
    fireEvent.click(dropDownButton);

    const option = screen.getByTestId('top-videos-date-range-dropdown-option-1');
    fireEvent.click(option);
    await waitFor(() => {
      const dropDownButton1 = screen.getByTestId('top-videos-date-range-dropdown');
      expect(dropDownButton1).toHaveTextContent('Last 7 days');
    });
  });
});

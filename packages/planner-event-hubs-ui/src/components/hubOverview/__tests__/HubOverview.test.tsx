import { fireEvent, render, waitFor } from '@testing-library/react';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import React from 'react';
import HubOverview from '@components/hubOverview/HubOverview';
import { screen } from 'nucleus-text/testing-library/screen';
import { getTotalViewsQuery, getRegistrationCount } from '@cvent/planner-event-hubs-model/operations/analytics';
import { getDatetimesForAnalytics, getYAxisTickValues } from '@utils/analyticsUtil';
import { MockedProvider } from '@apollo/client/testing';
import {
  averageViewDurationByHubId,
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

const { currentStartDate, currentEndDate, previousStartDate, previousEndDate } = getDatetimesForAnalytics(180, '');

const appFeatures = [
  {
    name: 'videoAnalyticsMaterializedViewsPipeline',
    enabled: true,
    experimentVersion: '1'
  }
];

const getMocks = (pipeline?: string) => [
  {
    request: {
      query: getTotalViewsQuery,
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
          ]
        }
      }
    }
  },
  {
    request: {
      query: getTotalViewsQuery,
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
  }
];

describe('Hub Overview', () => {
  it('renders Hub Overview error page', async () => {
    const { container } = render(
      <TestWrapper>
        <MockedProvider mocks={getMocks('v1')}>
          <HubOverview hubId="test-video-hub" hubTitle="Demo Video Hub" hubStatus="Inactive" />
        </MockedProvider>
      </TestWrapper>
    );
    await waitFor(() => {
      expect(screen.getByTextKey('hub_overview_inactive_hub_error_header')).toBeInTheDocument();
    });
    expect(screen.getByTestId('hub-overview-error-container')).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders Hub Overview with analytics cards', async () => {
    const { container } = render(
      <TestWrapper>
        <MockedProvider mocks={getMocks('v1')}>
          <HubOverview hubId="test-video-hub" hubTitle="Demo Video Hub" hubStatus={ACTIVE_HUB} />
        </MockedProvider>
      </TestWrapper>
    );
    await waitFor(() => {
      expect(screen.getByTestId('total-view-card')).toBeInTheDocument();
    });
    expect(screen.getByTestId('total-registrations-card')).toBeInTheDocument();
    expect(screen.getByTestId('average-view-duration-card')).toBeInTheDocument();
    expect(screen.getByTestId('line-charts-container')).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders Hub Overview with analytics cards - V2 pipeline', async () => {
    const { container } = render(
      <TestWrapper>
        <MockedProvider mocks={getMocks('v2')}>
          <HubOverview hubId="test-video-hub" hubTitle="Demo Video Hub" hubStatus={ACTIVE_HUB} />
        </MockedProvider>
      </TestWrapper>
    );
    await waitFor(() => {
      expect(screen.getByTestId('total-view-card')).toBeInTheDocument();
    });
    expect(screen.getByTestId('total-registrations-card')).toBeInTheDocument();
    expect(screen.getByTestId('average-view-duration-card')).toBeInTheDocument();
    expect(screen.getByTestId('line-charts-container')).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders Top Videos Card', async () => {
    render(
      <TestWrapper>
        <MockedProvider mocks={getMocks('v1')}>
          <HubOverview hubId="test-video-hub" hubTitle="Demo Video Hub" hubStatus={ACTIVE_HUB} />
        </MockedProvider>
      </TestWrapper>
    );
    expect(screen.getByTestId('loading-overview-top-five-video-spinner')).toBeInTheDocument();
  });

  it('renders Top Videos Card - V2 pipeline', async () => {
    const { container } = render(
      <TestWrapper appFeatures={appFeatures}>
        <MockedProvider mocks={getMocks('v2')}>
          <HubOverview hubId="test-video-hub" hubTitle="Demo Video Hub" hubStatus={ACTIVE_HUB} />
        </MockedProvider>
      </TestWrapper>
    );
    expect(screen.getByTestId('loading-overview-top-five-video-spinner')).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders date picker dropdown', async () => {
    const { container } = render(
      <TestWrapper>
        <MockedProvider mocks={getMocks('v1')}>
          <HubOverview hubId="test-video-hub" hubTitle="Demo Video Hub" hubStatus={ACTIVE_HUB} />
        </MockedProvider>
      </TestWrapper>
    );
    expect(screen.getByTestId('time-filter-dropdown-menu')).toBeInTheDocument();
    const dropDownButton = screen.getByTestId('time-filter-menu-trigger');
    expect(dropDownButton).toBeInTheDocument();
    expect(dropDownButton).toBeEnabled();
    expect(dropDownButton).toHaveTextContent('Last 30 days');
    fireEvent.click(dropDownButton);
    await waitFor(() => {
      expect(screen.getByTestId('time-filter-dropdown-menu-magazine')).toBeInTheDocument();
    });
    expect(screen.getByTestId('time-filter-dropdown-menu-option-0')).toBeInTheDocument();
    expect(screen.getByTextKey('hub_overview_date_picker_last_7_days')).toBeInTheDocument();
    expect(screen.getByTextKey('hub_overview_date_picker_last_12_months')).toBeInTheDocument();
    expect(screen.getByTextKey('hub_overview_date_picker_last_3_months')).toBeInTheDocument();
    expect(screen.getByTextKey('hub_overview_date_picker_last_6_months')).toBeInTheDocument();
    expect(screen.getByTextKey('hub_overview_date_picker_custom_date_range')).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders date range picker', async () => {
    render(
      <TestWrapper>
        <MockedProvider mocks={getMocks('v1')}>
          <HubOverview hubId="test-video-hub" hubTitle="Demo Video Hub" hubStatus={ACTIVE_HUB} />
        </MockedProvider>
      </TestWrapper>
    );
    expect(screen.getByTestId('time-filter-dropdown-menu')).toBeInTheDocument();
    const dropDownButton = screen.getByTestId('time-filter-menu-trigger');
    expect(dropDownButton).toBeInTheDocument();
    fireEvent.click(dropDownButton);
    await waitFor(() => {
      expect(screen.getByTestId('time-filter-dropdown-menu-magazine')).toBeInTheDocument();
    });
    const customDateRangeButton = screen.getByTextKey('hub_overview_date_picker_custom_date_range');
    fireEvent.click(customDateRangeButton);
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
    // HUB-151797
    // expect(await axe(container)).toHaveNoViolations();
  });

  it('renders views by device type pie chart', async () => {
    const { container } = render(
      <TestWrapper>
        <MockedProvider mocks={getMocks('v1')}>
          <HubOverview hubId="test-video-hub" hubTitle="Demo Video Hub" hubStatus={ACTIVE_HUB} />
        </MockedProvider>
      </TestWrapper>
    );
    expect(screen.getByTestId('loading-overview-pie-chart-spinner')).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders views by device type pie chart - V2 pipeline', async () => {
    const { container } = render(
      <TestWrapper>
        <MockedProvider mocks={getMocks('v2')}>
          <HubOverview hubId="test-video-hub" hubTitle="Demo Video Hub" hubStatus={ACTIVE_HUB} />
        </MockedProvider>
      </TestWrapper>
    );
    expect(screen.getByTestId('loading-overview-pie-chart-spinner')).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders hub-overview line chart for total views', async () => {
    const { container } = render(
      <TestWrapper>
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
    const { container } = render(
      <TestWrapper appFeatures={appFeatures}>
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
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders hub-overview line chart for total members', async () => {
    const { container } = render(
      <TestWrapper>
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
    const { container } = render(
      <TestWrapper>
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
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders hub-overview line chart for total view duration', async () => {
    const { container } = render(
      <TestWrapper>
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
    const { container } = render(
      <TestWrapper>
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
    expect(await axe(container)).toHaveNoViolations();
  });
});

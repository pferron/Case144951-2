import { fireEvent, render, waitFor } from '@testing-library/react';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import React from 'react';
import { screen } from 'nucleus-text/testing-library/screen';
import 'jest-axe/extend-expect';
import { axe } from 'jest-axe';
import NewPieChartContainer from '@components/hubOverview/NewPieChartContainer';
import { DESKTOP_DEVICE_TYPE, DEVICE_TYPE, MOBILE_DEVICE_TYPE, TABLET_DEVICE_TYPE } from '@utils/constants';

const testData = [
  {
    value: 20,
    group: DEVICE_TYPE,
    category: DESKTOP_DEVICE_TYPE
  },
  {
    value: 0,
    group: DEVICE_TYPE,
    category: TABLET_DEVICE_TYPE
  },
  {
    value: 0,
    group: DEVICE_TYPE,
    category: MOBILE_DEVICE_TYPE
  }
];

const testZeroData = [
  {
    value: 0,
    group: DEVICE_TYPE,
    category: DESKTOP_DEVICE_TYPE
  },
  {
    value: 0,
    group: DEVICE_TYPE,
    category: TABLET_DEVICE_TYPE
  },
  {
    value: 0,
    group: DEVICE_TYPE,
    category: MOBILE_DEVICE_TYPE
  }
];

const setSelectedDateRange = jest.fn();
const handleDateSelection = jest.fn();
const tryAgain = jest.fn();
const selectedDateRange = { value: 'last_30_days' };
const dateRangeOptions = [
  {
    label: '12 months',
    value: 'last_12_months'
  },
  {
    label: '7 days',
    value: 'last_7_days'
  },
  {
    label: 'Last 30 days',
    value: 'last_30_days'
  }
];

jest.mock('@cvent/carina-charts-pie', () => {
  return {
    __esModule: true,
    default: () => <div>Pie Chart Mock</div>
  };
});
describe('Hub OverView Pie Chart Container', () => {
  it('renders hub overview Pie chart card', async () => {
    const { container } = render(
      <TestWrapper>
        <NewPieChartContainer
          isLoadingData={false}
          pieChartData={testData}
          totalViews={20}
          dateRangeOptions={dateRangeOptions}
          selectedDateRange={selectedDateRange}
          setSelectedDateRange={setSelectedDateRange}
          handleDateSelection={handleDateSelection}
          error={false}
        />
      </TestWrapper>
    );
    await waitFor(() => {
      expect(screen.getByTestId('pie-chart-container')).toBeInTheDocument();
    });
    expect(screen.getByTextKey('hub_overview_pie_chart_card_heading')).toBeInTheDocument();
    const dropDownButton = screen.getByTestId('pie-chart-date-range-dropdown');
    expect(dropDownButton).toBeInTheDocument();
    expect(dropDownButton).toBeEnabled();
    expect(dropDownButton).toHaveTextContent('Last 30 days');
    fireEvent.click(dropDownButton);
    await waitFor(() => {
      expect(screen.getByTestId('pie-chart-date-range-dropdown')).toBeInTheDocument();
    });
    expect(screen.getByText('7 days')).toBeInTheDocument();
    expect(screen.getByText('12 months')).toBeInTheDocument();
    const option = screen.getByTestId('pie-chart-date-range-dropdown-option-0');
    fireEvent.click(option);
    await waitFor(() => {
      expect(handleDateSelection).toHaveBeenCalledWith('last_12_months');
    });
    expect(setSelectedDateRange).toHaveBeenCalledTimes(1);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders loading icon when correct prop is passed', async () => {
    render(
      <TestWrapper>
        <NewPieChartContainer
          isLoadingData
          pieChartData={testData}
          totalViews={20}
          dateRangeOptions={dateRangeOptions}
          selectedDateRange={selectedDateRange}
          setSelectedDateRange={setSelectedDateRange}
          handleDateSelection={handleDateSelection}
          error={false}
        />
      </TestWrapper>
    );
    expect(screen.getByTestId('loading-overview-pie-chart-spinner')).toBeInTheDocument();
    const dropDownButton = screen.getByTestId('pie-chart-date-range-dropdown');
    expect(dropDownButton).toBeInTheDocument();
    expect(dropDownButton).toBeEnabled();
    expect(dropDownButton).toHaveTextContent('Last 30 days');
  });

  it('renders pie chart with error', async () => {
    const { container } = render(
      <TestWrapper>
        <NewPieChartContainer
          isLoadingData={false}
          pieChartData={testZeroData}
          totalViews={20}
          error
          dateRangeOptions={dateRangeOptions}
          selectedDateRange={selectedDateRange}
          setSelectedDateRange={setSelectedDateRange}
          handleDateSelection={handleDateSelection}
          tryAgain={tryAgain}
        />
      </TestWrapper>
    );
    expect(screen.getByTextKey('hub_overview_card_error_text')).toBeInTheDocument();
    const tryAgainBtn = await screen.findByRole('button', { key: 'hub_overview_card_try_again_button' });
    expect(tryAgainBtn).toBeInTheDocument();
    fireEvent.click(tryAgainBtn);
    expect(tryAgain).toHaveBeenCalled();

    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders loading icon inside the container', async () => {
    render(
      <TestWrapper>
        <NewPieChartContainer
          isLoadingData
          pieChartData={testData}
          totalViews={20}
          dateRangeOptions={dateRangeOptions}
          selectedDateRange={selectedDateRange}
          setSelectedDateRange={setSelectedDateRange}
          handleDateSelection={handleDateSelection}
          error={false}
        />
      </TestWrapper>
    );
    await waitFor(() => {
      expect(screen.getByTestId('pie-chart-container')).toBeInTheDocument();
    });
    expect(screen.getByTestId('loading-overview-pie-chart-spinner')).toBeInTheDocument();
    expect(screen.getByTextKey('hub_overview_pie_chart_card_heading')).toBeInTheDocument();
  });

  it('renders mock pie chart', async () => {
    const { container } = render(
      <TestWrapper>
        <NewPieChartContainer
          isLoadingData={false}
          pieChartData={testData}
          totalViews={20}
          dateRangeOptions={dateRangeOptions}
          selectedDateRange={selectedDateRange}
          setSelectedDateRange={setSelectedDateRange}
          handleDateSelection={handleDateSelection}
          error={false}
          tryAgain={tryAgain}
        />
      </TestWrapper>
    );
    expect(screen.queryByTestId('loading-overview-pie-chart-spinner')).not.toBeInTheDocument();
    expect(screen.getByTextKey('hub_overview_pie_chart_card_heading')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText('Pie Chart Mock')).toBeInTheDocument();
    });
    expect(await axe(container)).toHaveNoViolations();
  });
});

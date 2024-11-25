import { render, waitFor } from '@testing-library/react';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import React from 'react';
import { screen } from 'nucleus-text/testing-library/screen';
import HubOverViewPieChartContainer from '@components/hubOverview/HubOverViewPieChartContainer';
import { ViewsBySourceResponse } from '@cvent/planner-event-hubs-model/types';
import 'jest-axe/extend-expect';
import { axe } from 'jest-axe';

const testData: ViewsBySourceResponse = {
  desktopViews: 1,
  mobileViews: 2,
  tabletViews: 3,
  totalViews: 6
};
describe('Hub OverView Pie Chart Container', () => {
  it('renders hub overview Pie chart card', async () => {
    const { container } = render(
      <TestWrapper>
        <HubOverViewPieChartContainer isLoadingData={false} viewsByDeviceTypeData={testData} />
      </TestWrapper>
    );
    await waitFor(() => {
      expect(screen.getByTestId('pie-chart-container')).toBeInTheDocument();
    });
    expect(screen.getByTextKey('hub_overview_pie_chart_heading')).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders loading icon when correct prop is passed', async () => {
    const { container } = render(
      <TestWrapper>
        <HubOverViewPieChartContainer isLoadingData viewsByDeviceTypeData={testData} />
      </TestWrapper>
    );
    expect(screen.getByTestId('loading-overview-pie-chart-spinner')).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders pie chart with 0 views when views are not present in response', async () => {
    const { container } = render(
      <TestWrapper>
        <HubOverViewPieChartContainer isLoadingData={false} viewsByDeviceTypeData={null} />
      </TestWrapper>
    );

    expect(screen.queryByTestId('loading-overview-pie-chart-spinner')).not.toBeInTheDocument();
    expect(screen.getByTextKey('hub_overview_pie_chart_heading')).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });
  it('renders pie chart with error', async () => {
    const { container } = render(
      <TestWrapper>
        <HubOverViewPieChartContainer isLoadingData={false} viewsByDeviceTypeData={null} error />
      </TestWrapper>
    );
    expect(screen.getByTextKey('hub_overview_card_error_text')).toBeInTheDocument();
    const tryAgainBtn = await screen.findByRole('button', { key: 'hub_overview_card_try_again_button' });
    expect(tryAgainBtn).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });
  it('renders loading icon inside the container', async () => {
    const { container } = render(
      <TestWrapper>
        <HubOverViewPieChartContainer isLoadingData viewsByDeviceTypeData={testData} />
      </TestWrapper>
    );
    await waitFor(() => {
      expect(screen.getByTestId('pie-chart-container')).toBeInTheDocument();
    });
    expect(screen.getByTestId('loading-overview-pie-chart-spinner')).toBeInTheDocument();
    expect(screen.getByTextKey('hub_overview_pie_chart_heading')).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });
});

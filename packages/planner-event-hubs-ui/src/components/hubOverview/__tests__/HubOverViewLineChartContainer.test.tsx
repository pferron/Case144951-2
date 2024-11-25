import { fireEvent, render, waitFor } from '@testing-library/react';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import React from 'react';
import { screen } from 'nucleus-text/testing-library/screen';
import HubOverViewLineChartContainer from '@components/hubOverview/HubOverViewLineChartContainer';
import { currentViewsData, previousViewsData } from '@components/hubOverview/__tests__/fixtures/totalViewsData';
import {
  currentViewDurationData,
  previousViewDurationData
} from '@components/hubOverview/__tests__/fixtures/averageViewDuration';
import {
  currentTotalRegistrationData,
  previousTotalRegistrationData
} from '@components/hubOverview/__tests__/fixtures/totalRegistrationCountData';
import 'jest-axe/extend-expect';
import { axe } from 'jest-axe';

describe('Hub OverView Line Chart Container', () => {
  it('renders hub overview line charts card', async () => {
    const { container } = render(
      <TestWrapper>
        <HubOverViewLineChartContainer
          currentViewsData={currentViewsData}
          previousViewsData={previousViewsData}
          previousViewDurationData={previousViewDurationData}
          currentViewDurationData={currentViewDurationData}
          error={{
            prevTotalViewsError: false,
            totalViewsError: false,
            registrationCountError: false,
            prevRegistrationCountError: false,
            viewDurationError: false,
            prevViewDurationError: false,
            viewsDeviceError: false,
            topVideosError: false
          }}
          currentRegistrationCountData={currentTotalRegistrationData}
          previousRegistrationCountData={previousTotalRegistrationData}
        />
      </TestWrapper>
    );
    await waitFor(() => {
      expect(screen.getByTestId('line-charts-container')).toBeInTheDocument();
    });
    expect(screen.getByTextKey('hub_overview_total_view_graph_tab')).toBeInTheDocument();
    expect(screen.getByTextKey('hub_overview_total_registration_graph_tab')).toBeInTheDocument();
    expect(screen.getByTextKey('hub_overview_average_duration_graph_tab')).toBeInTheDocument();
    expect(screen.getByTestId('hub-overview-total-view-graph')).toBeInTheDocument();
    const totalRegistrationsTabHeader = screen.getByTestId('total-registrations-tab-header');
    fireEvent.click(totalRegistrationsTabHeader);
    await waitFor(() => {
      expect(screen.getByTestId('hub-overview-total-registration-graph')).toBeInTheDocument();
    });
    const totalDurationTabHeader = screen.getByTestId('average-duration-tab-header');
    fireEvent.click(totalDurationTabHeader);
    await waitFor(() => {
      expect(screen.getByTestId('hub-overview-average-duration-graph')).toBeInTheDocument();
    });
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders hub overview line charts error', async () => {
    const { container } = render(
      <TestWrapper>
        <HubOverViewLineChartContainer
          currentViewsData={currentViewsData}
          previousViewsData={previousViewsData}
          previousViewDurationData={previousViewDurationData}
          currentViewDurationData={currentViewDurationData}
          currentRegistrationCountData={currentTotalRegistrationData}
          previousRegistrationCountData={previousTotalRegistrationData}
          error={{
            totalViewsError: true
          }}
        />
      </TestWrapper>
    );
    await waitFor(() => {
      expect(screen.getByTextKey('hub_overview_card_error_text')).toBeInTheDocument();
    });
    const tryAgainBtn = await screen.findByRole('button', { key: 'hub_overview_card_try_again_button' });
    expect(tryAgainBtn).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });
});

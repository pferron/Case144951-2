import { fireEvent, render, waitFor } from '@testing-library/react';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import React from 'react';
import { screen } from 'nucleus-text/testing-library/screen';
import { TopVideos } from '@cvent/planner-event-hubs-model/types';
import 'jest-axe/extend-expect';
import { axe } from 'jest-axe';
import { NewHubOverviewVideoCard } from '../NewHubOverviewVideoCard';

const topFiveVideoData: TopVideos[] = [
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
];
const topFiveVideoDataUnchanged: TopVideos[] = [
  {
    videoId: '396dc2e8-7b34-43af-aff9-2cd5e3a0f02f',
    videoName: 'video-bogus',
    totalViews: 1,
    currentPosition: 1,
    previousPosition: 1
  }
];
const setSelectedDateRange = jest.fn();
const handleDateSelection = jest.fn();
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
  },
  {
    label: 'Custom date range',
    value: 'custom_date_range'
  }
];
describe('HubOverviewVideoCard', () => {
  it('Renders NewHubOverviewVideoCard component', async () => {
    const { container } = render(
      <TestWrapper>
        <NewHubOverviewVideoCard
          hubId="test-video-hub"
          testId="test-video-hub"
          topFiveVideosViewedData={[]}
          isLoadingData={false}
          dateRangeOptions={dateRangeOptions}
          selectedDateRange={selectedDateRange}
          setSelectedDateRange={setSelectedDateRange}
          handleDateSelection={handleDateSelection}
        />
      </TestWrapper>
    );

    expect(await screen.findByTextKey('hub_overview_top_videos_title')).toBeInTheDocument();

    expect(await axe(container)).toHaveNoViolations();
  });

  it('Renders NewHubOverviewVideoCard component with spinner', async () => {
    const { container } = render(
      <TestWrapper>
        <NewHubOverviewVideoCard
          hubId="test-video-hub"
          testId="test-video-hub"
          topFiveVideosViewedData={[]}
          isLoadingData
          dateRangeOptions={dateRangeOptions}
          selectedDateRange={selectedDateRange}
          setSelectedDateRange={setSelectedDateRange}
          handleDateSelection={handleDateSelection}
        />
      </TestWrapper>
    );

    expect(await screen.findByTextKey('hub_overview_top_videos_title')).toBeInTheDocument();
    expect(await screen.findByTestId('loading-overview-top-five-video-spinner')).toBeInTheDocument();

    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders NewHubOverviewVideoCard without data', async () => {
    const { container } = render(
      <TestWrapper>
        <NewHubOverviewVideoCard
          hubId="test-video-hub"
          testId="test-video-hub"
          topFiveVideosViewedData={[]}
          isLoadingData={false}
          dateRangeOptions={dateRangeOptions}
          selectedDateRange={selectedDateRange}
          setSelectedDateRange={setSelectedDateRange}
          handleDateSelection={handleDateSelection}
        />
      </TestWrapper>
    );

    expect(await screen.findByTextKey('hub_overview_top_videos_title')).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('Renders NewHubOverviewVideoCard component with data', async () => {
    const { container } = render(
      <TestWrapper>
        <NewHubOverviewVideoCard
          hubId="test-video-hub"
          testId="test-video-hub"
          topFiveVideosViewedData={topFiveVideoData}
          isLoadingData={false}
          dateRangeOptions={dateRangeOptions}
          selectedDateRange={selectedDateRange}
          setSelectedDateRange={setSelectedDateRange}
          handleDateSelection={handleDateSelection}
        />
      </TestWrapper>
    );

    expect(await screen.findByTextKey('hub_overview_top_videos_title')).toBeInTheDocument();
    expect(await screen.findByTextKey('hub_overview_top_videos_name')).toBeInTheDocument();
    expect(await screen.findByTextKey('hub_overview_top_videos_rank')).toBeInTheDocument();
    expect(await screen.findByTextKey('view_more_button')).toBeInTheDocument();

    const dropDownButton = screen.getByTestId('top-videos-date-range-dropdown');
    expect(dropDownButton).toBeInTheDocument();
    expect(dropDownButton).toBeEnabled();
    expect(dropDownButton).toHaveTextContent('Last 30 days');
    fireEvent.click(dropDownButton);
    await waitFor(() => {
      expect(screen.getByTestId('top-videos-date-range-dropdown')).toBeInTheDocument();
    });
    expect(screen.getByText('7 days')).toBeInTheDocument();
    expect(screen.getByText('12 months')).toBeInTheDocument();
    const option = screen.getByTestId('top-videos-date-range-dropdown-option-0');
    fireEvent.click(option);
    await waitFor(() => {
      expect(handleDateSelection).toHaveBeenCalledWith('last_12_months');
    });
    // Query specific text to be shown on the component
    expect(screen.getByText('video-bogus')).toBeInTheDocument();
    expect(screen.getByText('video123.mp4')).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('Renders NewHubOverviewVideoCard component with Error', async () => {
    const { container } = render(
      <TestWrapper>
        <NewHubOverviewVideoCard
          hubId="test-video-hub"
          testId="test-video-hub"
          topFiveVideosViewedData={topFiveVideoData}
          isLoadingData={false}
          error
          dateRangeOptions={dateRangeOptions}
          selectedDateRange={selectedDateRange}
          setSelectedDateRange={setSelectedDateRange}
          handleDateSelection={handleDateSelection}
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

  it('handles date range selection in NewHubOverviewVideoCard', async () => {
    render(
      <TestWrapper>
        <NewHubOverviewVideoCard
          hubId="test-video-hub"
          topFiveVideosViewedData={topFiveVideoData}
          isLoadingData={false}
          dateRangeOptions={dateRangeOptions}
          selectedDateRange={selectedDateRange}
          setSelectedDateRange={setSelectedDateRange}
          handleDateSelection={handleDateSelection}
          testId="test-video-hub"
        />
      </TestWrapper>
    );

    const dropDownButton = screen.getByTestId('top-videos-date-range-dropdown');
    fireEvent.click(dropDownButton);
    await waitFor(() => {
      expect(screen.getByTestId('top-videos-date-range-dropdown')).toBeInTheDocument();
    });
    const option = screen.getByTestId('top-videos-date-range-dropdown-option-3');
    fireEvent.click(option);
    await waitFor(() => {
      expect(handleDateSelection).toHaveBeenCalledWith('custom_date_range');
    });
    expect(setSelectedDateRange).toHaveBeenCalledWith({ value: 'custom_date_range' });
  });

  it('should display a "-" when there is no change in video rank', () => {
    render(
      <TestWrapper>
        <NewHubOverviewVideoCard
          hubId="test-video-hub"
          topFiveVideosViewedData={topFiveVideoDataUnchanged}
          isLoadingData={false}
          dateRangeOptions={dateRangeOptions}
          selectedDateRange={selectedDateRange}
          setSelectedDateRange={setSelectedDateRange}
          handleDateSelection={handleDateSelection}
          testId="test-video-hub"
        />
      </TestWrapper>
    );
    expect(screen.getByText('--')).toBeInTheDocument();
  });
});

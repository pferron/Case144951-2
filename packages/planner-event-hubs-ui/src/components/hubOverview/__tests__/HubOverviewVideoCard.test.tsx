import { render, waitFor } from '@testing-library/react';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import React from 'react';
import { screen } from 'nucleus-text/testing-library/screen';
import { TopVideos } from '@cvent/planner-event-hubs-model/types';
import 'jest-axe/extend-expect';
import { axe } from 'jest-axe';
import { HubOverviewVideoCard } from '../HubOverviewVideoCard';

const topFiveVideoData: TopVideos[] = [
  {
    videoId: '396dc2e8-7b34-43af-aff9-2cd5e3a0f02f',
    videoName: 'video-bogus',
    totalViews: 1,
    currentWeekPosition: 1,
    lastWeekPosition: 2
  },
  {
    videoId: '5ab5d17e-5b86-4085-aded-0ca586e63ac6',
    videoName: 'video123.mp4',
    totalViews: 1,
    currentWeekPosition: 2,
    lastWeekPosition: 3
  }
];
describe('HubOverviewVideoCard', () => {
  it('Renders HubOverviewVideoCard component', async () => {
    const { container } = render(
      <TestWrapper>
        <HubOverviewVideoCard testId="test-video-hub" topFiveVideosViewedData={[]} isLoadingData={false} />
      </TestWrapper>
    );

    expect(await screen.findByTextKey('hub_overview_top_videos_title')).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('Renders HubOverviewVideoCard component with data', async () => {
    const { container } = render(
      <TestWrapper>
        <HubOverviewVideoCard
          testId="test-video-hub"
          topFiveVideosViewedData={topFiveVideoData}
          isLoadingData={false}
        />
      </TestWrapper>
    );

    expect(await screen.findByTextKey('hub_overview_top_videos_title')).toBeInTheDocument();
    expect(await screen.findByTextKey('hub_overview_top_videos_name')).toBeInTheDocument();
    expect(await screen.findByTextKey('hub_overview_top_videos_rank')).toBeInTheDocument();
    expect(await screen.findByTextKey('hub_overview_top_videos_last_week')).toBeInTheDocument();
    // Query specific text to be shown on the component
    expect(screen.getByText('video-bogus')).toBeInTheDocument();
    expect(screen.getByText('video123.mp4')).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('Renders HubOverviewVideoCard component with Error', async () => {
    const { container } = render(
      <TestWrapper>
        <HubOverviewVideoCard
          testId="test-video-hub"
          topFiveVideosViewedData={topFiveVideoData}
          isLoadingData={false}
          error
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

import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { VIDEO_TITLE_COLUMN, ASC, DESC, VIDEO_DURATION_COLUMN, VIDEO_VIEWS_COLUMN } from '@utils/constants';
import { screen } from 'nucleus-text/testing-library/screen';
import 'jest-axe/extend-expect';
import VideoTable from '@components/videoEngagement/VideoTable';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import { memberVideoWatchDurationByHubId } from '@cvent/planner-event-hubs-model/src/operations/analytics';
import { getDatetimesForAnalytics } from '@utils/analyticsUtil';
import { MockedProvider } from '@apollo/client/testing';

jest.mock('next/router', () => ({
  push: jest.fn()
}));

const mockVideoList = [
  {
    videoId: '1',
    videoTitle: 'Video 1',
    views: 100,
    videoDuration: 60,
    thumbnail: 'thumbnail1.jpg'
  },
  {
    videoId: '2',
    videoTitle: 'Video 2',
    views: 200,
    videoDuration: 4500,
    thumbnail: 'thumbnail2.jpg'
  },
  {
    videoId: '3',
    videoTitle: 'Video 3',
    views: 200,
    videoDuration: 120,
    thumbnail: null
  }
];

const mockOnSort = jest.fn();

const { currentStartDate, currentEndDate } = getDatetimesForAnalytics(30, '');

const queryMock = [
  {
    request: {
      query: memberVideoWatchDurationByHubId,
      fetchPolicy: 'network-only',
      nextFetchPolicy: 'cache-and-network',
      variables: {
        input: {
          videoId: '1',
          videoDuration: 60,
          filter: {
            hubId: 'TestHub',
            startDate: currentStartDate,
            endDate: currentEndDate
          }
        }
      }
    },
    result: {
      data: {
        memberVideoWatchDurationByHubId: {
          data: [
            {
              id: '396dc2e8-7b34-43af-aff9-2cd5e3a0f02f',
              firstName: 'Test1',
              lastName: 'Last1',
              email: 'first@a.com',
              duration: 1000,
              percentage: 10
            },
            {
              id: '5ab5d17e-5b86-4085-aded-0ca586e63ac6',
              firstName: 'Test2',
              lastName: 'Last2',
              email: 'first1@a.com',
              duration: 90,
              percentage: 10
            }
          ],
          serverError: null
        }
      }
    }
  }
];

const dateFilter = {
  dateForAnalytics: {
    type: 'custom',
    value: {
      startDate: new Date(),
      endDate: new Date()
    }
  },
  selectedTimeFrame: '02/03/2024 - 11/18/2024',
  selectedDateRange: {
    value: 'custom_date_range'
  }
};

describe('VideoTable', () => {
  it('renders member list page with infinite scroll loader', async () => {
    render(
      <TestWrapper>
        <VideoTable videoList={mockVideoList} onSort={mockOnSort} hubId="TestHub" dateFilter={dateFilter} />
      </TestWrapper>
    );

    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByTestId('video_list_table-table-header')).toBeInTheDocument();
    const row1 = screen.getByTestId('video_list_table-row-0');
    expect(row1).toBeInTheDocument();
  });

  it('calls onSort with correct arguments when a column header is clicked', () => {
    render(
      <TestWrapper>
        <VideoTable videoList={mockVideoList} onSort={mockOnSort} hubId="TestHub" dateFilter={dateFilter} />
      </TestWrapper>
    );
    fireEvent.click(screen.getByTestId('video_list_table-heading-1'));
    expect(mockOnSort).toHaveBeenCalledWith(VIDEO_TITLE_COLUMN, ASC);

    fireEvent.click(screen.getByTestId('video_list_table-heading-1'));
    expect(mockOnSort).toHaveBeenCalledWith(VIDEO_TITLE_COLUMN, DESC);
  });

  it('redirects to the correct URL when a video name is clicked', async () => {
    render(
      <TestWrapper>
        <MockedProvider mocks={queryMock}>
          <VideoTable videoList={mockVideoList} onSort={mockOnSort} hubId="TestHub" dateFilter={dateFilter} />
        </MockedProvider>
      </TestWrapper>
    );
    fireEvent.click(screen.getByText('Video 1'));
    await waitFor(() => {
      expect(screen.getByTestId('audience-engagement-modal')).toBeInTheDocument();
    });
  });

  it('sorts videos by duration in ascending order', async () => {
    render(
      <TestWrapper>
        <VideoTable videoList={mockVideoList} onSort={mockOnSort} hubId="TestHub" dateFilter={dateFilter} />
      </TestWrapper>
    );

    fireEvent.click(screen.getByTestId('video_list_table-heading-3'));
    await waitFor(() => {
      expect(mockOnSort).toHaveBeenCalledWith(VIDEO_DURATION_COLUMN, ASC);
    });
  });

  it('renders correctly when there is no duration', () => {
    render(
      <TestWrapper>
        <VideoTable videoList={[mockVideoList[2]]} onSort={mockOnSort} hubId="TestHub" dateFilter={dateFilter} />
      </TestWrapper>
    );

    const thumbnail = screen.getByText('-');
    expect(thumbnail).toBeInTheDocument();
  });

  it('renders thumbnail correctly', async () => {
    render(
      <TestWrapper>
        <VideoTable videoList={[mockVideoList[1]]} onSort={mockOnSort} hubId="TestHub" dateFilter={dateFilter} />
      </TestWrapper>
    );

    const thumbnail1 = screen.getAllByAltTextKey('thumbnail_alt_text');
    expect(thumbnail1[0]).toHaveAttribute('src', 'thumbnail2.jpg');
  });

  it('handles empty video list correctly', () => {
    render(
      <TestWrapper>
        <VideoTable videoList={[]} onSort={mockOnSort} hubId="TestHub" dateFilter={dateFilter} />
      </TestWrapper>
    );

    expect(screen.getByTestId('video_list_table')).toBeInTheDocument();
    expect(screen.queryByTestId('video_list_table-row-0')).not.toBeInTheDocument();
  });

  it('sorts videos by total views in ascending order', async () => {
    render(
      <TestWrapper>
        <VideoTable videoList={mockVideoList} onSort={mockOnSort} hubId="TestHub" dateFilter={dateFilter} />
      </TestWrapper>
    );

    fireEvent.click(screen.getByTestId('video_list_table-heading-2'));
    await waitFor(() => {
      expect(mockOnSort).toHaveBeenCalledWith(VIDEO_VIEWS_COLUMN, ASC);
    });
  });

  it('renders duration correctly', () => {
    render(
      <TestWrapper>
        <VideoTable videoList={mockVideoList} onSort={mockOnSort} hubId="TestHub" dateFilter={dateFilter} />
      </TestWrapper>
    );
    const duration = screen.getByText('01:00');
    const duration1 = screen.getByText('01:15:00');
    expect(duration).toBeInTheDocument();
    expect(duration1).toBeInTheDocument();
  });

  it('sorts by total views in ascending and click on duration column to sort initially in ascending order', async () => {
    render(
      <TestWrapper>
        <VideoTable videoList={mockVideoList} onSort={mockOnSort} hubId="TestHub" dateFilter={dateFilter} />
      </TestWrapper>
    );

    fireEvent.click(screen.getByTestId('video_list_table-heading-2'));
    await waitFor(() => {
      expect(mockOnSort).toHaveBeenCalledWith(VIDEO_VIEWS_COLUMN, ASC);
    });

    fireEvent.click(screen.getByTestId('video_list_table-heading-3'));
    await waitFor(() => {
      expect(mockOnSort).toHaveBeenCalledWith(VIDEO_DURATION_COLUMN, ASC);
    });
  });
});

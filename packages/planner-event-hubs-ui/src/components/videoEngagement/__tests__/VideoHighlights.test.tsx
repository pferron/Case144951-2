import React from 'react';
import { fireEvent, render, waitFor, within } from '@testing-library/react';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import VideoHighlights from '@components/videoEngagement/VideoHighlights';
import { AppFeaturesProvider } from '@components/AppFeaturesProvider';
import { MockedProvider } from '@apollo/client/testing';
import { screen } from 'nucleus-text/testing-library/screen';
import 'jest-axe/extend-expect';
import userEvent from '@testing-library/user-event';
import { videosViewDetailsByHubId } from '@cvent/planner-event-hubs-model/src/operations/analytics';
import { getDatetimesForAnalytics } from '@utils/analyticsUtil';

interface RouterProps {
  pathname: string;
  route: string;
  query: {
    isSuccess: boolean;
  };
  replace: () => void;
}

jest.mock('next/router', () => ({
  useRouter(): RouterProps {
    return {
      pathname: '/path',
      route: '/route',
      query: { isSuccess: true },
      replace: jest.fn()
    };
  }
}));

jest.mock('@hooks/useStyle', () => ({
  useStyle: () => ({
    outerContainer: {},
    innerContainer: {},
    listContainer: {},
    titleContainer: {},
    filterBarContainer: {},
    filterPillsContainer: {},
    clearAllButton: {}
  })
}));

jest.mock('@hooks/useQueryParam', () => () => ({
  tab: '0'
}));

const appFeatures = [
  {
    name: 'renovateHubOverviewFeature',
    enabled: true,
    experimentVersion: '1'
  }
];

const hubId = 'test-hub-id';
const hubTitle = 'Hub 1';

const { currentStartDate, currentEndDate } = getDatetimesForAnalytics(30, '');

const queryMock = [
  {
    request: {
      query: videosViewDetailsByHubId,
      fetchPolicy: 'network-only',
      nextFetchPolicy: 'cache-and-network',
      variables: {
        input: {
          hubId,
          startDate: currentStartDate,
          endDate: currentEndDate
        }
      }
    },
    result: {
      data: {
        videosViewDetailsByHubId: {
          data: [
            {
              videoId: '396dc2e8-7b34-43af-aff9-2cd5e3a0f02f',
              videoTitle: 'video-bogus',
              views: 110,
              videoDuration: 1200,
              thumbnail: null
            },
            {
              videoId: '5ab5d17e-5b86-4085-aded-0ca586e63ac6',
              videoTitle: 'video123.mp4',
              views: 98,
              videoDuration: 3000,
              thumbnail: null
            }
          ],
          serverError: null
        }
      }
    }
  }
];

const errorQueryMock = [
  {
    request: {
      query: videosViewDetailsByHubId,
      fetchPolicy: 'network-only',
      nextFetchPolicy: 'cache-and-network',
      variables: {
        input: {
          hubId,
          startDate: currentStartDate,
          endDate: currentEndDate
        }
      }
    },
    result: {
      data: {
        videosViewDetailsByHubId: {
          serverError: true
        }
      }
    }
  }
];

describe('VideoHighlights', () => {
  it('renders the VideoHighlights component', async () => {
    render(
      <TestWrapper>
        <MockedProvider mocks={queryMock}>
          <AppFeaturesProvider value={appFeatures}>
            <VideoHighlights hubId={hubId} hubTitle={hubTitle} />
          </AppFeaturesProvider>
        </MockedProvider>
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId('video_list_table')).toBeInTheDocument();
    });

    expect(screen.getByTestId('videos_tab')).toBeInTheDocument();
    expect(screen.getByTestId('header-title')).toBeInTheDocument();
    expect(screen.getByTestId('search-video-filter-bar')).toBeInTheDocument();
    expect(screen.getByLabelText('Date range')).toBeInTheDocument();
    const dropDownButton = screen.getByTestId('video-engagement-date-range-dropdown');
    expect(dropDownButton).toBeInTheDocument();
    expect(dropDownButton).toHaveTextContent('Last 30 days');
  });

  it('error out rendering of the VideoHighlights component', async () => {
    render(
      <TestWrapper>
        <MockedProvider mocks={errorQueryMock}>
          <AppFeaturesProvider value={appFeatures}>
            <VideoHighlights hubId={hubId} hubTitle={hubTitle} />
          </AppFeaturesProvider>
        </MockedProvider>
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.queryByTestId('video_list_table')).not.toBeInTheDocument();
    });

    expect(screen.getByTestId('videos_tab')).toBeInTheDocument();
    expect(screen.getByTestId('header-title')).toBeInTheDocument();
  });

  it('applies date filter correctly', async () => {
    render(
      <TestWrapper>
        <MockedProvider mocks={queryMock}>
          <AppFeaturesProvider value={appFeatures}>
            <VideoHighlights hubId={hubId} hubTitle={hubTitle} />
          </AppFeaturesProvider>
        </MockedProvider>
      </TestWrapper>
    );
    await waitFor(() => {
      expect(screen.getByTestId('video_list_table')).toBeInTheDocument();
    });
    const dropDownButton = screen.getByTestId('video-engagement-date-range-dropdown');
    fireEvent.click(dropDownButton);

    const option = screen.getByTestId('video-engagement-date-range-dropdown-option-0');
    fireEvent.click(option);
    await waitFor(() => {
      const dropDownButton1 = screen.getByTestId('video-engagement-date-range-dropdown');
      expect(dropDownButton1).toHaveTextContent('Last 7 days');
    });
  });

  it('handles custom date range pill correctly', async () => {
    render(
      <TestWrapper>
        <MockedProvider mocks={queryMock}>
          <AppFeaturesProvider value={appFeatures}>
            <VideoHighlights hubId={hubId} hubTitle={hubTitle} />
          </AppFeaturesProvider>
        </MockedProvider>
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId('video_list_table')).toBeInTheDocument();
    });

    const dropDownButton = screen.getByTestId('video-engagement-date-range-dropdown');
    fireEvent.click(dropDownButton);

    const option = screen.getByTestId('video-engagement-date-range-dropdown-option-5');
    fireEvent.click(option);
    const customDateRangeButton = screen.getByText('Custom date range');
    await userEvent.click(customDateRangeButton);
    await waitFor(() => {
      expect(screen.getByTestId('video-list-date-picker-modal')).toBeInTheDocument();
    });
  });

  it('sorts videos by total views in ascending order', async () => {
    render(
      <TestWrapper>
        <MockedProvider mocks={queryMock}>
          <AppFeaturesProvider value={appFeatures}>
            <VideoHighlights hubId={hubId} hubTitle={hubTitle} />
          </AppFeaturesProvider>
        </MockedProvider>
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId('video_list_table')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('video_list_table-heading-2'));
    const row1 = screen.getByTestId('video_list_table-row-0');
    expect(row1).toBeInTheDocument();
    expect(row1).toHaveTextContent('video123.mp4');
  });

  it('sorts videos by duration in ascending order', async () => {
    render(
      <TestWrapper>
        <MockedProvider mocks={queryMock}>
          <AppFeaturesProvider value={appFeatures}>
            <VideoHighlights hubId={hubId} hubTitle={hubTitle} />
          </AppFeaturesProvider>
        </MockedProvider>
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId('video_list_table')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('video_list_table-heading-3'));
    const row1 = screen.getByTestId('video_list_table-row-0');
    expect(row1).toBeInTheDocument();
    expect(row1).toHaveTextContent('video-bogus');
  });

  it('renders the table again when the search bar clear button is clicked', async () => {
    render(
      <TestWrapper>
        <MockedProvider mocks={queryMock}>
          <AppFeaturesProvider value={appFeatures}>
            <VideoHighlights hubId={hubId} hubTitle={hubTitle} />
          </AppFeaturesProvider>
        </MockedProvider>
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId('video_list_table')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Search');
    fireEvent.change(searchInput, { target: { value: '123' } });

    const filterBar = screen.getByTestId('search-video-filter-bar');
    const searchButton = within(filterBar).getByTestId('search-video-filter-bar__submit-search-button');
    fireEvent.click(searchButton);

    expect(screen.getByText('video123.mp4')).toBeInTheDocument();
    expect(screen.queryByText('video-bogus')).not.toBeInTheDocument();

    const clearButton = within(filterBar).getByTestId('search-video-filter-bar__clear-search-button');
    fireEvent.click(clearButton);
    await waitFor(() => {
      expect(screen.getByText('video-bogus')).toBeInTheDocument();
    });
    expect(screen.getByText('video123.mp4')).toBeInTheDocument();
  });
});

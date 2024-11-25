import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import AudienceEngagementModal from '@components/videoEngagement/AudienceEngagementModal';
import { screen } from 'nucleus-text/testing-library/screen';
import 'jest-axe/extend-expect';
import userEvent from '@testing-library/user-event';
import { memberVideoWatchDurationByHubId } from '@cvent/planner-event-hubs-model/src/operations/analytics';
import { MockedProvider } from '@apollo/client/testing';
import { getDatetimesForAnalytics } from '@utils/analyticsUtil';

const video = {
  id: 'TestId',
  name: 'Video 1',
  duration: 200
};

const { currentStartDate, currentEndDate } = getDatetimesForAnalytics(30, '');

const queryMock = [
  {
    request: {
      query: memberVideoWatchDurationByHubId,
      fetchPolicy: 'network-only',
      nextFetchPolicy: 'cache-and-network',
      variables: {
        input: {
          videoId: video.id,
          videoDuration: video.duration,
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
  dateForAnalytics: 30,
  selectedTimeFrame: 'Last 30 days',
  selectedDateRange: {
    value: 'last_30_days'
  }
};

describe('AudienceEngagementModal', () => {
  it('renders the AudienceEngagementModal component', async () => {
    render(
      <TestWrapper>
        <MockedProvider mocks={queryMock}>
          <AudienceEngagementModal
            isModalOpen
            hubId="TestHub"
            setIsModalOpen={jest.fn()}
            video={video}
            testId="audience-engagement-modal"
            dateFilter={dateFilter}
          />
        </MockedProvider>
      </TestWrapper>
    );

    expect(screen.getByTestId('audience-engagement-modal')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByTestId('audience_list_table')).toBeInTheDocument();
    });

    expect(screen.getByText('Test1')).toBeInTheDocument();
    expect(screen.getByText('first1@a.com')).toBeInTheDocument();
  });

  it('applies search filter correctly', async () => {
    render(
      <TestWrapper>
        <MockedProvider mocks={queryMock}>
          <AudienceEngagementModal
            isModalOpen
            hubId="TestHub"
            setIsModalOpen={jest.fn()}
            video={video}
            testId="audience-engagement-modal"
            dateFilter={dateFilter}
          />
        </MockedProvider>
      </TestWrapper>
    );
    await waitFor(() => {
      expect(screen.getByTestId('audience_list_table')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByPlaceholderText('Search'), { target: { value: 'Last2' } });
    fireEvent.click(screen.getByTestId('search-audience-filter-bar__submit-search-button'));

    await waitFor(() => {
      expect(screen.getByText('first1@a.com')).toBeInTheDocument();
    });
    expect(screen.queryByText('Test1')).not.toBeInTheDocument();

    fireEvent.click(screen.getByTestId('search-audience-filter-bar__clear-search-button'));
    await waitFor(() => {
      expect(screen.getByText('Test1')).toBeInTheDocument();
    });
  });

  it('applies date filter correctly', async () => {
    render(
      <TestWrapper>
        <MockedProvider mocks={queryMock}>
          <AudienceEngagementModal
            isModalOpen
            hubId="TestHub"
            setIsModalOpen={jest.fn()}
            video={video}
            testId="audience-engagement-modal"
            dateFilter={dateFilter}
          />
        </MockedProvider>
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId('audience_list_table')).toBeInTheDocument();
    });

    const dropDownButton = screen.getByTestId('audience-engagement-date-range-dropdown');
    fireEvent.click(dropDownButton);

    const option = screen.getByTestId('audience-engagement-date-range-dropdown-option-0');
    fireEvent.click(option);
    await waitFor(() => {
      const dropDownButton1 = screen.getByTestId('audience-engagement-date-range-dropdown');
      expect(dropDownButton1).toHaveTextContent('Last 7 days');
    });
  });

  it('handles custom date range pill correctly', async () => {
    render(
      <TestWrapper>
        <MockedProvider mocks={queryMock}>
          <AudienceEngagementModal
            isModalOpen
            hubId="TestHub"
            setIsModalOpen={jest.fn()}
            video={video}
            testId="audience-engagement-modal"
            dateFilter={dateFilter}
          />
        </MockedProvider>
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId('audience_list_table')).toBeInTheDocument();
    });

    const dropDownButton = screen.getByTestId('audience-engagement-date-range-dropdown');
    fireEvent.click(dropDownButton);

    const option = screen.getByTestId('audience-engagement-date-range-dropdown-option-5');
    fireEvent.click(option);
    const customDateRangeButton = screen.getByText('Custom date range');
    await userEvent.click(customDateRangeButton);
    await waitFor(() => {
      expect(screen.getByTestId('date-picker-modal')).toBeInTheDocument();
    });
  });

  it('sorts audience by first name in descending order', async () => {
    render(
      <TestWrapper>
        <MockedProvider mocks={queryMock}>
          <AudienceEngagementModal
            isModalOpen
            hubId="TestHub"
            setIsModalOpen={jest.fn()}
            video={video}
            testId="audience-engagement-modal"
            dateFilter={dateFilter}
          />
        </MockedProvider>
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId('audience_list_table')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('audience_list_table-heading-0'));
    fireEvent.click(screen.getByTestId('audience_list_table-heading-0'));
    const row1 = screen.getByTestId('audience_list_table-row-0');
    expect(row1).toBeInTheDocument();
    expect(row1).toHaveTextContent('Test2');
  });
});

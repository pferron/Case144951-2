import React from 'react';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import { Features } from '@components/features/Features';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/router';
import { getCenterFeatures } from '@cvent/planner-event-hubs-model/operations/hub';
import { MockedProvider } from '@apollo/client/testing';
import { screen } from 'nucleus-text/testing-library/screen';

jest.mock('next/router', () => ({
  useRouter: jest.fn()
}));

const mocks = [
  {
    request: {
      query: getCenterFeatures,
      variables: {
        id: {
          id: 'test-video-center'
        }
      }
    },
    result: {
      data: {
        getCenterFeatures: [
          {
            code: 'PROFILE_SETUP',
            enabled: true
          },
          {
            code: 'YOUR_EVENTS',
            enabled: false
          },
          {
            code: 'CONNECTIONS',
            enabled: true
          },
          {
            code: 'UPCOMING_EVENTS',
            enabled: true
          }
        ]
      }
    }
  }
];

/* eslint-disable @typescript-eslint/no-explicit-any */
const getBaseProps = jest.fn();

jest.mock('@cvent/sli-nextjs-metrics', () => {
  return {
    usePageActions(): any {
      return {
        getBaseProps
      };
    },
    useMeasurePageLoad: jest.fn()
  };
});

describe('Features', () => {
  it('renders member feature card', async () => {
    render(
      <TestWrapper>
        <MockedProvider mocks={mocks}>
          <Features videoCenterId="test-video-center" videoCenterTitle="Demo Video Center" />
        </MockedProvider>
      </TestWrapper>
    );
    await waitFor(() => {
      expect(screen.getByTestId('member-feature-card')).toBeInTheDocument();
    });
    expect(await screen.findByText('Member Profile')).toBeInTheDocument();
    expect(screen.getByTestId('member-feature-card-title')).toBeInTheDocument();
    expect(await screen.findByTestId('member-feature-card-setup')).toBeInTheDocument();
  });

  it('opening of member profile page on clicking set-up', async () => {
    render(
      <TestWrapper>
        <MockedProvider mocks={mocks}>
          <Features videoCenterId="test-video-center" videoCenterTitle="Demo Video Center" />
        </MockedProvider>
      </TestWrapper>
    );
    const push = jest.fn();

    (useRouter as jest.Mock).mockImplementation(() => ({ push }));
    const setup = await screen.findAllByText('Set up'); // findAllByText returns an array
    expect(setup.length > 0).toBeTruthy();
    const editLink = setup[0];
    expect(editLink).toBeInTheDocument();
    fireEvent.click(editLink);

    expect(push).toHaveBeenCalledWith('/eventsplus/test-video-center/features/member-profile');
  });

  it('renders your-events card', async () => {
    render(
      <TestWrapper>
        <MockedProvider mocks={mocks}>
          <Features videoCenterId="test-video-center" videoCenterTitle="Demo Video Center" />
        </MockedProvider>
      </TestWrapper>
    );
    await waitFor(() => {
      expect(screen.getByTestId('your-events-feature-card')).toBeInTheDocument();
    });
    expect(await screen.findByText('Your Events')).toBeInTheDocument();
    expect(screen.getByText('Display members’ past and upcoming events')).toBeInTheDocument();
    expect(screen.getByTestId('your-events-feature-card-switch')).toBeInTheDocument();
  });

  it('renders connections card', async () => {
    render(
      <TestWrapper>
        <MockedProvider mocks={mocks}>
          <Features videoCenterId="test-video-center" videoCenterTitle="Demo Video Center" />
        </MockedProvider>
      </TestWrapper>
    );
    await waitFor(() => {
      expect(screen.getByTestId('connections-feature-card')).toBeInTheDocument();
    });
    expect(await screen.findByText('Connections')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Allow members to view their connections, connection requests, and discover upcoming events in their network'
      )
    ).toBeInTheDocument();
    expect(await screen.findByTestId('connections-feature-card-switch')).toBeInTheDocument();
  });

  it('renders upcoming-events card', async () => {
    render(
      <TestWrapper>
        <MockedProvider mocks={mocks}>
          <Features videoCenterId="test-video-center" videoCenterTitle="Demo Video Center" />
        </MockedProvider>
      </TestWrapper>
    );
    await waitFor(() => {
      expect(screen.getByTestId('upcoming-events-feature-card')).toBeInTheDocument();
    });
    expect(await screen.findByTextKey('upcoming_events_title')).toBeInTheDocument();
    expect(screen.getByTextKey('upcoming_events_description')).toBeInTheDocument();
    expect(screen.getByTestId('upcoming-events-feature-card-switch')).toBeInTheDocument();
    expect(await screen.findByTestId('upcoming-events-feature-card-setup')).toBeInTheDocument();
  });

  it('renders member profile card without toggle button', async () => {
    render(
      <TestWrapper>
        <MockedProvider mocks={mocks}>
          <Features videoCenterId="test-video-center" videoCenterTitle="Demo Video Center" />
        </MockedProvider>
      </TestWrapper>
    );
    await waitFor(() => {
      expect(screen.getByTestId('member-feature-card')).toBeInTheDocument();
    });
    expect(await screen.findByText('Member Profile')).toBeInTheDocument();
    expect(screen.getByText('Invite members to create personalized profiles')).toBeInTheDocument();
    expect(screen.queryByTestId('member-feature-card-switch')).not.toBeInTheDocument();
    expect(await screen.findByTestId('member-feature-card-setup')).toBeInTheDocument();
  });
});

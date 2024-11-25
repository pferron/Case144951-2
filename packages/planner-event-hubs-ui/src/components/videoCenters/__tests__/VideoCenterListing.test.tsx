import React from 'react';
import { render } from '@testing-library/react';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import VideoCenterListing from '@components/videoCenters/VideoCenterListing';
import { MockedProvider } from '@apollo/client/testing';
import { GET_VIDEO_HUBS } from '@cvent/planner-event-hubs-model/operations/hub';
import 'jest-axe/extend-expect';
import { axe } from 'jest-axe';
import { screen } from 'nucleus-text/testing-library/screen';

interface RouterProps {
  pathname: string;
  route: string;
  query: {
    isSuccess: boolean;
  };
}

jest.mock('next/router', () => ({
  useRouter(): RouterProps {
    return {
      pathname: '/path',
      route: '/route',
      query: { isSuccess: true }
    };
  }
}));

describe('Video Centers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Render Video Centers empty screen', async () => {
    const mocks = [
      {
        request: {
          query: GET_VIDEO_HUBS,
          variables: {
            input: { limit: 20 }
          }
        },
        result: {
          data: {
            hubs: {
              data: []
            }
          }
        }
      }
    ];

    const { container } = render(
      <TestWrapper>
        <MockedProvider mocks={mocks}>
          <VideoCenterListing />
        </MockedProvider>
      </TestWrapper>
    );
    expect(container).toMatchSnapshot();
    expect(await screen.findByText(/You haven't created any hubs yet/)).toBeInTheDocument();
    expect(screen.getByTestId('video-hub-empty-page-container')).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('Should render the table with event hubs', async () => {
    const mocks = [
      {
        request: {
          query: GET_VIDEO_HUBS,
          variables: {
            input: { limit: 20 }
          }
        },
        result: {
          data: {
            hubs: {
              data: [
                {
                  __typename: 'Hub',
                  id: 'e68c7b34-4ed8-4c3b-a5b6-20f018048d0f',
                  status: 'Inactive',
                  config: {
                    __typename: 'Config',
                    title: 'New Events Plus',
                    ownerFirstName: '2',
                    ownerLastName: 'e',
                    ownerEmail: 'BC@gmail.com',
                    url: 'https://staging.cvent.me/7zaZ39',
                    locale: 'en-US'
                  }
                }
              ],
              paging: {
                nextToken: null
              }
            }
          }
        }
      }
    ];
    render(
      <TestWrapper>
        <MockedProvider mocks={mocks}>
          <VideoCenterListing />
        </MockedProvider>
      </TestWrapper>
    );
    expect(await screen.findByRole('button', { key: 'video_hubs_header_action_create_text' })).toBeInTheDocument();
    expect(await screen.findByRole('button', { name: 'Row actions' })).toBeInTheDocument();
    expect(screen.getByText('New Events Plus')).toBeInTheDocument();
    /* Axe test fails when Table actions are added, it's from carina Table component which we don't have control */
  });
});

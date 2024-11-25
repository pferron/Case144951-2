import React from 'react';
import { screen, render } from '@testing-library/react';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import { MockedProvider } from '@apollo/client/testing';
import ViewVideoCenters from '@components/videoCenters/listing/ViewVideoCenters';
import { GET_VIDEO_HUBS } from '@cvent/planner-event-hubs-model/operations/hub';
import { ActionType } from '@cvent/carina/components/Templates/utils/helpers';
import VideoHubs from '../../../stories/fixtures/DummyVideoHubsData.json';

const mock = jest.fn();

const headerActions: ActionType[] = [
  {
    value: 'video_hubs_header_action_create_text',
    onClick: jest.fn(),
    label: 'video_hubs_header_action_create_text'
  }
];

describe('Video Centers table view', () => {
  it('Render Video Hubs table', async () => {
    const mocks = [
      {
        request: {
          query: GET_VIDEO_HUBS
        },
        result: {
          data: {
            hubs: []
          }
        }
      }
    ];

    const { baseElement } = render(
      <TestWrapper>
        <MockedProvider mocks={mocks}>
          <ViewVideoCenters
            videoHubs={VideoHubs}
            loadingVideoCentersList={false}
            headerActions={headerActions}
            deleteVideoCenter={mock}
          />
        </MockedProvider>
      </TestWrapper>
    );

    expect(baseElement).toMatchSnapshot();
    expect(await screen.findByTestId('video-hubs-view')).toBeInTheDocument();
    expect(screen.getAllByRole('row')).toHaveLength(5);
    expect(screen.getByText('Future Technologies')).toBeInTheDocument();
    /* Axe test fails when Table actions are added, it's from carina Table component which we don't have control */
  });
});

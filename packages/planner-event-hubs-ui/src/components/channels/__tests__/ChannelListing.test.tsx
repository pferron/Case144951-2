import React from 'react';
import { screen, fireEvent, render, waitFor } from '@testing-library/react';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import ChannelListing from '@components/channels/ChannelListing';
import { MockedProvider } from '@apollo/client/testing';
import { ASC, CHANNEL_LIST_LIMIT, CHANNEL_ORDER, CHANNEL_TITLE } from '@utils/constants';
import {
  createChannelMutation,
  deleteChannelMutation,
  updateChannelOrderMutation,
  getPlannerPaginatedChannelsQuery
} from '@cvent/planner-event-hubs-model/operations/channel';
import 'jest-axe/extend-expect';

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

jest.mock('@hooks/useCenterInfo', () => ({
  useCenterInfo: () => {
    return {
      hubUrl: 'https://staging.cvent.me/7zaZ39'
    };
  }
}));

jest.mock('next/config', () => {
  return jest.fn().mockImplementation(() => ({
    publicRuntimeConfig: {
      VIDEO_HUB_WEB: 'https://web-staging.cvent.com',
      CVENT_SHORT_URL: 'https://staging.cvent.me'
    }
  }));
});

const currentToken = '4718cbb4-0517-4d59-b232-d4cf4dae973a';
const mocks = [
  {
    request: {
      query: getPlannerPaginatedChannelsQuery,
      variables: {
        hubId: 'f31242af-65e1-4530-97d4-ba2c2adc0edb',
        filterInput: {
          limit: CHANNEL_LIST_LIMIT,
          sort: `${CHANNEL_ORDER}:${ASC},${CHANNEL_TITLE}:${ASC}`
        }
      }
    },
    result: {
      data: {
        getPlannerPaginatedChannels: {
          data: [
            {
              id: 'c7378d60-979f-4cb6-b71f-d4f7bcd22532',
              title: 'Channel to be created in demo',
              description: 'explain plan test description',
              status: 'INACTIVE',
              catalogId: 'f3699bf6-f58b-4430-b872-966f2b572a96',
              imageUrl: null,
              order: 1,
              videoCount: 0,
              __typename: 'PlannerChannelListObject'
            },
            {
              id: 'a46a6605-4667-41ae-920a-065be8710c15',
              title: 'sample channel 6',
              description: 'Some description',
              status: 'INACTIVE',
              order: 2,
              catalogId: 'f3699bf6-f58b-4430-b872-966f2b572a96',
              imageUrl: null,
              videoCount: 0,
              __typename: 'PlannerChannelListObject'
            }
          ],
          paging: {
            currentToken,
            nextToken: '23a228a3-fa65-4b8c-87c1-576bb49659ad',
            limit: 15,
            __typename: 'Paging'
          },
          __typename: 'PlannerPaginatedChannels'
        }
      }
    }
  },
  {
    request: {
      query: getPlannerPaginatedChannelsQuery,
      variables: {
        hubId: 'hub-without-channels',
        filterInput: {
          limit: CHANNEL_LIST_LIMIT,
          sort: `${CHANNEL_ORDER}:${ASC},${CHANNEL_TITLE}:${ASC}`
        }
      }
    },
    result: {
      data: {
        getPlannerPaginatedChannels: {
          data: [],
          pagination: {}
        }
      }
    }
  }
];
const mocksForOrderSort = {
  request: {
    query: getPlannerPaginatedChannelsQuery,
    variables: {
      hubId: 'f31242af-65e1-4530-97d4-ba2c2adc0edb',
      filterInput: {
        limit: CHANNEL_LIST_LIMIT,
        sort: `${CHANNEL_ORDER}:${ASC},${CHANNEL_TITLE}:${ASC}`
      }
    }
  },
  result: {
    data: {
      getPlannerPaginatedChannels: {
        data: [
          {
            id: 'c7378d60-979f-4cb6-b71f-d4f7bcd22532',
            title: 'channel 1 from channel-order sorted list',
            description: 'explain plan test description',
            status: 'INACTIVE',
            catalogId: 'f3699bf6-f58b-4430-b872-966f2b572a96',
            imageUrl: null,
            videoCount: 0,
            order: 1,
            __typename: 'PlannerChannelListObject'
          },
          {
            id: 'b4642670-882c-4126-87a8-ccd926cd9ed8',
            title: 'channel 2 from channel-order sorted list',
            description: 'explain plan test description',
            status: 'INACTIVE',
            catalogId: 'f3699bf6-f58b-4430-b872-966f2b572a97',
            imageUrl: null,
            videoCount: 0,
            order: 2,
            __typename: 'PlannerChannelListObject'
          }
        ],
        paging: {
          currentToken: '4718cbb4-0517-4d59-b232-d4cf4dae973a',
          nextToken: '23a228a3-fa65-4b8c-87c1-576bb49659ad',
          limit: 15,
          __typename: 'Paging'
        },
        __typename: 'PlannerPaginatedChannels'
      }
    }
  }
};
const saveChannelOrderSuccessResponse = [
  mocksForOrderSort,
  {
    request: {
      query: updateChannelOrderMutation,
      variables: {
        hubId: 'f31242af-65e1-4530-97d4-ba2c2adc0edb',
        channelOrderInputList: [
          {
            id: 'c7378d60-979f-4cb6-b71f-d4f7bcd22532',
            existingOrder: 1,
            order: 1
          },
          {
            id: 'b4642670-882c-4126-87a8-ccd926cd9ed8',
            existingOrder: 2,
            order: 2
          }
        ]
      }
    },
    result: {
      data: {
        updateChannelOrder: [
          {
            id: 'c7378d60-979f-4cb6-b71f-d4f7bcd22532',
            order: 1,
            __typename: 'ChannelOrder'
          },
          {
            id: 'b4642670-882c-4126-87a8-ccd926cd9ed8',
            order: 2,
            __typename: 'ChannelOrder'
          }
        ]
      }
    }
  }
];
const saveChannelOrderFailResponse = [
  mocksForOrderSort,
  {
    request: {
      query: updateChannelOrderMutation,
      variables: {
        hubId: 'f31242af-65e1-4530-97d4-ba2c2adc0edb',
        channelOrderInputList: [
          {
            id: 'c7378d60-979f-4cb6-b71f-d4f7bcd22532',
            existingOrder: 1,
            order: 1
          },
          {
            id: 'b4642670-882c-4126-87a8-ccd926cd9ed8',
            existingOrder: 2,
            order: 2
          }
        ]
      }
    },
    result: {
      data: {
        errors: [new Error('some error occurred')]
      }
    }
  }
];

const createChannelResponse = {
  request: {
    variables: {
      hubId: 'f31242af-65e1-4530-97d4-ba2c2adc0edb',
      title: 'test channel',
      description: 'test channel desc',
      customDomain: null
    },
    query: createChannelMutation
  },
  result: {
    data: {
      createChannel: {
        id: '10433a61-07d5-4f88-ad43-8c7a09a16345',
        __typename: 'Channel'
      }
    }
  }
};
const deleteChannelSuccessMock = {
  request: {
    query: deleteChannelMutation,
    variables: {
      channelId: 'c7378d60-979f-4cb6-b71f-d4f7bcd22532'
    }
  },
  result: {
    data: {
      deleteChannel: true
    }
  }
};
const paginationTokenRequestMock = {
  request: {
    query: getPlannerPaginatedChannelsQuery,
    variables: {
      hubId: 'f31242af-65e1-4530-97d4-ba2c2adc0edb',
      filterInput: {
        token: currentToken
      }
    }
  },
  result: {
    data: {
      getPlannerPaginatedChannels: {
        data: [
          {
            id: 'a46a6605-4667-41ae-920a-065be8710c15',
            title: 'sample channel 6',
            description: 'Some description',
            status: 'INACTIVE',
            catalogId: 'f3699bf6-f58b-4430-b872-966f2b572a96',
            imageUrl: null,
            order: 2,
            videoCount: 0,
            __typename: 'PlannerChannelListObject'
          }
        ],
        paging: {
          currentToken,
          nextToken: '',
          limit: 15,
          __typename: 'Paging'
        },
        __typename: 'PlannerPaginatedChannels'
      }
    }
  }
};
const deleteChannelFailureMock = {
  request: {
    query: deleteChannelMutation,
    variables: {
      channelId: 'c7378d60-979f-4cb6-b71f-d4f7bcd22532'
    }
  },
  result: {
    errors: [new Error('some error occured')],
    data: { deleteChannel: null }
  }
};

describe('Channel listing', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Render Channel Page', async () => {
    const { baseElement } = render(
      <MockedProvider mocks={mocks}>
        <TestWrapper>
          <ChannelListing videoHubId="hub-without-channels" hubTitle="UT hub without channels" />
        </TestWrapper>
      </MockedProvider>
    );
    await new Promise(resolve => {
      setTimeout(resolve, 0);
    });
    expect(baseElement).toMatchSnapshot();

    await waitFor(() => {
      expect(screen.getByTestId('empty-channel-page-container')).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByTestId('header-actions__create-channel')).toBeInTheDocument();
    });
    expect(screen.queryByTestId('create-channel-modal-header')).not.toBeInTheDocument();
    // HUB-137682
    // expect(await axe(baseElement)).toHaveNoViolations();
  });

  it('Test Correct sort is passed and reorder button is rendered when channel ordering feature is on', async () => {
    const { baseElement } = render(
      <MockedProvider mocks={[mocksForOrderSort]}>
        <TestWrapper>
          <ChannelListing videoHubId="f31242af-65e1-4530-97d4-ba2c2adc0edb" hubTitle="UT hub without channels" />
        </TestWrapper>
      </MockedProvider>
    );
    await new Promise(resolve => {
      setTimeout(resolve, 0);
    });
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByTestId('header-actions__create-channel')).toBeInTheDocument();
    expect(screen.queryByTestId('create-channel-modal-header')).not.toBeInTheDocument();

    expect(await screen.findByTestId('channel-title-c7378d60-979f-4cb6-b71f-d4f7bcd22532')).toBeInTheDocument();

    expect(screen.queryByTestId('channel-title-c7378d60-979f-4cb6-b71f-d4f7bcd22532')).toHaveTextContent(
      'channel 1 from channel-order sorted list'
    );
    expect(await screen.findByRole('button', { name: 'Reorder' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Reorder' }));
    expect(await screen.findByRole('button', { name: 'Save' })).toBeInTheDocument();
    expect(await screen.findByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    // verify cancel button click
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(await screen.findByRole('button', { name: 'Reorder' })).toBeInTheDocument();
    // HUB-137682
    // expect(await axe(baseElement)).toHaveNoViolations();
  });
  it('Render Create Channel Page and open create channel form.', async () => {
    const { baseElement } = render(
      <MockedProvider mocks={mocks}>
        <TestWrapper>
          <ChannelListing videoHubId="f31242af-65e1-4530-97d4-ba2c2adc0edb" hubTitle="UT hub with channels" />
        </TestWrapper>
      </MockedProvider>
    );

    await new Promise(resolve => {
      setTimeout(resolve, 0);
    });
    expect(baseElement).toMatchSnapshot();
    await waitFor(() => {
      expect(screen.getByTestId('channel-list-table')).toBeInTheDocument();
    });
    expect(screen.queryByTestId('create-channel-modal-header')).not.toBeInTheDocument();
    fireEvent.click(screen.getByTestId('header-actions__create-channel'));
    expect(await screen.findByTestId('create-channel-modal-header')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('close-create-channel-modal'));
    // HUB-137682
    // expect(await axe(baseElement)).toHaveNoViolations();
  });
  it('Render Create Channel Page and create channel, redirect to channel page', async () => {
    const { baseElement } = render(
      <MockedProvider mocks={[...mocks, createChannelResponse]}>
        <TestWrapper>
          <ChannelListing videoHubId="f31242af-65e1-4530-97d4-ba2c2adc0edb" hubTitle="UT hub with channels" />
        </TestWrapper>
      </MockedProvider>
    );

    await new Promise(resolve => {
      setTimeout(resolve, 0);
    });
    expect(baseElement).toMatchSnapshot();
    await waitFor(() => {
      expect(screen.getByTestId('channel-list-table')).toBeInTheDocument();
    });
    expect(screen.queryByTestId('create-channel-modal-header')).not.toBeInTheDocument();
    fireEvent.click(screen.getByTestId('header-actions__create-channel'));
    expect(await screen.findByTestId('create-channel-modal-header')).toBeInTheDocument();
    let creatButton = screen.getByRole('button', { name: 'Create' });
    expect(creatButton).toBeDisabled();
    const titleField = screen.getByRole('textbox', { name: /\* name/i });
    fireEvent.change(titleField, { target: { value: 'test channel' } });
    const descField = screen.getByRole('textbox', { name: /\* description/i });
    fireEvent.change(descField, { target: { value: 'test channel desc' } });
    await new Promise(resolve => {
      setTimeout(resolve, 0);
    });
    await waitFor(() => {
      creatButton = screen.getByRole('button', { name: 'Create' });
      expect(creatButton).toBeEnabled();
    });
    fireEvent.click(creatButton);
    await waitFor(() => {
      expect(screen.queryByTestId('create-channel-modal-header')).not.toBeInTheDocument();
    });
    await new Promise(resolve => {
      setTimeout(resolve, 0);
    });
    // HUB-137682
    // expect(await axe(baseElement)).toHaveNoViolations();
  });
  it('Test Delete button opens delete confirmation modal and cancel button on modal', async () => {
    render(
      <MockedProvider mocks={mocks}>
        <TestWrapper>
          <ChannelListing videoHubId="f31242af-65e1-4530-97d4-ba2c2adc0edb" hubTitle="UT hub with channels" />
        </TestWrapper>
      </MockedProvider>
    );
    await new Promise(resolve => {
      setTimeout(resolve, 0);
    });
    await waitFor(() => {
      expect(screen.getByTestId('channel-list-table')).toBeInTheDocument();
    });
    expect(await screen.findByTestId('trash-icon-c7378d60-979f-4cb6-b71f-d4f7bcd22532')).toBeInTheDocument();
    const deleteButton = screen.getByTestId('trash-icon-c7378d60-979f-4cb6-b71f-d4f7bcd22532');
    fireEvent.click(deleteButton);
    expect(await screen.findByTestId('confirmation-modal-header')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Keep' })).toBeInTheDocument();
    expect(screen.getByTestId('confirmation-modal-confirmation-button')).toHaveTextContent('Delete channel');
    fireEvent.click(screen.getByRole('button', { name: 'Keep' }));
    await waitFor(() => {
      expect(screen.queryByTestId('confirmation-modal-header')).not.toBeInTheDocument();
    });
    // HUB-137682
    // expect(await axe(baseElement)).toHaveNoViolations();
  });

  // FIREBALL
  // eslint-disable-next-line jest/no-disabled-tests
  it.skip('Test delete icon opens delete confirmation modal and delete button on modal with successful deletion', async () => {
    render(
      <MockedProvider mocks={[mocks[0], deleteChannelSuccessMock, paginationTokenRequestMock]}>
        <TestWrapper>
          <ChannelListing videoHubId="f31242af-65e1-4530-97d4-ba2c2adc0edb" hubTitle="UT hub with channels" />
        </TestWrapper>
      </MockedProvider>
    );
    await new Promise(resolve => {
      setTimeout(resolve, 0);
    });
    await waitFor(() => {
      expect(screen.getByTestId('channel-list-table')).toBeInTheDocument();
    });
    expect(await screen.findByTestId('trash-icon-c7378d60-979f-4cb6-b71f-d4f7bcd22532')).toBeInTheDocument();
    const deleteButton = screen.getByTestId('trash-icon-c7378d60-979f-4cb6-b71f-d4f7bcd22532');
    fireEvent.click(deleteButton);
    expect(await screen.findByTestId('confirmation-modal-header')).toBeInTheDocument();
    expect(screen.getByTestId('confirmation-modal-confirmation-button')).toHaveTextContent('Delete channel');
    fireEvent.click(screen.getByTestId('confirmation-modal-confirmation-button'));
    await waitFor(
      async () => {
        expect(await screen.findByTestId('channel-deletion-success')).toBeInTheDocument();
      },
      {
        timeout: 2000,
        interval: 200
      }
    );
    expect(screen.queryByTestId('confirmation-modal-header')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Dismiss' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Dismiss' }));
    expect(screen.queryByTestId('channel-deletion-success')).not.toBeInTheDocument();
  });
  it('Test delete icon opens delete confirmation modal and delete button on modal with deletion failure', async () => {
    render(
      <MockedProvider mocks={[...mocks, deleteChannelFailureMock]}>
        <TestWrapper>
          <ChannelListing videoHubId="f31242af-65e1-4530-97d4-ba2c2adc0edb" hubTitle="UT hub with channels" />
        </TestWrapper>
      </MockedProvider>
    );
    await new Promise(resolve => {
      setTimeout(resolve, 0);
    });
    await waitFor(() => {
      expect(screen.getByTestId('channel-list-table')).toBeInTheDocument();
    });
    expect(await screen.findByTestId('trash-icon-c7378d60-979f-4cb6-b71f-d4f7bcd22532')).toBeInTheDocument();
    const deleteButton = screen.getByTestId('trash-icon-c7378d60-979f-4cb6-b71f-d4f7bcd22532');
    fireEvent.click(deleteButton);
    expect(await screen.findByTestId('confirmation-modal-header')).toBeInTheDocument();
    expect(screen.getByTestId('confirmation-modal-confirmation-button')).toHaveTextContent('Delete channel');
    fireEvent.click(screen.getByTestId('confirmation-modal-confirmation-button'));
    expect(await screen.findByTestId('channel-deletion-danger')).toBeInTheDocument();
    expect(screen.queryByTestId('confirmation-modal-header')).not.toBeInTheDocument();
    await waitFor(async () => {
      expect(await screen.findByRole('button', { name: 'Dismiss' })).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: 'Dismiss' }));
    expect(screen.queryByTestId('channel-deletion-danger')).not.toBeInTheDocument();
    // HUB-137682
    // expect(await axe(baseElement)).toHaveNoViolations();
  });
  it('Verify save success alert for reordering', async () => {
    render(
      <MockedProvider mocks={saveChannelOrderSuccessResponse}>
        <TestWrapper>
          <ChannelListing videoHubId="f31242af-65e1-4530-97d4-ba2c2adc0edb" hubTitle="UT hub without channels" />
        </TestWrapper>
      </MockedProvider>
    );
    await new Promise(resolve => {
      setTimeout(resolve, 0);
    });
    expect(await screen.findByRole('button', { name: 'Reorder' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Reorder' }));
    expect(await screen.findByRole('button', { name: 'Save' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(await screen.findByText('Your changes have been saved')).toBeInTheDocument();
    const dismissButton = screen.getByRole('button', { name: 'Dismiss' });
    fireEvent.click(dismissButton);
    await waitFor(() => {
      expect(screen.queryByText('Your changes have been saved')).not.toBeInTheDocument();
    });
    // HUB-137682
    // expect(await axe(baseElement)).toHaveNoViolations();
  });
  it('Verify save fail alert for reordering', async () => {
    render(
      <MockedProvider mocks={saveChannelOrderFailResponse}>
        <TestWrapper>
          <ChannelListing videoHubId="f31242af-65e1-4530-97d4-ba2c2adc0edb" hubTitle="UT hub without channels" />
        </TestWrapper>
      </MockedProvider>
    );
    await new Promise(resolve => {
      setTimeout(resolve, 0);
    });
    expect(await screen.findByRole('button', { name: 'Reorder' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Reorder' }));
    expect(await screen.findByRole('button', { name: 'Save' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(
      await screen.findByText(
        "Your changes couldn't be saved because someone made conflicting changes. Refresh the page and try again."
      )
    ).toBeInTheDocument();
    const dismissButton = screen.getByRole('button', { name: 'Dismiss' });
    fireEvent.click(dismissButton);
    await waitFor(() => {
      expect(
        screen.queryByText(
          "Your changes couldn't be saved because someone made conflicting changes. Refresh the page and try again."
        )
      ).not.toBeInTheDocument();
    });
    // HUB-137682
    // expect(await axe(baseElement)).toHaveNoViolations();
  });
});

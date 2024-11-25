import React from 'react';
import { screen, fireEvent, render, waitFor } from '@testing-library/react';
import enUS from '@locales/en-US.json';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import Channel from '@components/channels/Channel';
import {
  getCatalogQuery,
  getChannelQuery,
  deleteChannelMutation,
  updateChannelMutation,
  updateCatalogMutation
} from '@cvent/planner-event-hubs-model/operations/channel';
import { MockedProvider } from '@apollo/client/testing';
import 'jest-axe/extend-expect';
import userEvent from '@testing-library/user-event';
import CatalogDataWithSection from '../../../stories/fixtures/DummyCatalogDataFileWithSection.json';
import UpdatedCatalogDataRequest from '../../../stories/fixtures/DummyUpdatedCatalogDataFileRequest.json';

afterAll(() => {
  jest.restoreAllMocks();
});
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

const mock = [
  {
    request: {
      query: getChannelQuery,
      variables: { channelId: 'test channel' }
    },
    result: {
      data: {
        getChannelInformation: {
          title: 'Name Channel',
          description: 'This is a demo description',
          status: 'ACTIVE',
          id: 'a1115072-2cda-4c3e-8494-5b8360864d2b',
          image: null
        }
      }
    }
  },
  {
    request: {
      query: getChannelQuery,
      variables: { channelId: 'test channel' }
    },
    result: {
      data: {
        getChannelInformation: {
          title: 'Name Channel',
          description: 'This is a demo description',
          status: 'ACTIVE',
          id: 'a1115072-2cda-4c3e-8494-5b8360864d2b',
          image: null
        }
      }
    }
  },
  {
    request: {
      query: updateChannelMutation,
      variables: {
        channelInput: {
          id: 'test channel',
          title: 'Updated Name',
          description: 'This is a demo description',
          status: 'ACTIVE'
        }
      }
    },
    result: {
      data: {
        updateChannel: {
          id: '7c10a953-eef6-4093-ad43-4aee154421ec',
          title: 'Test Channel-2',
          description: 'This is the channel description',
          status: 'INACTIVE',
          catalogId: '266a71a0-393f-45a5-8518-cf486b8acffc',
          imageUrl:
            'https://images-lower.cvent.com/T2/807375f205ae484b973e19c4467da80f/7c10a953-eef6-4093-ad43-4aee154421ec/image/22065961-809b-44c7-81b8-b5880dd48b95!_!ad1a961cceb194a63cd4a37076eda485.jpeg',
          __typename: 'Channel'
        }
      }
    }
  },
  {
    request: {
      query: deleteChannelMutation,
      variables: {
        channelId: 'test channel'
      }
    },
    result: {
      data: {
        deleteChannel: true
      }
    }
  }
];

const catalogWithVideosMock = [
  {
    request: {
      query: getCatalogQuery,
      variables: { catalogId: 'catalog-id' }
    },
    result: {
      data: {
        getCatalog: CatalogDataWithSection
      }
    }
  },

  {
    request: {
      query: getChannelQuery,
      variables: { channelId: 'test channel' }
    },
    result: {
      data: {
        getChannelInformation: {
          title: 'Name Channel',
          description: 'This is a demo description',
          status: 'ACTIVE',
          id: 'a1115072-2cda-4c3e-8494-5b8360864d2b',
          catalogId: 'catalog-id',
          image: null
        }
      }
    }
  },
  {
    request: {
      query: getCatalogQuery,
      variables: { catalogId: 'catalog-id' }
    },
    result: {
      data: {
        getCatalog: CatalogDataWithSection
      }
    }
  },

  {
    request: {
      query: deleteChannelMutation,
      variables: {
        channelId: 'test channel'
      }
    },
    result: {
      data: {
        deleteChannel: true
      }
    }
  },

  {
    request: {
      query: updateCatalogMutation,
      variables: UpdatedCatalogDataRequest
    },
    result: {
      data: {
        updateCatalog: UpdatedCatalogDataRequest
      }
    }
  }
];

jest.mock('next/config', () => () => ({
  publicRuntimeConfig: {
    VIDEO_HUB_WEB: 'https://dummy.com/'
  }
}));

describe('Test Channel Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Render Channel Information Page', async () => {
    const { baseElement } = render(
      <MockedProvider mocks={mock}>
        <TestWrapper>
          <Channel videoHubId="test hub" channelId="test channel" hubTitle="dummy Title" />
        </TestWrapper>
      </MockedProvider>
    );
    expect(baseElement).toMatchSnapshot();
    await new Promise(resolve => {
      setTimeout(resolve, 0);
    });
    expect(screen.getByTestId('header-actions')).toBeInTheDocument();
    expect(screen.queryByTestId('confirmation-modal-header')).not.toBeInTheDocument();
    // HUB-137682
    // expect(await axe(baseElement)).toHaveNoViolations();
  });

  it('Render Channel Information Page and open delete channel modal', async () => {
    const { baseElement } = render(
      <MockedProvider mocks={mock}>
        <TestWrapper>
          <Channel videoHubId="test hub" channelId="test channel" hubTitle="dummy Title" />
        </TestWrapper>
      </MockedProvider>
    );
    await new Promise(resolve => {
      setTimeout(resolve, 0);
    });
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByTestId('header-actions__delete-channel')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('header-actions__delete-channel'));
    expect(screen.getByTestId('confirmation-modal-header')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('confirmation-modal-cancel-button'));
    expect(
      screen.getByText('Name Channel has been hidden from members because it does not contain any content')
    ).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
    // HUB-137682
    // expect(await axe(baseElement)).toHaveNoViolations();
  });

  it('Switch to videos page and reload, videos should render', async () => {
    const { baseElement } = render(
      <MockedProvider mocks={mock}>
        <TestWrapper>
          <Channel videoHubId="test hub" channelId="test channel" hubTitle="dummy Title" />
        </TestWrapper>
      </MockedProvider>
    );
    expect(baseElement).toMatchSnapshot();
    await new Promise(resolve => {
      setTimeout(resolve, 0);
    });
    fireEvent.click(screen.getByTestId('channel_video_tab_header'));
    expect(screen.getByText('Channel Videos')).toBeInTheDocument();
    window.location.reload();
    expect(screen.getByText('Channel Videos')).toBeInTheDocument();
    // HUB-137682
    // expect(await axe(baseElement)).toHaveNoViolations();
  });

  it('Test for disable state of save button in channel information page', async () => {
    render(
      <MockedProvider mocks={catalogWithVideosMock}>
        <TestWrapper>
          <Channel videoHubId="test hub" channelId="test channel" hubTitle="dummy Title" />
        </TestWrapper>
      </MockedProvider>
    );

    const saveButton = await screen.findByRole('button', { name: enUS.channels_save_button_label });
    expect(saveButton).toBeDisabled();
  });

  it('Test for enable state of save button, disable state of save button when channel name left empty and visibility of success alert on save button clicked', async () => {
    render(
      <MockedProvider mocks={mock}>
        <TestWrapper>
          <Channel videoHubId="test hub" channelId="test channel" hubTitle="dummy Title" />
        </TestWrapper>
      </MockedProvider>
    );

    let channelTitleField = await screen.findByTestId('channel-name-input-field-input');
    let saveButton = await screen.findByRole('button', { name: enUS.channels_save_button_label });
    fireEvent.change(channelTitleField, { target: { value: ' ' } });
    await waitFor(async () => {
      saveButton = await screen.findByRole('button', { name: enUS.channels_save_button_label });
      expect(saveButton).toBeDisabled();
    });
    channelTitleField = await screen.findByTestId('channel-name-input-field-input');
    fireEvent.change(channelTitleField, { target: { value: 'Updated Name' } });
    await waitFor(async () => {
      saveButton = await screen.findByRole('button', { name: enUS.channels_save_button_label });
      expect(saveButton).toBeEnabled();
    });
    await userEvent.click(saveButton);
    await waitFor(async () => {
      const saveSuccess = await screen.findByText(enUS.channel_information_update_message);
      expect(saveSuccess).toBeVisible();
    });
  });

  it('Test for enable state of save button when channel description changed and visibility of page leave modal if leave with unsaved changes present', async () => {
    render(
      <MockedProvider mocks={mock}>
        <TestWrapper>
          <Channel videoHubId="test hub" channelId="test channel" hubTitle="dummy Title" />
        </TestWrapper>
      </MockedProvider>
    );

    const channelDescField = await screen.findByTestId('channel-description-input-field-textarea');
    fireEvent.change(channelDescField, { target: { value: 'This is the updated description' } });
    await waitFor(async () => {
      const saveButton = await screen.findByRole('button', { name: enUS.channels_save_button_label });
      expect(saveButton).toBeEnabled();
    });
    const videosTab = await screen.findByTestId('channel_video_tab_header');
    fireEvent.click(videosTab);
    await waitFor(async () => {
      const saveButton = await screen.findByRole('button', { name: enUS.channels_save_button_label });
      expect(saveButton).toBeEnabled();
    });
    expect(await screen.findByRole('button', { name: /stay/i })).toBeInTheDocument();
  });

  it('Test for disable state of save button when channel description left empty', async () => {
    render(
      <MockedProvider mocks={mock}>
        <TestWrapper>
          <Channel videoHubId="test hub" channelId="test channel" hubTitle="dummy Title" />
        </TestWrapper>
      </MockedProvider>
    );

    const channelDescField = await screen.findByTestId('channel-description-input-field-textarea');
    fireEvent.change(channelDescField, { target: { value: ' ' } });
    await waitFor(async () => {
      const saveButton = await screen.findByRole('button', { name: enUS.channels_save_button_label });
      expect(saveButton).toBeDisabled();
    });
  });

  it('Test for disable state of save button in channel videos tab', async () => {
    render(
      <MockedProvider mocks={catalogWithVideosMock}>
        <TestWrapper>
          <Channel videoHubId="test hub" channelId="test channel" hubTitle="dummy Title" />
        </TestWrapper>
      </MockedProvider>
    );
    const videosTab = await screen.findByTestId('channel_video_tab_header');
    fireEvent.click(videosTab);
    expect(await screen.findByText('Channel Videos')).toBeInTheDocument();
    await userEvent.click(await screen.findByRole('tab', { name: enUS.channel_list_videos }));
    await waitFor(async () => {
      const saveButton = await screen.findByRole('button', { name: enUS.channels_save_button_label });
      expect(saveButton).toBeDisabled();
    });
  });

  // FIREBALL
  // eslint-disable-next-line jest/no-disabled-tests
  it.skip('Test for enable state of save button in channel videos tab and visibility of page leave modal when leaving page with unsaved changes', async () => {
    render(
      <MockedProvider mocks={catalogWithVideosMock}>
        <TestWrapper>
          <Channel videoHubId="test hub" channelId="test channel" hubTitle="dummy Title" />
        </TestWrapper>
      </MockedProvider>
    );
    const videosTab = await screen.findByTestId('channel_video_tab_header');
    fireEvent.click(videosTab);
    await new Promise(resolve => {
      setTimeout(resolve, 0);
    });
    expect(await screen.findByText('Channel Videos')).toBeInTheDocument();
    const menuButton = await screen.findAllByTestId('menu-button');
    fireEvent.click(menuButton[0]);
    await new Promise(resolve => {
      setTimeout(resolve, 0);
    });
    const deleteSectionButton = screen.getByRole('menuitem', { name: /delete section/i });
    fireEvent.click(deleteSectionButton);
    await new Promise(resolve => {
      setTimeout(resolve, 0);
    });
    const deleteButton = await screen.findByTestId('confirmation-modal-confirmation-button');
    expect(deleteButton).toBeInTheDocument();
    fireEvent.click(deleteButton);
    await new Promise(resolve => {
      setTimeout(resolve, 0);
    });
    const saveButton = screen.getByRole('button', { name: enUS.channels_save_button_label });
    expect(saveButton).toBeEnabled();
    const infoTab = await screen.findByTestId('channel_information_tab_header');
    fireEvent.click(infoTab);
    expect(await screen.findByRole('button', { name: /stay/i })).toBeInTheDocument();
  }, 120000);

  it('Test absence of channel hidden banner', async () => {
    render(
      <MockedProvider mocks={catalogWithVideosMock}>
        <TestWrapper>
          <Channel videoHubId="test hub" channelId="test channel" hubTitle="dummy Title" />
        </TestWrapper>
      </MockedProvider>
    );
    await new Promise(resolve => {
      setTimeout(resolve, 1000);
    });
    expect(screen.getByTestId('header-actions__delete-channel')).toBeInTheDocument();
    expect(
      screen.queryByText('Name Channel has been hidden from members because it does not contain any content')
    ).not.toBeInTheDocument();
    // HUB-137682
    // expect(await axe(baseElement)).toHaveNoViolations();
  });
});

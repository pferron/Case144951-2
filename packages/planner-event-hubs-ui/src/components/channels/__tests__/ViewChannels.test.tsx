import React from 'react';
import { screen, fireEvent, render, waitFor } from '@testing-library/react';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import ChannelsTable from '@components/channels/listing/ChannelsTable';
import { Catalog } from '@cvent/drag-and-drop-catalog/dist/types/catalogTypes';
import { channelListData } from '../../../../fixtures/ChannelListData';
import 'jest-axe/extend-expect';

jest.mock('next/router', () => ({
  useRouter: (): { route: string; pathname: string; query: { centerId: string } } => {
    return {
      route: '/channels',
      pathname: '/channels',
      query: {
        centerId: '00000000-0000-0000-000000000000'
      }
    };
  }
}));

const mock = jest.fn();

const deleteChannelMock = jest.fn();

const setChannelCatalogMock = jest.fn();
const channelCatalog: Catalog = {
  id: 'channelsCatalog',
  sections: [
    {
      id: 'channelsList',
      title: 'channelsList',
      itemCount: 2,
      content: null,
      items: [
        { id: '1', content: <p>channel 1</p>, displayName: 'channel 1' },
        { id: '2', content: <p>channel 2</p>, displayName: 'channel 2' }
      ]
    }
  ]
};
describe('View channel list page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Render Channel List Page with infinite loading', async () => {
    const { baseElement } = render(
      <TestWrapper>
        <ChannelsTable
          channels={channelListData}
          loadingMoreChannel
          deleteChannel={deleteChannelMock}
          scrollViewRef={null}
          isDraggable={false}
          channelCatalog={{}}
          setChannelCatalog={{}}
        />
      </TestWrapper>
    );
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByTestId('channel-list-table')).toBeInTheDocument();
    expect(screen.getByTestId('loading-more-channels-spinner')).toBeInTheDocument();
    expect(screen.queryByTestId('confirmation-modal-header')).not.toBeInTheDocument();
    // HUB-137682
    // expect(await axe(baseElement)).toHaveNoViolations();
  });

  it('Render Channel List Page without infinite loading spinner', async () => {
    const { baseElement } = render(
      <TestWrapper>
        <ChannelsTable
          channels={channelListData}
          loadingMoreChannel={false}
          deleteChannel={deleteChannelMock}
          scrollViewRef={null}
          isDraggable={false}
          channelCatalog={{}}
          setChannelCatalog={{}}
        />
      </TestWrapper>
    );
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByTestId('channel-list-table')).toBeInTheDocument();
    expect(screen.queryByTestId('loading-more-channels-spinner')).not.toBeInTheDocument();
    expect(screen.queryByTestId('confirmation-modal-header')).not.toBeInTheDocument();
    // HUB-137682
    // expect(await axe(baseElement)).toHaveNoViolations();
  });

  it('Click on trash icon on channel list page and cancel on confirmation modal', async () => {
    const { baseElement } = render(
      <TestWrapper>
        <ChannelsTable
          channels={channelListData}
          loadingMoreChannel={false}
          deleteChannel={deleteChannelMock}
          scrollViewRef={null}
          isDraggable={false}
          channelCatalog={{}}
          setChannelCatalog={{}}
        />
      </TestWrapper>
    );
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByTestId('channel-list-table')).toBeInTheDocument();
    expect(screen.getByTestId('trash-icon-1')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('trash-icon-1'));
    expect(screen.getByTestId('confirmation-modal-header')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('confirmation-modal-cancel-button'));
    await waitFor(() => {
      expect(screen.queryByTestId('confirmation-modal-header')).not.toBeInTheDocument();
    });
    expect(baseElement).toMatchSnapshot();
    // HUB-137682
    // expect(await axe(baseElement)).toHaveNoViolations();
  });
  it('Click on trash icon on channel list page and delete on confirmation modal', async () => {
    const { baseElement } = render(
      <TestWrapper>
        <ChannelsTable
          channels={channelListData}
          loadingMoreChannel={false}
          deleteChannel={deleteChannelMock}
          scrollViewRef={null}
          isDraggable={false}
          channelCatalog={{}}
          setChannelCatalog={{}}
        />
      </TestWrapper>
    );
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByTestId('channel-list-table')).toBeInTheDocument();
    expect(screen.getByTestId('trash-icon-1')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('trash-icon-1'));
    expect(screen.getByTestId('confirmation-modal-header')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('confirmation-modal-confirmation-button'));
    await waitFor(() => {
      expect(screen.queryByTestId('confirmation-modal-header')).not.toBeInTheDocument();
    });
    expect(deleteChannelMock).toHaveBeenCalled();
    expect(baseElement).toMatchSnapshot();
    // HUB-137682
    // expect(await axe(baseElement)).toHaveNoViolations();
  });
  it('Render Channel List Page with drag and drop', async () => {
    const { baseElement } = render(
      <TestWrapper>
        <ChannelsTable
          channels={channelListData}
          loadingMoreChannel
          deleteChannel={deleteChannelMock}
          scrollViewRef={null}
          isDraggable
          channelCatalog={channelCatalog}
          setChannelCatalog={setChannelCatalogMock}
          setIsPageEdited={mock}
        />
      </TestWrapper>
    );
    expect(baseElement).toMatchSnapshot();
    expect(await screen.findByTestId('drag-handle-1')).toBeInTheDocument();
    expect(screen.getByTestId('drag-handle-2')).toBeInTheDocument();
    // HUB-137682
    // expect(await axe(baseElement)).toHaveNoViolations();
  });
});

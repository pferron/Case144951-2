import React from 'react';
import { screen, render, fireEvent, waitFor } from '@testing-library/react';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import { ChannelInformation } from '@components/channels/information/ChannelInformation';
import { ChannelStatus } from '@cvent/planner-event-hubs-model/types';
import { NetworkStatus } from '@apollo/client';
import { getChannelQuery } from '@cvent/planner-event-hubs-model/operations/channel';
import { MockedProvider } from '@apollo/client/testing';
import 'jest-axe/extend-expect';
import enUS from '@locales/en-US.json';

const mockQuery = [
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
          status: 'INACTIVE',
          id: 'a1115072-2cda-4c3e-8494-5b8360864d2b',
          image: null
        }
      }
    }
  }
];
jest.mock('next/router', () => ({
  // spread out all "Router" exports
  ...(jest.requireActual('next/router') as Record<string, unknown>),

  // shallow merge the "default" exports with...
  default: {
    // all actual "default" exports...
    ...jest.requireActual('next/router').default,

    // and overwrite push and replace to be jest functions
    push: jest.fn(),
    replace: jest.fn()
  },
  // FIREBALL
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  useRouter(): any {
    return {
      pathname: '/channel/image',
      route: '/channel/image',
      query: { entityId: '8396f4ff-b3b9-4c51-85dd-f374ad87ce2d' }
    };
  }
}));

const setIsPageEdited = () => {
  // no-code
};

describe('Channel Information', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const channelInfo = {
    title: 'Test Channel',
    description: 'This is a test Channel',
    status: ChannelStatus.Inactive,
    catalogId: ''
  };

  it('Render Channel Information View Page', async () => {
    const { baseElement } = render(
      <MockedProvider mocks={mockQuery}>
        <TestWrapper>
          <ChannelInformation
            channelData={channelInfo}
            channelId=""
            networkStatus={NetworkStatus.ready}
            setIsPageEdited={setIsPageEdited}
            isPageEdited={false}
            submitRef={null}
          />
        </TestWrapper>
      </MockedProvider>
    );
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByTestId('channel-information-form')).toBeInTheDocument();
    // HUB-137682
    // expect(await axe(baseElement)).toHaveNoViolations();
  });

  it('Render Channel Information Page with empty title field', async () => {
    render(
      <MockedProvider mocks={mockQuery}>
        <TestWrapper>
          <ChannelInformation
            channelData={channelInfo}
            channelId=""
            networkStatus={NetworkStatus.ready}
            setIsPageEdited={setIsPageEdited}
            isPageEdited={false}
            submitRef={null}
          />
        </TestWrapper>
      </MockedProvider>
    );

    const channelTitleField = screen.getByDisplayValue('Test Channel');
    fireEvent.change(channelTitleField, { target: { value: '' } });
    await waitFor(async () => {
      expect(screen.getByText(enUS.channel_name_required)).toBeVisible();
    });
  });

  it('Render Channel Information Page with empty description field', async () => {
    render(
      <MockedProvider mocks={mockQuery}>
        <TestWrapper>
          <ChannelInformation
            channelData={channelInfo}
            channelId=""
            networkStatus={NetworkStatus.ready}
            setIsPageEdited={setIsPageEdited}
            isPageEdited={false}
            submitRef={null}
          />
        </TestWrapper>
      </MockedProvider>
    );
    const descField = screen.getByTestId('channel-description-input-field-textarea');
    fireEvent.change(descField, { target: { value: '' } });
    await waitFor(async () => {
      expect(screen.getByText(enUS.channel_description_required)).toBeVisible();
    });
  });
});

import ChannelListing from '@components/channels/ChannelListing';
import ChannelModal from '@components/channels/create/ChannelModal';
import { Button } from '@cvent/carina/components/Button';
import { getPlannerPaginatedChannelsQuery } from '@cvent/planner-event-hubs-model/operations/channel';
import { useState } from 'react';
import { StoryWrapper } from './utils/StoryWrapper';

export default {
  title: 'Create Channel'
};

export function CreateChannelPopUp(): JSX.Element {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <StoryWrapper>
      <>
        <Button
          text="Create Channel"
          onClick={(): void => {
            setIsOpen(true);
          }}
        />
        <ChannelModal
          isModalOpen={isOpen}
          setIsModalOpen={(): void => {
            setIsOpen(false);
          }}
          onSave={(): void => {
            // comment to remove ts warning
          }}
        />
      </>
    </StoryWrapper>
  );
}

export function CreateChannel(): JSX.Element {
  return (
    <StoryWrapper>
      <div
        css={{
          flexGrow: 1,
          overflowY: 'auto',
          width: '100%'
        }}
      >
        <ChannelListing videoHubId="testVideoHub" hubTitle="test hub" />
      </div>
    </StoryWrapper>
  );
}

CreateChannel.parameters = {
  apolloClient: {
    mocks: [
      {
        request: {
          query: getPlannerPaginatedChannelsQuery
        },
        result: {
          data: {
            getPlannerPaginatedChannels: {
              data: [
                {
                  id: '27540a76-715b-4ed8-be97-5c42791eecbe',
                  title: 'dummy channel',
                  status: 'INACTIVE',
                  videoCount: 0,
                  __typename: 'PlannerChannelListObject'
                }
              ],
              paging: {
                currentToken: '16bff91e-cf2a-4fd1-8e96-e7f2b82fcd53',
                nextToken: null,
                limit: 20,
                __typename: 'Paging'
              },
              __typename: 'PlannerPaginatedChannels'
            }
          }
        }
      }
    ]
  }
};

import Channel from '@components/channels/Channel';
import ChannelListing from '@components/channels/ChannelListing';
import { StoryWrapper } from './utils/StoryWrapper';

export default {
  title: 'Delete Channel'
};

export function DeleteModalOnDeleteChannelButton(): JSX.Element {
  return (
    <StoryWrapper>
      <div css={{ flexGrow: 1, overflowY: 'auto', width: '100%' }}>
        <Channel videoHubId="testVideoHub" channelId="testChannelId" hubTitle="hubTitle" />
      </div>
    </StoryWrapper>
  );
}

export function DeleteChannelAlertSuccessDeletion(): JSX.Element {
  return (
    <StoryWrapper>
      <div
        css={{
          flexGrow: 1,
          overflowY: 'auto',
          width: '100%'
        }}
      >
        <ChannelListing videoHubId="testVideoHub" hubTitle="Story book hub" />
      </div>
    </StoryWrapper>
  );
}

DeleteChannelAlertSuccessDeletion.story = {
  parameters: {
    nextRouter: {
      path: '/test1/channels',
      asPath: '/test1/channels',
      query: {
        isSuccess: 'true'
      }
    }
  }
};

export function DeleteChannelAlertErrorDeletion(): JSX.Element {
  return (
    <StoryWrapper>
      <div
        css={{
          flexGrow: 1,
          overflowY: 'auto',
          width: '100%'
        }}
      >
        <ChannelListing videoHubId="testVideoHub" hubTitle="Story book hub" />
      </div>
    </StoryWrapper>
  );
}

DeleteChannelAlertErrorDeletion.story = {
  parameters: {
    nextRouter: {
      path: '/test1/channels',
      asPath: '/test1/channels',
      query: {
        isSuccess: 'false'
      }
    }
  }
};

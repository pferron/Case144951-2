import { ChannelListingType } from '@components/channels/type/channel';
import { ChannelStatus } from '@cvent/planner-event-hubs-model/types';

export const channelListData: Array<ChannelListingType> = [
  {
    id: '1',
    title:
      'name 1 long length name 1 long length name 1 long length name 1 long length name 1 long length name 1 long length',
    description: 'Description 1',
    status: ChannelStatus.Active,
    videoCount: 10,
    order: 1
  },
  {
    id: '2',
    title: 'name 2',
    description: 'Description 2',
    status: ChannelStatus.Active,
    videoCount: 12,
    order: 2
  },
  {
    id: '3',
    title: 'name 3',
    description: 'Description 3',
    status: ChannelStatus.Inactive,
    videoCount: 3,
    order: 3
  },
  {
    id: '4',
    title: 'name 4',
    description: 'Description 4',
    status: ChannelStatus.Active,
    videoCount: 41,
    order: 4
  },
  {
    id: '5',
    title: 'name 5',
    description: 'Description 5',
    status: ChannelStatus.Active,
    videoCount: 10,
    order: 4
  },
  {
    id: '6',
    title: 'name 6',
    description: 'Description 6',
    status: ChannelStatus.Inactive,
    videoCount: 1,
    order: 5
  },
  {
    id: '7',
    title: 'name 7',
    description: 'Description 7',
    status: ChannelStatus.Active,
    videoCount: 12,
    order: 6
  },
  {
    id: '8',
    title: 'name 8',
    description: 'Description 3',
    status: ChannelStatus.Inactive,
    videoCount: 3,
    order: 7
  },
  {
    id: '9',
    title: 'name 9',
    description: 'Description 4',
    status: ChannelStatus.Active,
    videoCount: 41,
    order: 7
  },
  {
    id: '10',
    title: 'name 10',
    description: 'Description 5',
    status: ChannelStatus.Active,
    videoCount: 10,
    order: 8
  },
  {
    id: '11',
    title: 'name 11',
    description: 'Description 6',
    status: ChannelStatus.Inactive,
    videoCount: 1,
    order: 9
  },
  {
    id: '12',
    title: 'name 12',
    description: 'Description 6',
    status: ChannelStatus.Inactive,
    videoCount: 1,
    order: 10
  }
];

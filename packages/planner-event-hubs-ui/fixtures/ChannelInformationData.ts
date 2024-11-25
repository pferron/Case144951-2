import { ChannelInformationType } from '@components/channels/type/channel';
import { ChannelStatus } from '@cvent/planner-event-hubs-model/types';

export const channelInformationDataStatusActive: ChannelInformationType = {
  catalogId: 'catalog-id',
  id: 'channel-id',
  title: 'Active channel title',
  description: 'Active channel desc',
  status: ChannelStatus.Active
};

export const channelInformationDataStatusInactive: ChannelInformationType = {
  catalogId: 'catalog-id-2',
  id: 'channel-id-2',
  title: 'Inactive channel title',
  description: 'Inactive channel desc',
  status: ChannelStatus.Inactive
};

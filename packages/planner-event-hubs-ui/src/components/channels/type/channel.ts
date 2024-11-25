import { ChannelStatus } from '@cvent/planner-event-hubs-model/types';
import { CurrentImage } from '@components/common/imageUpload/types';

export interface ChannelType {
  id?: string;
  title: string;
  description: string;
  status: ChannelStatus;
}

export interface ChannelListingType extends ChannelType {
  order: number;
  videoCount: number;
}

export interface ChannelInformationType extends ChannelType {
  image?: CurrentImage;
  catalogId: string;
}

import { ASC, DESC, STATUS, CHANNEL_TITLE } from '@utils/constants';
import { ChannelInformationType, ChannelListingType } from '@components/channels/type/channel';
import { ChannelStatus } from '@cvent/planner-event-hubs-model/types';

export const getSortMultiplier = (sortOrder: typeof ASC | typeof DESC): number => {
  return sortOrder === ASC ? 1 : -1;
};

export const sortChannelListDataHelper = (
  channels: ChannelListingType[],
  sortColumn: typeof CHANNEL_TITLE | typeof STATUS,
  sortOrder: typeof ASC | typeof DESC
): ChannelListingType[] => {
  return [...channels].sort((channelA: ChannelListingType, channelB: ChannelListingType) => {
    if (sortColumn === CHANNEL_TITLE) {
      return getSortMultiplier(sortOrder) * channelA.title.localeCompare(channelB.title);
    }
    if (sortColumn === STATUS) {
      return (
        getSortMultiplier(sortOrder) *
        channelA.status.valueOf().toLocaleString().localeCompare(channelB.status.valueOf().toLocaleString())
      );
    }
    return null;
  });
};

/**
 * Method that checks if the status of channel is Active or not
 * @param channelData
 * */
export const isChannelActive = (channelData: ChannelInformationType): boolean => {
  return channelData?.status === ChannelStatus.Active;
};

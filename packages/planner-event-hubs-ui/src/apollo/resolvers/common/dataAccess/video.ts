import { VideoFilterInput, PaginatedVideos } from '@cvent/planner-event-hubs-model/types';
import { UniversalVideoServiceClient } from '@dataSources/universalVideoService/client';
import { AND, VIDEO_FILTER_VIDEO_CENTER } from '@utils/constants';

export const getVideos = async (
  filterInput: VideoFilterInput,
  centerId: string,
  videoClient: UniversalVideoServiceClient
): Promise<PaginatedVideos> => {
  const updatedFilterInput = {
    ...filterInput,
    filter: centerId
      ? filterInput?.filter?.concat(`${AND} ${VIDEO_FILTER_VIDEO_CENTER}'${centerId}'`)
      : filterInput?.filter
  };
  return videoClient.postVideos(updatedFilterInput);
};

import { Resolvers, PaginatedVideos } from '@cvent/planner-event-hubs-model/types';
import { LoggerFactory } from '@cvent/logging/LoggerFactory';
import {
  BAD_REQUEST_ERROR_CODE,
  INCORRECT_FILTER,
  IS_PLANNER_ROLE,
  UNAUTH_ERROR_MESSAGE,
  UNAUTHORIZED_ERROR_CODE
} from '@utils/constants';
import { PlannerEventHubError } from '@server/error/PlannerEventHubError';
import { getVideos } from '../common/dataAccess/video';

const LOG = LoggerFactory.create('video-resolver');

const resolver: Resolvers = {
  Query: {
    getVideos: async (_parent, args, { dataSources, auth }): Promise<PaginatedVideos> => {
      const centerId = auth.authorization?.metadata?.VideoCenterId;
      const isPlannerCall = auth.authorization?.roles?.includes(IS_PLANNER_ROLE);

      // member side call -> center id needed OR planner side call -> IS_PLANNER role needed
      // filter: null is only valid for planner request
      if (!centerId && !isPlannerCall) {
        LOG.error(`authentication failed for getVideos for filter=${args.filterInput?.filter}`);
        throw new PlannerEventHubError(UNAUTH_ERROR_MESSAGE, { code: UNAUTHORIZED_ERROR_CODE });
      } else if (!isPlannerCall && args.filterInput?.filter == null) {
        LOG.error('getVideos failed: filter cannot be null for member requests');
        throw new PlannerEventHubError(INCORRECT_FILTER, { code: BAD_REQUEST_ERROR_CODE });
      }
      return getVideos(args.filterInput, centerId, dataSources.universalVideoServiceClient);
    }
  }
};

export default resolver;

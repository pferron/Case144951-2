import { MemberLoginResponse, Resolvers } from '@cvent/planner-event-hubs-model/types';
import {
  FORBIDDEN_ERROR_CODE,
  INTERNAL_SERVER_ERROR_CODE,
  SERVER_ERROR_MESAGE,
  UNPROCESSABLE_ENTITY_ERROR_CODE
} from '@utils/constants';

const resolver: Resolvers = {
  Query: {
    memberLogin: async (_parent, { memberLoginInput }, { dataSources }, _info): Promise<MemberLoginResponse> => {
      try {
        return await dataSources.videoCenterClient.initiateMemberLogin(memberLoginInput);
      } catch (error) {
        if (error.code === UNPROCESSABLE_ENTITY_ERROR_CODE) {
          return {
            emailLocked: true
          };
        }
        if (error.code === FORBIDDEN_ERROR_CODE) {
          return {
            userRestricted: true
          };
        }
        if (error.code === INTERNAL_SERVER_ERROR_CODE) {
          return {
            serverError: error?.message || SERVER_ERROR_MESAGE
          };
        }
        throw error;
      }
    }
  }
};

export default resolver;

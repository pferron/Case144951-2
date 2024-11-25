import { LoggerFactory } from '@cvent/logging/LoggerFactory';
import { MemberListPaginatedResult, Resolvers, Success } from '@cvent/planner-event-hubs-model/types';
import { registrationAgeCalculation } from '@utils/registrationAgeCalculation';

const LOG = LoggerFactory.create('member-list-resolver');

const resolver: Resolvers = {
  Query: {
    searchMemberList: async (_parent, { input }, { dataSources }, _info): Promise<MemberListPaginatedResult> => {
      LOG.debug('Searching Member List: ', input);
      const result = await dataSources.videoCenterClient.filterMemberList(input);
      result.data = result.data.map(member => ({
        ...member,
        registrationAge: registrationAgeCalculation(member.registrationDate)
      }));
      return result;
    }
  },
  Mutation: {
    updateMemberStatus: async (_parent, { input }, { dataSources }): Promise<Success> => {
      LOG.debug('updateMemberStatus', input);
      await dataSources.videoCenterClient.updateMemberStatus(input.hubId, {
        memberIds: input.memberIds,
        status: 'DELETED'
      });
      return {
        success: true
      };
    }
  }
};

export default resolver;

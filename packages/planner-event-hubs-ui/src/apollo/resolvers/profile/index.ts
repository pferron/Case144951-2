import { Resolvers, MemberData } from '@cvent/planner-event-hubs-model/types';
import { LoggerFactory } from '@cvent/logging/LoggerFactory';
import { registrationAgeCalculation } from '@utils/registrationAgeCalculation';
import isSelected from '@server/isSelected';

const LOG = LoggerFactory.create('profile-resolver');

const resolver: Resolvers = {
  Query: {
    getMemberData: async (_parent, { input }, { dataSources }, info): Promise<MemberData> => {
      const { centerId, contactId } = input;
      LOG.debug('Get member data =', centerId, contactId);
      const profile = await dataSources.videoCenterClient.getMemberProfile(centerId, contactId);
      const response =
        profile?.registrationDate === undefined
          ? { profile }
          : {
              profile: { ...profile, registrationAge: registrationAgeCalculation(profile.registrationDate) }
            };
      if (isSelected(info, 'visibility')) {
        const visibility = await dataSources.videoCenterClient.getMemberProfileVisibility(centerId, contactId);
        if (isSelected(info, 'termsAccepted')) {
          const termsOfUseResponse = await dataSources.videoCenterClient.getHubTermsOfUse(centerId, contactId);
          return {
            ...response,
            visibility: visibility.visible,
            termsAccepted: termsOfUseResponse.termsAccepted
          };
        }
        return {
          ...response,
          visibility: visibility.visible
        };
      }
      return response;
    }
  }
};

export default resolver;

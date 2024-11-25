import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { MemberDataInput, MemberData } from '@cvent/planner-event-hubs-model/types';
import { GET_MEMBER_PROFILE_DATA as memberDataQuery } from '@cvent/planner-event-hubs-model/operations/profile';

export const getMemberData = async (
  client: ApolloClient<NormalizedCacheObject>,
  input: MemberDataInput
): Promise<MemberData> => {
  const response = await client.query({
    query: memberDataQuery,
    variables: {
      input
    }
  });
  return response.data.getMemberData;
};

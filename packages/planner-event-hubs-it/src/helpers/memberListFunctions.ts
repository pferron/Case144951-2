import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import {
  MemberListPaginatedResult,
  SearchMemberInput,
  Success,
  UpdateMemberStatusInput
} from '@cvent/planner-event-hubs-model/types';
import { SEARCH_MEMBER_LIST, updateMemberStatus } from '@cvent/planner-event-hubs-model/operations/memberList';

export const searchMemberList = async (
  client: ApolloClient<NormalizedCacheObject>,
  input: SearchMemberInput
): Promise<MemberListPaginatedResult> => {
  const response = await client.query({
    query: SEARCH_MEMBER_LIST,
    variables: {
      input
    }
  });
  return response.data.searchMemberList;
};

export const updateMemberStatusMutation = async (
  client: ApolloClient<NormalizedCacheObject>,
  input: UpdateMemberStatusInput
): Promise<Success> => {
  const response = await client.mutate({
    mutation: updateMemberStatus,
    variables: {
      input
    }
  });
  return response.data.updateMemberStatus;
};

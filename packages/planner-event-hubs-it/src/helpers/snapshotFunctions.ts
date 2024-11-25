import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { AccountCodeSnippet, AccountSnapshot } from '@cvent/planner-event-hubs-model/types';
import {
  getAccountCodeSnippets,
  getAccountSnapshotQuery
} from '@cvent/planner-event-hubs-model/src/operations/snapshot';

export const getCodeSnippets = async (client: ApolloClient<NormalizedCacheObject>): Promise<AccountCodeSnippet[]> => {
  const response = await client.query({
    query: getAccountCodeSnippets
  });
  return response.data.getAccountCodeSnippets;
};

export const getAccountSnapshot = async (client: ApolloClient<NormalizedCacheObject>): Promise<AccountSnapshot> => {
  const response = await client.query({
    query: getAccountSnapshotQuery
  });
  return response.data.getAccountSnapshot;
};

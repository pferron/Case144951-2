import { AccountSnapshot, Resolvers } from '@cvent/planner-event-hubs-model/types';
import { getAccountCodeSnippets, getAccountSnapshot } from '@resolvers/common/dataAccess/snapshot';
import { getAccountId } from '@resolvers/common/utils/authMetadataUtils';
import { CodeSnippetResponse } from '@dataSources/snapshotsService/client';

const resolver: Resolvers = {
  Query: {
    getAccountCodeSnippets: async (_parent, args, { auth, dataSources }): Promise<CodeSnippetResponse> => {
      const accountId = getAccountId(auth);
      return getAccountCodeSnippets(dataSources.snapshotClient, accountId);
    },
    getAccountSnapshot: async (_parent, args, { auth, dataSources }): Promise<AccountSnapshot> => {
      const accountId = getAccountId(auth);
      return getAccountSnapshot(dataSources.snapshotClient, accountId);
    }
  }
};

export default resolver;

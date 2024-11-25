import { AccountSnapshot } from '@cvent/planner-event-hubs-model/types';
import { CodeSnippetResponse, SnapshotClient } from '@dataSources/snapshotsService/client';

export const getAccountCodeSnippets = async (
  snapshotClient: SnapshotClient,
  accountID: string
): Promise<CodeSnippetResponse> => {
  return snapshotClient.getAccountCodeSnippets(accountID);
};

export const getAccountSnapshot = async (
  snapshotClient: SnapshotClient,
  accountId: string
): Promise<AccountSnapshot> => {
  const accountSnapshot = await snapshotClient.getAccountSnapshot(accountId);
  return {
    id: accountSnapshot?.id,
    name: accountSnapshot?.name,
    accountStub: accountSnapshot?.accountStub,
    customFonts: accountSnapshot?.customFonts
  };
};

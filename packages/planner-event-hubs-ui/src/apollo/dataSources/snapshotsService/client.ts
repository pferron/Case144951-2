import { CustomFont } from '@cvent/planner-event-hubs-model/types';
import { CvestDataSource } from '@dataSources/CvestDataSource';

export enum CodeSnippetStatus {
  PendingApproval = 'PendingApproval',
  Approved = 'Approved'
}

export interface AccountCodeSnippet {
  codeSnippetId: string;
  codeSnippetDataTagCode: string;
  codeSnippetName: string;
  codeSnippetValue: string;
  codeSnippetStatus: CodeSnippetStatus;
  isDropCodeSnippetToCookieBannerTied: boolean;
}
export interface AccountSnapshotSettings {
  dupMatchKeyType: string;
  allowCodeSnippets: boolean;
  accountCodeSnippets?: Record<string, AccountCodeSnippet>;
}

export interface AccountSnapshot {
  id: string;
  name: string;
  accountStub: string;
  settings: AccountSnapshotSettings;
  customFonts: [CustomFont];
}

export interface SnapshotResponse {
  version: string;
  snapshot: Snapshot;
}

export interface Snapshot {
  entityType: string;
  entity: string;
}

export interface CodeSnippetResponse {
  allowCodeSnippets: boolean;
  accountCodeSnippets?: AccountCodeSnippet[];
}

export class SnapshotClient extends CvestDataSource {
  constructor() {
    super();
    this.baseURL = `${process.env.SNAPSHOT_SERVICE_URL}`;
  }

  getAccountSnapshot = async (accountId: string): Promise<AccountSnapshot> => {
    const env = process.env.ENVIRONMENT_NAME;
    const data = (await this.get(
      `/v1/snapshot/Account/${accountId}`,
      { env },
      { headers: { authorization: `API_KEY ${process.env.API_KEY}` } }
    )) as SnapshotResponse;
    const { entity } = data?.snapshot || {};
    // Explicit parsing needed as the data is in form of escaped string from snapshot service
    return JSON.parse(entity) as AccountSnapshot;
  };

  getAccountCodeSnippets = async (accountId: string): Promise<CodeSnippetResponse> => {
    const accountSnapshot = await this.getAccountSnapshot(accountId);
    const accountCodeSnippets: AccountCodeSnippet[] = Object.values(accountSnapshot.settings.accountCodeSnippets);
    return {
      allowCodeSnippets: accountSnapshot.settings.allowCodeSnippets,
      accountCodeSnippets
    };
  };
}

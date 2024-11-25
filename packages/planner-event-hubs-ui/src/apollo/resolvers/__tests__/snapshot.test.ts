import { getMockResolverRequestWithDataSources, mockDataSource } from '@resolvers/common/testUtils/mockRequestData';
import { resolveQueryResponse } from '@resolvers/common/testUtils/mockFunction';
import connectionResolver from '@resolvers/snapshot';
import {
  AccountCodeSnippet,
  SnapshotClient,
  CodeSnippetStatus,
  SnapshotResponse,
  CodeSnippetResponse
} from '@dataSources/snapshotsService/client';
import { AccountSnapshot } from '@cvent/planner-event-hubs-model/types';

const snapshot: SnapshotResponse = {
  version: 'PpuWB3_kLE.K18o.qvGV2rkgebHUf9d3',
  snapshot: {
    entityType: 'Account',
    entity:
      '{\n' +
      '   "id":"801538722",\n' +
      '   "name":"CVENTENG",\n' +
      '   "accountStub":"961ec9db-cc71-421e-8cc3-632a3db930fd",\n' +
      '   "settings":{\n' +
      '      "allowCodeSnippets":true,\n' +
      '      "accountCodeSnippets":{\n' +
      '         "845cd4c1-98b1-48bf-815a-88921cc31e3d":{\n' +
      '            "codeSnippetId":"845cd4c1-98b1-48bf-815a-88921cc31e3d",\n' +
      '            "codeSnippetDataTagCode":"TEST",\n' +
      '            "codeSnippetName":"Marketo",\n' +
      '            "codeSnippetStatus":"Approved",\n' +
      '            "codeSnippetValue":"<script>",\n' +
      '            "isDropCodeSnippetToCookieBannerTied":true\n' +
      '         }\n' +
      '      }\n' +
      '   },\n' +
      '   "customFonts":[\n' +
      '      {\n' +
      '         "id":"eabe1e7e-fd73-4b68-bf49-b6423f5d69da",\n' +
      '         "fontFamily":"Fireball",\n' +
      '         "fallbackFontId":4,\n' +
      '         "fallbackFont":"Arial",\n' +
      '         "files":[\n' +
      '            {\n' +
      '               "url":"https://custom.t2.cvent.com/D3F4F6FF65B64E99A58CEF1D8F73A6E9/files/67ccc3a44045461ba2cbd1df6d7e7c5a.woff",\n' +
      '               "fontStyle":"normal",\n' +
      '               "fontWeight":900\n' +
      '            }\n' +
      '         ],\n' +
      '         "isActive":true\n' +
      '      }\n' +
      '   ]\n' +
      '}'
  }
};

const accountCodeSnippet: AccountCodeSnippet[] = [
  {
    codeSnippetDataTagCode: 'TEST',
    codeSnippetId: '845cd4c1-98b1-48bf-815a-88921cc31e3d',
    codeSnippetName: 'Marketo',
    codeSnippetStatus: CodeSnippetStatus.Approved,
    codeSnippetValue: '<script>',
    isDropCodeSnippetToCookieBannerTied: true
  }
];

const codeSnippetResponse: CodeSnippetResponse = {
  allowCodeSnippets: true,
  accountCodeSnippets: accountCodeSnippet
};

const accountSnapshotResponse: AccountSnapshot = {
  id: '801538722',
  accountStub: '961ec9db-cc71-421e-8cc3-632a3db930fd',
  name: 'CVENTENG',
  customFonts: [
    {
      id: 'eabe1e7e-fd73-4b68-bf49-b6423f5d69da',
      fontFamily: 'Fireball',
      fallbackFontId: 4,
      fallbackFont: 'Arial',
      files: [
        {
          url: 'https://custom.t2.cvent.com/D3F4F6FF65B64E99A58CEF1D8F73A6E9/files/67ccc3a44045461ba2cbd1df6d7e7c5a.woff',
          fontStyle: 'normal',
          fontWeight: 900
        }
      ],
      isActive: true
    }
  ]
};

describe('resolvers/snapshot', () => {
  let dataSources;

  beforeEach(() => {
    dataSources = {
      snapshotClient: new SnapshotClient()
    };
  });

  describe('Account snapshot', () => {
    it('Should fetch code snippets for the passed in account', async () => {
      mockDataSource(dataSources.snapshotClient, 'get', snapshot);

      const resolverRequest = getMockResolverRequestWithDataSources('getAccountCodeSnippets', dataSources, {
        accountID: '12345'
      });
      dataSources.snapshotClient.context = resolverRequest.context;
      const response = await resolveQueryResponse(connectionResolver, 'getAccountCodeSnippets', resolverRequest);
      expect(response).toBeTruthy();
      expect(response).toMatchObject(codeSnippetResponse);
    });

    it('Should fetch account snapshot', async () => {
      mockDataSource(dataSources.snapshotClient, 'get', snapshot);
      const resolverRequest = getMockResolverRequestWithDataSources('getAccountSnapshot', dataSources, {
        accountID: '12345'
      });
      dataSources.snapshotClient.context = resolverRequest.context;
      const response = await resolveQueryResponse(connectionResolver, 'getAccountSnapshot', resolverRequest);
      expect(response).toBeTruthy();
      expect(response).toMatchObject(accountSnapshotResponse);
    });
  });
});

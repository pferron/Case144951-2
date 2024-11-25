import { SnapshotResponse, SnapshotClient } from '@dataSources/snapshotsService/client';
import { mockDataSource } from '@resolvers/common/testUtils/mockRequestData';

let dataSource = null;
beforeAll(() => {
  dataSource = new SnapshotClient();
});

const snapshot: SnapshotResponse = {
  version: 'PpuWB3_kLE.K18o.qvGV2rkgebHUf9d3',
  snapshot: {
    entityType: 'Account',
    entity:
      '{\n' +
      '   "id":"801538722",\n' +
      '   "name":"CVENTENG",\n' +
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

describe('Get Account Snapshot', () => {
  beforeEach(() => {
    dataSource.get = jest.fn().mockImplementation(async () => null);
  });

  it('sends GET /snapshot/Account/{accountID}/', async () => {
    const accountID = '123456';
    mockDataSource(dataSource, 'get', snapshot);
    await dataSource.getAccountCodeSnippets(accountID);
    expect(dataSource.get).toHaveBeenCalledWith(
      `/v1/snapshot/Account/${accountID}`,
      { env: `${process.env.ENVIRONMENT_NAME}` },
      { headers: { authorization: `API_KEY ${process.env.API_KEY}` } }
    );
  });
});

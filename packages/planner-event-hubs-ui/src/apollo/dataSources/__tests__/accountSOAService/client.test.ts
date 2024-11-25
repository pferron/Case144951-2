import { mockDataSource, mockDataSourceError } from '@resolvers/common/testUtils/mockRequestData';
import { AccountSOAClient } from '@dataSources/accountSOAService/client';
import accountConfigResponse from '../fixtures/accountConfigData.json';

const mockAccountConfig = {
  AccountFeatures: {
    GeneralFeatures: {
      AIWritingAssistantEnabled: true,
      AllowCodeSnippets: true,
      AllowCustomFonts: true,
      AllowGoogleAnalytics: true,
      AllowOAuth: true
    },
    Blades: {
      AllowVideosBlade: true
    }
  },
  VideoManagementFeatures: {
    VideoStorageSize: 500,
    VideoCenterFlag: true
  },
  InternationalSettings: {
    DefaultLanguageId: 1033,
    DefaultCultureCode: 'en-US'
  },
  EventFeatures: {
    GeneralFeatures: {
      LicenseTypeId: 1
    }
  }
};

let accountSOAClient: AccountSOAClient;

describe('AccountSOAClient', () => {
  beforeEach(() => {
    accountSOAClient = new AccountSOAClient();
  });

  it('sends GET /accountconfig, handling unparsed JSON', async () => {
    mockDataSource(accountSOAClient, 'get', JSON.stringify(accountConfigResponse));
    const response = await accountSOAClient.getAccountConfig();
    expect(accountSOAClient.get).toHaveBeenCalledWith('/accountconfig');
    expect(response).toEqual(mockAccountConfig);
  });

  it('sends GET /accountconfig', async () => {
    mockDataSource(accountSOAClient, 'get', JSON.stringify(accountConfigResponse));
    const response = await accountSOAClient.getAccountConfig();
    expect(accountSOAClient.get).toHaveBeenCalledWith('/accountconfig');
    expect(response).toEqual(mockAccountConfig);
  });

  it('should throw error when fetch fails e.g. 404', async () => {
    mockDataSourceError(accountSOAClient, 'get', 'Not Found', '404');
    await expect(accountSOAClient.getAccountConfig()).rejects.toThrow('Not Found');
  });

  it('sends GET /accountLocale', async () => {
    mockDataSource(accountSOAClient, 'get', JSON.stringify(accountConfigResponse));
    await accountSOAClient.getAccountLocale();
    expect(accountSOAClient.get).toHaveBeenCalledWith('/accountlocale');
  });

  it('sends GET /accountDetails', async () => {
    mockDataSource(accountSOAClient, 'get', JSON.stringify(accountConfigResponse));
    await accountSOAClient.getAccountDetails();
    expect(accountSOAClient.get).toHaveBeenCalledWith('/accountdetailextended');
  });
});

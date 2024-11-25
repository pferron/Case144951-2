import { getMockResolverRequestWithDataSources, mockDataSource } from '@resolvers/common/testUtils/mockRequestData';
import { AccountSOAClient } from '@dataSources/accountSOAService/client';
import { UserSOAClient } from '@dataSources/userSOAService/client';
import { RESTDataSource } from '@dataSources/RESTDataSource/RESTDataSource';
import coreSOAResolver from '@resolvers/coreSOA/index';
import { resolveQueryResponse } from '@resolvers/common/testUtils/mockFunction';
import { AccountLocale, UserPermissions, AccountDetails } from '@cvent/planner-event-hubs-model/types';
import userPermissionsResponse from '../../dataSources/__tests__/fixtures/userPermissionsData.json';
import accountConfigResponse from '../../dataSources/__tests__/fixtures/accountConfigData.json';

let accountLocale: AccountLocale;

describe('resolvers/coreSOA/index', () => {
  let accountSOAClient: AccountSOAClient;
  let userSOAClient: UserSOAClient;
  let dataSources: Record<string, RESTDataSource>;

  beforeEach(() => {
    accountSOAClient = new AccountSOAClient();
    userSOAClient = new UserSOAClient();
    dataSources = { accountSOAClient, userSOAClient };
  });

  accountLocale = {
    Locale: {
      Id: 2052,
      AvailableCultures: [
        {
          LocaleId: 2052
        }
      ]
    },
    IsDefault: false
  };

  const accountDetails: AccountDetails = {
    AccountId: 123456,
    AccountName: 'AutoRed',
    AccountStub: '1234-5678-9012-3456',
    AccountCompanyName: 'cvent'
  };

  describe('accountConfig', () => {
    it('Fetches /accountconfig, returns only Blades.AllowVideosBlade and VideoManagementFeatures', async () => {
      mockDataSource(accountSOAClient, 'get', JSON.stringify(accountConfigResponse));
      const resolverRequest = getMockResolverRequestWithDataSources('Query.accountConfig', dataSources);
      dataSources.accountSOAClient.context = resolverRequest.context;
      const response = await resolveQueryResponse(coreSOAResolver, 'accountConfig', resolverRequest);

      expect(response).toBeTruthy();
      expect(response).toMatchObject({
        AccountFeatures: {
          Blades: {
            AllowVideosBlade: true
          }
        },
        VideoManagementFeatures: {
          VideoStorageSize: 500,
          VideoCenterFlag: true
        }
      });
    });
  });

  describe('accountLocale', () => {
    it('Fetches /accountlocale', async () => {
      mockDataSource(accountSOAClient, 'get', accountLocale);
      const resolverRequest = getMockResolverRequestWithDataSources('Query.accountLocale', dataSources);
      dataSources.accountSOAClient.context = resolverRequest.context;
      const response = await resolveQueryResponse(coreSOAResolver, 'accountLocale', resolverRequest);

      expect(response).toBeTruthy();
      expect(response).toMatchObject({
        Locale: {
          Id: 2052,
          AvailableCultures: [
            {
              LocaleId: 2052
            }
          ]
        },
        IsDefault: false
      });
    });
  });

  /**
   * Permissions are defined as follows:
   * Video Center - AccountConfig.VideoManagementFeature.VideoCenterFlag = true + AccountConfig.Blades.Video = true + User Permission Video Center = FULL ACCESS
   * Video Library - AccountConfig.Blades.Video = true + User Permissions Video Library = FULL ACCESS
   * Video Storage - AccountConfig.Blades.Video = true + User Permissions Video Storage = FULL ACCESS
   */
  describe('userPermissions', () => {
    // Red
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let resolverRequest: Record<string, any>;
    let response: UserPermissions;

    beforeEach(async () => {
      resolverRequest = getMockResolverRequestWithDataSources('Query.accountConfig', dataSources);
      dataSources.accountSOAClient.context = resolverRequest.context;
      dataSources.userSOAClient.context = resolverRequest.context;
    });

    describe('when AccountConfig.Blades is true', () => {
      beforeEach(() => {
        accountConfigResponse.AccountFeatures.Blades.AllowVideosBlade = true;
        mockDataSource(accountSOAClient, 'get', JSON.stringify(accountConfigResponse));
      });

      describe('and AccountConfig.VideoManagementFeature.VideoCenterFlag is true', () => {
        beforeEach(() => {
          accountConfigResponse.VideoManagementFeatures.VideoCenterFlag = true;
          mockDataSource(accountSOAClient, 'get', JSON.stringify(accountConfigResponse));
        });

        describe('and UserPermission.Permissions.CVENT_VIDEO_CENTER_ACCESS is 1', () => {
          it('returns VideoCenter: true', async () => {
            userPermissionsResponse.Permissions.CVENT_VIDEO_CENTER_ACCESS = 1;
            mockDataSource(userSOAClient, 'get', userPermissionsResponse);
            response = await resolveQueryResponse(coreSOAResolver, 'userPermissions', resolverRequest);
            expect(response.VideoCenter).toBeTruthy();
          });
        });

        describe('and UserPermission.Permissions.CVENT_VIDEO_CENTER_ACCESS is not 1', () => {
          it('returns VideoCenter: false', async () => {
            userPermissionsResponse.Permissions.CVENT_VIDEO_CENTER_ACCESS = 0;
            mockDataSource(userSOAClient, 'get', userPermissionsResponse);
            response = await resolveQueryResponse(coreSOAResolver, 'userPermissions', resolverRequest);
            expect(response.VideoCenter).toBeFalsy();
          });
        });
      });

      describe('and AccountConfig.VideoManagementFeature.VideoCenterFlag is false', () => {
        beforeEach(() => {
          accountConfigResponse.VideoManagementFeatures.VideoCenterFlag = false;
          mockDataSource(accountSOAClient, 'get', JSON.stringify(accountConfigResponse));
        });

        describe('and UserPermission.VideoCenter is 1', () => {
          it('returns VideoCenter: false', async () => {
            userPermissionsResponse.Permissions.CVENT_VIDEO_CENTER_ACCESS = 1;
            mockDataSource(userSOAClient, 'get', userPermissionsResponse);
            response = await resolveQueryResponse(coreSOAResolver, 'userPermissions', resolverRequest);
            expect(response.VideoCenter).toBeFalsy();
          });
        });

        describe('and UserPermission.VideoCenter is not 1', () => {
          it('returns VideoCenter: false', async () => {
            userPermissionsResponse.Permissions.CVENT_VIDEO_CENTER_ACCESS = 0;
            userPermissionsResponse.Permissions.CVENT_VIDEO_STORAGE_MANAGEMENT = 1;
            userPermissionsResponse.Permissions.CVENT_VIDEO_LIBRARY_ACCESS = 1;
            mockDataSource(userSOAClient, 'get', userPermissionsResponse);
            response = await resolveQueryResponse(coreSOAResolver, 'userPermissions', resolverRequest);
            expect(response.VideoCenter).toBeFalsy();
          });
        });
      });

      describe('and UserPermissions.VideoLibrary is 1', () => {
        it('returns VideoLibrary: true', async () => {
          userPermissionsResponse.Permissions.CVENT_VIDEO_LIBRARY_ACCESS = 1;
          mockDataSource(userSOAClient, 'get', userPermissionsResponse);
          response = await resolveQueryResponse(coreSOAResolver, 'userPermissions', resolverRequest);
          expect(response.VideoLibrary).toBeTruthy();
        });
      });

      describe('and UserPermissions.VideoLibrary is not 1', () => {
        it('returns VideoLibrary: false', async () => {
          userPermissionsResponse.Permissions.CVENT_VIDEO_LIBRARY_ACCESS = 0;
          mockDataSource(userSOAClient, 'get', userPermissionsResponse);
          response = await resolveQueryResponse(coreSOAResolver, 'userPermissions', resolverRequest);
          expect(response.VideoLibrary).toBeFalsy();
        });
      });

      describe('and UserPermissions.VideoStorage is 1', () => {
        it('returns VideoStorage: true', async () => {
          userPermissionsResponse.Permissions.CVENT_VIDEO_STORAGE_MANAGEMENT = 1;
          mockDataSource(userSOAClient, 'get', userPermissionsResponse);
          response = await resolveQueryResponse(coreSOAResolver, 'userPermissions', resolverRequest);
          expect(response.VideoStorage).toBeTruthy();
        });
      });

      describe('and UserPermissions.VideoStorage is not 1', () => {
        it('returns VideoStorage: false', async () => {
          userPermissionsResponse.Permissions.CVENT_VIDEO_STORAGE_MANAGEMENT = 0;
          mockDataSource(userSOAClient, 'get', userPermissionsResponse);
          response = await resolveQueryResponse(coreSOAResolver, 'userPermissions', resolverRequest);
          expect(response.VideoStorage).toBeFalsy();
        });
      });

      describe('and UserPermissions.EventsPlusCustomHeader is 1', () => {
        beforeEach(() => {
          accountConfigResponse.VideoManagementFeatures.VideoCenterFlag = true;
          mockDataSource(accountSOAClient, 'get', JSON.stringify(accountConfigResponse));
        });
        it('returns EventsPlusCustomHeader: true', async () => {
          userPermissionsResponse.Permissions.CVENT_VIDEO_CENTER_ACCESS = 1;
          userPermissionsResponse.Permissions.CVENT_EVENTS_PLUS_CUSTOM_HEADER = 1;
          mockDataSource(userSOAClient, 'get', userPermissionsResponse);
          response = await resolveQueryResponse(coreSOAResolver, 'userPermissions', resolverRequest);
          expect(response.EventsPlusCustomHeader).toBeTruthy();
        });
      });

      describe('and UserPermissions.EventsPlusCustomHeader is not 1', () => {
        it('returns VideoLibrary: false', async () => {
          userPermissionsResponse.Permissions.CVENT_EVENTS_PLUS_CUSTOM_HEADER = 0;
          mockDataSource(userSOAClient, 'get', userPermissionsResponse);
          response = await resolveQueryResponse(coreSOAResolver, 'userPermissions', resolverRequest);
          expect(response.EventsPlusCustomHeader).toBeFalsy();
        });
      });
    });

    describe('when AccountConfig.Blades is false', () => {
      beforeEach(() => {
        accountConfigResponse.AccountFeatures.Blades.AllowVideosBlade = false;
        mockDataSource(accountSOAClient, 'get', JSON.stringify(accountConfigResponse));
      });
      describe('and AccountConfig.VideoManagementFeature.VideoCenterFlag is true', () => {
        beforeEach(() => {
          accountConfigResponse.VideoManagementFeatures.VideoCenterFlag = true;
          mockDataSource(accountSOAClient, 'get', JSON.stringify(accountConfigResponse));
        });
        describe('and UserPermission.VideoCenter is 1', () => {
          it('returns VideoCenter: false', async () => {
            userPermissionsResponse.Permissions.CVENT_VIDEO_CENTER_ACCESS = 1;
            mockDataSource(userSOAClient, 'get', userPermissionsResponse);
            response = await resolveQueryResponse(coreSOAResolver, 'userPermissions', resolverRequest);
            expect(response.VideoCenter).toBeFalsy();
          });
        });
      });

      describe('and AccountConfig.VideoManagementFeature.VideoCenterFlag is false', () => {
        beforeEach(() => {
          accountConfigResponse.VideoManagementFeatures.VideoCenterFlag = false;
          mockDataSource(accountSOAClient, 'get', JSON.stringify(accountConfigResponse));
        });
        describe('and UserPermission.VideoCenter is 1', () => {
          it('returns VideoCenter: false', async () => {
            userPermissionsResponse.Permissions.CVENT_VIDEO_CENTER_ACCESS = 1;
            mockDataSource(userSOAClient, 'get', userPermissionsResponse);
            response = await resolveQueryResponse(coreSOAResolver, 'userPermissions', resolverRequest);
            expect(response.VideoCenter).toBeFalsy();
          });
        });
      });

      describe('and UserPermissions.VideoLibrary is 1', () => {
        it('returns VideoLibrary: false', async () => {
          userPermissionsResponse.Permissions.CVENT_VIDEO_LIBRARY_ACCESS = 1;
          mockDataSource(userSOAClient, 'get', userPermissionsResponse);
          response = await resolveQueryResponse(coreSOAResolver, 'userPermissions', resolverRequest);
          expect(response.VideoLibrary).toBeFalsy();
        });
      });

      describe('and UserPermissions.VideoStorage is 1', () => {
        it('returns VideoStorage: false', async () => {
          userPermissionsResponse.Permissions.CVENT_VIDEO_STORAGE_MANAGEMENT = 1;
          mockDataSource(userSOAClient, 'get', userPermissionsResponse);
          response = await resolveQueryResponse(coreSOAResolver, 'userPermissions', resolverRequest);
          expect(response.VideoStorage).toBeFalsy();
        });
      });
    });
  });

  describe('accountDetails', () => {
    it('Fetches /accountdetailextended', async () => {
      mockDataSource(accountSOAClient, 'get', accountDetails);
      const resolverRequest = getMockResolverRequestWithDataSources('Query.accountDetails', dataSources);
      dataSources.accountSOAClient.context = resolverRequest.context;
      const response = await resolveQueryResponse(coreSOAResolver, 'accountDetails', resolverRequest);

      expect(response).toBeTruthy();
      expect(response).toMatchObject({
        AccountId: 123456,
        AccountName: 'AutoRed',
        AccountStub: '1234-5678-9012-3456',
        AccountCompanyName: 'cvent'
      });
    });
  });
});

import { UserSOAClient } from '@dataSources/userSOAService/client';
import { mockDataSource, mockDataSourceError } from '@resolvers/common/testUtils/mockRequestData';
import userPermissionsResponse from '../fixtures/userPermissionsData.json';
import userFullInfoListResponse from '../fixtures/userFullInfoListData.json';

let userSOAClient: UserSOAClient;

describe('UserSOAClient', () => {
  beforeEach(() => {
    userSOAClient = new UserSOAClient();
  });

  it('sends GET /permissions, handling unparsed JSON', async () => {
    mockDataSource(userSOAClient, 'get', JSON.stringify(userPermissionsResponse));
    // fetchMock.mockResponseOnce(JSON.stringify(userPermissionsResponse));
    const response = await userSOAClient.getPermissions();
    expect(response).toEqual({
      AccountId: userPermissionsResponse.AccountId,
      RoleStub: userPermissionsResponse.RoleStub,
      EventRoleStubs: userPermissionsResponse.EventRoleStubs,
      Permissions: {
        CVENT_VIDEO_LIBRARY_ACCESS: userPermissionsResponse.Permissions.CVENT_VIDEO_LIBRARY_ACCESS,
        CVENT_VIDEO_CENTER_CONFIGURATION: userPermissionsResponse.Permissions.CVENT_VIDEO_CENTER_CONFIGURATION,
        CVENT_VIDEO_CENTER_CREATION: userPermissionsResponse.Permissions.CVENT_VIDEO_CENTER_CREATION,
        CVENT_VIDEO_UPLOAD: userPermissionsResponse.Permissions.CVENT_VIDEO_UPLOAD,
        CVENT_VIDEO_EDIT: userPermissionsResponse.Permissions.CVENT_VIDEO_EDIT,
        CVENT_VIDEO_CENTER_ACCESS: userPermissionsResponse.Permissions.CVENT_VIDEO_CENTER_ACCESS,
        CVENT_VIDEO_STORAGE_MANAGEMENT: userPermissionsResponse.Permissions.CVENT_VIDEO_STORAGE_MANAGEMENT,
        CVENT_EVENTS_PLUS_CUSTOM_HEADER: userPermissionsResponse.Permissions.CVENT_EVENTS_PLUS_CUSTOM_HEADER
      }
    });

    expect(userSOAClient.get).toHaveBeenCalledWith('/permissions');
  });

  it('sends GET /permissions', async () => {
    mockDataSource(userSOAClient, 'get', userPermissionsResponse);
    // fetchMock.mockResponseOnce(JSON.stringify(userPermissionsResponse));
    const response = await userSOAClient.getPermissions();
    expect(response).toEqual({
      AccountId: userPermissionsResponse.AccountId,
      RoleStub: userPermissionsResponse.RoleStub,
      EventRoleStubs: userPermissionsResponse.EventRoleStubs,
      Permissions: {
        CVENT_VIDEO_LIBRARY_ACCESS: userPermissionsResponse.Permissions.CVENT_VIDEO_LIBRARY_ACCESS,
        CVENT_VIDEO_CENTER_CONFIGURATION: userPermissionsResponse.Permissions.CVENT_VIDEO_CENTER_CONFIGURATION,
        CVENT_VIDEO_CENTER_CREATION: userPermissionsResponse.Permissions.CVENT_VIDEO_CENTER_CREATION,
        CVENT_VIDEO_UPLOAD: userPermissionsResponse.Permissions.CVENT_VIDEO_UPLOAD,
        CVENT_VIDEO_EDIT: userPermissionsResponse.Permissions.CVENT_VIDEO_EDIT,
        CVENT_VIDEO_CENTER_ACCESS: userPermissionsResponse.Permissions.CVENT_VIDEO_CENTER_ACCESS,
        CVENT_VIDEO_STORAGE_MANAGEMENT: userPermissionsResponse.Permissions.CVENT_VIDEO_STORAGE_MANAGEMENT,
        CVENT_EVENTS_PLUS_CUSTOM_HEADER: userPermissionsResponse.Permissions.CVENT_EVENTS_PLUS_CUSTOM_HEADER
      }
    });

    expect(userSOAClient.get).toHaveBeenCalledWith('/permissions');
  });

  it('should throw error when fetch fails e.g. 404', async () => {
    mockDataSourceError(userSOAClient, 'get', 'Not Found', '404');

    await expect(userSOAClient.getPermissions()).rejects.toThrow('Not Found');
  });

  it('sends GET /getDetails', async () => {
    mockDataSource(userSOAClient, 'get', JSON.stringify(userFullInfoListResponse));
    await userSOAClient.getDetails('2844256e-9d1d-4ed9-b031-5d32540b21e0');
    expect(userSOAClient.get).toHaveBeenCalledWith('/FullInfoList', {
      userStub: '2844256e-9d1d-4ed9-b031-5d32540b21e0'
    });
  });
});

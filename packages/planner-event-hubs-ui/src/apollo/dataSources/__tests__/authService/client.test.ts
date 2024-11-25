import { Headers } from 'apollo-server-env';
import { AUTH_COOKIE_MAX_AGE } from '@utils/constants';
import { RequestOptions } from '../../RESTDataSource/RESTDataSource';
import { AuthClient } from '../../authService/client';

describe('AuthClient', () => {
  let dataSource: AuthClient;
  let hubId: string;
  let environment: string;
  let accountMappingId: string;
  let accountId: string;

  const requestOptions: RequestOptions = {
    path: '/',
    params: new URLSearchParams(),
    headers: new Headers()
  };

  beforeEach(() => {
    hubId = 'waka-123';
    environment = 'test';
    accountMappingId = 'wiki-wam-wozzle';
    dataSource = new AuthClient();
    dataSource.post = jest.fn().mockImplementation(async () => null);
    dataSource.get = jest.fn().mockImplementation(async () => null);
    dataSource.put = jest.fn().mockImplementation(async () => null);
  });

  describe('setStandardHeaders(request)', () => {
    it('sets Authorization header to API_KEY process.env.API_KEY', () => {
      dataSource.setStandardHeaders(requestOptions);
      expect(requestOptions.headers.get('Authorization')).toEqual(`API_KEY ${process.env.API_KEY}`);
    });
  });

  describe('willSendRequest(request)', () => {
    it('calls setStandardHeaders(request)', () => {
      dataSource.setStandardHeaders = jest.fn().mockImplementation(async () => null);
      dataSource.willSendRequest(requestOptions);
      expect(dataSource.setStandardHeaders).toHaveBeenCalledWith(requestOptions);
    });
  });

  describe('publicLogin(hubId, environment, accountMappingId', () => {
    it('POST /access_token with required metadata and grantedAuthorizations', async () => {
      await dataSource.publicLogin(hubId, environment, accountMappingId, accountId);
      expect(dataSource.post).toHaveBeenCalledWith(`/access_token?accessTokenTTL=${AUTH_COOKIE_MAX_AGE}`, {
        metadata: {
          accountMappingId,
          VideoCenterId: hubId,
          environment
        },
        grantedAuthorizations: [
          {
            appId: process.env.VIDEO_HUB_SERVICE_APP_ID,
            roles: ['video-center:anonymous']
          },
          {
            appId: process.env.UNIVERSAL_VIDEO_APP_ID,
            roles: ['videos:read']
          },
          {
            appId: process.env.UNIVERSAL_CONTACTS_APP_ID,
            roles: ['contacts:read']
          }
        ]
      });
    });
  });

  describe('verifyToken(accessToken)', () => {
    it('GET /access_token Verification', async () => {
      const dummyAccessToken = 'dummyAccessToken';
      await dataSource.verifyToken(dummyAccessToken);
      expect(dataSource.get).toHaveBeenCalledWith(`/access_token/${dummyAccessToken}/verify`);
    });
  });

  describe('refreshToken(accessToken)', () => {
    it('PUT /access_token Refresh', async () => {
      const dummyRefreshAccessToken = 'dummyRefreshAccessToken';
      await dataSource.accessTokenRefresh(dummyRefreshAccessToken);
      expect(dataSource.put).toHaveBeenCalledWith(`/access_token/${dummyRefreshAccessToken}/refresh`);
    });
  });
});

import { S3ProxyHandler } from '@server/S3ProxyHandler';
import { RESTDataSource } from '@dataSources/RESTDataSource/RESTDataSource';
import { IncomingHttpHeaders } from 'http';
import { ApiError } from 'next/dist/server/api-utils';
import { Mage } from '@server/__TestUtils__/mockS3ProxyHandlers';
import { grantedAccessToken } from '@server/__TestUtils__/mockData';
import { AuthClient } from '@cvent/auth-client';

jest.mock('@server/getAppfeatures.ts');

/**
 * Example S3 Proxy Callback Payload
 {
    "fileId": "d6b2fdb3f1523c9ffa73a33bfa57c42b",
    "fullFilePath": "myfiledirectory/videos/myvideo.mov",
    "location": "https://s3.amazonaws.com/video-sync-upload-bucket-sg50/dev/myfiledirectory/videos/myvideo.mov",
    "status": "SCAN_SUCCESS",
    "failureReason": ""
  }
 */

let centerId: string;
let entityId: string;
let entityType: string;
let environment: string;

class TestClient extends RESTDataSource {}
describe('S3ProxyHandler', () => {
  describe('isSupportedEntity', () => {
    it('returns true when a handler is registered for the entityType', () => {
      S3ProxyHandler.handlers = { Magic: Mage };
      expect(S3ProxyHandler.isSupportedEntity('Magic')).toBeTruthy();
    });

    it('returns false otherwise', () => {
      expect(S3ProxyHandler.isSupportedEntity('Blah')).toBeFalsy();
    });
  });

  describe('newEntityHandler(entityType, centerId, entityId, environment)', () => {
    it('returns the specified new handler instance based on entityType', () => {
      S3ProxyHandler.handlers = { Healer: Mage };
      entityType = 'Healer';
      centerId = '123';
      entityId = '321';
      const entityHandler = S3ProxyHandler.newEntityHandler(
        grantedAccessToken,
        entityType,
        centerId,
        entityId,
        environment
      );
      expect(entityHandler).toBeInstanceOf(Mage);
    });

    it('throws ApiError when provided an unsupported entityType', () => {
      expect(() => {
        S3ProxyHandler.newEntityHandler(grantedAccessToken, 'nonsense', centerId, entityId, environment);
      }).toThrow(ApiError);
    });
  });

  describe('setupDataSource(name, dataSource, headers)', () => {
    let dataSource: RESTDataSource;
    let handler: Mage;
    let name: string;
    let headers: IncomingHttpHeaders;

    beforeEach(() => {
      name = 'Mage';
      centerId = 'blah';
      entityId = 'halb';
      environment = 'test';
      headers = {
        authorization: 'bearer token'
      };
      dataSource = new TestClient();
      handler = new Mage(grantedAccessToken, centerId, entityId, environment);
    });

    it('initializes the handler.context', () => {
      handler.testSetupDataSource(name, dataSource, headers);
      expect(handler.context.dataSources[name]).toEqual(dataSource);
      expect(handler.context.headers).toEqual(headers);
    });

    it('initializes the dataSource with the handler.context', () => {
      handler.testSetupDataSource(name, dataSource, headers);
      expect(dataSource.context).toEqual(handler.context);
    });
  });

  describe('authenticate(authorization, authClient)', () => {
    let authClient: AuthClient;
    const authorization = 'bearer token';

    beforeEach(() => {
      authClient = new AuthClient({ endpoint: 'localhost', apiKey: 'abc' });
    });

    afterEach(() => {
      jest.clearAllMocks();
    });
    it('fetches the GrantedAccessToken from authClient', async () => {
      authClient.verifyAccessToken = jest.fn().mockImplementation(async () => grantedAccessToken);
      const receivedAccessToken = await S3ProxyHandler.verifyAuthorization(authorization, authClient);
      expect(receivedAccessToken).toEqual(grantedAccessToken);
    });

    it('returns false when the token is invalid (auth-client throws error)', async () => {
      authClient.verifyAccessToken = jest.fn().mockImplementation(async () => {
        throw Error('Not authenticated.');
      });
      const receivedAccessToken = await S3ProxyHandler.verifyAuthorization(authorization, authClient);
      expect(receivedAccessToken).toBeFalsy();
    });

    it('returns false when no Authorization header is set', async () => {
      authClient.verifyAccessToken = jest.fn().mockImplementation(async () => {
        throw Error('Not authenticated.');
      });
      const receivedAccessToken = await S3ProxyHandler.verifyAuthorization(null, authClient);
      expect(receivedAccessToken).toBeFalsy();
    });
  });
});

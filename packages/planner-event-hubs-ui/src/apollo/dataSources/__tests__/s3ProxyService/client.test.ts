import { S3ProxyClient } from '@dataSources/s3ProxyService/client';
import { RequestOptions } from '@dataSources/RESTDataSource/RESTDataSource';
import { mockDataSource } from '@resolvers/common/testUtils/mockRequestData';
import { Headers, URLSearchParams } from 'apollo-server-env';

const accountMappingId = 'account-mapping-id';
const filePath = 'account-mapping-id/VideoCenter/contact/profile/images/ProfileImage1.JPG';

describe('S3ProxyClient/client', () => {
  let dataSource: S3ProxyClient;
  const environment = 'T2';
  const requestOptions: RequestOptions = {
    path: '/',
    params: new URLSearchParams(),
    headers: new Headers()
  };
  beforeEach(() => {
    dataSource = new S3ProxyClient();
    dataSource.initialize({ context: { headers: {} }, cache: undefined });
    requestOptions.params = new URLSearchParams();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('delete(filePath)', () => {
    // accountIdentifier is intentionally agnostic from s3proxy perspective but should be the account mapping id when possible
    // https://cvent.slack.com/archives/CHPF1BMS7/p1654179188403059
    it('calls POST /delete/{accountIdentifier}?filePath={imageRelativePath}&environment={env}', async () => {
      dataSource.context.auth = {
        authorization: {
          metadata: {
            accountMappingId,
            environment
          }
        }
      };
      mockDataSource(dataSource, 'post', {});
      await dataSource.deleteFile(filePath);
      expect(dataSource.post).toHaveBeenCalledWith(
        `/delete/${accountMappingId}?filePath=${encodeURIComponent(filePath)}&environment=${environment}`,
        {}
      );
    });
  });

  describe('checkScanStatus(fileId, filePath)', () => {
    it('calls GET /scan/status?filePath={imageRelativePath}&environment={env}&fileId={fileId}', async () => {
      dataSource.context.auth = {
        authorization: {
          metadata: {
            environment
          }
        }
      };
      const fileId = 'c8dc7a471302387b131e2232bd9e9ffe';
      mockDataSource(dataSource, 'get', {});
      await dataSource.checkScanStatus(fileId, filePath);
      expect(dataSource.get).toHaveBeenCalledWith('/scan/status', {
        environment: 'T2',
        fileId,
        filePath
      });
    });
  });

  describe('moveFile(fromPath, toPath)', () => {
    it('calls POST /move/{accountMappingId}?accountType&fileFrom&fileTo&environment', async () => {
      const fromPath = '000000/111111/333333.jpg';
      const toPath = '12345/blah/whatnot.jpg';
      dataSource.context.auth = {
        authorization: {
          metadata: {
            environment,
            accountMappingId
          }
        }
      };
      mockDataSource(dataSource, 'post', 'https://blah/blah');
      await dataSource.moveFile(fromPath, toPath);
      expect(dataSource.post).toHaveBeenCalledWith(
        `/move/${accountMappingId}?accountType=CVENT_CORE&fileFrom=${encodeURIComponent(
          fromPath
        )}&fileTo=${encodeURIComponent(toPath)}&environment=${environment}`
      );
    });

    it('does not call POST /move/... when fromPath === toPath, simply return the toPath', async () => {
      const fromPath = '12345/blah/whatnot.jpg';
      const toPath = fromPath;
      mockDataSource(dataSource, 'post', 'https://blah/blah');
      const finalPath = await dataSource.moveFile(fromPath, toPath);
      expect(finalPath).toEqual(toPath);
      expect(dataSource.post).not.toHaveBeenCalled();
    });
  });

  describe('generatePreSignedUrl(fullFilePath, callBackUrl)', () => {
    it('calls POST /link/upload/{accountIdentifier}?fullFilePath={imageRelativePath}&environment={env}&callBackUrl={callBackUrl}&callBackBearerToken={callBackBearerToken}', async () => {
      const callbackUrl = 'http://localhost:3000/callBack/url';
      const bearer = 'token';
      dataSource.context.auth = {
        authorization: {
          metadata: {
            accountMappingId,
            environment
          }
        },
        accessToken: bearer
      };
      mockDataSource(dataSource, 'post', {});
      await dataSource.generatePreSignedUrl(filePath, callbackUrl);
      expect(dataSource.post).toHaveBeenCalledWith(
        `/link/upload/${accountMappingId}?environment=${environment}&fullFilePath=${encodeURIComponent(
          filePath
        )}&callBackUrl=${encodeURIComponent(callbackUrl)}&callBackBearerToken=${bearer}`,
        {}
      );
    });

    it('downcases image path data in fullFilePath and callBackUrl for ILS compatibility', async () => {
      const callbackUrl = 'http://localhost:3000/callBack/url';
      const bearer = 'token';
      dataSource.context.auth = {
        authorization: {
          metadata: {
            accountMappingId,
            environment
          }
        },
        accessToken: bearer
      };
      mockDataSource(dataSource, 'post', {});
      await dataSource.generatePreSignedUrl(filePath, callbackUrl);
      expect(dataSource.post).toHaveBeenCalledWith(
        `/link/upload/${accountMappingId}?environment=${environment}&fullFilePath=${encodeURIComponent(
          filePath
        )}&callBackUrl=${encodeURIComponent(callbackUrl)}&callBackBearerToken=${bearer}`,
        {}
      );
    });
  });

  describe('setStandardHeaders(requestOptions)', () => {
    it('sets Authorization header to API_Key {process.env.API_KEY}', () => {
      dataSource.setStandardHeaders(requestOptions);
      expect(requestOptions.headers.get('Authorization')).toEqual(`API_KEY ${process.env.API_KEY}`);
    });

    it('sets x-skip-cache', () => {
      dataSource.setStandardHeaders(requestOptions);
      expect(requestOptions.headers.get('x-skip-cache')).toEqual('1');
    });
  });

  describe('willSendRequest(requestOptions)', () => {
    it('calls this.setStandardHeaders(requestOptions)', () => {
      dataSource.setStandardHeaders = jest.fn().mockImplementation();
      dataSource.willSendRequest(requestOptions);
      expect(dataSource.setStandardHeaders).toHaveBeenCalledWith(requestOptions);
    });

    it('resets any filePath query param with a lower case version for ILS compatibility when filePath param exists', () => {
      requestOptions.params.set('filePath', filePath);
      dataSource.willSendRequest(requestOptions);
      expect(requestOptions.params.get('filePath')).toEqual(filePath.toLowerCase());
    });

    it('resets any fullFilePath query param with a lower case version for ILS compatibility when fullFilePath param exists', () => {
      requestOptions.params.set('fullFilePath', filePath);
      dataSource.willSendRequest(requestOptions);
      expect(requestOptions.params.get('fullFilePath')).toEqual(filePath.toLowerCase());
    });
  });
});

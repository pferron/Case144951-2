import { ImageLookupClient } from '@dataSources/imageLookupService/client';
import { RequestOptions } from '@dataSources/RESTDataSource/RESTDataSource';
import { mockDataSource } from '@resolvers/common/testUtils/mockRequestData';
import { Headers } from 'apollo-server-env';

describe('ImageLookupService/client', () => {
  let dataSource: ImageLookupClient;
  const masterImageUrl = 'https://s3/cvent/account/blah';
  const hashedURL = 'https://images.cvent.com/IODJFIOWEJFEOWIJWOEIJFOWEIJF.jpg';
  const requestOptions: RequestOptions = {
    path: '/',
    params: new URLSearchParams(),
    headers: new Headers()
  };
  beforeEach(() => {
    dataSource = new ImageLookupClient();
    dataSource.initialize({ context: { headers: {}, environment: 'unit-test' }, cache: undefined });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('lookup(masterImageUrl)', () => {
    it('calls POST /assets/lookup?environment=X, attaching masterImageUrl to url properties in object list of payload', () => {
      mockDataSource(dataSource, 'post', {
        data: {
          'https://s3/cvent/account/blah': { hashedURL }
        }
      });
      dataSource.lookup([masterImageUrl]);
      expect(dataSource.post).toHaveBeenCalledWith('/assets/lookup?environment=unit-test', [{ url: masterImageUrl }]);
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
  });
});

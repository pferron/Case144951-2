import { URLSearchParams, Headers } from 'apollo-server-env';
import { RequestOptions, Request, Response } from '../RESTDataSource/RESTDataSource';
import { CvestDataSource } from '../CvestDataSource';

class SlumberSource extends CvestDataSource {
  requestOptions: RequestOptions;

  constructor() {
    super();
    this.baseURL = 'http://localhost:3000';
  }

  public async restCall(): Promise<void> {
    return this.get('/');
  }
}

describe('CvestDataSource', () => {
  let dataSource: SlumberSource;

  const requestOptions: RequestOptions = {
    path: '/',
    params: new URLSearchParams(),
    headers: new Headers()
  };

  const requestOptionsForAccountToken: RequestOptions = {
    path: '/',
    params: new URLSearchParams(),
    headers: new Headers()
  };

  const mappingId = 'abc-123';

  beforeEach(() => {
    dataSource = new SlumberSource();
    dataSource.context = {
      headers: {},
      auth: {}
    };
  });

  describe('willSendRequest(request)', () => {
    beforeEach(async () => {
      dataSource.setStandardParams = jest.fn().mockImplementation(async () => null);
      dataSource.setStandardHeaders = jest.fn().mockImplementation(async () => null);
      dataSource.willSendRequest(requestOptions);
    });

    it('sets standardParams, like environment', async () => {
      expect(dataSource.setStandardParams).toHaveBeenCalled();
    });

    it('sets standardHeaders, like AccountMappingId', () => {
      expect(dataSource.setStandardHeaders).toHaveBeenCalled();
    });
  });

  describe('cacheKeyFor(request)', () => {
    it('returns the request.url with "AccountMappingId:<uuid>" prefixed to the request.url', () => {
      // this prefix protects from unexpected cross-account access to cache data
      const request = new Request(undefined);
      dataSource.context.auth.authorization = {
        metadata: {
          accountMappingId: mappingId
        }
      };
      const cacheKey = dataSource.cacheKeyFor(request);
      expect(cacheKey).toEqual(`AccountMappingId:${mappingId}:${request.url}`);
    });
  });

  describe('cacheOptionsFor(response, request)', () => {
    let successResponse;
    beforeEach(() => {
      successResponse = new Response(undefined, {
        status: 200
      });
    });
    it('returns undefined to respect cache hints from server when conditions are right', () => {
      const request = new Request(undefined, {
        method: 'GET'
      });
      dataSource.context.auth.authorization = {
        metadata: {
          accountMappingId: mappingId
        }
      };
      const cacheOptions = dataSource.cacheOptionsFor(successResponse, request);
      expect(cacheOptions).toBeUndefined();
    });

    describe('when conditions are not right, return { ttl: 0 } to disable caching', () => {
      it('when request.method is not GET', () => {
        const request = new Request(undefined, {
          method: 'PUT',
          headers: {
            AccountMappingId: mappingId
          }
        });
        const cacheOptions = dataSource.cacheOptionsFor(successResponse, request);
        expect(cacheOptions).toEqual({ ttl: 0 });
      });

      it('when request.headers do not contain AccountMappingId', () => {
        const request = new Request(undefined, {
          method: 'GET'
        });
        const cacheOptions = dataSource.cacheOptionsFor(successResponse, request);
        expect(cacheOptions).toEqual({ ttl: 0 });
      });

      it('when response.status < 200', () => {
        const request = new Request(undefined, {
          method: 'GET',
          headers: {
            AccountMappingId: mappingId
          }
        });
        const response = new Response(undefined, { status: 100 });
        const cacheOptions = dataSource.cacheOptionsFor(response, request);
        expect(cacheOptions).toEqual({ ttl: 0 });
      });

      it('when response.status > 299', () => {
        const request = new Request(undefined, {
          method: 'GET',
          headers: {
            AccountMappingId: mappingId
          }
        });
        const response = new Response(undefined, { status: 304 });
        const cacheOptions = dataSource.cacheOptionsFor(response, request);
        expect(cacheOptions).toEqual({ ttl: 0 });
      });
    });
  });

  describe('standardParams', () => {
    afterEach(() => {
      requestOptions.params.delete('environment');
    });

    it('does not override environment when already set', () => {
      requestOptions.params.set('environment', 'Space');
      dataSource.setStandardParams(requestOptions);
      expect(requestOptions.params.get('environment')).toEqual('Space');
    });

    it('sets environment from context if available', () => {
      dataSource.context.environment = 'test';
      dataSource.setStandardParams(requestOptions);
      expect(requestOptions.params.get('environment')).toEqual(dataSource.context.environment);
    });

    it('sets environment from context.auth otherwise', () => {
      dataSource.context.auth = {
        authorization: {
          metadata: { environment: 'test2' }
        }
      };
      dataSource.setStandardParams(requestOptions);
      expect(requestOptions.params.get('environment')).toEqual(
        dataSource.context.auth.authorization.metadata.environment
      );
    });
  });

  describe('standardHeaders', () => {
    it('sets Authorization as bearer when Authorization header isEmpty() && this.context.auth is truthy', () => {
      dataSource.context.auth = { accessToken: 'token' };
      dataSource.setStandardHeaders(requestOptions);
      expect(requestOptions.headers.get('Authorization')).toEqual('BEARER token');
    });

    it('sets Authorization as bearer when Authorization header isEmpty() && this.context.accountToken is truthy', () => {
      dataSource.context.accountToken = 'Bearer accountToken';
      dataSource.setStandardHeaders(requestOptionsForAccountToken);
      expect(requestOptionsForAccountToken.headers.get('Authorization')).toEqual('Bearer accountToken');
    });

    it('sets AccountId from client header', () => {
      dataSource.context.headers.accountId = '123';
      dataSource.setStandardHeaders(requestOptions);
      expect(requestOptions.headers.get('AccountId')).toEqual(dataSource.context.headers.accountId);
    });

    it('sets Logging details', () => {
      dataSource.context.headers.HttpLogPageLoadId = 'abc';
      dataSource.context.headers.HttpLogRequestId = 'xyz';
      dataSource.setStandardHeaders(requestOptions);
      expect(requestOptions.headers.get('HttpLogPageLoadId')).toEqual(dataSource.context.headers.HttpLogPageLoadId);
      expect(requestOptions.headers.get('HttpLogRequestId')).toEqual(dataSource.context.headers.HttpLogRequestId);
    });
  });
});

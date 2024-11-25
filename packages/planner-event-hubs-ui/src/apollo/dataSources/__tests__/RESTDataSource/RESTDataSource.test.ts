// RED
/* eslint-disable @typescript-eslint/no-explicit-any */

import { ApolloError, AuthenticationError, ForbiddenError } from 'apollo-server-errors';
import { fetch, URL, Request } from '../../__TestUtils__/mock-apollo-server-env';

import { RESTDataSource, RequestOptions } from '../../RESTDataSource/RESTDataSource';

import { HTTPCache } from '../../RESTDataSource/HTTPCache';
import { MapKeyValueCache } from '../../__TestUtils__/MapKeyValueCache';

describe('RESTDataSource', () => {
  let httpCache: HTTPCache;

  beforeEach(() => {
    httpCache = new HTTPCache(new MapKeyValueCache<string>());
  });

  beforeEach(() => {
    fetch.mockReset();
  });

  describe('constructing requests', () => {
    it('interprets paths relative to the base URL', async () => {
      const dataSource = new (class extends RESTDataSource {
        baseURL = 'https://api.example.com';

        public getFoo(): Promise<string> {
          return this.get('foo');
        }
      })();

      dataSource.httpCache = httpCache;

      fetch.mockJSONResponseOnce();

      await dataSource.getFoo();

      expect(fetch).toHaveBeenCalledTimes(1);
      expect((fetch.mock.calls[0][0] as Request).url).toEqual('https://api.example.com/foo');
    });

    it('interprets paths with a leading slash relative to the base URL', async () => {
      const dataSource = new (class extends RESTDataSource {
        baseURL = 'https://api.example.com/bar';

        public getFoo(): Promise<string> {
          return this.get('/foo');
        }
      })();

      dataSource.httpCache = httpCache;

      fetch.mockJSONResponseOnce();

      await dataSource.getFoo();

      expect(fetch).toHaveBeenCalledTimes(1);
      expect((fetch.mock.calls[0][0] as Request).url).toEqual('https://api.example.com/bar/foo');
    });

    it('adds a trailing slash to the base URL if needed', async () => {
      const dataSource = new (class extends RESTDataSource {
        baseURL = 'https://example.com/api';

        public getFoo(): Promise<string> {
          return this.get('foo');
        }
      })();

      dataSource.httpCache = httpCache;

      fetch.mockJSONResponseOnce();

      await dataSource.getFoo();

      expect(fetch).toHaveBeenCalledTimes(1);
      expect((fetch.mock.calls[0][0] as Request).url).toEqual('https://example.com/api/foo');
    });

    it('allows resolving a base URL asynchronously', async () => {
      const dataSource = new (class extends RESTDataSource {
        public async resolveURL(request: RequestOptions): Promise<URL> {
          if (!this.baseURL) {
            this.baseURL = 'https://api.example.com';
          }
          return super.resolveURL(request);
        }

        public getFoo(): Promise<string> {
          return this.get('foo');
        }
      })();

      dataSource.httpCache = httpCache;

      fetch.mockJSONResponseOnce();
      await dataSource.getFoo();

      expect(fetch).toHaveBeenCalledTimes(1);
      expect((fetch.mock.calls[0][0] as Request).url).toEqual('https://api.example.com/foo');
    });

    it('allows passing in query string parameters', async () => {
      const dataSource = new (class extends RESTDataSource {
        baseURL = 'https://api.example.com';

        public getPostsForUser(
          username: string,
          params: { filter: string; limit: number; offset: number }
        ): Promise<Response> {
          return this.get('posts', { username, ...params });
        }
      })();

      dataSource.httpCache = httpCache;

      fetch.mockJSONResponseOnce();

      await dataSource.getPostsForUser('beyoncé', {
        filter: 'jalapeño',
        limit: 10,
        offset: 20
      });

      expect(fetch).toHaveBeenCalledTimes(1);
      expect((fetch.mock.calls[0][0] as Request).url).toEqual(
        'https://api.example.com/posts?username=beyonc%C3%A9&filter=jalape%C3%B1o&limit=10&offset=20'
      );
    });

    it('allows setting default query string parameters', async () => {
      const dataSource = new (class extends RESTDataSource {
        baseURL = 'https://api.example.com';

        public willSendRequest(request: RequestOptions): void {
          request.params.set('api_key', this.context.token);
        }

        public getFoo(): Promise<string> {
          return this.get('foo', { a: 1 });
        }
      })();

      dataSource.context = { token: 'secret' };
      dataSource.httpCache = httpCache;

      fetch.mockJSONResponseOnce();

      await dataSource.getFoo();

      expect(fetch).toHaveBeenCalledTimes(1);
      expect((fetch.mock.calls[0][0] as Request).url).toEqual('https://api.example.com/foo?a=1&api_key=secret');
    });

    // For documentation purposes. Ultimately we want to switch from node-fetch to @cvent/fetch (HUB-59966).
    // RED
    // eslint-disable-next-line jest/no-disabled-tests
    it.skip('allows setting default fetch options', async () => {
      const dataSource = new (class extends RESTDataSource {
        baseURL = 'https://api.example.com';

        public willSendRequest(request: RequestOptions): void {
          request.credentials = 'include';
        }

        public getFoo(): Promise<string> {
          return this.get('foo');
        }
      })();

      dataSource.httpCache = httpCache;

      fetch.mockJSONResponseOnce();

      await dataSource.getFoo();

      expect(fetch).toHaveBeenCalledTimes(1);
      // TODO: request.credentials is not supported by node-fetch
      // expect(fetch.mock.calls[0][0].credentials).toEqual('include');
    });

    it('allows setting request headers', async () => {
      const dataSource = new (class extends RESTDataSource {
        baseURL = 'https://api.example.com';

        public willSendRequest(request: RequestOptions): void {
          request.headers.set('Authorization', this.context.token);
        }

        public getFoo(): Promise<string> {
          return this.get('foo');
        }
      })();

      dataSource.context = { token: 'secret' };
      dataSource.httpCache = httpCache;

      fetch.mockJSONResponseOnce();

      await dataSource.getFoo();

      expect(fetch).toHaveBeenCalledTimes(1);
      expect((fetch.mock.calls[0][0] as Request).headers.get('Authorization')).toEqual('secret');
    });

    it('serializes a request body that is an object as JSON', async () => {
      const dataSource = new (class extends RESTDataSource {
        baseURL = 'https://api.example.com';

        public postFoo(foo: object): Promise<Response> {
          return this.post('foo', foo);
        }
      })();

      dataSource.httpCache = httpCache;

      fetch.mockJSONResponseOnce();

      await dataSource.postFoo({ foo: 'bar' });
      expect(fetch).toHaveBeenCalledTimes(1);
      const request = fetch.mock.calls[0][0] as Request;
      expect(request.url).toEqual('https://api.example.com/foo');
      // request.body is a node-fetch extension which we aren't properly
      // capturing in our TS types.
      expect((request as any).body.toString()).toEqual(JSON.stringify({ foo: 'bar' }));
      expect(request.headers.get('Content-Type')).toEqual('application/json');
    });

    it('serializes a request body that is an array as JSON', async () => {
      const dataSource = new (class extends RESTDataSource {
        baseURL = 'https://api.example.com';

        public postFoo(foo: string[]): Promise<Response> {
          return this.post('foo', foo);
        }
      })();

      dataSource.httpCache = httpCache;

      fetch.mockJSONResponseOnce();

      await dataSource.postFoo(['foo', 'bar']);
      expect(fetch).toHaveBeenCalledTimes(1);
      const request = fetch.mock.calls[0][0] as Request;
      expect(request.url).toEqual('https://api.example.com/foo');
      // request.body is a node-fetch extension which we aren't properly
      // capturing in our TS types.
      expect((request as any).body.toString()).toEqual(JSON.stringify(['foo', 'bar']));
      expect(request.headers.get('Content-Type')).toEqual('application/json');
    });

    it('serializes a request body that has a toJSON method as JSON', async () => {
      const dataSource = new (class extends RESTDataSource {
        baseURL = 'https://api.example.com';

        public postFoo(foo: Model): Promise<Response> {
          return this.post('foo', foo);
        }
      })();

      dataSource.httpCache = httpCache;

      fetch.mockJSONResponseOnce();

      class Model {
        private readonly baz;

        constructor(baz: any) {
          this.baz = baz;
        }

        public toJSON(): object {
          return {
            foo: this.baz
          };
        }
      }
      const model = new Model('bar');

      await dataSource.postFoo(model);
      expect(fetch).toHaveBeenCalledTimes(1);
      const request = fetch.mock.calls[0][0] as Request;
      expect(request.url).toEqual('https://api.example.com/foo');
      // request.body is a node-fetch extension which we aren't properly
      // capturing in our TS types.
      expect((request as any).body.toString()).toEqual(JSON.stringify({ foo: 'bar' }));
      expect(request.headers.get('Content-Type')).toEqual('application/json');
    });

    it('does not serialize a request body that is not an object', async () => {
      const dataSource = new (class extends RESTDataSource {
        baseURL = 'https://api.example.com';

        public postFoo(foo: FormData): Promise<Response> {
          return this.post('foo', foo);
        }
      })();

      dataSource.httpCache = httpCache;

      fetch.mockJSONResponseOnce();

      class FormData {}
      const form = new FormData();

      await dataSource.postFoo(form);

      expect(fetch).toHaveBeenCalledTimes(1);
      const request = fetch.mock.calls[0][0] as Request;
      expect(request.url).toEqual('https://api.example.com/foo');
      // request.body is a node-fetch extension which we aren't properly
      // capturing in our TS types.
      expect((request as any).body.toString()).not.toEqual('{}');
      expect(request.headers.get('Content-Type')).not.toEqual('application/json');
    });

    for (const method of ['GET', 'POST', 'PATCH', 'PUT', 'DELETE']) {
      const dataSource = new (class extends RESTDataSource {
        baseURL = 'https://api.example.com';

        public getFoo(): Promise<Response> {
          return this.get('foo');
        }

        public postFoo(): Promise<Response> {
          return this.post('foo');
        }

        public patchFoo(): Promise<Response> {
          return this.patch('foo');
        }

        public putFoo(): Promise<Response> {
          return this.put('foo');
        }

        public deleteFoo(): Promise<Response> {
          return this.delete('foo');
        }
      })();

      // RED
      // eslint-disable-next-line no-loop-func
      it(`allows performing ${method} requests`, async () => {
        dataSource.httpCache = httpCache;

        fetch.mockJSONResponseOnce(undefined, undefined, { foo: 'bar' });
        const data = await (dataSource as any)[`${method.toLocaleLowerCase()}Foo`]();

        expect(data).toEqual({ foo: 'bar' });

        expect(fetch).toHaveBeenCalledTimes(1);
        expect((fetch.mock.calls[0][0] as Request).method).toEqual(method);
      });
    }
  });

  describe('response parsing', () => {
    it('returns data as parsed JSON when Content-Type is application/json', async () => {
      const dataSource = new (class extends RESTDataSource {
        baseURL = 'https://api.example.com';

        public getFoo(): Promise<Response> {
          return this.get('foo');
        }
      })();

      dataSource.httpCache = httpCache;

      fetch.mockJSONResponseOnce({ 'Content-Type': 'application/json' }, undefined, { foo: 'bar' });

      const data = await dataSource.getFoo();

      expect(data).toEqual({ foo: 'bar' });
    });

    it('returns data as parsed JSON when Content-Type is application/hal+json', async () => {
      const dataSource = new (class extends RESTDataSource {
        baseURL = 'https://api.example.com';

        public getFoo(): Promise<Response> {
          return this.get('foo');
        }
      })();

      dataSource.httpCache = httpCache;

      fetch.mockJSONResponseOnce({ 'Content-Type': 'application/hal+json' }, undefined, { foo: 'bar' });

      const data = await dataSource.getFoo();

      expect(data).toEqual({ foo: 'bar' });
    });

    it('returns data as parsed JSON when Content-Type ends in +json', async () => {
      const dataSource = new (class extends RESTDataSource {
        baseURL = 'https://api.example.com';

        public getFoo(): Promise<Response> {
          return this.get('foo');
        }
      })();

      dataSource.httpCache = httpCache;

      fetch.mockJSONResponseOnce({ 'Content-Type': 'application/vnd.api+json' }, undefined, { foo: 'bar' });

      const data = await dataSource.getFoo();

      expect(data).toEqual({ foo: 'bar' });
    });

    it('returns data as a string when Content-Type is text/plain', async () => {
      const dataSource = new (class extends RESTDataSource {
        baseURL = 'https://api.example.com';

        public getFoo(): Promise<Response> {
          return this.get('foo');
        }
      })();

      dataSource.httpCache = httpCache;

      fetch.mockResponseOnce('bar', { 'Content-Type': 'text/plain' });

      const data = await dataSource.getFoo();

      expect(data).toEqual('bar');
    });

    it('attempts to return data as a string when no Content-Type header is returned', async () => {
      const dataSource = new (class extends RESTDataSource {
        baseURL = 'https://api.example.com';

        public getFoo(): Promise<Response> {
          return this.get('foo');
        }
      })();

      dataSource.httpCache = httpCache;

      fetch.mockResponseOnce('bar');

      const data = await dataSource.getFoo();

      expect(data).toEqual('bar');
    });

    it('returns data as a string when response status code is 204 no content', async () => {
      const dataSource = new (class extends RESTDataSource {
        baseURL = 'https://api.example.com';

        public getFoo(): Promise<Response> {
          return this.get('');
        }
      })();

      dataSource.httpCache = httpCache;

      fetch.mockResponseOnce('', { 'Content-Type': 'application/json' }, 204);

      const data = await dataSource.getFoo();

      expect(data).toEqual('');
    });

    it('returns empty object when response content length is 0', async () => {
      const dataSource = new (class extends RESTDataSource {
        baseURL = 'https://api.example.com';

        public getFoo(): Promise<Response> {
          return this.get('');
        }
      })();

      dataSource.httpCache = httpCache;

      fetch.mockResponseOnce('', {
        'Content-Type': 'application/json',
        'Content-Length': '0'
      });

      const data = await dataSource.getFoo();

      expect(data).toEqual('');
    });
  });

  describe('memoization', () => {
    it('deduplicates requests with the same cache key', async () => {
      const dataSource = new (class extends RESTDataSource {
        baseURL = 'https://api.example.com';

        public getFoo(id: number): Promise<Response> {
          return this.get(`foo/${id}`);
        }
      })();

      dataSource.httpCache = httpCache;

      fetch.mockJSONResponseOnce();

      await Promise.all([dataSource.getFoo(1), dataSource.getFoo(1)]);

      expect(fetch).toHaveBeenCalledTimes(1);
      expect((fetch.mock.calls[0][0] as Request).url).toEqual('https://api.example.com/foo/1');
    });

    it('does not deduplicate requests with a different cache key', async () => {
      const dataSource = new (class extends RESTDataSource {
        baseURL = 'https://api.example.com';

        public getFoo(id: number): Promise<Response> {
          return this.get(`foo/${id}`);
        }
      })();

      dataSource.httpCache = httpCache;

      fetch.mockJSONResponseOnce();
      fetch.mockJSONResponseOnce();

      await Promise.all([dataSource.getFoo(1), dataSource.getFoo(2)]);

      expect(fetch.mock.calls.length).toEqual(2);
      expect((fetch.mock.calls[0][0] as Request).url).toEqual('https://api.example.com/foo/1');
      expect((fetch.mock.calls[1][0] as Request).url).toEqual('https://api.example.com/foo/2');
    });

    it('does not deduplicate non-GET requests', async () => {
      const dataSource = new (class extends RESTDataSource {
        baseURL = 'https://api.example.com';

        public postFoo(id: number): Promise<Response> {
          return this.post(`foo/${id}`);
        }
      })();

      dataSource.httpCache = httpCache;

      fetch.mockJSONResponseOnce();
      fetch.mockJSONResponseOnce();

      await Promise.all([dataSource.postFoo(1), dataSource.postFoo(1)]);

      expect(fetch.mock.calls.length).toEqual(2);
    });

    it('non-GET request removes memoized request with the same cache key', async () => {
      const dataSource = new (class extends RESTDataSource {
        baseURL = 'https://api.example.com';

        public getFoo(id: number): Promise<Response> {
          return this.get(`foo/${id}`);
        }

        public postFoo(id: number): Promise<Response> {
          return this.post(`foo/${id}`);
        }
      })();

      dataSource.httpCache = httpCache;

      fetch.mockJSONResponseOnce();
      fetch.mockJSONResponseOnce();
      fetch.mockJSONResponseOnce();

      await Promise.all([dataSource.getFoo(1), dataSource.postFoo(1), dataSource.getFoo(1)]);

      expect(fetch.mock.calls.length).toEqual(3);
      expect((fetch.mock.calls[0][0] as Request).url).toEqual('https://api.example.com/foo/1');
      expect((fetch.mock.calls[2][0] as Request).url).toEqual('https://api.example.com/foo/1');
    });

    it('allows specifying a custom cache key', async () => {
      const dataSource = new (class extends RESTDataSource {
        baseURL = 'https://api.example.com';

        // RED
        // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
        public cacheKeyFor(request: Request) {
          const url = new URL(request.url);
          url.search = '';
          return url.toString();
        }

        public getFoo(id: number, apiKey: string): Promise<Response> {
          return this.get(`foo/${id}`, { api_key: apiKey });
        }
      })();

      dataSource.httpCache = httpCache;

      fetch.mockJSONResponseOnce();

      await Promise.all([dataSource.getFoo(1, 'secret'), dataSource.getFoo(1, 'anotherSecret')]);

      expect(fetch).toHaveBeenCalledTimes(1);
      expect((fetch.mock.calls[0][0] as Request).url).toEqual('https://api.example.com/foo/1?api_key=secret');
    });
  });

  describe('error handling', () => {
    it('throws an AuthenticationError when the response status is 401', async () => {
      const dataSource = new (class extends RESTDataSource {
        baseURL = 'https://api.example.com';

        public getFoo(): Promise<Response> {
          return this.get('foo');
        }
      })();

      dataSource.httpCache = httpCache;

      fetch.mockResponseOnce('Invalid token', undefined, 401);

      const result = dataSource.getFoo();
      await expect(result).rejects.toThrow(AuthenticationError);
      await expect(result).rejects.toMatchObject({
        extensions: {
          code: 'UNAUTHENTICATED',
          response: {
            status: 401,
            body: 'Invalid token'
          }
        }
      });
    });

    it('throws a ForbiddenError when the response status is 403', async () => {
      const dataSource = new (class extends RESTDataSource {
        baseURL = 'https://api.example.com';

        public getFoo(): Promise<Response> {
          return this.get('foo');
        }
      })();

      dataSource.httpCache = httpCache;

      fetch.mockResponseOnce('No access', undefined, 403);

      const result = dataSource.getFoo();
      await expect(result).rejects.toThrow(ForbiddenError);
      await expect(result).rejects.toMatchObject({
        extensions: {
          code: 'FORBIDDEN',
          response: {
            status: 403,
            body: 'No access'
          }
        }
      });
    });

    it('throws an ApolloError when the response status is 500', async () => {
      const dataSource = new (class extends RESTDataSource {
        baseURL = 'https://api.example.com';

        public getFoo(): Promise<Response> {
          return this.get('foo');
        }
      })();

      dataSource.httpCache = httpCache;

      fetch.mockResponseOnce('Oops', undefined, 500);

      const result = dataSource.getFoo();
      await expect(result).rejects.toThrow(ApolloError);
      await expect(result).rejects.toMatchObject({
        extensions: {
          response: {
            status: 500,
            body: 'Oops'
          }
        }
      });
    });

    it('puts JSON error responses on the error as an object', async () => {
      const dataSource = new (class extends RESTDataSource {
        baseURL = 'https://api.example.com';

        public getFoo(): Promise<Response> {
          return this.get('foo');
        }
      })();

      dataSource.httpCache = httpCache;

      fetch.mockResponseOnce(
        JSON.stringify({
          errors: [
            {
              message: 'Houston, we have a problem.'
            }
          ]
        }),
        { 'Content-Type': 'application/json' },
        500
      );

      const result = dataSource.getFoo();
      await expect(result).rejects.toThrow(ApolloError);
      await expect(result).rejects.toMatchObject({
        extensions: {
          response: {
            status: 500,
            body: {
              errors: [
                {
                  message: 'Houston, we have a problem.'
                }
              ]
            }
          }
        }
      });
    });
  });

  describe('trace', () => {
    it('is called once per request', async () => {
      const traceMock = jest.fn();
      const dataSource = new (class extends RESTDataSource {
        baseURL = 'https://api.example.com';

        public getFoo(): Promise<Response> {
          return this.get('foo');
        }

        trace = traceMock;
      })();

      dataSource.httpCache = httpCache;

      fetch.mockJSONResponseOnce();

      await dataSource.getFoo();

      expect(traceMock).toHaveBeenCalledTimes(1);
      expect(traceMock).toHaveBeenCalledWith(expect.any(Object), expect.any(Function));
    });
  });
});

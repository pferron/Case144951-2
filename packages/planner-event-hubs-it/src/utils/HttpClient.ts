import { RequestOptions, RESTDataSource, Response, Request } from 'apollo-datasource-rest';
import { LoggerFactory } from '@cvent/logging/LoggerFactory';

export class HttpClient extends RESTDataSource {
  private apiKey: string;

  LOG = LoggerFactory.create('RedisClientTest');

  constructor() {
    super();
    this.baseURL = `${process.env.BASE_URL}/api`;
  }

  protected willSendRequest(request: RequestOptions): void {
    request.headers.set('Authorization', `api_key ${this.apiKey}`);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected didReceiveResponse<TResult = any>(response: Response, _request: Request): Promise<TResult> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return response as any as Promise<TResult>;
  }

  public setApiKey(token: string): void {
    this.apiKey = token;
  }

  public setStandardHeaders(request: RequestOptions): void {
    // If a request provides its own Authorization header, leave it alone. For example, VideoCenterClient.getHubByApiKey().
    // If no Authorization header is set AND the auth context is set, populate with the bearer.
    if (request.headers.get('Authorization') === '' && (this.context.accountToken || this.context.auth)) {
      request.headers.set('Authorization', this.context.accountToken || `BEARER ${this.context.auth?.accessToken}`);
    }
    const { accountId } = this.context.headers;
    if (accountId) {
      request.headers.set('AccountId', accountId);
    }

    this.setLoggingHeaders(request);
  }

  public setLoggingHeaders(request: RequestOptions): void {
    request.headers.set(
      'HttpLogPageLoadId',
      this.context.headers.HttpLogPageLoadId || this.context.headers.httplogpageloadid
    );
    request.headers.set(
      'HttpLogRequestId',
      this.context.headers.HttpLogRequestId || this.context.headers.httplogrequestid
    );
  }
}

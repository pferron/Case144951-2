import { HttpClient } from '@utils/HttpClient';
import { LoggerFactory } from '@cvent/logging/LoggerFactory';
import { AccessTokenOptions, AuthClient } from '@cvent/auth-client';
import { RequestOptions } from 'apollo-datasource-rest';
import { CacheOptions } from 'apollo-datasource-rest/dist/RESTDataSource';
import { v4 as uuidV4 } from 'uuid';
import { authOptions } from './helpers/connectToApiAsPlanner';

const LOG = LoggerFactory.create('skippedRows.test');

class PlannerClient extends HttpClient {
  private accessToken: string | undefined;

  private authClient: AuthClient;

  LOG = LoggerFactory.create('PlannerClient.test');

  constructor() {
    super();
    this.baseURL = `${process.env.BASE_URL}/api`;
    if (!process.env.AUTH_SERVICE || !process.env.NORMANDY_API_KEY) {
      throw new Error('AUTH_SERVICE environment variable is required');
    }
    this.authClient = new AuthClient({
      endpoint: process.env.AUTH_SERVICE,
      apiKey: process.env.NORMANDY_API_KEY
    });
  }

  protected cacheOptionsFor(_): CacheOptions {
    return { ttl: 0 };
  }

  protected willSendRequest(request: RequestOptions): void {
    request.headers.set('Cookie', `cvent-auth=${this.accessToken}; Path=/; HttpOnly;`);
  }

  public setPlannerBearer(token: string): void {
    this.accessToken = token;
  }

  public async authenticate(authData: AccessTokenOptions): Promise<void> {
    try {
      const response = await this.authClient.createAccessToken({
        authorization: authData.authorization
      });
      this.accessToken = response.accessToken;
    } catch (e) {
      LOG.error('PlannerClient failed to authenticate with', authData, e);
    }
  }

  public async testCallback(queryString: string): Promise<Response> {
    const response = await this.get(`/translations/skippedRows?${queryString}`);
    return response;
  }
}

const environment: string = process.env.ENVIRONMENT_NAME || 'ci';

describe('export', () => {
  let goodClient: PlannerClient;
  let importId: string;

  beforeAll(async () => {
    goodClient = new PlannerClient();
    const config = {
      context: {
        headers: { ignore: 'me' },
        environment
      },
      cache: undefined
    };
    goodClient.initialize(config);
    await goodClient.authenticate(authOptions);
  });

  it('returns 500 when data is not found', async () => {
    const callbackResponse = await goodClient.testCallback(
      `environment=${process.env.ENVIRONMENT_NAME}&hubId=${uuidV4()}&locale=en-US&importId=${importId}`
    );
    expect(callbackResponse.status).toEqual(500);
  });
});

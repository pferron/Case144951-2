/* eslint-disable jest/no-standalone-expect */
import { HttpClient } from '@utils/HttpClient';
import { LoggerFactory } from '@cvent/logging/LoggerFactory';
import { AccessTokenOptions, AuthClient } from '@cvent/auth-client';
import { RequestOptions } from 'apollo-datasource-rest';
import { skipItIfProdEnvironment } from '@utils/commonUtils';
import { expect } from '@jest/globals';
import { CacheOptions } from 'apollo-datasource-rest/dist/RESTDataSource';
import { authOptions } from '@helpers/connectToApiAsPlanner';

const LOG = LoggerFactory.create('silo.test');

class PlannerClient extends HttpClient {
  private accessToken: string;

  private csrfToken: string;

  private authClient: AuthClient;

  LOG = LoggerFactory.create('PlannerClient.test');

  constructor() {
    super();
    this.baseURL = `${process.env.BASE_URL}/api`;
    this.authClient = new AuthClient({
      endpoint: process.env.AUTH_SERVICE,
      apiKey: process.env.NORMANDY_API_KEY
    });
  }

  protected cacheOptionsFor(_): CacheOptions {
    return { ttl: 0 };
  }

  protected willSendRequest(request: RequestOptions): void {
    request.headers.set('Authorization', `bearer ${this.accessToken}`);
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
      this.csrfToken = response.csrfToken;
    } catch (e) {
      LOG.error('PlannerClient failed to authenticate with', authData, e);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async testCallback(payload: object): Promise<any> {
    return this.post(`/silo`, payload);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async testCallbackGet(): Promise<any> {
    return this.get(`/silo`);
  }
}

const environment: string = process.env.ENVIRONMENT_NAME;

describe('siloLogin', () => {
  const targetUrl = `${process.env.BASE_URL}/eventsplus`;
  const mode = 'core_redirect';
  const accessToken = 'db86bbf2526f5e593856651d9ab62da4';
  let badClient: PlannerClient;
  let goodClient: PlannerClient;

  beforeAll(async () => {
    goodClient = new PlannerClient();
    badClient = new PlannerClient();
    const config = {
      context: {
        headers: { ignore: 'me' },
        environment
      }
    };
    goodClient.initialize(config);
    badClient.initialize(config);

    await goodClient.authenticate(authOptions);
  });

  skipItIfProdEnvironment()('return redirect to the target url', async () => {
    const callbackResponse = await goodClient.testCallback({
      mode: `${mode}`,
      target_url: `${targetUrl}`,
      access_token: `${accessToken}`
    });
    expect(callbackResponse.status).toEqual(200);
    expect(callbackResponse.url).toContain(`eventsplus`);
  });

  skipItIfProdEnvironment()('supports only POST', async () => {
    const response = await goodClient.testCallbackGet();
    expect(response.status).toEqual(404);
  });

  skipItIfProdEnvironment()('requires correct mode', async () => {
    const badMode = 'test';
    const response = await goodClient.testCallback({
      mode: `${badMode}`,
      target_url: `${targetUrl}`,
      access_token: `${accessToken}`
    });
    expect(response.status).toEqual(404);
  });
});

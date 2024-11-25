// FIREBALL
/* eslint-disable jest/no-standalone-expect */
import { HttpClient } from '@utils/HttpClient';
import { LoggerFactory } from '@cvent/logging/LoggerFactory';
import { AccessTokenOptions, AuthClient } from '@cvent/auth-client';
import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { RequestOptions } from 'apollo-datasource-rest';
import { CacheOptions } from 'apollo-datasource-rest/dist/RESTDataSource';
import { skipItIfProdEnvironment } from '@utils/commonUtils';
import { v4 as uuidV4 } from 'uuid';
import { newBannerData } from './fixtures/bannerData';
import { createBanner, deleteBanner } from './helpers/bannerFunctions';
import { newHubData } from './fixtures/hubData';
import { createHub, rawDeleteHub } from './helpers/hubFunctions';
import { authOptions, connectToApiAsPlanner } from './helpers/connectToApiAsPlanner';

const LOG = LoggerFactory.create('s3proxyUploadCallback.test');

class PlannerClient extends HttpClient {
  private accessToken: string;

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async testCallback(queryString: string): Promise<any> {
    const response = await this.get(`/translations/export?${queryString}`);
    return response;
  }
}

const environment: string = process.env.ENVIRONMENT_NAME;

describe('export', () => {
  let centerId: string;
  let entityId: string;
  let badClient: PlannerClient;
  let goodClient: PlannerClient;
  let client: ApolloClient<NormalizedCacheObject>;

  beforeAll(async () => {
    goodClient = new PlannerClient();
    badClient = new PlannerClient();
    const config = {
      context: {
        headers: { ignore: 'me' },
        environment
      },
      cache: undefined
    };
    goodClient.initialize(config);
    badClient.initialize(config);

    client = await connectToApiAsPlanner(authOptions);
    centerId = await createHub(client, newHubData);
    newBannerData.centerId = centerId;
    entityId = await createBanner(client, newBannerData);
    await goodClient.authenticate(authOptions);
  });

  afterAll(async () => {
    await deleteBanner(client, centerId, entityId);
    await rawDeleteHub(client, { id: centerId });
  });

  it('returns the full list of data', async () => {
    const callbackResponse = await goodClient.testCallback(
      `environment=${process.env.ENVIRONMENT_NAME}&hubId=${centerId}&locale=en-US`
    );
    expect(callbackResponse.status).toEqual(200);
    expect(callbackResponse.headers.get('content-type')).toEqual('text/csv');
    expect(callbackResponse.headers.get('content-disposition')).toEqual(`attachment; filename=${centerId}-en-US.csv`);
  });

  it('returns only the created banner data translations', async () => {
    const callbackResponse = await goodClient.testCallback(
      `environment=${process.env.ENVIRONMENT_NAME}&hubId=${centerId}&locale=en-US&type=custom-translation`
    );
    expect(callbackResponse.status).toEqual(200);
  });

  it('returns 404 when hub is not found', async () => {
    const callbackResponse = await goodClient.testCallback(
      `environment=${process.env.ENVIRONMENT_NAME}&hubId=${uuidV4()}&locale=en-US`
    );
    expect(callbackResponse.status).toEqual(404);
  });

  skipItIfProdEnvironment()('requires valid auth', async () => {
    const response = await badClient.testCallback(`environment=${environment}&hubId=${centerId}&locale=en-US`);
    expect(response.status).toEqual(401);
  });
});

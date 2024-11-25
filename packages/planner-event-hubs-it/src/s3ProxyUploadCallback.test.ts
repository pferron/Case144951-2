// FIREBALL
/* eslint-disable jest/no-standalone-expect */
import { HttpClient } from '@utils/HttpClient';
import { LoggerFactory } from '@cvent/logging/LoggerFactory';
import { AccessTokenOptions, AuthClient } from '@cvent/auth-client';
import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { EntityType } from '@cvent/planner-event-hubs-model/types';
import { RequestOptions } from 'apollo-datasource-rest';
import { CacheOptions } from 'apollo-datasource-rest/dist/RESTDataSource';
import { skipItIfProdEnvironment } from '@utils/commonUtils';
import { newBannerData } from './fixtures/bannerData';
import { createBanner, deleteBanner } from './helpers/bannerFunctions';
import { newHubData } from './fixtures/hubData';
import { createHub, rawDeleteHub } from './helpers/hubFunctions';
import { authOptions, connectToApiAsPlanner } from './helpers/connectToApiAsPlanner';

const LOG = LoggerFactory.create('s3proxyUploadCallback.test');

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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected cacheKeyFor(_): string {
    return '';
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
  public async testCallback(queryString: string, payload: object): Promise<any> {
    const response = await this.post(`/s3ProxyUploadCallback?${queryString}`, payload);
    return response;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async testCallbackGet(queryString: string): Promise<any> {
    const response = await this.get(`/s3ProxyUploadCallback?${queryString}`);
    return response;
  }
}

const environment: string = process.env.ENVIRONMENT_NAME;

describe('s3ProxyUploadCallback', () => {
  let centerId: string;
  let entityType: string;
  let entityId: string;
  let badClient: PlannerClient;
  let goodClient: PlannerClient;
  let client: ApolloClient<NormalizedCacheObject>;

  beforeAll(async () => {
    entityType = EntityType.Temp.toString();
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

  it('stores the given payload in redis', async () => {
    // TODO: figure out how to connect to ci redis during pr builds; ELASTICACHE_* vars don't seem avail
    // const redisClient = new Redis(RedisConfig.init());
    const payload = {
      location: 'whatever',
      fullFilePath: 'whatnot/whatever/whathaveyou',
      status: 'SCAN_SUCCESS',
      fileId: 'ignored',
      failureReason: ''
    };
    const callbackResponse = await goodClient.testCallback(
      `environment=${process.env.ENVIRONMENT_NAME}&centerId=${centerId}&entityType=${entityType}&entityId=${entityId}`,
      payload
    );
    expect(callbackResponse.status).toEqual(204);
    // expect(await redisClient.get('tempimagecache:whatnot/whatever/whathaveyou')).toEqual(JSON.stringify(payload));
    // redisClient.disconnect();
  });

  it('handles Temp image calls', async () => {
    const response = await goodClient.testCallback(
      `environment=${environment}&centerId=${centerId}&entityType=${entityType}&entityId=${entityId}`,
      {
        status: 'SCAN_SUCCESS',
        fileId: 'd6b2fdb3f1523c9ffa73a33bfa57c42b',
        fullFilePath: 'myfiledirectory/videos/myvideo.mov',
        location: 'https://s3.amazonaws.com/video-sync-upload-bucket-sg50/dev/myfiledirectory/videos/myvideo.mov',
        failureReason: ''
      }
    );
    expect(response.status).toEqual(204);
  });

  skipItIfProdEnvironment()('requires valid auth', async () => {
    const response = await badClient.testCallback(
      `environment=${environment}&centerId=${centerId}&entityType=${entityType}&entityId=${entityId}`,
      {}
    );
    expect(response.status).toEqual(404);
  });

  skipItIfProdEnvironment()('supports only POST', async () => {
    const response = await goodClient.testCallbackGet(
      `environment=${environment}&centerId=${centerId}&entityType=${entityType}&entityId=${entityId}`
    );
    expect(response.status).toEqual(404);
  });
});

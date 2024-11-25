// FIREBALL
/* eslint-disable jest/no-standalone-expect */
import { HttpClient } from '@utils/HttpClient';
import { skipItIfProdEnvironment } from '@utils/commonUtils';

class RedisClientTest extends HttpClient {
  constructor() {
    super();
    this.baseURL = `${process.env.BASE_URL}/api`;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async testGet(queryString: string): Promise<any> {
    const response = await this.get(`/redis?${queryString}`);
    return response;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async testDelete(queryString: string): Promise<any> {
    const response = await this.delete(`/redis?${queryString}`);
    return response;
  }
}

const environment: string = process.env.ENVIRONMENT_NAME;

const getGoodClient = (): RedisClientTest => {
  const goodClient = new RedisClientTest();
  const config = {
    context: {
      headers: { ignore: 'me' },
      environment
    },
    cache: undefined
  };
  goodClient.initialize(config);

  goodClient.setApiKey(process.env.API_KEY);
  return goodClient;
};

describe('redis app support', () => {
  it('requires allows key request', async () => {
    const response = await getGoodClient().testGet('key=value');
    expect(response.status).toEqual(200);
  });

  it('requires allows key request with delete', async () => {
    const response = await getGoodClient().testDelete('key=value&delete=true');
    expect(response.status).toEqual(200);
  });

  it('requires allows keys search', async () => {
    const response = await getGoodClient().testGet('keys=*');
    expect(response.status).toEqual(200);
  });

  skipItIfProdEnvironment()('requires sending a valid command', async () => {
    const response = await getGoodClient().testGet('something=else');
    expect(response.status).toEqual(400);
  });
});

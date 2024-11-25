import { ShortUrlResponse, WeeClient } from '@dataSources/weeService/client';
import {
  mockDataSource,
  mockDataSourceAgain,
  mockDataSourceError,
  mockDataSourceOnce
} from '@resolvers/common/testUtils/mockRequestData';

describe('WeeService/client', () => {
  let dataSource: WeeClient;

  beforeEach(() => {
    dataSource = new WeeClient();
    dataSource.context = {
      headers: { AccountId: 'account-id' },
      auth: {
        authorization: {
          metadata: {
            environment: 'unit-test',
            accountId: 'account-Id'
          }
        }
      }
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  const serviceResponse = {
    url: 'http://videohub.com/video-hubs/03cc5185-6707-4cb1-bea5-1a9a463c4b26/channels/227abfd5-1a9f-4f81-b59d-d277f95b0320',
    domainName: 'cvent.com',
    hash: 'ORL1NB',
    shortUrl: 'https://staging.cvent.me/ORL1NB'
  };

  const cventDomainShortUrlResponse: ShortUrlResponse = {
    url: 'https://staging.cvent.me/eventsplus/fc2222bc-d671-4d1b-83b6-f5fc2987ae8c',
    domainName: 'staging.cvent.me',
    hash: 'mQNBM9',
    shortUrl: 'https://staging.cvent.me/mQNBM9',
    referenceId: 'DE4D0B00',
    tags: ['']
  };

  it('create short url throws unauthorized error', async () => {
    mockDataSourceError(dataSource, 'post', 'unauthorized', '401');

    await expect(async () => {
      await dataSource.createShortUrl('https://testUrl', ['WEB']);
    }).rejects.toThrow('unauthorized');
  });

  it('create short urls in bulk: unauth error', async () => {
    mockDataSourceError(dataSource, 'post', 'unauthorized', '401');
    await expect(async () => {
      await dataSource.createShortUrlBulk(null);
    }).rejects.toThrow('unauthorized');
  });

  it('create short urls in bulk: success response', async () => {
    mockDataSource(dataSource, 'post', [cventDomainShortUrlResponse]);
    await expect(dataSource.createShortUrlBulk(null)).resolves.toStrictEqual([cventDomainShortUrlResponse]);
  });

  it('get short urls by tag: unauth error', async () => {
    mockDataSourceError(dataSource, 'get', 'unauthorized', '401');
    await expect(async () => {
      await dataSource.getShortUrlsByTag(['tag1', 'tag2'], 5, 5);
    }).rejects.toThrow('unauthorized');
  });

  it('get short urls by tag: success response', async () => {
    const response = { urls: cventDomainShortUrlResponse, totalCount: 5, offset: 1, limit: 1 };
    mockDataSource(dataSource, 'get', [response]);
    await expect(dataSource.getShortUrlsByTag(['tag1', 'tag2'], 5, 5)).resolves.toStrictEqual([response]);
    expect(dataSource.get).toHaveBeenCalledWith('urls', {
      tags: 'tag1,tag2',
      offset: 5,
      limit: 5
    });
  });

  it('get short urls by tag in batches: unauth error', async () => {
    mockDataSourceError(dataSource, 'get', 'unauthorized', '401');
    await expect(dataSource.getShortUrlsByTagInBatches(['tag1', 'tag2'], 'center-id')).resolves.toStrictEqual([]);
    expect(dataSource.get).toHaveBeenCalledWith('urls', {
      tags: 'tag1,tag2',
      offset: 1,
      limit: 50
    });
  });

  it('get short urls by tag in batches: Success response without pagination', async () => {
    mockDataSourceOnce(dataSource, 'get', { urls: cventDomainShortUrlResponse, totalCount: 10, offset: 1, limit: 50 });
    await expect(dataSource.getShortUrlsByTagInBatches(['tag1', 'tag2'], 'center-id')).resolves.toStrictEqual([
      cventDomainShortUrlResponse
    ]);
    expect(dataSource.get).toHaveBeenCalledWith('urls', {
      tags: 'tag1,tag2',
      offset: 1,
      limit: 50
    });
    expect(dataSource.get).toHaveBeenCalledTimes(1);
  });

  it('get short urls by tag in batches: Success response with pagination', async () => {
    mockDataSourceOnce(dataSource, 'get', { urls: cventDomainShortUrlResponse, totalCount: 55, offset: 1, limit: 50 });
    mockDataSourceAgain(dataSource, 'get', {
      urls: cventDomainShortUrlResponse,
      totalCount: 55,
      offset: 51,
      limit: 50
    });
    await expect(dataSource.getShortUrlsByTagInBatches(['tag1', 'tag2'], 'center-id')).resolves.toStrictEqual([
      cventDomainShortUrlResponse,
      cventDomainShortUrlResponse
    ]);
    expect(dataSource.get).toHaveBeenCalledWith('urls', {
      tags: 'tag1,tag2',
      offset: 1,
      limit: 50
    });
    expect(dataSource.get).toHaveBeenCalledWith('urls', {
      tags: 'tag1,tag2',
      offset: 51,
      limit: 50
    });
    expect(dataSource.get).toHaveBeenCalledTimes(2);
  });

  it('short url with useDomainName flag', async () => {
    dataSource.post = jest.fn().mockImplementation(async () => serviceResponse);
    const shortUrlResponse = await dataSource.createShortUrl('https://staging.cvent.me', ['WEB'], true);
    expect(shortUrlResponse.shortUrl).toEqual('https://staging.cvent.me/ORL1NB');
  });
});

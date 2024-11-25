import { VideoCenterClient } from '@dataSources/videoCenterService/client';
import { ShortUrlResponse, WeeClient } from '@dataSources/weeService/client';
import { mockDataSource, mockDataSourceError } from '@resolvers/common/testUtils/mockRequestData';
import { fetchAndCreateShortUrlByTag } from '@resolvers/common/dataAccess/shortUrl';
import videoCenterResponse from '@resolvers/__tests__/fixtures/videoCenterResponse.json';

let datasources;

const cventDomainShortUrlResponse: ShortUrlResponse = {
  url: 'https://staging.cvent.me/eventsplus/fc2222bc-d671-4d1b-83b6-f5fc2987ae8c',
  domainName: 'staging.cvent.me',
  hash: 'mQNBM9',
  shortUrl: 'https://staging.cvent.me/mQNBM9',
  referenceId: 'DE4D0B00',
  tags: ['']
};

const customDomainShortUrlResponse: ShortUrlResponse = {
  url: 'https://t2-penguin.seevent.com/eventsplus/fc2222bc-d671-4d1b-83b6-f5fc2987ae8c',
  domainName: 't2-penguin.seevent.com',
  hash: 'mQNBM9',
  shortUrl: 'https://t2-penguin.seevent.com/mQNBM9',
  referenceId: 'DE4D0B00',
  tags: ['']
};
describe('ShortUrlTest', () => {
  beforeEach(() => {
    datasources = {
      videoCenterClient: new VideoCenterClient(),
      weeClient: new WeeClient()
    };
    mockDataSource(datasources.videoCenterClient, 'getHub', videoCenterResponse);
    mockDataSource(datasources.weeClient, 'getShortUrlsByTagInBatches', [cventDomainShortUrlResponse]);
    mockDataSource(datasources.weeClient, 'createShortUrlBulk', [
      {
        shortUrlResponse: {
          ...cventDomainShortUrlResponse,
          referenceId: 'channels',
          shortUrl: 'https://staging.cvent.me/newlyCreatedTag'
        },
        httpStatus: 201
      }
    ]);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('fetchAndCreateShortUrlByTag: Failure to get short url from video hub', async () => {
    mockDataSourceError(datasources.videoCenterClient, 'getHub', 'Internal Error', '500');
    await expect(
      fetchAndCreateShortUrlByTag('video-center-id', datasources.weeClient, datasources.videoCenterClient)
    ).rejects.toThrow('Internal Error');
    expect(datasources.videoCenterClient.getHub).toHaveBeenCalledTimes(1);
    expect(datasources.weeClient.getShortUrlsByTagInBatches).toHaveBeenCalledTimes(0);
  });

  it('fetchAndCreateShortUrlByTag: Invalid short url with hub', async () => {
    mockDataSource(datasources.videoCenterClient, 'getHub', { ...videoCenterResponse, url: 'google.com' });
    await expect(
      fetchAndCreateShortUrlByTag('video-center-id', datasources.weeClient, datasources.videoCenterClient)
    ).resolves.toStrictEqual([]);
    expect(datasources.videoCenterClient.getHub).toHaveBeenCalledTimes(1);
    expect(datasources.weeClient.getShortUrlsByTagInBatches).toHaveBeenCalledTimes(0);
  });

  it('fetchAndCreateShortUrlByTag: Failure to get short url by tags from wee service', async () => {
    mockDataSourceError(datasources.weeClient, 'getShortUrlsByTagInBatches', 'Internal Error', '500');
    await expect(
      fetchAndCreateShortUrlByTag('video-center-id', datasources.weeClient, datasources.videoCenterClient)
    ).rejects.toThrow('Internal Error');
    expect(datasources.videoCenterClient.getHub).toHaveBeenCalledTimes(1);
    expect(datasources.weeClient.getShortUrlsByTagInBatches).toHaveBeenCalledTimes(1);
    // validating URL tags should be of cvent domain
    expect(datasources.weeClient.getShortUrlsByTagInBatches).toHaveBeenCalledWith(
      [
        'upcomingevents#hub#video-center-id#domainName#https://web-staging.cvent.com',
        'channels#hub#video-center-id#domainName#https://web-staging.cvent.com',
        'videos#hub#video-center-id#domainName#https://web-staging.cvent.com',
        'registration#hub#video-center-id#domainName#https://web-staging.cvent.com'
      ],
      'video-center-id'
    );
  });

  it('fetchAndCreateShortUrlByTag: Tags should be of custom domain', async () => {
    mockDataSource(datasources.videoCenterClient, 'getHub', {
      ...videoCenterResponse,
      url: 'https://t2-penguin.seevent.com/demoint'
    });
    mockDataSourceError(datasources.weeClient, 'getShortUrlsByTagInBatches', 'Internal Error', '500');
    await expect(
      fetchAndCreateShortUrlByTag('video-center-id', datasources.weeClient, datasources.videoCenterClient)
    ).rejects.toThrow('Internal Error');
    expect(datasources.videoCenterClient.getHub).toHaveBeenCalledTimes(1);
    expect(datasources.weeClient.getShortUrlsByTagInBatches).toHaveBeenCalledTimes(1);
    // validating URL tags should be of custom domain
    expect(datasources.weeClient.getShortUrlsByTagInBatches).toHaveBeenCalledWith(
      [
        'upcomingevents#hub#video-center-id#domainName#https://t2-penguin.seevent.com',
        'channels#hub#video-center-id#domainName#https://t2-penguin.seevent.com',
        'videos#hub#video-center-id#domainName#https://t2-penguin.seevent.com',
        'registration#hub#video-center-id#domainName#https://t2-penguin.seevent.com'
      ],
      'video-center-id'
    );
  });

  it('fetchAndCreateShortUrlByTag: Short url for all tags already exist', async () => {
    mockDataSource(datasources.weeClient, 'getShortUrlsByTagInBatches', [
      {
        ...cventDomainShortUrlResponse,
        tags: ['registration#hub#video-center-id#domainName#https://web-staging.cvent.com']
      },
      {
        ...cventDomainShortUrlResponse,
        tags: ['upcomingevents#hub#video-center-id#domainName#https://web-staging.cvent.com']
      },
      {
        ...cventDomainShortUrlResponse,
        tags: ['channels#hub#video-center-id#domainName#https://web-staging.cvent.com']
      },
      { ...cventDomainShortUrlResponse, tags: ['videos#hub#video-center-id#domainName#https://web-staging.cvent.com'] }
    ]);
    await expect(
      fetchAndCreateShortUrlByTag('video-center-id', datasources.weeClient, datasources.videoCenterClient)
    ).resolves.toStrictEqual([
      { pageName: 'home', shortUrl: 'https://staging.cvent.me/short-url' },
      { pageName: 'upcomingevents', shortUrl: 'https://staging.cvent.me/mQNBM9' },
      { pageName: 'channels', shortUrl: 'https://staging.cvent.me/mQNBM9' },
      { pageName: 'videos', shortUrl: 'https://staging.cvent.me/mQNBM9' },
      { pageName: 'registration', shortUrl: 'https://staging.cvent.me/mQNBM9' }
    ]);
    expect(datasources.videoCenterClient.getHub).toHaveBeenCalledTimes(1);
    expect(datasources.weeClient.getShortUrlsByTagInBatches).toHaveBeenCalledTimes(1);
    expect(datasources.weeClient.createShortUrlBulk).toHaveBeenCalledTimes(0);
  });

  it('fetchAndCreateShortUrlByTag: Short url for channels tags does not exist', async () => {
    mockDataSource(datasources.weeClient, 'getShortUrlsByTagInBatches', [
      {
        ...cventDomainShortUrlResponse,
        tags: ['registration#hub#video-center-id#domainName#https://web-staging.cvent.com']
      },
      {
        ...cventDomainShortUrlResponse,
        tags: ['upcomingevents#hub#video-center-id#domainName#https://web-staging.cvent.com']
      },
      { ...cventDomainShortUrlResponse, tags: ['videos#hub#video-center-id#domainName#https://web-staging.cvent.com'] }
    ]);
    await expect(
      fetchAndCreateShortUrlByTag('video-center-id', datasources.weeClient, datasources.videoCenterClient)
    ).resolves.toStrictEqual([
      { pageName: 'home', shortUrl: 'https://staging.cvent.me/short-url' },
      { pageName: 'upcomingevents', shortUrl: 'https://staging.cvent.me/mQNBM9' },
      { pageName: 'videos', shortUrl: 'https://staging.cvent.me/mQNBM9' },
      { pageName: 'registration', shortUrl: 'https://staging.cvent.me/mQNBM9' },
      { pageName: 'channels', shortUrl: 'https://staging.cvent.me/newlyCreatedTag' }
    ]);
    expect(datasources.videoCenterClient.getHub).toHaveBeenCalledTimes(1);
    expect(datasources.weeClient.getShortUrlsByTagInBatches).toHaveBeenCalledTimes(1);
    expect(datasources.weeClient.createShortUrlBulk).toHaveBeenCalledTimes(1);
    expect(datasources.weeClient.createShortUrlBulk).toHaveBeenCalledWith([
      {
        referenceId: 'channels',
        tags: ['channels#hub#video-center-id#domainName#https://web-staging.cvent.com'],
        url: 'https://web-staging.cvent.com/eventsplus/video-center-id/channels',
        useDomainNameFromUrl: false
      }
    ]);
  });

  it('fetchAndCreateShortUrlByTag: Short url for channels tags does not exist with custom domain', async () => {
    mockDataSource(datasources.videoCenterClient, 'getHub', {
      ...videoCenterResponse,
      url: 'https://t2-penguin.seevent.com/demoint'
    });
    mockDataSource(datasources.weeClient, 'getShortUrlsByTagInBatches', [
      {
        ...customDomainShortUrlResponse,
        tags: ['registration#hub#video-center-id#domainName#https://t2-penguin.seevent.com']
      },
      {
        ...customDomainShortUrlResponse,
        tags: ['upcomingevents#hub#video-center-id#domainName#https://t2-penguin.seevent.com']
      },
      {
        ...customDomainShortUrlResponse,
        tags: ['videos#hub#video-center-id#domainName#https://t2-penguin.seevent.com']
      }
    ]);
    mockDataSource(datasources.weeClient, 'createShortUrlBulk', [
      {
        shortUrlResponse: {
          ...customDomainShortUrlResponse,
          referenceId: 'channels',
          shortUrl: 'https://t2-penguin.seevent.com/newlyCreatedTag'
        },
        httpStatus: 201
      }
    ]);
    await expect(
      fetchAndCreateShortUrlByTag('video-center-id', datasources.weeClient, datasources.videoCenterClient)
    ).resolves.toStrictEqual([
      { pageName: 'home', shortUrl: 'https://t2-penguin.seevent.com/demoint' },
      { pageName: 'upcomingevents', shortUrl: 'https://t2-penguin.seevent.com/mQNBM9' },
      { pageName: 'videos', shortUrl: 'https://t2-penguin.seevent.com/mQNBM9' },
      { pageName: 'registration', shortUrl: 'https://t2-penguin.seevent.com/mQNBM9' },
      { pageName: 'channels', shortUrl: 'https://t2-penguin.seevent.com/newlyCreatedTag' }
    ]);
    expect(datasources.videoCenterClient.getHub).toHaveBeenCalledTimes(1);
    expect(datasources.weeClient.getShortUrlsByTagInBatches).toHaveBeenCalledTimes(1);
    expect(datasources.weeClient.createShortUrlBulk).toHaveBeenCalledTimes(1);
    expect(datasources.weeClient.createShortUrlBulk).toHaveBeenCalledWith([
      {
        referenceId: 'channels',
        tags: ['channels#hub#video-center-id#domainName#https://t2-penguin.seevent.com'],
        url: 'https://t2-penguin.seevent.com/eventsplus/video-center-id/channels',
        useDomainNameFromUrl: true
      }
    ]);
  });
});

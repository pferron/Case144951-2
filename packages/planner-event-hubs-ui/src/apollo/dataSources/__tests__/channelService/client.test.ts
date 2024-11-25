import { ChannelServiceClient } from '@dataSources/channelService/client';
import { mockDataSource, mockDataSourceError } from '@resolvers/common/testUtils/mockRequestData';
import { ChannelStatus } from '@cvent/planner-event-hubs-model/types';

describe('ChannelServiceClient/client', () => {
  let dataSource: ChannelServiceClient;

  beforeEach(() => {
    dataSource = new ChannelServiceClient();
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

  it('Get channel successfully', async () => {
    const ChannelResponse = {
      id: 'aSD',
      status: ChannelStatus.Active,
      title: 'asd',
      description: 'adas'
    };
    mockDataSource(dataSource, 'get', ChannelResponse);
    await expect(dataSource.getChannel('channelId')).resolves.toBe(ChannelResponse);
  });

  it('Auth error while fetching channel', async () => {
    mockDataSourceError(dataSource, 'get', 'unauthorized', '401');
    await expect(dataSource.getChannel('channelId')).rejects.toThrow('unauthorized');
  });

  it('Create channel successfully', async () => {
    const ChannelResponse = {
      id: 'aSD',
      status: ChannelStatus.Active,
      title: 'asd',
      description: 'adas'
    };
    mockDataSource(dataSource, 'post', ChannelResponse);
    await expect(dataSource.createChannel('post', 'asds')).resolves.toBe(ChannelResponse);
  });

  it('Delete channel successfully', async () => {
    mockDataSource(dataSource, 'delete', null);
    await expect(dataSource.deleteChannel('channelId')).resolves.toBe(null);
  });

  it('Channel image should not throw error when 404 is returned', async () => {
    mockDataSourceError(dataSource, 'get', 'Not Found', '404');
    await expect(dataSource.getChannelImage('channelId')).resolves.toBe(null);
  });

  it('Get channel image throw unauthorized error', async () => {
    mockDataSourceError(dataSource, 'get', 'unauthorized', '401');

    await expect(async () => {
      await dataSource.getChannelImage('channelId');
    }).rejects.toThrow('unauthorized');
  });

  it('Delete channel image successfully', async () => {
    mockDataSource(dataSource, 'delete', null);
    await expect(dataSource.deleteChannelImage('channelId', 'imageId')).resolves.toBe(null);
  });

  it('Associate channel to hub', async () => {
    mockDataSource(dataSource, 'post', null);
    await expect(dataSource.associateChannelHub('hubId', 'channelId', 'short url')).resolves.toBe(null);
  });

  it('Associate channel to catalog', async () => {
    mockDataSource(dataSource, 'post', null);
    await expect(dataSource.associateChannelCatalog('channelId', 'catalogId')).resolves.toBe(null);
  });

  it('Associate banner to channel', async () => {
    mockDataSource(dataSource, 'put', null);
    await expect(
      dataSource.createChannelBannerAssociation({ banner: 'bannerId', channel: 'ChannelId', order: 1 })
    ).resolves.toBe(null);
  });

  it('Delete channel banner association successfully', async () => {
    mockDataSource(dataSource, 'delete', null);
    await expect(
      dataSource.deleteChannelBannerAssociation({ banner: 'bannerId', channel: 'ChannelId', order: 1 })
    ).resolves.toBe(null);
  });
});

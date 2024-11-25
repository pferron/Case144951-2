import { resolveMutationResponse, resolveQueryResponse } from '@resolvers/common/testUtils/mockFunction';
import {
  getMockResolverRequestWithDataSources,
  mockDataSource,
  mockDataSourceError
} from '@resolvers/common/testUtils/mockRequestData';
import {
  ChannelBannerOutput,
  ChannelInput,
  ChannelOrder,
  ChannelOrderInput,
  ChannelStatus,
  FilterInput,
  ImageInput,
  Paging
} from '@cvent/planner-event-hubs-model/types';
import { PaginatedChannels } from '@dataSources/videoCenterService/mappers';
import { VideoCenterClient } from '@dataSources/videoCenterService/client';
import { BannerServiceClient } from '@dataSources/bannerService/client';
import { UniversalVideoServiceClient } from '@dataSources/universalVideoService/client';
import { notFoundResponse, unAuthorisedResponse } from '@resolvers/fixtures/errorFixtures';
import { ChannelResponse, ChannelServiceClient, ImageResponse } from '@dataSources/channelService/client';
import { WeeClient } from '@dataSources/weeService/client';
import resolver from '../channel/index';

const channelId = 'a6e50019-54e7-4d88-9ee7-c609bb13fada';
const imageId = '8fd7f50c-6903-4f66-8661-d1c6b180b078';
const hubId = '9f097e0f-8f81-4c5c-85f0-5ef7a74a6bd1';
const invalidHubId = '9f097e0f8f81-4c5c-85f0-5ef7a74a6bd1';
const channelBanners = [{ id: 'channel-banner-id', name: 'channel-banner-name', layout: 'layout' }];
const channelBannerIds = channelBanners.map(c => c.id);
const channelResponse: ChannelResponse = {
  id: channelId,
  title: 'Unit test title',
  description: 'Unit test description',
  status: ChannelStatus.Inactive,
  catalogId: '',
  imageUrl: '',
  banners: channelBannerIds
};

const imageResponse: ImageResponse = {
  id: '8fd7f50c-6903-4f66-8661-d1c6b180b078',
  relativePath: '/abc/test.jpeg',
  optimizedUrl: 'https://abc.com',
  createdAt: '2022-03-14T10:38:04.386Z',
  filename: 'test.jpeg',
  size: 345
};

const imageData: ImageInput = {
  filename: 'TestImage.jpg',
  size: 12000,
  url: 'https://custom.t2.cvent.com/00000000000000000000000000000000/48ffe26e860841a48a1159f5f5227a96/media/image/testimage/test-image.jpeg'
};

const paging: Paging = {
  currentToken: '3a9e94b9-7455-40bb-a606-b733257fd915',
  nextToken: null,
  limit: 100
};
const paginatedChannels: PaginatedChannels = {
  paging,
  data: [
    {
      id: 'ebd04f02-61ef-49cc-a877-1f31cc3e4553',
      title: 'A filter channel',
      description: 'This is a test',
      status: ChannelStatus.Inactive,
      catalogId: '4e718238-2b7b-4655-b64a-ef0af6943c11',
      imageUrl: null,
      banners: channelBannerIds
    },
    {
      id: '95efef1d-c21d-436b-bb2a-3d04d7972deb',
      title: 'B filter channel',
      description: 'This is a test',
      status: ChannelStatus.Inactive,
      catalogId: null,
      imageUrl: null,
      banners: channelBannerIds
    }
  ]
};

const channelOrderInput: ChannelOrderInput[] = [
  { id: 'test channel 1', order: 1, existingOrder: 2 },
  { id: 'test channel 2', order: 2, existingOrder: 1 }
];
const channelOrderResponse: ChannelOrder[] = [
  { id: 'test channel 1', order: 1 },
  { id: 'test channel 2', order: 2 }
];

const channelInputData: ChannelInput = {
  id: channelId,
  title: 'updated title 4',
  description: 'new dec for updated channel',
  status: ChannelStatus.Inactive
};

describe('Test channel resolvers', () => {
  let dataSources;

  beforeEach(() => {
    dataSources = {
      videoCenterClient: new VideoCenterClient(),
      bannerServiceClient: new BannerServiceClient(),
      channelServiceClient: new ChannelServiceClient(),
      weeClient: new WeeClient(),
      universalVideoServiceClient: new UniversalVideoServiceClient()
    };
  });

  it('Should get a channel information by channel id with image', async () => {
    mockDataSource(dataSources.channelServiceClient, 'getChannelImage', imageResponse);
    mockDataSource(dataSources.channelServiceClient, 'getChannel', channelResponse);

    // // Mocking API call to get channel
    const channel = await resolveQueryResponse(
      resolver,
      'getChannelInformation',
      getMockResolverRequestWithDataSources('Query.getChannelInformation', dataSources, { channelId })
    );

    expect(channel).toBeTruthy();
    expect(channel.id).toBe(channelId);
    expect(channel.title).toBe(channelResponse.title);
    expect(channel.description).toBe(channelResponse.description);
    expect(channel.image).toBeTruthy();
    expect(channel.image.imageId).toBe(imageResponse.id);
    expect(channel.image.filename).toBe(imageResponse.filename);
    expect(channel.image.size).toBe(imageResponse.size);
    expect(channel.image.url).toBe('https://abc.com');
    expect(channel.image.createdAt).toBe(imageResponse.createdAt);
  });
  it('Should get a channel by channel information without image', async () => {
    mockDataSource(dataSources.channelServiceClient, 'getChannelImage', null);
    mockDataSource(dataSources.channelServiceClient, 'getChannel', channelResponse);

    const channel = await resolveQueryResponse(
      resolver,
      'getChannelInformation',
      getMockResolverRequestWithDataSources('Query.getChannelInformation', dataSources, { channelId })
    );
    expect(channel).toBeTruthy();
    expect(channel.id).toBe(channelId);
    expect(channel.title).toBe(channelResponse.title);
    expect(channel.description).toBe(channelResponse.description);
    expect(channel.image).toBeNull();
  });

  it('Should not get a channel information: Channel Not found', async () => {
    mockDataSourceError(dataSources.channelServiceClient, 'getChannel', 'Not Found', '404');

    await expect(async () => {
      await resolveQueryResponse(
        resolver,
        'getChannelInformation',
        getMockResolverRequestWithDataSources('Query.getChannelInformation', dataSources, { channelId })
      );
    }).rejects.toThrow('Not Found');
  });

  it('Should not get a channel information: Unauthorised request', async () => {
    mockDataSourceError(dataSources.channelServiceClient, 'getChannel', 'Unauthorised', '401');

    await expect(async () => {
      await resolveQueryResponse(
        resolver,
        'getChannelInformation',
        getMockResolverRequestWithDataSources('Query.getChannelInformation', dataSources, { channelId })
      );
    }).rejects.toThrow('Unauthorised');
  });

  it('Should create a channel', async () => {
    const title = 'title';
    const description = 'desc';

    mockDataSource(dataSources.channelServiceClient, 'associateChannelHub', null);
    mockDataSource(dataSources.channelServiceClient, 'createChannel', {
      ...channelResponse,
      title,
      description
    });
    mockDataSource(dataSources.weeClient, 'createShortUrl', {
      url: 'http://videohub.com/video-hubs/03cc5185-6707-4cb1-bea5-1a9a463c4b26/channels/227abfd5-1a9f-4f81-b59d-d277f95b0320',
      domainName: 'cvent.com',
      hash: 'ORL1NB',
      shortUrl: 'https://staging.cvent.me/ORL1NB'
    });

    const channel = await resolveMutationResponse(
      resolver,
      'createChannel',
      getMockResolverRequestWithDataSources('Mutation.createChanel', dataSources, {
        hubId,
        title,
        description
      })
    );
    expect(channel).toBeTruthy();
    expect(channel.title).toBe('title');
    expect(channel.description).toBe('desc');
    expect(channel.id).toBe(channelResponse.id);
    expect(channel.catalogId).toBe(channelResponse.catalogId);
    expect(channel.status).toBe(channelResponse.status);
  });

  it('Should fail due to authorization', async () => {
    mockDataSourceError(dataSources.channelServiceClient, 'createChannel', 'Unauthorised', '401');

    await expect(async () => {
      await resolveMutationResponse(
        resolver,
        'createChannel',
        getMockResolverRequestWithDataSources('Mutation.createChannel', dataSources, {
          title: 'title',
          description: 'desc'
        })
      );
    }).rejects.toThrow('Unauthorised');
  });

  it('Create channel should fail due to hub association failure', async () => {
    const title = 'title';
    const description = 'desc';

    mockDataSourceError(dataSources.channelServiceClient, 'associateChannelHub', 'Internal Server Error', '500');
    mockDataSource(dataSources.channelServiceClient, 'createChannel', {
      ...channelResponse,
      title,
      description
    });
    mockDataSource(dataSources.weeClient, 'createShortUrl', {
      url: 'http://videohub.com/video-hubs/03cc5185-6707-4cb1-bea5-1a9a463c4b26/channels/227abfd5-1a9f-4f81-b59d-d277f95b0320',
      domainName: 'cvent.com',
      hash: 'ORL1NB',
      shortUrl: 'https://staging.cvent.me/ORL1NB'
    });

    await expect(async () => {
      await resolveMutationResponse(
        resolver,
        'createChannel',
        getMockResolverRequestWithDataSources('Mutation.createChannel', dataSources, {
          hubId,
          title: 'title',
          description: 'desc'
        })
      );
    }).rejects.toThrow('Internal Server Error');
  });

  it('Create channel should fail due to wee call failure', async () => {
    mockDataSource(dataSources.channelServiceClient, 'associateChannelHub', null);
    mockDataSource(dataSources.channelServiceClient, 'createChannel', {
      ...channelResponse,
      title: 'title',
      description: 'desc'
    });
    mockDataSourceError(dataSources.weeClient, 'createShortUrl', 'Internal Server Error', '500');

    await expect(async () => {
      await resolveMutationResponse(
        resolver,
        'createChannel',
        getMockResolverRequestWithDataSources('Mutation.createChanel', dataSources, {
          hubId,
          title: 'title',
          description: 'desc'
        })
      );
    }).rejects.toThrow('Internal Server Error');
  });

  it('Should get channels for planner side channel list page', async () => {
    mockDataSource(dataSources.videoCenterClient, 'get', paginatedChannels);
    const filterInput: FilterInput = {
      filter: "status eq 'INACTIVE'",
      sort: 'title:ASC'
    };
    const plannerPaginatedChannels = await resolveQueryResponse(
      resolver,
      'getPlannerPaginatedChannels',
      getMockResolverRequestWithDataSources('Query.getPlannerPaginatedChannels', dataSources),
      {
        hubId,
        filterInput
      }
    );
    expect(plannerPaginatedChannels).toBeTruthy();
    expect(plannerPaginatedChannels.paging).toBeTruthy();
    expect(plannerPaginatedChannels.data).toBeTruthy();
    expect(plannerPaginatedChannels.paging.limit).toBe(100);
    expect(plannerPaginatedChannels.paging.currentToken).toBeTruthy();
    expect(plannerPaginatedChannels.data.length).toBe(2);
    expect(plannerPaginatedChannels.data[0].videoCount).toBe(0);
  });

  it('Should not get channels for planner side channel list page, fail due to authorization', async () => {
    mockDataSource(dataSources.videoCenterClient, 'get', unAuthorisedResponse);
    await expect(async () => {
      await resolveQueryResponse(
        resolver,
        'getPlannerPaginatedChannels',
        getMockResolverRequestWithDataSources('Query.getPlannerPaginatedChannels', dataSources),
        {
          hubId
        }
      );
    }).rejects.toThrow('Unauthorised');
  });

  it('Should not get channels for planner side channel list page, invalid hub id', async () => {
    mockDataSource(dataSources.videoCenterClient, 'get', notFoundResponse);
    await expect(async () => {
      await resolveQueryResponse(
        resolver,
        'getPlannerPaginatedChannels',
        getMockResolverRequestWithDataSources('Query.getPlannerPaginatedChannels', dataSources),
        {
          invalidHubId
        }
      );
    }).rejects.toThrow('Not Found');
  });

  it('should delete a channel successfully', async () => {
    mockDataSource(dataSources.channelServiceClient, 'deleteChannel', null);

    const response = await resolveMutationResponse(
      resolver,
      'deleteChannel',
      getMockResolverRequestWithDataSources('Mutation.deleteChannel', dataSources, { channelId })
    );
    expect(response).toBeTruthy();
    expect(response).toBe(true);
  });

  it('should fail : Channel not found', async () => {
    mockDataSourceError(dataSources.channelServiceClient, 'deleteChannel', 'Not Found', '404');

    await expect(async () => {
      await resolveMutationResponse(
        resolver,
        'deleteChannel',
        getMockResolverRequestWithDataSources('Mutation.deleteChannel', dataSources, { channelId })
      );
    }).rejects.toThrow('Not Found');
  });

  it('should fail : Unauthorised', async () => {
    mockDataSourceError(dataSources.channelServiceClient, 'deleteChannel', 'Unauthorised', '401');

    await expect(async () => {
      await resolveMutationResponse(
        resolver,
        'deleteChannel',
        getMockResolverRequestWithDataSources('Mutation.deleteChannel', dataSources, { channelId })
      );
    }).rejects.toThrow('Unauthorised');
  });

  it('should upload an image to the channel', async () => {
    mockDataSource(dataSources.channelServiceClient, 'post', {
      ...imageResponse,
      filename: imageData.filename,
      size: imageData.size
    });

    const channelImage = await resolveMutationResponse(
      resolver,
      'uploadChannelImage',
      getMockResolverRequestWithDataSources('Mutation.uploadChannelImage', dataSources, {
        channelId: 'channelId',
        imageInput: imageData
      })
    );
    expect(channelImage).toBeTruthy();
    expect(channelImage.filename).toBe('TestImage.jpg');
    expect(channelImage.size).toBe(12000);
    expect(channelImage.url).toBe(imageResponse.optimizedUrl);
    expect(channelImage.createdAt).toBe(imageResponse.createdAt);
    expect(channelImage.imageId).toBe(imageResponse.id);
  });

  it('should fail image upload due to authorization', async () => {
    mockDataSourceError(dataSources.channelServiceClient, 'post', 'Unauthorised', '401');

    await expect(async () => {
      await resolveMutationResponse(
        resolver,
        'uploadChannelImage',
        getMockResolverRequestWithDataSources('Mutation.uploadChannelImage', dataSources, {
          channelId: 'channelId',
          imageInput: imageData
        })
      );
    }).rejects.toThrow('Unauthorised');
  });

  it('should fail image upload when channel to not found', async () => {
    mockDataSourceError(dataSources.channelServiceClient, 'post', 'Not Found', '404');

    await expect(async () => {
      await resolveMutationResponse(
        resolver,
        'uploadChannelImage',
        getMockResolverRequestWithDataSources('Mutation.uploadChannelImage', dataSources, {
          channelId: 'channelId',
          imageInput: imageData
        })
      );
    }).rejects.toThrow('Not Found');
  });

  it('Channel should be updated successfully', async () => {
    mockDataSource(dataSources.channelServiceClient, 'put', {
      ...channelResponse,
      title: channelInputData.title,
      description: channelInputData.description,
      status: channelInputData.status
    });

    const channel = await resolveMutationResponse(
      resolver,
      'updateChannel',
      getMockResolverRequestWithDataSources('Mutation.updateChannel', dataSources, { channelInput: channelInputData })
    );
    expect(channel).toBeTruthy();
    expect(channel.title).toBe(channelInputData.title);
    expect(channel.description).toBe(channelInputData.description);
    expect(channel.id).toBe(channelInputData.id);
    expect(channel.catalogId).toBe(channelResponse.catalogId);
    expect(channel.status).toBe(channelInputData.status);
  });

  it('Channel update should fail due to unauthentication', async () => {
    mockDataSourceError(dataSources.channelServiceClient, 'put', 'Unauthorised', '401');

    await expect(async () => {
      await resolveMutationResponse(
        resolver,
        'updateChannel',
        getMockResolverRequestWithDataSources('Mutation.updateChannel', dataSources, { channelInput: channelInputData })
      );
    }).rejects.toThrow('Unauthorised');
  });

  it('update channel should fail : Channel not found', async () => {
    mockDataSourceError(dataSources.channelServiceClient, 'put', 'Not Found', '404');

    await expect(async () => {
      await resolveMutationResponse(
        resolver,
        'updateChannel',
        getMockResolverRequestWithDataSources('Mutation.updateChannel', dataSources, { channelInput: channelInputData })
      );
    }).rejects.toThrow('Not Found');
  });
});

describe('Test channel image scenarios', () => {
  let dataSources;

  beforeEach(() => {
    dataSources = {
      channelServiceClient: new ChannelServiceClient()
    };
  });

  it('Should delete channel image', async () => {
    mockDataSource(dataSources.channelServiceClient, 'deleteChannelImage', null);

    const isImageDeleted = await resolveMutationResponse(
      resolver,
      'deleteChannelImage',
      getMockResolverRequestWithDataSources('Mutation.deleteChannelImage', dataSources, {
        channelId,
        imageId
      })
    );
    expect(isImageDeleted).toBe(true);
  });

  it('Should fail to delete as image not found', async () => {
    mockDataSourceError(dataSources.channelServiceClient, 'deleteChannelImage', 'Not Found', '404');

    await expect(async () => {
      await resolveMutationResponse(
        resolver,
        'deleteChannelImage',
        getMockResolverRequestWithDataSources('Mutation.deleteChannelImage', dataSources, {
          channelId,
          imageId
        })
      );
    }).rejects.toThrow('Not Found');
  });

  it('Should fail to delete due to auth failure', async () => {
    mockDataSourceError(dataSources.channelServiceClient, 'deleteChannelImage', 'Unauthorised', '401');

    await expect(async () => {
      await resolveMutationResponse(
        resolver,
        'deleteChannelImage',
        getMockResolverRequestWithDataSources('Mutation.deleteChannelImage', dataSources, {
          channelId,
          imageId
        })
      );
    }).rejects.toThrow('Unauthorised');
  });
});

describe('Banner tests', () => {
  let dataSources;

  beforeEach(() => {
    dataSources = {
      bannerServiceClient: new BannerServiceClient(),
      channelServiceClient: new ChannelServiceClient()
    };
  });

  const channelBannerAssociationInput = {
    input: {
      channel: 'channel-id',
      banner: 'banner-id',
      order: 1
    }
  };

  it('Should create and delete channel banner association', async () => {
    mockDataSource(dataSources.channelServiceClient, 'createChannelBannerAssociation', channelBannerAssociationInput);
    mockDataSource(dataSources.channelServiceClient, 'deleteChannelBannerAssociation', null);

    const createResponse = await resolveMutationResponse(
      resolver,
      'createChannelBannerAssociation',
      getMockResolverRequestWithDataSources(
        'Mutation.createChannelBannerAssociation',
        dataSources,
        channelBannerAssociationInput
      )
    );
    expect(createResponse).toBeTruthy();
    expect(createResponse).toEqual(channelBannerAssociationInput.input as ChannelBannerOutput);

    const deleteResponse = await resolveMutationResponse(
      resolver,
      'deleteChannelBannerAssociation',
      getMockResolverRequestWithDataSources(
        'Mutation.deleteChannelBannerAssociation',
        dataSources,
        channelBannerAssociationInput
      )
    );

    expect(deleteResponse).toBeTruthy();
    expect(deleteResponse).toEqual(channelBannerAssociationInput.input as ChannelBannerOutput);
  });

  it('Should bubble server errors on create and delete channel banner association', async () => {
    mockDataSourceError(dataSources.channelServiceClient, 'createChannelBannerAssociation', 'Unauthorised', '401');

    await expect(async () => {
      await resolveMutationResponse(
        resolver,
        'createChannelBannerAssociation',
        getMockResolverRequestWithDataSources(
          'Mutation.createChannelBannerAssociation',
          dataSources,
          channelBannerAssociationInput
        )
      );
    }).rejects.toThrow('Unauthorised');
  });

  it('Should bubble server errors on delete channel banner association', async () => {
    mockDataSourceError(dataSources.channelServiceClient, 'deleteChannelBannerAssociation', 'Unauthorised', '401');

    await expect(async () => {
      await resolveMutationResponse(
        resolver,
        'deleteChannelBannerAssociation',
        getMockResolverRequestWithDataSources(
          'Mutation.deleteChannelBannerAssociation',
          dataSources,
          channelBannerAssociationInput
        )
      );
    }).rejects.toThrow('Unauthorised');
  });
});

describe('Test update channel order resolver', () => {
  let dataSources;

  beforeEach(() => {
    dataSources = {
      videoCenterClient: new VideoCenterClient()
    };
  });
  it('Should throw error when client call fails', async () => {
    mockDataSource(dataSources.videoCenterClient, 'put', unAuthorisedResponse);
    await expect(async () => {
      await resolveMutationResponse(
        resolver,
        'updateChannelOrder',
        getMockResolverRequestWithDataSources('Mutation.updateChannelOrder', dataSources, { hubId, channelOrderInput })
      );
    }).rejects.toThrow('Unauthorised');
  });
  it('Should return updated channels orders successfully', async () => {
    mockDataSource(dataSources.videoCenterClient, 'put', channelOrderResponse);
    const response = await resolveMutationResponse(
      resolver,
      'updateChannelOrder',
      getMockResolverRequestWithDataSources('Mutation.updateChannelOrder', dataSources, { hubId, channelOrderInput })
    );
    expect(response.length).toBe(2);
    expect(response[0].id).toBe(channelOrderResponse[0].id);
    expect(response[0].order).toBe(channelOrderResponse[0].order);
    expect(response[1].id).toBe(channelOrderResponse[1].id);
    expect(response[1].order).toBe(channelOrderResponse[1].order);
  });
});

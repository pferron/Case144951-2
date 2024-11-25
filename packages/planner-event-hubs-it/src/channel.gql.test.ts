// FIREBALL
/* eslint-disable jest/no-standalone-expect */
import {
  connectToApiAsPlanner,
  authOptions,
  authATestAccountOptions,
  unauthOptions
} from '@helpers/connectToApiAsPlanner';
import {
  Channel,
  ChannelStatus,
  FilterInput,
  PlannerPaginatedChannels,
  ImageInput,
  ChannelImage,
  ChannelInput,
  ChannelOrderInput
} from '@cvent/planner-event-hubs-model/types';
import { newHubData } from '@fixtures/hubData';
import {
  getChannelQuery,
  createChannelMutation,
  getPlannerPaginatedChannelsQuery,
  deleteChannelMutation,
  uploadChannelImageMutation,
  deleteChannelImageMutation,
  updateChannelMutation,
  updateChannelOrderMutation
} from '@cvent/planner-event-hubs-model/operations/channel';
import { createHub, hubPublish, rawDeleteHub } from '@helpers/hubFunctions';
import { v4 as uuidV4 } from 'uuid';
import path from 'path';
import fs from 'fs';
import { fetchDataWithOptions, getRequestBuilder, getLogIds } from '@utils/requestBuilderUtil';
import FormData from 'form-data';
import { LoggerFactory } from '@cvent/logging/LoggerFactory';
// FIREBALL
// eslint-disable-next-line no-restricted-imports
import { RequestBuilder } from '@cvent/nucleus-networking-node';
import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import {
  createChannel,
  deleteChannel,
  createChannelBannerAssociation,
  deleteChannelBannerAssociation
} from '@helpers/channelFunctions';
import { createCatalog } from '@helpers/catalogFunctions';
import { catalogInputData } from '@fixtures/catalog';
import { createBanner, deleteBanner } from '@helpers/bannerFunctions';
import { skipDescribeIfProdEnvironment, skipItIfProdEnvironment } from '@utils/commonUtils';
import { expect } from '@jest/globals';

const LOG = LoggerFactory.create('CHANNEL-IT');
let client;
let testAccountClient;
let clientWithIncorrectRole;
let testHubId;
let testHubId2;

let channelWithoutImage: Channel;
let channelWithImage: Channel;
let activeChannel: Channel;

const testBanner = { centerId: '', name: 'banner-name', layout: 'banner-layout' };
let existingBannerId;
let channelBannerAssociation;

const channelOrderInputList: ChannelOrderInput[] = [
  {
    id: uuidV4(),
    existingOrder: 2,
    order: 1
  },
  {
    id: uuidV4(),
    existingOrder: 1,
    order: 2
  }
];

let imageUrl: string;
let uploadedImage: ChannelImage;
let filterChannelList: Array<Channel> = [];

const invalidHubId = 'bb2ab99fe4f7-4e20-8fd1-a70292c01134';
const filterInputVariable: FilterInput = {
  filter: "status eq 'INACTIVE'"
};

const ACCOUNT_STUB_TEMPORARY_FILES = '00000000000000000000000000000000';
const url = `${process.env.S3_PROXY_SERVICE_BASE_URL}/v1/upload/${ACCOUNT_STUB_TEMPORARY_FILES}`;
const headers = {
  authorization: `API_KEY ${process.env.API_KEY}`
};

const getEnvironment = (): string => {
  return process.env.ENVIRONMENT_NAME === 'dev' ? 'T2' : process.env.ENVIRONMENT_NAME;
};

const getPlannerPaginatedChannels = async (
  hubId: string,
  filterInput: FilterInput
): Promise<PlannerPaginatedChannels> => {
  const response = await testAccountClient.query({
    query: getPlannerPaginatedChannelsQuery,
    variables: {
      hubId,
      filterInput
    }
  });
  expect(response).toBeTruthy();
  expect(response.data).toBeTruthy();
  return response.data.getPlannerPaginatedChannels;
};

const uploadImageToS3 = async (channelId): Promise<string> => {
  const formData = new FormData();
  const imagePath = path.join(__dirname, 'resources', 'images', 'lessThan2Mb.jpeg');
  formData.append('file', fs.readFileSync(imagePath), {
    filename: 'imageName.jpeg'
  });
  let request: RequestBuilder = getRequestBuilder(url, headers, getEnvironment(), LOG, {
    filePath: `${ACCOUNT_STUB_TEMPORARY_FILES}/${channelId}/media/image`
  });
  request = request.body(formData).post().build();

  return fetchDataWithOptions(request, getLogIds).then(response => {
    return response.location;
  });
};

const uploadChannelImage = async (channelId: string, imageInput: ImageInput): Promise<ChannelImage> => {
  const response = await client.mutate({
    mutation: uploadChannelImageMutation,
    variables: {
      channelId,
      imageInput
    }
  });
  expect(response).toBeTruthy();
  expect(response.data).toBeTruthy();
  return response.data.uploadChannelImage;
};

const deleteChanelImage = async (
  apolloClient: ApolloClient<NormalizedCacheObject>,
  channelId: string | null,
  imageId: string | null
): Promise<boolean> => {
  return (
    await apolloClient.mutate({
      mutation: deleteChannelImageMutation,
      variables: {
        channelId,
        imageId
      }
    })
  ).data;
};

const updateChannel = async (channelInput: ChannelInput): Promise<Channel> => {
  const response = await client.mutate({
    mutation: updateChannelMutation,
    variables: {
      channelInput
    }
  });
  expect(response).toBeTruthy();
  expect(response.data).toBeTruthy();
  return response.data.updateChannel;
};

beforeAll(async () => {
  [client, testAccountClient, clientWithIncorrectRole] = await Promise.all([
    connectToApiAsPlanner(authOptions),
    connectToApiAsPlanner(authATestAccountOptions),
    connectToApiAsPlanner(unauthOptions)
  ]);
  // create test hub data
  [testHubId, testHubId2] = await Promise.all([
    createHub(client, newHubData),
    createHub(testAccountClient, newHubData)
  ]);

  [channelWithImage, channelWithoutImage, activeChannel] = await Promise.all([
    createChannel(client, testHubId, 'New channel with Image', 'Test channel', 'web-staging.cvent.com'),
    createChannel(client, testHubId, 'New channel without Image', 'Test channel', 'web-staging.cvent.com'),
    createChannel(client, testHubId, 'New Active Channel', 'Test channel', 'web-staging.cvent.com')
  ]);

  filterChannelList = await Promise.all([
    createChannel(testAccountClient, testHubId2, 'filter channel 1', 'Test channel', 'web-staging.cvent.com'),
    createChannel(testAccountClient, testHubId2, 'filter channel 2', 'Test channel', 'web-staging.cvent.com')
  ]);
  testBanner.centerId = testHubId;
  existingBannerId = await createBanner(client, testBanner);
  channelBannerAssociation = {
    channel: channelWithoutImage.id,
    banner: existingBannerId,
    order: 1
  };
  await createChannelBannerAssociation(client, channelBannerAssociation);

  // Associating catalog with the channel to get channels with catalog
  await createCatalog(testAccountClient, filterChannelList[0].id, catalogInputData);

  imageUrl = await uploadImageToS3(channelWithImage.id);
  const imageDataRequired = {
    filename: 'imageName.jpeg',
    size: 323,
    url: imageUrl
  };
  await new Promise(r => {
    setTimeout(r, 2000);
  });
  uploadedImage = await uploadChannelImage(channelWithImage.id, imageDataRequired);
  // upload image for active channel

  imageDataRequired.url = await uploadImageToS3(activeChannel.id);
  uploadedImage = await uploadChannelImage(activeChannel.id, imageDataRequired);

  // create and associate a catalog to channel with image
  catalogInputData.sections[0].id = uuidV4();
  let newCatalog = await createCatalog(client, channelWithImage.id, catalogInputData);
  channelWithImage.catalogId = newCatalog.id;

  catalogInputData.sections[0].id = uuidV4();
  newCatalog = await createCatalog(client, activeChannel.id, catalogInputData);
  activeChannel.catalogId = newCatalog.id;

  const channelInputData: ChannelInput = {
    id: activeChannel.id,
    title: 'New Active channel',
    description: 'Test channel',
    status: ChannelStatus.Active
  };
  activeChannel = await updateChannel(channelInputData);
  await hubPublish(client, { id: testHubId });
  await hubPublish(testAccountClient, { id: testHubId2 });
});

afterAll(async () => {
  await Promise.all([
    deleteBanner(client, testHubId, existingBannerId),
    deleteChannel(client, channelWithImage.id),
    deleteChannel(client, channelWithoutImage.id),
    deleteChannel(testAccountClient, filterChannelList[0].id),
    deleteChannel(testAccountClient, filterChannelList[1].id),
    rawDeleteHub(client, { id: testHubId }),
    rawDeleteHub(testAccountClient, { id: testHubId2 })
  ]);
});

describe('Channel GQL IT', () => {
  skipItIfProdEnvironment()('image upload should fail due to channel not found', async () => {
    const channelId = channelWithImage.id;
    const imageInput = {
      filename: 'imageName.jpeg',
      size: 323,
      url: imageUrl
    };
    await expect(async () =>
      testAccountClient.mutate({
        mutation: uploadChannelImageMutation,
        variables: {
          channelId,
          imageInput
        }
      })
    ).rejects.toThrow('Not Found');
  });

  skipItIfProdEnvironment()('image upload should fail due to fileName not present', async () => {
    const channelId = channelWithImage.id;
    const imageInput = {
      size: 323,
      url: imageUrl
    };
    await expect(async () =>
      testAccountClient.mutate({
        mutation: uploadChannelImageMutation,
        variables: {
          channelId,
          imageInput
        }
      })
    ).rejects.toThrow('400');
  });

  skipItIfProdEnvironment()('image upload should fail due to size not present', async () => {
    const channelId = channelWithImage.id;
    const imageInput = {
      filename: 'imageName.jpeg',
      url: imageUrl
    };
    await expect(async () =>
      testAccountClient.mutate({
        mutation: uploadChannelImageMutation,
        variables: {
          channelId,
          imageInput
        }
      })
    ).rejects.toThrow('400');
  });

  skipItIfProdEnvironment()('image upload should fail due to url not present', async () => {
    const channelId = channelWithImage.id;
    const imageInput = {
      filename: 'imageName.jpeg',
      size: 323
    };
    await expect(async () =>
      testAccountClient.mutate({
        mutation: uploadChannelImageMutation,
        variables: {
          channelId,
          imageInput
        }
      })
    ).rejects.toThrow('400');
  });

  skipItIfProdEnvironment()('image upload should fail due to url not present', async () => {
    await expect(async () =>
      clientWithIncorrectRole.query({
        query: getChannelQuery,
        variables: {
          channelId: channelWithImage.id
        }
      })
    ).rejects.toThrow('403: Forbidden');
  });

  skipItIfProdEnvironment()('channel should be not found', async () => {
    await expect(async () =>
      client.query({
        query: getChannelQuery,
        variables: {
          channelId: uuidV4()
        }
      })
    ).rejects.toThrow('Not Found');
  });

  skipItIfProdEnvironment()('channel should be not found for testAccountClient', async () => {
    await expect(async () =>
      testAccountClient.query({
        query: getChannelQuery,
        variables: {
          channelId: channelWithImage.id
        }
      })
    ).rejects.toThrow('Not Found');
  });

  skipItIfProdEnvironment()('delete channel mutation should fail due to authentication', async () => {
    await expect(async () =>
      clientWithIncorrectRole.mutate({
        mutation: deleteChannelMutation,
        variables: {
          channelId: channelWithImage.id
        }
      })
    ).rejects.toThrow('403: Forbidden');
  });

  skipItIfProdEnvironment()('delete channel mutation should fail as channel not found (random uuid)', async () => {
    await expect(async () =>
      client.mutate({
        mutation: deleteChannelMutation,
        variables: {
          channelId: uuidV4()
        }
      })
    ).rejects.toThrow('Not Found');
  });

  skipItIfProdEnvironment()(
    'delete channel mutation should fail as channel not found for testAccountClient',
    async () => {
      await expect(async () =>
        testAccountClient.mutate({
          mutation: deleteChannelMutation,
          variables: {
            channelId: channelWithImage.id
          }
        })
      ).rejects.toThrow('Not Found');
    }
  );

  skipItIfProdEnvironment()('Channel update should fail : Forbidden', async () => {
    await expect(async () =>
      clientWithIncorrectRole.mutate({
        mutation: updateChannelMutation,
        variables: {
          channelInput: {
            id: channelWithImage.id,
            title: 'new title',
            description: 'new desc',
            status: ChannelStatus.Inactive
          }
        }
      })
    ).rejects.toThrow('403: Forbidden');
  });

  skipItIfProdEnvironment()('Channel update should fail : Not found (random uuid)', async () => {
    await expect(async () =>
      client.mutate({
        mutation: updateChannelMutation,
        variables: {
          channelInput: {
            id: uuidV4(),
            title: 'new title',
            description: 'new desc',
            status: ChannelStatus.Inactive
          }
        }
      })
    ).rejects.toThrow('Not Found');
  });

  skipItIfProdEnvironment()('Channel update should fail : Not found for testAccountClient', async () => {
    await expect(async () =>
      testAccountClient.mutate({
        mutation: updateChannelMutation,
        variables: {
          channelInput: {
            id: channelWithImage.id,
            title: 'new title',
            description: 'new desc',
            status: ChannelStatus.Inactive
          }
        }
      })
    ).rejects.toThrow('Not Found');
  });

  skipItIfProdEnvironment()('Channel update should fail as status not provided', async () => {
    await expect(async () =>
      client.mutate({
        mutation: updateChannelMutation,
        variables: {
          channelInput: {
            id: channelWithImage.id,
            title: 'new title',
            description: 'new desc'
          }
        }
      })
    ).rejects.toThrow('400');
  });

  skipItIfProdEnvironment()('Channel update should fail as description not provided', async () => {
    await expect(async () =>
      client.mutate({
        mutation: updateChannelMutation,
        variables: {
          channelInput: {
            id: channelWithImage.id,
            title: 'new title',
            status: ChannelStatus.Inactive
          }
        }
      })
    ).rejects.toThrow('400');
  });

  skipItIfProdEnvironment()('Channel update should fail as id not provided', async () => {
    await expect(async () =>
      client.mutate({
        mutation: updateChannelMutation,
        variables: {
          channelInput: {
            description: 'new desc',
            title: 'new title',
            status: ChannelStatus.Inactive
          }
        }
      })
    ).rejects.toThrow('400');
  });

  skipItIfProdEnvironment()('Channel update should fail as title not provided', async () => {
    await expect(async () =>
      client.mutate({
        mutation: updateChannelMutation,
        variables: {
          channelInput: {
            id: channelWithImage.id,
            description: 'new desc',
            status: ChannelStatus.Inactive
          }
        }
      })
    ).rejects.toThrow('400');
  });

  skipItIfProdEnvironment()(
    'Channel update should fail as trying to change status of channel without image',
    async () => {
      await expect(async () =>
        client.mutate({
          mutation: updateChannelMutation,
          variables: {
            channelInput: {
              id: channelWithoutImage.id,
              title: 'updated title',
              description: 'new desc',
              status: ChannelStatus.Active
            }
          }
        })
      ).rejects.toThrow('Bad Request');
    }
  );

  it('Should create a new channel, update it and delete it successfully', async () => {
    const newChannel = await createChannel(client, testHubId, 'New channel', 'Test channel', 'web-staging.cvent.com');
    expect(newChannel).toBeTruthy();
    expect(newChannel.id).toBeTruthy();
    expect(newChannel.title).toBe('New channel');
    expect(newChannel.description).toBe('Test channel');
    expect(newChannel.status).toBe('INACTIVE');
    expect(newChannel.catalogId).toBeNull();
    // upload image to this channel
    const newImageUrl = await uploadImageToS3(newChannel.id);
    const newUploadedImage = await uploadChannelImage(newChannel.id, {
      filename: 'createTest.jpg',
      size: 123,
      url: newImageUrl
    });

    expect(newUploadedImage.filename).toBe('createTest.jpg');
    const channelInputData: ChannelInput = {
      id: newChannel.id,
      title: 'updated title ',
      description: 'new desc for updated channel',
      status: ChannelStatus.Inactive
    };
    const updatedChannel = await updateChannel(channelInputData);
    expect(updatedChannel).toBeTruthy();
    expect(updatedChannel.id).toBeTruthy();
    expect(updatedChannel.title).toBe(channelInputData.title);
    expect(updatedChannel.description).toBe(channelInputData.description);
    expect(updatedChannel.status).toBe(channelInputData.status);
    expect(updatedChannel.catalogId).toBeNull();

    // delete the uploaded image
    await deleteChanelImage(client, newChannel.id, newUploadedImage.imageId);
    const deleteResponse = await deleteChannel(client, newChannel.id);
    expect(deleteResponse).toBe(true);
  });
});
describe('Testing planner channel pagination graph', () => {
  it('should get channels for planner list page with provided channel filter input', async () => {
    const plannerPaginatedChannels = await getPlannerPaginatedChannels(testHubId2, filterInputVariable);
    expect(plannerPaginatedChannels).toBeTruthy();
    expect(plannerPaginatedChannels.data).toHaveLength(2);
    expect(plannerPaginatedChannels.data[0]?.status).toBe(ChannelStatus.Inactive);
    expect(plannerPaginatedChannels.data[0]?.videoCount).toBe(0);
    expect(plannerPaginatedChannels.data[0]?.order).toBeGreaterThanOrEqual(1);
    expect(plannerPaginatedChannels.data[1]?.status).toBe(ChannelStatus.Inactive);
    expect(plannerPaginatedChannels.data[1]?.videoCount).toBe(0);
  });

  skipItIfProdEnvironment()('should give validation error 400 with provided wrong channel filter field', async () => {
    const inValidFilterInput: FilterInput = {
      filter: "channelId eq 'INACTIVE'"
    };
    await expect(async () =>
      client.query({
        query: getPlannerPaginatedChannelsQuery,
        variables: {
          hubId: testHubId,
          filterInput: inValidFilterInput
        }
      })
    ).rejects.toThrow('Bad Request');
  });

  skipItIfProdEnvironment()(
    'should give validation error 400 with provided wrong channel filter operator',
    async () => {
      const inValidFilterInput: FilterInput = {
        filter: "status equals 'INACTIVE'"
      };
      await expect(async () =>
        client.query({
          query: getPlannerPaginatedChannelsQuery,
          variables: {
            hubId: testHubId,
            filterInput: inValidFilterInput
          }
        })
      ).rejects.toThrow('Bad Request');
    }
  );

  skipItIfProdEnvironment()('should give validation error 400 with provided wrong maximum limit field', async () => {
    const inValidFilterInput: FilterInput = {
      limit: 500
    };
    await expect(async () =>
      client.query({
        query: getPlannerPaginatedChannelsQuery,
        variables: {
          hubId: testHubId,
          filterInput: inValidFilterInput
        }
      })
    ).rejects.toThrow('Bad Request');
  });

  skipItIfProdEnvironment()('should give validation error 400 with provided wrong sort field', async () => {
    const inValidFilterInput: FilterInput = {
      sort: 'channelId:ASC'
    };
    await expect(async () =>
      client.query({
        query: getPlannerPaginatedChannelsQuery,
        variables: {
          hubId: testHubId,
          filterInput: inValidFilterInput
        }
      })
    ).rejects.toThrow('Bad Request');
  });

  skipItIfProdEnvironment()('channel filter should fail due to authentication error', async () => {
    await expect(async () =>
      clientWithIncorrectRole.query({
        query: getPlannerPaginatedChannelsQuery,
        variables: {
          hubId: testHubId,
          filterInput: filterInputVariable
        }
      })
    ).rejects.toThrow('Not authorized');
  });

  skipItIfProdEnvironment()('For invalid hub uuid, should throw bad request ', async () => {
    await expect(async () =>
      client.query({
        query: getPlannerPaginatedChannelsQuery,
        variables: {
          hubId: invalidHubId,
          filterInput: filterInputVariable
        }
      })
    ).rejects.toThrow('Bad Request');
  });
});

skipDescribeIfProdEnvironment()('Testing failure cases of create channel graph', () => {
  it('create channel should fail due to authentication', async () => {
    await expect(async () =>
      clientWithIncorrectRole.mutate({
        mutation: createChannelMutation,
        variables: {
          hubId: testHubId,
          title: 'channel title',
          description: 'channel description',
          customDomain: 'web-staging.cvent.com'
        }
      })
    ).rejects.toThrow('403: Forbidden');
  });

  it('create channel should fail as hub is of different client', async () => {
    await expect(async () =>
      client.mutate({
        mutation: createChannelMutation,
        variables: {
          hubId: testHubId2,
          title: 'channel title',
          description: 'channel description',
          customDomain: 'web-staging.cvent.com'
        }
      })
    ).rejects.toThrow('Not Found');
  });
  it('create channel should fail as description not provided', async () => {
    await expect(async () =>
      client.mutate({
        mutation: createChannelMutation,
        variables: {
          title: 'channel title'
        }
      })
    ).rejects.toThrow('400');
  });
  it('create channel should fail as title not provided', async () => {
    await expect(async () =>
      client.mutate({
        mutation: createChannelMutation,
        variables: {
          description: 'channel description'
        }
      })
    ).rejects.toThrow('400');
  });
});

skipDescribeIfProdEnvironment()('Testing channel image graph', () => {
  it('delete channel image: Should fail due to unauthentication', async () => {
    await expect(async () =>
      deleteChanelImage(clientWithIncorrectRole, channelWithImage.id, uploadedImage.imageId)
    ).rejects.toThrow('403: Forbidden');
  });
  it('delete channel image mutation should fail as channel and image not found for testAccountClient', async () => {
    await expect(async () =>
      deleteChanelImage(testAccountClient, channelWithImage.id, uploadedImage.imageId)
    ).rejects.toThrow('Not Found');
  });
  it('delete channel image mutation should fail as image not found', async () => {
    await expect(async () => deleteChanelImage(client, channelWithImage.id, uuidV4())).rejects.toThrow('Not Found');
  });
  it('delete channel image mutation should fail as imageId not passed', async () => {
    await expect(async () => deleteChanelImage(client, channelWithImage.id, null)).rejects.toThrow(
      'Response not successful: Received status code 400'
    );
  });
  it('delete channel image mutation should fail as imageId and channel id not passed', async () => {
    await expect(async () => deleteChanelImage(client, null, null)).rejects.toThrow(
      'Response not successful: Received status code 400'
    );
  });
  it('delete channel image mutation should fail as channel id not passed', async () => {
    await expect(async () => deleteChanelImage(client, null, uploadedImage.imageId)).rejects.toThrow(
      'Response not successful: Received status code 400'
    );
  });
  it('delete image failure as channel is ACTIVE', async () => {
    await expect(async () => deleteChanelImage(client, activeChannel.id, uploadedImage.imageId)).rejects.toThrow(
      'Bad Request'
    );
  });
});

describe('Test update channel order graph', () => {
  skipItIfProdEnvironment()('update channel order fails when hub not found', async () => {
    await expect(async () =>
      testAccountClient.mutate({
        mutation: updateChannelOrderMutation,
        variables: {
          hubId: testHubId,
          channelOrderInputList
        }
      })
    ).rejects.toThrow('Not Found');
  });
  skipItIfProdEnvironment()('update channel order fails with unauthorization', async () => {
    await expect(async () =>
      clientWithIncorrectRole.mutate({
        mutation: updateChannelOrderMutation,
        variables: {
          hubId: testHubId,
          channelOrderInputList
        }
      })
    ).rejects.toThrow('403: Forbidden');
  });
  skipItIfProdEnvironment()('update channel order fails due to random channel id', async () => {
    await expect(async () =>
      client.mutate({
        mutation: updateChannelOrderMutation,
        variables: {
          hubId: testHubId,
          channelOrderInputList
        }
      })
    ).rejects.toThrow('Bad Request');
  });
  it('update channel order successfully then delete banner association', async () => {
    const plannerPaginatedChannels = await getPlannerPaginatedChannels(testHubId2, { sort: 'order:ASC' });
    const channels = plannerPaginatedChannels.data;
    expect(channels.length).toBe(2);
    const channelOrdersList: ChannelOrderInput[] = [
      {
        id: channels[0].id,
        existingOrder: channels[0]?.order,
        order: 2
      },
      {
        id: channels[1].id,
        existingOrder: channels[1]?.order,
        order: 1
      }
    ];
    const response = await testAccountClient.mutate({
      mutation: updateChannelOrderMutation,
      variables: {
        hubId: testHubId2,
        channelOrderInputList: channelOrdersList
      }
    });
    const updatedChannelOrderList = response.data.updateChannelOrder;
    expect(updatedChannelOrderList[0]?.id).toBe(channelOrdersList[1].id);
    expect(updatedChannelOrderList[0]?.order).toBe(channelOrdersList[1].order);
    expect(updatedChannelOrderList[1]?.id).toBe(channelOrdersList[0].id);
    expect(updatedChannelOrderList[1]?.order).toBe(channelOrdersList[0].order);

    await Promise.all([deleteChannelBannerAssociation(client, channelBannerAssociation)]);
  });
});

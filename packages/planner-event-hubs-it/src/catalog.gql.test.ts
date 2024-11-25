import {
  authATestAccountOptions,
  authOptions,
  connectToApiAsPlanner,
  unauthOptions
} from '@helpers/connectToApiAsPlanner';
import { createHub, rawDeleteHub } from '@helpers/hubFunctions';
import { createChannel, deleteChannel } from '@helpers/channelFunctions';
import { newHubData } from '@fixtures/hubData';
import { createCatalog, updateCatalog, getCatalog } from '@helpers/catalogFunctions';
import { catalogInputData, updateCatalogInputData } from '@fixtures/catalog';
import { Catalog, CatalogInput, SectionType } from '@cvent/planner-event-hubs-model/types';
import { videoDataSet } from '@fixtures/videoData';
import { v4 as uuidV4 } from 'uuid';
import { skipDescribeIfProdEnvironment } from '@utils/commonUtils';

let client1 = null;
let client2 = null;
let clientWithIncorrectRole = null;
let channel1 = null;
let channelWithCatalog = null;
let testHubId = null;

beforeAll(async () => {
  [client1, client2, clientWithIncorrectRole] = await Promise.all([
    connectToApiAsPlanner(authOptions),
    connectToApiAsPlanner(authATestAccountOptions),
    connectToApiAsPlanner(unauthOptions)
  ]);
  testHubId = await createHub(client1, newHubData);
  [channel1, channelWithCatalog] = await Promise.all([
    createChannel(client1, testHubId, 'New channel for catalog tests', 'Test channel', 'web-staging.cvent.com'),
    createChannel(client1, testHubId, 'New channel for catalog tests', 'Test channel', 'web-staging.cvent.com')
  ]);
  const newCatalog = await createCatalog(client1, channelWithCatalog.id, catalogInputData);
  channelWithCatalog.catalogId = newCatalog.id;
});

afterAll(async () => {
  // using update to delete the catalog
  catalogInputData.sections[0].videos = [];
  await updateCatalog(client1, channelWithCatalog.id, channelWithCatalog.catalogId, catalogInputData);
  await Promise.all([
    deleteChannel(client1, channel1.id),
    deleteChannel(client1, channelWithCatalog.id),
    rawDeleteHub(client1, { id: testHubId })
  ]);
});
skipDescribeIfProdEnvironment()('Catalog GQL IT - Failure Cases', () => {
  it('Should create a catalog but failed during associating it as channel is not found for client2', async () => {
    await expect(async () => createCatalog(client2, channel1.id, catalogInputData)).rejects.toThrow('Not Found');
  });
  it('Should not create a catalog due to authorization', async () => {
    await expect(async () => createCatalog(clientWithIncorrectRole, channel1.id, catalogInputData)).rejects.toThrow(
      '403: Forbidden'
    );
  });
  it('Get catalog should fail due to unauthorization', async () => {
    await expect(async () => getCatalog(clientWithIncorrectRole, channelWithCatalog.catalogId)).rejects.toThrow(
      '403: Forbidden'
    );
  });
  it('Get catalog should fail due to not found', async () => {
    await expect(async () => getCatalog(client2, channelWithCatalog.catalogId)).rejects.toThrow('Not Found');
  });
  it('update catalog should fail due to unauthorization', async () => {
    await expect(async () =>
      updateCatalog(clientWithIncorrectRole, channelWithCatalog.id, channelWithCatalog.catalogId, catalogInputData)
    ).rejects.toThrow('403: Forbidden');
  });
  it('Update catalog Should fail as catalog not found', async () => {
    await expect(async () =>
      updateCatalog(client2, channelWithCatalog.id, channelWithCatalog.catalogId, catalogInputData)
    ).rejects.toThrow('Not Found');
  });
});

const matchCatalogs = (catalog: Catalog, InputCatalog: CatalogInput): void => {
  expect(catalog.sectionCount).toBe(InputCatalog.sections.length);
  expect(catalog.catalogOwner).toBe(InputCatalog.catalogOwner);
  let i = 0;
  catalog?.sections?.forEach(ss => {
    expect(ss.id).toBe(InputCatalog.sections[i].id);
    expect(ss.title).toBe(InputCatalog.sections[i].title);
    expect(ss.sectionType).toBe(InputCatalog.sections[i].sectionType);
    if (ss.videos) {
      expect(ss.videos).toHaveLength(InputCatalog.sections[i].videos.length);
      let j = 0;
      ss?.videos?.forEach(video => {
        expect(video.videoId).toBe(InputCatalog.sections[i].videos[j].videoId);
        j++;
      });
    }
    i++;
  });
};

describe('Catalog GQL IT', () => {
  it('Should create, update, get a catalog for channel1 successfully', async () => {
    const catalog = await createCatalog(client1, channel1.id, updateCatalogInputData);
    expect(catalog.id).toBeTruthy();
    matchCatalogs(catalog, updateCatalogInputData);

    const existingCatalog = await getCatalog(client1, catalog.id);
    expect(existingCatalog.id).toBe(catalog.id);
    matchCatalogs(existingCatalog, updateCatalogInputData);

    // video - present
    // remove one section
    updateCatalogInputData.sections.pop();
    // remove video from section 1
    updateCatalogInputData.sections[0].videos.pop();
    // add video to section 2
    updateCatalogInputData.sections[1].videos.push({ videoId: videoDataSet.videoId });
    // add another section
    const section = {
      id: uuidV4(),
      title: 'New section',
      videos: [{ videoId: videoDataSet.videoId }],
      sectionType: SectionType.Custom
    };
    updateCatalogInputData.sections.push(section);
    const updatedCatalog = await updateCatalog(client1, channel1.id, catalog.id, updateCatalogInputData);

    expect(updatedCatalog.id).toBe(catalog.id);
    matchCatalogs(updatedCatalog, updateCatalogInputData);

    // No video present -- should remove catalog
    updateCatalogInputData.sections.pop();
    updateCatalogInputData.sections.pop();
    updateCatalogInputData.sections[0].videos = [];
    const catalog2 = await updateCatalog(client1, channel1.id, catalog.id, updateCatalogInputData);

    expect(catalog2).toBeNull();
  });
});

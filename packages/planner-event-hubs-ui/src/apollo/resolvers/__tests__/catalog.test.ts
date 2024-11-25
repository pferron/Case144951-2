import resolver from '@resolvers/catalog';
import { resolveMutationResponse, resolveQueryResponse } from '@resolvers/common/testUtils/mockFunction';
import {
  getMockResolverRequestWithDataSources,
  mockDataSource,
  mockDataSourceError
} from '@resolvers/common/testUtils/mockRequestData';
import { Catalog, CatalogOwnerType, CatalogType, SectionType } from '@cvent/planner-event-hubs-model/types';
import { ChannelServiceClient } from '@dataSources/channelService/client';
import { UniversalVideoServiceClient } from '@dataSources/universalVideoService/client';
import { catalogOutput, videoData, videoId, catalogId } from '../fixtures/catalogData';

const channelId = 'a6e50019-54e7-4d88-9ee7-c609bb13fada';

const catalogInput = {
  sections: [
    {
      id: '04ca6ae2-0dc3-487b-953e-86d6abbdf7d6',
      title: 'default section',
      videos: [
        {
          videoId
        }
      ],
      sectionType: SectionType.Default
    }
  ],
  catalogType: CatalogType.List,
  catalogOwner: CatalogOwnerType.VideoHub
};
const catalogInputWithoutVideo = {
  sections: [
    {
      id: '04ca6ae2-0dc3-487b-953e-86d6abbdf7d6',
      title: 'default section',
      sectionType: SectionType.Default
    }
  ],
  catalogType: CatalogType.List,
  catalogOwner: CatalogOwnerType.VideoHub
};
const matchCatalog = (catalog: Catalog): void => {
  expect(catalog.sections.length).toBe(catalogOutput.sections.length);
  expect(catalog.sections[0].id).toBe(catalogOutput.sections[0].id);
  expect(catalog.sections[0].sectionType).toBe(catalogOutput.sections[0].sectionType);
  expect(catalog.sections[0].videos.length).toBe(catalogOutput.sections[0].videos.length);
  expect(catalog.sections[0].videos[0].videoId).toBe(catalogOutput.sections[0].videos[0].videoId);
  expect(catalog.sections[0].videos[0].sessionId).toBe(catalogOutput.sections[0].videos[0].sessionId);
  expect(catalog.sections[0].videos[0].duration).toBe(catalogOutput.sections[0].videos[0].duration);
  expect(catalog.sections[0].videos[0].thumbnail).toBe(catalogOutput.sections[0].videos[0].thumbnail);
  expect(catalog.sections[0].title).toBe(catalogOutput.sections[0].title);
  expect(catalog.sections[1].sectionType).toBe(catalogOutput.sections[1].sectionType);
  expect(catalog.sections[1].videos.length).toBe(catalogOutput.sections[1].videos.length);
  expect(catalog.sections[1].title).toBe(catalogOutput.sections[1].title);
  expect(catalog.catalogOwner).toBe(catalogOutput.catalogOwner);
  expect(catalog.catalogType).toBe(catalogOutput.catalogType);
  expect(catalog.sectionCount).toBeGreaterThan(0);
};

let dataSources;

describe('Test catalog resolver', () => {
  beforeEach(() => {
    dataSources = {
      // videoCenterClient: new VideoCenterClient(),
      channelServiceClient: new ChannelServiceClient(),
      universalVideoServiceClient: new UniversalVideoServiceClient()
    };
  });

  it('Should create a new catalog successfully', async () => {
    mockDataSource(dataSources.universalVideoServiceClient, 'createCatalog', catalogOutput);
    mockDataSource(dataSources.channelServiceClient, 'associateChannelCatalog', null);
    mockDataSource(dataSources.universalVideoServiceClient, 'get', videoData);

    const catalog = await resolveMutationResponse(
      resolver,
      'createCatalog',
      getMockResolverRequestWithDataSources('Mutation.createCatalog', dataSources, { channelId, catalogInput })
    );
    expect(catalog.id).toBe(catalogId);
    matchCatalog(catalog);
  });

  it('Should fail due to authorization', async () => {
    mockDataSourceError(dataSources.universalVideoServiceClient, 'post', 'Unauthorised', '401');

    await expect(async () => {
      await resolveMutationResponse(
        resolver,
        'createCatalog',
        getMockResolverRequestWithDataSources('Mutation.createCatalog', dataSources, { channelId, catalogInput })
      );
    }).rejects.toThrow('Unauthorised');
  });

  it('Should fail due to failure in catalog-channel association', async () => {
    mockDataSource(dataSources.universalVideoServiceClient, 'createCatalog', catalogOutput);
    mockDataSourceError(dataSources.channelServiceClient, 'associateChannelCatalog', 'Not Found', '404');
    mockDataSource(dataSources.universalVideoServiceClient, 'get', videoData);

    await expect(async () => {
      await resolveMutationResponse(
        resolver,
        'createCatalog',
        getMockResolverRequestWithDataSources('Mutation.createCatalog', dataSources, { channelId, catalogInput })
      );
    }).rejects.toThrow('Not Found');
  });

  it('Get catalog should fail due to unauthorization', async () => {
    mockDataSourceError(dataSources.universalVideoServiceClient, 'get', 'Unauthorised', '401');

    await expect(async () => {
      await resolveQueryResponse(
        resolver,
        'getCatalog',
        getMockResolverRequestWithDataSources('Query.getCatalog', dataSources, { catalogId })
      );
    }).rejects.toThrow('Unauthorised');
  });

  it('Get catalog should fail due to not found', async () => {
    mockDataSourceError(dataSources.universalVideoServiceClient, 'get', 'Not Found', '404');

    await expect(async () => {
      await resolveQueryResponse(
        resolver,
        'getCatalog',
        getMockResolverRequestWithDataSources('Query.getCatalog', dataSources, { catalogId })
      );
    }).rejects.toThrow('Not Found');
  });

  it('Get catalog should fail due video endpoint failure', async () => {
    mockDataSourceError(dataSources.universalVideoServiceClient, 'get', 'Not Found', '404');

    await expect(async () => {
      await resolveQueryResponse(
        resolver,
        'getCatalog',
        getMockResolverRequestWithDataSources('Query.getCatalog', dataSources, { catalogId })
      );
    }).rejects.toThrow('Not Found');
  });

  it('Get catalog completes successfully', async () => {
    mockDataSource(dataSources.universalVideoServiceClient, 'getCatalog', catalogOutput);
    mockDataSource(dataSources.universalVideoServiceClient, 'get', videoData);

    const catalog = await resolveQueryResponse(
      resolver,
      'getCatalog',
      getMockResolverRequestWithDataSources('Query.getCatalog', dataSources, { catalogId })
    );
    matchCatalog(catalog);
    expect(catalog.sections[0].videos[0].displayName).toBe(videoData.data[0].title);
  });

  it('update catalog should fail due to unauthorization', async () => {
    mockDataSourceError(dataSources.universalVideoServiceClient, 'put', 'Unauthorised', '401');

    await expect(async () => {
      await resolveMutationResponse(
        resolver,
        'updateCatalog',
        getMockResolverRequestWithDataSources('Mutation.updateCatalog', dataSources, {
          channelId,
          catalogId,
          catalogInput
        })
      );
    }).rejects.toThrow('Unauthorised');
  });

  it('Update catalog Should fail as catalog not found', async () => {
    mockDataSourceError(dataSources.universalVideoServiceClient, 'put', 'Not Found', '404');

    await expect(async () => {
      await resolveMutationResponse(
        resolver,
        'updateCatalog',
        getMockResolverRequestWithDataSources('Mutation.updateCatalog', dataSources, {
          channelId,
          catalogId,
          catalogInput
        })
      );
    }).rejects.toThrow('Not Found');
  });

  it('Should update catalog successfully (video present)', async () => {
    mockDataSource(dataSources.universalVideoServiceClient, 'put', catalogOutput);
    mockDataSource(dataSources.universalVideoServiceClient, 'get', videoData);

    const catalog = await resolveMutationResponse(
      resolver,
      'updateCatalog',
      getMockResolverRequestWithDataSources('Mutation.updateCatalog', dataSources, {
        channelId,
        catalogId,
        catalogInput
      })
    );
    expect(catalog.id).toBe(catalogId);
    matchCatalog(catalog);
  });

  it('Should update catalog successfully (No video present)', async () => {
    mockDataSource(dataSources.universalVideoServiceClient, 'put', null);
    mockDataSource(dataSources.universalVideoServiceClient, 'get', null);
    mockDataSource(dataSources.universalVideoServiceClient, 'delete', null);
    mockDataSource(dataSources.channelServiceClient, 'delete', null);

    const catalog = await resolveMutationResponse(
      resolver,
      'updateCatalog',
      getMockResolverRequestWithDataSources('Mutation.updateCatalog', dataSources, {
        channelId,
        catalogId,
        catalogInputWithoutVideo
      })
    );
    expect(catalog).toBeNull();
  });
});

import { VideoFilterInput } from '@cvent/planner-event-hubs-model/types';
import { UniversalVideoServiceClient } from '@dataSources/universalVideoService/client';
import { v4 as uuidV4 } from 'uuid';
import { DEFAULT_CACHE_TTL } from '@utils/constants';

let dataSource = null;
beforeAll(() => {
  dataSource = new UniversalVideoServiceClient();
});

describe('Get videos with filter', () => {
  beforeEach(() => {
    dataSource.get = jest.fn().mockImplementation(async () => null);
    dataSource.post = jest.fn().mockImplementation(async () => null);
  });
  it('sends GET /videos/search', async () => {
    const filterInput: VideoFilterInput = {
      filter: "title eq 'video title'",
      sort: 'asc',
      limit: 100
    };
    await dataSource.getVideos(filterInput);
    expect(dataSource.get).toHaveBeenCalledWith('/videos/search', filterInput, { headers: { 'x-skip-cache': '1' } });
  });
  it('sends GET /catalog/catalogId without cache', async () => {
    const catalogId = uuidV4();
    await dataSource.getCatalog(catalogId);
    expect(dataSource.get).toHaveBeenCalledWith(`/catalogs/${catalogId}`, {}, { headers: { 'x-skip-cache': '1' } });
  });

  it('sends GET /catalog/catalogId with cache', async () => {
    const catalogId = uuidV4();
    await dataSource.getCatalog(catalogId, true);
    expect(dataSource.get).toHaveBeenCalledWith(
      `/catalogs/${catalogId}`,
      {},
      { cacheOptions: { ttl: DEFAULT_CACHE_TTL } }
    );
  });

  it('sends POST /videos/search', async () => {
    const filterInput: VideoFilterInput = {
      filter: "title eq 'video title'",
      sort: 'asc',
      limit: 100
    };
    await dataSource.postVideos(filterInput);
    expect(dataSource.post).toHaveBeenCalledWith(`/videos/search?sort=${filterInput.sort}&limit=${filterInput.limit}`, {
      filter: filterInput.filter
    });
  });
});

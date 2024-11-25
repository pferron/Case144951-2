import { LoggerFactory } from '@cvent/logging/LoggerFactory';
import { CvestDataSource } from '@dataSources/CvestDataSource';
import {
  Catalog,
  CatalogInput,
  PaginatedVideos,
  VideoFilterInput,
  VideoPlaybackInfo
} from '@cvent/planner-event-hubs-model/types';
import { getRequestOptionsWithCacheOptions } from '@utils/util';
import { URLSearchParams } from 'apollo-server-env';
import { getAccountMappingId } from '@resolvers/common/utils/authMetadataUtils';

const LOG = LoggerFactory.create('universal-video-service-client');
export class UniversalVideoServiceClient extends CvestDataSource {
  constructor() {
    super();
    this.baseURL = `${process.env.UNIVERSAL_VIDEO_SERVICE}/v1`;
  }

  // Video APIs

  getVideos = async (filterInput: VideoFilterInput, useCache = false): Promise<PaginatedVideos> => {
    LOG.debug('Get Videos search', filterInput);
    return this.get('/videos/search', filterInput, getRequestOptionsWithCacheOptions(useCache, {}));
  };

  postVideos = async (filterInput: VideoFilterInput): Promise<PaginatedVideos> => {
    LOG.debug('Post Videos search', filterInput);
    const { filter, ...params } = filterInput || {};
    const urlParams = new URLSearchParams({ ...params });
    return this.post(`/videos/search?${urlParams.toString()}`, { filter });
  };

  fetchVideo = async (videoId: string): Promise<VideoPlaybackInfo> => {
    return this.get(`/videos/${videoId}`, null, {
      headers: {
        'x-skip-cache': '1',
        authorization: `API_KEY ${process.env.API_KEY}`,
        accountMappingId: getAccountMappingId(this.context?.auth)
      }
    });
  };

  private createVideoFilter = (videoIds: Array<string>): string => {
    return `(id eq '${videoIds.join("' or id eq '")}')`;
  };

  fetchVideos = async (videoIds: Array<string>): Promise<Array<VideoPlaybackInfo>> => {
    const response = await this.get(
      `/videos?filter=${this.createVideoFilter(videoIds)}`,
      {},
      getRequestOptionsWithCacheOptions(false, {})
    );
    return response?.data;
  };

  // Catalog APIs

  createCatalog = async (catalogInput: CatalogInput): Promise<Catalog> => {
    return this.post('/catalogs', catalogInput);
  };

  updateCatalog = async (catalogId: string, catalogInput: CatalogInput): Promise<Catalog> => {
    return this.put(`/catalogs/${catalogId}`, catalogInput);
  };

  getCatalog = async (catalogId: string, useCache = false): Promise<Catalog> => {
    LOG.debug('Get catalog', catalogId);
    return this.get(`/catalogs/${catalogId}`, {}, getRequestOptionsWithCacheOptions(useCache, {}));
  };

  deleteCatalog = async (catalogId: string): Promise<void> => {
    return this.delete(`/catalogs/${catalogId}`);
  };

  listCatalogs = async (catalogFilterQuery: string): Promise<Array<Catalog>> => {
    const response = await this.get(
      `/catalogs?filter=${catalogFilterQuery}`,
      {},
      getRequestOptionsWithCacheOptions(false, {})
    );
    return response?.data;
  };
}

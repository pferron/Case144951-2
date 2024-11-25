import { LoggerFactory } from '@cvent/logging/LoggerFactory';
import { CvestDataSource } from '@dataSources/CvestDataSource';
import {
  NewBanner,
  BannerPagingResponse,
  ExistingBanner,
  FilterInput,
  BannerUpdate
} from '@cvent/planner-event-hubs-model/types';

const LOG = LoggerFactory.create('banner-service-client');
export class BannerServiceClient extends CvestDataSource {
  constructor() {
    super();
    this.baseURL = `${process.env.VIDEO_HUB_SERVICE}/v1/`;
  }

  getBanner = async (centerId: string, bannerId: string): Promise<ExistingBanner> => {
    LOG.debug('getBanner(bannerId)', bannerId);
    return this.get(`video-hubs/${centerId}/banners/${bannerId}`);
  };

  updateBanner = async (bannerUpdate: BannerUpdate): Promise<ExistingBanner> => {
    LOG.debug('updateBanner(bannerId)', bannerUpdate);
    return this.put(`video-hubs/${bannerUpdate.centerId}/banners/${bannerUpdate.id}`, bannerUpdate, {
      cacheRefreshOptions: { update: true }
    });
  };

  getBanners = async (centerId: string, filterInput: FilterInput): Promise<BannerPagingResponse> => {
    LOG.debug('getBanners(filterInput)', filterInput);
    const params: { token?: string; limit?: number } = {};

    if (filterInput?.token) {
      params.token = filterInput.token;
    }

    if (filterInput?.limit) {
      params.limit = filterInput.limit;
    }
    return this.get(`video-hubs/${centerId}/banners`, params);
  };

  bannerCreate = async (banner: NewBanner): Promise<ExistingBanner> => {
    LOG.debug('bannerCreate(banner)', banner);
    return this.post(`video-hubs/${banner.centerId}/banners`, banner);
  };

  bannerDelete = async (centerId: string, bannerId: string): Promise<void> => {
    LOG.debug('bannerDelete(bannerId)', bannerId);
    return this.delete(`video-hubs/${centerId}/banners/${bannerId}`, undefined, {
      cacheRefreshOptions: { evict: true }
    });
  };

  getBannersByIds = async (centerId: string, bannerIds: string[]): Promise<ExistingBanner[]> => {
    LOG.debug(`getBannersByIds (${bannerIds.length})`);

    return Promise.all(
      bannerIds.map(async (id): Promise<ExistingBanner> => {
        return this.getBanner(centerId, id);
      })
    );
  };
}

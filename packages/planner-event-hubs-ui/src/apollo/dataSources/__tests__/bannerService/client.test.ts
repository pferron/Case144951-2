import { getBanner, getBanners, bannerCreate, bannerDelete, updateBanner } from '@resolvers/common/dataAccess/banner';
import { BannerServiceClient } from '@dataSources/bannerService/client';
import { VideoCenterClient } from '@dataSources/videoCenterService/client';

class BannerServiceClientMock extends BannerServiceClient {
  // Override the protected methods
  public async get<TResult>(): Promise<TResult> {
    return null;
  }

  public async post<TResult>(): Promise<TResult> {
    return null;
  }

  public async put<TResult>(): Promise<TResult> {
    return null;
  }

  public async delete<TResult>(): Promise<TResult> {
    return null;
  }
}

class VideoCenterServiceClientMock extends VideoCenterClient {
  // Override the protected methods
  public async get<TResult>(): Promise<TResult> {
    return null;
  }

  public async post<TResult>(): Promise<TResult> {
    return null;
  }

  public async put<TResult>(): Promise<TResult> {
    return null;
  }

  public async delete<TResult>(): Promise<TResult> {
    return null;
  }
}

const bannerServiceClient = new BannerServiceClientMock();
const videoCenterClient = new VideoCenterServiceClientMock();
const testBanner = { id: 'anyBannerId' };
const testCenter = { id: 'anyCenterId' };

describe('Test Bannner Service client', () => {
  it('sends GET /{bannerId}', async () => {
    bannerServiceClient.get = jest.fn().mockImplementation(async () => testBanner);
    const banner = await getBanner(bannerServiceClient, testCenter.id, testBanner.id);
    expect(bannerServiceClient.get).toHaveBeenCalledWith(`video-hubs/anyCenterId/banners/${testBanner.id}`);
    expect(banner).toEqual(testBanner);
  });

  describe('getBanners()', () => {
    it('sends GET /', async () => {
      const serviceResponse = { data: [testBanner], paging: {} };
      bannerServiceClient.get = jest.fn().mockImplementation(async () => serviceResponse);
      const filterInput = { token: 'token', limit: 1 };
      const graphResponse = await getBanners(bannerServiceClient, testCenter.id, filterInput);
      expect(bannerServiceClient.get).toHaveBeenCalledWith('video-hubs/anyCenterId/banners', {
        limit: 1,
        token: 'token'
      });
      expect(graphResponse).toEqual(serviceResponse);
    });
  });

  describe('bannerCreate(newBanner)', () => {
    it('sends POST /', async () => {
      bannerServiceClient.post = jest.fn().mockImplementation(async () => testBanner);
      videoCenterClient.post = jest.fn().mockImplementation(async () => null);
      const centerId = 'cId';
      const newBanner = { centerId, name: 'name', layout: 'layout' };
      await bannerCreate(bannerServiceClient, newBanner);
      expect(bannerServiceClient.post).toHaveBeenCalledWith('video-hubs/cId/banners', newBanner);
    });
  });

  describe('bannerDelete(bannerId)', () => {
    it('sends DELETE /{bannerId}', async () => {
      bannerServiceClient.delete = jest.fn().mockImplementation(async () => null);
      await bannerDelete(bannerServiceClient, testCenter.id, testBanner.id);
      expect(bannerServiceClient.delete).toHaveBeenCalledWith(
        `video-hubs/anyCenterId/banners/${testBanner.id}`,
        undefined,
        {
          cacheRefreshOptions: { evict: true }
        }
      );
    });
  });

  describe('bannerUpdate(BannerUpdate)', () => {
    it('sends PUT /{bannerId}', async () => {
      const bannerUpdate = { id: testBanner.id, centerId: testCenter.id, name: 'name', layout: 'layout' };
      bannerServiceClient.put = jest.fn().mockImplementation(async () => bannerUpdate);
      const banner = await updateBanner(bannerServiceClient, bannerUpdate);
      expect(banner).toEqual(bannerUpdate);
      expect(bannerServiceClient.put).toHaveBeenCalledWith(
        `video-hubs/anyCenterId/banners/${bannerUpdate.id}`,
        bannerUpdate,
        {
          cacheRefreshOptions: { update: true }
        }
      );
    });
  });
});

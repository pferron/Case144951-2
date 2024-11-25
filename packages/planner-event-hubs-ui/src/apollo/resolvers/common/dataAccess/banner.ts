import {
  FilterInput,
  NewBanner,
  ExistingBanner,
  BannerPagingResponse,
  BannerUpdate
} from '@cvent/planner-event-hubs-model/types';
import { BannerServiceClient } from '@dataSources/bannerService/client';

export const getBanner = async (
  bannerServiceClient: BannerServiceClient,
  centerId: string,
  bannerId: string
): Promise<ExistingBanner> => {
  return bannerServiceClient.getBanner(centerId, bannerId);
};

export const getBanners = async (
  bannerServiceClient: BannerServiceClient,
  centerId: string,
  filterInput: FilterInput
): Promise<BannerPagingResponse> => {
  return bannerServiceClient.getBanners(centerId, filterInput);
};

export const bannerCreate = async (bannerServiceClient: BannerServiceClient, newBanner: NewBanner): Promise<string> => {
  const bannerId = (await bannerServiceClient.bannerCreate(newBanner)).id;
  return bannerId;
};

export const bannerDelete = async (
  bannerServiceClient: BannerServiceClient,
  centerId: string,
  bannerId: string
): Promise<string> => {
  await bannerServiceClient.bannerDelete(centerId, bannerId);
  return bannerId;
};

export const updateBanner = async (
  bannerServiceClient: BannerServiceClient,
  bannerUpdate: BannerUpdate
): Promise<ExistingBanner> => {
  return bannerServiceClient.updateBanner(bannerUpdate);
};

import { ExistingBanner, BannerPagingResponse, Resolvers, EntityType } from '@cvent/planner-event-hubs-model/types';
import { bannerCreate, getBanner, getBanners, bannerDelete, updateBanner } from '@resolvers/common/dataAccess/banner';
import { publishImage } from '@resolvers/common/dataAccess/upload';
import { getAccountMappingId } from '@resolvers/common/utils/authMetadataUtils';

const resolver: Resolvers = {
  Query: {
    banner: async (_parent, args, { dataSources }): Promise<ExistingBanner> => {
      return getBanner(dataSources.bannerServiceClient, args.bannersSearch.centerId, args.bannersSearch.bannerId);
    },
    banners: async (_parent, args, { dataSources }): Promise<BannerPagingResponse> => {
      return getBanners(dataSources.bannerServiceClient, args.bannerFilter.centerId, args.bannerFilter.filterInput);
    }
  },
  Mutation: {
    bannerCreate: async (_parent, args, { dataSources }): Promise<string> => {
      return bannerCreate(dataSources.bannerServiceClient, args.input);
    },
    bannerDelete: async (_parent, args, { dataSources }): Promise<string> => {
      return bannerDelete(dataSources.bannerServiceClient, args.bannersSearch.centerId, args.bannersSearch.bannerId);
    },
    bannerUpdate: async (_parent, args, { dataSources, auth }): Promise<ExistingBanner> => {
      const banner = args.input;
      const accountMappingId = getAccountMappingId(auth);
      if (banner.newImageUrl) {
        const { originalImageUrl, optimizedImageUrl } = await publishImage(
          {
            newImageUrl: banner.newImageUrl,
            newOriginalImageUrl: banner.newOriginalImageUrl,
            imageUrl: banner.imageUrl,
            originalImageUrl: banner.originalImageUrl
          },
          {
            accountMappingId,
            centerId: banner.centerId,
            entityId: banner.id,
            entityType: EntityType.Banner
          },
          dataSources
        );
        banner.imageUrl = optimizedImageUrl;
        banner.originalImageUrl = originalImageUrl;
      }
      return updateBanner(dataSources.bannerServiceClient, banner);
    }
  }
};

export default resolver;

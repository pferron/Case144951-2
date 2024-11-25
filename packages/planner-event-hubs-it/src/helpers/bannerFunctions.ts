import { ApolloClient, FetchResult, NormalizedCacheObject } from '@apollo/client';
import {
  ExistingBanner,
  FilterInput,
  NewBanner,
  BannerPagingResponse,
  BannerUpdate
} from '@cvent/planner-event-hubs-model/types';
import {
  GET_BANNER,
  GET_BANNERS,
  CREATE_BANNER_MUTATION,
  DELETE_BANNER_MUTATION,
  UPDATE_BANNER_MUTATION
} from '@cvent/planner-event-hubs-model/operations/banner';

export const rawCreateBanner = async (
  client: ApolloClient<NormalizedCacheObject>,
  input: NewBanner
): Promise<FetchResult> => {
  return client.mutate({
    mutation: CREATE_BANNER_MUTATION,
    variables: {
      input
    }
  });
};

export const getBanner = async (
  client: ApolloClient<NormalizedCacheObject>,
  centerId: string,
  bannerId: string
): Promise<ExistingBanner> => {
  const response = await client.query({
    query: GET_BANNER,
    variables: {
      bannersSearch: {
        centerId,
        bannerId
      }
    }
  });
  return response.data.banner;
};

export const getBanners = async (
  client: ApolloClient<NormalizedCacheObject>,
  centerId: string,
  filterInput: FilterInput
): Promise<BannerPagingResponse> => {
  const response = await client.query({
    query: GET_BANNERS,
    variables: {
      bannerFilter: {
        centerId,
        filterInput
      }
    }
  });
  return response.data.banners;
};

export const createBanner = async (client: ApolloClient<NormalizedCacheObject>, input: NewBanner): Promise<string> => {
  return (await rawCreateBanner(client, input))?.data?.bannerCreate;
};

export const deleteBanner = async (
  client: ApolloClient<NormalizedCacheObject>,
  centerId: string,
  bannerId: string
): Promise<string> => {
  const response = await client.mutate({
    mutation: DELETE_BANNER_MUTATION,
    variables: {
      bannersSearch: {
        centerId,
        bannerId
      }
    }
  });

  return response.data.bannerDelete;
};

export const updateBanner = async (
  client: ApolloClient<NormalizedCacheObject>,
  input: BannerUpdate
): Promise<ExistingBanner> => {
  const response = await client.mutate({
    mutation: UPDATE_BANNER_MUTATION,
    variables: {
      input
    }
  });
  return response.data.bannerUpdate;
};

import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { Catalog, CatalogInput } from '@cvent/planner-event-hubs-model/types';
import {
  getCatalogQuery,
  updateCatalogMutation,
  createCatalogMutation
} from '@cvent/planner-event-hubs-model/operations/channel';

export const createCatalog = async (
  client: ApolloClient<NormalizedCacheObject>,
  channelId: string,
  catalogInput: CatalogInput
): Promise<Catalog> => {
  const response = await client.mutate({
    mutation: createCatalogMutation,
    variables: {
      channelId,
      catalogInput
    }
  });
  expect(response).toBeTruthy();
  expect(response.data).toBeTruthy();
  return response.data.createCatalog;
};

export const updateCatalog = async (
  client: ApolloClient<NormalizedCacheObject>,
  channelId: string,
  catalogId: string,
  catalogInput: CatalogInput
): Promise<Catalog> => {
  const response = await client.mutate({
    mutation: updateCatalogMutation,
    variables: {
      channelId,
      catalogId,
      catalogInput
    }
  });
  expect(response).toBeTruthy();
  expect(response.data).toBeTruthy();
  return response.data.updateCatalog;
};

export const getCatalog = async (client: ApolloClient<NormalizedCacheObject>, catalogId: string): Promise<Catalog> => {
  const response = await client.query({
    query: getCatalogQuery,
    variables: {
      catalogId
    }
  });
  expect(response).toBeTruthy();
  expect(response.data).toBeTruthy();
  return response.data.getCatalog;
};

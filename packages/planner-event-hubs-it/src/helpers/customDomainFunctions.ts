import { ApolloClient, FetchResult, NormalizedCacheObject } from '@apollo/client';
import {
  createHubCustomDomainMapping,
  deleteHubCustomDomainMapping,
  getCustomDomainForAccountQuery,
  getCustomDomainForHubQuery,
  updateHubCustomDomainMapping
} from '@cvent/planner-event-hubs-model/operations/customDomain';
import { CustomDomain, CustomDomainMapping, CustomDomainMappingInput } from '@cvent/planner-event-hubs-model/types';

export const getCustomDomainForHub = async (
  client: ApolloClient<NormalizedCacheObject>,
  hubId: string
): Promise<CustomDomainMapping> => {
  const response = await client.query({
    query: getCustomDomainForHubQuery,
    variables: {
      hubId
    }
  });
  return response.data.getCustomDomainForHub;
};

export const getCustomDomainForAccount = async (
  client: ApolloClient<NormalizedCacheObject>
): Promise<Array<CustomDomain>> => {
  const response = await client.query({
    query: getCustomDomainForAccountQuery
  });
  return response.data.getCustomDomainForAccount;
};

export const createHubCustomDomain = async (
  client: ApolloClient<NormalizedCacheObject>,
  input: CustomDomainMappingInput
): Promise<FetchResult> => {
  return client.mutate({
    mutation: createHubCustomDomainMapping,
    variables: {
      input
    }
  });
};

export const updateHubCustomDomain = async (
  client: ApolloClient<NormalizedCacheObject>,
  input: CustomDomainMappingInput
): Promise<FetchResult> => {
  return client.mutate({
    mutation: updateHubCustomDomainMapping,
    variables: {
      input
    }
  });
};

export const deleteHubCustomDomain = async (
  client: ApolloClient<NormalizedCacheObject>,
  hubId: string
): Promise<FetchResult> => {
  return client.mutate({
    mutation: deleteHubCustomDomainMapping,
    variables: {
      hubId
    }
  });
};

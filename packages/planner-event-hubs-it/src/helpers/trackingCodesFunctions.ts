import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import {
  HubCodeSnippets,
  MeasurementIdInput,
  MeasurementIdResponse,
  CodeSnippetInput,
  RemoveCodeSnippetInput,
  CodeSnippet,
  Success
} from '@cvent/planner-event-hubs-model/types';
import {
  saveCodeSnippet as saveCodeSnippetMutation,
  updateCodeSnippet as updateCodeSnippetMutation,
  saveGoogleMeasurementMutation,
  getGoogleMeasurementQuery,
  removeCodeSnippet
} from '@cvent/planner-event-hubs-model/operations/trackingCodes';
import { getHubCodeSnippets as getHubCodeSnippetsQuery } from '@cvent/planner-event-hubs-model/operations/hub';

export const getHubCodeSnippets = async (
  client: ApolloClient<NormalizedCacheObject>,
  hubId: string
): Promise<HubCodeSnippets[]> => {
  const response = await client.query({
    query: getHubCodeSnippetsQuery,
    variables: {
      hubId
    }
  });
  return response.data;
};

export const saveGoogleAnalytics = async (
  client: ApolloClient<NormalizedCacheObject>,
  input: MeasurementIdInput
): Promise<MeasurementIdResponse> => {
  const response = await client.mutate({
    mutation: saveGoogleMeasurementMutation,
    variables: {
      input
    }
  });
  return response.data.saveGoogleMeasurementId;
};

export const getGoogleAnalytics = async (
  client: ApolloClient<NormalizedCacheObject>,
  hubId: string
): Promise<MeasurementIdResponse> => {
  const response = await client.query({
    query: getGoogleMeasurementQuery,
    variables: {
      hubId
    }
  });
  return response.data.getGoogleMeasurementId;
};

export const saveCodeSnippet = async (
  client: ApolloClient<NormalizedCacheObject>,
  input: CodeSnippetInput
): Promise<CodeSnippet> => {
  const response = await client.mutate({
    mutation: saveCodeSnippetMutation,
    variables: {
      input
    }
  });
  return response.data.saveCodeSnippet;
};

export const updateCodeSnippet = async (
  client: ApolloClient<NormalizedCacheObject>,
  input: CodeSnippetInput
): Promise<CodeSnippet> => {
  const response = await client.mutate({
    mutation: updateCodeSnippetMutation,
    variables: {
      input
    }
  });
  return response.data.updateCodeSnippet;
};

export const removeCodeSnippetData = async (
  client: ApolloClient<NormalizedCacheObject>,
  input: RemoveCodeSnippetInput
): Promise<Success> => {
  const response = await client.mutate({
    mutation: removeCodeSnippet,
    variables: {
      input
    }
  });
  return response.data.getCodeSnippetsList;
};

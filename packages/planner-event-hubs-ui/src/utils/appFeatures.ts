import { LoggerFactory } from '@cvent/logging/LoggerFactory';
import type { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { AppFeatureInput } from '@cvent/planner-event-hubs-model/types';
import { EVENTS_PLUS_FEATURE_VERSION } from '@utils/constants';
import { getAppFeaturesQuery } from '@cvent/planner-event-hubs-model/operations/appfeatures';

const LOG = LoggerFactory.create('appFeatures');

type featureValues = boolean | number | { experimentName: string; version: number };
type AppFeaturesMap = { [key: string]: featureValues };

const convertFeaturesToRequest = (appFeatures: AppFeaturesMap): AppFeatureInput[] => {
  return Object.entries(appFeatures)
    .filter(([_, experiment]) => typeof experiment !== 'boolean')
    .map(([name, experiment]) => {
      if (typeof experiment === 'boolean') return null; // Already filtered out but this helps TypeScript figure it out
      return typeof experiment === 'number'
        ? {
            name,
            experimentName: EVENTS_PLUS_FEATURE_VERSION,
            featureVersion: experiment
          }
        : {
            name,
            experimentName: experiment.experimentName,
            featureVersion: experiment.version
          };
    });
};

export const getAppFeatures = async (
  apolloClient: ApolloClient<NormalizedCacheObject>,
  baseAppFeatures: AppFeaturesMap
): Promise<
  {
    name: string;
    enabled: boolean;
    experimentVersion: string;
  }[]
> => {
  if (apolloClient == null) {
    LOG.error('Cannot retrieve app features data without authToken');
    return;
  }

  const appFeaturesSetToTrue = Object.fromEntries(
    Object.entries(baseAppFeatures).filter(([_, experiment]) => typeof experiment === 'boolean')
  );
  try {
    const response = await apolloClient.query({
      query: getAppFeaturesQuery,
      variables: {
        appFeatures: convertFeaturesToRequest(baseAppFeatures)
      },
      fetchPolicy: 'no-cache'
    });

    LOG.debug(`Graph response for appFeature: ${JSON.stringify(response)}`);
    // RED
    // eslint-disable-next-line consistent-return
    return [
      // RED
      // eslint-disable-next-line no-unsafe-optional-chaining
      ...Object.entries(appFeaturesSetToTrue)?.map(([key, value]) => ({
        name: key,
        enabled: value,
        experimentVersion: null
      })),
      // RED
      // eslint-disable-next-line no-unsafe-optional-chaining
      ...response?.data?.getAppFeatures
    ];
  } catch (error) {
    LOG.error('Error fetching appFeatures:', error);
    throw error;
  }
};

import { ApolloClient, NormalizedCacheObject, gql } from '@apollo/client';
import { AppFeature, AppFeatureInput } from '@cvent/planner-event-hubs-model/src/types';
import { getConfigs } from '../configs/testConfig';

const EVENTS_PLUS_FEATURE_VERSION = 'events_plus_feature_version';

type featureValues = number | { experimentName: string; version: number };
type AppFeaturesMap = { [key: string]: featureValues };

const GET_APP_FEATURES = gql`
  query getAppFeatures($accountId: Int, $appFeatures: [AppFeatureInput!]!) {
    getAppFeatures(accountId: $accountId, appFeatures: $appFeatures) {
      name
      enabled
      experimentVersion
    }
  }
`;

/**
 * Convert appFeatures to booleans based on the events_plus_feature_version
 */
export const convertFeaturesToRequest = (baseAppFeatures: AppFeaturesMap): AppFeatureInput[] => {
  return Object.entries(baseAppFeatures)
    ?.filter(([_, experiment]) => typeof experiment !== 'boolean')
    ?.map(([name, experiment]) => {
      return typeof experiment === 'number'
        ? {
            name,
            experimentName: EVENTS_PLUS_FEATURE_VERSION,
            featureVersion: experiment
          }
        : {
            name,
            experimentName: experiment?.experimentName,
            featureVersion: experiment?.version
          };
    });
};

export const getAppFeatures = async (
  apolloClient: ApolloClient<NormalizedCacheObject>,
  baseAppFeatures: AppFeaturesMap
): Promise<AppFeature[]> => {
  const configs = getConfigs();
  const accountId = Number(configs.testUsers.accountId);
  const appFeaturesSetToTrue = Object.fromEntries(
    Object.entries(baseAppFeatures).filter(([_, experiment]) => typeof experiment === 'boolean')
  );
  const response = await apolloClient.query({
    query: GET_APP_FEATURES,
    variables: {
      accountId,
      appFeatures: convertFeaturesToRequest(baseAppFeatures)
    },
    fetchPolicy: 'no-cache'
  });
  return [
    ...(Object.entries(appFeaturesSetToTrue)?.map(([key, value]) => ({
      name: key,
      enabled: value,
      experimentVersion: null
    })) || []),
    ...(response?.data?.getAppFeatures || [])
  ];
};

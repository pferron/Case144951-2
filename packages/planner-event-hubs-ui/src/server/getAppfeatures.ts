import experimentClient from '@resolvers/common/clients/ExperimentsClient';
import { AppFeature, AppFeatureInput } from '@cvent/planner-event-hubs-model/types';

export const getAppFeatures = async (
  accountId: number,
  appFeatures: Array<AppFeatureInput>
): Promise<Array<AppFeature>> => {
  return Promise.all(
    appFeatures.map(async (appFeature): Promise<AppFeature> => {
      const experimentVersion = await experimentClient.getExperimentVariant(
        appFeature.experimentName,
        String(accountId)
      );
      return {
        name: appFeature.name,
        enabled: appFeature.featureVersion <= experimentVersion,
        experimentVersion: String(experimentVersion)
      };
    })
  );
};

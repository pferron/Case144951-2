import { Feature } from '@cvent/planner-event-hubs-model/types';

export const isFeatureEnabled = (features: Record<string, boolean>, featureCode: string): boolean => {
  return features?.[featureCode] ? features?.[featureCode] : false;
};

export const reducePlannerFeatures = (features: Feature[]): Record<string, boolean> =>
  features?.reduce(
    (acc, feature: Feature) => ({
      ...acc,
      [feature?.code]: feature?.enabled
    }),
    {}
  );

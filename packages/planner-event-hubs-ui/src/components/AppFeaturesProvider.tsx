import React, { useContext, useState, ReactNode } from 'react';
import { AppFeature } from '@cvent/planner-event-hubs-model/types';

const ERROR_MESSAGE = 'must be used within a AppFeaturesContextProvider';
/**
 * Context which stores app features
 */
const AppFeaturesContext = React.createContext<Array<AppFeature>>([]);

/**
 * Provider which can be used to initialize the app features context
 * @param children - child of provider
 * @param value of type AppFeaturesTypes
 */
function AppFeaturesProvider({ children, value = [] }: Props): JSX.Element {
  const [appFeatures] = useState(value);
  return <AppFeaturesContext.Provider value={appFeatures}>{children}</AppFeaturesContext.Provider>;
}

export const reduceAppFeatures = (appFeaturesArray: Array<AppFeature>): Record<string, boolean> =>
  appFeaturesArray?.reduce(
    (acc, feature: AppFeature) => ({
      ...acc,
      [feature?.name]: feature?.enabled
    }),
    {}
  );
/**
 * Helper hook which returns all AppFeatures data from context state
 */
function useAppFeatures(): Record<string, boolean> {
  const context = useContext(AppFeaturesContext);
  if (!context) {
    throw new Error(`useAppFeatures ${ERROR_MESSAGE}`);
  }
  return reduceAppFeatures(context);
}

/**
 * Note that we are not exporting @AppFeaturesContext. This is intentional.
 * We expose only one way to provide the context value and only one way to consume it.
 * This allows us to ensure that people are using the context value the way it should be
 * and it allows us to provide useful utilities for our consumers.
 */
export { AppFeaturesProvider, useAppFeatures };

interface Props {
  children: ReactNode;
  value: AppFeature[];
}

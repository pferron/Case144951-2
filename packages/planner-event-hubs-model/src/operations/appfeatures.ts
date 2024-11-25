import gql from 'graphql-tag';

export const getAppFeaturesQuery = gql`
  query getAppFeatures($appFeatures: [AppFeatureInput!]!) {
    getAppFeatures(appFeatures: $appFeatures) {
      name
      enabled
      experimentVersion
    }
  }
`;

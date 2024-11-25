import gql from 'graphql-tag';

export default gql`
  extend type Query {
    getAppFeatures(
      accountId: Int
      # The app features to resolve
      appFeatures: [AppFeatureInput!]!
    ): [AppFeature] @auth(methods: [BEARER], roles: [])
  }

  """
  A single app feature to resolve. Defines the backing experiment and the version
  the variant must on or above for the feature to be enabled.
  """
  input AppFeatureInput {
    # The name of the feature, it is simply passed through to the output.
    name: String!
    # The name of the underlying experiment powering the feature
    experimentName: String!
    # The version to check against the experiment. A feature is enabled if this version
    # is lower or equal to the experiment version. Note that missing or malformed variants
    # are set to version 0. You may set this value to 0 to ensure the feature is enabled.
    featureVersion: Int!
  }

  """
  App Feature
  """
  type AppFeature {
    # The name of the feature, parrots back the name from the input for easy mapping.
    name: String!
    # Whether the feature is enabled.
    enabled: Boolean!
    # The version found in the metadata { version: 10 }. If the field does not exist null
    # will be returned instead. This is not needed but very helpful to trouble shoot
    experimentVersion: String
  }

  """
  Experiment
  """
  type ExperimentResponse {
    experimentName: String
    version: Int
    variant: ExperimentVariant
  }

  type ExperimentVariant {
    id: Int
    description: String
    weight: Int
    include: [String]
    exclude: [String]
    metadata: Version
  }
  type Version {
    version: Int
  }
`;

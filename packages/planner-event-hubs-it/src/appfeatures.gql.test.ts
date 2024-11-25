// FIREBALL
/* eslint-disable jest/no-standalone-expect */
import { LoggerFactory } from '@cvent/logging/LoggerFactory';
import { authOptions, connectToApiAsPlanner } from '@helpers/connectToApiAsPlanner';
import { AppFeatureInput } from '@cvent/planner-event-hubs-model/types';
import { getAppFeaturesQuery } from '@cvent/planner-event-hubs-model/operations/appfeatures';
import { skipItIfProdEnvironment } from '@utils/commonUtils';

const LOG = LoggerFactory.create('appFeature.graphql.test');
const EVENTS_PLUS_FEATURE_VERSION = 'events_plus_feature_version';
const appFeatures: AppFeatureInput[] = [
  {
    name: 'sampleFeature1',
    experimentName: EVENTS_PLUS_FEATURE_VERSION,
    featureVersion: 1
  },
  {
    name: 'sampleFeature2',
    experimentName: EVENTS_PLUS_FEATURE_VERSION,
    featureVersion: 100
  },
  {
    name: 'sampleFeature3',
    experimentName: EVENTS_PLUS_FEATURE_VERSION,
    featureVersion: 1001
  },
  {
    name: 'sampleFeature4',
    experimentName: EVENTS_PLUS_FEATURE_VERSION,
    featureVersion: 1
  }
];

let client;

beforeAll(async () => {
  client = await connectToApiAsPlanner(authOptions);
}, 10000);

describe('App features graph IT', () => {
  it('should get app feature values as per provided accountId', async () => {
    const { data } = await client
      .query({
        query: getAppFeaturesQuery,
        variables: { appFeatures, accountId: 123456 }
      })
      .catch(error => {
        LOG.error('Failed to fetch app features query', error);
      });

    const appFeatureList = data.getAppFeatures;
    expect(appFeatureList).toBeTruthy();
    expect(appFeatureList[0].name).toEqual('sampleFeature1');
    expect(appFeatureList[0].enabled).toBeDefined();
    expect(appFeatureList[1].name).toEqual('sampleFeature2');
    expect(appFeatureList[2].name).toEqual('sampleFeature3');
    expect(appFeatureList[3].name).toEqual('sampleFeature4');
    expect(appFeatureList[3].enabled).toBeDefined();
  });

  skipItIfProdEnvironment()(
    'should get default feature with experimentVersion as 0 when experimentName is invalid',
    async () => {
      const response = await client
        .query({
          query: getAppFeaturesQuery,
          variables: {
            accountId: 123456,
            appFeatures: [
              {
                name: 'dummyFeature',
                experimentName: 'dummy',
                featureVersion: 1
              }
            ]
          }
        })
        .catch(error => {
          LOG.error('Failed to fetch app features query', error);
        });

      const appFeatureList = response.data.getAppFeatures;
      expect(appFeatureList).toBeTruthy();
      expect(appFeatureList[0].name).toEqual('dummyFeature');
      expect(appFeatureList[0].experimentVersion).toEqual('0');
      expect(appFeatureList[0].enabled).toEqual(false);
    }
  );
});

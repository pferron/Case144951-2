import { getAppFeatures } from '@utils/appFeatures';
import { ApolloClient, InMemoryCache } from '@apollo/client';

jest.mock('../../../appFeatures.ts', () => ({
  appFeatures: {
    testAppFeature: 2,
    testExperiment: {
      name: 'testExperiment',
      experimentName: 'testExperimentName',
      version: 4
    },
    hardCodedAppFeature: true
  }
}));
const appFeaturesQueryResult = [
  {
    name: 'testAppFeature',
    enabled: false,
    experimentVersion: '0'
  },
  {
    name: 'testExperiment',
    enabled: true,
    experimentVersion: '4'
  }
];
describe('App feature util test', () => {
  it('should create correct appfeatures', async () => {
    const client = new ApolloClient({ cache: new InMemoryCache() });
    const apolloClientSpy = jest.spyOn(client, 'query');
    apolloClientSpy.mockReturnValueOnce(
      new Promise(resolve => {
        resolve({
          loading: false,
          networkStatus: 1,
          data: {
            getAppFeatures: appFeaturesQueryResult
          }
        });
      })
    );
    const expectedResult = [
      {
        name: 'hardCodedAppFeature',
        enabled: true,
        experimentVersion: null
      },
      ...appFeaturesQueryResult
    ];
    const result = await getAppFeatures(client, {
      hardCodedAppFeature: true
    });
    expect(result).toMatchObject(expectedResult);
  });

  // RED - this test was ported from video-hub-ui but the appFeatures implementation was ported from planner-video and does not handle this case (yet)
  // eslint-disable-next-line jest/no-disabled-tests
  it.skip('should return only hardcoded app features when other call fails', async () => {
    const client = new ApolloClient({ cache: new InMemoryCache() });
    const apolloClientSpy = jest.spyOn(client, 'query');
    apolloClientSpy.mockRejectedValueOnce(
      new Promise(reject => {
        reject(new Error('some error occurred'));
      })
    );
    const expectedResult = [
      {
        name: 'hardCodedAppFeature',
        enabled: true,
        experimentVersion: null
      }
    ];
    const result = await getAppFeatures(client, {
      hardCodedAppFeature: true
    });
    expect(result).toMatchObject(expectedResult);
  });
});

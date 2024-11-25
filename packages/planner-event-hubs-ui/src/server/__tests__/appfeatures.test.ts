/**
 * @jest-environment node
 */
import fetchMock from 'jest-fetch-mock';
import { getAppFeatures } from '@server/getAppfeatures';
import experimentClient from '@resolvers/common/clients/ExperimentsClient';

fetchMock.enableMocks();

describe('Get App Feature Tests', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  const accountId = 123;

  it.each([
    [
      'when feature version is zero should return enabled for missing experiment',
      { experimentVersion: null, featureVersion: 0, isEnabled: true }
    ],
    [
      'when feature version is NOT zero should return disabled for missing experiment',
      { experimentVersion: null, featureVersion: 1, isEnabled: false }
    ],
    [
      'should return enabled for version equal to provided',
      { experimentVersion: 10, featureVersion: 10, isEnabled: true }
    ],
    [
      'should return enabled for version higher than provided',
      { experimentVersion: 20, featureVersion: 10, isEnabled: true }
    ],
    [
      'should return disabled for version lower than provided',
      { experimentVersion: 10, featureVersion: 20, isEnabled: false }
    ]
  ])('%s', async (_, { experimentVersion, featureVersion, isEnabled }) => {
    const feature = [{ name: 'testFeature', experimentName: 'events_plus_feature_version', featureVersion }];

    const variantsSearchSpy = jest.spyOn(experimentClient, 'getExperimentVariant');
    variantsSearchSpy.mockReturnValueOnce(Promise.resolve(experimentVersion));

    const actual = await getAppFeatures(accountId, feature);
    expect(actual).toBeDefined();
    expect(actual[0].enabled).toBe(isEnabled);
  });

  it('multiple app features requested', async () => {
    // Feature names include enabled/disabled to more easily reference expected values
    const appFeatures = [
      { name: 'a_enabled', experimentName: 'exp_a', featureVersion: 0 },
      { name: 'b_enabled', experimentName: 'exp_b', featureVersion: 0 },
      { name: 'c_enabled', experimentName: 'exp_c', featureVersion: 0 },
      { name: 'd_disabled', experimentName: 'exp_d', featureVersion: 1 },
      { name: 'e_disabled', experimentName: 'exp_e', featureVersion: 1 },
      { name: 'f_enabled', experimentName: 'exp_f', featureVersion: 1 },
      { name: 'g_enabled', experimentName: 'exp_g', featureVersion: 1 },
      // The last feature is purposefully reusing exp_g
      { name: 'h_disabled', experimentName: 'exp_g', featureVersion: 4 }
    ];

    const variantsSearchSpy = jest.spyOn(experimentClient, 'getExperimentVariant');
    variantsSearchSpy
      .mockReturnValueOnce(Promise.resolve(0)) // a
      .mockReturnValueOnce(Promise.resolve(0)) // b
      .mockReturnValueOnce(Promise.resolve(1)) // c
      .mockReturnValueOnce(Promise.resolve(0)) // d
      .mockReturnValueOnce(Promise.resolve(0)) // e
      .mockReturnValueOnce(Promise.resolve(1)) // f
      .mockReturnValueOnce(Promise.resolve(2)) // g
      .mockReturnValueOnce(Promise.resolve(0)); // h

    const response = [
      {
        name: 'a_enabled',
        enabled: true,
        experimentVersion: '0'
      },
      {
        name: 'b_enabled',
        enabled: true,
        experimentVersion: '0'
      },
      {
        name: 'c_enabled',
        enabled: true,
        experimentVersion: '1'
      },
      {
        name: 'd_disabled',
        enabled: false,
        experimentVersion: '0'
      },
      {
        name: 'e_disabled',
        enabled: false,
        experimentVersion: '0'
      },
      {
        name: 'f_enabled',
        enabled: true,
        experimentVersion: '1'
      },
      {
        name: 'g_enabled',
        enabled: true,
        experimentVersion: '2'
      },
      {
        name: 'h_disabled',
        enabled: false,
        experimentVersion: '0'
      }
    ];

    const actual = await getAppFeatures(accountId, appFeatures);
    expect(actual).toMatchObject(response);
  });
});

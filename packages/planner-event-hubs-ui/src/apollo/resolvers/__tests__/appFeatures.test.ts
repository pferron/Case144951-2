/**
 * @jest-environment node
 */
import resolver from '@resolvers/appfeatures';
import { resolveQueryResponse } from '@resolvers/common/testUtils/mockFunction';
import { getMockResolverRequest } from '@resolvers/common/testUtils/mockRequestData';
import experimentsClient from '@resolvers/common/clients/ExperimentsClient';

describe('Test appFeature resolver', () => {
  it('Get app feature should fail due experiment call failure', async () => {
    const spy = jest.spyOn(experimentsClient, 'getExperimentVariant');
    spy.mockRejectedValueOnce(new Error('Internal server Error'));

    await expect(async () => {
      await resolveQueryResponse(
        resolver,
        'getAppFeatures',
        getMockResolverRequest('Query.getAppFeatures', {
          hubId: 'hubId',
          accountId: 'accountId',
          appFeatures: [
            {
              name: 'testExperiment',
              experimentName: 'TEST_EXPERIMENT',
              featureVersion: '1'
            }
          ]
        })
      );
    }).rejects.toThrow('Internal server Error');
  });
});

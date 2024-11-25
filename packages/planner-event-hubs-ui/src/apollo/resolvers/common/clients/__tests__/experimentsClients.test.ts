/**
 * @jest-environment node
 */
import fetchMock from 'jest-fetch-mock';
import { ExperimentClient } from '@cvent/experiment-client/ExperimentClient';
import data from './fixtures/experimentData.json';
import experimentsClient from '../ExperimentsClient';

const experimentName = 'test-experiment';
const accountId = 'accountId';
fetchMock.enableMocks();

describe('Experiment Client Tests', () => {
  jest.setTimeout(20000);

  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it('should return valid experiment version when id is 1', async () => {
    jest.spyOn(ExperimentClient.prototype, 'getExperimentVariant').mockImplementation(() => {
      return new Promise(resolve => {
        resolve(data[0]);
      });
    });
    const response = await experimentsClient.getExperimentVariant(experimentName, accountId);
    expect(response).toBe(1);
  });

  it('should return valid experiment version when id is 0', async () => {
    jest.spyOn(ExperimentClient.prototype, 'getExperimentVariant').mockImplementation(() => {
      return new Promise(resolve => {
        resolve(data[1]);
      });
    });
    const response = await experimentsClient.getExperimentVariant(experimentName, accountId);
    expect(response).toBe(0);
  });

  it('should return experiment version as 0 when experiment is null', async () => {
    jest.spyOn(ExperimentClient.prototype, 'getExperimentVariant').mockImplementation(() => {
      return new Promise(resolve => {
        resolve(null);
      });
    });
    const response = await experimentsClient.getExperimentVariant(experimentName, accountId);
    expect(response).toBe(0);
  });

  it('should return experiment version as 0 when experiment is undefined', async () => {
    jest.spyOn(ExperimentClient.prototype, 'getExperimentVariant').mockImplementation(() => {
      return new Promise(resolve => {
        resolve(undefined);
      });
    });
    const response = await experimentsClient.getExperimentVariant(experimentName, accountId);
    expect(response).toBe(0);
  });

  it('should return experiment version as 5 when experiment has version defined in metadata', async () => {
    jest.spyOn(ExperimentClient.prototype, 'getExperimentVariant').mockImplementation(() => {
      return new Promise(resolve => {
        resolve(data[2]);
      });
    });
    const response = await experimentsClient.getExperimentVariant(experimentName, accountId);
    expect(response).toBe(5);
  });

  it('should return experiment version as 10 when experiment has version defined in metadata', async () => {
    jest.spyOn(ExperimentClient.prototype, 'getExperimentVariant').mockImplementation(() => {
      return new Promise(resolve => {
        resolve(data[3]);
      });
    });
    const response = await experimentsClient.getExperimentVariant(experimentName, accountId);
    expect(response).toBe(10);
  });
});

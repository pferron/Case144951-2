/* eslint-disable jest/no-standalone-expect */

import { authOptions, connectToApiAsPlanner, unauthOptions } from '@helpers/connectToApiAsPlanner';
import { createHub, getHub, hubPublish, rawDeleteHub } from '@helpers/hubFunctions';
import { newHubData } from '@fixtures/hubData';
import { skipItIfProdEnvironment } from '@utils/commonUtils';
import { v4 as uuidV4 } from 'uuid';
import { memberWatchDurationByHubId, videosViewByHubId } from '@helpers/analyticsFunctions';
import { ApolloClient, NormalizedCacheObject } from '@apollo/client';

let client: ApolloClient<NormalizedCacheObject>;
let clientWithIncorrectRole: ApolloClient<NormalizedCacheObject>;
let testHubId: string;

const hubId = uuidV4();
const videoDuration = 1000;
const startDate = '2023-09-14T00:00:00.000Z';
const endDate = '2024-09-13T00:00:00.000Z';

beforeAll(async () => {
  client = await connectToApiAsPlanner(authOptions);
  clientWithIncorrectRole = await connectToApiAsPlanner(unauthOptions);
  testHubId = await createHub(client, newHubData);
  await hubPublish(client, { id: testHubId });
}, 10000);

afterAll(async () => {
  const hub = await getHub(client, testHubId);
  if (hub.id) {
    await rawDeleteHub(client, { id: testHubId });
  }
});

describe('Query: videosViewCountByHubId', () => {
  skipItIfProdEnvironment()('Should return Unauthorized for incorrect video-center role in bearer', async () => {
    await expect(async () => videosViewByHubId(clientWithIncorrectRole, hubId, startDate, endDate)).rejects.toThrow(
      'Not authorized'
    );
  });

  skipItIfProdEnvironment()('Should return error when days difference > 365', async () => {
    const response = await videosViewByHubId(client, hubId, startDate, '2024-09-14T00:00:00.000Z');
    expect(response.serverError).toEqual(true);
  });

  it('Should return success', async () => {
    const response = await videosViewByHubId(client, hubId, startDate, endDate);
    expect(response.serverError).toEqual(false);
  });
});

describe('Query: memberVideoWatchDurationByHubId', () => {
  const videoId = uuidV4();

  skipItIfProdEnvironment()('Should return Unauthorized for incorrect video-center role in bearer', async () => {
    await expect(async () =>
      memberWatchDurationByHubId(clientWithIncorrectRole, hubId, videoId, videoDuration, startDate, endDate)
    ).rejects.toThrow('Not authorized');
  });

  skipItIfProdEnvironment()('Should return error when days difference > 365', async () => {
    const response = await memberWatchDurationByHubId(
      client,
      hubId,
      videoId,
      videoDuration,
      startDate,
      '2024-09-14T00:00:00.000Z'
    );
    expect(response.serverError).toEqual(true);
  });

  it('Should return success', async () => {
    const response = await memberWatchDurationByHubId(client, hubId, videoId, videoDuration, startDate, endDate);
    expect(response.serverError).toEqual(false);
  });
});

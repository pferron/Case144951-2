import { authOptions, connectToApiAsPlanner, unauthOptions } from '@helpers/connectToApiAsPlanner';
import { createHub, hubPublish, rawDeleteHub } from '@helpers/hubFunctions';
import { newHubData } from '@fixtures/hubData';
import { fileUpload, getCheckScanStatus, getPresignedUrl } from '@helpers/uploadFunctions';
import { EntityType } from '@cvent/planner-event-hubs-model/types';
import { v4 as uuidV4 } from 'uuid';
import { createBanner, deleteBanner } from '@helpers/bannerFunctions';
import { newBannerData } from '@fixtures/bannerData';
import { skipDescribeIfProdEnvironment } from '@utils/commonUtils';
import { LoggerFactory } from '@cvent/logging/LoggerFactory';

const LOG = LoggerFactory.create('upload.gql.test');

let client = null;
let clientWithIncorrectRole = null;
let hubId = null;
let bannerId = null;

beforeAll(async () => {
  client = await connectToApiAsPlanner(authOptions);
  clientWithIncorrectRole = await connectToApiAsPlanner(unauthOptions);
  hubId = await createHub(client, newHubData);
  await hubPublish(client, { id: hubId });
  newBannerData.centerId = hubId;
  bannerId = await createBanner(client, newBannerData);
  LOG.error(`Created Banner: ${bannerId}`);
}, 30000);

afterAll(async () => {
  await Promise.all([deleteBanner(client, hubId, bannerId), rawDeleteHub(client, { id: hubId })]);
});

skipDescribeIfProdEnvironment()('query: checkScanStatus', () => {
  it('returns {} when filePath is not yet found', async () => {
    const input = {
      filePath: 'TestFilePath'
    };
    const resp = await getCheckScanStatus(client, input);
    expect(resp.status).toBeNull();
    expect(resp.failureReason).toBeNull();
  });

  it('throws Unauthenticated when lacking video-center roles in bearer', async () => {
    const input = {
      filePath: 'TestFilePath'
    };
    await expect(async () => getCheckScanStatus(clientWithIncorrectRole, input)).rejects.toThrow('Not authorized');
  });
});

skipDescribeIfProdEnvironment()('query: generatePreSignedUrl', () => {
  it('throw Unauthenticated when lacking video-center roles in bearer', async () => {
    const input = {
      centerId: uuidV4(),
      entityId: uuidV4(),
      entityType: EntityType.Banner,
      fileName: 'Hello',
      fileExtension: 'png'
    };
    await expect(async () => getPresignedUrl(clientWithIncorrectRole, input)).rejects.toThrow('Not authorized');
  });
});

describe('Upload image', () => {
  it('Upload image successfully', async () => {
    // Create pre-signed Url
    const preSignedInput = {
      centerId: hubId,
      entityId: bannerId,
      entityType: EntityType.Banner,
      fileName: 'lessThan2Mb',
      fileExtension: 'jpeg'
    };
    const preSignedResponse = await getPresignedUrl(client, preSignedInput);
    expect(preSignedResponse).toBeTruthy();

    // // Upload file to S3
    const fileUploadStatus = await fileUpload(preSignedResponse.uploadUrl);
    expect(fileUploadStatus).toBe(200);
  });
});

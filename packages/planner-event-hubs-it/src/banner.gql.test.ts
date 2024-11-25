// FIREBALL
/* eslint-disable jest/no-standalone-expect */
import { connectToApiAsPlanner, authOptions, unauthOptions } from '@helpers/connectToApiAsPlanner';
import { invalidBanner, newBannerData, updateBannerData } from '@fixtures/bannerData';
import {
  rawCreateBanner,
  createBanner,
  getBanner,
  getBanners,
  deleteBanner,
  updateBanner
} from '@helpers/bannerFunctions';
import { createHub, getHubBanners, hubPublish, rawDeleteHub } from '@helpers/hubFunctions';
import { newHubData } from '@fixtures/hubData';
import { cropImage } from '@helpers/uploadFunctions';
import { CREATE_BANNER_MUTATION } from '@cvent/planner-event-hubs-model/operations/banner';
import { ACCOUNT_STUB } from '@utils/constants';
import { S3ProxyClient } from '@utils/s3ProxyClient';
import { skipItIfProdEnvironment } from '@utils/commonUtils';

let client = null;
let clientWithIncorrectRole = null;
let testHubId = null;

beforeAll(async () => {
  client = await connectToApiAsPlanner(authOptions);
  clientWithIncorrectRole = await connectToApiAsPlanner(unauthOptions);
  testHubId = await createHub(client, newHubData);
  await hubPublish(client, { id: testHubId });
}, 10000);

afterAll(async () => {
  await rawDeleteHub(client, { id: testHubId });
});

describe('Banner', () => {
  it('creates new banner and fetch banner and updates banner and deletes banner', async () => {
    newBannerData.centerId = testHubId;
    const response = await rawCreateBanner(client, newBannerData);
    expect(response.data).toBeTruthy();
    expect(response.data.bannerCreate).toBeTruthy();

    const banner = await getBanner(client, testHubId, response.data.bannerCreate);
    expect(banner).toBeTruthy();
    expect(banner.id).toEqual(response.data.bannerCreate);

    updateBannerData.id = banner.id;
    updateBannerData.centerId = testHubId;
    const update = await updateBanner(client, updateBannerData);
    expect(update).toBeTruthy();

    const deleteResult = await deleteBanner(client, testHubId, banner.id);
    expect(deleteResult).toEqual(banner.id);
  });

  it('automatically adds newly created banners to the given centerId', async () => {
    newBannerData.centerId = testHubId;
    const response = await rawCreateBanner(client, newBannerData);
    expect(response.data?.bannerCreate).toBeTruthy();

    const hubBanners = await getHubBanners(client, { hubId: testHubId });
    expect(hubBanners.data[0].id).toEqual(response.data.bannerCreate);
    const result = JSON.parse(JSON.stringify(hubBanners.data[0]), (key: string, value: string) =>
      key === '__typename' || key === 'id' ? undefined : value
    );
    expect(result).toEqual(newBannerData);
    await deleteBanner(client, testHubId, response.data.bannerCreate);
  });

  it('updating a banner with newImageUrl from Cvent domain (output from ImageEditor->Processing), processes it into an optimized imageUrl', async () => {
    newBannerData.centerId = testHubId;
    const bannerId = await createBanner(client, newBannerData);
    const s3ProxyClient = new S3ProxyClient();
    const config = {
      context: {
        headers: { ignore: 'me' },
        environment: process.env.ENVIRONMENT_NAME
      },
      cache: undefined
    };
    s3ProxyClient.initialize(config);
    const resp = await s3ProxyClient.uploadTestImage(`${ACCOUNT_STUB}/eventsplus/${testHubId}/Temp/${bannerId}`);
    // planner applies change
    const croppedUrl = await cropImage(resp.location, bannerId, authOptions.authorization.metadata.accountStub);
    const croppedResp = await croppedUrl.json();
    const newImageUrl = croppedResp.location;
    // saves the newImageUrl (NewImage.croppedUrl is set)
    const bannerInput = {
      id: bannerId,
      newImageUrl,
      newOriginalImageUrl: resp.location,
      imageUrl: 'https://image-blah.cvent.com/pre-existing/image.png',
      originalImageUrl: 'https://s3.amazonaws.com/pre-existing/image.png',
      centerId: testHubId,
      name: newBannerData.name,
      layout: newBannerData.layout
    };
    const bannerResponse = await updateBanner(client, bannerInput);
    expect(bannerResponse.id).toEqual(bannerId);
    const refreshedBanner = await getBanner(client, testHubId, bannerId);
    expect(refreshedBanner.imageUrl).toMatch(/https:\/\/images.*cvent.com\/.+\/[\w\d]+!_![\w\d]+\.[\w]{3,4}/i);
    expect(refreshedBanner.originalImageUrl).toMatch(/https:\/\/custom.*cvent.com\/.+\/[\w\d]+\.[\w]{3,4}/i);
  });

  it('updating a banner with newImageUrl from original pre-signed path (amazon domain), processes it into an optimized imageUrl', async () => {
    newBannerData.centerId = testHubId;
    const bannerId = await createBanner(client, newBannerData);
    const s3ProxyClient = new S3ProxyClient();
    const config = {
      context: {
        headers: { ignore: 'me' },
        environment: process.env.ENVIRONMENT_NAME
      },
      cache: undefined
    };
    s3ProxyClient.initialize(config);
    const resp = await s3ProxyClient.uploadTestImage(`${ACCOUNT_STUB}/eventsplus/${testHubId}/Temp/${bannerId}`);
    // planner cancels change (NewImage.croppedUrl is never set, only NewImage.url)
    const newImageUrl = new URL(resp.location);
    newImageUrl.hostname = 's3.amazonaws.com';
    newImageUrl.pathname = `staging-download.cvent.com/S606${newImageUrl.pathname}`;
    // saves the newImageUrl
    const bannerInput = {
      id: bannerId,
      newImageUrl: newImageUrl.toString(),
      newOriginalImageUrl: resp.location,
      imageUrl: 'https://image-blah.cvent.com/pre-existing/image.png',
      originalImageUrl: 'https://s3.amazonaws.com/pre-existing/image.png',
      centerId: testHubId,
      name: newBannerData.name,
      layout: newBannerData.layout
    };
    const bannerResponse = await updateBanner(client, bannerInput);
    expect(bannerResponse.id).toEqual(bannerId);
    const refreshedBanner = await getBanner(client, testHubId, bannerId);
    expect(refreshedBanner.imageUrl).toMatch(/https:\/\/images.*cvent.com\/.+\/[\w\d]+!_![\w\d]+\.[\w]{3,4}/i);
    expect(refreshedBanner.originalImageUrl).toMatch(/https:\/\/custom.*cvent.com\/.+\/[\w\d]+\.[\w]{3,4}/i);
  });

  it('fetch banners', async () => {
    const filterInput = {
      limit: 1,
      token: 'token'
    };
    newBannerData.centerId = testHubId;
    await rawCreateBanner(client, newBannerData);
    const banners = await getBanners(client, testHubId, {
      limit: filterInput.limit
    });

    expect(banners).toBeTruthy();
    expect(banners.data.length).toEqual(filterInput.limit);
    expect(banners.paging.limit).toEqual(filterInput.limit);
  });

  skipItIfProdEnvironment()('deletes newly created banner when addBannerToVideoCenter call fails', async () => {
    newBannerData.centerId = 'wakawaka';
    await expect(async () => rawCreateBanner(client, newBannerData)).rejects.toThrow('Not Found');
  });

  skipItIfProdEnvironment()('throws 403 when lacking video-hub roles in bearer', async () => {
    await expect(async () =>
      clientWithIncorrectRole.mutate({
        mutation: CREATE_BANNER_MUTATION,
        variables: { input: newBannerData }
      })
    ).rejects.toThrow('403: Forbidden');
  });

  skipItIfProdEnvironment()('throws 400 when invalid banner data', async () => {
    invalidBanner.centerId = testHubId;
    await expect(async () => rawCreateBanner(client, invalidBanner)).rejects.toThrow('Unprocessable Entity');
  });
});

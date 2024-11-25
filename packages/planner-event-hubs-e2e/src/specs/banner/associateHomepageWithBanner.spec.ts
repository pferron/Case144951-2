import logger from '@wdio/logger';
import VideoCenterDetailPage from '../../pages/videoCenterDetail.page';
import BannerPage from '../../pages/banner.page';
import BannerDetailPage from '../../pages/bannerDetail.page';
import { createBanner, generateBannerData } from '../../utils/generateData';
import { createHub, deleteHub } from '../../apis/graphql/hub';
import { loginAsPlanner } from '../../utils/authUtils';
import { waitForClickableAndClick } from '../../utils/waitHelpers';

const Logger = logger('e2e-banner-associateHomepageWithBanner');

let hubWithoutChannels;
const dataSetup = async (): Promise<void> => {
  [hubWithoutChannels] = await Promise.all([createHub()]);
};

afterAll(async () => {
  // Don't fail the build if these type of tear-downs fail/timeout
  try {
    Logger.info('Running after hook associateHomepageWithBanner');
    await Promise.all([deleteHub(hubWithoutChannels)]);
  } catch (e) {
    Logger.error('Failed to delete hub in e2e tear-down', e);
  }
});

describe('Creates a banner association with the homepage', () => {
  let bannerData;
  let bannerName;
  let bannerType;

  it('logs in Videos using core UI, creates a video center via GraphQL, navigates to the Banners page', async () => {
    await loginAsPlanner();
    await dataSetup();

    await BannerPage.openPage(hubWithoutChannels);
    expect(await BannerPage.createBannerButton).toBeClickable();
  });

  it('creates a banner', async () => {
    bannerData = generateBannerData();
    bannerName = bannerData.bannerName;
    bannerType = 'Banners-Template-Card-TextOnly';
    await createBanner(bannerData, bannerType);
    await BannerDetailPage.pageTitle.waitForExist();
    await expect(await BannerDetailPage.pageTitle.getText()).toEqual(bannerName);
  });

  it('associates the homepage with the created banner', async () => {
    await BannerDetailPage.assignPages.scrollIntoView();
    await waitForClickableAndClick({ element: BannerDetailPage.assignPages });
    await waitForClickableAndClick({ element: BannerDetailPage.associateBannerWithPageList });
    await waitForClickableAndClick({ element: BannerDetailPage.associateBannerWithHomepage });
    await waitForClickableAndClick({ element: BannerDetailPage.associateBannerWithPageSave });
    expect(await BannerDetailPage.assignPages).not.toBeDisplayed();
    expect(await BannerDetailPage.displayPageAssociatedWithBanner).toBeDisplayed();
  });

  // RED
  // eslint-disable-next-line jest/no-disabled-tests
  xit('verifies the banner association in Pages tab', async () => {
    await waitForClickableAndClick({ element: VideoCenterDetailPage.banners });
    await BannerPage.accessPagesTab.waitForDisplayed;
    await waitForClickableAndClick({ element: BannerPage.accessPagesTab });

    await BannerPage.HomePageBannerList.waitForDisplayed;
    await expect(await BannerPage.HomePageBannerList.getText()).toEqual(bannerName);
  });
});

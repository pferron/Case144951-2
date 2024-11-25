import path from 'path';
import { getConfigs } from '../../../configs/testConfig';
import { createHub, deleteHub } from '../../apis/graphql/hub';
import BannerPage from '../../pages/banner.page';
import BannerDetailPage from '../../pages/bannerDetail.page';
import { createBanner, deleteBanner, generateBannerData } from '../../utils/generateData';
import { loginAsPlanner } from '../../utils/authUtils';

const lessThanMaxSize = path.join(__dirname, '..', '..', 'resources', 'images', 'lessThan5Mb.jpeg');

let hubWithoutChannels;
const dataSetup = async (): Promise<void> => {
  [hubWithoutChannels] = await Promise.all([createHub()]);
};
const configs = getConfigs();

describe('Creates an inset image banner, sets the banner image and the banner alt text, then deltes the banner', () => {
  let bannerData;
  let bannerName;
  let bannerType;

  it('logs in Videos using core UI, creates a video center via GraphQL, opens the page Banners', async () => {
    await loginAsPlanner();
    await dataSetup();

    await BannerPage.openPage(hubWithoutChannels);
    expect(await BannerPage.createBannerButton).toBeClickable();
  });

  it('creates an inset_image banner', async () => {
    bannerData = generateBannerData();
    bannerName = bannerData.bannerName;
    bannerType = 'Banners-Template-Card-InsetImage';
    await createBanner(bannerData, bannerType);
    await BannerDetailPage.pageTitle.waitForDisplayed();
    expect(await BannerDetailPage.pageTitle.getText()).toEqual(bannerName);
    expect(await BannerDetailPage.previewBannerImage).not.toBeDisplayed();
  });

  it('edits the banner image section', async () => {
    await BannerDetailPage.editBannerImageSectionButton.click();
    await browser.pause(configs.delay.uiBackgroundLoad);
    // const element = await BannerDetailPage.uploadBannerImageButton;
    await BannerDetailPage.uploadBannerImageButton.scrollIntoView({ block: 'center', inline: 'center' });
    await expect(await BannerDetailPage.uploadBannerImageButton).toBeDisplayed();
  });

  it('deletes the newly created banner, deletes the video center via GraphQL', async () => {
    await deleteBanner(bannerName);
    expect(await BannerPage.pageTitle).toBeDisplayed();

    await Promise.all([deleteHub(hubWithoutChannels)]);
  });

  // RED
  // eslint-disable-next-line jest/no-disabled-tests
  xit('uploads the banner image', async () => {
    await (await BannerDetailPage.bannerInformationImageUploadInput).setValue(lessThanMaxSize);
    await browser.pause(configs.delay.uiBackgroundLoad);
    await browser.pause(configs.delay.uiBackgroundLoad);

    expect(await BannerDetailPage.imageEditorHeader).toBeDisplayed();
    expect(await BannerDetailPage.imageEditorImage).toBeDisplayed();
    await expect(await BannerDetailPage.imageEditorApplyButton).toBeClickable();
  });
  // RED
  // eslint-disable-next-line jest/no-disabled-tests
  xit('applies the banner image', async () => {
    await browser.pause(configs.delay.uiBackgroundLoad);
    await BannerDetailPage.imageEditorApplyButton.click();
    await expect(await BannerDetailPage.imageEditor).not.toBeDisplayed();
  });
  // RED
  // eslint-disable-next-line jest/no-disabled-tests
  xit('verifies the preview banner image', async () => {
    expect(await BannerDetailPage.previewBannerImage).toBeDisplayed();
  });
});

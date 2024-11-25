import BannerPage from '../../pages/banner.page';
import BannerDetailPage from '../../pages/bannerDetail.page';
import { createBanner, deleteBanner, generateBannerData } from '../../utils/generateData';
import { createHub, deleteHub } from '../../apis/graphql/hub';
import { loginAsPlanner } from '../../utils/authUtils';
import { getAxeViolationIds } from '../../utils/axe/getViolations';
import { addGlobalViolations } from '../../utils/axe/addGlobalViolations';
import { VIOLATION_TYPE } from '../../utils/axe/ruleIds';

let hubWithoutChannels;
const dataSetup = async (): Promise<void> => {
  [hubWithoutChannels] = await Promise.all([createHub()]);
};

describe('Creates a text banner then deletes it', () => {
  let bannerData;
  let bannerName;
  let bannerType;

  it('logs in Videos using core UI, creates a video center via GraphQL, navigates to the Banners page', async () => {
    await loginAsPlanner();
    await dataSetup();

    await BannerPage.openPage(hubWithoutChannels);
    expect(await BannerPage.createBannerButton).toBeClickable();
  });

  it('creates a text banner', async () => {
    bannerData = generateBannerData();
    bannerName = bannerData.bannerName;
    bannerType = 'Banners-Template-Card-TextOnly';
    await createBanner(bannerData, bannerType);
    await BannerDetailPage.pageTitle.waitForDisplayed;
    await expect(await BannerDetailPage.pageTitle.getText()).toEqual(bannerName);
  });

  it('hub banner page has no accessibility issues', async () => {
    const desktopViolations = [
      VIOLATION_TYPE.LANDMARK_ONE_MAIN, // HUB-156911
      VIOLATION_TYPE.REGION // HUB-156911
    ];
    const knownViolations = await addGlobalViolations(desktopViolations);
    const violationIds = await getAxeViolationIds('hub banner', knownViolations);

    await expect(violationIds).toEqual(knownViolations);
  });

  it('deletes the newly created banner, deletes the video center via GraphQL', async () => {
    await deleteBanner(bannerName);
    expect(await BannerPage.pageTitle).toBeDisplayed();

    await Promise.all([deleteHub(hubWithoutChannels)]);
  });
});

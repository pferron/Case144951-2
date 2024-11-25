import { createHub, deleteHub } from '../../apis/graphql/hub';
import ChannelInformationPage from '../../pages/ChannelInformationPage';
import ChannelListPage from '../../pages/ChannelListPage';
import BannerPage from '../../pages/banner.page';
import BannerDetailPage from '../../pages/bannerDetail.page';
import VideoCenterDetailPage from '../../pages/videoCenterDetail.page';
import { createBanner, generateBannerData } from '../../utils/generateData';
import { loginAsPlanner } from '../../utils/authUtils';
import { waitForClickableAndClick, waitForDisplayed } from '../../utils/waitHelpers';

let hubWithoutChannels;
const dataSetup = async (): Promise<void> => {
  [hubWithoutChannels] = await Promise.all([createHub()]);
};

describe('Creates a banner association with channel page', () => {
  let bannerData;
  let bannerName;
  let bannerType;

  it('logs in Videos using core UI, creates a video center via GraphQL, and navigates to the Channels page', async () => {
    await loginAsPlanner();
    await dataSetup();

    await ChannelListPage.openPage(hubWithoutChannels);
    expect(await ChannelListPage.createChannelButton).toBeClickable();
    expect(await ChannelListPage.emptyChannelListPageIllustration).toBeDisplayed();
  });

  it('create a channel from channel list page', async () => {
    await waitForClickableAndClick({ element: ChannelListPage.createChannelButton });

    await waitForDisplayed({ element: ChannelListPage.createChannelModalHeader });
    await waitForDisplayed({ element: ChannelListPage.createChannelTitleInput });
    await (await ChannelListPage.createChannelTitleInput).addValue('E2e channel creation title');
    await (await ChannelListPage.createChannelDescriptionInput).addValue('E2e channel creation description');
    await (await ChannelListPage.createChannelModalSaveButton).click();
    expect(await ChannelInformationPage.channelInformationForm).toBeDisplayed();
    expect(await ChannelInformationPage.channelNameInputField).toBeDisplayed();
    expect(await ChannelInformationPage.channelDescriptionInputField).toBeDisplayed();
    expect(ChannelInformationPage.pageTitle).toBeDisplayed();
  });

  it('navigates to the Banners page', async () => {
    await waitForClickableAndClick({ element: VideoCenterDetailPage.banners });
    expect(await BannerPage.pageTitle).toBeDisplayed();
  });

  it('creates a banner', async () => {
    bannerData = generateBannerData();
    bannerName = bannerData.bannerName;
    bannerType = 'Banners-Template-Card-TextOnly';
    await createBanner(bannerData, bannerType);
    await BannerDetailPage.pageTitle.waitForDisplayed;
    await expect(await BannerDetailPage.pageTitle.getText()).toEqual(bannerName);
  });

  it('associates the channel with the created banner', async () => {
    await BannerDetailPage.assignPages.scrollIntoView();
    await BannerDetailPage.assignPages.waitForClickable;
    await BannerDetailPage.assignPages.click();

    await BannerDetailPage.associateBannerWithPageList.waitForClickable;
    await BannerDetailPage.associateBannerWithPageList.click();

    await BannerDetailPage.associateBannerWithChannelpage.waitForClickable;
    await BannerDetailPage.associateBannerWithChannelpage.click();

    await BannerDetailPage.associateBannerWithPageSave.waitForClickable;
    await BannerDetailPage.associateBannerWithPageSave.click();

    await BannerDetailPage.displayPageAssociatedWithBanner.scrollIntoView();
    await expect(await BannerDetailPage.displayPageAssociatedWithBanner.getText()).toEqual(
      'E2e channel creation title'
    );
  });

  it('verifies the banner association in Pages tab, deletes the video center via GraphQL', async () => {
    await VideoCenterDetailPage.banners.waitForClickable;
    await VideoCenterDetailPage.banners.click();

    await BannerPage.accessPagesTab.waitForClickable;
    await BannerPage.accessPagesTab.click();

    await BannerPage.ChannelPageBannerList.waitForDisplayed;
    await expect(await BannerPage.ChannelPageBannerList.getText()).toEqual(bannerName);

    await Promise.all([deleteHub(hubWithoutChannels)]);
  });
});

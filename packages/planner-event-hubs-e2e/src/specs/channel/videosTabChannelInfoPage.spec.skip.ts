import logger from '@wdio/logger';
import ChannelInformationPage from '../../pages/ChannelInformationPage';
import { createHub, deleteHub } from '../../apis/graphql/hub';
import { createChannel, deleteChannel } from '../../apis/graphql/channel';
import CommonComponents from '../../pages/CommonComponents';
import { loginAsPlanner } from '../../utils/authUtils';
import { waitForClickable, waitForClickableAndClick, waitForDisplayed } from '../../utils/waitHelpers';

const LOG = logger('e2e-channel-information-page');

let hubId;
let channel;
let channel2;
const dataSetup = async (): Promise<void> => {
  hubId = await createHub();
  channel = await createChannel('Channel for testing videos', 'Dummy Description', hubId);
  channel2 = await createChannel('Channel 2 for testing videos', 'Dummy Description', hubId);
};

afterAll(async () => {
  // Don't fail the build if these type of tear-downs fail/timeout
  LOG.info('Running after hook videoTabChannelInfo');
  try {
    await deleteHub(hubId);
    await deleteChannel(channel.id);
    await deleteChannel(channel2.id);
  } catch (e) {
    LOG.error('Failed to delete hub in e2e tear-down', e);
  }
});

describe('Channel Information page video section', () => {
  // FIREBALL HUB-127121
  // eslint-disable-next-line jest/no-disabled-tests
  xit('should open channelInformation page, click on Video tab, create catalog, create section and them remove section', async () => {
    await loginAsPlanner();
    await dataSetup();
    await ChannelInformationPage.openPage(hubId, channel.id);

    await waitForDisplayed({ element: ChannelInformationPage.channelInformationForm });
    expect(await ChannelInformationPage.channelInformationEditButton).toBeDisplayed();

    // Go to videos tab in channel information page in edit mode
    await waitForClickableAndClick({ element: ChannelInformationPage.channelVideosTab });
    await waitForDisplayed({ element: ChannelInformationPage.channelVideosHeading });
    await waitForClickableAndClick({ element: ChannelInformationPage.channelInformationEditButton });
    await waitForDisplayed({ element: ChannelInformationPage.channelCatalogPreview });
    expect(await ChannelInformationPage.addVideosButton).toBeDisplayed();
    await waitForClickableAndClick({ element: ChannelInformationPage.addVideosButton });
    await waitForDisplayed({ element: ChannelInformationPage.addVideoModalAddButton });
    const videoList = await ChannelInformationPage.addVideoModalVideoList;
    expect(videoList.length).toBeGreaterThanOrEqual(4);
    // Add first 4 videos
    await waitForClickableAndClick({ element: videoList[0], isComponent: true });
    await waitForClickableAndClick({ element: videoList[1], isComponent: true });
    await waitForClickableAndClick({ element: videoList[2], isComponent: true });
    await waitForClickableAndClick({ element: videoList[3], isComponent: true });
    await waitForClickableAndClick({ element: ChannelInformationPage.addVideoModalAddButton });
    const videoMenuList = await ChannelInformationPage.videoMenuList;
    expect(videoMenuList.length).toBe(4); // there should be exactly 4 videos
    // insert a section from third video
    await waitForClickableAndClick({ element: videoMenuList[2], isComponent: true });
    // clicking on the insert section before button
    await (await ChannelInformationPage.videoOverflowMenuList)[0].click();
    await (await ChannelInformationPage.sectionNameInput).setValue('E2e section A');
    await (await ChannelInformationPage.createSectionModalCreateButton).click();
    await (await ChannelInformationPage.saveFormButton).click();
    expect(await ChannelInformationPage.channelCatalogPreview).toBeDisplayed();
    await (await ChannelInformationPage.channelInformationEditButton).click();
    // validate that only one section is created.
    // there should be 5 (4 videos + 1 section) overflow (kebab) icons
    expect((await ChannelInformationPage.videoMenuList).length).toBe(4);
    expect((await ChannelInformationPage.sectionMenuList).length).toBe(1);

    // delete the custom section
    await (await ChannelInformationPage.sectionMenuList)[0].click();
    await (await ChannelInformationPage.videoOverflowMenuList)[1].click();
    await (await CommonComponents.deleteConfirmationButton).click();
    // there should be 4 videos without section
    expect((await ChannelInformationPage.videoMenuList).length).toBe(4);
    await (await ChannelInformationPage.saveFormButton).click();
    expect(await ChannelInformationPage.channelCatalogPreview).toBeDisplayed();
  });

  // FIREBALL HUB-127121
  // eslint-disable-next-line jest/no-disabled-tests
  xit('should open channelInformation page, click on Video tab, create catalog, delete videos', async () => {
    await ChannelInformationPage.openPage(hubId, channel2.id);
    await waitForDisplayed({ element: ChannelInformationPage.channelInformationForm });
    expect(await ChannelInformationPage.channelInformationEditButton).toBeDisplayed();

    // Go to videos tab in channel information page in edit mode
    await (await ChannelInformationPage.channelVideosTab).click();
    await waitForDisplayed({ element: ChannelInformationPage.channelVideosHeading });
    expect(await ChannelInformationPage.channelVideosHeading).toBeDisplayed();
    await (await ChannelInformationPage.channelInformationEditButton).click();
    await (await ChannelInformationPage.addVideosButton).click();
    await waitForDisplayed({ element: ChannelInformationPage.addVideoModalAddButton });
    const videoList = await ChannelInformationPage.addVideoModalVideoList;
    expect(videoList.length).toBeGreaterThanOrEqual(2);
    // Add first 2 videos
    await videoList[0].click();
    await videoList[1].click();
    await (await ChannelInformationPage.addVideoModalAddButton).click();
    const videoMenuList = await ChannelInformationPage.videoMenuList;
    expect(videoMenuList.length).toBe(2); // there should be exactly 2 videos
    await (await ChannelInformationPage.saveFormButton).click();
    // deleting the videos
    await waitForClickableAndClick({ element: ChannelInformationPage.channelInformationEditButton });
    await waitForClickable({ element: ChannelInformationPage.saveFormButton });

    const videoMenuListCompList1 = await ChannelInformationPage.videoMenuList;
    expect(videoMenuListCompList1.length).toBe(2);
    expect(videoMenuListCompList1[0]).toBeDisplayed();
    await waitForClickableAndClick({ element: videoMenuListCompList1[0], isComponent: true });
    const videoMenuOverflowList = await ChannelInformationPage.videoOverflowMenuList;
    expect(videoMenuOverflowList.length).toBeGreaterThanOrEqual(1);
    expect(videoMenuOverflowList[0]).toBeDisplayed();
    await waitForClickableAndClick({ element: videoMenuOverflowList[0], isComponent: true });

    await (
      await ChannelInformationPage.videoMenuList
    )[0].waitUntil(
      async () => {
        return (await ChannelInformationPage.videoMenuList).length === 1;
      },
      { timeout: 5000, interval: 1000 }
    );

    // await browser.pause(1000);
    // saving after deleting first video
    await waitForClickableAndClick({ element: ChannelInformationPage.saveFormButton });
    await waitForDisplayed({ element: ChannelInformationPage.channelInformationEditButton });

    // check now only 1 video is remaining
    await ChannelInformationPage.openPage(hubId, channel2.id);
    await waitForClickableAndClick({ element: ChannelInformationPage.channelVideosTab });
    await waitForClickableAndClick({ element: ChannelInformationPage.channelInformationEditButton });
    await waitForClickable({ element: ChannelInformationPage.saveFormButton });

    const videoMenuListCompList2 = await ChannelInformationPage.videoMenuList;
    expect(videoMenuListCompList2.length).toBe(1);
    await waitForClickableAndClick({ element: ChannelInformationPage.saveFormButton });
    expect(await ChannelInformationPage.channelCatalogPreview).toBeDisplayed();
  });
});

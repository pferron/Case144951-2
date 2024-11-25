import { CatalogInput, CatalogOwnerType, CatalogType, SectionType } from '@cvent/planner-event-hubs-model/types';
import logger from '@wdio/logger';
import path from 'path';
import { v4 } from 'uuid';
import { getConfigs } from '../../../configs/testConfig';
import { createCatalog } from '../../apis/graphql/catalog';
import { createChannel } from '../../apis/graphql/channel';
import { createHub, deleteHub } from '../../apis/graphql/hub';
import ChannelInformationPage from '../../pages/ChannelInformationPage';
import CommonComponents from '../../pages/CommonComponents';
import { loginAsPlanner } from '../../utils/authUtils';
import { waitForClickable, waitForClickableAndClick, waitForDisplayed } from '../../utils/waitHelpers';

const Logger = logger('e2e-channel-information-page');

const lessThanMaxSize = path.join(__dirname, '..', '..', 'resources', 'images', 'lessThan5Mb.jpeg');
const moreThanMaxSize = path.join(__dirname, '..', '..', 'resources', 'images', 'moreThan5Mb.jpg');
const sampleVideo = path.join(__dirname, '..', '..', 'resources', 'videos', 'sampleVideo.mov');
const catalogInputData: CatalogInput = {
  sections: [
    {
      id: v4(),
      title: 'default section',
      videos: [{ videoId: getConfigs.videoId }],
      sectionType: SectionType.Default
    }
  ],
  catalogType: CatalogType.List,
  catalogOwner: CatalogOwnerType.VideoHub
};

let hubId;
let channel;
const dataSetup = async (): Promise<void> => {
  hubId = await createHub();
  channel = await createChannel('Dummy Title', 'Dummy Description', hubId);
  await createCatalog(channel.id, catalogInputData);
};

afterAll(async () => {
  // Don't fail the build if these type of tear-downs fail/timeout
  Logger.info('Running after hook channelInformation');
  try {
    await deleteHub(hubId);
  } catch (e) {
    Logger.error('Failed to delete hub in e2e tear-down', e);
  }
  // channel is getting deleted from the ui
});

describe('Channel Information Page', () => {
  beforeAll(async () => {
    await loginAsPlanner();
    await dataSetup();
  });

  // FIREBALL HUB-127121
  // eslint-disable-next-line jest/no-disabled-tests
  xit('validate tab switch confirmation modal', async () => {
    await ChannelInformationPage.openPage(hubId, channel.id);

    // Initial load validation
    await waitForDisplayed({ element: ChannelInformationPage.channelInformationForm });
    await waitForDisplayed({ element: ChannelInformationPage.channelInformationEditButton });

    // Edit channel name
    await waitForClickableAndClick({ element: ChannelInformationPage.channelInformationEditButton });
    await waitForDisplayed({ element: ChannelInformationPage.channelInformationForm });
    await (await ChannelInformationPage.channelNameInputField).setValue('changed');

    // Try to switch tab to video and pop will appear advising  to save data.
    await waitForClickableAndClick({ element: ChannelInformationPage.channelVideosTab });
    await waitForDisplayed({ element: ChannelInformationPage.tabSwitchPopUp });
    await waitForClickableAndClick({ element: ChannelInformationPage.tabSwitchPopUpStayButton });
    await waitForDisplayed({ element: ChannelInformationPage.tabSwitchPopUp, reverse: true });

    // Try to switch to video information page and pop will appear advising  to save data.
    await waitForClickableAndClick({ element: ChannelInformationPage.centerInfoLocalNav });
    await waitForDisplayed({ element: ChannelInformationPage.pageLeaveConfirmationModalLeave });
    await waitForClickableAndClick({ element: ChannelInformationPage.pageLeavePopUpStayButton });

    // save data and check data updated
    await waitForClickableAndClick({ element: ChannelInformationPage.saveFormButton });
    await waitForClickable({ element: ChannelInformationPage.channelInformationEditButton });
    expect(await ChannelInformationPage.channelInformationForm).toHaveTextContaining('changed');
  });

  // FIREBALL HUB-127121
  // eslint-disable-next-line jest/no-disabled-tests
  xit(
    'should open channelInformation page, click on Edit Mode, update channel, upload image, delete videos' +
      'check for hidden channel banner & Delete the channel',
    async () => {
      await ChannelInformationPage.openPage(hubId, channel.id);

      // Initial load validation
      await waitForDisplayed({ element: ChannelInformationPage.channelInformationForm });
      await waitForDisplayed({ element: ChannelInformationPage.channelNameInputField });
      await waitForDisplayed({ element: ChannelInformationPage.channelDescriptionInputField });
      await waitForDisplayed({ element: ChannelInformationPage.channelInformationEditButton });

      // Go to videos tab in channel information page
      await waitForClickableAndClick({ element: ChannelInformationPage.channelVideosTab });
      await waitForDisplayed({ element: ChannelInformationPage.channelVideosHeading });
      await waitForDisplayed({ element: ChannelInformationPage.channelCatalogPreview });

      // Go to channel information tab in channel information page
      await waitForClickableAndClick({ element: ChannelInformationPage.channelInformationTab });

      // Go to the Edit screen in the channel information button
      await waitForDisplayed({ element: ChannelInformationPage.channelInformationEditButton });
      await waitForClickableAndClick({ element: ChannelInformationPage.channelInformationEditButton });
      await waitForDisplayed({ element: ChannelInformationPage.channelInformationForm });
      await waitForDisplayed({ element: ChannelInformationPage.channelNameInputField });
      await waitForDisplayed({ element: ChannelInformationPage.channelDescriptionInputField });
      await (await ChannelInformationPage.channelNameInputField).setValue('Updated');
      await (await ChannelInformationPage.channelDescriptionInputField).setValue('Updated');
      await waitForDisplayed({ element: ChannelInformationPage.channelInformationImageUploadButton });

      // Upload file of more than 5Mb size
      await (await ChannelInformationPage.channelInformationImageUploadInput).setValue(moreThanMaxSize);
      expect(await ChannelInformationPage.unsupportedFileAlertBox).toHaveTextContaining('File size up to 5 MB');

      // Upload File for unsupported extension
      await (await ChannelInformationPage.channelInformationImageUploadInput).setValue(sampleVideo);
      expect(await ChannelInformationPage.unsupportedFileAlertBox).toHaveTextContaining('sampleVideo.mov');

      // Upload file of less than 5Mb size
      await (await ChannelInformationPage.channelInformationImageUploadInput).setValue(lessThanMaxSize);
      await ChannelInformationPage.waitForElementLoad(await ChannelInformationPage.imageEditorHeader);
      await waitForClickableAndClick({ element: ChannelInformationPage.imageEditorApplyButton });
      await waitForClickableAndClick({ element: ChannelInformationPage.channelActiveRadioButton });
      await waitForClickableAndClick({ element: ChannelInformationPage.saveFormButton });
      await waitForClickable({ element: ChannelInformationPage.channelInformationEditButton });
      expect(await ChannelInformationPage.channelInformationForm).toHaveTextContaining('Updated');

      // Count the number of videos and delete the video
      await waitForClickableAndClick({ element: ChannelInformationPage.channelVideosTab });
      await waitForDisplayed({ element: ChannelInformationPage.channelCatalogPreview });
      await waitForClickableAndClick({ element: ChannelInformationPage.channelInformationEditButton });
      await waitForClickable({ element: ChannelInformationPage.saveFormButton });

      // open menu options for video
      const videoMenuListCompList = await ChannelInformationPage.videoMenuList;
      expect(videoMenuListCompList.length).toBe(1);
      expect(videoMenuListCompList[0]).toBeDisplayed();
      await waitForClickableAndClick({ element: videoMenuListCompList[0], isComponent: true });

      // click on first option to delete video
      const videoMenuOverflowList = await ChannelInformationPage.videoOverflowMenuList;
      expect(videoMenuOverflowList.length).toBeGreaterThanOrEqual(1);
      expect(videoMenuOverflowList[0]).toBeDisplayed();
      await waitForClickableAndClick({ element: videoMenuOverflowList[0], isComponent: true });
      await waitForDisplayed({ element: videoMenuListCompList[0], reverse: true });

      // save and check channel hidden banner is displayed
      await waitForClickableAndClick({ element: ChannelInformationPage.saveFormButton });
      await waitForDisplayed({ element: ChannelInformationPage.channelHiddenBanner });

      // Open Delete Channel Modal and delete
      await waitForClickableAndClick({ element: ChannelInformationPage.channelInformationDeleteChannelButton });
      await waitForDisplayed({ element: CommonComponents.deleteModalHeader });
      await waitForClickableAndClick({ element: CommonComponents.deleteConfirmationButton });

      // Verify if the channel has been deleted successfully
      await ChannelInformationPage.waitForElementLoad(await ChannelInformationPage.channelDeletionSuccessAlert);
      expect(await ChannelInformationPage.channelDeletionSuccessAlert).toHaveTextContaining(
        'Channel was successfully deleted'
      );
    }
  );
});

import logger from '@wdio/logger';
import ChannelListPage from '../../pages/ChannelListPage';
import { createHub, deleteHub } from '../../apis/graphql/hub';
import { createChannel, deleteChannel } from '../../apis/graphql/channel';
import ChannelInformationPage from '../../pages/ChannelInformationPage';
import CommonComponents from '../../pages/CommonComponents';
import { loginAsPlanner } from '../../utils/authUtils';
import { getAxeViolationIds } from '../../utils/axe/getViolations';
import { addGlobalViolations } from '../../utils/axe/addGlobalViolations';
import { VIOLATION_TYPE } from '../../utils/axe/ruleIds';
import { waitForClickableAndClick, waitForDisplayed } from '../../utils/waitHelpers';

const Logger = logger('e2e-channel-list-page');

let hubWithChannels;
let hubWithoutChannels;
let channelsList;
const dataSetup = async (): Promise<void> => {
  [hubWithChannels, hubWithoutChannels] = await Promise.all([createHub(), createHub()]);
  channelsList = await Promise.all([
    createChannel('E2e channel 1', 'desc', hubWithChannels),
    createChannel('E2e channel 2', 'desc', hubWithChannels),
    createChannel('E2e channel 3', 'desc', hubWithChannels)
  ]);
};

afterAll(async () => {
  // Don't fail the build if these type of tear-downs fail/timeout
  try {
    Logger.info('Running after hook channelList');
    const deleteChannelPromises = channelsList.map(channel => {
      return deleteChannel(channel.id);
    });
    await Promise.all([...deleteChannelPromises, deleteHub(hubWithChannels), deleteHub(hubWithoutChannels)]);
  } catch (e) {
    Logger.error('Failed to delete hub in e2e tear-down', e);
  }
});

describe('Channels List Page', () => {
  // eslint-disable-next-line jest/expect-expect
  it('should login to app, setup data and open a channel list page without channels', async () => {
    await loginAsPlanner();
    await dataSetup();
    await ChannelListPage.openPage(hubWithoutChannels);
    await waitForDisplayed({ element: ChannelListPage.emptyChannelListPageIllustration });
  });

  // eslint-disable-next-line jest/expect-expect
  it('should open a channel list page with channels and then navigate to channel information page', async () => {
    await ChannelListPage.openPage(hubWithChannels);
    await waitForDisplayed({ element: ChannelListPage.channelListTable });
    await waitForClickableAndClick({ element: ChannelListPage.channelListFirstTitle });
    await waitForDisplayed({ element: ChannelInformationPage.channelInformationForm });
  });

  it('should create a channel from channel list page and then delete it', async () => {
    await ChannelListPage.openPage(hubWithoutChannels);
    await ChannelListPage.createChannelButton.waitForExist();
    await waitForClickableAndClick({ element: ChannelListPage.createChannelButton });
    await waitForDisplayed({ element: ChannelListPage.createChannelModalSaveButton });
    expect(await (await ChannelListPage.createChannelModalSaveButton).isEnabled()).toBe(false);
    await (await ChannelListPage.createChannelTitleInput).addValue('E2e channel creation title');
    await (await ChannelListPage.createChannelDescriptionInput).addValue('E2e channel creation description');
    await waitForClickableAndClick({ element: ChannelListPage.createChannelModalSaveButton });
    await waitForDisplayed({ element: ChannelInformationPage.channelInformationForm });

    // Navigate back to the channel list page and delete channel
    await ChannelListPage.openPage(hubWithoutChannels);
    await waitForDisplayed({ element: ChannelListPage.channelListFirstTrashIcon });
    await waitForClickableAndClick({ element: ChannelListPage.channelListFirstTrashIcon });
    await waitForDisplayed({ element: CommonComponents.deleteConfirmationButton });
    await waitForClickableAndClick({ element: CommonComponents.deleteConfirmationButton });
    await waitForDisplayed({ element: ChannelListPage.createChannelButton });
    expect(await ChannelListPage.channelDeletionSuccessAlert).toBeDisplayed();
  });

  it('should display channel reordering buttons', async () => {
    await ChannelListPage.openPage(hubWithChannels);
    await waitForDisplayed({ element: ChannelListPage.reorderChannelsButton });
    expect(await ChannelListPage.reorderChannelsButton).toBeDisplayed();
    await waitForClickableAndClick({ element: ChannelListPage.reorderChannelsButton });
    await waitForDisplayed({ element: ChannelListPage.saveOrderButton });
    await waitForDisplayed({ element: ChannelListPage.cancelOrderingButton });
    await waitForClickableAndClick({ element: ChannelListPage.cancelOrderingButton });
    await waitForDisplayed({ element: ChannelListPage.channelListTable });
  });

  // RED
  // eslint-disable-next-line jest/no-disabled-tests
  xit('hub channels page has no accessibility issues', async () => {
    const desktopViolations = [
      VIOLATION_TYPE.LANDMARK_ONE_MAIN, // HUB-156911
      VIOLATION_TYPE.REGION // HUB-156911
    ];
    const knownViolations = await addGlobalViolations(desktopViolations);
    const violationIds = await getAxeViolationIds('hub channels', knownViolations);

    await expect(violationIds).toEqual(knownViolations);
  });
});

import logger from '@wdio/logger';
import { skipItIfProdEnvironment } from '../../utils/commonUtils';
import VideoCenterInformationPage from '../../pages/videoCenterInformation.page';
import { getConfigs } from '../../../configs/testConfig';
import TrackingCodesPage from '../../pages/trackingCodes.page';
import { createHub, deleteHub } from '../../apis/graphql/hub';
import { loginAsPlanner } from '../../utils/authUtils';
import languageManagementPage from '../../pages/languageManagement.page';
import { readAppFeatures } from '../../apis/services/appFeaturesClient';

const { videoCenterInformationFeature = false } = readAppFeatures();

const Logger = logger('trackingCodes');
const configs = getConfigs();

let hubWithoutChannels;
const dataSetup = async (): Promise<void> => {
  [hubWithoutChannels] = await Promise.all([createHub()]);
};

afterAll(async () => {
  // Don't fail the build if these type of tear-downs fail/timeout
  Logger.info('Running after hook trackingCodes');
  try {
    await Promise.all([deleteHub(hubWithoutChannels)]);
  } catch (e) {
    Logger.error('Failed to delete hub in e2e tear-down', e);
  }
});

describe('Code Snippets Page', () => {
  it('logs in Videos using core UI, creates a video center via GraphQL', async () => {
    await loginAsPlanner();
    await dataSetup();
    await VideoCenterInformationPage.openPage(hubWithoutChannels);
    expect(await VideoCenterInformationPage.pageTitle).toBeDisplayed();
  });

  if (!videoCenterInformationFeature) {
    it('navigates to tracking codes and click on edit', async () => {
      await (await languageManagementPage.marketingSideNav).click();
      await (await TrackingCodesPage.trackingCodesButton).click();
      expect(TrackingCodesPage.addCodeSnippetButton).toBeDisplayed();
      await (await TrackingCodesPage.editPencilButton).click();
    });

    it('edits code snippets and add code snippet', async () => {
      Logger.trace('opening code snippet edit mode');
      const { addCodeSnippetButton } = TrackingCodesPage;
      await expect(addCodeSnippetButton).toBeDisplayed();
      await addCodeSnippetButton.click();
      await TrackingCodesPage.addCodeSnippetsTitle.waitForExist();
      expect(TrackingCodesPage.addCodeSnippetsTitle).toBeDisplayed();
      const codeSnippetTableRow = await TrackingCodesPage.codeSnippetTableRow;
      await codeSnippetTableRow.click();
      await TrackingCodesPage.codeSnippetNextButton.waitForExist();
      await (await TrackingCodesPage.codeSnippetNextButton).click();
      await TrackingCodesPage.snippetSettingsModal.waitForExist();
      const snippetSettingsModal = await TrackingCodesPage.snippetSettingsModal;
      await expect(snippetSettingsModal).toBeDisplayed();
      const { addToAllYesButton } = TrackingCodesPage;
      await expect(addToAllYesButton).toBeDisplayed();
      await (await TrackingCodesPage.alwaysTrackButton).click();
      await (await TrackingCodesPage.doneButton).click();
      await browser.pause(configs.delay.uiBackgroundLoad);
      const { statusSavedModal } = TrackingCodesPage;
      await expect(statusSavedModal).toBeDisplayed();
      await (await TrackingCodesPage.dismissStatusButton).click();
    });

    it('delete code snippet', async () => {
      await (await TrackingCodesPage.rowActionButton).click();
      await browser.pause(configs.delay.uiBackgroundLoad);
      const { codeSnippetDeleteButton } = TrackingCodesPage;
      await codeSnippetDeleteButton.click();
      const snippetDeleteConfirmationModal = await TrackingCodesPage.snippetDeleteConfirmationModal;
      await expect(snippetDeleteConfirmationModal).toBeDisplayed();
      const { deleteConfirmationCancelButton } = TrackingCodesPage;
      await expect(deleteConfirmationCancelButton).toBeDisplayed();
      const { deleteConfirmationDeleteButton } = TrackingCodesPage;
      await expect(deleteConfirmationDeleteButton).toBeDisplayed();
      await deleteConfirmationDeleteButton.click();
      await browser.pause(configs.delay.uiBackgroundLoad);
      const { statusDeleteModal } = TrackingCodesPage;
      await expect(statusDeleteModal).toBeDisplayed();
      await (await TrackingCodesPage.dismissStatusButton).click();
    });
  } else {
    skipItIfProdEnvironment()('new navigates to tracking codes and click on edit', async () => {
      await (await languageManagementPage.marketingSideNav).click();
      await (await TrackingCodesPage.trackingCodesButton).click();
      expect(TrackingCodesPage.addCodeSnippetButton).toBeDisplayed();
    });

    skipItIfProdEnvironment()('new edits code snippets and add code snippet', async () => {
      Logger.trace('opening code snippet edit mode');
      await browser.pause(configs.delay.uiBackgroundLoad);
      const { addCodeSnippetButton } = TrackingCodesPage;
      await expect(addCodeSnippetButton).toBeDisplayed();
      await addCodeSnippetButton.click();
      await browser.pause(configs.delay.uiBackgroundLoad);
      expect(TrackingCodesPage.addCodeSnippetsTitle).toBeDisplayed();
      const codeSnippetTableRow = await TrackingCodesPage.codeSnippetTableRow;
      await codeSnippetTableRow.click();
      await browser.pause(configs.delay.uiBackgroundLoad);
      await (await TrackingCodesPage.codeSnippetNextButton).click();
      await browser.pause(configs.delay.uiBackgroundLoad);
      const snippetSettingsModal = await TrackingCodesPage.snippetSettingsModal;
      await expect(snippetSettingsModal).toBeDisplayed();
      const { addToAllYesButton } = TrackingCodesPage;
      await expect(addToAllYesButton).toBeDisplayed();
      await (await TrackingCodesPage.alwaysTrackButton).click();
      await (await TrackingCodesPage.doneButton).click();
      await browser.pause(configs.delay.uiBackgroundLoad);
      const { statusSavedModalNew } = TrackingCodesPage;
      await expect(statusSavedModalNew).toBeDisplayed();
      await (await TrackingCodesPage.dismissStatusButtonNew).click();
    });

    skipItIfProdEnvironment()('new delete code snippet', async () => {
      await (await TrackingCodesPage.rowActionButton).click();
      await browser.pause(configs.delay.uiBackgroundLoad);
      const { codeSnippetDeleteButton } = TrackingCodesPage;
      await codeSnippetDeleteButton.click();
      const snippetDeleteConfirmationModal = await TrackingCodesPage.snippetDeleteConfirmationModal;
      await expect(snippetDeleteConfirmationModal).toBeDisplayed();
      const { deleteConfirmationCancelButton } = TrackingCodesPage;
      await expect(deleteConfirmationCancelButton).toBeDisplayed();
      const { deleteConfirmationDeleteButton } = TrackingCodesPage;
      await expect(deleteConfirmationDeleteButton).toBeDisplayed();
      await deleteConfirmationDeleteButton.click();
      await browser.pause(configs.delay.uiBackgroundLoad);
      const { statusDeleteModalNew } = TrackingCodesPage;
      await expect(statusDeleteModalNew).toBeDisplayed();
      await (await TrackingCodesPage.dismissStatusButtonNew).click();
    });
  }
});

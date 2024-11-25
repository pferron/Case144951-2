import logger from '@wdio/logger';
import homepageCustomizationPage from '../../pages/homepageCustomization.page';
import { createHub, deleteHub } from '../../apis/graphql/hub';
import { getConfigs } from '../../../configs/testConfig';
import { loginAsPlanner } from '../../utils/authUtils';
import { getAxeViolationIds } from '../../utils/axe/getViolations';
import { addGlobalViolations } from '../../utils/axe/addGlobalViolations';
import { VIOLATION_TYPE } from '../../utils/axe/ruleIds';
import { waitForClickableAndClick, waitForDisplayed } from '../../utils/waitHelpers';
import { readAppFeatures } from '../../apis/services/appFeaturesClient';

const { homepageCustomizationFeature = false } = readAppFeatures();

const Logger = logger('e2e-homepage-customization');

const configs = getConfigs();

let hubWithoutChannels;
const dataSetup = async (): Promise<void> => {
  [hubWithoutChannels] = await Promise.all([createHub()]);
};

(homepageCustomizationFeature ? describe : xdescribe)('Home Page', () => {
  // Delete the Hub
  afterAll(async () => {
    Logger.info('Running after hook homepageCustomization');
    // Don't fail the build if these type of tear-downs fail/timeout
    try {
      await Promise.all([deleteHub(hubWithoutChannels)]);
    } catch (e) {
      Logger.error('Failed to delete hub in e2e tear-down', e);
    }
  });

  it('Should be able to login to newly created events+ hub', async () => {
    await loginAsPlanner();
    await dataSetup();

    await homepageCustomizationPage.openPage(hubWithoutChannels);
    expect(await homepageCustomizationPage.pageTitle).toBeDisplayed();
  });

  it('Should have default Sections added to the page', async () => {
    expect(await homepageCustomizationPage.defaultBannerSection).toBeDisplayed();
  });

  it('Should have Add button present', async () => {
    expect(await homepageCustomizationPage.addSectionButton).toBeDisplayed();
  });

  it('Should open the modal with sections needs to be added on clicking Add button', async () => {
    await waitForClickableAndClick({ element: homepageCustomizationPage.addSectionButton });
    await homepageCustomizationPage.addSectionsModal.waitForExist();
    await homepageCustomizationPage.addSectionsModal.waitForDisplayed();
    expect(await homepageCustomizationPage.addSectionsModal).toBeDisplayed();
  });

  it('Should open a detail modal to fill the details of the section and add it to home page', async () => {
    await waitForClickableAndClick({ element: homepageCustomizationPage.yourEventsSectionInAddSectionModal });
    await waitForClickableAndClick({ element: homepageCustomizationPage.addSectionModalFooterBtn });
    await homepageCustomizationPage.addSectionDetailsModal.waitForExist();
    expect(await homepageCustomizationPage.addSectionDetailsModal).toBeDisplayed();
  });

  it('should have previewer in YourEvents Add section details modal', async () => {
    expect(await homepageCustomizationPage.previewerAddInDetailsModal).toBeDisplayed();
  });

  it('Should add the YourEvents section upon clicking Done in Add details modal', async () => {
    await waitForClickableAndClick({ element: homepageCustomizationPage.yourEventsSectionDoneBtn });
    await homepageCustomizationPage.yourEventsSection.waitForExist();
    expect(await homepageCustomizationPage.yourEventsSection).toBeDisplayed();
  });

  it('Should enable the Publish button after adding a your events section', async () => {
    expect(await homepageCustomizationPage.publishBtn).toBeEnabled();
  });

  it('Should open the menu with delete and edit options on clicking menu icon in each section', async () => {
    await waitForClickableAndClick({ element: homepageCustomizationPage.yourEventsItemOverflowMenuButton });
    await homepageCustomizationPage.yourEventsItemOverflowMenuOptions.waitForExist();
    expect(await homepageCustomizationPage.yourEventsItemOverflowMenuOptions).toBeDisplayed();
  });

  it('Should have Edit option in the menu', async () => {
    expect(await homepageCustomizationPage.yourEventsItemOverflowMenuOptions).toHaveTextContaining('Edit');
  });

  it('Should have delete option in the menu', async () => {
    expect(await homepageCustomizationPage.yourEventsItemOverflowMenuOptions).toHaveTextContaining('Delete');
  });

  it('Should open the edit modal on clicking Edit option in the menu', async () => {
    await waitForClickableAndClick({ element: homepageCustomizationPage.editSectionMenuOption });
    await waitForDisplayed({ element: homepageCustomizationPage.addSectionDetailsModal });
    expect(await homepageCustomizationPage.addSectionDetailsModal).toBeDisplayed();
  });

  it('Should close the addSectionDetailsModal on clicking cancel button', async () => {
    await waitForClickableAndClick({ element: homepageCustomizationPage.yourEventsSectionCancelBtn });
    expect(await homepageCustomizationPage.addSectionDetailsModal).not.toBeDisplayed();
  });

  it('Should delete the yourEvents section on clicking delete option in the menu', async () => {
    await waitForClickableAndClick({ element: homepageCustomizationPage.yourEventsItemOverflowMenuButton });
    await homepageCustomizationPage.deletSectionMenuOption.waitForExist();

    await waitForClickableAndClick({ element: homepageCustomizationPage.deletSectionMenuOption });
    await homepageCustomizationPage.deletSectionBtnInConfirmation.waitForExist();

    await waitForClickableAndClick({ element: homepageCustomizationPage.deletSectionBtnInConfirmation });
    expect(await homepageCustomizationPage.yourEventsSection).not.toBeDisplayed();
  });

  it('Should show new section card with different image template options', async () => {
    await waitForClickableAndClick({ element: homepageCustomizationPage.addSectionButton });
    await homepageCustomizationPage.newSectionInAddSectionModal.waitForExist();

    await waitForClickableAndClick({ element: homepageCustomizationPage.newSectionInAddSectionModal });
    await homepageCustomizationPage.addSectionModalFooterBtn.waitForExist();

    await waitForClickableAndClick({ element: homepageCustomizationPage.addSectionModalFooterBtn });
    await homepageCustomizationPage.fullImageOption.waitForExist();
    expect(await homepageCustomizationPage.fullImageOption).toBeDisplayed();
    expect(await homepageCustomizationPage.insetImageOption).toBeDisplayed();
    expect(await homepageCustomizationPage.textAndColorOption).toBeDisplayed();
  });

  it('Should show an option to upload image on selecting FullImage template Option', async () => {
    await waitForClickableAndClick({ element: homepageCustomizationPage.fullImageOption });
    await homepageCustomizationPage.uploadImageBtn.waitForExist();
    expect(await homepageCustomizationPage.uploadImageBtn).toBeDisplayed();
  });

  it('Should be able to add the new section after completing the required details', async () => {
    await waitForClickableAndClick({ element: homepageCustomizationPage.textAndColorOption });
    const sectionTitle = 'Testing New Section';
    await (await homepageCustomizationPage.titleInput).setValue(sectionTitle);

    await waitForClickableAndClick({ element: homepageCustomizationPage.templateSectionDoneBtn });
    await homepageCustomizationPage.textAndColorBgSection.waitForExist();
    expect(await homepageCustomizationPage.textAndColorBgSection).toBeDisplayed();
  });
  // RED
  // eslint-disable-next-line jest/no-disabled-tests
  xit('Should be able to drag and drop the sections', async () => {
    const OldTextAndColorBgLocation = await (await homepageCustomizationPage.textAndColorBgSection).getLocation();
    (await homepageCustomizationPage.textAndColorBgSection).dragAndDrop(
      await homepageCustomizationPage.defaultChannelsListSection
    );
    await browser.pause(configs.delay.uiBackgroundLoad);
    const newTextAndColorBgLocation = await (await homepageCustomizationPage.textAndColorBgSection).getLocation();
    expect(newTextAndColorBgLocation.y).not.toEqual(OldTextAndColorBgLocation.y);
  });

  // RED
  // eslint-disable-next-line jest/no-disabled-tests
  xit('hub home page has no accessibility issues', async () => {
    const desktopViolations = [
      VIOLATION_TYPE.LANDMARK_ONE_MAIN, // HUB-156911
      VIOLATION_TYPE.REGION // HUB-156911
    ];
    const knownViolations = await addGlobalViolations(desktopViolations);
    const violationIds = await getAxeViolationIds('hub home page', knownViolations);

    await expect(violationIds).toEqual(knownViolations);
  });
});

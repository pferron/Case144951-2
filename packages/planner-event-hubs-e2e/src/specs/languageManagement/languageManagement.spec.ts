import logger from '@wdio/logger';
import languageManagementPage from '../../pages/languageManagement.page';
import { createHub, deleteHub } from '../../apis/graphql/hub';
import { loginAsPlanner } from '../../utils/authUtils';
import { waitForClickableAndClick, waitForDisplayed } from '../../utils/waitHelpers';
import { getAxeViolationIds } from '../../utils/axe/getViolations';
import { addGlobalViolations } from '../../utils/axe/addGlobalViolations';
import { VIOLATION_TYPE } from '../../utils/axe/ruleIds';
import { readAppFeatures } from '../../apis/services/appFeaturesClient';

const { languageManagementFeature = false } = readAppFeatures();

const Logger = logger('e2e-language-management');

let hubWithoutChannels;
const dataSetup = async (): Promise<void> => {
  [hubWithoutChannels] = await Promise.all([createHub({ locale: 'en-US' })]);
};

(languageManagementFeature ? describe : xdescribe)('Language Management Page', () => {
  // Delete the Hub
  afterAll(async () => {
    try {
      Logger.info('Running after hook languageManagement');
      await Promise.all([deleteHub(hubWithoutChannels)]);
    } catch (e) {
      Logger.error('Failed to delete hub in e2e tear-down', e);
    }
  });

  it('logs in Videos using core UI, creates a video center via GraphQL, opens the Language Management page', async () => {
    await loginAsPlanner();
    await dataSetup();

    await languageManagementPage.openPage(hubWithoutChannels);
    expect(await languageManagementPage.pageTitle).toBeDisplayed();
  });

  it('Should have table with default language shown', async () => {
    expect(await languageManagementPage.defaultLanguage).toBeDisplayed();
  });

  it('Should have search box to search the translations', async () => {
    expect(await languageManagementPage.searchInputTextBox).toBeDisplayed();
  });

  it('Should have dropdown filters to filter by type in original translations tab', async () => {
    expect(await languageManagementPage.filterByTypeDropDown).toBeDisplayed();
  });

  it('Should have ability to sort the table columns', async () => {
    expect(await languageManagementPage.columnHeaderSortBtn).toBeDisplayed();
  });

  it('should open the modal when Add Languages button is clicked', async () => {
    await waitForClickableAndClick({ element: languageManagementPage.addLanguageBtn });
    await waitForDisplayed({ element: languageManagementPage.addLanguageBtn });
    expect(await languageManagementPage.localeListModal).toBeDisplayed();

    await waitForClickableAndClick({ element: languageManagementPage.localeListModalCancelBtn });
  });

  it('Should be able to navigate to English Translations', async () => {
    await waitForClickableAndClick({ element: languageManagementPage.englishTranslationLink });
    await waitForDisplayed({ element: languageManagementPage.englishTranslationsPageTitle });
    expect(await languageManagementPage.englishTranslationsPageTitle).toBeDisplayed();
  });

  it('Should be able to tab to original text tab', async () => {
    await waitForClickableAndClick({ element: languageManagementPage.originalTextTab });
    await waitForDisplayed({ element: languageManagementPage.originalTextTabTitle });
    expect(await languageManagementPage.originalTextTabTitle).toBeDisplayed();
  });

  it('Should have option to revert translations under actions button', async () => {
    await waitForClickableAndClick({ element: languageManagementPage.actionBtnInHeader });
    await waitForDisplayed({ element: languageManagementPage.revertOption });
    expect(await languageManagementPage.revertOption).toBeDisplayed();
  });

  it('Should have option to export translations under actions button', async () => {
    expect(await languageManagementPage.exportOption).toBeDisplayed();
  });

  it('Should have option to import translations under actions button', async () => {
    expect(await languageManagementPage.importOption).toBeDisplayed();
  });

  it('Should have option to see import history under actions button', async () => {
    expect(await languageManagementPage.importHistoryOption).toBeDisplayed();
  });

  it('Should show a confirmation modal when clicked on revert translations', async () => {
    await waitForClickableAndClick({ element: languageManagementPage.revertOption });
    await waitForDisplayed({ element: languageManagementPage.confirmationModal });
    expect(await languageManagementPage.confirmationModal).toBeDisplayed();

    await waitForClickableAndClick({ element: languageManagementPage.confirmationModalCancelBtn });
  });
  it('Should open the import wizard when clicked on import options', async () => {
    await waitForClickableAndClick({ element: languageManagementPage.actionBtnInHeader });
    await waitForClickableAndClick({ element: languageManagementPage.importOption });
    await waitForDisplayed({ element: languageManagementPage.importWizard });
    expect(await languageManagementPage.importWizard).toBeDisplayed();
  });

  it('Should open the import history modal when clicked on view import history option', async () => {
    await waitForClickableAndClick({ element: languageManagementPage.importWizardCancelBtn });
    await waitForClickableAndClick({ element: languageManagementPage.actionBtnInHeader });
    await waitForClickableAndClick({ element: languageManagementPage.importHistoryOption });
    await waitForDisplayed({ element: languageManagementPage.importHistory });
    expect(await languageManagementPage.importHistory).toBeDisplayed();
  });

  // RED
  // eslint-disable-next-line jest/no-disabled-tests
  xit('hub language management page has no accessibility issues', async () => {
    const desktopViolations = [
      VIOLATION_TYPE.LANDMARK_ONE_MAIN, // HUB-156911
      VIOLATION_TYPE.REGION // HUB-156911
    ];
    const knownViolations = await addGlobalViolations(desktopViolations);
    const violationIds = await getAxeViolationIds('hub language management', knownViolations);

    await expect(violationIds).toEqual(knownViolations);
  });
});

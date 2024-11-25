import logger from '@wdio/logger';
import { skipDescribeIfProdEnvironment } from '../../utils/commonUtils';
import VideoCenterInformationPage from '../../pages/videoCenterInformation.page';
import { getConfigs } from '../../../configs/testConfig';
import { createHub, deleteHub, updateHub } from '../../apis/graphql/hub';
import { loginAsPlanner } from '../../utils/authUtils';
import { getAxeViolationIds } from '../../utils/axe/getViolations';
import { addGlobalViolations } from '../../utils/axe/addGlobalViolations';
import { VIOLATION_TYPE } from '../../utils/axe/ruleIds';
import CustomRegistrationPage from '../../pages/customRegistration.page';
import { waitForClickableAndClick } from '../../utils/waitHelpers';
import { readAppFeatures } from '../../apis/services/appFeaturesClient';

const { singleSignOnFeature = false } = readAppFeatures();

const Logger = logger('customRegistration');

const configs = getConfigs();

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

skipDescribeIfProdEnvironment()('Custom Registration Page', () => {
  let previewLoginSignUpCard;

  it('logs in Videos using core UI, creates a video center via GraphQL', async () => {
    await loginAsPlanner();
    await dataSetup();
    await VideoCenterInformationPage.openPage(hubWithoutChannels);
    expect(await VideoCenterInformationPage.pageTitle).toBeDisplayed();
  });

  if (singleSignOnFeature) {
    it('navigates to background appearance card and click on edit sso feature enabled', async () => {
      await waitForClickableAndClick({ element: CustomRegistrationPage.accessManagementButton });
      await waitForClickableAndClick({ element: CustomRegistrationPage.customRegistrationButton });
      expect(await CustomRegistrationPage.customRegistrationTitle).toBeDisplayed();
      await Promise.all([
        updateHub(hubWithoutChannels, {
          id: null
        })
      ]);
      Logger.trace('opening background appearance card');
      expect(await CustomRegistrationPage.saveButton).toBeDisabled();
      await browser.pause(configs.delay.uiBackgroundLoad);
    });
  } else {
    it('navigates to background appearance card and click on edit', async () => {
      await waitForClickableAndClick({ element: CustomRegistrationPage.customRegistrationButton });
      expect(await CustomRegistrationPage.customRegistrationTitle).toBeDisplayed();
      await Promise.all([
        updateHub(hubWithoutChannels, {
          id: null
        })
      ]);
      Logger.trace('opening background appearance card');
      expect(await CustomRegistrationPage.saveButton).toBeDisabled();
      await browser.pause(configs.delay.uiBackgroundLoad);
    });
  }

  it('navigate to preview of background appearance card', async () => {
    Logger.trace('opening background appearance preview modal');
    await waitForClickableAndClick({ element: CustomRegistrationPage.customRegistrationPreviewButton });
    await browser.pause(configs.delay.uiBackgroundLoad);
    previewLoginSignUpCard = await CustomRegistrationPage.previewLoginSignUpCard;
    expect(previewLoginSignUpCard).toBeDisplayed();
    await waitForClickableAndClick({ element: CustomRegistrationPage.customRegistrationCloseButton });
  });

  it('showing logo to background appearance card', async () => {
    await waitForClickableAndClick({ element: CustomRegistrationPage.customRegistrationPreviewButton });
    expect(CustomRegistrationPage.backgroundLogoIcon).toBeDisplayed();
    await waitForClickableAndClick({ element: CustomRegistrationPage.customRegistrationCloseButton });
  });

  it('hiding theme to background appearance preview card', async () => {
    await waitForClickableAndClick({ element: CustomRegistrationPage.customRegistrationPreviewButton });
    expect(await CustomRegistrationPage.previewModalDefaultColorTheme).not.toBeDisplayed();
    await waitForClickableAndClick({ element: CustomRegistrationPage.customRegistrationCloseButton });
  });

  // MAUVE
  // eslint-disable-next-line jest/no-disabled-tests
  xit('showing image to background appearance card', async () => {
    await CustomRegistrationPage.backgroundImage.scrollIntoView();
    expect(await CustomRegistrationPage.backgroundImage).toBeDisplayed();
  });

  it('display preview modal without logo', async () => {
    Logger.trace('hide logo on preview modal');
    await waitForClickableAndClick({ element: CustomRegistrationPage.backgroundImageHideLogoRadioButton });
    expect(await CustomRegistrationPage.backgroundImageIcon).toBeDisplayed();
    await waitForClickableAndClick({ element: CustomRegistrationPage.customRegistrationPreviewButton });
    expect(await CustomRegistrationPage.backgroundLogoIcon).not.toBeDisplayed();
    await waitForClickableAndClick({ element: CustomRegistrationPage.customRegistrationCloseButton });
  });

  // RED
  // eslint-disable-next-line jest/no-disabled-tests
  xit('hub registration page has no accessibility issues', async () => {
    const desktopViolations = [
      VIOLATION_TYPE.LANDMARK_ONE_MAIN, // HUB-156911
      VIOLATION_TYPE.REGION // HUB-156911
    ];
    const knownViolations = await addGlobalViolations(desktopViolations);
    const violationIds = await getAxeViolationIds('hub registration', knownViolations);

    await expect(violationIds).toEqual(knownViolations);
  });

  // Mauve
  // eslint-disable-next-line jest/no-disabled-tests
  xit('deleting background image', async () => {
    await (await CustomRegistrationPage.backgroundImageDeleteButton).scrollIntoView();
    await CustomRegistrationPage.backgroundImageDeleteButton.click();
    expect(CustomRegistrationPage.backgroundImageIcon).toBeDisplayed();

    Logger.trace('closing background appearance card');
    await CustomRegistrationPage.customRegistrationSaveButton.click();
  });
});

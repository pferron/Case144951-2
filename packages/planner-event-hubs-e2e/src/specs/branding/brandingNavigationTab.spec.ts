import logger from '@wdio/logger';
import { createHub, deleteHub } from '../../apis/graphql/hub';
import { loginAsPlanner } from '../../utils/authUtils';
import { getAxeViolationIds } from '../../utils/axe/getViolations';
import { addGlobalViolations } from '../../utils/axe/addGlobalViolations';
import { VIOLATION_TYPE } from '../../utils/axe/ruleIds';
import BrandingPage from '../../pages/branding.page';
import { waitForClickableAndClick, waitForDisplayed } from '../../utils/waitHelpers';

const Logger = logger('e2e-branding-navigation');

let hubWithoutChannels;
const dataSetup = async (): Promise<void> => {
  [hubWithoutChannels] = await Promise.all([createHub()]);
};

afterAll(async () => {
  Logger.info('Running after hook brandingNavigation');
  // Don't fail the build if these type of tear-downs fail/timeout
  try {
    await Promise.all([deleteHub(hubWithoutChannels)]);
  } catch (e) {
    Logger.error('Failed to delete hub in e2e tear-down', e);
  }
});

describe('Branding navigation tab', () => {
  it('logs in Videos using core UI, creates a video center via GraphQL, opens the Branding page', async () => {
    await loginAsPlanner();
    await dataSetup();

    await BrandingPage.openPage(hubWithoutChannels);
    expect(await BrandingPage.pageTitle).toBeDisplayed();
  });

  it('tests publish button', async () => {
    await waitForClickableAndClick({ element: BrandingPage.customNavigationTab });
    expect(await BrandingPage.navigationLogoToggle).toBeDisplayed();
    expect(await BrandingPage.navigationLoginToggle).toBeDisplayed();
    expect(await BrandingPage.navigationHomePageToggle).toBeDisplayed();
    expect(await BrandingPage.navigationChannelsToggle).toBeDisplayed();
    expect(await BrandingPage.navigationVideosToggle).toBeDisplayed();
    expect(await BrandingPage.navigationAlignmentRadio).toBeDisplayed();
    expect(await BrandingPage.navigationLinkHighlightStyleRadio).toBeDisplayed();
    expect(await BrandingPage.navigationLinkFontSize).toBeDisplayed();
    await waitForClickableAndClick({ element: BrandingPage.navigationChannelsToggle });
    await waitForClickableAndClick({ element: BrandingPage.navigationTabPublishBtn });
    await waitForDisplayed({ element: BrandingPage.navigationTabPublishBtn });
    expect(await BrandingPage.navigationTabPublishBtn.isEnabled()).toBe(false);
  });

  // RED
  // eslint-disable-next-line jest/no-disabled-tests
  xit('hub branding page has no accessibility issues', async () => {
    const desktopViolations = [
      VIOLATION_TYPE.LANDMARK_ONE_MAIN, // HUB-156911
      VIOLATION_TYPE.REGION // HUB-156911
    ];
    const knownViolations = await addGlobalViolations(desktopViolations);
    const violationIds = await getAxeViolationIds('hub branding', knownViolations);

    await expect(violationIds).toEqual(knownViolations);
  });
});

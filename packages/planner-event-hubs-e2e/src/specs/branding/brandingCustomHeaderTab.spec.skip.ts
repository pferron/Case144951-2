import logger from '@wdio/logger';
import { createHub, deleteHub } from '../../apis/graphql/hub';
import { loginAsPlanner } from '../../utils/authUtils';
import VideoCenterInformationPage from '../../pages/videoCenterInformation.page';
import VideoCenterDetailPage from '../../pages/videoCenterDetail.page';
import BrandingPage from '../../pages/branding.page';
import { waitForClickableAndClick, waitForDisplayed } from '../../utils/waitHelpers';
import { CUSTOM_CSS, CUSTOM_HTML, CUSTOM_JS } from '../../utils/generateData';

const Logger = logger('e2e-branding-custom-header');

let hubWithoutChannels;
const dataSetup = async (): Promise<void> => {
  [hubWithoutChannels] = await Promise.all([createHub()]);
};

afterAll(async () => {
  Logger.info('Running after hook brandingCustomHeaderTab');
  // Don't fail the build if these type of tear-downs fail/timeout
  try {
    await Promise.all([deleteHub(hubWithoutChannels)]);
  } catch (e) {
    Logger.error('Failed to delete hub in e2e tear-down', e);
  }
});

// TODO:HUB-138020 Fireball
/* eslint-disable-next-line */
xdescribe('Custom header test', () => {
  it('logs in Videos using core UI, creates a video center via GraphQL', async () => {
    await loginAsPlanner();
    await dataSetup();
    await VideoCenterInformationPage.openPage(hubWithoutChannels);
    expect(await VideoCenterInformationPage.pageTitle).toBeDisplayed();
  });

  it('navigates to the Branding page -> Custom Header Tab', async () => {
    await (await VideoCenterDetailPage.branding).click();
    expect(await BrandingPage.pageTitle).toBeDisplayed();
    await waitForClickableAndClick({ element: BrandingPage.customHeaderTab });
    await BrandingPage.customHeaderTabHtmlInput.waitForExist();
    expect(await BrandingPage.customHeaderTabHtmlInput).toBeDisplayed();
    expect(await BrandingPage.customHeaderTabCssInput).toBeDisplayed();
    expect(await BrandingPage.customHeaderTabScriptInput).toBeDisplayed();
    expect(await BrandingPage.customHeaderTabPublishBtn).toBeDisplayed();
    expect(await BrandingPage.customHeaderTabAlert).toBeDisplayed();
    expect(await BrandingPage.customHeaderHideNavigationCard).toBeDisplayed();
    expect(await BrandingPage.customHeaderHideNavigationSaveBtn).toBeDisplayed();
    expect(await BrandingPage.customHeaderHideNavigationToggle).toBeDisplayed();
    expect(await BrandingPage.customHeaderNavigationTable).not.toBeDisplayed();
    expect(await BrandingPage.customNavigationTab).toBeEnabled();
    await (await BrandingPage.customHeaderHideNavigationToggle).click();
    expect(await BrandingPage.customHeaderNavigationTable).toBeDisplayed();
    // try to navigate away without saving
    await (await BrandingPage.customNavigationTab).click();
    expect(await BrandingPage.navigationConfirmationModal).toBeDisplayed();
    expect(await BrandingPage.navigationConfirmationModalLeaveButton).toBeDisplayed();
    expect(await BrandingPage.navigationConfirmationModalStayButton).toBeDisplayed();
    await (await BrandingPage.navigationConfirmationModalStayButton).click();
    expect(await BrandingPage.customHeaderTabHtmlInput).toBeDisplayed();
    await (await BrandingPage.customNavigationTab).click();
    expect(await BrandingPage.navigationConfirmationModal).toBeDisplayed();
    await (await BrandingPage.navigationConfirmationModalLeaveButton).click();
    expect(await BrandingPage.navigationLogoToggle).toBeDisplayed();
  });

  it('Test custom header code preview', async () => {
    await waitForClickableAndClick({ element: VideoCenterDetailPage.branding });

    await waitForClickableAndClick({ element: BrandingPage.customHeaderTab });
    await BrandingPage.customHeaderTabPublishBtn.waitForExist();

    expect(await BrandingPage.customHeaderTabPublishBtn).toBeDisplayed();

    await waitForDisplayed({ element: BrandingPage.customHeaderTabHtmlInput });
    await (await BrandingPage.customHeaderTabHtmlInput).setValue(CUSTOM_HTML);

    await waitForDisplayed({ element: BrandingPage.customHeaderTabCssInput });
    await (await BrandingPage.customHeaderTabCssInput).setValue(CUSTOM_CSS);

    await waitForDisplayed({ element: BrandingPage.customHeaderTabScriptInput });
    await (await BrandingPage.customHeaderTabScriptInput).setValue(CUSTOM_JS);

    await waitForClickableAndClick({ element: BrandingPage.customHeaderTabPreviewBtn });

    // Check iframe is loaded with data
    await waitForDisplayed({ element: BrandingPage.getPreviewIframe });
    browser.switchToFrame(await BrandingPage.getPreviewIframe);

    expect(await BrandingPage.getCustomHeaderPreviewNavigationLogoImage).toBeDisplayed();
    expect(await BrandingPage.getCustomHeaderSideNavButton).toBeDisplayed();

    // Switch to parent
    browser.switchToParentFrame();

    await waitForClickableAndClick({ element: BrandingPage.getPreviewCLosePreiewBtn });
    // Save
    await waitForClickableAndClick({ element: BrandingPage.customHeaderTabPublishBtn });

    await waitForClickableAndClick({ element: BrandingPage.customHeaderTabPreviewBtn });

    // Recheck iframe is loaded
    await waitForDisplayed({ element: BrandingPage.getPreviewIframe });
    browser.switchToFrame(await BrandingPage.getPreviewIframe);

    expect(await BrandingPage.getCustomHeaderPreviewNavigationLogoImage).toBeDisplayed();
    expect(await BrandingPage.getCustomHeaderSideNavButton).toBeDisplayed();
  });
});

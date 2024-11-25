import BrandingPage from '../../pages/branding.page';
import { loginAsPlanner } from '../../utils/authUtils';
import { createHub, deleteHub } from '../../apis/graphql/hub';
import { waitForClickableAndClick, waitForDisplayed } from '../../utils/waitHelpers';
import { readAppFeatures } from '../../apis/services/appFeaturesClient';

const { themeBrandingFeature = false } = readAppFeatures();

let hubWithoutChannels;
const dataSetup = async (): Promise<void> => {
  [hubWithoutChannels] = await Promise.all([createHub()]);
};

// Branding Page will be replacing theming tests.
(themeBrandingFeature ? describe : xdescribe)('Set branding colors', () => {
  it('logs in Videos using core UI, creates a video center via GraphQL, opens the Branding page', async () => {
    await loginAsPlanner();
    await dataSetup();

    await BrandingPage.openPage(hubWithoutChannels);
    await BrandingPage.brandingThemeTab.waitForDisplayed();
    expect(await BrandingPage.brandingThemeTab).toBeDisplayed();
    expect(await BrandingPage.customNavigationTab).toBeDisplayed();
    expect(await BrandingPage.customHeaderTab).toBeDisplayed();
  });

  it('edits and choose primary color', async () => {
    await (await BrandingPage.choosePrimaryColor).click();
    await (await BrandingPage.choosePrimaryColor).setValue('7DD815');
    await browser.keys('Enter');
    await BrandingPage.choosePrimaryColor.waitForDisplayed();
    const primaryColor = await BrandingPage.choosePrimaryColor.getValue();
    expect(primaryColor).toBe('7DD815');
  });

  it('edits and choose secondary color', async () => {
    await (await BrandingPage.chooseSecondaryColor).click();
    await (await BrandingPage.chooseSecondaryColor).setValue('C7E838');
    await browser.keys('Enter');
    const secondaryColor = await BrandingPage.chooseSecondaryColor.getValue();
    expect(secondaryColor).toBe('C7E838');
  });

  it('edit and save custom fonts and page leave confirmation modal', async () => {
    await waitForDisplayed({ element: BrandingPage.bodyFontDropdown });
    expect(BrandingPage.bodyFontDropdown).toHaveTextContaining('Rubik (default)');
    await waitForClickableAndClick({ element: BrandingPage.bodyFontDropdown });
    await waitForDisplayed({ element: BrandingPage.bodyFontMenuItem0 });
    await waitForClickableAndClick({ element: BrandingPage.bodyFontMenuItem0 });
    await waitForDisplayed({ element: BrandingPage.headingsFontDropdown });
    await waitForClickableAndClick({ element: BrandingPage.eventsplusLocalNav });
    await waitForDisplayed({ element: BrandingPage.pageLeavePopUpLeaveButton });
    await waitForDisplayed({ element: BrandingPage.pageLeavePopUpStayButton });
    await waitForClickableAndClick({ element: BrandingPage.pageLeavePopUpStayButton });
    expect(BrandingPage.headingsFontDropdown).toHaveTextContaining('Rubik (default)');
    await waitForClickableAndClick({ element: BrandingPage.headingsFontDropdown });
    await waitForDisplayed({ element: BrandingPage.headingsFontMenuItem0 });
    await waitForClickableAndClick({ element: BrandingPage.headingsFontMenuItem0 });
    await (await BrandingPage.saveColors).click();
    await waitForDisplayed({ element: BrandingPage.saveColors });
    expect(BrandingPage.headingsFontDropdown).not.toHaveTextContaining('Rubik (default)');
  });

  it('choose color mood', async () => {
    await waitForClickableAndClick({ element: BrandingPage.colorMood });
    await waitForClickableAndClick({ element: BrandingPage.saveColors });
    await BrandingPage.colorMoodCheck.waitForDisplayed();
    expect(await BrandingPage.colorMoodCheck).toBeDisplayed();
  });

  it('choose safe color mood', async () => {
    await waitForClickableAndClick({ element: BrandingPage.safeColorMood });
    await waitForClickableAndClick({ element: BrandingPage.saveColors });
    await BrandingPage.colorMoodCheck.waitForDisplayed();
    expect(await BrandingPage.colorMoodCheck).toBeDisplayed();
  });

  it('changes background color', async () => {
    await waitForClickableAndClick({ element: BrandingPage.overrideBackgroundColor });
    await BrandingPage.setBackgroundColor.waitForDisplayed();
    await (await BrandingPage.setBackgroundColor).setValue('C46666');
    await browser.keys('Escape');
    await BrandingPage.resortDefault.waitForDisplayed();
    expect(await BrandingPage.resortDefault).toBeDisplayed();
  });
  // RED
  // eslint-disable-next-line jest/no-disabled-tests
  xit('restores background color to default, deletes the video center via GraphQL', async () => {
    await waitForClickableAndClick({ element: BrandingPage.resortDefault });
    await BrandingPage.saveColors.waitForDisplayed();
    await waitForClickableAndClick({ element: BrandingPage.saveColors });
    expect(await BrandingPage.resortDefault).not.toBeDisplayed();

    await Promise.all([deleteHub(hubWithoutChannels)]);
  });

  // RED
  // eslint-disable-next-line jest/no-disabled-tests
  xit('choose a night mood', async () => {
    await waitForClickableAndClick({ element: BrandingPage.nightMood });
    await BrandingPage.nightMoodCheck.waitForExist();
    expect(await BrandingPage.nightMoodCheck).toBeDisplayed();
  });
});

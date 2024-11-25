import logger from '@wdio/logger';
import PrivacySettingsPage from '../../pages/privacySettings.page';
import { createHub, deleteHub } from '../../apis/graphql/hub';
import { loginAsPlanner } from '../../utils/authUtils';
import { waitForClickableAndClick } from '../../utils/waitHelpers';
import { getAxeViolationIds } from '../../utils/axe/getViolations';
import { addGlobalViolations } from '../../utils/axe/addGlobalViolations';
import { VIOLATION_TYPE } from '../../utils/axe/ruleIds';
import { readAppFeatures } from '../../apis/services/appFeaturesClient';

const { privacyFeature = false, cookieNotificationFeature = false, cookieListFeature = false } = readAppFeatures();
const Logger = logger('privacySettings');

let hubWithoutChannels;
const dataSetup = async (): Promise<void> => {
  [hubWithoutChannels] = await Promise.all([createHub()]);
};

(privacyFeature ? describe : xdescribe)('Privacy Settings Page', () => {
  it('logs in Videos using core UI, creates a video center via GraphQL, opens the page Privacy Settings', async () => {
    await loginAsPlanner();
    await dataSetup();

    await PrivacySettingsPage.openPage(hubWithoutChannels);
    await PrivacySettingsPage.editPrivacyPolicyCard.waitForExist();
    expect(await PrivacySettingsPage.yourPolicyRadioButton).toBeClickable();
    expect(await PrivacySettingsPage.editPrivacyPolicyCard).toBeDisplayed();
    expect(await PrivacySettingsPage.editTermsOfUseCard).toBeDisplayed();
    expect(await PrivacySettingsPage.editCookieNotification).toBeDisplayed();
    expect(await PrivacySettingsPage.editCcpaCard).toBeDisplayed();
  });

  it('edits privacy policy settings', async () => {
    Logger.trace('opening privacy policy edit mode');
    await PrivacySettingsPage.editPrivacyPolicyCard.waitForExist();
    expect(PrivacySettingsPage.editPrivacyPolicyCard).toBeDisplayed();

    await waitForClickableAndClick({ element: PrivacySettingsPage.yourPolicyRadioButton });
    await PrivacySettingsPage.yourPolicyText.waitForExist();
    await (await PrivacySettingsPage.yourPolicyText).setValue('Company Policy');
    await (await PrivacySettingsPage.yourPolicyUrl).setValue('https://www.cvent.com');

    Logger.trace('closing privacy policy edit mode');
  });

  it('edits terms of use settings', async () => {
    Logger.trace('opening terms of use edit mode');
    const { editTermsOfUseCard } = PrivacySettingsPage;
    await expect(editTermsOfUseCard).toBeDisplayed();

    await (await PrivacySettingsPage.displayTermsOnFooterButton).click();
    await PrivacySettingsPage.termsLinkTextInput.waitForExist();
    await PrivacySettingsPage.termsLinkTextInput.setValue('Terms Of Use');

    await (await PrivacySettingsPage.displayTermsOnLoginButton).click();
    await PrivacySettingsPage.termsTextInput.waitForExist();
    await PrivacySettingsPage.termsTextInput.setValue('Demo Terms');
    Logger.trace('closing terms of use edit mode');
  });

  (cookieNotificationFeature ? it : xit)('edits cookie notification settings', async () => {
    Logger.trace('opening cookie notification edit mode');
    const { editCookieNotification } = PrivacySettingsPage;
    await expect(editCookieNotification).toBeDisplayed();

    await (await PrivacySettingsPage.notifyUsersAboutCookieButton).click();
    await PrivacySettingsPage.allowTurnOffGoogleAnalyticsButton.waitForExist();
    await (await PrivacySettingsPage.allowTurnOffGoogleAnalyticsButton).click();
    await (await PrivacySettingsPage.allowTurnOffCookiesButton).click();

    Logger.trace('closing cookie notification edit mode');
  });

  (cookieListFeature ? it : xit)('edits cvent cookieList settings', async () => {
    Logger.trace('opening cvent cookie List settings');
    const { cventPrivacyPolicyCheckbox } = PrivacySettingsPage;
    await cventPrivacyPolicyCheckbox.scrollIntoView();
    await expect(cventPrivacyPolicyCheckbox).toBeDisplayed();
    await expect(PrivacySettingsPage.cventCookieListCheckbox).toBeDisplayed();
    await expect(PrivacySettingsPage.customerPrivacyPolicyUrl).toBeDisplayed();
    await expect(PrivacySettingsPage.customerPrivacyPolicyLinkText).toBeDisplayed();
    Logger.trace('closing cookie List settings');
  });

  (cookieListFeature ? it : xit)('edits customer cookieList settings', async () => {
    Logger.trace('opening customer cookie List settings');
    const { customerCookieListCheckbox } = PrivacySettingsPage;
    await expect(customerCookieListCheckbox).toBeDisplayed();
    await (await customerCookieListCheckbox).click();
    await PrivacySettingsPage.customerCookieListUrl.waitForExist();
    await (await PrivacySettingsPage.customerCookieListUrl).setValue('https://www.cvent.com');
    await (await PrivacySettingsPage.customerCookieListText).setValue('Your Cookie List');
    Logger.trace('closing customer List settings');
  });

  // HUB-144323
  (cookieNotificationFeature ? xit : xit)('edits CCPA settings with ccpa ExplanationText', async () => {
    Logger.trace('opening ccpa edit mode');
    const { editCcpaCard } = PrivacySettingsPage;
    await expect(editCcpaCard).toBeDisplayed();

    await (await PrivacySettingsPage.ccpaButton).click();
    await PrivacySettingsPage.ccpaLinkTextInput.clearValue();
    await PrivacySettingsPage.ccpaLinkTextInput.setValue('Ccpa Link text');
    await PrivacySettingsPage.ccpaExplanationTextInput.setValue('ccpa explanation text');
    await PrivacySettingsPage.ccpaButtonTextInput.setValue('Ccpa');
    await PrivacySettingsPage.ccpaConfirmationTextInput.setValue('Ccpa Confirmation text');
    await PrivacySettingsPage.ccpaDnsUrlButton.waitForExist();

    await (await PrivacySettingsPage.ccpaDnsUrlButton).click();
    await PrivacySettingsPage.ccpaDnsUrlTextInput.waitForExist();
    await PrivacySettingsPage.ccpaDnsUrlTextInput.setValue('www.cvent.com');
    await (await PrivacySettingsPage.saveButton).click();
    Logger.trace('closing ccpa edit mode');
  });

  // RED
  // eslint-disable-next-line jest/no-disabled-tests
  xit('hub privacy settings page has no accessibility issues', async () => {
    const desktopViolations = [
      VIOLATION_TYPE.LANDMARK_ONE_MAIN, // HUB-156911
      VIOLATION_TYPE.REGION // HUB-156911
    ];
    const knownViolations = await addGlobalViolations(desktopViolations);
    const violationIds = await getAxeViolationIds('hub privacy settings', knownViolations);

    await expect(violationIds).toEqual(knownViolations);
  });

  // HUB-144323
  // eslint-disable-next-line jest/no-disabled-tests
  xit('validates persistence of saved settings, deletes the video center via GraphQL', async () => {
    await browser.refresh();
    expect(await PrivacySettingsPage.yourPolicyUrl.getValue()).toEqual('https://www.cvent.com');
    expect(await PrivacySettingsPage.yourPolicyText.getValue()).toEqual('Company Policy');
    expect(await PrivacySettingsPage.termsLinkTextInput.getValue()).toEqual('Terms Of Use');
    expect(await PrivacySettingsPage.termsTextInput.getValue()).toEqual('Demo Terms');

    await Promise.all([deleteHub(hubWithoutChannels)]);
  });
});

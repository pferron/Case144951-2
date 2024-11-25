import { ChainablePromiseElement } from 'webdriverio';
import BasePage from './BasePage';
import { getConfigs } from '../../configs/testConfig';

const configs = getConfigs();

class PrivacySettingsPage extends BasePage {
  public async openPage(hubId): Promise<void> {
    await this.open(`${configs.baseUrl}/eventsplus/${hubId}/privacy`);
    await this.hasLoaded();
  }

  get privacySettingsButton(): ChainablePromiseElement<WebdriverIO.Element> {
    return $("//a[contains(text(), 'Privacy Settings')]");
  }

  get privacySettingsTitle(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('h1[title="Privacy Settings"]');
  }

  async editPencilIcon(element, testId): Promise<WebdriverIO.Element> {
    return element.$(`button[data-cvent-id="${testId}-edit-button"]`);
  }

  async savePencilIcon(element, testId): Promise<WebdriverIO.Element> {
    return element.$(`button[data-cvent-id="${testId}-save-button"]`);
  }

  get privacyPolicyCard(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="privacy-policy-fields"]');
  }

  get termsOfUseCard(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="termsofuse-fields"]');
  }

  get cookieNotificationsCard(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="cookie-notification-fields"]');
  }

  get ccpaCard(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="ccpa-fields"]');
  }

  get editPrivacyPolicyCard(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="edit-privacy-policy-fields"]');
  }

  get editTermsOfUseCard(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="edit-termsofuse-fields"]');
  }

  get editCookieNotification(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="edit-cookie-notification-fields"]');
  }

  get editCcpaCard(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="edit-ccpa-fields"]');
  }

  get cventPrivacyPolicyCheckbox(): ChainablePromiseElement<WebdriverIO.Element> {
    return $("//label[@for='cvent-privacy-policy-checkbox']");
  }

  get cventCookieListCheckbox(): ChainablePromiseElement<WebdriverIO.Element> {
    return $("//label[@for='cvent-cookie-list-checkbox']");
  }

  get customerCookieListCheckbox(): ChainablePromiseElement<WebdriverIO.Element> {
    return $("//label[@for='your-company-cookie-list-checkbox']");
  }

  get customerPrivacyPolicyUrl(): ChainablePromiseElement<WebdriverIO.Element> {
    return $("//label[@for='cvent-cookie-list-checkbox']");
  }

  get customerPrivacyPolicyLinkText(): ChainablePromiseElement<WebdriverIO.Element> {
    return $("//input[@id='cventPrivacyPolicyLinkText']");
  }

  get customerCookieListUrl(): ChainablePromiseElement<WebdriverIO.Element> {
    return $("//input[@id='customCookieListUrl']");
  }

  get customerCookieListText(): ChainablePromiseElement<WebdriverIO.Element> {
    return $("//input[@id='customCookieLinkText']");
  }

  get saveButton(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="header-actions__save"]');
  }

  get yourPolicyRadioButton(): ChainablePromiseElement<WebdriverIO.Element> {
    const radioGroup = $('#displayPrivacyPolicy');
    return radioGroup.$$('div')[0].$('label');
  }

  get yourPolicyUrl(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('#privacyPolicyUrl');
  }

  get yourPolicyText(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('#privacyPolicyLinkText');
  }

  get displayTermsOnFooterButton(): ChainablePromiseElement<WebdriverIO.Element> {
    const radioGroup = $('#displayTermsLinkOnFooter');
    return radioGroup.$$('div')[0].$('label');
  }

  get termsLinkTextInput(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('#termsLinkText');
  }

  get displayTermsOnLoginButton(): ChainablePromiseElement<WebdriverIO.Element> {
    const radioGroup = $('#displayTermsOnLogin');
    return radioGroup.$$('div')[0].$('label');
  }

  get termsTextInput(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('#termsText');
  }

  get ccpaExplanationTextInput(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('#ccpa-explanation-text');
  }

  get ccpaLinkTextInput(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('#privacy-ccpa-link-text-input');
  }

  get ccpaButtonTextInput(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('#ccpa-button-text');
  }

  get ccpaConfirmationTextInput(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('#privacy-ccpa-confirmation-text-input');
  }

  get ccpaDnsUrlTextInput(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('#ccpa-dns-url');
  }

  get ccpaButton(): ChainablePromiseElement<WebdriverIO.Element> {
    const radioGroup = $('#ccpaEnableDoNotSell');
    return radioGroup.$$('div')[0].$('label');
  }

  get ccpaDnsUrlButton(): ChainablePromiseElement<WebdriverIO.Element> {
    const radioGroup = $('#ccpaDnsLinkText');
    return radioGroup.$$('div')[0].$('label');
  }

  get notifyUsersAboutCookieButton(): ChainablePromiseElement<WebdriverIO.Element> {
    const radioGroup = $('#notifyUsersAboutCookie');
    return radioGroup.$$('div')[0].$('label');
  }

  get displayCventPrivacyPolicyInCookieButton(): ChainablePromiseElement<WebdriverIO.Element> {
    const radioGroup = $('#displayCventPrivacyPolicyInCookie');
    return radioGroup.$$('div')[1].$('label');
  }

  get allowTurnOffGoogleAnalyticsButton(): ChainablePromiseElement<WebdriverIO.Element> {
    const radioGroup = $('#allowTurnOffGoogleAnalytics');
    return radioGroup.$$('div')[1].$('label');
  }

  get allowTurnOffCookiesButton(): ChainablePromiseElement<WebdriverIO.Element> {
    const radioGroup = $('#allowTurnOffCookies');
    return radioGroup.$$('div')[0].$('label');
  }

  async hasLoaded(): Promise<void> {
    await this.spinner.waitForDisplayed({ reverse: true });
    await this.yourPolicyRadioButton.waitForClickable();
  }
}

export default new PrivacySettingsPage();

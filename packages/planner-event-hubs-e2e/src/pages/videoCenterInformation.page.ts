import { ChainablePromiseElement } from 'webdriverio';
import logger from '@wdio/logger';
import BasePage from './BasePage';
import { getConfigs } from '../../configs/testConfig';

const configs = getConfigs();
const Logger = logger('videoCenterInformation.page');

class VideoCenterInfomation extends BasePage {
  public async openPage(hubId): Promise<void> {
    await this.open(`${configs.baseUrl}/eventsplus/${hubId}/information`);
    await this.hasLoaded();
  }

  get videoCenterInformation(): ChainablePromiseElement<WebdriverIO.Element> {
    return $("//a[contains(text(), 'Hub Information')]");
  }

  get pageTitle(): ChainablePromiseElement<WebdriverIO.Element> {
    return $("//h1[contains(text(), 'Hub Information')]");
  }

  get theming(): ChainablePromiseElement<WebdriverIO.Element> {
    return $("//a[contains(text(), 'Theming')]");
  }

  get vcName(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="video-hub-form-title"]');
  }

  get vcNameInput(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('#video-hub-form-title');
  }

  get vcOwnerFirstName(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="video-hub-form-ownerFirstName"]');
  }

  get vcOwnerFirstNameInput(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('#video-hub-form-ownerFirstName');
  }

  get vcOwnerLastName(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="video-hub-form-ownerLastName"]');
  }

  get vcOwnerLastNameInput(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('#video-hub-form-ownerLastName');
  }

  get vcOwnerEmail(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="video-hub-form-ownerEmail"]');
  }

  get vcOwnerEmailInput(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('#video-hub-form-ownerEmail');
  }

  get vcWeblink(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="custom-domain"]');
  }

  get vcWeblinkEditButton(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="center-custom-domain-card-edit-button"]');
  }

  get vcWeblinkEditSaveButton(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="center-custom-domain-card-edit-save-button"]');
  }

  get vcHubInformationSaveButton(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="header-actions__save"]');
  }

  get vcWeblinkTrailingNameInput(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="video-hub-form-trailing-name-input"]');
  }

  get vcCustomDomainDropdownButton(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="video-hub-form-custom-domain"]');
  }

  get vcCustomDomainOption0(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="video-hub-form-custom-domain-option-0"]');
  }

  get vcCustomDomainOption1(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="video-hub-form-custom-domain-option-1"]');
  }

  get vcWeblinkEditCancelButton(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="center-custom-domain-card-edit-cancel-button"]');
  }

  get pageLeavePopUpLeaveButton(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="events-plus-information-page-navigation-confirmation-modal-leave-button"]');
  }

  get pageLeavePopUpStayButton(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="events-plus-information-page-navigation-confirmation-modal-stay-button"]');
  }

  get eventsplusLocalNav(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('a[href="/eventsplus"]');
  }

  async hasLoaded(): Promise<void> {
    Logger.trace('Start: Video Center Information hasLoaded()');
    await this.spinner.waitForDisplayed({ reverse: true });
    await this.vcWeblink.waitForDisplayed();
    Logger.trace('Video Center Information: has successfully loaded');
  }
}

export default new VideoCenterInfomation();

import { ChainablePromiseElement } from 'webdriverio';
import logger from '@wdio/logger';
import BasePage from './BasePage';

const Logger = logger('videoCenterCreate.page');

class VideoCenterCreatePage extends BasePage {
  get pageTitle(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="video-hub-create-modal-title]');
  }

  get videoCenterName(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('input[data-cvent-id="video-hub-form-title-input"]');
  }

  get videoCenterLanguageDropdown(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('button[data-cvent-id="video-hub-form-language"]');
  }

  get videoCenterChooseLanguage(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="video-hub-form-language-option-1"]');
  }

  get videoCenterOwnerFirstName(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('input[data-cvent-id="video-hub-form-ownerFirstName-input"]');
  }

  get videoCenterOwnerLastName(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('input[data-cvent-id="video-hub-form-ownerLastName-input"]');
  }

  get videoCenterOwnerEmail(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('input[data-cvent-id="video-hub-form-ownerEmail-input"]');
  }

  get saveButton(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="video-hub-create-save-button"]');
  }

  async hasLoaded(): Promise<void> {
    Logger.trace('Start: New Video Center hasLoaded()');
    await this.spinner.waitForDisplayed({ reverse: true });
    Logger.trace('New Video Center: has successfully loaded');
  }
}

export default new VideoCenterCreatePage();

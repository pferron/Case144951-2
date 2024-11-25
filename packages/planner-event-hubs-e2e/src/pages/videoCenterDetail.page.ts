import { ChainablePromiseElement } from 'webdriverio';
import logger from '@wdio/logger';
import BasePage from './BasePage';

const Logger = logger('videoDetail.page');

class VideoDetail extends BasePage {
  get pageTitle(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('h1');
  }

  get videoCenterInformation(): ChainablePromiseElement<WebdriverIO.Element> {
    return $("//a[contains(text(), 'Video Center Information')]");
  }

  get theming(): ChainablePromiseElement<WebdriverIO.Element> {
    return $("//a[contains(text(), 'Theming')]");
  }

  get branding(): ChainablePromiseElement<WebdriverIO.Element> {
    return $("//a[contains(text(), 'Branding')]");
  }

  get channels(): ChainablePromiseElement<WebdriverIO.Element> {
    return $("//a[contains(text(), 'Channels')]");
  }

  get banners(): ChainablePromiseElement<WebdriverIO.Element> {
    return $("//a[contains(text(), 'Banners')]");
  }

  get privacySettings(): ChainablePromiseElement<WebdriverIO.Element> {
    return $("//a[contains(text(), 'Privacy Settings')]");
  }

  async hasLoaded(): Promise<void> {
    Logger.trace('Start: Video Detial hasLoaded()');
    await this.spinner.waitForDisplayed({ reverse: true });
    Logger.trace('Video Detail: has successfully loaded');
  }
}

export default new VideoDetail();

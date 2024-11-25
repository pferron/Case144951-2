import { ChainablePromiseElement } from 'webdriverio';
import logger from '@wdio/logger';

const Logger = logger('coreEvents.page');

class EventsPage {
  get pageTitle(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[class="fdn-nav-product-name"]');
  }

  get appSwitcher(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="nav-switcher-parent"]');
  }

  get videos(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[class="cv-icon fdn-nav-i-video"]');
  }

  async hasLoaded(): Promise<void> {
    Logger.trace('Start: EventsPage hasLoaded()');
    // expect(this.pageTitle).toBeDisplayed();
    Logger.trace('EventsPage: has successfully loaded');
  }

  async navigateToVideos(): Promise<void> {
    Logger.trace('Start: EventsPage navigateToVideos()');
    await this.appSwitcher.click();
    await this.videos.click();
    Logger.trace('End: EventsPage navigateToVideos()');
  }
}

export default new EventsPage();

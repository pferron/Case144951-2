import { ChainablePromiseArray, ChainablePromiseElement, ElementArray } from 'webdriverio';
import logger from '@wdio/logger';
import BasePage from './BasePage';
import findAsync from '../utils/findAsync';
import { getConfigs } from '../../configs/testConfig';

const configs = getConfigs();
const Logger = logger('videoCenter.page');

class VideoCenterPage extends BasePage {
  get root(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="video-hubs-view"]');
  }

  public async openPage(): Promise<void> {
    await this.open(`${configs.baseUrl}/eventsplus/`);
    await this.hasLoaded();
  }

  get pageTitle(): ChainablePromiseElement<WebdriverIO.Element> {
    return $("//h1[contains(text(), 'Events+ Hubs')]");
  }

  get createVideoCenterButton(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="header-actions__create-hub"]');
  }

  get videoCenterNameList(): ChainablePromiseArray<ElementArray> {
    return this.root.$$('[href^="/eventsplus/"]');
  }

  get deleteVideoCenterButton(): ChainablePromiseElement<WebdriverIO.Element> {
    return $("//span[contains(text(),' Delete')]");
  }

  get confirmDeleteVideoCenterButton(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('button[data-cvent-id="confirmation-modal-confirmation-button"]');
  }

  async viewMoreActionButton(vcName: string): Promise<WebdriverIO.Element> {
    return $(`//a[contains(text(),'${vcName}')]/../../../following-sibling::span//button`);
  }

  async selectVcButton(vcName: string): Promise<WebdriverIO.Element> {
    return $(`//a[contains(text(),'${vcName}')]`);
  }

  async hasLoaded(): Promise<void> {
    Logger.trace('Start: Video Centers hasLoaded()');
    await this.spinner.waitForDisplayed({ reverse: true });
    await this.createVideoCenterButton.waitForDisplayed({ timeout: 3000 });
    await this.createVideoCenterButton.waitForClickable;
    Logger.trace('Video Centers: has successfully loaded');
  }

  async vcIsShown(vcName: string): Promise<boolean> {
    const videoCenterList = await this.videoCenterNameList;
    const videoCenter = await findAsync(
      videoCenterList as unknown as WebdriverIO.Element[],
      async (vc: WebdriverIO.Element) => {
        return (await vc.getText()) === vcName;
      }
    );

    return !!videoCenter;
  }

  async accessOneVideoCenter(vcName): Promise<WebdriverIO.Element> {
    return this.root.$$('[href^="/eventsplus/"]').filter(async VC => (await VC.getText()).includes(vcName))[0];
  }
}

export default new VideoCenterPage();

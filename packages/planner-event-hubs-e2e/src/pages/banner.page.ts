import { ChainablePromiseElement } from 'webdriverio';
import logger from '@wdio/logger';
import BasePage from './BasePage';
import { getConfigs } from '../../configs/testConfig';

const configs = getConfigs();
const Logger = logger('banners.page');

class BannerPage extends BasePage {
  public async openPage(hubId): Promise<void> {
    await this.open(`${configs.baseUrl}/eventsplus/${hubId}/banners`);
    await this.hasLoaded();
  }

  get pageTitle(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('h1[title="Banners"]');
  }

  get emptyBannerListPage(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="empty-banner-page-container"]');
  }

  get bannerList(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="banners-list"]');
  }

  get createBannerButton(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('button[data-cvent-id="header-actions__create-banner"]');
  }

  async createBannerTemplateType(bannerType: string): Promise<WebdriverIO.Element> {
    // Banner template 1:  data-cvent-id="Banners-Template-Card-TextOnly"
    // Banner template 2:  data-cvent-id="Banners-Template-Card-InsetImage"
    // Banner template 3:  data-cvent-id="Banners-Template-Card-FullImage"
    return $(`[data-cvent-id='${bannerType}']`).$('button[type="button"]');
  }

  get inputBannerName(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="banner_name-input"]');
  }

  get confirmBannerCreationButton(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('button[data-cvent-id="Banner-Name-Form-Done"]');
  }

  get accessPagesTab(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="banners-and-pages"]').$('button[data-cvent-id="TabPanelstab: 1"]');
  }

  get PageList(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="banner-page-list"]');
  }

  get HomePageBannerList(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="Homepage-section"]').$('[data-cvent-id="banner-placement-table-row-0"]');
  }

  get ChannelPageBannerList(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="Channel-section"]').$('[data-cvent-id="banner-placement-table-row-0"]');
  }

  async hasLoaded(): Promise<void> {
    Logger.trace('Start: Banners hasLoaded()');
    await this.spinner.waitForDisplayed({ reverse: true });
    await this.createBannerButton.waitForClickable();
    Logger.trace('Banners has successfully loaded');
  }
}

export default new BannerPage();

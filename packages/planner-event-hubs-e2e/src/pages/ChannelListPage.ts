import { ChainablePromiseElement } from 'webdriverio';
import logger from '@wdio/logger';
import BasePage from './BasePage';
import { getConfigs } from '../../configs/testConfig';

const configs = getConfigs();
const Logger = logger('ChannelList.page');

class ChannelList extends BasePage {
  public async openPage(hubId): Promise<void> {
    await this.open(`${configs.baseUrl}/eventsplus/${hubId}/channels`);
    await this.hasLoaded();
  }

  get pageTitle(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="Channels"]');
  }

  get emptyChannelListPageIllustration(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="empty-channel-page-container"]');
  }

  get channelListTable(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="channel-list-table"]');
  }

  get createChannelButton(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="header-actions__create-channel"]');
  }

  get createChannelModalHeader(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="create-channel-modal-header"]');
  }

  get createChannelModalSaveButton(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="create-channel-save-channel-button"]');
  }

  get createChannelTitleInput(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="channel-name-form-input-name-input"]');
  }

  get createChannelDescriptionInput(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="channel-name-form-input-description-textarea"]');
  }

  get channelListFirstTrashIcon(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id*="trash-icon"]');
  }

  get channelListFirstTitle(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id*="channel-title"]');
  }

  get channelDeletionSuccessAlert(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="channel-deletion-success"]');
  }

  get channelSortByTitleButton(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="channel-list-table-heading-0"]');
  }

  get createChannelButton2(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="header-actions__create-channel"]');
  }

  get reorderChannelsButton(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="header-actions__reorder"]');
  }

  get saveOrderButton(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="header-actions__save"]');
  }

  get cancelOrderingButton(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="header-actions__cancel"]');
  }

  async hasLoaded(): Promise<void> {
    Logger.trace('Start: Channel List hasLoaded()');
    await this.spinner.waitForDisplayed({ reverse: true });
    await this.createChannelButton.waitForDisplayed();
    await this.createChannelButton.waitForClickable();
    Logger.trace('Channel List: has successfully loaded');
  }
}

export default new ChannelList();

import { ChainablePromiseArray, ChainablePromiseElement } from 'webdriverio';
import logger from '@wdio/logger';
import BasePage from './BasePage';
import { getConfigs } from '../../configs/testConfig';

const configs = getConfigs();

const Logger = logger('videoMain.page');

class VideoMainPage extends BasePage {
  public async openPage(): Promise<void> {
    await this.open(`${configs.baseUrl}/eventsplus/`);
    await this.hasLoaded();
  }

  get pageTitle(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('span=Events');
  }

  get addVideoButton(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="add-video-button"]');
  }

  get manageStorageButton(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="manage-storage-button"]');
  }

  get addVideoFileReq(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="add-video-file-requirements"]');
  }

  get failedVideoCountLink(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="video-library-list-failed-count-link"]');
  }

  get failedVideoList(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="video-library-list-failed-list-table"]');
  }

  get videoListSearchBar(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="video-library-list-search-field__search-bar"]').$('input');
  }

  get videoListSearchButton(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="video-library-list-search-field__search-bar__submit-search-button"]');
  }

  get videoListClearSearchButton(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="video-library-list-search-field__search-bar__clear-search-button"]');
  }

  get videoList(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="video-library-list-table"]');
  }

  get videoListHeader(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="video-library-list-table-table-header"]');
  }

  get videoEmptyList(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="video-library-list-search-no-data-container"]');
  }

  get videoListSpinner(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="video-library-list-search-loading-spinner"]');
  }

  get videoListItemNames(): ChainablePromiseArray<WebdriverIO.ElementArray> {
    return $$('[data-cvent-id="video-library-list-item-name"]');
  }

  get videoListItemThumbnail(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="video-library-list-item-thumbnail"]');
  }

  get videoListItemModify(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="video-library-list-item-modify"]');
  }

  get videoListItemDuration(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="video-library-list-item-duration"]');
  }

  get libraryListFirstRow(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="video-library-list-table-row-0"]');
  }

  get accessVideoCenter(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('a[href="/eventsplus"]');
  }

  async hasLoaded(): Promise<void> {
    Logger.trace('Start: Events Main Page hasLoaded()');
    await this.spinner.waitForDisplayed({ reverse: true });
    Logger.trace('Video Main Page: has successfully loaded');
  }

  /**
   * Search videos
   * @param text to search
   */
  async search(text): Promise<void> {
    Logger.trace(`Start: search() with params ${text}`);
    await this.videoListSearchBar.setValue(text);
    await this.videoListSpinner.waitForDisplayed({ reverse: true });
    Logger.trace('End: search()');
  }

  /**
   * Will look through all the video list item names and return element that has the text of the given name.
   * Will not iterate through pages.
   * @param name - The name of the video, exactly how it is displayed.
   * @returns
   */
  async findByListItemName(name: string): Promise<WebdriverIO.Element | null> {
    const listItemNames = await this.videoListItemNames;
    for (let i = 0; i < listItemNames.length; i++) {
      // eslint-disable-next-line no-await-in-loop
      if ((await listItemNames[i].getText()) === name) {
        return listItemNames[i];
      }
    }
    return null;
  }
}

export default new VideoMainPage();

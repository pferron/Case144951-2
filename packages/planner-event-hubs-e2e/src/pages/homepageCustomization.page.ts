import { ChainablePromiseElement } from 'webdriverio';
import logger from '@wdio/logger';
import BasePage from './BasePage';
import { getConfigs } from '../../configs/testConfig';

const configs = getConfigs();
const Logger = logger('homepageCustomization.page');

class HomepageCustomizationPage extends BasePage {
  public async openPage(hubId): Promise<void> {
    await this.open(`${configs.baseUrl}/eventsplus/${hubId}/home-page`);
    await this.hasLoaded();
  }

  get pageTitle(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="homePage-customization-title"]');
  }

  get homepageSideNav(): ChainablePromiseElement<WebdriverIO.Element> {
    return $("//a[contains(text(), 'Home Page')]");
  }

  get defaultBannerSection(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="row-default-banners"]');
  }

  get defaultChannelsListSection(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="row-DefaultChannels"]');
  }

  get yourEventsSection(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="row-MyEventCalendar"]');
  }

  get addSectionButton(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="Add-sections-button"]');
  }

  get publishBtn(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="header-actions__publish"]');
  }

  get addSectionsModal(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="add-section-modal"]');
  }

  get addSectionModalFooterBtn(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="add-section-modal-footer-btn-add"]');
  }

  get addTemplateSectionModalFooterBtn(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="add-section-template-modal-footer-btn-add"]');
  }

  get templateSectionDoneBtn(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="template-section-add-section-done-button"]');
  }

  get addSectionDetailsModal(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="add-section-details-modal"]');
  }

  get previewerAddInDetailsModal(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="events-section-previewer"]');
  }

  get yourEventsSectionDoneBtn(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="your-events-section-add-section-done-button"]');
  }

  get yourEventsSectionCancelBtn(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="your-events-section-add-section-cancel-button"]');
  }

  get yourEventsItemOverflowMenuButton(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="section-item-overflow-menu-button-MyEventCalendar"]');
  }

  get editSectionMenuOption(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="section-list-option-menu-MyEventCalendar-option-0"]');
  }

  get deletSectionMenuOption(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="section-list-option-menu-MyEventCalendar-option-1"]');
  }

  get deletSectionBtnInConfirmation(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="confirmation-modal-confirmation-button"]');
  }

  get yourEventsItemOverflowMenuOptions(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="section-list-option-menu-MyEventCalendar-magazine"]');
  }

  get yourEventsSectionInAddSectionModal(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="add-section-MyEventCalendar"]');
  }

  get newSectionInAddSectionModal(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="add-section-new-section"]');
  }

  get fullImageOption(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="new-section-text-layout-style__div__FullImage"]');
  }

  get insetImageOption(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="new-section-text-layout-style__div__InsetImage"]');
  }

  get textAndColorOption(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="new-section-text-layout-style__div__TextAndColor"]');
  }

  get textAndColorBgSection(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="row-TextImage"]');
  }

  get uploadImageBtn(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="section-image-file-upload"]');
  }

  get titleInput(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="title-input"]');
  }

  async hasLoaded(): Promise<void> {
    Logger.trace('Start: Home Page hasLoaded()');
    await this.spinner.waitForDisplayed({ reverse: true });
    await this.addSectionButton.waitForClickable();
    Logger.trace('Home Page: has successfully loaded');
  }
}

export default new HomepageCustomizationPage();

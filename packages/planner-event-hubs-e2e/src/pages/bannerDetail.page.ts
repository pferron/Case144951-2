import { ChainablePromiseElement } from 'webdriverio';
import logger from '@wdio/logger';
import BasePage from './BasePage';

const Logger = logger('bannerDetail.page');

class BannerDetail extends BasePage {
  get pageTitle(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('h1[data-cvent-id="header-title"]');
  }

  get deleteBannerButton(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('button[data-cvent-id="header-actions__delete-banner"]');
  }

  get deleteBannerConfirmButton(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('button[data-cvent-id="confirmation-modal-confirmation-button"]');
  }

  get deleteBannerCancelButton(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('button[data-cvent-id="confirmation-modal-cancel-button"]');
  }

  get renameBannerButton(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('button[data-cvent-id="header-actions__delete-banner"]');
  }

  get editBannerContentButton(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('button[data-cvent-id="banner-content-edit-button"]');
  }

  get editBannerContentTitle(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="bannerTitle"]');
  }

  get editBannerContentBody(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="bannerBody"]');
  }

  get editBannerContentSaveButton(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="banner-content-edit-save-button"]');
  }

  get editBannerContentCancelButton(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="banner-content-edit-cancel-button"]');
  }

  get editBannerStyleButton(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="banner-style-edit-button"]');
  }

  get editBannerStyleSaveButton(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="banner-style-edit-save-button"]');
  }

  get editBannerStyleCancelButton(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="banner-style-edit-cancel-button"]');
  }

  get assignPages(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="banner-pages"]').$("//span[contains(text(), 'Assign pages')]");
  }

  get associateBannerWithPageList(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('button[data-cvent-id="banner_placement"]');
  }

  get associateBannerWithHomepage(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="banner_placement-magazine"]').$("//div[contains(text(), 'Homepage')]");
  }

  get associateBannerWithChannelpage(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="banner_placement-magazine"]').$("//div[contains(text(), 'E2e channel creation title')]");
  }

  get associateBannerWithPageSave(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="banner-pages-save-pages-button"]');
  }

  get associateBannerWithPageCancel(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="banner-pages-cancel-channel-button"]');
  }

  get displayPageAssociatedWithBanner(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('div[data-cvent-id="banner-pages"]')
      .$('ul[data-cvent-id="banners-list"]')
      .$('div[data-cvent-id="banner-placement-table-row"]');
  }

  get displayTrashButtonForPageAssociatedWithBanner(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="trash-icon"]');
  }

  get displayBannerContentForm(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="banner-content-form"]');
  }

  get previewBannerImage(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="banner-preview-image-inlay-element"]');
  }

  get editBannerImageSectionButton(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="banner-images-edit-button"]');
  }

  get saveBannerImageSectionButton(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="banner-images-edit-save-button"]');
  }

  get cancelBannerImageSectionButton(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="banner-images-edit-cancel-button"]');
  }

  get uploadBannerImageButton(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="image-upload-button"]');
  }

  get imageEditor(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="image-editor"]');
  }

  get imageEditorHeader(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="Editor_title"]');
  }

  get imageEditorImage(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="editorCanvas"]');
  }

  get imageEditorCancelButton(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="image-editor"]').$('[data-cvent-id="cancelButton"]');
  }

  get imageEditorApplyButton(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="image-editor"]').$('[data-cvent-id="applyButton"]');
  }

  get bannerInformationImageUploadInput(): ChainablePromiseElement<WebdriverIO.Element> {
    return $("//input[@data-cvent-id='image-upload-input']");
  }

  get replaceBannerImageButton(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="image-replace-button"]');
  }

  get editBannerImageButton(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="image-edit-button"]');
  }

  get deleteBannerImageButton(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="image-delete-button"]');
  }

  get bannerImageAltTextInputField(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="altText-input"]');
  }

  get bannerImageAltText(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="altText"]');
  }

  async hasLoaded(): Promise<void> {
    Logger.trace('Start: Banner Detial hasLoaded()');
    await this.spinner.waitForDisplayed({ reverse: true });
    await this.deleteBannerButton.waitForDisplayed();
    await this.deleteBannerButton.waitForClickable();
    await this.displayBannerContentForm.waitForDisplayed();
    Logger.trace('Banner Detail: has successfully loaded');
  }
}

export default new BannerDetail();

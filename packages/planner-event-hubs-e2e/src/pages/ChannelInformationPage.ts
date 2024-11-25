import { ChainablePromiseArray, ChainablePromiseElement, ElementArray } from 'webdriverio';
import BasePage from './BasePage';
import { getConfigs } from '../../configs/testConfig';

const configs = getConfigs();

class ChannelInformation extends BasePage {
  public async openPage(hubId, channelId): Promise<void> {
    await this.open(`${configs.baseUrl}/eventsplus/${hubId}/channels/${channelId}`);
  }

  get pageTitle(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('h1[data-cvent-id="header-title"]');
  }

  get channelInformationForm(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="channel-information-form"]');
  }

  get channelNameInputField(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="channel-name-input-field-label"]');
  }

  get channelDescriptionInputField(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="channel-description-input-field-label"]');
  }

  get channelInformationEditButton(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="channel-information-page-edit-form-button"]');
  }

  get channelInformationImageUploadButton(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="image-upload-button"]');
  }

  get channelInformationImageUploadInput(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="image-upload-input"]');
  }

  get unsupportedFileAlertBox(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="incorrect-image-size-alert"]');
  }

  get imageEditorHeader(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="Editor_title"]');
  }

  get imageEditorApplyButton(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="applyButton"]');
  }

  get saveFormButton(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="channel-information-page-save-edit-form-button"]');
  }

  get channelInformationDeleteChannelButton(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="header-actions__delete-channel"]');
  }

  get channelDeletionSuccessAlert(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="channel-deletion-success"]');
  }

  get channelVideosHeading(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="channel_video_header"]');
  }

  get channelCatalogPreview(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="catalog-preview"]');
  }

  get channelVideosTab(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="channel_video_tab_header"]');
  }

  get channelInformationTab(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="channel_information_tab_header"]');
  }

  get addVideosButton(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="channel-video-add-video-button"]');
  }

  get addVideoModalVideoList(): ChainablePromiseArray<ElementArray> {
    return $$('[data-cvent-id*="select-video-modal-table-row"]');
  }

  get addVideoModalAddButton(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="select-video-modal-add-button"]');
  }

  get videoMenuList(): ChainablePromiseArray<ElementArray> {
    return $$('[aria-label="Video menu"]');
  }

  get sectionMenuList(): ChainablePromiseArray<ElementArray> {
    return $$('[aria-label="Section menu"]');
  }

  get videoOverflowMenuList(): ChainablePromiseArray<ElementArray> {
    return $$('[data-cvent-id*="option"][role="menuitem"]');
  }

  get sectionNameInput(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="section-name-form-input-name-input"]');
  }

  get createSectionModalCreateButton(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="create-section-button"]');
  }

  get channelActiveRadioButton(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[id="channel-status-input-field__status__1_label"]');
  }

  get channelHiddenBanner(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="channel-hidden-banner"]');
  }

  get videoTileList(): ChainablePromiseArray<ElementArray> {
    return $$('[data-cvent-id*="item-"]');
  }

  get videoThumbnail(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id*="thumbnail-preview-current-thumbnail"]');
  }

  get tabSwitchPopUp(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="confirmation-modal"]');
  }

  get tabSwitchPopUpLeaveButton(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="confirmation-modal-cancel-button"]');
  }

  get tabSwitchPopUpStayButton(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="confirmation-modal-confirmation-button"]');
  }

  get pageLeaveConfirmationModalLeave(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="channel-page-navigation-confirmation-modal-leave-button"]');
  }

  get pageLeavePopUpStayButton(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="channel-page-navigation-confirmation-modal-stay-button"]');
  }

  get centerInfoLocalNav(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('a[href*="/information"]');
  }
}

export default new ChannelInformation();

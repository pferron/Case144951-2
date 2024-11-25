import { ChainablePromiseElement } from 'webdriverio';
import logger from '@wdio/logger';
import BasePage from './BasePage';
import { getConfigs } from '../../configs/testConfig';

const Logger = logger('branding.page');
const configs = getConfigs();

class BrandingPage extends BasePage {
  public async openPage(hubId): Promise<void> {
    await this.open(`${configs.baseUrl}/eventsplus/${hubId}/branding`);
    await this.hasLoaded();
  }

  get pageTitle(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('h1[title="Branding"]');
  }

  get brandingThemeTab(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="branding_theme_tab"]');
  }

  get editWebsiteImage(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="theming-page-edit-form-button"]');
  }

  get cancelWebsiteImageEdit(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="theming-cancel-edit-form-button"]');
  }

  get saveWebsiteImageEdit(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="theming-page-save-edit-form-button"]');
  }

  get uploadWebsiteImage(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('button[data-cvent-id="image-upload-button"]');
  }

  get inputImageAltText(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('input[id="logoAltText"]');
  }

  get saveColors(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="save-theme-button"]');
  }

  get choosePrimaryColor(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('//div[@data-cvent-id="mood-theme-primary-color"]//form//input');
  }

  get chooseSecondaryColor(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('//div[@data-cvent-id="mood-theme-secondary-color"]//form//input');
  }

  get lightMood(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="brand-mood-light"]');
  }

  get nightMood(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="brand-mood-night"]');
  }

  get nightMoodCheck(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('//div[@id="brand-mood-night-check-icon"]');
  }

  get colorMood(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="brand-mood-color"]');
  }

  get colorMoodCheck(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('//div[@id="brand-mood-color-check-icon"]');
  }

  get safeColorMood(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="safe-mode-preview"]');
  }

  get overrideBackgroundColor(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('button[aria-label="Change background color"]');
  }

  get setBackgroundColor(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('input[id="rc-editable-input-1"]');
  }

  get headingsFontDropdown(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="headings-font-dropdown"]');
  }

  get headingsFontMenuItem0(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="headings-font-dropdown-option-1"]');
  }

  get bodyFontDropdown(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="body-font-dropdown"]');
  }

  get bodyFontMenuItem0(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="body-font-dropdown-option-1"]');
  }

  get pageLeavePopUpLeaveButton(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="events-plus-branding-page-navigation-confirmation-modal-leave-button"]');
  }

  get pageLeavePopUpStayButton(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="events-plus-branding-page-navigation-confirmation-modal-stay-button"]');
  }

  get eventsplusLocalNav(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('a[href="/eventsplus"]');
  }

  get resortDefault(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('button[aria-label="Restore default background color"]');
  }

  async hasLoaded(): Promise<void> {
    Logger.trace('Start: Branding hasLoaded()');
    await this.spinner.waitForDisplayed({ reverse: true });
    await this.customNavigationTab.waitForClickable();
    Logger.trace('Branding has successfully loaded');
  }

  get customHeaderTab(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="branding_custom_header_tab"]');
  }

  get customNavigationTab(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="branding_navigation_tab"]');
  }

  get customHeaderTabHtmlInput(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="headerHtml-textarea"]');
  }

  get customHeaderTabCssInput(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="headerCss-textarea"]');
  }

  get customHeaderTabScriptInput(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="headerJavascript-textarea"]');
  }

  get customHeaderTabPublishBtn(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('button[data-cvent-id="custom-header-publish-btn"]');
  }

  get customHeaderTabPreviewBtn(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('button[data-cvent-id="custom-header-preview-btn"]');
  }

  get customHeaderTabAlert(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="custom-header-warning-alert"]');
  }

  get customHeaderHideNavigationCard(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="hide-navigation-card"]');
  }

  get customHeaderHideNavigationToggle(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('button[aria-label="Hide Events+ navigation toggle"]');
  }

  get customHeaderHideNavigationSaveBtn(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="custom-header-hide-navigation-btn"]');
  }

  get customHeaderNavigationTable(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="events-plus-navigation-table"]');
  }

  get navigationLogoToggle(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('button[aria-label="Toggle enablement for Logo"]');
  }

  get navigationLoginToggle(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('button[aria-label="Toggle enablement for Login | Register, Profile"]');
  }

  get navigationHomePageToggle(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('button[aria-label="Toggle enablement for Home"]');
  }

  get navigationChannelsToggle(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('button[aria-label="Toggle enablement for Channels"]');
  }

  get navigationVideosToggle(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('button[aria-label="Toggle enablement for Videos"]');
  }

  get navigationAlignmentRadio(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="radio-navigation-alignment"]');
  }

  get navigationLinkHighlightStyleRadio(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="radio-navigation-link-highlight-style"]');
  }

  get navigationLinkFontSize(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="navigation-font-size-dropdown"]');
  }

  get navigationTabPublishBtn(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('button[aria-label="Publish"]');
  }

  get navigationConfirmationModal(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="confirmation-modal"]');
  }

  get navigationConfirmationModalLeaveButton(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="confirmation-modal-cancel-button"]');
  }

  get navigationConfirmationModalStayButton(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="confirmation-modal-confirmation-button"]');
  }

  get getPreviewIframe(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="custom-header-preview-iframe"]');
  }

  get getPreviewCLosePreiewBtn(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="custom-header-preview-modal-close-button"]');
  }

  get getCustomHeaderSideNavButton(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="custom-header"]').shadow$('#open-side-nav');
  }

  get getCustomHeaderPreviewNavigationLogoImage(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[id="navigation-logo-preview"]');
  }
}

export default new BrandingPage();

import { ChainablePromiseElement } from 'webdriverio';
import BasePage from './BasePage';
import { getConfigs } from '../../configs/testConfig';

const configs = getConfigs();

class LanguageManagementPage extends BasePage {
  public async openPage(hubId): Promise<void> {
    await this.open(`${configs.baseUrl}/eventsplus/${hubId}/marketing/language-management`);
    await this.hasLoaded();
  }

  get pageTitle(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="language-management-title"]');
  }

  // Side nav
  get marketingSideNav(): ChainablePromiseElement<WebdriverIO.Element> {
    return $("//span[contains(text(), 'Marketing')]");
  }

  get languageManagementSideNav(): ChainablePromiseElement<WebdriverIO.Element> {
    return $("//a[contains(text(), 'Language Management')]");
  }

  get brandingSideNav(): ChainablePromiseElement<WebdriverIO.Element> {
    return $("//a[contains(text(), 'Branding')]");
  }

  get addLanguageBtn(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="add-language-btn"]');
  }

  get localeListModal(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="add-locales-modal"]');
  }

  get localeListModalCancelBtn(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="locale-list-modal-cancel-btn"]');
  }

  get englishTranslationLink(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="language-English"]');
  }

  get englishTranslationsPageTitle(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="language-management-locale-page-title"]');
  }

  get originalTextTab(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="translation-tabletab: 0"]');
  }

  get originalTextTabTitle(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="custom-translation-tab-title"]');
  }

  get actionBtnInHeader(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="header-actions__lined-button"]');
  }

  get exportOption(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="language-management-export"]');
  }

  get importOption(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="language-management-import"]');
  }

  get importHistoryOption(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="language-management-import-history"]');
  }

  get revertOption(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="language-management-revert"]');
  }

  get columnHeaderSortBtn(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[role="columnheader"] > button');
  }

  get searchInputTextBox(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="translation-list-search-input"] > button');
  }

  get filterByTypeDropDown(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="filter-by-type-fieldset"] > button');
  }

  get defaultLanguage(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="default-language-tag"]');
  }

  get importWizard(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="import-wizard"]');
  }

  get importWizardCancelBtn(): ChainablePromiseElement<WebdriverIO.Element> {
    return $("//span[contains(text(), 'Cancel')]");
  }

  get importHistory(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="import-history-modal"]');
  }

  get confirmationModal(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="confirmation-modal"]');
  }

  get confirmationModalCancelBtn(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="confirmation-modal-cancel-button"]');
  }

  async hasLoaded(): Promise<void> {
    await this.spinner.waitForDisplayed({ reverse: true });
    await this.addLanguageBtn.waitForClickable();
  }
}

export default new LanguageManagementPage();

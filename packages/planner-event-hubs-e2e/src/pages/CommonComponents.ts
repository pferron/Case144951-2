import { ChainablePromiseElement } from 'webdriverio';
import BasePage from './BasePage';

class CommonComponents extends BasePage {
  get deleteConfirmationButton(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="confirmation-modal-confirmation-button"]');
  }

  get deleteModalHeader(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="confirmation-modal-header"]');
  }
}

export default new CommonComponents();

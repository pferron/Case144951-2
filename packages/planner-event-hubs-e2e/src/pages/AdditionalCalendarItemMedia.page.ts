import { ChainablePromiseElement } from 'webdriverio';
import BasePage from './BasePage';
import { getConfigs } from '../../configs/testConfig';

const configs = getConfigs();

class AdditionalCalendarItemMedia extends BasePage {
  public async openPage(additionalCalendarId): Promise<void> {
    await browser.url(`${configs.baseUrl}/additionalCalendarItems?additionalCalendarStub=${additionalCalendarId}`);
  }

  public viewCard(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('div[data-cvent-id="additional-calendar-item-media-card"]');
  }

  public imageIcon(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="image-icon"]');
  }

  public imageUploadButton(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="image-upload-button"]');
  }

  public imageUploadInput(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="image-upload-input"]');
  }

  public cancelButton(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="media-cancel-button"]');
  }

  public saveButton(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="media-save-button"]');
  }

  public unsupportedFileAlertBox(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="incorrect-image-size-alert"]');
  }
}

export default new AdditionalCalendarItemMedia();

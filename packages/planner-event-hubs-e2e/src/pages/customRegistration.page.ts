import { ChainablePromiseElement } from 'webdriverio';

class CustomRegistrationPage {
  get customRegistrationButton(): ChainablePromiseElement<WebdriverIO.Element> {
    return $("//a[contains(text(), 'Login Settings')]");
  }

  get accessManagementButton(): ChainablePromiseElement<WebdriverIO.Element> {
    return $("//span[contains(text(), 'Access Management')]");
  }

  get customRegistrationPreviewButton(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="Background-preview"]');
  }

  get customRegistrationCloseButton(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="preview-modal-cross-button"]');
  }

  get customRegistrationSaveButton(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="background-preview-card-container-save-button"]');
  }

  get backgroundImageDeleteButton(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="image-delete-button"]');
  }

  get backgroundImageHideLogoRadioButton(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('label[for="Background-Preview-Logo"]');
  }

  get backgroundImage(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="uploaded-image"]');
  }

  get backgroundImageIcon(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="image-icon"]');
  }

  get backgroundLogoIcon(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="registration-form-logo"]');
  }

  get customRegistrationTitle(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('h1[title="Custom Registration"]');
  }

  get previewLoginSignUpCard(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="registration-form-card-container"]');
  }

  get previewModalDefaultColorTheme(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="background-preview-modal-theming"]');
  }

  get backgroundImageRadioButton(): ChainablePromiseElement<WebdriverIO.Element> {
    const radioGroup = $('#Background-Style');
    return radioGroup.$$('div')[1].$('label');
  }

  get saveButton(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="header-actions__save"]');
  }
}

export default new CustomRegistrationPage();

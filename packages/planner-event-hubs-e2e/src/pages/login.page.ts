import { ChainablePromiseElement } from 'webdriverio';

class LoginPage {
  get accountField(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('input[name="account"]');
  }

  get usernameField(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('input[name="username"]');
  }

  get passwordField(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('input[name="password"]');
  }

  get loginButton(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('input[name="btnLogin"]');
  }

  get loggedInText(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[id="lbllogintime"]');
  }

  get continueButton(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('input[name="btnLogin"]');
  }

  get reportPopupText(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('div.hero').$('h1');
  }

  get popupContinueButton(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('input.cv-continue-button');
  }

  get featurePopupButton(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('a[class="l-btn l-btn-primary t-captalize"]');
  }

  get featurePopupText(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('div.t-color-blue').$('h1=Next Generation of Event Feedback');
  }

  get featureFrame(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[id="frame"]');
  }
}
export default new LoginPage();

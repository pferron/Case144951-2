import { ChainablePromiseElement } from 'webdriverio';
import { loginUsingCookie } from '../utils/authUtils';

export default class BasePage {
  public async open(path: string): Promise<void> {
    await browser.url(path);
  }

  public get getTitle(): Promise<string> {
    return browser.getTitle();
  }

  public async getUrl(): Promise<string> {
    return browser.getUrl();
  }

  public async switchWindow(idx: number): Promise<void> {
    await browser.switchToWindow((await browser.getWindowHandles())[idx]);
  }

  public async loginPlannerSide(): Promise<void> {
    await loginUsingCookie();
  }

  public async waitForElementLoad(element: WebdriverIO.Element, timeout?: number): Promise<void> {
    await element.waitForDisplayed({ timeout: timeout || 30000 });
  }

  public async waitForElementEnabled(element: WebdriverIO.Element, timeout?: number): Promise<void> {
    await element.waitForEnabled({ timeout: timeout || 15000 });
  }

  public get spinner(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="page-loading-spinner"]');
  }
}

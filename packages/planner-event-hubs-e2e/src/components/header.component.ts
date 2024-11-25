import { ChainablePromiseElement } from 'webdriverio';

class Header {
  get navigation(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="video-library-navigation"]');
  }

  get cventLogo(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="video-library-navigation-logo"]');
  }

  get searchButton(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="video-library-navigation-search"]');
  }

  get searchInput(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="video-library-navigation-search__input"]');
  }

  get recentItemsButton(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="video-library-navigation-recent-items__toggle-actions"]');
  }

  get recentItemsFlyout(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="video-library-navigation-recent-items"]');
  }

  get helpAndSupportButton(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="video-library-navigation-help-menu__toggle-actions"]');
  }

  get helpAndSupportFlyout(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="video-library-navigation-help-menu"]');
  }

  get userUtilitiesButton(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="video-library-navigation-user-utility__toggle-actions"]');
  }

  get userUtilitiesFlyout(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="video-library-navigation-user-utility"]');
  }

  get allEventsButton(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('li.fdn-nav-global-list-item').$('a=All Events');
  }

  get logoutButton(): ChainablePromiseElement<WebdriverIO.Element> {
    return this.userUtilitiesButton.$('#cvt-carina-logout-link');
  }

  /* App Switcher dropdown */
  get displayNavButton(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="nav-switcher-parent"] > a');
  }

  get contactsLink(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="nav-switcher-app-contacts"] > a');
  }

  get eventsLink(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="nav-switcher-app-events"] > a');
  }

  get adminLink(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="nav-switcher-app-account"] > a');
  }
}

export default new Header();

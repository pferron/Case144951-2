import { ChainablePromiseElement } from 'webdriverio';
import BasePage from './BasePage';
import { getConfigs } from '../../configs/testConfig';

const configs = getConfigs();

class FeaturesPage extends BasePage {
  public async openPage(hubId): Promise<void> {
    await this.open(`${configs.baseUrl}/eventsplus/${hubId}/features`);
    await this.hasLoaded();
  }

  get featuresButton(): ChainablePromiseElement<WebdriverIO.Element> {
    return $("//a[contains(text(), 'Features')]");
  }

  get featuresTitle(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('h1[title="Features"]');
  }

  get memberProfileCard(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="member-feature-card"]');
  }

  get memberProfileSetupButton(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('button[data-cvent-id="member-feature-card-setup"]');
  }

  async saveMemberProfile(element): Promise<WebdriverIO.Element> {
    return element.$('button[data-cvent-id="member-feature-card-switch"]');
  }

  get memberProfileTitle(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('h1[title="Member Profile"]');
  }

  get upcomingEventCard(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="upcoming-events-feature-card"]');
  }

  async upcomingEventCardSetupButton(element): Promise<WebdriverIO.Element> {
    return element.$('button[data-cvent-id="upcoming-events-feature-card-setup"]');
  }

  async saveUpcomingEventCard(element): Promise<WebdriverIO.Element> {
    return element.$('button[data-cvent-id="upcoming-events-feature-card-switch"]');
  }

  get upcomingEventsTitle(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('h1[title="Upcoming Events"]');
  }

  async hasLoaded(): Promise<void> {
    await this.spinner.waitForDisplayed({ reverse: true });
    await this.memberProfileSetupButton.waitForClickable();
  }
}

export default new FeaturesPage();

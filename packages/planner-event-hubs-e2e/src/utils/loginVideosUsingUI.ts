import logger from '@wdio/logger';
import CoreEventsPage from '../pages/events.page';
import CoreLoginPage from '../pages/login.page';
import { waitForClickableAndClick } from './waitHelpers';

import { getConfigs } from '../../configs/testConfig';

const Logger = logger('loginVideosUsingUI');
const configs = getConfigs();

export const loginVideosUsingUI = async (): Promise<void> => {
  Logger.trace('Start: loginVideosUsingUI()');

  await browser.url(String(process.env.CORE_URL));

  expect(await CoreLoginPage.accountField).toBeDisplayed();

  await CoreLoginPage.accountField.setValue(String(process.env.CORE_ACCOUNT));
  await CoreLoginPage.usernameField.setValue(String(process.env.CORE_USER));
  await CoreLoginPage.passwordField.setValue(String(process.env.CORE_PASSWORD));

  await waitForClickableAndClick({ element: CoreLoginPage.loginButton });
  const currentlyLoggedIn = $('#btnLogin');
  if (await currentlyLoggedIn.isDisplayed()) {
    await currentlyLoggedIn.click();
  }
  await browser.pause(configs.delay.uiBackgroundLoad);
  await CoreEventsPage.hasLoaded();
  Logger.trace('End: loginVideosUsingUI()');
};

/**
 * For local development only. The persona param should match the text exactly as on the localhost login page.
 * ex. loginVideosUsingPersona('Vroom - S606');
 * @param persona
 */
export const loginVideosUsingPersona = async (persona: string): Promise<void> => {
  await browser.url(String(`${process.env.APP_BASE_URL}/login`));
  const personaDropdown = await $('#personaDropdown');
  await personaDropdown.click();
  const listItems = await $$('option');
  const vroomIndex = await (async (): Promise<number> => {
    let i = 0;
    while (i < listItems.length) {
      /* eslint-disable no-await-in-loop */
      const text = await listItems[i].getText();
      if (text === persona) {
        break;
      }
      i++;
    }
    return i;
  })();

  await listItems[vroomIndex].click();
  await browser.pause(configs.delay.uiBackgroundLoad);
  const submitButton = browser.$('//button[@type="button" and text()="Submit"]');
  await submitButton.click();
  await browser.pause(configs.delay.uiBackgroundLoad);
};

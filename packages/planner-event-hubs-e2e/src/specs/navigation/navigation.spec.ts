import videoMainPage from '../../pages/videoMain.page';
import headerComponent from '../../components/header.component';
import { loginAsPlanner } from '../../utils/authUtils';
import { getAxeViolationIds } from '../../utils/axe/getViolations';
import { addGlobalViolations } from '../../utils/axe/addGlobalViolations';
import { VIOLATION_TYPE } from '../../utils/axe/ruleIds';

// RED - Change this to new navigation
describe('Video library navigation', () => {
  it('logs in Videos using core UI', async () => {
    await loginAsPlanner();
    await videoMainPage.openPage();
    await expect(videoMainPage.pageTitle).toBeDisplayed();
  });

  it('Displays the navigation', async () => {
    await expect(headerComponent.navigation).toBeDisplayed();
  });

  it('Displays the logo', async () => {
    await expect(headerComponent.cventLogo).toBeDisplayed();
  });

  it('Displays the help menu button', async () => {
    await expect(headerComponent.helpAndSupportButton).toBeDisplayed();
  });

  it('Displays the userUtilities button', async () => {
    await expect(headerComponent.userUtilitiesButton).toBeDisplayed();
  });

  it('Displays the recentItems button', async () => {
    await expect(headerComponent.recentItemsButton).toBeDisplayed();
  });

  it('Displays the search button', async () => {
    await expect(headerComponent.searchButton).toBeDisplayed();
  });

  it('Toggles the helpMenu flyout on click', async () => {
    const button = await headerComponent.helpAndSupportButton;
    expect(await button.getAttribute('aria-expanded')).toEqual('false');
    await button.click();
    expect(await button.getAttribute('aria-expanded')).toEqual('true');
    await expect(headerComponent.helpAndSupportFlyout).toBeDisplayed();
    await button.click();
    expect(await button.getAttribute('aria-expanded')).toEqual('false');
    await expect(headerComponent.helpAndSupportFlyout).not.toBeDisplayed();
  });

  it('Toggles the userUtilities flyout on click', async () => {
    const button = await headerComponent.userUtilitiesButton;
    expect(await button.getAttribute('aria-expanded')).toEqual('false');
    await button.click();
    expect(await button.getAttribute('aria-expanded')).toEqual('true');
    await expect(headerComponent.userUtilitiesFlyout).toBeDisplayed();
    await button.click();
    expect(await button.getAttribute('aria-expanded')).toEqual('false');
    await expect(headerComponent.userUtilitiesFlyout).not.toBeDisplayed();
  });

  it('Toggles the recentItems flyout on click', async () => {
    const button = await headerComponent.recentItemsButton;
    expect(await button.getAttribute('aria-expanded')).toEqual('false');
    await button.click();
    expect(await button.getAttribute('aria-expanded')).toEqual('true');
    await expect(headerComponent.recentItemsFlyout).toBeDisplayed();
    await button.click();
    expect(await button.getAttribute('aria-expanded')).toEqual('false');
    await expect(headerComponent.recentItemsFlyout).not.toBeDisplayed();
  });

  it('Opens search input field on click', async () => {
    const button = await headerComponent.searchButton;
    expect(await button.getAttribute('aria-expanded')).toEqual('false');
    await button.click();
    expect(await button.getAttribute('aria-expanded')).toEqual('true');
    await expect(headerComponent.searchInput).toBeDisplayed();
  });

  // RED
  // eslint-disable-next-line jest/no-disabled-tests
  xit('Events+ Hubs page has no accessibility issues', async () => {
    const desktopViolations = [
      VIOLATION_TYPE.LANDMARK_ONE_MAIN, // HUB-156911
      VIOLATION_TYPE.REGION // HUB-156911
    ];
    const knownViolations = await addGlobalViolations(desktopViolations);
    const violationIds = await getAxeViolationIds('Events+ Hubs', knownViolations);

    await expect(violationIds).toEqual(knownViolations);
  });
});

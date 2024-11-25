import logger from '@wdio/logger';
import FeaturesPage from '../../pages/features.page';
import { createHub, deleteHub } from '../../apis/graphql/hub';
import { loginAsPlanner } from '../../utils/authUtils';
import { waitForClickableAndClick } from '../../utils/waitHelpers';
import { getAxeViolationIds } from '../../utils/axe/getViolations';
import { addGlobalViolations } from '../../utils/axe/addGlobalViolations';
import { VIOLATION_TYPE } from '../../utils/axe/ruleIds';

const Logger = logger('features');

let hubWithoutChannels;
const dataSetup = async (): Promise<void> => {
  [hubWithoutChannels] = await Promise.all([createHub()]);
};

describe('Features page', () => {
  let memberProfileCard;

  it('logs in Videos using core UI, creates a video center via GraphQL, opens the page Features', async () => {
    await loginAsPlanner();
    await dataSetup();

    await FeaturesPage.openPage(hubWithoutChannels);
    expect(await FeaturesPage.memberProfileSetupButton).toBeDisplayed();
    expect(await FeaturesPage.featuresTitle).toBeDisplayed();

    memberProfileCard = await FeaturesPage.memberProfileCard;
    expect(memberProfileCard).toBeDisplayed();

    // Member profile card is enabled by default
    expect(await FeaturesPage.memberProfileSetupButton).toBeClickable();
  });

  it('Member profile card does not have a enable/disable button', async () => {
    Logger.trace('On Member profile card: toggle should not be displayed');
    expect(await FeaturesPage.saveMemberProfile(memberProfileCard)).not.toBeDisplayed();
    expect(await FeaturesPage.memberProfileSetupButton).toBeClickable();
  });

  it('Member profile card has a setup button', async () => {
    expect(await FeaturesPage.memberProfileSetupButton).toBeClickable();
  });

  it('Setup member profile, deletes the video center via GraphQL', async () => {
    Logger.trace('Navigate to Member profile page');
    await waitForClickableAndClick({ element: FeaturesPage.memberProfileSetupButton });
    expect(await FeaturesPage.memberProfileTitle).toBeDisplayed();

    await Promise.all([deleteHub(hubWithoutChannels)]);
  });

  // RED
  // eslint-disable-next-line jest/no-disabled-tests
  xit('hub features page has no accessibility issues', async () => {
    const desktopViolations = [
      VIOLATION_TYPE.LANDMARK_ONE_MAIN, // HUB-156911
      VIOLATION_TYPE.REGION // HUB-156911
    ];
    const knownViolations = await addGlobalViolations(desktopViolations);
    const violationIds = await getAxeViolationIds('hub features', knownViolations);

    await expect(violationIds).toEqual(knownViolations);
  });
});

import FeaturesPage from '../../pages/features.page';
import MemberProfilePage from '../../pages/memberProfile.page';
import { createHub, deleteHub } from '../../apis/graphql/hub';
import { loginAsPlanner } from '../../utils/authUtils';
import { waitForClickableAndClick } from '../../utils/waitHelpers';
import { getAxeViolationIds } from '../../utils/axe/getViolations';
import { addGlobalViolations } from '../../utils/axe/addGlobalViolations';
import { VIOLATION_TYPE } from '../../utils/axe/ruleIds';
import { isProductionEnv } from '../../utils/commonUtils';
import { readAppFeatures } from '../../apis/services/appFeaturesClient';

const { videoCenterInformationFeature = false } = readAppFeatures();

let hubWithoutChannels;
const dataSetup = async (): Promise<void> => {
  [hubWithoutChannels] = await Promise.all([createHub()]);
};

describe('Member Profile page', () => {
  it('logs in Videos using core UI, creates a video center via GraphQL, opens the page Features', async () => {
    await loginAsPlanner();
    await dataSetup();

    await FeaturesPage.openPage(hubWithoutChannels);
    expect(await FeaturesPage.memberProfileSetupButton).toBeDisplayed();
    expect(await FeaturesPage.featuresTitle).toBeDisplayed();
  });

  it('navigates to member profile page', async () => {
    await waitForClickableAndClick({ element: FeaturesPage.memberProfileSetupButton });
    expect(await FeaturesPage.memberProfileTitle).toBeDisplayed();
  });

  it('Renders member profile fields successfully', async () => {
    const element = await MemberProfilePage.memberProfileFieldsContainer;
    await element.scrollIntoView();
    expect(await MemberProfilePage.memberProfileNameCard).toBeDisplayed();
    expect(await MemberProfilePage.memberProfileTitleCard).toBeDisplayed();
    expect(await MemberProfilePage.memberProfileCompanyCard).toBeDisplayed();
    expect(await MemberProfilePage.memberProfileSocialMediaLinksCard).toBeDisplayed();
  });

  if (videoCenterInformationFeature && !isProductionEnv(process.env.ENV)) {
    it('Member profile fields are editable', async () => {
      await (await MemberProfilePage.memberProfileNameDontAllow).click();
      await (await MemberProfilePage.memberProfileJobTitleDontAllow).click();
      await (await MemberProfilePage.memberProfileCompanyDontAllow).click();
      await (await MemberProfilePage.memberProfileSocialMediaLinksDontAllow).click();
      await (await MemberProfilePage.saveFeatureMemberProfileFields).click();
      await MemberProfilePage.memberProfileNameDontAllow.waitForExist();
      expect(await await MemberProfilePage.memberProfileNameDontAllow).toBeChecked();
    });

    it('Member profile fields are not visible - deletes the video center via GraphQL', async () => {
      await (await MemberProfilePage.memberProfileJobTitleSwitch).click();
      await (await MemberProfilePage.memberProfileCompanySwitch).click();
      await (await MemberProfilePage.memberProfileSocialMediaLinksSwitch).click();
      await (await MemberProfilePage.saveFeatureMemberProfileFields).click();

      expect(await MemberProfilePage.memberProfileJobCardActionContainer).not.toBeDisplayed();
      expect(await MemberProfilePage.memberProfileCompanyActionContainer).not.toBeDisplayed();
      expect(await MemberProfilePage.memberProfileSocialMediaActionContainer).not.toBeDisplayed();

      await Promise.all([deleteHub(hubWithoutChannels)]);
    });
  } else {
    it('Member profile fields are not editable', async () => {
      await (await MemberProfilePage.memberProfileFieldsEditButton).click();
      await MemberProfilePage.memberProfileNameDontAllow.waitForExist();
      await (await MemberProfilePage.memberProfileNameDontAllow).click();
      await (await MemberProfilePage.memberProfileJobTitleDontAllow).click();
      await (await MemberProfilePage.memberProfileCompanyDontAllow).click();
      await (await MemberProfilePage.memberProfileSocialMediaLinksDontAllow).click();
      await (await MemberProfilePage.saveMemberProfileFields).click();
      await MemberProfilePage.memberProfileFieldValues.waitForExist();
      expect(await (await MemberProfilePage.memberProfileFieldValues).getText()).toEqual('Don’t allow');
    });

    it('Member profile fields are not visible, deletes the video center via GraphQL', async () => {
      await (await MemberProfilePage.memberProfileFieldsEditButton).click();
      await MemberProfilePage.memberProfileJobTitleSwitch.waitForExist();
      await (await MemberProfilePage.memberProfileJobTitleSwitch).click();
      await (await MemberProfilePage.memberProfileCompanySwitch).click();
      await (await MemberProfilePage.memberProfileSocialMediaLinksSwitch).click();
      await (await MemberProfilePage.saveMemberProfileFields).click();

      expect(await MemberProfilePage.memberProfileJobCardActionContainer).not.toBeDisplayed();
      expect(await MemberProfilePage.memberProfileCompanyActionContainer).not.toBeDisplayed();
      expect(await MemberProfilePage.memberProfileSocialMediaActionContainer).not.toBeDisplayed();

      await Promise.all([deleteHub(hubWithoutChannels)]);
    });
  }

  // RED
  // eslint-disable-next-line jest/no-disabled-tests
  xit('hub member profile page has no accessibility issues', async () => {
    const desktopViolations = [
      VIOLATION_TYPE.HEADING_ORDER, // HUB-156911
      VIOLATION_TYPE.LANDMARK_ONE_MAIN, // HUB-156911
      VIOLATION_TYPE.REGION // HUB-156911
    ];
    const knownViolations = await addGlobalViolations(desktopViolations);
    const violationIds = await getAxeViolationIds('hub member profile', knownViolations);

    await expect(violationIds).toEqual(knownViolations);
  });
});

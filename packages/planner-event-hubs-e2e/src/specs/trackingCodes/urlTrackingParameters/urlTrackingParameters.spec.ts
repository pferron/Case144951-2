import { createHub, deleteHub } from '../../../apis/graphql/hub';
import TrackingCodesPage from '../../../pages/trackingCodes.page';
import VideoCenterInformationPage from '../../../pages/videoCenterInformation.page';
import { loginAsPlanner } from '../../../utils/authUtils';
import { waitForClickableAndClick } from '../../../utils/waitHelpers';
import { getAxeViolationIds } from '../../../utils/axe/getViolations';
import { addGlobalViolations } from '../../../utils/axe/addGlobalViolations';
import { VIOLATION_TYPE } from '../../../utils/axe/ruleIds';
import languageManagementPage from '../../../pages/languageManagement.page';
import { skipDescribeIfProdEnvironment } from '../../../utils/commonUtils';
import { readAppFeatures } from '../../../apis/services/appFeaturesClient';

const { videoCenterInformationFeature = false } = readAppFeatures();

let hubWithoutChannels;
const dataSetup = async (): Promise<void> => {
  [hubWithoutChannels] = await Promise.all([createHub()]);
};

skipDescribeIfProdEnvironment()('Url Tracking parameters', () => {
  it('Should be able to login to newly created events+ hub', async () => {
    await loginAsPlanner();
    await dataSetup();
    await VideoCenterInformationPage.openPage(hubWithoutChannels);
    expect(await VideoCenterInformationPage.pageTitle).toBeDisplayed();
  });

  it('Should be able to navigate to Tracking codes page', async () => {
    await languageManagementPage.marketingSideNav.waitForExist();
    await waitForClickableAndClick({ element: languageManagementPage.marketingSideNav });
    await waitForClickableAndClick({ element: TrackingCodesPage.trackingCodesButton });
    expect(await TrackingCodesPage.trackingCodesTitle).toBeDisplayed();
  });

  (videoCenterInformationFeature ? xit : it)(
    'Should show button for add prameters when clicked on edit pencil',
    async () => {
      await (await TrackingCodesPage.editPencilButtonUTP).click();
      expect(await TrackingCodesPage.addParametersButtonUTP).toBeDisplayed();
    }
  );

  it('Should show radio options to handle duplicate key names', async () => {
    expect(await TrackingCodesPage.radioOptionsToHandleDuplicateKeysUTP).toBeDisplayed();
  });

  it('Should be able to add key value pair in add parameter modal, delete the test hub', async () => {
    await waitForClickableAndClick({ element: TrackingCodesPage.addParametersButtonUTP });
    await (await TrackingCodesPage.addParametersKeyInputUTP).setValue('country');
    await (await TrackingCodesPage.addParametersValueInputUTP).setValue('USA');
    await waitForClickableAndClick({ element: TrackingCodesPage.addParametersAddBtnUTP });
    const elementText = await (await TrackingCodesPage.parametersTableFirstRow).getText();
    expect(elementText).toContain('country');
    expect(elementText).toContain('USA');
    await Promise.all([deleteHub(hubWithoutChannels)]);
  });

  // RED
  // eslint-disable-next-line jest/no-disabled-tests
  xit('hub tracking codes page has no accessibility issues', async () => {
    const desktopViolations = [
      VIOLATION_TYPE.LANDMARK_ONE_MAIN, // HUB-156911
      VIOLATION_TYPE.REGION // HUB-156911
    ];
    const knownViolations = await addGlobalViolations(desktopViolations);
    const violationIds = await getAxeViolationIds('hub tracking codes', knownViolations);

    await expect(violationIds).toEqual(knownViolations);
  });
});

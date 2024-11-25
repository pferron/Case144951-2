import VideoCenterPage from '../../pages/videoCenter.page';
import VideoCenterInformationPage from '../../pages/videoCenterInformation.page';
import {
  createVideoCenter,
  deleteVideoCenter,
  generateString,
  generateVideoCenterData
} from '../../utils/generateData';
import { loginAsPlanner } from '../../utils/authUtils';
import { getAxeViolationIds } from '../../utils/axe/getViolations';
import { addGlobalViolations } from '../../utils/axe/addGlobalViolations';
import { VIOLATION_TYPE } from '../../utils/axe/ruleIds';
import { waitForClickableAndClick, waitForDisplayed } from '../../utils/waitHelpers';
import { skipItIfProdEnvironment } from '../../utils/commonUtils';
import { readAppFeatures } from '../../apis/services/appFeaturesClient';

const { videoCenterInformationFeature = false, hubOverviewFeature = false } = readAppFeatures();

describe('Create a video center then delete it', () => {
  let videoCenterData;
  let vcName;

  it('logs in Videos using core UI', async () => {
    await loginAsPlanner();
    await VideoCenterPage.openPage();
    await expect(VideoCenterPage.pageTitle).toBeDisplayed();
  });

  it('creates a video center', async () => {
    videoCenterData = generateVideoCenterData();
    vcName = videoCenterData.centerName;
    await createVideoCenter(videoCenterData);
    if (hubOverviewFeature) {
      await VideoCenterInformationPage.videoCenterInformation.click();
    }
    await expect(VideoCenterInformationPage.pageTitle).toBeDisplayed();
  });

  if (videoCenterInformationFeature) {
    skipItIfProdEnvironment()('verifies the fields in the video center basic information page', async () => {
      expect(await VideoCenterInformationPage.vcNameInput.getValue()).toEqual(vcName);
      expect(await VideoCenterInformationPage.vcOwnerFirstNameInput.getValue()).toEqual(videoCenterData.ownerFirstName);
      expect(await VideoCenterInformationPage.vcOwnerLastNameInput.getValue()).toEqual(videoCenterData.ownerLastName);
      expect(await VideoCenterInformationPage.vcOwnerEmailInput.getValue()).toEqual(videoCenterData.ownerEmail);
    });

    skipItIfProdEnvironment()(
      'verifies the weblink card in the video center information page and save some custom domain',
      async () => {
        await waitForDisplayed({ element: VideoCenterInformationPage.vcWeblink });
        await (await VideoCenterInformationPage.vcWeblink).scrollIntoView();
        expect(VideoCenterInformationPage.vcWeblink).toHaveTextContaining('cvent.me');
        expect(VideoCenterInformationPage.vcCustomDomainDropdownButton).toBeDisplayed();
        await waitForClickableAndClick({ element: VideoCenterInformationPage.vcCustomDomainDropdownButton });
        expect(VideoCenterInformationPage.vcCustomDomainOption0).toBeDisplayed();
        await waitForClickableAndClick({ element: VideoCenterInformationPage.vcCustomDomainOption0 });
        const testTrailingName = generateString(5);
        await (await VideoCenterInformationPage.vcWeblinkTrailingNameInput).setValue(testTrailingName);
        expect(VideoCenterInformationPage.vcHubInformationSaveButton).toBeClickable();
        await VideoCenterInformationPage.vcHubInformationSaveButton.click();
        expect(VideoCenterInformationPage.vcWeblink).toHaveTextContaining(testTrailingName);
      }
    );

    // skipItIfProdEnvironment()(
    // RED
    // eslint-disable-next-line jest/no-disabled-tests
    xit('verifies the weblink card in the video center information page and remove custom domain', async () => {
      expect(VideoCenterInformationPage.vcHubInformationSaveButton).toBeDisplayed();
      expect(VideoCenterInformationPage.vcCustomDomainDropdownButton).toBeDisplayed();
      await waitForClickableAndClick({ element: VideoCenterInformationPage.vcCustomDomainDropdownButton });
      expect(VideoCenterInformationPage.vcCustomDomainOption0).toBeDisplayed();
      await waitForClickableAndClick({ element: VideoCenterInformationPage.vcCustomDomainOption1 });
      await waitForClickableAndClick({ element: VideoCenterInformationPage.vcHubInformationSaveButton });
      expect(VideoCenterInformationPage.vcWeblink).toHaveTextContaining('cvent.me');
    });
  } else {
    it('verifies the fields in the video center information page', async () => {
      await expect(VideoCenterInformationPage.pageTitle).toBeDisplayed();

      await expect(VideoCenterInformationPage.vcName).toHaveTextContaining(vcName);
      await expect(VideoCenterInformationPage.vcOwnerFirstName).toHaveTextContaining(videoCenterData.ownerFirstName);
      await expect(VideoCenterInformationPage.vcOwnerLastName).toHaveTextContaining(videoCenterData.ownerLastName);
      await expect(VideoCenterInformationPage.vcOwnerEmail).toHaveTextContaining(videoCenterData.ownerEmail);
    });

    skipItIfProdEnvironment()(
      'verifies the weblink card in the video center information page and save some custom domain',
      async () => {
        await waitForDisplayed({ element: VideoCenterInformationPage.vcWeblink });
        expect(VideoCenterInformationPage.vcWeblink).toHaveTextContaining('cvent.me');
        expect(VideoCenterInformationPage.vcWeblinkEditButton).toBeDisplayed();
        await waitForClickableAndClick({ element: VideoCenterInformationPage.vcWeblinkEditButton });
        expect(VideoCenterInformationPage.vcWeblinkEditCancelButton).toBeDisplayed();
        expect(VideoCenterInformationPage.vcWeblinkEditSaveButton).toBeDisplayed();
        expect(VideoCenterInformationPage.vcCustomDomainDropdownButton).toBeDisplayed();
        await waitForClickableAndClick({ element: VideoCenterInformationPage.vcCustomDomainDropdownButton });
        expect(VideoCenterInformationPage.vcCustomDomainOption0).toBeDisplayed();
        await waitForClickableAndClick({ element: VideoCenterInformationPage.vcCustomDomainOption0 });
        const testTrailingName = generateString(5);
        await (await VideoCenterInformationPage.vcWeblinkTrailingNameInput).setValue(testTrailingName);
        expect(VideoCenterInformationPage.vcWeblinkEditSaveButton).toBeClickable();
        await VideoCenterInformationPage.vcWeblinkEditSaveButton.click();
        expect(VideoCenterInformationPage.vcWeblink).toHaveTextContaining(testTrailingName);
      }
    );

    // skipItIfProdEnvironment()(
    // RED
    // eslint-disable-next-line jest/no-disabled-tests,jest/no-identical-title
    xit('verifies the weblink card in the video center information page and remove custom domain', async () => {
      expect(VideoCenterInformationPage.vcWeblinkEditButton).toBeDisplayed();
      await waitForClickableAndClick({ element: VideoCenterInformationPage.vcWeblinkEditButton });
      expect(VideoCenterInformationPage.vcWeblinkEditCancelButton).toBeDisplayed();
      expect(VideoCenterInformationPage.vcWeblinkEditSaveButton).toBeDisplayed();
      expect(VideoCenterInformationPage.vcCustomDomainDropdownButton).toBeDisplayed();
      await VideoCenterInformationPage.vcCustomDomainDropdownButton.scrollIntoView();
      await waitForClickableAndClick({ element: VideoCenterInformationPage.vcCustomDomainDropdownButton });
      expect(VideoCenterInformationPage.vcCustomDomainOption0).toBeDisplayed();
      await waitForClickableAndClick({ element: VideoCenterInformationPage.vcCustomDomainOption1 });
      await waitForClickableAndClick({ element: VideoCenterInformationPage.vcWeblinkEditSaveButton });
      expect(VideoCenterInformationPage.vcWeblink).toHaveTextContaining('cvent.me');
    });
  }

  // RED
  // eslint-disable-next-line jest/no-disabled-tests
  xit('deletes the newly created video center', async () => {
    await VideoCenterPage.openPage();
    await deleteVideoCenter(vcName);
    expect(await VideoCenterPage.vcIsShown(vcName)).toEqual(false);
  });

  // RED
  // eslint-disable-next-line jest/no-disabled-tests
  xit('hub information page has no accessibility issues', async () => {
    const desktopViolations = [
      VIOLATION_TYPE.LANDMARK_ONE_MAIN, // HUB-156911
      VIOLATION_TYPE.REGION // HUB-156911
    ];
    const knownViolations = await addGlobalViolations(desktopViolations);
    const violationIds = await getAxeViolationIds('hub information', knownViolations);

    await expect(violationIds).toEqual(knownViolations);
  });
});

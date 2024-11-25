import FeaturesPage from '../../pages/features.page';
import upcomingEventsPage from '../../pages/upcomingEvents.page';
import { createHub, deleteHub } from '../../apis/graphql/hub';
import { loginAsPlanner } from '../../utils/authUtils';
import TrackingCodesPage from '../../pages/trackingCodes.page';
import { waitForClickableAndClick } from '../../utils/waitHelpers';

let hubWithoutChannels;
const dataSetup = async (): Promise<void> => {
  [hubWithoutChannels] = await Promise.all([createHub()]);
};

// https://jira.cvent.com/browse/HUB-129515
describe('Set up upcoming events with calendar', () => {
  let upcomingEventCard: WebdriverIO.Element;

  it('logs in Videos using core UI, creates a video center via GraphQL, opens the page Features', async () => {
    await loginAsPlanner();
    await dataSetup();

    await FeaturesPage.openPage(hubWithoutChannels);
    expect(await FeaturesPage.memberProfileSetupButton).toBeDisplayed();
    expect(await FeaturesPage.featuresTitle).toBeDisplayed();

    upcomingEventCard = await FeaturesPage.upcomingEventCard;
    expect(upcomingEventCard).toBeDisplayed();
    expect(await FeaturesPage.upcomingEventCardSetupButton(upcomingEventCard)).not.toBeDisplayed();
  });

  it('enables upcoming events card', async () => {
    await waitForClickableAndClick({ element: FeaturesPage.saveUpcomingEventCard(upcomingEventCard) });

    expect(await FeaturesPage.upcomingEventCardSetupButton(upcomingEventCard)).toBeDisplayed();
  });

  it('sets up upcoming events', async () => {
    await waitForClickableAndClick({ element: FeaturesPage.upcomingEventCardSetupButton(upcomingEventCard) });
    expect(await FeaturesPage.upcomingEventsTitle).toBeDisplayed();
  });

  it('edits and selects calender for upcoming events, deletes the video center via GraphQL', async () => {
    await waitForClickableAndClick({ element: upcomingEventsPage.editUpcomingevent });
    await waitForClickableAndClick({ element: upcomingEventsPage.upcomingEventCalendarDropdown });
    await upcomingEventsPage.upcomingEventChooseCalendar.waitForExist();
    expect(await upcomingEventsPage.upcomingEventChooseCalendar).toBeDisplayed();
    await upcomingEventsPage.upcomingEventChooseCalendar.click();
    await upcomingEventsPage.saveUpcomingevent.click();
    expect(await upcomingEventsPage.CancelUpcomingeventIcon).not.toBeDisplayed();

    await Promise.all([deleteHub(hubWithoutChannels)]);
  });

  // Red
  /* eslint-disable-next-line */
  xit(
    'show tracking parameters card, should be able to click on the link to navigate to tracking codes page to setup' +
      ' parameters',
    async () => {
      expect(await upcomingEventsPage.trackingParametersTitle).toBeDisplayed();
      expect(await upcomingEventsPage.addTrackingParamters).toBeDisplayed();
      await upcomingEventsPage.addTrackingParamters.click();
      await TrackingCodesPage.trackingCodesTitle.waitForExist();
      expect(TrackingCodesPage.trackingCodesTitle).toBeDisplayed();
    }
  );
});

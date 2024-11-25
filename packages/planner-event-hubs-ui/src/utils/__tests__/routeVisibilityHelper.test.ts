import { isRouteVisible, Mapping, mappingType } from '@utils/routeVisibilityHelper';

describe('Check Experiment Tests', () => {
  const videoHubRoute = '/eventsplus';
  const videoHubRouteExtended1ResolvedURL = '/eventsplus/0624f8ef-e9e1-4304-bbf5-63827e61a322';
  const videoHubRouteExtended2 = '/eventsplus/[videoHubId]/channel';
  const videoHubRouteExtended2ResolvedURL = '/eventsplus/0624f8ef-e9e1-4304-bbf5-63827e61a322/channel';
  const privacyRouteMapping = '/eventsplus/[videoHubId]/privacy';
  const privacyRoute = '/eventsplus/0624f8ef-e9e1-4304-bbf5-63827e61a322/privacy';

  const featuresRoute = '/eventsplus/0624f8ef-e9e1-4304-bbf5-63827e61a322/features';
  const memberProfileRoute = '/eventsplus/0624f8ef-e9e1-4304-bbf5-63827e61a322/features/member-profile';
  const membersPageRoute = '/eventsplus/0624f8ef-e9e1-4304-bbf5-63827e61a322/members/members';
  const memberListRoute = '/eventsplus/0624f8ef-e9e1-4304-bbf5-63827e61a322/members/members/testContStub';
  const hubOverViewPageRoute = '/eventsplus/0624f8ef-e9e1-4304-bbf5-63827e61a322/hub-overview';
  const videoHighlightsPageRoute = '/eventsplus/0624f8ef-e9e1-4304-bbf5-63827e61a322/video-engagement';
  const experiments = { test: 0, test2: 1 };
  const withoutVideoHubExperiments = { test2: 1 };
  const privacyFeatureOff = { test2: 1, privacyFeature: 0 };
  const privacyFeatureOn = { test: 1, privacyFeature: 1 };
  const featuresPageOff = { test2: 1, profileFeature: 0 };
  const featuresPageOn = { test: 1, profileFeature: 1 };
  const memberListPageOff = { test2: 1, memberListFeature: 0 };
  const memberListPageOn = { test: 1, memberListFeature: 1 };
  const withNullVariantForVideoHubExperiments = { test2: null };
  const hubOverViewPageOff = { test2: 1, hubOverviewFeature: 0 };
  const hubOverViewPageOn = { test: 1, hubOverviewFeature: 1 };

  const mapping: Array<Mapping> = [
    {
      pageRoute: videoHubRoute,
      appFeature: 'test',
      logicToUseForMapping: mappingType.STARTS_WITH,
      exclusion: [videoHubRouteExtended2]
    },
    {
      pageRoute: privacyRouteMapping,
      appFeature: 'privacyFeature',
      logicToUseForMapping: mappingType.EXACT_MATCH,
      exclusion: []
    },
    {
      pageRoute: featuresRoute,
      appFeature: 'profileFeature',
      logicToUseForMapping: mappingType.STARTS_WITH,
      exclusion: []
    }
  ];

  it('route should not be visible when experiment is off for eventsplus route', async () => {
    const response = isRouteVisible(experiments, mapping, videoHubRoute);
    expect(response).toBe(false);
  });

  it('route should not be visible when experiment is off for a route which stats with eventsplus route', async () => {
    const response = isRouteVisible(experiments, mapping, videoHubRouteExtended1ResolvedURL);
    expect(response).toBe(false);
  });
  it('route should not be visible when experiment is off for a route which stats with eventsplus route but in exclusion', async () => {
    const response = isRouteVisible(experiments, mapping, videoHubRouteExtended2ResolvedURL);
    expect(response).toBe(true);
  });

  it('route should not be visible when experiment is not present in list of project experiments for eventsplus route', async () => {
    const response = isRouteVisible(withoutVideoHubExperiments, mapping, videoHubRoute);
    expect(response).toBe(false);
  });

  it('route should not be visible when experiment is null for eventsplus route', async () => {
    const response = isRouteVisible(withNullVariantForVideoHubExperiments, mapping, videoHubRoute);
    expect(response).toBe(false);
  });

  it('privacy route be visible when privacy feature is ON', async () => {
    const response = isRouteVisible(privacyFeatureOn, mapping, privacyRoute);
    expect(response).toBe(true);
  });
  it('privacy route NOT be visible when privacy feature is OFF', async () => {
    const response = isRouteVisible(privacyFeatureOff, mapping, privacyRoute);
    expect(response).toBe(false);
  });
  it('features route be visible when profile feature is ON', async () => {
    const response = isRouteVisible(featuresPageOn, mapping, featuresRoute);
    expect(response).toBe(true);
  });
  it('features route NOT be visible when profile feature is OFF', async () => {
    const response = isRouteVisible(featuresPageOff, mapping, featuresRoute);
    expect(response).toBe(false);
  });
  it('member-profile route be visible when profile feature is ON', async () => {
    const response = isRouteVisible(featuresPageOn, mapping, memberProfileRoute);
    expect(response).toBe(true);
  });
  it('member-profile route NOT be visible when profile feature is OFF', async () => {
    const response = isRouteVisible(featuresPageOff, mapping, memberProfileRoute);
    expect(response).toBe(false);
  });

  it('member-list route NOT be visible when memberList feature is OFF', async () => {
    const response = isRouteVisible(memberListPageOff, mapping, membersPageRoute);
    expect(response).toBe(false);
  });

  it('member-list route visible when memberList feature is On', async () => {
    const response = isRouteVisible(memberListPageOn, mapping, memberListRoute);
    expect(response).toBe(true);
  });

  it('member-details route NOT be visible when memberList feature is On', async () => {
    const response = isRouteVisible(memberListPageOn, mapping, membersPageRoute);
    expect(response).toBe(true);
  });

  it('member-details visible when memberList feature is OFF', async () => {
    const response = isRouteVisible(memberListPageOff, mapping, memberListRoute);
    expect(response).toBe(false);
  });

  it('hub-overview route NOT be visible when hubOverview feature is On', async () => {
    const response = isRouteVisible(hubOverViewPageOn, mapping, hubOverViewPageRoute);
    expect(response).toBe(true);
  });

  it('hub-overview visible when hubOverview feature is OFF', async () => {
    const response = isRouteVisible(hubOverViewPageOff, mapping, hubOverViewPageRoute);
    expect(response).toBe(false);
  });

  it('video-engagement route be visible when renovateHubOverview feature is On', async () => {
    const response = isRouteVisible(hubOverViewPageOn, mapping, videoHighlightsPageRoute);
    expect(response).toBe(true);
  });

  it('video-engagement NOT visible when renovateHubOverview feature is OFF', async () => {
    const response = isRouteVisible(hubOverViewPageOff, mapping, videoHighlightsPageRoute);
    expect(response).toBe(false);
  });
});

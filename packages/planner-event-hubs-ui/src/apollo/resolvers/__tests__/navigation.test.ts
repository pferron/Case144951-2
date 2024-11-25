import { resolveQueryResponse } from '@resolvers/common/testUtils/mockFunction';
import {
  getMockResolverRequest,
  getMockResolverRequestWithDataSources,
  mockDataSource
} from '@resolvers/common/testUtils/mockRequestData';
import resolver from '@resolvers/navigation';
import { EventNavigationClient } from '@dataSources/eventNavigationService/client';

const ENVIRONMENT = 'test';

describe('Test Query.helpMenu resolution', () => {
  it('should resolve the expected object shape', async () => {
    const resolverRequest = getMockResolverRequest('Query.helpMenu', { environment: ENVIRONMENT });
    const resolverResponse = await resolveQueryResponse(resolver, 'helpMenu', resolverRequest, null);
    expect(resolverResponse).toHaveProperty('title');
    expect(resolverResponse).toHaveProperty('items');
    expect(Array.isArray(resolverResponse.items)).toBe(true);
  });
});

describe('Test Query.products resolution', () => {
  it('should resolve the expected object shape', async () => {
    const resolverRequest = getMockResolverRequest('Query.products', { environment: ENVIRONMENT });
    const resolverResponse = await resolveQueryResponse(resolver, 'products', resolverRequest, null);
    expect(resolverResponse).toHaveProperty('title');
    expect(resolverResponse).toHaveProperty('items');
    expect(Array.isArray(resolverResponse.items)).toBe(true);
  });
});

describe('Test Query.userUtilities resolution', () => {
  it('should resolve the expected object shape', async () => {
    const resolverRequest = getMockResolverRequest('Query.userUtilities', { environment: ENVIRONMENT });
    const resolverResponse = await resolveQueryResponse(resolver, 'userUtilities', resolverRequest, null);
    expect(resolverResponse).toHaveProperty('title');
    expect(resolverResponse).toHaveProperty('items');
    expect(Array.isArray(resolverResponse.items)).toBe(true);
  });
});

describe('Test Query.recentItems resolution', () => {
  it('should resolve the expected object shape', async () => {
    const resolverRequest = getMockResolverRequest('Query.recentItems', { environment: ENVIRONMENT });
    const resolverResponse = await resolveQueryResponse(resolver, 'recentItems', resolverRequest, null);
    expect(resolverResponse).toHaveProperty('title');
    expect(resolverResponse).toHaveProperty('items');
    expect(Array.isArray(resolverResponse.items)).toBe(true);
  });
});

const globalNavResponse = [
  {
    current: false,
    openInNewTab: false,
    url: {
      href: 'https://app.t2.cvent.com/Subscribers/Events2/EventSelection'
    },
    id: 'AllEventsHeader',
    title: 'EventContainer_Navigation_AllEvents',
    translatedTitle: 'All Events',
    items: []
  },
  {
    current: false,
    openInNewTab: false,
    url: {
      href: 'https://eventsplus.app.t2.cvent.com/eventsplus'
    },
    id: 'EventsPlusRedirect',
    title: 'video_hub_top_nav',
    translatedTitle: 'Events+',
    items: []
  }
];

describe('Test Query.navigation resolution', () => {
  it('should resolve the expected object shape', async () => {
    const eventNavigationClient = new EventNavigationClient();
    const dataSources = { eventNavigationClient };
    mockDataSource(eventNavigationClient, 'getGlobalNavigationItems', globalNavResponse);
    const args = { environment: ENVIRONMENT, navMetadata: { staticRouteId: '/', url: '/' } };
    const resolverRequest = getMockResolverRequestWithDataSources('Query.navigation', dataSources, args);
    const resolverResponse = await resolveQueryResponse(resolver, 'navigation', resolverRequest, null);
    expect(resolverResponse).toHaveProperty('appSwitcher');
    expect(resolverResponse).toHaveProperty('globalNav');
    expect(resolverResponse.globalNav.length).toBe(2);
    expect(resolverResponse.globalNav[0].title).toBe('All Events');
    expect(resolverResponse.globalNav[1].title).toBe('Events+');
  });
});

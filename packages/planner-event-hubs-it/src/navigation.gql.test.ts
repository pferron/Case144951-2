import {
  GET_ADVANCED_APP_NAVIGATION,
  updateRecentItemsMutation
} from '@cvent/planner-event-hubs-model/operations/navigations';
import { LoggerFactory } from '@cvent/logging/LoggerFactory';
import { makeUniqueId } from '@apollo/client/utilities';
import { connectToApiAsPlanner, generateContext, getAccessToken } from '@helpers/connectToApiAsPlanner';

const LOG = LoggerFactory.create('navigation.graphql.test');

const authOptionsNoPlatformUserId = {
  authorization: {
    metadata: {
      UserStub: '84a2dbea-5d13-448b-818d-5e40779b5277',
      UserLoginName: 'NxAutomation',
      LocaleId: 1033,
      AccountId: 801520774,
      environment: 'T2',
      accountStub: '10749114-7d87-4392-9f4b-8d0c7f3812e6',
      platformUserId: '',
      accountMappingId: '714b503d-1d4c-4e8a-adeb-e2f95a167370',
      locale: 'en-US'
    },
    roles: [],
    grantedAuthorizations: [
      {
        appId: 3430,
        roles: ['videos:read', 'videos:write', 'webcasts:read', 'players:read', 'players:write', 'players:delete']
      },
      {
        appId: 3020,
        roles: ['videos:read', 'videos:write']
      }
    ]
  }
};
const authOptions = {
  authorization: {
    metadata: {
      UserStub: '84a2dbea-5d13-448b-818d-5e40779b5277',
      UserLoginName: 'NxAutomation',
      LocaleId: 1033,
      AccountId: 801520774,
      environment: 'T2',
      accountStub: '10749114-7d87-4392-9f4b-8d0c7f3812e6',
      platformUserId: '00uzt73x1jrkk1O5E0h7',
      accountMappingId: '714b503d-1d4c-4e8a-adeb-e2f95a167370',
      locale: 'en-US'
    },
    roles: [],
    grantedAuthorizations: [
      {
        appId: 3430,
        roles: [
          'account-config:read',
          'user-permissions:read',
          'videos:read',
          'videos:write',
          'webcasts:read',
          'players:read',
          'players:write',
          'players:delete',
          'contacts:read',
          'contact-groups:read',
          'contact-types:read',
          'video-center:read',
          'video-center:write'
        ]
      },
      {
        appId: 3020,
        roles: ['videos:read', 'videos:write']
      },
      {
        appId: 2789,
        roles: ['players:delete', 'players:read', 'players:write', 'webcasts:read']
      },
      {
        appId: 3197,
        roles: ['sessions:read']
      },
      {
        appId: 2082,
        roles: ['events:read']
      },
      {
        appId: 3471,
        roles: ['projects:read', 'projects:write']
      },
      {
        appId: 2748,
        roles: ['contacts:read', 'contact-groups:read', 'contact-types:read']
      }
    ]
  }
};
let client;
// RED
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let context: Record<string, any>;
const failedToFetchMessage = 'Failed to fetch advanced navigation query';
describe('Navigation graph IT', () => {
  beforeAll(async () => {
    client = await connectToApiAsPlanner(authOptions);
  });

  /** PRODUCTS */
  it('should get user products for session with platformId', async () => {
    const { data } = await client
      .query({
        query: GET_ADVANCED_APP_NAVIGATION,
        variables: {}
      })
      .catch(error => {
        LOG.error(failedToFetchMessage, error);
      });

    expect(data).toBeTruthy();
    expect(data.products).toBeTruthy();
    expect(data.products.id).toBe('appSwitcher-VideoLibrary');
    expect(data.products.title).toBe('video_library_navigation_app_switcher');
    expect(data.products.defaultOpen).toBeFalsy();
    expect(data.products.items.length).toBeGreaterThan(3); // Came from navigation if greater than 3
    expect(data.products.items[0].id).toBeTruthy();
    expect(data.products.items[0].status).toBeTruthy();
    expect(data.products.items[0].icon).toBeTruthy();
    expect(data.products.items[0].title).toBeTruthy();
    expect(data.products.items[0].url.href).toBeTruthy();
  });

  it('should get user products for session WITHOUT platformId', async () => {
    const accessTokenNoAccountMappingId = await getAccessToken(authOptionsNoPlatformUserId);
    const contextNoPlatformUserId = generateContext(accessTokenNoAccountMappingId);
    const { data } = await client
      .query({
        query: GET_ADVANCED_APP_NAVIGATION,
        context: contextNoPlatformUserId,
        variables: {}
      })
      .catch(error => {
        LOG.error(failedToFetchMessage, error, `HttpLogRequestId: ${context.headers.HttpLogRequestId}`);
      });

    expect(data).toBeTruthy();
    expect(data.products).toBeTruthy();
    expect(data.products.id).toBe('appSwitcher-VideoLibrary');
    expect(data.products.title).toBe('video_library_navigation_app_switcher');
    expect(data.products.defaultOpen).toBeFalsy();
    expect(data.products.items.length).toBe(3); // Items length should be 3, using hard-coded values
    expect(data.products.items[0].id).toBeTruthy();
    expect(data.products.items[0].status).toBeTruthy();
    expect(data.products.items[0].icon).toBeTruthy();
    expect(data.products.items[0].title).toBeTruthy();
    expect(data.products.items[0].url.href).toBeTruthy();
  });

  it('should throw error getting advanced app navigation, not authorized', async () => {
    const contextInvalidToken = generateContext('122d45d1cc52b5fccc94fb0a9d91f667');
    await expect(
      client.query({
        query: GET_ADVANCED_APP_NAVIGATION,
        context: contextInvalidToken,
        variables: {}
      })
    ).rejects.toThrow('Not authorized');
  });

  /** HELP MENU */
  it('should get the helpMenu for session with platformId', async () => {
    const { data } = await client
      .query({
        query: GET_ADVANCED_APP_NAVIGATION,
        context,
        variables: {}
      })
      .catch(error => {
        LOG.error(failedToFetchMessage, error, `HttpLogRequestId: ${context.headers.HttpLogRequestId}`);
      });

    expect(data).toBeTruthy();
    expect(data.helpMenu).toBeTruthy();
    expect(data.helpMenu.title).toBe('video_library_navigation_help_menu');
    expect(data.helpMenu.items.length).toBeGreaterThan(0);
    expect(data.helpMenu.items[0].icon).toBeTruthy();
    expect(data.helpMenu.items[0].title).toBeTruthy();
    expect(data.helpMenu.items[0].url.href).toBeTruthy();
    expect(data.helpMenu.items[0]).toHaveProperty('openInNewTab');
    expect(data.helpMenu.items[0]).toHaveProperty('hasCustomOnClickHandler');
  });

  it('should get the helpMenu for session WITHOUT a platformId', async () => {
    const accessTokenNoAccountMappingId = await getAccessToken(authOptionsNoPlatformUserId);
    const contextNoPlatformUserId = generateContext(accessTokenNoAccountMappingId);
    const { data } = await client
      .query({
        query: GET_ADVANCED_APP_NAVIGATION,
        context: contextNoPlatformUserId,
        variables: {}
      })
      .catch(error => {
        LOG.error(failedToFetchMessage, error, `HttpLogRequestId: ${context.headers.HttpLogRequestId}`);
      });

    expect(data).toBeTruthy();
    expect(data.helpMenu).toBeTruthy();
    expect(data.helpMenu.title).toBe('video_library_navigation_help_menu');
    expect(data.helpMenu.items.length).toBeGreaterThan(0);
    expect(data.helpMenu.items[0].icon).toBeTruthy();
    expect(data.helpMenu.items[0].title).toBeTruthy();
    expect(data.helpMenu.items[0].url.href).toBeTruthy();
    expect(data.helpMenu.items[0]).toHaveProperty('openInNewTab');
    expect(data.helpMenu.items[0]).toHaveProperty('hasCustomOnClickHandler');
  });

  /** USER UTILITIES */
  it('should get the userUtilities for session with platformId', async () => {
    const { data } = await client
      .query({
        query: GET_ADVANCED_APP_NAVIGATION,
        context,
        variables: {}
      })
      .catch(error => {
        LOG.error(failedToFetchMessage, error, `HttpLogRequestId: ${context.headers.HttpLogRequestId}`);
      });

    expect(data).toBeTruthy();
    expect(data.userUtilities).toBeTruthy();
    expect(data.userUtilities.title).toBe('video_library_navigation_user_utility');
    expect(data.userUtilities.items.length).toBeGreaterThan(0);
    expect(data.userUtilities.items[0].icon).toBeTruthy();
    expect(data.userUtilities.items[0].title).toBeTruthy();
    expect(data.userUtilities.items[0].url.href).toBeTruthy();
    expect(data.userUtilities.items[0]).toHaveProperty('openInNewTab');
    expect(data.userUtilities.items[0]).toHaveProperty('hasCustomOnClickHandler');
  });

  it('should get the userUtilities for session WITHOUT a platformId', async () => {
    const accessTokenNoAccountMappingId = await getAccessToken(authOptionsNoPlatformUserId);
    const contextNoPlatformUserId = generateContext(accessTokenNoAccountMappingId);
    const { data } = await client
      .query({
        query: GET_ADVANCED_APP_NAVIGATION,
        context: contextNoPlatformUserId,
        variables: {}
      })
      .catch(error => {
        LOG.error(failedToFetchMessage, error, `HttpLogRequestId: ${context.headers.HttpLogRequestId}`);
      });

    expect(data).toBeTruthy();
    expect(data.userUtilities).toBeTruthy();
    expect(data.userUtilities.title).toBe('video_library_navigation_user_utility');
    expect(data.userUtilities.items.length).toBeGreaterThan(0);
    expect(data.userUtilities.items[0].icon).toBeTruthy();
    expect(data.userUtilities.items[0].title).toBeTruthy();
    expect(data.userUtilities.items[0].url.href).toBeTruthy();
    expect(data.userUtilities.items[0]).toHaveProperty('openInNewTab');
    expect(data.userUtilities.items[0]).toHaveProperty('hasCustomOnClickHandler');
  });

  /** USER */
  it('should get the userDetails for session with platformId', async () => {
    const { data } = await client
      .query({
        query: GET_ADVANCED_APP_NAVIGATION,
        context,
        variables: {}
      })
      .catch(error => {
        LOG.error(failedToFetchMessage, error, `HttpLogRequestId: ${context.headers.HttpLogRequestId}`);
      });

    expect(data).toBeTruthy();
    expect(data.user).toBeTruthy();
    expect(data.user.firstName).toBeTruthy();
    expect(data.user.lastName).toBeTruthy();
    expect(data.user.email).toBeTruthy();
    expect(data.user.url.href).toBeTruthy();
    expect(data.user.viewProfileText).toBeTruthy();
    expect(data.user).toHaveProperty('company');
  });

  it('should get the userDetails for session WITHOUT platformId', async () => {
    const accessTokenNoAccountMappingId = await getAccessToken(authOptionsNoPlatformUserId);
    const contextNoPlatformUserId = generateContext(accessTokenNoAccountMappingId);
    const { data } = await client
      .query({
        query: GET_ADVANCED_APP_NAVIGATION,
        context: contextNoPlatformUserId,
        variables: {}
      })
      .catch(error => {
        LOG.error(failedToFetchMessage, error, `HttpLogRequestId: ${context.headers.HttpLogRequestId}`);
      });

    expect(data).toBeTruthy();
    expect(data.user).toBeTruthy();
    expect(data.user.firstName).toBeTruthy();
    expect(data.user.lastName).toBeTruthy();
    expect(data.user.email).toBeTruthy();
    expect(data.user.url.href).toBeTruthy();
    expect(data.user.viewProfileText).toBeTruthy();
    expect(data.user).toHaveProperty('company');
  });

  /** RECENT ITEMS */
  it('should get the recentItems for a session with platformId', async () => {
    const { data } = await client
      .query({
        query: GET_ADVANCED_APP_NAVIGATION,
        context,
        variables: {}
      })
      .catch(error => {
        LOG.error(failedToFetchMessage, error, `HttpLogRequestId: ${context.headers.HttpLogRequestId}`);
      });

    expect(data).toBeTruthy();
    expect(data.recentItems).toBeTruthy();
    expect(Array.isArray(data.recentItems.items)).toBeTruthy();
  });

  it('should update the recentItems for a session with platformId', async () => {
    const recentItem = {
      id: makeUniqueId('pvs'),
      type: 'event',
      title: 'pvs test event',
      url: 'https://app.t2.cvent.com/Subscribers/Commons/RecentItem.aspx?stub=f56c5ce0-7f72-4993-85fa-1ec49af3bdab&type=4'
    };
    const { data } = await client
      .mutate({
        mutation: updateRecentItemsMutation,
        context,
        variables: {
          input: recentItem
        }
      })
      .catch(error => {
        LOG.error('Failed to update recent items', error, `HttpLogRequestId: ${context.headers.HttpLogRequestId}`);
      });

    expect(data).toBeTruthy();
    expect(data.updateRecentItems.length).toBeGreaterThan(0);
    expect(data.updateRecentItems.find(item => item.id === recentItem.id)).toBeTruthy();
  });
});

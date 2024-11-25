import {
  Resolvers,
  AppSwitcher,
  HelpMenu,
  UserUtilities,
  UserDetails,
  RecentItems,
  UpdateRecentItemsRequest,
  Utility,
  CarinaNavigation,
  CarinaNavItem
} from '@cvent/planner-event-hubs-model/types';
import {
  GlobalNavigationClient,
  PlannerUserClient,
  buildHelpUtilities,
  buildUtilityItem,
  buildUserUtilities,
  buildRecentItems,
  getLogIds,
  unhandledError
} from '@cvent/shared-core-events-ui';
import { buildAppSwitcherItems, getDefaultProducts } from '@utils/navigationHelper';
import { mockUtilitiesData, mockHelpCommunityLinks } from '@utils/mockNavigationData';
import { LoggerFactory } from '@cvent/logging/LoggerFactory';
import { GENERIC_ACCOUNTS_APP_BASE_ADDRESS } from '@utils/environmentUtil';
import {
  getAccessToken,
  getAccountMappingId,
  getEnvironment,
  getPlatformUserId,
  getUserStub,
  hasAuthMetadata,
  isSelfServiceAccount as selfServiceAccount
} from '@utils/authUtils';
import { CarinaNavigationConfig } from '@navigation/config';
import { globalNavMaps, localNavMaps } from '@navigation/sitemaps';
import { NavigationBuilderFactory } from '@cvent/planner-navigation/NavigationBuilderFactory';

const LOG = LoggerFactory.create('resolvers/navigation');
const { normandyBaseUrl } = process.env;
const navLinksBaseUrl = process.env.NAVIGATION_LINKS_BASE_URL;
// RED
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const changeNxLinksBaseUrl = (newBaseUrl, navItems = [], oldBaseUrl = navLinksBaseUrl): any => {
  return navItems.map((navItem: object) => {
    // RED
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const item: any = { ...navItem };

    if (item.url && item.url.href && item.url.href.includes(oldBaseUrl)) {
      item.url.href = item.url.href.replace(oldBaseUrl, newBaseUrl);
    }
    if (item.items && item.items.length > 0) {
      const modifiedItems = item.items.map(subItem => {
        const newSubItem = { ...subItem };
        if (newSubItem.url && newSubItem.url.href && newSubItem.url.href.includes(oldBaseUrl)) {
          newSubItem.url.href = newSubItem.url.href.replace(oldBaseUrl, newBaseUrl);
        }
        return newSubItem;
      });
      item.items = modifiedItems;
    }
    return item;
  });
};

// RED
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const buildUserDetails = (response): any => {
  return {
    firstName: response.FirstName,
    lastName: response.LastName,
    email: response.EmailAddr,
    company: response.Company
  };
};

/**
 * @param {*} plannerUserClient planner user client
 */
const updateRecentItems = async (
  plannerUserClient: PlannerUserClient,
  recentItemUpdateRequest: UpdateRecentItemsRequest,
  hasPlatformUserId: boolean
  // RED
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> => {
  const recentItems = hasPlatformUserId
    ? plannerUserClient.updateRecentItems(recentItemUpdateRequest)
    : Promise.resolve({
        data: []
      });
  const response = await recentItems;
  return response.data;
};

type ResolverProperties = {
  // RED
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resolvedHeaders: Record<string, any>;
  environment: string;
  platformUserId: string;
  userStub: string;
  isSelfServiceAccount: boolean;
};

const getResolverProperties = (
  // RED
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  headers: Record<string, any>,
  // RED
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  authMetadata: Record<string, any>,
  route: string
): ResolverProperties => {
  if (!hasAuthMetadata(authMetadata)) {
    throw unhandledError(
      `Failed in resolver while processing operation : ${route}, Auth metadata not populated, Did you forget to add Bearer auth directive to your query/mutation?`,
      getLogIds(headers)
    );
  }

  const authAccessToken = getAccessToken(authMetadata);
  const accountMappingId = getAccountMappingId(authMetadata);
  const environment = getEnvironment(authMetadata);
  const platformUserId = getPlatformUserId(authMetadata);
  const userStub = getUserStub(authMetadata);
  const _isSelfServiceAccount = selfServiceAccount(authMetadata);

  return {
    resolvedHeaders: {
      ...(headers || {}),
      authorization: `Bearer ${authAccessToken}`,
      accountMappingId
    },
    environment,
    platformUserId,
    userStub,
    isSelfServiceAccount: _isSelfServiceAccount
  };
};

const navigationBuilder = NavigationBuilderFactory.createNavigationBuilder({
  settings: CarinaNavigationConfig,
  sitemaps: {
    globalNavMaps,
    localNavMaps
  }
});

const adjustLocalizedTitle = (navItems): CarinaNavItem[] => {
  if (!navItems || navItems.length === 0) return navItems;
  return navItems.map(navItem => {
    const localizedTitle = navItem.translatedTitle || navItem.title;
    return {
      ...navItem,
      title: localizedTitle,
      items: adjustLocalizedTitle(navItem.items)
    };
  });
};

const resolver: Resolvers = {
  Query: {
    navigation: async (_, args, context): Promise<CarinaNavigation> => {
      const authToken = getAccessToken(context.auth);
      const baseNavigation = await navigationBuilder.buildNavigation(args.navMetadata, authToken);
      const globalNav = await context.dataSources.eventNavigationClient.getGlobalNavigationItems();
      return { ...baseNavigation, globalNav: adjustLocalizedTitle(globalNav) };
    },
    products: async (_, args, { headers, auth }): Promise<AppSwitcher> => {
      LOG.debug('products');
      let userProducts;
      const { resolvedHeaders, environment, platformUserId } = getResolverProperties(headers, auth, 'Query.products');
      const globalNavigationClient = new GlobalNavigationClient(
        process.env.NAVIGATION_SERVICE_URL,
        environment,
        resolvedHeaders
      );

      try {
        // If a valid platformUserId is not present in the bearer token metadata, we should return a
        // hard-coded minimal set of AppSwitcher links, otherwise fetch links from navigation service
        if (platformUserId && platformUserId !== '') {
          userProducts = await globalNavigationClient.getUserProducts();
        } else {
          userProducts = getDefaultProducts(environment, normandyBaseUrl);
        }
      } catch (error) {
        // In case of error log as error, and return default (minimal) list of App Switcher items
        LOG.error(`Failed to get user products with params: ${args}`, error);
        userProducts = getDefaultProducts(environment, normandyBaseUrl);
      }
      return {
        id: 'appSwitcher-VideoLibrary',
        title: 'video_library_navigation_app_switcher',
        defaultOpen: false,
        items: buildAppSwitcherItems(userProducts)
      };
    },
    helpMenu: async (_, args, { headers, auth }): Promise<HelpMenu> => {
      const { resolvedHeaders, environment, platformUserId } = getResolverProperties(headers, auth, 'Query.helpMenu');
      const globalNavigationClient = new GlobalNavigationClient(
        process.env.NAVIGATION_SERVICE_URL,
        environment,
        resolvedHeaders
      );

      const hasPlatformUserId = platformUserId && platformUserId !== '';
      const utilitiesResponse: UserUtilities = hasPlatformUserId
        ? await globalNavigationClient.getUtilities()
        : mockUtilitiesData(environment, false);

      const helpUtilities = buildHelpUtilities('video_library_navigation_help_menu', utilitiesResponse);
      helpUtilities.items = helpUtilities.items.map(async (item: Utility) => {
        const url = hasPlatformUserId
          ? await globalNavigationClient.getMagicLink(item.url.href, platformUserId)
          : mockHelpCommunityLinks;
        const utility: Utility = { ...item, url };
        return utility;
      });

      return helpUtilities;
    },
    userUtilities: async (_, args, { headers, auth }): Promise<UserUtilities> => {
      const { resolvedHeaders, environment, platformUserId, isSelfServiceAccount } = getResolverProperties(
        headers,
        auth,
        'Query.userUtilities'
      );
      const globalNavigationClient = new GlobalNavigationClient(
        process.env.NAVIGATION_SERVICE_URL,
        environment,
        resolvedHeaders
      );
      const userUtilitiesTitle = 'video_library_navigation_user_utility';

      const hasPlatformUserId = platformUserId && platformUserId !== '';

      const buildUserUtilityItems = (utilityItems = []): Array<Utility> => {
        let utilities = utilityItems;
        utilities = changeNxLinksBaseUrl(
          process.env.plannerAccountAppBaseUrl,
          utilities,
          GENERIC_ACCOUNTS_APP_BASE_ADDRESS
        );
        return utilities;
      };

      const buildUtilities = (title, utilitiesResponse): UserUtilities => {
        const userUtilities = buildUserUtilities(title, utilitiesResponse, isSelfServiceAccount);
        return {
          ...userUtilities,
          items: buildUserUtilityItems(userUtilities.items)
        };
      };

      const utilitiesResponse = hasPlatformUserId
        ? await globalNavigationClient.getUtilities()
        : mockUtilitiesData(environment, false);

      return buildUtilities(userUtilitiesTitle, utilitiesResponse);
    },
    user: async (_, args, { headers, auth, dataSources }): Promise<UserDetails> => {
      const { resolvedHeaders, environment, platformUserId, userStub } = getResolverProperties(
        headers,
        auth,
        'Query.user'
      );
      const globalNavigationClient = new GlobalNavigationClient(
        process.env.NAVIGATION_SERVICE_URL,
        environment,
        resolvedHeaders
      );
      const hasPlatformUserId = platformUserId && platformUserId !== '';
      const userDetailsResponse = await dataSources.userSOAClient.getDetails(userStub);
      const userDetails = buildUserDetails(userDetailsResponse);

      const utilitiesResponse = hasPlatformUserId
        ? await globalNavigationClient.getUtilities()
        : mockUtilitiesData(environment, false);

      const profile = buildUtilityItem(utilitiesResponse.profile);

      return {
        ...userDetails,
        url: profile.url,
        viewProfileText: profile.title
      };
    },
    recentItems: async (_, args, { headers, auth }): Promise<RecentItems> => {
      LOG.debug('recentItems args', args);
      const { resolvedHeaders, environment, platformUserId } = getResolverProperties(
        headers,
        auth,
        'Query.recentItems'
      );
      const plannerUserClient = new PlannerUserClient(
        process.env.PLANNER_USER_SERVICE_BASE_URL,
        environment,
        resolvedHeaders
      );
      const recentItemsTitle = 'video_library_navigation_recent_items';
      try {
        const hasPlatformUserId = platformUserId && platformUserId !== '';
        const recentItemsResponse = hasPlatformUserId ? await plannerUserClient.getRecentItems() : { data: [] };
        const recentItems = buildRecentItems(recentItemsTitle, recentItemsResponse);
        return {
          ...recentItems,
          items: recentItems.items ?? []
        };
      } catch (error) {
        LOG.error(`Failed to get Recent Items with params: `, args, error);
        return { title: recentItemsTitle, items: [] };
      }
    }
  },
  Mutation: {
    // RED
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    updateRecentItems: async (_, args, { headers, auth }): Promise<any> => {
      const { environment, platformUserId, resolvedHeaders } = getResolverProperties(
        headers,
        auth,
        'Mutation.updateRecentItems'
      );
      const updateRecentItemsRequest = args.input;
      const plannerUserClient = new PlannerUserClient(
        process.env.PLANNER_USER_SERVICE_BASE_URL,
        environment,
        resolvedHeaders
      );
      const hasPlatformUserId = platformUserId && platformUserId !== '';
      try {
        const result =
          (await updateRecentItems(
            plannerUserClient,
            {
              ...updateRecentItemsRequest,
              url: updateRecentItemsRequest.url.startsWith('http')
                ? updateRecentItemsRequest.url
                : `${process.env.appBaseUrl}${updateRecentItemsRequest.url}`
            },
            hasPlatformUserId
          )) ?? [];
        return result;
      } catch (error) {
        LOG.error(`Failed to update Recent Items with params: ${args}`, error);
        return [];
      }
    }
  }
};

export default resolver;

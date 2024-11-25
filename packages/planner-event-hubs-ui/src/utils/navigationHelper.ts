import { CarinaNavItem, NavMetadata, PathParam } from '@cvent/planner-navigation/types';
import { Maybe, UserProduct } from '@cvent/planner-event-hubs-model/types';
import { isRouteVisible, Mapping } from '@utils/routeVisibilityHelper';
import { resolveTemplateUrl } from '@utils/environmentUtil';

/**
 * This file contains helper methods needed for Navigation
 */

interface UserProductResponse {
  data: UserProduct[];
}

/**
 *  Function for creating NavMetadata object for navigation that needs to be shown.
 * @param pageRoute
 * @param topParentId
 * @param pathParams
 * @returns
 */
export const createNavMetadata = (
  topParentId: string,
  pathParams: Maybe<Array<PathParam>>,
  currentUrl = '/'
): NavMetadata => ({
  url: currentUrl,
  staticRouteId: '/',
  pathParams,
  topParentId: topParentId || ''
});

/**
 * Filter navigation items based on experiments
 * @param navItems
 * @param routeExperimentMapping
 * @param experiments
 * @param accountConfigs
 */
export function filterNavigationItems(
  navItems: Maybe<Array<CarinaNavItem>>,
  routeExperimentMapping: Array<Mapping>,
  experiments: Record<string, boolean>,
  accountConfigs: Record<string, boolean>
): Array<CarinaNavItem> {
  return experiments
    ? navItems &&
        navItems
          // eslint-disable-next-line @typescript-eslint/no-use-before-define
          .map(item => item && filterNavigationItem(item, routeExperimentMapping, experiments, accountConfigs))
          .filter(item => item != null)
    : navItems;
}

function filterNavigationItem(
  navItem: CarinaNavItem,
  routeExperimentMapping: Array<Mapping>,
  experiments: Record<string, boolean>,
  accountConfigs: Record<string, boolean>
): CarinaNavItem {
  const routeMapping = isRouteVisible(experiments, routeExperimentMapping, navItem?.url?.href);

  const visible = navItem.url ? routeMapping : true;
  if (visible) {
    let items = [];
    if (navItem.items && navItem.items.length > 0) {
      items = filterNavigationItems(navItem.items, routeExperimentMapping, experiments, accountConfigs);
    }
    return {
      ...navItem,
      items
    };
  }
  return null;
}

/**
 * Translate title of navigation item if they have phraseApp key
 * @param navItems
 * @param translate
 */
export function translateNavigationItems(
  navItems: Maybe<Array<CarinaNavItem>>,
  translate: (key: string) => string
): Array<CarinaNavItem> {
  return navItems ? navItems.map(item => item && translateNavigationItem(item, translate)) : [];
}

function translateNavigationItem(navItem: CarinaNavItem, translate: (key: string) => string): CarinaNavItem {
  let items = [];
  if (navItem.items && navItem.items.length > 0) {
    items = translateNavigationItems(navItem.items, translate);
  }

  const translatedValue = navItem.title ? translate(navItem.title) : navItem.title;
  return {
    ...navItem,
    title: translatedValue || navItem.title,
    items
  };
}

// RED
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const buildProduct = (productItem): any => {
  // Service sends status as ENABLED/DISABLED
  // whereas Navigation Provider expects it as enabled/disabled
  const productStatus = productItem.status === 'ENABLED' ? 'enabled' : 'disabled';
  return {
    ...productItem,
    url: { href: productItem.url },
    status: productStatus
  };
};

/**
 * Builds and formats list of AppSwitcher items
 * @param products
 */
// RED
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const buildAppSwitcherItems = (products: UserProductResponse): any => {
  const items = [];
  if (products && products.data) {
    products.data.forEach(item => {
      items.push(buildProduct(item));
    });
  }
  return items;
};

/**
 * Returns a hard-coded, minimal set of AppSwitcher links (needed for when platformUserId is invalid)
 * @param environment
 * @param normandyBaseUrl
 * @returns
 */
// RED
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getDefaultProducts = (environment: string, normandyBaseUrl: string): any => ({
  data: [
    {
      id: 'event',
      icon: 'EventIcon',
      title: 'Events',
      url: `${resolveTemplateUrl(normandyBaseUrl, environment)}/Subscribers/Events2/EventSelection`,
      status: 'ENABLED'
    },
    {
      id: 'contact',
      icon: 'ContactsIcon',
      title: 'Contacts',
      url: `${resolveTemplateUrl(normandyBaseUrl, environment)}/Subscribers/ContactMgmt/AddressBook/AddressBookList`,
      status: 'ENABLED'
    },
    {
      id: 'admin',
      icon: 'SettingsIcon',
      title: 'Admin',
      url: `${resolveTemplateUrl(normandyBaseUrl, environment)}/Subscribers/Admin/Overview/Index`,
      status: 'ENABLED'
    }
  ]
});

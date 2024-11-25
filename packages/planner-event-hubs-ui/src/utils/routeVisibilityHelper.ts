import {
  HUB_OVERVIEW_URL,
  HUB_OVERVIEW_FEATURE,
  LANGUAGE_MANAGEMENT_FEATURE,
  MARKETING_URL,
  VIDEO_HUB_HOMEPAGE_URL,
  HOMEPAGE_CUSTOMIZATION_FEATURE,
  ACCESS_MANAGEMENT_URL,
  SSO_FEATURE,
  VIDEO_HIGHLIGHTS_URL,
  RENOVATE_HUB_OVERVIEW_FEATURE
} from '@utils/constants';
import isUUID from 'validator/lib/isUUID';

export enum mappingType {
  STARTS_WITH,
  EXACT_MATCH
}

export interface Mapping {
  pageRoute: string;
  appFeature: string;
  logicToUseForMapping: mappingType;
  exclusion?: Array<string>;
  excludeIfAppFeatureIsEnabled?: boolean; // Use this to hide the nav item when an app feature is enabled.
}

/**
 * This mapping is used to check if respective route is hidden based on appFeature.
 * Single Route can have multiple mappings with diff experiments.
 * In this we check if appFeature configured for a route is on/off and based on that do below.
 *
 * For navigation :-
 * * * All navigation[top and side] component have Route associated with them.
 * * * If respective route of navigation is configured here then the navigation will not be visible on UI.
 *  * For pages :-
 * * * We can configure Route of a page here (like some route of  navigation).
 * * * If someone tries to access a below configured page and exp is off then we redirect them to 404 page .
 * * * All pages starts with configured url will redirect to 404 page.
 */
export const routeExperimentMapping: Array<Mapping> = [
  {
    // To do: To be removed after core session work HUB-61261 is complete
    pageRoute: '/core-test',
    appFeature: 'coreTestFeature',
    logicToUseForMapping: mappingType.EXACT_MATCH
  },
  {
    pageRoute: VIDEO_HUB_HOMEPAGE_URL,
    appFeature: HOMEPAGE_CUSTOMIZATION_FEATURE,
    logicToUseForMapping: mappingType.EXACT_MATCH
  },
  {
    pageRoute: MARKETING_URL,
    appFeature: LANGUAGE_MANAGEMENT_FEATURE,
    logicToUseForMapping: mappingType.STARTS_WITH
  },
  {
    pageRoute: ACCESS_MANAGEMENT_URL,
    appFeature: SSO_FEATURE,
    logicToUseForMapping: mappingType.STARTS_WITH
  },
  {
    pageRoute: HUB_OVERVIEW_URL,
    appFeature: HUB_OVERVIEW_FEATURE,
    logicToUseForMapping: mappingType.STARTS_WITH
  },
  {
    pageRoute: VIDEO_HIGHLIGHTS_URL,
    appFeature: RENOVATE_HUB_OVERVIEW_FEATURE,
    logicToUseForMapping: mappingType.STARTS_WITH
  }
];

/**
 * check if any experiment attached to route is off.
 * @param experimentsList
 * @param routeExperimentMappingList
 * @param pageRoute
 */
export function isRouteVisible(
  experimentsList: Record<string, boolean | number>,
  routeExperimentMappingList: Array<Mapping>,
  pageRoute: string
): boolean {
  if (!experimentsList) {
    return true;
  }

  let mappingWithoutIds;
  let pageRouteWithoutIds;

  const mappedExperiments = routeExperimentMappingList?.filter(mapping => {
    if (
      mapping.exclusion &&
      mapping.exclusion.find(route => {
        [mappingWithoutIds, pageRouteWithoutIds] = isPageRouteMatching(pageRoute, route);
        return mappingWithoutIds === pageRouteWithoutIds;
      })
    ) {
      return false;
    }
    switch (mapping.logicToUseForMapping) {
      case mappingType.STARTS_WITH: {
        [mappingWithoutIds, pageRouteWithoutIds] = isPageRouteMatching(pageRoute, mapping.pageRoute);
        return pageRouteWithoutIds?.startsWith(mappingWithoutIds);
      }
      case mappingType.EXACT_MATCH: {
        [mappingWithoutIds, pageRouteWithoutIds] = isPageRouteMatching(pageRoute, mapping.pageRoute);
        return mappingWithoutIds === pageRouteWithoutIds;
      }
      default:
        return false;
    }
  });

  let result = true;
  mappedExperiments?.forEach(mapping => {
    if (
      experimentsList?.[mapping.appFeature] === undefined ||
      experimentsList?.[mapping.appFeature] === false ||
      experimentsList?.[mapping.appFeature] === 0
    ) {
      result = false;
    }

    if (mapping?.excludeIfAppFeatureIsEnabled) {
      result = !experimentsList?.[mapping.appFeature];
    }
  });
  return result;
}

/**
 * Removing dynamic UUIDs and dynamic constants from the string to match the mappings and page routes
 * @param pageRoute
 * @param mapping
 */

export function isPageRouteMatching(pageRoute: string, mapping: string): string[] {
  const mappingWithoutIds = mapping
    .split('/')
    .filter(element => !(element.startsWith('[') && element.endsWith(']')))
    .join('/');
  const pageRouteWithoutIds = pageRoute
    ?.split('/')
    .filter(element => !isUUID(element))
    .join('/');
  return [mappingWithoutIds, pageRouteWithoutIds];
}

// import { NavItem } from '@cvent/nx/navigation/navigationTypes';
import { NavItem } from '@cvent/planner-navigation/navigationTypes';
import { globalNavMap } from '@navigation/sitemaps/global';
import { videoHubsNavigationMap } from '@navigation/sitemaps/local/videoHub';

export const localNavMaps: Array<NavItem> = [videoHubsNavigationMap];
export const globalNavMaps: Array<NavItem> = [globalNavMap];

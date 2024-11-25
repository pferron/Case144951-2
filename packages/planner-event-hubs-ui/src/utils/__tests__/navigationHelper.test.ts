import { CarinaNavItem } from '@cvent/planner-navigation/types';
import { Mapping, mappingType } from '@utils/routeVisibilityHelper';
import { createNavMetadata, filterNavigationItems, translateNavigationItems } from '../navigationHelper';
import navigationData from './fixtures/NavigationResponse.json';

const experiments = { test: false, test2: true };
const globalNav = [...navigationData.data.navigation.globalNav] as Array<CarinaNavItem>;

const mapping: Array<Mapping> = [
  {
    pageRoute: '/eventsplus',
    appFeature: 'test',
    logicToUseForMapping: mappingType.STARTS_WITH,
    exclusion: []
  },
  {
    pageRoute: '/webinar',
    appFeature: 'test2',
    logicToUseForMapping: mappingType.STARTS_WITH,
    exclusion: []
  }
];

const translate = (key): string => {
  if (key === 'events_top_nav') {
    return 'Events';
  }
  if (key === 'video_hub_top_nav') {
    return 'Events+';
  }
  return null;
};

describe('Navigation Helper Tests', () => {
  it('test create meta provide correct data', async () => {
    const topParentId = 'parentId';
    const pathParams = [{ key: 'test', value: 'test' }];
    const response = createNavMetadata(topParentId, pathParams);
    expect(response.staticRouteId).toBe('/');
    expect(response.url).toBe('/');
    expect(response.topParentId).toBe(topParentId);
    expect(response.pathParams).toBe(pathParams);
  });

  it('test create meta provide correct data event when some values are null', async () => {
    const pageRoute = '/';
    const response = createNavMetadata(null, null);
    expect(response.staticRouteId).toBe('/');
    expect(response.url).toBe(pageRoute);
    expect(response.topParentId).toBe('');
    expect(response.pathParams).toBe(null);
  });

  it('check non visible route video hub is filtered', async () => {
    const response = filterNavigationItems(globalNav, mapping, experiments);
    expect(response.length).toBe(2);
    expect(response[0].title).not.toBe('video_hub_top_nav');
    expect(response[1].title).not.toBe('video_hub_top_nav');
  });

  it('check visible route studio is not filtered', async () => {
    const response = filterNavigationItems(globalNav, mapping, experiments);
    expect(response.length).toBe(2);
    expect(response[1].title).toBe(globalNav[2].title);
  });

  it('check non mapped route library is not filtered', async () => {
    const response = filterNavigationItems(globalNav, mapping, experiments);
    expect(response.length).toBe(2);
    expect(response[0].title).toBe(globalNav[0].title);
  });

  it('check title is translated correctly', async () => {
    const response = translateNavigationItems(globalNav, translate);
    expect(response.length).toBe(3);
    expect(response[0].title).toBe('Events');
    expect(response[1].title).toBe('Events+');
  });

  it('check title is translated when key have not translate value', async () => {
    const response = translateNavigationItems(globalNav, translate);
    expect(response.length).toBe(3);
    expect(response[2].title).toBe('webinar_top_nav');
  });
});

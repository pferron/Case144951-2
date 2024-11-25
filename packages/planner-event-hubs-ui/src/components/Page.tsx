import React from 'react';
import { useQuery } from '@apollo/client';
import { NavigationProvider } from '@cvent/carina/components/Navigation/NavigationProvider';
import { BasePage } from '@components/BasePage';
import { Link } from '@cvent/nextjs/components/Link';
import { GET_APP_NAVIGATION_QUERY } from '@cvent/planner-navigation/client';
import { GET_ADVANCED_APP_NAVIGATION } from '@cvent/planner-event-hubs-model/operations/navigations';
import { accountConfig as getAccountConfig } from '@cvent/planner-event-hubs-model/operations/coreSOA';
import Head from 'next/head';
import { useAppFeatures } from '@components/AppFeaturesProvider';
import { NavMetadata } from '@cvent/planner-navigation/types';
import { filterNavigationItems, translateNavigationItems } from '@utils/navigationHelper';
import { useTranslate } from 'nucleus-text';
import { routeExperimentMapping } from '@utils/routeVisibilityHelper';
import { LoggerFactory } from '@cvent/logging/LoggerFactory';
import { useRouter } from 'next/router';
import getConfig from 'next/config';
import { REGISTRATION_PAGE_TITLE, VISITOR_PERMISSION_TITLE } from '@utils/constants';

const LOG = LoggerFactory.create('Page');

export default function Page({
  children,
  navMetadata,
  pageSubTitle,
  overrideSideNavSelection,
  zIndex,
  pageTitle,
  testID,
  displayHeader,
  showSideNav = true,
  showFooter = true
}: Props): JSX.Element {
  const { translate } = useTranslate();
  const appFeatures = useAppFeatures();
  const router = useRouter();
  const { publicRuntimeConfig } = getConfig();

  const { data, loading: navLoading } = useQuery(GET_APP_NAVIGATION_QUERY, {
    variables: {
      navMetadata
    }
  });

  const { loading: loadingAccountConfigs, data: accountConfigData } = useQuery(getAccountConfig);
  const accountConfigs = accountConfigData?.accountConfig?.AccountFeatures?.GeneralFeatures ?? {};

  const handlers = {
    setSearchTerm: (term): void => {
      LOG.info('SEARCH TERM:', term);
    },
    submitFilters: (content): void => {
      LOG.info('FILTERS CONTENT', content);
    },
    onSearch: (term?: string): void => {
      LOG.info('onSearch', term);
      router.push(`/search?term=${encodeURIComponent(term)}`);
    }
  };

  // Query app switcher links and other navigation blades dynamically from navigation service
  const { loading: loadingAdvancedAppNavigation, data: advancedAppNavigationData } = useQuery(
    GET_ADVANCED_APP_NAVIGATION,
    {
      variables: {}
    }
  );

  const globalNav = filterNavigationItems(
    data?.navigation?.globalNav,
    routeExperimentMapping,
    appFeatures,
    accountConfigs
  );
  const { singleSignOnFeature } = useAppFeatures();

  let localNav = filterNavigationItems(data?.navigation?.localNav, routeExperimentMapping, appFeatures, accountConfigs);
  if (singleSignOnFeature) {
    if (localNav && localNav.length > 0) {
      localNav[0].items = localNav[0].items.filter(
        item => item.title !== REGISTRATION_PAGE_TITLE && item.title !== VISITOR_PERMISSION_TITLE
      );
    }
  }
  localNav = translateNavigationItems(localNav, translate);

  const nav = {
    ...data?.navigation,
    ...handlers,
    page: pageSubTitle as string,
    Link,
    globalNav,
    localNav,
    appSwitcher: {
      ...advancedAppNavigationData?.products,
      title: translate(advancedAppNavigationData?.products?.title || 'video_library_navigation_app_switcher')
    },
    helpMenu: advancedAppNavigationData?.helpMenu,
    user: advancedAppNavigationData?.user,
    userUtilities: advancedAppNavigationData?.userUtilities,
    recentItems: advancedAppNavigationData?.recentItems,
    onSearch: (searchTerm: string) => {
      const baseUrl = publicRuntimeConfig.NORMANDY_BASE_URL;
      const searchUrl = `${baseUrl}/Subscribers/Admin/AccountSearch/AccountSearchGrids/Index?searchText=${searchTerm}&categoryId=1`;
      window.location.href = searchUrl;
    }
  };

  const PageRenderer: JSX.Element = (
    <div>
      <NavigationProvider {...nav}>
        <BasePage
          overrideSideNavSelection={overrideSideNavSelection}
          zIndex={zIndex}
          testID={testID}
          displayHeader={displayHeader}
          showSideNav={showSideNav}
          showFooter={showFooter}
        >
          {children}
        </BasePage>
      </NavigationProvider>
    </div>
  );

  if (navLoading || loadingAdvancedAppNavigation || loadingAccountConfigs) {
    return <div />;
  }

  return (
    <div>
      <Head>
        <title>{pageTitle || data?.navigation?.page}</title>
      </Head>
      {PageRenderer}
    </div>
  );
}

interface Props {
  children: JSX.Element;
  navMetadata: NavMetadata;
  pageTitle?: string;
  pageSubTitle?: string | string[];
  overrideSideNavSelection?: string;
  zIndex?: number;
  testID?: string;
  displayHeader?: boolean;
  showSideNav?: boolean;
  showFooter?: boolean;
}

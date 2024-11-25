import { useBreakpoints } from '@cvent/carina/components/Breakpoints';
import { Col } from '@cvent/carina/components/Col';
import { ControlsIcon, SessionIcon, UploadCloudIcon } from '@cvent/carina/components/Icon';
import MenuIcon from '@cvent/carina/components/Icon/Menu';
import {
  AppSwitcher,
  AppSwitcherMenuItem,
  Divider,
  FlyoutMenu,
  FlyoutMenuItem,
  NavigationIcon as Icon,
  Logo,
  PageTitle,
  ProductTitle,
  Search,
  TitleBar,
  TopNavigation as TopNav,
  UserProfile,
  useNavigation
} from '@cvent/carina/components/Navigation';
import { OnWhen } from '@cvent/carina/components/OnWhen';
import { Row } from '@cvent/carina/components/Row';
import { useUserPermissions } from '@hooks/UserPermissionsProvider';
import { LIBRARY_ICON, STUDIO_ICON, VIDEO_HUBS_ICON } from '@utils/constants';
import { ICONS } from '@utils/menuIcons';
import NextLink from 'next/link';
import { useTranslate } from 'nucleus-text';
import { useRef, useState } from 'react';
import Button from '@cvent/carina/components/Button';
import { injectTestId } from '@cvent/nucleus-test-automation';
import { UserDetails, Utility, UserUtilities } from '@cvent/planner-event-hubs-model/types';
import { NavItem } from '@cvent/planner-navigation/navigationTypes';
import { useStyle } from '@hooks/useStyle';
import { CarinaNavItem } from '@cvent/planner-navigation/types';
import { GlobalNav } from './GlobalNav';
import { EmptyRecentItemsStyles } from './style';

interface appSwitcherNavItem extends NavItem {
  icon: string;
}

type topNavProps = {
  hasLocalNav: boolean;
  isLocalNavOpen: boolean;
  toggleNav: () => void;
};

type EmptyRecentItemsProps = {
  message: string;
  testID: string;
};

type FormatTitleOption = {
  prepend?: string;
};

const formatTitle = (str?: string, options?: FormatTitleOption) => {
  if (str) {
    const replaced = str.toLowerCase().replaceAll(' ', '-').trim();
    return options?.prepend ? [options.prepend, replaced].join('-') : replaced;
  }
  return null;
};

const flattenGlobalNav = globalNavArray => {
  const flattenedArray = [];

  globalNavArray.forEach(item => {
    if (item?.url?.href) {
      flattenedArray.push(item);
    } else if (item.items) {
      const nestedItems = flattenGlobalNav(item.items);
      flattenedArray.push(...nestedItems);
    }
  });

  return flattenedArray;
};

const globalNavIcon = {
  [LIBRARY_ICON]: <Icon icon={UploadCloudIcon} />,
  [VIDEO_HUBS_ICON]: <Icon icon={SessionIcon} />,
  [STUDIO_ICON]: <Icon icon={ControlsIcon} />
};

const getNavIcon = (iconName: string, titleKey: string) => {
  if (iconName) {
    return <Icon icon={ICONS[iconName]} />;
  }
  if (titleKey) {
    return globalNavIcon[titleKey];
  }
  return <span />;
};

function EmptyRecentItems({ message, testID }: EmptyRecentItemsProps): JSX.Element {
  const emptyRecentItemsStyles = useStyle(EmptyRecentItemsStyles);
  return (
    <div css={emptyRecentItemsStyles.wrapper} {...injectTestId(testID)}>
      {getNavIcon('EventIcon', 'EventIcon')}
      <div css={emptyRecentItemsStyles.message}>{message}</div>
    </div>
  );
}

export function TopNavigation({ hasLocalNav, toggleNav, isLocalNavOpen }: topNavProps): JSX.Element {
  const { translate } = useTranslate();
  const {
    logo,
    page,
    appSwitcher = { items: [] },
    title,
    globalNav,
    helpMenu,
    user,
    userUtilities,
    recentItems,
    onSearch
  } = useNavigation();
  const { viewProfileText } = (user as UserDetails) || { viewProfileText: '' };
  const customUserUtilities = userUtilities as UserUtilities;
  const { isL, isXL, isM, isS, isDefaultSize } = useBreakpoints();
  const userPermission = useUserPermissions();
  const appSwitcherData = appSwitcher?.items ? appSwitcher?.items : [];

  if (isS || isM || isDefaultSize) {
    appSwitcherData.push(...flattenGlobalNav(globalNav));
  }

  const translatedLogo = {
    ...logo,
    title: translate(logo?.title)
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef();

  const getUserPropsLink = ({ item, children }) => (
    <NextLink href={item.url.href}>
      <a href={item.url.href}>{!children ? item.title : children}</a>
    </NextLink>
  );

  const getLogoLink = ({ item, children }) => (
    <NextLink href={item.url || ''} passHref>
      <span role="link" tabIndex={0} style={{ alignSelf: 'baseline', cursor: 'pointer' }}>
        {children}
      </span>
    </NextLink>
  );

  return (
    <>
      <TopNav testID="video-library-navigation" hasOverlay={isSearchOpen}>
        <Row>
          <Col
            width="content"
            flex={{
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'center'
            }}
            padding={0}
          >
            <Logo logo={translatedLogo} Link={getLogoLink} testID="video-library-navigation-logo" />
            <OnWhen m l xl>
              <Divider />
              <ProductTitle title={translate(title)} />
            </OnWhen>
          </Col>
          <Col
            width="fill"
            flex={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {(isL || isXL) && <GlobalNav globalNav={globalNav as unknown as Array<CarinaNavItem>} />}
          </Col>
          <Col
            width={100}
            padding={0}
            flex={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end'
            }}
          >
            <Search
              testID="video-library-navigation-search"
              accessibilityLabel={translate('video_library_navigation_search')}
              clearButtonAccessibilityLabel={translate('video_library_navigation_clear_search')}
              openFlyoutAccessibilityLabel=""
              searchInputAccessibilityLabel={translate('video_library_navigation_search')}
              searchTerm={searchTerm}
              inputRef={searchInputRef}
              onChange={(val: string) => {
                setSearchTerm(val);
              }}
              isSearchOpen={isSearchOpen}
              clearSearchTerm={() => {
                setSearchTerm('');
              }}
              setIsSearchOpen={setIsSearchOpen}
              onSearch={(): void => onSearch(searchTerm)}
            />
            <FlyoutMenu
              accessibilityLabel={translate('video_library_navigation_recent_items')}
              icon="RecentItemsIcon"
              testID="video-library-navigation-recent-items"
            >
              {closeMenu =>
                recentItems?.items.length > 0
                  ? recentItems.items.map((recentItem, index) => (
                      <FlyoutMenuItem
                        key={`recent-items-flyout-menu-item-${index.toString()}`}
                        testID={formatTitle(recentItem?.title, { prepend: 'video-library-navigation' })}
                      >
                        <NextLink href={recentItem?.url} passHref>
                          <a
                            role="menuitem"
                            onBlur={() => {
                              if (index === recentItems.items.length - 1) closeMenu();
                            }}
                            href={recentItem?.url as unknown as string}
                          >
                            {getNavIcon(recentItem.icon, recentItem.title)}
                            {recentItem.title}
                          </a>
                        </NextLink>
                      </FlyoutMenuItem>
                    ))
                  : recentItems?.items.length < 1 && (
                      <EmptyRecentItems
                        message={translate('video_library_navigation_recent_items_empty_items')}
                        testID="video-library-navigation-recent-items-empty-items"
                      />
                    )
              }
            </FlyoutMenu>
            <FlyoutMenu
              accessibilityLabel={translate('video_library_navigation_help_menu')}
              icon="HelpCircleIcon"
              testID="video-library-navigation-help-menu"
            >
              {closeMenu =>
                helpMenu?.items.map((utility: Utility, index) => (
                  <FlyoutMenuItem
                    key={`help-menu-flyout-menu-item-${index.toString()}`}
                    testID={formatTitle(utility?.title, { prepend: 'video-library-navigation' })}
                  >
                    <NextLink href={utility?.url?.href} passHref>
                      <a
                        role="menuitem"
                        onBlur={() => {
                          if (index === helpMenu.items.length - 1) closeMenu();
                        }}
                        href={utility?.url?.href}
                      >
                        {getNavIcon(utility.icon, utility.title)}
                        {utility.title}
                      </a>
                    </NextLink>
                  </FlyoutMenuItem>
                ))
              }
            </FlyoutMenu>
            <FlyoutMenu
              accessibilityLabel={translate('video_library_navigation_user_utility')}
              icon="PersonAccountIcon"
              testID="video-library-navigation-user-utility"
            >
              {closeMenu => (
                <>
                  <UserProfile
                    userData={user}
                    viewProfileText={viewProfileText}
                    Link={getUserPropsLink}
                    testID={formatTitle('video-library-navigation-user-profile')}
                  />
                  {customUserUtilities?.items.map((utility, index) => (
                    <FlyoutMenuItem
                      key={`user-utilities-flyout-menu-item-${index.toString()}`}
                      testID={formatTitle(utility?.title, { prepend: 'video-library-navigation' })}
                    >
                      <NextLink href={utility?.url?.href} passHref>
                        <a
                          role="menuitem"
                          onBlur={() => {
                            if (index === customUserUtilities.items.length - 1) closeMenu();
                          }}
                          href={utility?.url?.href}
                        >
                          {getNavIcon(utility.icon, utility.title)}
                          {utility.title}
                        </a>
                      </NextLink>
                    </FlyoutMenuItem>
                  ))}
                </>
              )}
            </FlyoutMenu>
            <AppSwitcher accessibilityLabel={appSwitcher.title}>
              {(closeMenu): JSX.Element => (
                <div>
                  {appSwitcherData?.map((item: appSwitcherNavItem, idx) => (
                    <AppSwitcherMenuItem key={item.title}>
                      <NextLink href={item.url?.href || ''} passHref>
                        <a
                          css={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                          }}
                          role="menuitem"
                          onBlur={(): void => {
                            if (idx === appSwitcherData.length - 1) closeMenu();
                          }}
                          key={item.title}
                          href={item.url?.href || ''}
                        >
                          <span>
                            {getNavIcon(item.icon, item.titleKey)}
                            {item.title}
                          </span>
                        </a>
                      </NextLink>
                    </AppSwitcherMenuItem>
                  ))}
                </div>
              )}
            </AppSwitcher>
          </Col>
        </Row>
      </TopNav>
      {page && userPermission?.VideoCenter && userPermission?.VideoLibrary && (
        <TitleBar>
          <Row>
            <Col
              width="fill"
              flex={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start'
              }}
            >
              {hasLocalNav && (
                <Button
                  onClick={toggleNav}
                  appearance="ghost"
                  variant="neutral-black"
                  accessibilityLabel="toggle local navigation"
                  onKeyPress={(e): void => {
                    if (e.key === 'Enter') toggleNav();
                  }}
                  icon={MenuIcon}
                  aria-expanded={isLocalNavOpen}
                />
              )}
              <PageTitle title={page} />
            </Col>
          </Row>
        </TitleBar>
      )}
    </>
  );
}

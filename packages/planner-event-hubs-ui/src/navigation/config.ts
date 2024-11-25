import { CarinaAppIcon, CarinaAppSwitcherStatus } from '@cvent/planner-navigation/types';

/**
 *  Configure your application specific nav here with static data.
 */
export const CarinaNavigationConfig = {
  id: 'planner-event-hubs-ui',
  title: 'theming_product_title',
  isRtl: false,
  search: {
    url: '',
    title: 'Search'
  },
  appSwitcher: {
    title: 'Developer Resources',
    defaultOpen: false,
    items: [
      {
        icon: CarinaAppIcon.PagesIcon,
        url: {
          href: 'https://technology.docs.cvent.org'
        },
        title: 'Cvent Technology',
        status: CarinaAppSwitcherStatus.Enabled
      },
      {
        icon: CarinaAppIcon.PagesIcon,
        url: {
          href: 'https://carina.core.cvent.org'
        },
        title: 'Carina Design System',
        status: CarinaAppSwitcherStatus.Enabled
      },
      {
        icon: CarinaAppIcon.PagesIcon,
        url: {
          href: 'https://nx.docs.cvent.org/'
        },
        title: 'Nx Framework',
        status: CarinaAppSwitcherStatus.Enabled
      },
      {
        icon: CarinaAppIcon.PagesIcon,
        url: {
          href: 'https://admin.core.cvent.org'
        },
        title: 'Developer Admin Portal',
        status: CarinaAppSwitcherStatus.Enabled
      }
    ]
  },
  logo: {
    src: '/cvent-logo-150x30.png',
    url: '/',
    title: 'theming_logo_alt'
  }
};

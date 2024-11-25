import { NavItem } from '@cvent/planner-navigation/navigationTypes';
import {
  CHANNELS_URL,
  VIDEO_HUB_INFORMATION_URL,
  VIDEO_HUB_BRANDING_URL,
  BANNERS_URL,
  VIDEO_HUB_NAV_ID,
  PRIVACY_POLICY_URL,
  VIDEO_HUB_FEATURES_URL,
  MEMBER_LIST_URL,
  VISITOR_PERMISSIONS_URL,
  TRACKING_CODES_URL,
  CUSTOM_REGISTRATION_URL,
  HUB_OVERVIEW_URL,
  MARKETING_URL,
  LANGUAGE_MANAGEMENT_URL,
  VIDEO_HUB_HOMEPAGE_URL,
  ACCESS_MANAGEMENT_URL,
  VIDEO_HIGHLIGHTS_URL
} from '@utils/constants';

/**
 * This is navigation map of the Media Hub pages
 */
export const videoHubsNavigationMap: NavItem = {
  id: VIDEO_HUB_NAV_ID,
  title: 'video_hub_top_nav',
  index: '0',
  items: [
    {
      id: HUB_OVERVIEW_URL,
      title: 'hub_overview_side_nav_text',
      index: '0',
      url: {
        href: HUB_OVERVIEW_URL
      },
      items: []
    },
    {
      id: VIDEO_HIGHLIGHTS_URL,
      title: 'video_highlights_side_nav_text',
      index: '0',
      url: {
        href: VIDEO_HIGHLIGHTS_URL
      },
      items: []
    },
    {
      id: VIDEO_HUB_INFORMATION_URL,
      title: 'information_side_nav',
      index: '0',
      url: {
        href: VIDEO_HUB_INFORMATION_URL
      },
      items: []
    },
    {
      id: VIDEO_HUB_BRANDING_URL,
      title: 'video_hub_side_nav_branding',
      index: '0',
      url: {
        href: VIDEO_HUB_BRANDING_URL
      },
      items: []
    },
    {
      id: VIDEO_HUB_HOMEPAGE_URL,
      title: 'video_hub_side_nav_homePage',
      index: '0',
      url: {
        href: VIDEO_HUB_HOMEPAGE_URL
      },
      items: []
    },
    {
      id: BANNERS_URL,
      title: 'banners_side_nav',
      index: '2',
      url: {
        href: BANNERS_URL
      },
      items: []
    },
    {
      id: CHANNELS_URL,
      title: 'channels_side_nav',
      index: '1',
      url: {
        href: CHANNELS_URL
      },
      items: []
    },
    {
      id: MARKETING_URL,
      title: 'marketing_side_nav_text',
      index: '1',
      url: {
        href: MARKETING_URL
      },
      items: [
        {
          id: LANGUAGE_MANAGEMENT_URL,
          title: 'language_management_side_nav_text',
          index: '0',
          url: {
            href: LANGUAGE_MANAGEMENT_URL
          },
          items: []
        },
        {
          id: TRACKING_CODES_URL,
          title: 'tracking_code_side_nav_text',
          index: '1',
          url: {
            href: TRACKING_CODES_URL
          },
          items: []
        }
      ]
    },
    {
      id: VIDEO_HUB_FEATURES_URL,
      title: 'features_side_nav_title',
      index: '0',
      url: {
        href: VIDEO_HUB_FEATURES_URL
      },
      items: []
    },
    {
      id: MEMBER_LIST_URL,
      title: 'member_list_title',
      index: '0',
      url: {
        href: MEMBER_LIST_URL
      },
      items: []
    },
    {
      id: ACCESS_MANAGEMENT_URL,
      title: 'access_management_side_nav_text',
      index: '1',
      url: {
        href: ACCESS_MANAGEMENT_URL
      },
      items: [
        {
          id: CUSTOM_REGISTRATION_URL,
          title: 'custom_registration_side_nav_text',
          index: '0',
          url: {
            href: CUSTOM_REGISTRATION_URL
          },
          items: []
        },
        {
          id: VISITOR_PERMISSIONS_URL,
          title: 'visitor_permissions_side_nav',
          index: '1',
          url: {
            href: VISITOR_PERMISSIONS_URL
          },
          items: []
        }
      ]
    },
    {
      id: VISITOR_PERMISSIONS_URL,
      title: 'visitor_permissions_side_nav',
      index: '1',
      url: {
        href: VISITOR_PERMISSIONS_URL
      },
      items: []
    },
    {
      id: PRIVACY_POLICY_URL,
      title: 'privacy_settings_page_title',
      index: '3',
      url: {
        href: PRIVACY_POLICY_URL
      },
      items: []
    },
    {
      id: CUSTOM_REGISTRATION_URL,
      title: 'custom_registration_side_nav_text',
      index: '0',
      url: {
        href: CUSTOM_REGISTRATION_URL
      },
      items: []
    }
  ]
};

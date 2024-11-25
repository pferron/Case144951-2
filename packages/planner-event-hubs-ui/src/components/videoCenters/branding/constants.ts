export const THEME_MOODS = {
  COLOR: 'Color',
  LIGHT: 'Light',
  NIGHT: 'Night'
};

export const THEME_MOOD_COLORS = {
  LIGHT: {
    MOOD: '#FFFFFF',
    BACKGROUND: '#F4F4F4'
  },
  NIGHT: {
    MOOD: '#212121',
    BACKGROUND: '#000000'
  }
};

export const DEFAULT_FONT_ID = '00000000-0000-0000-0000-000000000000';

/* The array define the elements present in top nav of events+
   - this order will be maintained in table displayed for nav items
   - item name should match with their property names in BrandingCustomNavigation
 */
export const TopNavItems = [
  {
    name: 'logo',
    label: 'custom_navigation_table_logo'
  },
  {
    name: 'loginRegistration',
    label: 'custom_navigation_table_login_registration'
  },
  {
    name: 'homePage',
    label: 'custom_navigation_table_home'
  },
  {
    name: 'channels',
    label: 'custom_navigation_table_channels'
  },
  {
    name: 'upcomingEvents',
    label: 'custom_navigation_table_upcoming_events'
  },
  {
    name: 'videos',
    label: 'custom_navigation_table_videos'
  }
];

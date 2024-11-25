// import { NavItem } from '@cvent/nx/navigation/navigationTypes';
import { NavItem } from '@cvent/planner-navigation/navigationTypes';
import { VIDEO_HUBS_URL, VIDEO_HUBS_ICON } from '@utils/constants';

export const globalNavMap: NavItem = {
  id: 'defaultGlobalNav',
  title: '',
  index: '0',
  items: [
    {
      id: VIDEO_HUBS_URL,
      url: {
        href: VIDEO_HUBS_URL
      },
      title: 'video_hub_top_nav',
      titleKey: VIDEO_HUBS_ICON,
      index: '1',
      items: []
    }
  ]
};

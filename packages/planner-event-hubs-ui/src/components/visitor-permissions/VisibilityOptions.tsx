import { GuestVisibility } from '@cvent/planner-event-hubs-model/types';

interface RadioOptions {
  label: string;
  value: string;
}
// MAUVE
// eslint-disable-next-line  @typescript-eslint/no-explicit-any
export const getGuestVisibilityOptions = (translate: any): Array<RadioOptions> => [
  {
    label: translate('visitor_permissions_visibility_public'),
    value: GuestVisibility.Public
  },
  {
    label: translate('visitor_permissions_visibility_video_playback_private'),
    value: GuestVisibility.VideoPlaybackPrivate
  },
  {
    label: translate('visitor_permissions_visibility_homepage_public'),
    value: GuestVisibility.HomepagePublic
  },
  {
    label: translate('visitor_permissions_visibility_private'),
    value: GuestVisibility.Private
  }
];

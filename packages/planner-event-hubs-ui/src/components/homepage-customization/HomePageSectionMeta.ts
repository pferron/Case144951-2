import { EventCalendar as EventCalendarType, PageSection } from '@cvent/planner-event-hubs-model/types';

// Add more based on the imports in the original file and update enums as needed
export enum PageSectionTemplates {
  EVENT_CALENDAR = 'EventCalendar',
  SINGLE_CHANNEL = 'SingleChannel',
  DEFAULT_VIDEOS = 'Videos',
  DEFAULT_CHANNELS = 'DefaultChannels',
  DEFAULT_UPCOMING_EVENTS = 'DefaultUpcomingEvents',
  DEFAULT_MY_EVENTS = 'MyEventCalendar',
  TEXT_IMAGE_TEMPLATE = 'TextImage'
}

export enum PageSectionTitles {
  EventCalendar = 'Event Calendar',
  SingleChannel = 'Channel',
  Videos = 'Videos',
  DefaultChannels = 'Channels List',
  DefaultUpcomingEvents = 'Upcoming Events',
  MyEventCalendar = 'My Events',
  TextImage = 'New Section'
}

export const PageSectionTitlesTranslationKeys = {
  EventCalendar: 'home_page_sections_add_section_event_calendar',
  SingleChannel: 'home_page_sections_add_section_channel',
  Videos: 'home_page_sections_add_section_videos',
  DefaultChannels: 'home_page_sections_add_section_channel_list',
  DefaultUpcomingEvents: 'home_page_sections_add_section_upcmg_events',
  MyEventCalendar: 'home_page_sections_add_section_my_events',
  TextImage: 'home_page_sections_add_section_new_section'
};

export enum ContentFilterType {
  NEW_VIDEOS = 'new-videos',
  TOP_VIDEOS = 'top-videos',
  CUSTOM = 'custom'
}

export enum newSectionTemplates {
  TextAndColorBackground = 'TextAndColor',
  InsetImage = 'InsetImage',
  FullImageBackground = 'FullImage'
}

export enum details {
  DESCRIPTION_CHANNEL = 'channel.description',
  DESCRIPTION_VIDEO = 'video.description',
  VIDEO_COUNT_CHANNEL = 'channel.video_count',
  TITLE_VIDEO = 'video.title',
  THUMBNAIL_VIDEO = 'video.thumbnail'
}
export enum layoutStyles {
  Tile = 'Tile',
  List = 'List'
}

export enum alignmentStyles {
  LEFT = 'Left',
  TOP = 'Top',
  RIGHT = 'Right',
  CENTER = 'Center'
}
export enum contentLimit {
  UP_TO_3 = 3,
  UP_TO_4 = 4,
  UP_TO_6 = 6,
  UP_TO_8 = 8
}

export enum timeFrame {
  LAST_7_DAYS = 'last-7-days',
  LAST_30_DAYS = 'last-30-days',
  LAST_90_DAYS = 'last-90-days',
  ALL_TIME = 'all-time'
}
/**
 * These are the default sections that may be shown on the homepage before customization support was added.
 * With all features enabled, the full possible list of sections is:
 * - UpcomingEvents (titled "Upcoming Events")
 * - Channels (titled "Channels")
 * - Videos (titled "What's New")
 * - My Events (titled "My Events") - This is the new default section shows only to logged in users
 * Banners could also appear on Homepage's before customization support but these are not impacted by homepage customization changes.
 */

export const DEFAULT_HOME_PAGE_SECTIONS: string[] = [
  PageSectionTemplates.DEFAULT_UPCOMING_EVENTS,
  PageSectionTemplates.DEFAULT_CHANNELS,
  PageSectionTemplates.DEFAULT_VIDEOS,
  PageSectionTemplates.DEFAULT_MY_EVENTS
];

// page section fields
export const PAGE_SECTION_TITLE = 'title';
export const PAGE_SECTION_TEXT_BODY = 'textBody';
export const PAGE_SECTION_LAYOUT = 'layout';
export const PAGE_SECTION_ALIGNMENT = 'alignment';
export const PAGE_SECTION_CONTENT_LIMIT_ON_INITIAL_LOAD = 'contentLimitOnInitialLoad';
export const PAGE_SECTION_VISIBLE_FIELDS = 'visibleFields';
export const PAGE_SECTION_FEATURED_CONTENT_TYPE = 'featuredContentType';
export const PAGE_SECTION_FEATURED_CONTENT_TYPE_ID = 'featuredContentTypeId';
export const PAGE_SECTION_CONTENT_FILTER_TYPE = 'contentFilterType';
export const PAGE_SECTION_CONTENT_FILTER_DATE_ABSTRACT = 'contentFilterDateAbstract';
export const PAGE_SECTION_CONTENT_IDS = 'contentIds';
export const PAGE_SECTION_BUTTON_TEXT = 'buttonText';
export const PAGE_SECTION_BUTTON_INTERNAL_TARGET = 'buttonInternalTarget';
export const PAGE_SECTION_BUTTON_EXTERNAL_TARGET = 'buttonExternalTarget';
export const PAGE_SECTION_BUTTON_TARGET_TYPE = 'buttonTargetType';
export const PAGE_SECTION_IMAGE_URL = 'imageUrl';
export const PAGE_SECTION_ORIGINAL_IMAGE_URL = 'originalImageUrl';
export const PAGE_SECTION_IMAGE_ALT_TEXT = 'imageAltText';
export const PAGE_SECTION_TEXT_COLOR = 'textColor';
export const PAGE_SECTION_IMAGE_FIELD = 'imageField';
export const PAGE_SECTION_SINGLE_CHANNEL_INACTIVE = ' (Not Live)';

// props that are commonly shared amongst all sections
export type PageSectionProps = {
  pageSection: PageSection & { rowName?: string };
  setIsPageEdited: (val: boolean) => void;
  onSectionUpdate: (section: PageSection, originalSectionId: string, sectionIdList?: string[]) => void;
  setShowSectionTemplate: (val: boolean) => void;
  setSelectedSection?: (val: string) => void;
  calendarListData?: EventCalendarType[];
  getUpdatedSectionIds: (section: PageSection) => { temporarySectionId: string; updatedSectionIds: string[] };
};

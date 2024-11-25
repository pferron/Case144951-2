// Navigation Url

import { AccessibilityLabels } from '@cvent/drag-and-drop-catalog/dist/types/accessibilityTypes';
import { CustomFont } from '@utils/fontUtils';

export const HOME_URL = '/';
export const LIBRARY_URL = '/';
export const LIBRARY_ICON = 'UploadCloudIcon';
export const VIDEO_HUBS_URL = '/eventsplus';
export const VIDEO_HUBS_ICON = 'SessionIcon';
export const STUDIO_URL = '/studio';
export const STUDIO_ICON = 'ControlsIcon';
export const MAX_EMAIL_DOMAINS_COUNT = 500;
export const SECONDS_IN_HOUR = 3600;
export const MINI_SECONDS_IN_DAY = 86400000;
export const MONTHS_LIMIT_FOR_DATE_FORMAT = 2;
export const CVENT_DOMAIN_VALUE = 'cvent';
export const ALIGNMENT_CENTER = 'center';
export const BRANDING_LOGO = 'logo';
export const BORDER_SLANTED = 'slanted';
export const VIDEO_HUB_NAV_ID = 'videoHub';
export const VIDEO_HUB_URL = '/eventsplus/[video-center]';
export const VIDEO_HUB_INFORMATION_URL = `${VIDEO_HUB_URL}/information`;
export const VIDEO_HUB_THEMING_URL = `${VIDEO_HUB_URL}/theming`;
export const HUB_OVERVIEW_URL = `${VIDEO_HUB_URL}/hub-overview`;
export const VIDEO_HUB_BRANDING_URL = `${VIDEO_HUB_URL}/branding`;
export const VIDEO_HUB_STATUS_LIVE = 'Live';
export const VIDEO_HUB_STATUS_ACTIVE = 'Active';
export const VIDEO_HUB_STATUS_INACTIVE = 'Inactive';
export const VIDEO_HUB_HOMEPAGE_URL = `${VIDEO_HUB_URL}/home-page`;
export const CHANNELS_URL = `${VIDEO_HUB_URL}/channels`;
export const VISITOR_PERMISSIONS_URL = `${VIDEO_HUB_URL}/visitor-permissions`;
export const MARKETING_URL = `${VIDEO_HUB_URL}/marketing`;
export const TRACKING_CODES_URL = `${MARKETING_URL}/tracking-codes`;
export const ACCESS_MANAGEMENT_URL = `${VIDEO_HUB_URL}/access-management`;
export const LANGUAGE_MANAGEMENT_URL = `${MARKETING_URL}/language-management`;
export const LANGUAGE_MANAGEMENT_TRANSLATION_EXPORT = '/api/translations/export';
export const CUSTOM_REGISTRATION_URL = `${VIDEO_HUB_URL}/custom-registration`;
export const VIDEO_HIGHLIGHTS_URL = `${VIDEO_HUB_URL}/video-engagement`;
export const ALLOW_CODE_SNIPPETS = 'AllowCodeSnippets';
export const ALLOW_GOOGLE_ANALYTICS = 'AllowGoogleAnalytics';
export const CODE_SNIPPETS_TITLE = 'tracking_code_side_nav_text';
export const VISITOR_PERMISSION_TITLE = 'visitor_permissions_side_nav';
export const REGISTRATION_PAGE_TITLE = 'custom_registration_side_nav_text';
export const PRIVACY_POLICY_URL = `${VIDEO_HUB_URL}/privacy`;
export const MEMBER_LIST_URL = `${VIDEO_HUB_URL}/members`;
export const CHANNEL_PAGE_RELATIVE_PATH = 'channels';
export const VIDEO_HUB_FEATURES_URL = `${VIDEO_HUB_URL}/features`;
export const VIDEO_HUB_MEMBER_PROFILE_URL = `${VIDEO_HUB_FEATURES_URL}/member-profile`;
export const VIDEO_HUB_PROFILE_PREVIEW_URL = `${VIDEO_HUB_MEMBER_PROFILE_URL}/preview`;
export const VIDEO_HUB_UPCOMING_EVENTS_URL = `${VIDEO_HUB_FEATURES_URL}/upcoming-events`;
export const CORE_CALENDARS_EXTERNAL_LINK = 'Subscribers/Events2/EventCalendar/EventCalendarGrid';
export const EVENT_HUB_IS_DEV_LOGIN_URL = '/login';
export const BANNERS_URL = `${VIDEO_HUB_URL}/banners`;
export const BANNERS_URL_CREATE = '/eventsplus/[video-center]/banners/create';
export const BANNERS_LIST_LIMIT = 20;
export const BANNER_URL = `${BANNERS_URL}/[banner]`;
export const BANNERS_PATH_PARAM = 'banner';
export const BANNERS_PATH_PARAM_KEY = '[banner]';

// path param constant
export const VIDEO_HUB_PATH_PARAM_KEY = '[video-center]';
export const EVENTS_PLUS_PATH_PARAM = 'eventsplus';
export const VIDEO_HUB_PATH_PARAM = 'video-center';
export const MEMBER_ID = 'member-id';
export const ADDITIONAL_CALENDAR_ID = 'additionalCalendarStub';

export const TOP_NAVIGATION_Z_INDEX = 100;
export const CHANNEL_PAGE_HEADER_Z_INDEX = 5;
export const CHANNEL_PAGE_FLYOUT_Z_INDEX = 1;
export const CHANNEL_PAGE_MODAL_Z_INDEX = 110;
export const MAX_ROWS_IN_CONTACT_GROUP_TYPE_TABLE = 8;
export const MAX_CONTACT_GROUP_FETCH_LIMIT = 100;
export const MAX_CONTACT_GROUP_SAVE_LIMIT = 200;
export const MAX_CONTACTS_FETCH_LIMIT = 100;
export const CONTACT_GROUP_TYPE = {
  STANDARD: 'STANDARD',
  BLACKLIST: 'BLACKLIST'
};

// center
export const CENTER_TITLE_MAX_LENGTH = 255;
export const CENTER_NAME_MAX_LENGTH = 255;
export const CENTER_EMAIL_MAX_LENGTH = 255;
export const VIDEO_CENTER_LIST_LIMIT = 20;
export const CENTER_CUSTOM_DOMAIN_MAX_LENGTH = 50;

// channel
export const CHANNEL_NAME_MAX_LENGTH = 100;
export const CHANNEL_DESCRIPTION_MAX_LENGTH = 1000;
export const CHANNEL_IMAGE_FILE_NAME_MAX_LENGTH = 100;

// library
export const MANAGE_STORAGE_USED_WARNING_LIMIT = 90;
export const GB_TO_BYTES_CONVERSION_FACTOR = 1000 * 1000 * 1000;

// catalogs
export const DEFAULT_SECTION_NAME = 'More Videos';
export const CATALOG_TYPE_LIST = 'LIST';
export const CATALOG_TYPE_SECTIONS = 'SECTIONS';
export const CUSTOM_SECTION_TYPE = 'CUSTOM';
export const DEFAULT_SECTION_TYPE = 'DEFAULT';
export const CATALOG_OWNER = 'VIDEO_HUB';
export const TITLE = 'displayName';
export const DURATION = 'duration';
export const MAX_ITEM_PER_PAGE_ON_SELECT_VIDEO_MODAL = 25;
export const SECTION_NAME_MAX_LENGTH = 100;
export const PRIVACY_COOKIE_TEXT_FIELD_LENGTH = 100;
export const CREATE_SECTION_BANNER_VIDEO_LIMIT = 20;

// experiments
// export const VIDEO_HUB = 'video_hub';
export const EXPERIMENT_LIST = [];

// Channel list page filter api constants
export const STATUS = 'status';

export const CHANNEL_TABLE_LABELS: AccessibilityLabels = {
  keyBoardAccessibilityLabels: {
    section: {
      focus: '',
      selected: '',
      deselected: '',
      moved: ''
    },
    item: {
      focus: '',
      selected: 'channel_list_section_item_selected',
      deselected: 'channel_list_section_item_deselected',
      moved: 'channel_list_section_item_moved',
      sectionChanged: ''
    }
  },
  dragHandleButton: 'channel_list_section_drag_handle_button',
  chevronButton: ''
};

export enum TextContent {
  YES = 'Yes',
  NO = 'No'
}

// appFeature/experiment Constant
export const EVENTS_PLUS_FEATURE_VERSION = 'events_plus_feature_version';
export const PRIVACY_FEATURE = 'privacyFeature';
export const LANGUAGE_MANAGEMENT_FEATURE = 'languageManagementFeature';
export const SSO_FEATURE = 'singleSignOnFeature';
export const HOMEPAGE_CUSTOMIZATION_FEATURE = 'homepageCustomizationFeature';
export const MEMBER_LIST_FEATURE = 'memberListFeature';
export const HUB_OVERVIEW_FEATURE = 'hubOverviewFeature';
export const RENOVATE_HUB_OVERVIEW_FEATURE = 'renovateHubOverviewFeature';

export const ACCOUNT_STUB = '00000000000000000000000000000000';
export const IMAGE_MAXIMUM_SIZE_IN_MB = 5;
export const IMAGE_MAXIMUM_SIZE = IMAGE_MAXIMUM_SIZE_IN_MB * 1024 * 1024;
export const IMAGE_SIZE_UPPER_LIMIT = (IMAGE_MAXIMUM_SIZE_IN_MB + 0.1) * 1024 * 1024;
export const ACCEPTED_FILE_FORMAT = '.jpg, .jpeg, .png, .gif';
export const ACCEPTED_FILE_FORMAT_FOR_FILE_UPLOAD = ['jpg', 'png', 'jpeg', 'gif'];
export const BACKGROUND_IMAGE_ACCEPTED_FILE_FORMAT = '.jpg, .jpeg, .png';

export const ACCEPTED_FAVICON_FILE_FORMAT = '.ico';
export const FILTER_CHANNEL_MAX_PREDICATE_ALLOWED = 34;
export const GET_EVENT_LIMIT = 35;
export const GET_EXHIBITOR_LIMIT = 25;
export const GET_SESSIONS_LIMIT = 35;
export const GET_WEBCASTS_LIMIT = 25;
export const GET_PLAYERS_LIMIT = 25;
export const UTM_KEY_MAX_LENGTH = 50;
export const UTM_VALUE_MAX_LENGTH = 100;
export const UTM_FORBIDDEN_KEY = 'cvt_cal';
export const PREFILLED_PARAMS = ['centerId', 'c', 'originSourceType'];

// filter query param constants
export const ID_STRING = 'id';

// Video filter api constants
export const VIDEO_TITLE = 'title';
export const VIDEO_STATUS = 'status';
export const VIDEO_STATUS_AVAILABLE = 'Available';
export const VIDEO_TOTAL_SIZE = 'totalSize';
export const VIDEO_SOURCE_PROVIDER = 'sourceProvider';
export const VIDEO_LAST_MODIFIED = 'lastModified';
export const VIDEO_CVENT_SOURCE_PROVIDER = 'CVENT_VIDEO';
export const VIDEO_TAGS = 'tags';
export const VIDEO_ORIGINAL_SAVED_TAG = 'original-saved';
export const VIDEO_REPLACED_TAG = 'replaced';
export const VIDEO_SAVED_TAG = 'saved';
export const VIDEO_SAVED_AS_TAG = 'saved-as';
export const VIDEO_SAVE_TAGS = [VIDEO_REPLACED_TAG, VIDEO_SAVED_TAG];
export const MIN_VIDEO_CHAR_FOR_SEARCH = 3;

// video library polling constants
export const MAX_POLLING_INTERVAL = 10_000;
export const MIN_POLLING_INTERVAL = 500;
export const EXPONENTIAL_INCREASE_MULTIPLIER = 2;
export const LIMIT_PER_PAGE = 25;

export const WEBCAST_ID_STRING = 'webcast.id';
export const SESSION_ID_STRING = 'session.id';
// member list pagination constants
export const MIN_CHAR_FOR_SEARCH = 1;
export const MEMBER_LIST_PAGE_LIMIT = 20;

// Query para constant
export const TAB = 'tab';

// code snippet list table
export const MAX_ROWS_IN_CODE_SNIPPET_TABLE = 3;
export const MAX_TRACKING_PARAMETERS = 15;

// New from VHU
// experiments

export const HOME = 'home';

// paths
export const CENTER_PATH_PARAM_KEY = 'centerId';
export const CHANNELS_PATH_PARAM = 'channels';
export const CHANNEL_PATH_PARAM = 'channel';
export const CHANNELS_PATH_PARAM_KEY = 'channelId';
export const PROFILE_PATH_PARAM = 'profile';
export const UPCOMING_EVENTS_PATH_PARAM = 'upcomingevents';
export const UPCOMING_EVENTS_PATH_PARAM_KEY = 'event';
export const VIDEOS_PATH_PARAM = 'videos';
export const VIDEOS_PATH_PARAM_KEY = 'videoId';
export const YOUR_EVENTS_PATH_PARAM = 'your-events';
export const VIDEOS_SPEAKER_PATH_PARAM = 'speakers';
export const SPEAKERS_PATH_PARAM_KEY = 'speakerId';
export const LANGUAGE_PATH_PARAM_KEY = 'locale';

export const VIDEO_CENTER_URL = `/[${CENTER_PATH_PARAM_KEY}]`;
export const CHANNEL_URL = `${CHANNELS_URL}/${CHANNELS_PATH_PARAM_KEY}`;
export const PROFILE_URL = `${VIDEO_CENTER_URL}/${PROFILE_PATH_PARAM}`;
export const UPCOMING_EVENTS_URL = `${VIDEO_CENTER_URL}/${UPCOMING_EVENTS_PATH_PARAM}`;
export const UPCOMING_EVENT_URL = `${UPCOMING_EVENTS_URL}/[${UPCOMING_EVENTS_PATH_PARAM_KEY}]`;
export const VIDEOS_URL = `${VIDEO_CENTER_URL}/${VIDEOS_PATH_PARAM}`;
export const VIDEO_URL = `${VIDEOS_URL}/[${VIDEOS_PATH_PARAM_KEY}]`;
export const YOUR_EVENTS_URL = `${VIDEO_CENTER_URL}/${YOUR_EVENTS_PATH_PARAM}`;
export const SPEAKER_URL = `${VIDEOS_URL}/${VIDEOS_SPEAKER_PATH_PARAM}`;
export const SPEAKER_PAGE_URL = `${VIDEOS_URL}/${VIDEOS_SPEAKER_PATH_PARAM}/[${SPEAKERS_PATH_PARAM_KEY}]`;
// app features
export const PROFILE_FEATURE = 'profileFeature';
export const YOUR_EVENTS_FEATURE = 'yourEventsFeature';

// planner side feature tiles
export const PROFILE_SETUP = 'PROFILE_SETUP';
export const YOUR_EVENTS_TILE = 'YOUR_EVENTS';
export const UPCOMING_EVENTS = 'UPCOMING_EVENTS';

// navigation
export const REDIRECT_URL_NOT_ACCESSIBLE = 'url_not_accessible';
export const REDIRECT_INVALID_MAGIC_LINK = 'invalid_magic_link';
export const REDIRECT_LOGIN_REQUIRED = 'login_required';
export const YOUR_DETAILS_NAV_ID = 'Your Details';
export const SERVER_ERROR_MESAGE = 'Internal server error';

// cookie banner
export const MAX_COOKIE_BANNER_CONSENT_ENTRIES = 10;
export const ACCEPT_ALL_COOKIE = 'cvt_cookieconsent_vc';
export const ACCEPT_ESSENTIAL_COOKIE = 'cvt_essentialcookieconsent_vc';
export const BANNER_ZINDEX = 10;

// error strings
export const VIDEO_CENTER_ID_NULL = 'Video Center ID cannot be null.';
export const CHANNEL_ID_NULL = 'Channel ID cannot be null.';
export const VIDEO_ID_NULL = 'Video ID cannot be null.';
export const UNAUTH_ERROR_MESSAGE = 'Not authorized';
export const INCORRECT_FILTER = 'Filter cannot be null';
export const BAD_REQUEST_ERROR_MESSAGE = 'Bad Request';

export const IS_PLANNER_ROLE = 'IS_PLANNER';

// status codes
export const UNAUTHORIZED_ERROR_CODE = '401';
export const CONFLICT_ERROR_CODE = '409';
export const UNPROCESSABLE_ENTITY_ERROR_CODE = '422';
export const BAD_REQUEST_ERROR_CODE = '400';
export const FORBIDDEN_ERROR_CODE = '403';
export const NOT_FOUND_ERROR_CODE = '404';
export const INTERNAL_SERVER_ERROR_CODE = '500';

// Filter constants
export const ASC = 'ASC';
export const DESC = 'DESC';
export const AND = ' and ';
export const OR = ' or ';

// channel constants
export const CHANNEL_LIST_LIMIT = 20;
export const CHANNEL_TITLE = 'title';
export const CHANNEL_ORDER = 'order';
export const CHANNEL_FILTER_ACTIVE_STATUS = "status eq 'ACTIVE'";

// member list constants
export const MEMBER_FIRST_NAME = 'firstName';
export const MEMBER_JOB_TITLE = 'jobTitle';
export const MEMBER_COMPANY_NAME = 'companyName';
export const MEMBER_EMAIL_ADDRESS = 'emailAddress';
export const MAX_WIDTH = 650;
export const MEMBER_REGISTRATION_DATE = 'registrationDate';

// video constants
export const VIDEO_LIST_LIMIT = 6;
export const VIDEO_CREATED_DATE = 'created';
export const VIDEO_FILTER_VIDEO_CENTER = 'catalogs.videoCenters eq ';
export const VIDEO_CHANNEL_STATUS_ACTIVE = "catalogs.channel.status eq 'ACTIVE'";
export const VIDEO_FILTER_CREATED_DATE_FILTER = 'created';
export const CHANNEL_ID_FILTER = 'catalogs.channel.id eq';
export const VIDEO_LIST_SEARCH_TITLE_FILTER = 'title contains ';
export const VIDEO_LIST_SEARCH_DESC_FILTER = 'description contains ';
export const VIDEO_LIST_FILTER_AVAILABLE_STATUS = "status eq 'Available'";
export const VIDEO_LIST_TAG_FILTER_REPLACED_VIDEO = "tags ne 'original-saved'";
export const ON_DEMAND = 'Recording';
export const CHAPTERS = 'chapters';

// Video engagement
export const VIDEO_TITLE_COLUMN = 'videoTitle';
export const VIDEO_VIEWS_COLUMN = 'views';
export const VIDEO_DURATION_COLUMN = 'videoDuration';
export const FIRST_NAME = 'firstName';
export const LAST_NAME = 'lastName';

// Login Form constants
export const FIRST_NAME_MAX_LENGTH = 30;
export const LAST_NAME_MAX_LENGTH = 50;
export const EMAIL_MAX_LENGTH = 80;

// cookies
export const AUTH_COOKIE_MAX_AGE = 24 * 60 * 60; // 24 Hours
export const REFRESH_COOKIE_NAME = 'x-cvent-refresh';
export const REFRESH_COOKIE_MAX_AGE = 30 * 24 * 60 * 60; // 30 days
export const CSRF_TOKEN = 'csrfToken';
export const IS_LOGIN_SUCCESSFUL_FACT_FIRED = 'isLoginSuccessfulFactFired';
// Mouse event
export const HOVER = 'HOVER';
export const CLICK = 'CLICK';
export const SCROLL = 'scroll';
export const FOCUS = 'focus';

// Cache TTL
export const DEFAULT_CACHE_TTL = 300; // 5 mins
export const SUBSCRIPTION_TOKEN_TTL = 60; // 1 min
export const ACCOUNT_BEARER_CACHE_TTL = 23 * 60 * 60; // 23 hrs

// Member Profile
export const PROFILE_MOBILE_WIDTH = 905;
export const PREFIX_MAX_LENGTH = 30;
export const FIRSTNAME_MAX_LENGTH = 30;
export const LASTNAME_MAX_LENGTH = 30;
export const DESIGNATION_MAX_LENGTH = 30;
export const PRONOUNS_MAX_LENGTH = 30;
export const TITLE_MAX_LENGTH = 100;
export const COMPANY_MAX_LENGTH = 100;
export const MAX_PROFILE_IMAGE_SIZE = 2 * 1024 * 1024;

// Your events
export const EVENT_TYPE_INPERSON = 'InPerson';
export const EVENT_TYPE_VIRTUAL = 'Virtual';
export const EVENT_TYPE_HYBRID = 'Hybrid';
export const EVENT_TYPE_INPERSON_ID = 0;
export const EVENT_TYPE_VIRTUAL_ID = 1;
export const EVENT_TYPE_HYBRID_ID = 2;
export const PAST_EVENT = 'past';
export const UPCOMING_EVENT = 'upcoming';
export const PAGE_SIZE = 10;

// Hub Overview
export const TOTAL_VIEWS_TAB_ORDER = '1';
export const TOTAL_REGISTRATION_TAB_ORDER = '2';
export const AVERAGE_DURATION_TAB_ORDER = '3';
export const DAYS_IN_WEEK = 7;
export const DEVICE_TYPE = 'Device_Type';
export const DESKTOP_DEVICE_TYPE = 'Desktop';
export const MOBILE_DEVICE_TYPE = 'Mobile';
export const TABLET_DEVICE_TYPE = 'Tablet';

export const FAVICON = 'Favicon';
export const LOGO = 'Logo';

export const DEFAULT_FONT_FAMILY_WITH_RUBIK = "'Rubik','Helvetica','Arial'";
export const DEFAULT_FONT_FAMILY = "'Helvetica','Arial'";

export const DEFAULT_FONT_FAMILY_HELVETICA = 'Helvetica';
export const DEFAULT_FALLBACK_FONT_ARIAL = 'Arial';

export const HELVETICA_BLOCKS_FONT: CustomFont = {
  name: DEFAULT_FONT_FAMILY_HELVETICA,
  fallbackFont: DEFAULT_FALLBACK_FONT_ARIAL,
  styles: []
};

export const EventLicenseType = {
  1: 'No License',
  2: 'Professional',
  3: 'Enterprise',
  33: 'Express',
  35: 'PayGo',
  44: 'Self-Service (Macintosh)'
};

export const duplicateKeyChoices = {
  EXISTING: 'use-existing-parameter',
  CUSTOM: 'use-custom-parameter'
};

// Language Management
export const INITIAL_PAGE_LIMIT = 25;
export const INITIAL_PAGE_SELECTED = 1;

export const CUSTOM_REGISTRATION_IMAGE_FILE_NAME_MAX_LENGTH = 100;
export const CUSTOM_REGISTRATION_IMAGE_MAXIMUM_SIZE = IMAGE_MAXIMUM_SIZE_IN_MB * 1024 * 1024;
export const CUSTOM_REGISTRATION_IMAGE_MAXIMUM_SIZE_IN_MB = 5;

export const CUSTOM_REGISTRATION_MAX_WIDTH_IMAGE = 20;

export const TEXT_ID = 'Text ID';
export const TEXT_TYPE = 'Text Type';
export const YOUR_TEXT = 'Your Text';
export const BASE_TEXT = 'Base Text';
export const ERROR_MESSAGE = 'Errors';

// Custom Homepage
export const HC_UP_EVENTS_DISPLAY_NAME_LIMIT = 100;
export const HC_UP_EVENTS_DESCRIPTION_LIMIT = 300;
export const HC_EVENT_CALENDAR_DESCRIPTION_LIMIT = 400;
export const HC_NEW_SECTION_IMAGE_ALT_TEXT_LIMIT = 200;
export const HC_NEW_SECTION_TITLE_LIMIT = 60;
export const HC_NEW_SECTION_DESCRIPTION_LIMIT = 120;
export const HC_NEW_SECTION_BUTTON_TEXT_LIMIT = 35;
export const ORGANIZATION_ID_LIMIT = 255;
export const HC_SINGLE_CHANNEL_MAX_VIDEO_LIMIT = 3;
export const HC_VIDEOS_DISPLAY_NAME_LIMIT = 60;
export const HC_YOUR_EVENTS_DISPLAY_NAME_LIMIT = 60;
export const HC_CHANNELS_LIST_DISPLAY_NAME_LIMIT = 60;

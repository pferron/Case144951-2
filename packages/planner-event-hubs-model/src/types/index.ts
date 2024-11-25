import type { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /**
   * Adding scalar types which are not built in and need to be defined explicitly
   * The AWSDate scalar type represents a valid extended ISO 8601 Date string. In other words, this scalar
   * type accepts date strings of the form YYYY-MM-DD. This scalar type can also accept time zone offsets.
   * For example, 1970-01-01Z, 1970-01-01-07:00 and 1970-01-01+05:30 are all valid dates. The time zone
   * offset must either be Z (representing the UTC time zone) or be in the format ±hh:mm:ss. The seconds
   * field in the timezone offset will be considered valid even though it is not part of the ISO 8601 standard.
   */
  AWSDate: any;
  /**
   * The AWSDateTime scalar type represents a valid extended ISO 8601 DateTime string.
   * In other words, this scalar type accepts datetime strings of the form YYYY-MM-DDThh:mm:ss.sssZ. The field after
   * the seconds field is a nanoseconds field. It can accept between 1 and 9 digits. The seconds and nanoseconds
   * fields are optional (the seconds field must be specified if the nanoseconds field is to be used). The time zone
   * offset is compulsory for this scalar. The time zone offset must either be Z (representing the UTC time zone) or
   * be in the format ±hh:mm:ss. The seconds field in the timezone offset will be considered valid even though it is
   * not part of the ISO 8601 standard.
   */
  AWSDateTime: any;
  /**
   * The AWSEmail scalar type represents an Email address string that complies with RFC 822. For example, username@example.com
   *  is a valid Email address.
   */
  AWSEmail: any;
  /** The AWSIPAddress scalar type represents a valid IPv4 or IPv6 address string. */
  AWSIPAddress: any;
  /**
   * The AWSJSON scalar type represents a JSON string that complies with RFC 8259. Maps like {"upvotes": 10},
   * lists like [1,2,3], and scalar values like "AWSJSON example string", 1, and true are accepted as valid JSON.
   * They will automatically be parsed and loaded in the resolver mapping templates as Maps, Lists, or Scalar values
   * rather than as the literal input strings. Invalid JSON strings like {a: 1}, {'a': 1} and Unquoted string will
   * throw GraphQL validation errors.
   */
  AWSJSON: any;
  /**
   * The AWSPhone scalar type represents a valid Phone Number. Phone numbers are serialized and deserialized as Strings.
   * Phone numbers provided may be whitespace delimited or hyphenated. The number can specify a country code at the
   * beginning but this is not required.
   */
  AWSPhone: any;
  /**
   * The AWSTimestamp scalar type represents the number of seconds that have elapsed since 1970-01-01T00:00Z.
   * Timestamps are serialized and deserialized as numbers. Negative values are also accepted and these represent the
   * number of seconds till 1970-01-01T00:00Z.
   */
  AWSTimestamp: any;
  /**
   * The AWSURL scalar type represents a valid URL string. The URL may use any scheme and may also be a local URL
   * (Ex: <http://localhost/>). URLs without schemes are considered invalid. URLs which contain double slashes are
   * also considered invalid.
   */
  AWSURL: any;
  DateTime: any;
  JSON: any;
};

export type AccountCodeSnippet = {
  __typename?: 'AccountCodeSnippet';
  codeSnippetDataTagCode: Scalars['String'];
  codeSnippetId: Scalars['String'];
  codeSnippetName: Scalars['String'];
  codeSnippetStatus: CodeSnippetStatus;
  codeSnippetValue: Scalars['String'];
  isDropCodeSnippetToCookieBannerTied: Scalars['Boolean'];
};

export type AccountConfigBlade = {
  __typename?: 'AccountConfigBlade';
  AllowVideosBlade?: Maybe<Scalars['Boolean']>;
};

export type AccountConfigEventFeatures = {
  __typename?: 'AccountConfigEventFeatures';
  GeneralFeatures?: Maybe<AccountConfigEventFeaturesGeneral>;
};

export type AccountConfigEventFeaturesGeneral = {
  __typename?: 'AccountConfigEventFeaturesGeneral';
  LicenseTypeId?: Maybe<Scalars['Int']>;
};

export type AccountConfigFeatures = {
  __typename?: 'AccountConfigFeatures';
  Blades?: Maybe<AccountConfigBlade>;
  GeneralFeatures?: Maybe<AccountConfigGeneral>;
};

export type AccountConfigGeneral = {
  __typename?: 'AccountConfigGeneral';
  AIWritingAssistantEnabled?: Maybe<Scalars['Boolean']>;
  AllowCodeSnippets?: Maybe<Scalars['Boolean']>;
  AllowCustomFonts?: Maybe<Scalars['Boolean']>;
  AllowGoogleAnalytics?: Maybe<Scalars['Boolean']>;
  AllowOAuth?: Maybe<Scalars['Boolean']>;
};

export type AccountConfigInternationalSettings = {
  __typename?: 'AccountConfigInternationalSettings';
  DefaultCultureCode?: Maybe<Scalars['String']>;
  DefaultLanguageId?: Maybe<Scalars['Int']>;
};

export type AccountConfigVideoManagementFeatures = {
  __typename?: 'AccountConfigVideoManagementFeatures';
  VideoCenterFlag?: Maybe<Scalars['Boolean']>;
  VideoStorageSize?: Maybe<Scalars['Int']>;
};

export type AccountDetails = {
  __typename?: 'AccountDetails';
  AccountCompanyName?: Maybe<Scalars['String']>;
  AccountId?: Maybe<Scalars['Int']>;
  AccountName?: Maybe<Scalars['String']>;
  AccountStub?: Maybe<Scalars['String']>;
};

export type AccountLocale = {
  __typename?: 'AccountLocale';
  IsDefault?: Maybe<Scalars['Boolean']>;
  Locale?: Maybe<Locale>;
};

export type AccountSnapshot = {
  __typename?: 'AccountSnapshot';
  accountStub?: Maybe<Scalars['String']>;
  customFonts?: Maybe<Array<Maybe<CustomFont>>>;
  id?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
};

export type AccountVideoCenterConfig = {
  __typename?: 'AccountVideoCenterConfig';
  AccountFeatures?: Maybe<AccountConfigFeatures>;
  EventFeatures?: Maybe<AccountConfigEventFeatures>;
  InternationalSettings?: Maybe<AccountConfigInternationalSettings>;
  VideoManagementFeatures?: Maybe<AccountConfigVideoManagementFeatures>;
};

export enum AllowTermsEdit {
  Allowed = 'ALLOWED',
  NotAllowed = 'NOT_ALLOWED'
}

export type AllowedContactGroups = {
  __typename?: 'AllowedContactGroups';
  contactGroups: Array<Maybe<Scalars['String']>>;
};

export type AllowedContactTypes = {
  __typename?: 'AllowedContactTypes';
  contactTypes: Array<Maybe<Scalars['String']>>;
};

export type AllowedDomains = {
  __typename?: 'AllowedDomains';
  emailDomains: Array<Maybe<Scalars['String']>>;
};

export enum AllowedEmailDomain {
  AnyDomain = 'ANY_DOMAIN',
  BusinessDomains = 'BUSINESS_DOMAINS',
  CustomDomains = 'CUSTOM_DOMAINS'
}

export type AnalyticsData = {
  __typename?: 'AnalyticsData';
  perDay?: Maybe<Array<AnalyticsDataItem>>;
  perMonth?: Maybe<Array<AnalyticsDataItem>>;
  perWeek?: Maybe<Array<AnalyticsDataItem>>;
  serverError?: Maybe<Scalars['Boolean']>;
  total?: Maybe<Scalars['Float']>;
};

export type AnalyticsDataItem = {
  __typename?: 'AnalyticsDataItem';
  date: Scalars['DateTime'];
  value: Scalars['Float'];
};

export type AnalyticsInput = {
  endDate: Scalars['DateTime'];
  hubId: Scalars['ID'];
  pipeline?: InputMaybe<Scalars['String']>;
  startDate: Scalars['DateTime'];
};

/** App Feature */
export type AppFeature = {
  __typename?: 'AppFeature';
  enabled: Scalars['Boolean'];
  experimentVersion?: Maybe<Scalars['String']>;
  name: Scalars['String'];
};

/**
 * A single app feature to resolve. Defines the backing experiment and the version
 * the variant must on or above for the feature to be enabled.
 */
export type AppFeatureInput = {
  experimentName: Scalars['String'];
  featureVersion: Scalars['Int'];
  name: Scalars['String'];
};

export type AppSwitcher = {
  __typename?: 'AppSwitcher';
  defaultOpen?: Maybe<Scalars['Boolean']>;
  id?: Maybe<Scalars['String']>;
  items?: Maybe<Array<Maybe<UserProduct>>>;
  title?: Maybe<Scalars['String']>;
};

export enum ApplicableOn {
  AllPages = 'ALL_PAGES',
  Initialization = 'INITIALIZATION'
}

export enum BackGroundStyle {
  Default = 'DEFAULT',
  Image = 'IMAGE'
}

export type BackgroundImagesInput = {
  backgroundImageAltText?: InputMaybe<Scalars['String']>;
  backgroundImageUrl?: InputMaybe<Scalars['String']>;
  backgroundOriginalImageUrl?: InputMaybe<Scalars['String']>;
  hubId: Scalars['ID'];
  newBackgroundImageUrl?: InputMaybe<Scalars['String']>;
  newBackgroundOriginalImageUrl?: InputMaybe<Scalars['String']>;
};

export type BannerAssociation = {
  banner: Scalars['String'];
  displayOrder?: InputMaybe<Scalars['Int']>;
};

export type BannerAssociationCreate = {
  bannerAssociation?: InputMaybe<Array<InputMaybe<BannerAssociation>>>;
  centerId: Scalars['String'];
  entityId: Scalars['String'];
  entityType: Scalars['String'];
};

export type BannerAssociationPaging = {
  __typename?: 'BannerAssociationPaging';
  data: Array<Maybe<ExistingBannerAssociationWithBanner>>;
  paging: Paging;
};

export type BannerAssociationSearch = {
  bannerId?: InputMaybe<Scalars['String']>;
  centerId: Scalars['String'];
  entityId?: InputMaybe<Scalars['String']>;
  entityType?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  token?: InputMaybe<Scalars['String']>;
};

export type BannerButton = {
  __typename?: 'BannerButton';
  enabled: Scalars['Boolean'];
  internalTarget?: Maybe<Scalars['String']>;
  target?: Maybe<Scalars['String']>;
  targetType?: Maybe<Scalars['String']>;
  text?: Maybe<Scalars['String']>;
};

export type BannerButtonInput = {
  enabled: Scalars['Boolean'];
  internalTarget?: InputMaybe<Scalars['String']>;
  target?: InputMaybe<Scalars['String']>;
  targetType?: InputMaybe<Scalars['String']>;
  text?: InputMaybe<Scalars['String']>;
};

export type BannerFilter = {
  centerId: Scalars['String'];
  filterInput?: InputMaybe<FilterInput>;
};

export type BannerHubSearch = {
  bannerId: Scalars['String'];
  hubId: Scalars['String'];
};

export type BannerIdAssociation = {
  banner: IdBanner;
  displayOrder?: InputMaybe<Scalars['Int']>;
};

export type BannerIdAssociationCreate = {
  bannerAssociation?: InputMaybe<Array<InputMaybe<BannerIdAssociation>>>;
  centerId: Scalars['String'];
  entityId: Scalars['String'];
  entityType: Scalars['String'];
};

export type BannerPagingResponse = {
  __typename?: 'BannerPagingResponse';
  data: Array<Maybe<ExistingBanner>>;
  paging: Paging;
};

export type BannerSearch = {
  hubId: Scalars['String'];
  limit?: InputMaybe<Scalars['Int']>;
  token?: InputMaybe<Scalars['String']>;
};

export type BannerText = {
  __typename?: 'BannerText';
  alignment?: Maybe<Scalars['String']>;
  body?: Maybe<Scalars['String']>;
  color?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
};

export type BannerTextInput = {
  alignment?: InputMaybe<Scalars['String']>;
  body?: InputMaybe<Scalars['String']>;
  color?: InputMaybe<Scalars['String']>;
  title?: InputMaybe<Scalars['String']>;
};

export type BannerUpdate = {
  button?: InputMaybe<BannerButtonInput>;
  centerId: Scalars['String'];
  id: Scalars['ID'];
  imageAlignment?: InputMaybe<Scalars['String']>;
  imageAltText?: InputMaybe<Scalars['String']>;
  imageRelativePath?: InputMaybe<Scalars['String']>;
  imageUrl?: InputMaybe<Scalars['String']>;
  layout?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  newImageUrl?: InputMaybe<Scalars['String']>;
  newOriginalImageUrl?: InputMaybe<Scalars['String']>;
  originalImageUrl?: InputMaybe<Scalars['String']>;
  text?: InputMaybe<BannerTextInput>;
};

export type BannersSearch = {
  bannerId: Scalars['String'];
  centerId: Scalars['String'];
};

export type BlockedContactGroups = {
  __typename?: 'BlockedContactGroups';
  contactGroups: Array<Maybe<Scalars['String']>>;
};

export type BlockedContactGroupsInput = {
  blockedContactGroups: Array<InputMaybe<Scalars['String']>>;
  id: Scalars['ID'];
};

export type BlockedContacts = {
  __typename?: 'BlockedContacts';
  blockedContacts: Array<Maybe<Scalars['String']>>;
};

export type BlockedContactsInput = {
  blockedContacts: Array<InputMaybe<Scalars['String']>>;
  id: Scalars['ID'];
};

export type BrandingImagesInput = {
  faviconUrl?: InputMaybe<Scalars['String']>;
  hubId: Scalars['ID'];
  logoAltText?: InputMaybe<Scalars['String']>;
  logoOriginalUrl?: InputMaybe<Scalars['String']>;
  logoUrl?: InputMaybe<Scalars['String']>;
  newLogoOriginalUrl?: InputMaybe<Scalars['String']>;
  newLogoUrl?: InputMaybe<Scalars['String']>;
};

export type Calendar = {
  __typename?: 'Calendar';
  id?: Maybe<Scalars['ID']>;
};

export type CalendarInput = {
  id?: InputMaybe<Scalars['ID']>;
};

export type CalendarsResponse = {
  __typename?: 'CalendarsResponse';
  data: Array<Maybe<EventCalendar>>;
};

/** Enum for Carina App Icon name */
export enum CarinaAppIcon {
  BarGraphVerticalIcon = 'BarGraphVerticalIcon',
  CalendarIcon = 'CalendarIcon',
  ContactsIcon = 'ContactsIcon',
  DashboardIcon = 'DashboardIcon',
  EventIcon = 'EventIcon',
  ExportIcon = 'ExportIcon',
  HelpCircleIcon = 'HelpCircleIcon',
  HotelIcon = 'HotelIcon',
  LogOutIcon = 'LogOutIcon',
  MailIcon = 'MailIcon',
  MessageBubblesIcon = 'MessageBubblesIcon',
  PagesIcon = 'PagesIcon',
  PaperIcon = 'PaperIcon',
  PersonAccountIcon = 'PersonAccountIcon',
  RecentItemsIcon = 'RecentItemsIcon',
  SettingsIcon = 'SettingsIcon',
  SurveyIcon = 'SurveyIcon',
  VideoIcon = 'VideoIcon'
}

/** Represents Carina App Switcher model for navigation */
export type CarinaAppSwitcher = {
  __typename?: 'CarinaAppSwitcher';
  defaultOpen: Scalars['Boolean'];
  items?: Maybe<Array<CarinaAppSwitcherLink>>;
  title: Scalars['String'];
};

/** Represents a single link, that is placed inside Carina App Switcher component */
export type CarinaAppSwitcherLink = {
  __typename?: 'CarinaAppSwitcherLink';
  icon?: Maybe<CarinaAppIcon>;
  status?: Maybe<CarinaAppSwitcherStatus>;
  title: Scalars['String'];
  url?: Maybe<CarinaLink>;
};

/** Enum for status of App Switcher */
export enum CarinaAppSwitcherStatus {
  Disabled = 'disabled',
  Enabled = 'enabled'
}

/** Fields that are basic settings for navigation */
export interface CarinaApplicationSettings {
  appSwitcher?: Maybe<CarinaAppSwitcher>;
  isRtl?: Maybe<Scalars['Boolean']>;
  logo?: Maybe<CarinaNavigationLogo>;
  search?: Maybe<CarinaSearch>;
  title?: Maybe<Scalars['String']>;
}

/** Link format expected by carina navigation controls */
export type CarinaLink = {
  __typename?: 'CarinaLink';
  href: Scalars['String'];
};

/**
 * Represents a single navigation item or tree that is rendered by carina navigation controls.
 * It has an items array, which is of same type, and can be multi-level deep (as of now, carina
 * controls support only 2 level deep navigation tree)
 */
export type CarinaNavItem = {
  __typename?: 'CarinaNavItem';
  current?: Maybe<Scalars['Boolean']>;
  index: Scalars['String'];
  items?: Maybe<Array<CarinaNavItem>>;
  title?: Maybe<Scalars['String']>;
  titleKey?: Maybe<Scalars['String']>;
  url?: Maybe<CarinaLink>;
};

/** Response type expected of Carina's NavigationProvider */
export type CarinaNavigation = CarinaApplicationSettings & {
  __typename?: 'CarinaNavigation';
  appSwitcher?: Maybe<CarinaAppSwitcher>;
  globalNav: Array<Maybe<CarinaNavItem>>;
  id: Scalars['ID'];
  isRtl?: Maybe<Scalars['Boolean']>;
  localNav: Array<Maybe<CarinaNavItem>>;
  logo?: Maybe<CarinaNavigationLogo>;
  page: Scalars['String'];
  search?: Maybe<CarinaSearch>;
  title?: Maybe<Scalars['String']>;
};

/** Contains the fields for carina navigation logo */
export type CarinaNavigationLogo = {
  __typename?: 'CarinaNavigationLogo';
  src?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
};

/** Represents fields for Carina Search control */
export type CarinaSearch = {
  __typename?: 'CarinaSearch';
  title: Scalars['String'];
  url: Scalars['String'];
};

export type Catalog = {
  __typename?: 'Catalog';
  catalogOwner: CatalogOwnerType;
  catalogType: CatalogType;
  created?: Maybe<Scalars['String']>;
  events?: Maybe<Array<Maybe<Scalars['ID']>>>;
  id: Scalars['ID'];
  lastModified?: Maybe<Scalars['String']>;
  sectionCount: Scalars['Int'];
  sections: Array<Maybe<CatalogSection>>;
};

export type CatalogInput = {
  catalogOwner: CatalogOwnerType;
  catalogType: CatalogType;
  sections: Array<InputMaybe<SectionInput>>;
};

export enum CatalogOwnerType {
  OnDemand = 'ON_DEMAND',
  VideoHub = 'VIDEO_HUB'
}

export type CatalogSection = {
  __typename?: 'CatalogSection';
  id: Scalars['ID'];
  order: Scalars['Int'];
  sectionType: SectionType;
  title: Scalars['String'];
  videoCount: Scalars['Int'];
  videos?: Maybe<Array<Maybe<CatalogVideo>>>;
};

export enum CatalogType {
  List = 'LIST',
  Sections = 'SECTIONS'
}

export type CatalogVideo = {
  __typename?: 'CatalogVideo';
  displayName: Scalars['String'];
  duration: Scalars['Int'];
  id: Scalars['ID'];
  order?: Maybe<Scalars['Int']>;
  sessionId?: Maybe<Scalars['ID']>;
  status?: Maybe<VideoStatus>;
  thumbnail?: Maybe<Scalars['String']>;
  videoId: Scalars['ID'];
  webcastId?: Maybe<Scalars['ID']>;
};

export type Channel = {
  __typename?: 'Channel';
  banners?: Maybe<Array<Maybe<Scalars['String']>>>;
  catalogId?: Maybe<Scalars['ID']>;
  description: Scalars['String'];
  id: Scalars['ID'];
  imageUrl?: Maybe<Scalars['String']>;
  status: ChannelStatus;
  title: Scalars['String'];
};

export type ChannelBannerInput = {
  banner: Scalars['String'];
  channel: Scalars['String'];
  order?: InputMaybe<Scalars['Int']>;
};

export type ChannelBannerOutput = {
  __typename?: 'ChannelBannerOutput';
  banner: Scalars['String'];
  channel: Scalars['String'];
};

export type ChannelImage = {
  __typename?: 'ChannelImage';
  createdAt: Scalars['String'];
  filename: Scalars['String'];
  imageId: Scalars['ID'];
  size: Scalars['Int'];
  url: Scalars['String'];
};

export type ChannelInformation = {
  __typename?: 'ChannelInformation';
  catalogId?: Maybe<Scalars['ID']>;
  description: Scalars['String'];
  id: Scalars['ID'];
  image?: Maybe<ChannelImage>;
  status: ChannelStatus;
  title: Scalars['String'];
};

export type ChannelInput = {
  description: Scalars['String'];
  id: Scalars['ID'];
  status: ChannelStatus;
  title: Scalars['String'];
};

export type ChannelOrder = {
  __typename?: 'ChannelOrder';
  id: Scalars['ID'];
  order: Scalars['Int'];
};

export type ChannelOrderInput = {
  existingOrder: Scalars['Int'];
  id: Scalars['ID'];
  order: Scalars['Int'];
};

export enum ChannelStatus {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE'
}

export type CodeSnippet = {
  __typename?: 'CodeSnippet';
  addToAllPages?: Maybe<Scalars['Boolean']>;
  addToLoginPage?: Maybe<Scalars['Boolean']>;
  addToSingleVideoPage?: Maybe<Scalars['Boolean']>;
  applicableOn?: Maybe<ApplicableOn>;
  codeSnippetId: Scalars['ID'];
};

export interface CodeSnippetHubRequest {
  applicableOn?: Maybe<ApplicableOn>;
  codeSnippetId: Scalars['String'];
  targetWebPages?: Maybe<Array<Maybe<TargetWebPages>>>;
}

export interface CodeSnippetHubResponse {
  applicableOn: ApplicableOn;
  created?: Maybe<Scalars['String']>;
  createdBy?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  lastModified?: Maybe<Scalars['String']>;
  lastModifiedBy?: Maybe<Scalars['String']>;
  targetWebpages?: Maybe<Array<Maybe<TargetWebPages>>>;
}

export type CodeSnippetInput = {
  addToAllPages?: InputMaybe<Scalars['Boolean']>;
  addToLoginPage?: InputMaybe<Scalars['Boolean']>;
  addToSingleVideoPage?: InputMaybe<Scalars['Boolean']>;
  applicableOn: ApplicableOn;
  codeSnippetId: Scalars['ID'];
  hubId: Scalars['ID'];
};

export type CodeSnippetResponse = {
  __typename?: 'CodeSnippetResponse';
  accountCodeSnippets?: Maybe<Array<Maybe<AccountCodeSnippet>>>;
  allowCodeSnippets: Scalars['Boolean'];
};

export enum CodeSnippetStatus {
  Approved = 'Approved',
  PendingApproval = 'PendingApproval'
}

export type Compliance = {
  __typename?: 'Compliance';
  action?: Maybe<Scalars['String']>;
  complianceScope?: Maybe<Scalars['String']>;
  createdBy?: Maybe<Scalars['String']>;
  creationTime?: Maybe<Scalars['String']>;
};

export type Config = {
  __typename?: 'Config';
  accountMappingId?: Maybe<Scalars['String']>;
  autoDetectBrowserLocale?: Maybe<Scalars['Boolean']>;
  customDomain?: Maybe<Scalars['String']>;
  helpEmailAddress?: Maybe<Scalars['String']>;
  locale?: Maybe<Scalars['String']>;
  loginType?: Maybe<LoginType>;
  organizationId?: Maybe<Scalars['String']>;
  ownerEmail: Scalars['String'];
  ownerFirstName: Scalars['String'];
  ownerLastName: Scalars['String'];
  title: Scalars['String'];
  url?: Maybe<Scalars['String']>;
  utmOverride?: Maybe<Scalars['String']>;
};

export type ConfigInput = {
  accountMappingId?: InputMaybe<Scalars['String']>;
  autoDetectBrowserLocale?: InputMaybe<Scalars['Boolean']>;
  customDomain?: InputMaybe<Scalars['String']>;
  helpEmailAddress?: InputMaybe<Scalars['String']>;
  locale?: InputMaybe<Scalars['String']>;
  loginType?: InputMaybe<LoginType>;
  organizationId?: InputMaybe<Scalars['String']>;
  ownerEmail?: InputMaybe<Scalars['String']>;
  ownerFirstName?: InputMaybe<Scalars['String']>;
  ownerLastName?: InputMaybe<Scalars['String']>;
  title?: InputMaybe<Scalars['String']>;
  url?: InputMaybe<Scalars['String']>;
  utmOverride?: InputMaybe<Scalars['String']>;
};

export enum ConfigStatus {
  Active = 'Active',
  Inactive = 'Inactive'
}

export type Contact = {
  __typename?: 'Contact';
  email?: Maybe<Scalars['String']>;
  firstName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
};

export type ContactData = {
  __typename?: 'ContactData';
  email?: Maybe<Scalars['String']>;
  firstName?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  lastName?: Maybe<Scalars['String']>;
};

export type ContactGroupData = {
  __typename?: 'ContactGroupData';
  id: Scalars['ID'];
  name: Scalars['String'];
};

export type ContactGroupSearchInput = {
  limit?: InputMaybe<Scalars['Int']>;
  searchTerm?: InputMaybe<Scalars['String']>;
  token?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<Scalars['String']>;
};

export type ContactGroupsInput = {
  contactGroups: Array<InputMaybe<Scalars['String']>>;
  id: Scalars['ID'];
};

export type ContactImage = {
  __typename?: 'ContactImage';
  href?: Maybe<Scalars['String']>;
};

export type ContactInformation = {
  __typename?: 'ContactInformation';
  bio?: Maybe<Scalars['String']>;
  company?: Maybe<Scalars['String']>;
  designation?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  firstName?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  image?: Maybe<ContactImage>;
  lastName?: Maybe<Scalars['String']>;
  pronoun?: Maybe<Scalars['String']>;
};

export type ContactSearchInput = {
  limit?: InputMaybe<Scalars['Int']>;
  searchTerm?: InputMaybe<Scalars['String']>;
  token?: InputMaybe<Scalars['String']>;
};

export type ContactTypesData = {
  __typename?: 'ContactTypesData';
  id: Scalars['ID'];
  name: Scalars['String'];
};

export type ContactTypesInput = {
  contactTypes: Array<InputMaybe<Scalars['String']>>;
  id: Scalars['ID'];
};

export type CookieList = {
  __typename?: 'CookieList';
  customLinkText?: Maybe<Scalars['String']>;
  customUrl?: Maybe<Scalars['String']>;
  cventUrl?: Maybe<Scalars['String']>;
  enableCustom?: Maybe<Scalars['Boolean']>;
  enableCvent?: Maybe<Scalars['Boolean']>;
};

export type CookieListInput = {
  customLinkText?: InputMaybe<Scalars['String']>;
  customUrl?: InputMaybe<Scalars['String']>;
  cventUrl?: InputMaybe<Scalars['String']>;
  enableCustom?: InputMaybe<Scalars['Boolean']>;
  enableCvent?: InputMaybe<Scalars['Boolean']>;
};

export type Culture = {
  __typename?: 'Culture';
  CultureCode?: Maybe<Scalars['String']>;
  CultureCountryId?: Maybe<Scalars['Int']>;
  IsDefaultCulture?: Maybe<Scalars['Boolean']>;
  LocaleId: Scalars['Int'];
};

export type CustomDomain = {
  __typename?: 'CustomDomain';
  customDomainId?: Maybe<Scalars['ID']>;
  domainName?: Maybe<Scalars['String']>;
};

export type CustomDomainMapping = {
  __typename?: 'CustomDomainMapping';
  customDomainId: Scalars['ID'];
  entityId: Scalars['ID'];
  trailingName?: Maybe<Scalars['String']>;
};

export type CustomDomainMappingInput = {
  customDomainId: Scalars['ID'];
  entityId: Scalars['ID'];
  trailingName?: InputMaybe<Scalars['String']>;
};

export type CustomFont = {
  __typename?: 'CustomFont';
  fallbackFont?: Maybe<Scalars['String']>;
  fallbackFontId?: Maybe<Scalars['Int']>;
  files?: Maybe<Array<Maybe<FontFile>>>;
  fontFamily?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  isActive?: Maybe<Scalars['Boolean']>;
};

export type Customizations = {
  __typename?: 'Customizations';
  defaultLandingPage?: Maybe<DefaultLandingPage>;
  headerCss?: Maybe<Scalars['String']>;
  headerHtml?: Maybe<Scalars['String']>;
  headerJavascript?: Maybe<Scalars['String']>;
  navigationAlignment?: Maybe<NavigationAlignment>;
  navigationHeaderLeftPadding?: Maybe<Scalars['Int']>;
  navigationHeaderMaxWidth?: Maybe<Scalars['Int']>;
  navigationHeaderRightPadding?: Maybe<Scalars['Int']>;
  navigationLinkHighlightStyle?: Maybe<NavigationLinkHighlightStyle>;
  navigationLinkTextSize?: Maybe<Scalars['Int']>;
  showChannels?: Maybe<Scalars['Boolean']>;
  showCustomHeader?: Maybe<Scalars['Boolean']>;
  showHomePage?: Maybe<Scalars['Boolean']>;
  showLogin?: Maybe<Scalars['Boolean']>;
  showLogo?: Maybe<Scalars['Boolean']>;
  showNavigation?: Maybe<Scalars['Boolean']>;
  showUpcomingEvents?: Maybe<Scalars['Boolean']>;
  showVideos?: Maybe<Scalars['Boolean']>;
};

export type CustomizationsInput = {
  defaultLandingPage?: InputMaybe<DefaultLandingPage>;
  headerCss?: InputMaybe<Scalars['String']>;
  headerHtml?: InputMaybe<Scalars['String']>;
  headerJavascript?: InputMaybe<Scalars['String']>;
  navigationAlignment?: InputMaybe<NavigationAlignment>;
  navigationHeaderLeftPadding?: InputMaybe<Scalars['Int']>;
  navigationHeaderMaxWidth?: InputMaybe<Scalars['Int']>;
  navigationHeaderRightPadding?: InputMaybe<Scalars['Int']>;
  navigationLinkHighlightStyle?: InputMaybe<NavigationLinkHighlightStyle>;
  navigationLinkTextSize?: InputMaybe<Scalars['Int']>;
  showChannels?: InputMaybe<Scalars['Boolean']>;
  showCustomHeader?: InputMaybe<Scalars['Boolean']>;
  showHomePage?: InputMaybe<Scalars['Boolean']>;
  showLogin?: InputMaybe<Scalars['Boolean']>;
  showLogo?: InputMaybe<Scalars['Boolean']>;
  showNavigation?: InputMaybe<Scalars['Boolean']>;
  showUpcomingEvents?: InputMaybe<Scalars['Boolean']>;
  showVideos?: InputMaybe<Scalars['Boolean']>;
};

export enum DefaultLandingPage {
  Channels = 'Channels',
  UpcomingEvents = 'UpcomingEvents',
  Videos = 'Videos'
}

export type DeleteContactTypesResponse = {
  __typename?: 'DeleteContactTypesResponse';
  deleteContactTypes?: Maybe<Scalars['Boolean']>;
};

export type EmailDomainsInput = {
  emailDomains: Array<InputMaybe<Scalars['String']>>;
  id: Scalars['ID'];
};

export type EntityImage = {
  __typename?: 'EntityImage';
  createdAt: Scalars['String'];
  entityId: Scalars['ID'];
  entityType: Scalars['String'];
  filename: Scalars['String'];
  id: Scalars['ID'];
  size: Scalars['Int'];
  url: Scalars['String'];
};

export type EntityImageInput = {
  entity: EntityInput;
  name: Scalars['String'];
  previousImageId?: InputMaybe<Scalars['String']>;
  size: Scalars['Int'];
  url: Scalars['String'];
};

export type EntityInput = {
  id: Scalars['String'];
  type: Scalars['String'];
};

export enum EntityType {
  BackgroundImage = 'BackgroundImage',
  Banner = 'Banner',
  Favicon = 'Favicon',
  Logo = 'Logo',
  Section = 'Section',
  Temp = 'Temp'
}

export type EventCalendar = {
  __typename?: 'EventCalendar';
  id: Scalars['String'];
  name: Scalars['String'];
};

export type ExistingBanner = {
  __typename?: 'ExistingBanner';
  button?: Maybe<BannerButton>;
  centerId: Scalars['String'];
  id: Scalars['ID'];
  imageAlignment?: Maybe<Scalars['String']>;
  imageAltText?: Maybe<Scalars['String']>;
  imageRelativePath?: Maybe<Scalars['String']>;
  imageUrl?: Maybe<Scalars['String']>;
  layout: Scalars['String'];
  name: Scalars['String'];
  originalImageUrl?: Maybe<Scalars['String']>;
  text?: Maybe<BannerText>;
};

export type ExistingBannerAssociationWithBanner = {
  __typename?: 'ExistingBannerAssociationWithBanner';
  banner?: Maybe<ExistingBanner>;
  centerId: Scalars['String'];
  displayOrder?: Maybe<Scalars['Int']>;
  entityId: Scalars['String'];
  entityType: Scalars['String'];
};

/** Experiment */
export type ExperimentResponse = {
  __typename?: 'ExperimentResponse';
  experimentName?: Maybe<Scalars['String']>;
  variant?: Maybe<ExperimentVariant>;
  version?: Maybe<Scalars['Int']>;
};

export type ExperimentVariant = {
  __typename?: 'ExperimentVariant';
  description?: Maybe<Scalars['String']>;
  exclude?: Maybe<Array<Maybe<Scalars['String']>>>;
  id?: Maybe<Scalars['Int']>;
  include?: Maybe<Array<Maybe<Scalars['String']>>>;
  metadata?: Maybe<Version>;
  weight?: Maybe<Scalars['Int']>;
};

export type Feature = {
  __typename?: 'Feature';
  code: Scalars['String'];
  enabled: Scalars['Boolean'];
};

export type FeatureInput = {
  centerId: Scalars['ID'];
  code: Scalars['String'];
  enabled: Scalars['Boolean'];
};

export type FeatureStatusInput = {
  enabled: Scalars['Boolean'];
};

/** FileImportHistory */
export type FileImportHistory = {
  __typename?: 'FileImportHistory';
  accountId: Scalars['Int'];
  createdAt: Scalars['String'];
  createdBy: Scalars['String'];
  errorCount: Scalars['Int'];
  fileName: Scalars['String'];
  locale?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  successCount: Scalars['Int'];
  totalCount: Scalars['Int'];
  userId: Scalars['String'];
};

export type FileImportHistoryInput = {
  locale?: InputMaybe<Scalars['String']>;
  schemaName: Scalars['String'];
};

export type FileImportHistoryParams = {
  __typename?: 'FileImportHistoryParams';
  locale?: Maybe<Scalars['String']>;
};

export type FilterInput = {
  filter?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Scalars['String']>;
  token?: InputMaybe<Scalars['String']>;
};

export type FontFile = {
  __typename?: 'FontFile';
  fontStyle?: Maybe<Scalars['String']>;
  fontWeight?: Maybe<Scalars['Int']>;
  url?: Maybe<Scalars['String']>;
};

export type FormFieldSetting = {
  __typename?: 'FormFieldSetting';
  code: RegistrationFieldCode;
  included: Scalars['Boolean'];
  order: Scalars['Int'];
  required: Scalars['Boolean'];
};

export type FormFieldSettingInput = {
  code: RegistrationFieldCode;
  included: Scalars['Boolean'];
  order: Scalars['Int'];
  required: Scalars['Boolean'];
};

export type GetAllowedContactGroupsInput = {
  id: Scalars['ID'];
};

export type GetAllowedContactTypesInput = {
  id: Scalars['ID'];
};

export type GetBlockedContactGroupsInput = {
  id: Scalars['ID'];
};

export type GetBlockedContactsInput = {
  id: Scalars['ID'];
};

export type GetEmailDomainsInput = {
  id: Scalars['ID'];
};

export enum GuestVisibility {
  HomepagePublic = 'HOMEPAGE_PUBLIC',
  Private = 'PRIVATE',
  Public = 'PUBLIC',
  VideoPlaybackPrivate = 'VIDEO_PLAYBACK_PRIVATE'
}

export type HelpMenu = {
  __typename?: 'HelpMenu';
  items?: Maybe<Array<Maybe<Utility>>>;
  title?: Maybe<Scalars['String']>;
};

export type HttpHeader = {
  __typename?: 'HttpHeader';
  key?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
};

export enum HttpMethod {
  Delete = 'DELETE',
  Get = 'GET',
  Patch = 'PATCH',
  Post = 'POST',
  Put = 'PUT'
}

export type Hub = {
  __typename?: 'Hub';
  calendar?: Maybe<Calendar>;
  config?: Maybe<Config>;
  id: Scalars['ID'];
  status?: Maybe<Scalars['String']>;
  theme?: Maybe<Theme>;
};

export type HubCodeSnippets = {
  __typename?: 'HubCodeSnippets';
  applicableOn: ApplicableOn;
  codeSnippetId: Scalars['String'];
  targetWebPages: Array<Maybe<TargetWebPages>>;
};

export type HubCreate = {
  calendar?: InputMaybe<CalendarInput>;
  config?: InputMaybe<ConfigInput>;
  theme?: InputMaybe<ThemeInput>;
};

export type HubDataSourceList = {
  __typename?: 'HubDataSourceList';
  data: Array<Maybe<HubDataSourceRecord>>;
  paging: PagingResponse;
};

export type HubDataSourceRecord = {
  __typename?: 'HubDataSourceRecord';
  accountMappingId?: Maybe<Scalars['String']>;
  actionColor?: Maybe<Scalars['String']>;
  autoDetectBrowserLocale?: Maybe<Scalars['Boolean']>;
  backgroundColor?: Maybe<Scalars['String']>;
  backgroundImageAltText?: Maybe<Scalars['String']>;
  backgroundImageUrl?: Maybe<Scalars['String']>;
  backgroundOriginalImageUrl?: Maybe<Scalars['String']>;
  bodyFontId?: Maybe<Scalars['ID']>;
  calendarId?: Maybe<Scalars['ID']>;
  customDomain?: Maybe<Scalars['String']>;
  faviconUrl?: Maybe<Scalars['String']>;
  headingsFontId?: Maybe<Scalars['ID']>;
  helpEmailAddress?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['ID']>;
  locale?: Maybe<Scalars['String']>;
  loginType?: Maybe<LoginType>;
  logoAltText?: Maybe<Scalars['String']>;
  logoImageRelativePath?: Maybe<Scalars['String']>;
  logoImageUrl?: Maybe<Scalars['String']>;
  logoOriginalImageUrl?: Maybe<Scalars['String']>;
  mainColor?: Maybe<Scalars['String']>;
  moodColor?: Maybe<Scalars['String']>;
  organizationId?: Maybe<Scalars['String']>;
  ownerEmail?: Maybe<Scalars['String']>;
  ownerFirstName?: Maybe<Scalars['String']>;
  ownerLastName?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  themeSafeMode?: Maybe<Scalars['Boolean']>;
  title?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
  utmOverride?: Maybe<Scalars['String']>;
};

export type HubLocaleWithDefault = {
  __typename?: 'HubLocaleWithDefault';
  customized?: Maybe<Scalars['String']>;
  default: Scalars['Boolean'];
  lastModified?: Maybe<Scalars['String']>;
  lastModifiedBy?: Maybe<Scalars['String']>;
  locale: Scalars['String'];
  translationStatus?: Maybe<Scalars['String']>;
};

export type HubLocales = {
  data: Array<InputMaybe<Scalars['String']>>;
};

export type HubLocalesWithDefault = {
  __typename?: 'HubLocalesWithDefault';
  data: Array<Maybe<HubLocaleWithDefault>>;
};

export type HubPage = {
  __typename?: 'HubPage';
  entityId: Scalars['String'];
  entityType: Scalars['String'];
  name: Scalars['String'];
};

export type HubPages = {
  __typename?: 'HubPages';
  data: Array<Maybe<HubPage>>;
};

export type HubResult = Hub | Validation;

export type HubSearch = {
  id: Scalars['String'];
};

export type HubStatusInput = {
  __typename?: 'HubStatusInput';
  id: Scalars['String'];
  status: Scalars['String'];
};

export type HubUpdate = {
  calendar?: InputMaybe<CalendarInput>;
  config?: InputMaybe<ConfigInput>;
  id: Scalars['ID'];
  theme?: InputMaybe<ThemeInput>;
};

export type HubUpdateSettings = {
  hubSettings?: InputMaybe<SettingsInput>;
  id: Scalars['ID'];
};

export type Hubs = {
  limit?: InputMaybe<Scalars['Int']>;
  token?: InputMaybe<Scalars['String']>;
};

export type HubsPagingResponse = {
  __typename?: 'HubsPagingResponse';
  data: Array<Maybe<Hub>>;
  paging: PagingResponse;
};

export type IdBanner = {
  id: Scalars['String'];
};

export type ImageFieldDelta = {
  imageUrl?: InputMaybe<Scalars['String']>;
  newImageUrl?: InputMaybe<Scalars['String']>;
  newOriginalImageUrl?: InputMaybe<Scalars['String']>;
  originalImageUrl?: InputMaybe<Scalars['String']>;
};

export type ImageInput = {
  filename: Scalars['String'];
  size: Scalars['Int'];
  url: Scalars['String'];
};

export type Instance = {
  __typename?: 'Instance';
  id: Scalars['String'];
};

export type Link = {
  __typename?: 'Link';
  url?: Maybe<Url>;
};

export type Locale = {
  __typename?: 'Locale';
  AvailableCultures?: Maybe<Array<Maybe<Culture>>>;
  CountryLanguage?: Maybe<Scalars['String']>;
  CultureCode?: Maybe<Scalars['String']>;
  Id: Scalars['Int'];
  IsDefault?: Maybe<Scalars['Boolean']>;
  LanguageName?: Maybe<Scalars['String']>;
  LocalizationFlag?: Maybe<Scalars['Boolean']>;
};

export enum LoginType {
  MagicLink = 'MAGIC_LINK',
  Sso = 'SSO'
}

export type MeasurementIdInput = {
  hubId: Scalars['String'];
  newMeasurementId: Scalars['String'];
  oldMeasurementId: Scalars['String'];
};

export type MeasurementIdResponse = {
  __typename?: 'MeasurementIdResponse';
  measurementId: Scalars['String'];
};

export type MemberData = {
  __typename?: 'MemberData';
  profile: MemberProfile;
  termsAccepted?: Maybe<Scalars['Boolean']>;
  visibility?: Maybe<Scalars['Boolean']>;
};

export type MemberDataInput = {
  centerId: Scalars['ID'];
  contactId: Scalars['ID'];
};

export type MemberInfo = {
  email: Scalars['String'];
  firstName: Scalars['String'];
  lastName: Scalars['String'];
};

export type MemberListData = {
  __typename?: 'MemberListData';
  companyName?: Maybe<Scalars['String']>;
  emailAddress: Scalars['String'];
  firstName: Scalars['String'];
  id: Scalars['ID'];
  jobTitle?: Maybe<Scalars['String']>;
  lastLoginDate: Scalars['String'];
  lastName: Scalars['String'];
  mobileNumber?: Maybe<Scalars['String']>;
  registrationAge?: Maybe<RegistrationAge>;
  registrationDate: Scalars['String'];
};

export type MemberListPaginatedResult = {
  __typename?: 'MemberListPaginatedResult';
  data: Array<Maybe<MemberListData>>;
  paging: Paging;
};

export type MemberLoginInput = {
  hubId: Scalars['ID'];
  memberInfo: MemberInfo;
};

export type MemberLoginResponse = {
  __typename?: 'MemberLoginResponse';
  email?: Maybe<Scalars['String']>;
  emailLocked?: Maybe<Scalars['Boolean']>;
  expirationDate?: Maybe<Scalars['String']>;
  firstName?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['ID']>;
  lastName?: Maybe<Scalars['String']>;
  maxEmailSent?: Maybe<Scalars['Boolean']>;
  serverError?: Maybe<Scalars['String']>;
  userRestricted?: Maybe<Scalars['Boolean']>;
};

export type MemberPaginatedChannels = {
  __typename?: 'MemberPaginatedChannels';
  data: Array<Maybe<VideoHubChannel>>;
  paging: Paging;
};

export type MemberProfile = {
  __typename?: 'MemberProfile';
  companyName?: Maybe<Scalars['String']>;
  compliance?: Maybe<Compliance>;
  designation?: Maybe<Scalars['String']>;
  emailAddress: Scalars['String'];
  firstName: Scalars['String'];
  jobTitle?: Maybe<Scalars['String']>;
  lastLoginDate?: Maybe<Scalars['String']>;
  lastName: Scalars['String'];
  mobileNumber?: Maybe<Scalars['String']>;
  prefix?: Maybe<Scalars['String']>;
  profileImageUrl?: Maybe<Url>;
  registrationAge?: Maybe<RegistrationAge>;
  registrationDate?: Maybe<Scalars['String']>;
  socialMediaLinks?: Maybe<SocialMediaLinks>;
};

export type MemberProfileInput = {
  companyName?: InputMaybe<Scalars['String']>;
  designation?: InputMaybe<Scalars['String']>;
  firstName: Scalars['String'];
  jobTitle?: InputMaybe<Scalars['String']>;
  lastName: Scalars['String'];
  prefix?: InputMaybe<Scalars['String']>;
  socialMediaLinks?: InputMaybe<SocialMediaLinksInput>;
};

export type MemberProfileUpdate = {
  centerId: Scalars['ID'];
  contactId: Scalars['ID'];
  memberProfile: MemberProfileInput;
};

export type MemberProfileVisible = {
  __typename?: 'MemberProfileVisible';
  visible: Scalars['Boolean'];
};

export type MemberVideoWatchData = {
  __typename?: 'MemberVideoWatchData';
  duration?: Maybe<Scalars['Int']>;
  email?: Maybe<Scalars['String']>;
  firstName?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['ID']>;
  lastName?: Maybe<Scalars['String']>;
  percentage?: Maybe<Scalars['Float']>;
};

export type MemberVisibilityInput = {
  centerId: Scalars['ID'];
  contactId: Scalars['ID'];
  visible: Scalars['Boolean'];
};

export type MemberWatchDurationData = {
  __typename?: 'MemberWatchDurationData';
  data?: Maybe<Array<Maybe<MemberVideoWatchData>>>;
  serverError?: Maybe<Scalars['Boolean']>;
};

export type MemberWatchInput = {
  filter: AnalyticsInput;
  videoDuration: Scalars['Int'];
  videoId: Scalars['ID'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addHubLocales?: Maybe<HubLocalesWithDefault>;
  bannerCreate?: Maybe<Scalars['String']>;
  bannerDelete?: Maybe<Scalars['String']>;
  bannerUpdate?: Maybe<ExistingBanner>;
  createCatalog?: Maybe<Catalog>;
  createChannel?: Maybe<Channel>;
  createChannelBannerAssociation?: Maybe<ChannelBannerOutput>;
  createHubCustomDomainMapping?: Maybe<CustomDomainMapping>;
  createPage?: Maybe<PageWithSection>;
  createSection?: Maybe<PageSection>;
  deleteBlockedContactGroups?: Maybe<Success>;
  deleteBlockedContacts?: Maybe<Success>;
  deleteChannel?: Maybe<Scalars['Boolean']>;
  deleteChannelBannerAssociation?: Maybe<ChannelBannerOutput>;
  deleteChannelImage?: Maybe<Scalars['Boolean']>;
  deleteContactTypes?: Maybe<DeleteContactTypesResponse>;
  deleteEntityImage?: Maybe<Scalars['Boolean']>;
  deleteHubCustomDomainMapping?: Maybe<Scalars['Boolean']>;
  deleteToken?: Maybe<Scalars['String']>;
  hubCreate?: Maybe<Scalars['String']>;
  hubDelete?: Maybe<Scalars['String']>;
  hubDraft?: Maybe<Scalars['String']>;
  hubPublish?: Maybe<Scalars['String']>;
  hubUpdate?: Maybe<Scalars['String']>;
  hubUpdateSettings?: Maybe<Settings>;
  removeCodeSnippet?: Maybe<Success>;
  resetTranslations?: Maybe<Scalars['String']>;
  saveBlockedContactGroups?: Maybe<BlockedContactGroups>;
  saveBlockedContacts?: Maybe<BlockedContacts>;
  saveCodeSnippet?: Maybe<CodeSnippet>;
  saveContactGroups?: Maybe<AllowedContactGroups>;
  saveContactTypes?: Maybe<AllowedContactTypes>;
  saveEmailDomains?: Maybe<AllowedDomains>;
  saveGoogleMeasurementId?: Maybe<MeasurementIdResponse>;
  setBannerAssociations?: Maybe<BannerAssociationPaging>;
  setTranslations?: Maybe<TranslationUpdateResponse>;
  setUtmOverrides?: Maybe<Array<Maybe<UtmOverride>>>;
  subscriptionToken?: Maybe<OneTimeToken>;
  updateBackgroundImages?: Maybe<Hub>;
  updateBrandingImages?: Maybe<Hub>;
  updateCatalog?: Maybe<Catalog>;
  updateCenterFeature?: Maybe<Feature>;
  updateChannel?: Maybe<Channel>;
  updateChannelOrder?: Maybe<Array<Maybe<ChannelOrder>>>;
  updateCodeSnippet?: Maybe<CodeSnippet>;
  updateHubCustomDomainMapping?: Maybe<CustomDomainMapping>;
  updateMemberStatus?: Maybe<Success>;
  updatePage?: Maybe<Page>;
  updateRecentItems?: Maybe<Array<Maybe<RecentItem>>>;
  updateRegistrationFormSettings?: Maybe<RegistrationFormSettings>;
  updateSection?: Maybe<PageSection>;
  uploadChannelImage?: Maybe<ChannelImage>;
  uploadEntityImage?: Maybe<EntityImage>;
  upsertHubCustomizations?: Maybe<Customizations>;
};


export type MutationAddHubLocalesArgs = {
  id: HubSearch;
  input: HubLocales;
};


export type MutationBannerCreateArgs = {
  input: NewBanner;
};


export type MutationBannerDeleteArgs = {
  bannersSearch: BannersSearch;
};


export type MutationBannerUpdateArgs = {
  input: BannerUpdate;
};


export type MutationCreateCatalogArgs = {
  catalogInput: CatalogInput;
  channelId: Scalars['ID'];
};


export type MutationCreateChannelArgs = {
  customDomain?: InputMaybe<Scalars['String']>;
  description: Scalars['String'];
  hubId: Scalars['ID'];
  title: Scalars['String'];
};


export type MutationCreateChannelBannerAssociationArgs = {
  input: ChannelBannerInput;
};


export type MutationCreateHubCustomDomainMappingArgs = {
  input?: InputMaybe<CustomDomainMappingInput>;
};


export type MutationCreatePageArgs = {
  newSection?: InputMaybe<PageSectionInput>;
  page: PageInput;
};


export type MutationCreateSectionArgs = {
  data?: InputMaybe<PageSectionInput>;
  input: HubSearch;
};


export type MutationDeleteBlockedContactGroupsArgs = {
  input: BlockedContactGroupsInput;
};


export type MutationDeleteBlockedContactsArgs = {
  input: BlockedContactsInput;
};


export type MutationDeleteChannelArgs = {
  channelId: Scalars['String'];
};


export type MutationDeleteChannelBannerAssociationArgs = {
  input: ChannelBannerInput;
};


export type MutationDeleteChannelImageArgs = {
  channelId: Scalars['String'];
  imageId: Scalars['String'];
};


export type MutationDeleteContactTypesArgs = {
  input: ContactTypesInput;
};


export type MutationDeleteEntityImageArgs = {
  imageId: Scalars['String'];
};


export type MutationDeleteHubCustomDomainMappingArgs = {
  hubId: Scalars['ID'];
};


export type MutationDeleteTokenArgs = {
  input?: InputMaybe<HubSearch>;
};


export type MutationHubCreateArgs = {
  input?: InputMaybe<HubCreate>;
};


export type MutationHubDeleteArgs = {
  input?: InputMaybe<HubSearch>;
};


export type MutationHubDraftArgs = {
  input?: InputMaybe<HubSearch>;
};


export type MutationHubPublishArgs = {
  input?: InputMaybe<HubSearch>;
};


export type MutationHubUpdateArgs = {
  input?: InputMaybe<HubUpdate>;
};


export type MutationHubUpdateSettingsArgs = {
  input?: InputMaybe<HubUpdateSettings>;
};


export type MutationRemoveCodeSnippetArgs = {
  input: RemoveCodeSnippetInput;
};


export type MutationResetTranslationsArgs = {
  input: ResetTranslationSearch;
};


export type MutationSaveBlockedContactGroupsArgs = {
  input: BlockedContactGroupsInput;
};


export type MutationSaveBlockedContactsArgs = {
  input: BlockedContactsInput;
};


export type MutationSaveCodeSnippetArgs = {
  input: CodeSnippetInput;
};


export type MutationSaveContactGroupsArgs = {
  input: ContactGroupsInput;
};


export type MutationSaveContactTypesArgs = {
  input: ContactTypesInput;
};


export type MutationSaveEmailDomainsArgs = {
  input: EmailDomainsInput;
};


export type MutationSaveGoogleMeasurementIdArgs = {
  input: MeasurementIdInput;
};


export type MutationSetBannerAssociationsArgs = {
  input?: InputMaybe<BannerAssociationCreate>;
};


export type MutationSetTranslationsArgs = {
  data?: InputMaybe<Array<InputMaybe<TranslationInput>>>;
  input: HubSearch;
  locale: Scalars['String'];
};


export type MutationSetUtmOverridesArgs = {
  data?: InputMaybe<Array<InputMaybe<UtmOverrideInput>>>;
  input: HubSearch;
};


export type MutationUpdateBackgroundImagesArgs = {
  input: BackgroundImagesInput;
};


export type MutationUpdateBrandingImagesArgs = {
  input: BrandingImagesInput;
};


export type MutationUpdateCatalogArgs = {
  catalogId: Scalars['ID'];
  catalogInput: CatalogInput;
  channelId: Scalars['ID'];
};


export type MutationUpdateCenterFeatureArgs = {
  input: FeatureInput;
};


export type MutationUpdateChannelArgs = {
  channelInput: ChannelInput;
};


export type MutationUpdateChannelOrderArgs = {
  channelOrderInputList?: InputMaybe<Array<InputMaybe<ChannelOrderInput>>>;
  hubId: Scalars['ID'];
};


export type MutationUpdateCodeSnippetArgs = {
  input: CodeSnippetInput;
};


export type MutationUpdateHubCustomDomainMappingArgs = {
  input?: InputMaybe<CustomDomainMappingInput>;
};


export type MutationUpdateMemberStatusArgs = {
  input: UpdateMemberStatusInput;
};


export type MutationUpdatePageArgs = {
  data: PageInput;
};


export type MutationUpdateRecentItemsArgs = {
  input?: InputMaybe<UpdateRecentItemsRequest>;
};


export type MutationUpdateRegistrationFormSettingsArgs = {
  input: UpdateRegistrationFormSettingInput;
};


export type MutationUpdateSectionArgs = {
  data?: InputMaybe<PageSectionInput>;
  input: HubSearch;
};


export type MutationUploadChannelImageArgs = {
  channelId: Scalars['String'];
  imageInput: ImageInput;
};


export type MutationUploadEntityImageArgs = {
  imageInput: EntityImageInput;
};


export type MutationUpsertHubCustomizationsArgs = {
  id: HubSearch;
  input: CustomizationsInput;
};

/**
 * This represents the metadata of current page, used as input for the query that returns
 * navigation data for the page.
 */
export type NavMetadata = {
  /**
   * These are page level parameters (e.g. rfpId, env, eventId) that are used to perform
   * visibility check for different items in the nav tree
   */
  pathParams?: InputMaybe<Array<PathParam>>;
  /**
   * This is the static path of the current page, used for locating it in the larger
   * sitemap. Examples: /events/[eventId]/details, /events/overview, /rfps/[rfpId]/view
   */
  staticRouteId: Scalars['String'];
  /**
   * This is the id of top most parent node (e.g. 'rfp-local-nav', 'event-nav') of the
   * Nav tree where this item belongs. If the value is not provided, it indicates that
   * current page is one of the top level nodes in the nav tree
   */
  topParentId?: InputMaybe<Scalars['String']>;
  /** This is same value as dynamic route, and would also be used as apollo cache unique key */
  url: Scalars['String'];
};

export enum NavigationAlignment {
  Center = 'Center',
  Left = 'Left',
  Right = 'Right'
}

export enum NavigationLinkHighlightStyle {
  Filled = 'Filled',
  None = 'None',
  Underline = 'Underline'
}

export type NewBanner = {
  button?: InputMaybe<BannerButtonInput>;
  centerId: Scalars['String'];
  imageAlignment?: InputMaybe<Scalars['String']>;
  imageAltText?: InputMaybe<Scalars['String']>;
  layout: Scalars['String'];
  name: Scalars['String'];
  text?: InputMaybe<BannerTextInput>;
};

export type OneTimeToken = {
  __typename?: 'OneTimeToken';
  token: Scalars['String'];
};

export type Page = {
  __typename?: 'Page';
  pageId: Scalars['String'];
  sectionIds?: Maybe<Array<Maybe<Scalars['String']>>>;
  status?: Maybe<Scalars['String']>;
  videoCenterId: Scalars['String'];
};

export type PageInput = {
  pageId: Scalars['String'];
  section?: InputMaybe<PageSectionInput>;
  sectionIds?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  status?: InputMaybe<Scalars['String']>;
  videoCenterId: Scalars['String'];
};

export type PageSection = {
  __typename?: 'PageSection';
  alignment?: Maybe<Scalars['String']>;
  buttonEnabled?: Maybe<Scalars['Boolean']>;
  buttonExternalTarget?: Maybe<Scalars['String']>;
  buttonInternalTarget?: Maybe<Scalars['String']>;
  buttonTargetType?: Maybe<Scalars['String']>;
  buttonText?: Maybe<Scalars['String']>;
  contentFilterDateAbstract?: Maybe<Scalars['String']>;
  contentFilterType?: Maybe<Scalars['String']>;
  contentIds?: Maybe<Array<Maybe<Scalars['String']>>>;
  contentLimitOnInitialLoad?: Maybe<Scalars['Int']>;
  contentType?: Maybe<Scalars['String']>;
  featuredContentType?: Maybe<Scalars['String']>;
  featuredContentTypeId?: Maybe<Scalars['String']>;
  imageAltText?: Maybe<Scalars['String']>;
  imageUrl?: Maybe<Scalars['String']>;
  layout?: Maybe<Scalars['String']>;
  originPageId: Scalars['String'];
  originalImageUrl?: Maybe<Scalars['String']>;
  pageSectionTemplate?: Maybe<Scalars['String']>;
  sectionId: Scalars['String'];
  textBody?: Maybe<Scalars['String']>;
  textColor?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  visibleFields?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type PageSectionInput = {
  alignment?: InputMaybe<Scalars['String']>;
  buttonEnabled?: InputMaybe<Scalars['Boolean']>;
  buttonExternalTarget?: InputMaybe<Scalars['String']>;
  buttonInternalTarget?: InputMaybe<Scalars['String']>;
  buttonTargetType?: InputMaybe<Scalars['String']>;
  buttonText?: InputMaybe<Scalars['String']>;
  contentFilterDateAbstract?: InputMaybe<Scalars['String']>;
  contentFilterType?: InputMaybe<Scalars['String']>;
  contentIds?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  contentLimitOnInitialLoad?: InputMaybe<Scalars['Int']>;
  contentType?: InputMaybe<Scalars['String']>;
  featuredContentType?: InputMaybe<Scalars['String']>;
  featuredContentTypeId?: InputMaybe<Scalars['String']>;
  imageAltText?: InputMaybe<Scalars['String']>;
  imageUrl?: InputMaybe<Scalars['String']>;
  layout?: InputMaybe<Scalars['String']>;
  newImageUrl?: InputMaybe<Scalars['String']>;
  newOriginalImageUrl?: InputMaybe<Scalars['String']>;
  originPageId: Scalars['String'];
  originalImageUrl?: InputMaybe<Scalars['String']>;
  pageSectionTemplate?: InputMaybe<Scalars['String']>;
  sectionId: Scalars['String'];
  textBody?: InputMaybe<Scalars['String']>;
  textColor?: InputMaybe<Scalars['String']>;
  title?: InputMaybe<Scalars['String']>;
  visibleFields?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type PageWithSection = {
  __typename?: 'PageWithSection';
  newSection?: Maybe<PageSection>;
  page: Page;
};

export type PageWithSections = {
  __typename?: 'PageWithSections';
  page?: Maybe<Page>;
  sections?: Maybe<Array<Maybe<PageSection>>>;
};

export type PaginatedContactGroups = {
  __typename?: 'PaginatedContactGroups';
  data?: Maybe<Array<ContactGroupData>>;
  paging: PagingResponse;
};

export type PaginatedContactTypes = {
  __typename?: 'PaginatedContactTypes';
  data?: Maybe<Array<ContactTypesData>>;
  paging: PagingResponse;
};

export type PaginatedContactsResult = {
  __typename?: 'PaginatedContactsResult';
  data: Array<Maybe<ContactData>>;
  paging: PagingResponse;
};

export type PaginatedVideos = {
  __typename?: 'PaginatedVideos';
  data: Array<Maybe<Video>>;
  paging: PagingResponse;
};

export type Paging = {
  __typename?: 'Paging';
  currentToken: Scalars['String'];
  limit?: Maybe<Scalars['Int']>;
  nextToken?: Maybe<Scalars['String']>;
  totalCount?: Maybe<Scalars['Int']>;
};

export type PagingResponse = {
  __typename?: 'PagingResponse';
  currentToken: Scalars['String'];
  limit: Scalars['Int'];
  nextToken?: Maybe<Scalars['String']>;
  previousToken?: Maybe<Scalars['String']>;
  totalCount: Scalars['Int'];
};

/** Represents the path parameter and its value, for a specific page */
export type PathParam = {
  key: Scalars['String'];
  value: Scalars['JSON'];
};

export type PlannerChannelListObject = {
  __typename?: 'PlannerChannelListObject';
  catalogId?: Maybe<Scalars['ID']>;
  description: Scalars['String'];
  id: Scalars['ID'];
  imageUrl?: Maybe<Scalars['String']>;
  order: Scalars['Int'];
  status: ChannelStatus;
  title: Scalars['String'];
  videoCount: Scalars['Int'];
};

export type PlannerPaginatedChannels = {
  __typename?: 'PlannerPaginatedChannels';
  data: Array<Maybe<PlannerChannelListObject>>;
  paging: Paging;
};

export type PreSignedInput = {
  centerId: Scalars['ID'];
  entityId: Scalars['ID'];
  entityType: EntityType;
  fileExtension: Scalars['String'];
  fileName: Scalars['String'];
};

export type PreSignedResponse = {
  __typename?: 'PreSignedResponse';
  fileId: Scalars['ID'];
  fullFilePath: Scalars['String'];
  uploadUrl: Scalars['String'];
};

export type ProfileCard = {
  __typename?: 'ProfileCard';
  alignment?: Maybe<Scalars['String']>;
  allowCompanyEdit?: Maybe<Scalars['Boolean']>;
  allowHeadlineEdit?: Maybe<Scalars['Boolean']>;
  allowJobTitleEdit?: Maybe<Scalars['Boolean']>;
  allowNameEdit?: Maybe<Scalars['Boolean']>;
  allowPronounsEdit?: Maybe<Scalars['Boolean']>;
  allowSocialMediaEdit?: Maybe<Scalars['Boolean']>;
  border?: Maybe<Scalars['String']>;
  branding?: Maybe<Scalars['String']>;
  showCompany?: Maybe<Scalars['Boolean']>;
  showHeadline?: Maybe<Scalars['Boolean']>;
  showJobTitle?: Maybe<Scalars['Boolean']>;
  showName?: Maybe<Scalars['Boolean']>;
  showPronouns?: Maybe<Scalars['Boolean']>;
  showSocialMediaLinks?: Maybe<Scalars['Boolean']>;
};

export type ProfileCardInput = {
  alignment?: InputMaybe<Scalars['String']>;
  allowCompanyEdit?: InputMaybe<Scalars['Boolean']>;
  allowHeadlineEdit?: InputMaybe<Scalars['Boolean']>;
  allowJobTitleEdit?: InputMaybe<Scalars['Boolean']>;
  allowNameEdit?: InputMaybe<Scalars['Boolean']>;
  allowPronounsEdit?: InputMaybe<Scalars['Boolean']>;
  allowSocialMediaEdit?: InputMaybe<Scalars['Boolean']>;
  border?: InputMaybe<Scalars['String']>;
  branding?: InputMaybe<Scalars['String']>;
  showCompany?: InputMaybe<Scalars['Boolean']>;
  showHeadline?: InputMaybe<Scalars['Boolean']>;
  showJobTitle?: InputMaybe<Scalars['Boolean']>;
  showName?: InputMaybe<Scalars['Boolean']>;
  showPronouns?: InputMaybe<Scalars['Boolean']>;
  showSocialMediaLinks?: InputMaybe<Scalars['Boolean']>;
};

export type PublishImageInput = {
  accountMappingId: Scalars['String'];
  centerId: Scalars['ID'];
  entityId: Scalars['ID'];
  entityType: EntityType;
  fileExtension?: InputMaybe<Scalars['String']>;
  fileName?: InputMaybe<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  accountConfig?: Maybe<AccountVideoCenterConfig>;
  accountDetails?: Maybe<AccountDetails>;
  accountLocale?: Maybe<Array<Maybe<AccountLocale>>>;
  averageViewDurationByHubId?: Maybe<AnalyticsData>;
  banner?: Maybe<ExistingBanner>;
  bannerAssociations?: Maybe<BannerAssociationPaging>;
  banners?: Maybe<BannerPagingResponse>;
  calendars?: Maybe<CalendarsResponse>;
  checkScanStatus?: Maybe<S3ProxyCallbackPayload>;
  darkMode?: Maybe<Scalars['Boolean']>;
  fetchAndCreateShortUrlByTag?: Maybe<Array<Maybe<ShortUrlByTag>>>;
  fileImportHistory?: Maybe<Array<Maybe<FileImportHistory>>>;
  generatePreSignedUrl?: Maybe<PreSignedResponse>;
  getAccountCodeSnippets?: Maybe<CodeSnippetResponse>;
  getAccountSnapshot?: Maybe<AccountSnapshot>;
  getAllowedContactGroups?: Maybe<AllowedContactGroups>;
  getAllowedContactTypes?: Maybe<AllowedContactTypes>;
  getAppFeatures?: Maybe<Array<Maybe<AppFeature>>>;
  getBlockedContactGroups?: Maybe<BlockedContactGroups>;
  getBlockedContacts?: Maybe<BlockedContacts>;
  getCatalog?: Maybe<Catalog>;
  getCenterFeatures?: Maybe<Array<Maybe<Feature>>>;
  getChannelInformation?: Maybe<ChannelInformation>;
  getContact?: Maybe<ContactInformation>;
  getCustomDomainForAccount?: Maybe<Array<Maybe<CustomDomain>>>;
  getCustomDomainForHub?: Maybe<CustomDomainMapping>;
  getEmailDomains?: Maybe<AllowedDomains>;
  getEntityImage?: Maybe<EntityImage>;
  getGoogleMeasurementId?: Maybe<MeasurementIdResponse>;
  getHubCodeSnippets: Array<Maybe<HubCodeSnippets>>;
  getHubCustomizations?: Maybe<Customizations>;
  getHubLocales?: Maybe<HubLocalesWithDefault>;
  getHubSettings?: Maybe<Settings>;
  getHubTermsEditPermission?: Maybe<AllowTermsEdit>;
  getMemberData?: Maybe<MemberData>;
  getPage?: Maybe<PageWithSections>;
  getPlannerPaginatedChannels?: Maybe<PlannerPaginatedChannels>;
  getPublishedPageOrDefaults?: Maybe<PageWithSections>;
  getRegistrationCount?: Maybe<RegistrationCountResponse>;
  getRegistrationFormSettings?: Maybe<RegistrationFormSettings>;
  getTranslations?: Maybe<TranslationPagingResponse>;
  getUtmOverrides?: Maybe<Array<Maybe<UtmOverride>>>;
  getVideos?: Maybe<PaginatedVideos>;
  helpMenu?: Maybe<HelpMenu>;
  hub?: Maybe<Hub>;
  hubBanners?: Maybe<BannerPagingResponse>;
  hubPages?: Maybe<HubPages>;
  hubPagesWithBanner?: Maybe<HubPages>;
  hubs?: Maybe<HubsPagingResponse>;
  locale?: Maybe<Scalars['String']>;
  memberLogin?: Maybe<MemberLoginResponse>;
  memberVideoWatchDurationByHubId?: Maybe<MemberWatchDurationData>;
  /**
   * Returns navigation data for a given page. It takes 'navMetadata' input, which contains
   * the navigation metadata of current page
   */
  navigation?: Maybe<CarinaNavigation>;
  /** Query App Switcher links from navigation service */
  products?: Maybe<AppSwitcher>;
  recentItems?: Maybe<RecentItems>;
  searchContactGroups?: Maybe<PaginatedContactGroups>;
  searchContactTypes?: Maybe<PaginatedContactTypes>;
  searchContacts?: Maybe<PaginatedContactsResult>;
  searchMemberList?: Maybe<MemberListPaginatedResult>;
  topFiveVideosViewedByHubId?: Maybe<TopVideosResponse>;
  totalViewsByHubId?: Maybe<AnalyticsData>;
  user?: Maybe<UserDetails>;
  userPermissions?: Maybe<UserPermissions>;
  userUtilities?: Maybe<UserUtilities>;
  videosViewDetailsByHubId?: Maybe<VideoCountData>;
  viewsByDeviceType?: Maybe<ViewsBySourceResponse>;
};


export type QueryAverageViewDurationByHubIdArgs = {
  input: AnalyticsInput;
};


export type QueryBannerArgs = {
  bannersSearch: BannersSearch;
};


export type QueryBannerAssociationsArgs = {
  bannerAssociationSearch?: InputMaybe<BannerAssociationSearch>;
};


export type QueryBannersArgs = {
  bannerFilter: BannerFilter;
};


export type QueryCheckScanStatusArgs = {
  input: ScanStatusInput;
};


export type QueryFetchAndCreateShortUrlByTagArgs = {
  videoCenterId: Scalars['String'];
};


export type QueryFileImportHistoryArgs = {
  fileImportHistoryInput?: InputMaybe<FileImportHistoryInput>;
  hubId: Scalars['String'];
};


export type QueryGeneratePreSignedUrlArgs = {
  input: PreSignedInput;
};


export type QueryGetAllowedContactGroupsArgs = {
  input: GetAllowedContactGroupsInput;
};


export type QueryGetAllowedContactTypesArgs = {
  input: GetAllowedContactTypesInput;
};


export type QueryGetAppFeaturesArgs = {
  accountId?: InputMaybe<Scalars['Int']>;
  appFeatures: Array<AppFeatureInput>;
};


export type QueryGetBlockedContactGroupsArgs = {
  input: GetBlockedContactGroupsInput;
};


export type QueryGetBlockedContactsArgs = {
  input: GetBlockedContactsInput;
};


export type QueryGetCatalogArgs = {
  catalogId: Scalars['ID'];
};


export type QueryGetCenterFeaturesArgs = {
  id: HubSearch;
};


export type QueryGetChannelInformationArgs = {
  channelId?: InputMaybe<Scalars['String']>;
};


export type QueryGetContactArgs = {
  contactId: Scalars['ID'];
};


export type QueryGetCustomDomainForHubArgs = {
  hubId: Scalars['ID'];
};


export type QueryGetEmailDomainsArgs = {
  input: GetEmailDomainsInput;
};


export type QueryGetEntityImageArgs = {
  entity: EntityInput;
};


export type QueryGetGoogleMeasurementIdArgs = {
  hubId: Scalars['String'];
};


export type QueryGetHubCodeSnippetsArgs = {
  hubId: Scalars['String'];
};


export type QueryGetHubCustomizationsArgs = {
  id: HubSearch;
};


export type QueryGetHubLocalesArgs = {
  id: HubSearch;
};


export type QueryGetHubSettingsArgs = {
  id: HubSearch;
};


export type QueryGetHubTermsEditPermissionArgs = {
  id: HubSearch;
};


export type QueryGetMemberDataArgs = {
  input: MemberDataInput;
};


export type QueryGetPageArgs = {
  input: HubSearch;
};


export type QueryGetPlannerPaginatedChannelsArgs = {
  filterInput?: InputMaybe<FilterInput>;
  hubId: Scalars['String'];
};


export type QueryGetPublishedPageOrDefaultsArgs = {
  input: HubSearch;
};


export type QueryGetRegistrationCountArgs = {
  input: RegistrationCountRequest;
};


export type QueryGetRegistrationFormSettingsArgs = {
  input: RegistrationFormSettingInput;
};


export type QueryGetTranslationsArgs = {
  input: TranslationSearch;
};


export type QueryGetUtmOverridesArgs = {
  input: HubSearch;
};


export type QueryGetVideosArgs = {
  filterInput?: InputMaybe<VideoFilterInput>;
};


export type QueryHubArgs = {
  id?: InputMaybe<HubSearch>;
};


export type QueryHubBannersArgs = {
  bannerSearch?: InputMaybe<BannerSearch>;
};


export type QueryHubPagesArgs = {
  id: HubSearch;
};


export type QueryHubPagesWithBannerArgs = {
  input: BannerHubSearch;
};


export type QueryHubsArgs = {
  input?: InputMaybe<Hubs>;
};


export type QueryMemberLoginArgs = {
  memberLoginInput?: InputMaybe<MemberLoginInput>;
};


export type QueryMemberVideoWatchDurationByHubIdArgs = {
  input: MemberWatchInput;
};


export type QueryNavigationArgs = {
  navMetadata: NavMetadata;
};


export type QuerySearchContactGroupsArgs = {
  input?: InputMaybe<ContactGroupSearchInput>;
};


export type QuerySearchContactTypesArgs = {
  input?: InputMaybe<ContactSearchInput>;
};


export type QuerySearchContactsArgs = {
  input?: InputMaybe<ContactSearchInput>;
};


export type QuerySearchMemberListArgs = {
  input?: InputMaybe<SearchMemberInput>;
};


export type QueryTopFiveVideosViewedByHubIdArgs = {
  input: AnalyticsInput;
};


export type QueryTotalViewsByHubIdArgs = {
  input: AnalyticsInput;
};


export type QueryVideosViewDetailsByHubIdArgs = {
  input: AnalyticsInput;
};


export type QueryViewsByDeviceTypeArgs = {
  input: AnalyticsInput;
};

export type RecentItem = {
  __typename?: 'RecentItem';
  icon?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
};

export type RecentItems = {
  __typename?: 'RecentItems';
  items?: Maybe<Array<Maybe<RecentItem>>>;
  title?: Maybe<Scalars['String']>;
};

export type RecentVideoSearch = {
  token?: InputMaybe<Scalars['String']>;
  videoCenterId: Scalars['ID'];
};

export type RegistrationAge = {
  __typename?: 'RegistrationAge';
  days: Scalars['Int'];
  months: Scalars['Float'];
  years: Scalars['Int'];
};

export type RegistrationCount = {
  __typename?: 'RegistrationCount';
  date: Scalars['DateTime'];
  value: Scalars['Int'];
};

export type RegistrationCountRequest = {
  endDate: Scalars['DateTime'];
  hubId: Scalars['ID'];
  startDate: Scalars['DateTime'];
};

export type RegistrationCountResponse = {
  __typename?: 'RegistrationCountResponse';
  perDay?: Maybe<Array<RegistrationCount>>;
  perMonth?: Maybe<Array<RegistrationCount>>;
  perWeek?: Maybe<Array<RegistrationCount>>;
  serverError?: Maybe<Scalars['Boolean']>;
  total?: Maybe<Scalars['Int']>;
};

export enum RegistrationFieldCode {
  Address = 'ADDRESS',
  Company = 'COMPANY',
  JobTitle = 'JOB_TITLE',
  PhoneNumber = 'PHONE_NUMBER'
}

export type RegistrationFormSettingInput = {
  hubId: Scalars['ID'];
};

export type RegistrationFormSettings = {
  __typename?: 'RegistrationFormSettings';
  data: Array<Maybe<FormFieldSetting>>;
};

export type RegistrationSettings = {
  __typename?: 'RegistrationSettings';
  allowAllContactsRegistration?: Maybe<Scalars['Boolean']>;
  allowContactGroupsRegistration?: Maybe<Scalars['Boolean']>;
  allowContactTypesRegistration?: Maybe<Scalars['Boolean']>;
  allowedEmailDomain?: Maybe<AllowedEmailDomain>;
  blockContactsRegistration?: Maybe<Scalars['Boolean']>;
  blockListRegistration?: Maybe<Scalars['Boolean']>;
};

export type RegistrationSettingsInput = {
  allowAllContactsRegistration?: InputMaybe<Scalars['Boolean']>;
  allowContactGroupsRegistration?: InputMaybe<Scalars['Boolean']>;
  allowContactTypesRegistration?: InputMaybe<Scalars['Boolean']>;
  allowedEmailDomain?: InputMaybe<AllowedEmailDomain>;
  blockContactsRegistration?: InputMaybe<Scalars['Boolean']>;
  blockListRegistration?: InputMaybe<Scalars['Boolean']>;
};

export type RelatedVideoSearch = {
  videoCenterId: Scalars['ID'];
  videoId: Scalars['ID'];
};

export type RemoveCodeSnippetInput = {
  codeSnippetId: Scalars['ID'];
  hubId: Scalars['ID'];
};

export type ResetTranslationSearch = {
  hubId: Scalars['String'];
  locale: Scalars['String'];
  type?: InputMaybe<Scalars['String']>;
};

export type S3ProxyCallbackPayload = {
  __typename?: 'S3ProxyCallbackPayload';
  failureReason?: Maybe<Scalars['String']>;
  fileId?: Maybe<Scalars['String']>;
  fullFilePath?: Maybe<Scalars['String']>;
  location?: Maybe<Scalars['String']>;
  status?: Maybe<ScanStatus>;
};

export enum ScanStatus {
  Error = 'ERROR',
  Initialized = 'INITIALIZED',
  ScanFailed = 'SCAN_FAILED',
  ScanInProgress = 'SCAN_IN_PROGRESS',
  ScanSuccess = 'SCAN_SUCCESS'
}

export type ScanStatusInput = {
  filePath: Scalars['String'];
};

export type ScanStatusResponse = {
  __typename?: 'ScanStatusResponse';
  failureReason?: Maybe<Scalars['String']>;
  status: ScanStatus;
};

export type SearchMemberInput = {
  centerId: Scalars['ID'];
  pageLimit?: InputMaybe<Scalars['Int']>;
  searchTerm?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Scalars['String']>;
  token?: InputMaybe<Scalars['ID']>;
};

export type SectionInput = {
  id: Scalars['ID'];
  sectionType: SectionType;
  title: Scalars['String'];
  videos?: InputMaybe<Array<InputMaybe<VideoInput>>>;
};

export enum SectionType {
  Custom = 'CUSTOM',
  Default = 'DEFAULT'
}

export type Settings = {
  __typename?: 'Settings';
  allowHubSearchEngineIndexing?: Maybe<Scalars['Boolean']>;
  allowLimitedViewsBeforeLogin?: Maybe<Scalars['Boolean']>;
  allowLimitedViewsBeforeLoginCount?: Maybe<Scalars['Int']>;
  allowTurnOffCookies?: Maybe<Scalars['Boolean']>;
  allowTurnOffGoogleAnalytics?: Maybe<Scalars['Boolean']>;
  ccpaConfirmationText?: Maybe<Scalars['String']>;
  ccpaDoNotSellUrl?: Maybe<Scalars['String']>;
  ccpaDoNotSellUrlEnabled?: Maybe<Scalars['Boolean']>;
  ccpaEnableDoNotSell?: Maybe<Scalars['Boolean']>;
  ccpaLinkExplanationText?: Maybe<Scalars['String']>;
  ccpaLinkText?: Maybe<Scalars['String']>;
  ccpaSubmitButtonText?: Maybe<Scalars['String']>;
  cookieLists?: Maybe<CookieList>;
  cventPrivacyPolicyLinkText?: Maybe<Scalars['String']>;
  decorativeImage?: Maybe<Scalars['Boolean']>;
  displayCventPrivacyPolicy?: Maybe<Scalars['Boolean']>;
  displayCventPrivacyPolicyInCookie?: Maybe<Scalars['Boolean']>;
  displayPrivacyPolicy?: Maybe<Scalars['Boolean']>;
  displayTermsLinkOnFooter?: Maybe<Scalars['Boolean']>;
  displayTermsOnLogin?: Maybe<Scalars['Boolean']>;
  guestVisibility?: Maybe<GuestVisibility>;
  memberProfilePublic?: Maybe<Scalars['Boolean']>;
  notifyUsersAboutCookie?: Maybe<Scalars['Boolean']>;
  privacyPolicyLinkText?: Maybe<Scalars['String']>;
  privacyPolicyUrl?: Maybe<Scalars['String']>;
  profileCard?: Maybe<ProfileCard>;
  registrationBackground?: Maybe<BackGroundStyle>;
  registrationSettings?: Maybe<RegistrationSettings>;
  showLogo?: Maybe<Scalars['Boolean']>;
  termsLinkText?: Maybe<Scalars['String']>;
  termsText?: Maybe<Scalars['String']>;
};

export type SettingsInput = {
  allowHubSearchEngineIndexing?: InputMaybe<Scalars['Boolean']>;
  allowLimitedViewsBeforeLogin?: InputMaybe<Scalars['Boolean']>;
  allowLimitedViewsBeforeLoginCount?: InputMaybe<Scalars['Int']>;
  allowTurnOffCookies?: InputMaybe<Scalars['Boolean']>;
  allowTurnOffGoogleAnalytics?: InputMaybe<Scalars['Boolean']>;
  ccpaConfirmationText?: InputMaybe<Scalars['String']>;
  ccpaDoNotSellUrl?: InputMaybe<Scalars['String']>;
  ccpaDoNotSellUrlEnabled?: InputMaybe<Scalars['Boolean']>;
  ccpaEnableDoNotSell?: InputMaybe<Scalars['Boolean']>;
  ccpaLinkExplanationText?: InputMaybe<Scalars['String']>;
  ccpaLinkText?: InputMaybe<Scalars['String']>;
  ccpaSubmitButtonText?: InputMaybe<Scalars['String']>;
  cookieLists?: InputMaybe<CookieListInput>;
  cventPrivacyPolicyLinkText?: InputMaybe<Scalars['String']>;
  decorativeImage?: InputMaybe<Scalars['Boolean']>;
  displayCventPrivacyPolicy?: InputMaybe<Scalars['Boolean']>;
  displayCventPrivacyPolicyInCookie?: InputMaybe<Scalars['Boolean']>;
  displayPrivacyPolicy?: InputMaybe<Scalars['Boolean']>;
  displayTermsLinkOnFooter?: InputMaybe<Scalars['Boolean']>;
  displayTermsOnLogin?: InputMaybe<Scalars['Boolean']>;
  guestVisibility?: InputMaybe<GuestVisibility>;
  memberProfilePublic?: InputMaybe<Scalars['Boolean']>;
  notifyUsersAboutCookie?: InputMaybe<Scalars['Boolean']>;
  privacyPolicyLinkText?: InputMaybe<Scalars['String']>;
  privacyPolicyUrl?: InputMaybe<Scalars['String']>;
  profileCard?: InputMaybe<ProfileCardInput>;
  registrationBackground?: InputMaybe<BackGroundStyle>;
  registrationSettings?: InputMaybe<RegistrationSettingsInput>;
  showLogo?: InputMaybe<Scalars['Boolean']>;
  termsLinkText?: InputMaybe<Scalars['String']>;
  termsText?: InputMaybe<Scalars['String']>;
};

export type ShortUrlByTag = {
  __typename?: 'ShortUrlByTag';
  pageName?: Maybe<ShortUrlPage>;
  shortUrl?: Maybe<Scalars['String']>;
};

export enum ShortUrlPage {
  Channels = 'channels',
  Home = 'home',
  Registration = 'registration',
  Upcomingevents = 'upcomingevents',
  Videos = 'videos'
}

export type SocialMediaLinks = {
  __typename?: 'SocialMediaLinks';
  facebookUrl?: Maybe<Url>;
  linkedinUrl?: Maybe<Url>;
  twitterUrl?: Maybe<Url>;
};

export type SocialMediaLinksInput = {
  facebookUrl?: InputMaybe<UrlInput>;
  linkedinUrl?: InputMaybe<UrlInput>;
  twitterUrl?: InputMaybe<UrlInput>;
};

export enum SourceProvider {
  Brightcove = 'BRIGHTCOVE',
  CventVideo = 'CVENT_VIDEO'
}

export type Success = {
  __typename?: 'Success';
  success?: Maybe<Scalars['Boolean']>;
};

export enum TargetWebPages {
  AllVcPages = 'ALL_VC_PAGES',
  Login = 'LOGIN',
  SingleVideosPage = 'SINGLE_VIDEOS_PAGE'
}

export type TermsConsent = {
  __typename?: 'TermsConsent';
  contact?: Maybe<Contact>;
  termsAccepted: Scalars['Boolean'];
};

export type TermsInput = {
  contactId: Scalars['ID'];
  hubId: Scalars['ID'];
};

export type Theme = {
  __typename?: 'Theme';
  actionColor?: Maybe<Scalars['String']>;
  backgroundColor?: Maybe<Scalars['String']>;
  backgroundImageAltText?: Maybe<Scalars['String']>;
  backgroundImageUrl?: Maybe<Scalars['String']>;
  backgroundOriginalImageUrl?: Maybe<Scalars['String']>;
  bodyFont?: Maybe<Scalars['ID']>;
  faviconUrl?: Maybe<Scalars['String']>;
  headingsFont?: Maybe<Scalars['ID']>;
  logoAltText?: Maybe<Scalars['String']>;
  logoImageRelativePath?: Maybe<Scalars['String']>;
  logoImageUrl?: Maybe<Scalars['String']>;
  logoOriginalImageUrl?: Maybe<Scalars['String']>;
  mainColor?: Maybe<Scalars['String']>;
  moodColor?: Maybe<Scalars['String']>;
  safeMode?: Maybe<Scalars['Boolean']>;
};

export type ThemeInput = {
  actionColor?: InputMaybe<Scalars['String']>;
  backgroundColor?: InputMaybe<Scalars['String']>;
  backgroundImageAltText?: InputMaybe<Scalars['String']>;
  backgroundImageUrl?: InputMaybe<Scalars['String']>;
  backgroundOriginalImageUrl?: InputMaybe<Scalars['String']>;
  bodyFont?: InputMaybe<Scalars['ID']>;
  faviconUrl?: InputMaybe<Scalars['String']>;
  headingsFont?: InputMaybe<Scalars['ID']>;
  logoAltText?: InputMaybe<Scalars['String']>;
  logoImageRelativePath?: InputMaybe<Scalars['String']>;
  logoImageUrl?: InputMaybe<Scalars['String']>;
  logoOriginalImageUrl?: InputMaybe<Scalars['String']>;
  mainColor?: InputMaybe<Scalars['String']>;
  moodColor?: InputMaybe<Scalars['String']>;
  newBackgroundImageUrl?: InputMaybe<Scalars['String']>;
  newBackgroundOriginalImageUrl?: InputMaybe<Scalars['String']>;
  newLogoImageUrl?: InputMaybe<Scalars['String']>;
  newLogoOriginalImageUrl?: InputMaybe<Scalars['String']>;
  safeMode?: InputMaybe<Scalars['Boolean']>;
};

export type Thumbnail = {
  __typename?: 'Thumbnail';
  url?: Maybe<Url>;
};

export type TopVideos = {
  __typename?: 'TopVideos';
  currentPosition?: Maybe<Scalars['Int']>;
  previousPosition?: Maybe<Scalars['Int']>;
  totalViews?: Maybe<Scalars['Int']>;
  videoId: Scalars['String'];
  videoName?: Maybe<Scalars['String']>;
};

export type TopVideosResponse = {
  __typename?: 'TopVideosResponse';
  serverError?: Maybe<Scalars['Boolean']>;
  topVideos?: Maybe<Array<Maybe<TopVideos>>>;
};

export type Translation = {
  __typename?: 'Translation';
  defaultValue?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  locale: Scalars['String'];
  translatedValue?: Maybe<Scalars['String']>;
  type: Scalars['String'];
};

export type TranslationInput = {
  id: Scalars['String'];
  locale: Scalars['String'];
  translatedValue?: InputMaybe<Scalars['String']>;
  type: Scalars['String'];
};

export type TranslationPagingResponse = {
  __typename?: 'TranslationPagingResponse';
  data: Array<Maybe<Translation>>;
  paging: PagingResponse;
};

export type TranslationSearch = {
  hubId: Scalars['String'];
  limit?: InputMaybe<Scalars['Int']>;
  locale: Scalars['String'];
  sort?: InputMaybe<Scalars['String']>;
  token?: InputMaybe<Scalars['String']>;
  translationText?: InputMaybe<Scalars['String']>;
  translations?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<Scalars['String']>;
};

export type TranslationUpdateResponse = {
  __typename?: 'TranslationUpdateResponse';
  Failure?: Maybe<Array<Maybe<Translation>>>;
  Success?: Maybe<Array<Maybe<Translation>>>;
};

export type UpdateMemberStatusInput = {
  hubId: Scalars['ID'];
  memberIds: Array<Scalars['ID']>;
};

export type UpdateRecentItemsRequest = {
  id?: InputMaybe<Scalars['String']>;
  title?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<Scalars['String']>;
  url?: InputMaybe<Scalars['String']>;
};

export type Url = {
  __typename?: 'Url';
  href?: Maybe<Scalars['String']>;
};

export type UrlInput = {
  href: Scalars['String'];
};

export type UserDetails = {
  __typename?: 'UserDetails';
  company?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  firstName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  url?: Maybe<Url>;
  viewProfileText?: Maybe<Scalars['String']>;
};

export type UserPermissions = {
  __typename?: 'UserPermissions';
  EventsPlusCustomHeader?: Maybe<Scalars['Boolean']>;
  VideoCenter?: Maybe<Scalars['Boolean']>;
  VideoLibrary?: Maybe<Scalars['Boolean']>;
  VideoStorage?: Maybe<Scalars['Boolean']>;
};

export type UserProduct = {
  __typename?: 'UserProduct';
  icon: Scalars['String'];
  id: Scalars['String'];
  status: Scalars['String'];
  title: Scalars['String'];
  url: Url;
};

export type UserSoaPermissions = {
  __typename?: 'UserSoaPermissions';
  AccountId?: Maybe<Scalars['Int']>;
  EventRoleStubs?: Maybe<Array<Maybe<Scalars['String']>>>;
  Permissions?: Maybe<UserVideoCenterPermissions>;
  RoleStub?: Maybe<Scalars['String']>;
};

export type UserUtilities = {
  __typename?: 'UserUtilities';
  items: Array<Maybe<Utility>>;
  title?: Maybe<Scalars['String']>;
};

export type UserVideoCenterPermissions = {
  __typename?: 'UserVideoCenterPermissions';
  CVENT_EVENTS_PLUS_CUSTOM_HEADER?: Maybe<Scalars['Int']>;
  CVENT_VIDEO_CENTER_ACCESS?: Maybe<Scalars['Int']>;
  CVENT_VIDEO_CENTER_CONFIGURATION?: Maybe<Scalars['Int']>;
  CVENT_VIDEO_CENTER_CREATION?: Maybe<Scalars['Int']>;
  CVENT_VIDEO_EDIT?: Maybe<Scalars['Int']>;
  CVENT_VIDEO_LIBRARY_ACCESS?: Maybe<Scalars['Int']>;
  CVENT_VIDEO_STORAGE_MANAGEMENT?: Maybe<Scalars['Int']>;
  CVENT_VIDEO_UPLOAD?: Maybe<Scalars['Int']>;
};

export type Utility = {
  __typename?: 'Utility';
  hasCustomOnClickHandler?: Maybe<Scalars['Boolean']>;
  icon?: Maybe<Scalars['String']>;
  openInNewTab?: Maybe<Scalars['Boolean']>;
  title?: Maybe<Scalars['String']>;
  url?: Maybe<Url>;
};

export type UtmOverride = {
  __typename?: 'UtmOverride';
  key: Scalars['String'];
  value: Scalars['String'];
};

export type UtmOverrideInput = {
  key: Scalars['String'];
  value: Scalars['String'];
};

/** Validation type designed to work with @cvent/carina/components/Forms */
export type Validation = {
  __typename?: 'Validation';
  code?: Maybe<Scalars['String']>;
  details: Array<Maybe<ValidationDetail>>;
  httpRequestId?: Maybe<Scalars['ID']>;
  message?: Maybe<Scalars['String']>;
  target?: Maybe<Scalars['String']>;
};

/** Details about a Validation */
export type ValidationDetail = {
  __typename?: 'ValidationDetail';
  code: Scalars['String'];
  message: Scalars['String'];
  target: Scalars['String'];
};

export type Version = {
  __typename?: 'Version';
  version?: Maybe<Scalars['Int']>;
};

export type Video = {
  __typename?: 'Video';
  catalogs?: Maybe<Array<Maybe<VideoCatalog>>>;
  created?: Maybe<Scalars['String']>;
  createdBy?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  duration?: Maybe<Scalars['Int']>;
  events?: Maybe<Array<Maybe<Scalars['ID']>>>;
  exhibitors?: Maybe<Array<Maybe<Scalars['ID']>>>;
  generatedThumbnail?: Maybe<Thumbnail>;
  id: Scalars['ID'];
  lastModified?: Maybe<Scalars['String']>;
  lastModifiedBy?: Maybe<Scalars['String']>;
  originalSize?: Maybe<Scalars['String']>;
  sessions?: Maybe<Array<Maybe<Scalars['ID']>>>;
  source?: Maybe<VideoSource>;
  sourceProvider?: Maybe<SourceProvider>;
  speakers?: Maybe<Array<Maybe<Scalars['ID']>>>;
  status?: Maybe<VideoStatus>;
  tags?: Maybe<Array<Maybe<Scalars['String']>>>;
  thumbnail?: Maybe<Thumbnail>;
  title?: Maybe<Scalars['String']>;
  totalSize?: Maybe<Scalars['String']>;
};

export type VideoAnalyticsItem = {
  __typename?: 'VideoAnalyticsItem';
  thumbnail?: Maybe<Scalars['String']>;
  videoDuration?: Maybe<Scalars['Int']>;
  videoId?: Maybe<Scalars['ID']>;
  videoTitle?: Maybe<Scalars['String']>;
  views?: Maybe<Scalars['Int']>;
};

export type VideoCatalog = {
  __typename?: 'VideoCatalog';
  channel?: Maybe<VideoChannel>;
  id?: Maybe<Scalars['String']>;
  section?: Maybe<VideoSection>;
  videoCenters?: Maybe<Array<Maybe<Scalars['ID']>>>;
};

export type VideoChannel = {
  __typename?: 'VideoChannel';
  id?: Maybe<Scalars['String']>;
  status?: Maybe<ChannelStatus>;
};

export type VideoCountData = {
  __typename?: 'VideoCountData';
  data?: Maybe<Array<Maybe<VideoAnalyticsItem>>>;
  serverError?: Maybe<Scalars['Boolean']>;
};

export type VideoFilterInput = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Scalars['String']>;
  token?: InputMaybe<Scalars['String']>;
};

export type VideoHubChannel = {
  __typename?: 'VideoHubChannel';
  banners: Array<Maybe<Scalars['String']>>;
  catalogId?: Maybe<Scalars['ID']>;
  description: Scalars['String'];
  id: Scalars['ID'];
  imageUrl?: Maybe<Scalars['String']>;
  order: Scalars['Int'];
  shortUrl?: Maybe<Scalars['String']>;
  status: ChannelStatus;
  title: Scalars['String'];
};

export type VideoInput = {
  videoId: Scalars['ID'];
};

export type VideoPageShortUrl = {
  __typename?: 'VideoPageShortUrl';
  videoPageShortUrl?: Maybe<Scalars['String']>;
};

export type VideoPlaybackInfo = {
  __typename?: 'VideoPlaybackInfo';
  created?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  duration?: Maybe<Scalars['Float']>;
  event?: Maybe<Instance>;
  exhibitors?: Maybe<Array<Maybe<Scalars['String']>>>;
  generatedThumbnail?: Maybe<Link>;
  id: Scalars['String'];
  lastModified?: Maybe<Scalars['String']>;
  sessions?: Maybe<Array<Maybe<Scalars['String']>>>;
  source?: Maybe<VideoSource>;
  status?: Maybe<VideoStatus>;
  thumbnail?: Maybe<Link>;
  title: Scalars['String'];
  type?: Maybe<VideoType>;
  uploadCompleted?: Maybe<Scalars['String']>;
  uploadStarted?: Maybe<Scalars['String']>;
  url?: Maybe<Url>;
};

export type VideoRenditionResponse = {
  __typename?: 'VideoRenditionResponse';
  location?: Maybe<Url>;
  type?: Maybe<Scalars['String']>;
};

export type VideoSection = {
  __typename?: 'VideoSection';
  id?: Maybe<Scalars['String']>;
};

export type VideoSource = {
  __typename?: 'VideoSource';
  id?: Maybe<Scalars['String']>;
  status?: Maybe<VideoSourceStatus>;
};

export enum VideoSourceStatus {
  Active = 'Active',
  Deleted = 'Deleted',
  Inactive = 'Inactive',
  Pending = 'Pending'
}

export enum VideoStatus {
  Available = 'Available',
  Error = 'Error',
  ReSyncing = 'ReSyncing',
  Rejected = 'Rejected',
  Scanned = 'Scanned',
  Scanning = 'Scanning',
  Started = 'Started',
  Syncing = 'Syncing',
  Upcoming = 'Upcoming',
  Uploaded = 'Uploaded'
}

export enum VideoType {
  Hls = 'hls',
  Mov = 'mov',
  Mp2 = 'mp2',
  Mp4 = 'mp4',
  Mpe = 'mpe',
  Mpeg = 'mpeg',
  Mpg = 'mpg',
  Mpg2 = 'mpg2',
  Mpv = 'mpv',
  Qt = 'qt',
  Webm = 'webm'
}

export type ViewsBySourceResponse = {
  __typename?: 'ViewsBySourceResponse';
  desktopViews?: Maybe<Scalars['Int']>;
  mobileViews?: Maybe<Scalars['Int']>;
  serverError?: Maybe<Scalars['Boolean']>;
  tabletViews?: Maybe<Scalars['Int']>;
  totalViews?: Maybe<Scalars['Float']>;
};

export type UpdateRegistrationFormSettingInput = {
  data: Array<FormFieldSettingInput>;
  hubId: Scalars['ID'];
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  AWSDate: ResolverTypeWrapper<Scalars['AWSDate']>;
  AWSDateTime: ResolverTypeWrapper<Scalars['AWSDateTime']>;
  AWSEmail: ResolverTypeWrapper<Scalars['AWSEmail']>;
  AWSIPAddress: ResolverTypeWrapper<Scalars['AWSIPAddress']>;
  AWSJSON: ResolverTypeWrapper<Scalars['AWSJSON']>;
  AWSPhone: ResolverTypeWrapper<Scalars['AWSPhone']>;
  AWSTimestamp: ResolverTypeWrapper<Scalars['AWSTimestamp']>;
  AWSURL: ResolverTypeWrapper<Scalars['AWSURL']>;
  AccountCodeSnippet: ResolverTypeWrapper<AccountCodeSnippet>;
  AccountConfigBlade: ResolverTypeWrapper<AccountConfigBlade>;
  AccountConfigEventFeatures: ResolverTypeWrapper<AccountConfigEventFeatures>;
  AccountConfigEventFeaturesGeneral: ResolverTypeWrapper<AccountConfigEventFeaturesGeneral>;
  AccountConfigFeatures: ResolverTypeWrapper<AccountConfigFeatures>;
  AccountConfigGeneral: ResolverTypeWrapper<AccountConfigGeneral>;
  AccountConfigInternationalSettings: ResolverTypeWrapper<AccountConfigInternationalSettings>;
  AccountConfigVideoManagementFeatures: ResolverTypeWrapper<AccountConfigVideoManagementFeatures>;
  AccountDetails: ResolverTypeWrapper<AccountDetails>;
  AccountLocale: ResolverTypeWrapper<AccountLocale>;
  AccountSnapshot: ResolverTypeWrapper<AccountSnapshot>;
  AccountVideoCenterConfig: ResolverTypeWrapper<AccountVideoCenterConfig>;
  AllowTermsEdit: AllowTermsEdit;
  AllowedContactGroups: ResolverTypeWrapper<AllowedContactGroups>;
  AllowedContactTypes: ResolverTypeWrapper<AllowedContactTypes>;
  AllowedDomains: ResolverTypeWrapper<AllowedDomains>;
  AllowedEmailDomain: AllowedEmailDomain;
  AnalyticsData: ResolverTypeWrapper<AnalyticsData>;
  AnalyticsDataItem: ResolverTypeWrapper<AnalyticsDataItem>;
  AnalyticsInput: AnalyticsInput;
  AppFeature: ResolverTypeWrapper<AppFeature>;
  AppFeatureInput: AppFeatureInput;
  AppSwitcher: ResolverTypeWrapper<AppSwitcher>;
  ApplicableOn: ApplicableOn;
  BackGroundStyle: BackGroundStyle;
  BackgroundImagesInput: BackgroundImagesInput;
  BannerAssociation: BannerAssociation;
  BannerAssociationCreate: BannerAssociationCreate;
  BannerAssociationPaging: ResolverTypeWrapper<BannerAssociationPaging>;
  BannerAssociationSearch: BannerAssociationSearch;
  BannerButton: ResolverTypeWrapper<BannerButton>;
  BannerButtonInput: BannerButtonInput;
  BannerFilter: BannerFilter;
  BannerHubSearch: BannerHubSearch;
  BannerIdAssociation: BannerIdAssociation;
  BannerIdAssociationCreate: BannerIdAssociationCreate;
  BannerPagingResponse: ResolverTypeWrapper<BannerPagingResponse>;
  BannerSearch: BannerSearch;
  BannerText: ResolverTypeWrapper<BannerText>;
  BannerTextInput: BannerTextInput;
  BannerUpdate: BannerUpdate;
  BannersSearch: BannersSearch;
  BlockedContactGroups: ResolverTypeWrapper<BlockedContactGroups>;
  BlockedContactGroupsInput: BlockedContactGroupsInput;
  BlockedContacts: ResolverTypeWrapper<BlockedContacts>;
  BlockedContactsInput: BlockedContactsInput;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  BrandingImagesInput: BrandingImagesInput;
  Calendar: ResolverTypeWrapper<Calendar>;
  CalendarInput: CalendarInput;
  CalendarsResponse: ResolverTypeWrapper<CalendarsResponse>;
  CarinaAppIcon: CarinaAppIcon;
  CarinaAppSwitcher: ResolverTypeWrapper<CarinaAppSwitcher>;
  CarinaAppSwitcherLink: ResolverTypeWrapper<CarinaAppSwitcherLink>;
  CarinaAppSwitcherStatus: CarinaAppSwitcherStatus;
  CarinaApplicationSettings: ResolversTypes['CarinaNavigation'];
  CarinaLink: ResolverTypeWrapper<CarinaLink>;
  CarinaNavItem: ResolverTypeWrapper<CarinaNavItem>;
  CarinaNavigation: ResolverTypeWrapper<CarinaNavigation>;
  CarinaNavigationLogo: ResolverTypeWrapper<CarinaNavigationLogo>;
  CarinaSearch: ResolverTypeWrapper<CarinaSearch>;
  Catalog: ResolverTypeWrapper<Catalog>;
  CatalogInput: CatalogInput;
  CatalogOwnerType: CatalogOwnerType;
  CatalogSection: ResolverTypeWrapper<CatalogSection>;
  CatalogType: CatalogType;
  CatalogVideo: ResolverTypeWrapper<CatalogVideo>;
  Channel: ResolverTypeWrapper<Channel>;
  ChannelBannerInput: ChannelBannerInput;
  ChannelBannerOutput: ResolverTypeWrapper<ChannelBannerOutput>;
  ChannelImage: ResolverTypeWrapper<ChannelImage>;
  ChannelInformation: ResolverTypeWrapper<ChannelInformation>;
  ChannelInput: ChannelInput;
  ChannelOrder: ResolverTypeWrapper<ChannelOrder>;
  ChannelOrderInput: ChannelOrderInput;
  ChannelStatus: ChannelStatus;
  CodeSnippet: ResolverTypeWrapper<CodeSnippet>;
  CodeSnippetHubRequest: never;
  CodeSnippetHubResponse: never;
  CodeSnippetInput: CodeSnippetInput;
  CodeSnippetResponse: ResolverTypeWrapper<CodeSnippetResponse>;
  CodeSnippetStatus: CodeSnippetStatus;
  Compliance: ResolverTypeWrapper<Compliance>;
  Config: ResolverTypeWrapper<Config>;
  ConfigInput: ConfigInput;
  ConfigStatus: ConfigStatus;
  Contact: ResolverTypeWrapper<Contact>;
  ContactData: ResolverTypeWrapper<ContactData>;
  ContactGroupData: ResolverTypeWrapper<ContactGroupData>;
  ContactGroupSearchInput: ContactGroupSearchInput;
  ContactGroupsInput: ContactGroupsInput;
  ContactImage: ResolverTypeWrapper<ContactImage>;
  ContactInformation: ResolverTypeWrapper<ContactInformation>;
  ContactSearchInput: ContactSearchInput;
  ContactTypesData: ResolverTypeWrapper<ContactTypesData>;
  ContactTypesInput: ContactTypesInput;
  CookieList: ResolverTypeWrapper<CookieList>;
  CookieListInput: CookieListInput;
  Culture: ResolverTypeWrapper<Culture>;
  CustomDomain: ResolverTypeWrapper<CustomDomain>;
  CustomDomainMapping: ResolverTypeWrapper<CustomDomainMapping>;
  CustomDomainMappingInput: CustomDomainMappingInput;
  CustomFont: ResolverTypeWrapper<CustomFont>;
  Customizations: ResolverTypeWrapper<Customizations>;
  CustomizationsInput: CustomizationsInput;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']>;
  DefaultLandingPage: DefaultLandingPage;
  DeleteContactTypesResponse: ResolverTypeWrapper<DeleteContactTypesResponse>;
  EmailDomainsInput: EmailDomainsInput;
  EntityImage: ResolverTypeWrapper<EntityImage>;
  EntityImageInput: EntityImageInput;
  EntityInput: EntityInput;
  EntityType: EntityType;
  EventCalendar: ResolverTypeWrapper<EventCalendar>;
  ExistingBanner: ResolverTypeWrapper<ExistingBanner>;
  ExistingBannerAssociationWithBanner: ResolverTypeWrapper<ExistingBannerAssociationWithBanner>;
  ExperimentResponse: ResolverTypeWrapper<ExperimentResponse>;
  ExperimentVariant: ResolverTypeWrapper<ExperimentVariant>;
  Feature: ResolverTypeWrapper<Feature>;
  FeatureInput: FeatureInput;
  FeatureStatusInput: FeatureStatusInput;
  FileImportHistory: ResolverTypeWrapper<FileImportHistory>;
  FileImportHistoryInput: FileImportHistoryInput;
  FileImportHistoryParams: ResolverTypeWrapper<FileImportHistoryParams>;
  FilterInput: FilterInput;
  Float: ResolverTypeWrapper<Scalars['Float']>;
  FontFile: ResolverTypeWrapper<FontFile>;
  FormFieldSetting: ResolverTypeWrapper<FormFieldSetting>;
  FormFieldSettingInput: FormFieldSettingInput;
  GetAllowedContactGroupsInput: GetAllowedContactGroupsInput;
  GetAllowedContactTypesInput: GetAllowedContactTypesInput;
  GetBlockedContactGroupsInput: GetBlockedContactGroupsInput;
  GetBlockedContactsInput: GetBlockedContactsInput;
  GetEmailDomainsInput: GetEmailDomainsInput;
  GuestVisibility: GuestVisibility;
  HelpMenu: ResolverTypeWrapper<HelpMenu>;
  HttpHeader: ResolverTypeWrapper<HttpHeader>;
  HttpMethod: HttpMethod;
  Hub: ResolverTypeWrapper<Hub>;
  HubCodeSnippets: ResolverTypeWrapper<HubCodeSnippets>;
  HubCreate: HubCreate;
  HubDataSourceList: ResolverTypeWrapper<HubDataSourceList>;
  HubDataSourceRecord: ResolverTypeWrapper<HubDataSourceRecord>;
  HubLocaleWithDefault: ResolverTypeWrapper<HubLocaleWithDefault>;
  HubLocales: HubLocales;
  HubLocalesWithDefault: ResolverTypeWrapper<HubLocalesWithDefault>;
  HubPage: ResolverTypeWrapper<HubPage>;
  HubPages: ResolverTypeWrapper<HubPages>;
  HubResult: ResolversTypes['Hub'] | ResolversTypes['Validation'];
  HubSearch: HubSearch;
  HubStatusInput: ResolverTypeWrapper<HubStatusInput>;
  HubUpdate: HubUpdate;
  HubUpdateSettings: HubUpdateSettings;
  Hubs: Hubs;
  HubsPagingResponse: ResolverTypeWrapper<HubsPagingResponse>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  IdBanner: IdBanner;
  ImageFieldDelta: ImageFieldDelta;
  ImageInput: ImageInput;
  Instance: ResolverTypeWrapper<Instance>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  JSON: ResolverTypeWrapper<Scalars['JSON']>;
  Link: ResolverTypeWrapper<Link>;
  Locale: ResolverTypeWrapper<Locale>;
  LoginType: LoginType;
  MeasurementIdInput: MeasurementIdInput;
  MeasurementIdResponse: ResolverTypeWrapper<MeasurementIdResponse>;
  MemberData: ResolverTypeWrapper<MemberData>;
  MemberDataInput: MemberDataInput;
  MemberInfo: MemberInfo;
  MemberListData: ResolverTypeWrapper<MemberListData>;
  MemberListPaginatedResult: ResolverTypeWrapper<MemberListPaginatedResult>;
  MemberLoginInput: MemberLoginInput;
  MemberLoginResponse: ResolverTypeWrapper<MemberLoginResponse>;
  MemberPaginatedChannels: ResolverTypeWrapper<MemberPaginatedChannels>;
  MemberProfile: ResolverTypeWrapper<MemberProfile>;
  MemberProfileInput: MemberProfileInput;
  MemberProfileUpdate: MemberProfileUpdate;
  MemberProfileVisible: ResolverTypeWrapper<MemberProfileVisible>;
  MemberVideoWatchData: ResolverTypeWrapper<MemberVideoWatchData>;
  MemberVisibilityInput: MemberVisibilityInput;
  MemberWatchDurationData: ResolverTypeWrapper<MemberWatchDurationData>;
  MemberWatchInput: MemberWatchInput;
  Mutation: ResolverTypeWrapper<{}>;
  NavMetadata: NavMetadata;
  NavigationAlignment: NavigationAlignment;
  NavigationLinkHighlightStyle: NavigationLinkHighlightStyle;
  NewBanner: NewBanner;
  OneTimeToken: ResolverTypeWrapper<OneTimeToken>;
  Page: ResolverTypeWrapper<Page>;
  PageInput: PageInput;
  PageSection: ResolverTypeWrapper<PageSection>;
  PageSectionInput: PageSectionInput;
  PageWithSection: ResolverTypeWrapper<PageWithSection>;
  PageWithSections: ResolverTypeWrapper<PageWithSections>;
  PaginatedContactGroups: ResolverTypeWrapper<PaginatedContactGroups>;
  PaginatedContactTypes: ResolverTypeWrapper<PaginatedContactTypes>;
  PaginatedContactsResult: ResolverTypeWrapper<PaginatedContactsResult>;
  PaginatedVideos: ResolverTypeWrapper<PaginatedVideos>;
  Paging: ResolverTypeWrapper<Paging>;
  PagingResponse: ResolverTypeWrapper<PagingResponse>;
  PathParam: PathParam;
  PlannerChannelListObject: ResolverTypeWrapper<PlannerChannelListObject>;
  PlannerPaginatedChannels: ResolverTypeWrapper<PlannerPaginatedChannels>;
  PreSignedInput: PreSignedInput;
  PreSignedResponse: ResolverTypeWrapper<PreSignedResponse>;
  ProfileCard: ResolverTypeWrapper<ProfileCard>;
  ProfileCardInput: ProfileCardInput;
  PublishImageInput: PublishImageInput;
  Query: ResolverTypeWrapper<{}>;
  RecentItem: ResolverTypeWrapper<RecentItem>;
  RecentItems: ResolverTypeWrapper<RecentItems>;
  RecentVideoSearch: RecentVideoSearch;
  RegistrationAge: ResolverTypeWrapper<RegistrationAge>;
  RegistrationCount: ResolverTypeWrapper<RegistrationCount>;
  RegistrationCountRequest: RegistrationCountRequest;
  RegistrationCountResponse: ResolverTypeWrapper<RegistrationCountResponse>;
  RegistrationFieldCode: RegistrationFieldCode;
  RegistrationFormSettingInput: RegistrationFormSettingInput;
  RegistrationFormSettings: ResolverTypeWrapper<RegistrationFormSettings>;
  RegistrationSettings: ResolverTypeWrapper<RegistrationSettings>;
  RegistrationSettingsInput: RegistrationSettingsInput;
  RelatedVideoSearch: RelatedVideoSearch;
  RemoveCodeSnippetInput: RemoveCodeSnippetInput;
  ResetTranslationSearch: ResetTranslationSearch;
  S3ProxyCallbackPayload: ResolverTypeWrapper<S3ProxyCallbackPayload>;
  ScanStatus: ScanStatus;
  ScanStatusInput: ScanStatusInput;
  ScanStatusResponse: ResolverTypeWrapper<ScanStatusResponse>;
  SearchMemberInput: SearchMemberInput;
  SectionInput: SectionInput;
  SectionType: SectionType;
  Settings: ResolverTypeWrapper<Settings>;
  SettingsInput: SettingsInput;
  ShortUrlByTag: ResolverTypeWrapper<ShortUrlByTag>;
  ShortUrlPage: ShortUrlPage;
  SocialMediaLinks: ResolverTypeWrapper<SocialMediaLinks>;
  SocialMediaLinksInput: SocialMediaLinksInput;
  SourceProvider: SourceProvider;
  String: ResolverTypeWrapper<Scalars['String']>;
  Success: ResolverTypeWrapper<Success>;
  TargetWebPages: TargetWebPages;
  TermsConsent: ResolverTypeWrapper<TermsConsent>;
  TermsInput: TermsInput;
  Theme: ResolverTypeWrapper<Theme>;
  ThemeInput: ThemeInput;
  Thumbnail: ResolverTypeWrapper<Thumbnail>;
  TopVideos: ResolverTypeWrapper<TopVideos>;
  TopVideosResponse: ResolverTypeWrapper<TopVideosResponse>;
  Translation: ResolverTypeWrapper<Translation>;
  TranslationInput: TranslationInput;
  TranslationPagingResponse: ResolverTypeWrapper<TranslationPagingResponse>;
  TranslationSearch: TranslationSearch;
  TranslationUpdateResponse: ResolverTypeWrapper<TranslationUpdateResponse>;
  UpdateMemberStatusInput: UpdateMemberStatusInput;
  UpdateRecentItemsRequest: UpdateRecentItemsRequest;
  Url: ResolverTypeWrapper<Url>;
  UrlInput: UrlInput;
  UserDetails: ResolverTypeWrapper<UserDetails>;
  UserPermissions: ResolverTypeWrapper<UserPermissions>;
  UserProduct: ResolverTypeWrapper<UserProduct>;
  UserSoaPermissions: ResolverTypeWrapper<UserSoaPermissions>;
  UserUtilities: ResolverTypeWrapper<UserUtilities>;
  UserVideoCenterPermissions: ResolverTypeWrapper<UserVideoCenterPermissions>;
  Utility: ResolverTypeWrapper<Utility>;
  UtmOverride: ResolverTypeWrapper<UtmOverride>;
  UtmOverrideInput: UtmOverrideInput;
  Validation: ResolverTypeWrapper<Validation>;
  ValidationDetail: ResolverTypeWrapper<ValidationDetail>;
  Version: ResolverTypeWrapper<Version>;
  Video: ResolverTypeWrapper<Video>;
  VideoAnalyticsItem: ResolverTypeWrapper<VideoAnalyticsItem>;
  VideoCatalog: ResolverTypeWrapper<VideoCatalog>;
  VideoChannel: ResolverTypeWrapper<VideoChannel>;
  VideoCountData: ResolverTypeWrapper<VideoCountData>;
  VideoFilterInput: VideoFilterInput;
  VideoHubChannel: ResolverTypeWrapper<VideoHubChannel>;
  VideoInput: VideoInput;
  VideoPageShortUrl: ResolverTypeWrapper<VideoPageShortUrl>;
  VideoPlaybackInfo: ResolverTypeWrapper<VideoPlaybackInfo>;
  VideoRenditionResponse: ResolverTypeWrapper<VideoRenditionResponse>;
  VideoSection: ResolverTypeWrapper<VideoSection>;
  VideoSource: ResolverTypeWrapper<VideoSource>;
  VideoSourceStatus: VideoSourceStatus;
  VideoStatus: VideoStatus;
  VideoType: VideoType;
  ViewsBySourceResponse: ResolverTypeWrapper<ViewsBySourceResponse>;
  updateRegistrationFormSettingInput: UpdateRegistrationFormSettingInput;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  AWSDate: Scalars['AWSDate'];
  AWSDateTime: Scalars['AWSDateTime'];
  AWSEmail: Scalars['AWSEmail'];
  AWSIPAddress: Scalars['AWSIPAddress'];
  AWSJSON: Scalars['AWSJSON'];
  AWSPhone: Scalars['AWSPhone'];
  AWSTimestamp: Scalars['AWSTimestamp'];
  AWSURL: Scalars['AWSURL'];
  AccountCodeSnippet: AccountCodeSnippet;
  AccountConfigBlade: AccountConfigBlade;
  AccountConfigEventFeatures: AccountConfigEventFeatures;
  AccountConfigEventFeaturesGeneral: AccountConfigEventFeaturesGeneral;
  AccountConfigFeatures: AccountConfigFeatures;
  AccountConfigGeneral: AccountConfigGeneral;
  AccountConfigInternationalSettings: AccountConfigInternationalSettings;
  AccountConfigVideoManagementFeatures: AccountConfigVideoManagementFeatures;
  AccountDetails: AccountDetails;
  AccountLocale: AccountLocale;
  AccountSnapshot: AccountSnapshot;
  AccountVideoCenterConfig: AccountVideoCenterConfig;
  AllowedContactGroups: AllowedContactGroups;
  AllowedContactTypes: AllowedContactTypes;
  AllowedDomains: AllowedDomains;
  AnalyticsData: AnalyticsData;
  AnalyticsDataItem: AnalyticsDataItem;
  AnalyticsInput: AnalyticsInput;
  AppFeature: AppFeature;
  AppFeatureInput: AppFeatureInput;
  AppSwitcher: AppSwitcher;
  BackgroundImagesInput: BackgroundImagesInput;
  BannerAssociation: BannerAssociation;
  BannerAssociationCreate: BannerAssociationCreate;
  BannerAssociationPaging: BannerAssociationPaging;
  BannerAssociationSearch: BannerAssociationSearch;
  BannerButton: BannerButton;
  BannerButtonInput: BannerButtonInput;
  BannerFilter: BannerFilter;
  BannerHubSearch: BannerHubSearch;
  BannerIdAssociation: BannerIdAssociation;
  BannerIdAssociationCreate: BannerIdAssociationCreate;
  BannerPagingResponse: BannerPagingResponse;
  BannerSearch: BannerSearch;
  BannerText: BannerText;
  BannerTextInput: BannerTextInput;
  BannerUpdate: BannerUpdate;
  BannersSearch: BannersSearch;
  BlockedContactGroups: BlockedContactGroups;
  BlockedContactGroupsInput: BlockedContactGroupsInput;
  BlockedContacts: BlockedContacts;
  BlockedContactsInput: BlockedContactsInput;
  Boolean: Scalars['Boolean'];
  BrandingImagesInput: BrandingImagesInput;
  Calendar: Calendar;
  CalendarInput: CalendarInput;
  CalendarsResponse: CalendarsResponse;
  CarinaAppSwitcher: CarinaAppSwitcher;
  CarinaAppSwitcherLink: CarinaAppSwitcherLink;
  CarinaApplicationSettings: ResolversParentTypes['CarinaNavigation'];
  CarinaLink: CarinaLink;
  CarinaNavItem: CarinaNavItem;
  CarinaNavigation: CarinaNavigation;
  CarinaNavigationLogo: CarinaNavigationLogo;
  CarinaSearch: CarinaSearch;
  Catalog: Catalog;
  CatalogInput: CatalogInput;
  CatalogSection: CatalogSection;
  CatalogVideo: CatalogVideo;
  Channel: Channel;
  ChannelBannerInput: ChannelBannerInput;
  ChannelBannerOutput: ChannelBannerOutput;
  ChannelImage: ChannelImage;
  ChannelInformation: ChannelInformation;
  ChannelInput: ChannelInput;
  ChannelOrder: ChannelOrder;
  ChannelOrderInput: ChannelOrderInput;
  CodeSnippet: CodeSnippet;
  CodeSnippetHubRequest: never;
  CodeSnippetHubResponse: never;
  CodeSnippetInput: CodeSnippetInput;
  CodeSnippetResponse: CodeSnippetResponse;
  Compliance: Compliance;
  Config: Config;
  ConfigInput: ConfigInput;
  Contact: Contact;
  ContactData: ContactData;
  ContactGroupData: ContactGroupData;
  ContactGroupSearchInput: ContactGroupSearchInput;
  ContactGroupsInput: ContactGroupsInput;
  ContactImage: ContactImage;
  ContactInformation: ContactInformation;
  ContactSearchInput: ContactSearchInput;
  ContactTypesData: ContactTypesData;
  ContactTypesInput: ContactTypesInput;
  CookieList: CookieList;
  CookieListInput: CookieListInput;
  Culture: Culture;
  CustomDomain: CustomDomain;
  CustomDomainMapping: CustomDomainMapping;
  CustomDomainMappingInput: CustomDomainMappingInput;
  CustomFont: CustomFont;
  Customizations: Customizations;
  CustomizationsInput: CustomizationsInput;
  DateTime: Scalars['DateTime'];
  DeleteContactTypesResponse: DeleteContactTypesResponse;
  EmailDomainsInput: EmailDomainsInput;
  EntityImage: EntityImage;
  EntityImageInput: EntityImageInput;
  EntityInput: EntityInput;
  EventCalendar: EventCalendar;
  ExistingBanner: ExistingBanner;
  ExistingBannerAssociationWithBanner: ExistingBannerAssociationWithBanner;
  ExperimentResponse: ExperimentResponse;
  ExperimentVariant: ExperimentVariant;
  Feature: Feature;
  FeatureInput: FeatureInput;
  FeatureStatusInput: FeatureStatusInput;
  FileImportHistory: FileImportHistory;
  FileImportHistoryInput: FileImportHistoryInput;
  FileImportHistoryParams: FileImportHistoryParams;
  FilterInput: FilterInput;
  Float: Scalars['Float'];
  FontFile: FontFile;
  FormFieldSetting: FormFieldSetting;
  FormFieldSettingInput: FormFieldSettingInput;
  GetAllowedContactGroupsInput: GetAllowedContactGroupsInput;
  GetAllowedContactTypesInput: GetAllowedContactTypesInput;
  GetBlockedContactGroupsInput: GetBlockedContactGroupsInput;
  GetBlockedContactsInput: GetBlockedContactsInput;
  GetEmailDomainsInput: GetEmailDomainsInput;
  HelpMenu: HelpMenu;
  HttpHeader: HttpHeader;
  Hub: Hub;
  HubCodeSnippets: HubCodeSnippets;
  HubCreate: HubCreate;
  HubDataSourceList: HubDataSourceList;
  HubDataSourceRecord: HubDataSourceRecord;
  HubLocaleWithDefault: HubLocaleWithDefault;
  HubLocales: HubLocales;
  HubLocalesWithDefault: HubLocalesWithDefault;
  HubPage: HubPage;
  HubPages: HubPages;
  HubResult: ResolversParentTypes['Hub'] | ResolversParentTypes['Validation'];
  HubSearch: HubSearch;
  HubStatusInput: HubStatusInput;
  HubUpdate: HubUpdate;
  HubUpdateSettings: HubUpdateSettings;
  Hubs: Hubs;
  HubsPagingResponse: HubsPagingResponse;
  ID: Scalars['ID'];
  IdBanner: IdBanner;
  ImageFieldDelta: ImageFieldDelta;
  ImageInput: ImageInput;
  Instance: Instance;
  Int: Scalars['Int'];
  JSON: Scalars['JSON'];
  Link: Link;
  Locale: Locale;
  MeasurementIdInput: MeasurementIdInput;
  MeasurementIdResponse: MeasurementIdResponse;
  MemberData: MemberData;
  MemberDataInput: MemberDataInput;
  MemberInfo: MemberInfo;
  MemberListData: MemberListData;
  MemberListPaginatedResult: MemberListPaginatedResult;
  MemberLoginInput: MemberLoginInput;
  MemberLoginResponse: MemberLoginResponse;
  MemberPaginatedChannels: MemberPaginatedChannels;
  MemberProfile: MemberProfile;
  MemberProfileInput: MemberProfileInput;
  MemberProfileUpdate: MemberProfileUpdate;
  MemberProfileVisible: MemberProfileVisible;
  MemberVideoWatchData: MemberVideoWatchData;
  MemberVisibilityInput: MemberVisibilityInput;
  MemberWatchDurationData: MemberWatchDurationData;
  MemberWatchInput: MemberWatchInput;
  Mutation: {};
  NavMetadata: NavMetadata;
  NewBanner: NewBanner;
  OneTimeToken: OneTimeToken;
  Page: Page;
  PageInput: PageInput;
  PageSection: PageSection;
  PageSectionInput: PageSectionInput;
  PageWithSection: PageWithSection;
  PageWithSections: PageWithSections;
  PaginatedContactGroups: PaginatedContactGroups;
  PaginatedContactTypes: PaginatedContactTypes;
  PaginatedContactsResult: PaginatedContactsResult;
  PaginatedVideos: PaginatedVideos;
  Paging: Paging;
  PagingResponse: PagingResponse;
  PathParam: PathParam;
  PlannerChannelListObject: PlannerChannelListObject;
  PlannerPaginatedChannels: PlannerPaginatedChannels;
  PreSignedInput: PreSignedInput;
  PreSignedResponse: PreSignedResponse;
  ProfileCard: ProfileCard;
  ProfileCardInput: ProfileCardInput;
  PublishImageInput: PublishImageInput;
  Query: {};
  RecentItem: RecentItem;
  RecentItems: RecentItems;
  RecentVideoSearch: RecentVideoSearch;
  RegistrationAge: RegistrationAge;
  RegistrationCount: RegistrationCount;
  RegistrationCountRequest: RegistrationCountRequest;
  RegistrationCountResponse: RegistrationCountResponse;
  RegistrationFormSettingInput: RegistrationFormSettingInput;
  RegistrationFormSettings: RegistrationFormSettings;
  RegistrationSettings: RegistrationSettings;
  RegistrationSettingsInput: RegistrationSettingsInput;
  RelatedVideoSearch: RelatedVideoSearch;
  RemoveCodeSnippetInput: RemoveCodeSnippetInput;
  ResetTranslationSearch: ResetTranslationSearch;
  S3ProxyCallbackPayload: S3ProxyCallbackPayload;
  ScanStatusInput: ScanStatusInput;
  ScanStatusResponse: ScanStatusResponse;
  SearchMemberInput: SearchMemberInput;
  SectionInput: SectionInput;
  Settings: Settings;
  SettingsInput: SettingsInput;
  ShortUrlByTag: ShortUrlByTag;
  SocialMediaLinks: SocialMediaLinks;
  SocialMediaLinksInput: SocialMediaLinksInput;
  String: Scalars['String'];
  Success: Success;
  TermsConsent: TermsConsent;
  TermsInput: TermsInput;
  Theme: Theme;
  ThemeInput: ThemeInput;
  Thumbnail: Thumbnail;
  TopVideos: TopVideos;
  TopVideosResponse: TopVideosResponse;
  Translation: Translation;
  TranslationInput: TranslationInput;
  TranslationPagingResponse: TranslationPagingResponse;
  TranslationSearch: TranslationSearch;
  TranslationUpdateResponse: TranslationUpdateResponse;
  UpdateMemberStatusInput: UpdateMemberStatusInput;
  UpdateRecentItemsRequest: UpdateRecentItemsRequest;
  Url: Url;
  UrlInput: UrlInput;
  UserDetails: UserDetails;
  UserPermissions: UserPermissions;
  UserProduct: UserProduct;
  UserSoaPermissions: UserSoaPermissions;
  UserUtilities: UserUtilities;
  UserVideoCenterPermissions: UserVideoCenterPermissions;
  Utility: Utility;
  UtmOverride: UtmOverride;
  UtmOverrideInput: UtmOverrideInput;
  Validation: Validation;
  ValidationDetail: ValidationDetail;
  Version: Version;
  Video: Video;
  VideoAnalyticsItem: VideoAnalyticsItem;
  VideoCatalog: VideoCatalog;
  VideoChannel: VideoChannel;
  VideoCountData: VideoCountData;
  VideoFilterInput: VideoFilterInput;
  VideoHubChannel: VideoHubChannel;
  VideoInput: VideoInput;
  VideoPageShortUrl: VideoPageShortUrl;
  VideoPlaybackInfo: VideoPlaybackInfo;
  VideoRenditionResponse: VideoRenditionResponse;
  VideoSection: VideoSection;
  VideoSource: VideoSource;
  ViewsBySourceResponse: ViewsBySourceResponse;
  updateRegistrationFormSettingInput: UpdateRegistrationFormSettingInput;
};

export type ClientDirectiveArgs = { };

export type ClientDirectiveResolver<Result, Parent, ContextType = any, Args = ClientDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export interface AwsDateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['AWSDate'], any> {
  name: 'AWSDate';
}

export interface AwsDateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['AWSDateTime'], any> {
  name: 'AWSDateTime';
}

export interface AwsEmailScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['AWSEmail'], any> {
  name: 'AWSEmail';
}

export interface AwsipAddressScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['AWSIPAddress'], any> {
  name: 'AWSIPAddress';
}

export interface AwsjsonScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['AWSJSON'], any> {
  name: 'AWSJSON';
}

export interface AwsPhoneScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['AWSPhone'], any> {
  name: 'AWSPhone';
}

export interface AwsTimestampScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['AWSTimestamp'], any> {
  name: 'AWSTimestamp';
}

export interface AwsurlScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['AWSURL'], any> {
  name: 'AWSURL';
}

export type AccountCodeSnippetResolvers<ContextType = any, ParentType extends ResolversParentTypes['AccountCodeSnippet'] = ResolversParentTypes['AccountCodeSnippet']> = {
  codeSnippetDataTagCode?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  codeSnippetId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  codeSnippetName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  codeSnippetStatus?: Resolver<ResolversTypes['CodeSnippetStatus'], ParentType, ContextType>;
  codeSnippetValue?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  isDropCodeSnippetToCookieBannerTied?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AccountConfigBladeResolvers<ContextType = any, ParentType extends ResolversParentTypes['AccountConfigBlade'] = ResolversParentTypes['AccountConfigBlade']> = {
  AllowVideosBlade?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AccountConfigEventFeaturesResolvers<ContextType = any, ParentType extends ResolversParentTypes['AccountConfigEventFeatures'] = ResolversParentTypes['AccountConfigEventFeatures']> = {
  GeneralFeatures?: Resolver<Maybe<ResolversTypes['AccountConfigEventFeaturesGeneral']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AccountConfigEventFeaturesGeneralResolvers<ContextType = any, ParentType extends ResolversParentTypes['AccountConfigEventFeaturesGeneral'] = ResolversParentTypes['AccountConfigEventFeaturesGeneral']> = {
  LicenseTypeId?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AccountConfigFeaturesResolvers<ContextType = any, ParentType extends ResolversParentTypes['AccountConfigFeatures'] = ResolversParentTypes['AccountConfigFeatures']> = {
  Blades?: Resolver<Maybe<ResolversTypes['AccountConfigBlade']>, ParentType, ContextType>;
  GeneralFeatures?: Resolver<Maybe<ResolversTypes['AccountConfigGeneral']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AccountConfigGeneralResolvers<ContextType = any, ParentType extends ResolversParentTypes['AccountConfigGeneral'] = ResolversParentTypes['AccountConfigGeneral']> = {
  AIWritingAssistantEnabled?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  AllowCodeSnippets?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  AllowCustomFonts?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  AllowGoogleAnalytics?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  AllowOAuth?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AccountConfigInternationalSettingsResolvers<ContextType = any, ParentType extends ResolversParentTypes['AccountConfigInternationalSettings'] = ResolversParentTypes['AccountConfigInternationalSettings']> = {
  DefaultCultureCode?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  DefaultLanguageId?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AccountConfigVideoManagementFeaturesResolvers<ContextType = any, ParentType extends ResolversParentTypes['AccountConfigVideoManagementFeatures'] = ResolversParentTypes['AccountConfigVideoManagementFeatures']> = {
  VideoCenterFlag?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  VideoStorageSize?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AccountDetailsResolvers<ContextType = any, ParentType extends ResolversParentTypes['AccountDetails'] = ResolversParentTypes['AccountDetails']> = {
  AccountCompanyName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  AccountId?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  AccountName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  AccountStub?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AccountLocaleResolvers<ContextType = any, ParentType extends ResolversParentTypes['AccountLocale'] = ResolversParentTypes['AccountLocale']> = {
  IsDefault?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  Locale?: Resolver<Maybe<ResolversTypes['Locale']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AccountSnapshotResolvers<ContextType = any, ParentType extends ResolversParentTypes['AccountSnapshot'] = ResolversParentTypes['AccountSnapshot']> = {
  accountStub?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  customFonts?: Resolver<Maybe<Array<Maybe<ResolversTypes['CustomFont']>>>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AccountVideoCenterConfigResolvers<ContextType = any, ParentType extends ResolversParentTypes['AccountVideoCenterConfig'] = ResolversParentTypes['AccountVideoCenterConfig']> = {
  AccountFeatures?: Resolver<Maybe<ResolversTypes['AccountConfigFeatures']>, ParentType, ContextType>;
  EventFeatures?: Resolver<Maybe<ResolversTypes['AccountConfigEventFeatures']>, ParentType, ContextType>;
  InternationalSettings?: Resolver<Maybe<ResolversTypes['AccountConfigInternationalSettings']>, ParentType, ContextType>;
  VideoManagementFeatures?: Resolver<Maybe<ResolversTypes['AccountConfigVideoManagementFeatures']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AllowedContactGroupsResolvers<ContextType = any, ParentType extends ResolversParentTypes['AllowedContactGroups'] = ResolversParentTypes['AllowedContactGroups']> = {
  contactGroups?: Resolver<Array<Maybe<ResolversTypes['String']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AllowedContactTypesResolvers<ContextType = any, ParentType extends ResolversParentTypes['AllowedContactTypes'] = ResolversParentTypes['AllowedContactTypes']> = {
  contactTypes?: Resolver<Array<Maybe<ResolversTypes['String']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AllowedDomainsResolvers<ContextType = any, ParentType extends ResolversParentTypes['AllowedDomains'] = ResolversParentTypes['AllowedDomains']> = {
  emailDomains?: Resolver<Array<Maybe<ResolversTypes['String']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AnalyticsDataResolvers<ContextType = any, ParentType extends ResolversParentTypes['AnalyticsData'] = ResolversParentTypes['AnalyticsData']> = {
  perDay?: Resolver<Maybe<Array<ResolversTypes['AnalyticsDataItem']>>, ParentType, ContextType>;
  perMonth?: Resolver<Maybe<Array<ResolversTypes['AnalyticsDataItem']>>, ParentType, ContextType>;
  perWeek?: Resolver<Maybe<Array<ResolversTypes['AnalyticsDataItem']>>, ParentType, ContextType>;
  serverError?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  total?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AnalyticsDataItemResolvers<ContextType = any, ParentType extends ResolversParentTypes['AnalyticsDataItem'] = ResolversParentTypes['AnalyticsDataItem']> = {
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  value?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AppFeatureResolvers<ContextType = any, ParentType extends ResolversParentTypes['AppFeature'] = ResolversParentTypes['AppFeature']> = {
  enabled?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  experimentVersion?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AppSwitcherResolvers<ContextType = any, ParentType extends ResolversParentTypes['AppSwitcher'] = ResolversParentTypes['AppSwitcher']> = {
  defaultOpen?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  items?: Resolver<Maybe<Array<Maybe<ResolversTypes['UserProduct']>>>, ParentType, ContextType>;
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BannerAssociationPagingResolvers<ContextType = any, ParentType extends ResolversParentTypes['BannerAssociationPaging'] = ResolversParentTypes['BannerAssociationPaging']> = {
  data?: Resolver<Array<Maybe<ResolversTypes['ExistingBannerAssociationWithBanner']>>, ParentType, ContextType>;
  paging?: Resolver<ResolversTypes['Paging'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BannerButtonResolvers<ContextType = any, ParentType extends ResolversParentTypes['BannerButton'] = ResolversParentTypes['BannerButton']> = {
  enabled?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  internalTarget?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  target?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  targetType?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  text?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BannerPagingResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['BannerPagingResponse'] = ResolversParentTypes['BannerPagingResponse']> = {
  data?: Resolver<Array<Maybe<ResolversTypes['ExistingBanner']>>, ParentType, ContextType>;
  paging?: Resolver<ResolversTypes['Paging'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BannerTextResolvers<ContextType = any, ParentType extends ResolversParentTypes['BannerText'] = ResolversParentTypes['BannerText']> = {
  alignment?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  body?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  color?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BlockedContactGroupsResolvers<ContextType = any, ParentType extends ResolversParentTypes['BlockedContactGroups'] = ResolversParentTypes['BlockedContactGroups']> = {
  contactGroups?: Resolver<Array<Maybe<ResolversTypes['String']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BlockedContactsResolvers<ContextType = any, ParentType extends ResolversParentTypes['BlockedContacts'] = ResolversParentTypes['BlockedContacts']> = {
  blockedContacts?: Resolver<Array<Maybe<ResolversTypes['String']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CalendarResolvers<ContextType = any, ParentType extends ResolversParentTypes['Calendar'] = ResolversParentTypes['Calendar']> = {
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CalendarsResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['CalendarsResponse'] = ResolversParentTypes['CalendarsResponse']> = {
  data?: Resolver<Array<Maybe<ResolversTypes['EventCalendar']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CarinaAppSwitcherResolvers<ContextType = any, ParentType extends ResolversParentTypes['CarinaAppSwitcher'] = ResolversParentTypes['CarinaAppSwitcher']> = {
  defaultOpen?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  items?: Resolver<Maybe<Array<ResolversTypes['CarinaAppSwitcherLink']>>, ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CarinaAppSwitcherLinkResolvers<ContextType = any, ParentType extends ResolversParentTypes['CarinaAppSwitcherLink'] = ResolversParentTypes['CarinaAppSwitcherLink']> = {
  icon?: Resolver<Maybe<ResolversTypes['CarinaAppIcon']>, ParentType, ContextType>;
  status?: Resolver<Maybe<ResolversTypes['CarinaAppSwitcherStatus']>, ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  url?: Resolver<Maybe<ResolversTypes['CarinaLink']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CarinaApplicationSettingsResolvers<ContextType = any, ParentType extends ResolversParentTypes['CarinaApplicationSettings'] = ResolversParentTypes['CarinaApplicationSettings']> = {
  __resolveType: TypeResolveFn<'CarinaNavigation', ParentType, ContextType>;
  appSwitcher?: Resolver<Maybe<ResolversTypes['CarinaAppSwitcher']>, ParentType, ContextType>;
  isRtl?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  logo?: Resolver<Maybe<ResolversTypes['CarinaNavigationLogo']>, ParentType, ContextType>;
  search?: Resolver<Maybe<ResolversTypes['CarinaSearch']>, ParentType, ContextType>;
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
};

export type CarinaLinkResolvers<ContextType = any, ParentType extends ResolversParentTypes['CarinaLink'] = ResolversParentTypes['CarinaLink']> = {
  href?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CarinaNavItemResolvers<ContextType = any, ParentType extends ResolversParentTypes['CarinaNavItem'] = ResolversParentTypes['CarinaNavItem']> = {
  current?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  index?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  items?: Resolver<Maybe<Array<ResolversTypes['CarinaNavItem']>>, ParentType, ContextType>;
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  titleKey?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  url?: Resolver<Maybe<ResolversTypes['CarinaLink']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CarinaNavigationResolvers<ContextType = any, ParentType extends ResolversParentTypes['CarinaNavigation'] = ResolversParentTypes['CarinaNavigation']> = {
  appSwitcher?: Resolver<Maybe<ResolversTypes['CarinaAppSwitcher']>, ParentType, ContextType>;
  globalNav?: Resolver<Array<Maybe<ResolversTypes['CarinaNavItem']>>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isRtl?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  localNav?: Resolver<Array<Maybe<ResolversTypes['CarinaNavItem']>>, ParentType, ContextType>;
  logo?: Resolver<Maybe<ResolversTypes['CarinaNavigationLogo']>, ParentType, ContextType>;
  page?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  search?: Resolver<Maybe<ResolversTypes['CarinaSearch']>, ParentType, ContextType>;
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CarinaNavigationLogoResolvers<ContextType = any, ParentType extends ResolversParentTypes['CarinaNavigationLogo'] = ResolversParentTypes['CarinaNavigationLogo']> = {
  src?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CarinaSearchResolvers<ContextType = any, ParentType extends ResolversParentTypes['CarinaSearch'] = ResolversParentTypes['CarinaSearch']> = {
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  url?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CatalogResolvers<ContextType = any, ParentType extends ResolversParentTypes['Catalog'] = ResolversParentTypes['Catalog']> = {
  catalogOwner?: Resolver<ResolversTypes['CatalogOwnerType'], ParentType, ContextType>;
  catalogType?: Resolver<ResolversTypes['CatalogType'], ParentType, ContextType>;
  created?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  events?: Resolver<Maybe<Array<Maybe<ResolversTypes['ID']>>>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  lastModified?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  sectionCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  sections?: Resolver<Array<Maybe<ResolversTypes['CatalogSection']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CatalogSectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['CatalogSection'] = ResolversParentTypes['CatalogSection']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  order?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  sectionType?: Resolver<ResolversTypes['SectionType'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  videoCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  videos?: Resolver<Maybe<Array<Maybe<ResolversTypes['CatalogVideo']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CatalogVideoResolvers<ContextType = any, ParentType extends ResolversParentTypes['CatalogVideo'] = ResolversParentTypes['CatalogVideo']> = {
  displayName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  duration?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  order?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  sessionId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  status?: Resolver<Maybe<ResolversTypes['VideoStatus']>, ParentType, ContextType>;
  thumbnail?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  videoId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  webcastId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ChannelResolvers<ContextType = any, ParentType extends ResolversParentTypes['Channel'] = ResolversParentTypes['Channel']> = {
  banners?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  catalogId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  imageUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['ChannelStatus'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ChannelBannerOutputResolvers<ContextType = any, ParentType extends ResolversParentTypes['ChannelBannerOutput'] = ResolversParentTypes['ChannelBannerOutput']> = {
  banner?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  channel?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ChannelImageResolvers<ContextType = any, ParentType extends ResolversParentTypes['ChannelImage'] = ResolversParentTypes['ChannelImage']> = {
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  filename?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  imageId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  size?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  url?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ChannelInformationResolvers<ContextType = any, ParentType extends ResolversParentTypes['ChannelInformation'] = ResolversParentTypes['ChannelInformation']> = {
  catalogId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  image?: Resolver<Maybe<ResolversTypes['ChannelImage']>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['ChannelStatus'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ChannelOrderResolvers<ContextType = any, ParentType extends ResolversParentTypes['ChannelOrder'] = ResolversParentTypes['ChannelOrder']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  order?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CodeSnippetResolvers<ContextType = any, ParentType extends ResolversParentTypes['CodeSnippet'] = ResolversParentTypes['CodeSnippet']> = {
  addToAllPages?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  addToLoginPage?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  addToSingleVideoPage?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  applicableOn?: Resolver<Maybe<ResolversTypes['ApplicableOn']>, ParentType, ContextType>;
  codeSnippetId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CodeSnippetHubRequestResolvers<ContextType = any, ParentType extends ResolversParentTypes['CodeSnippetHubRequest'] = ResolversParentTypes['CodeSnippetHubRequest']> = {
  __resolveType: TypeResolveFn<null, ParentType, ContextType>;
  applicableOn?: Resolver<Maybe<ResolversTypes['ApplicableOn']>, ParentType, ContextType>;
  codeSnippetId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  targetWebPages?: Resolver<Maybe<Array<Maybe<ResolversTypes['TargetWebPages']>>>, ParentType, ContextType>;
};

export type CodeSnippetHubResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['CodeSnippetHubResponse'] = ResolversParentTypes['CodeSnippetHubResponse']> = {
  __resolveType: TypeResolveFn<null, ParentType, ContextType>;
  applicableOn?: Resolver<ResolversTypes['ApplicableOn'], ParentType, ContextType>;
  created?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdBy?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  lastModified?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  lastModifiedBy?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  targetWebpages?: Resolver<Maybe<Array<Maybe<ResolversTypes['TargetWebPages']>>>, ParentType, ContextType>;
};

export type CodeSnippetResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['CodeSnippetResponse'] = ResolversParentTypes['CodeSnippetResponse']> = {
  accountCodeSnippets?: Resolver<Maybe<Array<Maybe<ResolversTypes['AccountCodeSnippet']>>>, ParentType, ContextType>;
  allowCodeSnippets?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ComplianceResolvers<ContextType = any, ParentType extends ResolversParentTypes['Compliance'] = ResolversParentTypes['Compliance']> = {
  action?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  complianceScope?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdBy?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  creationTime?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ConfigResolvers<ContextType = any, ParentType extends ResolversParentTypes['Config'] = ResolversParentTypes['Config']> = {
  accountMappingId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  autoDetectBrowserLocale?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  customDomain?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  helpEmailAddress?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  locale?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  loginType?: Resolver<Maybe<ResolversTypes['LoginType']>, ParentType, ContextType>;
  organizationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  ownerEmail?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  ownerFirstName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  ownerLastName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  utmOverride?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ContactResolvers<ContextType = any, ParentType extends ResolversParentTypes['Contact'] = ResolversParentTypes['Contact']> = {
  email?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  firstName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  lastName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ContactDataResolvers<ContextType = any, ParentType extends ResolversParentTypes['ContactData'] = ResolversParentTypes['ContactData']> = {
  email?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  firstName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  lastName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ContactGroupDataResolvers<ContextType = any, ParentType extends ResolversParentTypes['ContactGroupData'] = ResolversParentTypes['ContactGroupData']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ContactImageResolvers<ContextType = any, ParentType extends ResolversParentTypes['ContactImage'] = ResolversParentTypes['ContactImage']> = {
  href?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ContactInformationResolvers<ContextType = any, ParentType extends ResolversParentTypes['ContactInformation'] = ResolversParentTypes['ContactInformation']> = {
  bio?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  company?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  designation?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  email?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  firstName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  image?: Resolver<Maybe<ResolversTypes['ContactImage']>, ParentType, ContextType>;
  lastName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  pronoun?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ContactTypesDataResolvers<ContextType = any, ParentType extends ResolversParentTypes['ContactTypesData'] = ResolversParentTypes['ContactTypesData']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CookieListResolvers<ContextType = any, ParentType extends ResolversParentTypes['CookieList'] = ResolversParentTypes['CookieList']> = {
  customLinkText?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  customUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  cventUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  enableCustom?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  enableCvent?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CultureResolvers<ContextType = any, ParentType extends ResolversParentTypes['Culture'] = ResolversParentTypes['Culture']> = {
  CultureCode?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  CultureCountryId?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  IsDefaultCulture?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  LocaleId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CustomDomainResolvers<ContextType = any, ParentType extends ResolversParentTypes['CustomDomain'] = ResolversParentTypes['CustomDomain']> = {
  customDomainId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  domainName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CustomDomainMappingResolvers<ContextType = any, ParentType extends ResolversParentTypes['CustomDomainMapping'] = ResolversParentTypes['CustomDomainMapping']> = {
  customDomainId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  entityId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  trailingName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CustomFontResolvers<ContextType = any, ParentType extends ResolversParentTypes['CustomFont'] = ResolversParentTypes['CustomFont']> = {
  fallbackFont?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  fallbackFontId?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  files?: Resolver<Maybe<Array<Maybe<ResolversTypes['FontFile']>>>, ParentType, ContextType>;
  fontFamily?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  isActive?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CustomizationsResolvers<ContextType = any, ParentType extends ResolversParentTypes['Customizations'] = ResolversParentTypes['Customizations']> = {
  defaultLandingPage?: Resolver<Maybe<ResolversTypes['DefaultLandingPage']>, ParentType, ContextType>;
  headerCss?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  headerHtml?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  headerJavascript?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  navigationAlignment?: Resolver<Maybe<ResolversTypes['NavigationAlignment']>, ParentType, ContextType>;
  navigationHeaderLeftPadding?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  navigationHeaderMaxWidth?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  navigationHeaderRightPadding?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  navigationLinkHighlightStyle?: Resolver<Maybe<ResolversTypes['NavigationLinkHighlightStyle']>, ParentType, ContextType>;
  navigationLinkTextSize?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  showChannels?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  showCustomHeader?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  showHomePage?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  showLogin?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  showLogo?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  showNavigation?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  showUpcomingEvents?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  showVideos?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type DeleteContactTypesResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['DeleteContactTypesResponse'] = ResolversParentTypes['DeleteContactTypesResponse']> = {
  deleteContactTypes?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type EntityImageResolvers<ContextType = any, ParentType extends ResolversParentTypes['EntityImage'] = ResolversParentTypes['EntityImage']> = {
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  entityId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  entityType?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  filename?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  size?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  url?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type EventCalendarResolvers<ContextType = any, ParentType extends ResolversParentTypes['EventCalendar'] = ResolversParentTypes['EventCalendar']> = {
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ExistingBannerResolvers<ContextType = any, ParentType extends ResolversParentTypes['ExistingBanner'] = ResolversParentTypes['ExistingBanner']> = {
  button?: Resolver<Maybe<ResolversTypes['BannerButton']>, ParentType, ContextType>;
  centerId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  imageAlignment?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  imageAltText?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  imageRelativePath?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  imageUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  layout?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  originalImageUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  text?: Resolver<Maybe<ResolversTypes['BannerText']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ExistingBannerAssociationWithBannerResolvers<ContextType = any, ParentType extends ResolversParentTypes['ExistingBannerAssociationWithBanner'] = ResolversParentTypes['ExistingBannerAssociationWithBanner']> = {
  banner?: Resolver<Maybe<ResolversTypes['ExistingBanner']>, ParentType, ContextType>;
  centerId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  displayOrder?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  entityId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  entityType?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ExperimentResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['ExperimentResponse'] = ResolversParentTypes['ExperimentResponse']> = {
  experimentName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  variant?: Resolver<Maybe<ResolversTypes['ExperimentVariant']>, ParentType, ContextType>;
  version?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ExperimentVariantResolvers<ContextType = any, ParentType extends ResolversParentTypes['ExperimentVariant'] = ResolversParentTypes['ExperimentVariant']> = {
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  exclude?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  include?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  metadata?: Resolver<Maybe<ResolversTypes['Version']>, ParentType, ContextType>;
  weight?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FeatureResolvers<ContextType = any, ParentType extends ResolversParentTypes['Feature'] = ResolversParentTypes['Feature']> = {
  code?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  enabled?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FileImportHistoryResolvers<ContextType = any, ParentType extends ResolversParentTypes['FileImportHistory'] = ResolversParentTypes['FileImportHistory']> = {
  accountId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdBy?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  errorCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  fileName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  locale?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  status?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  successCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FileImportHistoryParamsResolvers<ContextType = any, ParentType extends ResolversParentTypes['FileImportHistoryParams'] = ResolversParentTypes['FileImportHistoryParams']> = {
  locale?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FontFileResolvers<ContextType = any, ParentType extends ResolversParentTypes['FontFile'] = ResolversParentTypes['FontFile']> = {
  fontStyle?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  fontWeight?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FormFieldSettingResolvers<ContextType = any, ParentType extends ResolversParentTypes['FormFieldSetting'] = ResolversParentTypes['FormFieldSetting']> = {
  code?: Resolver<ResolversTypes['RegistrationFieldCode'], ParentType, ContextType>;
  included?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  order?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  required?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type HelpMenuResolvers<ContextType = any, ParentType extends ResolversParentTypes['HelpMenu'] = ResolversParentTypes['HelpMenu']> = {
  items?: Resolver<Maybe<Array<Maybe<ResolversTypes['Utility']>>>, ParentType, ContextType>;
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type HttpHeaderResolvers<ContextType = any, ParentType extends ResolversParentTypes['HttpHeader'] = ResolversParentTypes['HttpHeader']> = {
  key?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  value?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type HubResolvers<ContextType = any, ParentType extends ResolversParentTypes['Hub'] = ResolversParentTypes['Hub']> = {
  calendar?: Resolver<Maybe<ResolversTypes['Calendar']>, ParentType, ContextType>;
  config?: Resolver<Maybe<ResolversTypes['Config']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  status?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  theme?: Resolver<Maybe<ResolversTypes['Theme']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type HubCodeSnippetsResolvers<ContextType = any, ParentType extends ResolversParentTypes['HubCodeSnippets'] = ResolversParentTypes['HubCodeSnippets']> = {
  applicableOn?: Resolver<ResolversTypes['ApplicableOn'], ParentType, ContextType>;
  codeSnippetId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  targetWebPages?: Resolver<Array<Maybe<ResolversTypes['TargetWebPages']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type HubDataSourceListResolvers<ContextType = any, ParentType extends ResolversParentTypes['HubDataSourceList'] = ResolversParentTypes['HubDataSourceList']> = {
  data?: Resolver<Array<Maybe<ResolversTypes['HubDataSourceRecord']>>, ParentType, ContextType>;
  paging?: Resolver<ResolversTypes['PagingResponse'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type HubDataSourceRecordResolvers<ContextType = any, ParentType extends ResolversParentTypes['HubDataSourceRecord'] = ResolversParentTypes['HubDataSourceRecord']> = {
  accountMappingId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  actionColor?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  autoDetectBrowserLocale?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  backgroundColor?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  backgroundImageAltText?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  backgroundImageUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  backgroundOriginalImageUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  bodyFontId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  calendarId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  customDomain?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  faviconUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  headingsFontId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  helpEmailAddress?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  locale?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  loginType?: Resolver<Maybe<ResolversTypes['LoginType']>, ParentType, ContextType>;
  logoAltText?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  logoImageRelativePath?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  logoImageUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  logoOriginalImageUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  mainColor?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  moodColor?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  organizationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  ownerEmail?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  ownerFirstName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  ownerLastName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  status?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  themeSafeMode?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  utmOverride?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type HubLocaleWithDefaultResolvers<ContextType = any, ParentType extends ResolversParentTypes['HubLocaleWithDefault'] = ResolversParentTypes['HubLocaleWithDefault']> = {
  customized?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  default?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  lastModified?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  lastModifiedBy?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  locale?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  translationStatus?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type HubLocalesWithDefaultResolvers<ContextType = any, ParentType extends ResolversParentTypes['HubLocalesWithDefault'] = ResolversParentTypes['HubLocalesWithDefault']> = {
  data?: Resolver<Array<Maybe<ResolversTypes['HubLocaleWithDefault']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type HubPageResolvers<ContextType = any, ParentType extends ResolversParentTypes['HubPage'] = ResolversParentTypes['HubPage']> = {
  entityId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  entityType?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type HubPagesResolvers<ContextType = any, ParentType extends ResolversParentTypes['HubPages'] = ResolversParentTypes['HubPages']> = {
  data?: Resolver<Array<Maybe<ResolversTypes['HubPage']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type HubResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['HubResult'] = ResolversParentTypes['HubResult']> = {
  __resolveType: TypeResolveFn<'Hub' | 'Validation', ParentType, ContextType>;
};

export type HubStatusInputResolvers<ContextType = any, ParentType extends ResolversParentTypes['HubStatusInput'] = ResolversParentTypes['HubStatusInput']> = {
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type HubsPagingResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['HubsPagingResponse'] = ResolversParentTypes['HubsPagingResponse']> = {
  data?: Resolver<Array<Maybe<ResolversTypes['Hub']>>, ParentType, ContextType>;
  paging?: Resolver<ResolversTypes['PagingResponse'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type InstanceResolvers<ContextType = any, ParentType extends ResolversParentTypes['Instance'] = ResolversParentTypes['Instance']> = {
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface JsonScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['JSON'], any> {
  name: 'JSON';
}

export type LinkResolvers<ContextType = any, ParentType extends ResolversParentTypes['Link'] = ResolversParentTypes['Link']> = {
  url?: Resolver<Maybe<ResolversTypes['Url']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LocaleResolvers<ContextType = any, ParentType extends ResolversParentTypes['Locale'] = ResolversParentTypes['Locale']> = {
  AvailableCultures?: Resolver<Maybe<Array<Maybe<ResolversTypes['Culture']>>>, ParentType, ContextType>;
  CountryLanguage?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  CultureCode?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  Id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  IsDefault?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  LanguageName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  LocalizationFlag?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MeasurementIdResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['MeasurementIdResponse'] = ResolversParentTypes['MeasurementIdResponse']> = {
  measurementId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MemberDataResolvers<ContextType = any, ParentType extends ResolversParentTypes['MemberData'] = ResolversParentTypes['MemberData']> = {
  profile?: Resolver<ResolversTypes['MemberProfile'], ParentType, ContextType>;
  termsAccepted?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  visibility?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MemberListDataResolvers<ContextType = any, ParentType extends ResolversParentTypes['MemberListData'] = ResolversParentTypes['MemberListData']> = {
  companyName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  emailAddress?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  firstName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  jobTitle?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  lastLoginDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  lastName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  mobileNumber?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  registrationAge?: Resolver<Maybe<ResolversTypes['RegistrationAge']>, ParentType, ContextType>;
  registrationDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MemberListPaginatedResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['MemberListPaginatedResult'] = ResolversParentTypes['MemberListPaginatedResult']> = {
  data?: Resolver<Array<Maybe<ResolversTypes['MemberListData']>>, ParentType, ContextType>;
  paging?: Resolver<ResolversTypes['Paging'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MemberLoginResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['MemberLoginResponse'] = ResolversParentTypes['MemberLoginResponse']> = {
  email?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  emailLocked?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  expirationDate?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  firstName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  lastName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  maxEmailSent?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  serverError?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  userRestricted?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MemberPaginatedChannelsResolvers<ContextType = any, ParentType extends ResolversParentTypes['MemberPaginatedChannels'] = ResolversParentTypes['MemberPaginatedChannels']> = {
  data?: Resolver<Array<Maybe<ResolversTypes['VideoHubChannel']>>, ParentType, ContextType>;
  paging?: Resolver<ResolversTypes['Paging'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MemberProfileResolvers<ContextType = any, ParentType extends ResolversParentTypes['MemberProfile'] = ResolversParentTypes['MemberProfile']> = {
  companyName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  compliance?: Resolver<Maybe<ResolversTypes['Compliance']>, ParentType, ContextType>;
  designation?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  emailAddress?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  firstName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  jobTitle?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  lastLoginDate?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  lastName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  mobileNumber?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  prefix?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  profileImageUrl?: Resolver<Maybe<ResolversTypes['Url']>, ParentType, ContextType>;
  registrationAge?: Resolver<Maybe<ResolversTypes['RegistrationAge']>, ParentType, ContextType>;
  registrationDate?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  socialMediaLinks?: Resolver<Maybe<ResolversTypes['SocialMediaLinks']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MemberProfileVisibleResolvers<ContextType = any, ParentType extends ResolversParentTypes['MemberProfileVisible'] = ResolversParentTypes['MemberProfileVisible']> = {
  visible?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MemberVideoWatchDataResolvers<ContextType = any, ParentType extends ResolversParentTypes['MemberVideoWatchData'] = ResolversParentTypes['MemberVideoWatchData']> = {
  duration?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  email?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  firstName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  lastName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  percentage?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MemberWatchDurationDataResolvers<ContextType = any, ParentType extends ResolversParentTypes['MemberWatchDurationData'] = ResolversParentTypes['MemberWatchDurationData']> = {
  data?: Resolver<Maybe<Array<Maybe<ResolversTypes['MemberVideoWatchData']>>>, ParentType, ContextType>;
  serverError?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  addHubLocales?: Resolver<Maybe<ResolversTypes['HubLocalesWithDefault']>, ParentType, ContextType, RequireFields<MutationAddHubLocalesArgs, 'id' | 'input'>>;
  bannerCreate?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType, RequireFields<MutationBannerCreateArgs, 'input'>>;
  bannerDelete?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType, RequireFields<MutationBannerDeleteArgs, 'bannersSearch'>>;
  bannerUpdate?: Resolver<Maybe<ResolversTypes['ExistingBanner']>, ParentType, ContextType, RequireFields<MutationBannerUpdateArgs, 'input'>>;
  createCatalog?: Resolver<Maybe<ResolversTypes['Catalog']>, ParentType, ContextType, RequireFields<MutationCreateCatalogArgs, 'catalogInput' | 'channelId'>>;
  createChannel?: Resolver<Maybe<ResolversTypes['Channel']>, ParentType, ContextType, RequireFields<MutationCreateChannelArgs, 'description' | 'hubId' | 'title'>>;
  createChannelBannerAssociation?: Resolver<Maybe<ResolversTypes['ChannelBannerOutput']>, ParentType, ContextType, RequireFields<MutationCreateChannelBannerAssociationArgs, 'input'>>;
  createHubCustomDomainMapping?: Resolver<Maybe<ResolversTypes['CustomDomainMapping']>, ParentType, ContextType, Partial<MutationCreateHubCustomDomainMappingArgs>>;
  createPage?: Resolver<Maybe<ResolversTypes['PageWithSection']>, ParentType, ContextType, RequireFields<MutationCreatePageArgs, 'page'>>;
  createSection?: Resolver<Maybe<ResolversTypes['PageSection']>, ParentType, ContextType, RequireFields<MutationCreateSectionArgs, 'input'>>;
  deleteBlockedContactGroups?: Resolver<Maybe<ResolversTypes['Success']>, ParentType, ContextType, RequireFields<MutationDeleteBlockedContactGroupsArgs, 'input'>>;
  deleteBlockedContacts?: Resolver<Maybe<ResolversTypes['Success']>, ParentType, ContextType, RequireFields<MutationDeleteBlockedContactsArgs, 'input'>>;
  deleteChannel?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationDeleteChannelArgs, 'channelId'>>;
  deleteChannelBannerAssociation?: Resolver<Maybe<ResolversTypes['ChannelBannerOutput']>, ParentType, ContextType, RequireFields<MutationDeleteChannelBannerAssociationArgs, 'input'>>;
  deleteChannelImage?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationDeleteChannelImageArgs, 'channelId' | 'imageId'>>;
  deleteContactTypes?: Resolver<Maybe<ResolversTypes['DeleteContactTypesResponse']>, ParentType, ContextType, RequireFields<MutationDeleteContactTypesArgs, 'input'>>;
  deleteEntityImage?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationDeleteEntityImageArgs, 'imageId'>>;
  deleteHubCustomDomainMapping?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationDeleteHubCustomDomainMappingArgs, 'hubId'>>;
  deleteToken?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType, Partial<MutationDeleteTokenArgs>>;
  hubCreate?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType, Partial<MutationHubCreateArgs>>;
  hubDelete?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType, Partial<MutationHubDeleteArgs>>;
  hubDraft?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType, Partial<MutationHubDraftArgs>>;
  hubPublish?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType, Partial<MutationHubPublishArgs>>;
  hubUpdate?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType, Partial<MutationHubUpdateArgs>>;
  hubUpdateSettings?: Resolver<Maybe<ResolversTypes['Settings']>, ParentType, ContextType, Partial<MutationHubUpdateSettingsArgs>>;
  removeCodeSnippet?: Resolver<Maybe<ResolversTypes['Success']>, ParentType, ContextType, RequireFields<MutationRemoveCodeSnippetArgs, 'input'>>;
  resetTranslations?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType, RequireFields<MutationResetTranslationsArgs, 'input'>>;
  saveBlockedContactGroups?: Resolver<Maybe<ResolversTypes['BlockedContactGroups']>, ParentType, ContextType, RequireFields<MutationSaveBlockedContactGroupsArgs, 'input'>>;
  saveBlockedContacts?: Resolver<Maybe<ResolversTypes['BlockedContacts']>, ParentType, ContextType, RequireFields<MutationSaveBlockedContactsArgs, 'input'>>;
  saveCodeSnippet?: Resolver<Maybe<ResolversTypes['CodeSnippet']>, ParentType, ContextType, RequireFields<MutationSaveCodeSnippetArgs, 'input'>>;
  saveContactGroups?: Resolver<Maybe<ResolversTypes['AllowedContactGroups']>, ParentType, ContextType, RequireFields<MutationSaveContactGroupsArgs, 'input'>>;
  saveContactTypes?: Resolver<Maybe<ResolversTypes['AllowedContactTypes']>, ParentType, ContextType, RequireFields<MutationSaveContactTypesArgs, 'input'>>;
  saveEmailDomains?: Resolver<Maybe<ResolversTypes['AllowedDomains']>, ParentType, ContextType, RequireFields<MutationSaveEmailDomainsArgs, 'input'>>;
  saveGoogleMeasurementId?: Resolver<Maybe<ResolversTypes['MeasurementIdResponse']>, ParentType, ContextType, RequireFields<MutationSaveGoogleMeasurementIdArgs, 'input'>>;
  setBannerAssociations?: Resolver<Maybe<ResolversTypes['BannerAssociationPaging']>, ParentType, ContextType, Partial<MutationSetBannerAssociationsArgs>>;
  setTranslations?: Resolver<Maybe<ResolversTypes['TranslationUpdateResponse']>, ParentType, ContextType, RequireFields<MutationSetTranslationsArgs, 'input' | 'locale'>>;
  setUtmOverrides?: Resolver<Maybe<Array<Maybe<ResolversTypes['UtmOverride']>>>, ParentType, ContextType, RequireFields<MutationSetUtmOverridesArgs, 'input'>>;
  subscriptionToken?: Resolver<Maybe<ResolversTypes['OneTimeToken']>, ParentType, ContextType>;
  updateBackgroundImages?: Resolver<Maybe<ResolversTypes['Hub']>, ParentType, ContextType, RequireFields<MutationUpdateBackgroundImagesArgs, 'input'>>;
  updateBrandingImages?: Resolver<Maybe<ResolversTypes['Hub']>, ParentType, ContextType, RequireFields<MutationUpdateBrandingImagesArgs, 'input'>>;
  updateCatalog?: Resolver<Maybe<ResolversTypes['Catalog']>, ParentType, ContextType, RequireFields<MutationUpdateCatalogArgs, 'catalogId' | 'catalogInput' | 'channelId'>>;
  updateCenterFeature?: Resolver<Maybe<ResolversTypes['Feature']>, ParentType, ContextType, RequireFields<MutationUpdateCenterFeatureArgs, 'input'>>;
  updateChannel?: Resolver<Maybe<ResolversTypes['Channel']>, ParentType, ContextType, RequireFields<MutationUpdateChannelArgs, 'channelInput'>>;
  updateChannelOrder?: Resolver<Maybe<Array<Maybe<ResolversTypes['ChannelOrder']>>>, ParentType, ContextType, RequireFields<MutationUpdateChannelOrderArgs, 'hubId'>>;
  updateCodeSnippet?: Resolver<Maybe<ResolversTypes['CodeSnippet']>, ParentType, ContextType, RequireFields<MutationUpdateCodeSnippetArgs, 'input'>>;
  updateHubCustomDomainMapping?: Resolver<Maybe<ResolversTypes['CustomDomainMapping']>, ParentType, ContextType, Partial<MutationUpdateHubCustomDomainMappingArgs>>;
  updateMemberStatus?: Resolver<Maybe<ResolversTypes['Success']>, ParentType, ContextType, RequireFields<MutationUpdateMemberStatusArgs, 'input'>>;
  updatePage?: Resolver<Maybe<ResolversTypes['Page']>, ParentType, ContextType, RequireFields<MutationUpdatePageArgs, 'data'>>;
  updateRecentItems?: Resolver<Maybe<Array<Maybe<ResolversTypes['RecentItem']>>>, ParentType, ContextType, Partial<MutationUpdateRecentItemsArgs>>;
  updateRegistrationFormSettings?: Resolver<Maybe<ResolversTypes['RegistrationFormSettings']>, ParentType, ContextType, RequireFields<MutationUpdateRegistrationFormSettingsArgs, 'input'>>;
  updateSection?: Resolver<Maybe<ResolversTypes['PageSection']>, ParentType, ContextType, RequireFields<MutationUpdateSectionArgs, 'input'>>;
  uploadChannelImage?: Resolver<Maybe<ResolversTypes['ChannelImage']>, ParentType, ContextType, RequireFields<MutationUploadChannelImageArgs, 'channelId' | 'imageInput'>>;
  uploadEntityImage?: Resolver<Maybe<ResolversTypes['EntityImage']>, ParentType, ContextType, RequireFields<MutationUploadEntityImageArgs, 'imageInput'>>;
  upsertHubCustomizations?: Resolver<Maybe<ResolversTypes['Customizations']>, ParentType, ContextType, RequireFields<MutationUpsertHubCustomizationsArgs, 'id' | 'input'>>;
};

export type OneTimeTokenResolvers<ContextType = any, ParentType extends ResolversParentTypes['OneTimeToken'] = ResolversParentTypes['OneTimeToken']> = {
  token?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PageResolvers<ContextType = any, ParentType extends ResolversParentTypes['Page'] = ResolversParentTypes['Page']> = {
  pageId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  sectionIds?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  status?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  videoCenterId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PageSectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['PageSection'] = ResolversParentTypes['PageSection']> = {
  alignment?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  buttonEnabled?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  buttonExternalTarget?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  buttonInternalTarget?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  buttonTargetType?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  buttonText?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  contentFilterDateAbstract?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  contentFilterType?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  contentIds?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  contentLimitOnInitialLoad?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  contentType?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  featuredContentType?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  featuredContentTypeId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  imageAltText?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  imageUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  layout?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  originPageId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  originalImageUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  pageSectionTemplate?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  sectionId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  textBody?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  textColor?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  visibleFields?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PageWithSectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['PageWithSection'] = ResolversParentTypes['PageWithSection']> = {
  newSection?: Resolver<Maybe<ResolversTypes['PageSection']>, ParentType, ContextType>;
  page?: Resolver<ResolversTypes['Page'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PageWithSectionsResolvers<ContextType = any, ParentType extends ResolversParentTypes['PageWithSections'] = ResolversParentTypes['PageWithSections']> = {
  page?: Resolver<Maybe<ResolversTypes['Page']>, ParentType, ContextType>;
  sections?: Resolver<Maybe<Array<Maybe<ResolversTypes['PageSection']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PaginatedContactGroupsResolvers<ContextType = any, ParentType extends ResolversParentTypes['PaginatedContactGroups'] = ResolversParentTypes['PaginatedContactGroups']> = {
  data?: Resolver<Maybe<Array<ResolversTypes['ContactGroupData']>>, ParentType, ContextType>;
  paging?: Resolver<ResolversTypes['PagingResponse'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PaginatedContactTypesResolvers<ContextType = any, ParentType extends ResolversParentTypes['PaginatedContactTypes'] = ResolversParentTypes['PaginatedContactTypes']> = {
  data?: Resolver<Maybe<Array<ResolversTypes['ContactTypesData']>>, ParentType, ContextType>;
  paging?: Resolver<ResolversTypes['PagingResponse'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PaginatedContactsResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['PaginatedContactsResult'] = ResolversParentTypes['PaginatedContactsResult']> = {
  data?: Resolver<Array<Maybe<ResolversTypes['ContactData']>>, ParentType, ContextType>;
  paging?: Resolver<ResolversTypes['PagingResponse'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PaginatedVideosResolvers<ContextType = any, ParentType extends ResolversParentTypes['PaginatedVideos'] = ResolversParentTypes['PaginatedVideos']> = {
  data?: Resolver<Array<Maybe<ResolversTypes['Video']>>, ParentType, ContextType>;
  paging?: Resolver<ResolversTypes['PagingResponse'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PagingResolvers<ContextType = any, ParentType extends ResolversParentTypes['Paging'] = ResolversParentTypes['Paging']> = {
  currentToken?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  limit?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  nextToken?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  totalCount?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PagingResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['PagingResponse'] = ResolversParentTypes['PagingResponse']> = {
  currentToken?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  limit?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  nextToken?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  previousToken?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PlannerChannelListObjectResolvers<ContextType = any, ParentType extends ResolversParentTypes['PlannerChannelListObject'] = ResolversParentTypes['PlannerChannelListObject']> = {
  catalogId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  imageUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  order?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['ChannelStatus'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  videoCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PlannerPaginatedChannelsResolvers<ContextType = any, ParentType extends ResolversParentTypes['PlannerPaginatedChannels'] = ResolversParentTypes['PlannerPaginatedChannels']> = {
  data?: Resolver<Array<Maybe<ResolversTypes['PlannerChannelListObject']>>, ParentType, ContextType>;
  paging?: Resolver<ResolversTypes['Paging'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PreSignedResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['PreSignedResponse'] = ResolversParentTypes['PreSignedResponse']> = {
  fileId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  fullFilePath?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  uploadUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ProfileCardResolvers<ContextType = any, ParentType extends ResolversParentTypes['ProfileCard'] = ResolversParentTypes['ProfileCard']> = {
  alignment?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  allowCompanyEdit?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  allowHeadlineEdit?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  allowJobTitleEdit?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  allowNameEdit?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  allowPronounsEdit?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  allowSocialMediaEdit?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  border?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  branding?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  showCompany?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  showHeadline?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  showJobTitle?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  showName?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  showPronouns?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  showSocialMediaLinks?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  accountConfig?: Resolver<Maybe<ResolversTypes['AccountVideoCenterConfig']>, ParentType, ContextType>;
  accountDetails?: Resolver<Maybe<ResolversTypes['AccountDetails']>, ParentType, ContextType>;
  accountLocale?: Resolver<Maybe<Array<Maybe<ResolversTypes['AccountLocale']>>>, ParentType, ContextType>;
  averageViewDurationByHubId?: Resolver<Maybe<ResolversTypes['AnalyticsData']>, ParentType, ContextType, RequireFields<QueryAverageViewDurationByHubIdArgs, 'input'>>;
  banner?: Resolver<Maybe<ResolversTypes['ExistingBanner']>, ParentType, ContextType, RequireFields<QueryBannerArgs, 'bannersSearch'>>;
  bannerAssociations?: Resolver<Maybe<ResolversTypes['BannerAssociationPaging']>, ParentType, ContextType, Partial<QueryBannerAssociationsArgs>>;
  banners?: Resolver<Maybe<ResolversTypes['BannerPagingResponse']>, ParentType, ContextType, RequireFields<QueryBannersArgs, 'bannerFilter'>>;
  calendars?: Resolver<Maybe<ResolversTypes['CalendarsResponse']>, ParentType, ContextType>;
  checkScanStatus?: Resolver<Maybe<ResolversTypes['S3ProxyCallbackPayload']>, ParentType, ContextType, RequireFields<QueryCheckScanStatusArgs, 'input'>>;
  darkMode?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  fetchAndCreateShortUrlByTag?: Resolver<Maybe<Array<Maybe<ResolversTypes['ShortUrlByTag']>>>, ParentType, ContextType, RequireFields<QueryFetchAndCreateShortUrlByTagArgs, 'videoCenterId'>>;
  fileImportHistory?: Resolver<Maybe<Array<Maybe<ResolversTypes['FileImportHistory']>>>, ParentType, ContextType, RequireFields<QueryFileImportHistoryArgs, 'hubId'>>;
  generatePreSignedUrl?: Resolver<Maybe<ResolversTypes['PreSignedResponse']>, ParentType, ContextType, RequireFields<QueryGeneratePreSignedUrlArgs, 'input'>>;
  getAccountCodeSnippets?: Resolver<Maybe<ResolversTypes['CodeSnippetResponse']>, ParentType, ContextType>;
  getAccountSnapshot?: Resolver<Maybe<ResolversTypes['AccountSnapshot']>, ParentType, ContextType>;
  getAllowedContactGroups?: Resolver<Maybe<ResolversTypes['AllowedContactGroups']>, ParentType, ContextType, RequireFields<QueryGetAllowedContactGroupsArgs, 'input'>>;
  getAllowedContactTypes?: Resolver<Maybe<ResolversTypes['AllowedContactTypes']>, ParentType, ContextType, RequireFields<QueryGetAllowedContactTypesArgs, 'input'>>;
  getAppFeatures?: Resolver<Maybe<Array<Maybe<ResolversTypes['AppFeature']>>>, ParentType, ContextType, RequireFields<QueryGetAppFeaturesArgs, 'appFeatures'>>;
  getBlockedContactGroups?: Resolver<Maybe<ResolversTypes['BlockedContactGroups']>, ParentType, ContextType, RequireFields<QueryGetBlockedContactGroupsArgs, 'input'>>;
  getBlockedContacts?: Resolver<Maybe<ResolversTypes['BlockedContacts']>, ParentType, ContextType, RequireFields<QueryGetBlockedContactsArgs, 'input'>>;
  getCatalog?: Resolver<Maybe<ResolversTypes['Catalog']>, ParentType, ContextType, RequireFields<QueryGetCatalogArgs, 'catalogId'>>;
  getCenterFeatures?: Resolver<Maybe<Array<Maybe<ResolversTypes['Feature']>>>, ParentType, ContextType, RequireFields<QueryGetCenterFeaturesArgs, 'id'>>;
  getChannelInformation?: Resolver<Maybe<ResolversTypes['ChannelInformation']>, ParentType, ContextType, Partial<QueryGetChannelInformationArgs>>;
  getContact?: Resolver<Maybe<ResolversTypes['ContactInformation']>, ParentType, ContextType, RequireFields<QueryGetContactArgs, 'contactId'>>;
  getCustomDomainForAccount?: Resolver<Maybe<Array<Maybe<ResolversTypes['CustomDomain']>>>, ParentType, ContextType>;
  getCustomDomainForHub?: Resolver<Maybe<ResolversTypes['CustomDomainMapping']>, ParentType, ContextType, RequireFields<QueryGetCustomDomainForHubArgs, 'hubId'>>;
  getEmailDomains?: Resolver<Maybe<ResolversTypes['AllowedDomains']>, ParentType, ContextType, RequireFields<QueryGetEmailDomainsArgs, 'input'>>;
  getEntityImage?: Resolver<Maybe<ResolversTypes['EntityImage']>, ParentType, ContextType, RequireFields<QueryGetEntityImageArgs, 'entity'>>;
  getGoogleMeasurementId?: Resolver<Maybe<ResolversTypes['MeasurementIdResponse']>, ParentType, ContextType, RequireFields<QueryGetGoogleMeasurementIdArgs, 'hubId'>>;
  getHubCodeSnippets?: Resolver<Array<Maybe<ResolversTypes['HubCodeSnippets']>>, ParentType, ContextType, RequireFields<QueryGetHubCodeSnippetsArgs, 'hubId'>>;
  getHubCustomizations?: Resolver<Maybe<ResolversTypes['Customizations']>, ParentType, ContextType, RequireFields<QueryGetHubCustomizationsArgs, 'id'>>;
  getHubLocales?: Resolver<Maybe<ResolversTypes['HubLocalesWithDefault']>, ParentType, ContextType, RequireFields<QueryGetHubLocalesArgs, 'id'>>;
  getHubSettings?: Resolver<Maybe<ResolversTypes['Settings']>, ParentType, ContextType, RequireFields<QueryGetHubSettingsArgs, 'id'>>;
  getHubTermsEditPermission?: Resolver<Maybe<ResolversTypes['AllowTermsEdit']>, ParentType, ContextType, RequireFields<QueryGetHubTermsEditPermissionArgs, 'id'>>;
  getMemberData?: Resolver<Maybe<ResolversTypes['MemberData']>, ParentType, ContextType, RequireFields<QueryGetMemberDataArgs, 'input'>>;
  getPage?: Resolver<Maybe<ResolversTypes['PageWithSections']>, ParentType, ContextType, RequireFields<QueryGetPageArgs, 'input'>>;
  getPlannerPaginatedChannels?: Resolver<Maybe<ResolversTypes['PlannerPaginatedChannels']>, ParentType, ContextType, RequireFields<QueryGetPlannerPaginatedChannelsArgs, 'hubId'>>;
  getPublishedPageOrDefaults?: Resolver<Maybe<ResolversTypes['PageWithSections']>, ParentType, ContextType, RequireFields<QueryGetPublishedPageOrDefaultsArgs, 'input'>>;
  getRegistrationCount?: Resolver<Maybe<ResolversTypes['RegistrationCountResponse']>, ParentType, ContextType, RequireFields<QueryGetRegistrationCountArgs, 'input'>>;
  getRegistrationFormSettings?: Resolver<Maybe<ResolversTypes['RegistrationFormSettings']>, ParentType, ContextType, RequireFields<QueryGetRegistrationFormSettingsArgs, 'input'>>;
  getTranslations?: Resolver<Maybe<ResolversTypes['TranslationPagingResponse']>, ParentType, ContextType, RequireFields<QueryGetTranslationsArgs, 'input'>>;
  getUtmOverrides?: Resolver<Maybe<Array<Maybe<ResolversTypes['UtmOverride']>>>, ParentType, ContextType, RequireFields<QueryGetUtmOverridesArgs, 'input'>>;
  getVideos?: Resolver<Maybe<ResolversTypes['PaginatedVideos']>, ParentType, ContextType, Partial<QueryGetVideosArgs>>;
  helpMenu?: Resolver<Maybe<ResolversTypes['HelpMenu']>, ParentType, ContextType>;
  hub?: Resolver<Maybe<ResolversTypes['Hub']>, ParentType, ContextType, Partial<QueryHubArgs>>;
  hubBanners?: Resolver<Maybe<ResolversTypes['BannerPagingResponse']>, ParentType, ContextType, Partial<QueryHubBannersArgs>>;
  hubPages?: Resolver<Maybe<ResolversTypes['HubPages']>, ParentType, ContextType, RequireFields<QueryHubPagesArgs, 'id'>>;
  hubPagesWithBanner?: Resolver<Maybe<ResolversTypes['HubPages']>, ParentType, ContextType, RequireFields<QueryHubPagesWithBannerArgs, 'input'>>;
  hubs?: Resolver<Maybe<ResolversTypes['HubsPagingResponse']>, ParentType, ContextType, Partial<QueryHubsArgs>>;
  locale?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  memberLogin?: Resolver<Maybe<ResolversTypes['MemberLoginResponse']>, ParentType, ContextType, Partial<QueryMemberLoginArgs>>;
  memberVideoWatchDurationByHubId?: Resolver<Maybe<ResolversTypes['MemberWatchDurationData']>, ParentType, ContextType, RequireFields<QueryMemberVideoWatchDurationByHubIdArgs, 'input'>>;
  navigation?: Resolver<Maybe<ResolversTypes['CarinaNavigation']>, ParentType, ContextType, RequireFields<QueryNavigationArgs, 'navMetadata'>>;
  products?: Resolver<Maybe<ResolversTypes['AppSwitcher']>, ParentType, ContextType>;
  recentItems?: Resolver<Maybe<ResolversTypes['RecentItems']>, ParentType, ContextType>;
  searchContactGroups?: Resolver<Maybe<ResolversTypes['PaginatedContactGroups']>, ParentType, ContextType, Partial<QuerySearchContactGroupsArgs>>;
  searchContactTypes?: Resolver<Maybe<ResolversTypes['PaginatedContactTypes']>, ParentType, ContextType, Partial<QuerySearchContactTypesArgs>>;
  searchContacts?: Resolver<Maybe<ResolversTypes['PaginatedContactsResult']>, ParentType, ContextType, Partial<QuerySearchContactsArgs>>;
  searchMemberList?: Resolver<Maybe<ResolversTypes['MemberListPaginatedResult']>, ParentType, ContextType, Partial<QuerySearchMemberListArgs>>;
  topFiveVideosViewedByHubId?: Resolver<Maybe<ResolversTypes['TopVideosResponse']>, ParentType, ContextType, RequireFields<QueryTopFiveVideosViewedByHubIdArgs, 'input'>>;
  totalViewsByHubId?: Resolver<Maybe<ResolversTypes['AnalyticsData']>, ParentType, ContextType, RequireFields<QueryTotalViewsByHubIdArgs, 'input'>>;
  user?: Resolver<Maybe<ResolversTypes['UserDetails']>, ParentType, ContextType>;
  userPermissions?: Resolver<Maybe<ResolversTypes['UserPermissions']>, ParentType, ContextType>;
  userUtilities?: Resolver<Maybe<ResolversTypes['UserUtilities']>, ParentType, ContextType>;
  videosViewDetailsByHubId?: Resolver<Maybe<ResolversTypes['VideoCountData']>, ParentType, ContextType, RequireFields<QueryVideosViewDetailsByHubIdArgs, 'input'>>;
  viewsByDeviceType?: Resolver<Maybe<ResolversTypes['ViewsBySourceResponse']>, ParentType, ContextType, RequireFields<QueryViewsByDeviceTypeArgs, 'input'>>;
};

export type RecentItemResolvers<ContextType = any, ParentType extends ResolversParentTypes['RecentItem'] = ResolversParentTypes['RecentItem']> = {
  icon?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  type?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RecentItemsResolvers<ContextType = any, ParentType extends ResolversParentTypes['RecentItems'] = ResolversParentTypes['RecentItems']> = {
  items?: Resolver<Maybe<Array<Maybe<ResolversTypes['RecentItem']>>>, ParentType, ContextType>;
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RegistrationAgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['RegistrationAge'] = ResolversParentTypes['RegistrationAge']> = {
  days?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  months?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  years?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RegistrationCountResolvers<ContextType = any, ParentType extends ResolversParentTypes['RegistrationCount'] = ResolversParentTypes['RegistrationCount']> = {
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  value?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RegistrationCountResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['RegistrationCountResponse'] = ResolversParentTypes['RegistrationCountResponse']> = {
  perDay?: Resolver<Maybe<Array<ResolversTypes['RegistrationCount']>>, ParentType, ContextType>;
  perMonth?: Resolver<Maybe<Array<ResolversTypes['RegistrationCount']>>, ParentType, ContextType>;
  perWeek?: Resolver<Maybe<Array<ResolversTypes['RegistrationCount']>>, ParentType, ContextType>;
  serverError?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  total?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RegistrationFormSettingsResolvers<ContextType = any, ParentType extends ResolversParentTypes['RegistrationFormSettings'] = ResolversParentTypes['RegistrationFormSettings']> = {
  data?: Resolver<Array<Maybe<ResolversTypes['FormFieldSetting']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RegistrationSettingsResolvers<ContextType = any, ParentType extends ResolversParentTypes['RegistrationSettings'] = ResolversParentTypes['RegistrationSettings']> = {
  allowAllContactsRegistration?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  allowContactGroupsRegistration?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  allowContactTypesRegistration?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  allowedEmailDomain?: Resolver<Maybe<ResolversTypes['AllowedEmailDomain']>, ParentType, ContextType>;
  blockContactsRegistration?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  blockListRegistration?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type S3ProxyCallbackPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['S3ProxyCallbackPayload'] = ResolversParentTypes['S3ProxyCallbackPayload']> = {
  failureReason?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  fileId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  fullFilePath?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  location?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  status?: Resolver<Maybe<ResolversTypes['ScanStatus']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ScanStatusResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['ScanStatusResponse'] = ResolversParentTypes['ScanStatusResponse']> = {
  failureReason?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['ScanStatus'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SettingsResolvers<ContextType = any, ParentType extends ResolversParentTypes['Settings'] = ResolversParentTypes['Settings']> = {
  allowHubSearchEngineIndexing?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  allowLimitedViewsBeforeLogin?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  allowLimitedViewsBeforeLoginCount?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  allowTurnOffCookies?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  allowTurnOffGoogleAnalytics?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  ccpaConfirmationText?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  ccpaDoNotSellUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  ccpaDoNotSellUrlEnabled?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  ccpaEnableDoNotSell?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  ccpaLinkExplanationText?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  ccpaLinkText?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  ccpaSubmitButtonText?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  cookieLists?: Resolver<Maybe<ResolversTypes['CookieList']>, ParentType, ContextType>;
  cventPrivacyPolicyLinkText?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  decorativeImage?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  displayCventPrivacyPolicy?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  displayCventPrivacyPolicyInCookie?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  displayPrivacyPolicy?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  displayTermsLinkOnFooter?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  displayTermsOnLogin?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  guestVisibility?: Resolver<Maybe<ResolversTypes['GuestVisibility']>, ParentType, ContextType>;
  memberProfilePublic?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  notifyUsersAboutCookie?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  privacyPolicyLinkText?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  privacyPolicyUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  profileCard?: Resolver<Maybe<ResolversTypes['ProfileCard']>, ParentType, ContextType>;
  registrationBackground?: Resolver<Maybe<ResolversTypes['BackGroundStyle']>, ParentType, ContextType>;
  registrationSettings?: Resolver<Maybe<ResolversTypes['RegistrationSettings']>, ParentType, ContextType>;
  showLogo?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  termsLinkText?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  termsText?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ShortUrlByTagResolvers<ContextType = any, ParentType extends ResolversParentTypes['ShortUrlByTag'] = ResolversParentTypes['ShortUrlByTag']> = {
  pageName?: Resolver<Maybe<ResolversTypes['ShortUrlPage']>, ParentType, ContextType>;
  shortUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SocialMediaLinksResolvers<ContextType = any, ParentType extends ResolversParentTypes['SocialMediaLinks'] = ResolversParentTypes['SocialMediaLinks']> = {
  facebookUrl?: Resolver<Maybe<ResolversTypes['Url']>, ParentType, ContextType>;
  linkedinUrl?: Resolver<Maybe<ResolversTypes['Url']>, ParentType, ContextType>;
  twitterUrl?: Resolver<Maybe<ResolversTypes['Url']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SuccessResolvers<ContextType = any, ParentType extends ResolversParentTypes['Success'] = ResolversParentTypes['Success']> = {
  success?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TermsConsentResolvers<ContextType = any, ParentType extends ResolversParentTypes['TermsConsent'] = ResolversParentTypes['TermsConsent']> = {
  contact?: Resolver<Maybe<ResolversTypes['Contact']>, ParentType, ContextType>;
  termsAccepted?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ThemeResolvers<ContextType = any, ParentType extends ResolversParentTypes['Theme'] = ResolversParentTypes['Theme']> = {
  actionColor?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  backgroundColor?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  backgroundImageAltText?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  backgroundImageUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  backgroundOriginalImageUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  bodyFont?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  faviconUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  headingsFont?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  logoAltText?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  logoImageRelativePath?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  logoImageUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  logoOriginalImageUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  mainColor?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  moodColor?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  safeMode?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ThumbnailResolvers<ContextType = any, ParentType extends ResolversParentTypes['Thumbnail'] = ResolversParentTypes['Thumbnail']> = {
  url?: Resolver<Maybe<ResolversTypes['Url']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TopVideosResolvers<ContextType = any, ParentType extends ResolversParentTypes['TopVideos'] = ResolversParentTypes['TopVideos']> = {
  currentPosition?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  previousPosition?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  totalViews?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  videoId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  videoName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TopVideosResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['TopVideosResponse'] = ResolversParentTypes['TopVideosResponse']> = {
  serverError?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  topVideos?: Resolver<Maybe<Array<Maybe<ResolversTypes['TopVideos']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TranslationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Translation'] = ResolversParentTypes['Translation']> = {
  defaultValue?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  locale?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  translatedValue?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TranslationPagingResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['TranslationPagingResponse'] = ResolversParentTypes['TranslationPagingResponse']> = {
  data?: Resolver<Array<Maybe<ResolversTypes['Translation']>>, ParentType, ContextType>;
  paging?: Resolver<ResolversTypes['PagingResponse'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TranslationUpdateResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['TranslationUpdateResponse'] = ResolversParentTypes['TranslationUpdateResponse']> = {
  Failure?: Resolver<Maybe<Array<Maybe<ResolversTypes['Translation']>>>, ParentType, ContextType>;
  Success?: Resolver<Maybe<Array<Maybe<ResolversTypes['Translation']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UrlResolvers<ContextType = any, ParentType extends ResolversParentTypes['Url'] = ResolversParentTypes['Url']> = {
  href?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserDetailsResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserDetails'] = ResolversParentTypes['UserDetails']> = {
  company?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  email?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  firstName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  lastName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  url?: Resolver<Maybe<ResolversTypes['Url']>, ParentType, ContextType>;
  viewProfileText?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserPermissionsResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserPermissions'] = ResolversParentTypes['UserPermissions']> = {
  EventsPlusCustomHeader?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  VideoCenter?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  VideoLibrary?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  VideoStorage?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserProductResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserProduct'] = ResolversParentTypes['UserProduct']> = {
  icon?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  url?: Resolver<ResolversTypes['Url'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserSoaPermissionsResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserSoaPermissions'] = ResolversParentTypes['UserSoaPermissions']> = {
  AccountId?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  EventRoleStubs?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  Permissions?: Resolver<Maybe<ResolversTypes['UserVideoCenterPermissions']>, ParentType, ContextType>;
  RoleStub?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserUtilitiesResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserUtilities'] = ResolversParentTypes['UserUtilities']> = {
  items?: Resolver<Array<Maybe<ResolversTypes['Utility']>>, ParentType, ContextType>;
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserVideoCenterPermissionsResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserVideoCenterPermissions'] = ResolversParentTypes['UserVideoCenterPermissions']> = {
  CVENT_EVENTS_PLUS_CUSTOM_HEADER?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  CVENT_VIDEO_CENTER_ACCESS?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  CVENT_VIDEO_CENTER_CONFIGURATION?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  CVENT_VIDEO_CENTER_CREATION?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  CVENT_VIDEO_EDIT?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  CVENT_VIDEO_LIBRARY_ACCESS?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  CVENT_VIDEO_STORAGE_MANAGEMENT?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  CVENT_VIDEO_UPLOAD?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UtilityResolvers<ContextType = any, ParentType extends ResolversParentTypes['Utility'] = ResolversParentTypes['Utility']> = {
  hasCustomOnClickHandler?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  icon?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  openInNewTab?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  url?: Resolver<Maybe<ResolversTypes['Url']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UtmOverrideResolvers<ContextType = any, ParentType extends ResolversParentTypes['UtmOverride'] = ResolversParentTypes['UtmOverride']> = {
  key?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  value?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ValidationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Validation'] = ResolversParentTypes['Validation']> = {
  code?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  details?: Resolver<Array<Maybe<ResolversTypes['ValidationDetail']>>, ParentType, ContextType>;
  httpRequestId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  target?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ValidationDetailResolvers<ContextType = any, ParentType extends ResolversParentTypes['ValidationDetail'] = ResolversParentTypes['ValidationDetail']> = {
  code?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  target?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type VersionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Version'] = ResolversParentTypes['Version']> = {
  version?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type VideoResolvers<ContextType = any, ParentType extends ResolversParentTypes['Video'] = ResolversParentTypes['Video']> = {
  catalogs?: Resolver<Maybe<Array<Maybe<ResolversTypes['VideoCatalog']>>>, ParentType, ContextType>;
  created?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdBy?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  duration?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  events?: Resolver<Maybe<Array<Maybe<ResolversTypes['ID']>>>, ParentType, ContextType>;
  exhibitors?: Resolver<Maybe<Array<Maybe<ResolversTypes['ID']>>>, ParentType, ContextType>;
  generatedThumbnail?: Resolver<Maybe<ResolversTypes['Thumbnail']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  lastModified?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  lastModifiedBy?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  originalSize?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  sessions?: Resolver<Maybe<Array<Maybe<ResolversTypes['ID']>>>, ParentType, ContextType>;
  source?: Resolver<Maybe<ResolversTypes['VideoSource']>, ParentType, ContextType>;
  sourceProvider?: Resolver<Maybe<ResolversTypes['SourceProvider']>, ParentType, ContextType>;
  speakers?: Resolver<Maybe<Array<Maybe<ResolversTypes['ID']>>>, ParentType, ContextType>;
  status?: Resolver<Maybe<ResolversTypes['VideoStatus']>, ParentType, ContextType>;
  tags?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  thumbnail?: Resolver<Maybe<ResolversTypes['Thumbnail']>, ParentType, ContextType>;
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  totalSize?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type VideoAnalyticsItemResolvers<ContextType = any, ParentType extends ResolversParentTypes['VideoAnalyticsItem'] = ResolversParentTypes['VideoAnalyticsItem']> = {
  thumbnail?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  videoDuration?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  videoId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  videoTitle?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  views?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type VideoCatalogResolvers<ContextType = any, ParentType extends ResolversParentTypes['VideoCatalog'] = ResolversParentTypes['VideoCatalog']> = {
  channel?: Resolver<Maybe<ResolversTypes['VideoChannel']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  section?: Resolver<Maybe<ResolversTypes['VideoSection']>, ParentType, ContextType>;
  videoCenters?: Resolver<Maybe<Array<Maybe<ResolversTypes['ID']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type VideoChannelResolvers<ContextType = any, ParentType extends ResolversParentTypes['VideoChannel'] = ResolversParentTypes['VideoChannel']> = {
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  status?: Resolver<Maybe<ResolversTypes['ChannelStatus']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type VideoCountDataResolvers<ContextType = any, ParentType extends ResolversParentTypes['VideoCountData'] = ResolversParentTypes['VideoCountData']> = {
  data?: Resolver<Maybe<Array<Maybe<ResolversTypes['VideoAnalyticsItem']>>>, ParentType, ContextType>;
  serverError?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type VideoHubChannelResolvers<ContextType = any, ParentType extends ResolversParentTypes['VideoHubChannel'] = ResolversParentTypes['VideoHubChannel']> = {
  banners?: Resolver<Array<Maybe<ResolversTypes['String']>>, ParentType, ContextType>;
  catalogId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  imageUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  order?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  shortUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['ChannelStatus'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type VideoPageShortUrlResolvers<ContextType = any, ParentType extends ResolversParentTypes['VideoPageShortUrl'] = ResolversParentTypes['VideoPageShortUrl']> = {
  videoPageShortUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type VideoPlaybackInfoResolvers<ContextType = any, ParentType extends ResolversParentTypes['VideoPlaybackInfo'] = ResolversParentTypes['VideoPlaybackInfo']> = {
  created?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  duration?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  event?: Resolver<Maybe<ResolversTypes['Instance']>, ParentType, ContextType>;
  exhibitors?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  generatedThumbnail?: Resolver<Maybe<ResolversTypes['Link']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  lastModified?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  sessions?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  source?: Resolver<Maybe<ResolversTypes['VideoSource']>, ParentType, ContextType>;
  status?: Resolver<Maybe<ResolversTypes['VideoStatus']>, ParentType, ContextType>;
  thumbnail?: Resolver<Maybe<ResolversTypes['Link']>, ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  type?: Resolver<Maybe<ResolversTypes['VideoType']>, ParentType, ContextType>;
  uploadCompleted?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  uploadStarted?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  url?: Resolver<Maybe<ResolversTypes['Url']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type VideoRenditionResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['VideoRenditionResponse'] = ResolversParentTypes['VideoRenditionResponse']> = {
  location?: Resolver<Maybe<ResolversTypes['Url']>, ParentType, ContextType>;
  type?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type VideoSectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['VideoSection'] = ResolversParentTypes['VideoSection']> = {
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type VideoSourceResolvers<ContextType = any, ParentType extends ResolversParentTypes['VideoSource'] = ResolversParentTypes['VideoSource']> = {
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  status?: Resolver<Maybe<ResolversTypes['VideoSourceStatus']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ViewsBySourceResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['ViewsBySourceResponse'] = ResolversParentTypes['ViewsBySourceResponse']> = {
  desktopViews?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  mobileViews?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  serverError?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  tabletViews?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  totalViews?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  AWSDate?: GraphQLScalarType;
  AWSDateTime?: GraphQLScalarType;
  AWSEmail?: GraphQLScalarType;
  AWSIPAddress?: GraphQLScalarType;
  AWSJSON?: GraphQLScalarType;
  AWSPhone?: GraphQLScalarType;
  AWSTimestamp?: GraphQLScalarType;
  AWSURL?: GraphQLScalarType;
  AccountCodeSnippet?: AccountCodeSnippetResolvers<ContextType>;
  AccountConfigBlade?: AccountConfigBladeResolvers<ContextType>;
  AccountConfigEventFeatures?: AccountConfigEventFeaturesResolvers<ContextType>;
  AccountConfigEventFeaturesGeneral?: AccountConfigEventFeaturesGeneralResolvers<ContextType>;
  AccountConfigFeatures?: AccountConfigFeaturesResolvers<ContextType>;
  AccountConfigGeneral?: AccountConfigGeneralResolvers<ContextType>;
  AccountConfigInternationalSettings?: AccountConfigInternationalSettingsResolvers<ContextType>;
  AccountConfigVideoManagementFeatures?: AccountConfigVideoManagementFeaturesResolvers<ContextType>;
  AccountDetails?: AccountDetailsResolvers<ContextType>;
  AccountLocale?: AccountLocaleResolvers<ContextType>;
  AccountSnapshot?: AccountSnapshotResolvers<ContextType>;
  AccountVideoCenterConfig?: AccountVideoCenterConfigResolvers<ContextType>;
  AllowedContactGroups?: AllowedContactGroupsResolvers<ContextType>;
  AllowedContactTypes?: AllowedContactTypesResolvers<ContextType>;
  AllowedDomains?: AllowedDomainsResolvers<ContextType>;
  AnalyticsData?: AnalyticsDataResolvers<ContextType>;
  AnalyticsDataItem?: AnalyticsDataItemResolvers<ContextType>;
  AppFeature?: AppFeatureResolvers<ContextType>;
  AppSwitcher?: AppSwitcherResolvers<ContextType>;
  BannerAssociationPaging?: BannerAssociationPagingResolvers<ContextType>;
  BannerButton?: BannerButtonResolvers<ContextType>;
  BannerPagingResponse?: BannerPagingResponseResolvers<ContextType>;
  BannerText?: BannerTextResolvers<ContextType>;
  BlockedContactGroups?: BlockedContactGroupsResolvers<ContextType>;
  BlockedContacts?: BlockedContactsResolvers<ContextType>;
  Calendar?: CalendarResolvers<ContextType>;
  CalendarsResponse?: CalendarsResponseResolvers<ContextType>;
  CarinaAppSwitcher?: CarinaAppSwitcherResolvers<ContextType>;
  CarinaAppSwitcherLink?: CarinaAppSwitcherLinkResolvers<ContextType>;
  CarinaApplicationSettings?: CarinaApplicationSettingsResolvers<ContextType>;
  CarinaLink?: CarinaLinkResolvers<ContextType>;
  CarinaNavItem?: CarinaNavItemResolvers<ContextType>;
  CarinaNavigation?: CarinaNavigationResolvers<ContextType>;
  CarinaNavigationLogo?: CarinaNavigationLogoResolvers<ContextType>;
  CarinaSearch?: CarinaSearchResolvers<ContextType>;
  Catalog?: CatalogResolvers<ContextType>;
  CatalogSection?: CatalogSectionResolvers<ContextType>;
  CatalogVideo?: CatalogVideoResolvers<ContextType>;
  Channel?: ChannelResolvers<ContextType>;
  ChannelBannerOutput?: ChannelBannerOutputResolvers<ContextType>;
  ChannelImage?: ChannelImageResolvers<ContextType>;
  ChannelInformation?: ChannelInformationResolvers<ContextType>;
  ChannelOrder?: ChannelOrderResolvers<ContextType>;
  CodeSnippet?: CodeSnippetResolvers<ContextType>;
  CodeSnippetHubRequest?: CodeSnippetHubRequestResolvers<ContextType>;
  CodeSnippetHubResponse?: CodeSnippetHubResponseResolvers<ContextType>;
  CodeSnippetResponse?: CodeSnippetResponseResolvers<ContextType>;
  Compliance?: ComplianceResolvers<ContextType>;
  Config?: ConfigResolvers<ContextType>;
  Contact?: ContactResolvers<ContextType>;
  ContactData?: ContactDataResolvers<ContextType>;
  ContactGroupData?: ContactGroupDataResolvers<ContextType>;
  ContactImage?: ContactImageResolvers<ContextType>;
  ContactInformation?: ContactInformationResolvers<ContextType>;
  ContactTypesData?: ContactTypesDataResolvers<ContextType>;
  CookieList?: CookieListResolvers<ContextType>;
  Culture?: CultureResolvers<ContextType>;
  CustomDomain?: CustomDomainResolvers<ContextType>;
  CustomDomainMapping?: CustomDomainMappingResolvers<ContextType>;
  CustomFont?: CustomFontResolvers<ContextType>;
  Customizations?: CustomizationsResolvers<ContextType>;
  DateTime?: GraphQLScalarType;
  DeleteContactTypesResponse?: DeleteContactTypesResponseResolvers<ContextType>;
  EntityImage?: EntityImageResolvers<ContextType>;
  EventCalendar?: EventCalendarResolvers<ContextType>;
  ExistingBanner?: ExistingBannerResolvers<ContextType>;
  ExistingBannerAssociationWithBanner?: ExistingBannerAssociationWithBannerResolvers<ContextType>;
  ExperimentResponse?: ExperimentResponseResolvers<ContextType>;
  ExperimentVariant?: ExperimentVariantResolvers<ContextType>;
  Feature?: FeatureResolvers<ContextType>;
  FileImportHistory?: FileImportHistoryResolvers<ContextType>;
  FileImportHistoryParams?: FileImportHistoryParamsResolvers<ContextType>;
  FontFile?: FontFileResolvers<ContextType>;
  FormFieldSetting?: FormFieldSettingResolvers<ContextType>;
  HelpMenu?: HelpMenuResolvers<ContextType>;
  HttpHeader?: HttpHeaderResolvers<ContextType>;
  Hub?: HubResolvers<ContextType>;
  HubCodeSnippets?: HubCodeSnippetsResolvers<ContextType>;
  HubDataSourceList?: HubDataSourceListResolvers<ContextType>;
  HubDataSourceRecord?: HubDataSourceRecordResolvers<ContextType>;
  HubLocaleWithDefault?: HubLocaleWithDefaultResolvers<ContextType>;
  HubLocalesWithDefault?: HubLocalesWithDefaultResolvers<ContextType>;
  HubPage?: HubPageResolvers<ContextType>;
  HubPages?: HubPagesResolvers<ContextType>;
  HubResult?: HubResultResolvers<ContextType>;
  HubStatusInput?: HubStatusInputResolvers<ContextType>;
  HubsPagingResponse?: HubsPagingResponseResolvers<ContextType>;
  Instance?: InstanceResolvers<ContextType>;
  JSON?: GraphQLScalarType;
  Link?: LinkResolvers<ContextType>;
  Locale?: LocaleResolvers<ContextType>;
  MeasurementIdResponse?: MeasurementIdResponseResolvers<ContextType>;
  MemberData?: MemberDataResolvers<ContextType>;
  MemberListData?: MemberListDataResolvers<ContextType>;
  MemberListPaginatedResult?: MemberListPaginatedResultResolvers<ContextType>;
  MemberLoginResponse?: MemberLoginResponseResolvers<ContextType>;
  MemberPaginatedChannels?: MemberPaginatedChannelsResolvers<ContextType>;
  MemberProfile?: MemberProfileResolvers<ContextType>;
  MemberProfileVisible?: MemberProfileVisibleResolvers<ContextType>;
  MemberVideoWatchData?: MemberVideoWatchDataResolvers<ContextType>;
  MemberWatchDurationData?: MemberWatchDurationDataResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  OneTimeToken?: OneTimeTokenResolvers<ContextType>;
  Page?: PageResolvers<ContextType>;
  PageSection?: PageSectionResolvers<ContextType>;
  PageWithSection?: PageWithSectionResolvers<ContextType>;
  PageWithSections?: PageWithSectionsResolvers<ContextType>;
  PaginatedContactGroups?: PaginatedContactGroupsResolvers<ContextType>;
  PaginatedContactTypes?: PaginatedContactTypesResolvers<ContextType>;
  PaginatedContactsResult?: PaginatedContactsResultResolvers<ContextType>;
  PaginatedVideos?: PaginatedVideosResolvers<ContextType>;
  Paging?: PagingResolvers<ContextType>;
  PagingResponse?: PagingResponseResolvers<ContextType>;
  PlannerChannelListObject?: PlannerChannelListObjectResolvers<ContextType>;
  PlannerPaginatedChannels?: PlannerPaginatedChannelsResolvers<ContextType>;
  PreSignedResponse?: PreSignedResponseResolvers<ContextType>;
  ProfileCard?: ProfileCardResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  RecentItem?: RecentItemResolvers<ContextType>;
  RecentItems?: RecentItemsResolvers<ContextType>;
  RegistrationAge?: RegistrationAgeResolvers<ContextType>;
  RegistrationCount?: RegistrationCountResolvers<ContextType>;
  RegistrationCountResponse?: RegistrationCountResponseResolvers<ContextType>;
  RegistrationFormSettings?: RegistrationFormSettingsResolvers<ContextType>;
  RegistrationSettings?: RegistrationSettingsResolvers<ContextType>;
  S3ProxyCallbackPayload?: S3ProxyCallbackPayloadResolvers<ContextType>;
  ScanStatusResponse?: ScanStatusResponseResolvers<ContextType>;
  Settings?: SettingsResolvers<ContextType>;
  ShortUrlByTag?: ShortUrlByTagResolvers<ContextType>;
  SocialMediaLinks?: SocialMediaLinksResolvers<ContextType>;
  Success?: SuccessResolvers<ContextType>;
  TermsConsent?: TermsConsentResolvers<ContextType>;
  Theme?: ThemeResolvers<ContextType>;
  Thumbnail?: ThumbnailResolvers<ContextType>;
  TopVideos?: TopVideosResolvers<ContextType>;
  TopVideosResponse?: TopVideosResponseResolvers<ContextType>;
  Translation?: TranslationResolvers<ContextType>;
  TranslationPagingResponse?: TranslationPagingResponseResolvers<ContextType>;
  TranslationUpdateResponse?: TranslationUpdateResponseResolvers<ContextType>;
  Url?: UrlResolvers<ContextType>;
  UserDetails?: UserDetailsResolvers<ContextType>;
  UserPermissions?: UserPermissionsResolvers<ContextType>;
  UserProduct?: UserProductResolvers<ContextType>;
  UserSoaPermissions?: UserSoaPermissionsResolvers<ContextType>;
  UserUtilities?: UserUtilitiesResolvers<ContextType>;
  UserVideoCenterPermissions?: UserVideoCenterPermissionsResolvers<ContextType>;
  Utility?: UtilityResolvers<ContextType>;
  UtmOverride?: UtmOverrideResolvers<ContextType>;
  Validation?: ValidationResolvers<ContextType>;
  ValidationDetail?: ValidationDetailResolvers<ContextType>;
  Version?: VersionResolvers<ContextType>;
  Video?: VideoResolvers<ContextType>;
  VideoAnalyticsItem?: VideoAnalyticsItemResolvers<ContextType>;
  VideoCatalog?: VideoCatalogResolvers<ContextType>;
  VideoChannel?: VideoChannelResolvers<ContextType>;
  VideoCountData?: VideoCountDataResolvers<ContextType>;
  VideoHubChannel?: VideoHubChannelResolvers<ContextType>;
  VideoPageShortUrl?: VideoPageShortUrlResolvers<ContextType>;
  VideoPlaybackInfo?: VideoPlaybackInfoResolvers<ContextType>;
  VideoRenditionResponse?: VideoRenditionResponseResolvers<ContextType>;
  VideoSection?: VideoSectionResolvers<ContextType>;
  VideoSource?: VideoSourceResolvers<ContextType>;
  ViewsBySourceResponse?: ViewsBySourceResponseResolvers<ContextType>;
};

export type DirectiveResolvers<ContextType = any> = {
  client?: ClientDirectiveResolver<any, any, ContextType>;
};

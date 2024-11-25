import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
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
export type CarinaApplicationSettings = {
  appSwitcher?: Maybe<CarinaAppSwitcher>;
  isRtl?: Maybe<Scalars['Boolean']>;
  logo?: Maybe<CarinaNavigationLogo>;
  search?: Maybe<CarinaSearch>;
  title?: Maybe<Scalars['String']>;
};

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

export type CodeSnippetHubRequest = {
  applicableOn?: Maybe<ApplicableOn>;
  codeSnippetId: Scalars['String'];
  targetWebPages?: Maybe<Array<Maybe<TargetWebPages>>>;
};

export type CodeSnippetHubResponse = {
  applicableOn: ApplicableOn;
  created?: Maybe<Scalars['String']>;
  createdBy?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  lastModified?: Maybe<Scalars['String']>;
  lastModifiedBy?: Maybe<Scalars['String']>;
  targetWebpages?: Maybe<Array<Maybe<TargetWebPages>>>;
};

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

export type GetTotalViewsQueryVariables = Exact<{
  input: AnalyticsInput;
}>;


export type GetTotalViewsQuery = { __typename?: 'Query', totalViewsByHubId?: { __typename?: 'AnalyticsData', total?: number | null, serverError?: boolean | null, perDay?: Array<{ __typename?: 'AnalyticsDataItem', date: any, value: number }> | null, perWeek?: Array<{ __typename?: 'AnalyticsDataItem', date: any, value: number }> | null, perMonth?: Array<{ __typename?: 'AnalyticsDataItem', date: any, value: number }> | null } | null };

export type AverageViewDurationByHubIdQueryVariables = Exact<{
  input: AnalyticsInput;
}>;


export type AverageViewDurationByHubIdQuery = { __typename?: 'Query', averageViewDurationByHubId?: { __typename?: 'AnalyticsData', total?: number | null, serverError?: boolean | null, perDay?: Array<{ __typename?: 'AnalyticsDataItem', date: any, value: number }> | null, perWeek?: Array<{ __typename?: 'AnalyticsDataItem', date: any, value: number }> | null, perMonth?: Array<{ __typename?: 'AnalyticsDataItem', date: any, value: number }> | null } | null };

export type TopFiveVideosViewedByHubIdQueryVariables = Exact<{
  input: AnalyticsInput;
}>;


export type TopFiveVideosViewedByHubIdQuery = { __typename?: 'Query', topFiveVideosViewedByHubId?: { __typename?: 'TopVideosResponse', serverError?: boolean | null, topVideos?: Array<{ __typename?: 'TopVideos', videoId: string, videoName?: string | null, totalViews?: number | null, currentPosition?: number | null, previousPosition?: number | null } | null> | null } | null };

export type GetRegistrationCountQueryVariables = Exact<{
  input: RegistrationCountRequest;
}>;


export type GetRegistrationCountQuery = { __typename?: 'Query', getRegistrationCount?: { __typename?: 'RegistrationCountResponse', total?: number | null, serverError?: boolean | null, perDay?: Array<{ __typename?: 'RegistrationCount', date: any, value: number }> | null, perWeek?: Array<{ __typename?: 'RegistrationCount', date: any, value: number }> | null, perMonth?: Array<{ __typename?: 'RegistrationCount', date: any, value: number }> | null } | null };

export type ViewsByDeviceTypeQueryVariables = Exact<{
  input: AnalyticsInput;
}>;


export type ViewsByDeviceTypeQuery = { __typename?: 'Query', viewsByDeviceType?: { __typename?: 'ViewsBySourceResponse', desktopViews?: number | null, tabletViews?: number | null, mobileViews?: number | null, totalViews?: number | null, serverError?: boolean | null } | null };

export type VideosViewDetailsByHubIdQueryVariables = Exact<{
  input: AnalyticsInput;
}>;


export type VideosViewDetailsByHubIdQuery = { __typename?: 'Query', videosViewDetailsByHubId?: { __typename?: 'VideoCountData', serverError?: boolean | null, data?: Array<{ __typename?: 'VideoAnalyticsItem', videoId?: string | null, videoTitle?: string | null, thumbnail?: string | null, views?: number | null, videoDuration?: number | null } | null> | null } | null };

export type MemberVideoWatchDurationByHubIdQueryVariables = Exact<{
  input: MemberWatchInput;
}>;


export type MemberVideoWatchDurationByHubIdQuery = { __typename?: 'Query', memberVideoWatchDurationByHubId?: { __typename?: 'MemberWatchDurationData', serverError?: boolean | null, data?: Array<{ __typename?: 'MemberVideoWatchData', id?: string | null, duration?: number | null, percentage?: number | null, firstName?: string | null, lastName?: string | null, email?: string | null } | null> | null } | null };

export type GetAppFeaturesQueryVariables = Exact<{
  appFeatures: Array<AppFeatureInput> | AppFeatureInput;
}>;


export type GetAppFeaturesQuery = { __typename?: 'Query', getAppFeatures?: Array<{ __typename?: 'AppFeature', name: string, enabled: boolean, experimentVersion?: string | null } | null> | null };

export type BannerAssociationsQueryVariables = Exact<{
  bannerAssociationSearch?: InputMaybe<BannerAssociationSearch>;
}>;


export type BannerAssociationsQuery = { __typename?: 'Query', bannerAssociations?: { __typename?: 'BannerAssociationPaging', data: Array<{ __typename?: 'ExistingBannerAssociationWithBanner', centerId: string, entityType: string, entityId: string, displayOrder?: number | null, banner?: { __typename?: 'ExistingBanner', id: string, name: string, layout: string, imageAlignment?: string | null, imageUrl?: string | null, imageAltText?: string | null, text?: { __typename?: 'BannerText', title?: string | null, body?: string | null, alignment?: string | null, color?: string | null } | null, button?: { __typename?: 'BannerButton', enabled: boolean, text?: string | null, targetType?: string | null, internalTarget?: string | null, target?: string | null } | null } | null } | null>, paging: { __typename?: 'Paging', currentToken: string, nextToken?: string | null, limit?: number | null } } | null };

export type BannersQueryVariables = Exact<{
  bannerFilter: BannerFilter;
}>;


export type BannersQuery = { __typename?: 'Query', banners?: { __typename?: 'BannerPagingResponse', data: Array<{ __typename?: 'ExistingBanner', id: string, name: string, layout: string } | null>, paging: { __typename?: 'Paging', currentToken: string, nextToken?: string | null, limit?: number | null } } | null };

export type BannerQueryVariables = Exact<{
  bannersSearch: BannersSearch;
}>;


export type BannerQuery = { __typename?: 'Query', banner?: { __typename?: 'ExistingBanner', centerId: string, id: string, name: string, layout: string, imageAlignment?: string | null, imageUrl?: string | null, originalImageUrl?: string | null, imageAltText?: string | null, text?: { __typename?: 'BannerText', title?: string | null, body?: string | null, alignment?: string | null, color?: string | null } | null, button?: { __typename?: 'BannerButton', enabled: boolean, text?: string | null, targetType?: string | null, internalTarget?: string | null, target?: string | null } | null } | null };

export type HubPagesWithBannerQueryVariables = Exact<{
  input: BannerHubSearch;
}>;


export type HubPagesWithBannerQuery = { __typename?: 'Query', hubPagesWithBanner?: { __typename?: 'HubPages', data: Array<{ __typename?: 'HubPage', entityType: string, entityId: string, name: string } | null> } | null };

export type HubPagesQueryVariables = Exact<{
  id: HubSearch;
}>;


export type HubPagesQuery = { __typename?: 'Query', hubPages?: { __typename?: 'HubPages', data: Array<{ __typename?: 'HubPage', entityType: string, entityId: string, name: string } | null> } | null };

export type BannerCreateMutationVariables = Exact<{
  input: NewBanner;
}>;


export type BannerCreateMutation = { __typename?: 'Mutation', bannerCreate?: string | null };

export type BannerUpdateMutationVariables = Exact<{
  input: BannerUpdate;
}>;


export type BannerUpdateMutation = { __typename?: 'Mutation', bannerUpdate?: { __typename?: 'ExistingBanner', centerId: string, id: string, name: string, layout: string, imageAlignment?: string | null, imageUrl?: string | null, originalImageUrl?: string | null, imageAltText?: string | null, text?: { __typename?: 'BannerText', title?: string | null, body?: string | null, alignment?: string | null, color?: string | null } | null, button?: { __typename?: 'BannerButton', enabled: boolean, text?: string | null, targetType?: string | null, internalTarget?: string | null, target?: string | null } | null } | null };

export type BannerDeleteMutationVariables = Exact<{
  bannersSearch: BannersSearch;
}>;


export type BannerDeleteMutation = { __typename?: 'Mutation', bannerDelete?: string | null };

export type SetBannerAssociationsMutationVariables = Exact<{
  input: BannerAssociationCreate;
}>;


export type SetBannerAssociationsMutation = { __typename?: 'Mutation', setBannerAssociations?: { __typename?: 'BannerAssociationPaging', data: Array<{ __typename?: 'ExistingBannerAssociationWithBanner', centerId: string, entityType: string, entityId: string, displayOrder?: number | null, banner?: { __typename?: 'ExistingBanner', id: string, name: string } | null } | null>, paging: { __typename?: 'Paging', currentToken: string, nextToken?: string | null, limit?: number | null } } | null };

export type ChannelQueryVariables = Exact<{
  channelId: Scalars['String'];
}>;


export type ChannelQuery = { __typename?: 'Query', getChannelInformation?: { __typename?: 'ChannelInformation', title: string, description: string, status: ChannelStatus, id: string, catalogId?: string | null, image?: { __typename?: 'ChannelImage', filename: string, url: string, size: number, imageId: string, createdAt: string } | null } | null };

export type GetPlannerPaginatedChannelsQueryVariables = Exact<{
  hubId: Scalars['String'];
  filterInput?: InputMaybe<FilterInput>;
}>;


export type GetPlannerPaginatedChannelsQuery = { __typename?: 'Query', getPlannerPaginatedChannels?: { __typename?: 'PlannerPaginatedChannels', data: Array<{ __typename?: 'PlannerChannelListObject', id: string, title: string, description: string, status: ChannelStatus, catalogId?: string | null, imageUrl?: string | null, videoCount: number, order: number } | null>, paging: { __typename?: 'Paging', currentToken: string, nextToken?: string | null, limit?: number | null } } | null };

export type GetCatalogQueryVariables = Exact<{
  catalogId: Scalars['ID'];
}>;


export type GetCatalogQuery = { __typename?: 'Query', getCatalog?: { __typename?: 'Catalog', id: string, catalogType: CatalogType, sectionCount: number, events?: Array<string | null> | null, catalogOwner: CatalogOwnerType, sections: Array<{ __typename?: 'CatalogSection', id: string, title: string, videoCount: number, sectionType: SectionType, order: number, videos?: Array<{ __typename?: 'CatalogVideo', id: string, displayName: string, duration: number, thumbnail?: string | null, sessionId?: string | null, status?: VideoStatus | null, order?: number | null, videoId: string, webcastId?: string | null } | null> | null } | null> } | null };

export type CreateChannelMutationVariables = Exact<{
  hubId: Scalars['ID'];
  title: Scalars['String'];
  description: Scalars['String'];
  customDomain?: InputMaybe<Scalars['String']>;
}>;


export type CreateChannelMutation = { __typename?: 'Mutation', createChannel?: { __typename?: 'Channel', title: string, description: string, status: ChannelStatus, id: string, catalogId?: string | null } | null };

export type DeleteChannelMutationVariables = Exact<{
  channelId: Scalars['String'];
}>;


export type DeleteChannelMutation = { __typename?: 'Mutation', deleteChannel?: boolean | null };

export type UploadChannelImageMutationVariables = Exact<{
  channelId: Scalars['String'];
  imageInput: ImageInput;
}>;


export type UploadChannelImageMutation = { __typename?: 'Mutation', uploadChannelImage?: { __typename?: 'ChannelImage', imageId: string, url: string, filename: string, size: number, createdAt: string } | null };

export type DeleteChannelImageMutationVariables = Exact<{
  channelId: Scalars['String'];
  imageId: Scalars['String'];
}>;


export type DeleteChannelImageMutation = { __typename?: 'Mutation', deleteChannelImage?: boolean | null };

export type UpdateChannelMutationVariables = Exact<{
  channelInput: ChannelInput;
}>;


export type UpdateChannelMutation = { __typename?: 'Mutation', updateChannel?: { __typename?: 'Channel', id: string, title: string, description: string, status: ChannelStatus, catalogId?: string | null, imageUrl?: string | null } | null };

export type CreateCatalogMutationVariables = Exact<{
  channelId: Scalars['ID'];
  catalogInput: CatalogInput;
}>;


export type CreateCatalogMutation = { __typename?: 'Mutation', createCatalog?: { __typename?: 'Catalog', id: string, catalogType: CatalogType, sectionCount: number, events?: Array<string | null> | null, catalogOwner: CatalogOwnerType, sections: Array<{ __typename?: 'CatalogSection', id: string, title: string, videoCount: number, sectionType: SectionType, order: number, videos?: Array<{ __typename?: 'CatalogVideo', id: string, displayName: string, duration: number, thumbnail?: string | null, sessionId?: string | null, status?: VideoStatus | null, order?: number | null, videoId: string, webcastId?: string | null } | null> | null } | null> } | null };

export type UpdateCatalogMutationVariables = Exact<{
  channelId: Scalars['ID'];
  catalogId: Scalars['ID'];
  catalogInput: CatalogInput;
}>;


export type UpdateCatalogMutation = { __typename?: 'Mutation', updateCatalog?: { __typename?: 'Catalog', id: string, catalogType: CatalogType, sectionCount: number, events?: Array<string | null> | null, catalogOwner: CatalogOwnerType, sections: Array<{ __typename?: 'CatalogSection', id: string, title: string, videoCount: number, sectionType: SectionType, order: number, videos?: Array<{ __typename?: 'CatalogVideo', id: string, displayName: string, duration: number, thumbnail?: string | null, sessionId?: string | null, status?: VideoStatus | null, order?: number | null, videoId: string, webcastId?: string | null } | null> | null } | null> } | null };

export type UpdateChannelOrderMutationVariables = Exact<{
  hubId: Scalars['ID'];
  channelOrderInputList: Array<InputMaybe<ChannelOrderInput>> | InputMaybe<ChannelOrderInput>;
}>;


export type UpdateChannelOrderMutation = { __typename?: 'Mutation', updateChannelOrder?: Array<{ __typename?: 'ChannelOrder', id: string, order: number } | null> | null };

export type CreateChannelBannerAssociationMutationVariables = Exact<{
  input: ChannelBannerInput;
}>;


export type CreateChannelBannerAssociationMutation = { __typename?: 'Mutation', createChannelBannerAssociation?: { __typename?: 'ChannelBannerOutput', channel: string, banner: string } | null };

export type DeleteChannelBannerAssociationMutationVariables = Exact<{
  input: ChannelBannerInput;
}>;


export type DeleteChannelBannerAssociationMutation = { __typename?: 'Mutation', deleteChannelBannerAssociation?: { __typename?: 'ChannelBannerOutput', channel: string, banner: string } | null };

export type GetContactQueryVariables = Exact<{
  contactId: Scalars['ID'];
}>;


export type GetContactQuery = { __typename?: 'Query', getContact?: { __typename?: 'ContactInformation', id: string, firstName?: string | null, lastName?: string | null, bio?: string | null, pronoun?: string | null, designation?: string | null, company?: string | null, image?: { __typename?: 'ContactImage', href?: string | null } | null } | null };

export type SearchContactsQueryVariables = Exact<{
  input?: InputMaybe<ContactSearchInput>;
}>;


export type SearchContactsQuery = { __typename?: 'Query', searchContacts?: { __typename?: 'PaginatedContactsResult', paging: { __typename?: 'PagingResponse', currentToken: string, limit: number, totalCount: number, nextToken?: string | null }, data: Array<{ __typename?: 'ContactData', id: string, firstName?: string | null, lastName?: string | null, email?: string | null } | null> } | null };

export type SearchContactGroupsQueryVariables = Exact<{
  input?: InputMaybe<ContactGroupSearchInput>;
}>;


export type SearchContactGroupsQuery = { __typename?: 'Query', searchContactGroups?: { __typename?: 'PaginatedContactGroups', paging: { __typename?: 'PagingResponse', currentToken: string, limit: number, totalCount: number, nextToken?: string | null }, data?: Array<{ __typename?: 'ContactGroupData', id: string, name: string }> | null } | null };

export type SearchContactTypesQueryVariables = Exact<{
  input?: InputMaybe<ContactSearchInput>;
}>;


export type SearchContactTypesQuery = { __typename?: 'Query', searchContactTypes?: { __typename?: 'PaginatedContactTypes', paging: { __typename?: 'PagingResponse', currentToken: string, limit: number, totalCount: number, nextToken?: string | null }, data?: Array<{ __typename?: 'ContactTypesData', id: string, name: string }> | null } | null };

export type GetAllowedContactGroupsQueryVariables = Exact<{
  input: GetAllowedContactGroupsInput;
}>;


export type GetAllowedContactGroupsQuery = { __typename?: 'Query', getAllowedContactGroups?: { __typename?: 'AllowedContactGroups', contactGroups: Array<string | null> } | null };

export type SaveContactGroupsMutationVariables = Exact<{
  input: ContactGroupsInput;
}>;


export type SaveContactGroupsMutation = { __typename?: 'Mutation', saveContactGroups?: { __typename?: 'AllowedContactGroups', contactGroups: Array<string | null> } | null };

export type SaveContactTypesMutationVariables = Exact<{
  saveInput: ContactTypesInput;
  deleteInput: ContactTypesInput;
}>;


export type SaveContactTypesMutation = { __typename?: 'Mutation', deleteContactTypes?: { __typename?: 'DeleteContactTypesResponse', deleteContactTypes?: boolean | null } | null, saveContactTypes?: { __typename?: 'AllowedContactTypes', contactTypes: Array<string | null> } | null };

export type GetAllowedContactTypesQueryVariables = Exact<{
  input: GetAllowedContactTypesInput;
}>;


export type GetAllowedContactTypesQuery = { __typename?: 'Query', getAllowedContactTypes?: { __typename?: 'AllowedContactTypes', contactTypes: Array<string | null> } | null };

export type SaveBlockedContactsMutationVariables = Exact<{
  saveInput: BlockedContactsInput;
  deleteInput: BlockedContactsInput;
}>;


export type SaveBlockedContactsMutation = { __typename?: 'Mutation', deleteBlockedContacts?: { __typename?: 'Success', success?: boolean | null } | null, saveBlockedContacts?: { __typename?: 'BlockedContacts', blockedContacts: Array<string | null> } | null };

export type GetBlockedContactsQueryVariables = Exact<{
  input: GetBlockedContactsInput;
}>;


export type GetBlockedContactsQuery = { __typename?: 'Query', getBlockedContacts?: { __typename?: 'BlockedContacts', blockedContacts: Array<string | null> } | null };

export type SaveBlockedContactGroupsMutationVariables = Exact<{
  saveInput: BlockedContactGroupsInput;
  deleteInput: BlockedContactGroupsInput;
}>;


export type SaveBlockedContactGroupsMutation = { __typename?: 'Mutation', deleteBlockedContactGroups?: { __typename?: 'Success', success?: boolean | null } | null, saveBlockedContactGroups?: { __typename?: 'BlockedContactGroups', contactGroups: Array<string | null> } | null };

export type GetBlockedContactGroupsQueryVariables = Exact<{
  input: GetBlockedContactGroupsInput;
}>;


export type GetBlockedContactGroupsQuery = { __typename?: 'Query', getBlockedContactGroups?: { __typename?: 'BlockedContactGroups', contactGroups: Array<string | null> } | null };

export type GetAccountConfigQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAccountConfigQuery = { __typename?: 'Query', accountConfig?: { __typename?: 'AccountVideoCenterConfig', AccountFeatures?: { __typename?: 'AccountConfigFeatures', GeneralFeatures?: { __typename?: 'AccountConfigGeneral', AIWritingAssistantEnabled?: boolean | null, AllowCodeSnippets?: boolean | null, AllowCustomFonts?: boolean | null, AllowGoogleAnalytics?: boolean | null, AllowOAuth?: boolean | null } | null, Blades?: { __typename?: 'AccountConfigBlade', AllowVideosBlade?: boolean | null } | null } | null, VideoManagementFeatures?: { __typename?: 'AccountConfigVideoManagementFeatures', VideoCenterFlag?: boolean | null, VideoStorageSize?: number | null } | null, InternationalSettings?: { __typename?: 'AccountConfigInternationalSettings', DefaultLanguageId?: number | null, DefaultCultureCode?: string | null } | null, EventFeatures?: { __typename?: 'AccountConfigEventFeatures', GeneralFeatures?: { __typename?: 'AccountConfigEventFeaturesGeneral', LicenseTypeId?: number | null } | null } | null } | null };

export type GetUserPermissionsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUserPermissionsQuery = { __typename?: 'Query', userPermissions?: { __typename?: 'UserPermissions', VideoCenter?: boolean | null, VideoLibrary?: boolean | null, VideoStorage?: boolean | null, EventsPlusCustomHeader?: boolean | null } | null };

export type GetAccountLocaleQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAccountLocaleQuery = { __typename?: 'Query', accountLocale?: Array<{ __typename?: 'AccountLocale', IsDefault?: boolean | null, Locale?: { __typename?: 'Locale', Id: number, LanguageName?: string | null, CountryLanguage?: string | null, CultureCode?: string | null, IsDefault?: boolean | null, LocalizationFlag?: boolean | null, AvailableCultures?: Array<{ __typename?: 'Culture', LocaleId: number, CultureCountryId?: number | null, IsDefaultCulture?: boolean | null, CultureCode?: string | null } | null> | null } | null } | null> | null };

export type GetAccountDetailsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAccountDetailsQuery = { __typename?: 'Query', accountDetails?: { __typename?: 'AccountDetails', AccountId?: number | null, AccountName?: string | null, AccountStub?: string | null, AccountCompanyName?: string | null } | null };

export type GetUserDetailsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUserDetailsQuery = { __typename?: 'Query', user?: { __typename?: 'UserDetails', firstName?: string | null, lastName?: string | null, email?: string | null, company?: string | null, viewProfileText?: string | null, url?: { __typename?: 'Url', href?: string | null } | null } | null };

export type GetCustomDomainForHubQueryVariables = Exact<{
  hubId: Scalars['ID'];
}>;


export type GetCustomDomainForHubQuery = { __typename?: 'Query', getCustomDomainForHub?: { __typename?: 'CustomDomainMapping', entityId: string, customDomainId: string, trailingName?: string | null } | null };

export type GetCustomDomainForAccountQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCustomDomainForAccountQuery = { __typename?: 'Query', getCustomDomainForAccount?: Array<{ __typename?: 'CustomDomain', customDomainId?: string | null, domainName?: string | null } | null> | null };

export type CreateHubCustomDomainMappingMutationVariables = Exact<{
  input: CustomDomainMappingInput;
}>;


export type CreateHubCustomDomainMappingMutation = { __typename?: 'Mutation', createHubCustomDomainMapping?: { __typename?: 'CustomDomainMapping', entityId: string, customDomainId: string, trailingName?: string | null } | null };

export type UpdateHubCustomDomainMappingMutationVariables = Exact<{
  input: CustomDomainMappingInput;
}>;


export type UpdateHubCustomDomainMappingMutation = { __typename?: 'Mutation', updateHubCustomDomainMapping?: { __typename?: 'CustomDomainMapping', entityId: string, customDomainId: string, trailingName?: string | null } | null };

export type DeleteHubCustomDomainMappingMutationVariables = Exact<{
  hubId: Scalars['ID'];
}>;


export type DeleteHubCustomDomainMappingMutation = { __typename?: 'Mutation', deleteHubCustomDomainMapping?: boolean | null };

export type FileImportHistoryQueryVariables = Exact<{
  hubId: Scalars['String'];
  fileImportHistoryInput: FileImportHistoryInput;
}>;


export type FileImportHistoryQuery = { __typename?: 'Query', fileImportHistory?: Array<{ __typename?: 'FileImportHistory', successCount: number, errorCount: number, totalCount: number, createdBy: string, createdAt: string, userId: string, fileName: string, accountId: number, locale?: string | null, status?: string | null } | null> | null };

export type GetPageQueryVariables = Exact<{
  input: HubSearch;
}>;


export type GetPageQuery = { __typename?: 'Query', getPage?: { __typename?: 'PageWithSections', page?: { __typename?: 'Page', pageId: string, videoCenterId: string, status?: string | null, sectionIds?: Array<string | null> | null } | null, sections?: Array<{ __typename?: 'PageSection', sectionId: string, originPageId: string, pageSectionTemplate?: string | null, title?: string | null, visibleFields?: Array<string | null> | null, contentLimitOnInitialLoad?: number | null, featuredContentType?: string | null, featuredContentTypeId?: string | null, contentType?: string | null, contentIds?: Array<string | null> | null, contentFilterType?: string | null, contentFilterDateAbstract?: string | null, alignment?: string | null, layout?: string | null, textBody?: string | null, textColor?: string | null, buttonEnabled?: boolean | null, buttonText?: string | null, buttonExternalTarget?: string | null, buttonInternalTarget?: string | null, buttonTargetType?: string | null, imageUrl?: string | null, originalImageUrl?: string | null, imageAltText?: string | null } | null> | null } | null };

export type CreatePageMutationVariables = Exact<{
  page: PageInput;
  newSection?: InputMaybe<PageSectionInput>;
}>;


export type CreatePageMutation = { __typename?: 'Mutation', createPage?: { __typename?: 'PageWithSection', page: { __typename?: 'Page', pageId: string, videoCenterId: string, status?: string | null, sectionIds?: Array<string | null> | null }, newSection?: { __typename?: 'PageSection', sectionId: string, originPageId: string, pageSectionTemplate?: string | null, title?: string | null, visibleFields?: Array<string | null> | null, contentLimitOnInitialLoad?: number | null, featuredContentType?: string | null, featuredContentTypeId?: string | null, contentType?: string | null, contentIds?: Array<string | null> | null, contentFilterType?: string | null, contentFilterDateAbstract?: string | null, alignment?: string | null, layout?: string | null, textBody?: string | null, textColor?: string | null, buttonEnabled?: boolean | null, buttonText?: string | null, buttonExternalTarget?: string | null, buttonInternalTarget?: string | null, buttonTargetType?: string | null, imageUrl?: string | null, originalImageUrl?: string | null, imageAltText?: string | null } | null } | null };

export type UpdatePageMutationVariables = Exact<{
  data: PageInput;
}>;


export type UpdatePageMutation = { __typename?: 'Mutation', updatePage?: { __typename?: 'Page', pageId: string, videoCenterId: string, status?: string | null, sectionIds?: Array<string | null> | null } | null };

export type CreateSectionMutationVariables = Exact<{
  data: PageSectionInput;
  input: HubSearch;
}>;


export type CreateSectionMutation = { __typename?: 'Mutation', createSection?: { __typename?: 'PageSection', sectionId: string, originPageId: string, pageSectionTemplate?: string | null, title?: string | null, visibleFields?: Array<string | null> | null, contentLimitOnInitialLoad?: number | null, featuredContentType?: string | null, featuredContentTypeId?: string | null, contentType?: string | null, contentIds?: Array<string | null> | null, contentFilterType?: string | null, contentFilterDateAbstract?: string | null, alignment?: string | null, layout?: string | null, textBody?: string | null, textColor?: string | null, buttonEnabled?: boolean | null, buttonText?: string | null, buttonExternalTarget?: string | null, buttonInternalTarget?: string | null, buttonTargetType?: string | null, imageUrl?: string | null, originalImageUrl?: string | null, imageAltText?: string | null } | null };

export type UpdateSectionMutationVariables = Exact<{
  data: PageSectionInput;
  input: HubSearch;
}>;


export type UpdateSectionMutation = { __typename?: 'Mutation', updateSection?: { __typename?: 'PageSection', sectionId: string, originPageId: string, pageSectionTemplate?: string | null, title?: string | null, visibleFields?: Array<string | null> | null, contentLimitOnInitialLoad?: number | null, featuredContentType?: string | null, featuredContentTypeId?: string | null, contentType?: string | null, contentIds?: Array<string | null> | null, contentFilterType?: string | null, contentFilterDateAbstract?: string | null, alignment?: string | null, layout?: string | null, textBody?: string | null, textColor?: string | null, buttonEnabled?: boolean | null, buttonText?: string | null, buttonExternalTarget?: string | null, buttonInternalTarget?: string | null, buttonTargetType?: string | null, imageUrl?: string | null, originalImageUrl?: string | null, imageAltText?: string | null } | null };

export type GetPublishedPageOrDefaultsQueryVariables = Exact<{
  input: HubSearch;
}>;


export type GetPublishedPageOrDefaultsQuery = { __typename?: 'Query', getPublishedPageOrDefaults?: { __typename?: 'PageWithSections', page?: { __typename?: 'Page', pageId: string, videoCenterId: string, status?: string | null, sectionIds?: Array<string | null> | null } | null, sections?: Array<{ __typename?: 'PageSection', sectionId: string, originPageId: string, pageSectionTemplate?: string | null, title?: string | null, visibleFields?: Array<string | null> | null, contentLimitOnInitialLoad?: number | null, featuredContentType?: string | null, featuredContentTypeId?: string | null, contentType?: string | null, contentIds?: Array<string | null> | null, contentFilterType?: string | null, contentFilterDateAbstract?: string | null, alignment?: string | null, layout?: string | null, textBody?: string | null, textColor?: string | null, buttonEnabled?: boolean | null, buttonText?: string | null, buttonExternalTarget?: string | null, buttonInternalTarget?: string | null, buttonTargetType?: string | null, imageUrl?: string | null, originalImageUrl?: string | null, imageAltText?: string | null } | null> | null } | null };

export type GetHubSettingsQueryVariables = Exact<{
  id: HubSearch;
}>;


export type GetHubSettingsQuery = { __typename?: 'Query', getHubSettings?: { __typename?: 'Settings', allowTurnOffGoogleAnalytics?: boolean | null, displayCventPrivacyPolicy?: boolean | null, cventPrivacyPolicyLinkText?: string | null, displayPrivacyPolicy?: boolean | null, privacyPolicyUrl?: string | null, privacyPolicyLinkText?: string | null, displayTermsLinkOnFooter?: boolean | null, termsLinkText?: string | null, displayTermsOnLogin?: boolean | null, termsText?: string | null, notifyUsersAboutCookie?: boolean | null, displayCventPrivacyPolicyInCookie?: boolean | null, allowTurnOffCookies?: boolean | null, ccpaEnableDoNotSell?: boolean | null, ccpaLinkText?: string | null, ccpaSubmitButtonText?: string | null, ccpaConfirmationText?: string | null, ccpaDoNotSellUrlEnabled?: boolean | null, ccpaDoNotSellUrl?: string | null, ccpaLinkExplanationText?: string | null, memberProfilePublic?: boolean | null, guestVisibility?: GuestVisibility | null, allowLimitedViewsBeforeLogin?: boolean | null, allowLimitedViewsBeforeLoginCount?: number | null, showLogo?: boolean | null, registrationBackground?: BackGroundStyle | null, allowHubSearchEngineIndexing?: boolean | null, decorativeImage?: boolean | null, registrationSettings?: { __typename?: 'RegistrationSettings', allowAllContactsRegistration?: boolean | null, allowContactGroupsRegistration?: boolean | null, allowContactTypesRegistration?: boolean | null, blockContactsRegistration?: boolean | null, blockListRegistration?: boolean | null, allowedEmailDomain?: AllowedEmailDomain | null } | null, profileCard?: { __typename?: 'ProfileCard', border?: string | null, branding?: string | null, alignment?: string | null, showName?: boolean | null, allowNameEdit?: boolean | null, showJobTitle?: boolean | null, allowJobTitleEdit?: boolean | null, showCompany?: boolean | null, allowCompanyEdit?: boolean | null, showHeadline?: boolean | null, allowHeadlineEdit?: boolean | null, showSocialMediaLinks?: boolean | null, allowSocialMediaEdit?: boolean | null, showPronouns?: boolean | null, allowPronounsEdit?: boolean | null } | null, cookieLists?: { __typename?: 'CookieList', enableCvent?: boolean | null, cventUrl?: string | null, enableCustom?: boolean | null, customUrl?: string | null, customLinkText?: string | null } | null } | null };

export type HubQueryVariables = Exact<{
  hubID?: InputMaybe<HubSearch>;
}>;


export type HubQuery = { __typename?: 'Query', hub?: { __typename?: 'Hub', id: string, status?: string | null, config?: { __typename?: 'Config', title: string, ownerFirstName: string, ownerLastName: string, ownerEmail: string, url?: string | null, locale?: string | null, accountMappingId?: string | null, helpEmailAddress?: string | null, utmOverride?: string | null, autoDetectBrowserLocale?: boolean | null, customDomain?: string | null, loginType?: LoginType | null, organizationId?: string | null } | null, theme?: { __typename?: 'Theme', actionColor?: string | null, backgroundColor?: string | null, logoImageRelativePath?: string | null, logoImageUrl?: string | null, logoOriginalImageUrl?: string | null, logoAltText?: string | null, backgroundImageUrl?: string | null, backgroundOriginalImageUrl?: string | null, backgroundImageAltText?: string | null, mainColor?: string | null, moodColor?: string | null, safeMode?: boolean | null, faviconUrl?: string | null, headingsFont?: string | null, bodyFont?: string | null } | null, calendar?: { __typename?: 'Calendar', id?: string | null } | null } | null };

export type GetCenterFeaturesQueryVariables = Exact<{
  id: HubSearch;
}>;


export type GetCenterFeaturesQuery = { __typename?: 'Query', getCenterFeatures?: Array<{ __typename?: 'Feature', code: string, enabled: boolean } | null> | null };

export type GetHubCustomizationsQueryVariables = Exact<{
  id: HubSearch;
}>;


export type GetHubCustomizationsQuery = { __typename?: 'Query', getHubCustomizations?: { __typename?: 'Customizations', headerHtml?: string | null, headerCss?: string | null, headerJavascript?: string | null, showCustomHeader?: boolean | null, showLogo?: boolean | null, showLogin?: boolean | null, showHomePage?: boolean | null, showUpcomingEvents?: boolean | null, showChannels?: boolean | null, showVideos?: boolean | null, showNavigation?: boolean | null, navigationAlignment?: NavigationAlignment | null, navigationLinkTextSize?: number | null, navigationLinkHighlightStyle?: NavigationLinkHighlightStyle | null, navigationHeaderLeftPadding?: number | null, navigationHeaderRightPadding?: number | null, navigationHeaderMaxWidth?: number | null, defaultLandingPage?: DefaultLandingPage | null } | null };

export type UpsertHubCustomizationsMutationVariables = Exact<{
  id: HubSearch;
  input: CustomizationsInput;
}>;


export type UpsertHubCustomizationsMutation = { __typename?: 'Mutation', upsertHubCustomizations?: { __typename?: 'Customizations', headerHtml?: string | null, headerCss?: string | null, headerJavascript?: string | null, showCustomHeader?: boolean | null, showLogo?: boolean | null, showLogin?: boolean | null, showHomePage?: boolean | null, showUpcomingEvents?: boolean | null, showChannels?: boolean | null, showVideos?: boolean | null, showNavigation?: boolean | null, navigationAlignment?: NavigationAlignment | null, navigationLinkTextSize?: number | null, navigationLinkHighlightStyle?: NavigationLinkHighlightStyle | null, navigationHeaderLeftPadding?: number | null, navigationHeaderRightPadding?: number | null, navigationHeaderMaxWidth?: number | null, defaultLandingPage?: DefaultLandingPage | null } | null };

export type GetHubLocalesQueryVariables = Exact<{
  id: HubSearch;
}>;


export type GetHubLocalesQuery = { __typename?: 'Query', getHubLocales?: { __typename?: 'HubLocalesWithDefault', data: Array<{ __typename?: 'HubLocaleWithDefault', locale: string, default: boolean, customized?: string | null, translationStatus?: string | null, lastModified?: string | null, lastModifiedBy?: string | null } | null> } | null };

export type AddHubLocalesMutationVariables = Exact<{
  hubLocales: HubLocales;
  id: HubSearch;
}>;


export type AddHubLocalesMutation = { __typename?: 'Mutation', addHubLocales?: { __typename?: 'HubLocalesWithDefault', data: Array<{ __typename?: 'HubLocaleWithDefault', locale: string, default: boolean } | null> } | null };

export type HubsQueryVariables = Exact<{
  input?: InputMaybe<Hubs>;
}>;


export type HubsQuery = { __typename?: 'Query', hubs?: { __typename?: 'HubsPagingResponse', data: Array<{ __typename?: 'Hub', id: string, status?: string | null, config?: { __typename?: 'Config', title: string, ownerFirstName: string, ownerLastName: string, ownerEmail: string, url?: string | null, locale?: string | null } | null } | null>, paging: { __typename?: 'PagingResponse', currentToken: string, nextToken?: string | null, limit: number, totalCount: number } } | null };

export type GetVideoHubTitleQueryVariables = Exact<{
  hubID?: InputMaybe<HubSearch>;
}>;


export type GetVideoHubTitleQuery = { __typename?: 'Query', hub?: { __typename?: 'Hub', id: string, config?: { __typename?: 'Config', title: string } | null } | null };

export type GetHubTermsEditPermissionQueryVariables = Exact<{
  id: HubSearch;
}>;


export type GetHubTermsEditPermissionQuery = { __typename?: 'Query', getHubTermsEditPermission?: AllowTermsEdit | null };

export type GetRegistrationFormSettingsQueryVariables = Exact<{
  input: RegistrationFormSettingInput;
}>;


export type GetRegistrationFormSettingsQuery = { __typename?: 'Query', getRegistrationFormSettings?: { __typename?: 'RegistrationFormSettings', data: Array<{ __typename?: 'FormFieldSetting', included: boolean, order: number, code: RegistrationFieldCode, required: boolean } | null> } | null };

export type GetHubCodeSnippetsQueryVariables = Exact<{
  hubId: Scalars['String'];
}>;


export type GetHubCodeSnippetsQuery = { __typename?: 'Query', getHubCodeSnippets: Array<{ __typename?: 'HubCodeSnippets', codeSnippetId: string, applicableOn: ApplicableOn, targetWebPages: Array<TargetWebPages | null> } | null> };

export type GetCustomDomainsQueryVariables = Exact<{
  hubId: Scalars['ID'];
}>;


export type GetCustomDomainsQuery = { __typename?: 'Query', getCustomDomainForHub?: { __typename?: 'CustomDomainMapping', entityId: string, customDomainId: string, trailingName?: string | null } | null, getCustomDomainForAccount?: Array<{ __typename?: 'CustomDomain', customDomainId?: string | null, domainName?: string | null } | null> | null };

export type GetAccountAndCustomFontInformationQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAccountAndCustomFontInformationQuery = { __typename?: 'Query', getAccountSnapshot?: { __typename?: 'AccountSnapshot', customFonts?: Array<{ __typename?: 'CustomFont', id?: string | null, fontFamily?: string | null, fallbackFontId?: number | null, fallbackFont?: string | null, isActive?: boolean | null, files?: Array<{ __typename?: 'FontFile', url?: string | null, fontStyle?: string | null, fontWeight?: number | null } | null> | null } | null> | null } | null, accountConfig?: { __typename?: 'AccountVideoCenterConfig', AccountFeatures?: { __typename?: 'AccountConfigFeatures', GeneralFeatures?: { __typename?: 'AccountConfigGeneral', AllowCustomFonts?: boolean | null, AllowCodeSnippets?: boolean | null } | null } | null } | null };

export type GetUtmOverridesQueryVariables = Exact<{
  input: HubSearch;
}>;


export type GetUtmOverridesQuery = { __typename?: 'Query', getUtmOverrides?: Array<{ __typename?: 'UtmOverride', key: string, value: string } | null> | null };

export type HubCreateMutationVariables = Exact<{
  hubUpdate?: InputMaybe<HubCreate>;
}>;


export type HubCreateMutation = { __typename?: 'Mutation', hubCreate?: string | null };

export type HubUpdateMutationVariables = Exact<{
  input: HubUpdate;
}>;


export type HubUpdateMutation = { __typename?: 'Mutation', hubUpdate?: string | null };

export type HubDeleteMutationVariables = Exact<{
  input?: InputMaybe<HubSearch>;
}>;


export type HubDeleteMutation = { __typename?: 'Mutation', hubDelete?: string | null };

export type DeleteTokenMutationVariables = Exact<{
  input?: InputMaybe<HubSearch>;
}>;


export type DeleteTokenMutation = { __typename?: 'Mutation', deleteToken?: string | null };

export type HubDraftMutationVariables = Exact<{
  input?: InputMaybe<HubSearch>;
}>;


export type HubDraftMutation = { __typename?: 'Mutation', hubDraft?: string | null };

export type HubPublishMutationVariables = Exact<{
  input?: InputMaybe<HubSearch>;
}>;


export type HubPublishMutation = { __typename?: 'Mutation', hubPublish?: string | null };

export type HubUpdateSettingsMutationVariables = Exact<{
  input?: InputMaybe<HubUpdateSettings>;
}>;


export type HubUpdateSettingsMutation = { __typename?: 'Mutation', hubUpdateSettings?: { __typename?: 'Settings', allowTurnOffGoogleAnalytics?: boolean | null, displayPrivacyPolicy?: boolean | null, privacyPolicyUrl?: string | null, displayCventPrivacyPolicy?: boolean | null, cventPrivacyPolicyLinkText?: string | null, privacyPolicyLinkText?: string | null, ccpaLinkText?: string | null, ccpaSubmitButtonText?: string | null, ccpaDoNotSellUrlEnabled?: boolean | null, ccpaConfirmationText?: string | null, ccpaDoNotSellUrl?: string | null, ccpaLinkExplanationText?: string | null, allowTurnOffCookies?: boolean | null, termsText?: string | null, termsLinkText?: string | null, displayTermsOnLogin?: boolean | null, ccpaEnableDoNotSell?: boolean | null, notifyUsersAboutCookie?: boolean | null, displayTermsLinkOnFooter?: boolean | null, displayCventPrivacyPolicyInCookie?: boolean | null, memberProfilePublic?: boolean | null, guestVisibility?: GuestVisibility | null, allowLimitedViewsBeforeLogin?: boolean | null, allowLimitedViewsBeforeLoginCount?: number | null, showLogo?: boolean | null, registrationBackground?: BackGroundStyle | null, allowHubSearchEngineIndexing?: boolean | null, decorativeImage?: boolean | null, profileCard?: { __typename?: 'ProfileCard', showName?: boolean | null, allowNameEdit?: boolean | null, showJobTitle?: boolean | null, allowJobTitleEdit?: boolean | null, showCompany?: boolean | null, allowCompanyEdit?: boolean | null, showHeadline?: boolean | null, allowHeadlineEdit?: boolean | null, showSocialMediaLinks?: boolean | null, allowSocialMediaEdit?: boolean | null } | null, cookieLists?: { __typename?: 'CookieList', enableCvent?: boolean | null, cventUrl?: string | null, enableCustom?: boolean | null, customUrl?: string | null, customLinkText?: string | null } | null, registrationSettings?: { __typename?: 'RegistrationSettings', allowAllContactsRegistration?: boolean | null, allowContactGroupsRegistration?: boolean | null, allowContactTypesRegistration?: boolean | null, blockContactsRegistration?: boolean | null, blockListRegistration?: boolean | null, allowedEmailDomain?: AllowedEmailDomain | null } | null } | null };

export type UpdateCenterFeatureMutationVariables = Exact<{
  input: FeatureInput;
}>;


export type UpdateCenterFeatureMutation = { __typename?: 'Mutation', updateCenterFeature?: { __typename?: 'Feature', code: string, enabled: boolean } | null };

export type UpdateBrandingImagesMutationVariables = Exact<{
  input: BrandingImagesInput;
}>;


export type UpdateBrandingImagesMutation = { __typename?: 'Mutation', updateBrandingImages?: { __typename?: 'Hub', theme?: { __typename?: 'Theme', logoImageRelativePath?: string | null, logoImageUrl?: string | null, logoOriginalImageUrl?: string | null, logoAltText?: string | null, faviconUrl?: string | null } | null } | null };

export type SetUtmOverridesMutationVariables = Exact<{
  input: HubSearch;
  data?: InputMaybe<Array<InputMaybe<UtmOverrideInput>> | InputMaybe<UtmOverrideInput>>;
}>;


export type SetUtmOverridesMutation = { __typename?: 'Mutation', setUtmOverrides?: Array<{ __typename?: 'UtmOverride', key: string, value: string } | null> | null };

export type UpdateRegistrationFormSettingsMutationVariables = Exact<{
  input: UpdateRegistrationFormSettingInput;
}>;


export type UpdateRegistrationFormSettingsMutation = { __typename?: 'Mutation', updateRegistrationFormSettings?: { __typename?: 'RegistrationFormSettings', data: Array<{ __typename?: 'FormFieldSetting', order: number, code: RegistrationFieldCode, required: boolean, included: boolean } | null> } | null };

export type UpdateBackgroundImagesMutationVariables = Exact<{
  input: BackgroundImagesInput;
}>;


export type UpdateBackgroundImagesMutation = { __typename?: 'Mutation', updateBackgroundImages?: { __typename?: 'Hub', theme?: { __typename?: 'Theme', backgroundImageUrl?: string | null, backgroundOriginalImageUrl?: string | null, backgroundImageAltText?: string | null } | null } | null };

export type GetTranslationsQueryVariables = Exact<{
  input: TranslationSearch;
}>;


export type GetTranslationsQuery = { __typename?: 'Query', getTranslations?: { __typename?: 'TranslationPagingResponse', paging: { __typename?: 'PagingResponse', limit: number, currentToken: string, nextToken?: string | null, previousToken?: string | null, totalCount: number }, data: Array<{ __typename?: 'Translation', type: string, locale: string, id: string, translatedValue?: string | null, defaultValue?: string | null } | null> } | null };

export type SetTranslationsMutationVariables = Exact<{
  input: HubSearch;
  locale: Scalars['String'];
  data?: InputMaybe<Array<InputMaybe<TranslationInput>> | InputMaybe<TranslationInput>>;
}>;


export type SetTranslationsMutation = { __typename?: 'Mutation', setTranslations?: { __typename?: 'TranslationUpdateResponse', Failure?: Array<{ __typename?: 'Translation', type: string, locale: string, id: string, translatedValue?: string | null } | null> | null, Success?: Array<{ __typename?: 'Translation', type: string, locale: string, id: string, translatedValue?: string | null } | null> | null } | null };

export type ResetTranslationsMutationVariables = Exact<{
  input: ResetTranslationSearch;
}>;


export type ResetTranslationsMutation = { __typename?: 'Mutation', resetTranslations?: string | null };

export type GetLocaleQueryVariables = Exact<{ [key: string]: never; }>;


export type GetLocaleQuery = { __typename?: 'Query', locale?: string | null };

export type MemberLoginQueryVariables = Exact<{
  memberLoginInput?: InputMaybe<MemberLoginInput>;
}>;


export type MemberLoginQuery = { __typename?: 'Query', memberLogin?: { __typename?: 'MemberLoginResponse', id?: string | null, expirationDate?: string | null, maxEmailSent?: boolean | null, firstName?: string | null, lastName?: string | null, email?: string | null, emailLocked?: boolean | null, userRestricted?: boolean | null, serverError?: string | null } | null };

export type GetEntityImageQueryVariables = Exact<{
  entity: EntityInput;
}>;


export type GetEntityImageQuery = { __typename?: 'Query', getEntityImage?: { __typename?: 'EntityImage', id: string, entityId: string, entityType: string, filename: string, size: number, url: string, createdAt: string } | null };

export type UploadEntityImageMutationVariables = Exact<{
  imageInput: EntityImageInput;
}>;


export type UploadEntityImageMutation = { __typename?: 'Mutation', uploadEntityImage?: { __typename?: 'EntityImage', id: string, entityId: string, entityType: string, filename: string, size: number, url: string, createdAt: string } | null };

export type DeleteEntityImageMutationVariables = Exact<{
  imageId: Scalars['String'];
}>;


export type DeleteEntityImageMutation = { __typename?: 'Mutation', deleteEntityImage?: boolean | null };

export type SearchMemberListQueryVariables = Exact<{
  input?: InputMaybe<SearchMemberInput>;
}>;


export type SearchMemberListQuery = { __typename?: 'Query', searchMemberList?: { __typename?: 'MemberListPaginatedResult', paging: { __typename?: 'Paging', limit?: number | null, totalCount?: number | null, currentToken: string, nextToken?: string | null }, data: Array<{ __typename?: 'MemberListData', id: string, firstName: string, lastName: string, emailAddress: string, jobTitle?: string | null, companyName?: string | null, mobileNumber?: string | null, registrationDate: string, lastLoginDate: string, registrationAge?: { __typename?: 'RegistrationAge', years: number, months: number, days: number } | null } | null> } | null };

export type UpdateMemberStatusMutationVariables = Exact<{
  input: UpdateMemberStatusInput;
}>;


export type UpdateMemberStatusMutation = { __typename?: 'Mutation', updateMemberStatus?: { __typename?: 'Success', success?: boolean | null } | null };

export type GetAdvancedAppNavigationQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAdvancedAppNavigationQuery = { __typename?: 'Query', products?: { __typename?: 'AppSwitcher', id?: string | null, title?: string | null, defaultOpen?: boolean | null, items?: Array<{ __typename?: 'UserProduct', id: string, status: string, icon: string, title: string, url: { __typename?: 'Url', href?: string | null } } | null> | null } | null, helpMenu?: { __typename?: 'HelpMenu', title?: string | null, items?: Array<{ __typename?: 'Utility', icon?: string | null, openInNewTab?: boolean | null, hasCustomOnClickHandler?: boolean | null, title?: string | null, url?: { __typename?: 'Url', href?: string | null } | null } | null> | null } | null, userUtilities?: { __typename?: 'UserUtilities', title?: string | null, items: Array<{ __typename?: 'Utility', icon?: string | null, title?: string | null, openInNewTab?: boolean | null, hasCustomOnClickHandler?: boolean | null, url?: { __typename?: 'Url', href?: string | null } | null } | null> } | null, user?: { __typename?: 'UserDetails', firstName?: string | null, lastName?: string | null, email?: string | null, company?: string | null, viewProfileText?: string | null, url?: { __typename?: 'Url', href?: string | null } | null } | null, recentItems?: { __typename?: 'RecentItems', title?: string | null, items?: Array<{ __typename?: 'RecentItem', id?: string | null, icon?: string | null, title?: string | null, url?: string | null, type?: string | null } | null> | null } | null };

export type UpdateRecentItemsMutationVariables = Exact<{
  input: UpdateRecentItemsRequest;
}>;


export type UpdateRecentItemsMutation = { __typename?: 'Mutation', updateRecentItems?: Array<{ __typename?: 'RecentItem', id?: string | null, icon?: string | null, title?: string | null, url?: string | null, type?: string | null } | null> | null };

export type GetMemberDataFullQueryVariables = Exact<{
  input: MemberDataInput;
}>;


export type GetMemberDataFullQuery = { __typename?: 'Query', getMemberData?: { __typename?: 'MemberData', visibility?: boolean | null, termsAccepted?: boolean | null, profile: { __typename?: 'MemberProfile', firstName: string, lastName: string, emailAddress: string, prefix?: string | null, designation?: string | null, jobTitle?: string | null, companyName?: string | null, mobileNumber?: string | null, compliance?: { __typename?: 'Compliance', creationTime?: string | null, complianceScope?: string | null, action?: string | null, createdBy?: string | null } | null, profileImageUrl?: { __typename?: 'Url', href?: string | null } | null, socialMediaLinks?: { __typename?: 'SocialMediaLinks', facebookUrl?: { __typename?: 'Url', href?: string | null } | null, twitterUrl?: { __typename?: 'Url', href?: string | null } | null, linkedinUrl?: { __typename?: 'Url', href?: string | null } | null } | null } } | null };

export type GetMemberProfileDataQueryVariables = Exact<{
  input: MemberDataInput;
}>;


export type GetMemberProfileDataQuery = { __typename?: 'Query', getMemberData?: { __typename?: 'MemberData', profile: { __typename?: 'MemberProfile', firstName: string, lastName: string, emailAddress: string, jobTitle?: string | null, companyName?: string | null, mobileNumber?: string | null } } | null };

export type SaveEmailDomainsMutationVariables = Exact<{
  input: EmailDomainsInput;
}>;


export type SaveEmailDomainsMutation = { __typename?: 'Mutation', saveEmailDomains?: { __typename?: 'AllowedDomains', emailDomains: Array<string | null> } | null };

export type GetEmailDomainsQueryVariables = Exact<{
  input: GetEmailDomainsInput;
}>;


export type GetEmailDomainsQuery = { __typename?: 'Query', getEmailDomains?: { __typename?: 'AllowedDomains', emailDomains: Array<string | null> } | null };

export type FetchAndCreateShortUrlByTagQueryVariables = Exact<{
  videoCenterId: Scalars['String'];
}>;


export type FetchAndCreateShortUrlByTagQuery = { __typename?: 'Query', fetchAndCreateShortUrlByTag?: Array<{ __typename?: 'ShortUrlByTag', shortUrl?: string | null, pageName?: ShortUrlPage | null } | null> | null };

export type GetAccountCodeSnippetsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAccountCodeSnippetsQuery = { __typename?: 'Query', getAccountCodeSnippets?: { __typename?: 'CodeSnippetResponse', allowCodeSnippets: boolean, accountCodeSnippets?: Array<{ __typename?: 'AccountCodeSnippet', codeSnippetId: string, codeSnippetDataTagCode: string, codeSnippetName: string, codeSnippetValue: string, codeSnippetStatus: CodeSnippetStatus, isDropCodeSnippetToCookieBannerTied: boolean } | null> | null } | null };

export type GetAccountSnapshotQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAccountSnapshotQuery = { __typename?: 'Query', getAccountSnapshot?: { __typename?: 'AccountSnapshot', id?: string | null, name?: string | null, accountStub?: string | null, customFonts?: Array<{ __typename?: 'CustomFont', id?: string | null, fontFamily?: string | null, fallbackFontId?: number | null, fallbackFont?: string | null, isActive?: boolean | null, files?: Array<{ __typename?: 'FontFile', url?: string | null, fontStyle?: string | null, fontWeight?: number | null } | null> | null } | null> | null } | null };

export type SaveCodeSnippetMutationVariables = Exact<{
  input: CodeSnippetInput;
}>;


export type SaveCodeSnippetMutation = { __typename?: 'Mutation', saveCodeSnippet?: { __typename?: 'CodeSnippet', codeSnippetId: string, applicableOn?: ApplicableOn | null, addToAllPages?: boolean | null, addToLoginPage?: boolean | null, addToSingleVideoPage?: boolean | null } | null };

export type UpdateCodeSnippetMutationVariables = Exact<{
  input: CodeSnippetInput;
}>;


export type UpdateCodeSnippetMutation = { __typename?: 'Mutation', updateCodeSnippet?: { __typename?: 'CodeSnippet', codeSnippetId: string, applicableOn?: ApplicableOn | null, addToAllPages?: boolean | null, addToLoginPage?: boolean | null, addToSingleVideoPage?: boolean | null } | null };

export type RemoveCodeSnippetMutationVariables = Exact<{
  input: RemoveCodeSnippetInput;
}>;


export type RemoveCodeSnippetMutation = { __typename?: 'Mutation', removeCodeSnippet?: { __typename?: 'Success', success?: boolean | null } | null };

export type GetGoogleMeasurementIdQueryVariables = Exact<{
  hubId: Scalars['String'];
}>;


export type GetGoogleMeasurementIdQuery = { __typename?: 'Query', getGoogleMeasurementId?: { __typename?: 'MeasurementIdResponse', measurementId: string } | null };

export type SaveGoogleMeasurementIdMutationVariables = Exact<{
  input: MeasurementIdInput;
}>;


export type SaveGoogleMeasurementIdMutation = { __typename?: 'Mutation', saveGoogleMeasurementId?: { __typename?: 'MeasurementIdResponse', measurementId: string } | null };

export type GetCalendarListQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCalendarListQuery = { __typename?: 'Query', calendars?: { __typename?: 'CalendarsResponse', data: Array<{ __typename?: 'EventCalendar', id: string, name: string } | null> } | null };

export type CalendarsQueryVariables = Exact<{ [key: string]: never; }>;


export type CalendarsQuery = { __typename?: 'Query', calendars?: { __typename?: 'CalendarsResponse', data: Array<{ __typename?: 'EventCalendar', id: string, name: string } | null> } | null };

export type GeneratePreSignedUrlQueryVariables = Exact<{
  input: PreSignedInput;
}>;


export type GeneratePreSignedUrlQuery = { __typename?: 'Query', generatePreSignedUrl?: { __typename?: 'PreSignedResponse', uploadUrl: string, fileId: string, fullFilePath: string } | null };

export type CheckScanStatusQueryVariables = Exact<{
  input: ScanStatusInput;
}>;


export type CheckScanStatusQuery = { __typename?: 'Query', checkScanStatus?: { __typename?: 'S3ProxyCallbackPayload', status?: ScanStatus | null, location?: string | null, fileId?: string | null, fullFilePath?: string | null, failureReason?: string | null } | null };

export type GetVideosQueryVariables = Exact<{
  filterInput?: InputMaybe<VideoFilterInput>;
}>;


export type GetVideosQuery = { __typename?: 'Query', getVideos?: { __typename?: 'PaginatedVideos', paging: { __typename?: 'PagingResponse', nextToken?: string | null, currentToken: string, totalCount: number }, data: Array<{ __typename?: 'Video', id: string, title?: string | null, description?: string | null, sessions?: Array<string | null> | null, exhibitors?: Array<string | null> | null, speakers?: Array<string | null> | null, sourceProvider?: SourceProvider | null, events?: Array<string | null> | null, duration?: number | null, status?: VideoStatus | null, tags?: Array<string | null> | null, created?: string | null, createdBy?: string | null, lastModified?: string | null, lastModifiedBy?: string | null, catalogs?: Array<{ __typename?: 'VideoCatalog', id?: string | null, videoCenters?: Array<string | null> | null, channel?: { __typename?: 'VideoChannel', id?: string | null, status?: ChannelStatus | null } | null, section?: { __typename?: 'VideoSection', id?: string | null } | null } | null> | null, thumbnail?: { __typename?: 'Thumbnail', url?: { __typename?: 'Url', href?: string | null } | null } | null, generatedThumbnail?: { __typename?: 'Thumbnail', url?: { __typename?: 'Url', href?: string | null } | null } | null, source?: { __typename?: 'VideoSource', id?: string | null, status?: VideoSourceStatus | null } | null } | null> } | null };


export const GetTotalViewsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getTotalViews"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AnalyticsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalViewsByHubId"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"perDay"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"perWeek"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"perMonth"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"serverError"}}]}}]}}]} as unknown as DocumentNode<GetTotalViewsQuery, GetTotalViewsQueryVariables>;
export const AverageViewDurationByHubIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"averageViewDurationByHubId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AnalyticsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"averageViewDurationByHubId"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"perDay"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"perWeek"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"perMonth"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"serverError"}}]}}]}}]} as unknown as DocumentNode<AverageViewDurationByHubIdQuery, AverageViewDurationByHubIdQueryVariables>;
export const TopFiveVideosViewedByHubIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"topFiveVideosViewedByHubId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AnalyticsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"topFiveVideosViewedByHubId"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"topVideos"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"videoId"}},{"kind":"Field","name":{"kind":"Name","value":"videoName"}},{"kind":"Field","name":{"kind":"Name","value":"totalViews"}},{"kind":"Field","name":{"kind":"Name","value":"currentPosition"}},{"kind":"Field","name":{"kind":"Name","value":"previousPosition"}}]}},{"kind":"Field","name":{"kind":"Name","value":"serverError"}}]}}]}}]} as unknown as DocumentNode<TopFiveVideosViewedByHubIdQuery, TopFiveVideosViewedByHubIdQueryVariables>;
export const GetRegistrationCountDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getRegistrationCount"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RegistrationCountRequest"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getRegistrationCount"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"perDay"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"perWeek"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"perMonth"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"serverError"}}]}}]}}]} as unknown as DocumentNode<GetRegistrationCountQuery, GetRegistrationCountQueryVariables>;
export const ViewsByDeviceTypeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"viewsByDeviceType"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AnalyticsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"viewsByDeviceType"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"desktopViews"}},{"kind":"Field","name":{"kind":"Name","value":"tabletViews"}},{"kind":"Field","name":{"kind":"Name","value":"mobileViews"}},{"kind":"Field","name":{"kind":"Name","value":"totalViews"}},{"kind":"Field","name":{"kind":"Name","value":"serverError"}}]}}]}}]} as unknown as DocumentNode<ViewsByDeviceTypeQuery, ViewsByDeviceTypeQueryVariables>;
export const VideosViewDetailsByHubIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"videosViewDetailsByHubId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AnalyticsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"videosViewDetailsByHubId"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"videoId"}},{"kind":"Field","name":{"kind":"Name","value":"videoTitle"}},{"kind":"Field","name":{"kind":"Name","value":"thumbnail"}},{"kind":"Field","name":{"kind":"Name","value":"views"}},{"kind":"Field","name":{"kind":"Name","value":"videoDuration"}}]}},{"kind":"Field","name":{"kind":"Name","value":"serverError"}}]}}]}}]} as unknown as DocumentNode<VideosViewDetailsByHubIdQuery, VideosViewDetailsByHubIdQueryVariables>;
export const MemberVideoWatchDurationByHubIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"memberVideoWatchDurationByHubId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MemberWatchInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"memberVideoWatchDurationByHubId"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}},{"kind":"Field","name":{"kind":"Name","value":"percentage"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}},{"kind":"Field","name":{"kind":"Name","value":"serverError"}}]}}]}}]} as unknown as DocumentNode<MemberVideoWatchDurationByHubIdQuery, MemberVideoWatchDurationByHubIdQueryVariables>;
export const GetAppFeaturesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getAppFeatures"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"appFeatures"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AppFeatureInput"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getAppFeatures"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"appFeatures"},"value":{"kind":"Variable","name":{"kind":"Name","value":"appFeatures"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"experimentVersion"}}]}}]}}]} as unknown as DocumentNode<GetAppFeaturesQuery, GetAppFeaturesQueryVariables>;
export const BannerAssociationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"bannerAssociations"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"bannerAssociationSearch"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"BannerAssociationSearch"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bannerAssociations"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"bannerAssociationSearch"},"value":{"kind":"Variable","name":{"kind":"Name","value":"bannerAssociationSearch"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"centerId"}},{"kind":"Field","name":{"kind":"Name","value":"entityType"}},{"kind":"Field","name":{"kind":"Name","value":"entityId"}},{"kind":"Field","name":{"kind":"Name","value":"displayOrder"}},{"kind":"Field","name":{"kind":"Name","value":"banner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"layout"}},{"kind":"Field","name":{"kind":"Name","value":"imageAlignment"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"imageAltText"}},{"kind":"Field","name":{"kind":"Name","value":"text"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"alignment"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}},{"kind":"Field","name":{"kind":"Name","value":"button"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"targetType"}},{"kind":"Field","name":{"kind":"Name","value":"internalTarget"}},{"kind":"Field","name":{"kind":"Name","value":"target"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"paging"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currentToken"}},{"kind":"Field","name":{"kind":"Name","value":"nextToken"}},{"kind":"Field","name":{"kind":"Name","value":"limit"}}]}}]}}]}}]} as unknown as DocumentNode<BannerAssociationsQuery, BannerAssociationsQueryVariables>;
export const BannersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"banners"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"bannerFilter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BannerFilter"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"banners"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"bannerFilter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"bannerFilter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"layout"}}]}},{"kind":"Field","name":{"kind":"Name","value":"paging"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currentToken"}},{"kind":"Field","name":{"kind":"Name","value":"nextToken"}},{"kind":"Field","name":{"kind":"Name","value":"limit"}}]}}]}}]}}]} as unknown as DocumentNode<BannersQuery, BannersQueryVariables>;
export const BannerDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"banner"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"bannersSearch"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BannersSearch"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"banner"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"bannersSearch"},"value":{"kind":"Variable","name":{"kind":"Name","value":"bannersSearch"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"centerId"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"layout"}},{"kind":"Field","name":{"kind":"Name","value":"imageAlignment"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"originalImageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"imageAltText"}},{"kind":"Field","name":{"kind":"Name","value":"text"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"alignment"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}},{"kind":"Field","name":{"kind":"Name","value":"button"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"targetType"}},{"kind":"Field","name":{"kind":"Name","value":"internalTarget"}},{"kind":"Field","name":{"kind":"Name","value":"target"}}]}}]}}]}}]} as unknown as DocumentNode<BannerQuery, BannerQueryVariables>;
export const HubPagesWithBannerDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"hubPagesWithBanner"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BannerHubSearch"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hubPagesWithBanner"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entityType"}},{"kind":"Field","name":{"kind":"Name","value":"entityId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<HubPagesWithBannerQuery, HubPagesWithBannerQueryVariables>;
export const HubPagesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"hubPages"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"HubSearch"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hubPages"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entityType"}},{"kind":"Field","name":{"kind":"Name","value":"entityId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<HubPagesQuery, HubPagesQueryVariables>;
export const BannerCreateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"bannerCreate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"NewBanner"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bannerCreate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<BannerCreateMutation, BannerCreateMutationVariables>;
export const BannerUpdateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"bannerUpdate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BannerUpdate"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bannerUpdate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"centerId"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"layout"}},{"kind":"Field","name":{"kind":"Name","value":"imageAlignment"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"originalImageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"imageAltText"}},{"kind":"Field","name":{"kind":"Name","value":"text"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"alignment"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}},{"kind":"Field","name":{"kind":"Name","value":"button"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"targetType"}},{"kind":"Field","name":{"kind":"Name","value":"internalTarget"}},{"kind":"Field","name":{"kind":"Name","value":"target"}}]}}]}}]}}]} as unknown as DocumentNode<BannerUpdateMutation, BannerUpdateMutationVariables>;
export const BannerDeleteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"bannerDelete"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"bannersSearch"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BannersSearch"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bannerDelete"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"bannersSearch"},"value":{"kind":"Variable","name":{"kind":"Name","value":"bannersSearch"}}}]}]}}]} as unknown as DocumentNode<BannerDeleteMutation, BannerDeleteMutationVariables>;
export const SetBannerAssociationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"setBannerAssociations"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BannerAssociationCreate"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"setBannerAssociations"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"centerId"}},{"kind":"Field","name":{"kind":"Name","value":"entityType"}},{"kind":"Field","name":{"kind":"Name","value":"entityId"}},{"kind":"Field","name":{"kind":"Name","value":"displayOrder"}},{"kind":"Field","name":{"kind":"Name","value":"banner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"paging"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currentToken"}},{"kind":"Field","name":{"kind":"Name","value":"nextToken"}},{"kind":"Field","name":{"kind":"Name","value":"limit"}}]}}]}}]}}]} as unknown as DocumentNode<SetBannerAssociationsMutation, SetBannerAssociationsMutationVariables>;
export const ChannelDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"channel"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"channelId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getChannelInformation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"channelId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"channelId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"catalogId"}},{"kind":"Field","name":{"kind":"Name","value":"image"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"filename"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"size"}},{"kind":"Field","name":{"kind":"Name","value":"imageId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]}}]} as unknown as DocumentNode<ChannelQuery, ChannelQueryVariables>;
export const GetPlannerPaginatedChannelsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getPlannerPaginatedChannels"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"hubId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filterInput"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"FilterInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getPlannerPaginatedChannels"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"hubId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"hubId"}}},{"kind":"Argument","name":{"kind":"Name","value":"filterInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filterInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"catalogId"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"videoCount"}},{"kind":"Field","name":{"kind":"Name","value":"order"}}]}},{"kind":"Field","name":{"kind":"Name","value":"paging"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currentToken"}},{"kind":"Field","name":{"kind":"Name","value":"nextToken"}},{"kind":"Field","name":{"kind":"Name","value":"limit"}}]}}]}}]}}]} as unknown as DocumentNode<GetPlannerPaginatedChannelsQuery, GetPlannerPaginatedChannelsQueryVariables>;
export const GetCatalogDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getCatalog"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"catalogId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getCatalog"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"catalogId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"catalogId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"catalogType"}},{"kind":"Field","name":{"kind":"Name","value":"sectionCount"}},{"kind":"Field","name":{"kind":"Name","value":"sections"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"videoCount"}},{"kind":"Field","name":{"kind":"Name","value":"sectionType"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"videos"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}},{"kind":"Field","name":{"kind":"Name","value":"thumbnail"}},{"kind":"Field","name":{"kind":"Name","value":"sessionId"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"videoId"}},{"kind":"Field","name":{"kind":"Name","value":"webcastId"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"events"}},{"kind":"Field","name":{"kind":"Name","value":"catalogOwner"}}]}}]}}]} as unknown as DocumentNode<GetCatalogQuery, GetCatalogQueryVariables>;
export const CreateChannelDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createChannel"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"hubId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"title"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"description"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"customDomain"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createChannel"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"hubId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"hubId"}}},{"kind":"Argument","name":{"kind":"Name","value":"title"},"value":{"kind":"Variable","name":{"kind":"Name","value":"title"}}},{"kind":"Argument","name":{"kind":"Name","value":"description"},"value":{"kind":"Variable","name":{"kind":"Name","value":"description"}}},{"kind":"Argument","name":{"kind":"Name","value":"customDomain"},"value":{"kind":"Variable","name":{"kind":"Name","value":"customDomain"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"catalogId"}}]}}]}}]} as unknown as DocumentNode<CreateChannelMutation, CreateChannelMutationVariables>;
export const DeleteChannelDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteChannel"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"channelId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteChannel"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"channelId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"channelId"}}}]}]}}]} as unknown as DocumentNode<DeleteChannelMutation, DeleteChannelMutationVariables>;
export const UploadChannelImageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"uploadChannelImage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"channelId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"imageInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ImageInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uploadChannelImage"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"channelId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"channelId"}}},{"kind":"Argument","name":{"kind":"Name","value":"imageInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"imageInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"imageId"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"filename"}},{"kind":"Field","name":{"kind":"Name","value":"size"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<UploadChannelImageMutation, UploadChannelImageMutationVariables>;
export const DeleteChannelImageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteChannelImage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"channelId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"imageId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteChannelImage"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"channelId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"channelId"}}},{"kind":"Argument","name":{"kind":"Name","value":"imageId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"imageId"}}}]}]}}]} as unknown as DocumentNode<DeleteChannelImageMutation, DeleteChannelImageMutationVariables>;
export const UpdateChannelDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateChannel"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"channelInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ChannelInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateChannel"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"channelInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"channelInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"catalogId"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}}]}}]}}]} as unknown as DocumentNode<UpdateChannelMutation, UpdateChannelMutationVariables>;
export const CreateCatalogDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createCatalog"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"channelId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"catalogInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CatalogInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createCatalog"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"channelId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"channelId"}}},{"kind":"Argument","name":{"kind":"Name","value":"catalogInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"catalogInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"catalogType"}},{"kind":"Field","name":{"kind":"Name","value":"sectionCount"}},{"kind":"Field","name":{"kind":"Name","value":"sections"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"videoCount"}},{"kind":"Field","name":{"kind":"Name","value":"sectionType"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"videos"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}},{"kind":"Field","name":{"kind":"Name","value":"thumbnail"}},{"kind":"Field","name":{"kind":"Name","value":"sessionId"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"videoId"}},{"kind":"Field","name":{"kind":"Name","value":"webcastId"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"events"}},{"kind":"Field","name":{"kind":"Name","value":"catalogOwner"}}]}}]}}]} as unknown as DocumentNode<CreateCatalogMutation, CreateCatalogMutationVariables>;
export const UpdateCatalogDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateCatalog"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"channelId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"catalogId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"catalogInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CatalogInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateCatalog"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"channelId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"channelId"}}},{"kind":"Argument","name":{"kind":"Name","value":"catalogId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"catalogId"}}},{"kind":"Argument","name":{"kind":"Name","value":"catalogInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"catalogInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"catalogType"}},{"kind":"Field","name":{"kind":"Name","value":"sectionCount"}},{"kind":"Field","name":{"kind":"Name","value":"sections"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"videoCount"}},{"kind":"Field","name":{"kind":"Name","value":"sectionType"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"videos"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}},{"kind":"Field","name":{"kind":"Name","value":"thumbnail"}},{"kind":"Field","name":{"kind":"Name","value":"sessionId"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"videoId"}},{"kind":"Field","name":{"kind":"Name","value":"webcastId"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"events"}},{"kind":"Field","name":{"kind":"Name","value":"catalogOwner"}}]}}]}}]} as unknown as DocumentNode<UpdateCatalogMutation, UpdateCatalogMutationVariables>;
export const UpdateChannelOrderDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateChannelOrder"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"hubId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"channelOrderInputList"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ChannelOrderInput"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateChannelOrder"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"hubId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"hubId"}}},{"kind":"Argument","name":{"kind":"Name","value":"channelOrderInputList"},"value":{"kind":"Variable","name":{"kind":"Name","value":"channelOrderInputList"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"order"}}]}}]}}]} as unknown as DocumentNode<UpdateChannelOrderMutation, UpdateChannelOrderMutationVariables>;
export const CreateChannelBannerAssociationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createChannelBannerAssociation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ChannelBannerInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createChannelBannerAssociation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"channel"}},{"kind":"Field","name":{"kind":"Name","value":"banner"}}]}}]}}]} as unknown as DocumentNode<CreateChannelBannerAssociationMutation, CreateChannelBannerAssociationMutationVariables>;
export const DeleteChannelBannerAssociationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteChannelBannerAssociation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ChannelBannerInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteChannelBannerAssociation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"channel"}},{"kind":"Field","name":{"kind":"Name","value":"banner"}}]}}]}}]} as unknown as DocumentNode<DeleteChannelBannerAssociationMutation, DeleteChannelBannerAssociationMutationVariables>;
export const GetContactDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getContact"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"contactId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getContact"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"contactId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"contactId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"bio"}},{"kind":"Field","name":{"kind":"Name","value":"pronoun"}},{"kind":"Field","name":{"kind":"Name","value":"designation"}},{"kind":"Field","name":{"kind":"Name","value":"company"}},{"kind":"Field","name":{"kind":"Name","value":"image"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"href"}}]}}]}}]}}]} as unknown as DocumentNode<GetContactQuery, GetContactQueryVariables>;
export const SearchContactsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"searchContacts"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ContactSearchInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"searchContacts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"paging"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currentToken"}},{"kind":"Field","name":{"kind":"Name","value":"limit"}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}},{"kind":"Field","name":{"kind":"Name","value":"nextToken"}}]}},{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]}}]} as unknown as DocumentNode<SearchContactsQuery, SearchContactsQueryVariables>;
export const SearchContactGroupsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"searchContactGroups"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ContactGroupSearchInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"searchContactGroups"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"paging"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currentToken"}},{"kind":"Field","name":{"kind":"Name","value":"limit"}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}},{"kind":"Field","name":{"kind":"Name","value":"nextToken"}}]}},{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<SearchContactGroupsQuery, SearchContactGroupsQueryVariables>;
export const SearchContactTypesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"searchContactTypes"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ContactSearchInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"searchContactTypes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"paging"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currentToken"}},{"kind":"Field","name":{"kind":"Name","value":"limit"}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}},{"kind":"Field","name":{"kind":"Name","value":"nextToken"}}]}},{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<SearchContactTypesQuery, SearchContactTypesQueryVariables>;
export const GetAllowedContactGroupsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getAllowedContactGroups"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GetAllowedContactGroupsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getAllowedContactGroups"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"contactGroups"}}]}}]}}]} as unknown as DocumentNode<GetAllowedContactGroupsQuery, GetAllowedContactGroupsQueryVariables>;
export const SaveContactGroupsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"saveContactGroups"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ContactGroupsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"saveContactGroups"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"contactGroups"}}]}}]}}]} as unknown as DocumentNode<SaveContactGroupsMutation, SaveContactGroupsMutationVariables>;
export const SaveContactTypesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"saveContactTypes"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"saveInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ContactTypesInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"deleteInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ContactTypesInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteContactTypes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"deleteInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteContactTypes"}}]}},{"kind":"Field","name":{"kind":"Name","value":"saveContactTypes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"saveInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"contactTypes"}}]}}]}}]} as unknown as DocumentNode<SaveContactTypesMutation, SaveContactTypesMutationVariables>;
export const GetAllowedContactTypesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getAllowedContactTypes"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GetAllowedContactTypesInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getAllowedContactTypes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"contactTypes"}}]}}]}}]} as unknown as DocumentNode<GetAllowedContactTypesQuery, GetAllowedContactTypesQueryVariables>;
export const SaveBlockedContactsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"saveBlockedContacts"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"saveInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BlockedContactsInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"deleteInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BlockedContactsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteBlockedContacts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"deleteInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}},{"kind":"Field","name":{"kind":"Name","value":"saveBlockedContacts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"saveInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"blockedContacts"}}]}}]}}]} as unknown as DocumentNode<SaveBlockedContactsMutation, SaveBlockedContactsMutationVariables>;
export const GetBlockedContactsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getBlockedContacts"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GetBlockedContactsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getBlockedContacts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"blockedContacts"}}]}}]}}]} as unknown as DocumentNode<GetBlockedContactsQuery, GetBlockedContactsQueryVariables>;
export const SaveBlockedContactGroupsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"saveBlockedContactGroups"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"saveInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BlockedContactGroupsInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"deleteInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BlockedContactGroupsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteBlockedContactGroups"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"deleteInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}},{"kind":"Field","name":{"kind":"Name","value":"saveBlockedContactGroups"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"saveInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"contactGroups"}}]}}]}}]} as unknown as DocumentNode<SaveBlockedContactGroupsMutation, SaveBlockedContactGroupsMutationVariables>;
export const GetBlockedContactGroupsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getBlockedContactGroups"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GetBlockedContactGroupsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getBlockedContactGroups"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"contactGroups"}}]}}]}}]} as unknown as DocumentNode<GetBlockedContactGroupsQuery, GetBlockedContactGroupsQueryVariables>;
export const GetAccountConfigDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAccountConfig"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountConfig"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"AccountFeatures"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"GeneralFeatures"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"AIWritingAssistantEnabled"}},{"kind":"Field","name":{"kind":"Name","value":"AllowCodeSnippets"}},{"kind":"Field","name":{"kind":"Name","value":"AllowCustomFonts"}},{"kind":"Field","name":{"kind":"Name","value":"AllowGoogleAnalytics"}},{"kind":"Field","name":{"kind":"Name","value":"AllowOAuth"}}]}},{"kind":"Field","name":{"kind":"Name","value":"Blades"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"AllowVideosBlade"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"VideoManagementFeatures"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"VideoCenterFlag"}},{"kind":"Field","name":{"kind":"Name","value":"VideoStorageSize"}}]}},{"kind":"Field","name":{"kind":"Name","value":"InternationalSettings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"DefaultLanguageId"}},{"kind":"Field","name":{"kind":"Name","value":"DefaultCultureCode"}}]}},{"kind":"Field","name":{"kind":"Name","value":"EventFeatures"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"GeneralFeatures"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"LicenseTypeId"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetAccountConfigQuery, GetAccountConfigQueryVariables>;
export const GetUserPermissionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUserPermissions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userPermissions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"VideoCenter"}},{"kind":"Field","name":{"kind":"Name","value":"VideoLibrary"}},{"kind":"Field","name":{"kind":"Name","value":"VideoStorage"}},{"kind":"Field","name":{"kind":"Name","value":"EventsPlusCustomHeader"}}]}}]}}]} as unknown as DocumentNode<GetUserPermissionsQuery, GetUserPermissionsQueryVariables>;
export const GetAccountLocaleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAccountLocale"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountLocale"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Locale"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Id"}},{"kind":"Field","name":{"kind":"Name","value":"LanguageName"}},{"kind":"Field","name":{"kind":"Name","value":"CountryLanguage"}},{"kind":"Field","name":{"kind":"Name","value":"CultureCode"}},{"kind":"Field","name":{"kind":"Name","value":"IsDefault"}},{"kind":"Field","name":{"kind":"Name","value":"AvailableCultures"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"LocaleId"}},{"kind":"Field","name":{"kind":"Name","value":"CultureCountryId"}},{"kind":"Field","name":{"kind":"Name","value":"IsDefaultCulture"}},{"kind":"Field","name":{"kind":"Name","value":"CultureCode"}}]}},{"kind":"Field","name":{"kind":"Name","value":"LocalizationFlag"}}]}},{"kind":"Field","name":{"kind":"Name","value":"IsDefault"}}]}}]}}]} as unknown as DocumentNode<GetAccountLocaleQuery, GetAccountLocaleQueryVariables>;
export const GetAccountDetailsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAccountDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"AccountId"}},{"kind":"Field","name":{"kind":"Name","value":"AccountName"}},{"kind":"Field","name":{"kind":"Name","value":"AccountStub"}},{"kind":"Field","name":{"kind":"Name","value":"AccountCompanyName"}}]}}]}}]} as unknown as DocumentNode<GetAccountDetailsQuery, GetAccountDetailsQueryVariables>;
export const GetUserDetailsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUserDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"company"}},{"kind":"Field","name":{"kind":"Name","value":"url"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"href"}}]}},{"kind":"Field","name":{"kind":"Name","value":"viewProfileText"}}]}}]}}]} as unknown as DocumentNode<GetUserDetailsQuery, GetUserDetailsQueryVariables>;
export const GetCustomDomainForHubDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getCustomDomainForHub"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"hubId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getCustomDomainForHub"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"hubId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"hubId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entityId"}},{"kind":"Field","name":{"kind":"Name","value":"customDomainId"}},{"kind":"Field","name":{"kind":"Name","value":"trailingName"}}]}}]}}]} as unknown as DocumentNode<GetCustomDomainForHubQuery, GetCustomDomainForHubQueryVariables>;
export const GetCustomDomainForAccountDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getCustomDomainForAccount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getCustomDomainForAccount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"customDomainId"}},{"kind":"Field","name":{"kind":"Name","value":"domainName"}}]}}]}}]} as unknown as DocumentNode<GetCustomDomainForAccountQuery, GetCustomDomainForAccountQueryVariables>;
export const CreateHubCustomDomainMappingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createHubCustomDomainMapping"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CustomDomainMappingInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createHubCustomDomainMapping"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entityId"}},{"kind":"Field","name":{"kind":"Name","value":"customDomainId"}},{"kind":"Field","name":{"kind":"Name","value":"trailingName"}}]}}]}}]} as unknown as DocumentNode<CreateHubCustomDomainMappingMutation, CreateHubCustomDomainMappingMutationVariables>;
export const UpdateHubCustomDomainMappingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateHubCustomDomainMapping"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CustomDomainMappingInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateHubCustomDomainMapping"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entityId"}},{"kind":"Field","name":{"kind":"Name","value":"customDomainId"}},{"kind":"Field","name":{"kind":"Name","value":"trailingName"}}]}}]}}]} as unknown as DocumentNode<UpdateHubCustomDomainMappingMutation, UpdateHubCustomDomainMappingMutationVariables>;
export const DeleteHubCustomDomainMappingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteHubCustomDomainMapping"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"hubId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteHubCustomDomainMapping"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"hubId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"hubId"}}}]}]}}]} as unknown as DocumentNode<DeleteHubCustomDomainMappingMutation, DeleteHubCustomDomainMappingMutationVariables>;
export const FileImportHistoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"fileImportHistory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"hubId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"fileImportHistoryInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"FileImportHistoryInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fileImportHistory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"hubId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"hubId"}}},{"kind":"Argument","name":{"kind":"Name","value":"fileImportHistoryInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"fileImportHistoryInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"successCount"}},{"kind":"Field","name":{"kind":"Name","value":"errorCount"}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"fileName"}},{"kind":"Field","name":{"kind":"Name","value":"accountId"}},{"kind":"Field","name":{"kind":"Name","value":"locale"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]} as unknown as DocumentNode<FileImportHistoryQuery, FileImportHistoryQueryVariables>;
export const GetPageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getPage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"HubSearch"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getPage"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"page"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pageId"}},{"kind":"Field","name":{"kind":"Name","value":"videoCenterId"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"sectionIds"}}]}},{"kind":"Field","name":{"kind":"Name","value":"sections"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sectionId"}},{"kind":"Field","name":{"kind":"Name","value":"originPageId"}},{"kind":"Field","name":{"kind":"Name","value":"pageSectionTemplate"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"visibleFields"}},{"kind":"Field","name":{"kind":"Name","value":"contentLimitOnInitialLoad"}},{"kind":"Field","name":{"kind":"Name","value":"featuredContentType"}},{"kind":"Field","name":{"kind":"Name","value":"featuredContentTypeId"}},{"kind":"Field","name":{"kind":"Name","value":"contentType"}},{"kind":"Field","name":{"kind":"Name","value":"contentIds"}},{"kind":"Field","name":{"kind":"Name","value":"contentFilterType"}},{"kind":"Field","name":{"kind":"Name","value":"contentFilterDateAbstract"}},{"kind":"Field","name":{"kind":"Name","value":"alignment"}},{"kind":"Field","name":{"kind":"Name","value":"layout"}},{"kind":"Field","name":{"kind":"Name","value":"textBody"}},{"kind":"Field","name":{"kind":"Name","value":"textColor"}},{"kind":"Field","name":{"kind":"Name","value":"buttonEnabled"}},{"kind":"Field","name":{"kind":"Name","value":"buttonText"}},{"kind":"Field","name":{"kind":"Name","value":"buttonExternalTarget"}},{"kind":"Field","name":{"kind":"Name","value":"buttonInternalTarget"}},{"kind":"Field","name":{"kind":"Name","value":"buttonTargetType"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"originalImageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"imageAltText"}}]}}]}}]}}]} as unknown as DocumentNode<GetPageQuery, GetPageQueryVariables>;
export const CreatePageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createPage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PageInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"newSection"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PageSectionInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createPage"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"newSection"},"value":{"kind":"Variable","name":{"kind":"Name","value":"newSection"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"page"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pageId"}},{"kind":"Field","name":{"kind":"Name","value":"videoCenterId"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"sectionIds"}}]}},{"kind":"Field","name":{"kind":"Name","value":"newSection"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sectionId"}},{"kind":"Field","name":{"kind":"Name","value":"originPageId"}},{"kind":"Field","name":{"kind":"Name","value":"pageSectionTemplate"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"visibleFields"}},{"kind":"Field","name":{"kind":"Name","value":"contentLimitOnInitialLoad"}},{"kind":"Field","name":{"kind":"Name","value":"featuredContentType"}},{"kind":"Field","name":{"kind":"Name","value":"featuredContentTypeId"}},{"kind":"Field","name":{"kind":"Name","value":"contentType"}},{"kind":"Field","name":{"kind":"Name","value":"contentIds"}},{"kind":"Field","name":{"kind":"Name","value":"contentFilterType"}},{"kind":"Field","name":{"kind":"Name","value":"contentFilterDateAbstract"}},{"kind":"Field","name":{"kind":"Name","value":"alignment"}},{"kind":"Field","name":{"kind":"Name","value":"layout"}},{"kind":"Field","name":{"kind":"Name","value":"textBody"}},{"kind":"Field","name":{"kind":"Name","value":"textColor"}},{"kind":"Field","name":{"kind":"Name","value":"buttonEnabled"}},{"kind":"Field","name":{"kind":"Name","value":"buttonText"}},{"kind":"Field","name":{"kind":"Name","value":"buttonExternalTarget"}},{"kind":"Field","name":{"kind":"Name","value":"buttonInternalTarget"}},{"kind":"Field","name":{"kind":"Name","value":"buttonTargetType"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"originalImageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"imageAltText"}}]}}]}}]}}]} as unknown as DocumentNode<CreatePageMutation, CreatePageMutationVariables>;
export const UpdatePageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updatePage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PageInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updatePage"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pageId"}},{"kind":"Field","name":{"kind":"Name","value":"videoCenterId"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"sectionIds"}}]}}]}}]} as unknown as DocumentNode<UpdatePageMutation, UpdatePageMutationVariables>;
export const CreateSectionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createSection"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PageSectionInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"HubSearch"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createSection"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}},{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sectionId"}},{"kind":"Field","name":{"kind":"Name","value":"originPageId"}},{"kind":"Field","name":{"kind":"Name","value":"pageSectionTemplate"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"visibleFields"}},{"kind":"Field","name":{"kind":"Name","value":"contentLimitOnInitialLoad"}},{"kind":"Field","name":{"kind":"Name","value":"featuredContentType"}},{"kind":"Field","name":{"kind":"Name","value":"featuredContentTypeId"}},{"kind":"Field","name":{"kind":"Name","value":"contentType"}},{"kind":"Field","name":{"kind":"Name","value":"contentIds"}},{"kind":"Field","name":{"kind":"Name","value":"contentFilterType"}},{"kind":"Field","name":{"kind":"Name","value":"contentFilterDateAbstract"}},{"kind":"Field","name":{"kind":"Name","value":"alignment"}},{"kind":"Field","name":{"kind":"Name","value":"layout"}},{"kind":"Field","name":{"kind":"Name","value":"textBody"}},{"kind":"Field","name":{"kind":"Name","value":"textColor"}},{"kind":"Field","name":{"kind":"Name","value":"buttonEnabled"}},{"kind":"Field","name":{"kind":"Name","value":"buttonText"}},{"kind":"Field","name":{"kind":"Name","value":"buttonExternalTarget"}},{"kind":"Field","name":{"kind":"Name","value":"buttonInternalTarget"}},{"kind":"Field","name":{"kind":"Name","value":"buttonTargetType"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"originalImageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"imageAltText"}}]}}]}}]} as unknown as DocumentNode<CreateSectionMutation, CreateSectionMutationVariables>;
export const UpdateSectionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateSection"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PageSectionInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"HubSearch"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateSection"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}},{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sectionId"}},{"kind":"Field","name":{"kind":"Name","value":"originPageId"}},{"kind":"Field","name":{"kind":"Name","value":"pageSectionTemplate"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"visibleFields"}},{"kind":"Field","name":{"kind":"Name","value":"contentLimitOnInitialLoad"}},{"kind":"Field","name":{"kind":"Name","value":"featuredContentType"}},{"kind":"Field","name":{"kind":"Name","value":"featuredContentTypeId"}},{"kind":"Field","name":{"kind":"Name","value":"contentType"}},{"kind":"Field","name":{"kind":"Name","value":"contentIds"}},{"kind":"Field","name":{"kind":"Name","value":"contentFilterType"}},{"kind":"Field","name":{"kind":"Name","value":"contentFilterDateAbstract"}},{"kind":"Field","name":{"kind":"Name","value":"alignment"}},{"kind":"Field","name":{"kind":"Name","value":"layout"}},{"kind":"Field","name":{"kind":"Name","value":"textBody"}},{"kind":"Field","name":{"kind":"Name","value":"textColor"}},{"kind":"Field","name":{"kind":"Name","value":"buttonEnabled"}},{"kind":"Field","name":{"kind":"Name","value":"buttonText"}},{"kind":"Field","name":{"kind":"Name","value":"buttonExternalTarget"}},{"kind":"Field","name":{"kind":"Name","value":"buttonInternalTarget"}},{"kind":"Field","name":{"kind":"Name","value":"buttonTargetType"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"originalImageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"imageAltText"}}]}}]}}]} as unknown as DocumentNode<UpdateSectionMutation, UpdateSectionMutationVariables>;
export const GetPublishedPageOrDefaultsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getPublishedPageOrDefaults"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"HubSearch"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getPublishedPageOrDefaults"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"page"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pageId"}},{"kind":"Field","name":{"kind":"Name","value":"videoCenterId"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"sectionIds"}}]}},{"kind":"Field","name":{"kind":"Name","value":"sections"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sectionId"}},{"kind":"Field","name":{"kind":"Name","value":"originPageId"}},{"kind":"Field","name":{"kind":"Name","value":"pageSectionTemplate"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"visibleFields"}},{"kind":"Field","name":{"kind":"Name","value":"contentLimitOnInitialLoad"}},{"kind":"Field","name":{"kind":"Name","value":"featuredContentType"}},{"kind":"Field","name":{"kind":"Name","value":"featuredContentTypeId"}},{"kind":"Field","name":{"kind":"Name","value":"contentType"}},{"kind":"Field","name":{"kind":"Name","value":"contentIds"}},{"kind":"Field","name":{"kind":"Name","value":"contentFilterType"}},{"kind":"Field","name":{"kind":"Name","value":"contentFilterDateAbstract"}},{"kind":"Field","name":{"kind":"Name","value":"alignment"}},{"kind":"Field","name":{"kind":"Name","value":"layout"}},{"kind":"Field","name":{"kind":"Name","value":"textBody"}},{"kind":"Field","name":{"kind":"Name","value":"textColor"}},{"kind":"Field","name":{"kind":"Name","value":"buttonEnabled"}},{"kind":"Field","name":{"kind":"Name","value":"buttonText"}},{"kind":"Field","name":{"kind":"Name","value":"buttonExternalTarget"}},{"kind":"Field","name":{"kind":"Name","value":"buttonInternalTarget"}},{"kind":"Field","name":{"kind":"Name","value":"buttonTargetType"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"originalImageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"imageAltText"}}]}}]}}]}}]} as unknown as DocumentNode<GetPublishedPageOrDefaultsQuery, GetPublishedPageOrDefaultsQueryVariables>;
export const GetHubSettingsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getHubSettings"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"HubSearch"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getHubSettings"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"allowTurnOffGoogleAnalytics"}},{"kind":"Field","name":{"kind":"Name","value":"displayCventPrivacyPolicy"}},{"kind":"Field","name":{"kind":"Name","value":"cventPrivacyPolicyLinkText"}},{"kind":"Field","name":{"kind":"Name","value":"displayPrivacyPolicy"}},{"kind":"Field","name":{"kind":"Name","value":"privacyPolicyUrl"}},{"kind":"Field","name":{"kind":"Name","value":"privacyPolicyLinkText"}},{"kind":"Field","name":{"kind":"Name","value":"displayTermsLinkOnFooter"}},{"kind":"Field","name":{"kind":"Name","value":"termsLinkText"}},{"kind":"Field","name":{"kind":"Name","value":"displayTermsOnLogin"}},{"kind":"Field","name":{"kind":"Name","value":"termsText"}},{"kind":"Field","name":{"kind":"Name","value":"notifyUsersAboutCookie"}},{"kind":"Field","name":{"kind":"Name","value":"displayCventPrivacyPolicyInCookie"}},{"kind":"Field","name":{"kind":"Name","value":"allowTurnOffCookies"}},{"kind":"Field","name":{"kind":"Name","value":"ccpaEnableDoNotSell"}},{"kind":"Field","name":{"kind":"Name","value":"ccpaLinkText"}},{"kind":"Field","name":{"kind":"Name","value":"ccpaSubmitButtonText"}},{"kind":"Field","name":{"kind":"Name","value":"ccpaConfirmationText"}},{"kind":"Field","name":{"kind":"Name","value":"ccpaDoNotSellUrlEnabled"}},{"kind":"Field","name":{"kind":"Name","value":"ccpaDoNotSellUrl"}},{"kind":"Field","name":{"kind":"Name","value":"ccpaLinkExplanationText"}},{"kind":"Field","name":{"kind":"Name","value":"memberProfilePublic"}},{"kind":"Field","name":{"kind":"Name","value":"guestVisibility"}},{"kind":"Field","name":{"kind":"Name","value":"registrationSettings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"allowAllContactsRegistration"}},{"kind":"Field","name":{"kind":"Name","value":"allowContactGroupsRegistration"}},{"kind":"Field","name":{"kind":"Name","value":"allowContactTypesRegistration"}},{"kind":"Field","name":{"kind":"Name","value":"blockContactsRegistration"}},{"kind":"Field","name":{"kind":"Name","value":"blockListRegistration"}}]}},{"kind":"Field","name":{"kind":"Name","value":"profileCard"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"border"}},{"kind":"Field","name":{"kind":"Name","value":"branding"}},{"kind":"Field","name":{"kind":"Name","value":"alignment"}},{"kind":"Field","name":{"kind":"Name","value":"showName"}},{"kind":"Field","name":{"kind":"Name","value":"allowNameEdit"}},{"kind":"Field","name":{"kind":"Name","value":"showJobTitle"}},{"kind":"Field","name":{"kind":"Name","value":"allowJobTitleEdit"}},{"kind":"Field","name":{"kind":"Name","value":"showCompany"}},{"kind":"Field","name":{"kind":"Name","value":"allowCompanyEdit"}},{"kind":"Field","name":{"kind":"Name","value":"showHeadline"}},{"kind":"Field","name":{"kind":"Name","value":"allowHeadlineEdit"}},{"kind":"Field","name":{"kind":"Name","value":"showSocialMediaLinks"}},{"kind":"Field","name":{"kind":"Name","value":"allowSocialMediaEdit"}},{"kind":"Field","name":{"kind":"Name","value":"showPronouns"}},{"kind":"Field","name":{"kind":"Name","value":"allowPronounsEdit"}}]}},{"kind":"Field","name":{"kind":"Name","value":"cookieLists"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"enableCvent"}},{"kind":"Field","name":{"kind":"Name","value":"cventUrl"}},{"kind":"Field","name":{"kind":"Name","value":"enableCustom"}},{"kind":"Field","name":{"kind":"Name","value":"customUrl"}},{"kind":"Field","name":{"kind":"Name","value":"customLinkText"}}]}},{"kind":"Field","name":{"kind":"Name","value":"allowLimitedViewsBeforeLogin"}},{"kind":"Field","name":{"kind":"Name","value":"allowLimitedViewsBeforeLoginCount"}},{"kind":"Field","name":{"kind":"Name","value":"registrationSettings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"allowAllContactsRegistration"}},{"kind":"Field","name":{"kind":"Name","value":"allowContactGroupsRegistration"}},{"kind":"Field","name":{"kind":"Name","value":"allowContactTypesRegistration"}},{"kind":"Field","name":{"kind":"Name","value":"blockContactsRegistration"}},{"kind":"Field","name":{"kind":"Name","value":"blockListRegistration"}},{"kind":"Field","name":{"kind":"Name","value":"allowedEmailDomain"}}]}},{"kind":"Field","name":{"kind":"Name","value":"showLogo"}},{"kind":"Field","name":{"kind":"Name","value":"registrationBackground"}},{"kind":"Field","name":{"kind":"Name","value":"allowHubSearchEngineIndexing"}},{"kind":"Field","name":{"kind":"Name","value":"decorativeImage"}}]}}]}}]} as unknown as DocumentNode<GetHubSettingsQuery, GetHubSettingsQueryVariables>;
export const HubDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"hub"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"hubID"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"HubSearch"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hub"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"hubID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"config"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"ownerFirstName"}},{"kind":"Field","name":{"kind":"Name","value":"ownerLastName"}},{"kind":"Field","name":{"kind":"Name","value":"ownerEmail"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"locale"}},{"kind":"Field","name":{"kind":"Name","value":"accountMappingId"}},{"kind":"Field","name":{"kind":"Name","value":"helpEmailAddress"}},{"kind":"Field","name":{"kind":"Name","value":"utmOverride"}},{"kind":"Field","name":{"kind":"Name","value":"autoDetectBrowserLocale"}},{"kind":"Field","name":{"kind":"Name","value":"customDomain"}},{"kind":"Field","name":{"kind":"Name","value":"loginType"}},{"kind":"Field","name":{"kind":"Name","value":"organizationId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"theme"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"actionColor"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundColor"}},{"kind":"Field","name":{"kind":"Name","value":"logoImageRelativePath"}},{"kind":"Field","name":{"kind":"Name","value":"logoImageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"logoOriginalImageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"logoAltText"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundImageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundOriginalImageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundImageAltText"}},{"kind":"Field","name":{"kind":"Name","value":"mainColor"}},{"kind":"Field","name":{"kind":"Name","value":"moodColor"}},{"kind":"Field","name":{"kind":"Name","value":"safeMode"}},{"kind":"Field","name":{"kind":"Name","value":"faviconUrl"}},{"kind":"Field","name":{"kind":"Name","value":"headingsFont"}},{"kind":"Field","name":{"kind":"Name","value":"bodyFont"}}]}},{"kind":"Field","name":{"kind":"Name","value":"calendar"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<HubQuery, HubQueryVariables>;
export const GetCenterFeaturesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getCenterFeatures"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"HubSearch"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getCenterFeatures"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}}]}}]}}]} as unknown as DocumentNode<GetCenterFeaturesQuery, GetCenterFeaturesQueryVariables>;
export const GetHubCustomizationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getHubCustomizations"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"HubSearch"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getHubCustomizations"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"headerHtml"}},{"kind":"Field","name":{"kind":"Name","value":"headerCss"}},{"kind":"Field","name":{"kind":"Name","value":"headerJavascript"}},{"kind":"Field","name":{"kind":"Name","value":"showCustomHeader"}},{"kind":"Field","name":{"kind":"Name","value":"showLogo"}},{"kind":"Field","name":{"kind":"Name","value":"showLogin"}},{"kind":"Field","name":{"kind":"Name","value":"showHomePage"}},{"kind":"Field","name":{"kind":"Name","value":"showUpcomingEvents"}},{"kind":"Field","name":{"kind":"Name","value":"showChannels"}},{"kind":"Field","name":{"kind":"Name","value":"showVideos"}},{"kind":"Field","name":{"kind":"Name","value":"showNavigation"}},{"kind":"Field","name":{"kind":"Name","value":"navigationAlignment"}},{"kind":"Field","name":{"kind":"Name","value":"navigationLinkTextSize"}},{"kind":"Field","name":{"kind":"Name","value":"navigationLinkHighlightStyle"}},{"kind":"Field","name":{"kind":"Name","value":"navigationHeaderLeftPadding"}},{"kind":"Field","name":{"kind":"Name","value":"navigationHeaderRightPadding"}},{"kind":"Field","name":{"kind":"Name","value":"navigationHeaderMaxWidth"}},{"kind":"Field","name":{"kind":"Name","value":"defaultLandingPage"}}]}}]}}]} as unknown as DocumentNode<GetHubCustomizationsQuery, GetHubCustomizationsQueryVariables>;
export const UpsertHubCustomizationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"upsertHubCustomizations"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"HubSearch"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CustomizationsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"upsertHubCustomizations"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"headerHtml"}},{"kind":"Field","name":{"kind":"Name","value":"headerCss"}},{"kind":"Field","name":{"kind":"Name","value":"headerJavascript"}},{"kind":"Field","name":{"kind":"Name","value":"showCustomHeader"}},{"kind":"Field","name":{"kind":"Name","value":"showLogo"}},{"kind":"Field","name":{"kind":"Name","value":"showLogin"}},{"kind":"Field","name":{"kind":"Name","value":"showHomePage"}},{"kind":"Field","name":{"kind":"Name","value":"showUpcomingEvents"}},{"kind":"Field","name":{"kind":"Name","value":"showChannels"}},{"kind":"Field","name":{"kind":"Name","value":"showVideos"}},{"kind":"Field","name":{"kind":"Name","value":"showNavigation"}},{"kind":"Field","name":{"kind":"Name","value":"navigationAlignment"}},{"kind":"Field","name":{"kind":"Name","value":"navigationLinkTextSize"}},{"kind":"Field","name":{"kind":"Name","value":"navigationLinkHighlightStyle"}},{"kind":"Field","name":{"kind":"Name","value":"navigationHeaderLeftPadding"}},{"kind":"Field","name":{"kind":"Name","value":"navigationHeaderRightPadding"}},{"kind":"Field","name":{"kind":"Name","value":"navigationHeaderMaxWidth"}},{"kind":"Field","name":{"kind":"Name","value":"defaultLandingPage"}}]}}]}}]} as unknown as DocumentNode<UpsertHubCustomizationsMutation, UpsertHubCustomizationsMutationVariables>;
export const GetHubLocalesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getHubLocales"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"HubSearch"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getHubLocales"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"locale"}},{"kind":"Field","name":{"kind":"Name","value":"default"}},{"kind":"Field","name":{"kind":"Name","value":"customized"}},{"kind":"Field","name":{"kind":"Name","value":"translationStatus"}},{"kind":"Field","name":{"kind":"Name","value":"lastModified"}},{"kind":"Field","name":{"kind":"Name","value":"lastModifiedBy"}}]}}]}}]}}]} as unknown as DocumentNode<GetHubLocalesQuery, GetHubLocalesQueryVariables>;
export const AddHubLocalesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"addHubLocales"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"hubLocales"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"HubLocales"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"HubSearch"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addHubLocales"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"hubLocales"}}},{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"locale"}},{"kind":"Field","name":{"kind":"Name","value":"default"}}]}}]}}]}}]} as unknown as DocumentNode<AddHubLocalesMutation, AddHubLocalesMutationVariables>;
export const HubsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"hubs"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Hubs"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hubs"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"config"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"ownerFirstName"}},{"kind":"Field","name":{"kind":"Name","value":"ownerLastName"}},{"kind":"Field","name":{"kind":"Name","value":"ownerEmail"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"locale"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"paging"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currentToken"}},{"kind":"Field","name":{"kind":"Name","value":"nextToken"}},{"kind":"Field","name":{"kind":"Name","value":"limit"}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}}]}}]}}]}}]} as unknown as DocumentNode<HubsQuery, HubsQueryVariables>;
export const GetVideoHubTitleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getVideoHubTitle"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"hubID"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"HubSearch"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hub"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"hubID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"config"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}}]}}]} as unknown as DocumentNode<GetVideoHubTitleQuery, GetVideoHubTitleQueryVariables>;
export const GetHubTermsEditPermissionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getHubTermsEditPermission"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"HubSearch"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getHubTermsEditPermission"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<GetHubTermsEditPermissionQuery, GetHubTermsEditPermissionQueryVariables>;
export const GetRegistrationFormSettingsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getRegistrationFormSettings"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RegistrationFormSettingInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getRegistrationFormSettings"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"included"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"required"}}]}}]}}]}}]} as unknown as DocumentNode<GetRegistrationFormSettingsQuery, GetRegistrationFormSettingsQueryVariables>;
export const GetHubCodeSnippetsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getHubCodeSnippets"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"hubId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getHubCodeSnippets"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"hubId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"hubId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"codeSnippetId"}},{"kind":"Field","name":{"kind":"Name","value":"applicableOn"}},{"kind":"Field","name":{"kind":"Name","value":"targetWebPages"}}]}}]}}]} as unknown as DocumentNode<GetHubCodeSnippetsQuery, GetHubCodeSnippetsQueryVariables>;
export const GetCustomDomainsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getCustomDomains"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"hubId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getCustomDomainForHub"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"hubId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"hubId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entityId"}},{"kind":"Field","name":{"kind":"Name","value":"customDomainId"}},{"kind":"Field","name":{"kind":"Name","value":"trailingName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"getCustomDomainForAccount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"customDomainId"}},{"kind":"Field","name":{"kind":"Name","value":"domainName"}}]}}]}}]} as unknown as DocumentNode<GetCustomDomainsQuery, GetCustomDomainsQueryVariables>;
export const GetAccountAndCustomFontInformationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getAccountAndCustomFontInformation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getAccountSnapshot"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"customFonts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fontFamily"}},{"kind":"Field","name":{"kind":"Name","value":"fallbackFontId"}},{"kind":"Field","name":{"kind":"Name","value":"fallbackFont"}},{"kind":"Field","name":{"kind":"Name","value":"files"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"fontStyle"}},{"kind":"Field","name":{"kind":"Name","value":"fontWeight"}}]}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"accountConfig"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"AccountFeatures"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"GeneralFeatures"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"AllowCustomFonts"}},{"kind":"Field","name":{"kind":"Name","value":"AllowCodeSnippets"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetAccountAndCustomFontInformationQuery, GetAccountAndCustomFontInformationQueryVariables>;
export const GetUtmOverridesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getUtmOverrides"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"HubSearch"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getUtmOverrides"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]} as unknown as DocumentNode<GetUtmOverridesQuery, GetUtmOverridesQueryVariables>;
export const HubCreateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"hubCreate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"hubUpdate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"HubCreate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hubCreate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"hubUpdate"}}}]}]}}]} as unknown as DocumentNode<HubCreateMutation, HubCreateMutationVariables>;
export const HubUpdateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"hubUpdate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"HubUpdate"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hubUpdate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<HubUpdateMutation, HubUpdateMutationVariables>;
export const HubDeleteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"hubDelete"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"HubSearch"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hubDelete"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<HubDeleteMutation, HubDeleteMutationVariables>;
export const DeleteTokenDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteToken"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"HubSearch"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteToken"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<DeleteTokenMutation, DeleteTokenMutationVariables>;
export const HubDraftDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"hubDraft"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"HubSearch"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hubDraft"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<HubDraftMutation, HubDraftMutationVariables>;
export const HubPublishDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"hubPublish"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"HubSearch"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hubPublish"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<HubPublishMutation, HubPublishMutationVariables>;
export const HubUpdateSettingsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"hubUpdateSettings"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"HubUpdateSettings"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hubUpdateSettings"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"allowTurnOffGoogleAnalytics"}},{"kind":"Field","name":{"kind":"Name","value":"displayPrivacyPolicy"}},{"kind":"Field","name":{"kind":"Name","value":"privacyPolicyUrl"}},{"kind":"Field","name":{"kind":"Name","value":"displayCventPrivacyPolicy"}},{"kind":"Field","name":{"kind":"Name","value":"cventPrivacyPolicyLinkText"}},{"kind":"Field","name":{"kind":"Name","value":"privacyPolicyLinkText"}},{"kind":"Field","name":{"kind":"Name","value":"ccpaLinkText"}},{"kind":"Field","name":{"kind":"Name","value":"ccpaSubmitButtonText"}},{"kind":"Field","name":{"kind":"Name","value":"ccpaDoNotSellUrlEnabled"}},{"kind":"Field","name":{"kind":"Name","value":"ccpaConfirmationText"}},{"kind":"Field","name":{"kind":"Name","value":"ccpaDoNotSellUrl"}},{"kind":"Field","name":{"kind":"Name","value":"ccpaLinkExplanationText"}},{"kind":"Field","name":{"kind":"Name","value":"allowTurnOffCookies"}},{"kind":"Field","name":{"kind":"Name","value":"termsText"}},{"kind":"Field","name":{"kind":"Name","value":"termsLinkText"}},{"kind":"Field","name":{"kind":"Name","value":"displayTermsOnLogin"}},{"kind":"Field","name":{"kind":"Name","value":"ccpaEnableDoNotSell"}},{"kind":"Field","name":{"kind":"Name","value":"notifyUsersAboutCookie"}},{"kind":"Field","name":{"kind":"Name","value":"displayTermsLinkOnFooter"}},{"kind":"Field","name":{"kind":"Name","value":"displayCventPrivacyPolicyInCookie"}},{"kind":"Field","name":{"kind":"Name","value":"memberProfilePublic"}},{"kind":"Field","name":{"kind":"Name","value":"profileCard"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"showName"}},{"kind":"Field","name":{"kind":"Name","value":"allowNameEdit"}},{"kind":"Field","name":{"kind":"Name","value":"showJobTitle"}},{"kind":"Field","name":{"kind":"Name","value":"allowJobTitleEdit"}},{"kind":"Field","name":{"kind":"Name","value":"showCompany"}},{"kind":"Field","name":{"kind":"Name","value":"allowCompanyEdit"}},{"kind":"Field","name":{"kind":"Name","value":"showHeadline"}},{"kind":"Field","name":{"kind":"Name","value":"allowHeadlineEdit"}},{"kind":"Field","name":{"kind":"Name","value":"showSocialMediaLinks"}},{"kind":"Field","name":{"kind":"Name","value":"allowSocialMediaEdit"}}]}},{"kind":"Field","name":{"kind":"Name","value":"cookieLists"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"enableCvent"}},{"kind":"Field","name":{"kind":"Name","value":"cventUrl"}},{"kind":"Field","name":{"kind":"Name","value":"enableCustom"}},{"kind":"Field","name":{"kind":"Name","value":"customUrl"}},{"kind":"Field","name":{"kind":"Name","value":"customLinkText"}}]}},{"kind":"Field","name":{"kind":"Name","value":"guestVisibility"}},{"kind":"Field","name":{"kind":"Name","value":"allowLimitedViewsBeforeLogin"}},{"kind":"Field","name":{"kind":"Name","value":"allowLimitedViewsBeforeLoginCount"}},{"kind":"Field","name":{"kind":"Name","value":"registrationSettings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"allowAllContactsRegistration"}},{"kind":"Field","name":{"kind":"Name","value":"allowContactGroupsRegistration"}},{"kind":"Field","name":{"kind":"Name","value":"allowContactTypesRegistration"}},{"kind":"Field","name":{"kind":"Name","value":"blockContactsRegistration"}},{"kind":"Field","name":{"kind":"Name","value":"blockListRegistration"}},{"kind":"Field","name":{"kind":"Name","value":"allowedEmailDomain"}}]}},{"kind":"Field","name":{"kind":"Name","value":"showLogo"}},{"kind":"Field","name":{"kind":"Name","value":"registrationBackground"}},{"kind":"Field","name":{"kind":"Name","value":"allowHubSearchEngineIndexing"}},{"kind":"Field","name":{"kind":"Name","value":"decorativeImage"}}]}}]}}]} as unknown as DocumentNode<HubUpdateSettingsMutation, HubUpdateSettingsMutationVariables>;
export const UpdateCenterFeatureDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateCenterFeature"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"FeatureInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateCenterFeature"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}}]}}]}}]} as unknown as DocumentNode<UpdateCenterFeatureMutation, UpdateCenterFeatureMutationVariables>;
export const UpdateBrandingImagesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateBrandingImages"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BrandingImagesInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateBrandingImages"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"theme"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"logoImageRelativePath"}},{"kind":"Field","name":{"kind":"Name","value":"logoImageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"logoOriginalImageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"logoAltText"}},{"kind":"Field","name":{"kind":"Name","value":"faviconUrl"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateBrandingImagesMutation, UpdateBrandingImagesMutationVariables>;
export const SetUtmOverridesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"setUtmOverrides"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"HubSearch"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UtmOverrideInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"setUtmOverrides"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}},{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]} as unknown as DocumentNode<SetUtmOverridesMutation, SetUtmOverridesMutationVariables>;
export const UpdateRegistrationFormSettingsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateRegistrationFormSettings"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"updateRegistrationFormSettingInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateRegistrationFormSettings"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"required"}},{"kind":"Field","name":{"kind":"Name","value":"included"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateRegistrationFormSettingsMutation, UpdateRegistrationFormSettingsMutationVariables>;
export const UpdateBackgroundImagesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateBackgroundImages"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BackgroundImagesInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateBackgroundImages"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"theme"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"backgroundImageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundOriginalImageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundImageAltText"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateBackgroundImagesMutation, UpdateBackgroundImagesMutationVariables>;
export const GetTranslationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getTranslations"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TranslationSearch"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getTranslations"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"paging"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"limit"}},{"kind":"Field","name":{"kind":"Name","value":"currentToken"}},{"kind":"Field","name":{"kind":"Name","value":"nextToken"}},{"kind":"Field","name":{"kind":"Name","value":"previousToken"}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}}]}},{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"locale"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"translatedValue"}},{"kind":"Field","name":{"kind":"Name","value":"defaultValue"}}]}}]}}]}}]} as unknown as DocumentNode<GetTranslationsQuery, GetTranslationsQueryVariables>;
export const SetTranslationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"setTranslations"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"HubSearch"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"locale"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TranslationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"setTranslations"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}},{"kind":"Argument","name":{"kind":"Name","value":"locale"},"value":{"kind":"Variable","name":{"kind":"Name","value":"locale"}}},{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Failure"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"locale"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"translatedValue"}}]}},{"kind":"Field","name":{"kind":"Name","value":"Success"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"locale"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"translatedValue"}}]}}]}}]}}]} as unknown as DocumentNode<SetTranslationsMutation, SetTranslationsMutationVariables>;
export const ResetTranslationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"resetTranslations"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ResetTranslationSearch"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"resetTranslations"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<ResetTranslationsMutation, ResetTranslationsMutationVariables>;
export const GetLocaleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getLocale"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"locale"},"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}]}]}}]} as unknown as DocumentNode<GetLocaleQuery, GetLocaleQueryVariables>;
export const MemberLoginDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"memberLogin"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"memberLoginInput"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"MemberLoginInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"memberLogin"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"memberLoginInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"memberLoginInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"expirationDate"}},{"kind":"Field","name":{"kind":"Name","value":"maxEmailSent"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"emailLocked"}},{"kind":"Field","name":{"kind":"Name","value":"userRestricted"}},{"kind":"Field","name":{"kind":"Name","value":"serverError"}}]}}]}}]} as unknown as DocumentNode<MemberLoginQuery, MemberLoginQueryVariables>;
export const GetEntityImageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getEntityImage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"entity"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EntityInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getEntityImage"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"entity"},"value":{"kind":"Variable","name":{"kind":"Name","value":"entity"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"entityId"}},{"kind":"Field","name":{"kind":"Name","value":"entityType"}},{"kind":"Field","name":{"kind":"Name","value":"filename"}},{"kind":"Field","name":{"kind":"Name","value":"size"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<GetEntityImageQuery, GetEntityImageQueryVariables>;
export const UploadEntityImageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"uploadEntityImage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"imageInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EntityImageInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uploadEntityImage"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"imageInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"imageInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"entityId"}},{"kind":"Field","name":{"kind":"Name","value":"entityType"}},{"kind":"Field","name":{"kind":"Name","value":"filename"}},{"kind":"Field","name":{"kind":"Name","value":"size"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<UploadEntityImageMutation, UploadEntityImageMutationVariables>;
export const DeleteEntityImageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteEntityImage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"imageId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteEntityImage"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"imageId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"imageId"}}}]}]}}]} as unknown as DocumentNode<DeleteEntityImageMutation, DeleteEntityImageMutationVariables>;
export const SearchMemberListDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"searchMemberList"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"SearchMemberInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"searchMemberList"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"paging"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"limit"}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}},{"kind":"Field","name":{"kind":"Name","value":"currentToken"}},{"kind":"Field","name":{"kind":"Name","value":"nextToken"}}]}},{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"emailAddress"}},{"kind":"Field","name":{"kind":"Name","value":"jobTitle"}},{"kind":"Field","name":{"kind":"Name","value":"companyName"}},{"kind":"Field","name":{"kind":"Name","value":"mobileNumber"}},{"kind":"Field","name":{"kind":"Name","value":"registrationDate"}},{"kind":"Field","name":{"kind":"Name","value":"lastLoginDate"}},{"kind":"Field","name":{"kind":"Name","value":"registrationAge"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"years"}},{"kind":"Field","name":{"kind":"Name","value":"months"}},{"kind":"Field","name":{"kind":"Name","value":"days"}}]}}]}}]}}]}}]} as unknown as DocumentNode<SearchMemberListQuery, SearchMemberListQueryVariables>;
export const UpdateMemberStatusDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateMemberStatus"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateMemberStatusInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateMemberStatus"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<UpdateMemberStatusMutation, UpdateMemberStatusMutationVariables>;
export const GetAdvancedAppNavigationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getAdvancedAppNavigation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"products"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"defaultOpen"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"url"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"href"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"helpMenu"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"openInNewTab"}},{"kind":"Field","name":{"kind":"Name","value":"hasCustomOnClickHandler"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"url"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"href"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"userUtilities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"url"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"href"}}]}},{"kind":"Field","name":{"kind":"Name","value":"openInNewTab"}},{"kind":"Field","name":{"kind":"Name","value":"hasCustomOnClickHandler"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"company"}},{"kind":"Field","name":{"kind":"Name","value":"url"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"href"}}]}},{"kind":"Field","name":{"kind":"Name","value":"viewProfileText"}}]}},{"kind":"Field","name":{"kind":"Name","value":"recentItems"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]}}]} as unknown as DocumentNode<GetAdvancedAppNavigationQuery, GetAdvancedAppNavigationQueryVariables>;
export const UpdateRecentItemsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateRecentItems"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateRecentItemsRequest"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateRecentItems"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"RecentItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateRecentItemsMutation, UpdateRecentItemsMutationVariables>;
export const GetMemberDataFullDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getMemberDataFull"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MemberDataInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getMemberData"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"emailAddress"}},{"kind":"Field","name":{"kind":"Name","value":"prefix"}},{"kind":"Field","name":{"kind":"Name","value":"designation"}},{"kind":"Field","name":{"kind":"Name","value":"jobTitle"}},{"kind":"Field","name":{"kind":"Name","value":"companyName"}},{"kind":"Field","name":{"kind":"Name","value":"mobileNumber"}},{"kind":"Field","name":{"kind":"Name","value":"compliance"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"creationTime"}},{"kind":"Field","name":{"kind":"Name","value":"complianceScope"}},{"kind":"Field","name":{"kind":"Name","value":"action"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"}}]}},{"kind":"Field","name":{"kind":"Name","value":"profileImageUrl"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"href"}}]}},{"kind":"Field","name":{"kind":"Name","value":"socialMediaLinks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"facebookUrl"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"href"}}]}},{"kind":"Field","name":{"kind":"Name","value":"twitterUrl"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"href"}}]}},{"kind":"Field","name":{"kind":"Name","value":"linkedinUrl"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"href"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"visibility"}},{"kind":"Field","name":{"kind":"Name","value":"termsAccepted"}}]}}]}}]} as unknown as DocumentNode<GetMemberDataFullQuery, GetMemberDataFullQueryVariables>;
export const GetMemberProfileDataDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getMemberProfileData"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MemberDataInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getMemberData"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"emailAddress"}},{"kind":"Field","name":{"kind":"Name","value":"jobTitle"}},{"kind":"Field","name":{"kind":"Name","value":"companyName"}},{"kind":"Field","name":{"kind":"Name","value":"mobileNumber"}}]}}]}}]}}]} as unknown as DocumentNode<GetMemberProfileDataQuery, GetMemberProfileDataQueryVariables>;
export const SaveEmailDomainsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"saveEmailDomains"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EmailDomainsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"saveEmailDomains"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"emailDomains"}}]}}]}}]} as unknown as DocumentNode<SaveEmailDomainsMutation, SaveEmailDomainsMutationVariables>;
export const GetEmailDomainsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getEmailDomains"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GetEmailDomainsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getEmailDomains"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"emailDomains"}}]}}]}}]} as unknown as DocumentNode<GetEmailDomainsQuery, GetEmailDomainsQueryVariables>;
export const FetchAndCreateShortUrlByTagDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"fetchAndCreateShortUrlByTag"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"videoCenterId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fetchAndCreateShortUrlByTag"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"videoCenterId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"videoCenterId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"shortUrl"}},{"kind":"Field","name":{"kind":"Name","value":"pageName"}}]}}]}}]} as unknown as DocumentNode<FetchAndCreateShortUrlByTagQuery, FetchAndCreateShortUrlByTagQueryVariables>;
export const GetAccountCodeSnippetsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getAccountCodeSnippets"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getAccountCodeSnippets"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"allowCodeSnippets"}},{"kind":"Field","name":{"kind":"Name","value":"accountCodeSnippets"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"codeSnippetId"}},{"kind":"Field","name":{"kind":"Name","value":"codeSnippetDataTagCode"}},{"kind":"Field","name":{"kind":"Name","value":"codeSnippetName"}},{"kind":"Field","name":{"kind":"Name","value":"codeSnippetValue"}},{"kind":"Field","name":{"kind":"Name","value":"codeSnippetStatus"}},{"kind":"Field","name":{"kind":"Name","value":"isDropCodeSnippetToCookieBannerTied"}}]}}]}}]}}]} as unknown as DocumentNode<GetAccountCodeSnippetsQuery, GetAccountCodeSnippetsQueryVariables>;
export const GetAccountSnapshotDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getAccountSnapshot"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getAccountSnapshot"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"accountStub"}},{"kind":"Field","name":{"kind":"Name","value":"customFonts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fontFamily"}},{"kind":"Field","name":{"kind":"Name","value":"fallbackFontId"}},{"kind":"Field","name":{"kind":"Name","value":"fallbackFont"}},{"kind":"Field","name":{"kind":"Name","value":"files"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"fontStyle"}},{"kind":"Field","name":{"kind":"Name","value":"fontWeight"}}]}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}}]}}]}}]}}]} as unknown as DocumentNode<GetAccountSnapshotQuery, GetAccountSnapshotQueryVariables>;
export const SaveCodeSnippetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"saveCodeSnippet"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CodeSnippetInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"saveCodeSnippet"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"codeSnippetId"}},{"kind":"Field","name":{"kind":"Name","value":"applicableOn"}},{"kind":"Field","name":{"kind":"Name","value":"addToAllPages"}},{"kind":"Field","name":{"kind":"Name","value":"addToLoginPage"}},{"kind":"Field","name":{"kind":"Name","value":"addToSingleVideoPage"}}]}}]}}]} as unknown as DocumentNode<SaveCodeSnippetMutation, SaveCodeSnippetMutationVariables>;
export const UpdateCodeSnippetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateCodeSnippet"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CodeSnippetInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateCodeSnippet"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"codeSnippetId"}},{"kind":"Field","name":{"kind":"Name","value":"applicableOn"}},{"kind":"Field","name":{"kind":"Name","value":"addToAllPages"}},{"kind":"Field","name":{"kind":"Name","value":"addToLoginPage"}},{"kind":"Field","name":{"kind":"Name","value":"addToSingleVideoPage"}}]}}]}}]} as unknown as DocumentNode<UpdateCodeSnippetMutation, UpdateCodeSnippetMutationVariables>;
export const RemoveCodeSnippetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"removeCodeSnippet"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RemoveCodeSnippetInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeCodeSnippet"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<RemoveCodeSnippetMutation, RemoveCodeSnippetMutationVariables>;
export const GetGoogleMeasurementIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getGoogleMeasurementId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"hubId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getGoogleMeasurementId"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"hubId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"hubId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"measurementId"}}]}}]}}]} as unknown as DocumentNode<GetGoogleMeasurementIdQuery, GetGoogleMeasurementIdQueryVariables>;
export const SaveGoogleMeasurementIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"saveGoogleMeasurementId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MeasurementIdInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"saveGoogleMeasurementId"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"measurementId"}}]}}]}}]} as unknown as DocumentNode<SaveGoogleMeasurementIdMutation, SaveGoogleMeasurementIdMutationVariables>;
export const GetCalendarListDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getCalendarList"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"calendars"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<GetCalendarListQuery, GetCalendarListQueryVariables>;
export const CalendarsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"calendars"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"calendars"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<CalendarsQuery, CalendarsQueryVariables>;
export const GeneratePreSignedUrlDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"generatePreSignedUrl"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PreSignedInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"generatePreSignedUrl"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uploadUrl"}},{"kind":"Field","name":{"kind":"Name","value":"fileId"}},{"kind":"Field","name":{"kind":"Name","value":"fullFilePath"}}]}}]}}]} as unknown as DocumentNode<GeneratePreSignedUrlQuery, GeneratePreSignedUrlQueryVariables>;
export const CheckScanStatusDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"checkScanStatus"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ScanStatusInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"checkScanStatus"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"fileId"}},{"kind":"Field","name":{"kind":"Name","value":"fullFilePath"}},{"kind":"Field","name":{"kind":"Name","value":"failureReason"}}]}}]}}]} as unknown as DocumentNode<CheckScanStatusQuery, CheckScanStatusQueryVariables>;
export const GetVideosDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getVideos"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filterInput"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"VideoFilterInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getVideos"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filterInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filterInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"paging"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nextToken"}},{"kind":"Field","name":{"kind":"Name","value":"currentToken"}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}}]}},{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"catalogs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"channel"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}},{"kind":"Field","name":{"kind":"Name","value":"section"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"videoCenters"}}]}},{"kind":"Field","name":{"kind":"Name","value":"sessions"}},{"kind":"Field","name":{"kind":"Name","value":"exhibitors"}},{"kind":"Field","name":{"kind":"Name","value":"speakers"}},{"kind":"Field","name":{"kind":"Name","value":"sourceProvider"}},{"kind":"Field","name":{"kind":"Name","value":"events"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}},{"kind":"Field","name":{"kind":"Name","value":"thumbnail"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"href"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"generatedThumbnail"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"href"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"tags"}},{"kind":"Field","name":{"kind":"Name","value":"source"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}},{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"}},{"kind":"Field","name":{"kind":"Name","value":"lastModified"}},{"kind":"Field","name":{"kind":"Name","value":"lastModifiedBy"}}]}}]}}]}}]} as unknown as DocumentNode<GetVideosQuery, GetVideosQueryVariables>;
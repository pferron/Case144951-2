import gql from 'graphql-tag';

export default gql`
  type Query {
    hubs(input: Hubs): HubsPagingResponse @auth(methods: [BEARER], roles: ["video-center:read", "hubs:read"])
    hub(id: HubSearch): Hub @auth(methods: [BEARER], roles: ["video-center:read", "hubs:read"])
    hubBanners(bannerSearch: BannerSearch): BannerPagingResponse @auth(methods: [BEARER], roles: ["video-center:read"])
    getHubSettings(id: HubSearch!): Settings @auth(methods: [BEARER], roles: ["video-center:read"])
    getHubTermsEditPermission(id: HubSearch!): AllowTermsEdit @auth(methods: [BEARER], roles: ["video-center:read"])
    getCenterFeatures(id: HubSearch!): [Feature] @auth(methods: [BEARER], roles: ["video-center:read"])
    hubPages(id: HubSearch!): HubPages @auth(methods: [BEARER], roles: ["video-center:read"])
    hubPagesWithBanner(input: BannerHubSearch!): HubPages @auth(methods: [BEARER], roles: ["video-center:read"])
    getHubLocales(id: HubSearch!): HubLocalesWithDefault @auth(methods: [BEARER], roles: ["video-center:read"])
    getRegistrationCount(input: RegistrationCountRequest!): RegistrationCountResponse
      @auth(methods: [BEARER], roles: ["video-center:read"])
    getUtmOverrides(input: HubSearch!): [UtmOverride] @auth(methods: [BEARER], roles: ["video-center:read"])
    getTranslations(input: TranslationSearch!): TranslationPagingResponse
      @auth(methods: [BEARER], roles: ["video-center:read"])
    getHubCustomizations(id: HubSearch!): Customizations @auth(methods: [BEARER], roles: ["video-center:read"])
    getRegistrationFormSettings(input: RegistrationFormSettingInput!): RegistrationFormSettings
      @auth(methods: [BEARER], roles: ["video-center:read"])
    getPage(input: HubSearch!): PageWithSections @auth(methods: [BEARER], roles: ["video-center:read"])
    getPublishedPageOrDefaults(input: HubSearch!): PageWithSections
      @auth(methods: [BEARER], roles: ["video-center:write"])
  }

  type Mutation {
    hubUpdate(input: HubUpdate): String @auth(methods: [BEARER], roles: ["video-center:write"])
    hubCreate(input: HubCreate): String @auth(methods: [BEARER], roles: ["video-center:write"])
    hubPublish(input: HubSearch): String @auth(methods: [BEARER], roles: ["video-center:write"])
    hubDraft(input: HubSearch): String @auth(methods: [BEARER], roles: ["video-center:write"])
    hubDelete(input: HubSearch): String @auth(methods: [BEARER], roles: ["video-center:write"])
    deleteToken(input: HubSearch): String @auth(methods: [BEARER], roles: ["video-center:write"])
    hubUpdateSettings(input: HubUpdateSettings): Settings @auth(methods: [BEARER], roles: ["video-center:write"])
    updateCenterFeature(input: FeatureInput!): Feature @auth(methods: [BEARER], roles: ["video-center:write"])
    addHubLocales(input: HubLocales!, id: HubSearch!): HubLocalesWithDefault
      @auth(methods: [BEARER], roles: ["video-center:write"])
    updateBrandingImages(input: BrandingImagesInput!): Hub @auth(methods: [BEARER], roles: ["video-center:write"])
    setUtmOverrides(input: HubSearch!, data: [UtmOverrideInput]): [UtmOverride]
      @auth(methods: [BEARER], roles: ["video-center:write"])
    setTranslations(input: HubSearch!, locale: String!, data: [TranslationInput]): TranslationUpdateResponse
      @auth(methods: [BEARER], roles: ["video-center:write"])
    upsertHubCustomizations(id: HubSearch!, input: CustomizationsInput!): Customizations
      @auth(methods: [BEARER], roles: ["video-center:write"])
    resetTranslations(input: ResetTranslationSearch!): String
      @auth(methods: [BEARER], validateCsrf: false, roles: ["video-center:write"])
    updateRegistrationFormSettings(input: updateRegistrationFormSettingInput!): RegistrationFormSettings
      @auth(methods: [BEARER], roles: ["video-center:write"])
    updateBackgroundImages(input: BackgroundImagesInput!): Hub @auth(methods: [BEARER], roles: ["video-center:write"])
    createPage(page: PageInput!, newSection: PageSectionInput): PageWithSection
      @auth(methods: [BEARER], roles: ["video-center:write"])
    updatePage(data: PageInput!): Page @auth(methods: [BEARER], roles: ["video-center:write"])
    createSection(input: HubSearch!, data: PageSectionInput): PageSection
      @auth(methods: [BEARER], roles: ["video-center:write"])
    updateSection(input: HubSearch!, data: PageSectionInput): PageSection
      @auth(methods: [BEARER], roles: ["video-center:write"])
  }

  union HubResult = Hub | Validation

  type Hub {
    id: ID!
    status: String
    config: Config
    theme: Theme
    calendar: Calendar
  }

  type Config {
    title: String!
    ownerFirstName: String!
    ownerLastName: String!
    ownerEmail: String!
    url: String
    locale: String
    accountMappingId: String
    helpEmailAddress: String
    utmOverride: String
    autoDetectBrowserLocale: Boolean
    customDomain: String
    loginType: LoginType
    organizationId: String
  }

  type Theme {
    actionColor: String
    backgroundColor: String
    logoImageRelativePath: String
    logoImageUrl: String
    logoOriginalImageUrl: String
    logoAltText: String
    mainColor: String
    moodColor: String
    safeMode: Boolean
    faviconUrl: String
    backgroundImageUrl: String
    backgroundOriginalImageUrl: String
    backgroundImageAltText: String
    headingsFont: ID
    bodyFont: ID
  }

  type Calendar {
    id: ID
  }

  type PagingResponse {
    limit: Int!
    previousToken: String
    currentToken: String!
    nextToken: String
    totalCount: Int!
  }

  type HubsPagingResponse {
    data: [Hub]!
    paging: PagingResponse!
  }

  type HubDataSourceRecord {
    id: ID
    status: String
    title: String
    ownerFirstName: String
    ownerLastName: String
    ownerEmail: String
    url: String
    locale: String
    actionColor: String
    backgroundColor: String
    logoImageRelativePath: String
    logoImageUrl: String
    logoOriginalImageUrl: String
    logoAltText: String
    mainColor: String
    accountMappingId: String
    calendarId: ID
    moodColor: String
    themeSafeMode: Boolean
    helpEmailAddress: String
    faviconUrl: String
    backgroundImageUrl: String
    backgroundOriginalImageUrl: String
    backgroundImageAltText: String
    utmOverride: String
    headingsFontId: ID
    bodyFontId: ID
    autoDetectBrowserLocale: Boolean
    customDomain: String
    loginType: LoginType
    organizationId: String
  }

  type HubPage {
    entityType: String!
    entityId: String!
    name: String!
  }

  type HubPages {
    data: [HubPage]!
  }

  type HubDataSourceList {
    data: [HubDataSourceRecord]!
    paging: PagingResponse!
  }

  type HubStatusInput {
    id: String!
    status: String!
  }

  enum ConfigStatus {
    Inactive
    Active
  }

  enum LoginType {
    MAGIC_LINK
    SSO
  }

  input TermsInput {
    hubId: ID!
    contactId: ID!
  }

  enum AllowTermsEdit {
    ALLOWED
    NOT_ALLOWED
  }

  type TermsConsent {
    termsAccepted: Boolean!
    contact: Contact
  }

  type Contact {
    firstName: String
    lastName: String
    email: String
  }

  input HubSearch {
    id: String!
  }

  input Hubs {
    token: String
    limit: Int
  }

  input HubCreate {
    config: ConfigInput
    theme: ThemeInput
    calendar: CalendarInput
  }

  input HubUpdate {
    id: ID!
    config: ConfigInput
    theme: ThemeInput
    calendar: CalendarInput
  }

  input HubUpdateSettings {
    id: ID!
    hubSettings: SettingsInput
  }

  input SettingsInput {
    displayPrivacyPolicy: Boolean
    privacyPolicyUrl: String
    displayCventPrivacyPolicy: Boolean
    cventPrivacyPolicyLinkText: String
    privacyPolicyLinkText: String
    ccpaLinkText: String
    ccpaSubmitButtonText: String
    ccpaConfirmationText: String
    ccpaDoNotSellUrlEnabled: Boolean
    ccpaDoNotSellUrl: String
    ccpaLinkExplanationText: String
    allowTurnOffCookies: Boolean
    termsText: String
    termsLinkText: String
    displayTermsOnLogin: Boolean
    ccpaEnableDoNotSell: Boolean
    notifyUsersAboutCookie: Boolean
    displayTermsLinkOnFooter: Boolean
    displayCventPrivacyPolicyInCookie: Boolean
    allowTurnOffGoogleAnalytics: Boolean
    memberProfilePublic: Boolean
    profileCard: ProfileCardInput
    guestVisibility: GuestVisibility
    allowLimitedViewsBeforeLogin: Boolean
    allowLimitedViewsBeforeLoginCount: Int
    registrationSettings: RegistrationSettingsInput
    showLogo: Boolean
    registrationBackground: BackGroundStyle
    allowHubSearchEngineIndexing: Boolean
    decorativeImage: Boolean
    cookieLists: CookieListInput
  }

  type Settings {
    displayPrivacyPolicy: Boolean
    privacyPolicyUrl: String
    displayCventPrivacyPolicy: Boolean
    cventPrivacyPolicyLinkText: String
    privacyPolicyLinkText: String
    ccpaLinkText: String
    ccpaSubmitButtonText: String
    ccpaConfirmationText: String
    ccpaDoNotSellUrlEnabled: Boolean
    ccpaDoNotSellUrl: String
    ccpaLinkExplanationText: String
    allowTurnOffCookies: Boolean
    termsText: String
    termsLinkText: String
    displayTermsOnLogin: Boolean
    ccpaEnableDoNotSell: Boolean
    notifyUsersAboutCookie: Boolean
    displayTermsLinkOnFooter: Boolean
    displayCventPrivacyPolicyInCookie: Boolean
    allowTurnOffGoogleAnalytics: Boolean
    memberProfilePublic: Boolean
    profileCard: ProfileCard
    guestVisibility: GuestVisibility
    allowLimitedViewsBeforeLogin: Boolean
    allowLimitedViewsBeforeLoginCount: Int
    registrationSettings: RegistrationSettings
    showLogo: Boolean
    registrationBackground: BackGroundStyle
    allowHubSearchEngineIndexing: Boolean
    decorativeImage: Boolean
    cookieLists: CookieList
  }

  type CookieList {
    enableCvent: Boolean
    cventUrl: String
    enableCustom: Boolean
    customUrl: String
    customLinkText: String
  }

  input CookieListInput {
    enableCvent: Boolean
    cventUrl: String
    enableCustom: Boolean
    customUrl: String
    customLinkText: String
  }

  type ProfileCard {
    border: String
    branding: String
    alignment: String
    showName: Boolean
    allowNameEdit: Boolean
    showJobTitle: Boolean
    allowJobTitleEdit: Boolean
    showCompany: Boolean
    allowCompanyEdit: Boolean
    showHeadline: Boolean
    allowHeadlineEdit: Boolean
    showSocialMediaLinks: Boolean
    allowSocialMediaEdit: Boolean
    showPronouns: Boolean
    allowPronounsEdit: Boolean
  }

  input ProfileCardInput {
    border: String
    branding: String
    alignment: String
    showName: Boolean
    allowNameEdit: Boolean
    showJobTitle: Boolean
    allowJobTitleEdit: Boolean
    showCompany: Boolean
    allowCompanyEdit: Boolean
    showHeadline: Boolean
    allowHeadlineEdit: Boolean
    showSocialMediaLinks: Boolean
    allowSocialMediaEdit: Boolean
    showPronouns: Boolean
    allowPronounsEdit: Boolean
  }

  input ConfigInput {
    title: String
    ownerFirstName: String
    ownerLastName: String
    ownerEmail: String
    url: String
    locale: String
    accountMappingId: String
    helpEmailAddress: String
    utmOverride: String
    autoDetectBrowserLocale: Boolean
    customDomain: String
    loginType: LoginType
    organizationId: String
  }

  input ThemeInput {
    actionColor: String
    backgroundColor: String
    logoImageRelativePath: String
    logoImageUrl: String
    logoOriginalImageUrl: String
    logoAltText: String
    mainColor: String
    newLogoImageUrl: String
    newLogoOriginalImageUrl: String
    moodColor: String
    safeMode: Boolean
    faviconUrl: String
    backgroundImageUrl: String
    backgroundOriginalImageUrl: String
    newBackgroundImageUrl: String
    newBackgroundOriginalImageUrl: String
    backgroundImageAltText: String
    headingsFont: ID
    bodyFont: ID
  }

  input CalendarInput {
    id: ID
  }

  type Feature {
    code: String!
    enabled: Boolean!
  }

  input FeatureInput {
    centerId: ID!
    code: String!
    enabled: Boolean!
  }

  input FeatureStatusInput {
    enabled: Boolean!
  }

  enum GuestVisibility {
    PUBLIC
    HOMEPAGE_PUBLIC
    VIDEO_PLAYBACK_PRIVATE
    PRIVATE
  }

  enum AllowedEmailDomain {
    ANY_DOMAIN
    BUSINESS_DOMAINS
    CUSTOM_DOMAINS
  }

  type RegistrationSettings {
    allowAllContactsRegistration: Boolean
    allowContactGroupsRegistration: Boolean
    allowContactTypesRegistration: Boolean
    blockContactsRegistration: Boolean
    blockListRegistration: Boolean
    allowedEmailDomain: AllowedEmailDomain
  }
  input RegistrationSettingsInput {
    allowAllContactsRegistration: Boolean
    allowContactGroupsRegistration: Boolean
    allowContactTypesRegistration: Boolean
    blockContactsRegistration: Boolean
    blockListRegistration: Boolean
    allowedEmailDomain: AllowedEmailDomain
  }
  input RegistrationCountRequest {
    hubId: ID!
    startDate: DateTime!
    endDate: DateTime!
  }
  type RegistrationCount {
    date: DateTime!
    value: Int!
  }
  type RegistrationCountResponse {
    perDay: [RegistrationCount!]
    perWeek: [RegistrationCount!]
    perMonth: [RegistrationCount!]
    total: Int
    serverError: Boolean
  }

  input HubLocales {
    data: [String]!
  }

  type HubLocalesWithDefault {
    data: [HubLocaleWithDefault]!
  }

  type HubLocaleWithDefault {
    locale: String!
    customized: String
    translationStatus: String
    lastModified: String
    lastModifiedBy: String
    default: Boolean!
  }

  input BrandingImagesInput {
    hubId: ID!
    logoUrl: String
    logoOriginalUrl: String
    newLogoUrl: String
    newLogoOriginalUrl: String
    logoAltText: String
    faviconUrl: String
  }

  input BackgroundImagesInput {
    hubId: ID!
    backgroundImageUrl: String
    backgroundOriginalImageUrl: String
    newBackgroundImageUrl: String
    newBackgroundOriginalImageUrl: String
    backgroundImageAltText: String
  }

  type UtmOverride {
    key: String!
    value: String!
  }

  input UtmOverrideInput {
    key: String!
    value: String!
  }

  input TranslationInput {
    type: String!
    locale: String!
    id: String!
    translatedValue: String
  }

  type TranslationPagingResponse {
    data: [Translation]!
    paging: PagingResponse!
  }

  type TranslationUpdateResponse {
    Failure: [Translation]
    Success: [Translation]
  }

  type Translation {
    type: String!
    locale: String!
    id: String!
    defaultValue: String
    translatedValue: String
  }

  input TranslationSearch {
    hubId: String!
    locale: String!
    translations: String
    type: String
    limit: Int
    sort: String
    token: String
    translationText: String
  }

  input ResetTranslationSearch {
    hubId: String!
    locale: String!
    type: String
  }

  enum NavigationAlignment {
    Left
    Right
    Center
  }

  enum NavigationLinkHighlightStyle {
    Filled
    Underline
    None
  }

  type Customizations {
    headerHtml: String
    headerCss: String
    headerJavascript: String
    showCustomHeader: Boolean
    showLogo: Boolean
    showLogin: Boolean
    showHomePage: Boolean
    showUpcomingEvents: Boolean
    showChannels: Boolean
    showVideos: Boolean
    showNavigation: Boolean
    navigationAlignment: NavigationAlignment
    navigationLinkTextSize: Int
    navigationLinkHighlightStyle: NavigationLinkHighlightStyle
    navigationHeaderLeftPadding: Int
    navigationHeaderRightPadding: Int
    navigationHeaderMaxWidth: Int
    defaultLandingPage: DefaultLandingPage
  }

  input CustomizationsInput {
    headerHtml: String
    headerCss: String
    headerJavascript: String
    showCustomHeader: Boolean
    showLogo: Boolean
    showLogin: Boolean
    showHomePage: Boolean
    showUpcomingEvents: Boolean
    showChannels: Boolean
    showVideos: Boolean
    showNavigation: Boolean
    navigationAlignment: NavigationAlignment
    navigationLinkTextSize: Int
    navigationLinkHighlightStyle: NavigationLinkHighlightStyle
    navigationHeaderLeftPadding: Int
    navigationHeaderRightPadding: Int
    navigationHeaderMaxWidth: Int
    defaultLandingPage: DefaultLandingPage
  }

  enum DefaultLandingPage {
    Videos
    UpcomingEvents
    Channels
  }

  input RegistrationFormSettingInput {
    hubId: ID!
  }

  input updateRegistrationFormSettingInput {
    hubId: ID!
    data: [FormFieldSettingInput!]!
  }

  type FormFieldSetting {
    code: RegistrationFieldCode!
    order: Int!
    required: Boolean!
    included: Boolean!
  }

  input FormFieldSettingInput {
    code: RegistrationFieldCode!
    order: Int!
    required: Boolean!
    included: Boolean!
  }

  type RegistrationFormSettings {
    data: [FormFieldSetting]!
  }

  enum RegistrationFieldCode {
    JOB_TITLE
    COMPANY
    ADDRESS
    PHONE_NUMBER
  }

  enum BackGroundStyle {
    DEFAULT
    IMAGE
  }

  type PageWithSections {
    page: Page
    sections: [PageSection]
  }

  type Page {
    pageId: String!
    videoCenterId: String!
    status: String
    sectionIds: [String]
  }

  type PageWithSection {
    page: Page!
    newSection: PageSection
  }

  input PageInput {
    pageId: String!
    videoCenterId: String!
    status: String
    sectionIds: [String]
    section: PageSectionInput
  }

  type PageSection {
    sectionId: String!
    originPageId: String!
    pageSectionTemplate: String
    title: String
    visibleFields: [String]
    contentLimitOnInitialLoad: Int
    featuredContentType: String
    featuredContentTypeId: String
    contentType: String
    contentIds: [String]
    contentFilterType: String
    contentFilterDateAbstract: String
    alignment: String
    layout: String
    textBody: String
    textColor: String
    buttonEnabled: Boolean
    buttonText: String
    buttonExternalTarget: String
    buttonInternalTarget: String
    buttonTargetType: String
    imageUrl: String
    originalImageUrl: String
    imageAltText: String
  }

  input PageSectionInput {
    sectionId: String!
    originPageId: String!
    pageSectionTemplate: String
    title: String
    visibleFields: [String]
    contentLimitOnInitialLoad: Int
    featuredContentType: String
    featuredContentTypeId: String
    contentType: String
    contentIds: [String]
    contentFilterType: String
    contentFilterDateAbstract: String
    alignment: String
    layout: String
    textBody: String
    textColor: String
    buttonEnabled: Boolean
    buttonText: String
    buttonExternalTarget: String
    buttonInternalTarget: String
    buttonTargetType: String
    newImageUrl: String
    newOriginalImageUrl: String
    imageUrl: String
    originalImageUrl: String
    imageAltText: String
  }
`;

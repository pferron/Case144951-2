import gql from 'graphql-tag';

export default gql`
  type Query {
    accountConfig: AccountVideoCenterConfig @auth(methods: [BEARER], roles: ["account-config:read"])
    userPermissions: UserPermissions @auth(methods: [BEARER], roles: ["user-permissions:read"])
    accountLocale: [AccountLocale] @auth(methods: [BEARER], roles: ["account-config:read"])
    accountDetails: AccountDetails @auth(methods: [BEARER], roles: ["account-config:read"])
  }

  type AccountVideoCenterConfig {
    AccountFeatures: AccountConfigFeatures
    VideoManagementFeatures: AccountConfigVideoManagementFeatures
    InternationalSettings: AccountConfigInternationalSettings
    EventFeatures: AccountConfigEventFeatures
  }

  type AccountLocale {
    Locale: Locale
    IsDefault: Boolean
  }

  type Locale {
    Id: Int!
    LanguageName: String
    CountryLanguage: String
    CultureCode: String
    IsDefault: Boolean
    AvailableCultures: [Culture]
    LocalizationFlag: Boolean
  }

  type Culture {
    LocaleId: Int!
    CultureCountryId: Int
    IsDefaultCulture: Boolean
    CultureCode: String
  }

  type AccountConfigFeatures {
    GeneralFeatures: AccountConfigGeneral
    Blades: AccountConfigBlade
  }

  type AccountConfigGeneral {
    AIWritingAssistantEnabled: Boolean
    AllowCodeSnippets: Boolean
    AllowCustomFonts: Boolean
    AllowGoogleAnalytics: Boolean
    AllowOAuth: Boolean
  }

  type AccountConfigBlade {
    AllowVideosBlade: Boolean
  }

  type AccountConfigVideoManagementFeatures {
    VideoStorageSize: Int
    VideoCenterFlag: Boolean
  }

  type AccountConfigInternationalSettings {
    DefaultLanguageId: Int
    DefaultCultureCode: String
  }

  type AccountConfigEventFeatures {
    GeneralFeatures: AccountConfigEventFeaturesGeneral
  }

  type AccountConfigEventFeaturesGeneral {
    LicenseTypeId: Int
  }

  type UserPermissions {
    VideoCenter: Boolean
    VideoLibrary: Boolean
    VideoStorage: Boolean
    EventsPlusCustomHeader: Boolean
  }

  type UserVideoCenterPermissions {
    CVENT_VIDEO_LIBRARY_ACCESS: Int
    CVENT_VIDEO_CENTER_CONFIGURATION: Int
    CVENT_VIDEO_CENTER_CREATION: Int
    CVENT_VIDEO_UPLOAD: Int
    CVENT_VIDEO_EDIT: Int
    CVENT_VIDEO_CENTER_ACCESS: Int
    CVENT_VIDEO_STORAGE_MANAGEMENT: Int
    CVENT_EVENTS_PLUS_CUSTOM_HEADER: Int
  }

  type UserSoaPermissions {
    AccountId: Int
    RoleStub: String
    Permissions: UserVideoCenterPermissions
    EventRoleStubs: [String]
  }

  type AccountDetails {
    AccountId: Int
    AccountName: String
    AccountStub: String
    AccountCompanyName: String
  }
`;

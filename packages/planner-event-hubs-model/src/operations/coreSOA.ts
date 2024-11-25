import { gql } from '@apollo/client';

export const accountConfig = gql`
  query GetAccountConfig {
    accountConfig {
      AccountFeatures {
        GeneralFeatures {
          AIWritingAssistantEnabled
          AllowCodeSnippets
          AllowCustomFonts
          AllowGoogleAnalytics
          AllowOAuth
        }
        Blades {
          AllowVideosBlade
        }
      }
      VideoManagementFeatures {
        VideoCenterFlag
        VideoStorageSize
      }
      InternationalSettings {
        DefaultLanguageId
        DefaultCultureCode
      }
      EventFeatures {
        GeneralFeatures {
          LicenseTypeId
        }
      }
    }
  }
`;

export const userPermissions = gql`
  query GetUserPermissions {
    userPermissions {
      VideoCenter
      VideoLibrary
      VideoStorage
      EventsPlusCustomHeader
    }
  }
`;

export const accountLocale = gql`
  query GetAccountLocale {
    accountLocale {
      Locale {
        Id
        LanguageName
        CountryLanguage
        CultureCode
        IsDefault
        AvailableCultures {
          LocaleId
          CultureCountryId
          IsDefaultCulture
          CultureCode
        }
        LocalizationFlag
      }
      IsDefault
    }
  }
`;

export const accountDetails = gql`
  query GetAccountDetails {
    accountDetails {
      AccountId
      AccountName
      AccountStub
      AccountCompanyName
    }
  }
`;

export const userDetails = gql`
  query GetUserDetails {
    user {
      firstName
      lastName
      email
      company
      url {
        href
      }
      viewProfileText
    }
  }
`;

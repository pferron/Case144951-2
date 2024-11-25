import { gql } from '@apollo/client';

export const GET_HUB_SETTINGS = gql`
  query getHubSettings($id: HubSearch!) {
    getHubSettings(id: $id) {
      allowTurnOffGoogleAnalytics
      displayCventPrivacyPolicy
      cventPrivacyPolicyLinkText
      displayPrivacyPolicy
      privacyPolicyUrl
      privacyPolicyLinkText
      displayTermsLinkOnFooter
      termsLinkText
      displayTermsOnLogin
      termsText
      notifyUsersAboutCookie
      displayCventPrivacyPolicyInCookie
      allowTurnOffCookies
      ccpaEnableDoNotSell
      ccpaLinkText
      ccpaSubmitButtonText
      ccpaConfirmationText
      ccpaDoNotSellUrlEnabled
      ccpaDoNotSellUrl
      ccpaLinkExplanationText
      memberProfilePublic
      guestVisibility
      registrationSettings {
        allowAllContactsRegistration
        allowContactGroupsRegistration
        allowContactTypesRegistration
        blockContactsRegistration
        blockListRegistration
      }
      profileCard {
        border
        branding
        alignment
        showName
        allowNameEdit
        showJobTitle
        allowJobTitleEdit
        showCompany
        allowCompanyEdit
        showHeadline
        allowHeadlineEdit
        showSocialMediaLinks
        allowSocialMediaEdit
        showPronouns
        allowPronounsEdit
      }
      cookieLists {
        enableCvent
        cventUrl
        enableCustom
        customUrl
        customLinkText
      }
      allowLimitedViewsBeforeLogin
      allowLimitedViewsBeforeLoginCount
      registrationSettings {
        allowAllContactsRegistration
        allowContactGroupsRegistration
        allowContactTypesRegistration
        blockContactsRegistration
        blockListRegistration
        allowedEmailDomain
      }
      showLogo
      registrationBackground
      allowHubSearchEngineIndexing
      decorativeImage
    }
  }
`;

export const GET_VIDEO_HUB = gql`
  query hub($hubID: HubSearch) {
    hub(id: $hubID) {
      id
      status
      config {
        title
        ownerFirstName
        ownerLastName
        ownerEmail
        url
        locale
        accountMappingId
        helpEmailAddress
        utmOverride
        autoDetectBrowserLocale
        customDomain
        loginType
        organizationId
      }
      theme {
        actionColor
        backgroundColor
        logoImageRelativePath
        logoImageUrl
        logoOriginalImageUrl
        logoAltText
        backgroundImageUrl
        backgroundOriginalImageUrl
        backgroundImageAltText
        mainColor
        moodColor
        safeMode
        faviconUrl
        headingsFont
        bodyFont
      }
      calendar {
        id
      }
    }
  }
`;

export const getCenterFeatures = gql`
  query getCenterFeatures($id: HubSearch!) {
    getCenterFeatures(id: $id) {
      code
      enabled
    }
  }
`;

export const getRegistrationCount = gql`
  query getRegistrationCount($input: RegistrationCountRequest!) {
    getRegistrationCount(input: $input) {
      perDay {
        date
        value
      }
      perWeek {
        date
        value
      }
      perMonth {
        date
        value
      }
      total
      serverError
    }
  }
`;

export const getHubCustomizationsQuery = gql`
  query getHubCustomizations($id: HubSearch!) {
    getHubCustomizations(id: $id) {
      headerHtml
      headerCss
      headerJavascript
      showCustomHeader
      showLogo
      showLogin
      showHomePage
      showUpcomingEvents
      showChannels
      showVideos
      showNavigation
      navigationAlignment
      navigationLinkTextSize
      navigationLinkHighlightStyle
      navigationHeaderLeftPadding
      navigationHeaderRightPadding
      navigationHeaderMaxWidth
      defaultLandingPage
    }
  }
`;

export const upsertHubCustomizationsMutation = gql`
  mutation upsertHubCustomizations($id: HubSearch!, $input: CustomizationsInput!) {
    upsertHubCustomizations(id: $id, input: $input) {
      headerHtml
      headerCss
      headerJavascript
      showCustomHeader
      showLogo
      showLogin
      showHomePage
      showUpcomingEvents
      showChannels
      showVideos
      showNavigation
      navigationAlignment
      navigationLinkTextSize
      navigationLinkHighlightStyle
      navigationHeaderLeftPadding
      navigationHeaderRightPadding
      navigationHeaderMaxWidth
      defaultLandingPage
    }
  }
`;

export const hubLocales = gql`
  query getHubLocales($id: HubSearch!) {
    getHubLocales(id: $id) {
      data {
        locale
        default
        customized
        translationStatus
        lastModified
        lastModifiedBy
      }
    }
  }
`;

export const addHubLocales = gql`
  mutation addHubLocales($hubLocales: HubLocales!, $id: HubSearch!) {
    addHubLocales(input: $hubLocales, id: $id) {
      data {
        locale
        default
      }
    }
  }
`;

export const GET_VIDEO_HUBS = gql`
  query hubs($input: Hubs) {
    hubs(input: $input) {
      data {
        id
        status
        config {
          title
          ownerFirstName
          ownerLastName
          ownerEmail
          url
          locale
        }
      }
      paging {
        currentToken
        nextToken
        limit
        totalCount
      }
    }
  }
`;

export const getVideoHubTitle = gql`
  query getVideoHubTitle($hubID: HubSearch) {
    hub(id: $hubID) {
      id
      config {
        title
      }
    }
  }
`;

export const getHubTermsEditPermission = gql`
  query getHubTermsEditPermission($id: HubSearch!) {
    getHubTermsEditPermission(id: $id)
  }
`;

export const getRegistrationFormSettings = gql`
  query getRegistrationFormSettings($input: RegistrationFormSettingInput!) {
    getRegistrationFormSettings(input: $input) {
      data {
        included
        order
        code
        required
      }
    }
  }
`;

export const getHubCodeSnippets = gql`
  query getHubCodeSnippets($hubId: String!) {
    getHubCodeSnippets(hubId: $hubId) {
      codeSnippetId
      applicableOn
      targetWebPages
    }
  }
`;

export const getCustomDomains = gql`
  query getCustomDomains($hubId: ID!) {
    getCustomDomainForHub(hubId: $hubId) {
      entityId
      customDomainId
      trailingName
    }
    getCustomDomainForAccount {
      customDomainId
      domainName
    }
  }
`;

export const getAccountAndCustomFontInformation = gql`
  query getAccountAndCustomFontInformation {
    getAccountSnapshot {
      customFonts {
        id
        fontFamily
        fallbackFontId
        fallbackFont
        files {
          url
          fontStyle
          fontWeight
        }
        isActive
      }
    }
    accountConfig {
      AccountFeatures {
        GeneralFeatures {
          AllowCustomFonts
          AllowCodeSnippets
        }
      }
    }
  }
`;

export const GET_UTM_OVERRIDES = gql`
  query getUtmOverrides($input: HubSearch!) {
    getUtmOverrides(input: $input) {
      key
      value
    }
  }
`;

// Mutations
export const CREATE_VIDEO_HUB = gql`
  mutation hubCreate($hubUpdate: HubCreate) {
    hubCreate(input: $hubUpdate)
  }
`;

export const UPDATE_VIDEO_HUB = gql`
  mutation hubUpdate($input: HubUpdate!) {
    hubUpdate(input: $input)
  }
`;

export const DELETE_VIDEO_HUB = gql`
  mutation hubDelete($input: HubSearch) {
    hubDelete(input: $input)
  }
`;

export const DELETE_TOKEN = gql`
  mutation deleteToken($input: HubSearch) {
    deleteToken(input: $input)
  }
`;

export const DRAFT_VIDEO_HUB = gql`
  mutation hubDraft($input: HubSearch) {
    hubDraft(input: $input)
  }
`;

export const PUBLISH_VIDEO_HUB = gql`
  mutation hubPublish($input: HubSearch) {
    hubPublish(input: $input)
  }
`;

export const UPDATE_HUB_SETTINGS = gql`
  mutation hubUpdateSettings($input: HubUpdateSettings) {
    hubUpdateSettings(input: $input) {
      allowTurnOffGoogleAnalytics
      displayPrivacyPolicy
      privacyPolicyUrl
      displayCventPrivacyPolicy
      cventPrivacyPolicyLinkText
      privacyPolicyLinkText
      ccpaLinkText
      ccpaSubmitButtonText
      ccpaDoNotSellUrlEnabled
      ccpaConfirmationText
      ccpaDoNotSellUrl
      ccpaLinkExplanationText
      allowTurnOffCookies
      termsText
      termsLinkText
      displayTermsOnLogin
      ccpaEnableDoNotSell
      notifyUsersAboutCookie
      displayTermsLinkOnFooter
      displayCventPrivacyPolicyInCookie
      memberProfilePublic
      profileCard {
        showName
        allowNameEdit
        showJobTitle
        allowJobTitleEdit
        showCompany
        allowCompanyEdit
        showHeadline
        allowHeadlineEdit
        showSocialMediaLinks
        allowSocialMediaEdit
      }
      cookieLists {
        enableCvent
        cventUrl
        enableCustom
        customUrl
        customLinkText
      }
      guestVisibility
      allowLimitedViewsBeforeLogin
      allowLimitedViewsBeforeLoginCount
      registrationSettings {
        allowAllContactsRegistration
        allowContactGroupsRegistration
        allowContactTypesRegistration
        blockContactsRegistration
        blockListRegistration
        allowedEmailDomain
      }
      showLogo
      registrationBackground
      allowHubSearchEngineIndexing
      decorativeImage
    }
  }
`;

export const UPDATE_CENTER_FEATURE = gql`
  mutation updateCenterFeature($input: FeatureInput!) {
    updateCenterFeature(input: $input) {
      code
      enabled
    }
  }
`;

export const UPDATE_BRANDING_IMAGES = gql`
  mutation updateBrandingImages($input: BrandingImagesInput!) {
    updateBrandingImages(input: $input) {
      theme {
        logoImageRelativePath
        logoImageUrl
        logoOriginalImageUrl
        logoAltText
        faviconUrl
      }
    }
  }
`;

export const SET_UTM_OVERRIDES = gql`
  mutation setUtmOverrides($input: HubSearch!, $data: [UtmOverrideInput]) {
    setUtmOverrides(input: $input, data: $data) {
      key
      value
    }
  }
`;

export const UPDATE_REGISTRATION_FORM_SETTINGS = gql`
  mutation updateRegistrationFormSettings($input: updateRegistrationFormSettingInput!) {
    updateRegistrationFormSettings(input: $input) {
      data {
        order
        code
        required
        included
      }
    }
  }
`;

export const UPDATE_BACKGROUND_IMAGES = gql`
  mutation updateBackgroundImages($input: BackgroundImagesInput!) {
    updateBackgroundImages(input: $input) {
      theme {
        backgroundImageUrl
        backgroundOriginalImageUrl
        backgroundImageAltText
      }
    }
  }
`;

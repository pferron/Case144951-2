import { gql } from '@apollo/client';

export const newHub = gql`
  mutation hubCreate($input: HubCreate!) {
    hubCreate(input: $input)
  }
`;

export const updateSettings = gql`
  mutation hubUpdateSettings($input: HubUpdateSettings) {
    hubUpdateSettings(input: $input) {
      ccpaLinkText
      ccpaSubmitButtonText
      ccpaConfirmationText
      ccpaDoNotSellUrlEnabled
      ccpaDoNotSellUrl
      ccpaEnableDoNotSell
      profileCard {
        allowNameEdit
      }
    }
  }
`;

export const updateCenterFeature = gql`
  mutation updateCenterFeature($input: FeatureInput!) {
    updateCenterFeature(input: $input) {
      code
      enabled
    }
  }
`;

export const existingHub = gql`
  mutation hubUpdate($input: HubUpdate!) {
    hubUpdate(input: $input)
  }
`;

export const deleteHub = gql`
  mutation hubDelete($input: HubSearch!) {
    hubDelete(input: $input)
  }
`;

export const deleteToken = gql`
  mutation deleteToken($input: HubSearch) {
    deleteToken(input: $input)
  }
`;

export const publishHub = gql`
  mutation hubPublish($input: HubSearch!) {
    hubPublish(input: $input)
  }
`;

export const draftHub = gql`
  mutation hubDraft($input: HubSearch!) {
    hubDraft(input: $input)
  }
`;

export const updateBannerAssociations = gql`
  mutation setBannerAssociations($input: BannerAssociationCreate!) {
    setBannerAssociations(input: $input) {
      data {
        centerId
        entityType
        entityId
        displayOrder
        banner {
          id
          name
          layout
          imageAltText
          text {
            title
            body
            alignment
            color
          }
          button {
            enabled
            text
            target
          }
        }
      }
      paging {
        currentToken
        nextToken
        limit
      }
    }
  }
`;

export const getHubTermsEditPermission = gql`
  query getHubTermsEditPermission($id: HubSearch!) {
    getHubTermsEditPermission(id: $id)
  }
`;

export const hub = gql`
  query hub($id: HubSearch!) {
    hub(id: $id) {
      id
      status
      config {
        title
        url
        ownerFirstName
        ownerLastName
        ownerEmail
        locale
        helpEmailAddress
      }
      theme {
        actionColor
        backgroundColor
        logoImageRelativePath
        logoImageUrl
        logoOriginalImageUrl
        logoAltText
        mainColor
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

export const hubPages = gql`
  query hubPages($id: HubSearch!) {
    hubPages(id: $id) {
      data {
        entityType
        entityId
        name
      }
    }
  }
`;

export const hubPagesWithBanner = gql`
  query hubPagesWithBanner($input: BannerHubSearch!) {
    hubPagesWithBanner(input: $input) {
      data {
        entityType
        entityId
        name
      }
    }
  }
`;

export const hubs = gql`
  query hubs($input: Hubs) {
    hubs(input: $input) {
      data {
        id
        status
        config {
          title
          url
          ownerFirstName
          ownerLastName
          ownerEmail
          locale
        }
        theme {
          actionColor
          backgroundColor
          logoImageRelativePath
          logoImageUrl
          logoAltText
          mainColor
          faviconUrl
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

export const hubSettings = gql`
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
      cookieLists {
        enableCvent
        cventUrl
        enableCustom
        customUrl
        customLinkText
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
      showLogo
      registrationBackground
      allowHubSearchEngineIndexing
    }
  }
`;

export const hubBanners = gql`
  query hubBanners($bannerSearch: BannerSearch) {
    hubBanners(bannerSearch: $bannerSearch) {
      data {
        id
        centerId
        name
        layout
        imageAlignment
        imageAltText
        text {
          title
          body
          alignment
          color
        }
        button {
          enabled
          text
          target
          targetType
          internalTarget
        }
      }
      paging {
        currentToken
        nextToken
        limit
      }
    }
  }
`;

export const bannerAssociations = gql`
  query bannerAssociations($bannerAssociationSearch: BannerAssociationSearch) {
    bannerAssociations(bannerAssociationSearch: $bannerAssociationSearch) {
      data {
        centerId
        entityType
        entityId
        displayOrder
        banner {
          id
          name
          layout
          imageAlignment
          imageAltText
          text {
            title
            body
            alignment
            color
          }
          button {
            enabled
            text
            target
            targetType
            internalTarget
          }
        }
      }
      paging {
        currentToken
        nextToken
        limit
      }
    }
  }
`;

export const centerFeatures = gql`
  query getCenterFeatures($id: HubSearch!) {
    getCenterFeatures(id: $id) {
      code
      enabled
    }
  }
`;

export const registrationFormSettings = gql`
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

export const updateRegistrationFormSettingsMutation = gql`
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

export const updateBrandingImages = gql`
  mutation updateBrandingImages($input: BrandingImagesInput!) {
    updateBrandingImages(input: $input) {
      id
      status
      config {
        title
        url
        ownerFirstName
        ownerLastName
        ownerEmail
        locale
        helpEmailAddress
      }
      theme {
        actionColor
        backgroundColor
        logoImageRelativePath
        logoImageUrl
        logoOriginalImageUrl
        logoAltText
        mainColor
        faviconUrl
      }
      calendar {
        id
      }
    }
  }
`;

export const getUtmOverrides = gql`
  query getUtmOverrides($input: HubSearch!) {
    getUtmOverrides(input: $input) {
      key
      value
    }
  }
`;

export const setUtmOverrides = gql`
  mutation setUtmOverrides($input: HubSearch!, $data: [UtmOverrideInput]) {
    setUtmOverrides(input: $input, data: $data) {
      key
      value
    }
  }
`;

export const getTranslations = gql`
  query getTranslations($input: TranslationSearch!) {
    getTranslations(input: $input) {
      paging {
        limit
        previousToken
        currentToken
        nextToken
        totalCount
      }
      data {
        type
        locale
        id
        translatedValue
        defaultValue
      }
    }
  }
`;

export const setTranslations = gql`
  mutation setTranslations($input: HubSearch!, $locale: String!, $data: [TranslationInput]) {
    setTranslations(input: $input, locale: $locale, data: $data) {
      Failure {
        type
        locale
        id
        translatedValue
      }
      Success {
        type
        locale
        id
        translatedValue
      }
    }
  }
`;

export const resetTranslations = gql`
  mutation resetTranslations($input: ResetTranslationSearch!) {
    resetTranslations(input: $input)
  }
`;

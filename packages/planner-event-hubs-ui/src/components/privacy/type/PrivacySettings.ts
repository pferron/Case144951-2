export interface PrivacySettings {
  allowHubSearchEngineIndexing: boolean;
  allowTurnOffGoogleAnalytics: boolean;
  displayPrivacyPolicy: boolean;
  privacyPolicyUrl: string;
  displayCventPrivacyPolicy: boolean;
  cventPrivacyPolicyLinkText: string;
  privacyPolicyLinkText: string;
  ccpaLinkText: string;
  ccpaConfirmationText: string;
  ccpaSubmitButtonText: string;
  ccpaDoNotSellUrlEnabled: boolean;
  ccpaDoNotSellUrl: string;
  ccpaLinkExplanationText: string;
  allowTurnOffCookies: boolean;
  termsText: string;
  termsLinkText: string;
  displayTermsOnLogin: boolean;
  ccpaEnableDoNotSell: boolean;
  notifyUsersAboutCookie: boolean;
  displayTermsLinkOnFooter: boolean;
  displayCventPrivacyPolicyInCookie: boolean;
  cookieLists: CookieList;
}

export interface CookieList {
  enableCvent: boolean;
  cventUrl: string;
  enableCustom: boolean;
  customUrl: string;
  customLinkText: string;
}

export interface ProfileSettings extends PrivacySettings {
  memberProfilePublic: boolean;
  profileCard: {
    border: string;
    branding: string;
    alignment: string;
    showName: boolean;
    allowNameEdit: boolean;
    showJobTitle: boolean;
    allowJobTitleEdit: boolean;
    showCompany: boolean;
    allowCompanyEdit: boolean;
    showHeadline: boolean;
    allowHeadlineEdit: boolean;
    showSocialMediaLinks: boolean;
    allowSocialMediaEdit: boolean;
  };
}

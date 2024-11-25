import { ChainablePromiseElement } from 'webdriverio';

class MemberProfilePage {
  get memberProfileVisibilityContainer(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="member-visibility-container"]');
  }

  get memberProfileVisibilityEditButton(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="member-visibility-edit-button"]');
  }

  get memberProfileFieldsEditButton(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="member-profile-fields-edit-button"]');
  }

  get memberProfileVisibleRadioButton(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="edit-member-visibility-radio-group__div__1"]');
  }

  get memberProfileVisibilitySaveButton(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="edit-member-visibility-save-button"]');
  }

  get memberProfileVisibilityCancelButton(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="edit-member-visibility-cancel-button"]');
  }

  get memberProfileVisibilitySettings(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="memberProfilePublic-answer"]');
  }

  get memberProfileFieldsContainer(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="member-profile-fields-container"]');
  }

  get memberProfileNameCard(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="name-card-title"]');
  }

  get memberProfileCompanyCard(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="company-card-title"]');
  }

  get memberProfileTitleCard(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="job-card-title"]');
  }

  get memberProfileSocialMediaLinksCard(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="social-media-card-title"]');
  }

  get memberProfileFieldValues(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="memberProfileCard-answer"]');
  }

  get memberProfileNameDontAllow(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('#profile-card-radio-allowNameEdit__1_label');
  }

  get memberProfileJobTitleDontAllow(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('#profile-card-radio-allowJobTitleEdit__1_label');
  }

  get memberProfileCompanyDontAllow(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('#profile-card-radio-allowCompanyEdit__1_label');
  }

  get memberProfileSocialMediaLinksDontAllow(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('#profile-card-radio-allowSocialMediaEdit__1_label');
  }

  get saveMemberProfileFields(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('button[data-cvent-id="edit-member-profile-fields-save-button"]');
  }

  get saveFeatureMemberProfileFields(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="header-actions__save"]');
  }

  get memberProfileJobTitleSwitch(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="job-card-control-switch"]');
  }

  get memberProfileCompanySwitch(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="company-card-control-switch"]');
  }

  get memberProfileEditMediaCard(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="edit-member-profile-fields"]');
  }

  get memberProfileSocialMediaLinksSwitch(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="social-media-card-control-switch"]');
  }

  get memberProfileJobCardActionContainer(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="job-card-actions-container"]');
  }

  get memberProfileCompanyActionContainer(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="company-card-actions-container"]');
  }

  get memberProfileSocialMediaActionContainer(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="social-media-card-control-container"]');
  }
}

export default new MemberProfilePage();

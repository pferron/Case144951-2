import { ChainablePromiseElement } from 'webdriverio';

class RegistrationSettingsPage {
  get registrationSettingsButton(): ChainablePromiseElement<WebdriverIO.Element> {
    return $("//a[contains(text(), 'Visitor Permissions')]");
  }

  get validDomainErrorMessage(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[aria-label="Enter a valid email domain name"]');
  }

  get visitorPermissionsTitle(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('h1[title="Visitor Permissions"]');
  }

  async editPencilIcon(element, testId): Promise<WebdriverIO.Element> {
    return element.$(`button[data-cvent-id="${testId}-edit-button"]`);
  }

  async savePencilIcon(element, testId): Promise<WebdriverIO.Element> {
    return element.$(`button[data-cvent-id="${testId}-save-button"]`);
  }

  get saveButton(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="header-actions__save"]');
  }

  get guestVisibilityCard(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="guest-visibility-field"]');
  }

  get allowedEmailDomainsCard(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="email-domain-fields"]');
  }

  get allowedContactList(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="allowed-contact-list-fields"]');
  }

  get blockedContactList(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="blocked-contact-list-fields"]');
  }

  get cancelGuestVisibilitySettings(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="edit-guest-visibility-field-cancel-button"]');
  }

  get cancelAllowedEmailDomains(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="edit-email-domains-fields-cancel-button"]');
  }

  get overRideVisibilitySettings(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="visibility-settings-override-save-button"]');
  }

  get overRideModal(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="visitor-permissions-confirmation-modal"]');
  }

  get contactGroupModal(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="contact-group-modal"]');
  }

  async overRideVisibilitySettingsModal(element): Promise<ChainablePromiseElement<WebdriverIO.Element>> {
    return element.$('[data-cvent-id="visibility-settings-override-save-button"]');
  }

  get overRideDeclineVisibilitySettings(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="visibility-settings-override-decline-button"]');
  }

  get editGuestVisibilityCard(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="edit-guest-visibility-field"]');
  }

  get editAllowedEmailDomainsCard(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="edit-email-domains-fields"]');
  }

  get editAllowedContactList(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="edit-allowed-contactlist-fields"]');
  }

  get guestVisibilityPrivateSelect(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="guest-visibility-2-radio__div__PRIVATE"]');
  }

  get guestVisibilityPublicSelect(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="guest-visibility-public-radio__div__PUBLIC"]');
  }

  get emailDomainInput(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="cvent-email-domains-input-textarea"]');
  }

  async searchContactsModalInputBox(element, testId): Promise<ChainablePromiseElement<WebdriverIO.Element>> {
    return element.$(`[data-cvent-id="${testId}-search-box-input"]`);
  }

  get searchContactGroupTableResult(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="contact-group-modal-table-row-0"]');
  }

  get searchContactGroupNoResult(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="contact-group-modal-no-search-result-container"]');
  }

  get searchContactGroupModalCloseButton(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="contact-group-modal-cross-button"]');
  }

  get allowAllContactSelect(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[id="allowAllContactsRegistration"]');
  }

  get allowContactGroupsSelect(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[id="allowContactGroupsRegistration"]');
  }

  get allowContactTypesSelect(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[id="allowContactTypesRegistration"]');
  }

  get customDomainsEmailButton(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="email-domain-type-2-radio__div__CUSTOM_DOMAINS"]');
  }

  get customDomainsEmailAddButton(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('button[aria-label="Add"]');
  }

  get blockedContactsSelect(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[id="blockedContactsFromRegistration"]');
  }

  get searchContactGroupButton(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('button[data-cvent-id="registration-settings-search-contact-groups"]');
  }

  get blockedContactsList(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="blocked-contact-list-fields"]');
  }

  get editBlockedContactList(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="edit-blocked-contact-list-fields"]');
  }

  get blockContactsSelectCheckBox(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[id="blockedContactsFromRegistration"]');
  }

  get searchContactsButton(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('button[data-cvent-id="registration-settings-search-contacts"]');
  }

  get blockedContactsModal(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="blocked-contacts-modal"]');
  }

  async searchContactsModalSaveButton(element, testId): Promise<ChainablePromiseElement<WebdriverIO.Element>> {
    return element.$(`[data-cvent-id="${testId}-save-button"]`);
  }

  get blockedContactsModalNoResult(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="blocked-contacts-modal-no-search-result-container"]');
  }

  get blockedContactsModalCloseButton(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="blocked-contacts-modal-cross-button"]');
  }

  get searchContactTypeButton(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('button[data-cvent-id="registration-settings-search-contact-types"]');
  }

  get contactTypeModal(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="contact-type-modal"]');
  }

  get contactTypeModalNoResult(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="contact-type-modal-no-search-result-container"]');
  }

  get searchContactTypeModalCloseButton(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="contact-type-modal-cross-button"]');
  }

  get searchBlockContactsTableResult(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="blocked-contacts-modal-table-row-0"]');
  }

  get searchContactTypeTableResult(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="contact-type-modal-table-row-0"]');
  }

  get searchContactsErrorText(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="registration_settings_allowed_contact_group_error"]');
  }

  get searchContactTypeErrorText(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="registration_settings_allowed_contact_type_error"]');
  }

  async searchContactGroupResultFirstRow(row): Promise<WebdriverIO.Element> {
    return $(`div[data-cvent-id="contact-group-modal-table-row-${row}"]`);
  }

  async selectCheckboxContactGroupModalBtText(element, text): Promise<WebdriverIO.Element> {
    return element.$(`//p[contains(text(), '${text}')]`);
  }

  get contactGroupSearchModalSaveButton(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="contact-group-modal-save-button"]');
  }

  get contactTypeSearchModalSaveButton(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="contact-type-modal-save-button"]');
  }

  get blockedContactSearchModalSaveButton(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="blocked-contacts-modal-save-button"]');
  }

  get searchBlockContactErrorText(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="registration_settings_blocked_contacts_error"]');
  }

  get exclusionListsSelectCheckBox(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[id="displayBlockedContactGroups"]');
  }

  get exclusionListsSearchButton(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('button[data-cvent-id="registration-settings-search-exclusion-lists"]');
  }

  get exclusionListModal(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="exclusion-lists-modal"]');
  }

  get searchExclusionListsTableRow(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="exclusion-lists-modal-table-row-0"]');
  }

  get exclusionListModalSaveButton(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('button[data-cvent-id="exclusion-lists-modal-save-button"]');
  }
}
export default new RegistrationSettingsPage();

import logger from '@wdio/logger';
import VideoCenterInformationPage from '../../pages/videoCenterInformation.page';
import { getConfigs } from '../../../configs/testConfig';
import RegistrationSettingsPage from '../../pages/registrationSettings.page';
import { createHub, deleteHub } from '../../apis/graphql/hub';
import { waitForClickableAndClick } from '../../utils/waitHelpers';
import { loginAsPlanner } from '../../utils/authUtils';
import CustomRegistrationPage from '../../pages/customRegistration.page';
import { readAppFeatures } from '../../apis/services/appFeaturesClient';

const { singleSignOnFeature = false, videoCenterInformationFeature = false } = readAppFeatures();

const Logger = logger('registrationSettings');
const configs = getConfigs();

let hubWithoutChannels;
const dataSetup = async (): Promise<void> => {
  [hubWithoutChannels] = await Promise.all([createHub()]);
};

afterAll(async () => {
  Logger.info('Running after hook registrationSettings');
  // Don't fail the build if these type of tear-downs fail/timeout
  try {
    await Promise.all([deleteHub(hubWithoutChannels)]);
  } catch (e) {
    Logger.error('Failed to delete hub in e2e tear-down', e);
  }
});

// MAUVE - Flaky test
/* eslint-disable */
xdescribe('Registration Settings Page', () => {
  let guestVisibilityCard;
  let allowedEmailDomainsCard;
  let allowedContactCard;
  let blockedContactsCard;

  it('logs in Videos using core UI, creates a video center via GraphQL', async () => {
    await loginAsPlanner();
    await dataSetup();
    await VideoCenterInformationPage.openPage(hubWithoutChannels);
    expect(await VideoCenterInformationPage.pageTitle).toBeDisplayed();
  });

  if (singleSignOnFeature) {
    it('navigates to registration settings sso feature enabled', async () => {
      await CustomRegistrationPage.accessManagementButton.click();
      await RegistrationSettingsPage.registrationSettingsButton.click();
      await browser.pause(configs.delay.uiBackgroundLoad);

      guestVisibilityCard = await RegistrationSettingsPage.guestVisibilityCard;
      allowedEmailDomainsCard = await RegistrationSettingsPage.allowedEmailDomainsCard;
      allowedContactCard = await RegistrationSettingsPage.allowedContactList;
      blockedContactsCard = await RegistrationSettingsPage.blockedContactsList;

      expect(RegistrationSettingsPage.visitorPermissionsTitle).toBeDisplayed();
      expect(guestVisibilityCard).toBeDisplayed();
      expect(allowedEmailDomainsCard).toBeDisplayed();
      expect(allowedContactCard).toBeDisplayed();
      expect(blockedContactsCard).toBeDisplayed();
    });
  } else {
    it('navigates to registration settings', async () => {
      await RegistrationSettingsPage.registrationSettingsButton.click();
      await browser.pause(configs.delay.uiBackgroundLoad);

      guestVisibilityCard = await RegistrationSettingsPage.guestVisibilityCard;
      allowedEmailDomainsCard = await RegistrationSettingsPage.allowedEmailDomainsCard;
      allowedContactCard = await RegistrationSettingsPage.allowedContactList;
      blockedContactsCard = await RegistrationSettingsPage.blockedContactsList;

      expect(RegistrationSettingsPage.visitorPermissionsTitle).toBeDisplayed();
      expect(guestVisibilityCard).toBeDisplayed();
      expect(allowedEmailDomainsCard).toBeDisplayed();
      expect(allowedContactCard).toBeDisplayed();
      expect(blockedContactsCard).toBeDisplayed();
    });
  }

  if (!videoCenterInformationFeature) {
    it('edits guest visibility settings and selects private visibility', async () => {
      Logger.trace('opening guest visibility edit mode');
      await (await RegistrationSettingsPage.editPencilIcon(guestVisibilityCard, 'guest-visibility-field')).click();

      await browser.pause(configs.delay.uiBackgroundLoad);
      const { editGuestVisibilityCard } = RegistrationSettingsPage;
      await expect(editGuestVisibilityCard).toBeDisplayed();

      await (await RegistrationSettingsPage.guestVisibilityPrivateSelect).click();
      Logger.trace('Saving Private guest visibility');
      await (
        await RegistrationSettingsPage.savePencilIcon(editGuestVisibilityCard, 'edit-guest-visibility-field')
      ).click();
      await browser.pause(configs.delay.uiBackgroundLoad);
      await expect(RegistrationSettingsPage.guestVisibilityCard).toBeDisplayed();
    });

    it('edits guest visibility settings and select back anyone can view', async () => {
      Logger.trace('opening guest visibility edit mode');
      await (await RegistrationSettingsPage.editPencilIcon(guestVisibilityCard, 'guest-visibility-field')).click();

      await browser.pause(configs.delay.uiBackgroundLoad);
      const { editGuestVisibilityCard } = RegistrationSettingsPage;
      await expect(editGuestVisibilityCard).toBeDisplayed();
      Logger.trace('Selecting Public guest visibility');
      await (await RegistrationSettingsPage.guestVisibilityPublicSelect).click();
      await (
        await RegistrationSettingsPage.savePencilIcon(editGuestVisibilityCard, 'edit-guest-visibility-field')
      ).click();
      const overRideRegistrationButton = RegistrationSettingsPage.overRideVisibilitySettings;
      await expect(overRideRegistrationButton).toBeDisplayed();
      const overRideDeclineRegistrationButton = RegistrationSettingsPage.overRideDeclineVisibilitySettings;
      await expect(overRideDeclineRegistrationButton).toBeDisplayed();
      await overRideDeclineRegistrationButton.click();
      await waitForClickableAndClick({ element: RegistrationSettingsPage.cancelGuestVisibilitySettings });
      await browser.pause(configs.delay.uiBackgroundLoad);
      await expect(RegistrationSettingsPage.guestVisibilityCard).toBeDisplayed();
    });
    it('edits allowed Email Domains', async () => {
      Logger.trace('opening allowed Email Domain edit mode');
      await (await RegistrationSettingsPage.editPencilIcon(allowedEmailDomainsCard, 'email-domain-fields')).click();

      await browser.pause(configs.delay.uiBackgroundLoad);
      const { editAllowedEmailDomainsCard } = RegistrationSettingsPage;
      await expect(editAllowedEmailDomainsCard).toBeDisplayed();
      await (await RegistrationSettingsPage.customDomainsEmailButton).click();
      await (await RegistrationSettingsPage.emailDomainInput).setValue('abcd.com, cvent.com');
      await (await RegistrationSettingsPage.customDomainsEmailAddButton).click();
      Logger.trace('Saving Email Domains');
      await (
        await RegistrationSettingsPage.savePencilIcon(editAllowedEmailDomainsCard, 'edit-email-domains-fields')
      ).click();
      const overRideModal = await RegistrationSettingsPage.overRideModal;
      await expect(overRideModal).toBeDisplayed();
      const overRideButton = await RegistrationSettingsPage.overRideVisibilitySettingsModal(overRideModal);
      expect(overRideButton).toBeDisplayed();
      await overRideButton.scrollIntoView();
      await overRideButton.click();
      await browser.pause(configs.delay.uiBackgroundLoad);
      await expect(RegistrationSettingsPage.allowedEmailDomainsCard).toBeDisplayed();
    });
    it('edits allowed Email Domains with Incorrect Domain input', async () => {
      Logger.trace('opening allowed Email Domain edit mode');
      await (await RegistrationSettingsPage.editPencilIcon(allowedEmailDomainsCard, 'email-domain-fields')).click();

      await browser.pause(configs.delay.uiBackgroundLoad);
      const { editAllowedEmailDomainsCard } = RegistrationSettingsPage;
      await expect(editAllowedEmailDomainsCard).toBeDisplayed();
      Logger.trace('Input incorrect Email Domains');
      await (await RegistrationSettingsPage.emailDomainInput).setValue('@abcd.com, cvent.com');
      await browser.pause(configs.delay.uiBackgroundLoad);
      await (await RegistrationSettingsPage.customDomainsEmailAddButton).click();
      Logger.trace('Valid domain error message');
      const domainErrorMessage = RegistrationSettingsPage.validDomainErrorMessage;
      await expect(domainErrorMessage).toBeDisplayed();
      await (
        await RegistrationSettingsPage.savePencilIcon(editAllowedEmailDomainsCard, 'edit-email-domains-fields')
      ).click();
      await browser.pause(configs.delay.uiBackgroundLoad);
    });

    it('allowed contacts: contact groups: verifies errors on no selections', async () => {
      Logger.trace('opening allowed contacts edit mode');
      await (await RegistrationSettingsPage.editPencilIcon(allowedContactCard, 'allowed-contact-list-fields')).click();
      await browser.pause(configs.delay.uiBackgroundLoad);
      const editAllowedContactsCard = RegistrationSettingsPage.editAllowedContactList;
      await expect(editAllowedContactsCard).toBeDisplayed();

      Logger.trace('Scrolling into view edit allowed contact');
      await (await RegistrationSettingsPage.allowContactGroupsSelect).scrollIntoView();
      await (await RegistrationSettingsPage.allowContactGroupsSelect).click();

      const allowContactGroups = RegistrationSettingsPage.allowContactGroupsSelect;
      await expect(allowContactGroups).toBeChecked();

      await (
        await RegistrationSettingsPage.savePencilIcon(editAllowedContactsCard, 'edit-allowed-contactlist-fields')
      ).click();
      await browser.pause(configs.delay.uiBackgroundLoad);
      await expect(RegistrationSettingsPage.searchContactsErrorText).toBeDisplayed();
      Logger.trace('Edit Allowed Modal does not close if checkbox is still selected');

      Logger.trace('Error should not displayed when contact group checkbox not selected');
      await (await RegistrationSettingsPage.allowContactGroupsSelect).click();
      await expect(allowContactGroups).not.toBeChecked();
      await browser.pause(configs.delay.uiBackgroundLoad);
      await expect(RegistrationSettingsPage.searchContactsErrorText).not.toBeDisplayed();
      Logger.trace('Error is not displayed when contact group checkbox not selected');

      await (
        await RegistrationSettingsPage.savePencilIcon(editAllowedContactsCard, 'edit-allowed-contactlist-fields')
      ).click();
      await browser.pause(configs.delay.uiBackgroundLoad);
      Logger.trace('Edit Allowed Modal closes when checkbox is not selected');
    });

    it('allowed contacts: contact types: verifies errors on no selections', async () => {
      Logger.trace('opening allowed contacts edit mode');
      await (await RegistrationSettingsPage.editPencilIcon(allowedContactCard, 'allowed-contact-list-fields')).click();
      await browser.pause(configs.delay.uiBackgroundLoad);
      const editAllowedContactsCard = RegistrationSettingsPage.editAllowedContactList;
      await expect(editAllowedContactsCard).toBeDisplayed();

      Logger.trace('Scrolling into view edit allowed contact');
      await (await RegistrationSettingsPage.allowContactTypesSelect).scrollIntoView();
      await (await RegistrationSettingsPage.allowContactTypesSelect).click();

      const allowContactGroups = RegistrationSettingsPage.allowContactTypesSelect;
      await expect(allowContactGroups).toBeChecked();

      await (
        await RegistrationSettingsPage.savePencilIcon(editAllowedContactsCard, 'edit-allowed-contactlist-fields')
      ).click();
      await browser.pause(configs.delay.uiBackgroundLoad);
      await expect(RegistrationSettingsPage.searchContactTypeErrorText).toBeDisplayed();
      Logger.trace('Edit Allowed Modal does not close if checkbox is still selected');

      Logger.trace('Error should not displayed when contact group checkbox not selected');
      await (await RegistrationSettingsPage.allowContactTypesSelect).click();
      await expect(allowContactGroups).not.toBeChecked();
      await browser.pause(configs.delay.uiBackgroundLoad);
      await expect(RegistrationSettingsPage.searchContactTypeErrorText).not.toBeDisplayed();
      Logger.trace('Error is not displayed when contact type checkbox not selected');

      await (
        await RegistrationSettingsPage.savePencilIcon(editAllowedContactsCard, 'edit-allowed-contactlist-fields')
      ).click();
      await browser.pause(configs.delay.uiBackgroundLoad);
      Logger.trace('Edit Allowed Modal closes when checkbox is not selected');
    });

    it('edits allowed Contacts and selects all contacts', async () => {
      Logger.trace('opening allowed contacts edit mode');
      await (await RegistrationSettingsPage.editPencilIcon(allowedContactCard, 'allowed-contact-list-fields')).click();
      await browser.pause(configs.delay.uiBackgroundLoad);
      const editAllowedContactsCard = RegistrationSettingsPage.editAllowedContactList;
      await expect(editAllowedContactsCard).toBeDisplayed();
      Logger.trace('Saving Allowed Contact List');
      await (await RegistrationSettingsPage.allowAllContactSelect).scrollIntoView();
      await (await RegistrationSettingsPage.allowAllContactSelect).click();

      const allowContactGroups = RegistrationSettingsPage.allowContactGroupsSelect;

      await expect(allowContactGroups).toBeDisabled();
      await (
        await RegistrationSettingsPage.savePencilIcon(editAllowedContactsCard, 'edit-allowed-contactlist-fields')
      ).click();
      const overRideModal = await RegistrationSettingsPage.overRideModal;
      await expect(overRideModal).toBeDisplayed();
      const overRideButton = await RegistrationSettingsPage.overRideVisibilitySettingsModal(overRideModal);
      expect(overRideButton).toBeDisplayed();
      await overRideButton.scrollIntoView();
      await overRideButton.click();
      await browser.pause(configs.delay.uiBackgroundLoad);
    });
    it('edits allowed Contacts Group and select for contacts groups', async () => {
      Logger.trace('opening allowed contacts edit mode');
      await (
        await RegistrationSettingsPage.editPencilIcon(allowedContactCard, 'allowed-contact-list-fields')
      ).scrollIntoView();
      await (await RegistrationSettingsPage.editPencilIcon(allowedContactCard, 'allowed-contact-list-fields')).click();

      await browser.pause(configs.delay.uiBackgroundLoad);
      const editAllowedContactsCard = RegistrationSettingsPage.editAllowedContactList;
      await expect(editAllowedContactsCard).toBeDisplayed();
      await (await RegistrationSettingsPage.allowAllContactSelect).click();
      await (await RegistrationSettingsPage.allowContactGroupsSelect).scrollIntoView();
      await (await RegistrationSettingsPage.allowContactGroupsSelect).click();
      await expect(await RegistrationSettingsPage.allowAllContactSelect).toBeDisabled();

      await RegistrationSettingsPage.searchContactGroupButton.click();
      await browser.pause(configs.delay.apiPost);
      Logger.trace('Selecting one contact group in Allowed Contact List for contact groups');
      const contactGroupModal = await RegistrationSettingsPage.contactGroupModal;
      await expect(contactGroupModal).toBeDisplayed();
      const searchInput = await RegistrationSettingsPage.searchContactsModalInputBox(
        contactGroupModal,
        'contact-group-modal'
      );
      await expect(searchInput).toBeDisplayed();
      await searchInput.setValue('E2E PEH');
      await browser.keys('Enter');
      await browser.pause(configs.delay.uiBackgroundLoad);

      const row0 = await RegistrationSettingsPage.searchContactGroupResultFirstRow(0);
      await (await RegistrationSettingsPage.selectCheckboxContactGroupModalBtText(row0, 'E2E PEH')).click();
      await (await RegistrationSettingsPage.contactGroupSearchModalSaveButton).click();

      Logger.trace('Saving Allowed Contact List for contact groups');
      await (
        await RegistrationSettingsPage.savePencilIcon(editAllowedContactsCard, 'edit-allowed-contactlist-fields')
      ).click();
      const overRideModal = await RegistrationSettingsPage.overRideModal;
      await expect(overRideModal).toBeDisplayed();
      const overRideButton = await RegistrationSettingsPage.overRideVisibilitySettingsModal(overRideModal);
      expect(overRideButton).toBeDisplayed();
      await overRideButton.scrollIntoView();
      await overRideButton.click();
      await browser.pause(configs.delay.uiBackgroundLoad);
    });
    it('edits allowed Contacts Group and search for contacts groups', async () => {
      Logger.trace('opening allowed contacts edit mode for search contact groups');
      await (
        await RegistrationSettingsPage.editPencilIcon(allowedContactCard, 'allowed-contact-list-fields')
      ).scrollIntoView();
      await (await RegistrationSettingsPage.editPencilIcon(allowedContactCard, 'allowed-contact-list-fields')).click();
      await browser.pause(configs.delay.uiBackgroundLoad);
      const editAllowedContactsCard = RegistrationSettingsPage.editAllowedContactList;
      await expect(editAllowedContactsCard).toBeDisplayed();
      await RegistrationSettingsPage.searchContactGroupButton.click();
      await browser.pause(configs.delay.apiPost);
      Logger.trace('search contact groups E2E PEH');
      const contactGroupModal = await RegistrationSettingsPage.contactGroupModal;
      await expect(contactGroupModal).toBeDisplayed();

      const searchInput = await RegistrationSettingsPage.searchContactsModalInputBox(
        contactGroupModal,
        'contact-group-modal'
      );
      await expect(searchInput).toBeDisplayed();
      await searchInput.setValue('E2E PEH');
      await browser.keys('Enter');
      await browser.pause(configs.delay.uiBackgroundLoad);
      const searchContactGroupResult = await RegistrationSettingsPage.searchContactsModalSaveButton(
        contactGroupModal,
        'contact-group-modal'
      );
      await expect(searchContactGroupResult).toBeDisplayed();
      const searchContactGroupTableResult = await RegistrationSettingsPage.searchContactGroupTableResult;
      await expect(searchContactGroupTableResult).toBeDisplayed();
      await searchInput.setValue('No Event');
      await browser.keys('Enter');
      await browser.pause(configs.delay.uiBackgroundLoad);
      const searchContactGroupNoResult = await RegistrationSettingsPage.searchContactGroupNoResult;
      await expect(searchContactGroupNoResult).toBeDisplayed();

      await (await RegistrationSettingsPage.searchContactGroupModalCloseButton).click();
      await (
        await RegistrationSettingsPage.savePencilIcon(editAllowedContactsCard, 'edit-allowed-contactlist-fields')
      ).click();
      await browser.pause(configs.delay.uiBackgroundLoad);
    });

    it('edits allowed Contacts Types and select for contacts types', async () => {
      Logger.trace('opening allowed contacts edit mode to select contact types');
      await (
        await RegistrationSettingsPage.editPencilIcon(allowedContactCard, 'allowed-contact-list-fields')
      ).scrollIntoView();
      await (await RegistrationSettingsPage.editPencilIcon(allowedContactCard, 'allowed-contact-list-fields')).click();

      await browser.pause(configs.delay.uiBackgroundLoad);
      const editAllowedContactsCard = RegistrationSettingsPage.editAllowedContactList;
      await expect(editAllowedContactsCard).toBeDisplayed();
      await (await RegistrationSettingsPage.allowContactTypesSelect).scrollIntoView();
      await (await RegistrationSettingsPage.allowContactTypesSelect).click();
      await expect(await RegistrationSettingsPage.allowAllContactSelect).toBeDisabled();

      Logger.trace('Selecting one contact in Allowed Contact List for contact type');
      await RegistrationSettingsPage.searchContactTypeButton.click();
      await browser.pause(configs.delay.apiPost);
      const contactTypeModal = await RegistrationSettingsPage.contactTypeModal;
      await expect(contactTypeModal).toBeDisplayed();
      const searchInput = await RegistrationSettingsPage.searchContactsModalInputBox(
        contactTypeModal,
        'contact-type-modal'
      );
      await expect(searchInput).toBeDisplayed();
      await searchInput.setValue('E2E PEH');
      await browser.keys('Enter');
      await browser.pause(configs.delay.uiBackgroundLoad);

      const row0 = await RegistrationSettingsPage.searchContactTypeTableResult;
      await (await RegistrationSettingsPage.selectCheckboxContactGroupModalBtText(row0, 'E2E PEH')).click();
      await (await RegistrationSettingsPage.contactTypeSearchModalSaveButton).click();

      Logger.trace('Saving Allowed Contact List for contact types');
      await (
        await RegistrationSettingsPage.savePencilIcon(editAllowedContactsCard, 'edit-allowed-contactlist-fields')
      ).click();
      const overRideModal = await RegistrationSettingsPage.overRideModal;
      await expect(overRideModal).toBeDisplayed();
      const overRideButton = await RegistrationSettingsPage.overRideVisibilitySettingsModal(overRideModal);
      expect(overRideButton).toBeDisplayed();
      await overRideButton.scrollIntoView();
      await overRideButton.click();
      await browser.pause(configs.delay.uiBackgroundLoad);
    });

    it('edits allowed Contacts Types and search for contacts types', async () => {
      Logger.trace('opening allowed contacts edit mode for search contact types');
      await (
        await RegistrationSettingsPage.editPencilIcon(allowedContactCard, 'allowed-contact-list-fields')
      ).scrollIntoView();
      await (await RegistrationSettingsPage.editPencilIcon(allowedContactCard, 'allowed-contact-list-fields')).click();
      await browser.pause(configs.delay.uiBackgroundLoad);
      const editAllowedContactsCard = RegistrationSettingsPage.editAllowedContactList;
      await expect(editAllowedContactsCard).toBeDisplayed();
      await RegistrationSettingsPage.searchContactTypeButton.click();
      await browser.pause(configs.delay.apiPost);
      Logger.trace('search contact types E2E PEH');
      const contactTypeModal = await RegistrationSettingsPage.contactTypeModal;
      await expect(contactTypeModal).toBeDisplayed();

      const searchInput = await RegistrationSettingsPage.searchContactsModalInputBox(
        contactTypeModal,
        'contact-type-modal'
      );
      await expect(searchInput).toBeDisplayed();
      await searchInput.setValue('E2E PEH');
      await browser.keys('Enter');
      await browser.pause(configs.delay.uiBackgroundLoad);
      const searchContactTypeResult = await RegistrationSettingsPage.searchContactsModalSaveButton(
        contactTypeModal,
        'contact-type-modal'
      );
      await expect(searchContactTypeResult).toBeDisplayed();
      const searchContactTypeTableResult = await RegistrationSettingsPage.searchContactTypeTableResult;
      await expect(searchContactTypeTableResult).toBeDisplayed();
      await searchInput.setValue('No Event');
      await browser.keys('Enter');
      await browser.pause(configs.delay.uiBackgroundLoad);
      const searchContactTypeNoResult = await RegistrationSettingsPage.contactTypeModalNoResult;
      await expect(searchContactTypeNoResult).toBeDisplayed();

      await (await RegistrationSettingsPage.searchContactTypeModalCloseButton).click();
      await (
        await RegistrationSettingsPage.savePencilIcon(editAllowedContactsCard, 'edit-allowed-contactlist-fields')
      ).click();
      await browser.pause(configs.delay.uiBackgroundLoad);
    });

    it('blocked contacts: contact: verifies errors on no selections', async () => {
      Logger.trace('opening blocked contacts edit mode');
      await (
        await RegistrationSettingsPage.editPencilIcon(blockedContactsCard, 'blocked-contact-list-fields')
      ).scrollIntoView();
      await (await RegistrationSettingsPage.editPencilIcon(blockedContactsCard, 'blocked-contact-list-fields')).click();
      await browser.pause(configs.delay.uiBackgroundLoad);
      const { editBlockedContactList } = RegistrationSettingsPage;
      await expect(editBlockedContactList).toBeDisplayed();

      Logger.trace('Scrolling into view edit blocked contact');
      await (await RegistrationSettingsPage.blockedContactsSelect).scrollIntoView();
      await (await RegistrationSettingsPage.blockedContactsSelect).click();

      const { blockedContactsSelect } = RegistrationSettingsPage;
      await expect(blockedContactsSelect).toBeChecked();

      await (
        await RegistrationSettingsPage.savePencilIcon(editBlockedContactList, 'edit-blocked-contact-list-fields')
      ).click();
      await browser.pause(configs.delay.uiBackgroundLoad);
      await expect(RegistrationSettingsPage.searchBlockContactErrorText).toBeDisplayed();
      Logger.trace('Edit blocked modal does not close if checkbox is still selected with errors');

      Logger.trace('Error should not displayed when select contact checkbox not selected');
      await (await RegistrationSettingsPage.blockedContactsSelect).click();
      await expect(blockedContactsSelect).not.toBeChecked();
      await browser.pause(configs.delay.uiBackgroundLoad);
      await expect(RegistrationSettingsPage.searchBlockContactErrorText).not.toBeDisplayed();
      Logger.trace('Error is not displayed when select contact checkbox not selected');

      await (
        await RegistrationSettingsPage.savePencilIcon(editBlockedContactList, 'edit-blocked-contact-list-fields')
      ).click();
      await browser.pause(configs.delay.uiBackgroundLoad);
      Logger.trace('Edit blocked contacts modal closes when checkbox is not selected');
    });

    it('edits blocked contacts and select a contact to block', async () => {
      Logger.trace('opening blocked contacts edit mode');
      await (await RegistrationSettingsPage.editPencilIcon(blockedContactsCard, 'blocked-contact-list-fields')).click();
      await browser.pause(configs.delay.uiBackgroundLoad);
      const editBlockedContactsCard = RegistrationSettingsPage.editBlockedContactList;
      await expect(editBlockedContactsCard).toBeDisplayed();
      await (await RegistrationSettingsPage.blockContactsSelectCheckBox).scrollIntoView();
      await (await RegistrationSettingsPage.blockContactsSelectCheckBox).click();

      Logger.trace('Selecting one contact in blocked Contact List');
      await RegistrationSettingsPage.searchContactsButton.click();
      await browser.pause(configs.delay.apiPost);
      const blockedContactModal = await RegistrationSettingsPage.blockedContactsModal;
      await expect(blockedContactModal).toBeDisplayed();
      const searchInput = await RegistrationSettingsPage.searchContactsModalInputBox(
        blockedContactModal,
        'blocked-contacts-modal'
      );
      await expect(searchInput).toBeDisplayed();
      await searchInput.setValue('E2E.PEH@j.mail');
      await browser.keys('Enter');
      await browser.pause(configs.delay.uiBackgroundLoad);

      const row0 = await RegistrationSettingsPage.searchBlockContactsTableResult;
      await (await RegistrationSettingsPage.selectCheckboxContactGroupModalBtText(row0, 'E2E.PEH@j.mail')).click();
      await (await RegistrationSettingsPage.blockedContactSearchModalSaveButton).click();
      await browser.pause(configs.delay.uiBackgroundSave);

      Logger.trace('Saving Blocked Contacts List');
      await (
        await RegistrationSettingsPage.savePencilIcon(editBlockedContactsCard, 'edit-blocked-contact-list-fields')
      ).click();
      const overRideModal = await RegistrationSettingsPage.overRideModal;
      await expect(overRideModal).toBeDisplayed();
      const overRideButton = await RegistrationSettingsPage.overRideVisibilitySettingsModal(overRideModal);
      expect(overRideButton).toBeDisplayed();
      await overRideButton.scrollIntoView();
      await overRideButton.click();
      await browser.pause(configs.delay.uiBackgroundLoad);
    });

    it('edits blocked contacts and search for contacts', async () => {
      Logger.trace('opening blocked contacts edit mode for search contacts');
      await (await RegistrationSettingsPage.editPencilIcon(blockedContactsCard, 'blocked-contact-list-fields')).click();
      await browser.pause(configs.delay.uiBackgroundLoad);
      const editBlockedContactsCard = RegistrationSettingsPage.editBlockedContactList;
      await expect(editBlockedContactsCard).toBeDisplayed();
      await RegistrationSettingsPage.searchContactsButton.click();
      await browser.pause(configs.delay.apiPost);
      Logger.trace('search contacts E2E PEH');
      const blockedContactsModal = await RegistrationSettingsPage.blockedContactsModal;
      await expect(blockedContactsModal).toBeDisplayed();
      const searchInput = await RegistrationSettingsPage.searchContactsModalInputBox(
        blockedContactsModal,
        'blocked-contacts-modal'
      );
      await expect(searchInput).toBeDisplayed();
      await searchInput.setValue('E2E');
      await browser.keys('Enter');
      await browser.pause(configs.delay.uiBackgroundLoad);
      const searchContactsResult = await RegistrationSettingsPage.searchContactsModalSaveButton(
        blockedContactsModal,
        'blocked-contacts-modal'
      );
      await expect(searchContactsResult).toBeDisplayed();
      const searchBlockContactsTableResult = await RegistrationSettingsPage.searchBlockContactsTableResult;
      await expect(searchBlockContactsTableResult).toBeDisplayed();
      await searchInput.setValue('No Event');
      await browser.keys('Enter');
      await browser.pause(configs.delay.uiBackgroundLoad);
      const searchContactsNoResult = await RegistrationSettingsPage.blockedContactsModalNoResult;
      await expect(searchContactsNoResult).toBeDisplayed();

      await (await RegistrationSettingsPage.blockedContactsModalCloseButton).click();
      await (
        await RegistrationSettingsPage.savePencilIcon(editBlockedContactsCard, 'edit-blocked-contact-list-fields')
      ).click();
      await browser.pause(configs.delay.uiBackgroundLoad);
    });

    it('edits blocked contacts and select an exclusion list to block', async () => {
      Logger.trace('opening blocked contacts edit mode');
      await (await RegistrationSettingsPage.editPencilIcon(blockedContactsCard, 'blocked-contact-list-fields')).click();
      await browser.pause(configs.delay.uiBackgroundLoad);
      const editBlockedContactsCard = RegistrationSettingsPage.editBlockedContactList;
      await browser.pause(configs.delay.uiBackgroundLoad);
      await expect(editBlockedContactsCard).toBeDisplayed();
      await (await RegistrationSettingsPage.exclusionListsSelectCheckBox).scrollIntoView();
      await (await RegistrationSettingsPage.exclusionListsSelectCheckBox).click();
      Logger.trace('Selecting an exclusion list');
      const searchExlusionListButton = await RegistrationSettingsPage.exclusionListsSearchButton;
      expect(searchExlusionListButton).toBeDisplayed();
      await searchExlusionListButton.click();
      await browser.pause(configs.delay.uiBackgroundLoad);
      const exclusionListModal = await RegistrationSettingsPage.exclusionListModal;
      expect(exclusionListModal).toBeDisplayed();
      const exclusionListTableRow = await RegistrationSettingsPage.searchExclusionListsTableRow;
      await exclusionListTableRow.click();
      await (await RegistrationSettingsPage.exclusionListModalSaveButton).click();
      await browser.pause(configs.delay.uiBackgroundLoad);
      Logger.trace('Saving Selected Exclusion List');
      await (
        await RegistrationSettingsPage.savePencilIcon(editBlockedContactsCard, 'edit-blocked-contact-list-fields')
      ).click();
      const overRideModal = await RegistrationSettingsPage.overRideModal;
      await expect(overRideModal).toBeDisplayed();
      const overRideButton = await RegistrationSettingsPage.overRideVisibilitySettingsModal(overRideModal);
      expect(overRideButton).toBeDisplayed();
      await overRideButton.scrollIntoView();
      await overRideButton.click();
      await browser.pause(configs.delay.uiBackgroundLoad);
    });
  } else {
    it('new edits guest visibility settings and selects private visibility', async () => {
      Logger.trace('opening guest visibility edit mode');

      await browser.pause(configs.delay.uiBackgroundLoad);
      const { editGuestVisibilityCard } = RegistrationSettingsPage;
      await expect(editGuestVisibilityCard).toBeDisplayed();

      await (await RegistrationSettingsPage.guestVisibilityPrivateSelect).click();
      Logger.trace('Saving Private guest visibility');
      await (await RegistrationSettingsPage.saveButton).click();
    });

    it('new edits allowed Email Domains', async () => {
      Logger.trace('opening allowed Email Domain edit mode');
      await browser.pause(configs.delay.uiBackgroundLoad);
      const { editAllowedEmailDomainsCard } = RegistrationSettingsPage;
      await expect(editAllowedEmailDomainsCard).toBeDisplayed();
      await (await RegistrationSettingsPage.customDomainsEmailButton).click();
      await (await RegistrationSettingsPage.emailDomainInput).setValue('abcd.com, cvent.com');
      await (await RegistrationSettingsPage.customDomainsEmailAddButton).click();
      Logger.trace('Saving Email Domains');
      await (await RegistrationSettingsPage.saveButton).click();
      await browser.pause(configs.delay.uiBackgroundLoad);
    });

    it('new edits allowed Email Domains with Incorrect Domain input', async () => {
      Logger.trace('opening allowed Email Domain edit mode');
      await browser.pause(configs.delay.uiBackgroundLoad);
      const { editAllowedEmailDomainsCard } = RegistrationSettingsPage;
      await expect(editAllowedEmailDomainsCard).toBeDisplayed();
      await (await editAllowedEmailDomainsCard).scrollIntoView();
      Logger.trace('Input incorrect Email Domains');
      await (await RegistrationSettingsPage.emailDomainInput).setValue('@abcd.com, cvent.com');
      await browser.pause(configs.delay.uiBackgroundLoad);
      await (await RegistrationSettingsPage.customDomainsEmailAddButton).click();
      Logger.trace('Valid domain error message');
      const domainErrorMessage = RegistrationSettingsPage.validDomainErrorMessage;
      await expect(domainErrorMessage).toBeDisplayed();
      await browser.pause(configs.delay.uiBackgroundLoad);
    });

    it('new allowed contacts: contact groups: verifies errors on no selections', async () => {
      Logger.trace('opening allowed contacts edit mode');
      await browser.pause(configs.delay.uiBackgroundLoad);
      const editAllowedContactsCard = RegistrationSettingsPage.editAllowedContactList;
      await expect(editAllowedContactsCard).toBeDisplayed();
      await (await editAllowedContactsCard).scrollIntoView();
      Logger.trace('Scrolling into view edit allowed contact');
      await (await RegistrationSettingsPage.allowContactGroupsSelect).scrollIntoView();
      await (await RegistrationSettingsPage.allowContactGroupsSelect).click();

      const allowContactGroups = RegistrationSettingsPage.allowContactGroupsSelect;
      await expect(allowContactGroups).toBeChecked();

      await (await RegistrationSettingsPage.saveButton).click();
      await browser.pause(configs.delay.uiBackgroundLoad);
      await (await RegistrationSettingsPage.searchContactsErrorText).scrollIntoView();
      await expect(RegistrationSettingsPage.searchContactsErrorText).toBeDisplayed();
      Logger.trace('Edit Allowed Modal does not close if checkbox is still selected');

      Logger.trace('Error should not displayed when contact group checkbox not selected');
      await (await RegistrationSettingsPage.allowContactGroupsSelect).click();
      await expect(allowContactGroups).not.toBeChecked();
      await browser.pause(configs.delay.uiBackgroundLoad);
      await expect(RegistrationSettingsPage.searchContactsErrorText).not.toBeDisplayed();
      Logger.trace('Error is not displayed when contact group checkbox not selected');

      await (await RegistrationSettingsPage.saveButton).click();
      await browser.pause(configs.delay.uiBackgroundLoad);
      Logger.trace('Edit Allowed Modal closes when checkbox is not selected');
    });

    it('new edits allowed Contacts and selects all contacts', async () => {
      Logger.trace('opening allowed contacts edit mode');
      await browser.pause(configs.delay.uiBackgroundLoad);
      const editAllowedContactsCard = RegistrationSettingsPage.editAllowedContactList;
      await expect(editAllowedContactsCard).toBeDisplayed();
      await (await editAllowedContactsCard).scrollIntoView();
      Logger.trace('Saving Allowed Contact List');
      await (await RegistrationSettingsPage.allowAllContactSelect).scrollIntoView();
      await (await RegistrationSettingsPage.allowAllContactSelect).click();

      const allowContactGroups = RegistrationSettingsPage.allowContactGroupsSelect;

      await expect(allowContactGroups).toBeDisabled();
      await (await RegistrationSettingsPage.saveButton).click();
      await browser.pause(configs.delay.uiBackgroundLoad);
    });

    it('new blocked contacts: contact: verifies errors on no selections', async () => {
      Logger.trace('opening blocked contacts edit mode');
      await browser.pause(configs.delay.uiBackgroundLoad);
      const { editBlockedContactList } = RegistrationSettingsPage;
      await expect(editBlockedContactList).toBeDisplayed();

      Logger.trace('Scrolling into view edit blocked contact');
      await (await RegistrationSettingsPage.blockedContactsSelect).scrollIntoView();
      await (await RegistrationSettingsPage.blockedContactsSelect).click();

      const { blockedContactsSelect } = RegistrationSettingsPage;
      await expect(blockedContactsSelect).toBeChecked();

      await (await RegistrationSettingsPage.saveButton).click();
      await browser.pause(configs.delay.uiBackgroundLoad);
      await expect(RegistrationSettingsPage.searchBlockContactErrorText).toBeDisplayed();
      Logger.trace('Edit blocked modal does not close if checkbox is still selected with errors');

      Logger.trace('Error should not displayed when select contact checkbox not selected');
      await (await RegistrationSettingsPage.blockedContactsSelect).click();
      await expect(blockedContactsSelect).not.toBeChecked();
      await browser.pause(configs.delay.uiBackgroundLoad);
      await expect(RegistrationSettingsPage.searchBlockContactErrorText).not.toBeDisplayed();
      Logger.trace('Error is not displayed when select contact checkbox not selected');
      await browser.pause(configs.delay.uiBackgroundLoad);
      Logger.trace('Edit blocked contacts modal closes when checkbox is not selected');
    });

    it('new - edits allowed Contacts Group and select for contacts groups', async () => {
      Logger.trace('opening allowed contacts edit mode');
      await browser.pause(configs.delay.uiBackgroundLoad);
      const editAllowedContactsCard = RegistrationSettingsPage.editAllowedContactList;
      await expect(editAllowedContactsCard).toBeDisplayed();
      await browser.pause(configs.delay.uiBackgroundLoad);
      await (await RegistrationSettingsPage.allowAllContactSelect).click();
      await (await RegistrationSettingsPage.allowContactGroupsSelect).scrollIntoView();
      await (await RegistrationSettingsPage.allowContactGroupsSelect).click();
      await expect(await RegistrationSettingsPage.allowAllContactSelect).toBeDisabled();

      await RegistrationSettingsPage.searchContactGroupButton.click();
      await browser.pause(configs.delay.apiPost);
    });

    it('new - edits allowed Contacts Group and select and search for contacts groups', async () => {
      Logger.trace('Selecting one contact group in Allowed Contact List for contact groups');
      const contactGroupModal = await RegistrationSettingsPage.contactGroupModal;
      await expect(contactGroupModal).toBeDisplayed();
      const searchInput = await RegistrationSettingsPage.searchContactsModalInputBox(
        contactGroupModal,
        'contact-group-modal'
      );
      await expect(searchInput).toBeDisplayed();
      await searchInput.setValue('E2E PEH');
      await browser.keys('Enter');
      await browser.pause(configs.delay.uiBackgroundLoad);

      const row0 = await RegistrationSettingsPage.searchContactGroupResultFirstRow(0);
      await (await RegistrationSettingsPage.selectCheckboxContactGroupModalBtText(row0, 'E2E PEH')).click();
      await (await RegistrationSettingsPage.contactGroupSearchModalSaveButton).click();
      Logger.trace('Saving Allowed Contact List for contact groups');
    });

    it('new - edits allowed Contacts Group and search for contacts groups', async () => {
      Logger.trace('opening allowed contacts edit mode for search contact groups');
      await browser.pause(configs.delay.uiBackgroundLoad);
      const editAllowedContactsCard = RegistrationSettingsPage.editAllowedContactList;
      await expect(editAllowedContactsCard).toBeDisplayed();
      await RegistrationSettingsPage.searchContactGroupButton.click();
      await browser.pause(configs.delay.apiPost);
      Logger.trace('search contact groups E2E PEH');
      const contactGroupModal = await RegistrationSettingsPage.contactGroupModal;
      await expect(contactGroupModal).toBeDisplayed();
      await (await RegistrationSettingsPage.saveButton).click();
      await (await RegistrationSettingsPage.allowContactGroupsSelect).scrollIntoView();
      await (await RegistrationSettingsPage.allowContactGroupsSelect).click();
    });

    it('new - edits allowed Contacts Types and select for contacts types', async () => {
      Logger.trace('opening allowed contacts edit mode to select contact types');
      await browser.pause(configs.delay.uiBackgroundLoad);
      const editAllowedContactsCard = RegistrationSettingsPage.editAllowedContactList;
      await expect(editAllowedContactsCard).toBeDisplayed();
      await (await RegistrationSettingsPage.allowContactTypesSelect).scrollIntoView();
      await (await RegistrationSettingsPage.allowContactTypesSelect).click();
      await expect(await RegistrationSettingsPage.allowAllContactSelect).toBeDisabled();
    });

    it('new - edits allowed Contacts Types and select and search for contacts types', async () => {
      Logger.trace('Selecting one contact in Allowed Contact List for contact type');
      await RegistrationSettingsPage.searchContactTypeButton.click();
      await browser.pause(configs.delay.apiPost);
      const contactTypeModal = await RegistrationSettingsPage.contactTypeModal;
      await expect(contactTypeModal).toBeDisplayed();
      const searchInput = await RegistrationSettingsPage.searchContactsModalInputBox(
        contactTypeModal,
        'contact-type-modal'
      );
      await expect(searchInput).toBeDisplayed();
      await searchInput.setValue('E2E PEH');
      await browser.keys('Enter');
      await browser.pause(configs.delay.uiBackgroundLoad);

      const row0 = await RegistrationSettingsPage.searchContactTypeTableResult;
      await (await RegistrationSettingsPage.selectCheckboxContactGroupModalBtText(row0, 'E2E PEH')).click();
      await (await RegistrationSettingsPage.contactTypeSearchModalSaveButton).click();
      Logger.trace('Saving Allowed Contact List for contact types');
      await (await RegistrationSettingsPage.saveButton).click();
    });

    it('new - edits blocked contacts and select a contact to block', async () => {
      Logger.trace('opening blocked contacts edit mode');
      await browser.pause(configs.delay.uiBackgroundLoad);
      const editBlockedContactsCard = RegistrationSettingsPage.editBlockedContactList;
      await expect(editBlockedContactsCard).toBeDisplayed();
      await (await RegistrationSettingsPage.blockContactsSelectCheckBox).scrollIntoView();
      await (await RegistrationSettingsPage.blockContactsSelectCheckBox).click();
      Logger.trace('Selecting one contact in blocked Contact List');
    });

    it('new - edits blocked contacts and select and search a contact to block', async () => {
      await RegistrationSettingsPage.searchContactsButton.click();
      await browser.pause(configs.delay.apiPost);
      const blockedContactModal = await RegistrationSettingsPage.blockedContactsModal;
      await expect(blockedContactModal).toBeDisplayed();
      const searchInput = await RegistrationSettingsPage.searchContactsModalInputBox(
        blockedContactModal,
        'blocked-contacts-modal'
      );
      await expect(searchInput).toBeDisplayed();
      await searchInput.setValue('E2E.PEH@j.mail');
      await browser.keys('Enter');
      await browser.pause(configs.delay.uiBackgroundLoad);

      const row0 = await RegistrationSettingsPage.searchBlockContactsTableResult;
      await (await RegistrationSettingsPage.selectCheckboxContactGroupModalBtText(row0, 'E2E.PEH@j.mail')).click();
      await (await RegistrationSettingsPage.blockedContactSearchModalSaveButton).click();
      await browser.pause(configs.delay.uiBackgroundSave);
      Logger.trace('Saving Blocked Contacts List');
      await (await RegistrationSettingsPage.saveButton).click();
    });

    it('new - edits blocked contacts and select an exclusion list to block', async () => {
      Logger.trace('opening blocked contacts edit mode');
      await browser.pause(configs.delay.uiBackgroundLoad);
      const editBlockedContactsCard = RegistrationSettingsPage.editBlockedContactList;
      await expect(editBlockedContactsCard).toBeDisplayed();
      await (await RegistrationSettingsPage.exclusionListsSelectCheckBox).scrollIntoView();
      await (await RegistrationSettingsPage.exclusionListsSelectCheckBox).click();
      Logger.trace('Selecting an exclusion list');
      const searchExlusionListButton = await RegistrationSettingsPage.exclusionListsSearchButton;
      expect(searchExlusionListButton).toBeDisplayed();
      await searchExlusionListButton.click();
    });

    it('new - edits blocked contacts and save an exclusion list to block', async () => {
      await browser.pause(configs.delay.uiBackgroundLoad);
      const exclusionListModal = await RegistrationSettingsPage.exclusionListModal;
      expect(exclusionListModal).toBeDisplayed();
      const exclusionListTableRow = await RegistrationSettingsPage.searchExclusionListsTableRow;
      await exclusionListTableRow.click();
      await (await RegistrationSettingsPage.exclusionListModalSaveButton).click();
      await browser.pause(configs.delay.uiBackgroundLoad);
      Logger.trace('Saving Selected Exclusion List');
      await (await RegistrationSettingsPage.saveButton).click();
    });
  }
});

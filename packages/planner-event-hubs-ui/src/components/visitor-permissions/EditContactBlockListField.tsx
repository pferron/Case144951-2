import React, { useEffect, useMemo, useState } from 'react';
import { Col } from '@cvent/carina/components/Col';
import { Row } from '@cvent/carina/components/Row';
import { Form } from '@cvent/carina/components/Forms';
import FormElement from '@cvent/carina/components/FormElement/FormElement';
import { useStyle } from '@hooks/useStyle';
import { useTranslate } from 'nucleus-text';
import { VisitorPermissionsProps } from '@components/visitor-permissions/type/VisitorPermissionsProps';
import CardContainer from '@components/visitor-permissions/CardContainer';
import { EditAllowContactListFieldsStyle } from '@components/visitor-permissions/style';
import { Checkbox as CheckBox } from '@cvent/carina/components/Checkbox';
import { Button } from '@cvent/carina/components/Button';
import VisitorPermissionsEditModal from '@components/visitor-permissions/VisitorPermissionConfirmationModal';
import BlockedContactsModal from '@components/visitor-permissions/BlockedContactsModal';
import ExclusionListModal from '@components/visitor-permissions/ExclusionListModal';

function EditContactBlockListField({
  saveChangesModalOpen,
  setSaveChangesModalOpen,
  registrationSettings: originalSettings,
  onSave: originalOnSave,
  onCancel,
  isEdit,
  setIsPageEdited
}: Props): JSX.Element {
  const styles = useStyle(EditAllowContactListFieldsStyle);
  const { translate } = useTranslate();
  const [registrationSettings, setRegistrationSettings] = useState(originalSettings);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isExclusionListOpen, setIsExclusionListOpen] = useState(false);
  const [showBlockedContactsError, setShowBlockedContactsError] = useState(false);
  const [showExclusionListError, setShowExclusionListError] = useState(false);
  const [contactSelected, setContactSelected] = useState(registrationSettings.blockedContacts);
  const [exclusionListSelected, setExclusionListSelected] = useState(registrationSettings.blockedContactGroups);
  const onSave = () => {
    if (errors) {
      if (!isAtLeastOneContactSelected) setShowBlockedContactsError(true);
      if (!isAtLeastOneExclusionListSelected) setShowExclusionListError(true);
      return;
    }
    if (
      !(
        contactSelected.every(item => originalSettings.blockedContacts.includes(item)) &&
        originalSettings.blockedContacts.every(item => contactSelected.includes(item))
      ) ||
      !(
        exclusionListSelected.every(item => originalSettings.blockedContactGroups.includes(item)) &&
        originalSettings.blockedContactGroups.every(item => exclusionListSelected.includes(item))
      ) ||
      JSON.stringify(originalSettings) !== JSON.stringify(registrationSettings)
    )
      setSaveChangesModalOpen(true);
    else {
      originalOnSave({
        ...registrationSettings,
        blockedContacts: contactSelected,
        blockedContactGroups: exclusionListSelected
      });
    }
    setIsPageEdited(false);
  };

  const blockedContactChecked =
    !originalSettings.registrationSettingConfigs.blockContactsRegistration &&
    registrationSettings.registrationSettingConfigs.blockContactsRegistration;

  const exclusionListChecked =
    !originalSettings.registrationSettingConfigs.blockListRegistration &&
    registrationSettings.registrationSettingConfigs.blockListRegistration;

  const newlySelectedBlockedContactsCount = contactSelected.filter(
    contact => !registrationSettings.blockedContacts.includes(contact)
  ).length;

  const newlySelectedExclusionListsCount = exclusionListSelected.filter(
    contactGroup => !registrationSettings.blockedContactGroups.includes(contactGroup)
  ).length;

  const saveBlockListModal = useMemo(
    () =>
      blockedContactChecked ||
      exclusionListChecked ||
      newlySelectedBlockedContactsCount + newlySelectedExclusionListsCount > 0,
    [blockedContactChecked, exclusionListChecked, newlySelectedBlockedContactsCount, newlySelectedExclusionListsCount]
  );

  const isAtLeastOneContactSelected = !(
    contactSelected.length === 0 && registrationSettings.registrationSettingConfigs.blockContactsRegistration
  );

  const isAtLeastOneExclusionListSelected = !(
    exclusionListSelected.length === 0 && registrationSettings.registrationSettingConfigs.blockListRegistration
  );

  const errors = !isAtLeastOneContactSelected || !isAtLeastOneExclusionListSelected;

  useEffect(() => {
    setShowBlockedContactsError(false);
  }, [registrationSettings.registrationSettingConfigs.blockContactsRegistration, isContactOpen]);

  useEffect(() => {
    setShowExclusionListError(false);
  }, [registrationSettings.registrationSettingConfigs.blockListRegistration, isExclusionListOpen]);

  return (
    <CardContainer testID="edit-blocked-contact-list-fields" onSave={onSave} onCancel={onCancel} isEdit={isEdit}>
      <VisitorPermissionsEditModal
        onSaveButtonContent={
          saveBlockListModal
            ? translate('registration_settings_save_modal_save_button')
            : translate('registration_settings_contact_remove_modal_unblock_button')
        }
        onCancelButtonContent={translate('registration_settings_save_modal_cancel_button')}
        isModalOpen={saveChangesModalOpen}
        setIsModalOpen={setSaveChangesModalOpen}
        onSave={() => {
          originalOnSave({
            ...registrationSettings,
            blockedContacts: contactSelected,
            blockedContactGroups: exclusionListSelected
          });
          setSaveChangesModalOpen(false);
          setIsPageEdited(false);
        }}
        onCancel={() => {
          setSaveChangesModalOpen(false);
          setIsPageEdited(false);
        }}
        heading={
          saveBlockListModal
            ? translate('registration_settings_save_blocklist_modal_heading')
            : translate('registration_settings_contact_unblock_modal_heading')
        }
        content={
          saveBlockListModal
            ? translate('registration_settings_save_blocklist_modal_description')
            : translate('registration_settings_remove_blocked_contact_modal_description')
        }
      />
      <div>
        <h2 css={styles.title}>{translate('registration_settings_blocked_contacts')}</h2>
        <Form testID="blocked-contact-list-fields-form">
          <p css={styles.normalHeading}>
            {translate('registration_settings_blocked_contacts_not_allowed_to_register')}
          </p>
          <div>
            <Row>
              <Col padding={0}>
                <FormElement>
                  <FormElement.Label
                    label={translate('registration_settings_who_is_blocked')}
                    labelFor="blockedContacts"
                  />
                  <div css={styles.checkBox}>
                    <CheckBox
                      onKeyDown={(event): void => {
                        if (event.code === 'Enter') {
                          setRegistrationSettings(prev => ({
                            ...prev,
                            registrationSettingConfigs: {
                              ...prev.registrationSettingConfigs,
                              blockContactsRegistration:
                                !registrationSettings.registrationSettingConfigs.blockContactsRegistration
                            }
                          }));
                          setIsPageEdited(true);
                        }
                      }}
                      id="blockedContactsFromRegistration"
                      accessibilityLabel={translate('registration_settings_select_from_contacts')}
                      checked={registrationSettings.registrationSettingConfigs.blockContactsRegistration}
                      onChange={({ target }: React.ChangeEvent<HTMLInputElement>) => {
                        setRegistrationSettings(prev => ({
                          ...prev,
                          registrationSettingConfigs: {
                            ...prev.registrationSettingConfigs,
                            blockContactsRegistration: target.checked
                          }
                        }));
                        setIsPageEdited(true);
                      }}
                    >
                      {translate('registration_settings_select_from_contacts')}
                    </CheckBox>
                    {registrationSettings.registrationSettingConfigs.blockContactsRegistration && (
                      <div css={styles.searchContactGroupButton}>
                        <Button
                          aria-label={translate('registration_settings_search_contacts')}
                          onClick={(): void => {
                            setIsContactOpen(true);
                          }}
                          size="m"
                          testID="registration-settings-search-contacts"
                          appearance="lined"
                          text={translate('registration_settings_search_contacts')}
                        />
                      </div>
                    )}
                    {showBlockedContactsError && (
                      <div css={styles.errorTextNoSelection}>
                        <FormElement.Message
                          text={translate('registration_settings_blocked_contacts_error_none_selected')}
                          type="error"
                          accessibilityLabel={translate('registration_settings_blocked_contacts_error_none_selected')}
                          testID="registration_settings_blocked_contacts_error"
                        />
                      </div>
                    )}
                    {isContactOpen && (
                      <BlockedContactsModal
                        isOpen={isContactOpen}
                        setIsModalOpen={setIsContactOpen}
                        contactSelected={contactSelected}
                        setContactSelected={setContactSelected}
                        testId="blocked-contacts-modal"
                        modalTitle={translate('registration_settings_blocked_contacts_modal_title')}
                        tableHeading={translate('registration_settings_blocked_contacts_table_heading')}
                        searchBoxLabel={translate('registration-settings-blocked_contacts-search-textbox')}
                        originalBlockedContacts={originalSettings.blockedContacts}
                        setIsPageEdited={setIsPageEdited}
                      />
                    )}
                  </div>
                  <div css={styles.multiSelectCheckbox}>
                    <CheckBox
                      onKeyDown={(event): void => {
                        if (event.code === 'Enter') {
                          setRegistrationSettings(prev => ({
                            ...prev,
                            registrationSettingConfigs: {
                              ...prev.registrationSettingConfigs,
                              blockListRegistration:
                                !registrationSettings.registrationSettingConfigs.blockListRegistration
                            }
                          }));
                          setIsPageEdited(true);
                        }
                      }}
                      id="displayBlockedContactGroups"
                      accessibilityLabel={translate('registration_settings_select_exclusion_lists')}
                      checked={registrationSettings.registrationSettingConfigs.blockListRegistration}
                      onChange={({ target }: React.ChangeEvent<HTMLInputElement>) => {
                        setRegistrationSettings(prev => ({
                          ...prev,
                          registrationSettingConfigs: {
                            ...prev.registrationSettingConfigs,
                            blockListRegistration: target.checked
                          }
                        }));
                        setIsPageEdited(true);
                      }}
                    >
                      {translate('registration_settings_select_exclusion_lists')}
                    </CheckBox>
                    {registrationSettings.registrationSettingConfigs.blockListRegistration && (
                      <div css={styles.searchContactGroupButton}>
                        <Button
                          aria-label={translate('registration_settings_search_exclusion_lists')}
                          onClick={(): void => {
                            setIsExclusionListOpen(true);
                          }}
                          size="m"
                          testID="registration-settings-search-exclusion-lists"
                          appearance="lined"
                          text={translate('registration_settings_search_exclusion_lists')}
                        />
                      </div>
                    )}
                    {showExclusionListError && (
                      <div css={styles.errorTextNoSelection}>
                        <FormElement.Message
                          text={translate('registration_settings_blocked_contact_groups_error_none_selected')}
                          type="error"
                          accessibilityLabel={translate(
                            'registration_settings_blocked_contact_groups_error_none_selected'
                          )}
                          testID="registration_settings_blocked_contact_groups_error"
                        />
                      </div>
                    )}
                    {isExclusionListOpen && (
                      <ExclusionListModal
                        isOpen={isExclusionListOpen}
                        setIsModalOpen={setIsExclusionListOpen}
                        exclusionListSelected={exclusionListSelected}
                        setExclusionListSelected={setExclusionListSelected}
                        testId="exclusion-lists-modal"
                        modalTitle={translate('registration_settings_exclusion_lists_modal_title')}
                        tableHeading={translate('registration_settings_exclusion_lists_table_heading')}
                        searchBoxLabel={translate('registration_settings_exclusion_lists_search_textbox')}
                        originalExclusionLists={originalSettings.blockedContactGroups}
                        setIsPageEdited={setIsPageEdited}
                      />
                    )}
                  </div>
                </FormElement>
              </Col>
            </Row>
          </div>
        </Form>
      </div>
    </CardContainer>
  );
}

interface Props {
  saveChangesModalOpen: boolean;
  setSaveChangesModalOpen: (value: boolean) => void;
  registrationSettings: VisitorPermissionsProps;
  onSave: (settings: VisitorPermissionsProps) => void;
  onCancel: (settings: VisitorPermissionsProps) => void;
  isEdit: boolean;
  setIsPageEdited: (isPageEdited: boolean) => void;
}

export default EditContactBlockListField;

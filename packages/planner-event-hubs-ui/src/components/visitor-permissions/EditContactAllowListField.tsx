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
import ContactGroupModal from '@components/visitor-permissions/ContactGroupModal';
import VisitorPermissionsEditModal from '@components/visitor-permissions/VisitorPermissionConfirmationModal';
import ContactTypesModal from './ContactTypesModal';

function EditContactAllowListField({
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
  const [isContactGroupOpen, setIsContactGroupOpen] = useState(false);
  const [isContactTypeOpen, setIsContactTypeOpen] = useState(false);
  const [contactGroupSelected, setContactGroupSelected] = useState(registrationSettings.contactGroups);
  const [contactTypeSelected, setContactTypeSelected] = useState(registrationSettings.contactTypes);

  const [showAllowContactGroupsError, setShowAllowContactGroupsError] = useState(false);
  const [showAllowContactTypesError, setShowAllowContactTypesError] = useState(false);

  const onSave = () => {
    if (errors) {
      if (!isAtLeastOneContactGroupSelected) setShowAllowContactGroupsError(true);
      if (!isAtLeastOneContactTypeSelected) setShowAllowContactTypesError(true);
      return;
    }
    if (
      !(
        contactGroupSelected.every(item => originalSettings.contactGroups.includes(item)) &&
        originalSettings.contactGroups.every(item => contactGroupSelected.includes(item))
      ) ||
      !(
        contactTypeSelected.every(item => originalSettings.contactTypes.includes(item)) &&
        originalSettings.contactTypes.every(item => contactTypeSelected.includes(item))
      ) ||
      JSON.stringify(originalSettings) !== JSON.stringify(registrationSettings)
    )
      setSaveChangesModalOpen(true);
    else {
      originalOnSave({
        ...registrationSettings,
        contactGroups: contactGroupSelected,
        contactTypes: contactTypeSelected
      });
    }
    setIsPageEdited(false);
  };

  const contactGroupChecked =
    !originalSettings.registrationSettingConfigs.allowContactGroupsRegistration &&
    registrationSettings.registrationSettingConfigs.allowContactGroupsRegistration;

  const contactTypeChecked =
    !originalSettings.registrationSettingConfigs.allowContactTypesRegistration &&
    registrationSettings.registrationSettingConfigs.allowContactTypesRegistration;

  const allContactChecked =
    !originalSettings.registrationSettingConfigs.allowAllContactsRegistration &&
    registrationSettings.registrationSettingConfigs.allowAllContactsRegistration;

  const newlySelectedContactTypesCount = contactTypeSelected.filter(
    contactType => !registrationSettings.contactTypes.includes(contactType)
  ).length;

  const newlySelectedContactGroupCount = contactGroupSelected.filter(
    contactGroup => !registrationSettings.contactGroups.includes(contactGroup)
  ).length;

  const isAtLeastOneContactGroupSelected = !(
    contactGroupSelected.length === 0 && registrationSettings.registrationSettingConfigs.allowContactGroupsRegistration
  );
  const isAtLeastOneContactTypeSelected = !(
    contactTypeSelected.length === 0 && registrationSettings.registrationSettingConfigs.allowContactTypesRegistration
  );

  const errors = !isAtLeastOneContactGroupSelected || !isAtLeastOneContactTypeSelected;

  useEffect(() => {
    setShowAllowContactGroupsError(false);
  }, [registrationSettings.registrationSettingConfigs.allowContactGroupsRegistration, isContactGroupOpen]);

  useEffect(() => {
    setShowAllowContactTypesError(false);
  }, [registrationSettings.registrationSettingConfigs.allowContactTypesRegistration, isContactTypeOpen]);

  const saveChangesModal = useMemo(
    () =>
      allContactChecked ||
      contactGroupChecked ||
      contactTypeChecked ||
      newlySelectedContactGroupCount + newlySelectedContactTypesCount > 0,
    [
      allContactChecked,
      contactGroupChecked,
      contactTypeChecked,
      newlySelectedContactGroupCount,
      newlySelectedContactTypesCount
    ]
  );

  return (
    <CardContainer testID="edit-allowed-contactlist-fields" onSave={onSave} onCancel={onCancel} isEdit={isEdit}>
      <VisitorPermissionsEditModal
        onSaveButtonContent={
          !saveChangesModal
            ? translate('registration_settings_contact_remove_modal_remove_button')
            : translate('registration_settings_save_modal_save_button')
        }
        onCancelButtonContent={translate('registration_settings_save_modal_cancel_button')}
        isModalOpen={saveChangesModalOpen}
        setIsModalOpen={setSaveChangesModalOpen}
        onSave={() => {
          originalOnSave({
            ...registrationSettings,
            contactGroups: contactGroupSelected,
            contactTypes: contactTypeSelected
          });
          setSaveChangesModalOpen(false);
          setIsPageEdited(false);
        }}
        onCancel={() => {
          setSaveChangesModalOpen(false);
          setIsPageEdited(false);
        }}
        heading={
          !saveChangesModal
            ? translate('registration_settings_contact_remove_modal_heading')
            : translate('registration_settings_save_modal_heading')
        }
        content={
          !saveChangesModal
            ? translate('registration_settings_contact_remove_modal_description')
            : translate('registration_settings_save_modal_description')
        }
      />
      <div>
        <h2 css={styles.title}>{translate('registration_allowed_contacts')}</h2>
        <Form testID="contact-list--fields-form">
          <p css={styles.normalHeading}>{translate('registration_specify_who_can_register_by_contacts')}</p>
          <div>
            <Row>
              <Col padding={0}>
                <FormElement>
                  <FormElement.Label
                    label={translate('registration_who_can_register_for_video_center')}
                    labelFor="allowedContacts"
                  />
                  <div css={styles.checkBox}>
                    <CheckBox
                      onKeyDown={(event): void => {
                        if (event.code === 'Enter') {
                          setRegistrationSettings(prev => ({
                            ...prev,
                            registrationSettingConfigs: {
                              ...prev.registrationSettingConfigs,
                              allowAllContactsRegistration:
                                !registrationSettings.registrationSettingConfigs.allowAllContactsRegistration
                            }
                          }));
                          setIsPageEdited(true);
                        }
                      }}
                      id="allowAllContactsRegistration"
                      accessibilityLabel={translate('registration_select_all_contacts_from_address_book')}
                      disabled={
                        registrationSettings.registrationSettingConfigs.allowContactTypesRegistration ||
                        registrationSettings.registrationSettingConfigs.allowContactGroupsRegistration
                      }
                      checked={registrationSettings.registrationSettingConfigs.allowAllContactsRegistration}
                      onChange={({ target }: React.ChangeEvent<HTMLInputElement>) => {
                        setRegistrationSettings(prev => ({
                          ...prev,
                          registrationSettingConfigs: {
                            ...prev.registrationSettingConfigs,
                            allowAllContactsRegistration: target.checked
                          }
                        }));
                        setIsPageEdited(true);
                      }}
                    >
                      {translate('registration_select_all_contacts_from_address_book')}
                    </CheckBox>
                  </div>

                  <div css={styles.multiSelectCheckbox}>
                    <CheckBox
                      onKeyDown={(event): void => {
                        if (event.code === 'Enter') {
                          setRegistrationSettings(prev => ({
                            ...prev,
                            registrationSettingConfigs: {
                              ...prev.registrationSettingConfigs,
                              allowContactGroupsRegistration:
                                !registrationSettings.registrationSettingConfigs.allowContactGroupsRegistration
                            }
                          }));
                          setIsPageEdited(true);
                        }
                      }}
                      id="allowContactGroupsRegistration"
                      accessibilityLabel={translate('registration_select_contact_from_address_book')}
                      checked={registrationSettings.registrationSettingConfigs.allowContactGroupsRegistration}
                      disabled={registrationSettings.registrationSettingConfigs.allowAllContactsRegistration}
                      onChange={({ target }: React.ChangeEvent<HTMLInputElement>) => {
                        setRegistrationSettings(prev => ({
                          ...prev,
                          registrationSettingConfigs: {
                            ...prev.registrationSettingConfigs,
                            allowContactGroupsRegistration: target.checked
                          }
                        }));
                        setIsPageEdited(true);
                      }}
                    >
                      {translate('registration_select_contact_from_address_book')}
                    </CheckBox>
                    {registrationSettings.registrationSettingConfigs.allowContactGroupsRegistration && (
                      <div css={styles.searchContactGroupButton}>
                        <Button
                          aria-label={translate('registration_settings_search_contact_groups')}
                          onClick={(): void => {
                            setIsContactGroupOpen(true);
                          }}
                          size="m"
                          testID="registration-settings-search-contact-groups"
                          appearance="lined"
                          text={translate('registration_settings_search_contact_groups')}
                        />
                      </div>
                    )}
                    {showAllowContactGroupsError && (
                      <div css={styles.errorTextNoSelection}>
                        <FormElement.Message
                          text={translate('registration_settings_allowed_contact_group_error_none_selected')}
                          type="error"
                          accessibilityLabel={translate(
                            'registration_settings_allowed_contact_group_error_none_selected'
                          )}
                          testID="registration_settings_allowed_contact_group_error"
                        />
                      </div>
                    )}
                    {isContactGroupOpen && (
                      <ContactGroupModal
                        isOpen={isContactGroupOpen}
                        setIsModalOpen={setIsContactGroupOpen}
                        contactGroupSelected={contactGroupSelected}
                        setContactGroupSelected={setContactGroupSelected}
                        testId="contact-group-modal"
                        modalTitle={translate('registration_settings_contact_group_modal_title')}
                        tableHeading={translate('registration_settings_contact_group_table_heading')}
                        searchBoxLabel={translate('registration-settings-contact-group-search-textbox')}
                        registrationSettings={originalSettings}
                        setIsPageEdited={setIsPageEdited}
                        originalContactGroupSelected={originalSettings.contactGroups}
                      />
                    )}
                  </div>

                  <div
                    css={
                      registrationSettings.registrationSettingConfigs.allowContactGroupsRegistration
                        ? styles.checkBox
                        : styles.multiSelectCheckbox
                    }
                  >
                    <CheckBox
                      onKeyDown={(event): void => {
                        if (event.code === 'Enter') {
                          setRegistrationSettings(prev => ({
                            ...prev,
                            registrationSettingConfigs: {
                              ...prev.registrationSettingConfigs,
                              allowContactTypesRegistration:
                                !registrationSettings.registrationSettingConfigs.allowContactTypesRegistration
                            }
                          }));
                          setIsPageEdited(true);
                        }
                      }}
                      id="allowContactTypesRegistration"
                      accessibilityLabel={translate('registration_select_contact_types_from_address_book')}
                      checked={registrationSettings.registrationSettingConfigs.allowContactTypesRegistration}
                      disabled={registrationSettings.registrationSettingConfigs.allowAllContactsRegistration}
                      onChange={({ target }: React.ChangeEvent<HTMLInputElement>) => {
                        setRegistrationSettings(prev => ({
                          ...prev,
                          registrationSettingConfigs: {
                            ...prev.registrationSettingConfigs,
                            allowContactTypesRegistration: target.checked
                          }
                        }));
                        setIsPageEdited(true);
                      }}
                    >
                      {translate('registration_select_contact_types_from_address_book')}
                    </CheckBox>
                  </div>
                  {registrationSettings.registrationSettingConfigs.allowContactTypesRegistration && (
                    <div css={styles.searchContactGroupButton}>
                      <Button
                        aria-label={translate('registration_settings_search_contact_types')}
                        onClick={(): void => {
                          setIsContactTypeOpen(true);
                        }}
                        size="m"
                        testID="registration-settings-search-contact-types"
                        appearance="lined"
                        text={translate('registration_settings_search_contact_types')}
                      />
                    </div>
                  )}
                  {showAllowContactTypesError && (
                    <div css={styles.errorTextNoSelection}>
                      <FormElement.Message
                        text={translate('registration_settings_allowed_contact_type_error_none_selected')}
                        type="error"
                        accessibilityLabel={translate('registration_settings_allowed_contact_type_error_none_selected')}
                        testID="registration_settings_allowed_contact_type_error"
                      />
                    </div>
                  )}
                  {isContactTypeOpen && (
                    <ContactTypesModal
                      isOpen={isContactTypeOpen}
                      setIsModalOpen={setIsContactTypeOpen}
                      contactTypesSelected={contactTypeSelected}
                      setContactTypesSelected={setContactTypeSelected}
                      testId="contact-type-modal"
                      modalTitle={translate('registration_settings_contact_type_modal_title')}
                      tableHeading={translate('registration_settings_contact_type_table_heading')}
                      searchBoxLabel={translate('registration-settings-contact-type-search-textbox')}
                      originalContactTypes={originalSettings.contactTypes}
                      setIsPageEdited={setIsPageEdited}
                    />
                  )}
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

export default EditContactAllowListField;

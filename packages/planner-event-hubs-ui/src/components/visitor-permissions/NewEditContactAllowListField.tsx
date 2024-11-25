import React, { useEffect, useState } from 'react';
import { Col } from '@cvent/carina/components/Col';
import { Row } from '@cvent/carina/components/Row';
import { Form } from '@cvent/carina/components/Forms';
import FormElement from '@cvent/carina/components/FormElement/FormElement';
import { useStyle } from '@hooks/useStyle';
import { useTranslate } from 'nucleus-text';
import { VisitorPermissionsProps } from '@components/visitor-permissions/type/VisitorPermissionsProps';
import CardContainerEditEnabled from '@components/privacy/CardContainerEditEnabled';
import { EditAllowContactListFieldsStyle } from '@components/visitor-permissions/style';
import { Checkbox as CheckBox } from '@cvent/carina/components/Checkbox';
import { Button } from '@cvent/carina/components/Button';
import ContactGroupModal from '@components/visitor-permissions/ContactGroupModal';
import { GuestVisibility } from '@cvent/planner-event-hubs-model/types';
import ContactTypesModal from './ContactTypesModal';

function NewEditContactAllowListField({
  registrationSettings,
  setRegistrationSettings,
  contactGroupSelected,
  setContactGroupSelected,
  contactTypeSelected,
  showAllowContactGroupsError,
  setShowAllowContactGroupsError,
  showAllowContactTypesError,
  setShowAllowContactTypesError,
  setContactTypeSelected,
  setIsPageEdited,
  disabled,
  visitorPermissions
}: Props): JSX.Element {
  const styles = useStyle(EditAllowContactListFieldsStyle);
  const { translate } = useTranslate();
  const [isContactGroupOpen, setIsContactGroupOpen] = useState(false);
  const [isContactTypeOpen, setIsContactTypeOpen] = useState(false);

  useEffect(() => {
    setShowAllowContactGroupsError(false);
  }, [
    registrationSettings.registrationSettingConfigs.allowContactGroupsRegistration,
    isContactGroupOpen,
    setShowAllowContactGroupsError
  ]);

  useEffect(() => {
    setShowAllowContactTypesError(false);
  }, [
    registrationSettings.registrationSettingConfigs.allowContactTypesRegistration,
    isContactTypeOpen,
    setShowAllowContactTypesError
  ]);

  const tooltipText =
    registrationSettings.guestVisibility === GuestVisibility.Public &&
    translate('visitor_permissions_new_registration_rules_tooltip_text');

  return (
    <CardContainerEditEnabled testID="edit-allowed-contactlist-fields" disabled={disabled} tooltipText={tooltipText}>
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
                        }
                      }}
                      id="allowAllContactsRegistration"
                      accessibilityLabel={translate('registration_select_all_contacts_from_address_book')}
                      disabled={
                        disabled ||
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
                        }
                      }}
                      id="allowContactGroupsRegistration"
                      accessibilityLabel={translate('registration_select_contact_from_address_book')}
                      checked={registrationSettings.registrationSettingConfigs.allowContactGroupsRegistration}
                      disabled={
                        disabled || registrationSettings.registrationSettingConfigs.allowAllContactsRegistration
                      }
                      onChange={({ target }: React.ChangeEvent<HTMLInputElement>) => {
                        setRegistrationSettings(prev => ({
                          ...prev,
                          registrationSettingConfigs: {
                            ...prev.registrationSettingConfigs,
                            allowContactGroupsRegistration: target.checked
                          }
                        }));
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
                          disabled={disabled}
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
                        registrationSettings={registrationSettings}
                        setIsPageEdited={setIsPageEdited}
                        originalContactGroupSelected={visitorPermissions.contactGroups}
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
                        }
                      }}
                      id="allowContactTypesRegistration"
                      accessibilityLabel={translate('registration_select_contact_types_from_address_book')}
                      checked={registrationSettings.registrationSettingConfigs.allowContactTypesRegistration}
                      disabled={
                        disabled || registrationSettings.registrationSettingConfigs.allowAllContactsRegistration
                      }
                      onChange={({ target }: React.ChangeEvent<HTMLInputElement>) => {
                        setRegistrationSettings(prev => ({
                          ...prev,
                          registrationSettingConfigs: {
                            ...prev.registrationSettingConfigs,
                            allowContactTypesRegistration: target.checked
                          }
                        }));
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
                        disabled={disabled}
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
                      originalContactTypes={visitorPermissions.contactTypes}
                      setIsPageEdited={setIsPageEdited}
                    />
                  )}
                </FormElement>
              </Col>
            </Row>
          </div>
        </Form>
      </div>
    </CardContainerEditEnabled>
  );
}

interface Props {
  registrationSettings: VisitorPermissionsProps;
  visitorPermissions: VisitorPermissionsProps;
  setRegistrationSettings: React.Dispatch<React.SetStateAction<VisitorPermissionsProps>>;
  disabled: boolean;
  setIsPageEdited: (isPageEdited: boolean) => void;
  contactGroupSelected: string[];
  contactTypeSelected: string[];
  setContactGroupSelected: React.Dispatch<React.SetStateAction<string[]>>;
  setContactTypeSelected: React.Dispatch<React.SetStateAction<string[]>>;
  showAllowContactGroupsError: boolean;
  showAllowContactTypesError: boolean;
  setShowAllowContactGroupsError: React.Dispatch<React.SetStateAction<boolean>>;
  setShowAllowContactTypesError: React.Dispatch<React.SetStateAction<boolean>>;
}

export default NewEditContactAllowListField;

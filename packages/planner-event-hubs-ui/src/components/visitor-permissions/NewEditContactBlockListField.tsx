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
import BlockedContactsModal from '@components/visitor-permissions/BlockedContactsModal';
import ExclusionListModal from '@components/visitor-permissions/ExclusionListModal';
import { GuestVisibility } from '@cvent/planner-event-hubs-model/types';

function NewEditContactBlockListField({
  registrationSettings,
  setRegistrationSettings,
  setIsPageEdited,
  disabled,
  showBlockedContactsError,
  setShowBlockedContactsError,
  showExclusionListError,
  setShowExclusionListError,
  contactSelected,
  setContactSelected,
  exclusionListSelected,
  setExclusionListSelected,
  visitorPermissions
}: Props): JSX.Element {
  const styles = useStyle(EditAllowContactListFieldsStyle);
  const { translate } = useTranslate();
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isExclusionListOpen, setIsExclusionListOpen] = useState(false);

  useEffect(() => {
    setShowBlockedContactsError(false);
  }, [
    registrationSettings.registrationSettingConfigs.blockContactsRegistration,
    isContactOpen,
    setShowBlockedContactsError
  ]);

  useEffect(() => {
    setShowExclusionListError(false);
  }, [
    registrationSettings.registrationSettingConfigs.blockListRegistration,
    isExclusionListOpen,
    setShowExclusionListError
  ]);

  const tooltipText =
    registrationSettings.guestVisibility === GuestVisibility.Public &&
    translate('visitor_permissions_new_registration_rules_tooltip_text');

  return (
    <CardContainerEditEnabled testID="edit-blocked-contact-list-fields" disabled={disabled} tooltipText={tooltipText}>
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
                        }
                      }}
                      id="blockedContactsFromRegistration"
                      accessibilityLabel={translate('registration_settings_select_from_contacts')}
                      checked={registrationSettings.registrationSettingConfigs.blockContactsRegistration}
                      disabled={disabled}
                      onChange={({ target }: React.ChangeEvent<HTMLInputElement>) => {
                        setRegistrationSettings(prev => ({
                          ...prev,
                          registrationSettingConfigs: {
                            ...prev.registrationSettingConfigs,
                            blockContactsRegistration: target.checked
                          }
                        }));
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
                          disabled={disabled}
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
                        originalBlockedContacts={visitorPermissions.blockedContacts}
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
                        }
                      }}
                      id="displayBlockedContactGroups"
                      disabled={disabled}
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
                          disabled={disabled}
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
                        originalExclusionLists={visitorPermissions.blockedContactGroups}
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
    </CardContainerEditEnabled>
  );
}

interface Props {
  registrationSettings: VisitorPermissionsProps;
  visitorPermissions: VisitorPermissionsProps;
  setRegistrationSettings: React.Dispatch<React.SetStateAction<VisitorPermissionsProps>>;
  disabled: boolean;
  setIsPageEdited: (isPageEdited: boolean) => void;
  showBlockedContactsError: boolean;
  setShowBlockedContactsError: React.Dispatch<React.SetStateAction<boolean>>;
  showExclusionListError: boolean;
  setShowExclusionListError: React.Dispatch<React.SetStateAction<boolean>>;
  contactSelected: string[];
  setContactSelected: React.Dispatch<React.SetStateAction<string[]>>;
  exclusionListSelected: string[];
  setExclusionListSelected: React.Dispatch<React.SetStateAction<string[]>>;
}

export default NewEditContactBlockListField;

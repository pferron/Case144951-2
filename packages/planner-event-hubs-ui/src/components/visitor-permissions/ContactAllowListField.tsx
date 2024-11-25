import React from 'react';
import CardContainer from '@components/visitor-permissions/CardContainer';
import { useTranslate } from 'nucleus-text';
import { useStyle } from '@hooks/useStyle';
import { VisitorPermissionsProps } from '@components/visitor-permissions/type/VisitorPermissionsProps';
import RegistrationTextContainer from '@components/visitor-permissions/RegistrationTextContainer';
import { VisitorPermissionsFieldStyles } from '@components/visitor-permissions/style';
import { GuestVisibility } from '@cvent/planner-event-hubs-model/types';

function ContactAllowListField({ registrationSettings, onEdit, disabled }: Props): JSX.Element {
  const styles = useStyle(VisitorPermissionsFieldStyles);
  const { translate } = useTranslate();
  const configs = registrationSettings.registrationSettingConfigs;
  const tooltipText =
    registrationSettings.guestVisibility === GuestVisibility.Public &&
    translate('visitor_permissions_registration_rules_tooltip');

  return (
    <CardContainer testID="allowed-contact-list-fields" onEdit={onEdit} disabled={disabled} tooltipText={tooltipText}>
      <div>
        <h2 css={styles.title}>{translate('registration_allowed_contacts')}</h2>
        <div css={styles.sectionContainer}>
          <p css={styles.description}>{translate('registration_specify_who_can_register_by_contacts')}</p>
          {(configs.allowAllContactsRegistration ||
            (registrationSettings.contactGroups.length > 0 && configs.allowContactGroupsRegistration) ||
            (registrationSettings.contactTypes.length > 0 && configs.allowContactTypesRegistration)) && (
            <div css={styles.horizontalLine} />
          )}
          {configs.allowAllContactsRegistration && (
            <div css={styles.firstRegistrationTextContainer}>
              <RegistrationTextContainer
                testID="select-all-contact-groups"
                question={translate('registration_contacts_from_address_book')}
                answer={translate('registration_all_selected')}
              />
            </div>
          )}
          {registrationSettings.contactGroups.length > 0 && configs.allowContactGroupsRegistration && (
            <div css={styles.firstRegistrationTextContainer}>
              <RegistrationTextContainer
                testID="select-contact-groups-from-addressBook"
                question={translate('registration_contact_groups')}
                answer={translate('registration_selected_contact_groups_count', {
                  contactGroupCount: registrationSettings.contactGroups.length
                })}
              />
            </div>
          )}
          {registrationSettings.contactTypes.length > 0 && configs.allowContactTypesRegistration && (
            <div css={configs.allowContactGroupsRegistration ? null : styles.firstRegistrationTextContainer}>
              <RegistrationTextContainer
                testID="select-contact-types-from-addressBook"
                question={translate('registration_contact_types')}
                answer={translate('registration_selected_contact_types_count', {
                  contactTypeCount: registrationSettings.contactTypes.length
                })}
              />
            </div>
          )}
        </div>
      </div>
    </CardContainer>
  );
}

interface Props {
  registrationSettings: VisitorPermissionsProps;
  onEdit?: (boolean) => void;
  disabled: boolean;
}
export default ContactAllowListField;

import React from 'react';
import CardContainer from '@components/visitor-permissions/CardContainer';
import { useTranslate } from 'nucleus-text';
import { useStyle } from '@hooks/useStyle';
import { VisitorPermissionsProps } from '@components/visitor-permissions/type/VisitorPermissionsProps';
import RegistrationTextContainer from '@components/visitor-permissions/RegistrationTextContainer';
import { VisitorPermissionsFieldStyles } from '@components/visitor-permissions/style';
import { GuestVisibility } from '@cvent/planner-event-hubs-model/types';

function ContactBlockListField({ registrationSettings, onEdit, disabled }: Props): JSX.Element {
  const styles = useStyle(VisitorPermissionsFieldStyles);
  const { translate } = useTranslate();
  const configs = registrationSettings.registrationSettingConfigs;
  const tooltipText =
    registrationSettings.guestVisibility === GuestVisibility.Public &&
    translate('visitor_permissions_registration_rules_tooltip');

  return (
    <CardContainer testID="blocked-contact-list-fields" onEdit={onEdit} disabled={disabled} tooltipText={tooltipText}>
      <div>
        <h2 css={styles.title}>{translate('registration_settings_blocked_contacts')}</h2>
        <div css={styles.sectionContainer}>
          <p css={styles.description}>{translate('registration_settings_blocked_contacts_not_allowed_to_register')}</p>
          {registrationSettings.blockedContacts.length > 0 && configs.blockContactsRegistration && (
            <>
              <div css={styles.horizontalLine} />
              <div css={styles.firstRegistrationTextContainer}>
                <RegistrationTextContainer
                  testID="selected-blocked-contacts"
                  question={translate('registration_settings_selected_contacts')}
                  answer={translate('registration_selected_contact_groups_count', {
                    contactGroupCount: registrationSettings.blockedContacts.length
                  })}
                />
              </div>
            </>
          )}
          {registrationSettings.blockedContactGroups.length > 0 && configs.blockListRegistration && (
            <>
              {!configs.blockContactsRegistration && <div css={styles.horizontalLine} />}
              <div css={configs.blockContactsRegistration ? null : styles.firstRegistrationTextContainer}>
                <RegistrationTextContainer
                  testID="selected-blocked-contact-groups"
                  question={translate('registration_settings_exclusion_lists')}
                  answer={translate('registration_selected_contact_groups_count', {
                    contactGroupCount: registrationSettings.blockedContactGroups.length
                  })}
                />
              </div>
            </>
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
export default ContactBlockListField;

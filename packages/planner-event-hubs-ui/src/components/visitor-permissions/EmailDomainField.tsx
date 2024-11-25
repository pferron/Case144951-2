import React from 'react';
import CardContainer from '@components/visitor-permissions/CardContainer';
import { useTranslate } from 'nucleus-text';
import { useStyle } from '@hooks/useStyle';
import RegistrationTextContainer from '@components/visitor-permissions/RegistrationTextContainer';
import { VisitorPermissionsFieldStyles } from '@components/visitor-permissions/style';
import { VisitorPermissionsProps } from '@components/visitor-permissions/type/VisitorPermissionsProps';
import { AllowedEmailDomain, GuestVisibility } from '@cvent/planner-event-hubs-model/types';
import { Tag } from '@cvent/carina/components/Tag';
import { getEmailDomainsOptions } from '@components/visitor-permissions/EmailDomainsOptions';
import { EmailDomainPopover } from './EditEmailDomainField';

function EmailDomainField({ visitorPermissions, onEdit, disabled }: Props): JSX.Element {
  const styles = useStyle(VisitorPermissionsFieldStyles);
  const { emailDomains } = visitorPermissions;
  const { translate } = useTranslate();
  const tooltipText =
    visitorPermissions.guestVisibility === GuestVisibility.Public &&
    translate('visitor_permissions_registration_rules_tooltip');

  const emailDomainOptionSelected = getEmailDomainsOptions(translate).find(
    iterator => iterator.value === visitorPermissions.registrationSettingConfigs.allowedEmailDomain
  );

  return (
    <CardContainer testID="email-domain-fields" onEdit={onEdit} disabled={disabled} tooltipText={tooltipText}>
      <div>
        <h2 css={styles.title}>{translate('registration_settings_allowed_email_domains')}</h2>
        <div css={styles.sectionContainer}>
          <p css={styles.description}>{translate('registration_settings_specify_who_can_register_by_email_domain')}</p>
          {emailDomains !== null && emailDomains.length !== 0 && <div css={styles.horizontalLine} />}
          {emailDomainOptionSelected.value === AllowedEmailDomain.CustomDomains ? (
            emailDomains !== null &&
            emailDomains.length !== 0 && (
              <div css={styles.firstRegistrationTextContainer}>
                <RegistrationTextContainer
                  testID="emailDomains"
                  question={translate('registration_settings_allowed_email_domains')}
                  answer={emailDomains.map(listItem => (
                    <div css={{ pointerEvents: 'none' }}>
                      <Tag onClick={() => null} text={listItem} />
                    </div>
                  ))}
                />
              </div>
            )
          ) : (
            <div css={styles.emailDomainPopOver}>
              <p>{emailDomainOptionSelected.label}</p>
              {emailDomainOptionSelected.value === AllowedEmailDomain.BusinessDomains && (
                <div css={{ marginTop: '0.5rem' }}>
                  <EmailDomainPopover />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </CardContainer>
  );
}

interface Props {
  visitorPermissions: VisitorPermissionsProps;
  onEdit?: (boolean) => void;
  disabled: boolean;
}
export default EmailDomainField;

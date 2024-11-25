import { AllowedEmailDomain } from '@cvent/planner-event-hubs-model/types';

interface RadioOptions {
  label: string;
  value: string;
}
export const getEmailDomainsOptions = (translate: (val: string) => string): Array<RadioOptions> => [
  {
    label: translate('registration_settings_email_domain_type_any_domain'),
    value: AllowedEmailDomain.AnyDomain
  },
  {
    label: translate('registration_settings_email_domain_type_business_domain'),
    value: AllowedEmailDomain.BusinessDomains
  },
  {
    label: translate('registration_settings_email_domain_type_custom_domain'),
    value: AllowedEmailDomain.CustomDomains
  }
];

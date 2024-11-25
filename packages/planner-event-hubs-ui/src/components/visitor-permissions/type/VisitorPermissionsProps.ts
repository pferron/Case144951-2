import { GuestVisibility, RegistrationSettings } from '@cvent/planner-event-hubs-model/types';

export interface VisitorPermissionsProps {
  guestVisibility: GuestVisibility;
  emailDomains: Array<string>;
  registrationSettingConfigs: RegistrationSettings;
  contactGroups: Array<string>;
  contactTypes: Array<string>;
  blockedContacts: Array<string>;
  blockedContactGroups: Array<string>;
  allowLimitedViewsBeforeLogin: boolean;
  allowLimitedViewsBeforeLoginCount: number;
}

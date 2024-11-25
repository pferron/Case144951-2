import React, { useMemo, useState } from 'react';
import { injectTestId } from '@cvent/nucleus-test-automation';
import EditEmailDomainField from '@components/visitor-permissions/EditEmailDomainField';
import EmailDomainField from '@components/visitor-permissions/EmailDomainField';
import EditContactAllowListField from '@components/visitor-permissions/EditContactAllowListField';
import ContactAllowListField from '@components/visitor-permissions/ContactAllowListField';
import { VisitorPermissionsProps } from '@components/visitor-permissions/type/VisitorPermissionsProps';
import EditVisibility from '@components/visitor-permissions/EditVisibility';
import Visibility from '@components/visitor-permissions/Visibility';
import { GuestVisibility } from '@cvent/planner-event-hubs-model/types';
import ContactBlockListField from '@components/visitor-permissions/ContactBlockListField';
import EditContactBlockListField from '@components/visitor-permissions/EditContactBlockListField';
import { useVisitorPermissionsPageActionsApi } from '@metrics/client/react/useVisitorPermissionsPageActionsApi';

function VisitorPermissionsContainer({ visitorPermissions, onUpdate, setIsPageEdited }: Props): JSX.Element {
  const [editEmailDomains, setEditEmailDomains] = useState(false);
  const [editContactAllowlist, setEditContactAllowlist] = useState(false);
  const [editVisibility, setEditVisibility] = useState(false);
  const [editContactBlocklist, setEditContactBlocklist] = useState(false);
  const [isOverrideRegistrationModalOpen, setIsOverrideRegistrationModalOpen] = useState(false);
  const { visibilityCheckMarkClicked } = useVisitorPermissionsPageActionsApi();

  const isPublicVisibilityEnabled = useMemo(
    () => visitorPermissions.guestVisibility === GuestVisibility.Public,
    [visitorPermissions]
  );

  // visibility helper methods
  const onSaveVisibility = updatedSettings => {
    onUpdate(updatedSettings);
    setEditVisibility(false);
    setIsPageEdited(false);
    if (updatedSettings.guestVisibility !== visitorPermissions.guestVisibility) {
      visibilityCheckMarkClicked({
        visibilityStatus: updatedSettings.guestVisibility
      });
    }
  };
  const onEditVisibility = () => {
    setEditVisibility(true);
  };
  const onCancelVisibility = () => {
    setEditVisibility(false);
    setIsPageEdited(false);
  };

  // email domains helper methods
  const onSaveEmailDomains = updatedSettings => {
    onUpdate(updatedSettings);
    setIsPageEdited(false);
    setEditEmailDomains(false);
  };
  const onEditEmailDomains = () => {
    setEditEmailDomains(true);
  };
  const onCancelEmailDomains = () => {
    setIsPageEdited(false);
    setEditEmailDomains(false);
  };

  // allowed contacts helper methods
  const onSaveContactAllowList = updatedSettings => {
    onUpdate(updatedSettings);
    setIsPageEdited(false);
    setEditContactAllowlist(false);
  };
  const onEditAllowedContactList = () => {
    setEditContactAllowlist(true);
  };
  const onCancelAllowedContactList = () => {
    setIsPageEdited(false);
    setEditContactAllowlist(false);
  };

  // blocked contacts helper methods
  const onSaveContactBlockList = updatedSettings => {
    onUpdate(updatedSettings);
    setIsPageEdited(false);
    setEditContactBlocklist(false);
  };
  const onEditBlockedContactList = () => {
    setEditContactBlocklist(true);
  };
  const onCancelBlockedContactList = () => {
    setIsPageEdited(false);
    setEditContactBlocklist(false);
  };

  return (
    <div {...injectTestId('registration-settings-container')}>
      {editVisibility ? (
        <EditVisibility
          saveChangesModalOpen={isOverrideRegistrationModalOpen}
          setSaveChangesModalOpen={setIsOverrideRegistrationModalOpen}
          registrationSettings={visitorPermissions}
          onSave={onSaveVisibility}
          onCancel={onCancelVisibility}
          isEdit={editVisibility}
          setIsPageEdited={setIsPageEdited}
        />
      ) : (
        <Visibility
          visibility={visitorPermissions.guestVisibility}
          onEdit={onEditVisibility}
          disabled={editEmailDomains || editContactAllowlist || editContactBlocklist}
        />
      )}
      {editEmailDomains ? (
        <EditEmailDomainField
          saveChangesModalOpen={isOverrideRegistrationModalOpen}
          setSaveChangesModalOpen={setIsOverrideRegistrationModalOpen}
          registrationSettings={visitorPermissions}
          onSave={onSaveEmailDomains}
          onCancel={onCancelEmailDomains}
          isEdit={editEmailDomains}
          setIsPageEdited={setIsPageEdited}
        />
      ) : (
        <EmailDomainField
          visitorPermissions={visitorPermissions}
          onEdit={onEditEmailDomains}
          disabled={editContactAllowlist || editVisibility || isPublicVisibilityEnabled || editContactBlocklist}
        />
      )}
      {editContactAllowlist ? (
        <EditContactAllowListField
          saveChangesModalOpen={isOverrideRegistrationModalOpen}
          setSaveChangesModalOpen={setIsOverrideRegistrationModalOpen}
          registrationSettings={visitorPermissions}
          onSave={onSaveContactAllowList}
          onCancel={onCancelAllowedContactList}
          isEdit={editContactAllowlist}
          setIsPageEdited={setIsPageEdited}
        />
      ) : (
        <ContactAllowListField
          registrationSettings={visitorPermissions}
          onEdit={onEditAllowedContactList}
          disabled={editEmailDomains || editVisibility || isPublicVisibilityEnabled || editContactBlocklist}
        />
      )}
      {editContactBlocklist ? (
        <EditContactBlockListField
          saveChangesModalOpen={isOverrideRegistrationModalOpen}
          setSaveChangesModalOpen={setIsOverrideRegistrationModalOpen}
          registrationSettings={visitorPermissions}
          onSave={onSaveContactBlockList}
          onCancel={onCancelBlockedContactList}
          isEdit={editContactBlocklist}
          setIsPageEdited={setIsPageEdited}
        />
      ) : (
        <ContactBlockListField
          registrationSettings={visitorPermissions}
          onEdit={onEditBlockedContactList}
          disabled={editEmailDomains || editVisibility || isPublicVisibilityEnabled || editContactAllowlist}
        />
      )}
    </div>
  );
}

interface Props {
  visitorPermissions: VisitorPermissionsProps;
  onUpdate?: (visitorPermissions: VisitorPermissionsProps) => void;
  setIsPageEdited: (isPageEdited: boolean) => void;
}

export default VisitorPermissionsContainer;

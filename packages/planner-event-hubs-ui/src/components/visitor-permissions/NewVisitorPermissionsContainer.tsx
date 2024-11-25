import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { injectTestId } from '@cvent/nucleus-test-automation';
import NewEditEmailDomainField from '@components/visitor-permissions/NewEditEmailDomainField';
import NewEditContactAllowListField from '@components/visitor-permissions/NewEditContactAllowListField';
import { VisitorPermissionsProps } from '@components/visitor-permissions/type/VisitorPermissionsProps';
import NewEditVisibility from '@components/visitor-permissions/NewEditVisibility';
import { GuestVisibility } from '@cvent/planner-event-hubs-model/types';
import NewEditContactBlockListField from '@components/visitor-permissions/NewEditContactBlockListField';

function NewVisitorPermissionsContainer({
  visitorPermissions,
  onUpdate,
  isSaveButtonClicked,
  setIsSaveButtonClicked,
  setIsPageEdited,
  registrationSettings,
  setRegistrationSettings
}: Props): JSX.Element {
  const [contactGroupSelected, setContactGroupSelected] = useState(registrationSettings.contactGroups);
  const [contactTypeSelected, setContactTypeSelected] = useState(registrationSettings.contactTypes);

  const [showAllowContactGroupsError, setShowAllowContactGroupsError] = useState(false);
  const [showAllowContactTypesError, setShowAllowContactTypesError] = useState(false);

  const [showBlockedContactsError, setShowBlockedContactsError] = useState(false);
  const [showExclusionListError, setShowExclusionListError] = useState(false);
  const [contactSelected, setContactSelected] = useState(registrationSettings.blockedContacts);
  const [exclusionListSelected, setExclusionListSelected] = useState(registrationSettings.blockedContactGroups);

  const isPublicVisibilityEnabled = useMemo(
    () => visitorPermissions.guestVisibility === GuestVisibility.Public,
    [visitorPermissions]
  );

  useEffect(() => {
    setRegistrationSettings(prev => ({
      ...prev,
      contactGroups: contactGroupSelected,
      contactTypes: contactTypeSelected,
      blockedContacts: contactSelected,
      blockedContactGroups: exclusionListSelected
    }));
  }, [contactGroupSelected, contactSelected, contactTypeSelected, exclusionListSelected, setRegistrationSettings]);

  const isAtLeastOneContactGroupSelected = !(
    contactGroupSelected.length === 0 && registrationSettings.registrationSettingConfigs.allowContactGroupsRegistration
  );
  const isAtLeastOneContactTypeSelected = !(
    contactTypeSelected.length === 0 && registrationSettings.registrationSettingConfigs.allowContactTypesRegistration
  );
  const isAtLeastOneContactSelected = !(
    contactSelected.length === 0 && registrationSettings.registrationSettingConfigs.blockContactsRegistration
  );
  const isAtLeastOneExclusionListSelected = !(
    exclusionListSelected.length === 0 && registrationSettings.registrationSettingConfigs.blockListRegistration
  );

  const errors =
    !isAtLeastOneContactGroupSelected ||
    !isAtLeastOneContactTypeSelected ||
    !isAtLeastOneContactSelected ||
    !isAtLeastOneExclusionListSelected;

  const onSave = useCallback(() => {
    if (errors) {
      setIsPageEdited(true);
      setShowAllowContactGroupsError(!isAtLeastOneContactGroupSelected);
      setShowAllowContactTypesError(!isAtLeastOneContactTypeSelected);
      setShowBlockedContactsError(!isAtLeastOneContactSelected);
      setShowExclusionListError(!isAtLeastOneExclusionListSelected);
    } else {
      onUpdate(registrationSettings);
    }
  }, [
    errors,
    isAtLeastOneContactGroupSelected,
    isAtLeastOneContactSelected,
    isAtLeastOneContactTypeSelected,
    isAtLeastOneExclusionListSelected,
    onUpdate,
    registrationSettings,
    setIsPageEdited
  ]);

  useMemo(() => {
    if (isSaveButtonClicked) {
      onSave();
      setIsSaveButtonClicked(false);
    }
  }, [isSaveButtonClicked, onSave, setIsSaveButtonClicked]);

  return (
    <div {...injectTestId('registration-settings-container')}>
      <NewEditVisibility
        registrationSettings={registrationSettings}
        setRegistrationSettings={setRegistrationSettings}
        setIsPageEdited={setIsPageEdited}
      />
      <NewEditEmailDomainField
        registrationSettings={registrationSettings}
        setRegistrationSettings={setRegistrationSettings}
        disabled={isPublicVisibilityEnabled}
      />
      <NewEditContactAllowListField
        registrationSettings={registrationSettings}
        setRegistrationSettings={setRegistrationSettings}
        setIsPageEdited={setIsPageEdited}
        contactGroupSelected={contactGroupSelected}
        setContactGroupSelected={setContactGroupSelected}
        contactTypeSelected={contactTypeSelected}
        setContactTypeSelected={setContactTypeSelected}
        showAllowContactGroupsError={showAllowContactGroupsError}
        setShowAllowContactGroupsError={setShowAllowContactGroupsError}
        showAllowContactTypesError={showAllowContactTypesError}
        setShowAllowContactTypesError={setShowAllowContactTypesError}
        visitorPermissions={visitorPermissions}
        disabled={isPublicVisibilityEnabled}
      />
      <NewEditContactBlockListField
        registrationSettings={registrationSettings}
        setRegistrationSettings={setRegistrationSettings}
        setIsPageEdited={setIsPageEdited}
        showBlockedContactsError={showBlockedContactsError}
        setShowBlockedContactsError={setShowBlockedContactsError}
        showExclusionListError={showExclusionListError}
        setShowExclusionListError={setShowExclusionListError}
        contactSelected={contactSelected}
        setContactSelected={setContactSelected}
        exclusionListSelected={exclusionListSelected}
        visitorPermissions={visitorPermissions}
        setExclusionListSelected={setExclusionListSelected}
        disabled={isPublicVisibilityEnabled}
      />
    </div>
  );
}

interface Props {
  visitorPermissions: VisitorPermissionsProps;
  onUpdate?: (visitorPermissions: VisitorPermissionsProps) => void;
  isSaveButtonClicked: boolean;
  setIsSaveButtonClicked: (isSaveButtonClicked: boolean) => void;
  setIsPageEdited: (isPageEdited: boolean) => void;
  registrationSettings: VisitorPermissionsProps;
  setRegistrationSettings: React.Dispatch<React.SetStateAction<VisitorPermissionsProps>>;
}

export default NewVisitorPermissionsContainer;

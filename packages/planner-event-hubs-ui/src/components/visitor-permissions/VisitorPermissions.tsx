import { useTranslate } from 'nucleus-text';
import { Breadcrumbs, Breadcrumb as Crumb } from '@cvent/carina/components/Breadcrumbs';
import {
  VIDEO_HUB_PATH_PARAM_KEY,
  VIDEO_HUBS_URL,
  VIDEO_HUB_INFORMATION_URL,
  HUB_OVERVIEW_URL
} from '@utils/constants';
import React, { useState, useMemo, useEffect } from 'react';
import { useStyle } from '@hooks/useStyle';
import { VisitorPermissionsStyle } from '@components/visitor-permissions/style';
import { VisitorPermissionsProps } from '@components/visitor-permissions/type/VisitorPermissionsProps';
import Header from '@components/Header';
import VisitorPermissionsContainer from '@components/visitor-permissions/VisitorPermissionsContainer';
import NewVisitorPermissionsContainer from '@components/visitor-permissions/NewVisitorPermissionsContainer';
import { useMutation, useQuery } from '@apollo/client';
import { LoggerFactory } from '@cvent/logging/LoggerFactory';
import LoadingWrapper from '@components/common/loading/LoadingWrapper';
import { AllowedEmailDomain, GuestVisibility } from '@cvent/planner-event-hubs-model/types';
import { PageAlert } from '@cvent/carina/components/Alert';
import NavigationConfirmationModal from '@components/common/NavigationConfirmationModal';
import {
  getEmailDomainsQuery,
  saveEmailDomainsMutation
} from '@cvent/planner-event-hubs-model/operations/registrationSettings';
import {
  getAllowedContactGroupsQuery,
  getAllowedContactTypesQuery,
  saveContactGroupsMutation,
  saveContactTypesMutation,
  saveBlockedContactsMutation,
  getBlockedContactsQuery,
  getBlockedContactGroupsQuery,
  saveBlockedContactGroupsMutation
} from '@cvent/planner-event-hubs-model/operations/contacts';
import removeTypename from '@utils/removeTypename';
import { DELETE_TOKEN, GET_HUB_SETTINGS, UPDATE_HUB_SETTINGS } from '@cvent/planner-event-hubs-model/operations/hub';
import { useAppFeatures } from '@components/AppFeaturesProvider';
import { ALLOW_LIMITED_VIEWS_BEFORE_LOGIN_COUNT_DEFAULT_VALUE } from '@components/constants';
import { isEqual } from 'lodash';

const LOG = LoggerFactory.create('Visitor-Permissions');

function VisitorPermissions({ videoCenterId, videoCenterTitle }: Props): React.JSX.Element {
  const { translate } = useTranslate();
  const { container } = useStyle(VisitorPermissionsStyle);
  const [isPageEdited, setIsPageEdited] = useState<boolean>(false);
  const { hubOverviewFeature, videoCenterInformationFeature } = useAppFeatures();
  const [visitorPermissions, setVisitorPermissions] = useState<VisitorPermissionsProps>({
    guestVisibility: GuestVisibility.Public,
    emailDomains: [],
    registrationSettingConfigs: {
      allowContactGroupsRegistration: false,
      allowAllContactsRegistration: false,
      allowContactTypesRegistration: false,
      blockContactsRegistration: false,
      allowedEmailDomain: AllowedEmailDomain.AnyDomain
    },
    allowLimitedViewsBeforeLogin: false,
    allowLimitedViewsBeforeLoginCount: ALLOW_LIMITED_VIEWS_BEFORE_LOGIN_COUNT_DEFAULT_VALUE,
    contactGroups: [],
    contactTypes: [],
    blockedContacts: [],
    blockedContactGroups: []
  });

  const [isSaveButtonClicked, setIsSaveButtonClicked] = useState<boolean>(false);
  const [showAlertSuccess, setShowAlertSuccess] = useState(false);
  const [showFailureAlert, setShowFailureAlert] = useState(false);
  const [failureAlertContent, setFailureAlertContent] = useState('');
  const [showNavigationConfirmationModal, setShowNavigationConfirmationModal] = useState(false);
  const headerBreadCrumbs: JSX.Element = (
    <Breadcrumbs>
      <Crumb href={VIDEO_HUBS_URL}>{translate('video_hubs_header_title')}</Crumb>
      <Crumb
        href={
          hubOverviewFeature
            ? HUB_OVERVIEW_URL.replace(VIDEO_HUB_PATH_PARAM_KEY, videoCenterId)
            : VIDEO_HUB_INFORMATION_URL.replace(VIDEO_HUB_PATH_PARAM_KEY, videoCenterId)
        }
      >
        {videoCenterTitle}
      </Crumb>
      <Crumb>{translate('visitor_permissions_title')}</Crumb>
    </Breadcrumbs>
  );

  const {
    data,
    loading: fetchingSettings,
    error: getHubSettingsError
  } = useQuery(GET_HUB_SETTINGS, {
    variables: {
      id: {
        id: videoCenterId
      }
    },
    onError: apolloError => {
      LOG.error(apolloError, 'Failed to get member settings');
    }
  });

  const {
    loading: fetchingEmailDomains,
    data: emailDomainsData,
    error: getEmailDomainsError
  } = useQuery(getEmailDomainsQuery, {
    variables: {
      input: {
        id: videoCenterId
      }
    },
    onError: apolloError => {
      LOG.error(apolloError, 'Failed to get email domains for hubId', videoCenterId);
    }
  });

  const {
    loading: fetchingAllowedContactGroups,
    data: allowedContactGroups,
    error: getAllowedContactGroupsError
  } = useQuery(getAllowedContactGroupsQuery, {
    variables: {
      input: {
        id: videoCenterId
      }
    },
    onError: apolloError => {
      LOG.error(apolloError, 'Failed to get allowed contact groups for hubId', videoCenterId);
    }
  });

  const {
    loading: fetchingAllowedContactTypes,
    data: allowedContactTypes,
    error: getAllowedContactTypesError
  } = useQuery(getAllowedContactTypesQuery, {
    variables: {
      input: {
        id: videoCenterId
      }
    },
    onError: apolloError => {
      LOG.error(apolloError, 'Failed to fetch allowed contact types for hubId', videoCenterId);
    }
  });

  const {
    loading: fetchingBlockedContacts,
    data: blockedContacts,
    error: getBlockedContactsError
  } = useQuery(getBlockedContactsQuery, {
    variables: {
      input: {
        id: videoCenterId
      }
    },
    onError: apolloError => {
      LOG.error(apolloError, 'Failed to get blocked contacts for hubId', videoCenterId);
    }
  });

  const {
    loading: fetchingBlockedContactGroups,
    data: blockedContactGroups,
    error: getBlockedContactGroupsError
  } = useQuery(getBlockedContactGroupsQuery, {
    variables: {
      input: {
        id: videoCenterId
      }
    },
    onError: apolloError => {
      LOG.error(apolloError, 'Failed to get blocked contact groups for hubId', videoCenterId);
    }
  });

  const initialHubSettings = data?.getHubSettings;
  const initialEmailDomains = emailDomainsData?.getEmailDomains;
  const initialAllowedContacts = allowedContactGroups?.getAllowedContactGroups;
  const initialAllowedContactTypes = allowedContactTypes?.getAllowedContactTypes;
  const initialBlockedContacts = blockedContacts?.getBlockedContacts;
  const initialBlockedContactGroups = blockedContactGroups?.getBlockedContactGroups;
  const [registrationSettings, setRegistrationSettings] = useState(visitorPermissions);
  useMemo(
    () =>
      setVisitorPermissions(prev => ({
        ...prev,
        contactTypes: initialAllowedContactTypes?.contactTypes ?? prev.contactTypes,
        contactGroups: initialAllowedContacts?.contactGroups ?? prev.contactGroups,
        emailDomains: initialEmailDomains?.emailDomains ?? prev.emailDomains,
        blockedContacts: initialBlockedContacts?.blockedContacts ?? prev.blockedContacts,
        blockedContactGroups: initialBlockedContactGroups?.contactGroups ?? prev.blockedContactGroups,
        guestVisibility: initialHubSettings?.guestVisibility ?? prev.guestVisibility,
        allowLimitedViewsBeforeLogin:
          initialHubSettings?.allowLimitedViewsBeforeLogin ?? prev.allowLimitedViewsBeforeLogin,
        allowLimitedViewsBeforeLoginCount:
          initialHubSettings?.allowLimitedViewsBeforeLoginCount ?? prev.allowLimitedViewsBeforeLoginCount,
        registrationSettingConfigs:
          removeTypename(initialHubSettings?.registrationSettings) ?? prev.registrationSettingConfigs
      })),
    [
      initialHubSettings,
      initialEmailDomains,
      initialAllowedContacts,
      initialAllowedContactTypes,
      initialBlockedContacts,
      initialBlockedContactGroups
    ]
  );
  useMemo(
    () =>
      setRegistrationSettings(prev => ({
        ...prev,
        contactTypes: initialAllowedContactTypes?.contactTypes ?? prev.contactTypes,
        contactGroups: initialAllowedContacts?.contactGroups ?? prev.contactGroups,
        emailDomains: initialEmailDomains?.emailDomains ?? prev.emailDomains,
        blockedContacts: initialBlockedContacts?.blockedContacts ?? prev.blockedContacts,
        blockedContactGroups: initialBlockedContactGroups?.contactGroups ?? prev.blockedContactGroups,
        guestVisibility: initialHubSettings?.guestVisibility ?? prev.guestVisibility,
        allowLimitedViewsBeforeLogin:
          initialHubSettings?.allowLimitedViewsBeforeLogin ?? prev.allowLimitedViewsBeforeLogin,
        allowLimitedViewsBeforeLoginCount:
          initialHubSettings?.allowLimitedViewsBeforeLoginCount ?? prev.allowLimitedViewsBeforeLoginCount,
        registrationSettingConfigs:
          removeTypename(initialHubSettings?.registrationSettings) ?? prev.registrationSettingConfigs
      })),
    [
      initialHubSettings,
      initialEmailDomains,
      initialAllowedContacts,
      initialAllowedContactTypes,
      initialBlockedContacts,
      initialBlockedContactGroups
    ]
  );

  const removeContacts = (contactsToDelete, deleteFromArray) => {
    const contactsToDeleteSet = new Set(contactsToDelete);
    const contacts = deleteFromArray.filter(name => !contactsToDeleteSet.has(name));
    return contacts;
  };

  const [updateRegistrationSettingsMutation, { loading: updatingData }] = useMutation(UPDATE_HUB_SETTINGS);
  const [deleteSharedToken] = useMutation(DELETE_TOKEN);
  const [saveAllowedEmailDomainsMutation, { loading: savingEmailDomains }] = useMutation(saveEmailDomainsMutation);
  const [saveAllowedContactGroupsMutation, { loading: savingContactGroups }] = useMutation(saveContactGroupsMutation);
  const [saveBlockedContactMutation, { loading: savingBlockedContacts }] = useMutation(saveBlockedContactsMutation);
  const [saveAllowedContactTypesMutation, { loading: savingContactTypes }] = useMutation(saveContactTypesMutation);
  const [saveBlockedContactGroupMutation, { loading: savingBlockedContactGroups }] = useMutation(
    saveBlockedContactGroupsMutation
  );

  const onUpdateRegistrationSettings = async (updatedSettings: VisitorPermissionsProps): Promise<void> => {
    // update visitor permission registration settings
    if (
      visitorPermissions.guestVisibility !== updatedSettings.guestVisibility ||
      visitorPermissions.allowLimitedViewsBeforeLogin !== updatedSettings.allowLimitedViewsBeforeLogin ||
      visitorPermissions.allowLimitedViewsBeforeLoginCount !== updatedSettings.allowLimitedViewsBeforeLoginCount ||
      JSON.stringify(visitorPermissions.registrationSettingConfigs) !==
        JSON.stringify(updatedSettings.registrationSettingConfigs)
    ) {
      const settingsToUpdate = removeTypename(data.getHubSettings);
      await updateRegistrationSettingsMutation({
        variables: {
          input: {
            id: videoCenterId,
            hubSettings: {
              ...settingsToUpdate,
              guestVisibility: updatedSettings.guestVisibility,
              registrationSettings: updatedSettings.registrationSettingConfigs,
              allowLimitedViewsBeforeLogin: updatedSettings.allowLimitedViewsBeforeLogin,
              allowLimitedViewsBeforeLoginCount: updatedSettings.allowLimitedViewsBeforeLoginCount
            }
          }
        },
        refetchQueries: [GET_HUB_SETTINGS],
        optimisticResponse: {
          getHubSettings: {
            ...settingsToUpdate,
            guestVisibility: updatedSettings.guestVisibility,
            registrationSettings: updatedSettings.registrationSettingConfigs,
            allowLimitedViewsBeforeLogin: updatedSettings.allowLimitedViewsBeforeLogin,
            allowLimitedViewsBeforeLoginCount: updatedSettings.allowLimitedViewsBeforeLoginCount
          }
        },
        onCompleted: () => {
          if (
            visitorPermissions.guestVisibility !== updatedSettings.guestVisibility &&
            updatedSettings.guestVisibility === GuestVisibility.Private
          ) {
            deleteSharedToken({
              variables: {
                input: {
                  id: videoCenterId
                }
              },
              onError: apolloError => {
                LOG.error(apolloError, 'Failed to delete shared token for hubId ', videoCenterId);
              }
            });
          }
          setShowAlertSuccess(true);
          setIsPageEdited(false);
          setShowFailureAlert(false);
          setFailureAlertContent('');
        },
        onError: apolloError => {
          setShowFailureAlert(true);
          setFailureAlertContent(translate('registration_settings_data_not_saved_banner'));
          LOG.error(apolloError, 'Failed to save allowed contact types for hubId', videoCenterId);
        },
        update(cache) {
          cache.writeQuery({
            query: GET_HUB_SETTINGS,
            variables: {
              id: {
                id: videoCenterId
              }
            },
            data: {
              getHubSettings: {
                ...settingsToUpdate,
                guestVisibility: updatedSettings.guestVisibility,
                registrationSettings: updatedSettings.registrationSettingConfigs,
                allowLimitedViewsBeforeLogin: updatedSettings.allowLimitedViewsBeforeLogin,
                allowLimitedViewsBeforeLoginCount: updatedSettings.allowLimitedViewsBeforeLoginCount
              }
            }
          });
        }
      });
    }

    // Save allowed email domains
    if (
      !(
        updatedSettings.emailDomains.every(item => visitorPermissions.emailDomains.includes(item)) &&
        visitorPermissions.emailDomains.every(item => updatedSettings.emailDomains.includes(item))
      )
    ) {
      await saveAllowedEmailDomainsMutation({
        variables: {
          input: {
            id: videoCenterId,
            emailDomains: updatedSettings.emailDomains
          }
        },
        refetchQueries: [getEmailDomainsQuery],
        optimisticResponse: {
          getEmailDomains: {
            emailDomains: updatedSettings.emailDomains
          }
        },
        update(cache) {
          cache.writeQuery({
            query: getEmailDomainsQuery,
            variables: {
              input: {
                id: videoCenterId
              }
            },
            data: {
              getEmailDomains: {
                emailDomains: updatedSettings.emailDomains
              }
            }
          });
        },
        onCompleted: () => {
          setShowAlertSuccess(true);
          setIsPageEdited(false);
          setShowFailureAlert(false);
          setFailureAlertContent('');
        },
        onError: apolloError => {
          setShowFailureAlert(true);
          setFailureAlertContent(translate('registration_settings_data_not_saved_banner'));
          LOG.error(apolloError, 'Failed to save allowed contact types for hubId', videoCenterId);
        }
      });
    }

    // Save allowed contact groups
    if (
      !(
        updatedSettings.contactGroups.every(item => visitorPermissions.contactGroups.includes(item)) &&
        visitorPermissions.contactGroups.every(item => updatedSettings.contactGroups.includes(item))
      )
    ) {
      await saveAllowedContactGroupsMutation({
        variables: {
          input: {
            id: videoCenterId,
            contactGroups: updatedSettings.contactGroups
          }
        },
        refetchQueries: [getAllowedContactGroupsQuery],
        optimisticResponse: {
          getAllowedContactGroups: {
            contactGroups: updatedSettings.contactGroups
          }
        },
        update(cache) {
          cache.writeQuery({
            query: getAllowedContactGroupsQuery,
            variables: {
              input: {
                id: videoCenterId
              }
            },
            data: {
              getAllowedContactGroups: {
                contactGroups: updatedSettings.contactGroups
              }
            }
          });
        },
        onCompleted: () => {
          setShowAlertSuccess(true);
          setShowFailureAlert(false);
          setFailureAlertContent('');
          setRegistrationSettings(updatedSettings);
          setVisitorPermissions(updatedSettings);
        },
        onError: apolloError => {
          setShowFailureAlert(true);
          setFailureAlertContent(translate('registration_settings_data_not_saved_banner'));
          LOG.error(apolloError, 'Failed to save allowed contact types for hubId', videoCenterId);
        }
      });
    }

    const recentlySelectedContactTypes = updatedSettings.contactTypes.filter(
      contactTypes => !visitorPermissions.contactTypes.includes(contactTypes)
    );
    const recentlyDeletedContactTypes = visitorPermissions.contactTypes.filter(
      contactTypes => !updatedSettings.contactTypes.includes(contactTypes)
    );

    // save allowed contact types
    if (recentlySelectedContactTypes.length > 0 || recentlyDeletedContactTypes.length > 0) {
      await saveAllowedContactTypesMutation({
        variables: {
          saveInput: {
            id: videoCenterId,
            contactTypes: recentlySelectedContactTypes
          },
          deleteInput: {
            id: videoCenterId,
            contactTypes: recentlyDeletedContactTypes
          }
        },
        refetchQueries: [getAllowedContactTypesQuery],
        update(cache) {
          let allowedContactTypesList = visitorPermissions.contactTypes;
          const deleteContactTypesSet = new Set(recentlyDeletedContactTypes);
          if (recentlyDeletedContactTypes) {
            allowedContactTypesList = visitorPermissions.contactTypes.filter(
              contactType => !deleteContactTypesSet.has(contactType)
            );
          }
          cache.writeQuery({
            query: getAllowedContactTypesQuery,
            variables: {
              input: {
                id: videoCenterId
              }
            },
            data: {
              getAllowedContactTypes: {
                contactTypes: allowedContactTypesList.concat(recentlySelectedContactTypes)
              }
            }
          });
        },
        onCompleted: () => {
          setShowAlertSuccess(true);
          setVisitorPermissions(updatedSettings);
          setRegistrationSettings(updatedSettings);
          setShowFailureAlert(false);
          setFailureAlertContent('');
        },
        onError: apolloError => {
          setShowFailureAlert(true);
          setFailureAlertContent(translate('registration_settings_data_not_saved_banner'));
          LOG.error(apolloError, 'Failed to save allowed contact types for hubId', videoCenterId);
        }
      });
    }

    // Save and remove blocked contacts
    const newlySelectedBlockedContacts = updatedSettings.blockedContacts.filter(
      contact => !visitorPermissions.blockedContacts.includes(contact)
    );
    const newlyDeletedBlockedContacts = visitorPermissions.blockedContacts.filter(
      contact => !updatedSettings.blockedContacts.includes(contact)
    );
    if (newlySelectedBlockedContacts.length + newlyDeletedBlockedContacts.length > 0) {
      await saveBlockedContactMutation({
        variables: {
          saveInput: {
            id: videoCenterId,
            blockedContacts: newlySelectedBlockedContacts
          },
          deleteInput: {
            id: videoCenterId,
            blockedContacts: newlyDeletedBlockedContacts
          }
        },
        refetchQueries: [getBlockedContactsQuery],
        update(cache) {
          let restrictedContacts = visitorPermissions.blockedContacts;
          if (newlyDeletedBlockedContacts) {
            restrictedContacts = removeContacts(newlyDeletedBlockedContacts, restrictedContacts);
          }
          cache.writeQuery({
            query: getBlockedContactsQuery,
            variables: {
              input: {
                id: videoCenterId
              }
            },
            data: {
              getBlockedContacts: {
                blockedContacts: restrictedContacts.concat(newlySelectedBlockedContacts)
              }
            }
          });
        },
        onCompleted: () => {
          setShowAlertSuccess(true);
          setShowFailureAlert(false);
          setFailureAlertContent('');
          setRegistrationSettings(updatedSettings);
          setVisitorPermissions(updatedSettings);
        },
        onError: apolloError => {
          setShowFailureAlert(true);
          setFailureAlertContent(translate('registration_settings_data_not_saved_banner'));
          LOG.error(apolloError, 'Failed to save allowed contact types for hubId', videoCenterId);
        }
      });
    }

    // Save and remove blocked contacts
    const newlySelectedBlockedContactGroups = updatedSettings.blockedContactGroups.filter(
      contact => !visitorPermissions.blockedContactGroups.includes(contact)
    );
    const newlyDeletedBlockedContactGroups = visitorPermissions.blockedContactGroups.filter(
      contact => !updatedSettings.blockedContactGroups.includes(contact)
    );
    if (newlySelectedBlockedContactGroups.length + newlyDeletedBlockedContactGroups.length > 0) {
      await saveBlockedContactGroupMutation({
        variables: {
          saveInput: {
            id: videoCenterId,
            blockedContactGroups: newlySelectedBlockedContactGroups
          },
          deleteInput: {
            id: videoCenterId,
            blockedContactGroups: newlyDeletedBlockedContactGroups
          }
        },
        refetchQueries: [getBlockedContactGroupsQuery],
        update(cache) {
          let restrictedContactGroups = visitorPermissions.blockedContactGroups;
          if (newlyDeletedBlockedContactGroups) {
            restrictedContactGroups = removeContacts(newlyDeletedBlockedContactGroups, restrictedContactGroups);
          }
          cache.writeQuery({
            query: getBlockedContactGroupsQuery,
            variables: {
              input: {
                id: videoCenterId
              }
            },
            data: {
              getBlockedContactGroups: {
                contactGroups: restrictedContactGroups.concat(newlySelectedBlockedContactGroups)
              }
            }
          });
        },
        onCompleted: () => {
          setShowAlertSuccess(true);
          setShowFailureAlert(false);
          setVisitorPermissions(updatedSettings);
          setRegistrationSettings(updatedSettings);
          setFailureAlertContent('');
        },
        onError: apolloError => {
          setShowFailureAlert(true);
          setFailureAlertContent(translate('registration_settings_data_not_saved_banner'));
          LOG.error(apolloError, 'Failed to save allowed contact types for hubId', videoCenterId);
        }
      });
    }
  };

  useEffect(() => {
    if (isEqual(visitorPermissions, registrationSettings)) {
      setIsPageEdited(false);
    } else {
      setIsPageEdited(true);
    }
  }, [registrationSettings, setIsPageEdited, visitorPermissions]);

  const visitorPermissionsBody = (): JSX.Element =>
    videoCenterInformationFeature ? (
      <NewVisitorPermissionsContainer
        registrationSettings={registrationSettings}
        setRegistrationSettings={setRegistrationSettings}
        visitorPermissions={visitorPermissions}
        onUpdate={onUpdateRegistrationSettings}
        isSaveButtonClicked={isSaveButtonClicked}
        setIsSaveButtonClicked={setIsSaveButtonClicked}
        setIsPageEdited={setIsPageEdited}
      />
    ) : (
      <VisitorPermissionsContainer
        visitorPermissions={visitorPermissions}
        onUpdate={onUpdateRegistrationSettings}
        setIsPageEdited={setIsPageEdited}
      />
    );

  return (
    <div css={container}>
      <Header
        title={translate('visitor_permissions_title')}
        breadCrumbs={headerBreadCrumbs}
        actions={
          videoCenterInformationFeature && [
            {
              value: translate('visitor_permissions_save_button'),
              appearance: 'filled',
              onClick: (): void => {
                setIsPageEdited(false);
                setShowAlertSuccess(false);
                setIsSaveButtonClicked(true);
              },
              disabled: !isPageEdited,
              label: translate('visitor_permissions_save_button')
            }
          ]
        }
      />
      {showAlertSuccess && !showFailureAlert && (
        <div css={{ margin: '1.5rem' }}>
          <PageAlert
            appearance="success"
            content={translate('visitor_permissions_update_alert_text')}
            dismissible
            onDismiss={() => setShowAlertSuccess(false)}
            testID="visitor-permissions-alert-form-success"
          />
        </div>
      )}
      {showFailureAlert && (
        <div css={{ margin: '1.5rem' }}>
          <PageAlert
            appearance="danger"
            content={failureAlertContent}
            dismissible
            onDismiss={() => {
              setShowFailureAlert(false);
              setFailureAlertContent('');
            }}
            testID="visitor-permissions-alert-form-error"
          />
        </div>
      )}
      <LoadingWrapper
        loading={
          fetchingSettings ||
          updatingData ||
          savingEmailDomains ||
          fetchingEmailDomains ||
          savingContactGroups ||
          fetchingAllowedContactGroups ||
          savingContactTypes ||
          fetchingAllowedContactTypes ||
          fetchingAllowedContactGroups ||
          savingBlockedContacts ||
          fetchingBlockedContacts ||
          fetchingBlockedContactGroups ||
          savingBlockedContactGroups
        }
        renderer={visitorPermissionsBody}
        ariaLabel={translate('events_plus_generic_loading')}
        errors={[
          getHubSettingsError,
          getEmailDomainsError,
          getAllowedContactGroupsError,
          getAllowedContactTypesError,
          getBlockedContactsError,
          getBlockedContactGroupsError
        ]}
      />
      <NavigationConfirmationModal
        isOpen={showNavigationConfirmationModal}
        setIsOpen={setShowNavigationConfirmationModal}
        bodyText={translate('page-navigation-confirmation-body')}
        preventLeave={isPageEdited}
        testID="events-plus-visitor-permissions-page"
      />
    </div>
  );
}
interface Props {
  videoCenterId: string;
  videoCenterTitle: string;
}

export default VisitorPermissions;

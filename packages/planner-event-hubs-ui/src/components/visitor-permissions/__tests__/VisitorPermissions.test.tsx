import { fireEvent, render, waitFor, within } from '@testing-library/react';
import { screen } from 'nucleus-text/testing-library/screen';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import React from 'react';
import VisitorPermissions from '@components/visitor-permissions/VisitorPermissions';
import { MockedProvider } from '@apollo/client/testing';
import { GET_HUB_SETTINGS } from '@cvent/planner-event-hubs-model/operations/hub';
import { AppFeaturesProvider } from '@components/AppFeaturesProvider';
import {
  getEmailDomainsQuery,
  saveEmailDomainsMutation
} from '@cvent/planner-event-hubs-model/operations/registrationSettings';
import {
  getAllowedContactGroupsQuery,
  getAllowedContactTypesQuery,
  saveContactTypesMutation,
  saveBlockedContactsMutation,
  searchContactGroupsQuery,
  searchContactsQuery,
  searchContactTypesQuery,
  getBlockedContactsQuery,
  saveBlockedContactGroupsMutation,
  getBlockedContactGroupsQuery
} from '@cvent/planner-event-hubs-model/operations/contacts';
import { CONTACT_GROUP_TYPE } from '@utils/constants';
import 'jest-axe/extend-expect';
import { axe } from 'jest-axe';

interface RouterProps {
  pathname: string;
  route: string;
  query: {
    isSuccess: boolean;
  };
  replace: () => void;
}

jest.mock('next/router', () => ({
  useRouter(): RouterProps {
    return {
      pathname: '/path',
      route: '/route',
      query: { isSuccess: true },
      replace: jest.fn()
    };
  }
}));

const appFeatures = [
  {
    name: 'videoCenterInformationFeature',
    enabled: false,
    experimentVersion: '1001'
  }
];

const mocks = [
  {
    request: {
      query: GET_HUB_SETTINGS,
      variables: {
        id: {
          id: 'test-video-hub'
        }
      }
    },
    result: {
      data: {
        getHubSettings: {
          displayCventPrivacyPolicy: false,
          cventPrivacyPolicyLinkText: 'hello 2',
          displayPrivacyPolicy: false,
          privacyPolicyUrl: '',
          privacyPolicyLinkText: '',
          displayTermsLinkOnFooter: false,
          termsLinkText: '',
          displayTermsOnLogin: false,
          termsText: 'knfkjsakjfnjks',
          notifyUsersAboutCookie: false,
          displayCventPrivacyPolicyInCookie: false,
          allowTurnOffCookies: false,
          ccpaEnableDoNotSell: false,
          ccpaLinkText: 'Do Not Sell My Personal Information',
          ccpaDoNotSellUrl: 'www.cvent.com',
          ccpaLinkExplanationText: 'ccpa explanation Text',
          memberProfilePublic: false,
          profileCard: null,
          guestVisibility: 'HOMEPAGE_PUBLIC',
          registrationSettings: {
            allowAllContactsRegistration: false,
            allowContactGroupsRegistration: false,
            allowContactTypesRegistration: false,
            blockContactsRegistration: false,
            blockListRegistration: false,
            allowedEmailDomain: 'CUSTOM_DOMAINS'
          }
        }
      }
    }
  },
  {
    request: {
      query: GET_HUB_SETTINGS,
      variables: {
        id: {
          id: 'test-video-hub-public'
        }
      }
    },
    result: {
      data: {
        getHubSettings: {
          displayCventPrivacyPolicy: false,
          cventPrivacyPolicyLinkText: 'hello 2',
          displayPrivacyPolicy: false,
          privacyPolicyUrl: '',
          privacyPolicyLinkText: '',
          displayTermsLinkOnFooter: false,
          termsLinkText: '',
          displayTermsOnLogin: false,
          termsText: 'knfkjsakjfnjks',
          notifyUsersAboutCookie: false,
          displayCventPrivacyPolicyInCookie: false,
          allowTurnOffCookies: false,
          ccpaEnableDoNotSell: false,
          ccpaLinkText: 'Do Not Sell My Personal Information',
          ccpaDoNotSellUrl: 'www.cvent.com',
          ccpaLinkExplanationText: 'ccpa explanation Text',
          memberProfilePublic: false,
          profileCard: null,
          guestVisibility: 'PUBLIC',
          registrationSettings: {
            allowAllContactsRegistration: false,
            allowContactGroupsRegistration: true,
            allowContactTypesRegistration: false,
            blockContactsRegistration: false,
            blockListRegistration: false,
            allowedEmailDomain: 'CUSTOM_DOMAINS'
          }
        }
      }
    }
  },
  {
    request: {
      query: GET_HUB_SETTINGS,
      variables: {
        id: {
          id: 'test-video-hub-registration-settings'
        }
      }
    },
    result: {
      data: {
        getHubSettings: {
          displayCventPrivacyPolicy: false,
          cventPrivacyPolicyLinkText: 'hello 2',
          displayPrivacyPolicy: false,
          privacyPolicyUrl: '',
          privacyPolicyLinkText: '',
          displayTermsLinkOnFooter: false,
          termsLinkText: '',
          displayTermsOnLogin: false,
          termsText: 'knfkjsakjfnjks',
          notifyUsersAboutCookie: false,
          displayCventPrivacyPolicyInCookie: false,
          allowTurnOffCookies: false,
          ccpaEnableDoNotSell: false,
          ccpaLinkText: 'Do Not Sell My Personal Information',
          ccpaDoNotSellUrl: 'www.cvent.com',
          ccpaLinkExplanationText: 'ccpa explanation Text',
          memberProfilePublic: false,
          profileCard: null,
          guestVisibility: 'HOMEPAGE_PUBLIC',
          registrationSettings: {
            allowAllContactsRegistration: false,
            allowContactGroupsRegistration: true,
            allowContactTypesRegistration: true,
            blockContactsRegistration: false,
            blockListRegistration: false,
            allowedEmailDomain: 'CUSTOM_DOMAINS'
          }
        }
      }
    }
  },
  {
    request: {
      query: getEmailDomainsQuery,
      variables: {
        input: {
          id: 'test-video-hub'
        }
      }
    },
    result: {
      data: {
        getEmailDomains: {
          emailDomains: []
        }
      }
    }
  },
  {
    request: {
      query: getAllowedContactGroupsQuery,
      variables: {
        input: {
          id: 'test-video-hub'
        }
      }
    },
    result: {
      data: {
        getAllowedContactGroups: {
          contactGroups: []
        }
      }
    }
  },
  {
    request: {
      query: getAllowedContactTypesQuery,
      variables: {
        input: {
          id: 'test-video-hub'
        }
      }
    },
    result: {
      data: {
        getAllowedContactTypes: {
          contactTypes: []
        }
      }
    }
  },
  {
    request: {
      query: saveEmailDomainsMutation,
      variables: {
        input: {
          id: 'test-video-hub',
          emailDomains: ['']
        }
      }
    },
    result: {
      data: {
        saveEmailDomains: {
          emailDomains: ['']
        }
      }
    }
  },
  {
    request: {
      query: searchContactGroupsQuery,
      variables: {
        input: {
          limit: 100,
          searchTerm: '',
          token: null,
          type: CONTACT_GROUP_TYPE.STANDARD
        }
      }
    },
    result: {
      data: {
        searchContactGroups: {
          paging: {
            currentToken: '01359068-064c-479f-b171-7057c11004d6',
            limit: 100,
            totalCount: 3,
            nextToken: null
          },
          data: [
            {
              id: '68585c5e-e4ef-4e55-aa44-dc7cbb265486',
              name: 'Summer Camp'
            },
            {
              id: 'dcef630b-42c2-4ef4-8718-c2fcf3093b1b',
              name: 'Contact Inf'
            },
            {
              id: '4b5d9bff-fe7c-4cc8-939a-b78a605a3b9b',
              name: 'New VIP Members'
            }
          ]
        }
      }
    }
  },
  {
    request: {
      query: searchContactTypesQuery,
      variables: {
        input: {
          limit: 100,
          searchTerm: '',
          token: null
        }
      }
    },
    result: {
      data: {
        searchContactTypes: {
          paging: {
            currentToken: '01359068-064c-479f-b171-7057c11004d6',
            limit: 100,
            totalCount: 3,
            nextToken: null
          },
          data: [
            {
              id: '68585c5e-e4ef-4e55-aa44-dc7cbb265486',
              name: 'Rabbit Fan'
            },
            {
              id: 'dcef630b-42c2-4ef4-8718-c2fcf3093b1b',
              name: 'peekaboo'
            },
            {
              id: '4b5d9bff-fe7c-4cc8-939a-b78a605a3b9b',
              name: 'Basic Registration'
            }
          ]
        }
      }
    }
  },
  {
    request: {
      query: getAllowedContactGroupsQuery,
      variables: {
        input: {
          id: 'test-video-hub-public'
        }
      }
    },
    result: {
      data: {
        getAllowedContactGroups: {
          contactGroups: [
            'dcef630b-42c2-4ef4-8718-c2fcf3093b1b',
            '4d216d63-91cb-4ff7-8dfd-49b741b631b9',
            '68585c5e-e4ef-4e55-aa44-dc7cbb265486'
          ]
        }
      }
    }
  },
  {
    request: {
      query: getAllowedContactTypesQuery,
      variables: {
        input: {
          id: 'test-video-hub-public'
        }
      }
    },
    result: {
      data: {
        getAllowedContactTypes: {
          contactTypes: [
            '61e87ce9-8787-43af-a66c-fa039fdf993e',
            '64d5fda3-69f6-4d89-9df8-f7d4533e7591',
            '7053d864-ae4e-43e1-acee-f8d4cf098bcc'
          ]
        }
      }
    }
  },
  {
    request: {
      query: saveContactTypesMutation,
      variables: {
        saveInput: {
          id: 'test-video-hub-public',
          contactTypes: [
            '61e87ce9-8787-43af-a66c-fa039fdf993e',
            '64d5fda3-69f6-4d89-9df8-f7d4533e7591',
            '7053d864-ae4e-43e1-acee-f8d4cf098bcc'
          ]
        },
        deleteInput: {
          id: 'test-video-hub-public',
          contactTypes: ['61e87ce9-8787-43af-a66c-fa039fdf993e']
        }
      }
    },
    result: {
      data: {
        saveContactTypes: {
          contactTypes: [
            '61e87ce9-8787-43af-a66c-fa039fdf993e',
            '64d5fda3-69f6-4d89-9df8-f7d4533e7591',
            '7053d864-ae4e-43e1-acee-f8d4cf098bcc'
          ]
        },
        deleteContactTypes: {
          deleteContactTypes: true
        }
      }
    }
  },
  {
    request: {
      query: searchContactsQuery,
      variables: {
        input: {
          limit: 100,
          searchTerm: '',
          token: null
        }
      }
    },
    result: {
      data: {
        searchContacts: {
          paging: {
            currentToken: '01359068-064c-479f-b171-7057c11004d6',
            limit: 100,
            totalCount: 1,
            nextToken: null
          },
          data: [
            {
              id: '68585c5e-e4ef-4e55-aa44-dc7cbb265486',
              firstName: 'Amrinder',
              lastName: 'Gill',
              email: 'amrindergill@gmail.com'
            },
            {
              id: 'dcef630b-42c2-4ef4-8718-c2fcf3093b1b',
              firstName: 'Sonam',
              lastName: 'Bajwa',
              email: 'sonambajwa@gmail.com'
            },
            {
              id: '4b5d9bff-fe7c-4cc8-939a-b78a605a3b9b',
              firstName: 'Neeru',
              lastName: 'Bajwa',
              email: 'neerubajwa@gmail.com'
            }
          ]
        }
      }
    }
  },
  {
    request: {
      query: saveBlockedContactsMutation,
      variables: {
        deleteInput: {
          id: 'test-video-hub',
          blockedContacts: []
        },
        saveInput: {
          id: 'test-video-hub',
          blockedContacts: ['68585c5e-e4ef-4e55-aa44-dc7cbb265486']
        }
      }
    },
    result: {
      data: {
        deleteBlockedContacts: {
          success: true
        },
        saveBlockedContacts: {
          blockedContacts: ['68585c5e-e4ef-4e55-aa44-dc7cbb265486']
        }
      }
    }
  },
  {
    request: {
      query: getBlockedContactsQuery,
      variables: {
        input: {
          id: 'test-video-hub-blocked-contacts'
        }
      }
    },
    result: {
      data: {
        getBlockedContacts: {
          blockedContacts: ['68585c5e-e4ef-4e55-aa44-dc7cbb265486']
        }
      }
    }
  },
  {
    request: {
      query: GET_HUB_SETTINGS,
      variables: {
        id: {
          id: 'test-video-hub-blocked-contacts'
        }
      }
    },
    result: {
      data: {
        getHubSettings: {
          displayCventPrivacyPolicy: false,
          cventPrivacyPolicyLinkText: 'hello 2',
          displayPrivacyPolicy: false,
          privacyPolicyUrl: '',
          privacyPolicyLinkText: '',
          displayTermsLinkOnFooter: false,
          termsLinkText: '',
          displayTermsOnLogin: false,
          termsText: 'knfkjsakjfnjks',
          notifyUsersAboutCookie: false,
          displayCventPrivacyPolicyInCookie: false,
          allowTurnOffCookies: false,
          ccpaEnableDoNotSell: false,
          ccpaLinkText: 'Do Not Sell My Personal Information',
          ccpaDoNotSellUrl: 'www.cvent.com',
          ccpaLinkExplanationText: 'ccpa explanation Text',
          memberProfilePublic: false,
          profileCard: null,
          guestVisibility: 'HOMEPAGE_PUBLIC',
          registrationSettings: {
            allowAllContactsRegistration: false,
            allowContactGroupsRegistration: false,
            allowContactTypesRegistration: false,
            blockContactsRegistration: true,
            blockListRegistration: true,
            allowedEmailDomain: 'CUSTOM_DOMAINS'
          }
        }
      }
    }
  },
  {
    request: {
      query: searchContactGroupsQuery,
      variables: {
        input: {
          limit: 100,
          searchTerm: '',
          token: null,
          type: CONTACT_GROUP_TYPE.BLACKLIST
        }
      }
    },
    result: {
      data: {
        searchContactGroups: {
          paging: {
            currentToken: '01359068-064c-479f-b171-7057c11004d6',
            limit: 100,
            totalCount: 2,
            nextToken: null
          },
          data: [
            {
              id: '68585c5e-e4ef-4e55-aa44-dc7cbb265486',
              name: 'Contact exclusion list'
            },
            {
              id: 'dcef630b-42c2-4ef4-8718-c2fcf3093b1b',
              name: 'Excluded People'
            }
          ]
        }
      }
    }
  },
  {
    request: {
      query: saveBlockedContactGroupsMutation,
      variables: {
        deleteInput: {
          id: 'test-video-hub-blocked-contacts',
          blockedContactGroups: []
        },
        saveInput: {
          id: 'test-video-hub-blocked-contacts',
          blockedContactGroups: ['68585c5e-e4ef-4e55-aa44-dc7cbb265486']
        }
      }
    },
    result: {
      data: {
        deleteBlockedContactGroups: {
          success: true
        },
        saveBlockedContactGroups: {
          contactGroups: ['68585c5e-e4ef-4e55-aa44-dc7cbb265486', '4d216d63-91cb-4ff7-8dfd-49b741b631b9']
        }
      }
    }
  },
  {
    request: {
      query: getBlockedContactGroupsQuery,
      variables: {
        input: {
          id: 'test-video-hub-blocked-contacts'
        }
      }
    },
    result: {
      data: {
        getBlockedContactGroups: {
          contactGroups: ['68585c5e-e4ef-4e55-aa44-dc7cbb265486', '4d216d63-91cb-4ff7-8dfd-49b741b631b9']
        }
      }
    }
  }
];

describe('Visitor Permissions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders allowed contacts component - all contacts', async () => {
    const { container } = render(
      <TestWrapper>
        <MockedProvider mocks={mocks}>
          <AppFeaturesProvider value={appFeatures}>
            <VisitorPermissions videoCenterId="test-video-hub" videoCenterTitle="test" />
          </AppFeaturesProvider>
        </MockedProvider>
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId('registration-settings-container')).toBeInTheDocument();
    });
    expect(screen.getByText('Allowed Contacts')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Select contacts that can register or import your own list. Email domain rules don’t apply to this list.'
      )
    ).toBeInTheDocument();
    const allowedContactComponent = within(screen.getByTestId('allowed-contact-list-fields'));
    const editButton = allowedContactComponent.getByRole('button');
    fireEvent.click(editButton);
    const editAllowedContactComponent = within(screen.getByTestId('edit-allowed-contactlist-fields'));
    expect(editAllowedContactComponent).toBeDefined();
    expect(screen.getByText('Who can register for this Events+ hub?')).toBeInTheDocument();
    const allContactGroupCheckbox = editAllowedContactComponent.getByRole('checkbox', {
      name: /Select contact groups/i
    });
    fireEvent.click(allContactGroupCheckbox);
    expect(allContactGroupCheckbox).toBeChecked();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders allowed contacts component - contact groups', async () => {
    const { container } = render(
      <TestWrapper>
        <MockedProvider mocks={mocks}>
          <AppFeaturesProvider value={appFeatures}>
            <VisitorPermissions videoCenterId="test-video-hub" videoCenterTitle="test" />
          </AppFeaturesProvider>
        </MockedProvider>
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId('registration-settings-container')).toBeInTheDocument();
    });
    expect(screen.getByText('Allowed Contacts')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Select contacts that can register or import your own list. Email domain rules don’t apply to this list.'
      )
    ).toBeInTheDocument();
    const allowedContactComponent = within(screen.getByTestId('allowed-contact-list-fields'));
    const editButton = allowedContactComponent.getByRole('button');
    fireEvent.click(editButton);
    const editAllowedContactComponent = within(screen.getByTestId('edit-allowed-contactlist-fields'));
    expect(editAllowedContactComponent).toBeDefined();
    expect(screen.getByText('Who can register for this Events+ hub?')).toBeInTheDocument();
    const contactGroupCheckbox = editAllowedContactComponent.getByRole('checkbox', {
      name: /Select contact groups/i
    });
    expect(contactGroupCheckbox).not.toBeChecked();
    fireEvent.click(contactGroupCheckbox);
    const searchContactGroupButton = editAllowedContactComponent.getByLabelText('Search contact groups');
    fireEvent.click(searchContactGroupButton);
    await new Promise(resolve => {
      setTimeout(resolve, 500);
    });

    const contactGroupModal = within(screen.getByTestId('contact-group-modal'));
    expect(screen.getByText('Search Contact Groups')).toBeInTheDocument();
    expect(
      contactGroupModal.getByRole('textbox', { name: /Enter text to search contact groups/i })
    ).toBeInTheDocument();
    expect(contactGroupModal.getByRole('button', { name: /Search/i })).toBeInTheDocument();
    expect(contactGroupModal.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();
    expect(contactGroupModal.getByRole('button', { name: /Save/i })).toBeInTheDocument();

    const selectContactGroup = screen.getByTestId('contact-group-modal-table-row-0');
    fireEvent.click(selectContactGroup);

    const contactGroupModalSaveButton = contactGroupModal.getByRole('button', { name: /Save/i });
    fireEvent.click(contactGroupModalSaveButton);

    const saveContactGroupButton = editAllowedContactComponent.getByTestId(
      'edit-allowed-contactlist-fields-save-button'
    );
    fireEvent.click(saveContactGroupButton);
    expect(screen.getByTestId('visitor-permissions-confirmation-modal')).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders allowed contacts component - contact types', async () => {
    const { container } = render(
      <TestWrapper>
        <MockedProvider mocks={mocks}>
          <AppFeaturesProvider value={appFeatures}>
            <VisitorPermissions videoCenterId="test-video-hub" videoCenterTitle="test" />
          </AppFeaturesProvider>
        </MockedProvider>
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId('registration-settings-container')).toBeInTheDocument();
    });
    expect(screen.getByText('Allowed Contacts')).toBeInTheDocument();
    const allowedContactComponent = within(screen.getByTestId('allowed-contact-list-fields'));
    const editButton = allowedContactComponent.getByRole('button');
    fireEvent.click(editButton);
    const editAllowedContactComponent = within(screen.getByTestId('edit-allowed-contactlist-fields'));
    expect(editAllowedContactComponent).toBeDefined();
    expect(screen.getByText('Who can register for this Events+ hub?')).toBeInTheDocument();
    const contactTypesCheckbox = editAllowedContactComponent.getByRole('checkbox', {
      name: /Select contact types/i
    });
    expect(contactTypesCheckbox).not.toBeChecked();
    fireEvent.click(contactTypesCheckbox);
    const searchContactTypesButton = editAllowedContactComponent.getByLabelText('Search contact types');
    fireEvent.click(searchContactTypesButton);
    await new Promise(resolve => {
      setTimeout(resolve, 500);
    });
    const contactTypeModal = within(screen.getByTestId('contact-type-modal'));
    expect(screen.getByText('Search Contact Types')).toBeInTheDocument();
    expect(contactTypeModal.getByRole('textbox', { name: /Search contact types/i })).toBeInTheDocument();
    expect(contactTypeModal.getByRole('button', { name: /Search/i })).toBeInTheDocument();
    expect(contactTypeModal.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();

    const selectContactType = screen.getByTestId('contact-type-modal-table-row-0');
    fireEvent.click(selectContactType);

    const contactTypeModalSaveButton = contactTypeModal.getByRole('button', { name: /Save/i });
    fireEvent.click(contactTypeModalSaveButton);

    const saveContactTypeButton = editAllowedContactComponent.getByTestId(
      'edit-allowed-contactlist-fields-save-button'
    );
    fireEvent.click(saveContactTypeButton);
    const saveAllowedContactTypesModal = within(screen.getByTestId('visitor-permissions-confirmation-modal'));
    expect(screen.getByText('Save changes?')).toBeInTheDocument();
    const saveButtonModal = saveAllowedContactTypesModal.getByRole('button', { name: /Save/i });
    fireEvent.click(saveButtonModal);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders allowed contacts component', async () => {
    const { container } = render(
      <TestWrapper>
        <MockedProvider mocks={mocks}>
          <AppFeaturesProvider value={appFeatures}>
            <VisitorPermissions videoCenterId="test-video-hub-registration-settings" videoCenterTitle="test" />
          </AppFeaturesProvider>
        </MockedProvider>
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId('registration-settings-container')).toBeInTheDocument();
    });
    expect(screen.getByText('Allowed Contacts')).toBeInTheDocument();
    const allowedContactComponent = within(screen.getByTestId('allowed-contact-list-fields'));
    const editButton = allowedContactComponent.getByRole('button');
    fireEvent.click(editButton);
    const editAllowedContactComponent = within(screen.getByTestId('edit-allowed-contactlist-fields'));
    expect(editAllowedContactComponent).toBeDefined();
    expect(screen.getByText('Who can register for this Events+ hub?')).toBeInTheDocument();
    const contactGroupCheckbox = editAllowedContactComponent.getByRole('checkbox', {
      name: /Select contact groups/i
    });
    expect(contactGroupCheckbox).toBeChecked();
    expect(editAllowedContactComponent.getByLabelText('Search contact groups')).toBeInTheDocument();
    const contactTypesCheckbox = editAllowedContactComponent.getByRole('checkbox', {
      name: /Select contact types/i
    });
    expect(contactTypesCheckbox).toBeChecked();
    expect(editAllowedContactComponent.getByLabelText('Search contact types')).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders visibility component', async () => {
    const { container } = render(
      <TestWrapper>
        <MockedProvider mocks={mocks}>
          <AppFeaturesProvider value={appFeatures}>
            <VisitorPermissions videoCenterId="test-video-hub" videoCenterTitle="test" />
          </AppFeaturesProvider>
        </MockedProvider>
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId('registration-settings-container')).toBeInTheDocument();
    });
    expect(screen.getByText('Visibility')).toBeInTheDocument();
    const visibilityComponent = within(screen.getByTestId('guest-visibility-field'));
    const editButton = visibilityComponent.getByRole('button');
    fireEvent.click(editButton);
    const editVisibilityComponent = within(screen.getByTestId('edit-guest-visibility-field'));
    expect(editVisibilityComponent).toBeDefined();
    expect(
      screen.getByText(
        'Set the visibility of this Events+ hub. You can set rules for registration if you require login.'
      )
    ).toBeInTheDocument();
    const homepagePublicOption = editVisibilityComponent.getByRole('radio', {
      name: /Home page is public, require login to view more/i
    });
    expect(homepagePublicOption).toBeChecked();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders visibility component - Public', async () => {
    const { container } = render(
      <TestWrapper>
        <MockedProvider mocks={mocks}>
          <AppFeaturesProvider value={appFeatures}>
            <VisitorPermissions videoCenterId="test-video-hub-public" videoCenterTitle="demo" />
          </AppFeaturesProvider>
        </MockedProvider>
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId('registration-settings-container')).toBeInTheDocument();
    });
    expect(screen.getByTestId('email-domain-fields-edit-button')).toBeDisabled();
    expect(screen.getByTestId('allowed-contact-list-fields-edit-button')).toBeDisabled();
    expect(screen.getByText('Visibility')).toBeInTheDocument();
    const visibilityComponent = within(screen.getByTestId('guest-visibility-field'));
    const editButton = visibilityComponent.getByRole('button');
    fireEvent.click(editButton);
    const editVisibilityComponent = within(screen.getByTestId('edit-guest-visibility-field'));
    expect(editVisibilityComponent).toBeDefined();
    expect(
      screen.getByText(
        'Set the visibility of this Events+ hub. You can set rules for registration if you require login.'
      )
    ).toBeInTheDocument();
    const publicOption = editVisibilityComponent.getByRole('radio', {
      name: /Anyone can view/i
    });
    expect(publicOption).toBeChecked();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders contact allowlist field component  - contact groups selected', async () => {
    const { container } = render(
      <TestWrapper>
        <MockedProvider mocks={mocks}>
          <AppFeaturesProvider value={appFeatures}>
            <VisitorPermissions videoCenterId="test-video-hub-public" videoCenterTitle="demo" />
          </AppFeaturesProvider>
        </MockedProvider>
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId('registration-settings-container')).toBeInTheDocument();
    });
    expect(screen.getByText('Allowed Contacts')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Select contacts that can register or import your own list. Email domain rules don’t apply to this list.'
      )
    ).toBeInTheDocument();
    const allowedContactComponent = within(screen.getByTestId('allowed-contact-list-fields'));
    const editButton = allowedContactComponent.getByRole('button');
    expect(editButton).toBeInTheDocument();
    expect(screen.getByText('Contact groups')).toBeInTheDocument();
    expect(screen.getByText('3 selected')).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders visibility settings edit modal successfully', async () => {
    const { container } = render(
      <TestWrapper>
        <MockedProvider mocks={mocks}>
          <AppFeaturesProvider value={appFeatures}>
            <VisitorPermissions videoCenterId="test-video-hub-registration-settings" videoCenterTitle="test" />
          </AppFeaturesProvider>
        </MockedProvider>
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId('registration-settings-container')).toBeInTheDocument();
    });
    const guestVisibilityEditbutton = screen.getByTestId('guest-visibility-field-edit-button');
    fireEvent.click(guestVisibilityEditbutton);

    const anyOneCanView = screen.getByLabelText('Anyone can view');
    fireEvent.click(anyOneCanView);

    const editVisibilitySaveButton = screen.getByTestId('edit-guest-visibility-field-save-button');
    fireEvent.click(editVisibilitySaveButton);
    expect(screen.getByTestId('visitor-permissions-confirmation-modal')).toBeInTheDocument();
    expect(screen.getByText('Override registration rules?')).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders edit blocked contacts component - all contacts', async () => {
    const { container } = render(
      <TestWrapper>
        <MockedProvider mocks={mocks}>
          <AppFeaturesProvider value={appFeatures}>
            <VisitorPermissions videoCenterId="test-video-hub" videoCenterTitle="test" />
          </AppFeaturesProvider>
        </MockedProvider>
      </TestWrapper>
    );
    await waitFor(() => {
      expect(screen.getByTestId('registration-settings-container')).toBeInTheDocument();
    });
    expect(screen.getByText('Blocked Contacts')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Blocked people won’t be able to register, even if they’re on the allowed contacts list or have an allowed domain.'
      )
    ).toBeInTheDocument();
    const blockedContactComponent = within(screen.getByTestId('blocked-contact-list-fields'));
    const editButton = blockedContactComponent.getByRole('button');
    fireEvent.click(editButton);
    const editBlockedContactComponent = within(screen.getByTestId('edit-blocked-contact-list-fields'));
    expect(editBlockedContactComponent).toBeDefined();
    expect(screen.getByText('Who is blocked from accessing this Events+ hub?')).toBeInTheDocument();
    const contactsCheckbox = editBlockedContactComponent.getByRole('checkbox', {
      name: /Select contacts/i
    });
    expect(contactsCheckbox).not.toBeChecked();
    fireEvent.click(contactsCheckbox);
    const searchContactsButton = editBlockedContactComponent.getByLabelText('Search contacts');
    fireEvent.click(searchContactsButton);
    await new Promise(resolve => {
      setTimeout(resolve, 500);
    });
    const blockedContactsModal = within(screen.getByTestId('blocked-contacts-modal'));
    expect(screen.getByText('Search Contacts')).toBeInTheDocument();
    expect(blockedContactsModal.getByRole('textbox', { name: /Enter text to search contacts/i })).toBeInTheDocument();
    expect(blockedContactsModal.getByRole('button', { name: /Search/i })).toBeInTheDocument();
    expect(blockedContactsModal.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();
    expect(blockedContactsModal.getByRole('button', { name: /Save/i })).toBeInTheDocument();
    expect(blockedContactsModal.getByText('amrindergill@gmail.com')).toBeInTheDocument();

    const selectContact = screen.getByTestId('blocked-contacts-modal-table-row-0');
    fireEvent.click(selectContact);

    const blockedContactsModalSaveButton = blockedContactsModal.getByRole('button', { name: /Save/i });
    fireEvent.click(blockedContactsModalSaveButton);

    const saveBlockedContactsButton = editBlockedContactComponent.getByTestId(
      'edit-blocked-contact-list-fields-save-button'
    );
    fireEvent.click(saveBlockedContactsButton);
    const saveBlockListModal = within(screen.getByTestId('visitor-permissions-confirmation-modal'));
    expect(screen.getByText('Blocked Contacts')).toBeInTheDocument();
    const saveButtonModal = saveBlockListModal.getByRole('button', { name: /Save/i });
    fireEvent.click(saveButtonModal);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders blocked contacts component - all contacts', async () => {
    const { container } = render(
      <TestWrapper>
        <MockedProvider mocks={mocks}>
          <AppFeaturesProvider value={appFeatures}>
            <VisitorPermissions videoCenterId="test-video-hub-blocked-contacts" videoCenterTitle="test" />
          </AppFeaturesProvider>
        </MockedProvider>
      </TestWrapper>
    );
    await waitFor(() => {
      expect(screen.getByTestId('registration-settings-container')).toBeInTheDocument();
    });
    expect(screen.getByText('Blocked Contacts')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Blocked people won’t be able to register, even if they’re on the allowed contacts list or have an allowed domain.'
      )
    ).toBeInTheDocument();
    expect(screen.getByTestId('blocked-contact-list-fields')).toBeInTheDocument();
    expect(screen.getByText('Blocked contacts')).toBeInTheDocument();
    expect(screen.getByText('1 selected')).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('shows error on blocked contacts component when no contact has been selected', async () => {
    const { container } = render(
      <TestWrapper>
        <MockedProvider mocks={mocks}>
          <AppFeaturesProvider value={appFeatures}>
            <VisitorPermissions videoCenterId="test-video-hub-registration-settings" videoCenterTitle="test" />
          </AppFeaturesProvider>
        </MockedProvider>
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId('registration-settings-container')).toBeInTheDocument();
    });
    expect(screen.getByText('Blocked Contacts')).toBeInTheDocument();
    const blockedContactComponent = within(screen.getByTestId('blocked-contact-list-fields'));
    const editButton = blockedContactComponent.getByRole('button');
    fireEvent.click(editButton);
    const editBlockedContactComponent = within(screen.getByTestId('edit-blocked-contact-list-fields'));
    const contactsCheckbox = editBlockedContactComponent.getByRole('checkbox', {
      name: /Select contacts/i
    });
    fireEvent.click(contactsCheckbox);
    expect(contactsCheckbox).toBeChecked();
    const searchContactsButton = editBlockedContactComponent.getByLabelText('Search contacts');
    fireEvent.click(searchContactsButton);
    await new Promise(resolve => {
      setTimeout(resolve, 500);
    });
    const blockedContactsModal = within(screen.getByTestId('blocked-contacts-modal'));

    const blockedContactsModalSaveButton = blockedContactsModal.getByRole('button', { name: /Save/i });
    fireEvent.click(blockedContactsModalSaveButton);

    const saveBlockedContactsButton = editBlockedContactComponent.getByTestId(
      'edit-blocked-contact-list-fields-save-button'
    );
    fireEvent.click(saveBlockedContactsButton);
    expect(screen.getByText('Select a contact before saving')).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('shows error on allowed contacts group component when no contact group has been selected', async () => {
    const { container } = render(
      <TestWrapper>
        <MockedProvider mocks={mocks}>
          <AppFeaturesProvider value={appFeatures}>
            <VisitorPermissions videoCenterId="test-video-hub-registration-settings" videoCenterTitle="test" />
          </AppFeaturesProvider>
        </MockedProvider>
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId('registration-settings-container')).toBeInTheDocument();
    });
    const button = screen.getByTestId('allowed-contact-list-fields-edit-button');
    fireEvent.click(button);

    const searchContactsButton = screen.getByTestId('registration-settings-search-contact-groups');
    fireEvent.click(searchContactsButton);
    await new Promise(resolve => {
      setTimeout(resolve, 500);
    });
    const save = screen.getByTestId('contact-group-modal-save-button');
    fireEvent.click(save);

    // Element does not have a translation key
    const cardSaveButton = await screen.findByTestId('edit-allowed-contactlist-fields-save-button');
    fireEvent.click(cardSaveButton);

    expect(screen.getByText('Select a contact group before saving')).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('shows error on allowed contacts type component when no contact type has been selected', async () => {
    const { container } = render(
      <TestWrapper>
        <MockedProvider mocks={mocks}>
          <AppFeaturesProvider value={appFeatures}>
            <VisitorPermissions videoCenterId="test-video-hub-registration-settings" videoCenterTitle="test" />
          </AppFeaturesProvider>
        </MockedProvider>
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId('registration-settings-container')).toBeInTheDocument();
    });
    const button = screen.getByTestId('allowed-contact-list-fields-edit-button');
    fireEvent.click(button);

    const searchContactsButton = screen.getByTestId('registration-settings-search-contact-types');
    fireEvent.click(searchContactsButton);
    await new Promise(resolve => {
      setTimeout(resolve, 500);
    });
    const save = screen.getByTestId('contact-type-modal-save-button');
    fireEvent.click(save);

    // Element does not have a translation key
    const cardSaveButton = await screen.findByTestId('edit-allowed-contactlist-fields-save-button');
    fireEvent.click(cardSaveButton);

    expect(screen.getByText('Select a contact group before saving')).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders edit blocked contacts component - exclusion lists', async () => {
    const { container } = render(
      <TestWrapper>
        <MockedProvider mocks={mocks}>
          <AppFeaturesProvider value={appFeatures}>
            <VisitorPermissions videoCenterId="test-video-hub" videoCenterTitle="test" />
          </AppFeaturesProvider>
        </MockedProvider>
      </TestWrapper>
    );

    expect(await screen.findByTestId('registration-settings-container')).toBeInTheDocument();
    expect(await screen.findByText('Blocked Contacts')).toBeInTheDocument();
    const blockedContactComponent = within(screen.getByTestId('blocked-contact-list-fields'));
    const editButton = await blockedContactComponent.findByRole('button');
    fireEvent.click(editButton);
    const editBlockedContactComponent = within(screen.getByTestId('edit-blocked-contact-list-fields'));
    expect(editBlockedContactComponent).toBeDefined();
    expect(await screen.findByText('Who is blocked from accessing this Events+ hub?')).toBeInTheDocument();
    const exclusionListsCheckbox = await editBlockedContactComponent.findByRole('checkbox', {
      name: /Select exclusion list/i
    });
    expect(exclusionListsCheckbox).not.toBeChecked();
    fireEvent.click(exclusionListsCheckbox);
    const searchExclusionListsButton = await editBlockedContactComponent.findByLabelText('Search exclusion lists');
    fireEvent.click(searchExclusionListsButton);
    await new Promise(resolve => {
      setTimeout(resolve, 500);
    });
    const exclusionListsModal = within(screen.getByTestId('exclusion-lists-modal'));
    expect(await screen.findByText('Search Exclusion Lists')).toBeInTheDocument();
    expect(
      await exclusionListsModal.findByRole('textbox', { name: /Enter text to search exclusion lists/i })
    ).toBeInTheDocument();
    expect(await exclusionListsModal.findByRole('button', { name: /Search/i })).toBeInTheDocument();
    expect(await exclusionListsModal.findByRole('button', { name: /Cancel/i })).toBeInTheDocument();
    expect(await exclusionListsModal.findByRole('button', { name: /Save/i })).toBeInTheDocument();

    const selectContactGroup = await screen.findByTestId('exclusion-lists-modal-table-row-0');
    fireEvent.click(selectContactGroup);

    const exclusionListsModalSaveButton = await exclusionListsModal.findByRole('button', { name: /Save/i });
    fireEvent.click(exclusionListsModalSaveButton);

    const saveExclusionListsButton = await editBlockedContactComponent.findByTestId(
      'edit-blocked-contact-list-fields-save-button'
    );
    fireEvent.click(saveExclusionListsButton);
    const saveBlockListModal = within(screen.getByTestId('visitor-permissions-confirmation-modal'));
    expect(await screen.findByText('Blocked Contacts')).toBeInTheDocument();
    const saveButtonModal = await saveBlockListModal.findByRole('button', { name: /Save/i });
    fireEvent.click(saveButtonModal);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders blocked contacts component - exclusion lists', async () => {
    const { container } = render(
      <TestWrapper>
        <MockedProvider mocks={mocks}>
          <AppFeaturesProvider value={appFeatures}>
            <VisitorPermissions videoCenterId="test-video-hub-blocked-contacts" videoCenterTitle="test" />
          </AppFeaturesProvider>
        </MockedProvider>
      </TestWrapper>
    );
    await waitFor(() => {
      expect(screen.getByTestId('registration-settings-container')).toBeInTheDocument();
    });
    expect(screen.getByText('Blocked Contacts')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Blocked people won’t be able to register, even if they’re on the allowed contacts list or have an allowed domain.'
      )
    ).toBeInTheDocument();
    expect(screen.getByTestId('blocked-contact-list-fields')).toBeInTheDocument();
    expect(screen.getByText('Exclusion lists')).toBeInTheDocument();
    expect(screen.getByText('2 selected')).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });
});

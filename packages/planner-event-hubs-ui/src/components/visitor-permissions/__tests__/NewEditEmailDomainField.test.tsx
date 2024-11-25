import React from 'react';
import { fireEvent, render, waitFor, within } from '@testing-library/react';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import { MockedProvider } from '@apollo/client/testing';
import VisitorPermissions from '@components/visitor-permissions/VisitorPermissions';
import { AppFeaturesProvider } from '@components/AppFeaturesProvider';
import { axe } from 'jest-axe';
import 'jest-axe/extend-expect';
import { screen } from 'nucleus-text/testing-library/screen';
import { GET_HUB_SETTINGS } from '@cvent/planner-event-hubs-model/operations/hub';
import {
  getEmailDomainsQuery,
  saveEmailDomainsMutation
} from '@cvent/planner-event-hubs-model/operations/registrationSettings';
import userEvent from '@testing-library/user-event';

afterAll(() => {
  jest.restoreAllMocks();
});

interface RouterProps {
  pathname: string;
  route: string;
  query: {
    isSuccess: boolean;
  };
  replace: () => void;
}

const appFeatures = [
  {
    name: 'videoCenterInformationFeature',
    enabled: true,
    experimentVersion: '1001'
  }
];

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

const mocks = [
  {
    request: {
      query: GET_HUB_SETTINGS,
      variables: {
        id: {
          id: 'test-video-hub-any-domains'
        }
      }
    },
    result: {
      data: {
        getHubSettings: {
          guestVisibility: 'VIDEO_PLAYBACK_PRIVATE',
          registrationSettings: {
            allowAllContactsRegistration: false,
            allowContactGroupsRegistration: false,
            allowContactTypesRegistration: false,
            blockContactsRegistration: false,
            blockListRegistration: false,
            allowedEmailDomain: 'ANY_DOMAIN'
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
          id: 'test-video-hub-business-domains'
        }
      }
    },
    result: {
      data: {
        getHubSettings: {
          guestVisibility: 'VIDEO_PLAYBACK_PRIVATE',
          registrationSettings: {
            allowAllContactsRegistration: false,
            allowContactGroupsRegistration: false,
            allowContactTypesRegistration: false,
            blockContactsRegistration: false,
            blockListRegistration: false,
            allowedEmailDomain: 'BUSINESS_DOMAINS'
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
          id: 'test-video-hub-custom-domains'
        }
      }
    },
    result: {
      data: {
        getHubSettings: {
          guestVisibility: 'VIDEO_PLAYBACK_PRIVATE',
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
  }
];

describe('Edit email domains', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('render email domain types', async () => {
    const { container } = render(
      <TestWrapper>
        <MockedProvider mocks={mocks}>
          <AppFeaturesProvider value={appFeatures}>
            <VisitorPermissions videoCenterId="test-video-hub-any-domains" videoCenterTitle="test" />
          </AppFeaturesProvider>
        </MockedProvider>
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId('registration-settings-container')).toBeInTheDocument();
    });
    expect(screen.getByTestId('edit-email-domains-fields')).toBeInTheDocument();
    expect(screen.getByTextKey('registration_settings_email_domain_type')).toBeInTheDocument();
    expect(screen.getByTextKey('registration_settings_email_domain_type_any_domain')).toBeInTheDocument();
    expect(screen.getByTextKey('registration_settings_email_domain_type_business_domain')).toBeInTheDocument();
    expect(screen.getByTextKey('registration_settings_email_domain_type_custom_domain')).toBeInTheDocument();
    const businessDomainPopover = await screen.findByTestId('business-email-domains-type-popover');
    expect(businessDomainPopover).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('select allowed email domain as ANY_DOMAIN and save', async () => {
    const { container } = render(
      <TestWrapper>
        <MockedProvider mocks={mocks}>
          <AppFeaturesProvider value={appFeatures}>
            <VisitorPermissions videoCenterId="test-video-hub-business-domains" videoCenterTitle="test" />
          </AppFeaturesProvider>
        </MockedProvider>
      </TestWrapper>
    );
    await waitFor(() => {
      expect(screen.getByTestId('registration-settings-container')).toBeInTheDocument();
    });
    expect(screen.getByTestId('edit-email-domains-fields')).toBeInTheDocument();
    expect(screen.getByTextKey('registration_settings_email_domain_type_any_domain')).toBeInTheDocument();
    const anyDomainRadioBtn = screen.getByTestId('email-domain-type-0-radio__ANY_DOMAIN');
    fireEvent.click(anyDomainRadioBtn);
    const saveButton = await screen.findByRole('button', { key: 'visitor_permissions_save_button' });
    expect(saveButton).toBeEnabled();
    fireEvent.click(saveButton);
    await waitFor(() => {
      expect(screen.getByTextKey('registration_settings_email_domain_type_any_domain')).toBeInTheDocument();
    });
    expect(await axe(container)).toHaveNoViolations();
  });

  it('select allowed email domain as BUSINESS_DOMAINS and save', async () => {
    const { container } = render(
      <TestWrapper>
        <MockedProvider mocks={mocks}>
          <AppFeaturesProvider value={appFeatures}>
            <VisitorPermissions videoCenterId="test-video-hub-any-domains" videoCenterTitle="test" />
          </AppFeaturesProvider>
        </MockedProvider>
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId('registration-settings-container')).toBeInTheDocument();
    });
    expect(screen.getByTestId('edit-email-domains-fields')).toBeInTheDocument();
    expect(screen.getByTextKey('registration_settings_email_domain_type_business_domain')).toBeInTheDocument();
    const businessDomainRadioBtn = screen.getByTestId('email-domain-type-1-radio__BUSINESS_DOMAINS');
    fireEvent.click(businessDomainRadioBtn);
    const saveButton = await screen.findByRole('button', { key: 'visitor_permissions_save_button' });
    expect(saveButton).toBeEnabled();
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByTextKey('registration_settings_email_domain_type_business_domain')).toBeInTheDocument();
    });
    expect(await axe(container)).toHaveNoViolations();
  });

  it('select allowed email domain as Custom email domains and save', async () => {
    const { container } = render(
      <TestWrapper>
        <MockedProvider mocks={mocks}>
          <AppFeaturesProvider value={appFeatures}>
            <VisitorPermissions videoCenterId="test-video-hub-any-domains" videoCenterTitle="test" />
          </AppFeaturesProvider>
        </MockedProvider>
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId('registration-settings-container')).toBeInTheDocument();
    });
    expect(screen.getByTestId('edit-email-domains-fields')).toBeInTheDocument();
    expect(screen.getByTextKey('registration_settings_email_domain_type_custom_domain')).toBeInTheDocument();

    const customDomainRadioBtn = screen.getByTestId('email-domain-type-2-radio__CUSTOM_DOMAINS');
    fireEvent.click(customDomainRadioBtn);
    const saveButton = await screen.findByRole('button', { key: 'visitor_permissions_save_button' });
    expect(saveButton).toBeEnabled();
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByTextKey('registration_settings_allowed_email_domains')).toBeInTheDocument();
    });
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders email domains component', async () => {
    const { container } = render(
      <TestWrapper>
        <MockedProvider mocks={mocks}>
          <AppFeaturesProvider value={appFeatures}>
            <VisitorPermissions videoCenterId="test-video-hub-custom-domains" videoCenterTitle="test" />
          </AppFeaturesProvider>
        </MockedProvider>
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId('registration-settings-container')).toBeInTheDocument();
    });
    expect(
      screen.getByText('Specify who can register by email domain (e.g., "gmail.com, outlook.com").')
    ).toBeInTheDocument();
    expect(screen.getByText('Allowed Email Domains')).toBeInTheDocument();
    expect(screen.getByTestId('edit-email-domains-fields')).toBeInTheDocument();
    expect(screen.getByText('Enter multiple domain names separated by commas.')).toBeInTheDocument();
    expect(screen.getByText('Add email domains')).toBeInTheDocument();
    const editEmailDomainComponent = within(screen.getByTestId('edit-email-domains-fields'));
    const addButton = editEmailDomainComponent.getByRole('button', {
      name: 'Add'
    });
    expect(addButton).toBeInTheDocument();
    const inputEmailDomain = screen.getByTestId('cvent-email-domains-input');
    expect(inputEmailDomain).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('check clear all domain button functionality', async () => {
    const { container } = render(
      <TestWrapper>
        <MockedProvider mocks={mocks}>
          <AppFeaturesProvider value={appFeatures}>
            <VisitorPermissions videoCenterId="test-video-hub-custom-domains" videoCenterTitle="test" />
          </AppFeaturesProvider>
        </MockedProvider>
      </TestWrapper>
    );
    await waitFor(() => {
      expect(screen.getByTestId('registration-settings-container')).toBeInTheDocument();
    });
    const inputEmailDomain = screen.getByTestId('cvent-email-domains-input-textarea');
    expect(inputEmailDomain).toBeInTheDocument();
    await new Promise(r => {
      setTimeout(r, 2000);
    });
    await userEvent.type(inputEmailDomain, 'gmail.com');
    expect(inputEmailDomain).toHaveValue('gmail.com');
    const editEmailDomainComponent = within(screen.getByTestId('edit-email-domains-fields'));
    const addButton = editEmailDomainComponent.getByRole('button', {
      name: 'Add'
    });
    fireEvent.click(addButton);
    const clearButton = editEmailDomainComponent.getByRole('button', {
      name: 'Clear all domains'
    });
    await waitFor(() => {
      expect(clearButton).toBeInTheDocument();
    });
    fireEvent.click(clearButton);
    expect(editEmailDomainComponent.queryByText('gmail.com')).not.toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('Checks onDismiss functionality of Pills', async () => {
    const { container } = render(
      <TestWrapper>
        <MockedProvider mocks={mocks}>
          <AppFeaturesProvider value={appFeatures}>
            <VisitorPermissions videoCenterId="test-video-hub-custom-domains" videoCenterTitle="test" />
          </AppFeaturesProvider>
        </MockedProvider>
      </TestWrapper>
    );
    await waitFor(() => {
      expect(screen.getByTestId('registration-settings-container')).toBeInTheDocument();
    });
    const inputEmailDomain = screen.getByTestId('cvent-email-domains-input-textarea');
    await userEvent.type(inputEmailDomain, 'gmail.com');
    expect(inputEmailDomain).toHaveValue('gmail.com');
    const editEmailDomainComponent = within(screen.getByTestId('edit-email-domains-fields'));
    const addButton = editEmailDomainComponent.getByRole('button', {
      name: 'Add'
    });
    fireEvent.click(addButton);
    await waitFor(() => {
      expect(screen.getByTestId('dismiss-button')).toBeInTheDocument();
    });
    const removeButtonDomainComponent = within(screen.getByTestId('dismiss-button'));
    const removeButton = removeButtonDomainComponent.getByRole('button');
    fireEvent.click(removeButton);
    expect(screen.queryByTestId('dismiss-button')).not.toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('check add button functionality', async () => {
    const { container } = render(
      <TestWrapper>
        <MockedProvider mocks={mocks}>
          <AppFeaturesProvider value={appFeatures}>
            <VisitorPermissions videoCenterId="test-video-hub-custom-domains" videoCenterTitle="test" />
          </AppFeaturesProvider>
        </MockedProvider>
      </TestWrapper>
    );
    await waitFor(() => {
      expect(screen.getByTestId('registration-settings-container')).toBeInTheDocument();
    });
    const inputEmailDomain = screen.getByTestId('cvent-email-domains-input-textarea');
    await userEvent.type(inputEmailDomain, 'gmail.com');
    expect(inputEmailDomain).toHaveValue('gmail.com');
    const editEmailDomainComponent = within(screen.getByTestId('edit-email-domains-fields'));
    const addButton = editEmailDomainComponent.getByRole('button', {
      name: 'Add'
    });
    fireEvent.click(addButton);
    expect(editEmailDomainComponent.getByText('gmail.com')).toBeInTheDocument();
    expect(inputEmailDomain).not.toHaveValue('gmail.com');
    expect(await axe(container)).toHaveNoViolations();
  });

  it('check Enter-Key functionality', async () => {
    const { container } = render(
      <TestWrapper>
        <MockedProvider mocks={mocks}>
          <AppFeaturesProvider value={appFeatures}>
            <VisitorPermissions videoCenterId="test-video-hub-custom-domains" videoCenterTitle="test" />
          </AppFeaturesProvider>
        </MockedProvider>
      </TestWrapper>
    );
    await waitFor(() => {
      expect(screen.getByTestId('registration-settings-container')).toBeInTheDocument();
    });
    const inputEmailDomain = screen.getByTestId('cvent-email-domains-input-textarea');
    await userEvent.type(inputEmailDomain, 'cvent.com');
    expect(inputEmailDomain).toHaveValue('cvent.com');
    const editEmailDomainComponent = within(screen.getByTestId('edit-email-domains-fields'));
    const inputEmail = editEmailDomainComponent.getByTestId('cvent-email-domains-input-textarea');
    fireEvent.keyPress(inputEmail, { key: 'Enter', code: 13, charCode: 13 });
    expect(editEmailDomainComponent.getByText('cvent.com')).toBeInTheDocument();
    expect(inputEmailDomain).not.toHaveValue('cvent.com');
    expect(await axe(container)).toHaveNoViolations();
  });

  it('check invalid domain', async () => {
    const { container } = render(
      <TestWrapper>
        <MockedProvider mocks={mocks}>
          <AppFeaturesProvider value={appFeatures}>
            <VisitorPermissions videoCenterId="test-video-hub-custom-domains" videoCenterTitle="test" />
          </AppFeaturesProvider>
        </MockedProvider>
      </TestWrapper>
    );
    await waitFor(() => {
      expect(screen.getByTestId('registration-settings-container')).toBeInTheDocument();
    });
    const inputEmailDomain = screen.getByTestId('cvent-email-domains-input-textarea');
    await userEvent.type(inputEmailDomain, 'mailcom');
    expect(inputEmailDomain).toHaveValue('mailcom');
    const editEmailDomainComponent = within(screen.getByTestId('edit-email-domains-fields'));
    const addButton = editEmailDomainComponent.getByRole('button', {
      name: 'Add'
    });
    fireEvent.click(addButton);
    expect(addButton).toBeInTheDocument();
    expect(editEmailDomainComponent.getByTestId('invalid-email-domain-error-message')).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('check valid domain', async () => {
    const { container } = render(
      <TestWrapper>
        <MockedProvider mocks={mocks}>
          <AppFeaturesProvider value={appFeatures}>
            <VisitorPermissions videoCenterId="test-video-hub-custom-domains" videoCenterTitle="test" />
          </AppFeaturesProvider>
        </MockedProvider>
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId('registration-settings-container')).toBeInTheDocument();
    });
    const inputEmailDomain = screen.getByTestId('cvent-email-domains-input-textarea');
    await userEvent.type(inputEmailDomain, 'gmail.com');
    const editEmailDomainComponent = within(screen.getByTestId('edit-email-domains-fields'));
    const addButton = editEmailDomainComponent.getByRole('button', {
      name: 'Add'
    });
    fireEvent.click(addButton);
    expect(editEmailDomainComponent.queryByTestId('invalid-email-domain-error-message')).not.toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });
});

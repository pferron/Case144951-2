import { render } from '@testing-library/react';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import React from 'react';
import { screen } from 'nucleus-text/testing-library/screen';
import 'jest-axe/extend-expect';
import { axe } from 'jest-axe';
import { AppFeaturesProvider } from '@components/AppFeaturesProvider';
import EditSsoLogin from '@components/customRegistration/EditSsoLogin';
import { LoginType } from '@cvent/planner-event-hubs-model/types';

const singleSignOnFeature = [
  {
    name: 'singleSignOnFeature',
    enabled: true,
    experimentVersion: '1001'
  }
];

const ssoSettings = {
  loginMethod: LoginType.MagicLink,
  organisationId: ''
};

const ssoSettingsForError = {
  loginMethod: LoginType.Sso,
  organisationId: ''
};

const setSsoSettings = jest.fn();
describe('renders Edit SSo Login Card', () => {
  it('renders sso card', async () => {
    const { container } = render(
      <TestWrapper>
        <AppFeaturesProvider value={singleSignOnFeature}>
          <EditSsoLogin
            setSsoSettings={setSsoSettings}
            ssoSettings={ssoSettings}
            isOrganisationIdValid
            error={false}
            serverError={false}
          />
        </AppFeaturesProvider>
      </TestWrapper>
    );

    const ssoEditCard = await screen.findByTestId('edit-sso-login-fields');
    expect(ssoEditCard).toBeInTheDocument();
    expect(await screen.findByTextKey('sso_login_info_text')).toBeInTheDocument();

    const magicLinkRadiobutton = await screen.findByTextKey('sso_login_login_type_magic_link_option');
    expect(magicLinkRadiobutton).toBeInTheDocument();
    expect(await screen.findByRole('button', { key: 'sso_login_magic_link_tooltip' })).toBeInTheDocument();

    const ssoLoginRadiobutton = await screen.findByTestId('sso-login-method-settings-radio__div__SSO');
    expect(ssoLoginRadiobutton).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders renders sso card with error', async () => {
    const { container } = render(
      <TestWrapper>
        <AppFeaturesProvider value={singleSignOnFeature}>
          <EditSsoLogin
            setSsoSettings={setSsoSettings}
            ssoSettings={ssoSettingsForError}
            isOrganisationIdValid={false}
            error
            serverError={false}
          />
        </AppFeaturesProvider>
      </TestWrapper>
    );

    const ssoEditCard = await screen.findByTestId('edit-sso-login-fields');
    expect(ssoEditCard).toBeInTheDocument();
    expect(await screen.findByTextKey('sso_login_info_text')).toBeInTheDocument();

    const magicLinkRadiobutton = await screen.findByTextKey('sso_login_login_type_magic_link_option');
    expect(magicLinkRadiobutton).toBeInTheDocument();
    expect(await screen.findByRole('button', { key: 'sso_login_magic_link_tooltip' })).toBeInTheDocument();

    const ssoLoginRadiobutton = await screen.findByTestId('sso-login-method-settings-radio__div__SSO');
    expect(ssoLoginRadiobutton).toBeInTheDocument();

    const organisationIdTextbox = await screen.findByRole('textbox');
    expect(organisationIdTextbox).toBeInTheDocument();
    expect(await screen.findByTextKey('sso_login_invalid_organisation_id_error')).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });
});

import React from 'react';
import { render } from '@testing-library/react';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import { screen } from 'nucleus-text/testing-library/screen';
import 'jest-axe/extend-expect';
import { axe } from 'jest-axe';
import Footer from '../Footer';

describe('Footer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Render Footer with all components', async () => {
    const { container } = render(
      <TestWrapper>
        <Footer
          termsOfUseText="Terms Of Use"
          cventPrivacyPolicyText="Privacy Policy"
          customPrivacyPolicyText="Test Policy"
          displayManagePreferencesModal
          displayCcpaLinkText
          ccpaLinkText="Test Link"
        />
      </TestWrapper>
    );
    expect(
      await screen.findByTextKey('registration_form_footer_manage_preference_modal_link_text')
    ).toBeInTheDocument();
    expect(await screen.findByText('Terms Of Use')).toBeInTheDocument();
    expect(await screen.findByText('Privacy Policy')).toBeInTheDocument();
    expect(await screen.findByText('Test Policy')).toBeInTheDocument();
    expect(await screen.findByText('Test Link')).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('Render Footer without cvent and custom privacy', async () => {
    const { container } = render(
      <TestWrapper>
        <Footer termsOfUseText="Terms Of Use" displayManagePreferencesModal />
      </TestWrapper>
    );
    expect(
      await screen.findByTextKey('registration_form_footer_manage_preference_modal_link_text')
    ).toBeInTheDocument();
    expect(await screen.findByText('Terms Of Use')).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });
});

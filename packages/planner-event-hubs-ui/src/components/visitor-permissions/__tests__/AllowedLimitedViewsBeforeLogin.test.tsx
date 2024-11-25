import { fireEvent, render } from '@testing-library/react';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import React from 'react';
import '@testing-library/jest-dom';
import { axe } from 'jest-axe';
import 'jest-axe/extend-expect';
import { screen } from 'nucleus-text/testing-library/screen';
import registrationSettings from '@resolvers/registrationSettings';
import AllowedLimitedViewsBeforeLogin from '../AllowedLimitedViewsBeforeLogin';

const mockfn = jest.fn();

describe('Allow limited views before login', () => {
  it('render allow limited views before login container', async () => {
    const setIsPageEdited = jest.fn();
    const { container } = render(
      <TestWrapper>
        <AllowedLimitedViewsBeforeLogin
          testId="allow-limited-views-before-login-container"
          registrationSettings={registrationSettings}
          setRegistrationSettings={mockfn}
          setIsPageEdited={setIsPageEdited}
        />
      </TestWrapper>
    );
    expect(await screen.findByTestId('allow-limited-views-before-login-container')).toBeInTheDocument();
    expect(await screen.findByTextKey('allow_limited_views_before_login')).toBeInTheDocument();
    const checkBox = await screen.findByRole('checkbox', { key: 'allow_limited_views_before_login' });
    expect(checkBox).toBeInTheDocument();
    fireEvent.click(checkBox);
    expect(checkBox).toBeEnabled();
    const textBox = await screen.findByRole('textbox', { name: 'Login Count TextBox' });
    expect(textBox).toBeInTheDocument();
    const tooltip = await screen.findByTestId('allow-limited-views-before-login-tooltip');
    expect(tooltip).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });
});

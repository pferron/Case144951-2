import { render, screen, waitFor } from '@testing-library/react';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import { MockedProvider } from '@apollo/client/testing';
import React from 'react';
import { Form } from '@cvent/carina/components/Forms';
import 'jest-axe/extend-expect';
import { axe } from 'jest-axe';
import HelpEmailField from '../information/HelpEmailField';

jest.mock('nucleus-text', () => {
  const actualMethods = jest.requireActual('nucleus-text');
  return {
    __esModule: true,
    ...actualMethods,
    useTranslate: jest.fn(() => {
      return {
        translate: jest.fn(input => {
          if (input === 'video_hub_form_ownerEmail_error') {
            return 'Enter a valid email';
          }
          if (input === 'video_center_display_help_email_label') {
            return 'Display help email';
          }
          if (input === 'video_center_help_email_tooltip') {
            return 'Tooltip for help email';
          }
          if (input === 'video_hub_form_help_email_label') {
            return 'Help Email';
          }
          if (input === 'help_email_option_yes ') {
            return 'Yes';
          }
          if (input === 'help_email_option_no') {
            return 'No';
          }
          return null;
        })
      };
    })
  };
});

const setTempValues = jest.fn();
describe('Video Center Information', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders help email in view state successfully', async () => {
    const { container } = render(
      <TestWrapper>
        <MockedProvider>
          <Form>
            <HelpEmailField isEdit={false} setTempValues={setTempValues} />
          </Form>
        </MockedProvider>
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId('video-center-form-help-email')).toBeInTheDocument();
    });
    expect(screen.queryByText('Display help email')).not.toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders help email in edit state successfully', async () => {
    const { container } = render(
      <TestWrapper>
        <MockedProvider>
          <Form>
            <HelpEmailField isEdit setTempValues={setTempValues} />
          </Form>
        </MockedProvider>
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId('help-email-radio-label')).toBeInTheDocument();
    });
    expect(screen.getByText('Display help email')).toBeInTheDocument();
    expect(screen.getByRole('radiogroup')).toBeInTheDocument();
    const radioButtons = screen.getAllByRole('radio');
    expect(radioButtons).toHaveLength(2);
    expect(await axe(container)).toHaveNoViolations();
  });
});

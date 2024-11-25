import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import BannerNameField from '@components/banners/formSections/BannerNameField';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import { MockedProvider } from '@apollo/client/testing';
import { Form } from '@cvent/carina/components/Forms/Form';
import 'jest-axe/extend-expect';
import { axe } from 'jest-axe';

describe('BannerNameField', () => {
  const mockOnDismiss = jest.fn();

  it('Component should render fine', async () => {
    const { container } = render(
      <MockedProvider>
        <TestWrapper>
          <Form
            name="bannerNameEdit"
            initialValues={{ bannerName: '' }}
            initializationMode="reinitialize"
            testID="banner-name-form"
          >
            <BannerNameField
              secondaryButtonText="close"
              onDismiss={mockOnDismiss}
              saveButtonText="submit"
              currentNames={[]}
            />
          </Form>
        </TestWrapper>
      </MockedProvider>
    );

    expect(await screen.findByTestId('banner-name-form')).toBeInTheDocument();

    // Submit button disabled
    expect(screen.getByRole('button', { name: 'submit' })).toBeDisabled();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('Component should render the name of the form and submit should be enabled', async () => {
    const { container } = render(
      <MockedProvider>
        <TestWrapper>
          <Form
            name="bannerNameEdit"
            initialValues={{ bannerName: 'Test Form' }}
            initializationMode="reinitialize"
            testID="banner-name-form"
          >
            <BannerNameField
              secondaryButtonText="close"
              onDismiss={mockOnDismiss}
              saveButtonText="submit"
              currentNames={[]}
            />
          </Form>
        </TestWrapper>
      </MockedProvider>
    );

    expect(await screen.findByTestId('banner-name-form')).toBeInTheDocument();
    const inputField = screen.getByTestId('banner_name-input');
    expect(inputField).toHaveValue('Test Form');
    // Submit button disabled
    expect(screen.getByRole('button', { name: 'submit' })).toBeEnabled();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('Should call onDismiss function when modal is closed', async () => {
    const { container } = render(
      <MockedProvider>
        <TestWrapper>
          <Form
            name="bannerNameEdit"
            initialValues={{ bannerName: 'Test Form' }}
            initializationMode="reinitialize"
            testID="banner-name-form"
          >
            <BannerNameField
              secondaryButtonText="close"
              onDismiss={mockOnDismiss}
              saveButtonText="submit"
              currentNames={[]}
            />
          </Form>
        </TestWrapper>
      </MockedProvider>
    );

    expect(await screen.findByTestId('banner-name-form')).toBeInTheDocument();
    const closeBtn = screen.getByRole('button', { name: 'close' });
    fireEvent.click(closeBtn);
    expect(mockOnDismiss).toHaveBeenCalled();
    expect(await axe(container)).toHaveNoViolations();
  });
});

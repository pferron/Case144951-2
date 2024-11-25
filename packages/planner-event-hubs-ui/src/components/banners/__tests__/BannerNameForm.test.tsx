import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { screen } from 'nucleus-text/testing-library/screen';
import BannerNameForm from '@components/banners/BannerNameForm';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import { MockedProvider } from '@apollo/client/testing';
import { Form } from '@cvent/carina/components/Forms/Form';
import 'jest-axe/extend-expect';
import { axe } from 'jest-axe';

describe('Testing BannerNameForm', () => {
  const mockOnDismiss = jest.fn();
  it('Should render the form fine', async () => {
    const { container } = render(
      <MockedProvider>
        <TestWrapper>
          <Form>
            <BannerNameForm
              secondaryButtonText="Cancel"
              saveButtonText="Save"
              onDismiss={mockOnDismiss}
              currentNames={[]}
            />
          </Form>
        </TestWrapper>
      </MockedProvider>
    );
    expect(await screen.findByTestId('template-selection-modal-header')).toBeInTheDocument();
    expect(screen.getByTestId('banner_name-input')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('Clicking on Cancel should call on Dismiss function', async () => {
    const { container } = render(
      <MockedProvider>
        <TestWrapper>
          <Form>
            <BannerNameForm
              secondaryButtonText="Cancel"
              saveButtonText="Save"
              onDismiss={mockOnDismiss}
              currentNames={[]}
            />
          </Form>
        </TestWrapper>
      </MockedProvider>
    );
    expect(await screen.findByTestId('template-selection-modal-header')).toBeInTheDocument();
    const cancelBtn = screen.getByRole('button', { name: 'Cancel' });
    fireEvent.click(cancelBtn);
    expect(mockOnDismiss).toHaveBeenCalled();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('Should enable the Save button upon entering the text', async () => {
    const { container } = render(
      <MockedProvider>
        <TestWrapper>
          <Form>
            <BannerNameForm
              secondaryButtonText="Cancel"
              saveButtonText="Save"
              onDismiss={mockOnDismiss}
              currentNames={['Old Name']}
            />
          </Form>
        </TestWrapper>
      </MockedProvider>
    );
    expect(await screen.findByTestId('template-selection-modal-header')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled();
    const inputTextBox = screen.getByTestId('banner_name-input');
    fireEvent.change(inputTextBox, { target: { value: 'New Banner Name' } });
    expect(await screen.findByRole('button', { name: 'Save' })).toBeEnabled();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('Should show an error when the existing banner name is used', async () => {
    const { container } = render(
      <MockedProvider>
        <TestWrapper>
          <Form>
            <BannerNameForm
              secondaryButtonText="Cancel"
              saveButtonText="Save"
              onDismiss={mockOnDismiss}
              currentNames={['Old Name']}
            />
          </Form>
        </TestWrapper>
      </MockedProvider>
    );
    expect(await screen.findByTestId('template-selection-modal-header')).toBeInTheDocument();
    const inputTextBox = screen.getByTestId('banner_name-input');
    fireEvent.change(inputTextBox, { target: { value: 'Old Name' } });
    expect(await screen.findByTextKey('Banners-Form-NameAlreadyTaken')).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });
});

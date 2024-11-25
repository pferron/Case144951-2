import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { screen } from 'nucleus-text/testing-library/screen';
import BannerCreateNameForm from '@components/banners/BannerCreateNameForm';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import { axe } from 'jest-axe';
import 'jest-axe/extend-expect';
import { MockedProvider } from '@apollo/client/testing';

describe('BannerCreateNameForm', () => {
  const mockOnDismiss = jest.fn();

  it('Should render the form fine based on the template passed', async () => {
    const { container } = render(
      <MockedProvider>
        <TestWrapper>
          <BannerCreateNameForm templateType="TEXT_AND_COLOR" onDismiss={mockOnDismiss} currentNames={[]} />
        </TestWrapper>
      </MockedProvider>
    );
    expect(await screen.findByTestId('banner_name')).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('should call onDismiss when back button is clicked', async () => {
    const { container } = render(
      <MockedProvider>
        <TestWrapper>
          <BannerCreateNameForm templateType="TEXT_AND_COLOR" onDismiss={mockOnDismiss} currentNames={[]} />
        </TestWrapper>
      </MockedProvider>
    );
    expect(await screen.findByTestId('banner_name')).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();

    const backBtn = await screen.findByRole('button', { key: 'Banner-Name-Selection-Back-Button' });
    fireEvent.click(backBtn);

    expect(mockOnDismiss).toHaveBeenCalled();
  });

  it('form submit should be enabled when form name is entered', async () => {
    const { container } = render(
      <MockedProvider>
        <TestWrapper>
          <BannerCreateNameForm templateType="TEXT_AND_COLOR" onDismiss={mockOnDismiss} currentNames={[]} />
        </TestWrapper>
      </MockedProvider>
    );
    expect(await screen.findByTestId('banner_name')).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();

    // Select the input element
    const nameInput = screen.getByTestId('banner_name-input');
    fireEvent.change(nameInput, { target: { value: 'My Banner name' } });

    const saveBtn = screen.getByTestId('Banner-Name-Form-Done');
    expect(saveBtn).toBeEnabled();
    fireEvent.click(saveBtn);
  });
});

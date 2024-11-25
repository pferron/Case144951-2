import { fireEvent, render } from '@testing-library/react';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import React from 'react';
import { screen } from 'nucleus-text/testing-library/screen';
import AddFieldMenu from '@components/customRegistration/AddFieldMenu';
import 'jest-axe/extend-expect';
import { axe } from 'jest-axe';

describe('AddFieldMenu Tests', () => {
  it('renders AddFieldMenu component', async () => {
    const mockfn = jest.fn();
    const setIsPageEdited = jest.fn();
    const { container } = render(
      <TestWrapper>
        <AddFieldMenu selectedFields={[]} setSelectedFields={mockfn} setIsPageEdited={setIsPageEdited} />
      </TestWrapper>
    );
    const addButton = await screen.findByTextKey('custom_registration_form_add_field_button_text');
    expect(addButton).toBeInTheDocument();
    fireEvent.click(addButton);

    expect(await screen.findByTextKey('custom_registration_form_field_text_field_code_job_title')).toBeInTheDocument();
    expect(await screen.findByTextKey('custom_registration_form_field_text_field_code_company')).toBeInTheDocument();
    expect(await screen.findByTextKey('custom_registration_form_field_text_field_code_number')).toBeInTheDocument();
    expect(await screen.findByTextKey('custom_registration_form_field_text_field_code_address')).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders selected fields from AddFieldMenu component', async () => {
    const mockfn = jest.fn();
    const setIsPageEdited = jest.fn();
    const { container } = render(
      <TestWrapper>
        <AddFieldMenu selectedFields={[]} setSelectedFields={mockfn} setIsPageEdited={setIsPageEdited} />
      </TestWrapper>
    );
    const addButton = await screen.findByTextKey('custom_registration_form_add_field_button_text');
    expect(addButton).toBeInTheDocument();
    fireEvent.click(addButton);

    expect(await screen.findByTextKey('custom_registration_form_field_text_field_code_company')).toBeInTheDocument();
    const jobTitleField = await screen.findByTextKey('custom_registration_form_field_text_field_code_job_title');
    expect(jobTitleField).toBeInTheDocument();
    fireEvent.click(jobTitleField);
    expect(await screen.findByTextKey('custom_registration_form_field_text_field_code_company')).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });
});

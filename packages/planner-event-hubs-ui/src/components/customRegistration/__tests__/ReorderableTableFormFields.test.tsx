import { fireEvent, render } from '@testing-library/react';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import React from 'react';
import { screen } from 'nucleus-text/testing-library/screen';
import { FieldData } from '@components/customRegistration/FormEditorCard';
import ReorderableTableFormFields from '@components/customRegistration/ReorderableTableFormFields';
import 'jest-axe/extend-expect';
import { axe } from 'jest-axe';

describe('ReorderableTableFormFields Tests', () => {
  it('renders ReorderableTableFormFields with no values when nothing is selected', async () => {
    const mockfn = jest.fn();
    const setIsPageEdited = jest.fn();
    const { container } = render(
      <TestWrapper>
        <ReorderableTableFormFields selectedFields={[]} setSelectedFields={mockfn} setIsPageEdited={setIsPageEdited} />
      </TestWrapper>
    );
    expect(screen.queryByTextKey('custom_registration_form_field_text_field_code_first_name')).not.toBeInTheDocument();
    expect(screen.queryByTextKey('custom_registration_form_field_text_field_code_last_name')).not.toBeInTheDocument();
    expect(screen.queryByTextKey('custom_registration_form_field_text_field_code_email')).not.toBeInTheDocument();
    expect(screen.queryAllByTextKey('custom_registration_form_required_text').length).toEqual(0);
    expect(screen.queryAllByTextKey('custom_registration_form_optional_text').length).toEqual(0);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders StaticTableFormFields with selected values: All Required', async () => {
    const mockfn = jest.fn();
    const setIsPageEdited = jest.fn();
    const selected: FieldData[] = [
      {
        code: 'JOB_TITLE',
        order: 1,
        required: true,
        included: true
      },
      {
        code: 'COMPANY',
        order: 2,
        required: true,
        included: true
      }
    ];
    const { container } = render(
      <TestWrapper>
        <ReorderableTableFormFields
          selectedFields={selected}
          setSelectedFields={mockfn}
          setIsPageEdited={setIsPageEdited}
        />
      </TestWrapper>
    );
    expect(await screen.findByTextKey('custom_registration_form_field_text_field_code_job_title')).toBeInTheDocument();
    expect(await screen.findByTextKey('custom_registration_form_field_text_field_code_company')).toBeInTheDocument();
    expect(screen.queryByTextKey('custom_registration_form_field_text_field_code_first_name')).not.toBeInTheDocument();
    expect(screen.queryByTextKey('custom_registration_form_field_text_field_code_last_name')).not.toBeInTheDocument();
    expect(screen.queryByTextKey('custom_registration_form_field_text_field_code_email')).not.toBeInTheDocument();
    expect((await screen.findAllByTextKey('custom_registration_form_required_text')).length).toEqual(2);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders deletion of selected field', async () => {
    const mockfn = jest.fn();
    const setIsPageEdited = jest.fn();
    const selected: FieldData[] = [
      {
        code: 'JOB_TITLE',
        order: 1,
        required: true,
        included: true
      }
    ];
    const { container } = render(
      <TestWrapper>
        <ReorderableTableFormFields
          selectedFields={selected}
          setSelectedFields={mockfn}
          setIsPageEdited={setIsPageEdited}
        />
      </TestWrapper>
    );
    expect(await screen.findByTextKey('custom_registration_form_field_text_field_code_job_title')).toBeInTheDocument();
    expect((await screen.findAllByTextKey('custom_registration_form_required_text')).length).toEqual(1);
    const checkbox = await screen.findByRole('checkbox');
    expect(checkbox).toBeInTheDocument();
    fireEvent.click(checkbox);
    await new Promise(resolve => {
      setTimeout(resolve, 100);
    });
    expect(checkbox).toBeChecked();
    const deleteButton = await screen.findByRole('button', { name: 'Delete' });
    expect(deleteButton).toBeInTheDocument();
    fireEvent.click(deleteButton);
    expect(screen.queryByText('JOB_TITLE')).not.toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });
});

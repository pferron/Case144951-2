import { render } from '@testing-library/react';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import React from 'react';
import { screen } from 'nucleus-text/testing-library/screen';
import 'jest-axe/extend-expect';
import { axe } from 'jest-axe';
import StaticTableFormFields from '../StaticTableFormFields';

describe('StaticTableFormFields Tests', () => {
  it('renders StaticTableFormFields with default values when nothing is selected', async () => {
    const { container } = render(
      <TestWrapper>
        <StaticTableFormFields />
      </TestWrapper>
    );
    expect(await screen.findByTextKey('custom_registration_form_field_text_field_code_first_name')).toBeInTheDocument();
    expect(await screen.findByTextKey('custom_registration_form_field_text_field_code_last_name')).toBeInTheDocument();
    expect(await screen.findByTextKey('custom_registration_form_field_text_field_code_email')).toBeInTheDocument();
    expect((await screen.findAllByTextKey('custom_registration_form_required_text')).length).toEqual(3);
    expect(await axe(container)).toHaveNoViolations();
  });
});

import React from 'react';
import { render } from '@testing-library/react';
import { screen } from 'nucleus-text/testing-library/screen';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import 'jest-axe/extend-expect';
import { axe } from 'jest-axe';
import LoginTextBox from '../LoginTextBox';

describe('LoginTextBox', () => {
  it('should render successfully', async () => {
    const { container } = render(
      <TestWrapper>
        <LoginTextBox id="textbox" label="testLabel" testID="testID" isRequired />
      </TestWrapper>
    );

    const firstNameBox = await screen.findByRole('textbox', {
      name: /testLabel/i
    });
    expect(firstNameBox).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });
});

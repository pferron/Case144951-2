import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import { Form } from '@cvent/carina/components/Forms/Form';
import 'jest-axe/extend-expect';
import { axe } from 'jest-axe';
import PageBanner from '../topBanner/PageBanner';

const testProps = {
  title: 'Test Title',
  body: 'Test Body',
  buttonText: 'Test Button Text',
  buttonAction: jest.fn(),
  alignment: 'left',
  testID: 'test',
  backgroundColor: '#000000'
};

describe('Page Banner wrapper', () => {
  it('should render successfully with child banner', async () => {
    const { container } = render(
      <TestWrapper>
        <Form>
          <PageBanner type="text" {...testProps} />
        </Form>
      </TestWrapper>
    );
    expect(screen.getByTestId('test')).toBeInTheDocument();
    expect(screen.getByTestId('test-text')).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });
});

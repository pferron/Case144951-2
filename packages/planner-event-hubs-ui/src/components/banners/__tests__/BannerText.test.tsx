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
  buttonHref: 'https://www.cvent.com/',
  alignment: 'left',
  testID: 'test'
};

describe('Text Banner', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render successfully', async () => {
    const { container } = render(
      <TestWrapper>
        <Form>
          <PageBanner type="text" backgroundColor="#000000" {...testProps} />
        </Form>
      </TestWrapper>
    );

    expect(screen.getByTestId('test-text')).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('should not render semantic content tags if content is absent', async () => {
    const emptyProps = {
      ...testProps,
      title: '',
      body: '',
      buttonText: '',
      buttonAction: jest.fn()
    };
    const { container } = render(
      <TestWrapper>
        <Form>
          <PageBanner type="text" {...emptyProps} />
        </Form>
      </TestWrapper>
    );
    expect(screen.getByTestId('test-text')).toBeInTheDocument();
    expect(screen.queryByRole('paragraph')).not.toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });
});

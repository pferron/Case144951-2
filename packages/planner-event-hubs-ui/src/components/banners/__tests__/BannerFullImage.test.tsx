import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { axe } from 'jest-axe';
import 'jest-axe/extend-expect';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import { Form } from '@cvent/carina/components/Forms/Form';
import PageBanner from '../topBanner/PageBanner';

const testProps = {
  title: 'Test Title',
  body: 'Test Body',
  buttonText: 'Test Button Text',
  buttonHref: 'https://www.cvent.com/',
  alignment: 'left',
  imageURL: 'testURL',
  altText: 'Test Alt Text',
  testID: 'test',
  fontColor: '#ffffff'
};

describe('Full image Banner', () => {
  it('should render successfully', async () => {
    const { container } = render(
      <TestWrapper>
        <Form>
          <PageBanner type="full-image" {...testProps} />
        </Form>
      </TestWrapper>
    );
    expect(screen.getByTestId('test-full-image')).toBeInTheDocument();
    expect(screen.getByLabelText(testProps.altText).tagName).toEqual('SPAN');
    expect(await axe(container)).toHaveNoViolations();
  });

  it('should not render semantic content tags or wrapper container if content is absent', async () => {
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
          <PageBanner type="full-image" {...emptyProps} />
        </Form>
      </TestWrapper>
    );
    expect(screen.getByTestId('test-full-image')).toBeInTheDocument();
    expect(screen.queryByRole('paragraph')).not.toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });
});

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
  imageURL: 'testURL',
  altText: 'Test Alt Text',
  imageAlignment: 'right',
  testID: 'test'
};

describe('Image Inlay Banner', () => {
  it('should render successfully', async () => {
    const { container } = render(
      <TestWrapper>
        <Form>
          <PageBanner type="image-inlay" backgroundColor="#000000" {...testProps} />
        </Form>
      </TestWrapper>
    );

    expect(screen.getByTestId('test-image-inlay')).toBeInTheDocument();
    expect(screen.getByAltText(testProps.altText)).toHaveAttribute('src', testProps.imageURL);
    expect(await axe(container)).toHaveNoViolations();
  });
});

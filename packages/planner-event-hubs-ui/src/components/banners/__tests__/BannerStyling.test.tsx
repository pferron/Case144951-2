import React from 'react';
import { render, screen } from '@testing-library/react';
import { Form } from '@cvent/carina/components/Forms/Form';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import 'jest-axe/extend-expect';
import { axe } from 'jest-axe';
import BannerStyling from '../formSections/BannerStyling';

describe('BannerStyling', () => {
  it('has all of the correct elements', async () => {
    const { container } = render(
      <TestWrapper>
        <Form>
          <BannerStyling showFontColorSection showImageAlignmentSection readOnly />
        </Form>
      </TestWrapper>
    );

    expect(screen.getAllByRole('radio').length).toBe(3);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has all of the correct elements when optional components are excluded', async () => {
    const { container } = render(
      <TestWrapper>
        <Form>
          <BannerStyling showFontColorSection={false} showImageAlignmentSection={false} readOnly />
        </Form>
      </TestWrapper>
    );

    expect(screen.getAllByRole('radio').length).toBe(1);
    expect(await axe(container)).toHaveNoViolations();
  });
});

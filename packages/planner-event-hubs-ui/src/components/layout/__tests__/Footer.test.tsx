import React from 'react';
import { screen, render } from '@testing-library/react';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import Footer from '@components/layout/Footer';
import 'jest-axe/extend-expect';
import { axe } from 'jest-axe';

describe('Footer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Render Footer with all elements', async () => {
    const { baseElement } = render(
      <TestWrapper>
        <Footer />
      </TestWrapper>
    );
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByTestId('footer-logo')).toBeInTheDocument();
    expect(screen.getByTestId('footer-terms-of-use')).toBeInTheDocument();
    expect(screen.getByTestId('footer-privacy-policy')).toBeInTheDocument();
    expect(screen.getByTestId('footer-help-and-support')).toBeInTheDocument();
    expect(await axe(baseElement)).toHaveNoViolations();
  });
});

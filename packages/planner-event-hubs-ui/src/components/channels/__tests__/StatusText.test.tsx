import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import StatusText from '@components/common/StatusText';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import 'jest-axe/extend-expect';

describe('Status Text', () => {
  it('Render Active label', async () => {
    const { baseElement } = render(
      <TestWrapper>
        <StatusText isActive />
      </TestWrapper>
    );
    expect(baseElement).toMatchSnapshot();
    await new Promise(resolve => {
      setTimeout(resolve, 0);
    });
    await waitFor(() => {
      expect(screen.getByText('Live')).toBeInTheDocument();
    });
    // HUB-137682
    // expect(await axe(baseElement)).toHaveNoViolations();
  });

  it('Render Inactive label', async () => {
    const { baseElement } = render(
      <TestWrapper>
        <StatusText isActive={false} />
      </TestWrapper>
    );
    expect(baseElement).toMatchSnapshot();
    await new Promise(resolve => {
      setTimeout(resolve, 0);
    });
    await waitFor(() => {
      expect(screen.getByText('Not live')).toBeInTheDocument();
    });
    // HUB-137682
    // expect(await axe(baseElement)).toHaveNoViolations();
  });
});

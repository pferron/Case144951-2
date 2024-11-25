import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import { BreadCrumb } from '@components/common/BreadCrumb';

describe('Bread crumb test', () => {
  it('Renders the bread crumb with link', async () => {
    render(
      <TestWrapper>
        <BreadCrumb url="https://google.com">google</BreadCrumb>
      </TestWrapper>
    );
    await waitFor(async () => {
      expect(await screen.findByRole('link')).toHaveTextContent('google');
    });
  });
});

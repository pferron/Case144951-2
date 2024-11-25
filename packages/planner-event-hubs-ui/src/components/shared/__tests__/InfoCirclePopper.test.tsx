import React from 'react';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import { render, screen, fireEvent } from '@testing-library/react';
import { InfoCirclePopper } from '@components/shared/InfoCirclePopper';

describe('Info circle popper', () => {
  it('renders info circle and on hove message show up in popover', async () => {
    render(
      <TestWrapper>
        <InfoCirclePopper testID="custom-font" maxWidth="13.938rem" infoText="This is a test" />
      </TestWrapper>
    );
    const ele = screen.getByRole('button', { name: 'custom-font-info-text' });
    expect(ele).toBeInTheDocument();
    expect(screen.queryByText('This is a test')).not.toBeInTheDocument();
    fireEvent.mouseOver(ele);
    expect(screen.getByText('This is a test')).toBeInTheDocument();
  });
});

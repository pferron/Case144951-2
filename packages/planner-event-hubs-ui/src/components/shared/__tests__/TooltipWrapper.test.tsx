import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import { ToolTipWrapper } from '@components/shared/TooltipWrapper';
import { Button } from '@cvent/carina/components/Button';
import { CopyIcon } from '@cvent/carina/components/Icon';
import 'jest-axe/extend-expect';
import { axe } from 'jest-axe';

const CopyButton = (
  <Button testID="copy-button" icon={CopyIcon} aria-label="Copy" appearance="ghost" onClick={() => {}} />
);

describe('ToolTip wrapper', () => {
  const defaultProps = {
    button: CopyButton,
    text: 'Copy link',
    copiedText: 'Copied!'
  };

  it('renders ToolTip and shows help text on hover', async () => {
    const { container } = render(
      <TestWrapper>
        <ToolTipWrapper {...defaultProps} />
      </TestWrapper>
    );

    const tooltipButton = screen.getByRole('button', { name: /Copy/i });
    expect(tooltipButton).toBeInTheDocument();

    fireEvent.mouseOver(tooltipButton);
    expect(await screen.findByText('Copy link')).toBeInTheDocument();

    fireEvent.mouseLeave(tooltipButton);
    await waitFor(() => {
      expect(screen.queryByText('Copy link')).not.toBeInTheDocument();
    });

    expect(await axe(container)).toHaveNoViolations();
  });

  it('toggles help text on click', async () => {
    const { container } = render(
      <TestWrapper>
        <ToolTipWrapper {...defaultProps} />
      </TestWrapper>
    );

    const tooltipButton = screen.getByRole('button', { name: /Copy/i });
    expect(tooltipButton).toBeInTheDocument();

    fireEvent.click(tooltipButton);
    expect(await screen.findByText('Copied!')).toBeInTheDocument();

    fireEvent.click(tooltipButton);
    await waitFor(() => {
      expect(screen.queryByText('Copied!')).not.toBeInTheDocument();
    });
    expect(await axe(container)).toHaveNoViolations();
  });

  it('shows help text on focus and hides on blur', async () => {
    const { container } = render(
      <TestWrapper>
        <ToolTipWrapper {...defaultProps} />
      </TestWrapper>
    );

    const tooltipButton = screen.getByRole('button', { name: /Copy/i });
    expect(tooltipButton).toBeInTheDocument();

    fireEvent.focus(tooltipButton);
    expect(await screen.findByText('Copy link')).toBeInTheDocument();

    fireEvent.blur(tooltipButton);
    await waitFor(() => {
      expect(screen.queryByText('Copy link')).not.toBeInTheDocument();
    });
    expect(await axe(container)).toHaveNoViolations();
  });

  it('opens help text on Enter key press', async () => {
    const { container } = render(
      <TestWrapper>
        <ToolTipWrapper {...defaultProps} />
      </TestWrapper>
    );

    const tooltipButton = screen.getByRole('button', { name: /Copy/i });
    expect(tooltipButton).toBeInTheDocument();

    fireEvent.keyDown(tooltipButton, { code: 'Enter' });
    expect(await screen.findByText('Copied!')).toBeInTheDocument();
    fireEvent.keyDown(tooltipButton, { code: 'Enter' });
    await waitFor(() => {
      expect(screen.queryByText('Copied!')).not.toBeInTheDocument();
    });
    expect(await axe(container)).toHaveNoViolations();
  });
});

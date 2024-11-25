import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import { HelpCirclePopper } from '../HelpCirclePopper';

describe('HelpCirclePopper', () => {
  const defaultProps = {
    testID: 'test-help-circle-popper',
    helpText: 'This is a help text',
    accessibilityLabel: 'Help Circle',
    preventOverflow: false
  };

  it('renders HelpCirclePopper and shows help text on hover', async () => {
    render(
      <TestWrapper>
        <HelpCirclePopper {...defaultProps} />
      </TestWrapper>
    );

    const helpCircleIcon = screen.getByRole('button', { name: /Help Circle/i });
    expect(helpCircleIcon).toBeInTheDocument();

    fireEvent.mouseOver(helpCircleIcon);
    expect(await screen.findByText('This is a help text')).toBeInTheDocument();

    fireEvent.mouseLeave(helpCircleIcon);
    await waitFor(() => {
      expect(screen.queryByText('This is a help text')).not.toBeInTheDocument();
    });
    // HUB-151797
    // expect(await axe(container)).toHaveNoViolations();
  });

  it('toggles help text on click', async () => {
    render(
      <TestWrapper>
        <HelpCirclePopper {...defaultProps} />
      </TestWrapper>
    );

    const helpCircleIcon = screen.getByRole('button', { name: /Help Circle/i });
    expect(helpCircleIcon).toBeInTheDocument();

    fireEvent.click(helpCircleIcon);
    expect(await screen.findByText('This is a help text')).toBeInTheDocument();

    fireEvent.click(helpCircleIcon);
    await waitFor(() => {
      expect(screen.queryByText('This is a help text')).not.toBeInTheDocument();
    });
    // HUB-151797
    // expect(await axe(container)).toHaveNoViolations();
  });

  it('shows help text on focus and hides on blur', async () => {
    render(
      <TestWrapper>
        <HelpCirclePopper {...defaultProps} />
      </TestWrapper>
    );

    const helpCircleIcon = screen.getByRole('button', { name: /Help Circle/i });
    expect(helpCircleIcon).toBeInTheDocument();

    fireEvent.focus(helpCircleIcon);
    expect(await screen.findByText('This is a help text')).toBeInTheDocument();

    fireEvent.blur(helpCircleIcon);
    await waitFor(() => {
      expect(screen.queryByText('This is a help text')).not.toBeInTheDocument();
    });
    // HUB-151797
    // expect(await axe(container)).toHaveNoViolations();
  });

  it('opens help text on Enter key press', async () => {
    render(
      <TestWrapper>
        <HelpCirclePopper {...defaultProps} />
      </TestWrapper>
    );

    const helpCircleIcon = screen.getByRole('button', { name: /Help Circle/i });
    expect(helpCircleIcon).toBeInTheDocument();

    fireEvent.keyDown(helpCircleIcon, { code: 'Enter' });
    expect(await screen.findByText('This is a help text')).toBeInTheDocument();
    fireEvent.keyDown(helpCircleIcon, { code: 'Enter' });
    await waitFor(() => {
      expect(screen.queryByText('This is a help text')).not.toBeInTheDocument();
    });
    // HUB-151797
    // expect(await axe(container)).toHaveNoViolations();
  });
});

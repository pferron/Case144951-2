import { fireEvent, render, waitFor } from '@testing-library/react';
import { screen } from 'nucleus-text/testing-library/screen';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import React from 'react';
import 'jest-axe/extend-expect';
import { axe } from 'jest-axe';
import { HelpInfoPopper } from '@components/hubOverview/HelpInfoPopper';

describe('Help Info Popper', () => {
  it('renders help text on hover', async () => {
    const { container } = render(
      <TestWrapper>
        <HelpInfoPopper
          testID="testId"
          hoverElement={<p>Title</p>}
          accessibilityLabel="Title"
          helpText="Unique views counted after 30 seconds of watch time"
          style={{}}
          placement="top-start"
          maxWidth="20rem"
        />
      </TestWrapper>
    );
    await waitFor(() => {
      expect(screen.getByText('Title')).toBeInTheDocument();
    });
    const title = screen.getByText('Title');
    fireEvent.mouseOver(title);
    const helpText = screen.getByText('Unique views counted after 30 seconds of watch time');
    await waitFor(() => {
      expect(helpText).toBeInTheDocument();
    });
    fireEvent.mouseLeave(title);
    await waitFor(() => {
      expect(helpText).not.toBeInTheDocument();
    });
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders help text on focus', async () => {
    const { container } = render(
      <TestWrapper>
        <HelpInfoPopper
          testID="testId"
          hoverElement={<p>Title</p>}
          accessibilityLabel="Title"
          helpText="Unique views counted after 30 seconds of watch time"
          style={{}}
          placement="top"
          maxWidth="20rem"
        />
      </TestWrapper>
    );
    await waitFor(() => {
      expect(screen.getByText('Title')).toBeInTheDocument();
    });
    const title = screen.getByText('Title');
    fireEvent.focus(title);
    const helpText = screen.getByText('Unique views counted after 30 seconds of watch time');
    await waitFor(() => {
      expect(helpText).toBeInTheDocument();
    });
    fireEvent.blur(title);
    await waitFor(() => {
      expect(helpText).not.toBeInTheDocument();
    });
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders help text on click', async () => {
    const { container } = render(
      <TestWrapper>
        <HelpInfoPopper
          testID="testId"
          hoverElement={<p>Title</p>}
          accessibilityLabel="Title"
          helpText="Unique views counted after 30 seconds of watch time"
          style={{}}
          placement="top-start"
          maxWidth="20rem"
        />
      </TestWrapper>
    );
    await waitFor(() => {
      expect(screen.getByText('Title')).toBeInTheDocument();
    });
    const title = screen.getByText('Title');
    fireEvent.click(title);
    const helpText = screen.getByText('Unique views counted after 30 seconds of watch time');
    await waitFor(() => {
      expect(helpText).toBeInTheDocument();
    });
    fireEvent.click(title);
    await waitFor(() => {
      expect(helpText).not.toBeInTheDocument();
    });
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders help text on enter', async () => {
    const { container } = render(
      <TestWrapper>
        <HelpInfoPopper
          testID="testId"
          hoverElement={<p>Title</p>}
          accessibilityLabel="Title"
          helpText="Unique views counted after 30 seconds of watch time"
          style={{}}
          maxWidth="20rem"
        />
      </TestWrapper>
    );
    await waitFor(() => {
      expect(screen.getByText('Title')).toBeInTheDocument();
    });
    const title = screen.getByText('Title');
    fireEvent.keyDown(title, { key: 'Enter', code: 'Enter', keyCode: 13, charCode: 13 });
    const helpText = screen.getByText('Unique views counted after 30 seconds of watch time');
    await waitFor(() => {
      expect(helpText).toBeInTheDocument();
    });
    fireEvent.keyDown(title, { key: 'Enter', code: 'Enter', keyCode: 13, charCode: 13 });
    await waitFor(() => {
      expect(helpText).not.toBeInTheDocument();
    });
    expect(await axe(container)).toHaveNoViolations();
  });
});

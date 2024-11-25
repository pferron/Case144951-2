import { fireEvent, render, waitFor } from '@testing-library/react';
import { screen } from 'nucleus-text/testing-library/screen';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import React from 'react';
import LoginWebLink from '@components/memberList/LoginWebLink';
import 'jest-axe/extend-expect';
import { axe } from 'jest-axe';

const mock = jest.fn();

describe('Login link', () => {
  it('renders login link', async () => {
    const { container } = render(
      <TestWrapper>
        <LoginWebLink url="test_login_url" generateLoginLink={mock} />
      </TestWrapper>
    );
    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn().mockImplementation(() => Promise.resolve())
      }
    });
    jest.spyOn(navigator.clipboard, 'writeText');
    await new Promise(resolve => {
      setTimeout(resolve, 200);
    });
    const regenerateButton = screen.queryByText('Regenerate');
    expect(regenerateButton).toBeInTheDocument();
    expect(await screen.findByText('test_login_url')).toBeInTheDocument();
    expect(screen.getByTestId('weblink')).toBeInTheDocument();
    expect(screen.getByTestId('login-link-copy-button')).toBeInTheDocument();
    const tooltipButton = screen.getByRole('button', { name: /Copy/i });
    expect(tooltipButton).toBeInTheDocument();

    fireEvent.mouseOver(tooltipButton);
    expect(await screen.findByTextKey('tooltip_text_on_hover_copy_button')).toBeInTheDocument();

    fireEvent.mouseLeave(tooltipButton);
    await waitFor(() => {
      expect(screen.queryByTextKey('tooltip_text_on_hover_copy_button')).not.toBeInTheDocument();
    });
    fireEvent.click(tooltipButton);
    expect(await screen.findByTextKey('tooltip_text_on_click_copy_button')).toBeInTheDocument();
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('test_login_url');
    expect(await axe(container)).toHaveNoViolations();
  });
});

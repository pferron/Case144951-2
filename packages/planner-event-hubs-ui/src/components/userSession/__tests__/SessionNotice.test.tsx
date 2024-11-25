import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import { SessionNotice } from '../SessionNotice';

describe('Session expiration modal', () => {
  it('renders session expiration modal', async () => {
    const onKeepWorkingMock = jest.fn();
    const onLogoutMock = jest.fn();
    render(
      <TestWrapper>
        <SessionNotice
          isOpen
          timeLeft={65}
          onKeepWorking={onKeepWorkingMock}
          onLogout={onLogoutMock}
          hasRefreshError={false}
        />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId('session-notice-expiration-modal-container')).toBeInTheDocument();
    });

    expect(screen.getByTestId('session-notice-expiration-modal-header')).toBeInTheDocument();
    expect(screen.getByTestId('session-notice-expiration-modal-message')).toBeInTheDocument();
    expect(await screen.findByText("You're about to be logged out due to inactivity")).toBeInTheDocument();
    expect(screen.getByTestId('session-notice-expiration-modal-time-left')).toBeInTheDocument();
    expect(await screen.findByText('1:05 remaining')).toBeInTheDocument();

    const logOutButton = screen.getByTestId('session-notice-expiration-modal-log-out-button');
    const keepWorkingButton = screen.getByTestId('session-notice-expiration-modal-keep-working-button');
    expect(logOutButton).toBeInTheDocument();
    expect(keepWorkingButton).toBeInTheDocument();

    fireEvent.click(logOutButton);
    expect(onLogoutMock).toHaveBeenCalled();

    fireEvent.click(keepWorkingButton);
    expect(onKeepWorkingMock).toHaveBeenCalled();
  });

  it('renders session expiration modal with refresh error', async () => {
    const onKeepWorkingMock = jest.fn();
    const onLogoutMock = jest.fn();
    render(
      <TestWrapper>
        <SessionNotice isOpen timeLeft={60} onKeepWorking={onKeepWorkingMock} onLogout={onLogoutMock} hasRefreshError />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId('session-notice-expiration-modal-container')).toBeInTheDocument();
    });

    expect(screen.getByTestId('session-notice-expiration-modal-header')).toBeInTheDocument();
    expect(screen.getByTestId('session-notice-expiration-modal-message')).toBeInTheDocument();
    expect(await screen.findByText("You're about to be logged out due to inactivity")).toBeInTheDocument();
    const timeLeftWithRefreshError = screen.getByTestId('session-notice-expiration-modal-time-left');
    expect(timeLeftWithRefreshError).toMatchInlineSnapshot(`
      .emotion-0 {
        color: rgb(219,44,0);
        font-size: 0.875rem;
        font-weight: 500;
        text-align: center;
      }

      <div
        class="emotion-0"
        data-cvent-id="session-notice-expiration-modal-time-left"
      >
        1:00 remaining
        <br />
        <br />
        Failed to refresh your session; try again
      </div>
    `);
  });
});

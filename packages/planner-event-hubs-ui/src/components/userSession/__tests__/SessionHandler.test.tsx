import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { LocalizationProvider } from 'nucleus-text';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import locales from '../../../../locales';
import { SessionHandler } from '../SessionHandler';

const mockHeartbeat = jest.fn();
const normandyBaseUrl = 'https://normandy-base-url.com';

jest.mock('../hooks', () => ({
  useKeepAlive: () => ({
    heartbeat: mockHeartbeat,
    timeLeft: 30
  }),
  useLastInteraction: () => []
}));

describe('SessionHandler', () => {
  test('renders normandy session notice modal', async (): Promise<void> => {
    const stillThereText = 'Still there';
    const noticeText = 'Notice text';
    const timeLeftText = (time): string => time;
    const logOutText = 'log out';
    const keepWorkingText = 'keep working';
    const refreshErrorText = 'Refresh error text';

    render(
      <LocalizationProvider locale="en-US" locales={locales}>
        <TestWrapper>
          <SessionHandler
            normandyEndpoint={normandyBaseUrl || ''}
            stillThereText={stillThereText}
            noticeText={noticeText}
            timeLeftText={timeLeftText}
            logOutText={logOutText}
            keepWorkingText={keepWorkingText}
            refreshErrorText={refreshErrorText}
          />
        </TestWrapper>
      </LocalizationProvider>
    );
    await waitFor(() => {
      expect(screen.getByTestId('session-notice-expiration-modal-container')).toBeInTheDocument();
    });
    expect(mockHeartbeat).not.toHaveBeenCalled();
    const keepWorkingButton = screen.getByTestId('session-notice-expiration-modal-keep-working-button');
    expect(keepWorkingButton).toBeInTheDocument();
    fireEvent.click(keepWorkingButton);
    expect(mockHeartbeat).toHaveBeenCalledWith(true);
  });

  test('does not render normandy session modal', async (): Promise<void> => {
    const stillThereText = 'Still there';
    const noticeText = 'Notice text';
    const timeLeftText = (time): string => time;
    const logOutText = 'log out';
    const keepWorkingText = 'keep working';
    const refreshErrorText = 'Refresh error text';

    const { baseElement } = render(
      <LocalizationProvider locale="en-US" locales={locales}>
        <TestWrapper>
          <SessionHandler
            normandyEndpoint={normandyBaseUrl || ''}
            stillThereText={stillThereText}
            noticeText={noticeText}
            timeLeftText={timeLeftText}
            logOutText={logOutText}
            keepWorkingText={keepWorkingText}
            refreshErrorText={refreshErrorText}
            showNoticeWhenUnder={20}
          />
        </TestWrapper>
      </LocalizationProvider>
    );
    expect(baseElement).toMatchInlineSnapshot(`
      <body
        style=""
      >
        <div />
      </body>
    `);
  });
});

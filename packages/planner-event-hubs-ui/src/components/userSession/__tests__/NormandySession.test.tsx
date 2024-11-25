import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { LocalizationProvider } from 'nucleus-text';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import locales from '../../../../locales';
import { NormandySession } from '../NormandySession';

const mockHeartbeat = jest.fn();
const normandyBaseUrl = 'https://normandy-base-url.com';

jest.mock('../hooks', () => ({
  useKeepAlive: () => ({
    heartbeat: mockHeartbeat,
    timeLeft: 30
  }),
  useLastInteraction: () => []
}));

describe('NormandySession', () => {
  test('renders normandy session notice modal', async (): Promise<void> => {
    render(
      <LocalizationProvider locale="en-US" locales={locales}>
        <TestWrapper>
          <NormandySession showNoticeWhenUnder={60} normandyBaseUrl={normandyBaseUrl} />
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
    const { baseElement } = render(
      <LocalizationProvider locale="en-US" locales={locales}>
        <TestWrapper>
          <NormandySession
            showNoticeWhenUnder={20} // Should not yet show session expiration modal
            normandyBaseUrl={normandyBaseUrl}
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

import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import LibraryNavigationConfirmationModal from '../LibraryNavigationConfirmationModal';

jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '',
      query: '',
      asPath: ''
    };
  }
}));

describe('Library navigation confirmation modal', () => {
  it('renders library navigation confirmation modal - stay button', async () => {
    const setIsOpen = jest.fn();
    const onClickLeave = jest.fn();
    render(
      <TestWrapper>
        <LibraryNavigationConfirmationModal
          isOpen
          setIsOpen={setIsOpen}
          bodyText="This is sample body text for library navigation confirmation modal"
          preventLeave
          onPreventRouteChange={() => null}
          testID="test"
          onClickLeave={onClickLeave}
        />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId('test-navigation-confirmation-modal-container')).toBeInTheDocument();
    });

    expect(screen.getByTestId('test-navigation-confirmation-modal-header')).toBeInTheDocument();
    expect(screen.getByTestId('test-navigation-confirmation-modal-body')).toBeInTheDocument();
    expect(
      await screen.findByText('This is sample body text for library navigation confirmation modal')
    ).toBeInTheDocument();
    expect(screen.getByTestId('test-navigation-confirmation-modal-leave-button')).toBeInTheDocument();

    const stayButton = await screen.findByRole('button', {
      name: 'Stay'
    });
    expect(stayButton).toBeInTheDocument();
    fireEvent.click(stayButton);
    expect(setIsOpen).toHaveBeenCalledWith(false);
    expect(onClickLeave).toHaveBeenCalledTimes(0);
  });

  it('renders library navigation confirmation modal - Leave button', async () => {
    const setIsOpen = jest.fn();
    const onClickLeave = jest.fn();
    render(
      <TestWrapper>
        <LibraryNavigationConfirmationModal
          isOpen
          setIsOpen={setIsOpen}
          bodyText="This is sample body text for library navigation confirmation modal"
          preventLeave
          onPreventRouteChange={() => null}
          testID="test"
          onClickLeave={onClickLeave}
        />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId('test-navigation-confirmation-modal-container')).toBeInTheDocument();
    });

    expect(screen.getByTestId('test-navigation-confirmation-modal-leave-button')).toBeInTheDocument();

    const leaveButton = await screen.findByRole('button', {
      name: 'Leave'
    });
    expect(leaveButton).toBeInTheDocument();
    fireEvent.click(leaveButton);
    expect(setIsOpen).toHaveBeenCalledTimes(0);
    expect(onClickLeave).toHaveBeenCalledTimes(1);
  });
});

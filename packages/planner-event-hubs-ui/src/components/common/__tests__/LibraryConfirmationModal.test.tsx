import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { injectTestId } from '@cvent/nucleus-test-automation';
import userEvent from '@testing-library/user-event';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import ConfirmationModal from '../LibraryConfirmationModal';

describe('Library Confirmation Modal', () => {
  it('Renders the delete video confirmation modal', async () => {
    const confirmationAction = jest.fn();
    const setIsModalOpen = jest.fn();
    render(
      <TestWrapper>
        <ConfirmationModal
          header="confirmation-modal-header"
          content="test"
          cancelText="Cancel"
          confirmationText="Delete video"
          confirmationAction={confirmationAction}
          setIsModalOpen={setIsModalOpen}
        />
      </TestWrapper>
    );
    await waitFor(() => {
      expect(screen.getByTestId('confirmation-modal')).toBeInTheDocument();
    });
  });

  it('Should call confirmation action on click', async () => {
    const confirmationAction = jest.fn();
    const setIsModalOpen = jest.fn();
    render(
      <TestWrapper>
        <ConfirmationModal
          header="confirmation-modal-header"
          content="test"
          cancelText="Cancel"
          confirmationText="Delete video"
          confirmationAction={confirmationAction}
          setIsModalOpen={setIsModalOpen}
        />
      </TestWrapper>
    );

    const button = await screen.findByTestId('confirmation-modal-confirmation-button');
    fireEvent.click(button);
    await waitFor(() => {
      expect(confirmationAction).toHaveBeenCalledTimes(1);
    });
  });

  it('Should call cancel action on click', async () => {
    const cancelAction = jest.fn();
    const setIsModalOpen = jest.fn();
    render(
      <TestWrapper>
        <ConfirmationModal
          header="confirmation-modal-header"
          content="test"
          cancelText="Cancel"
          confirmationText="Delete video"
          confirmationAction={jest.fn()}
          cancelAction={cancelAction}
          setIsModalOpen={setIsModalOpen}
        />
      </TestWrapper>
    );

    const button = await screen.findByTestId('confirmation-modal-cancel-button');
    fireEvent.click(button);
    await waitFor(() => {
      expect(cancelAction).toHaveBeenCalledTimes(1);
    });
    await waitFor(() => {
      expect(setIsModalOpen).toHaveBeenCalledWith(false);
    });
  });
  it('Should close the modal when clicking the escape key', async () => {
    const cancelAction = jest.fn();
    const setIsModalOpen = jest.fn();
    render(
      <TestWrapper>
        <div {...injectTestId('content-area')}>
          <ConfirmationModal
            header="confirmation-modal-header"
            content="test"
            cancelText="Cancel"
            confirmationText="Delete video"
            confirmationAction={jest.fn()}
            cancelAction={cancelAction}
            setIsModalOpen={setIsModalOpen}
          />
        </div>
      </TestWrapper>
    );
    userEvent.keyboard('{esc}');
    await waitFor(() => {
      expect(cancelAction).toHaveBeenCalledTimes(0);
    });
  });
});

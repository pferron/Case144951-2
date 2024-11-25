import { fireEvent, render } from '@testing-library/react';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import { axe } from 'jest-axe';
import 'jest-axe/extend-expect';
import { screen } from 'nucleus-text/testing-library/screen';
import CheckConfirmationModal from '../CheckConfirmationModal';

describe('CheckConfirmationModal', () => {
  const mockSetIsModalOpen = jest.fn();
  const mockSaveAction = jest.fn();
  const mockCancelAction = jest.fn();

  it('Should render modal with save and cancel buttons', async () => {
    const { container } = render(
      <TestWrapper>
        <CheckConfirmationModal
          isModalOpen
          setIsModalOpen={mockSetIsModalOpen}
          saveAction={mockSaveAction}
          cancelAction={mockCancelAction}
        />
      </TestWrapper>
    );

    expect(await screen.findByTextKey('language_management_confirmation_modal_save_btn')).toBeInTheDocument();
    expect(await screen.findByTextKey('language_management_confirmation_modal_dont_save_btn')).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('Should call saveAction when save button is clicked', async () => {
    render(
      <TestWrapper>
        <CheckConfirmationModal
          isModalOpen
          setIsModalOpen={mockSetIsModalOpen}
          saveAction={mockSaveAction}
          cancelAction={mockCancelAction}
        />
      </TestWrapper>
    );

    fireEvent.click(await screen.findByTextKey('language_management_confirmation_modal_save_btn'));

    expect(mockSaveAction).toHaveBeenCalled();
  });

  it('Should call cancelAction when cancel button is clicked', async () => {
    render(
      <TestWrapper>
        <CheckConfirmationModal
          isModalOpen
          setIsModalOpen={mockSetIsModalOpen}
          saveAction={mockSaveAction}
          cancelAction={mockCancelAction}
        />
      </TestWrapper>
    );

    fireEvent.click(await screen.findByTextKey('language_management_confirmation_modal_dont_save_btn'));

    expect(mockCancelAction).toHaveBeenCalled();
  });
});

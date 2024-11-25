import React from 'react';
import ConfirmationModal from '@components/common/ConfirmationModal';
import { useTranslate } from 'nucleus-text';

function TrackingParameterDeleteModal({ setIsModalOpen, deleteTrackingParameter }: Props): JSX.Element {
  const { translate } = useTranslate();
  const deleteModalHeader = translate('delete_tracking_parameters_modal_header');
  const deleteModalContent = translate('delete_tracking_parameters_instruction_text');
  const cancelButtonText = translate('tracking_parameters_confirmation_modal_cancel_button');
  const deleteButtonText = translate('delete_tracking_parameters_button');

  return (
    <ConfirmationModal
      header={deleteModalHeader}
      content={deleteModalContent}
      cancelText={cancelButtonText}
      confirmationText={deleteButtonText}
      confirmationAction={deleteTrackingParameter}
      setIsModalOpen={setIsModalOpen}
      cancelAction={() => {
        setIsModalOpen(false);
      }}
    />
  );
}

interface Props {
  setIsModalOpen: (boolean) => void;
  deleteTrackingParameter: () => void;
}
export default TrackingParameterDeleteModal;

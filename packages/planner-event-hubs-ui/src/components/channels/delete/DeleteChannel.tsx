import React from 'react';
import ConfirmationModal from '@components/common/ConfirmationModal';
import { useTranslate } from 'nucleus-text';

function DeleteChannel({ setIsModalOpen, deleteChannel }: Props): JSX.Element {
  const { translate } = useTranslate();
  const deleteModalHeader = translate('delete_channel_modal_header');
  const deleteModalContent = translate('delete_channel_instruction_text');
  const cancelButtonText = translate('keep_button');
  const deleteButtonText = translate('delete_button');

  return (
    <ConfirmationModal
      header={deleteModalHeader}
      content={deleteModalContent}
      cancelText={cancelButtonText}
      confirmationText={deleteButtonText}
      confirmationAction={deleteChannel}
      setIsModalOpen={setIsModalOpen}
    />
  );
}

interface Props {
  setIsModalOpen: (boolean) => void;
  deleteChannel: () => void;
}
export default DeleteChannel;

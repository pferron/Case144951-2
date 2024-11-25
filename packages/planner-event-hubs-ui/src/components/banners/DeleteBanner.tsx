import React from 'react';
import ConfirmationModal from '@components/common/ConfirmationModal';
import { useQuery } from '@apollo/client';
import { useTranslate } from 'nucleus-text';
import { HUB_PAGES_WITH_BANNER } from '@cvent/planner-event-hubs-model/operations/banner';

function DeleteBanner({ setIsModalOpen, videoCenterId, bannerId, deleteBanner }: Props): JSX.Element {
  const { translate } = useTranslate();
  const deleteModalHeader = translate('delete_banner_modal_header');
  const deleteModalContent = translate('delete_banner_instruction_text');
  const deleteModalContentDisabled = translate('delete_banner_disabled_instruction_text');
  const cancelButtonText = translate('cancel_button');
  const deleteButtonText = translate('delete_banner_button');

  // Check for existing associations
  const { data: bannerWithPagesData } = useQuery(HUB_PAGES_WITH_BANNER, {
    variables: {
      input: {
        hubId: videoCenterId,
        bannerId
      }
    }
  });

  const hasAssociations = !!bannerWithPagesData?.hubPagesWithBanner?.data.length;

  // Add dismiss button
  return (
    <ConfirmationModal
      header={deleteModalHeader}
      disableConfirmButton={hasAssociations}
      content={hasAssociations ? deleteModalContentDisabled : deleteModalContent}
      cancelText={cancelButtonText}
      confirmationText={deleteButtonText}
      confirmationAction={deleteBanner}
      setIsModalOpen={setIsModalOpen}
    />
  );
}

interface Props {
  setIsModalOpen: (boolean) => void;
  deleteBanner: () => void;
  videoCenterId: string;
  bannerId: string;
}
export default DeleteBanner;

import React from 'react';
import { ExtendedItem, ExtendedSection } from '@components/channels/type/channelCatalog';
import { Form } from '@cvent/carina/components/Forms';
import SectionModalContent from '@components/channels/videos/CreateSection/SectionModalContent';
import Modal from '@cvent/carina/components/Modal';
import { CHANNEL_PAGE_MODAL_Z_INDEX } from '@utils/constants';

interface Props {
  isOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  videos: Array<ExtendedItem>;
  isEditMode: boolean;
  onCreate: (sectionName: string, selectedVideos: Array<string>) => void;
  onUpdate: (section: ExtendedSection, title: string, selectedVideos: Array<string>) => void;
  section?: ExtendedSection;
}
function SectionModal({ isOpen, setIsModalOpen, ...props }: Props): JSX.Element {
  return (
    <Modal
      format="fullscreen"
      isOpen={isOpen}
      testID="create-section-modal"
      onDismiss={() => {
        setIsModalOpen(false);
      }}
      zIndex={CHANNEL_PAGE_MODAL_Z_INDEX}
      portal
    >
      <Form initialValues={{ sectionName: props?.section?.title }}>
        <SectionModalContent setIsModalOpen={setIsModalOpen} {...props} />
      </Form>
    </Modal>
  );
}

export default SectionModal;

import React from 'react';
import { Modal } from '@cvent/carina/components/Modal';
import { Form } from '@cvent/carina/components/Forms';
import { useTranslate } from 'nucleus-text';
import { useStyle } from '@hooks/useStyle';
import { CreateChannelModalStyles } from '@components/channels/style';
import { ChannelFormData } from '@components/channels/create/ChannelFormData';
import { injectTestId } from '@cvent/nucleus-test-automation';
import useBreakpoints from '@hooks/useBreakpoints';
import DismissButton from '@cvent/carina/components/ScrollViewWithBars/DismissButton';

function ChannelModal({ isModalOpen, setIsModalOpen, onSave }: Props): JSX.Element {
  const { translate } = useTranslate();
  const { isS, isM } = useBreakpoints();
  const { container, headerStyle } = useStyle(CreateChannelModalStyles);

  const submit = (event, submission): void => {
    const { values } = submission;
    setIsModalOpen(false);
    onSave(values.channelName?.trim(), values.channelDescription?.trim());
  };

  const closeModal = (): void => {
    setIsModalOpen(false);
  };

  return (
    <Modal
      format={(isS && 's') || (isM && 'm') || 'l'}
      isOpen={isModalOpen}
      onDismiss={closeModal}
      portal
      testID="create-channel-modalId"
    >
      <div css={container}>
        <div css={headerStyle}>
          <h3 {...injectTestId('create-channel-modal-header')}>{translate('create_channel_form_header')}</h3>
          <DismissButton {...injectTestId('close-create-channel-modal')} aria-label="close" onClick={closeModal} />
        </div>
        <Form onSubmit={submit}>
          <ChannelFormData onCancel={closeModal} />
        </Form>
      </div>
    </Modal>
  );
}

interface Props {
  isModalOpen: boolean;
  setIsModalOpen: (close: boolean) => void;
  onSave: (name: string, description: string) => void;
}

export default ChannelModal;

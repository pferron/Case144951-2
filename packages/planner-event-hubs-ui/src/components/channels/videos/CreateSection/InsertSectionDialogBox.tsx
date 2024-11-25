import { Form, Textbox, useWatchField } from '@cvent/carina/components/Forms';
import Modal from '@cvent/carina/components/Modal';
import React from 'react';
import { injectTestId } from '@cvent/nucleus-test-automation';
import DismissButton from '@cvent/carina/components/ScrollViewWithBars/DismissButton';
import { useTranslate } from 'nucleus-text';
import { useStyle } from '@hooks/useStyle';
import { CreateChannelModalStyles } from '@components/channels/style';
import { CHANNEL_NAME_MAX_LENGTH, CHANNEL_PAGE_MODAL_Z_INDEX } from '@utils/constants';
import { Col } from '@cvent/carina/components/Col';
import { Row } from '@cvent/carina/components/Row';
import { Button } from '@cvent/carina/components/Button';
import useBreakpoints from '@hooks/useBreakpoints';

interface ContentProps {
  onCancel: () => void;
}

function Content({ onCancel }: ContentProps): JSX.Element {
  const { translate } = useTranslate();
  const sectionName = 'sectionName';
  const { [sectionName]: sectionNameValue = '' } = useWatchField([sectionName]);

  const remainingLengthMessage = (maxLength: number, value: string): string =>
    `${translate('characters_left_label', {
      characterCount: maxLength - value.length
    })}`;

  const updateTransform = (value: string): string => value.trimStart();

  return (
    <>
      <Textbox
        id="section-name-form-input-name"
        name={sectionName}
        label={translate('channel_video_create_section_name_label')}
        maxLength={CHANNEL_NAME_MAX_LENGTH}
        onUpdateTransform={updateTransform}
        required
        messages={remainingLengthMessage(CHANNEL_NAME_MAX_LENGTH, sectionNameValue)}
      />
      <Row margin={-8} justifyContent="flex-start">
        <Col padding={0} flex={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
          <Col width="content">
            <Button
              type="reset"
              text={translate('cancel_button_label')}
              appearance="ghost"
              accessibilityLabel={translate('cancel_button_label')}
              testID="create-section-cancel-button"
              onClick={onCancel}
            />
          </Col>
          <Col width="content">
            <Button
              type="submit"
              text={translate('create_button_label')}
              accessibilityLabel={translate('create_button_label')}
              appearance="filled"
              testID="create-section-button"
              disabled={sectionNameValue.length === 0}
            />
          </Col>
        </Col>
      </Row>
    </>
  );
}

interface Props {
  isOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  sectionId: string;
  itemId: string;
  isBefore: boolean;
  onAdd: (sectionId: string, itemId: string, sectionName: string, isBefore: boolean) => void;
}

function InsertSectionDialogBox({ isOpen, setIsModalOpen, onAdd, isBefore, sectionId, itemId }: Props): JSX.Element {
  const { container, headerStyle } = useStyle(CreateChannelModalStyles);
  const { isMobile } = useBreakpoints();
  const { translate } = useTranslate();

  const headerText = isBefore
    ? translate('channel_video_insert_section_before_modal_label')
    : translate('channel_video_insert_section_after_modal_label');

  const submit = (_event, submission): void => {
    const { values } = submission;
    setIsModalOpen(false);
    onAdd(sectionId, itemId, values.sectionName, isBefore);
  };

  const closeModal = (): void => {
    setIsModalOpen(false);
  };

  return (
    <Modal
      format={(isMobile && 's') || 'm'}
      testID="create-section-modal"
      isOpen={isOpen}
      onDismiss={() => {
        setIsModalOpen(false);
      }}
      zIndex={CHANNEL_PAGE_MODAL_Z_INDEX}
      portal
    >
      <div css={container}>
        <div css={headerStyle}>
          <h3 {...injectTestId('create-section-modal-header')}>{translate('channel_video_insert_section_label')}</h3>
          <DismissButton {...injectTestId('close-section-modal')} aria-label="close" onClick={closeModal} />
        </div>
        <p css={{ paddingTop: 0, marginTop: 0 }}>{headerText}</p>
        <Form onSubmit={submit}>
          <Content onCancel={closeModal} />
        </Form>
      </div>
    </Modal>
  );
}

export default InsertSectionDialogBox;

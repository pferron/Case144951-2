import React from 'react';
import { Col } from '@cvent/carina/components/Col';
import { Row } from '@cvent/carina/components/Row';
import { Button } from '@cvent/carina/components/Button';
import { Modal } from '@cvent/carina/components/Modal';
import { useLibraryStyle } from '@hooks/useStyle';
import { injectTestId } from '@cvent/nucleus-test-automation';
import { LibraryConfirmationModalStyles } from '@components/common/style';

function ConfirmationModal({
  header,
  content,
  cancelText,
  confirmationText,
  confirmationAction,
  isModalOpen = true,
  setIsModalOpen,
  disableConfirmButton,
  cancelAction,
  defaultConfirmationAction = false
}: Props): JSX.Element {
  const { modalHeaderStyles, modalContentStyles } = useLibraryStyle(LibraryConfirmationModalStyles);

  return (
    <Modal
      isOpen={isModalOpen}
      onDismiss={(): void => {
        setIsModalOpen(false);
      }}
      format="s"
      testID="confirmation-modal"
      portal
    >
      <div style={{ padding: '1.5rem' }}>
        <Row>
          <Col width="content" padding={0}>
            <span css={modalHeaderStyles} {...injectTestId('confirmation-modal-header')}>
              {header}
            </span>
          </Col>
          {/* <Col width="fill" flex={{ display: 'flex', justifyContent: 'flex-end' }} padding={0}>
            <DismissButton
              aria-label={'Cancel'}
              onClick={(): void => {
                setIsModalOpen(false);
              }}
            />
          </Col> */}
        </Row>
        <Row style={{ paddingBottom: '1.5rem' }}>
          <Col width="fill" padding={0}>
            <p css={modalContentStyles}>{content}</p>
          </Col>
        </Row>
        <Row justifyContent="flex-end">
          <Col padding={0} flex={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
            <Col width="content" padding={0}>
              <Button
                appearance={defaultConfirmationAction ? 'filled' : 'ghost'}
                text={cancelText}
                onClick={(): void => {
                  cancelAction?.();
                  setIsModalOpen(false);
                }}
                testID="confirmation-modal-cancel-button"
              />
            </Col>
            <Col width="content">
              <Button
                disabled={disableConfirmButton}
                appearance={defaultConfirmationAction ? 'ghost' : 'filled'}
                autoFocus
                text={confirmationText}
                onClick={(): void => {
                  confirmationAction();
                }}
                testID="confirmation-modal-confirmation-button"
              />
            </Col>
          </Col>
        </Row>
      </div>
    </Modal>
  );
}

interface Props {
  header: string;
  content: string | React.ReactElement;
  cancelText: string;
  cancelAction?: () => void;
  confirmationText: string;
  confirmationAction: () => void;
  isModalOpen?: boolean;
  setIsModalOpen: (arg0: boolean) => void;
  disableConfirmButton?: boolean;
  // Use this prop to switch the call to action on the left side button
  defaultConfirmationAction?: boolean;
}

export default ConfirmationModal;

import React from 'react';
import { Col } from '@cvent/carina/components/Col';
import { Row } from '@cvent/carina/components/Row';
import { Button } from '@cvent/carina/components/Button';
import Modal from '@cvent/carina/components/Modal';
import { useStyle } from '@hooks/useStyle';
import { injectTestId } from '@cvent/nucleus-test-automation';
import { ConfirmationModalStyles } from '@components/common/style';
import DismissButton from '@cvent/carina/components/ScrollViewWithBars/DismissButton';

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
  showDismissButton = false,
  defaultConfirmationAction = false
}: Props): JSX.Element {
  const { modalHeaderStyles, modalContentStyles } = useStyle(ConfirmationModalStyles);

  return (
    <Modal
      isOpen={isModalOpen}
      onDismiss={(): void => {
        setIsModalOpen(false);
      }}
      format="s"
      testID="confirmation-modal"
      portal
      aria-label="confirmation-modal"
    >
      <div style={{ padding: '1.5rem' }}>
        <Row>
          <Col width="content" padding={0}>
            <span css={modalHeaderStyles} {...injectTestId('confirmation-modal-header')}>
              {header}
            </span>
          </Col>
          {showDismissButton && (
            <Col width="fill" flex={{ display: 'flex', justifyContent: 'flex-end' }} padding={0}>
              <DismissButton
                aria-label={cancelText}
                onClick={(): void => {
                  setIsModalOpen(false);
                }}
              />
            </Col>
          )}
        </Row>
        <Row>
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
                aria-label={cancelText}
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
                aria-label={confirmationText}
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
  // Use this prop to show the dismiss button on confirmation modal.
  showDismissButton?: boolean;
}

export default ConfirmationModal;

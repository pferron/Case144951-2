import { ConfirmationModalStyles } from '@components/common/style';
import { Button } from '@cvent/carina/components/Button';
import { Col } from '@cvent/carina/components/Col';
import Modal from '@cvent/carina/components/Modal';
import { Row } from '@cvent/carina/components/Row';
import DismissButton from '@cvent/carina/components/ScrollViewWithBars/DismissButton';
import { injectTestId } from '@cvent/nucleus-test-automation';
import { useStyle } from '@hooks/useStyle';
import { useTranslate } from 'nucleus-text';

function CheckConfirmationModal({ isModalOpen = true, setIsModalOpen, saveAction, cancelAction }: Props): JSX.Element {
  const { translate } = useTranslate();
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
      aria-label={translate('language_management_save_or_not_confirmation_modal_accessibility')}
    >
      <div style={{ padding: '1.5rem' }}>
        <Row>
          <Col width="content" padding={0}>
            <span css={modalHeaderStyles} {...injectTestId('confirmation-modal-header')}>
              {translate('language_management_confirmation_modal_header')}
            </span>
          </Col>
          <Col width="fill" flex={{ display: 'flex', justifyContent: 'flex-end' }} padding={0}>
            <DismissButton
              aria-label="Cancel"
              onClick={(): void => {
                setIsModalOpen(false);
              }}
            />
          </Col>
        </Row>
        <Row>
          <Col width="fill" padding={0}>
            <p css={modalContentStyles}>{translate('language_management_confirmation_modal_content')}</p>
          </Col>
        </Row>
        <Row justifyContent="flex-end">
          <Col padding={0} flex={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
            <Col width="content" padding={0}>
              <Button
                appearance="lined"
                text={translate('language_management_confirmation_modal_dont_save_btn')}
                onClick={(): void => {
                  cancelAction();
                  setIsModalOpen(false);
                }}
                testID="confirmation-modal-do-not-save-button"
              />
            </Col>
            <Col width="content">
              <Button
                appearance="filled"
                autoFocus
                text={translate('language_management_confirmation_modal_save_btn')}
                onClick={(): void => {
                  saveAction();
                  setIsModalOpen(false);
                }}
                testID="confirmation-modal-save-button"
              />
            </Col>
          </Col>
        </Row>
      </div>
    </Modal>
  );
}

interface Props {
  isModalOpen?: boolean;
  setIsModalOpen: (boolean) => void;
  saveAction: () => void;
  cancelAction: () => void;
}
export default CheckConfirmationModal;

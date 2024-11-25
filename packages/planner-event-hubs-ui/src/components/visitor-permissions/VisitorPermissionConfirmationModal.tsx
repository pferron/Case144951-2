import { useTranslate } from 'nucleus-text';
import { useStyle } from '@hooks/useStyle';
import { Modal } from '@cvent/carina/components/Modal';
import React from 'react';
import { ScrollViewWithBars } from '@cvent/carina/components/ScrollViewWithBars';
import { Button } from '@cvent/carina/components/Button';
import { OverrideSettingsModalStyles } from '@components/visitor-permissions/style';

function VisitorPermissionConfirmationModal({
  onSaveButtonContent,
  onCancelButtonContent,
  isModalOpen,
  setIsModalOpen,
  onSave,
  onCancel,
  heading,
  content
}: Props): JSX.Element {
  const { translate } = useTranslate();
  const closeModal = (): void => {
    setIsModalOpen(false);
  };
  const { body, header, footer, buttons, declineButton } = useStyle(OverrideSettingsModalStyles);

  const VisitorPermissionConfirmationModalHeader: JSX.Element = (
    <div css={header}>
      <h2>{heading}</h2>
    </div>
  );

  const VisitorPermissionConfirmationModalFooter: JSX.Element = (
    <div css={footer}>
      <div css={buttons}>
        <div css={declineButton}>
          <Button
            testID="visibility-settings-override-decline-button"
            accessibilityLabel={translate('visibility_settings_override_cancel_button')}
            text={onCancelButtonContent}
            onClick={onCancel}
            appearance="lined"
          />
        </div>
        <div>
          <Button
            autoFocus
            testID="visibility-settings-override-save-button"
            accessibilityLabel={onSaveButtonContent}
            text={onSaveButtonContent}
            appearance="filled"
            onClick={onSave}
          />
        </div>
      </div>
    </div>
  );

  return (
    <Modal
      format="s"
      isOpen={isModalOpen}
      onDismiss={closeModal}
      portal
      testID="visitor-permissions-confirmation-modal"
    >
      <ScrollViewWithBars
        header={VisitorPermissionConfirmationModalHeader}
        footer={VisitorPermissionConfirmationModalFooter}
      >
        <div css={body}>{content}</div>
      </ScrollViewWithBars>
    </Modal>
  );
}

interface Props {
  onSaveButtonContent: string;
  onCancelButtonContent: string;
  isModalOpen: boolean;
  setIsModalOpen: (close: boolean) => void;
  onSave: () => void;
  onCancel: () => void;
  heading: string;
  content: string;
}

export default VisitorPermissionConfirmationModal;

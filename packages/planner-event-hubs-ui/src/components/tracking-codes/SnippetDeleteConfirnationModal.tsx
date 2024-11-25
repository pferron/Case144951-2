import React, { Dispatch, SetStateAction } from 'react';
import Modal from '@cvent/carina/components/Modal';
import { Button } from '@cvent/carina/components/Button';
import { useTranslate } from 'nucleus-text';
import { useStyle } from '@hooks/useStyle';
import ScrollViewWithBars from '@cvent/carina/components/ScrollViewWithBars';
import { SnippetModalStyles } from '@components/tracking-codes/styles';
import { MODAL_ZINDEX } from '@components/constants';

interface Props {
  isOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<{ codeSnippetId: string | null; isRemoveModalOpen: boolean }>>;
  onRemove: (val: string) => void;
  snippetId: string;
}
function SnippetDeleteConfirmationModal({ isOpen, setIsModalOpen, onRemove, snippetId }: Props): JSX.Element {
  const { translate } = useTranslate();
  const styles = useStyle(SnippetModalStyles);
  const testId = 'snippet-delete-confirmation-modal';
  const onDelete = (): void => {
    onRemove(snippetId);
  };

  const onDismiss = (): void => {
    setIsModalOpen(prev => ({
      ...prev,
      isRemoveModalOpen: false
    }));
  };

  const header = (
    <div css={styles.headerTitleStyle}>
      {translate('tracking_code_delete_code_snippet_confirmation_modal_title_label')}
    </div>
  );

  const footer = (
    <div css={styles.buttonContainer}>
      <Button
        css={styles.saveButton}
        appearance="filled"
        onClick={onDelete}
        text={translate('tracking_code_delete_code_snippet_confirmation_modal_delete_label')}
        testID={`${testId}-delete-button`}
      />
      <Button
        appearance="ghost"
        onClick={onDismiss}
        text={translate('tracking_code_delete_code_snippet_confirmation_modal_cancel_button')}
        testID={`${testId}-cancel-button`}
      />
    </div>
  );

  return (
    <Modal
      format="s"
      isOpen={isOpen}
      testID={testId}
      onDismiss={onDismiss}
      zIndex={MODAL_ZINDEX}
      aria-label={translate('tracking_code_delete_code_snippet_confirmation_modal_title_label')}
      portal
      css={styles.modalStyle}
    >
      <div css={styles.bodyStyle}>
        <ScrollViewWithBars forceStickyFooter header={header} footer={footer}>
          <div>{translate('tracking_code_delete_code_snippet_confirmation_modal_body_text')}</div>
        </ScrollViewWithBars>
      </div>
    </Modal>
  );
}

export default SnippetDeleteConfirmationModal;

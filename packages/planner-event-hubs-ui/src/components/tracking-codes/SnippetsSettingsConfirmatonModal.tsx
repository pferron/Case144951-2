// MAUVE
/* eslint-disable */
import React, { Dispatch, SetStateAction } from 'react';
import Modal from '@cvent/carina/components/Modal';
import { Button } from '@cvent/carina/components/Button';
import { useTranslate } from 'nucleus-text';
import { useStyle } from '@hooks/useStyle';
import ScrollViewWithBars from '@cvent/carina/components/ScrollViewWithBars';
import { SnippetSettingsConfirmationModalStyles } from '@components/tracking-codes/styles';
import { MODAL_ZINDEX } from '@components/constants';
import { ConFigureSettingsProp } from '@components/tracking-codes/SelectCodeSnippetsModal';
import { ApplicableOn } from '@cvent/planner-event-hubs-model/types';

interface Props {
  isNewSnippetAdded: boolean;
  isOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  setSelectCodeSnippetModelOpen: (isOpen: boolean) => void;
  setSnippetSettingsModalIsOpen: (isOpen: boolean) => void;
  setSelected?: any;
  setConfigureSnippetSetting: Dispatch<SetStateAction<ConFigureSettingsProp>>;
}
function SnippetSettingsConfirmationModal({
  isNewSnippetAdded,
  isOpen,
  setIsModalOpen,
  setSelectCodeSnippetModelOpen,
  setSnippetSettingsModalIsOpen,
  setSelected,
  setConfigureSnippetSetting
}: Props): JSX.Element {
  const { translate } = useTranslate();
  const styles = useStyle(SnippetSettingsConfirmationModalStyles);
  const testId = 'snippet-settings-configure-confirmation';
  const onStay = (): void => {
    setIsModalOpen(false);
  };

  const onLeave = (): void => {
    setIsModalOpen(false);
    setSnippetSettingsModalIsOpen(false);
    if (isNewSnippetAdded) {
      setSelectCodeSnippetModelOpen(false);
      setSelected(null);
      setConfigureSnippetSetting({
        codeSnippetId: null,
        addToAllPages: false,
        addToSingleVideoPage: false,
        applicableOn: ApplicableOn.Initialization
      });
    }
  };

  const header = (
    <div css={styles.headerStyle}>
      <span css={styles.modalTitle}>
        {translate('tracking_code_configure_code_snippet_confirmation_modal_title_label')}
      </span>
    </div>
  );

  const footer = (
    <div>
      <div css={styles.buttonContainer}>
        <Button
          css={styles.saveButton}
          appearance="filled"
          onClick={onStay}
          aria-label={translate('tracking_code_configure_code_snippet_confirmation_modal_stay_button')}
          text={translate('tracking_code_configure_code_snippet_confirmation_modal_stay_button')}
          testID={`${testId}-save-button`}
        />
        <Button
          appearance="ghost"
          onClick={onLeave}
          aria-label={translate('tracking_code_configure_code_snippet_confirmation_modal_leave_button')}
          text={translate('tracking_code_configure_code_snippet_confirmation_modal_leave_button')}
          testID={`${testId}-cancel-button`}
        />
      </div>
    </div>
  );

  return (
    <Modal
      format="s"
      isOpen={isOpen}
      testID={testId}
      onDismiss={() => {
        setIsModalOpen(false);
      }}
      zIndex={MODAL_ZINDEX}
      aria-label={translate('tracking_code_configure_code_snippet_confirmation_modal_title_label')}
      portal
      css={styles.modalStyle}
    >
      <div css={styles.bodyStyle}>
        <ScrollViewWithBars forceStickyFooter header={header} footer={footer}>
          <div>{translate('tracking_code_configure_code_snippet_confirmation_modal_body_text')}</div>
        </ScrollViewWithBars>
      </div>
    </Modal>
  );
}

export default SnippetSettingsConfirmationModal;

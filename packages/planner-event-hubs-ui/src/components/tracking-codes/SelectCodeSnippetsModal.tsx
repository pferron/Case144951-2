import React, { Dispatch, SetStateAction, useState } from 'react';
import { Form } from '@cvent/carina/components/Forms';
import Modal from '@cvent/carina/components/Modal';
import { Button } from '@cvent/carina/components/Button';
import { XIcon } from '@cvent/carina/components/Icon';
import { useTranslate } from 'nucleus-text';
import { useStyle } from '@hooks/useStyle';
import ScrollViewWithBars from '@cvent/carina/components/ScrollViewWithBars';
import CodeSnippetsTable from '@components/tracking-codes/CodeSnippetsTable';
import { CodeSnippetsModalStyles } from '@components/tracking-codes/styles';
import SnippetSettingsModal from '@components/tracking-codes/SnippetsSettingsModal';
import { MODAL_ZINDEX } from '@components/constants';
import { AccountCodeSnippet, ApplicableOn, CodeSnippet } from '@cvent/planner-event-hubs-model/types';

export interface ConFigureSettingsProp {
  codeSnippetId: string;
  addToAllPages: boolean;
  addToSingleVideoPage: boolean;
  applicableOn: ApplicableOn;
}

interface Props {
  isOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  testId: string;
  codeSnippetList: AccountCodeSnippet[];
  onSave: (val: CodeSnippet) => void;
  setConfigureSnippetSetting: Dispatch<SetStateAction<ConFigureSettingsProp>>;
  configureSnippetSetting: ConFigureSettingsProp;
}
function SelectCodeSnippetsModal({
  isOpen,
  setIsModalOpen,
  testId,
  codeSnippetList,
  onSave,
  setConfigureSnippetSetting,
  configureSnippetSetting
}: Props): JSX.Element {
  const { translate } = useTranslate();
  const [selected, setSelected] = useState(null);
  const styles = useStyle(CodeSnippetsModalStyles);
  const [snippetSettingsModalIsOpen, setSnippetSettingsModalIsOpen] = useState(false);

  const codeSnippetMap: Map<string, AccountCodeSnippet> = new Map(codeSnippetList.map(i => [i.codeSnippetId, i]));
  const codeSnippetName = (selected && codeSnippetMap.get(selected)?.codeSnippetName) || '';

  const onNext = (): void => {
    setSnippetSettingsModalIsOpen(true);
  };

  const selectCodeSnippetsModalHeader: JSX.Element = (
    <div css={styles.headerStyle}>
      <h2 css={styles.modalTitle}>{translate('tracking_code_select_code_snippets_modal_title')}</h2>
      <Button
        css={styles.dismissButtonStyle}
        appearance="ghost"
        icon={XIcon}
        aria-label={translate('close_modal_button_label')}
        onClick={() => {
          setIsModalOpen(false);
          setSelected(null);
        }}
        variant="neutral"
        testID={`${testId}-cross-button`}
      />
    </div>
  );

  const selectCodeSnippetsModalFooter: JSX.Element = (
    <div>
      <div css={styles.buttonContainer}>
        <Button
          css={styles.nextButton}
          appearance="filled"
          disabled={!selected}
          onClick={onNext}
          aria-label={translate('tracking_code_select_code_snippets_modal_next_button')}
          text={translate('tracking_code_select_code_snippets_modal_next_button')}
          testID={`${testId}-next-button`}
        />
        <Button
          appearance="ghost"
          onClick={() => {
            setIsModalOpen(false);
            setSelected(null);
          }}
          aria-label={translate('tracking_code_select_code_snippets_modal_cancel_button')}
          text={translate('tracking_code_select_code_snippets_modal_cancel_button')}
          testID={`${testId}-cancel-button`}
        />
      </div>
    </div>
  );

  return (
    <div>
      {snippetSettingsModalIsOpen && (
        <SnippetSettingsModal
          isNewSnippetAdded={isOpen}
          setSelected={setSelected}
          snippetSettingsModalIsOpen={snippetSettingsModalIsOpen}
          setSnippetSettingsModalIsOpen={setSnippetSettingsModalIsOpen}
          testId="snippet-settings-modal"
          codeSnippetName={codeSnippetName}
          selectedSnippet={selected}
          setSelectCodeSnippetModelOpen={setIsModalOpen}
          onSave={onSave}
          setConfigureSnippetSetting={setConfigureSnippetSetting}
          configureSnippetSetting={configureSnippetSetting}
        />
      )}
      <Modal
        format="m"
        isOpen={isOpen && !snippetSettingsModalIsOpen}
        testID={testId}
        onDismiss={() => {
          setIsModalOpen(false);
        }}
        aria-label={translate('tracking_code_select_code_snippets_modal_title')}
        css={styles.modalStyle}
        zIndex={MODAL_ZINDEX}
      >
        <ScrollViewWithBars
          forceStickyFooter
          header={selectCodeSnippetsModalHeader}
          footer={selectCodeSnippetsModalFooter}
        >
          <Form>
            <div css={styles.tableContainer}>
              <CodeSnippetsTable dataList={codeSnippetList} selected={selected} setSelected={setSelected} />
            </div>
          </Form>
        </ScrollViewWithBars>
      </Modal>
    </div>
  );
}

export default SelectCodeSnippetsModal;

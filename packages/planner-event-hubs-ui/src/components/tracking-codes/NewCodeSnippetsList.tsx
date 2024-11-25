// MAUVE
/* eslint-disable */
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { basicHeadingRenderer, TableProps, useTable } from '@cvent/carina/components/Table';
import { useTranslate } from 'nucleus-text';
import { useTheme } from '@cvent/carina/components/ThemeProvider/useTheme';
import Button from '@cvent/carina/components/Button';
import { TrashIcon, EditNewIcon } from '@cvent/carina/components/Icon';
import { useStyle } from '@hooks/useStyle';
import { CodeSnippetsStyle, TrackingCodesStyle } from '@components/tracking-codes/styles';
import { HeadingRenderer } from '@cvent/carina/components/Table/TableColumn';
import SelectCodeSnippetsModal from '@components/tracking-codes/SelectCodeSnippetsModal';
import { ApplicableOn, CodeSnippet, AccountCodeSnippet } from '@cvent/planner-event-hubs-model/types';
import { HubCodeSnippet } from '@components/tracking-codes/TrackingCodes';
import { MAX_ROWS_IN_CODE_SNIPPET_TABLE } from '@utils/constants';
import { TextLink } from '@cvent/carina/components/TextLink';
import ViewCodeSnippetModal from '@components/tracking-codes/ViewCodeSnippetModal';
import SnippetSettingsModal from '@components/tracking-codes/SnippetsSettingsModal';
import CardContainer from '@components/common/CardContainer';
import SnippetDeleteConfirmationModal from '@components/tracking-codes/SnippetDeleteConfirnationModal';
import { HelpCirclePopper } from '@components/tracking-codes/HelpCirclePopper';
import { Popper } from '@cvent/carina/components/Popper';

interface Props {
  dataList: HubCodeSnippet[];
  accountCodeSnippets: AccountCodeSnippet[];
  codeSnippets: HubCodeSnippet[];
  onSave: (val: CodeSnippet) => void;
  onUpdate: (val: CodeSnippet) => void;
  onRemove: (val: string) => void;
  onNext: () => void;
  isNext: boolean;
  onPrevious: () => void;
  isPrevious: boolean;
  allowGoogleAnalytics?: boolean;
}

function NewCodeSnippetsList({
  dataList,
  accountCodeSnippets,
  codeSnippets,
  onSave,
  onUpdate,
  onRemove,
  onNext,
  isNext,
  onPrevious,
  isPrevious,
  allowGoogleAnalytics
}: Props): React.JSX.Element {
  const theme = useTheme();
  const { translate } = useTranslate();
  const styles = useStyle(CodeSnippetsStyle);
  const { headerContainer, descriptionStyle } = useStyle(TrackingCodesStyle);
  const [isCodeSnippetsModalOpen, setIsCodeSnippetsModalOpen] = useState(false);
  const [codeSnippetDeleteConfirmationModalState, setCodeSnippetDeleteConfirmationModalState] = useState({
    codeSnippetId: null,
    isRemoveModalOpen: false
  });
  const triggerRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const handleOpen = () => setIsOpen(prevIsOpen => !prevIsOpen);

  const availableAccountCodeSnippets = accountCodeSnippets.filter(elem =>
    codeSnippets.every(ele => ele.codeSnippetId !== elem.codeSnippetId)
  );

  const [snippetSettingsModalIsOpen, setSnippetSettingsModalIsOpen] = useState(false);
  const codeSnippetMap = useMemo(() => {
    const snippetMap = new Map<string, HubCodeSnippet>();
    codeSnippets.forEach(codeSnippet => snippetMap.set(codeSnippet.codeSnippetId, codeSnippet));
    return snippetMap;
  }, [codeSnippets]);

  const [viewCodeSnippetModalOpen, setViewCodeSnippetModalOpen] = useState({
    codeSnippetId: null,
    isViewModalOpen: false
  });
  const [configureSnippetSetting, setConfigureSnippetSetting] = useState({
    codeSnippetId: null,
    addToAllPages: true,
    addToSingleVideoPage: false,
    applicableOn: ApplicableOn.Initialization
  });
  const disableAddCodeSnippetButton = availableAccountCodeSnippets.length === 0;
  const codeSnippetName = codeSnippetMap.get(configureSnippetSetting.codeSnippetId)?.name || '';

  // Table row data must include a rowName, used to manage state of rows internally
  const tableData = dataList.map(data => ({
    ...data,
    rowName: `${data.codeSnippetId}`
  }));

  const [Table, TableColumn] = useTable({ data: tableData });

  const cellHeadingRenderer: HeadingRenderer = (_heading, headingProps) => (
    <div css={styles.disableCodeSnippetsStyle}>
      {basicHeadingRenderer(translate('code_snippets_table_header_disable_code_snippets'), headingProps)}
      <div css={styles.popOverContainer}>
        <HelpCirclePopper
          testID="disable-code-snippets-popper-id"
          helpText={translate('disable_code_snippets_popover_text')}
          accessibilityLabel={translate('code_snippets_table_header_disable_code_snippets')}
          preventOverflow={false}
          placement="left-start"
          isFixed
        />
      </div>
    </div>
  );

  const codeSnippetActions: TableProps<unknown>['actions'] = useCallback(
    rowData => [
      {
        label: translate('edit_code_snippet_button_text'),
        onClick: () => {
          setConfigureSnippetSetting({
            codeSnippetId: rowData?.rowName,
            addToAllPages: codeSnippetMap.get(rowData?.rowName)?.addToAllPages,
            addToSingleVideoPage: codeSnippetMap.get(rowData?.rowName)?.addToSingleVideoPage,
            applicableOn:
              codeSnippetMap.get(rowData?.rowName)?.applicableOn === ApplicableOn.Initialization
                ? ApplicableOn.Initialization
                : ApplicableOn.AllPages
          });
          setSnippetSettingsModalIsOpen(true);
        },
        icon: EditNewIcon
      },
      {
        label: translate('delete_code_snippet_button_text'),
        onClick: () => {
          setCodeSnippetDeleteConfirmationModalState({
            codeSnippetId: rowData?.rowName,
            isRemoveModalOpen: true
          });
        },
        icon: TrashIcon
      }
    ],
    [translate, codeSnippetMap]
  );

  return (
    <>
      <SnippetDeleteConfirmationModal
        setIsModalOpen={setCodeSnippetDeleteConfirmationModalState}
        isOpen={codeSnippetDeleteConfirmationModalState.isRemoveModalOpen}
        onRemove={onRemove}
        snippetId={codeSnippetDeleteConfirmationModalState.codeSnippetId}
      />
      <ViewCodeSnippetModal
        codeSnippetId={viewCodeSnippetModalOpen.codeSnippetId}
        codeSnippets={codeSnippets}
        viewCodeSnippetModalOpen={viewCodeSnippetModalOpen.isViewModalOpen}
        setViewCodeSnippetModalOpen={setViewCodeSnippetModalOpen}
        testId="view-code-snippet-modal"
        setSnippetSettingsModalIsOpen={setSnippetSettingsModalIsOpen}
        setConfigureSnippetSetting={setConfigureSnippetSetting}
      />
      {snippetSettingsModalIsOpen && (
        <SnippetSettingsModal
          isNewSnippetAdded={false}
          snippetSettingsModalIsOpen={snippetSettingsModalIsOpen}
          setSnippetSettingsModalIsOpen={setSnippetSettingsModalIsOpen}
          testId="snippet-settings-modal"
          codeSnippetName={codeSnippetName}
          selectedSnippet={configureSnippetSetting.codeSnippetId}
          onSave={onUpdate}
          setConfigureSnippetSetting={setConfigureSnippetSetting}
          configureSnippetSetting={configureSnippetSetting}
        />
      )}
      <div css={[styles.bodyListStyle, { marginTop: allowGoogleAnalytics ? 0 : '1.5rem' }]}>
        <CardContainer
          testID="code-snippets"
          disabled={false}
          saveAccessibilitylabel={translate('code_snippets_save_button_label')}
          cancelAccessibilitylabel={translate('edit_code_snippets_cancel_button_label')}
          editAccessibilityLabel={translate('code_snippets_edit_button_label')}
        >
          <h2 css={headerContainer}>{translate('add_code_snippets_text')}</h2>
          <div css={descriptionStyle}>{translate('code_snippet_description')}</div>
          <div>
            <div css={styles.popperStyle}>
              <span
                id="code-snippets-help-circle-icon"
                role="button"
                aria-label={translate('add_code_snippets_text')}
                ref={triggerRef}
                onClick={() => {
                  if (disableAddCodeSnippetButton) {
                    handleOpen();
                  }
                }}
              >
                <Button
                  text={translate('add_code_snippets_button_text')}
                  testID="add-code-snippets-button"
                  accessibilityLabel={translate('add_code_snippets_button_label')}
                  size="m"
                  css={{
                    marginBottom: '1rem'
                  }}
                  autoFocus
                  onClick={(): void => {
                    setIsCodeSnippetsModalOpen(true);
                  }}
                  disabled={disableAddCodeSnippetButton}
                  onMouseOver={disableAddCodeSnippetButton ? () => setIsOpen(true) : null}
                  onMouseLeave={disableAddCodeSnippetButton ? () => setIsOpen(false) : null}
                  onMouseOutCapture={disableAddCodeSnippetButton ? () => setIsOpen(false) : null}
                  onFocus={disableAddCodeSnippetButton ? () => setIsOpen(true) : null}
                  onBlur={disableAddCodeSnippetButton ? () => setIsOpen(true) : null}
                />
              </span>
              <Popper
                testID="code-snippets-popper"
                css={{ borderRadius: '0.625rem', marginTop: '1rem' }}
                placement="bottom-start"
                hasShadow
                isOpen={isOpen}
                triggerRef={triggerRef}
                preventOverflow={false}
              >
                <div css={styles.popperBodyStyles}>
                  <div css={styles.popoverBoldStyle}>{translate('disable_code_snippets_popover_heading')}</div>
                  <div>{translate('disable_code_snippets_popover_explanation_text')}</div>
                </div>
              </Popper>
            </div>
          </div>
          <SelectCodeSnippetsModal
            isOpen={isCodeSnippetsModalOpen}
            setIsModalOpen={setIsCodeSnippetsModalOpen}
            testId="select-code-snippet-modal"
            codeSnippetList={availableAccountCodeSnippets}
            onSave={onSave}
            setConfigureSnippetSetting={setConfigureSnippetSetting}
            configureSnippetSetting={configureSnippetSetting}
          />
          <Table
            empty={
              codeSnippets.length === 0 ? (
                <div css={styles.noCodeSnippetsTextStyle}>{translate('zero_code_snippets_text')}</div>
              ) : null
            }
            testID="code-snippet-list-table"
            staticActionsMenu
            maxRowsPerPage={MAX_ROWS_IN_CODE_SNIPPET_TABLE}
            sortColumn="name"
            actions={codeSnippetActions}
            nextPageLabel={translate('code_snippet_next_page_label')}
            previousPageLabel={translate('code_snippet_previous_page_label')}
            sortDirection="ASC"
            onNextPageClick={onNext}
            onPreviousPageClick={onPrevious}
            alwaysShowPageControls={isNext || isPrevious}
            nextPageButtonIsInteractive={isNext}
            previousPageButtonIsInteractive={isPrevious}
          >
            <TableColumn
              name="name"
              heading={translate('code_snippets_table_header_name')}
              sortable
              cellRenderer={(cellData, data) => (
                <div css={{ padding: '0.625rem' }}>
                  <TextLink
                    onClick={() => {
                      setViewCodeSnippetModalOpen({
                        codeSnippetId: data.rowData.codeSnippetId,
                        isViewModalOpen: true
                      });
                    }}
                    onKeyPress={(event): void => {
                      if (event.code === 'Enter' || event.code === 'Space') {
                        setViewCodeSnippetModalOpen({
                          codeSnippetId: data.rowData.codeSnippetId,
                          isViewModalOpen: true
                        });
                      }
                    }}
                  >
                    {cellData}
                  </TextLink>
                </div>
              )}
            />
            <TableColumn name="dataTagCode" heading={translate('code_snippets_table_header_datatag_code')} sortable />
            <TableColumn name="status" heading={translate('code_snippets_table_header_status')} sortable />
            <TableColumn name="disableCodeSnippets" headingRenderer={cellHeadingRenderer} sortable />
          </Table>
        </CardContainer>
      </div>
    </>
  );
}

export default NewCodeSnippetsList;

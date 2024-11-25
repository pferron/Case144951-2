// MAUVE
/* eslint-disable */
import React, { useCallback, useMemo, useState } from 'react';
import { basicHeadingRenderer, TableProps, useTable } from '@cvent/carina/components/Table';
import { useTranslate } from 'nucleus-text';
import { useTheme } from '@cvent/carina/components/ThemeProvider/useTheme';
import HelpCircleIcon from '@cvent/carina/components/Icon/HelpCircle';
import Button from '@cvent/carina/components/Button';
import { Popover } from '@cvent/carina/components/Popover';
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
  editCodeSnippet: boolean;
  setEditCodeSnippet: (val: boolean) => void;
  cardDisabled: boolean;
  allowGoogleAnalytics?: boolean;
}

const CodeSnippetsList = ({
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
  editCodeSnippet,
  setEditCodeSnippet,
  cardDisabled,
  allowGoogleAnalytics
}: Props): JSX.Element => {
  const theme = useTheme();
  const { translate } = useTranslate();
  const styles = useStyle(CodeSnippetsStyle);
  const { headerContainer, descriptionStyle } = useStyle(TrackingCodesStyle);
  const [isCodeSnippetsModalOpen, setIsCodeSnippetsModalOpen] = useState(false);
  const [codeSnippetDeleteConfirmationModalState, setCodeSnippetDeleteConfirmationModalState] = useState({
    codeSnippetId: null,
    isRemoveModalOpen: false
  });

  const availableAccountCodeSnippets = accountCodeSnippets.filter(elem => {
    return codeSnippets.every(ele => {
      return ele.codeSnippetId !== elem.codeSnippetId;
    });
  });

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

  const cellHeadingRenderer: HeadingRenderer = (_heading, headingProps) => {
    return (
      <div css={styles.disableCodeSnippetsStyle}>
        {basicHeadingRenderer(translate('code_snippets_table_header_disable_code_snippets'), headingProps)}
        <div css={styles.popOverContainer}>
          <Popover
            testID={'disable-code-snippets-popover-id'}
            placement="end-top"
            accessible
            portal
            accessibilityLabel={translate('code_snippets_table_header_disable_code_snippets')}
            trigger={({ toggleOpen, isOpen, closePopover }): JSX.Element => (
              <span
                id={'destination_type_help_circle_icon'}
                role="tooltip"
                tabIndex={0}
                onFocus={isOpen ? undefined : toggleOpen}
                onBlur={isOpen ? closePopover : undefined}
                onMouseOver={isOpen ? undefined : toggleOpen}
                onMouseLeave={isOpen ? closePopover : undefined}
                onClick={toggleOpen}
                css={styles.popContentStyle}
              >
                <HelpCircleIcon size="s" color={theme.font.color.soft} />
              </span>
            )}
          >
            <p
              id={'disable_code_snippets_popover'}
              css={[{ margin: '0rem', maxWidth: '18rem' }, cardDisabled ? styles.disabledCard : null]}
            >
              {translate('disable_code_snippets_popover_text')}
            </p>
          </Popover>
        </div>
      </div>
    );
  };

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

  const onEdit = (): void => {
    setEditCodeSnippet(true);
  };

  const onCancelOrSave = (): void => {
    setEditCodeSnippet(false);
  };

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
        testId={'view-code-snippet-modal'}
        setSnippetSettingsModalIsOpen={setSnippetSettingsModalIsOpen}
        setConfigureSnippetSetting={setConfigureSnippetSetting}
      />
      {snippetSettingsModalIsOpen && (
        <SnippetSettingsModal
          isNewSnippetAdded={false}
          snippetSettingsModalIsOpen={snippetSettingsModalIsOpen}
          setSnippetSettingsModalIsOpen={setSnippetSettingsModalIsOpen}
          testId={'snippet-settings-modal'}
          codeSnippetName={codeSnippetName}
          selectedSnippet={configureSnippetSetting.codeSnippetId}
          onSave={onUpdate}
          setConfigureSnippetSetting={setConfigureSnippetSetting}
          configureSnippetSetting={configureSnippetSetting}
        />
      )}
      <div css={[styles.bodyListStyle, { marginTop: allowGoogleAnalytics ? 0 : '1.5rem' }]}>
        <CardContainer
          testID={'code-snippets'}
          onCancel={onCancelOrSave}
          onSubmit={onCancelOrSave}
          onEdit={onEdit}
          disabled={cardDisabled}
          enabled={editCodeSnippet}
          saveAccessibilitylabel={translate('code_snippets_save_button_label')}
          cancelAccessibilitylabel={translate('edit_code_snippets_cancel_button_label')}
          editAccessibilityLabel={translate('code_snippets_edit_button_label')}
        >
          <h2 css={headerContainer}>{translate('add_code_snippets_text')}</h2>
          <div css={descriptionStyle}>{translate('code_snippet_description')}</div>
          {editCodeSnippet && (
            <div>
              <Popover
                testID={'add-code-snippets-button-popover-id'}
                placement="bottom-start"
                accessible
                portal
                accessibilityLabel={translate('disable_code_snippets_popover_heading')}
                overflowHidden={false}
                trigger={({ toggleOpen, closePopover }): JSX.Element => (
                  <div
                    css={{ maxWidth: '16rem' }}
                    onClick={() => {
                      if (disableAddCodeSnippetButton) {
                        toggleOpen();
                      }
                    }}
                  >
                    <Button
                      text={translate('add_code_snippets_button_text')}
                      testID={'add-code-snippets-button'}
                      accessibilityLabel={translate('add_code_snippets_button_label')}
                      size={'m'}
                      css={{
                        marginBottom: '1rem'
                      }}
                      autoFocus
                      onClick={(): void => {
                        setIsCodeSnippetsModalOpen(true);
                      }}
                      disabled={disableAddCodeSnippetButton}
                      onMouseOver={disableAddCodeSnippetButton ? toggleOpen : null}
                      onMouseLeave={disableAddCodeSnippetButton ? closePopover : null}
                      onMouseOutCapture={disableAddCodeSnippetButton ? closePopover : null}
                      onFocus={disableAddCodeSnippetButton ? toggleOpen : null}
                      onBlur={disableAddCodeSnippetButton ? toggleOpen : null}
                    />
                  </div>
                )}
              >
                <div css={styles.popoverBoldStyle}>{translate('disable_code_snippets_popover_heading')}</div>
                <p id={'disable_code_snippets_button_popover'} style={{ margin: '0rem', maxWidth: '15rem' }}>
                  {translate('disable_code_snippets_popover_explanation_text')}
                </p>
              </Popover>
            </div>
          )}
          <SelectCodeSnippetsModal
            isOpen={isCodeSnippetsModalOpen}
            setIsModalOpen={setIsCodeSnippetsModalOpen}
            testId={'select-code-snippet-modal'}
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
            testID={'code-snippet-list-table'}
            staticActionsMenu
            maxRowsPerPage={MAX_ROWS_IN_CODE_SNIPPET_TABLE}
            sortColumn={'name'}
            actions={codeSnippetActions}
            nextPageLabel={translate('code_snippet_next_page_label')}
            previousPageLabel={translate('code_snippet_previous_page_label')}
            sortDirection={'ASC'}
            onNextPageClick={onNext}
            onPreviousPageClick={onPrevious}
            alwaysShowPageControls={isNext || isPrevious}
            nextPageButtonIsInteractive={!cardDisabled && isNext}
            previousPageButtonIsInteractive={!cardDisabled && isPrevious}
          >
            <TableColumn
              name="name"
              heading={translate('code_snippets_table_header_name')}
              sortable
              cellRenderer={(cellData, data) => {
                return (
                  <div css={{ padding: '0.625rem' }}>
                    <TextLink
                      onClick={() => {
                        if (!cardDisabled) {
                          setViewCodeSnippetModalOpen({
                            codeSnippetId: data.rowData.codeSnippetId,
                            isViewModalOpen: true
                          });
                        }
                      }}
                      onKeyPress={(event): void => {
                        if (!cardDisabled && (event.code === 'Enter' || event.code === 'Space')) {
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
                );
              }}
            />
            <TableColumn name="dataTagCode" heading={translate('code_snippets_table_header_datatag_code')} sortable />
            <TableColumn name="status" heading={translate('code_snippets_table_header_status')} sortable />
            <TableColumn name="disableCodeSnippets" headingRenderer={cellHeadingRenderer} sortable />
          </Table>
        </CardContainer>
      </div>
    </>
  );
};

export default CodeSnippetsList;

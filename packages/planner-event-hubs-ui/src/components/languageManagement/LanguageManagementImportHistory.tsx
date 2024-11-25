import React from 'react';
import { injectTestId } from '@cvent/nucleus-test-automation';
import { FileImportHistory } from '@cvent/planner-event-hubs-model/types';
import { Row } from '@cvent/carina/components/Row';
import { Col } from '@cvent/carina/components/Col';
import DismissButton from '@cvent/carina/components/ScrollViewWithBars/DismissButton';
import { Button } from '@cvent/carina/components/Button';
import { useTranslate } from 'nucleus-text';
import { useStyle } from '@hooks/useStyle';
import { ConfirmationModalStyles, TableStyles } from '@components/common/style';
import ScrollViewWithBars from '@cvent/carina/components/ScrollViewWithBars/ScrollViewWithBars';
import { LoadingSpinner } from '@cvent/carina/components/LoadingSpinner';
import Table, { TableColumn } from '@cvent/carina/components/Table';
import { formatDateTimeStamp } from '@utils/dateTimeUtils';
import { StatusLabel } from '@cvent/carina/components/StatusLabel';
import { ImportStatus } from './LanguageManagementConstants';

type LanguageManagementImportHistoryProps = {
  importHistory: FileImportHistory[];
  setOpenImportHistory: (open: boolean) => void;
  setDisplaySuccess: (val: boolean) => void;
  setSuccessMessage: React.Dispatch<React.SetStateAction<React.ReactNode>>;
  loading: boolean;
};

function LanguageManagementImportHistory({
  importHistory,
  setOpenImportHistory,
  setDisplaySuccess,
  setSuccessMessage,
  loading
}: LanguageManagementImportHistoryProps): React.JSX.Element {
  const { modalHeaderStyles } = useStyle(ConfirmationModalStyles);
  const { emptyState } = useStyle(TableStyles);
  const { locale, translate } = useTranslate();

  const closeImportHistory = () => {
    setOpenImportHistory(false);
    setDisplaySuccess(false);
    setSuccessMessage('');
  };

  const ImportHistoryHeader: React.JSX.Element = (
    <Row margin={{ bottom: 16 }}>
      <Col width="content" padding={0}>
        <div css={modalHeaderStyles} {...injectTestId('import-history-modal-header')}>
          {translate('language_management_import_history_modal_header')}
        </div>
      </Col>
      <Col width="fill" flex={{ display: 'flex', justifyContent: 'flex-end' }} padding={0}>
        <DismissButton
          aria-label={translate('language_management_import_history_modal_cancel_button_accessibility_label')}
          onClick={(): void => closeImportHistory()}
        />
      </Col>
    </Row>
  );

  const ImportHistoryFooter: React.JSX.Element = (
    <Row margin={{ top: 16, bottom: 40 }}>
      <Col flex={{ display: 'flex', justifyContent: 'flex-end' }} padding={0}>
        <Button
          appearance="filled"
          text={translate('language_management_import_history_modal_close_button_label')}
          onClick={(): void => closeImportHistory()}
          testID="import-history-modal-close-button"
        />
      </Col>
    </Row>
  );

  const getEmptyState = (): React.JSX.Element => (
    <div css={emptyState}>{translate('language_management_import_history_table_empty_state')}</div>
  );

  // HUB-141431: Implement download functionality
  // const getFailedRecordsButton = (failedRecords: number): React.JSX.Element => {
  //   if (failedRecords === 0) {
  //     return <span>{failedRecords}</span>;
  //   }
  //   return (
  //     <TextLink
  //       testID="language-management-import-history-download-skipped"
  //       size="m"
  //       role="button"
  //       aria-label={translate('language_management_import_history_download_skipped_rows_link', {
  //         count: failedRecords.toString()
  //       })}
  //       // TODO: implement download functionality with HUB-141431
  //       onClick={() => {}}
  //     >
  //       <span css={{ marginRight: 8 }}>{failedRecords}</span>
  //       <DownloadIcon />
  //     </TextLink>
  //   );
  // };

  const getStatusLabel = status => {
    switch (status) {
      case ImportStatus.PROCESSING:
        return (
          <StatusLabel variant="neutral">
            {translate('language_management_import_history_status_in_progress')}
          </StatusLabel>
        );
      case ImportStatus.COMPLETE:
        return (
          <StatusLabel variant="positive">{translate('language_management_import_history_status_success')}</StatusLabel>
        );
      default:
        return (
          <StatusLabel variant="negative">{translate('language_management_import_history_status_failed')}</StatusLabel>
        );
    }
  };

  const tableData = importHistory?.map((history, index) => ({ ...history, rowName: `${index}` })) || [];

  return (
    <div css={{ padding: '1.5rem' }}>
      <ScrollViewWithBars header={ImportHistoryHeader} footer={ImportHistoryFooter}>
        {loading ? (
          <LoadingSpinner size="m" aria-label="loading" />
        ) : (
          <Table
            data={tableData || []}
            {...injectTestId('language-management-import-history-table')}
            empty={tableData.length === 0 ? getEmptyState() : null}
            striped
          >
            <TableColumn
              heading={translate('language_management_import_history_uploaded_on_column_label')}
              name="createdAt"
              cellRenderer={(...[, { rowData }]) => formatDateTimeStamp(locale, new Date(rowData.createdAt))}
            />
            <TableColumn
              heading={translate('language_management_import_history_source_column_label')}
              name="fileName"
            />
            <TableColumn
              heading={translate('language_management_import_history_uploaded_by_column_label')}
              name="createdBy"
            />
            <TableColumn
              heading={translate('language_management_import_history_status_column_label')}
              name="status"
              cellRenderer={(...[, { rowData }]) => getStatusLabel(rowData.status)}
            />
            <TableColumn
              heading={translate('language_management_import_history_skipped_rows_column_label')}
              name="errorCount"
            />
            <TableColumn
              heading={translate('language_management_import_history_successful_rows_column_label')}
              name="successCount"
            />
          </Table>
        )}
      </ScrollViewWithBars>
    </div>
  );
}

export default LanguageManagementImportHistory;

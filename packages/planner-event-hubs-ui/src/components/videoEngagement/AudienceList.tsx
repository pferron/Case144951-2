import React, { useCallback, useState } from 'react';
import { Table, TableColumn } from '@cvent/carina/components/Table';
import { useTranslate } from 'nucleus-text';
import { useStyle } from '@hooks/useStyle';
import { VideoTableStyle } from '@components/videoEngagement/style';
import { ASC, DESC, FIRST_NAME, LAST_NAME } from '@utils/constants';
import { formatDuration } from '@components/videoEngagement/DateRangeOptions';
import { MemberVideoWatchData } from '@cvent/planner-event-hubs-model/src/types';

function AudienceList({ audienceList, onSort }: Props): React.JSX.Element {
  const { translate } = useTranslate();
  const { normalText, roundedTable } = useStyle(VideoTableStyle);
  const [sortDirection, setSortDirection] = useState<typeof ASC | typeof DESC | undefined>(ASC);
  const [sortColumn, setSortColumn] = useState<typeof FIRST_NAME | typeof LAST_NAME>(LAST_NAME);
  const videoData = audienceList.map(audience => ({
    ...audience,
    rowName: audience.id
  }));

  const onColumnClick = useCallback(
    (columnName: typeof FIRST_NAME | typeof LAST_NAME) => {
      let newSortDirection: typeof ASC | typeof DESC | undefined;
      if (columnName === sortColumn) {
        newSortDirection = sortDirection === ASC ? DESC : ASC;
      } else {
        newSortDirection = ASC;
      }
      onSort(columnName, newSortDirection);

      setSortColumn(columnName);
      setSortDirection(newSortDirection);
    },
    [onSort, sortColumn, sortDirection]
  );

  const firstNameColumnRenderer = (_cellData, { rowData }): JSX.Element => (
    <p css={normalText} data-dd-privacy="mask">
      {rowData.firstName || '-'}
    </p>
  );

  const lastNameColumnRenderer = (_cellData, { rowData }): JSX.Element => (
    <p css={normalText} data-dd-privacy="mask">
      {rowData.lastName || '-'}
    </p>
  );

  const emailColumnRenderer = (_cellData, { rowData }): JSX.Element => (
    <p css={normalText} data-dd-privacy="mask">
      {rowData.email || '-'}
    </p>
  );

  const watchPercentageColumnRenderer = (_cellData, { rowData }): JSX.Element => (
    <p css={normalText} data-dd-privacy="mask">
      {rowData.percentage ? `${Math.round(rowData.percentage * 100) / 100}%` : '-'}
    </p>
  );

  const durationColumnRenderer = (_cellData, { rowData }): JSX.Element => (
    <p css={normalText} data-dd-privacy="mask">
      {rowData.duration ? formatDuration(rowData.duration) : '-'}
    </p>
  );

  return (
    <Table
      data={videoData}
      striped
      css={roundedTable}
      externallySorted
      testID="audience_list_table"
      sortDirection={sortDirection}
      sortColumn={sortColumn}
      onColumnClick={onColumnClick}
    >
      <TableColumn
        name="firstName"
        heading={translate('audience_list_first_name')}
        cellRenderer={firstNameColumnRenderer}
        sortable
      />
      <TableColumn
        name="lastName"
        heading={translate('audience_list_last_name')}
        hideWhenCollapsed
        cellRenderer={lastNameColumnRenderer}
        sortable
      />
      <TableColumn
        name="email"
        heading={translate('audience_list_email')}
        hideWhenCollapsed
        cellRenderer={emailColumnRenderer}
      />
      <TableColumn
        name="duration"
        heading={translate('audience_list_watch_duration')}
        hideWhenCollapsed
        cellRenderer={durationColumnRenderer}
      />
      <TableColumn
        name="percentage"
        heading={translate('audience_list_watch_percentage')}
        hideWhenCollapsed
        cellRenderer={watchPercentageColumnRenderer}
      />
    </Table>
  );
}

interface Props {
  audienceList: MemberVideoWatchData[];
  onSort: (sortColumn: typeof FIRST_NAME | typeof LAST_NAME, sortOrder: typeof ASC | typeof DESC | undefined) => void;
}

export default AudienceList;

// MAUVE
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useEffect, useState } from 'react';
import { INDETERMINATE, useTable } from '@cvent/carina/components/Table';
import { MAX_ROWS_IN_CONTACT_GROUP_TYPE_TABLE } from '@utils/constants';
import { ContactData, ContactGroupData, ContactTypesData } from '@cvent/planner-event-hubs-model/types';

interface Props {
  dataList: Array<ContactData | ContactGroupData | ContactTypesData>;
  selected: Array<string>;
  setSelected: (selectContacts: Array<string>) => void;
  testId: string;
  tableHeading: string;
  onNext: () => void;
  isNext: boolean;
  onPrevious: () => void;
  isPrevious: boolean;
  tableColumnName: string;
  cellRender: (_cellData: any, { rowData }: any) => JSX.Element;
  emailRender?: (_cellData: any, { rowData }: any) => JSX.Element;
  tableColumnEmail?: string;
  setIsPageEdited: (isPageEdited: boolean) => void;
}

function ContactsTable({
  dataList,
  selected,
  setSelected,
  testId,
  tableHeading,
  onNext,
  isNext,
  onPrevious,
  isPrevious,
  tableColumnName,
  cellRender,
  emailRender,
  tableColumnEmail,
  setIsPageEdited
}: Props): JSX.Element {
  const [globalSelect, setGlobalSelect] = useState<boolean | typeof INDETERMINATE>(false);
  const tableData = dataList.map(contact => ({
    ...contact,
    rowName: contact.id
  }));
  useEffect(() => {
    let globalSelectValue = false;
    let allSelected = true;
    tableData.forEach(contact => {
      if (selected.indexOf(contact.rowName) >= 0) {
        globalSelectValue = true;
      } else {
        allSelected = false;
      }
    });
    if (globalSelectValue && allSelected) {
      setGlobalSelect(true);
    } else if (globalSelectValue && !allSelected) {
      setGlobalSelect(INDETERMINATE);
    } else {
      setGlobalSelect(false);
    }
  }, [selected, tableData, dataList]);

  const onSelectCallback = useCallback(
    (rowName, { isSelected }) => {
      if (isSelected) {
        setSelected(selected.filter(selectedRowName => selectedRowName !== rowName));
      } else {
        setSelected([...selected, rowName]);
      }
      setIsPageEdited(true);
    },
    [selected, setIsPageEdited, setSelected]
  );

  const handleMultiSelectAction = useCallback(
    ({ rowName }) => {
      setSelected([rowName]);
    },
    [setSelected]
  );
  const handleGlobalSelect = useCallback(
    ({ visibleRowNames, globalSelectIndicator }) => {
      if (globalSelectIndicator === INDETERMINATE || globalSelectIndicator === true) {
        setSelected(selected.filter(contact => visibleRowNames.indexOf(contact) === -1));
      } else {
        setSelected(selected.concat(visibleRowNames));
      }
      setIsPageEdited(true);
    },
    [selected, setIsPageEdited, setSelected]
  );

  const [Table, TableColumn] = useTable({ data: tableData });

  return (
    <Table
      testID={`${testId}-table`}
      rowMode="multi-select"
      selected={selected}
      onSelect={onSelectCallback}
      onGlobalSelect={handleGlobalSelect}
      onMultiSelectAction={rowName => {
        handleMultiSelectAction(rowName);
      }}
      onNextPageClick={onNext}
      onPreviousPageClick={onPrevious}
      alwaysShowPageControls={isNext || isPrevious}
      nextPageButtonIsInteractive={isNext}
      previousPageButtonIsInteractive={isPrevious}
      globalSelectIndicator={globalSelect}
      maxRowsPerPage={MAX_ROWS_IN_CONTACT_GROUP_TYPE_TABLE}
    >
      <TableColumn name={tableColumnName as 'rowName'} heading={tableHeading} cellRenderer={cellRender} />
      {emailRender && <TableColumn name={tableColumnEmail as 'rowName'} heading="" cellRenderer={emailRender} />}
    </Table>
  );
}

export default ContactsTable;

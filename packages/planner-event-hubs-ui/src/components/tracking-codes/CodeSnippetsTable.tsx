import React, { Dispatch, SetStateAction } from 'react';
import { Table, TableColumn } from '@cvent/carina/components/Table';
import { AccountCodeSnippet } from '@cvent/planner-event-hubs-model/types';
import { useTranslate } from 'nucleus-text';

interface Props {
  dataList: AccountCodeSnippet[];
  selected: string;
  setSelected: Dispatch<SetStateAction<string>>;
}
function CodeSnippetsTable({ dataList, selected, setSelected }: Props): JSX.Element {
  const { translate } = useTranslate();

  const handleOnSelect = (rowName, isSelected): void => {
    if (isSelected) setSelected(null);
    else setSelected(rowName);
  };

  const snippetsArray = dataList.map(codeSnippet => ({
    ...codeSnippet,
    rowName: `${codeSnippet.codeSnippetId}`,
    visitorsCanTurnOff: codeSnippet.isDropCodeSnippetToCookieBannerTied
      ? translate('code_snippets_table_disable_code_snippets_option_yes')
      : translate('code_snippets_table_disable_code_snippets_option_no')
  }));

  return (
    <Table
      data={snippetsArray}
      rowMode="multi-select"
      testID="code-snippet-table"
      selected={[selected]}
      onSelect={(rowName, { isSelected }) => {
        handleOnSelect(rowName, isSelected);
      }}
      onMultiSelectAction={_val => {
        handleOnSelect(_val, true);
      }}
    >
      <TableColumn name="codeSnippetName" heading={translate('code_snippets_table_header_name')} />
      <TableColumn name="codeSnippetDataTagCode" heading={translate('code_snippets_table_header_datatag_code')} />
      <TableColumn name="codeSnippetStatus" heading={translate('code_snippets_table_header_status')} />
      <TableColumn name="visitorsCanTurnOff" heading={translate('code_snippets_table_header_disable_code_snippets')} />
    </Table>
  );
}

export default CodeSnippetsTable;

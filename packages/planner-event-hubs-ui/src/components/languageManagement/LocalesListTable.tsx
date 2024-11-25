import { MoreVerticalIcon } from '@cvent/carina-icon';
import Button from '@cvent/carina/components/Button';
import Menu from '@cvent/carina/components/Menu';
import { Placements } from '@cvent/carina/components/Popover';
import { Table, TableColumn } from '@cvent/carina/components/Table';
import { Tag } from '@cvent/carina/components/Tag';
import { useAppFeatures } from '@components/AppFeaturesProvider';
import { ActionType } from '@cvent/carina/components/Templates/utils/helpers';
import TextLink from '@cvent/carina/components/TextLink';
import { injectTestId } from '@cvent/nucleus-test-automation';
import { HubLocaleWithDefault } from '@cvent/planner-event-hubs-model/types';
import { CSSObject } from '@emotion/react';
import { useTranslate } from 'nucleus-text';
import React, { useCallback, useMemo } from 'react';
import { DownloadIcon, UploadIcon } from '@cvent/carina/components/Icon';
import { EXPORT_TEXT, IMPORT_TEXT } from './LanguageManagementConstants';

const useStyles = (): CSSObject => ({
  localeLinkContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: 8
  },
  localeLink: {
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline'
    }
  }
});

interface Props {
  tableData: Array<HubLocaleWithDefault>;
  languageMap: Record<string, string>;
  setShowLocalesListTable: (show: boolean) => void;
  setSelectedLocale: (locale: string) => void;
  setSelectedLocaleTitle: (title: string) => void;
  onExport: (locale?: string) => void;
  setWizardOpen: (open: boolean) => void;
}

function LocaleListTable({
  tableData,
  languageMap,
  setShowLocalesListTable,
  setSelectedLocale,
  setSelectedLocaleTitle,
  onExport,
  setWizardOpen
}: Props): React.JSX.Element {
  const { translate, date } = useTranslate();
  const styles = useStyles();
  const { languageManagementImportFeature } = useAppFeatures();

  const getCostimizedText = useCallback(
    (customized: string): string =>
      customized === 'true'
        ? translate('language_management_locale_list_table_header_customized_yes')
        : translate('language_management_locale_list_table_header_customized_no'),
    [translate]
  );

  const formatDate = useCallback(
    (dateStr: string | null | undefined): string => {
      if (!!dateStr === false) return '';
      const dateInstance = new Date(dateStr);
      return date(dateInstance, {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric'
      });
    },
    [date]
  );

  const tableDataWithRowName = useMemo(
    () =>
      tableData?.map(data => ({
        ...data,
        lastModified: formatDate(data.lastModified),
        customized: getCostimizedText(data.customized),
        rowName: data.locale
      })),
    [tableData, formatDate, getCostimizedText]
  );

  const localeCellRenderer = (_, { rowData }): React.JSX.Element => {
    const localeTitle = languageMap[rowData.locale] || rowData.locale;
    const handleOnLocaleClick = () => {
      setShowLocalesListTable(false);
      setSelectedLocaleTitle(localeTitle);
      setSelectedLocale(rowData.locale);
    };
    return (
      <div css={styles.localeLinkContainer}>
        <TextLink testID={`language-${localeTitle}`} onClick={handleOnLocaleClick}>
          {localeTitle}
        </TextLink>
        {rowData.default && (
          <Tag text={translate('language_management_locale_list_default_tag')} testID="default-language-tag" />
        )}
      </div>
    );
  };
  const buttonMoreIcon = () => <MoreVerticalIcon size="m" />;

  const menuButton = useCallback(
    (handlePress): React.JSX.Element => (
      <Button
        appearance="ghost"
        onClick={handlePress}
        icon={buttonMoreIcon}
        aria-label={translate('language-management-actions-menu_aria_label')}
        {...injectTestId('language-management-actions-menu-button')}
      />
    ),
    [translate]
  );
  const Space = useMemo(() => <span css={{ width: '0.625rem' }} />, []);

  const sectionActions: ActionType[] = [
    {
      value: EXPORT_TEXT,
      label: (
        <>
          <UploadIcon size="s" />
          {Space}
          <div>{translate('language_management_export_text')}</div>
        </>
      ),
      onClick: onExport
    },
    ...(languageManagementImportFeature
      ? [
          {
            value: IMPORT_TEXT,
            label: (
              <>
                <DownloadIcon size="s" />
                {Space}
                <div>{translate('language_management_import_text')}</div>
              </>
            ),
            icon: { UploadIcon }
          }
        ]
      : [])
  ];

  const menuCellRenderer = (_, { rowData }): React.JSX.Element => (
    <div css={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', wordBreak: 'break-all' }}>
      <div>{rowData.lastModifiedBy}</div>
      <Menu
        testID="language-management-actions-option-menu"
        options={sectionActions}
        placement={Placements.bottomEnd}
        onSelect={selection => {
          if (selection.value === EXPORT_TEXT) {
            onExport(rowData?.locale);
          } else if (selection.value === IMPORT_TEXT) {
            setWizardOpen(true);
            setShowLocalesListTable(false);
            setSelectedLocale(rowData?.locale);
            setSelectedLocaleTitle(languageMap[rowData?.locale] || rowData?.locale);
          }
        }}
        portal
        trigger={handlePress => menuButton(handlePress)}
      />
    </div>
  );

  return (
    <Table data={tableDataWithRowName} striped>
      <TableColumn
        name="locale"
        heading={translate('language_management_locale_list_table_header_language')}
        cellRenderer={localeCellRenderer}
        sortable
      />
      <TableColumn
        name="customized"
        heading={translate('language_management_locale_list_table_header_customized')}
        sortable
      />
      <TableColumn
        name="translationStatus"
        heading={translate('language_management_locale_list_table_header_translation_status')}
        sortable
      />
      <TableColumn
        name="lastModified"
        heading={translate('language_management_locale_list_table_header_lastModified')}
        sortable
      />
      <TableColumn
        name="lastModifiedBy"
        heading={translate('language_management_locale_list_table_header_lastModifiedBy')}
        sortable
        cellRenderer={menuCellRenderer}
      />
    </Table>
  );
}

export default LocaleListTable;

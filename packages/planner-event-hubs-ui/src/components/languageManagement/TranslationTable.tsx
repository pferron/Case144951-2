import { useQuery } from '@apollo/client';
import LeavePageAlert from '@components/common/LeavePageAlert';
import { PageAlert } from '@cvent/carina/components/Alert';
import { LoadingSpinner } from '@cvent/carina/components/LoadingSpinner';
import { Table, TableColumn } from '@cvent/carina/components/Table';
import { useTheme } from '@cvent/carina/components/ThemeProvider';
import { injectTestId } from '@cvent/nucleus-test-automation';
import { GET_TRANSLATIONS } from '@cvent/planner-event-hubs-model/operations/languageManagement';
import { CSSObject } from '@emotion/react';
import { ASC, DESC, INITIAL_PAGE_SELECTED } from '@utils/constants';
import { useTranslate } from 'nucleus-text';
import { RefObject, useCallback, useRef, useState } from 'react';
import EditTranslationForm from './EditTranslationForm';
import SearchAndFilterOptions from './SearchAndFilterOptions';
import TableFooter from './TableFooter';
import { ConfirmationActionFnType, TrackerType, TranslationTypes } from './LanguageManagement';

const useStyles = (): CSSObject => {
  const { backgroundColor, font } = useTheme();
  return {
    translationTableContainer: {
      backgroundColor: backgroundColor.neutral.focus,
      padding: '1rem',
      minHeight: '100%'
    },
    subTitle: {
      color: font.color.soft
    },
    tableContainer: {
      backgroundColor: backgroundColor.base,
      padding: '1rem'
    },
    tableStyles: {
      position: 'relative',
      zIndex: 0
    }
  };
};

interface Props {
  translationType: TranslationTypes;
  locale: string;
  centerId: string;
  title: string;
  subTitle: string;
  dirtyFormTrackerMapRef: RefObject<TrackerType>;
  setDirtyFormTrackerMapRef: (val: TrackerType | object) => void;
  checkForUnsavedChanges: (val: ConfirmationActionFnType) => void;
  searchedTranslation: string;
  setSearchedTranslation: (val: string) => void;
  sortColumn: string;
  setSortColumn: (val: string) => void;
  sortDirection: typeof ASC | typeof DESC | undefined;
  setSortDirection: (val: typeof ASC | typeof DESC | undefined) => void;
  selectedFilterByType: string;
  setSelectedFilterByType: (val: string) => void;
  displaySuccess?: boolean;
  successMessage?: React.ReactNode;
  setDisplaySuccess: (val: boolean) => void;
  pageLimit: number;
  setPageLimit: (val: number) => void;
}

export enum CustomTranslationTypes {
  all = 'custom-translation',
  hub = 'Hub',
  channel = 'Channel',
  banner = 'Banner'
}

function TranslationTable({
  translationType,
  locale,
  centerId,
  title,
  subTitle,
  dirtyFormTrackerMapRef,
  setDirtyFormTrackerMapRef,
  checkForUnsavedChanges,
  searchedTranslation,
  setSearchedTranslation,
  sortColumn,
  setSortColumn,
  sortDirection,
  setSortDirection,
  selectedFilterByType,
  setSelectedFilterByType,
  displaySuccess,
  successMessage,
  setDisplaySuccess,
  pageLimit,
  setPageLimit
}: Props): JSX.Element {
  const [pageSelected, setPageSelected] = useState(INITIAL_PAGE_SELECTED);
  const [token, setToken] = useState('');
  const [showErrorInSavingAlert, setShowErrorInSavingAlert] = useState(false);

  const showDropDownFilterByType = translationType === TranslationTypes.customKeys;
  const columnNameRef = useRef(null);

  const [isPageEdited, setIsPageEdited] = useState<boolean>(false);

  // Temporary state var
  let searchTextTemp = '';
  let filterTypeTemp = '';

  // itemId is not the actual attribute in data
  const sortColumnOverride = sortColumn === 'itemId' ? 'id' : sortColumn;
  const { loading, data: translatedData } = useQuery(GET_TRANSLATIONS, {
    variables: {
      input: {
        hubId: centerId,
        locale,
        limit: pageLimit,
        sort: `${sortColumnOverride}:${sortDirection}`,
        type: selectedFilterByType,
        translationText: searchedTranslation,
        token
      }
    },
    fetchPolicy: 'cache-and-network'
  });

  const searchUpdate = () => {
    setToken('');
    setPageSelected(INITIAL_PAGE_SELECTED);
    setSearchedTranslation(searchTextTemp);
  };

  const handleSearchUpdate = val => {
    searchTextTemp = val;
    checkForUnsavedChanges(searchUpdate);
  };

  const { translate } = useTranslate();
  const styles = useStyles();

  const tableData = translatedData?.getTranslations?.data?.map((translation, index) => ({
    ...translation,
    itemId: translation.id,
    id: `${translation.id}-${translation.type}-${index}`,
    rowName: `${translation.id}-${translation.type}-${index}`
  }));

  const onColumnClick = useCallback(() => {
    let newSortDirection: typeof ASC | typeof DESC | undefined;
    if (columnNameRef.current === sortColumn) {
      newSortDirection =
        (sortDirection === undefined && ASC) ||
        (sortDirection === ASC && DESC) ||
        (sortDirection === DESC && ASC) ||
        undefined;
    } else {
      newSortDirection = ASC;
    }
    setSortColumn(columnNameRef.current);
    setSortDirection(newSortDirection);
    setToken('');
    setPageSelected(INITIAL_PAGE_SELECTED);
  }, [sortColumn, sortDirection, setSortColumn, setSortDirection]);

  const handleSortColumnClick = value => {
    columnNameRef.current = value;
    checkForUnsavedChanges(onColumnClick);
  };

  const editCellRenderer = (_, { rowData }): JSX.Element => (
    <EditTranslationForm
      value={rowData}
      centerId={centerId}
      locale={locale}
      dirtyFormTrackerMapRef={dirtyFormTrackerMapRef}
      setDirtyFormTrackerMapRef={setDirtyFormTrackerMapRef}
      setShowErrorInSavingAlert={setShowErrorInSavingAlert}
      key={rowData.rowName}
      setIsPageEdited={setIsPageEdited}
    />
  );

  const filterByTypeChange = () => {
    setToken('');
    setPageSelected(INITIAL_PAGE_SELECTED);
    setSelectedFilterByType(filterTypeTemp);
  };

  const handleTypeFilterChange = (val): void => {
    filterTypeTemp = val;
    checkForUnsavedChanges(filterByTypeChange);
  };

  return (
    <div css={styles.translationTableContainer}>
      {loading ? (
        <LoadingSpinner size="m" text={translate('PageBanners-Loading')} textInline aria-label="loading" />
      ) : (
        <div>
          {showErrorInSavingAlert && (
            <div css={{ paddingBottom: '1rem' }}>
              <PageAlert
                appearance="danger"
                id="1"
                title={translate('language_management_page_alert_title')}
                content={translate('language_management_page_alert_content')}
                actionPosition="end"
                dismissible
                isRtl={false}
                testID="saving-custom-text-alert"
              />
            </div>
          )}
          {displaySuccess && (
            <div css={{ marginBottom: '1.5rem' }}>
              <PageAlert
                appearance="success"
                content={successMessage}
                dismissible
                testID="import-success-toast-message"
                onDismiss={() => setDisplaySuccess(false)}
              />
            </div>
          )}
          <div css={styles.tableContainer}>
            <h2 {...injectTestId(`${translationType}-tab-title`)}>{title}</h2>
            <p {...injectTestId(`${translationType}-tab-subTitle`)} css={styles.subTitle}>
              {subTitle}
            </p>
            <SearchAndFilterOptions
              selectedFilterByType={selectedFilterByType}
              handleTypeFilterChange={handleTypeFilterChange}
              showDropDownFilterByType={showDropDownFilterByType}
              searchedTranslation={searchedTranslation}
              handleSearchUpdate={handleSearchUpdate}
            />
            <Table
              data={tableData}
              striped
              css={styles.tableStyles}
              onColumnClick={handleSortColumnClick}
              sortColumn={sortColumn}
              sortDirection={sortDirection}
              externallySorted
            >
              <TableColumn name="itemId" heading={translate('language_management_table_column_text_id')} sortable />
              {translationType === TranslationTypes.customKeys && (
                <TableColumn name="type" heading={translate('language_management_table_column_text_type')} sortable />
              )}
              <TableColumn
                name="defaultValue"
                heading={translate('language_management_table_column_base_text')}
                sortable
              />
              <TableColumn
                name="translatedValue"
                heading={translate('language_management_table_column_custom_text')}
                cellRenderer={editCellRenderer}
                sortable
              />
            </Table>
            <TableFooter
              selectedPage={pageSelected}
              setPageSelected={setPageSelected}
              selectedPageLimit={pageLimit}
              setPageLimit={setPageLimit}
              setToken={setToken}
              nextToken={translatedData?.getTranslations?.paging?.nextToken}
              previousToken={translatedData?.getTranslations?.paging?.previousToken}
              totalCount={translatedData?.getTranslations?.paging?.totalCount}
              resultsCount={translatedData?.getTranslations?.data?.length}
              setShowErrorInSavingAlert={setShowErrorInSavingAlert}
              checkForUnsavedChanges={checkForUnsavedChanges}
            />
          </div>
        </div>
      )}
      <LeavePageAlert isPageEdited={isPageEdited} setIsPageEdited={setIsPageEdited} />
    </div>
  );
}

export default TranslationTable;

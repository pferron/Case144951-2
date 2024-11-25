import Dropdown from '@cvent/carina/components/Dropdown/Dropdown';
import { Pagination } from '@cvent/carina/components/Pagination';
import { CSSObject } from '@emotion/react';
import { INITIAL_PAGE_LIMIT, INITIAL_PAGE_SELECTED } from '@utils/constants';
import { useTranslate } from 'nucleus-text';
import { ConfirmationActionFnType } from './LanguageManagement';

const useStyles = (): CSSObject => ({
  footerContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingTop: '1rem'
  },
  dropdown: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  }
});
interface Props {
  selectedPage: number;
  setPageSelected: (val: number) => void;
  setPageLimit: (val: number) => void;
  selectedPageLimit: number;
  setToken: (val: string) => void;
  nextToken: string | null;
  previousToken: string | null;
  totalCount: number;
  resultsCount: number;
  setShowErrorInSavingAlert: (val: boolean) => void;
  checkForUnsavedChanges: (val: ConfirmationActionFnType) => void;
}

function TableFooter({
  selectedPage,
  setPageSelected,
  selectedPageLimit,
  totalCount,
  setToken,
  nextToken,
  previousToken,
  resultsCount,
  setPageLimit,
  setShowErrorInSavingAlert,
  checkForUnsavedChanges
}: Props): JSX.Element {
  const options = [
    { label: '25', value: '25' },
    { label: '50', value: '50' },
    { label: '100', value: '100' },
    { label: '200', value: '200' }
  ];

  const styles = useStyles();
  const { translate } = useTranslate();

  // Temporary state var
  let pageLimitTemp = INITIAL_PAGE_LIMIT;
  let gotoPageTemp = INITIAL_PAGE_SELECTED;

  const paginate = () => {
    if (gotoPageTemp > selectedPage) {
      setToken(nextToken);
    } else {
      setToken(previousToken);
    }
    setPageSelected(gotoPageTemp);
    setShowErrorInSavingAlert(false);
  };

  const handlePaginationClick = value => {
    gotoPageTemp = value;
    checkForUnsavedChanges(paginate);
  };

  const changePageLimit = () => {
    setPageSelected(INITIAL_PAGE_SELECTED);
    setPageLimit(pageLimitTemp);
    setToken('');
    setShowErrorInSavingAlert(false);
  };

  /* Fallsback to page-1 when number of results per page changed */
  const handlePageLimitChange = (value: string) => {
    pageLimitTemp = Number(value);
    checkForUnsavedChanges(changePageLimit);
  };

  /* Selected page and page limit determines the number of results */
  const startingIndex = (selectedPage - 1) * selectedPageLimit + 1;
  const endingIndex = startingIndex + resultsCount - 1;

  return (
    <div css={styles.footerContainer}>
      <div css={styles.dropdown}>
        <div>{translate('language_management_page_limit_title')}</div>
        <div>
          <Dropdown
            accessibilityLabel={translate('language_management_page_limit_accessibility_label')}
            options={options}
            selected={selectedPageLimit.toString()}
            onUpdate={handlePageLimitChange}
          />
        </div>
      </div>
      <div>
        <p>
          {translate('language_management_number_of_results_showing', {
            start: startingIndex,
            end: endingIndex,
            totalCount
          })}
        </p>
      </div>
      <Pagination
        hideNumbers
        totalPages={Math.ceil(totalCount / selectedPageLimit)}
        accessibilityLabel={translate('language_management_pagination_accessibility_label')}
        accessibilityLabelNextButton={translate('language_management_pagination_accessibility_next_btn')}
        accessibilityLabelPrevButton={translate('language_management_pagination_accessibility_prev_btn')}
        selected={selectedPage}
        onChange={handlePaginationClick}
      />
    </div>
  );
}

export default TableFooter;

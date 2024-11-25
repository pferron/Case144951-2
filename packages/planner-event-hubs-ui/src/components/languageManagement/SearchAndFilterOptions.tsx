import { SearchFilter } from '@components/common/SearchFilter';
import Dropdown from '@cvent/carina/components/Dropdown/Dropdown';
import { useTheme } from '@cvent/carina/components/ThemeProvider';
import { CSSObject } from '@emotion/react';
import { useTranslate } from 'nucleus-text';

export enum CustomTranslationTypes {
  all = 'custom-translation',
  hub = 'Hub',
  channel = 'Channel',
  banner = 'Banner',
  section = 'Section'
}

const useStyles = (): CSSObject => {
  const { font } = useTheme();
  return {
    searchContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingBottom: 16,
      flexWrap: 'wrap',
      gap: 8
    },
    filterByType: {
      display: 'flex',
      gap: 16,
      justifyContent: 'center',
      alignItems: 'center',
      color: font.color.soft,
      minWidth: 320
    }
  };
};

interface Props {
  selectedFilterByType: string;
  handleTypeFilterChange: (val: string) => void;
  showDropDownFilterByType: boolean;
  searchedTranslation?: string;
  handleSearchUpdate: (val: string) => void;
}

function SearchAndFilterOptions({
  selectedFilterByType,
  handleTypeFilterChange,
  showDropDownFilterByType,
  searchedTranslation,
  handleSearchUpdate
}: Props): JSX.Element {
  const { translate } = useTranslate();
  const styles = useStyles();

  const filterOptions = [
    { label: translate('language_management_filter_type_option_all'), value: CustomTranslationTypes.all },
    { label: translate('language_management_filter_type_option_hub'), value: CustomTranslationTypes.hub },
    { label: translate('language_management_filter_type_option_channel'), value: CustomTranslationTypes.channel },
    { label: translate('language_management_filter_type_option_banner'), value: CustomTranslationTypes.banner },
    { label: translate('language_management_filter_type_option_section'), value: CustomTranslationTypes.section }
  ];

  return (
    <div css={styles.searchContainer}>
      <div css={styles.filterByType}>
        {showDropDownFilterByType && (
          <>
            <div>{translate('language_management_filter_type_option_title')}</div>
            <Dropdown
              accessibilityLabel={translate('language_management_filter_by_type_accessibility_label')}
              options={filterOptions}
              selected={selectedFilterByType}
              onUpdate={handleTypeFilterChange}
              testID="filter-by-type"
            />
          </>
        )}
      </div>
      <div>
        <SearchFilter
          setSearchTerm={handleSearchUpdate}
          searchTerm={searchedTranslation}
          label=""
          testID="translation-list"
          searchBtnAccessibilityLabel={translate('language_management_search_filter_search_btn_accessibility')}
          clearSearchBtnAccessibilityLabel={translate(
            'language_management_search_filter_clear_search_btn_accessibility'
          )}
          searchInputAccessibilityLabel={translate('language_management_search_input_accessibility')}
        />
      </div>
    </div>
  );
}

export default SearchAndFilterOptions;

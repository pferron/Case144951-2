import React, { useEffect, useState } from 'react';
import Textbox from '@cvent/carina/components/Textbox/Textbox';
import { SearchIcon } from '@cvent/carina/components/Icon';
import { MIN_CHAR_FOR_SEARCH } from '@utils/constants';
import { useStyle } from '@hooks/useStyle';
import { Button } from '@cvent/carina/components/Button';
import { ContactGroupModalStyle } from '@components/visitor-permissions/style';
import { useTranslate } from 'nucleus-text';

interface Props {
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  searchTerm: string;
  characterLimit?: number;
  testId: string;
  searchBoxLabel: string;
  // MAUVE
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  setContactDataList: (contactDataList: Array<any>) => void;
  setNextToken: (token: string) => void;
  setTotalCount: (count: number) => void;
  setIndex: (index: number) => void;
  setCurrentToken: (token: string) => void;
}
export function ContactsModalSearchFilter({
  setSearchTerm,
  searchTerm,
  characterLimit = 100,
  testId,
  searchBoxLabel,
  setContactDataList,
  setNextToken,
  setCurrentToken,
  setIndex,
  setTotalCount
}: Props): JSX.Element {
  const [searchText, setSearchText] = useState(searchTerm);
  const styles = useStyle(ContactGroupModalStyle);
  const { translate } = useTranslate();

  useEffect(() => {
    setSearchText(searchTerm);
  }, [searchTerm]);

  const handleSearchUpdate = (): void => {
    if (
      (searchText.length === 0 || (searchText.length >= MIN_CHAR_FOR_SEARCH && searchText.length <= characterLimit)) &&
      searchText !== searchTerm
    ) {
      setContactDataList([]);
      setNextToken(null);
      setCurrentToken(null);
      setIndex(0);
      setTotalCount(0);
      setSearchTerm(searchText);
    }
  };

  return (
    <div css={styles.searchContainer}>
      <div css={styles.searchTextBox}>
        <Textbox
          css={{ width: '85%' }}
          aria-label={searchBoxLabel}
          testID={`${testId}-search-box`}
          value={searchText}
          onChange={({ target }) => {
            setSearchText(target.value);
          }}
          onKeyDown={(event): void => {
            if (event.code === 'Enter') {
              event.preventDefault();
              handleSearchUpdate();
            }
          }}
          focused
        />
      </div>
      <Button
        css={styles.searchButton}
        appearance="lined"
        icon={SearchIcon}
        aria-label={translate('registration_settings_search_button_text')}
        iconAlign="start"
        onClick={handleSearchUpdate}
        text={translate('registration_settings_search_button_text')}
        testID={`${testId}-search-button`}
      />
    </div>
  );
}

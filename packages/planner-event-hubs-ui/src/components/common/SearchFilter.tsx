import React, { useEffect, useState } from 'react';
import Textbox from '@cvent/carina/components/Textbox/Textbox';
import { SearchIcon, XIcon } from '@cvent/carina/components/Icon';
import { useTheme } from '@cvent/carina/components/ThemeProvider/useTheme';
import { MIN_CHAR_FOR_SEARCH } from '@utils/constants';
import FormElement from '@cvent/carina/components/FormElement/FormElement';
import { useStyle } from '@hooks/useStyle';
import { MemberListStyle } from '@components/memberList/style';
import Button from '@cvent/carina/components/Button';

interface Props {
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  searchTerm: string;
  characterLimit?: number;
  label: string;
  testID: string;
  searchBtnAccessibilityLabel?: string;
  clearSearchBtnAccessibilityLabel?: string;
  searchInputAccessibilityLabel?: string;
}
export function SearchFilter({
  setSearchTerm,
  searchTerm = '',
  characterLimit = 100,
  label,
  testID,
  searchBtnAccessibilityLabel,
  clearSearchBtnAccessibilityLabel,
  searchInputAccessibilityLabel
}: Props): JSX.Element {
  const theme = useTheme();
  const [searchText, setSearchText] = useState(searchTerm);

  useEffect(() => {
    setSearchText(searchTerm);
  }, [searchTerm]);

  const handleSearchUpdate = (): void => {
    if (searchText.length === 0 || (searchText.length >= MIN_CHAR_FOR_SEARCH && searchText.length <= characterLimit)) {
      setSearchTerm(searchText);
    }
  };

  const { searchButton, clearSearchButton, searchButtonContainer } = useStyle(MemberListStyle);

  const SearchButton: JSX.Element = (
    <div css={searchButtonContainer}>
      {searchTerm && (
        <Button
          appearance="ghost"
          tabIndex={0}
          variant="neutral-black"
          css={clearSearchButton}
          onClick={() => {
            setSearchTerm('');
          }}
          onKeyDown={(event): void => {
            if (event.code === 'Enter') {
              setSearchTerm('');
            }
          }}
          size="s"
          iconSize="s"
          icon={XIcon}
          aria-label={clearSearchBtnAccessibilityLabel}
        />
      )}
      <Button
        css={searchButton}
        appearance="ghost"
        tabIndex={0}
        size="s"
        variant="neutral-black"
        onClick={handleSearchUpdate}
        onKeyDown={(event): void => {
          if (event.code === 'Enter') {
            event.preventDefault();
            handleSearchUpdate();
          }
        }}
        iconSize="s"
        icon={SearchIcon}
        aria-label={searchBtnAccessibilityLabel}
      />
    </div>
  );

  return (
    <>
      {!!label && <FormElement.Label label={label} labelFor="search" />}
      <div css={{ width: '20rem', backgroundColor: theme.backgroundColor.base }}>
        <Textbox
          id="search"
          value={searchText}
          accessibilityLabel={label}
          onChangeText={(changeText): void => {
            setSearchText(changeText);
          }}
          iconEnd={SearchButton}
          maxLength={characterLimit}
          testID={`${testID}-search`}
          onKeyDown={(event): void => {
            if (event.key === 'Enter') {
              event.preventDefault();
              handleSearchUpdate();
            }
          }}
          css={searchTerm ? { width: '95%' } : null}
          aria-label={searchInputAccessibilityLabel}
        />
      </div>
    </>
  );
}

import React, { useCallback, useMemo, useState } from 'react';
import { Form } from '@cvent/carina/components/Forms';
import Modal from '@cvent/carina/components/Modal';
import { Button } from '@cvent/carina/components/Button';
import { XIcon } from '@cvent/carina/components/Icon';
import { useTranslate } from 'nucleus-text';
import { useStyle } from '@hooks/useStyle';
import { ContactGroupModalStyle } from '@components/visitor-permissions/style';
import { ContactsModalSearchFilter } from '@components/visitor-permissions/ContactsModalSearchFilter';
import { IllustrationContent, IllustrationHeader, IllustrationNotice } from '@cvent/carina/components/Templates';
import { HeroErrorShrug, EmptyPeople } from '@cvent/carina/components/Illustrations';
import { useQuery } from '@apollo/client';
import {
  MAX_CONTACT_GROUP_SAVE_LIMIT,
  MAX_CONTACTS_FETCH_LIMIT,
  MAX_ROWS_IN_CONTACT_GROUP_TYPE_TABLE
} from '@utils/constants';
import { LoggerFactory } from '@cvent/logging/LoggerFactory';
import { ContactData } from '@cvent/planner-event-hubs-model/types';
import { LoadingSpinner } from '@cvent/carina/components/LoadingSpinner';
import { searchContactsQuery } from '@cvent/planner-event-hubs-model/operations/contacts';
import { removeUnsupportedCharactersForSearch } from '@utils/sanitizeSearchText';
import FormElement from '@cvent/carina/components/FormElement/FormElement';
import ScrollViewWithBars from '@cvent/carina/components/ScrollViewWithBars';
import ContactsTable from '@components/visitor-permissions/ContactsTable';

const LOG = LoggerFactory.create('All Contacts Fetching');

interface Props {
  isOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  contactSelected: Array<string>;
  setContactSelected: (selectContacts: Array<string>) => void;
  testId: string;
  modalTitle: string;
  tableHeading: string;
  searchBoxLabel: string;
  originalBlockedContacts: Array<string>;
  setIsPageEdited: (isPageEdited: boolean) => void;
}
function BlockedContactsModal({
  isOpen,
  setIsModalOpen,
  contactSelected,
  setContactSelected,
  testId,
  modalTitle,
  tableHeading,
  searchBoxLabel,
  originalBlockedContacts,
  setIsPageEdited
}: Props): JSX.Element {
  const { translate } = useTranslate();
  const styles = useStyle(ContactGroupModalStyle);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentToken, setCurrentToken] = useState(null);
  const [index, setIndex] = useState(0);
  const [tableData, setTableData] = useState<Array<ContactData>>([]);
  const [nextToken, setNextToken] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [error, setError] = useState(false);
  const [contactsList, setContactsList] = useState<Array<ContactData>>([]);
  const newlySelectedContactsCount = contactSelected.filter(
    contact => !originalBlockedContacts.includes(contact)
  ).length;
  const newlyDeselectedContactsCount = originalBlockedContacts.filter(
    contacts => !contactSelected.includes(contacts)
  ).length;

  const { refetch, loading: fetchingContacts } = useQuery(searchContactsQuery, {
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
    variables: {
      input: {
        limit: MAX_CONTACTS_FETCH_LIMIT,
        searchTerm: removeUnsupportedCharactersForSearch(searchTerm),
        token: currentToken
      }
    },
    onCompleted: data => {
      setError(false);
      const contacts = data?.searchContacts;
      let tempContactList = contactsList;
      if (contacts?.data?.length > 0) {
        const filteredData = contacts.data;
        tempContactList = [...contactsList, ...filteredData];
        setContactsList(tempContactList);
        setTableData(tempContactList.slice(index, index + MAX_ROWS_IN_CONTACT_GROUP_TYPE_TABLE));
        setTotalCount(contacts.paging.totalCount);
      }
      setNextToken(contacts.paging.nextToken);
    },
    onError: apolloError => {
      LOG.error(apolloError, 'Failed to fetch contacts');
      setError(true);
    }
  });

  const onNext = useCallback(() => {
    const temp = index + MAX_ROWS_IN_CONTACT_GROUP_TYPE_TABLE;
    setIndex(index + MAX_ROWS_IN_CONTACT_GROUP_TYPE_TABLE);
    if (contactsList.length - temp < MAX_ROWS_IN_CONTACT_GROUP_TYPE_TABLE && nextToken !== null) {
      setCurrentToken(nextToken);
    } else {
      setTableData(contactsList.slice(temp, temp + MAX_ROWS_IN_CONTACT_GROUP_TYPE_TABLE));
    }
  }, [nextToken, index, contactsList]);

  const onPrevious = useCallback(() => {
    const temp = index - MAX_ROWS_IN_CONTACT_GROUP_TYPE_TABLE;
    setIndex(index - MAX_ROWS_IN_CONTACT_GROUP_TYPE_TABLE);
    setTableData(contactsList.slice(temp, temp + MAX_ROWS_IN_CONTACT_GROUP_TYPE_TABLE));
  }, [index, contactsList]);

  const isNextPageAvailable = useMemo(
    () => index + MAX_ROWS_IN_CONTACT_GROUP_TYPE_TABLE < totalCount,
    [index, totalCount]
  );

  const isPreviousPageAvailable = useMemo(() => index - MAX_ROWS_IN_CONTACT_GROUP_TYPE_TABLE >= 0, [index]);

  const refetchWhenError = useCallback(() => {
    refetch({
      input: {
        limit: MAX_CONTACTS_FETCH_LIMIT,
        searchTerm: removeUnsupportedCharactersForSearch(searchTerm),
        token: currentToken
      }
    });
  }, [refetch, searchTerm, currentToken]);

  const emptyPage: JSX.Element = useMemo(
    () => (
      <IllustrationNotice testID={`${testId}-empty-page-container`} illustration={EmptyPeople}>
        <IllustrationHeader>
          {translate('registration_settings_contacts_modal_empty_page_message_header')}
        </IllustrationHeader>
      </IllustrationNotice>
    ),
    [translate, testId]
  );

  const errorPage: JSX.Element = useMemo(
    () => (
      <IllustrationNotice testID={`${testId}-error-page-container`} illustration={HeroErrorShrug}>
        <IllustrationHeader>
          {translate('registration_settings_contact_group_type_modal_error_page_message_header')}
        </IllustrationHeader>
        <IllustrationContent>
          {translate('registration_settings_contact_modal_error_page_message_content')}
        </IllustrationContent>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            text={translate('select_video_modal_error_page_retry_button')}
            onClick={() => {
              refetchWhenError();
            }}
          />
        </div>
      </IllustrationNotice>
    ),
    [translate, testId, refetchWhenError]
  );

  const noSearchResultPage: JSX.Element = useMemo(
    () => (
      <IllustrationNotice testID={`${testId}-no-search-result-container`} illustration={HeroErrorShrug}>
        <IllustrationHeader>
          {translate('registration_settings_contact_modal_invalid_search_message_content', { searchTerm })}
        </IllustrationHeader>
      </IllustrationNotice>
    ),
    [translate, testId, searchTerm]
  );

  const onSave = (): void => {
    if (newlySelectedContactsCount <= MAX_CONTACT_GROUP_SAVE_LIMIT) {
      setContactSelected(contactSelected);
      setIsModalOpen(false);
    } else {
      setIsModalOpen(true);
    }
  };

  const nameCellRenderer = useCallback(
    (_cellData, { rowData }) => {
      if (!rowData.firstName) {
        return <p css={styles.tableContent}>{rowData.lastName}</p>;
      }
      return <p css={styles.tableContent}>{`${rowData.firstName} ${rowData.lastName}`}</p>;
    },
    [styles.tableContent]
  );

  const emailCellRenderer = useCallback(
    (_cellData, { rowData }) => {
      if (!rowData.email) {
        return <p>-</p>;
      }
      return (
        <p data-dd-privacy="mask" css={styles.tableContent}>
          {rowData.email}
        </p>
      );
    },
    [styles.tableContent]
  );

  const displayContent = useMemo(() => {
    if (error) {
      return errorPage;
    }
    if (contactsList.length <= 0) {
      if (searchTerm === '') {
        return emptyPage;
      }
      return noSearchResultPage;
    }
    return (
      <ContactsTable
        dataList={tableData}
        onPrevious={onPrevious}
        selected={contactSelected}
        setSelected={setContactSelected}
        testId={testId}
        onNext={onNext}
        isNext={isNextPageAvailable}
        isPrevious={isPreviousPageAvailable}
        tableHeading={tableHeading}
        tableColumnName="firstName"
        cellRender={nameCellRenderer}
        emailRender={emailCellRenderer}
        tableColumnEmail="email"
        setIsPageEdited={setIsPageEdited}
      />
    );
  }, [
    error,
    contactsList.length,
    tableData,
    onPrevious,
    contactSelected,
    setContactSelected,
    testId,
    onNext,
    isNextPageAvailable,
    isPreviousPageAvailable,
    tableHeading,
    nameCellRenderer,
    emailCellRenderer,
    setIsPageEdited,
    errorPage,
    searchTerm,
    noSearchResultPage,
    emptyPage
  ]);
  const saveButtonText = translate('registration_settings_contact_group_type_modal_save_button', {
    count: contactSelected.length > 0 ? contactSelected.length : ''
  });

  const blockedContactsModalHeader: JSX.Element = (
    <div>
      <header css={styles.headerStyle}>
        <h3 css={styles.modalTitle}>{modalTitle}</h3>
        <Button
          css={styles.dismissButtonStyle}
          appearance="ghost"
          icon={XIcon}
          aria-label={translate('close_modal_button_label')}
          onClick={() => {
            setContactSelected(originalBlockedContacts);
            setIsModalOpen(false);
          }}
          variant="neutral"
          testID={`${testId}-cross-button`}
        />
      </header>
      <ContactsModalSearchFilter
        setSearchTerm={setSearchTerm}
        searchTerm={searchTerm}
        testId={testId}
        setContactDataList={setContactsList}
        searchBoxLabel={searchBoxLabel}
        setTotalCount={setTotalCount}
        setCurrentToken={setCurrentToken}
        setIndex={setIndex}
        setNextToken={setNextToken}
      />
    </div>
  );

  const blockedContactsModalFooter: JSX.Element = (
    <div>
      {contactsList.length > 0 && !error && (
        <div css={styles.buttonContainer}>
          <Button
            css={styles.saveButton}
            appearance="filled"
            onClick={onSave}
            disabled={
              newlySelectedContactsCount > MAX_CONTACT_GROUP_SAVE_LIMIT ||
              newlyDeselectedContactsCount > MAX_CONTACT_GROUP_SAVE_LIMIT
            }
            aria-label={saveButtonText}
            text={saveButtonText}
            testID={`${testId}-save-button`}
          />
          <Button
            appearance="ghost"
            onClick={() => {
              setContactSelected(originalBlockedContacts);
              setIsModalOpen(false);
              setIsPageEdited(false);
            }}
            aria-label={translate('registration_settings_contact_group_type_modal_cancel_button')}
            text={translate('registration_settings_contact_group_type_modal_cancel_button')}
            testID={`${testId}-cancel-button`}
          />
        </div>
      )}
    </div>
  );

  return (
    <Modal
      format="m"
      isOpen={isOpen}
      testID={testId}
      onDismiss={() => {
        setIsModalOpen(false);
      }}
      portal
    >
      <ScrollViewWithBars forceStickyFooter header={blockedContactsModalHeader} footer={blockedContactsModalFooter}>
        <Form>
          {fetchingContacts ? (
            <LoadingSpinner testID="loading-all-contacts" size="l" />
          ) : (
            <div css={styles.tableContainer}>{displayContent}</div>
          )}
          {newlySelectedContactsCount > MAX_CONTACT_GROUP_SAVE_LIMIT && (
            <div css={styles.maxSelected}>
              <FormElement.Message
                text={translate('registration_settings_max_contacts_selected_limit_reached')}
                type="error"
                accessibilityLabel={translate('registration_settings_max_contacts_selected_limit_reached')}
              />
            </div>
          )}
          {newlyDeselectedContactsCount > MAX_CONTACT_GROUP_SAVE_LIMIT && (
            <div css={styles.maxSelected}>
              <FormElement.Message
                text={translate('registration_settings_max_contacts_deselected_limit_reached')}
                type="error"
                accessibilityLabel={translate('registration_settings_max_contacts_deselected_limit_reached')}
              />
            </div>
          )}
        </Form>
      </ScrollViewWithBars>
    </Modal>
  );
}

export default BlockedContactsModal;

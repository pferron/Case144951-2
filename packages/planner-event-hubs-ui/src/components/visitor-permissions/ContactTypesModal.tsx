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
import { ContactTypesData } from '@cvent/planner-event-hubs-model/types';
import { LoadingSpinner } from '@cvent/carina/components/LoadingSpinner';
import { searchContactTypesQuery } from '@cvent/planner-event-hubs-model/operations/contacts';
import { removeUnsupportedCharactersForSearch } from '@utils/sanitizeSearchText';
import FormElement from '@cvent/carina/components/FormElement/FormElement';
import ScrollViewWithBars from '@cvent/carina/components/ScrollViewWithBars';
import ContactsTable from '@components/visitor-permissions/ContactsTable';

const LOG = LoggerFactory.create('Fetching Contact Types ');

interface Props {
  isOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  contactTypesSelected: Array<string>;
  setContactTypesSelected: (selectContacts: Array<string>) => void;
  testId: string;
  modalTitle: string;
  tableHeading: string;
  searchBoxLabel: string;
  originalContactTypes: Array<string>;
  setIsPageEdited: (isPageEdited: boolean) => void;
}
function ContactTypesModal({
  isOpen,
  setIsModalOpen,
  contactTypesSelected,
  setContactTypesSelected,
  testId,
  modalTitle,
  tableHeading,
  searchBoxLabel,
  originalContactTypes,
  setIsPageEdited
}: Props): JSX.Element {
  const { translate } = useTranslate();
  const styles = useStyle(ContactGroupModalStyle);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentToken, setCurrentToken] = useState(null);
  const [index, setIndex] = useState(0);
  const [tableData, setTableData] = useState<Array<ContactTypesData>>([]);
  const [nextToken, setNextToken] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [error, setError] = useState(false);
  const [contactTypesList, setContactTypesList] = useState<Array<ContactTypesData>>([]);
  const newlySelectedContactTypesCount = contactTypesSelected.filter(
    contactType => !originalContactTypes.includes(contactType)
  ).length;
  const newlyDeselectedContactTypesCount = originalContactTypes.filter(
    contactType => !contactTypesSelected.includes(contactType)
  ).length;

  const { refetch, loading: fetchingContacts } = useQuery(searchContactTypesQuery, {
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
      const contactTypes = data?.searchContactTypes;
      let tempContactTypesList = contactTypesList;
      if (contactTypes?.data?.length > 0) {
        const filteredData = contactTypes.data;
        tempContactTypesList = [...contactTypesList, ...filteredData];
        setContactTypesList(tempContactTypesList);
        setTableData(tempContactTypesList.slice(index, index + MAX_ROWS_IN_CONTACT_GROUP_TYPE_TABLE));
        setTotalCount(contactTypes.paging.totalCount);
      }
      setNextToken(contactTypes.paging.nextToken);
    },
    onError: apolloError => {
      LOG.error(apolloError, 'Failed to fetch contact types');
      setError(true);
    }
  });

  const onNext = useCallback(() => {
    const temp = index + MAX_ROWS_IN_CONTACT_GROUP_TYPE_TABLE;
    setIndex(index + MAX_ROWS_IN_CONTACT_GROUP_TYPE_TABLE);
    if (contactTypesList.length - temp < MAX_ROWS_IN_CONTACT_GROUP_TYPE_TABLE && nextToken !== null) {
      setCurrentToken(nextToken);
    } else {
      setTableData(contactTypesList.slice(temp, temp + MAX_ROWS_IN_CONTACT_GROUP_TYPE_TABLE));
    }
  }, [nextToken, index, contactTypesList]);

  const onPrevious = useCallback(() => {
    const temp = index - MAX_ROWS_IN_CONTACT_GROUP_TYPE_TABLE;
    setIndex(index - MAX_ROWS_IN_CONTACT_GROUP_TYPE_TABLE);
    setTableData(contactTypesList.slice(temp, temp + MAX_ROWS_IN_CONTACT_GROUP_TYPE_TABLE));
  }, [index, contactTypesList]);

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
          {translate('registration_settings_contact_type_modal_empty_page_message_header')}
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
    if (newlySelectedContactTypesCount <= MAX_CONTACT_GROUP_SAVE_LIMIT) {
      setContactTypesSelected(contactTypesSelected);
      setIsModalOpen(false);
    } else {
      setIsModalOpen(true);
    }
  };

  const nameCellRenderer = useCallback(
    (_cellData, { rowData }) => <p css={styles.tableContent}>{rowData.name}</p>,
    [styles.tableContent]
  );

  const displayContent = useMemo(() => {
    if (error) {
      return errorPage;
    }
    if (contactTypesList.length <= 0) {
      if (searchTerm === '') {
        return emptyPage;
      }
      return noSearchResultPage;
    }
    return (
      <ContactsTable
        dataList={tableData}
        onPrevious={onPrevious}
        selected={contactTypesSelected}
        setSelected={setContactTypesSelected}
        testId={testId}
        onNext={onNext}
        isNext={isNextPageAvailable}
        isPrevious={isPreviousPageAvailable}
        tableHeading={tableHeading}
        tableColumnName="name"
        cellRender={nameCellRenderer}
        setIsPageEdited={setIsPageEdited}
      />
    );
  }, [
    error,
    contactTypesList.length,
    tableData,
    onPrevious,
    contactTypesSelected,
    setContactTypesSelected,
    testId,
    onNext,
    isNextPageAvailable,
    isPreviousPageAvailable,
    tableHeading,
    nameCellRenderer,
    setIsPageEdited,
    errorPage,
    searchTerm,
    noSearchResultPage,
    emptyPage
  ]);

  const saveButtonText = translate('registration_settings_contact_group_type_modal_save_button', {
    count: contactTypesSelected.length > 0 ? contactTypesSelected.length : ''
  });

  const contactTypesModalHeader: JSX.Element = (
    <div>
      <header css={styles.headerStyle}>
        <h3 css={styles.modalTitle}>{modalTitle}</h3>
        <Button
          css={styles.dismissButtonStyle}
          appearance="ghost"
          icon={XIcon}
          aria-label={translate('close_modal_button_label')}
          onClick={() => {
            setContactTypesSelected(originalContactTypes);
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
        setContactDataList={setContactTypesList}
        searchBoxLabel={searchBoxLabel}
        setTotalCount={setTotalCount}
        setCurrentToken={setCurrentToken}
        setIndex={setIndex}
        setNextToken={setNextToken}
      />
    </div>
  );

  const contactTypesModalFooter: JSX.Element = (
    <div>
      {contactTypesList.length > 0 && !error && (
        <div css={styles.buttonContainer}>
          <Button
            css={styles.saveButton}
            appearance="filled"
            onClick={onSave}
            disabled={
              newlySelectedContactTypesCount > MAX_CONTACT_GROUP_SAVE_LIMIT ||
              newlyDeselectedContactTypesCount > MAX_CONTACT_GROUP_SAVE_LIMIT
            }
            aria-label={saveButtonText}
            text={saveButtonText}
            testID={`${testId}-save-button`}
          />
          <Button
            appearance="ghost"
            onClick={() => {
              setContactTypesSelected(originalContactTypes);
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
      aria-label={translate('registration_settings_contact_type_modal_title')}
      portal
    >
      <ScrollViewWithBars forceStickyFooter header={contactTypesModalHeader} footer={contactTypesModalFooter}>
        <Form>
          {fetchingContacts ? (
            <LoadingSpinner testID="loading-contact-types" size="l" />
          ) : (
            <div css={styles.tableContainer}>{displayContent}</div>
          )}
          {newlySelectedContactTypesCount > MAX_CONTACT_GROUP_SAVE_LIMIT && (
            <div css={styles.maxSelected}>
              <FormElement.Message
                text={translate('registration_settings_max_contact_types_selected_limit_reached')}
                type="error"
                accessibilityLabel={translate('registration_settings_max_contacts_selected_limit_reached')}
              />
            </div>
          )}
          {newlyDeselectedContactTypesCount > MAX_CONTACT_GROUP_SAVE_LIMIT && (
            <div css={styles.maxSelected}>
              <FormElement.Message
                text={translate('registration_settings_max_contact_types_deselected_limit_reached')}
                type="error"
                accessibilityLabel={translate('registration_settings_max_contact_types_deselected_limit_reached')}
              />
            </div>
          )}
        </Form>
      </ScrollViewWithBars>
    </Modal>
  );
}

export default ContactTypesModal;

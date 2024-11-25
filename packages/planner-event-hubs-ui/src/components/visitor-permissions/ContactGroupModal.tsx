import React, { useCallback, useMemo, useState } from 'react';
import { Form } from '@cvent/carina/components/Forms';
import Modal from '@cvent/carina/components/Modal';
import { Button } from '@cvent/carina/components/Button';
import { XIcon } from '@cvent/carina/components/Icon';
import { useTranslate } from 'nucleus-text';
import { useStyle } from '@hooks/useStyle';
import { ContactGroupModalStyle } from '@components/visitor-permissions/style';
import { ContactsModalSearchFilter } from '@components/visitor-permissions/ContactsModalSearchFilter';
import { VisitorPermissionsProps } from '@components/visitor-permissions/type/VisitorPermissionsProps';
import { IllustrationContent, IllustrationHeader, IllustrationNotice } from '@cvent/carina/components/Templates';
import { HeroErrorShrug, EmptyPeople } from '@cvent/carina/components/Illustrations';
import { useQuery } from '@apollo/client';
import {
  CONTACT_GROUP_TYPE,
  MAX_CONTACT_GROUP_FETCH_LIMIT,
  MAX_CONTACT_GROUP_SAVE_LIMIT,
  MAX_ROWS_IN_CONTACT_GROUP_TYPE_TABLE
} from '@utils/constants';
import { LoggerFactory } from '@cvent/logging/LoggerFactory';
import { ContactGroupData } from '@cvent/planner-event-hubs-model/types';
import { LoadingSpinner } from '@cvent/carina/components/LoadingSpinner';
import { searchContactGroupsQuery } from '@cvent/planner-event-hubs-model/operations/contacts';
import { removeUnsupportedCharactersForSearch } from '@utils/sanitizeSearchText';
import FormElement from '@cvent/carina/components/FormElement/FormElement';
import ScrollViewWithBars from '@cvent/carina/components/ScrollViewWithBars';
import ContactsTable from '@components/visitor-permissions/ContactsTable';

const LOG = LoggerFactory.create('Contact Groups Fetching');

interface Props {
  isOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  contactGroupSelected: Array<string>;
  setContactGroupSelected: (selectContactGroups: Array<string>) => void;
  testId: string;
  modalTitle: string;
  tableHeading: string;
  searchBoxLabel: string;
  registrationSettings: VisitorPermissionsProps;
  originalContactGroupSelected: Array<string>;
  setIsPageEdited: (isPageEdited: boolean) => void;
}
function ContactGroupModal({
  isOpen,
  setIsModalOpen,
  contactGroupSelected,
  setContactGroupSelected,
  testId,
  modalTitle,
  tableHeading,
  searchBoxLabel,
  registrationSettings,
  originalContactGroupSelected,
  setIsPageEdited
}: Props): JSX.Element {
  const { translate } = useTranslate();
  const styles = useStyle(ContactGroupModalStyle);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentToken, setCurrentToken] = useState(null);
  const [index, setIndex] = useState(0);
  const [tableData, setTableData] = useState<Array<ContactGroupData>>([]);
  const [nextToken, setNextToken] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [error, setError] = useState(false);
  const [contactGroupsList, setContactGroupsList] = useState<Array<ContactGroupData>>([]);
  const newlySelectedContactGroupsCount = contactGroupSelected.filter(
    contactGroup => !registrationSettings.contactGroups.includes(contactGroup)
  ).length;

  const { refetch, loading: fetchingContactGroups } = useQuery(searchContactGroupsQuery, {
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
    variables: {
      input: {
        limit: MAX_CONTACT_GROUP_FETCH_LIMIT,
        searchTerm: removeUnsupportedCharactersForSearch(searchTerm),
        token: currentToken,
        type: CONTACT_GROUP_TYPE.STANDARD
      }
    },
    onCompleted: data => {
      setError(false);
      const groups = data?.searchContactGroups;
      let tempContactGroupList = contactGroupsList;
      if (groups?.data?.length > 0) {
        const filteredData = groups.data;
        tempContactGroupList = [...contactGroupsList, ...filteredData];
        setContactGroupsList(tempContactGroupList);
        setTableData(tempContactGroupList.slice(index, index + MAX_ROWS_IN_CONTACT_GROUP_TYPE_TABLE));
        setTotalCount(groups.paging.totalCount);
      }
      setNextToken(groups.paging.nextToken);
    },
    onError: apolloError => {
      LOG.error(apolloError, 'Failed to fetch contact groups');
      setError(true);
    }
  });

  const onNext = useCallback(() => {
    const temp = index + MAX_ROWS_IN_CONTACT_GROUP_TYPE_TABLE;
    setIndex(index + MAX_ROWS_IN_CONTACT_GROUP_TYPE_TABLE);
    if (contactGroupsList.length - temp < MAX_ROWS_IN_CONTACT_GROUP_TYPE_TABLE && nextToken !== null) {
      setCurrentToken(nextToken);
    } else {
      setTableData(contactGroupsList.slice(temp, temp + MAX_ROWS_IN_CONTACT_GROUP_TYPE_TABLE));
    }
  }, [nextToken, index, contactGroupsList]);

  const onPrevious = useCallback(() => {
    const temp = index - MAX_ROWS_IN_CONTACT_GROUP_TYPE_TABLE;
    setIndex(index - MAX_ROWS_IN_CONTACT_GROUP_TYPE_TABLE);
    setTableData(contactGroupsList.slice(temp, temp + MAX_ROWS_IN_CONTACT_GROUP_TYPE_TABLE));
  }, [index, contactGroupsList]);

  const isNextPageAvailable = useMemo(
    () => index + MAX_ROWS_IN_CONTACT_GROUP_TYPE_TABLE < totalCount,
    [index, totalCount]
  );

  const isPreviousPageAvailable = useMemo(() => index - MAX_ROWS_IN_CONTACT_GROUP_TYPE_TABLE >= 0, [index]);

  const refetchWhenError = useCallback(() => {
    refetch({
      input: {
        limit: MAX_CONTACT_GROUP_FETCH_LIMIT,
        searchTerm: removeUnsupportedCharactersForSearch(searchTerm),
        token: currentToken,
        type: CONTACT_GROUP_TYPE.STANDARD
      }
    });
  }, [refetch, searchTerm, currentToken]);

  const emptyPage: JSX.Element = useMemo(
    () => (
      <IllustrationNotice testID={`${testId}-empty-page-container`} illustration={EmptyPeople}>
        <IllustrationHeader>
          {translate('registration_settings_contact_group_modal_empty_page_message_header')}
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

  const nameCellRenderer = useCallback(
    (_cellData, { rowData }) => <p css={styles.tableContent}>{rowData.name}</p>,
    [styles.tableContent]
  );

  const onSave = (): void => {
    if (newlySelectedContactGroupsCount <= MAX_CONTACT_GROUP_SAVE_LIMIT) {
      setContactGroupSelected(contactGroupSelected);
      setIsModalOpen(false);
    } else {
      setIsModalOpen(true);
    }
  };

  const displayContent = useMemo(() => {
    if (error) {
      return errorPage;
    }
    if (contactGroupsList.length <= 0) {
      if (searchTerm === '') {
        return emptyPage;
      }
      return noSearchResultPage;
    }
    return (
      <ContactsTable
        dataList={tableData}
        onPrevious={onPrevious}
        selected={contactGroupSelected}
        setSelected={setContactGroupSelected}
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
    contactGroupsList.length,
    tableData,
    onPrevious,
    contactGroupSelected,
    setContactGroupSelected,
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
    count: contactGroupSelected.length > 0 ? contactGroupSelected.length : ''
  });

  const contactGroupModalHeader: JSX.Element = (
    <div>
      <header css={styles.headerStyle}>
        <h3 css={styles.modalTitle}>{modalTitle}</h3>
        <Button
          css={styles.dismissButtonStyle}
          appearance="ghost"
          icon={XIcon}
          aria-label={translate('close_modal_button_label')}
          onClick={() => {
            setContactGroupSelected(originalContactGroupSelected);
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
        setContactDataList={setContactGroupsList}
        searchBoxLabel={searchBoxLabel}
        setTotalCount={setTotalCount}
        setCurrentToken={setCurrentToken}
        setIndex={setIndex}
        setNextToken={setNextToken}
      />
    </div>
  );

  const contactGroupModalFooter: JSX.Element = (
    <div>
      {contactGroupsList.length > 0 && !error && (
        <div css={styles.buttonContainer}>
          <Button
            css={styles.saveButton}
            appearance="filled"
            onClick={onSave}
            disabled={newlySelectedContactGroupsCount > MAX_CONTACT_GROUP_SAVE_LIMIT}
            aria-label={saveButtonText}
            text={saveButtonText}
            testID={`${testId}-save-button`}
          />
          <Button
            appearance="ghost"
            onClick={() => {
              setContactGroupSelected(originalContactGroupSelected);
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
      <ScrollViewWithBars forceStickyFooter header={contactGroupModalHeader} footer={contactGroupModalFooter}>
        <Form>
          {fetchingContactGroups ? (
            <LoadingSpinner testID="loading-contact-groups" size="l" />
          ) : (
            <div css={styles.tableContainer}>{displayContent}</div>
          )}
          {newlySelectedContactGroupsCount > MAX_CONTACT_GROUP_SAVE_LIMIT && (
            <div css={styles.maxSelected}>
              <FormElement.Message
                text={translate('registration_settings_max_contact_group_selected_limit_reached')}
                type="error"
                accessibilityLabel={translate('registration_settings_max_contact_group_selected_limit_reached')}
              />
            </div>
          )}
        </Form>
      </ScrollViewWithBars>
    </Modal>
  );
}

export default ContactGroupModal;

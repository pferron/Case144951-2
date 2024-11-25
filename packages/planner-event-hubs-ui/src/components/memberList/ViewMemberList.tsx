import { useTranslate } from 'nucleus-text';
import { useStyle } from '@hooks/useStyle';
import { MemberListStyle } from '@components/memberList/style';
import { TextLink } from '@cvent/carina/components/TextLink';
import { Button } from '@cvent/carina/components/Button';
import {
  ASC,
  DESC,
  MEMBER_COMPANY_NAME,
  MEMBER_EMAIL_ADDRESS,
  MEMBER_FIRST_NAME,
  MEMBER_JOB_TITLE,
  MEMBER_REGISTRATION_DATE,
  VIDEO_HUB_PATH_PARAM_KEY,
  VIDEO_HUB_URL
} from '@utils/constants';
import { Popover } from '@cvent/carina/components/Popover';
import { InfoIcon, TrashIcon } from '@cvent/carina/components/Icon';
import { BulkActionBar } from '@cvent/carina/components/BulkActionBar';
import Breakpoints from '@cvent/carina/components/Breakpoints';
import { Table, TableColumn } from '@cvent/carina/components/Table';
import React, { useCallback, useState } from 'react';
import { MemberListData } from '@cvent/planner-event-hubs-model/types';
import { LoadingSpinner } from '@cvent/carina/components/LoadingSpinner';
import { useRouter } from 'next/router';
import ConfirmationModal from '@components/common/ConfirmationModal';
import { useAppFeatures } from '@components/AppFeaturesProvider';
import { MAXIMUM_MEMBERS_SELECTIONS_FOR_DELETION } from '@components/constants';
import { PageAlert } from '@cvent/carina/components/Alert';

function ViewMemberList({
  membersData,
  centerId,
  loadingMoreMembers,
  onSort,
  onUpdateMemberStatus,
  loadingSortedData,
  selected,
  setSelected
}: Props): JSX.Element {
  const { translate, date } = useTranslate();
  const router = useRouter();
  const [sortColumn, setSortColumn] = useState<
    | typeof MEMBER_FIRST_NAME
    | typeof MEMBER_JOB_TITLE
    | typeof MEMBER_COMPANY_NAME
    | typeof MEMBER_EMAIL_ADDRESS
    | typeof MEMBER_REGISTRATION_DATE
  >(MEMBER_FIRST_NAME);
  const [sortDirection, setSortDirection] = useState<typeof ASC | typeof DESC | undefined>(ASC);
  const { tableWrapper, normalText, modalHeader, nameColumn, infoIcon, infoButton, popoverText } =
    useStyle(MemberListStyle);
  const memberList = membersData.map(member => ({
    ...member,
    rowName: member.id
  }));

  const { memberListRemoveFeature } = useAppFeatures();
  const browserTimeZone =
    new Intl.DateTimeFormat().resolvedOptions().timeZone !== 'Etc/Unknown'
      ? new Intl.DateTimeFormat().resolvedOptions().timeZone
      : 'Etc/UTC';
  const formatDate = (dateStr: string): string => {
    const dateInstance = new Date(dateStr);
    return date(dateInstance, {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short',
      timeZone: browserTimeZone
    });
  };

  const triggerPopover = ({ toggleOpen, isOpen }) => (
    <div css={infoIcon}>
      <Button
        type="button"
        css={infoButton}
        onClick={toggleOpen}
        icon={InfoIcon}
        size="m"
        appearance="ghost"
        iconSize="m"
        testID="quick-view-popup-button"
        aria-expanded={isOpen}
        aria-label={translate('member_detail_quick_view_popup_aria_label')}
      />
    </div>
  );

  const onColumnClick = useCallback(
    (
      columnName:
        | typeof MEMBER_FIRST_NAME
        | typeof MEMBER_JOB_TITLE
        | typeof MEMBER_COMPANY_NAME
        | typeof MEMBER_EMAIL_ADDRESS
        | typeof MEMBER_REGISTRATION_DATE
    ) => {
      let newSortDirection: typeof ASC | typeof DESC | undefined;
      if (columnName === sortColumn) {
        newSortDirection =
          (sortDirection === undefined && ASC) ||
          (sortDirection === ASC && DESC) ||
          (sortDirection === DESC && ASC) ||
          undefined;
      } else {
        newSortDirection = ASC;
      }
      onSort(columnName, newSortDirection);

      setSortColumn(columnName);
      setSortDirection(newSortDirection);
    },
    [onSort, sortColumn, sortDirection]
  );

  const nameColumnRenderer = (_cellData, { rowData }): JSX.Element => {
    let registrationAgeStr = '';
    if (rowData.registrationAge?.years > 0) {
      registrationAgeStr = registrationAgeStr.concat(
        `${translate('member_detail_list_quick_view_years', {
          count: rowData.registrationAge?.years
        })} `
      );
    }
    if (rowData.registrationAge?.months > 0) {
      registrationAgeStr = registrationAgeStr.concat(
        `${translate('member_detail_list_quick_view_months', {
          count: rowData.registrationAge?.months
        })} `
      );
    }
    if (rowData.registrationAge.years === 0 && rowData.registrationAge.months === 0 && rowData.registrationAge.days) {
      registrationAgeStr = registrationAgeStr.concat(
        `${translate('member_detail_list_quick_view_days', {
          count: rowData.registrationAge?.days
        })}`
      );
    }
    return (
      <div css={nameColumn}>
        <div css={normalText}>
          <TextLink
            onClick={() => {
              router.push(VIDEO_HUB_URL.replace(VIDEO_HUB_PATH_PARAM_KEY, `${centerId}/members/${rowData.id}`));
            }}
            onKeyPress={(event): void => {
              if (event.code === 'Enter') {
                router.push(VIDEO_HUB_URL.replace(VIDEO_HUB_PATH_PARAM_KEY, `${centerId}/members/${rowData.id}`));
              }
            }}
            testID={`member-details-link-${rowData.id}`}
            aria-label={translate('member_detail_link_aria_label')}
          >
            {translate('Universal-FullName', { firstName: rowData.firstName, lastName: rowData.lastName })}
          </TextLink>
        </div>
        <div>
          <Popover testID="quick-view-modal" portal placement="end-bottom" trigger={triggerPopover}>
            <div css={modalHeader}>{String(translate('member_list_quick_view_title')).toUpperCase()}</div>
            <div css={popoverText}>
              <div>{`${translate('member_list_quick_view_last_login')}: ${formatDate(rowData?.lastLoginDate)}`}</div>
              <div>{`${translate('member_list_quick_view_registration')}: ${formatDate(
                rowData?.registrationDate
              )}`}</div>
              <div>{`${translate('member_list_quick_view_member_since')}: ${registrationAgeStr}`}</div>
            </div>
          </Popover>
        </div>
      </div>
    );
  };

  const jobTitleColumnRenderer = (_cellData, { rowData }): JSX.Element => (
    <p css={normalText} data-dd-privacy="mask">
      {rowData.jobTitle || '-'}
    </p>
  );

  const companyNameColumnRenderer = (_cellData, { rowData }): JSX.Element => (
    <p css={normalText} data-dd-privacy="mask">
      {rowData.companyName || '-'}
    </p>
  );

  const emailColumnRenderer = (_cellData, { rowData }): JSX.Element => (
    <p css={normalText} data-dd-privacy="mask">
      {rowData.emailAddress || '-'}
    </p>
  );

  const regDateColumnRenderer = (_cellData, { rowData }): JSX.Element => (
    <p css={normalText}>{formatDate(rowData.registrationDate) || '-'}</p>
  );

  const [showModal, setShowModal] = useState<boolean>(false);
  const actions = [
    {
      icon: TrashIcon,
      onClick: () => setShowModal(true),
      text: translate('members_list_total_count_remove_button_text', {
        count: selected.length
      }),
      value: 'Delete'
    }
  ];
  const handleMultiSelectAction = useCallback(
    ({ rowName }) => {
      setSelected([rowName]);
    },
    [setSelected]
  );
  const onSelectCallback = useCallback(
    (rowName, { isSelected }) => {
      if (isSelected) {
        setSelected(selected.filter(selectedRowName => selectedRowName !== rowName));
      } else if (selected.length <= MAXIMUM_MEMBERS_SELECTIONS_FOR_DELETION) {
        setSelected([...selected, rowName]);
      }
    },
    [selected, setSelected]
  );

  return (
    <div css={tableWrapper}>
      {memberListRemoveFeature && selected.length > MAXIMUM_MEMBERS_SELECTIONS_FOR_DELETION && (
        <div css={{ marginBottom: '1rem' }}>
          <PageAlert
            appearance="danger"
            dismissible={false}
            content={translate('member_list_max_members_selected_limit_reached')}
            testID="member-list-alert-form-success"
          />
        </div>
      )}
      {memberListRemoveFeature && selected.length > 0 && selected.length <= MAXIMUM_MEMBERS_SELECTIONS_FOR_DELETION && (
        <Breakpoints>
          <BulkActionBar
            actions={actions}
            testID="member-list"
            label={{
              standard: translate('members_list_total_count_selected', {
                count: selected.length
              }),
              truncated: `${selected.length}`
            }}
            onDismiss={() => setSelected([])}
          />
        </Breakpoints>
      )}
      <ConfirmationModal
        header={translate('members_list_total_count_selected_confirmation_header_text', {
          count: selected.length
        })}
        content={translate('members_list_total_count_selected_confirmation_text', {
          count: selected.length
        })}
        cancelText={translate('member_list_confirmation_cancel_text')}
        confirmationText={translate('member_list_confirmation_remove_text')}
        confirmationAction={() => {
          setShowModal(false);
          setSelected([]);
          onUpdateMemberStatus(selected.map(member => member));
        }}
        setIsModalOpen={setShowModal}
        isModalOpen={showModal}
        showDismissButton
      />
      <Table
        data={memberList}
        rowMode={memberListRemoveFeature ? 'multi-select' : null}
        externallySorted
        striped
        testID="member-list-table"
        selected={selected}
        onSelect={memberListRemoveFeature ? onSelectCallback : null}
        onMultiSelectAction={
          memberListRemoveFeature
            ? rowName => {
                handleMultiSelectAction(rowName);
              }
            : null
        }
        onColumnClick={onColumnClick}
        sortDirection={sortDirection}
        sortColumn={sortColumn}
        empty={loadingSortedData ? <LoadingSpinner size="m" /> : null}
      >
        <TableColumn
          name="firstName"
          heading={translate('member_list_table_header_name')}
          minWidth={225}
          cellRenderer={nameColumnRenderer}
          sortable
        />
        <TableColumn
          name="jobTitle"
          heading={translate('member_list_table_header_title')}
          cellRenderer={jobTitleColumnRenderer}
          sortable
        />
        <TableColumn
          name="companyName"
          heading={translate('member_list_table_header_company')}
          hideWhenCollapsed
          cellRenderer={companyNameColumnRenderer}
          sortable
        />
        <TableColumn
          name="emailAddress"
          heading={translate('member_list_table_header_email')}
          hideWhenCollapsed
          cellRenderer={emailColumnRenderer}
          sortable
        />
        <TableColumn
          name="registrationDate"
          heading={translate('member_list_table_header_registrationDate')}
          hideWhenCollapsed
          cellRenderer={regDateColumnRenderer}
          sortable
          width={300}
        />
      </Table>
      {loadingMoreMembers && <LoadingSpinner size="m" testID="loading-more-members-spinner" />}
    </div>
  );
}

interface Props {
  membersData: Array<MemberListData>;
  centerId: string;
  loadingMoreMembers: boolean;
  onSort: (
    sortColumn:
      | typeof MEMBER_FIRST_NAME
      | typeof MEMBER_JOB_TITLE
      | typeof MEMBER_COMPANY_NAME
      | typeof MEMBER_EMAIL_ADDRESS
      | typeof MEMBER_REGISTRATION_DATE,
    sortOrder: typeof ASC | typeof DESC | undefined
  ) => void;
  loadingSortedData: boolean;
  selected: string[];
  onUpdateMemberStatus: (val: string[]) => void;
  setSelected: React.Dispatch<React.SetStateAction<string[]>>;
}

export default ViewMemberList;

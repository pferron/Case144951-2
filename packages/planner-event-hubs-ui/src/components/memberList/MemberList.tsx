import Header from '@components/Header';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useTranslate } from 'nucleus-text';
import { useStyle } from '@hooks/useStyle';
import { Breadcrumbs, Breadcrumb as Crumb } from '@cvent/carina/components/Breadcrumbs';
import {
  MEMBER_LIST_PAGE_LIMIT,
  VIDEO_HUB_PATH_PARAM_KEY,
  VIDEO_HUBS_URL,
  VIDEO_HUB_INFORMATION_URL,
  ASC,
  DESC,
  MEMBER_FIRST_NAME,
  MEMBER_JOB_TITLE,
  MEMBER_COMPANY_NAME,
  MEMBER_EMAIL_ADDRESS,
  HUB_OVERVIEW_URL
} from '@utils/constants';
import { MemberListStyle } from '@components/memberList/style';
import { ScrollViewWithBars } from '@cvent/carina/components/ScrollViewWithBars';
import { SearchFilter } from '@components/common/SearchFilter';
import { useMutation, useQuery } from '@apollo/client';
import { MemberListPaginatedResult } from '@cvent/planner-event-hubs-model/types';
import LoadingWrapper from '@components/common/loading/LoadingWrapper';
import ViewMemberList from '@components/memberList/ViewMemberList';
import HeroErrorShrug from '@cvent/carina/components/Illustrations/HeroErrorShrug';
import HeroBuild from '@cvent/carina/components/Illustrations/HeroBuild';
import {
  TemplateActions as Actions,
  IllustrationContent,
  IllustrationHeader,
  IllustrationNotice
} from '@cvent/carina/components/Templates';
import { ActionType } from '@cvent/carina/components/Templates/utils/helpers';
import useInfiniteScroll from '@hooks/useInfiniteScroll';
import { removeUnsupportedCharactersForSearch } from '@utils/sanitizeSearchText';
import { useMembersData } from '@hooks/MembersDataProvider';
import { SEARCH_MEMBER_LIST, updateMemberStatus } from '@cvent/planner-event-hubs-model/operations/memberList';
import { useAppFeatures } from '@components/AppFeaturesProvider';
import { LOG } from '@server/RedisConfig';
import { PageAlert } from '@cvent/carina/components/Alert';

function MemberList({ centerId, centerTitle }: Props): JSX.Element {
  const { translate } = useTranslate();
  const { outerContainer, innerContainer, searchBarStyle, listContainer, totalMembersLabelStyle } =
    useStyle(MemberListStyle);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const memberTableRef = useRef(null);
  const [loadingMoreMembers, setLoadingMoreMembers] = useState<boolean>(false);
  const [loadingSortedData, setLoadingSortedData] = useState<boolean>(false);
  const { setMembersListData } = useMembersData();
  const { hubOverviewFeature } = useAppFeatures();
  const [selected, setSelected] = useState<Array<string>>([]);
  const [selectedMembers, setSelectedMembers] = useState<Array<string>>([]);
  const [showAlertSuccess, setShowAlertSuccess] = useState(false);
  const [showFailureAlert, setShowFailureAlert] = useState(false);
  const headerBreadCrumbs: JSX.Element = (
    <Breadcrumbs>
      <Crumb href={VIDEO_HUBS_URL}>{translate('video_hubs_header_title')}</Crumb>
      <Crumb
        href={
          hubOverviewFeature
            ? HUB_OVERVIEW_URL.replace(VIDEO_HUB_PATH_PARAM_KEY, centerId)
            : VIDEO_HUB_INFORMATION_URL.replace(VIDEO_HUB_PATH_PARAM_KEY, centerId)
        }
      >
        {centerTitle}
      </Crumb>
      <Crumb>{translate('member_list_title')}</Crumb>
    </Breadcrumbs>
  );

  const {
    data: membersListResult,
    loading: loadingMemberList,
    fetchMore: fetchMoreMembers,
    refetch: refetchMemberlist,
    error
  } = useQuery(SEARCH_MEMBER_LIST, {
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first',
    variables: {
      input: {
        centerId,
        pageLimit: MEMBER_LIST_PAGE_LIMIT,
        searchTerm: removeUnsupportedCharactersForSearch(searchTerm)
      }
    },
    onCompleted: ({ searchMemberList }: { searchMemberList: MemberListPaginatedResult }) => {
      setMembersListData(searchMemberList.data);
    }
  });

  const [updateMemberStatusMutation, { loading: updateMembersStatusLoading }] = useMutation(updateMemberStatus);

  const loadMoreMembers = useCallback(async () => {
    if (membersListResult?.searchMemberList?.paging?.nextToken && !loadingMoreMembers) {
      setLoadingMoreMembers(true);
      await fetchMoreMembers({
        variables: {
          input: {
            centerId,
            pageLimit: MEMBER_LIST_PAGE_LIMIT,
            token: membersListResult.searchMemberList.paging.nextToken
          }
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult?.searchMemberList?.data) {
            setLoadingMoreMembers(false);
            return prev;
          }

          return {
            searchMemberList: {
              ...fetchMoreResult.searchMemberList,
              data: [...prev.searchMemberList.data, ...fetchMoreResult.searchMemberList.data]
            }
          };
        }
      });
      setLoadingMoreMembers(false);
    }
  }, [loadingMoreMembers, membersListResult?.searchMemberList?.paging, centerId, fetchMoreMembers]);

  const onUpdateMemberStatus = useCallback(
    async (memberIds: string[]): Promise<void> => {
      setSelectedMembers(memberIds);
      await updateMemberStatusMutation({
        variables: {
          input: {
            memberIds,
            hubId: centerId
          }
        },
        onCompleted: () => {
          refetchMemberlist();
          setShowAlertSuccess(true);
        },
        onError: apolloError => {
          setShowFailureAlert(true);
          LOG.error(apolloError, 'Failed to remove members for hubId', centerId);
        }
      });
    },
    [centerId, refetchMemberlist, updateMemberStatusMutation]
  );

  useInfiniteScroll(loadMoreMembers, memberTableRef, {
    bottomScrollLeft: 300,
    immediate: false
  });

  const actions: ActionType[] = useMemo(
    () => [
      {
        label: translate('member_list_clear_search_button_text'),
        value: translate('member_list_clear_search_button_text'),
        onClick: (): void => {
          setSearchTerm('');
        }
      }
    ],
    [translate]
  );

  const sortMemberListData = useCallback(
    async (
      sortColumn:
        | typeof MEMBER_FIRST_NAME
        | typeof MEMBER_JOB_TITLE
        | typeof MEMBER_COMPANY_NAME
        | typeof MEMBER_EMAIL_ADDRESS,
      sortOrder: typeof ASC | typeof DESC
    ) => {
      setLoadingSortedData(true);
      await fetchMoreMembers({
        variables: {
          input: {
            centerId,
            pageLimit: MEMBER_LIST_PAGE_LIMIT,
            searchTerm: removeUnsupportedCharactersForSearch(searchTerm),
            sort: `${sortColumn}:${sortOrder}`
          }
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult?.searchMemberList?.data) {
            setLoadingMoreMembers(false);
            return prev;
          }
          return {
            searchMemberList: fetchMoreResult.searchMemberList
          };
        }
      });
      setLoadingSortedData(false);
    },
    [fetchMoreMembers, centerId, searchTerm]
  );

  const emptyPage: JSX.Element = useMemo(
    () => (
      <IllustrationNotice
        testID="empty-member-list-page-container"
        illustration={HeroBuild}
        aria-label={translate('member_list_empty_page_message_header')}
        title={translate('member_list_empty_page_message_header')}
      >
        <IllustrationHeader>{translate('member_list_empty_page_message_header')}</IllustrationHeader>
        <IllustrationContent>{translate('member_list_empty_page_message_content')}</IllustrationContent>
      </IllustrationNotice>
    ),
    [translate]
  );

  const noDataPage: JSX.Element = useMemo(
    () => (
      <IllustrationNotice
        testID="no_data-member-list-page-container"
        illustration={HeroErrorShrug}
        aria-label={translate('member_list_empty_page_message_header')}
        title={translate('member_list_empty_page_message_header')}
      >
        <IllustrationHeader>{translate('member_list_no_data_message_header')}</IllustrationHeader>
        <Actions actions={actions} position="center" />
      </IllustrationNotice>
    ),
    [translate, actions]
  );

  const errorPage: JSX.Element = useMemo(() => {
    if (!searchTerm) {
      return emptyPage;
    }
    return noDataPage;
  }, [searchTerm, emptyPage, noDataPage]);

  const memberListBody = useCallback(
    () => (
      <>
        <div css={innerContainer}>
          {showAlertSuccess && (
            <div css={{ margin: '1.5rem' }}>
              <PageAlert
                appearance="success"
                content={translate('members_list_total_count_selected_success_alert_text', {
                  count: selectedMembers.length
                })}
                dismissible
                onDismiss={() => setShowAlertSuccess(false)}
                testID="member-list-alert-form-success"
              />
            </div>
          )}
          {showFailureAlert && (
            <div css={{ margin: '1.5rem' }}>
              <PageAlert
                appearance="danger"
                content={translate('member_list_failure_alert_text')}
                dismissible
                onDismiss={() => {
                  setShowFailureAlert(false);
                }}
                testID="member-list-alert-form-error"
              />
            </div>
          )}
          {(membersListResult?.searchMemberList?.data.length > 0 || searchTerm !== '') && (
            <div css={searchBarStyle}>
              <SearchFilter
                setSearchTerm={setSearchTerm}
                searchTerm={searchTerm}
                label={translate('member_list_search_label')}
                testID="member-list"
                searchBtnAccessibilityLabel={translate('member_list_search_label')}
                clearSearchBtnAccessibilityLabel={translate('member_list_clear_search_button_text')}
                searchInputAccessibilityLabel={translate('member_list_search_label')}
              />
            </div>
          )}
        </div>
        <div css={listContainer}>
          {membersListResult?.searchMemberList?.data.length === 0 ? (
            errorPage
          ) : (
            <div>
              {selected.length === 0 && (
                <p css={totalMembersLabelStyle}>
                  {`${translate('member_list_total_members_label')}: ${
                    membersListResult.searchMemberList?.paging?.totalCount || 0
                  }`}
                </p>
              )}
              <ViewMemberList
                membersData={membersListResult.searchMemberList.data}
                centerId={centerId}
                selected={selected}
                setSelected={setSelected}
                onUpdateMemberStatus={onUpdateMemberStatus}
                loadingMoreMembers={loadingMoreMembers}
                onSort={sortMemberListData}
                loadingSortedData={loadingSortedData}
              />
            </div>
          )}
        </div>
      </>
    ),
    [
      membersListResult,
      innerContainer,
      searchTerm,
      searchBarStyle,
      showAlertSuccess,
      selectedMembers.length,
      showFailureAlert,
      centerId,
      onUpdateMemberStatus,
      selected,
      setSelected,
      loadingMoreMembers,
      errorPage,
      listContainer,
      sortMemberListData,
      loadingSortedData,
      translate,
      totalMembersLabelStyle
    ]
  );

  const memberListHeader: JSX.Element = (
    <div css={innerContainer}>
      <Header title={translate('member_list_title')} breadCrumbs={headerBreadCrumbs} testID="member-list-header" />
    </div>
  );

  return (
    <div css={outerContainer}>
      <ScrollViewWithBars forwardScrollViewRef={memberTableRef} header={memberListHeader}>
        <LoadingWrapper
          loading={(loadingMemberList && !loadingMoreMembers) || updateMembersStatusLoading}
          renderer={memberListBody}
          errors={[error]}
        />
      </ScrollViewWithBars>
    </div>
  );
}

interface Props {
  centerId: string;
  centerTitle: string;
}

export default MemberList;

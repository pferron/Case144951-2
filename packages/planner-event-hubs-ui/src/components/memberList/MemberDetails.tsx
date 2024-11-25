import Header from '@components/Header';
import React, { useCallback, useState } from 'react';
import { useTranslate } from 'nucleus-text';
import { useStyle } from '@hooks/useStyle';
import { Breadcrumbs, Breadcrumb as Crumb } from '@cvent/carina/components/Breadcrumbs';
import {
  HUB_OVERVIEW_URL,
  MEMBER_ID,
  MEMBER_LIST_URL,
  VIDEO_HUB_INFORMATION_URL,
  VIDEO_HUB_PATH_PARAM_KEY,
  VIDEO_HUB_URL,
  VIDEO_HUBS_URL
} from '@utils/constants';
import { MemberDetailsStyle } from '@components/memberList/style';
import useQueryParams from '@hooks/useQueryParam';
import { Button } from '@cvent/carina/components/Button';
import LoginWebLink from '@components/memberList/LoginWebLink';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { LoggerFactory } from '@cvent/logging/LoggerFactory';
import { buildMemberLoginUrl } from '@utils/memberUtils';
import { injectTestId } from '@cvent/nucleus-test-automation';
import { LoadingSpinner } from '@cvent/carina/components/LoadingSpinner';
import { AlertTriangleIcon } from '@cvent/carina/components/Icon';
import { useTheme } from '@cvent/carina/components/ThemeProvider/useTheme';
import { useMembersData } from '@hooks/MembersDataProvider';
import { MemberData, MemberListData } from '@cvent/planner-event-hubs-model/types';
import { GET_MEMBER_PROFILE_DATA } from '@cvent/planner-event-hubs-model/operations/profile';
import { memberLogin } from '@cvent/planner-event-hubs-model/operations/login';
import { useMeasurePageLoad, usePageActions } from '@cvent/sli-nextjs-metrics';
import { useAppFeatures } from '@components/AppFeaturesProvider';
import { useCenterInfo } from '@hooks/useCenterInfo';
import { ActionType } from '@cvent/carina/components/Templates/utils/helpers';
import ConfirmationModal from '@components/common/ConfirmationModal';
import { updateMemberStatus } from '@cvent/planner-event-hubs-model/operations/memberList';
import { useRouter } from 'next/router';
import { PageAlert } from '@cvent/carina/components/Alert';

const LOG = LoggerFactory.create('MemberDetails');

function MemberDetails({ centerId }: Props): JSX.Element {
  const { translate, date } = useTranslate();
  const {
    outerContainer,
    innerContainer,
    container,
    fieldContainer,
    fieldValueStyle,
    fieldStyle,
    loginHeadingStyle,
    loginLinkButtonStyle,
    linkNoteStyle,
    errorLinkStyle,
    linkGenerateErrorStyle,
    linkGenerateContainerStyle,
    limitExceedContainerStyle
  } = useStyle(MemberDetailsStyle);
  const query = useQueryParams();
  const memberId = query[MEMBER_ID] as string;
  const { font } = useTheme();
  const { membersListData } = useMembersData();
  const [memberDetail, setMemberDetail] = useState<MemberListData>(
    (membersListData && membersListData.find(data => data.id === memberId)) || null
  );
  const { getBaseProps } = usePageActions();
  const baseProps = getBaseProps();
  const { hubOverviewFeature, memberListRemoveFeature } = useAppFeatures();
  const [showModal, setShowModal] = useState<boolean>(false);
  const { centerTitle, hubUrl } = useCenterInfo();
  const [updateMemberStatusMutation, { loading: updateMembersStatusLoading }] = useMutation(updateMemberStatus);
  const router = useRouter();
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
      <Crumb href={VIDEO_HUB_URL.replace(VIDEO_HUB_PATH_PARAM_KEY, `${centerId}/members`)}>
        {translate('member_list_title')}
      </Crumb>
      <Crumb>{translate('member_details_title')}</Crumb>
    </Breadcrumbs>
  );
  const headerActions: ActionType[] = [
    {
      value: translate('member_details_page_remove_button'),
      appearance: 'lined',
      onClick: () => setShowModal(true),
      label: translate('member_details_page_remove_button')
    }
  ];

  const onUpdateMemberStatus = useCallback(
    async (memberIds: string[]): Promise<void> => {
      await updateMemberStatusMutation({
        variables: {
          input: {
            memberIds,
            hubId: centerId
          }
        },
        onCompleted: () => {
          const redirection = MEMBER_LIST_URL.replace(VIDEO_HUB_PATH_PARAM_KEY, centerId);
          router.push({
            pathname: redirection
          });
          LOG.info('Successfully removed members for hubId', centerId);
          setShowAlertSuccess(true);
        },
        onError: apolloError => {
          setShowFailureAlert(true);
          LOG.error(apolloError, 'Failed to remove members for hubId', centerId);
        }
      });
    },
    [centerId, router, updateMemberStatusMutation]
  );

  const { loading: loadingMemberData, error: errorInMemberData } = useQuery(GET_MEMBER_PROFILE_DATA, {
    fetchPolicy: 'cache-and-network',
    variables: {
      input: {
        centerId,
        contactId: memberId
      }
    },
    onCompleted: ({ getMemberData }: { getMemberData: MemberData }) => {
      const profileData = getMemberData.profile;
      setMemberDetail({
        id: memberId,
        companyName: profileData?.companyName,
        emailAddress: profileData.emailAddress,
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        jobTitle: profileData?.jobTitle,
        mobileNumber: profileData?.mobileNumber,
        lastLoginDate: profileData?.lastLoginDate,
        registrationDate: profileData?.registrationDate,
        registrationAge: profileData?.registrationAge
      });
    },
    skip: memberDetail !== null
  });

  const [error, setError] = useState(false);
  const [linkState, setLinkState] = useState({
    loginLink: null,
    expirationDateTime: null,
    emailLocked: false
  });

  useMeasurePageLoad({
    pageIsLoading: (): boolean => loadingMemberData,
    pageError: () => errorInMemberData,
    data: { ...baseProps }
  });

  const browserTimeZone =
    new Intl.DateTimeFormat().resolvedOptions().timeZone !== 'Etc/Unknown'
      ? new Intl.DateTimeFormat().resolvedOptions().timeZone
      : 'Etc/UTC';

  const [generateLoginLink, { data: memberLoginResponse, loading: fetchingLoginResponse }] = useLazyQuery(memberLogin, {
    fetchPolicy: 'network-only',
    variables: {
      memberLoginInput: {
        hubId: centerId,
        memberInfo: {
          firstName: memberDetail?.firstName,
          lastName: memberDetail?.lastName,
          email: memberDetail?.emailAddress
        }
      }
    },
    onError: apolloError => {
      setError(true);
      LOG.error(apolloError, 'Failed to generate login link');
    },
    onCompleted: data => {
      const loginLinkByPlanner = buildMemberLoginUrl({
        centerId,
        centerUrl: hubUrl,
        requestId: data?.memberLogin?.id
      });
      const expirationDate = new Date(memberLoginResponse?.memberLogin?.expirationDate);
      const expirationTime = date(expirationDate, {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short',
        timeZone: browserTimeZone
      });
      setLinkState({
        loginLink: loginLinkByPlanner,
        emailLocked: data?.memberLogin?.emailLocked,
        expirationDateTime: expirationTime
      });
    }
  });

  return (
    <div css={outerContainer}>
      <Header
        title={translate('member_details_title')}
        breadCrumbs={headerBreadCrumbs}
        actions={memberListRemoveFeature && headerActions}
      />
      {showAlertSuccess && (
        <div css={{ margin: '1.5rem' }}>
          <PageAlert
            appearance="success"
            content={translate('members_list_total_count_selected_success_alert_text', {
              count: 1
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
      <ConfirmationModal
        header={translate('members_list_total_count_selected_confirmation_header_text', {
          count: 1
        })}
        content={translate('members_list_total_count_selected_confirmation_text', {
          count: 1
        })}
        cancelText={translate('member_list_confirmation_cancel_text')}
        confirmationText={translate('member_list_confirmation_remove_text')}
        confirmationAction={() => {
          setShowModal(false);
          onUpdateMemberStatus([memberId].map(member => member));
        }}
        setIsModalOpen={setShowModal}
        isModalOpen={showModal}
        showDismissButton
      />
      {loadingMemberData || updateMembersStatusLoading ? (
        <LoadingSpinner {...injectTestId('member-basic-info-spinner')} size="l" />
      ) : (
        <>
          <div css={innerContainer}>
            <h2 css={{ margin: '-0.125rem', paddingRight: '0.25rem', fontSize: font.base.size.h3 }}>
              {translate('member_basic_information_heading')}
            </h2>

            <div css={container}>
              <div css={fieldContainer}>
                <div css={fieldStyle}>{translate('member_first_name')}</div>
                <span css={fieldValueStyle}>{memberDetail?.firstName || '-'}</span>
              </div>

              <div css={fieldContainer}>
                <div css={fieldStyle}>{translate('member_last_name')}</div>
                <span css={fieldValueStyle}>{memberDetail?.lastName || '-'}</span>
              </div>
            </div>

            <div css={container}>
              <div css={fieldContainer}>
                <div css={fieldStyle}>{translate('member_title')}</div>
                <span data-dd-privacy="mask" css={fieldValueStyle}>
                  {memberDetail?.jobTitle || '-'}
                </span>
              </div>

              <div css={fieldContainer}>
                <div css={fieldStyle}>{translate('member_company')}</div>
                <span data-dd-privacy="mask" css={fieldValueStyle}>
                  {memberDetail?.companyName || '-'}
                </span>
              </div>
            </div>

            <div css={fieldContainer}>
              <div css={fieldStyle}>{translate('member_email_id')}</div>
              <span data-dd-privacy="mask" css={fieldValueStyle}>
                {memberDetail?.emailAddress || '-'}
              </span>
            </div>

            <div css={fieldContainer}>
              <div data-dd-privacy="mask" css={fieldStyle}>
                {translate('member_phone_no')}
              </div>
              <span css={fieldValueStyle}>{memberDetail?.mobileNumber || '-'}</span>
            </div>
          </div>
          {fetchingLoginResponse ? (
            <LoadingSpinner {...injectTestId('login-link-spinner')} size="m" />
          ) : (
            <div css={innerContainer}>
              <h3 css={loginHeadingStyle}>{translate('member_details_generate_login_text')}</h3>
              {linkState.loginLink && !linkState.emailLocked ? (
                <div>
                  <LoginWebLink
                    url={linkState.loginLink}
                    generateLoginLink={generateLoginLink}
                    expirationDateTime={linkState.expirationDateTime}
                  />
                </div>
              ) : (
                <>
                  {error && (
                    <div css={linkGenerateContainerStyle}>
                      <div css={{ display: 'flex' }}>
                        <div css={{ padding: '0.125rem 1rem 0rem 0rem' }}>
                          <AlertTriangleIcon size="m" />
                        </div>
                        <div css={linkGenerateErrorStyle} {...injectTestId('expired-link-message')}>
                          {translate('member_details_link_generation_error')}
                        </div>
                      </div>
                    </div>
                  )}
                  <div css={loginLinkButtonStyle}>
                    <Button
                      appearance="filled"
                      size="m"
                      testID="generate-login-link-button"
                      text={translate('member_details_generate_link_button_text')}
                      onClick={() => {
                        generateLoginLink();
                      }}
                      accessibilityLabel={translate('member_details_generate_link_button_text')}
                      disabled={error || linkState.emailLocked}
                    />
                  </div>
                  {linkState.emailLocked && (
                    <div css={limitExceedContainerStyle}>
                      <div css={{ padding: '0.125rem 0.5rem 0rem 0rem' }}>
                        <AlertTriangleIcon color={font.color.danger.base} size="s" />
                      </div>
                      <div css={errorLinkStyle} {...injectTestId('expired-link-message')}>
                        {translate('member_details_limit_exceed_warning')}
                      </div>
                    </div>
                  )}
                  {!error && !linkState.emailLocked && (
                    <div css={linkNoteStyle}>{translate('member_details_login_one_time_generation_note')}</div>
                  )}
                </>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

interface Props {
  centerId: string;
}

export default MemberDetails;

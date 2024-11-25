import { useTranslate } from 'nucleus-text';
import { useStyle } from '@hooks/useStyle';
import { Breadcrumbs, Breadcrumb as Crumb } from '@cvent/carina/components/Breadcrumbs';
import {
  VIDEO_HUB_PATH_PARAM_KEY,
  VIDEO_HUB_URL,
  VIDEO_HUBS_URL,
  VIDEO_HUB_INFORMATION_URL,
  MAX_ROWS_IN_CODE_SNIPPET_TABLE,
  HUB_OVERVIEW_URL
} from '@utils/constants';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Header from '@components/Header';
import CodeSnippetsList from '@components/tracking-codes/CodeSnippetsList';
import NewCodeSnippetsList from '@components/tracking-codes/NewCodeSnippetsList';
import { TrackingCodesStyle } from '@components/tracking-codes/styles';
import ScrollViewWithBars from '@cvent/carina/components/ScrollViewWithBars/ScrollViewWithBars';
import LoadingWrapper from '@components/common/loading/LoadingWrapper';
import { useMutation, useQuery } from '@apollo/client';
import {
  saveCodeSnippet,
  updateCodeSnippet,
  removeCodeSnippet
} from '@cvent/planner-event-hubs-model/operations/trackingCodes';
import { CodeSnippet, AccountCodeSnippet, Hub, HubUpdate } from '@cvent/planner-event-hubs-model/types';
import { getAccountCodeSnippets } from '@cvent/planner-event-hubs-model/operations/snapshot';
import { PageAlert } from '@cvent/carina/components/Alert/PageAlert';
import {
  SET_UTM_OVERRIDES,
  UPDATE_VIDEO_HUB,
  GET_UTM_OVERRIDES,
  getHubCodeSnippets,
  GET_VIDEO_HUB
} from '@cvent/planner-event-hubs-model/operations/hub';
import { useAppFeatures } from '@components/AppFeaturesProvider';
import { GoogleAnalytics } from '@components/tracking-codes/GoogleAnalytics';
import { NewGoogleAnalytics } from '@components/tracking-codes/NewGoogleAnalytics';
import { LOG } from '@server/RedisConfig';
import {
  getGoogleMeasurementQuery,
  saveGoogleMeasurementMutation
} from '@cvent/planner-event-hubs-model/src/operations/trackingCodes';
import { omit } from 'lodash';
import { accountConfig as getAccountConfig } from '@cvent/planner-event-hubs-model/operations/coreSOA';
import NavigationConfirmationModal from '@components/common/NavigationConfirmationModal';
import LeavePageAlert from '@components/common/LeavePageAlert';
import TrackingParameters from './TrackingParameters';
import NewTrackingParameters from './NewTrackingParameters';

export interface HubCodeSnippet {
  codeSnippetId: string;
  name: string;
  dataTagCode: string;
  status: string;
  disableCodeSnippets: string;
  applicableOn: string;
  addToAllPages: boolean;
  addToLoginPage: boolean;
  addToSingleVideoPage: boolean;
}

export enum TargetWebPages {
  AllVcPages = 'ALL_VC_PAGES',
  Login = 'LOGIN',
  SingleVideosPage = 'SINGLE_VIDEOS_PAGE'
}

export function TrackingCodes({ videoCenterId, videoCenterTitle }: Props): React.JSX.Element {
  const { translate } = useTranslate();
  const { outerContainer, alertWrapperStyles } = useStyle(TrackingCodesStyle);
  const { hubOverviewFeature, videoCenterInformationFeature } = useAppFeatures();
  const { data: accountConfig } = useQuery(getAccountConfig);
  const allowGoogleAnalytics = accountConfig?.accountConfig?.AccountFeatures?.GeneralFeatures?.AllowGoogleAnalytics;
  const allowCodeSnippets = accountConfig?.accountConfig?.AccountFeatures?.GeneralFeatures?.AllowCodeSnippets;
  const [isPageEdited, setIsPageEdited] = useState<boolean>(false);
  const [showFailureAlert, setShowFailureAlert] = useState(false);
  const [failureAlertContent, setFailureAlertContent] = useState('');
  const [showNavigationConfirmationModal, setShowNavigationConfirmationModal] = useState(false);

  const headerBreadCrumbs: JSX.Element = (
    <Breadcrumbs>
      <Crumb href={VIDEO_HUBS_URL}>{translate('video_hubs_header_title')}</Crumb>
      <Crumb
        href={
          hubOverviewFeature
            ? HUB_OVERVIEW_URL.replace(VIDEO_HUB_PATH_PARAM_KEY, videoCenterId)
            : VIDEO_HUB_INFORMATION_URL.replace(VIDEO_HUB_PATH_PARAM_KEY, videoCenterId)
        }
      >
        {videoCenterTitle}
      </Crumb>
      <Crumb href={VIDEO_HUB_URL.replace(VIDEO_HUB_PATH_PARAM_KEY, videoCenterId)}>
        {translate('tracking_code_side_nav_text')}
      </Crumb>
    </Breadcrumbs>
  );

  const [codeSnippets, setCodeSnippets] = useState([]);
  const [alertState, setAlertState] = useState({
    alertText: '',
    showAlert: false
  });
  const [accountCodeSnippets, setAccountCodeSnippets] = useState([]);
  const [index, setIndex] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [tableData, setTableData] = useState<Array<HubCodeSnippet>>([]);
  const [measurementId, setMeasurementId] = useState('');
  const [editCodeSnippet, setEditCodeSnippet] = useState(false);
  const [editTrackingParameters, setEditTrackingParameters] = useState(false);
  const [trackingParameters, setTrackingParameters] = useState([]);
  const [editMeasurementId, setEditMeasurementId] = useState(false);
  const [isEdited, setIsEdited] = useState<boolean>(false);
  const [isMeasurementIDEdited, setIsMeasurementIDEdited] = useState<boolean>(false);

  const { data: videoCenterData } = useQuery(GET_VIDEO_HUB, {
    variables: { hubID: { id: videoCenterId } }
  });
  const initialHub = videoCenterData?.hub;
  const hubConfig = videoCenterData?.hub?.config;
  const hubConfigWithDefault = {
    ...hubConfig,
    utmOverride: hubConfig?.utmOverride ? hubConfig.utmOverride : 'use-existing-parameter'
  };
  const [existingParam, setExistingParam] = useState(hubConfigWithDefault);

  useEffect(() => {
    setTableData(codeSnippets.slice(index, index + MAX_ROWS_IN_CODE_SNIPPET_TABLE));
    setTotalCount(codeSnippets.length);
  }, [codeSnippets, index]);

  const onNext = useCallback(() => {
    const temp = index + MAX_ROWS_IN_CODE_SNIPPET_TABLE;
    setIndex(index + MAX_ROWS_IN_CODE_SNIPPET_TABLE);
    setTableData(codeSnippets.slice(temp, temp + MAX_ROWS_IN_CODE_SNIPPET_TABLE));
  }, [index, codeSnippets]);

  const onPrevious = useCallback(() => {
    const temp = index - MAX_ROWS_IN_CODE_SNIPPET_TABLE;
    setIndex(index - MAX_ROWS_IN_CODE_SNIPPET_TABLE);
    setTableData(codeSnippets.slice(temp, temp + MAX_ROWS_IN_CODE_SNIPPET_TABLE));
  }, [index, codeSnippets]);

  const isNextPageAvailable = useMemo(() => index + MAX_ROWS_IN_CODE_SNIPPET_TABLE < totalCount, [index, totalCount]);

  const { loading: fetchingData, error: getAccountCodeSnippetsError } = useQuery(getAccountCodeSnippets, {
    fetchPolicy: 'network-only',
    onCompleted: data => {
      setAccountCodeSnippets(data?.getAccountCodeSnippets?.accountCodeSnippets);
    }
  });

  const {
    loading: fetchingVideoCenterCodeSnippets,
    refetch: refetchCodeSnippet,
    error: getHubCodeSnippetsError
  } = useQuery(getHubCodeSnippets, {
    fetchPolicy: 'cache-and-network',
    skip: fetchingData,
    variables: {
      hubId: `${videoCenterId}`
    },
    onCompleted: data => {
      const hubCodeSnippet = data?.getHubCodeSnippets;

      const accountCodeSnippetMap = new Map<string, AccountCodeSnippet>();
      accountCodeSnippets.forEach(accountSnippet =>
        accountCodeSnippetMap.set(accountSnippet.codeSnippetId, accountSnippet)
      );
      const hubAssociatedSnippets = hubCodeSnippet
        .filter(codeSnippet => accountCodeSnippets.some(element => codeSnippet.codeSnippetId === element.codeSnippetId))
        .map(codeSnippet => ({
          ...codeSnippet,
          applicableOn: codeSnippet.applicableOn,
          addToAllPages: codeSnippet.targetWebPages.includes(TargetWebPages.AllVcPages),
          addToLoginPage: codeSnippet.targetWebPages.includes(TargetWebPages.Login),
          addToSingleVideoPage: codeSnippet.targetWebPages.includes(TargetWebPages.SingleVideosPage),
          name: accountCodeSnippetMap.get(codeSnippet.codeSnippetId).codeSnippetName,
          dataTagCode: accountCodeSnippetMap.get(codeSnippet.codeSnippetId).codeSnippetDataTagCode,
          status: accountCodeSnippetMap.get(codeSnippet.codeSnippetId).codeSnippetStatus,
          disableCodeSnippets: accountCodeSnippetMap.get(codeSnippet.codeSnippetId).isDropCodeSnippetToCookieBannerTied
            ? translate('code_snippet_table_visitors_can_turn_off_yes_text')
            : translate('code_snippet_table_visitors_can_turn_off_no_text')
        }));
      setCodeSnippets(hubAssociatedSnippets);
    }
  });

  const { loading: fetchingMeasurementId, data: measurementIdData } = useQuery(getGoogleMeasurementQuery, {
    variables: {
      hubId: videoCenterId
    },
    onCompleted: () => {
      setMeasurementId(
        prevMeasurementId => measurementIdData?.getGoogleMeasurementId?.measurementId ?? prevMeasurementId
      );
    },
    onError: apolloError => {
      LOG.error(apolloError, 'Failed to get measurementId for hubId', videoCenterId);
    }
  });

  const { loading: fetchingTrackingParameters, refetch: refetchTrackingParams } = useQuery(GET_UTM_OVERRIDES, {
    fetchPolicy: 'network-only',
    variables: { input: { id: videoCenterId } },
    onCompleted: data => {
      setTrackingParameters(data?.getUtmOverrides);
    }
  });

  const isPreviousPageAvailable = useMemo(() => index - MAX_ROWS_IN_CODE_SNIPPET_TABLE >= 0, [index]);

  const [saveCodeSnippetsMutation, { loading: savingSnippets }] = useMutation(saveCodeSnippet);
  const [updateCodeSnippetsMutation, { loading: updatingSnippets }] = useMutation(updateCodeSnippet);
  const [removeCodeSnippetsMutation, { loading: removingSnippets }] = useMutation(removeCodeSnippet);
  const [saveGoogleMeasurementIdMutation, { loading: savingMeasurementId }] =
    useMutation(saveGoogleMeasurementMutation);

  const [addParameters, { loading: savingTrackingParameter }] = useMutation(SET_UTM_OVERRIDES);
  const [updateVideoHubMutation, { loading: savingDuplicateKeyNameParameter }] = useMutation(UPDATE_VIDEO_HUB);

  function showAlertMessage(alertMessage: string) {
    setAlertState({
      alertText: alertMessage,
      showAlert: true
    });
  }
  const onSaveCodeSnippet = async (codeSnippet: CodeSnippet): Promise<void> => {
    setEditCodeSnippet(false);
    await saveCodeSnippetsMutation({
      variables: {
        input: {
          ...codeSnippet,
          hubId: videoCenterId
        }
      },
      onCompleted: data => {
        const saveCodeSnippets = data.saveCodeSnippet;
        const codeSnippetFromAccount = accountCodeSnippets.find(
          element => data.saveCodeSnippet.codeSnippetId === element.codeSnippetId
        );
        const codeSnippetToAdd: HubCodeSnippet = {
          codeSnippetId: codeSnippetFromAccount.codeSnippetId,
          name: codeSnippetFromAccount.codeSnippetName,
          dataTagCode: codeSnippetFromAccount.codeSnippetDataTagCode,
          status: codeSnippetFromAccount.codeSnippetStatus,
          disableCodeSnippets:
            codeSnippetFromAccount.isDropCodeSnippetToCookieBannerTied === true
              ? translate('code_snippet_table_visitors_can_turn_off_yes_text')
              : translate('code_snippet_table_visitors_can_turn_off_no_text'),
          applicableOn: saveCodeSnippets.applicableOn,
          addToAllPages: saveCodeSnippets.addToAllPages,
          addToLoginPage: saveCodeSnippets.addToLoginPage,
          addToSingleVideoPage: saveCodeSnippets.addToSingleVideoPage
        };

        const codeSnippetsExists = codeSnippets.some(elem => JSON.stringify(codeSnippetToAdd) === JSON.stringify(elem));
        if (!codeSnippetsExists) {
          setCodeSnippets([...codeSnippets, codeSnippetToAdd]);
        }
        showAlertMessage(
          translate('tracking_code_banner_code_snippet_add_alert_text', {
            snippetName: codeSnippetToAdd.name
          })
        );
      },
      onError: apolloError => {
        setShowFailureAlert(true);
        setFailureAlertContent(translate('tracking_codes_failure_alert_text'));
        LOG.error(apolloError, 'Failed to save code snippets for hubId', videoCenterId);
      }
    });
  };

  const onUpdateCodeSnippet = async (codeSnippet: CodeSnippet): Promise<void> => {
    setEditCodeSnippet(false);
    await updateCodeSnippetsMutation({
      variables: {
        input: {
          ...codeSnippet,
          hubId: videoCenterId
        }
      },
      onCompleted: () => {
        refetchCodeSnippet();
        showAlertMessage(translate('tracking_code_banner_code_snippet_update_alert_text'));
      },
      onError: apolloError => {
        setShowFailureAlert(true);
        setFailureAlertContent(translate('tracking_codes_failure_alert_text'));
        LOG.error(apolloError, 'Failed to update code snippets for hubId', videoCenterId);
      }
    });
  };

  const onRemoveSnippet = async (codeSnippetId: string): Promise<void> => {
    setEditCodeSnippet(false);
    await removeCodeSnippetsMutation({
      variables: {
        input: {
          codeSnippetId,
          hubId: videoCenterId
        }
      },
      onCompleted: () => {
        refetchCodeSnippet();
        if (tableData.length === 1 && index > 0) {
          onPrevious();
        }
        showAlertMessage(translate('tracking_code_banner_code_snippet_delete_alert_text'));
      },
      onError: apolloError => {
        setShowFailureAlert(true);
        setFailureAlertContent(translate('tracking_codes_failure_alert_text'));
        LOG.error(apolloError, 'Failed to remove code snippets for hubId', videoCenterId);
      }
    });
  };

  const onSaveMeasurementId = async (newMeasurementId: string): Promise<void> => {
    if (newMeasurementId !== measurementId) {
      await saveGoogleMeasurementIdMutation({
        variables: {
          input: {
            hubId: videoCenterId,
            oldMeasurementId: measurementId,
            newMeasurementId: newMeasurementId.trim()
          }
        },
        update(cache) {
          cache.writeQuery({
            query: getGoogleMeasurementQuery,
            variables: {
              hubId: videoCenterId
            },
            data: {
              getGoogleMeasurementId: {
                measurementId: newMeasurementId
              }
            }
          });
        },
        onCompleted: () => {
          showAlertMessage(translate('member_profile_update_alert_text'));
          setShowFailureAlert(false);
          setFailureAlertContent('');
        },
        onError: apolloError => {
          setShowFailureAlert(true);
          setFailureAlertContent(translate('tracking_codes_failure_alert_text'));
          LOG.error(apolloError, 'Failed to save MeasurementId for hubId', videoCenterId);
        }
      });
      setMeasurementId(newMeasurementId.trim());
    }
  };

  const onDelete = useCallback(
    (key): void => {
      const updatedParams = trackingParameters.filter(param => param.key !== key);
      const paramsToSave = updatedParams.map(data => omit(data, '__typename'));
      setTrackingParameters(paramsToSave);
      addParameters({
        variables: {
          input: {
            id: videoCenterId
          },
          data: paramsToSave
        },
        onCompleted: () => {
          refetchTrackingParams();
          setIsEdited(false);
          setTrackingParameters(paramsToSave);
          if (videoCenterInformationFeature)
            showAlertMessage(translate('tracking_code_banner_code_snippet_delete_alert_text'));
        },
        onError: apolloError => {
          setShowFailureAlert(true);
          setFailureAlertContent(translate('tracking_codes_failure_alert_text'));
          LOG.error(apolloError, 'Failed to delete tracking params for hubId', videoCenterId);
        }
      });
    },
    [trackingParameters, addParameters, videoCenterId, refetchTrackingParams, videoCenterInformationFeature, translate]
  );

  const onSaveTrackingParameters = useCallback(
    (paramList): void => {
      const newHubData: Hub = {
        ...initialHub,
        config: existingParam
      };
      const hubToSave: HubUpdate = omit(
        newHubData,
        'status',
        '__typename',
        'config.__typename',
        'theme.__typename',
        'calendar.__typename'
      );
      setEditTrackingParameters(false);
      const addedParamList = paramList.map(data => omit(data, '__typename'));
      if (isEdited) {
        addParameters({
          variables: {
            input: {
              id: videoCenterId
            },
            data: addedParamList
          },
          onCompleted: () => {
            refetchTrackingParams();
            setTrackingParameters(addedParamList);
            showAlertMessage(translate('tracking_code_banner_code_snippet_update_alert_text'));
          },
          onError: apolloError => {
            setShowFailureAlert(true);
            setFailureAlertContent(translate('tracking_codes_failure_alert_text'));
            LOG.error(apolloError, 'Failed to add tracking params for hubId', videoCenterId);
          }
        });
      }

      if (hubConfig?.utmOverride !== existingParam.utmOverride) {
        updateVideoHubMutation({
          variables: { input: hubToSave },
          optimisticResponse: { hubUpdate: newHubData },
          update(cache) {
            cache.writeQuery({
              query: GET_VIDEO_HUB,
              variables: { hubID: { id: videoCenterId } },
              data: { hub: newHubData }
            });
          },
          onCompleted: () => {
            showAlertMessage(translate('tracking_code_banner_code_snippet_update_alert_text'));
          },
          onError: apolloError => {
            setShowFailureAlert(true);
            setFailureAlertContent(translate('tracking_codes_failure_alert_text'));
            LOG.error(
              apolloError,
              'Failed to update duplicate key names for tracking parameter for hubId',
              videoCenterId
            );
          }
        });
        setIsEdited(false);
      }
    },
    [
      initialHub,
      existingParam,
      isEdited,
      hubConfig?.utmOverride,
      addParameters,
      videoCenterId,
      refetchTrackingParams,
      translate,
      updateVideoHubMutation
    ]
  );

  const trakcingCodeHeader: JSX.Element = (
    <Header title={translate('tracking_code_side_nav_text')} breadCrumbs={headerBreadCrumbs} />
  );
  const trackingCodeRenderer = (): JSX.Element => (
    <div css={outerContainer}>
      {alertState.showAlert && !showFailureAlert && (
        <div css={alertWrapperStyles}>
          <PageAlert
            appearance="success"
            dismissible
            testID="tracking-codes-alert-form-success"
            content={alertState.alertText}
            onDismiss={() =>
              setAlertState(prev => ({
                ...prev,
                showAlert: false
              }))
            }
          />
        </div>
      )}
      {showFailureAlert && (
        <div css={alertWrapperStyles}>
          <PageAlert
            appearance="danger"
            content={failureAlertContent}
            dismissible
            onDismiss={() => {
              setShowFailureAlert(false);
              setFailureAlertContent('');
            }}
            testID="visitor-permissions-alert-form-error"
          />
        </div>
      )}
      {allowGoogleAnalytics &&
        (videoCenterInformationFeature ? (
          <NewGoogleAnalytics
            measurementId={measurementId}
            editMeasurementId={editMeasurementId}
            isMeasurementIDEdited={isMeasurementIDEdited}
            setIsMeasurementIDEdited={setIsMeasurementIDEdited}
            setEditMeasurementId={setEditMeasurementId}
            onSaveMeasurementId={onSaveMeasurementId}
            setIsPageEdited={setIsPageEdited}
          />
        ) : (
          <GoogleAnalytics
            measurementId={measurementId}
            editMeasurementId={editMeasurementId}
            setEditMeasurementId={setEditMeasurementId}
            setIsMeasurementIDEdited={setIsMeasurementIDEdited}
            cardDisabled={editCodeSnippet || editTrackingParameters}
            onSaveMeasurementId={onSaveMeasurementId}
            setIsPageEdited={setIsPageEdited}
          />
        ))}
      {allowCodeSnippets &&
        (videoCenterInformationFeature ? (
          <NewCodeSnippetsList
            dataList={tableData}
            accountCodeSnippets={accountCodeSnippets}
            codeSnippets={codeSnippets}
            onSave={onSaveCodeSnippet}
            onUpdate={onUpdateCodeSnippet}
            onRemove={onRemoveSnippet}
            onNext={onNext}
            isNext={isNextPageAvailable}
            onPrevious={onPrevious}
            isPrevious={isPreviousPageAvailable}
            allowGoogleAnalytics={allowGoogleAnalytics}
          />
        ) : (
          <CodeSnippetsList
            dataList={tableData}
            accountCodeSnippets={accountCodeSnippets}
            codeSnippets={codeSnippets}
            onSave={onSaveCodeSnippet}
            onUpdate={onUpdateCodeSnippet}
            onRemove={onRemoveSnippet}
            onNext={onNext}
            isNext={isNextPageAvailable}
            onPrevious={onPrevious}
            isPrevious={isPreviousPageAvailable}
            editCodeSnippet={editCodeSnippet}
            setEditCodeSnippet={setEditCodeSnippet}
            cardDisabled={editMeasurementId || editTrackingParameters}
            allowGoogleAnalytics={allowGoogleAnalytics}
          />
        ))}
      {videoCenterInformationFeature ? (
        <NewTrackingParameters
          existingParam={existingParam}
          setExistingParam={setExistingParam}
          onDelete={onDelete}
          isEdited={isEdited}
          onSave={onSaveTrackingParameters}
          hubConfig={hubConfigWithDefault}
          trackingParametersdata={trackingParameters}
          editTrackingParameters={editTrackingParameters}
          setEditTrackingParameters={setEditTrackingParameters}
          setIsEdited={setIsEdited}
          allowGoogleAnalytics={allowGoogleAnalytics}
          allowCodeSnippets={allowCodeSnippets}
          setIsPageEdited={setIsPageEdited}
        />
      ) : (
        <TrackingParameters
          existingParam={existingParam}
          setExistingParam={setExistingParam}
          onDelete={onDelete}
          onSave={onSaveTrackingParameters}
          hubConfig={hubConfigWithDefault}
          trackingParametersdata={trackingParameters}
          editTrackingParameters={editTrackingParameters}
          setEditTrackingParameters={setEditTrackingParameters}
          cardDisabled={editCodeSnippet || editMeasurementId}
          setIsEdited={setIsEdited}
          allowGoogleAnalytics={allowGoogleAnalytics}
          allowCodeSnippets={allowCodeSnippets}
          setIsPageEdited={setIsPageEdited}
        />
      )}
      {videoCenterInformationFeature ? (
        <NavigationConfirmationModal
          isOpen={showNavigationConfirmationModal}
          setIsOpen={setShowNavigationConfirmationModal}
          bodyText={translate('page-navigation-confirmation-body')}
          preventLeave={isEdited || isMeasurementIDEdited}
          testID="events-plus-tracking-codes-page"
        />
      ) : (
        <LeavePageAlert isPageEdited={isPageEdited} setIsPageEdited={setIsPageEdited} />
      )}
    </div>
  );

  return (
    <ScrollViewWithBars header={trakcingCodeHeader}>
      <LoadingWrapper
        loading={
          savingSnippets ||
          fetchingData ||
          fetchingVideoCenterCodeSnippets ||
          updatingSnippets ||
          removingSnippets ||
          savingMeasurementId ||
          (savingTrackingParameter && videoCenterInformationFeature) ||
          (savingDuplicateKeyNameParameter && videoCenterInformationFeature) ||
          fetchingMeasurementId ||
          fetchingTrackingParameters
        }
        renderer={trackingCodeRenderer}
        errors={[getAccountCodeSnippetsError, getHubCodeSnippetsError]}
      />
    </ScrollViewWithBars>
  );
}

interface Props {
  videoCenterId: string;
  videoCenterTitle: string;
}

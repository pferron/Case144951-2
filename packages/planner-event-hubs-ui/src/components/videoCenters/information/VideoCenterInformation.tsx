import { useMutation, useQuery } from '@apollo/client';
import { useAppFeatures } from '@components/AppFeaturesProvider';
import Header from '@components/Header';
import CardContainer from '@components/common/CardContainer';
import HelpEmailField from '@components/videoCenters/information/HelpEmailField';
import InformationFields from '@components/videoCenters/information/InformationFields';
import StatusField from '@components/videoCenters/information/StatusField';
import { InformationStyles } from '@components/videoCenters/style';
import { PageAlert } from '@cvent/carina/components/Alert';
import { Breadcrumbs } from '@cvent/carina/components/Breadcrumbs';
import { Form } from '@cvent/carina/components/Forms';
import LoadingWrapper from '@components/common/loading/LoadingWrapper';
import { LoggerFactory } from '@cvent/logging/LoggerFactory';
import { injectTestId } from '@cvent/nucleus-test-automation';
import { ConfigStatus, Hub, HubUpdate } from '@cvent/planner-event-hubs-model/types';
import { useStyle } from '@hooks/useStyle';
import {
  CVENT_DOMAIN_VALUE,
  HUB_OVERVIEW_URL,
  VIDEO_HUB_INFORMATION_URL,
  VIDEO_HUB_PATH_PARAM_KEY,
  VIDEO_HUBS_URL
} from '@utils/constants';
import {
  DRAFT_VIDEO_HUB,
  PUBLISH_VIDEO_HUB,
  UPDATE_VIDEO_HUB,
  getCustomDomains,
  GET_VIDEO_HUB
} from '@cvent/planner-event-hubs-model/operations/hub';
import { isEqual, omit } from 'lodash';
import { useEventsPlusHubPageActionsApi } from '@metrics/client/react/useEventsPlusHubPageActionsApi';
import { useTranslate } from 'nucleus-text';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  createHubCustomDomainMapping,
  deleteHubCustomDomainMapping,
  updateHubCustomDomainMapping
} from '@cvent/planner-event-hubs-model/operations/customDomain';
import getConfig from 'next/config';
import NavigationConfirmationModal from '@components/common/NavigationConfirmationModal';
import { BreadCrumb } from '@components/common/BreadCrumb';
import { ActionType } from '@cvent/carina/components/Templates/utils/helpers';
import { Button } from '@cvent/carina/components/Button';
import { CopyIcon } from '@cvent/carina/components/Icon';
import useCopyToClipboard from '@hooks/useCopyToClipboard';
import ToolTipWrapper from '@components/shared/TooltipWrapper';
import CustomDomainWeblinkView from './ViewCustomDomain';
import CustomDomainWeblinkEdit from './EditCustomDomain';

const LOG = LoggerFactory.create('CenterInformation');
interface Props {
  centerId: string;
  centerTitle: string;
  setCenterTitle: (title: string) => void;
}

function VideoCenterInformation({ centerId, centerTitle, setCenterTitle }: Props): JSX.Element {
  const { translate } = useTranslate();
  const { container, bodyContainer, alertContainer, url, urlLabel } = useStyle(InformationStyles);
  const { hubOverviewFeature, videoCenterInformationFeature } = useAppFeatures();
  const { hubStatusToggled } = useEventsPlusHubPageActionsApi();

  const headerBreadCrumbs: JSX.Element = (
    <Breadcrumbs>
      <BreadCrumb url={VIDEO_HUBS_URL}>{translate('video_hubs_header_title')}</BreadCrumb>
      <BreadCrumb
        url={
          hubOverviewFeature
            ? HUB_OVERVIEW_URL.replace(VIDEO_HUB_PATH_PARAM_KEY, centerId)
            : VIDEO_HUB_INFORMATION_URL.replace(VIDEO_HUB_PATH_PARAM_KEY, centerId)
        }
      >
        {centerTitle}
      </BreadCrumb>
      <BreadCrumb url={VIDEO_HUB_INFORMATION_URL.replace(VIDEO_HUB_PATH_PARAM_KEY, centerId)}>
        {translate('media_center_information_page_title')}
      </BreadCrumb>
    </Breadcrumbs>
  );

  const [hubValues, setHubValues] = useState({});
  const [status, setStatus] = useState({});
  const [tempValues, setTempValues] = useState({});
  const [tempStatus, setTempStatus] = useState({});
  const { publicRuntimeConfig } = getConfig();

  const [isPageEdited, setIsPageEdited] = useState(false);
  const [showNavigationConfirmationModal, setShowNavigationConfirmationModal] = useState(false);

  // Fetch Video Center
  const {
    data,
    loading: fetchingData,
    error
  } = useQuery(GET_VIDEO_HUB, {
    variables: { hubID: { id: centerId } },
    onError: apolloError => {
      LOG.error(apolloError.networkError);
      LOG.error(apolloError.graphQLErrors);
    }
  });

  const {
    data: domainData,
    loading: loadingDomain,
    error: customDomainError
  } = useQuery(getCustomDomains, {
    variables: { hubId: centerId }
  });
  const customDomainData = useMemo(
    () => ({
      customDomain: domainData?.getCustomDomainForHub?.customDomainId || '',
      trailingName: domainData?.getCustomDomainForHub?.trailingName || ''
    }),
    [domainData]
  );

  const [tempCustomDomain, setTempCustomDomain] = useState({
    customDomain: customDomainData.customDomain,
    trailingName: customDomainData.trailingName
  });

  const accountDomains = useMemo(() => {
    const domains =
      domainData?.getCustomDomainForAccount.map(cd => ({
        label: cd.domainName,
        value: cd.customDomainId
      })) || [];
    domains.push({ label: new URL(publicRuntimeConfig.CVENT_SHORT_URL).hostname, value: CVENT_DOMAIN_VALUE });
    return domains;
  }, [domainData, publicRuntimeConfig.CVENT_SHORT_URL]);
  const initialHub = data?.hub;
  const initialConfig = initialHub?.config;
  const initialStatus = initialHub?.status;
  useMemo(() => {
    setHubValues({
      ...initialConfig,
      count: 1,
      displayHelpEmail: initialConfig?.helpEmailAddress ? 1 : 0
    });
    setTempValues({
      ...initialConfig,
      count: 1,
      displayHelpEmail: initialConfig?.helpEmailAddress ? 1 : 0
    });
  }, [initialConfig]);
  useMemo(() => {
    setStatus({ status: initialStatus });
    setTempStatus({ status: initialStatus });
  }, [initialStatus]);

  const onCustomDomainError = err => {
    if (err?.graphQLErrors?.[0]?.extensions?.response?.message === 'URL name for custom domain is in use.') {
      setErrorAlertMessage('custom_domain_trailing_name_already_used');
    } else {
      setErrorAlertMessage('custom_domain_save_error');
    }
    setShowAlertSuccess(false);
  };
  // Update Video Center
  const [updateVideoHubMutation, { loading: updatingData }] = useMutation(UPDATE_VIDEO_HUB);
  const [draftVideoHubMutation, { loading: updatingDraft }] = useMutation(DRAFT_VIDEO_HUB);
  const [publishVideoHubMutation, { loading: updatingPublish }] = useMutation(PUBLISH_VIDEO_HUB);
  const [createCustomDomainMapping, { loading: creatingCustomDoamin }] = useMutation(createHubCustomDomainMapping, {
    onError: onCustomDomainError
  });
  const [updateCustomDomainMapping, { loading: updatingCustomDoamin }] = useMutation(updateHubCustomDomainMapping, {
    onError: onCustomDomainError
  });
  const [deleteCustomDomainMapping, { loading: deletingCustomDoamin }] = useMutation(deleteHubCustomDomainMapping, {
    onError: onCustomDomainError
  });

  const [showAlertSuccess, setShowAlertSuccess] = useState(false);
  const [errorAlertMessaage, setErrorAlertMessage] = useState<string>(null);
  const [editBasicInformationCard, setEditBasicInformationCard] = useState(videoCenterInformationFeature);
  const [editVideoHubStatusCard, setEditVideoHubStatusCard] = useState(videoCenterInformationFeature);
  const [editVideoHubCustomDomain, setEditVideoHubCustomDomain] = useState(videoCenterInformationFeature);
  const [isSaveButtonClicked, setIsSaveButtonClicked] = useState<boolean>(false);

  useEffect(() => {
    setTempCustomDomain(customDomainData);
  }, [customDomainData]);

  const [hasErrorForBasicInformation, setHasErrorForBasicInformation] = useState(false);
  const onEditBasicInformation = () => {
    setErrorAlertMessage(null);
    setEditBasicInformationCard(true);
  };
  const onCancelBasicInformation = () => {
    const count = Math.random();
    setTempValues({ ...hubValues, count });
    setHubValues(prevHubValues => ({ ...prevHubValues, count }));
    setEditBasicInformationCard(videoCenterInformationFeature);
  };

  const onEditStatus = () => {
    setErrorAlertMessage(null);
    setEditVideoHubStatusCard(true);
  };
  const onCancelStatus = () => {
    setEditVideoHubStatusCard(videoCenterInformationFeature);
    setTempStatus(status);
  };

  const onEditCustomDomain = () => {
    setErrorAlertMessage(null);
    setEditVideoHubCustomDomain(true);
  };
  const onCancelCustomDomain = useCallback(() => {
    setEditVideoHubCustomDomain(videoCenterInformationFeature);
    setTempCustomDomain(customDomainData);
  }, [customDomainData, videoCenterInformationFeature]);
  const isHubInfoUpdated = !isEqual(tempValues, hubValues);
  const isHubStatusUpdated = !isEqual(tempStatus, status);
  const isWebLinkUpdated = !(
    isEqual(tempCustomDomain, customDomainData) ||
    (tempCustomDomain.customDomain === CVENT_DOMAIN_VALUE && customDomainData.customDomain === '')
  );

  const onSaveBasicInformation = useCallback(
    (event, { dirty, hasErrors, values }): void => {
      if (dirty && !hasErrors) {
        const formConfigValues = omit(values, 'status', 'count', 'displayHelpEmail');
        formConfigValues.helpEmailAddress = values.displayHelpEmail === 0 ? null : values.helpEmailAddress;
        const newHubData: Hub = {
          ...initialHub,
          config: formConfigValues
        };
        const hubToSave: HubUpdate = omit(
          newHubData,
          'status',
          '__typename',
          'config.__typename',
          'theme.__typename',
          'calendar.__typename'
        );
        updateVideoHubMutation({
          variables: { input: hubToSave },
          onError: apolloError => {
            LOG.error(`Error while updating hub data for hub [${centerId}] with error : `, apolloError);
            setShowAlertSuccess(false);
            setErrorAlertMessage('hub_network_error_text');
          },
          optimisticResponse: { hubUpdate: newHubData },
          update(cache) {
            cache.writeQuery({
              query: GET_VIDEO_HUB,
              variables: { hubID: { id: centerId } },
              data: { hub: newHubData }
            });
          }
        });
        setCenterTitle(hubToSave.config.title);
        setShowAlertSuccess(true);
        setEditBasicInformationCard(videoCenterInformationFeature);
      }
      if (!dirty && !hasErrors) {
        setEditBasicInformationCard(videoCenterInformationFeature);
      }
    },
    [initialHub, updateVideoHubMutation, setCenterTitle, videoCenterInformationFeature, centerId]
  );

  const onSaveVideoCenterStatus = useCallback(
    (event, { dirty, hasErrors, values }): void => {
      if (dirty && !hasErrors) {
        const formStatusValue = values.status;
        const newHubData: Hub = {
          ...initialHub,
          status: formStatusValue
        };
        if (formStatusValue === ConfigStatus.Active) {
          publishVideoHubMutation({
            variables: { input: { id: centerId } },
            update(cache) {
              cache.writeQuery({
                query: GET_VIDEO_HUB,
                variables: { hubID: { id: centerId } },
                data: { hub: newHubData }
              });
            },
            onCompleted: () => {
              setStatus(tempStatus);
            }
          });
        } else {
          draftVideoHubMutation({
            variables: { input: { id: centerId } },
            update(cache) {
              cache.writeQuery({
                query: GET_VIDEO_HUB,
                variables: { hubID: { id: centerId } },
                data: { hub: newHubData }
              });
            },
            onCompleted: () => {
              setStatus(tempStatus);
            }
          });
        }
        hubStatusToggled({
          hubStatus: formStatusValue
        });
        setShowAlertSuccess(true);
        setEditVideoHubStatusCard(videoCenterInformationFeature);
      }
      if (!dirty && !hasErrors) {
        setEditVideoHubStatusCard(videoCenterInformationFeature);
      }
    },
    [
      initialHub,
      videoCenterInformationFeature,
      hubStatusToggled,
      publishVideoHubMutation,
      centerId,
      tempStatus,
      draftVideoHubMutation
    ]
  );

  const updateCustomDomainCacheData = useCallback(
    (cache, customDomainId, trailingName) => {
      // this function updates custom domain value for hub
      const customDomainName = accountDomains.find(customDomain => customDomain.value === customDomainId).label;
      cache.writeQuery({
        query: getCustomDomains,
        variables: { hubId: centerId },
        data: {
          ...domainData,
          getCustomDomainForHub: {
            customDomainId,
            trailingName,
            entityId: centerId
          }
        }
      });
      cache.writeQuery({
        query: GET_VIDEO_HUB,
        variables: { hubId: { id: centerId } },
        data: {
          hub: {
            ...data?.hub,
            config: {
              ...data?.hub?.config,
              url: `https://${customDomainName}/${trailingName}`
            }
          }
        }
      });
    },
    [accountDomains, centerId, data, domainData]
  );

  const deleteDomainMapping = useCallback(() => {
    // after delete we need to refetch video hub data to get updated cvent domain short url
    deleteCustomDomainMapping({
      variables: { hubId: centerId },
      refetchQueries: [GET_VIDEO_HUB],
      awaitRefetchQueries: true,
      update(cache) {
        cache.writeQuery({
          query: getCustomDomains,
          variables: { hubId: centerId },
          data: {
            ...domainData,
            getCustomDomainForHub: null
          }
        });
      }
    });
  }, [centerId, deleteCustomDomainMapping, domainData]);

  const updateDomainMapping = useCallback(
    (formCustomDomainValue, formTrailingNameValue) => {
      updateCustomDomainMapping({
        variables: {
          input: {
            entityId: centerId,
            customDomainId: formCustomDomainValue,
            trailingName: formTrailingNameValue
          }
        },
        update(cache) {
          updateCustomDomainCacheData(cache, formCustomDomainValue, formTrailingNameValue);
        }
      });
    },
    [centerId, updateCustomDomainCacheData, updateCustomDomainMapping]
  );

  const createDomainMapping = useCallback(
    (formCustomDomainValue, formTrailingNameValue) => {
      createCustomDomainMapping({
        variables: {
          input: {
            entityId: centerId,
            customDomainId: formCustomDomainValue,
            trailingName: formTrailingNameValue
          }
        },
        update(cache) {
          updateCustomDomainCacheData(cache, formCustomDomainValue, formTrailingNameValue);
        }
      });
    },
    [centerId, createCustomDomainMapping, updateCustomDomainCacheData]
  );

  const onSaveVideoCenterWeblink = useCallback(
    (event, { dirty, hasErrors, values }): void => {
      if (dirty && !hasErrors) {
        const formCustomDomainValue = values.customDomain;
        const formTrailingNameValue = values.trailingName;
        if (customDomainData?.customDomain) {
          // custom domain already exists, needs to be updated or deleted
          if (formCustomDomainValue === CVENT_DOMAIN_VALUE) {
            // new domain is cvent domain therefore deleting custom domain mapping
            deleteDomainMapping();
          } else {
            updateDomainMapping(formCustomDomainValue, formTrailingNameValue);
          }
        } else if (formCustomDomainValue !== CVENT_DOMAIN_VALUE) {
          createDomainMapping(formCustomDomainValue, formTrailingNameValue);
        }
        setShowAlertSuccess(true);
        setEditVideoHubCustomDomain(videoCenterInformationFeature);
      }
      if (!dirty && !hasErrors) {
        setEditVideoHubCustomDomain(videoCenterInformationFeature);
      }
    },
    [
      createDomainMapping,
      customDomainData?.customDomain,
      deleteDomainMapping,
      updateDomainMapping,
      videoCenterInformationFeature
    ]
  );
  const { copy } = useCopyToClipboard(initialConfig?.url);

  const CopyButton = useMemo(
    () => (
      <Button
        testID="custom-domain-url-copy-button"
        icon={CopyIcon}
        aria-label={translate('video_hub_copy_weblink_button_accessibility_label')}
        appearance="ghost"
        onClick={copy}
      />
    ),
    [copy, translate]
  );

  const customDomainWeblink = useMemo(
    () => (
      <Form
        name="weblink"
        testID="center-custom-domain-form"
        initialValues={{
          customDomain: customDomainData.customDomain || CVENT_DOMAIN_VALUE,
          trailingName:
            customDomainData.trailingName || (initialConfig?.url ? new URL(initialConfig.url).pathname.slice(1) : '')
        }}
        initializationMode="reinitialize"
        readOnly={!editVideoHubCustomDomain}
        onSubmit={onSaveVideoCenterWeblink}
        key={editVideoHubCustomDomain?.toString()}
      >
        <CardContainer
          hideEdit={accountDomains.length === 1}
          testID="center-custom-domain-card"
          disabled={(editBasicInformationCard || editVideoHubStatusCard) && !videoCenterInformationFeature}
          enabled={editVideoHubCustomDomain}
          onEdit={videoCenterInformationFeature ? null : onEditCustomDomain}
          onCancel={videoCenterInformationFeature ? null : onCancelCustomDomain}
        >
          {!editVideoHubCustomDomain ? (
            <CustomDomainWeblinkView hubUrl={initialConfig?.url} />
          ) : (
            <>
              <CustomDomainWeblinkEdit
                customDomains={accountDomains}
                setTempCustomDomain={setTempCustomDomain}
                setHasErrorForBasicInformation={setHasErrorForBasicInformation}
              />
              {videoCenterInformationFeature &&
                (isEqual(tempCustomDomain, customDomainData) ||
                (tempCustomDomain.customDomain === CVENT_DOMAIN_VALUE && customDomainData.customDomain === '') ? (
                  <>
                    <div css={urlLabel}>{translate('events_plus_homepage')}</div>
                    <div style={{ display: 'flex', width: 'fit-content' }}>
                      <p css={url} {...injectTestId('custom-domain')}>
                        {initialConfig?.url}
                      </p>
                      <ToolTipWrapper
                        button={CopyButton}
                        text={translate('tooltip_text_on_hover_copy_button')}
                        copiedText={translate('tooltip_text_on_click_copy_button')}
                      />
                    </div>
                  </>
                ) : (
                  <div css={urlLabel}>{translate('video_hub_information_web_link_unsaved_changes_text')}</div>
                ))}
            </>
          )}
        </CardContainer>
      </Form>
    ),
    [
      customDomainData,
      initialConfig?.url,
      editVideoHubCustomDomain,
      onSaveVideoCenterWeblink,
      accountDomains,
      editBasicInformationCard,
      editVideoHubStatusCard,
      videoCenterInformationFeature,
      onCancelCustomDomain,
      tempCustomDomain,
      urlLabel,
      translate,
      url,
      CopyButton
    ]
  );

  useEffect(() => {
    if (isHubInfoUpdated || isWebLinkUpdated || isHubStatusUpdated) {
      setIsPageEdited(true);
    } else {
      setIsPageEdited(false);
    }
    if (isSaveButtonClicked) {
      let dirty = isHubInfoUpdated;
      const hasErrors = hasErrorForBasicInformation;
      let values = tempValues;
      onSaveBasicInformation(null, { dirty, hasErrors, values });
      values = tempStatus;
      dirty = isHubStatusUpdated;
      onSaveVideoCenterStatus(null, { dirty, hasErrors, values });
      dirty = isWebLinkUpdated;
      values = tempCustomDomain;
      onSaveVideoCenterWeblink(null, { dirty, hasErrors, values });
      setIsSaveButtonClicked(false);
    }
  }, [
    isSaveButtonClicked,
    onSaveBasicInformation,
    setIsSaveButtonClicked,
    tempValues,
    hubValues,
    onSaveVideoCenterStatus,
    tempStatus,
    initialStatus,
    tempCustomDomain,
    onSaveVideoCenterWeblink,
    customDomainData,
    hasErrorForBasicInformation,
    isHubInfoUpdated,
    isWebLinkUpdated,
    isHubStatusUpdated,
    status
  ]);

  const headerActions: ActionType[] = useMemo(
    () => [
      {
        value: translate('video_hub_information_save_button'),
        appearance: 'filled',
        onClick: (): void => {
          setIsSaveButtonClicked(true);
        },
        disabled: !(isHubInfoUpdated || isHubStatusUpdated || isWebLinkUpdated),
        label: translate('video_hub_information_save_button')
      }
    ],
    [isHubInfoUpdated, isHubStatusUpdated, isWebLinkUpdated, translate]
  );

  const handleChange = values => {
    const field = values.target.name;
    setTempValues(prevValues => ({
      ...prevValues,
      [field]: values.target.value
    }));
  };

  const informationRenderer = (): JSX.Element => (
    <div css={container}>
      <Header
        title={translate('media_center_information_page_title')}
        actions={videoCenterInformationFeature && headerActions}
        breadCrumbs={headerBreadCrumbs}
      />
      <div css={bodyContainer} {...injectTestId('center-information-container')}>
        {showAlertSuccess && (
          <div css={alertContainer}>
            <PageAlert
              appearance="success"
              id="1"
              content={translate('video_hub_alert_update_success')}
              dismissible
              onDismiss={() => setShowAlertSuccess(false)}
              isRtl={false}
              testID="video-hub-alert-form-error"
            />
          </div>
        )}
        {errorAlertMessaage && (
          <div css={alertContainer}>
            <PageAlert
              appearance="danger"
              id="1"
              content={translate(errorAlertMessaage)}
              dismissible
              onDismiss={() => setErrorAlertMessage(null)}
              isRtl={false}
              testID="video-hub-alert-form-error"
            />
          </div>
        )}
        <Form
          name="basicInformation"
          testID="center-information-form"
          readOnly={!editBasicInformationCard}
          initialValues={hubValues}
          onChange={handleChange}
          initializationMode="reinitialize"
          onSubmit={onSaveBasicInformation}
        >
          <CardContainer
            testID="center-information-card"
            enabled={editBasicInformationCard}
            onEdit={videoCenterInformationFeature ? null : onEditBasicInformation}
            onCancel={videoCenterInformationFeature ? null : onCancelBasicInformation}
            disabled={(editVideoHubStatusCard || editVideoHubCustomDomain) && !videoCenterInformationFeature}
          >
            <InformationFields
              tabletMaxWidth
              setTempValues={setTempValues}
              setHasErrorForBasicInformation={setHasErrorForBasicInformation}
            />
            <HelpEmailField
              isEdit={editBasicInformationCard}
              setTempValues={setTempValues}
              setHasErrorForBasicInformation={setHasErrorForBasicInformation}
            />
          </CardContainer>
        </Form>
        <Form
          name="status"
          testID="center-status-form"
          readOnly={!editVideoHubStatusCard}
          initialValues={status}
          onChange={handleChange}
          initializationMode="reinitialize"
          onSubmit={onSaveVideoCenterStatus} // There is no button type submit, save handled by container
        >
          <CardContainer
            testID="center-status-card"
            enabled={editVideoHubStatusCard}
            onEdit={videoCenterInformationFeature ? null : onEditStatus}
            onCancel={videoCenterInformationFeature ? null : onCancelStatus}
            disabled={(editBasicInformationCard || editVideoHubCustomDomain) && !videoCenterInformationFeature}
          >
            <StatusField centerId={centerId} setTempStatus={setTempStatus} />
          </CardContainer>
        </Form>
        {customDomainWeblink}
        <NavigationConfirmationModal
          isOpen={showNavigationConfirmationModal}
          setIsOpen={setShowNavigationConfirmationModal}
          bodyText={translate('page-navigation-confirmation-body')}
          preventLeave={isPageEdited}
          testID="events-plus-information-page"
        />
      </div>
    </div>
  );
  return (
    <LoadingWrapper
      loading={
        fetchingData ||
        updatingData ||
        updatingPublish ||
        updatingDraft ||
        loadingDomain ||
        creatingCustomDoamin ||
        updatingCustomDoamin ||
        deletingCustomDoamin
      }
      renderer={informationRenderer}
      errors={[error, customDomainError]}
    />
  );
}

export default VideoCenterInformation;

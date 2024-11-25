import { useTranslate } from 'nucleus-text';
import { Breadcrumbs, Breadcrumb as Crumb } from '@cvent/carina/components/Breadcrumbs';
import {
  VIDEO_HUB_PATH_PARAM_KEY,
  VIDEO_HUB_URL,
  VIDEO_HUBS_URL,
  VIDEO_HUB_INFORMATION_URL,
  HUB_OVERVIEW_URL
} from '@utils/constants';
import React, { useMemo, useState } from 'react';
import Header from '@components/Header';
import PrivacyContainer from '@components/privacy/PrivacyContainer';
import { useStyle } from '@hooks/useStyle';
import { PrivacySettingsStyle } from '@components/privacy/style';
import { useMutation, useQuery } from '@apollo/client';
import LoadingWrapper from '@components/common/loading/LoadingWrapper';
import { LoggerFactory } from '@cvent/logging/LoggerFactory';
import removeTypename from '@utils/removeTypename';
import {
  getHubTermsEditPermission,
  GET_HUB_SETTINGS,
  UPDATE_HUB_SETTINGS
} from '@cvent/planner-event-hubs-model/operations/hub';
import { useAppFeatures } from '@components/AppFeaturesProvider';
import LeavePageAlert from '@components/common/LeavePageAlert';
import { ActionType } from '@cvent/carina/components/Templates/utils/helpers';
import { PageAlert } from '@cvent/carina/components/Alert';
import { injectTestId } from '@cvent/nucleus-test-automation';

const LOG = LoggerFactory.create('PrivacySettings');

const defaultValueMapper = [
  ['displayCventPrivacyPolicy', 'cventPrivacyPolicyLinkText', ''],
  ['displayPrivacyPolicy', 'privacyPolicyLinkText', ''],
  ['displayPrivacyPolicy', 'privacyPolicyUrl', ''],
  ['displayTermsLinkOnFooter', 'termsLinkText', ''],
  ['displayTermsLinkOnFooter', 'termsText', ''],
  ['displayTermsLinkOnFooter', 'displayTermsOnLogin', false],
  ['ccpaEnableDoNotSell', 'ccpaDoNotSellUrl', ''],
  [
    'ccpaEnableDoNotSell',
    'ccpaLinkExplanationText',
    'If You Are a California resident, you have the right to opt-out of the “sale” or “sharing” of your personal information. If you are a resident of other states like Virginia, Colorado, Utah, and Connecticut, such states may or will provide similar consumer rights. By selecting “Do Not Sell or Share My Personal Information” below you are making a choice to limit the data we share about you with other companies. You can learn more about for your privacy rights, other methods of submitting your opt-out requests, and how we handle your personal information in our privacy policy.'
  ]
];

const infoContent = new Map([
  ['cventPrivacyPolicyLinkText', 'privacy_cvent_link_text_popover'],
  ['ccpaEnableDnslinkText', 'ccpa_enable_dns_text_link_popover'],
  ['ccpaDnsShareUrlText', 'ccpa_dns_share_url_text_popover'],
  ['privacyPolicyLinkText', 'privacy_your_text_link_popover'],
  ['allowTurnOffCookies', 'privacy_popover_allow_turnoff_cookies'],
  ['notifyUsersAboutCookie', 'privacy_popover_notify_users_about_cookies'],
  ['linkAttendeesDoNotSell', 'privacy_ccpa_link_attendee_popover'],
  ['uniqueTermsOfUse', 'privacy_termsofuse_videofooter_popover'],
  ['allowTurnOffGoogleAnalytics', 'privacy_allow_turnoff_google_analytics_popover']
]);

const filterSettings = settings => {
  // if the key is selected as 'NO' we remove the corresponding value too
  // eg. if displayTerms = 'No' then TermsText = ''
  const result = { ...settings };
  defaultValueMapper.forEach(element => {
    const source = element[0] as string;
    const target = element[1] as string;
    const value = element[2];
    if (!settings[source]) {
      result[target] = value;
    }
  });
  return result;
};

function PrivacySettings({ videoHubId, videoHubTitle }: Props): JSX.Element {
  const { translate } = useTranslate();
  const { container, alertContainer } = useStyle(PrivacySettingsStyle);
  const { hubOverviewFeature } = useAppFeatures();
  const [isPageEdited, setIsPageEdited] = useState<boolean>(false);
  const [showAlertSuccess, setShowAlertSuccess] = useState(false);
  const [isSaveButtonClicked, setIsSaveButtonClicked] = useState<boolean>(false);
  const headerBreadCrumbs: JSX.Element = (
    <Breadcrumbs>
      <Crumb href={VIDEO_HUBS_URL}>{translate('video_hubs_header_title')}</Crumb>
      <Crumb
        href={
          hubOverviewFeature
            ? HUB_OVERVIEW_URL.replace(VIDEO_HUB_PATH_PARAM_KEY, videoHubId)
            : VIDEO_HUB_INFORMATION_URL.replace(VIDEO_HUB_PATH_PARAM_KEY, videoHubId)
        }
      >
        {videoHubTitle}
      </Crumb>
      <Crumb href={VIDEO_HUB_URL.replace(VIDEO_HUB_PATH_PARAM_KEY, videoHubId)}>
        {translate('privacy_settings_page_title')}
      </Crumb>
    </Breadcrumbs>
  );

  const {
    data,
    error,
    loading: fetchingData
  } = useQuery(GET_HUB_SETTINGS, {
    variables: {
      id: {
        id: videoHubId
      }
    },
    onError: apolloError => {
      LOG.error(apolloError, 'Failed to get hub settings');
    }
  });

  const {
    data: editTermsData,
    loading: editTermsFetchingData,
    error: editTermsError
  } = useQuery(getHubTermsEditPermission, {
    variables: {
      id: {
        id: videoHubId
      }
    },
    onError: apolloError => {
      LOG.error(apolloError, 'Failed to get terms of use edit permissions');
    }
  });
  let privacySettings = useMemo(() => data?.getHubSettings ?? {}, [data]);
  privacySettings = removeTypename(privacySettings);

  const [updatePrivacySettingsMutation, { loading: updatingData }] = useMutation(UPDATE_HUB_SETTINGS);

  const onUpdatePrivacySettings = async (updatedSettings): Promise<void> => {
    setIsPageEdited(false);
    const settingsToSave = filterSettings(updatedSettings);
    await updatePrivacySettingsMutation({
      variables: {
        input: {
          id: videoHubId,
          hubSettings: settingsToSave
        }
      },
      update(cache) {
        cache.writeQuery({
          query: GET_HUB_SETTINGS,
          variables: {
            id: {
              id: videoHubId
            }
          },
          data: {
            getHubSettings: settingsToSave
          }
        });
        setShowAlertSuccess(true);
      }
    });
  };
  const headerActions: ActionType[] = useMemo(
    () => [
      {
        value: translate('privacy_settings_save_button'),
        appearance: 'filled',
        onClick: (): void => {
          setIsPageEdited(false);
          setIsSaveButtonClicked(true);
        },
        disabled: !isPageEdited,
        label: translate('privacy_settings_save_button')
      }
    ],
    [isPageEdited, translate]
  );

  if (error || editTermsError) {
    // TODO: data loading error TBD
  }
  const privacyRenderer = (): JSX.Element => (
    <div css={container}>
      <Header
        title={translate('privacy_settings_page_title')}
        actions={headerActions}
        breadCrumbs={headerBreadCrumbs}
      />
      {showAlertSuccess && (
        <div css={{ padding: '1.5rem' }} {...injectTestId('privacy-settings-success-alert-container')}>
          <div css={alertContainer}>
            <PageAlert
              appearance="success"
              content={translate('privacy_settings_update_alert_text')}
              dismissible
              onDismiss={() => setShowAlertSuccess(false)}
              testID="privacy-settings-form-alert-success"
            />
          </div>
        </div>
      )}
      <PrivacyContainer
        privacySettings={privacySettings}
        infoContent={infoContent}
        onUpdate={onUpdatePrivacySettings}
        allowTermsEdit={editTermsData?.getHubTermsEditPermission === 'ALLOWED'}
        setIsPageEdited={setIsPageEdited}
        isSaveButtonClicked={isSaveButtonClicked}
        setShowAlertSuccess={setShowAlertSuccess}
        setIsSaveButtonClicked={setIsSaveButtonClicked}
      />
      <LeavePageAlert isPageEdited={isPageEdited} setIsPageEdited={setIsPageEdited} />
    </div>
  );

  return (
    <LoadingWrapper
      loading={fetchingData || updatingData || editTermsFetchingData}
      renderer={privacyRenderer}
      errors={[error, editTermsError]}
      ariaLabel={translate('events_plus_generic_loading')}
    />
  );
}

interface Props {
  videoHubId: string;
  videoHubTitle: string;
}

export default PrivacySettings;

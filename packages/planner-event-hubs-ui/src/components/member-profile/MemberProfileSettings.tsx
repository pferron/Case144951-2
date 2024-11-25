import { useTranslate } from 'nucleus-text';
import { Breadcrumbs, Breadcrumb as Crumb } from '@cvent/carina/components/Breadcrumbs';
import {
  VIDEO_HUB_PATH_PARAM_KEY,
  VIDEO_HUBS_URL,
  VIDEO_HUB_FEATURES_URL,
  VIDEO_HUB_MEMBER_PROFILE_URL,
  VIDEO_HUB_PROFILE_PREVIEW_URL,
  VIDEO_HUB_INFORMATION_URL,
  HUB_OVERVIEW_URL
} from '@utils/constants';
import React, { useState } from 'react';
import Header from '@components/Header';
import { useStyle } from '@hooks/useStyle';
import { MemberProfileStyle } from '@components/member-profile/style';
import MemberProfileContainer from '@components/member-profile/MemberProfileContainer';
import NewMemberProfileContainer from '@components/member-profile/NewMemberProfileContainer';
import { useMutation, useQuery } from '@apollo/client';
import { LoggerFactory } from '@cvent/logging/LoggerFactory';
import LoadingWrapper from '@components/common/loading/LoadingWrapper';
import removeTypename from '@utils/removeTypename';
import { GET_HUB_SETTINGS, GET_VIDEO_HUB, UPDATE_HUB_SETTINGS } from '@cvent/planner-event-hubs-model/operations/hub';
import { useAppFeatures } from '@components/AppFeaturesProvider';
import { PageAlert } from '@cvent/carina/components/Alert';
import NavigationConfirmationModal from '@components/common/NavigationConfirmationModal';

const LOG = LoggerFactory.create('MemberProfileSettings');

function MemberProfileSettings({ videoCenterId, videoCenterTitle }: Props): JSX.Element {
  const { container } = useStyle(MemberProfileStyle);
  const { translate } = useTranslate();
  const { hubOverviewFeature, videoCenterInformationFeature } = useAppFeatures();
  const [isSaveButtonClicked, setIsSaveButtonClicked] = useState<boolean>(false);
  const [showAlertSuccess, setShowAlertSuccess] = useState(false);
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
      <Crumb href={VIDEO_HUB_FEATURES_URL.replace(VIDEO_HUB_PATH_PARAM_KEY, videoCenterId)}>
        {translate('features_side_nav_title')}
      </Crumb>
      <Crumb href={VIDEO_HUB_MEMBER_PROFILE_URL}>{translate('feature_member_card_title')}</Crumb>
    </Breadcrumbs>
  );
  const {
    data,
    loading: fetchingData,
    error: getHubSettingsError
  } = useQuery(GET_HUB_SETTINGS, {
    variables: {
      id: {
        id: videoCenterId
      }
    },
    onError: apolloError => {
      LOG.error(apolloError, 'Failed to get member settings');
    }
  });
  // getting video center details
  const {
    data: centerData,
    loading: fetchingCenterData,
    error: getPlannerEventHubError
  } = useQuery(GET_VIDEO_HUB, {
    variables: { hubID: { id: videoCenterId } },
    onError: apolloError => {
      LOG.error(apolloError, 'Failed to get video center details ');
    }
  });
  const logoImageUrl = centerData?.hub?.theme?.logoImageUrl;

  let profileSettings = data?.getHubSettings ?? {};
  profileSettings = removeTypename(profileSettings);

  const [updateProfileSettingsMutation, { loading: updatingData }] = useMutation(UPDATE_HUB_SETTINGS);
  const [isPageEdited, setIsPageEdited] = useState<boolean>(false);

  const onUpdateProfileSettings = async (updatedSettings): Promise<void> => {
    await updateProfileSettingsMutation({
      variables: {
        input: {
          id: videoCenterId,
          hubSettings: updatedSettings
        }
      },
      onError: apolloError => {
        LOG.error(apolloError, `Failed to update member profile settings for this hub`);
        setShowFailureAlert(true);
        setFailureAlertContent(translate('member_profile_failure_alert_text'));
      },
      update(cache) {
        setShowAlertSuccess(true);
        setShowFailureAlert(false);
        setFailureAlertContent('');
        cache.writeQuery({
          query: GET_HUB_SETTINGS,
          variables: {
            id: {
              id: videoCenterId
            }
          },
          data: {
            getHubSettings: updatedSettings
          }
        });
      }
    });
  };

  const memberProfileContainer = (): JSX.Element =>
    videoCenterInformationFeature ? (
      <NewMemberProfileContainer
        settings={profileSettings}
        onUpdate={onUpdateProfileSettings}
        logoImageUrl={logoImageUrl}
        isSaveButtonClicked={isSaveButtonClicked}
        setIsSaveButtonClicked={setIsSaveButtonClicked}
        setIsPageEdited={setIsPageEdited}
      />
    ) : (
      <MemberProfileContainer
        settings={profileSettings}
        onUpdate={onUpdateProfileSettings}
        logoImageUrl={logoImageUrl}
      />
    );
  return (
    <div css={container}>
      <Header
        title={translate('feature_member_card_title')}
        breadCrumbs={headerBreadCrumbs}
        actions={
          videoCenterInformationFeature
            ? [
                {
                  value: translate('features_member_profile_preview_button'),
                  appearance: 'lined',
                  onClick: () => {
                    const baseUrl = VIDEO_HUB_PROFILE_PREVIEW_URL.replace('[video-center]', videoCenterId);
                    const url = new URL(baseUrl, window.location.origin);
                    window.open(url.toString(), '_blank');
                  }
                },
                {
                  value: translate('features_member_profile_save_button'),
                  appearance: 'filled',
                  onClick: (): void => {
                    setIsPageEdited(false);
                    setShowAlertSuccess(false);
                    setIsSaveButtonClicked(true);
                  },
                  disabled: !isPageEdited,
                  label: translate('privacy_settings_save_button')
                }
              ]
            : [
                {
                  value: translate('member_profile_view_profile_button'),
                  appearance: 'lined',
                  onClick: () => {
                    const baseUrl = VIDEO_HUB_PROFILE_PREVIEW_URL.replace('[video-center]', videoCenterId);
                    const url = new URL(baseUrl, window.location.origin);
                    window.open(url.toString(), '_blank');
                  }
                }
              ]
        }
      />
      {showAlertSuccess && (
        <div css={{ margin: '1.5rem' }}>
          <PageAlert
            appearance="success"
            content={translate('member_profile_update_alert_text')}
            dismissible
            onDismiss={() => setShowAlertSuccess(false)}
            testID="member-profile-alert-form-success"
          />
        </div>
      )}
      {showFailureAlert && (
        <div css={{ margin: '1.5rem' }}>
          <PageAlert
            appearance="danger"
            content={failureAlertContent}
            dismissible
            onDismiss={() => {
              setShowFailureAlert(false);
              setFailureAlertContent('');
            }}
            testID="member-profile-alert-form-error"
          />
        </div>
      )}
      <LoadingWrapper
        loading={fetchingData || updatingData || fetchingCenterData}
        renderer={memberProfileContainer}
        errors={[getHubSettingsError, getPlannerEventHubError]}
      />
      <NavigationConfirmationModal
        isOpen={showNavigationConfirmationModal}
        setIsOpen={setShowNavigationConfirmationModal}
        bodyText={translate('page-navigation-confirmation-body')}
        preventLeave={isPageEdited}
        testID="events-plus-member-profile-page"
      />
    </div>
  );
}

interface Props {
  videoCenterId: string;
  videoCenterTitle: string;
}

export default MemberProfileSettings;

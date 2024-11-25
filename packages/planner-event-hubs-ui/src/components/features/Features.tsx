import { useTranslate } from 'nucleus-text';
import { useStyle } from '@hooks/useStyle';
import { Breadcrumbs, Breadcrumb as Crumb } from '@cvent/carina/components/Breadcrumbs';
import {
  VIDEO_HUB_PATH_PARAM_KEY,
  VIDEO_HUB_URL,
  VIDEO_HUBS_URL,
  VIDEO_HUB_INFORMATION_URL,
  HUB_OVERVIEW_URL
} from '@utils/constants';
import React, { useState } from 'react';
import Header from '@components/Header';
import { FeatureContainer } from '@components/features/FeatureContainer';
import { FeatureStyle } from '@components/features/style';
import ScrollViewWithBars from '@cvent/carina/components/ScrollViewWithBars/ScrollViewWithBars';
import { FEATURE_CARD_DESIGN_ARRAY, FEATURES } from '@components/features/constants';
import { useMutation, useQuery } from '@apollo/client';
import { LoggerFactory } from '@cvent/logging/LoggerFactory';
import LoadingWrapper from '@components/common/loading/LoadingWrapper';
import { useAppFeatures } from '@components/AppFeaturesProvider';
import { getCenterFeatures, UPDATE_CENTER_FEATURE } from '@cvent/planner-event-hubs-model/operations/hub';
import { useFeaturesPageActionsApi } from '@metrics/client/react/useFeaturesPageActionsApi';

const LOG = LoggerFactory.create('Features');

export function Features({ videoCenterId, videoCenterTitle }: Props): JSX.Element {
  const { translate } = useTranslate();
  const styles = useStyle(FeatureStyle);
  const { hubOverviewFeature } = useAppFeatures();
  const { yourEventsSwitchToggled, connectionSwitchToggled, upcomingEventsSwitchToggled } = useFeaturesPageActionsApi();

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
        {translate('features_side_nav_title')}
      </Crumb>
    </Breadcrumbs>
  );

  const [featureEnabled, setFeatureEnabled] = useState<{ [key: string]: boolean }>({});

  const { loading: fetchingData, error } = useQuery(getCenterFeatures, {
    fetchPolicy: 'cache-and-network',

    variables: {
      id: {
        id: videoCenterId
      }
    },
    onError: apolloError => {
      LOG.error(apolloError, 'Failed to get features');
    },
    onCompleted: data => {
      const featureMap = new Map();
      const features = data?.getCenterFeatures;
      features.map(i => featureMap.set(i.code, i.enabled));
      setFeatureEnabled({
        PROFILE_SETUP: featureMap.get(FEATURES.MEMBER),
        YOUR_EVENTS: featureMap.get(FEATURES.YOUR_EVENTS),
        UPCOMING_EVENTS: featureMap.get(FEATURES.UPCOMING_EVENTS),
        CONNECTIONS: featureMap.get(FEATURES.CONNECTIONS)
      });
    }
  });

  const [updateCenterFeatureMutation, { loading: updatingData }] = useMutation(UPDATE_CENTER_FEATURE);

  const onUpdateFeature = async (
    featureCode: string,
    featureCodeValue: boolean,
    // MAUVE
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    setEnabled: (p: (prev) => any) => void
  ): Promise<void> => {
    await updateCenterFeatureMutation({
      variables: {
        input: {
          centerId: videoCenterId,
          code: featureCode,
          enabled: featureCodeValue
        }
      },
      onError: apolloError => {
        LOG.error(apolloError, `Failed to update feature ${featureCode}`);
      },
      onCompleted: () => {
        setEnabled(prev => ({ ...prev, [featureCode]: featureCodeValue }));
      }
    });
    // Analytics
    const featureStatus = featureCodeValue ? 'On' : 'Off';
    switch (featureCode) {
      case FEATURES.YOUR_EVENTS:
        yourEventsSwitchToggled({
          yourEventsStatus: featureStatus
        });
        break;
      case FEATURES.CONNECTIONS:
        connectionSwitchToggled({
          connectionStatus: featureStatus
        });
        break;
      case FEATURES.UPCOMING_EVENTS:
        upcomingEventsSwitchToggled({
          upcomingEventsStatus: featureStatus
        });
        break;
      default:
        break;
    }
  };
  const getFeatureCardDesignData = (featureCardName: string) => {
    let result;
    switch (featureCardName) {
      case FEATURES.MEMBER:
        result = {
          enabled: featureEnabled.PROFILE_SETUP,
          image: '/features/memberProfile.png',
          setEnabled: setFeatureEnabled,
          isVisible: true
        };
        break;
      case FEATURES.YOUR_EVENTS:
        result = {
          enabled: featureEnabled.YOUR_EVENTS,
          image: '/features/yourEvents.png',
          setEnabled: setFeatureEnabled,
          isVisible: true
        };
        break;
      case FEATURES.CONNECTIONS:
        result = {
          enabled: featureEnabled.CONNECTIONS,
          image: '/features/connections.png',
          setEnabled: setFeatureEnabled,
          isVisible: true
        };
        break;
      case FEATURES.UPCOMING_EVENTS:
        result = {
          enabled: featureEnabled.UPCOMING_EVENTS,
          image: '/features/upcomingEvents.png',
          setEnabled: setFeatureEnabled,
          isVisible: true
        };
        break;
      default:
        break;
    }
    return result;
  };

  const featureCardContainer = () => (
    <div css={styles.cardContainer}>
      {FEATURE_CARD_DESIGN_ARRAY.map(
        ({
          title,
          description,
          featureCardTestID,
          featureCardName,
          featureCardButtonStatus,
          route,
          featureCardButtonDisabled
        }) => {
          const { image, enabled, setEnabled, isVisible } = getFeatureCardDesignData(featureCardName);
          return (
            isVisible && (
              <FeatureContainer
                key={featureCardName}
                description={translate(description)}
                title={translate(title)}
                image={image}
                videoCenterId={videoCenterId}
                featureCardTestID={featureCardTestID}
                featureCard={featureCardName}
                onUpdate={onUpdateFeature}
                enabled={enabled}
                setEnabled={setEnabled}
                featureButton={featureCardButtonStatus}
                route={route}
                featureCardButtonDisabled={featureCardButtonDisabled}
              />
            )
          );
        }
      )}
    </div>
  );

  const featuresHeader: JSX.Element = (
    <Header title={translate('features_side_nav_title')} breadCrumbs={headerBreadCrumbs} />
  );

  return (
    <div css={styles.container}>
      <ScrollViewWithBars header={featuresHeader}>
        <LoadingWrapper loading={fetchingData || updatingData} renderer={featureCardContainer} errors={[error]} />
      </ScrollViewWithBars>
    </div>
  );
}

interface Props {
  videoCenterId: string;
  videoCenterTitle: string;
}

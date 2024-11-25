import React, { useState } from 'react';
import { useTranslate } from 'nucleus-text';
import { Breadcrumbs, Breadcrumb as Crumb } from '@cvent/carina/components/Breadcrumbs';
import {
  VIDEO_HUB_PATH_PARAM_KEY,
  VIDEO_HUBS_URL,
  VIDEO_HUB_FEATURES_URL,
  VIDEO_HUB_UPCOMING_EVENTS_URL,
  CORE_CALENDARS_EXTERNAL_LINK,
  VIDEO_HUB_INFORMATION_URL,
  HUB_OVERVIEW_URL,
  TRACKING_CODES_URL
} from '@utils/constants';
import Header from '@components/Header';
import { useStyle } from '@hooks/useStyle';
import ContentCard from '@components/ContentCard';
import { ExternalLinkIcon } from '@cvent/carina/components/Icon';
import ScrollViewWithBars from '@cvent/carina/components/ScrollViewWithBars/ScrollViewWithBars';
import LoadingWrapper from '@components/common/loading/LoadingWrapper';
import CardContainer from '@components/common/CardContainer';
import TextLink from '@cvent/carina/components/TextLink';
import { injectTestId } from '@cvent/nucleus-test-automation';
import { useMutation, useQuery } from '@apollo/client';
import { HubUpdate } from '@cvent/planner-event-hubs-model/types';
import { omit } from 'lodash';
import { UpcomingEventsStyle } from '@components/upcoming-events/style';
import { resolveTemplateUrl } from '@utils/environmentUtils';
import useQueryParams from '@hooks/useQueryParam';
import getConfig from 'next/config';
import { useFeaturesPageActionsApi } from '@metrics/client/react/useFeaturesPageActionsApi';
import { GET_VIDEO_HUB, UPDATE_VIDEO_HUB } from '@cvent/planner-event-hubs-model/operations/hub';
import { GET_CALENDAR_LIST } from '@cvent/planner-event-hubs-model/operations/upcomingEvents';
import { useAppFeatures } from '@components/AppFeaturesProvider';
import { LoggerFactory } from '@cvent/logging/LoggerFactory';
import { PageAlert } from '@cvent/carina/components/Alert';
import spotCalendar from '../../../public/features/spot-calendar.png';
import spotIntegrations from '../../../public/features/spot-integrations.svg';
import CalendarSelection from './CalendarSelection';

const LOG = LoggerFactory.create('UpcomingEventsSettings');

function UpcomingEventsSettings({ videoCenterId, videoCenterTitle, calendarId }: Props): JSX.Element {
  const { container, calendarSelectionStyle, manageCalendarStyle, body, title } = useStyle(UpcomingEventsStyle);
  const { translate } = useTranslate();
  const {
    data: videoHub,
    loading,
    error: getPlannerEventHubError
  } = useQuery(GET_VIDEO_HUB, {
    variables: { hubID: { id: videoCenterId } }
  });
  const initialHub = videoHub?.hub;
  const { publicRuntimeConfig } = getConfig();
  const normandyBaseUrl = publicRuntimeConfig.NORMANDY_BASE_URL;
  const query = useQueryParams();
  const env = query.env as string;
  const { hubOverviewFeature } = useAppFeatures();

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
      <Crumb href={VIDEO_HUB_UPCOMING_EVENTS_URL}>{translate('upcoming_events_title')}</Crumb>
    </Breadcrumbs>
  );

  const coreCalendarUrl = `${resolveTemplateUrl(normandyBaseUrl, env)}/${CORE_CALENDARS_EXTERNAL_LINK}`;

  const {
    data,
    error: getCalendarsError,
    loading: loadingCalendars
  } = useQuery(GET_CALENDAR_LIST, {
    fetchPolicy: 'cache-and-network',
    variables: {}
  });

  const [selectedCalendarId, setSelectedCalendarId] = useState(calendarId?.toUpperCase());
  const [selectedCalendarName, setSelectedCalendarName] = useState();
  const { upcomingEventsCalendarCheckMarkClicked, manageCalendarsButtonClicked } = useFeaturesPageActionsApi();
  const [errorAlertMessaage, setErrorAlertMessage] = useState<string>(null);

  const [editCalendars, setEditCalendars] = useState(false);
  const onEditCalendars = () => {
    setEditCalendars(true);
  };
  const onCalendarSelection = (value, calendarName) => {
    setSelectedCalendarId(value);
    setSelectedCalendarName(calendarName);
  };
  const onCancelCalendars = () => {
    setSelectedCalendarId(calendarId?.toUpperCase());
    setEditCalendars(false);
  };

  const [saveCalendar] = useMutation(UPDATE_VIDEO_HUB);

  const onSaveChanges = selectedCalendarID => {
    let newHubData: HubUpdate = {
      ...initialHub
    };
    if (selectedCalendarID) {
      newHubData = {
        ...initialHub,
        calendar: {
          id: selectedCalendarID.toLowerCase()
        }
      };
    }

    const hubToSave = omit(
      newHubData,
      'status',
      '__typename',
      'config.__typename',
      'theme.__typename',
      'calendar.__typename'
    );

    saveCalendar({
      variables: { input: hubToSave },
      refetchQueries: [GET_VIDEO_HUB],
      optimisticResponse: { hubUpdate: newHubData },
      onError: apolloError => {
        LOG.error(`Error while updating hub data for hub [${videoCenterId}] with error : `, apolloError);
        setErrorAlertMessage('hub_network_error_text');
      },
      update(cache) {
        cache.writeQuery({
          query: GET_VIDEO_HUB,
          variables: { hubID: { id: videoCenterId } },
          data: { hub: newHubData }
        });
      }
    });
    if (selectedCalendarName) {
      upcomingEventsCalendarCheckMarkClicked({
        eventCalendarName: selectedCalendarName
      });
    }
    setEditCalendars(false);
  };

  const upcomingEventsHeader: JSX.Element = (
    <Header title={translate('upcoming_events_title')} breadCrumbs={headerBreadCrumbs} />
  );

  const upcomingEventsRenderer = (): JSX.Element => (
    <div>
      {errorAlertMessaage && (
        <div css={{ padding: '1rem 0.5rem 0 1.5rem' }}>
          <PageAlert
            appearance="danger"
            id="1"
            content={translate(errorAlertMessaage)}
            dismissible
            onDismiss={() => setErrorAlertMessage(null)}
            isRtl={false}
            testID="upcomingEvents-settings-alert-form-error"
          />
        </div>
      )}
      <div css={{ display: 'flex', width: '100%', flexWrap: 'wrap' }}>
        <div css={calendarSelectionStyle}>
          <CardContainer
            testID="upcoming-events-calendar-selection"
            enabled={editCalendars}
            onEdit={onEditCalendars}
            onCancel={onCancelCalendars}
            onSubmit={() => onSaveChanges(selectedCalendarId)}
          >
            <CalendarSelection
              editMode={editCalendars}
              calendarList={data?.calendars?.data}
              calendarId={selectedCalendarId}
              onSelection={(value, calendarName) => onCalendarSelection(value, calendarName)}
            />
          </CardContainer>
        </div>
        <div css={manageCalendarStyle}>
          <ContentCard
            containerStyle={{ marginBottom: '1rem' }}
            ariaLabel={translate('Settings-Upcoming-Events-Card-Calendar-Header')}
          >
            <div css={{ display: 'flex', alignItems: 'flex-start' }}>
              <img src={spotCalendar.src} alt="" />
              <div css={{ flex: 1, paddingLeft: '0.5rem' }}>
                <div css={title} {...injectTestId('calendar-core-reference-title')}>
                  {translate('Settings-Upcoming-Events-Card-Calendar-Header')}
                </div>
                <div css={body} {...injectTestId('calendar-core-reference-description')}>
                  {translate('Settings-Upcoming-Events-Card-Calendar-Body')}
                </div>
                <p style={{ margin: 0 }}>
                  <TextLink
                    {...injectTestId('calendar-core-reference-link')}
                    href={coreCalendarUrl}
                    target="_blank"
                    onClick={() => manageCalendarsButtonClicked({})}
                  >
                    <span style={{ color: 'inherit' }}>
                      <ExternalLinkIcon /> {translate('Settings-Upcoming-Events-Card-Calendar-Button')}
                    </span>
                  </TextLink>
                </p>
              </div>
            </div>
          </ContentCard>
          <ContentCard
            id="tracking_parameters_card"
            ariaLabel={translate('Settings-Tracking-Parameters-Card-Calendar-Header')}
          >
            <div css={{ display: 'flex', alignItems: 'flex-start' }}>
              <img src={spotIntegrations.src} alt="" />
              <div css={{ flex: 1, paddingLeft: '0.5rem' }}>
                <div css={title} {...injectTestId('tracking-parameters-reference-title')}>
                  {translate('Settings-Tracking-Parameters-Card-Calendar-Header')}
                </div>
                <div css={body} {...injectTestId('tracking-parameters-reference-description')}>
                  {translate('Settings-Tracking-Parameters-Card-Calendar-Body')}
                </div>
                <p style={{ margin: 0 }}>
                  <TextLink
                    {...injectTestId('tracking-parameters-reference-link')}
                    href={TRACKING_CODES_URL.replace(VIDEO_HUB_PATH_PARAM_KEY, videoCenterId)}
                  >
                    <span style={{ color: 'inherit' }}>
                      <ExternalLinkIcon /> {translate('Settings-Tracking-Parameters-Card-Parameters-Button')}
                    </span>
                  </TextLink>
                </p>
              </div>
            </div>
          </ContentCard>
        </div>
      </div>
    </div>
  );

  return (
    <div css={container}>
      <ScrollViewWithBars header={upcomingEventsHeader}>
        <LoadingWrapper
          loading={loading || loadingCalendars}
          renderer={upcomingEventsRenderer}
          errors={[getPlannerEventHubError, getCalendarsError]}
        />
      </ScrollViewWithBars>
    </div>
  );
}

interface Props {
  videoCenterId: string;
  videoCenterTitle: string;
  calendarId: string;
}

export default UpcomingEventsSettings;

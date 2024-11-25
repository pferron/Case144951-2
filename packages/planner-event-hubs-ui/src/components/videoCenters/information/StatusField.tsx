import React from 'react';
import { Col } from '@cvent/carina/components/Col';
import { Row } from '@cvent/carina/components/Row';
import FormElement from '@cvent/carina/components/FormElement/FormElement';
import { HelpCirclePopper } from '@components/tracking-codes/HelpCirclePopper';
import { RadioGroup } from '@cvent/carina/components/Forms';
import TextLink from '@cvent/carina/components/TextLink';
import { useQuery } from '@apollo/client';
import { useTranslate } from 'nucleus-text';
import {
  CHANNELS_URL,
  VIDEO_HUB_PATH_PARAM_KEY,
  VIDEO_HUB_STATUS_ACTIVE,
  VIDEO_HUB_STATUS_INACTIVE,
  VIDEO_HUB_STATUS_LIVE
} from '@utils/constants';
import { CommonFormStyles, InformationStyles } from '@components/videoCenters/style';
import { useStyle } from '@hooks/useStyle';
import { ConfigStatus, ChannelStatus } from '@cvent/planner-event-hubs-model/types';
import { getPlannerPaginatedChannelsQuery } from '@cvent/planner-event-hubs-model/operations/channel';

interface Props {
  centerId: string;
  setTempStatus: (tempStatus: object) => void;
}

function StatusField({ centerId, setTempStatus }: Props): JSX.Element {
  const { sectionTitle, popOverStyles } = useStyle(CommonFormStyles);
  const { translate } = useTranslate();
  const { messageText } = useStyle(InformationStyles);

  const { data, loading } = useQuery(getPlannerPaginatedChannelsQuery, {
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first',
    variables: {
      hubId: centerId
    }
  });

  const handleChange = values => {
    if (values.target.textContent === VIDEO_HUB_STATUS_LIVE) {
      setTempStatus({ status: VIDEO_HUB_STATUS_ACTIVE });
    } else {
      setTempStatus({ status: VIDEO_HUB_STATUS_INACTIVE });
    }
  };
  const channelData = data?.getPlannerPaginatedChannels.data;
  const hasChannels = !!channelData?.length;
  const activeChannels = hasChannels
    ? channelData.filter(c => c.status.toLowerCase() === ChannelStatus.Active.toLowerCase())
    : 0;
  const hasActiveChannels = !!activeChannels.length;

  const channelLink = (
    <span css={messageText}>
      {translate('video_center_status_no_active_channel_message')}
      &nbsp;
      <TextLink target="_blank" href={`${CHANNELS_URL.replace(VIDEO_HUB_PATH_PARAM_KEY, centerId)}/`}>
        {translate('video_center_status_view_channels_link')}
      </TextLink>
    </span>
  );

  return (
    <>
      <h2 css={sectionTitle}>{translate('video_center_status_header')}</h2>
      <Row margin={-8}>
        <Col>
          <div css={popOverStyles}>
            <FormElement.Label label={translate('video_center_status_label')} labelFor="status" />
            <HelpCirclePopper
              testID="video-center-status"
              helpText={translate('video_center_status_tooltip_body')}
              accessibilityLabel={translate('video_center_status_label')}
            />
          </div>
          <RadioGroup
            label=""
            name="status"
            id="video-hub-form-status"
            options={[
              { label: translate('video_center_status_label_inactive'), value: ConfigStatus.Inactive },
              { label: translate('video_center_status_label_active'), value: ConfigStatus.Active }
            ]}
            readOnlyRenderer={value =>
              value === ConfigStatus.Inactive
                ? translate('video_center_status_label_inactive')
                : translate('video_center_status_label_active')
            }
            onChange={handleChange}
            testID="video-center-status-options"
          />
          {!loading && !hasActiveChannels && channelLink}
        </Col>
      </Row>
    </>
  );
}

export default StatusField;

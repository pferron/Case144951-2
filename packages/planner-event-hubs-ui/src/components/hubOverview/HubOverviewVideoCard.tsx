import { Col } from '@cvent/carina/components/Col';
import { Row } from '@cvent/carina/components/Row';
import { CardBody, CardContainer } from '@cvent/carina/components/Card';
import React, { useMemo } from 'react';
import { useStyle } from '@hooks/useStyle';
import { HubOverviewTopVideoStyle } from '@components/hubOverview/style';
import { ArrowCarrotDownIcon, ArrowCarrotUpIcon } from '@cvent/carina-icon';
import { injectTestId } from '@cvent/nucleus-test-automation';
import { useTheme } from '@cvent/carina/components/ThemeProvider/useTheme';
import { useTranslate } from 'nucleus-text';
import { TopVideos } from '@cvent/planner-event-hubs-model/types';
import { LoadingSpinner } from '@cvent/carina/components/LoadingSpinner';
import { HubOverviewErrorCard } from '@components/hubOverview/HubOverviewErrorCard';

interface Props {
  testId: string;
  topFiveVideosViewedData: TopVideos[];
  isLoadingData: boolean;
  error?: boolean;
  tryAgain?: () => void;
}
interface TopVideosIconProps {
  dangerColour: string;
  successColour: string;
  video: TopVideos;
}
interface TopVideosList {
  topFiveVideosViewedData: TopVideos[];
  testId: string;
}
function TopVideosPosition({ dangerColour, successColour, video }: TopVideosIconProps): JSX.Element {
  const positionImpact = video.previousPosition - video.currentPosition;

  if (positionImpact === 0) return <div css={{ marginLeft: '1.5rem' }}>--</div>;
  if (positionImpact > 0 || video.previousPosition === 0) {
    return (
      <>
        <div css={{ color: successColour, marginLeft: '1.5rem' }}>{Math.abs(positionImpact)}</div>
        <div css={{ marginTop: '-0.125rem' }}>
          <ArrowCarrotUpIcon color={successColour} size="l" />
        </div>
      </>
    );
  }

  return (
    <>
      <div css={{ color: dangerColour, marginLeft: '1.5rem' }}>{Math.abs(positionImpact)}</div>
      <div css={{ marginTop: '-0.125rem' }}>
        <ArrowCarrotDownIcon color={dangerColour} size="l" />
      </div>
    </>
  );
}

function TopVideosList({ topFiveVideosViewedData, testId }: TopVideosList): JSX.Element {
  const styles = useStyle(HubOverviewTopVideoStyle);
  const { translate } = useTranslate();
  const { font } = useTheme();

  if (!topFiveVideosViewedData || !topFiveVideosViewedData.length) {
    return (
      <Row margin={{ start: 24 }} key={`${testId}-empty-row`}>
        <Col>
          <h2>--</h2>
        </Col>
      </Row>
    );
  }
  return (
    <>
      <Row>
        <Col width={0.25} css={styles.headingTitleStyle}>
          <div css={styles.headingTitleStyle} {...injectTestId('top-videos-rank')}>
            {translate('hub_overview_top_videos_rank')}
          </div>
        </Col>
        <Col width={0.5}>
          <div css={styles.headingTitleStyle} {...injectTestId('top-videos-name')}>
            {translate('hub_overview_top_videos_name')}
          </div>
        </Col>
        <Col width={0.25}>
          <div css={styles.headingTitleStyle} {...injectTestId('top-videos-last-week')}>
            {translate('hub_overview_top_videos_last_week')}
          </div>
        </Col>
      </Row>
      {topFiveVideosViewedData.map((video, index) => (
        <Row key={video.videoId}>
          <Col width={0.25}>
            <div css={{ marginLeft: '1.5rem' }}>{index + 1}</div>
          </Col>
          <Col width={0.5}>
            <div css={{ marginBottom: '1rem', marginLeft: '1.5rem', wordWrap: 'break-word' }}>
              {video.videoName}
              <br />
              <span css={styles.hubOverviewViews}>
                {translate('hub_overview_total_view_card_views_text', {
                  totalVideoViews: video.totalViews
                })}
              </span>
            </div>
          </Col>
          <Col width={0.25}>
            <div css={[styles.summaryTileFooterStyle]}>
              <TopVideosPosition
                video={video}
                successColour={font.color.success.base}
                dangerColour={font.color.danger.base}
              />
            </div>
          </Col>
        </Row>
      ))}
    </>
  );
}

export function HubOverviewVideoCard({
  testId,
  topFiveVideosViewedData,
  isLoadingData,
  tryAgain,
  error
}: Props): JSX.Element {
  const styles = useStyle(HubOverviewTopVideoStyle);
  const { translate } = useTranslate();

  const displayContent = useMemo(
    () =>
      error ? (
        <HubOverviewErrorCard testId="video-card-error" tryAgain={tryAgain} />
      ) : (
        <div css={styles.summaryTileCardBody}>
          <p css={styles.summaryTileTitleStyle} {...injectTestId('top-videos-title')}>
            {translate('hub_overview_top_videos_title')}
          </p>
          {isLoadingData ? (
            <LoadingSpinner
              size="m"
              testID="loading-overview-top-five-video-spinner"
              aria-label={translate('hub_overview_loading_text')}
            />
          ) : (
            <TopVideosList topFiveVideosViewedData={topFiveVideosViewedData} testId={testId} />
          )}
        </div>
      ),
    [error, topFiveVideosViewedData, testId, tryAgain, styles, translate, isLoadingData]
  );
  return (
    <div css={styles.topVideosCard} {...injectTestId(`${testId}`)}>
      <CardContainer responsive height="97.4%" width="50%" css={{ marginBottom: '1.125rem' }}>
        <CardBody>{displayContent}</CardBody>
      </CardContainer>
    </div>
  );
}

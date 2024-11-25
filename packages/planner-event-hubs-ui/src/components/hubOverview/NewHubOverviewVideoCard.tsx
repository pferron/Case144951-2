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
import type { TopVideos } from '@cvent/planner-event-hubs-model/types';
import { LoadingSpinner } from '@cvent/carina/components/LoadingSpinner';
import { HubOverviewErrorCard } from '@components/hubOverview/HubOverviewErrorCard';
import { Dropdown } from '@cvent/carina/components/Dropdown';
import TextLink from '@cvent/carina/components/TextLink';
import router from 'next/router';
import { VIDEO_HUB_PATH_PARAM_KEY, VIDEO_HUB_URL } from '@utils/constants';

interface Props {
  hubId: string;
  testId: string;
  topFiveVideosViewedData: TopVideos[];
  isLoadingData: boolean;
  error?: boolean;
  tryAgain?: () => void;
  dateRangeOptions: { value: string; label: string }[];
  selectedDateRange: { value: string };
  setSelectedDateRange: (dateRange) => void;
  handleDateSelection: (value) => void;
}
interface TopVideosIconProps {
  video: TopVideos;
}
interface TopVideosList {
  topFiveVideosViewedData: TopVideos[];
  testId: string;
  dateRangeOptions: { value: string; label: string }[];
  selectedDateRange: { value: string };
  setSelectedDateRange: (dateRange) => void;
  handleDateSelection: (value) => void;
}
function TopVideosPosition({ video }: TopVideosIconProps): React.JSX.Element {
  const positionImpact = video.previousPosition - video.currentPosition;
  const { font } = useTheme();
  const styles = useStyle(HubOverviewTopVideoStyle);

  if (positionImpact === 0) return <div css={{ marginLeft: '1.5rem' }}>--</div>;
  if (positionImpact > 0 || video.previousPosition === 0) {
    return (
      <>
        <div css={styles.successStyle}>{Math.abs(positionImpact)}</div>
        <div css={{ marginTop: '-0.125rem' }}>
          <ArrowCarrotUpIcon color={font.color.success.base} size="l" />
        </div>
      </>
    );
  }

  return (
    <>
      <div css={styles.dangerStyle}>{Math.abs(positionImpact)}</div>
      <div css={{ marginTop: '-0.125rem' }}>
        <ArrowCarrotDownIcon color={font.color.danger.base} size="l" />
      </div>
    </>
  );
}

function TopVideosList({
  topFiveVideosViewedData,
  testId,
  dateRangeOptions,
  selectedDateRange,
  setSelectedDateRange,
  handleDateSelection
}: TopVideosList): JSX.Element {
  const styles = useStyle(HubOverviewTopVideoStyle);
  const { translate } = useTranslate();

  return (
    <>
      <Row>
        <Col width={0.15} css={styles.headingTitleStyle}>
          <div css={styles.headingRankNameStyle} {...injectTestId('top-videos-rank')}>
            {translate('hub_overview_top_videos_rank')}
          </div>
        </Col>
        <Col width={0.5}>
          <div css={styles.headingRankNameStyle} {...injectTestId('top-videos-name')}>
            {translate('hub_overview_top_videos_name')}
          </div>
        </Col>
        <Col width={0.35}>
          <div css={styles.headingTitleStyle} {...injectTestId('top-videos-date-range')}>
            <Dropdown
              id="top-videos-date-range-dropdown"
              labelText={translate('hub_overview_date_range_dropdown_label')}
              onUpdate={value => {
                setSelectedDateRange({ value });
                handleDateSelection(value);
              }}
              options={dateRangeOptions}
              selected={selectedDateRange}
              variant="outline"
              testID="top-videos-date-range-dropdown"
            />
          </div>
        </Col>
      </Row>
      {!topFiveVideosViewedData?.length && (
        <Row margin={{ start: 24 }} key={`${testId}-empty-row`}>
          <Col>
            <h2>--</h2>
          </Col>
        </Row>
      )}
      {topFiveVideosViewedData?.map((video, index) => (
        <Row key={video.videoId}>
          <Col width={0.15}>
            <div css={{ marginLeft: '1.5rem' }}>{index + 1}</div>
          </Col>
          <Col width={0.5}>
            <div css={styles.videoNameStyle}>
              {video.videoName}
              <br />
              <span css={styles.hubOverviewViews}>
                {translate('hub_overview_total_view_card_views_text', {
                  totalVideoViews: video.totalViews
                })}
              </span>
            </div>
          </Col>
          <Col width={0.35}>
            <div css={[styles.summaryTileFooterStyleNewComponent]}>
              <TopVideosPosition video={video} />
            </div>
          </Col>
        </Row>
      ))}
    </>
  );
}

// TODO: Delete the old component HubOverviewVideoCard when the feature flag is removed. This will be done with release of epic HUB-116647
export function NewHubOverviewVideoCard({
  hubId,
  testId,
  topFiveVideosViewedData,
  isLoadingData,
  tryAgain,
  dateRangeOptions,
  selectedDateRange,
  setSelectedDateRange,
  handleDateSelection,
  error
}: Props): React.JSX.Element {
  const styles = useStyle(HubOverviewTopVideoStyle);
  const { translate } = useTranslate();

  const displayContent = useMemo(
    () =>
      error ? (
        <HubOverviewErrorCard testId="video-card-error" tryAgain={tryAgain} />
      ) : (
        <div css={styles.summaryTileCardBody}>
          <div css={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p css={styles.summaryTileTitleStyle} {...injectTestId('top-videos-title')}>
              {translate('hub_overview_top_videos_title')}
            </p>
            {topFiveVideosViewedData && topFiveVideosViewedData.length > 0 && (
              <TextLink
                element="button"
                css={styles.viewMoreButtonStyle}
                onClick={() => {
                  router.push(VIDEO_HUB_URL.replace(VIDEO_HUB_PATH_PARAM_KEY, `${hubId}/video-engagement`));
                }}
              >
                {translate('view_more_button')}
              </TextLink>
            )}
          </div>
          {isLoadingData ? (
            <LoadingSpinner
              size="m"
              testID="loading-overview-top-five-video-spinner"
              aria-label={translate('hub_overview_loading_text')}
            />
          ) : (
            <TopVideosList
              topFiveVideosViewedData={topFiveVideosViewedData}
              testId={testId}
              dateRangeOptions={dateRangeOptions}
              selectedDateRange={selectedDateRange}
              setSelectedDateRange={setSelectedDateRange}
              handleDateSelection={handleDateSelection}
            />
          )}
        </div>
      ),
    [
      hubId,
      error,
      topFiveVideosViewedData,
      testId,
      tryAgain,
      styles,
      translate,
      isLoadingData,
      dateRangeOptions,
      selectedDateRange,
      setSelectedDateRange,
      handleDateSelection
    ]
  );
  return (
    <div css={styles.topVideosCard} {...injectTestId(`${testId}`)}>
      <CardContainer responsive height="97.4%" width="50%" css={{ marginBottom: '1.125rem' }}>
        <CardBody>{displayContent}</CardBody>
      </CardContainer>
    </div>
  );
}

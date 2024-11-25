import React, { useCallback, useState } from 'react';
import { Table, TableColumn } from '@cvent/carina/components/Table';
import { useTranslate } from 'nucleus-text';
import { useStyle } from '@hooks/useStyle';
import { VideoTableStyle } from '@components/videoEngagement/style';
import { ASC, DESC, VIDEO_DURATION_COLUMN, VIDEO_TITLE_COLUMN, VIDEO_VIEWS_COLUMN } from '@utils/constants';
import { TextLink } from '@cvent/carina/components/TextLink';
import AudienceEngagementModal from '@components/videoEngagement/AudienceEngagementModal';
import { formatDuration } from '@components/videoEngagement/DateRangeOptions';
import type { VideoAnalyticsItem } from '@cvent/planner-event-hubs-model/src/types';

type ColumnType = typeof VIDEO_TITLE_COLUMN | typeof VIDEO_VIEWS_COLUMN | typeof VIDEO_DURATION_COLUMN;

function VideoTable({ hubId, videoList, onSort, dateFilter }: Props): React.JSX.Element {
  const { translate } = useTranslate();
  const { normalText, nameColumn, thumbnailContainer, roundedTable, thumbnailImage } = useStyle(VideoTableStyle);
  const [sortDirection, setSortDirection] = useState<typeof ASC | typeof DESC | undefined>(DESC);
  const [sortColumn, setSortColumn] = useState<ColumnType>(VIDEO_VIEWS_COLUMN);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const videoData = videoList.map(video => ({
    videoId: video.videoId,
    videoTitle: video.videoTitle,
    views: video.views,
    videoDuration: video.videoDuration,
    thumbnail: video.thumbnail,
    rowName: video.videoId
  }));

  const onColumnClick = useCallback(
    (columnName: ColumnType) => {
      let newSortDirection: typeof ASC | typeof DESC | undefined;
      if (columnName === sortColumn) {
        newSortDirection = sortDirection === ASC ? DESC : ASC;
      } else {
        newSortDirection = ASC;
      }
      onSort(columnName, newSortDirection);

      setSortColumn(columnName);
      setSortDirection(newSortDirection);
    },
    [onSort, sortColumn, sortDirection]
  );

  const thumbnailColumnRenderer = (_cellData, { rowData }): React.JSX.Element => (
    <div css={thumbnailContainer}>
      {rowData.thumbnail ? (
        <img src={rowData.thumbnail} alt={translate('thumbnail_alt_text')} css={thumbnailImage} />
      ) : (
        <p>-</p>
      )}
    </div>
  );

  const videoTitleColumnRenderer = (_cellData, { rowData }): React.JSX.Element => (
    <div css={nameColumn}>
      <div css={normalText}>
        <TextLink
          onClick={() => {
            setSelectedVideo(rowData);
            setIsModalOpen(true);
          }}
          testID={`video-name-link-${rowData.id}`}
          aria-label={translate('video_name_link_aria_label')}
        >
          {rowData.videoTitle}
        </TextLink>
      </div>
    </div>
  );

  const totalViewsColumnRenderer = (_cellData, { rowData }): React.JSX.Element => (
    <p css={normalText} data-dd-privacy="mask">
      {rowData.views || '-'}
    </p>
  );

  const durationColumnRenderer = (_cellData, { rowData }): React.JSX.Element => (
    <p css={normalText} data-dd-privacy="mask">
      {rowData.videoDuration ? formatDuration(rowData.videoDuration) : '-'}
    </p>
  );

  return (
    <>
      <Table
        data={videoData}
        striped
        css={roundedTable}
        externallySorted
        testID="video_list_table"
        sortDirection={sortDirection}
        sortColumn={sortColumn}
        onColumnClick={onColumnClick}
      >
        <TableColumn width={150} name="thumbnail" heading="" cellRenderer={thumbnailColumnRenderer} />
        <TableColumn
          name="videoTitle"
          heading={translate('video_list_header_name')}
          cellRenderer={videoTitleColumnRenderer}
          sortable
        />
        <TableColumn
          name="views"
          heading={translate('video_list_header_views')}
          hideWhenCollapsed
          cellRenderer={totalViewsColumnRenderer}
          sortable
        />
        <TableColumn
          name="videoDuration"
          heading={translate('video_list_header_duration')}
          hideWhenCollapsed
          cellRenderer={durationColumnRenderer}
          sortable
        />
      </Table>
      {isModalOpen && selectedVideo && (
        <AudienceEngagementModal
          hubId={hubId}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          video={{
            id: selectedVideo.videoId,
            name: selectedVideo.videoTitle,
            duration: selectedVideo.videoDuration
          }}
          testId="audience-engagement-modal"
          dateFilter={dateFilter}
        />
      )}
    </>
  );
}

interface Video {
  videoId: string;
  videoTitle: string;
  views: number;
  videoDuration: number;
  thumbnail: string;
}

interface Props {
  hubId: string;
  videoList: VideoAnalyticsItem[];
  onSort: (
    sortColumn: typeof VIDEO_TITLE_COLUMN | typeof VIDEO_VIEWS_COLUMN | typeof VIDEO_DURATION_COLUMN,
    sortOrder: typeof ASC | typeof DESC | undefined
  ) => void;
  dateFilter: {
    dateForAnalytics:
      | {
          type: string;
          value: { startDate: Date; endDate: Date };
        }
      | number
      | null;
    selectedTimeFrame: string;
    selectedDateRange: {
      value: string;
    };
  };
}

export default VideoTable;

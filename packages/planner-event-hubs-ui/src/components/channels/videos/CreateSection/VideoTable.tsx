import React, { useCallback } from 'react';
import { LoadingSpinner } from '@cvent/carina/components/LoadingSpinner';
import { useTranslate } from 'nucleus-text';
import { ExtendedItem } from '@components/channels/type/channelCatalog';
import Col from '@cvent/carina/components/Col';
import Row from '@cvent/carina/components/Row';
import {
  basicHeadingRenderer,
  INDETERMINATE,
  Table,
  TableColumn,
  TypedCellRenderer
} from '@cvent/carina/components/Table';
import { DURATION, TITLE } from '@utils/constants';
import { ClockIcon } from '@cvent/carina/components/Icon';
import { useStyle } from '@hooks/useStyle';
import { VideoListStyles } from '@components/channels/videos/style';
import { useTheme } from '@cvent/carina/components/ThemeProvider/useTheme';
import useBreakpoints from '@hooks/useBreakpoints';
import { formatHoursFromMilliseconds } from '@components/channels/videos/videoHelper';
import { IllustrationNotice } from '@cvent/carina/components/Templates/IllustrationNotice';
import { IllustrationHeader } from '@cvent/carina/components/Templates/IllustrationHeader';
import HeroSearch from '@cvent/carina/components/Illustrations/HeroSearch';
import { HeadingRenderer } from '@cvent/carina/components/Table/TableColumn';

interface Props {
  videos: Array<ExtendedItem>;
  loading?: boolean;
  selected: Array<string>;
  setSelected: (selectVideos: Array<string>) => void;
}

function VideoTable({ videos, loading = false, selected, setSelected }: Props): JSX.Element {
  const { translate } = useTranslate();
  const { itemThumbnail, placeholderImage, titleTextStyles, videoTileContainer } = useStyle(VideoListStyles);
  const theme = useTheme();
  const { isMobile } = useBreakpoints();

  const convertedVideos = videos.map(videoObj => ({ ...videoObj, rowName: `${videoObj.id}` }));

  const handleMultiSelectAction = useCallback(
    ({ rowName }) => {
      setSelected([rowName]);
    },
    [setSelected]
  );

  const handleGlobalSelect = useCallback(
    ({ visibleRowNames, globalSelectIndicator }) => {
      if (globalSelectIndicator === INDETERMINATE || globalSelectIndicator === true) {
        setSelected([]);
      } else if (!globalSelectIndicator) {
        setSelected(visibleRowNames);
      }
    },
    [setSelected]
  );

  const onSelectCallback = useCallback(
    (rowName, { isSelected }) => {
      if (isSelected) {
        setSelected(selected.filter(selectedRowName => selectedRowName !== rowName));
      } else {
        setSelected([...selected, rowName]);
      }
    },
    [selected, setSelected]
  );

  const nameCellRenderer: TypedCellRenderer<ExtendedItem> = useCallback(
    (_cellData, { rowData }) => {
      const imageUrl = rowData?.thumbnail;
      return (
        <div css={{ ...videoTileContainer, paddingLeft: '0.5rem' }}>
          <Row margin={-8}>
            <Col width="content" flex={{ display: 'flex', alignItems: 'center' }} padding={0}>
              <div css={itemThumbnail}>
                {imageUrl ? (
                  <img src={imageUrl} css={itemThumbnail} alt="video" />
                ) : (
                  <div css={placeholderImage}>
                    <ClockIcon size="m" color={theme.backgroundColor.interactive.fill.base} />
                  </div>
                )}
              </div>
            </Col>
            <Col width="fill" padding={0}>
              <p css={titleTextStyles}>{rowData.displayName}</p>
            </Col>
          </Row>
        </div>
      );
    },
    [itemThumbnail, placeholderImage, theme.backgroundColor.interactive.fill.base, titleTextStyles, videoTileContainer]
  );

  const durationCellRenderer: TypedCellRenderer<ExtendedItem> = useCallback(
    (cellData: number) => (
      <div style={{ display: 'flex', justifyContent: 'flex-start', paddingLeft: '60%' }}>
        <div style={{ fontSize: '1rem' }}>{formatHoursFromMilliseconds(cellData)}</div>
      </div>
    ),
    []
  );

  const nameCellHeadingRenderer: HeadingRenderer = useCallback(
    (_heading, headingProps) => (
      <div style={{ display: 'flex', justifyContent: 'flex-start', paddingLeft: '5.8rem' }}>
        {basicHeadingRenderer(translate('channel_video_create_section_table_title_column_header'), headingProps)}
      </div>
    ),
    [translate]
  );

  const durationCellHeadingRenderer: HeadingRenderer = useCallback(
    (_heading, headingProps) => (
      <div style={{ display: 'flex', justifyContent: 'flex-start', paddingLeft: '60%' }}>
        {basicHeadingRenderer(translate('channel_video_create_section_table_duration_column_header'), headingProps)}
      </div>
    ),
    [translate]
  );

  const EmptyPage: JSX.Element = (
    <IllustrationNotice testID="select-video-modal-empty-page-container" illustration={HeroSearch}>
      <IllustrationHeader>{translate('channel_video_create_section_table_no_video')}</IllustrationHeader>
    </IllustrationNotice>
  );

  return (
    <Table
      testID="select-video-modal-table"
      data={convertedVideos}
      striped
      staticActionsMenu
      rowMode="multi-select"
      selected={selected}
      onSelect={onSelectCallback}
      onGlobalSelect={handleGlobalSelect}
      onMultiSelectAction={rowName => {
        handleMultiSelectAction(rowName);
      }}
      paddingMode="condensed"
      empty={(loading && <LoadingSpinner size="m" />) || (convertedVideos.length === 0 && EmptyPage) || null}
      initialSortColumn={TITLE}
    >
      <TableColumn name={TITLE} sortable cellRenderer={nameCellRenderer} headingRenderer={nameCellHeadingRenderer} />
      {!isMobile && (
        <TableColumn
          hideWhenCollapsed
          name={DURATION}
          sortable
          cellRenderer={durationCellRenderer}
          headingRenderer={durationCellHeadingRenderer}
        />
      )}
    </Table>
  );
}

export default VideoTable;

import { useQuery } from '@apollo/client';
import {
  HomePageCustomizationStyles,
  SingleChannelSectionStyles,
  VideoTableStyle
} from '@components/homepage-customization/homePageCustomizationStyles';
import { Button } from '@cvent/carina/components/Button';
import {
  CheckboxGroup,
  Dropdown,
  Form,
  RadioGroup,
  Textbox,
  useField,
  useFormContext,
  useWatchField
} from '@cvent/carina/components/Forms';
import { ChannelStatus, Video } from '@cvent/planner-event-hubs-model/types';
import { useCenterInfo } from '@hooks/useCenterInfo';
import { useStyle } from '@hooks/useStyle';
import { HC_SINGLE_CHANNEL_MAX_VIDEO_LIMIT, HC_UP_EVENTS_DISPLAY_NAME_LIMIT } from '@utils/constants';
import { useTranslate } from 'nucleus-text';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { getPlannerPaginatedChannelsQuery } from '@cvent/planner-event-hubs-model/operations/channel';
import dynamic from 'next/dynamic';
import { DraggableTableProps, useTable } from '@cvent/carina/components/Table';
import { injectTestId } from '@cvent/nucleus-test-automation';
import { SelectVideoModal, SelectedVideoType } from '@cvent/shared-upload-library';
import { useChannelsPageActionsApi } from '@metrics/client/react/useChannelsPageActionsApi';
import LoadingSpinner from '@cvent/carina/components/LoadingSpinner';
import { FormElement } from '@cvent/carina/components/FormElement';
import { getVideosQuery } from '@cvent/planner-event-hubs-model/operations/video';
import { HelpCirclePopper } from '@components/tracking-codes/HelpCirclePopper';
import useBreakpoints from '@hooks/useBreakpoints';
import { TrashIcon } from '@cvent/carina-icon';
import Tooltip from '@cvent/carina/components/Tooltip';
import {
  ContentFilterType,
  PageSectionTemplates,
  alignmentStyles,
  contentLimit,
  details,
  timeFrame,
  PAGE_SECTION_CONTENT_FILTER_TYPE,
  PAGE_SECTION_CONTENT_IDS,
  PAGE_SECTION_TITLE,
  PAGE_SECTION_ALIGNMENT,
  PAGE_SECTION_VISIBLE_FIELDS,
  PAGE_SECTION_FEATURED_CONTENT_TYPE_ID,
  PAGE_SECTION_CONTENT_FILTER_DATE_ABSTRACT,
  PageSectionProps
} from '../HomePageSectionMeta';
import SingleChannelSectionPreviewer from './SingleChannelSectionPreviewer';

type SingleChannelProps = PageSectionProps & {
  channelsList?: { label: string; value: string }[];
  videoData?: Video[];
  setVideoData?: (video) => void;
  loadingVideoList?: boolean;
};

const DraggableTable = dynamic<DraggableTableProps>(() =>
  import('@cvent/carina/components/Table').then(mod => mod.DraggableTable)
);

function SingleChannelSection({
  pageSection,
  setIsPageEdited,
  onSectionUpdate,
  setShowSectionTemplate,
  setSelectedSection,
  getUpdatedSectionIds
}: PageSectionProps): React.JSX.Element {
  const { translate } = useTranslate();
  const { description } = useStyle(HomePageCustomizationStyles);
  const { outerContainer } = useStyle(SingleChannelSectionStyles);

  const initialValuesSingleChannel = {
    ...pageSection,
    contentLimitOnInitialLoad: pageSection?.contentLimitOnInitialLoad || contentLimit.UP_TO_4,
    alignment: pageSection?.alignment || alignmentStyles.LEFT,
    contentFilterType: pageSection?.contentFilterType || ContentFilterType.NEW_VIDEOS,
    contentIds: pageSection?.contentIds || [],
    visibleFields: [...new Set([...(pageSection?.visibleFields ?? []), details.TITLE_VIDEO, details.THUMBNAIL_VIDEO])],
    title: pageSection?.title || '',
    contentFilterDateAbstract: pageSection?.contentFilterDateAbstract || timeFrame.ALL_TIME
  };

  return (
    <div css={outerContainer}>
      <div css={[description, { margin: '1rem 0rem 0.5rem' }]}>
        {translate('home_page_custom_single_channel_section_description')}
      </div>

      <Form
        testID="single-channel-section-form"
        initialValues={initialValuesSingleChannel}
        initializationMode="reinitialize"
        validateOnInitialization
      >
        <SingleChannelSectionForm
          pageSection={pageSection}
          setIsPageEdited={setIsPageEdited}
          onSectionUpdate={onSectionUpdate}
          setShowSectionTemplate={setShowSectionTemplate}
          setSelectedSection={setSelectedSection}
          getUpdatedSectionIds={getUpdatedSectionIds}
        />
      </Form>
    </div>
  );
}

function SingleChannelSectionForm({
  pageSection,
  setIsPageEdited,
  onSectionUpdate,
  setShowSectionTemplate,
  setSelectedSection,
  getUpdatedSectionIds
}: SingleChannelProps): React.JSX.Element {
  const { translate, locale } = useTranslate();
  const styles = useStyle(VideoTableStyle);
  const { horizontalLine, listTitle, formButtonStylesWithFloat } = useStyle(HomePageCustomizationStyles);
  const { textBoxAndTextarea, viewOptionsAndPreview, optionsAndPreviewContainer, optionsContainer } =
    useStyle(SingleChannelSectionStyles);
  const { isMobile } = useBreakpoints();
  const { addExistingVideoButtonClicked } = useChannelsPageActionsApi();
  const { hubData } = useCenterInfo();

  // Form contexts and state management
  const [isAddVideoModalOpen, setIsAddVideoModal] = useState<boolean>(false);

  const { getAllValues, setValue } = useFormContext();

  const contentFilterType = useWatchField([PAGE_SECTION_CONTENT_FILTER_TYPE, PAGE_SECTION_CONTENT_IDS]);

  const { featuredContentTypeId: featuredContentTypeIdValue = '' } = useWatchField([
    PAGE_SECTION_FEATURED_CONTENT_TYPE_ID
  ]);

  const sectionInfo = useWatchField([PAGE_SECTION_TITLE]);
  const [isTimeFrameOptionsVisible, toggleTimeFrameOptionsDisplay] = useState(
    [contentFilterType.contentFilterType].includes(ContentFilterType.TOP_VIDEOS)
  );
  const [isCustomOptionSelected, toggleCustomOptionSelected] = useState(
    [contentFilterType.contentFilterType].includes(ContentFilterType.CUSTOM)
  );

  const { setFieldValue: setContentIds } = useField({
    name: PAGE_SECTION_CONTENT_IDS
  });

  const displayOptions = useWatchField([PAGE_SECTION_ALIGNMENT, PAGE_SECTION_VISIBLE_FIELDS]);

  const { [PAGE_SECTION_TITLE]: pageSectionTitle = '' } = useWatchField([PAGE_SECTION_TITLE]);

  const singleChannelRef = useRef(null);

  // Add "setSelectedVideoData"
  // Use setVideoData to store response from getVideos query if needed (think the VideoSelect modal handles this)
  // - if the modal handles fetch to populate the list of videos for selection then we don't need to store the response here
  // - in that case, then we can update the filter we use here to only fetch the videoIds that are in the contentIds array
  const [videoData, setVideoData] = useState([]);

  const { data: channelsData } = useQuery(getPlannerPaginatedChannelsQuery, {
    variables: {
      hubId: hubData?.id
    }
  });

  // We'll avoid adding video id clauses here to take advantage of caching when the contentIds change and we re-fetch
  const videoQueryFilter = `status eq 'Available' AND tags eq 'include-in-library' AND catalogs.channel.id eq '${featuredContentTypeIdValue}'`;
  const customContentIdsAvailable = contentFilterType.contentIds.length > 0;
  const { loading: loadingVideoList } = useQuery(getVideosQuery, {
    variables: {
      filterInput: {
        filter: videoQueryFilter
      }
    },
    skip: !customContentIdsAvailable,
    onCompleted: data => {
      const sortedVideos = [];
      contentFilterType.contentIds.forEach(id => {
        const video = data.getVideos.data.find(vid => vid.id === id);
        if (video) {
          sortedVideos.push(video);
        }
      });
      setVideoData(sortedVideos);
    }
  });

  // Options for checkboxes, radio buttons and dropdowns
  const channelsList = channelsData?.getPlannerPaginatedChannels.data.map(channel => ({
    label: `${channel.title} ${
      channel.status !== ChannelStatus.Active ? `(${translate('channel_status_inactive')})` : ''
    }`,
    value: channel.id
  }));

  const channelOptions = [
    { value: details.DESCRIPTION_CHANNEL, label: translate('home_page_single_channel_description_for_channel') },
    { value: details.VIDEO_COUNT_CHANNEL, label: translate('home_page_single_channel_videoCount_for_channel') }
  ];

  const videoOptions = [
    { value: details.DESCRIPTION_VIDEO, label: translate('home_page_single_channel_description_for_video') },
    { value: details.TITLE_VIDEO, label: translate('home_page_single_channel_title_for_video'), disabled: true },
    { value: details.THUMBNAIL_VIDEO, label: translate('home_page_single_channel_thumbnail_for_video'), disabled: true }
  ];

  const sourceOptions = [
    {
      label: translate('home_page_default_videos_source_option_top_label'),
      value: ContentFilterType.TOP_VIDEOS,
      disabled: false
    },
    {
      label: translate('home_page_default_videos_source_option_new_label'),
      value: ContentFilterType.NEW_VIDEOS,
      disabled: false
    },
    {
      label: translate('home_page_default_videos_source_option_custom_label'),
      value: ContentFilterType.CUSTOM,
      disabled: false
    }
  ];
  const timeFrameOptions = [
    {
      label: translate('home_page_default_videos_time_frame_option_last_7_days'),
      value: timeFrame.LAST_7_DAYS,
      disabled: false
    },
    {
      label: translate('home_page_default_videos_time_frame_option_last_30_days'),
      value: timeFrame.LAST_30_DAYS,
      disabled: false
    },
    {
      label: translate('home_page_default_videos_time_frame_option_last_90_days'),
      value: timeFrame.LAST_90_DAYS,
      disabled: false
    },
    {
      label: translate('home_page_default_videos_time_frame_option_all_time'),
      value: timeFrame.ALL_TIME,
      disabled: false
    }
  ];

  const remainingLengthMessage = translate('characters_left_label', {
    characterCount: HC_UP_EVENTS_DISPLAY_NAME_LIMIT - (sectionInfo.title?.length || 0),
    alignmentStyles
  });

  // Custom Video drag-n-drop table to re-order selections
  const [Table, TableColumn] = useTable({
    data: videoData?.map(video => ({ ...video, rowName: video.id })),
    isDraggable: true,
    DraggableTable
  });

  // Callbacks
  const onDoneClick = (): void => {
    const formValues = getAllValues();
    const updatedSectionIdsLocal = getUpdatedSectionIds(pageSection);

    const newSectionData = {
      ...pageSection,
      ...formValues,
      sectionId: updatedSectionIdsLocal.temporarySectionId,
      pageSectionTemplate: PageSectionTemplates.SINGLE_CHANNEL
    };

    delete newSectionData.__typename; // Remove the __typename property
    delete newSectionData.rowName; // Remove the rowName property

    onSectionUpdate(
      {
        ...newSectionData
      },
      pageSection?.sectionId || null,
      [...updatedSectionIdsLocal.updatedSectionIds]
    );

    setShowSectionTemplate(false);
    setIsPageEdited(true);
    if (!pageSection) {
      setSelectedSection('');
    }
  };

  const onAddVideo = useCallback(
    (selectedVideos: Array<SelectedVideoType>) => {
      setIsAddVideoModal(false);
      setIsPageEdited(true);
      const updatedVideos = [...videoData, ...selectedVideos];
      setVideoData(updatedVideos);
      setContentIds(updatedVideos.map(video => video.id));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [setContentIds, setIsPageEdited, setVideoData, videoData]
  );

  const addVideoModal = useMemo(
    () => (
      <SelectVideoModal
        isOpen={isAddVideoModalOpen}
        onDismiss={() => setIsAddVideoModal(false)}
        baseGraphUrl=""
        onAddVideos={onAddVideo}
        maxRowsPerPage={25}
        showFilters={false}
        showSearchBar
        multiSelectEnabled
        zIndex={110}
        locale={locale}
        clientName="no-op"
        customFilter={`catalogs.channel.id eq '${featuredContentTypeIdValue}'`}
        customTitle={translate('home_page_single_channel_select_videos_modal_title')}
        maxRowsSelection={Math.min(
          HC_SINGLE_CHANNEL_MAX_VIDEO_LIMIT,
          HC_SINGLE_CHANNEL_MAX_VIDEO_LIMIT - (contentFilterType?.contentIds?.length || 0)
        )}
        excludedVideos={contentFilterType.contentIds}
      />
    ),
    [isAddVideoModalOpen, onAddVideo, locale, contentFilterType.contentIds, featuredContentTypeIdValue, translate]
  );

  const customVideos = useMemo(() => {
    const customVideosSelected = (contentFilterType.contentIds || []).length > 0;
    const onDragEnd = (data): void => {
      const selectedVideos = [...videoData];
      const movedVideo = selectedVideos[data.fromIndex];
      selectedVideos.splice(data.fromIndex, 1);
      selectedVideos.splice(data.toIndex, 0, movedVideo);
      setVideoData(selectedVideos);
      setContentIds(selectedVideos.map(video => video.id));
    };
    // The Carina table isn't designed to support Actions on a Draggable variant.
    // rowMode="drag-and-drop" is the only way to enable drag-and-drop but rowMode="actions" provides the styles for action buttons.
    // Design guidelines require action buttons not be treated as columns but always have fixed width and hug the far right.
    const draggableVideoContentColumn = (_, { rowData }): React.JSX.Element => (
      <>
        <div css={{ float: 'right' }}>
          <Button
            appearance="ghost"
            aria-label={translate('home_page_custom_generic_delete')}
            onClick={() => {
              const updatedVideos = videoData.filter(video => video.id !== rowData.id);
              setVideoData(updatedVideos);
              setContentIds(updatedVideos.map(video => video.id));
            }}
            testID={`trash-icon-${rowData.rowName}`}
            icon={TrashIcon}
          />
        </div>
        <div {...injectTestId(`video-placement-table-row-${rowData.rowName}`)} css={{ marginTop: 10 }}>
          {rowData?.title}
        </div>
      </>
    );

    const selectVideosButton = (
      <div>
        <Button
          aria-label={translate('home_page_single_channel_select_videos_button')}
          onClick={(): void => {
            setIsAddVideoModal(true);
            addExistingVideoButtonClicked({});
          }}
          size="m"
          text={translate('home_page_single_channel_select_videos_button')}
          testID="channel-video-add-video-button"
          disabled={contentFilterType?.contentIds?.length === HC_SINGLE_CHANNEL_MAX_VIDEO_LIMIT}
        />
      </div>
    );

    return (
      <>
        <div css={{ width: '12.5rem', paddingBottom: '1rem' }}>
          {contentFilterType?.contentIds?.length === HC_SINGLE_CHANNEL_MAX_VIDEO_LIMIT ? (
            <Tooltip
              text={translate('home_page_single_channel_select_videos_max_limit_tooltip')}
              portal
              trigger={selectVideosButton}
            />
          ) : (
            <div>
              <Button
                aria-label={translate('home_page_single_channel_select_videos_button')}
                onClick={(): void => {
                  setIsAddVideoModal(true);
                  addExistingVideoButtonClicked({});
                }}
                size="m"
                text={translate('home_page_single_channel_select_videos_button')}
                testID="channel-video-add-video-button"
              />
            </div>
          )}
        </div>
        <div css={[listTitle, { paddingBottom: '1rem' }]}>
          {translate('home_page_single_channel_videos_section_videos')}
        </div>
        {loadingVideoList ? <LoadingSpinner size="m" aria-label={translate('events_plus_generic_loading')} /> : null}
        {customVideosSelected && !loadingVideoList ? (
          <div css={{ paddingBottom: 20 }}>
            <Table
              rowMode="drag-and-drop"
              allowDragAndDrop
              css={styles.tableVideoStyle}
              hideHeader
              hideSideBorders
              testID="video-placement-table"
              paddingMode="condensed"
              onDragEnd={onDragEnd}
            >
              <TableColumn name="title" minWidth={1} heading="videos" cellRenderer={draggableVideoContentColumn} />
            </Table>
          </div>
        ) : (
          <div css={{ paddingBottom: 20 }}>{translate('home_page_single_channel_no_videos_selected')}</div>
        )}
      </>
    );
  }, [
    videoData,
    translate,
    addExistingVideoButtonClicked,
    styles.tableVideoStyle,
    listTitle,
    loadingVideoList,
    contentFilterType,
    Table,
    TableColumn,
    setVideoData,
    setContentIds
  ]);

  const validateChannel = (label = '') => {
    if (label.length < 1) {
      return [translate('home_page_sections_validation_error')];
    }
    return undefined;
  };

  const channelStatusLabel: React.JSX.Element = (
    <div css={{ display: 'flex' }}>
      <FormElement.Label
        label={translate('home_page_default_videos_source_options_label')}
        labelFor="contentFilterType"
      />
      <div css={{ paddingLeft: '0.25rem' }}>
        <HelpCirclePopper
          testID="channel-status-tooltip"
          helpText={translate('home_page_default_videos_source_options_tooltip')}
          accessibilityLabel={translate('home_page_default_videos_source_options_tooltip')}
          placement="end-top"
        />
      </div>
    </div>
  );

  return (
    <div ref={singleChannelRef}>
      <div css={viewOptionsAndPreview}>
        {translate('home_page_custom_single_channel_section_channel_information_label')}
      </div>
      {/* Channel Selection and Section name */}
      <div css={textBoxAndTextarea}>
        <Dropdown
          id={`home_page_single_channel_${pageSection?.sectionId}`}
          name={PAGE_SECTION_FEATURED_CONTENT_TYPE_ID}
          options={channelsList}
          label={translate('home_page_single_channel_label')}
          isRequired
          validate={label => validateChannel(label)}
          onUpdate={(value, { label }) => {
            // Reset
            setContentIds([]);
            setVideoData([]);
            setValue('title', label);
          }}
        />
        <Textbox
          label={translate('home_page_custom_upcoming_events_display_name')}
          maxLength={HC_UP_EVENTS_DISPLAY_NAME_LIMIT}
          name={PAGE_SECTION_TITLE}
          messages={remainingLengthMessage}
          isRequired
        />
      </div>
      <div css={horizontalLine} />
      <div css={viewOptionsAndPreview}>{translate('home_page_single_channel_videos_section_title')}</div>

      {/* Video Source Options */}
      <div css={optionsContainer}>
        <div css={{ display: 'flex', flexDirection: 'row' }}>
          <RadioGroup
            id={`videos-section-source-${pageSection?.sectionId}`}
            name="contentFilterType"
            testID={`videos-section-source-${pageSection?.sectionId}`}
            options={sourceOptions}
            selected={contentFilterType.contentFilterType}
            label={channelStatusLabel}
            onUpdate={value => {
              toggleTimeFrameOptionsDisplay(value === ContentFilterType.TOP_VIDEOS);
              toggleCustomOptionSelected(value === ContentFilterType.CUSTOM);
              setContentIds([]);
              setVideoData([]);
            }}
          />
        </div>

        {isTimeFrameOptionsVisible && (
          <div css={{ width: '12.5rem' }}>
            <Dropdown
              id={`home_page_content_filter_time_window_${pageSection?.sectionId}`}
              name={PAGE_SECTION_CONTENT_FILTER_DATE_ABSTRACT}
              options={timeFrameOptions}
              label={translate('home_page_default_videos_time_frame_label_options')}
            />
          </div>
        )}
        {isCustomOptionSelected && customVideos}
        {isAddVideoModalOpen && addVideoModal}
      </div>
      <div css={[horizontalLine]} />
      <div css={viewOptionsAndPreview}>{translate('home_page_custom_upcoming_events_options_title')}</div>
      <div css={optionsAndPreviewContainer}>
        {/* Options for alignment and visible fields */}
        <div css={[optionsContainer, { width: '25%' }]}>
          <RadioGroup
            id="up-events-section-alignement"
            label={translate('home_page_custom_upcoming_events_alignment_tile')}
            name={PAGE_SECTION_ALIGNMENT}
            options={[
              {
                label: translate('home_page_custom_single_channel_alignment_left'),
                value: alignmentStyles.LEFT
              },
              {
                label: translate('home_page_custom_single_channel_alignment_top'),
                value: alignmentStyles.TOP
              }
            ]}
          />
          <CheckboxGroup
            name={PAGE_SECTION_VISIBLE_FIELDS}
            label={translate('home_page_single_channel_visible_fields_channel_details_label')}
            options={channelOptions}
          />
          <CheckboxGroup
            name={PAGE_SECTION_VISIBLE_FIELDS}
            label={translate('home_page_single_channel_visible_fields_video_details_label')}
            options={videoOptions}
          />
        </div>
        {/* Preview */}
        <div css={{ paddingBottom: 20 }}>
          <div css={[listTitle, { paddingBottom: 10 }]}>{translate('home_page_custom_generic_preview_text')}</div>
          {!isMobile ? (
            <SingleChannelSectionPreviewer
              alignment={displayOptions.alignment as string}
              visibleFields={displayOptions.visibleFields as string[]}
            />
          ) : (
            <div>{translate('home_page_sections_mobile_preview_text')}</div>
          )}
        </div>
      </div>
      {/* Cancel and Done buttons */}
      <div css={formButtonStylesWithFloat}>
        <Button
          appearance="ghost"
          aria-label={translate('home_page_sections_add_section_modal_footer_btn_cancel')}
          onClick={() => {
            setShowSectionTemplate(false);
            if (!pageSection) {
              setSelectedSection('');
            }
          }}
          text={translate('home_page_sections_add_section_modal_footer_btn_cancel')}
        />
        <Button
          appearance="filled"
          aria-label={translate('home_page_sections_add_section_modal_footer_btn_done')}
          onClick={onDoneClick}
          text={translate('home_page_sections_add_section_modal_footer_btn_done')}
          disabled={(featuredContentTypeIdValue as string | []).length === 0 || Boolean(!pageSectionTitle?.trim())}
        />
      </div>
    </div>
  );
}
export default SingleChannelSection;

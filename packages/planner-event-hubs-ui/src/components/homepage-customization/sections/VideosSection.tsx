import { Form, RadioGroup, Dropdown, Textbox, useFormContext, useWatchField } from '@cvent/carina/components/Forms';
import { useTranslate } from 'nucleus-text';
import { useStyle } from '@hooks/useStyle';
import React, { useRef, useState } from 'react';
import Button from '@cvent/carina/components/Button';
import { HC_VIDEOS_DISPLAY_NAME_LIMIT } from '@utils/constants';
import {
  ContentFilterType,
  PAGE_SECTION_CONTENT_FILTER_TYPE,
  PAGE_SECTION_CONTENT_FILTER_DATE_ABSTRACT,
  PageSectionTemplates,
  PAGE_SECTION_TITLE,
  alignmentStyles,
  PageSectionProps
} from '../HomePageSectionMeta';
import { HomePageCustomizationStyles, VideosSectionStyles } from '../homePageCustomizationStyles';

function VideosSection({
  pageSection,
  setIsPageEdited,
  onSectionUpdate,
  setShowSectionTemplate,
  setSelectedSection,
  getUpdatedSectionIds
}: PageSectionProps): React.JSX.Element {
  const { translate } = useTranslate();
  const { description } = useStyle(HomePageCustomizationStyles);
  const { outerContainer } = useStyle(VideosSectionStyles);

  const initialVideoSectionValues = {
    ...pageSection,
    contentFilterType: pageSection?.contentFilterType || ContentFilterType.NEW_VIDEOS,
    contentFilterDateAbstract: pageSection?.contentFilterDateAbstract || 'all-time',
    title: pageSection?.title || translate('channel_list_videos')
  };

  return (
    <div css={outerContainer}>
      <div css={[description, { margin: '1rem 0 0.5rem' }]}>{translate('home_page_default_videos_purpose')}</div>
      <Form initialValues={initialVideoSectionValues} initializationMode="reinitialize">
        <VideosSectionForm
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

function VideosSectionForm({
  pageSection,
  setIsPageEdited,
  onSectionUpdate,
  setShowSectionTemplate,
  setSelectedSection,
  getUpdatedSectionIds
}: PageSectionProps): React.JSX.Element {
  const { translate } = useTranslate();
  const { timeFrameContainer, optionsContainer, viewOptionsAndPreview } = useStyle(VideosSectionStyles);

  const sourceOptions = [
    {
      label: translate('home_page_default_videos_source_option_new_label'),
      value: ContentFilterType.NEW_VIDEOS,
      disabled: false
    },
    {
      label: translate('home_page_default_videos_source_option_top_label'),
      value: ContentFilterType.TOP_VIDEOS,
      disabled: false
    }
  ];

  const timeFrameOptions = [
    {
      label: translate('home_page_default_videos_time_frame_option_last_7_days'),
      value: 'last-7-days',
      disabled: false
    },
    {
      label: translate('home_page_default_videos_time_frame_option_last_30_days'),
      value: 'last-30-days',
      disabled: false
    },
    {
      label: translate('home_page_default_videos_time_frame_option_last_90_days'),
      value: 'last-90-days',
      disabled: false
    },
    {
      label: translate('home_page_default_videos_time_frame_option_all_time'),
      value: 'all-time',
      disabled: false
    }
  ];

  const dependencyValues = useWatchField([PAGE_SECTION_CONTENT_FILTER_TYPE, PAGE_SECTION_TITLE]);

  const [isTimeFrameOptionsVisible, toggleTimeFrameOptionsDisplay] = useState(
    [dependencyValues[PAGE_SECTION_CONTENT_FILTER_TYPE] as string, pageSection?.contentFilterType].includes(
      ContentFilterType.TOP_VIDEOS
    )
  );
  const { getAllValues } = useFormContext();
  const videosSectionRef = useRef(null);

  const [videosDisplayName, setVideosDisplayName] = useState(pageSection?.title);

  const remainingVideosTitleLengthMessage = translate('characters_left_label', {
    characterCount: HC_VIDEOS_DISPLAY_NAME_LIMIT - (videosDisplayName?.length || 0),
    alignmentStyles
  });

  const onDoneClick = (): void => {
    const formValues = getAllValues();
    const updatedSectionIdsLocal = getUpdatedSectionIds(pageSection);

    const newSectionData = {
      ...pageSection,
      ...formValues,
      sectionId: updatedSectionIdsLocal.temporarySectionId,
      pageSectionTemplate: PageSectionTemplates.DEFAULT_VIDEOS
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

  return (
    <div ref={videosSectionRef}>
      <div css={viewOptionsAndPreview}>{translate('home_page_default_videos_section_videos_information_label')}</div>
      <div css={optionsContainer}>
        <div css={[timeFrameContainer, { paddingTop: 8 }]}>
          <Textbox
            name={PAGE_SECTION_TITLE}
            maxLength={HC_VIDEOS_DISPLAY_NAME_LIMIT}
            label={translate('home_page_section_display_name')}
            messages={remainingVideosTitleLengthMessage}
            onChange={({ target }) => setVideosDisplayName(target.value)}
            isRequired
          />
        </div>
        <RadioGroup
          id={`videos-section-source-${pageSection?.sectionId}`}
          name={PAGE_SECTION_CONTENT_FILTER_TYPE}
          testID={`videos-section-source-${pageSection?.sectionId}`}
          options={sourceOptions}
          selected={pageSection?.contentFilterType}
          label={translate('home_page_default_videos_source_options_label')}
          onUpdate={value => {
            toggleTimeFrameOptionsDisplay(value === ContentFilterType.TOP_VIDEOS);
          }}
        />
        {isTimeFrameOptionsVisible && (
          <div css={timeFrameContainer}>
            <Dropdown
              id={`home_page_content_filter_time_window_${pageSection?.sectionId}`}
              name={PAGE_SECTION_CONTENT_FILTER_DATE_ABSTRACT}
              options={timeFrameOptions}
              label={translate('home_page_default_videos_time_frame_label_options')}
            />
          </div>
        )}
      </div>
      <div css={{ position: 'fixed', right: 24, bottom: 24 }}>
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
          disabled={Boolean(!dependencyValues[PAGE_SECTION_TITLE]?.trim())}
        />
      </div>
    </div>
  );
}

export default VideosSection;

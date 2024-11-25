import {
  Dropdown,
  Form,
  RadioGroup,
  useFormContext,
  Textarea,
  Textbox,
  useWatchField
} from '@cvent/carina/components/Forms';
import { useTranslate } from 'nucleus-text';
import { useStyle } from '@hooks/useStyle';
import React, { useRef, useState } from 'react';
import { HC_EVENT_CALENDAR_DESCRIPTION_LIMIT, HC_UP_EVENTS_DISPLAY_NAME_LIMIT } from '@utils/constants';
import Button from '@cvent/carina/components/Button';
import useBreakpoints from '@hooks/useBreakpoints';
import {
  PageSectionTemplates,
  alignmentStyles,
  contentLimit,
  layoutStyles,
  PAGE_SECTION_ALIGNMENT,
  PAGE_SECTION_CONTENT_LIMIT_ON_INITIAL_LOAD,
  PAGE_SECTION_FEATURED_CONTENT_TYPE,
  PAGE_SECTION_LAYOUT,
  PAGE_SECTION_TEXT_BODY,
  PAGE_SECTION_TITLE,
  PAGE_SECTION_VISIBLE_FIELDS,
  PageSectionProps
} from '../HomePageSectionMeta';
import { HomePageCustomizationStyles, UpcomingEventsSection } from '../homePageCustomizationStyles';
import EventsSectionPreviewer from './EventsSectionPreviewer';

function EventCalendarSection({
  pageSection,
  setIsPageEdited,
  onSectionUpdate,
  calendarListData,
  setShowSectionTemplate,
  setSelectedSection,
  getUpdatedSectionIds
}: PageSectionProps): React.JSX.Element {
  const { translate } = useTranslate();
  const { description } = useStyle(HomePageCustomizationStyles);
  const { outerContainer } = useStyle(UpcomingEventsSection);

  const initialValuesDefaultEventCalendar = {
    ...pageSection,
    featuredContentType: pageSection?.featuredContentType || '',
    featuredContentTypeId: pageSection?.featuredContentTypeId || '',
    title: pageSection?.title || '',
    textBody: pageSection?.textBody || '',
    layout: pageSection?.layout || layoutStyles.Tile,
    alignment: pageSection?.alignment || alignmentStyles.TOP,
    contentLimitOnInitialLoad: pageSection?.contentLimitOnInitialLoad || contentLimit.UP_TO_6
  };

  return (
    <div css={outerContainer}>
      <div css={[description, { margin: '1rem 0rem 0.5rem' }]}>
        {translate('home_page_custom_event_calendar_section_description')}
      </div>
      <Form
        initialValues={initialValuesDefaultEventCalendar}
        initializationMode="reinitialize"
        validateOnInitialization
      >
        <EventCalendarSectionForm
          pageSection={pageSection}
          setIsPageEdited={setIsPageEdited}
          onSectionUpdate={onSectionUpdate}
          calendarListData={calendarListData}
          setShowSectionTemplate={setShowSectionTemplate}
          setSelectedSection={setSelectedSection}
          getUpdatedSectionIds={getUpdatedSectionIds}
        />
      </Form>
    </div>
  );
}

function EventCalendarSectionForm({
  pageSection,
  setIsPageEdited,
  onSectionUpdate,
  calendarListData,
  setShowSectionTemplate,
  setSelectedSection,
  getUpdatedSectionIds
}: PageSectionProps): React.JSX.Element {
  const { translate } = useTranslate();
  const { textBoxAndTextarea, viewOptionsAndPreview, optionsAndPreviewContainer, optionsContainer } =
    useStyle(UpcomingEventsSection);
  const { listTitle, horizontalLine, formButtonStylesWithFloat } = useStyle(HomePageCustomizationStyles);
  const [displayName, setDisplayName] = useState(pageSection?.title);
  const { isMobile } = useBreakpoints();

  const calendarListOptions = calendarListData?.map(c => ({
    label: c.name,
    value: c.id
  }));

  const layoutStyleOptions = [
    {
      label: translate('home_page_custom_upcoming_events_layout_style_tile'),
      value: layoutStyles.Tile,
      disabled: false
    },
    {
      label: translate('home_page_custom_upcoming_events_layout_style_list'),
      value: layoutStyles.List,
      disabled: false
    }
  ];

  const alignmentOptions = [
    {
      label: translate('home_page_custom_upcoming_events_alignment_left'),
      value: alignmentStyles.LEFT,
      disabled: false
    },
    {
      label: translate('home_page_custom_upcoming_events_alignment_top'),
      value: alignmentStyles.TOP,
      disabled: false
    }
  ];

  const numberOfEventsOptions = [
    {
      label: translate('home_page_custom_channels_list_number_of_channels_three'),
      value: contentLimit.UP_TO_3,
      disabled: false
    },
    {
      label: translate('home_page_custom_channels_list_number_of_channels_six'),
      value: contentLimit.UP_TO_6,
      disabled: false
    }
  ];
  const { getAllValues, setValue } = useFormContext();
  const eventCalendarSectionRef = useRef(null);

  const onDoneClick = (): void => {
    const formValues = getAllValues();
    const updatedSectionIdsLocal = getUpdatedSectionIds(pageSection);

    const newSectionData = {
      ...pageSection,
      ...formValues,
      sectionId: updatedSectionIdsLocal.temporarySectionId,
      pageSectionTemplate: PageSectionTemplates.EVENT_CALENDAR
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

  const handleDisplayNameChange = (value): void => {
    setDisplayName(value);
  };

  const onCalendarSelection = (label, value): void => {
    setDisplayName(label);
    setValue('title', label);
    setValue('featuredContentTypeId', value);
  };

  const remainingLengthMessage = translate('characters_left_label', {
    characterCount: HC_UP_EVENTS_DISPLAY_NAME_LIMIT - (displayName?.length || 0),
    alignmentStyles
  });

  const validateCalendar = (label = '') => {
    if (label.length < 1) {
      return [translate('home_page_sections_validation_error')];
    }
    return undefined;
  };

  const dependencyValues = useWatchField([
    PAGE_SECTION_ALIGNMENT,
    PAGE_SECTION_VISIBLE_FIELDS,
    PAGE_SECTION_LAYOUT,
    PAGE_SECTION_CONTENT_LIMIT_ON_INITIAL_LOAD
  ]);

  const { [PAGE_SECTION_TITLE]: pageSectionTitle = '' } = useWatchField([PAGE_SECTION_TITLE]);
  const { featuredContentType: featuredContentTypeValue = '' } = useWatchField([PAGE_SECTION_FEATURED_CONTENT_TYPE]);

  return (
    <div ref={eventCalendarSectionRef}>
      <div css={viewOptionsAndPreview}>
        {translate('home_page_default_upcoming_events_section_calendar_information_label')}
      </div>

      <div css={textBoxAndTextarea}>
        <Dropdown
          id={`home_page_event_calendar_${pageSection?.sectionId}`}
          name={PAGE_SECTION_FEATURED_CONTENT_TYPE}
          options={calendarListOptions}
          label={translate('home_page_custom_event_calendar_calendar_label')}
          onUpdate={(value, { label }) => onCalendarSelection(label, value)}
          isRequired
          validate={label => validateCalendar(label)}
        />
        <Textbox
          label={translate('home_page_custom_event_calendar_display_name_label')}
          name={PAGE_SECTION_TITLE}
          maxLength={HC_UP_EVENTS_DISPLAY_NAME_LIMIT}
          messages={remainingLengthMessage}
          onChange={({ target }) => handleDisplayNameChange(target.value)}
          isRequired
        />
        <Textarea
          maxLength={HC_EVENT_CALENDAR_DESCRIPTION_LIMIT}
          label={translate('home_page_custom_event_calendar_description_label')}
          name={PAGE_SECTION_TEXT_BODY}
          minHeight="m"
        />
      </div>
      <div css={horizontalLine} />
      <div css={viewOptionsAndPreview}>{translate('home_page_custom_upcoming_events_options_title')}</div>
      <div css={optionsAndPreviewContainer}>
        <div css={optionsContainer}>
          <RadioGroup
            id={`event-calendar-section-layout-style-${pageSection?.sectionId}`}
            name={PAGE_SECTION_LAYOUT}
            testID={`event-calendar-section-layout-style-${pageSection?.sectionId}`}
            options={layoutStyleOptions}
            label={translate('home_page_custom_upcoming_events_layout_style_title')}
          />
          <RadioGroup
            id={`event-calendar-section-alignment-${pageSection?.sectionId}`}
            name={PAGE_SECTION_ALIGNMENT}
            testID={`event-calendar-section-alignment-${pageSection?.sectionId}`}
            options={alignmentOptions}
            label={translate('home_page_custom_upcoming_events_alignment_tile')}
          />
          <RadioGroup
            id={`event-calendar-section-number-of-events-${pageSection?.sectionId}`}
            name={PAGE_SECTION_CONTENT_LIMIT_ON_INITIAL_LOAD}
            testID={`event-calendar-section-number-of-events-${pageSection?.sectionId}`}
            options={numberOfEventsOptions}
            label={translate('home_page_custom_upcoming_events_number_of_events_title')}
          />
        </div>
        <div css={{ paddingBottom: 20 }}>
          <div css={[listTitle, { paddingBottom: 10 }]}>{translate('home_page_custom_generic_preview_text')}</div>
          {!isMobile ? (
            <EventsSectionPreviewer
              contentCount={dependencyValues[PAGE_SECTION_CONTENT_LIMIT_ON_INITIAL_LOAD] as number}
              layout={dependencyValues[PAGE_SECTION_LAYOUT] as string}
              alignment={dependencyValues[PAGE_SECTION_ALIGNMENT] as string}
            />
          ) : (
            <div>{translate('home_page_sections_mobile_preview_text')}</div>
          )}
        </div>
      </div>
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
          disabled={(featuredContentTypeValue as string | []).length === 0 || Boolean(!pageSectionTitle?.trim())}
        />
      </div>
    </div>
  );
}

export default EventCalendarSection;

import {
  HomePageCustomizationStyles,
  UpcomingEventsSection
} from '@components/homepage-customization/homePageCustomizationStyles';
import { Form, RadioGroup, Textarea, Textbox, useFormContext, useWatchField } from '@cvent/carina/components/Forms';
import { useCenterInfo } from '@hooks/useCenterInfo';
import { useStyle } from '@hooks/useStyle';
import { HC_UP_EVENTS_DESCRIPTION_LIMIT, HC_UP_EVENTS_DISPLAY_NAME_LIMIT } from '@utils/constants';
import { useTranslate } from 'nucleus-text';
import React, { useMemo, useRef, useState } from 'react';
import Button from '@cvent/carina/components/Button';
import useBreakpoints from '@hooks/useBreakpoints';
import {
  layoutStyles,
  alignmentStyles,
  contentLimit,
  PAGE_SECTION_ALIGNMENT,
  PAGE_SECTION_CONTENT_LIMIT_ON_INITIAL_LOAD,
  PAGE_SECTION_TITLE,
  PAGE_SECTION_TEXT_BODY,
  PAGE_SECTION_LAYOUT,
  PageSectionTemplates,
  PageSectionProps
} from '../HomePageSectionMeta';
import EventsSectionPreviewer from './EventsSectionPreviewer';

function UpcomingEventSection({
  pageSection,
  setIsPageEdited,
  onSectionUpdate,
  calendarListData,
  setShowSectionTemplate,
  setSelectedSection,
  getUpdatedSectionIds
}: PageSectionProps): React.JSX.Element {
  const { translate } = useTranslate();
  const { description, listTitle } = useStyle(HomePageCustomizationStyles);
  const { outerContainer, viewOptionsAndPreview } = useStyle(UpcomingEventsSection);
  const { calendarId } = useCenterInfo();
  const { isM, isS } = useBreakpoints();

  const calendarName = useMemo(
    () =>
      calendarListData
        ?.filter(cal => cal?.id?.toUpperCase() === calendarId?.toUpperCase())
        .map(cal => cal.name)
        .toString(),
    [calendarListData, calendarId]
  );

  // Cleanse the data if needed
  const initialValuesUpcomingEvents = {
    ...pageSection,
    contentLimitOnInitialLoad: pageSection?.contentLimitOnInitialLoad || contentLimit.UP_TO_6,
    alignment: pageSection?.alignment || alignmentStyles.LEFT,
    layout: pageSection?.layout || layoutStyles.Tile,
    title: pageSection?.title || calendarName
  };

  return (
    <div css={outerContainer}>
      <div css={[description, { margin: '1rem 0 0.5rem' }]}>
        {translate('home_page_custom_upcoming_events_section_description')}
      </div>
      <div css={viewOptionsAndPreview}>
        {translate('home_page_default_upcoming_events_section_calendar_information_label')}
      </div>
      <div css={[listTitle, { marginLeft: isS || isM ? '0rem' : '12rem' }]}>
        {translate('home_page_custom_upcoming_events_title')}
      </div>
      <div css={{ margin: isS || isM ? '0 0 1rem 0rem' : '0 0 1rem 12rem' }}>{calendarName}</div>
      <Form
        testID="upcoming-events-section-form"
        initialValues={initialValuesUpcomingEvents}
        initializationMode="reinitialize"
      >
        <UpcomingEventsSectionForm
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

function UpcomingEventsSectionForm({
  pageSection,
  setIsPageEdited,
  onSectionUpdate,
  setShowSectionTemplate,
  setSelectedSection,
  getUpdatedSectionIds
}: PageSectionProps): React.JSX.Element {
  const { translate } = useTranslate();
  const { isMobile } = useBreakpoints();

  const { horizontalLine, listTitle, formButtonStylesWithFloat } = useStyle(HomePageCustomizationStyles);
  const { textBoxAndTextarea, viewOptionsAndPreview, optionsAndPreviewContainer, optionsContainer } =
    useStyle(UpcomingEventsSection);
  const [displayName, setDisplayName] = useState(pageSection?.title);
  const remainingLengthMessage = translate('characters_left_label', {
    characterCount: HC_UP_EVENTS_DISPLAY_NAME_LIMIT - (displayName?.length || 0),
    alignmentStyles
  });

  const { getAllValues } = useFormContext();

  const onDoneClick = (): void => {
    const formValues = getAllValues();
    const updatedSectionIdsLocal = getUpdatedSectionIds(pageSection);

    const newSectionData = {
      ...pageSection,
      ...formValues,
      sectionId: updatedSectionIdsLocal.temporarySectionId,
      pageSectionTemplate: PageSectionTemplates.DEFAULT_UPCOMING_EVENTS
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

  const upcomingEventsRef = useRef(null);

  const handleDisplayNameChange = (e): void => {
    setDisplayName(e.target.value);
  };

  const dependencyValues = useWatchField([
    PAGE_SECTION_ALIGNMENT,
    PAGE_SECTION_LAYOUT,
    PAGE_SECTION_CONTENT_LIMIT_ON_INITIAL_LOAD
  ]);
  const { [PAGE_SECTION_TITLE]: pageSectionTitle = '' } = useWatchField([PAGE_SECTION_TITLE]);

  return (
    <div ref={upcomingEventsRef}>
      <div css={textBoxAndTextarea}>
        <Textbox
          label={translate('home_page_custom_upcoming_events_display_name')}
          maxLength={HC_UP_EVENTS_DISPLAY_NAME_LIMIT}
          name={PAGE_SECTION_TITLE}
          onChange={handleDisplayNameChange}
          messages={remainingLengthMessage}
          isRequired
        />
        <Textarea
          label={translate('home_page_custom_upcoming_events_description')}
          name={PAGE_SECTION_TEXT_BODY}
          maxLength={HC_UP_EVENTS_DESCRIPTION_LIMIT}
          minHeight="m"
        />
      </div>
      <div css={horizontalLine} />
      <div css={viewOptionsAndPreview}>{translate('home_page_custom_upcoming_events_options_title')}</div>
      <div css={optionsAndPreviewContainer}>
        <div css={optionsContainer}>
          <RadioGroup
            id="up-events-section-layout"
            label={translate('home_page_custom_upcoming_events_layout_style_title')}
            name={PAGE_SECTION_LAYOUT}
            options={[
              {
                label: translate('home_page_custom_upcoming_events_layout_style_tile'),
                value: layoutStyles.Tile
              },
              {
                label: translate('home_page_custom_upcoming_events_layout_style_list'),
                value: layoutStyles.List
              }
            ]}
          />
          <RadioGroup
            id="up-events-section-alignement"
            label={translate('home_page_custom_upcoming_events_alignment_tile')}
            name={PAGE_SECTION_ALIGNMENT}
            options={[
              {
                label: translate('home_page_custom_upcoming_events_alignment_left'),
                value: alignmentStyles.LEFT
              },
              {
                label: translate('home_page_custom_upcoming_events_alignment_top'),
                value: alignmentStyles.TOP
              }
            ]}
          />
          <RadioGroup
            id="up-events-section-onload-limit"
            label={translate('home_page_custom_upcoming_events_number_of_events_title')}
            name={PAGE_SECTION_CONTENT_LIMIT_ON_INITIAL_LOAD}
            options={[
              {
                label: translate('home_page_custom_upcoming_events_number_of_events_three'),
                value: contentLimit.UP_TO_3
              },
              {
                label: translate('home_page_custom_upcoming_events_number_of_events_six'),
                value: contentLimit.UP_TO_6
              }
            ]}
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
          disabled={Boolean(!pageSectionTitle?.trim())}
        />
      </div>
    </div>
  );
}
export default UpcomingEventSection;

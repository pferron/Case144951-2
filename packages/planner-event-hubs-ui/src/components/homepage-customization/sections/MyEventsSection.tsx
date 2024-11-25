import { Form, RadioGroup, Textbox, useFormContext, useWatchField } from '@cvent/carina/components/Forms';
import { useTranslate } from 'nucleus-text';
import { useStyle } from '@hooks/useStyle';
import React, { useRef, useState } from 'react';
import Button from '@cvent/carina/components/Button';
import useBreakpoints from '@hooks/useBreakpoints';
import { HC_YOUR_EVENTS_DISPLAY_NAME_LIMIT } from '@utils/constants';
import {
  PageSectionTemplates,
  alignmentStyles,
  contentLimit,
  layoutStyles,
  PAGE_SECTION_ALIGNMENT,
  PAGE_SECTION_CONTENT_LIMIT_ON_INITIAL_LOAD,
  PAGE_SECTION_TITLE,
  PAGE_SECTION_LAYOUT,
  PageSectionProps
} from '../HomePageSectionMeta';
import {
  HomePageCustomizationStyles,
  UpcomingEventsSection,
  SectionCommonStyles
} from '../homePageCustomizationStyles';
import EventsSectionPreviewer from './EventsSectionPreviewer';

// Helper function to create options for RadioGroup
const createRadioGroupOptions = (translate, labels, values) =>
  labels.map((label, index) => ({
    label: translate(label),
    value: values[index],
    disabled: false
  }));

function MyEventsSection({
  pageSection,
  setIsPageEdited,
  onSectionUpdate,
  setShowSectionTemplate,
  setSelectedSection,
  getUpdatedSectionIds
}: PageSectionProps): React.JSX.Element {
  const { translate } = useTranslate();
  const { description } = useStyle(HomePageCustomizationStyles);
  const { outerContainer } = useStyle(UpcomingEventsSection);

  const initialValuesDefaultMyEvents = {
    ...pageSection,
    layout: pageSection?.layout || layoutStyles.Tile,
    alignment: pageSection?.alignment || alignmentStyles.LEFT,
    contentLimitOnInitialLoad: pageSection?.contentLimitOnInitialLoad || contentLimit.UP_TO_3,
    title: pageSection?.title || translate('your_events_title')
  };

  return (
    <div css={outerContainer}>
      <div css={[description, { margin: '1rem 0rem 0.5rem' }]}>{translate('home_page_default_my_events_purpose')}</div>
      <Form initialValues={initialValuesDefaultMyEvents} initializationMode="reinitialize">
        <MyEventsSectionForm
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

function MyEventsSectionForm({
  pageSection,
  setIsPageEdited,
  onSectionUpdate,
  setShowSectionTemplate,
  setSelectedSection,
  getUpdatedSectionIds
}: PageSectionProps): React.JSX.Element {
  const { translate } = useTranslate();
  const { viewOptionsAndPreview, optionsAndPreviewContainer } = useStyle(UpcomingEventsSection);
  const { listTitle, formContainerStyles, formButtonsStyle } = useStyle(HomePageCustomizationStyles);
  const { optionsContainer, titleInput } = useStyle(SectionCommonStyles);
  const { isMobile } = useBreakpoints();
  const [yourEventsDisplayName, setYourEventsDisplayName] = useState(pageSection?.title);

  const layoutStyleOptions = createRadioGroupOptions(
    translate,
    ['home_page_custom_upcoming_events_layout_style_tile', 'home_page_custom_upcoming_events_layout_style_list'],
    [layoutStyles.Tile, layoutStyles.List]
  );

  const alignmentOptions = createRadioGroupOptions(
    translate,
    ['home_page_custom_upcoming_events_alignment_left', 'home_page_custom_upcoming_events_alignment_top'],
    [alignmentStyles.LEFT, alignmentStyles.TOP]
  );

  const numberOfEventsOptions = createRadioGroupOptions(
    translate,
    [
      'home_page_custom_channels_list_number_of_channels_three',
      'home_page_custom_channels_list_number_of_channels_six'
    ],
    [contentLimit.UP_TO_3, contentLimit.UP_TO_6]
  );

  const { getAllValues } = useFormContext();

  const myEventsSectionsRef = useRef(null);

  const onDoneClick = (): void => {
    const formValues = getAllValues();
    const updatedSectionIdsLocal = getUpdatedSectionIds(pageSection);

    const newSectionData = {
      ...pageSection,
      ...formValues,
      sectionId: updatedSectionIdsLocal.temporarySectionId,
      pageSectionTemplate: PageSectionTemplates.DEFAULT_MY_EVENTS
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

  const remainingYourEventsTitleLengthMessage = translate('characters_left_label', {
    characterCount: HC_YOUR_EVENTS_DISPLAY_NAME_LIMIT - (yourEventsDisplayName?.length || 0),
    alignmentStyles
  });

  const dependencyValues = useWatchField([
    PAGE_SECTION_ALIGNMENT,
    PAGE_SECTION_LAYOUT,
    PAGE_SECTION_CONTENT_LIMIT_ON_INITIAL_LOAD,
    PAGE_SECTION_TITLE
  ]);

  return (
    <div ref={myEventsSectionsRef} css={formContainerStyles}>
      <div css={viewOptionsAndPreview}>{translate('home_page_custom_upcoming_events_options_title')}</div>
      <div css={optionsAndPreviewContainer}>
        <div css={optionsContainer}>
          <div css={titleInput}>
            <Textbox
              label={translate('home_page_section_display_name')}
              name={PAGE_SECTION_TITLE}
              maxLength={HC_YOUR_EVENTS_DISPLAY_NAME_LIMIT}
              messages={remainingYourEventsTitleLengthMessage}
              onChange={({ target }) => setYourEventsDisplayName(target.value)}
              isRequired
            />
          </div>
          <RadioGroup
            id={`my-events-section-layout-style-${pageSection?.sectionId}`}
            name={PAGE_SECTION_LAYOUT}
            testID={`my-events-section-layout-style-${pageSection?.sectionId}`}
            options={layoutStyleOptions}
            label={translate('home_page_custom_upcoming_events_layout_style_title')}
          />
          <RadioGroup
            id={`my-events-section-alignment-${pageSection?.sectionId}`}
            name={PAGE_SECTION_ALIGNMENT}
            testID={`my-events-section-alignment-${pageSection?.sectionId}`}
            options={alignmentOptions}
            label={translate('home_page_custom_upcoming_events_alignment_tile')}
          />
          <RadioGroup
            id={`my-events-section-number-of-events-${pageSection?.sectionId}`}
            name={PAGE_SECTION_CONTENT_LIMIT_ON_INITIAL_LOAD}
            testID={`my-events-section-number-of-events-${pageSection?.sectionId}`}
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
      <div css={formButtonsStyle}>
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
          testID="your-events-section-add-section-cancel-button"
        />
        <Button
          appearance="filled"
          aria-label={translate('home_page_sections_add_section_modal_footer_btn_done')}
          onClick={onDoneClick}
          text={translate('home_page_sections_add_section_modal_footer_btn_done')}
          testID="your-events-section-add-section-done-button"
          disabled={Boolean(!dependencyValues[PAGE_SECTION_TITLE]?.trim())}
        />
      </div>
    </div>
  );
}

export default MyEventsSection;

import {
  HomePageCustomizationStyles,
  UpcomingEventsSection,
  SectionCommonStyles
} from '@components/homepage-customization/homePageCustomizationStyles';
import {
  CheckboxGroup,
  Form,
  RadioGroup,
  Textbox,
  useFormContext,
  useWatchField
} from '@cvent/carina/components/Forms';
import { useStyle } from '@hooks/useStyle';
import { useTranslate } from 'nucleus-text';
import React, { useRef, useState } from 'react';
import Button from '@cvent/carina/components/Button';
import useBreakpoints from '@hooks/useBreakpoints';
import { HC_CHANNELS_LIST_DISPLAY_NAME_LIMIT } from '@utils/constants';
import {
  alignmentStyles,
  contentLimit,
  PageSectionTemplates,
  PAGE_SECTION_CONTENT_LIMIT_ON_INITIAL_LOAD,
  PAGE_SECTION_VISIBLE_FIELDS,
  PAGE_SECTION_TITLE,
  PageSectionProps
} from '../HomePageSectionMeta';
import ChannelsListSectionPreviewer from './ChannelsListSectionPreviewer';

enum details {
  NAME = 'name',
  DESCRIPTION = 'description',
  NUMBER_OF_VIDEOS = 'videos',
  IMAGE = 'image'
}

// Helper function to generate RadioGroup components
const createRadioGroupComponent = (id, name, label, options) => (
  <RadioGroup id={id} name={name} label={label} options={options} />
);

function ChannelsListSection({
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

  // Cleanse the data if needed
  const initialValuesDefaultChannels = {
    ...pageSection,
    contentLimitOnInitialLoad: pageSection?.contentLimitOnInitialLoad || contentLimit.UP_TO_4,
    alignment: pageSection?.alignment || alignmentStyles.TOP,
    visibleFields: [...new Set([...(pageSection?.visibleFields ?? []), details.NAME])],
    title: pageSection?.title || translate('channels')
  };

  return (
    <div css={outerContainer}>
      <div css={[description, { margin: '1rem 0rem' }]}>
        {translate('home_page_custom_channels_list_section_description')}
      </div>
      <Form
        testID="channels-section-form"
        initialValues={initialValuesDefaultChannels}
        initializationMode="reinitialize"
      >
        <ChannelsListSectionForm
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

function ChannelsListSectionForm({
  pageSection,
  setIsPageEdited,
  onSectionUpdate,
  setShowSectionTemplate,
  setSelectedSection,
  getUpdatedSectionIds
}: PageSectionProps): React.JSX.Element {
  const { translate } = useTranslate();
  const { horizontalLine, listTitle, formContainerStyles, formButtonsStyle } = useStyle(HomePageCustomizationStyles);
  const { viewOptionsAndPreview, optionsAndPreviewContainer } = useStyle(UpcomingEventsSection);
  const { optionsContainer, titleInput } = useStyle(SectionCommonStyles);
  const { getAllValues } = useFormContext();
  const { isMobile } = useBreakpoints();
  const [channelsListDisplayName, setChannelsListDisplayName] = useState(pageSection?.title);

  const remainingChannelsListTitleLengthMessage = translate('characters_left_label', {
    characterCount: HC_CHANNELS_LIST_DISPLAY_NAME_LIMIT - (channelsListDisplayName?.length || 0),
    alignmentStyles
  });

  const onDoneClick = (): void => {
    const formValues = getAllValues();
    const updatedSectionIdsLocal = getUpdatedSectionIds(pageSection);

    const newSectionData = {
      ...pageSection,
      ...formValues,
      sectionId: updatedSectionIdsLocal.temporarySectionId,
      pageSectionTemplate: PageSectionTemplates.DEFAULT_CHANNELS
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

  const channelsEventsRef = useRef(null);

  const options = [
    { value: details.IMAGE, label: translate('home_page_default_channels_details_image') },
    { value: details.NUMBER_OF_VIDEOS, label: translate('home_page_default_channels_details_videos') },
    { value: details.DESCRIPTION, label: translate('home_page_default_channels_details_description') },
    { value: details.NAME, label: translate('home_page_default_channels_details_name'), disabled: true }
  ];

  const dependencyValues = useWatchField(['contentLimitOnInitialLoad', 'visibleFields', PAGE_SECTION_TITLE]);

  const contentLimitOptions = [
    {
      label: translate('home_page_custom_channels_list_number_of_channels_four'),
      value: contentLimit.UP_TO_4
    },
    {
      label: translate('home_page_custom_channels_list_number_of_channels_eight'),
      value: contentLimit.UP_TO_8
    }
  ];

  return (
    <div ref={channelsEventsRef} css={formContainerStyles}>
      <div css={horizontalLine} />
      <div css={viewOptionsAndPreview}>{translate('home_page_custom_upcoming_events_options_title')}</div>
      <div css={optionsAndPreviewContainer}>
        <div css={optionsContainer}>
          <div css={titleInput}>
            <Textbox
              name={PAGE_SECTION_TITLE}
              label={translate('home_page_section_display_name')}
              maxLength={HC_CHANNELS_LIST_DISPLAY_NAME_LIMIT}
              messages={remainingChannelsListTitleLengthMessage}
              onChange={({ target }) => setChannelsListDisplayName(target.value)}
              isRequired
            />
          </div>
          {createRadioGroupComponent(
            'channels-section-onload-limit',
            PAGE_SECTION_CONTENT_LIMIT_ON_INITIAL_LOAD,
            translate('home_page_custom_default_channels_number_of_chanels_title'),
            contentLimitOptions
          )}
          <CheckboxGroup
            name={PAGE_SECTION_VISIBLE_FIELDS}
            label={translate('home_page_custom_channels_visible_fields')}
            options={options}
          />
        </div>
        <div css={{ paddingBottom: 20 }}>
          <div css={[listTitle, { paddingBottom: 10 }]}>{translate('home_page_custom_generic_preview_text')}</div>
          {!isMobile ? (
            <ChannelsListSectionPreviewer
              numberOfChannels={dependencyValues.contentLimitOnInitialLoad}
              visibleFields={dependencyValues.visibleFields}
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
export default ChannelsListSection;

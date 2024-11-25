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
import React, { useEffect, useState, useRef } from 'react';
import {
  HC_NEW_SECTION_TITLE_LIMIT,
  HC_NEW_SECTION_DESCRIPTION_LIMIT,
  HC_NEW_SECTION_BUTTON_TEXT_LIMIT,
  VIDEO_HUB_PATH_PARAM
} from '@utils/constants';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';
import { HUB_PAGES } from '@cvent/planner-event-hubs-model/operations/banner';
import PageBanner from '@components/banners/topBanner/PageBanner';
import BlockThemeProvider from '@cvent/blocks/components/BlockThemeProvider';
import { useCenterInfo } from '@hooks/useCenterInfo';
import { CurrentImage, NewImage } from '@components/common/imageUpload/types';
import colorIsLight from '@components/banners/utils/colorIsLight';
import { useTheme } from '@cvent/carina/components/ThemeProvider/useTheme';
import Button from '@cvent/carina/components/Button';
import { omit } from 'lodash';
import { aspectRatioTypes, translations } from '@cvent/image-editor';
import { PageAlert } from '@cvent/carina/components/Alert';
import {
  alignmentStyles,
  newSectionTemplates,
  PAGE_SECTION_ALIGNMENT,
  PAGE_SECTION_BUTTON_EXTERNAL_TARGET,
  PAGE_SECTION_BUTTON_INTERNAL_TARGET,
  PAGE_SECTION_BUTTON_TARGET_TYPE,
  PAGE_SECTION_BUTTON_TEXT,
  PAGE_SECTION_IMAGE_ALT_TEXT,
  PAGE_SECTION_ORIGINAL_IMAGE_URL,
  PAGE_SECTION_TEXT_BODY,
  PAGE_SECTION_TEXT_COLOR,
  PAGE_SECTION_TITLE,
  PAGE_SECTION_IMAGE_FIELD,
  PAGE_SECTION_IMAGE_URL,
  PAGE_SECTION_LAYOUT,
  PageSectionTemplates,
  PageSectionProps
} from '../HomePageSectionMeta';
import { HomePageCustomizationStyles, UpcomingEventsSection, NewSectionStyles } from '../homePageCustomizationStyles';
import SectionImageUpload from '../SectionImageUpload';

type Props = PageSectionProps & {
  newSectionId?: string;
};

function NewSection({
  pageSection,
  setIsPageEdited,
  onSectionUpdate,
  setShowSectionTemplate,
  setSelectedSection,
  newSectionId,
  getUpdatedSectionIds
}: Props): React.JSX.Element {
  const { outerContainer } = useStyle(UpcomingEventsSection);
  const { backgroundColor } = useTheme();

  const bannerBackgroundColor = backgroundColor.brand.fill.base;
  const lightBG = colorIsLight(bannerBackgroundColor);
  const textColor = lightBG ? '#000000' : '#FFFFFF';

  const initialValuesDefaultNewSection = {
    ...pageSection,
    [PAGE_SECTION_IMAGE_FIELD]: pageSection?.imageUrl || '',
    imageAltText: pageSection?.imageAltText || '',
    title: pageSection?.title || '',
    textBody: pageSection?.textBody || '',
    textColor: pageSection?.textColor || textColor,
    buttonText: pageSection?.buttonText || '',
    buttonInternalTarget: pageSection?.buttonInternalTarget || '',
    buttonExternalTarget: pageSection?.buttonExternalTarget || '',
    buttonTargetType: pageSection?.buttonTargetType || 'Internal',
    buttonEnabled: pageSection?.buttonEnabled || true,
    layout: pageSection?.layout || newSectionTemplates.FullImageBackground,
    alignment: pageSection?.alignment || alignmentStyles.LEFT
  };

  return (
    <div css={[outerContainer, { marginTop: '1.5rem' }]}>
      <Form initialValues={initialValuesDefaultNewSection} initializationMode="reinitialize">
        <NewSectionForm
          pageSection={pageSection}
          setIsPageEdited={setIsPageEdited}
          onSectionUpdate={onSectionUpdate}
          setShowSectionTemplate={setShowSectionTemplate}
          setSelectedSection={setSelectedSection}
          newSectionId={newSectionId}
          getUpdatedSectionIds={getUpdatedSectionIds}
        />
      </Form>
    </div>
  );
}

function NewSectionForm({
  pageSection,
  setIsPageEdited,
  onSectionUpdate,
  setShowSectionTemplate,
  setSelectedSection,
  newSectionId,
  getUpdatedSectionIds
}: Props): React.JSX.Element {
  const { translate } = useTranslate();
  const [title, setTitle] = useState(pageSection?.title);
  const [buttonText, setButtonText] = useState(pageSection?.buttonText);
  const router = useRouter();
  const { query = {} } = router;
  const videoCenterId = query[VIDEO_HUB_PATH_PARAM] as string;
  const { theme: centerTheme } = useCenterInfo();

  const textAlignmentOptions = {
    label: translate('home_page_sections_text_alignment'),
    options: [
      {
        label: translate('Banners-Image-Alignment-Left-Label'),
        value: alignmentStyles.LEFT,
        disabled: false
      },
      {
        label: translate('Banners-Text-Alignment-Center-Label'),
        value: alignmentStyles.CENTER,
        disabled: false
      },
      {
        label: translate('Banners-Image-Alignment-Right-Label'),
        value: alignmentStyles.RIGHT,
        disabled: false
      }
    ]
  };

  const imageAlignmentOptions = {
    label: translate('home_page_sections_image_alignment'),
    options: [
      {
        label: translate('Banners-Image-Alignment-Left-Label'),
        value: alignmentStyles.LEFT,
        disabled: false
      },
      {
        label: translate('Banners-Image-Alignment-Right-Label'),
        value: alignmentStyles.RIGHT,
        disabled: false
      }
    ]
  };

  const templateOptions = {
    label: translate('home_page_sections_image_template'),
    options: [
      {
        label: translate('home_page_template_full_image_bg_title'),
        value: newSectionTemplates.FullImageBackground,
        disabled: false
      },
      {
        label: translate('home_page_template_inset_image_title'),
        value: newSectionTemplates.InsetImage,
        disabled: false
      },
      {
        label: translate('home_page_sections_template_no_image'),
        value: newSectionTemplates.TextAndColorBackground,
        disabled: false
      }
    ]
  };

  const template = pageSection?.layout || newSectionTemplates.TextAndColorBackground;
  const { viewOptionsAndPreview } = useStyle(UpcomingEventsSection);
  const { horizontalLine, formButtonStylesWithFloat } = useStyle(HomePageCustomizationStyles);
  const { optionsContainer, radioGroupContainer } = useStyle(NewSectionStyles);
  const [currentImage, setCurrentImage] = useState<CurrentImage>(
    pageSection?.originalImageUrl
      ? {
          url: pageSection.originalImageUrl,
          croppedUrl: pageSection.imageUrl,
          filename: pageSection.originalImageUrl.split('/').pop()
        }
      : null
  );
  const [newImage, setNewImage] = useState<NewImage>(null);
  const [imageDeleted, setImageDeleted] = useState(false);
  const [showExternalURLField, setShowExternalURLField] = useState(
    pageSection?.buttonInternalTarget === translate('Banners-Content-Banner-Button-Destination-Type-Other-Link')
  );
  const { getAllValues, setValue } = useFormContext();
  const newSectionRef = useRef(null);
  const [showAspectRatioAlert, setShowAspectRatioAlert] = useState(false);

  useEffect(() => {
    if (imageDeleted) {
      setCurrentImage(null);
      setNewImage(null);
      setValue(PAGE_SECTION_IMAGE_FIELD, '');
      setValue(PAGE_SECTION_IMAGE_URL, '');
      setValue(PAGE_SECTION_ORIGINAL_IMAGE_URL, '');
      setValue(PAGE_SECTION_IMAGE_ALT_TEXT, '');
    }
  }, [imageDeleted, setValue]);

  useEffect(() => {
    if (newImage) {
      setValue(PAGE_SECTION_IMAGE_FIELD, newImage.croppedUrl || newImage.url);
      setCurrentImage({
        url: newImage.url,
        croppedUrl: newImage.croppedUrl || newImage.url,
        filename: newImage.url.split('/').pop()
      });
    }
  }, [newImage, setValue]);

  // HubPages data for button destination
  const { data: bannerPagesListData } = useQuery(HUB_PAGES, {
    variables: {
      id: {
        id: videoCenterId
      }
    }
  });
  const hubPagesListData = bannerPagesListData?.hubPages?.data;

  const validateButtonURL = buttonURL => {
    if (buttonURL === '' || !buttonURL) {
      return translate('Banners-FormErrors-ExternalURL');
    }
    if (buttonURL.substring(0, 8) !== 'https://') {
      return translate('Banners-FormErrors-ExternalURLhttps');
    }
    return undefined;
  };

  const buttonDestinationOptions = [
    {
      value: '',
      label: translate('Banners-Content-Banner-Button-Destination-Type-None')
    }
  ]
    .concat(
      hubPagesListData?.map(q => ({
        value: q.entityId,
        label: q.name
      }))
    )
    .filter(item => item?.value && item?.label)
    .concat({
      value: translate('Banners-Content-Banner-Button-Destination-Type-Other-Link'),
      label: translate('Banners-Content-Banner-Button-Destination-Type-Other-Link')
    });

  const onDoneClick = (): void => {
    const formValues = omit(getAllValues(), PAGE_SECTION_IMAGE_FIELD);
    const updatedSectionIdsLocal = getUpdatedSectionIds(pageSection);

    const newSectionData = {
      ...pageSection,
      ...formValues,
      sectionId: updatedSectionIdsLocal.temporarySectionId,
      pageSectionTemplate: PageSectionTemplates.TEXT_IMAGE_TEMPLATE,
      newImageUrl: newImage?.croppedUrl || newImage?.url,
      newOriginalImageUrl: newImage?.url
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

  const remainingLengthMessage = (charLimit, value): string =>
    translate('characters_left_label', {
      characterCount: charLimit - (value?.length || 0),
      alignmentStyles
    });

  const bannerPreviewTemplateProps = {
    [newSectionTemplates.TextAndColorBackground]: {
      type: 'text'
    },
    [newSectionTemplates.InsetImage]: {
      type: 'image-inlay'
    },
    [newSectionTemplates.FullImageBackground]: {
      type: 'full-image'
    }
  };

  const sectionId = pageSection?.sectionId || newSectionId;
  const { [PAGE_SECTION_TITLE]: pageSectionTitle = '' } = useWatchField([PAGE_SECTION_TITLE]);
  const { [PAGE_SECTION_LAYOUT]: layoutTemplate = '' } = useWatchField([PAGE_SECTION_LAYOUT]);
  const { [PAGE_SECTION_ALIGNMENT]: pageSectionAlignment = '' } = useWatchField([PAGE_SECTION_ALIGNMENT]);
  const recommendationTextForFileUpload =
    layoutTemplate === newSectionTemplates.FullImageBackground
      ? 'Banners-Image-Upload-Section-Supported-File-Size'
      : 'Banners-Image-Upload-Section-Supported-File-Size-Inset-Image';
  return (
    <div ref={newSectionRef}>
      <div css={{ paddingBottom: 16 }}>
        <BlockThemeProvider
          primary={centerTheme?.mainColor}
          secondary={centerTheme?.actionColor}
          background={centerTheme?.backgroundColor}
          mood={centerTheme?.moodColor}
          safeMode={centerTheme?.safeMode}
          blockColorKey="primary"
        >
          <PageBanner
            type={bannerPreviewTemplateProps[layoutTemplate]?.type}
            testID="banner-preview"
            buttonAction={() => null}
            backgroundColor={centerTheme?.mainColor}
            titleField={PAGE_SECTION_TITLE}
            bodyField={PAGE_SECTION_TEXT_BODY}
            buttonTextField={PAGE_SECTION_BUTTON_TEXT}
            internalTargetField={PAGE_SECTION_BUTTON_INTERNAL_TARGET}
            externalTargetField={PAGE_SECTION_BUTTON_EXTERNAL_TARGET}
            textAlignmentField={PAGE_SECTION_ALIGNMENT}
            imageAlignmentField={PAGE_SECTION_ALIGNMENT}
            buttonTargetType={PAGE_SECTION_BUTTON_TARGET_TYPE}
            imageAltTextField={PAGE_SECTION_IMAGE_ALT_TEXT}
            imageURLField={PAGE_SECTION_IMAGE_FIELD}
            textColor={PAGE_SECTION_TEXT_COLOR}
          />
        </BlockThemeProvider>
      </div>
      <div css={horizontalLine} />
      {showAspectRatioAlert ? (
        <div css={{ marginTop: 16 }}>
          <PageAlert
            appearance="info"
            content={translate('home_page_sections_image_template_change_alert_msg')}
            onDismiss={() => setShowAspectRatioAlert(false)}
            testID="custom-home-page-change-image-template-info-alert"
          />
        </div>
      ) : null}
      <div css={optionsContainer}>
        <div css={viewOptionsAndPreview}>{translate('home_page_sections_image_template_image_display_title')}</div>
        <div css={radioGroupContainer}>
          <RadioGroup
            id="new-section-text-layout-style"
            name={PAGE_SECTION_LAYOUT}
            testID="new-section-text-layout-style"
            options={templateOptions.options}
            label={templateOptions.label}
            onUpdate={value => {
              if (
                (value === newSectionTemplates.FullImageBackground || value === newSectionTemplates.InsetImage) &&
                currentImage
              ) {
                setShowAspectRatioAlert(true);
              } else {
                setShowAspectRatioAlert(false);
              }
              // Inset image template do not have center alignment
              if (pageSectionAlignment === alignmentStyles.CENTER && value === newSectionTemplates.InsetImage) {
                setValue(PAGE_SECTION_ALIGNMENT, alignmentStyles.LEFT);
              }
            }}
          />
          {layoutTemplate !== newSectionTemplates.TextAndColorBackground ? (
            <SectionImageUpload
              imageDeleted={imageDeleted}
              setImageDeleted={setImageDeleted}
              newImage={newImage}
              setNewImage={setNewImage}
              currentImage={currentImage}
              sectionId={sectionId}
              fileSizeDescription="Banners-Image-Upload-Section-Supported-File-Size"
              aspectRatio={aspectRatioTypes.sixteenByNine}
              aspectRatioOptions={Array.of(translations.crop16By9)}
              videoCenterId={videoCenterId}
              entityType="Section"
              recommendationTextForFileUpload={recommendationTextForFileUpload}
            />
          ) : null}
          {layoutTemplate === newSectionTemplates.InsetImage && (
            <RadioGroup
              id={`new-section-image-layout-style-${sectionId}`}
              name={PAGE_SECTION_ALIGNMENT}
              testID={`new-section-image-layout-style-${sectionId}`}
              options={imageAlignmentOptions.options}
              label={imageAlignmentOptions.label}
            />
          )}
        </div>
      </div>
      <div css={horizontalLine} />
      <div css={optionsContainer}>
        <div css={viewOptionsAndPreview}>{translate('home_page_sections_image_template_text_display_title')}</div>
        <div css={radioGroupContainer}>
          {(layoutTemplate === newSectionTemplates.FullImageBackground ||
            layoutTemplate === newSectionTemplates.TextAndColorBackground) && (
            <RadioGroup
              id={`new-section-layout-style-${sectionId}`}
              name={PAGE_SECTION_ALIGNMENT}
              testID={`new-section-layout-style-${sectionId}`}
              options={textAlignmentOptions.options}
              label={textAlignmentOptions.label}
            />
          )}
          <Textbox
            label={translate('home_page_new_section_title')}
            name={PAGE_SECTION_TITLE}
            maxLength={HC_NEW_SECTION_TITLE_LIMIT}
            messages={remainingLengthMessage(HC_NEW_SECTION_TITLE_LIMIT, title)}
            onChange={({ target }) => {
              setTitle(target?.value);
            }}
            isRequired
          />
          <Textarea
            maxLength={HC_NEW_SECTION_DESCRIPTION_LIMIT}
            label={translate('home_page_custom_upcoming_events_description')}
            name={PAGE_SECTION_TEXT_BODY}
            minHeight="m"
          />
          <Textbox
            label={translate('Banners-Content-Banner-Button-Text-Label')}
            name={PAGE_SECTION_BUTTON_TEXT}
            maxLength={HC_NEW_SECTION_BUTTON_TEXT_LIMIT}
            messages={remainingLengthMessage(HC_NEW_SECTION_BUTTON_TEXT_LIMIT, buttonText)}
            onChange={({ target }) => {
              setButtonText(target?.value);
            }}
          />
          <Dropdown
            id={`new-section-layout-style-${sectionId}`}
            label={translate('Banners-Content-Banner-Button-Destination-Label')}
            name={PAGE_SECTION_BUTTON_INTERNAL_TARGET}
            options={buttonDestinationOptions}
            onUpdate={value => {
              setShowExternalURLField(value === translate('Banners-Content-Banner-Button-Destination-Type-Other-Link'));
              setValue(
                'buttonTargetType',
                value === translate('Banners-Content-Banner-Button-Destination-Type-Other-Link')
                  ? 'External'
                  : 'Internal'
              );
            }}
          />
          {showExternalURLField && (
            <Textbox
              name={PAGE_SECTION_BUTTON_EXTERNAL_TARGET}
              label={translate('Banners-Form-ExternalURL')}
              validate={validateButtonURL}
            />
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
          disabled={Boolean(
            !pageSectionTitle?.trim() ||
              (template !== newSectionTemplates.TextAndColorBackground && newImage === null && currentImage === null)
          )}
          testID="template-section-add-section-done-button"
        />
      </div>
    </div>
  );
}

export default NewSection;

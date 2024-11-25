import CardContainer from '@components/common/CardContainer';
import { BannerStyles } from '@components/videoCenters/style';
import { BannerButtonInput, ExistingBanner } from '@cvent/planner-event-hubs-model/types';
import React, { useEffect, useState } from 'react';
import { ApolloError, useMutation, useQuery } from '@apollo/client';
import { CurrentImage, NewImage } from '@components/common/imageUpload/types';
import { Form } from '@cvent/carina/components/Forms/Form';
import { LoggerFactory } from '@cvent/logging/LoggerFactory';
import { accountConfig as getAccountConfig } from '@cvent/planner-event-hubs-model/operations/coreSOA';
import { useStyle } from '@hooks/useStyle';
import { isNil, mapValues, omit } from 'lodash';
import { useTranslate } from 'nucleus-text';
import BlockThemeProvider from '@cvent/blocks/components/BlockThemeProvider';
import { useCenterInfo } from '@hooks/useCenterInfo';
import { GET_BANNER, HUB_PAGES, UPDATE_BANNER_MUTATION } from '@cvent/planner-event-hubs-model/operations/banner';
import { useBannersPageActionsApi } from '@metrics/client/react/useBannersPageActionsApi';
import { aspectRatioTypes, translations } from '@cvent/image-editor';
import { HELVETICA_BLOCKS_FONT } from '@utils/constants';
import {
  ALIGN_LEFT,
  ALIGN_RIGHT,
  ALT_TEXT_FIELD,
  BANNER_BODY_FIELD,
  BANNER_BUTTON_DESTINATION_TYPE,
  BANNER_BUTTON_DESTINATION_URL,
  BANNER_BUTTON_ENABLED,
  BANNER_BUTTON_TEXT_FIELD,
  BANNER_TITLE_FIELD,
  FONT_COLOR,
  FULL_IMAGE,
  IMAGE_ALIGNMENT,
  IMAGE_FIELD,
  INSET_IMAGE,
  TEXT_ALIGNMENT,
  TEXT_COLOR,
  VIDEO_CENTER_PAGE,
  buttonLinkDestinations
} from './BannerConstants';
import BannerImageUpload from './BannerImageUpload';
import BannerContent from './formSections/BannerContent';
import BannerStyling from './formSections/BannerStyling';
import PagesSection from './formSections/PagesSection';
import PageBanner from './topBanner/PageBanner';

const LOG = LoggerFactory.create('BannerContentForm');

type BannerFormProps = {
  videoCenterId: string;
  bannerData: ExistingBanner;
};

function BannerContentForm({ videoCenterId, bannerData }: BannerFormProps): React.JSX.Element {
  const { translate } = useTranslate();
  const { bannerContent, bannerCards, bannerPreviewText, bannerPreviewDesc } = useStyle(BannerStyles);
  const { data: accountConfig } = useQuery(getAccountConfig);
  const isAIAssistantEnabled =
    accountConfig?.accountConfig?.AccountFeatures?.GeneralFeatures?.AIWritingAssistantEnabled;
  const [contentSectionUpdated, setContentSectionUpdated] = useState(false);
  const [designSectionUpdated, setDesignSectionUpdated] = useState(false);
  const { bannerContentSectionChecked, bannerDesignSectionChecked, bannerImageChecked } = useBannersPageActionsApi();

  const { theme: centerTheme } = useCenterInfo();

  // Initialize null values to empty strings
  const initialText = mapValues(bannerData.text, v => (isNil(v) ? '' : v));
  const initialButton = mapValues(bannerData.button, v => (isNil(v) ? '' : v));
  const initialFieldValues = {
    [IMAGE_ALIGNMENT]: bannerData.imageAlignment || ALIGN_RIGHT,
    [IMAGE_FIELD]: bannerData.imageUrl || null,
    [ALT_TEXT_FIELD]: bannerData.imageAltText || '',
    [TEXT_ALIGNMENT]: initialText.alignment || ALIGN_LEFT,
    [FONT_COLOR]: initialText.color || null,
    [BANNER_BODY_FIELD]: initialText.body,
    [BANNER_TITLE_FIELD]: initialText.title,
    [BANNER_BUTTON_ENABLED]: initialButton.enabled,
    [BANNER_BUTTON_TEXT_FIELD]: initialButton.text,
    [BANNER_BUTTON_DESTINATION_TYPE]: initialButton.targetType || buttonLinkDestinations.INTERNAL,
    [VIDEO_CENTER_PAGE]: initialButton.internalTarget,
    [BANNER_BUTTON_DESTINATION_URL]: initialButton.target,
    count: 1
  };
  const [bannerValues, setBannerValues] = useState(initialFieldValues);
  const [isValueChangedByAI, setIsValueChangedByAI] = useState(false);
  const template = bannerData?.layout;
  // Save banner updates
  const [updateBannerMutation] = useMutation(UPDATE_BANNER_MUTATION);
  const onSaveBanner = async (_event, { values, dirty, hasErrors }) => {
    LOG.debug('onSaveBanner', dirty, hasErrors);
    if ((dirty && !hasErrors) || (isValueChangedByAI && !hasErrors)) {
      setBannerValues(values);
      const newText = {
        alignment: values[TEXT_ALIGNMENT],
        body: values[BANNER_BODY_FIELD],
        color: values[FONT_COLOR],
        title: values[BANNER_TITLE_FIELD]
      };
      const newButton: BannerButtonInput = {
        enabled: values[BANNER_BUTTON_ENABLED],
        text: values[BANNER_BUTTON_TEXT_FIELD],
        targetType: values[BANNER_BUTTON_DESTINATION_TYPE],
        internalTarget: values[VIDEO_CENTER_PAGE],
        target: values[BANNER_BUTTON_DESTINATION_URL]
      };
      const updatedBanner = {
        ...bannerData,
        newImageUrl: newImage?.croppedUrl || newImage?.url,
        newOriginalImageUrl: newImage?.url,
        imageAlignment: values[IMAGE_ALIGNMENT],
        imageAltText: values[ALT_TEXT_FIELD],
        button: newButton,
        text: newText
      };
      if (imageDeleted) {
        updatedBanner.newImageUrl = null;
        updatedBanner.newOriginalImageUrl = null;
        updatedBanner.imageUrl = null;
        updatedBanner.originalImageUrl = null;
      }
      const bannerToSave: ExistingBanner = omit(updatedBanner, '__typename');
      LOG.info('Saving banner updates', bannerToSave);
      updateBannerMutation({
        variables: { input: bannerToSave },
        update: (cache, result) => {
          const bannerResult = result?.data?.bannerUpdate;
          cache.writeQuery({
            query: GET_BANNER,
            variables: {
              bannersSearch: {
                centerId: videoCenterId,
                bannerId: bannerData.id
              }
            },
            data: { banner: { ...bannerResult } }
          });

          // ensure currentImage reflects current banner state after save
          setCurrentImage(
            bannerResult.originalImageUrl
              ? {
                  url: bannerResult.originalImageUrl,
                  filename: bannerResult.originalImageUrl.split('/').pop()
                }
              : null
          );
        },
        onError: (error, _clientOptions) => {
          setBannerValues(initialFieldValues);
          // ErrorApolloLink will handle this and render crash page
          throw new ApolloError(error);
        }
      });
      setNewImage(null);
      setEditContent(false);
      setEditStyle(false);
      setEditImage(false);
      setImageDeleted(false);

      // Analytics
      if (contentSectionUpdated) {
        bannerContentSectionChecked({
          bannerTitle: values[BANNER_TITLE_FIELD],
          bannerBody: values[BANNER_BODY_FIELD],
          buttonText: values[BANNER_BUTTON_TEXT_FIELD],
          whereWillThisButtonBringYourMembers: values[BANNER_BUTTON_DESTINATION_TYPE],
          selectAPage: values[VIDEO_CENTER_PAGE],
          externalLink: values[BANNER_BUTTON_DESTINATION_URL]
        });
        setContentSectionUpdated(false);
      }
      if (designSectionUpdated) {
        bannerDesignSectionChecked({
          textAlignment: values[TEXT_ALIGNMENT],
          fontColor: values[FONT_COLOR] ?? '#ffffff' // white is default
        });
        setDesignSectionUpdated(false);
      }
      if (newImage?.croppedUrl || newImage?.url || imageDeleted) {
        bannerImageChecked({});
      }
    }
    if (!dirty && !hasErrors) {
      setEditContent(false);
      setEditStyle(false);
      setEditImage(false);
      setImageDeleted(false);
      setContentSectionUpdated(false);
      setDesignSectionUpdated(false);
    }
  };

  // HubPages data for button destination
  const { data: bannerPagesListData } = useQuery(HUB_PAGES, {
    variables: {
      id: {
        id: videoCenterId
      }
    }
  });
  const hubPagesListData = bannerPagesListData?.hubPages?.data;

  // Content Editor
  const [editContent, setEditContent] = useState(false);
  const onEditContent = () => {
    setEditContent(true);
  };
  const onCancelContent = () => {
    const newbannerValues = { ...bannerValues };
    if (isValueChangedByAI) {
      setIsValueChangedByAI(false);
      newbannerValues[BANNER_BODY_FIELD] = initialText.body;
    }

    setBannerValues({ ...newbannerValues, count: Math.random() });
    setEditContent(false);
  };

  const [currentImage, setCurrentImage] = useState<CurrentImage>(
    bannerData.originalImageUrl
      ? {
          url: bannerData.originalImageUrl,
          croppedUrl: bannerData.imageUrl,
          filename: bannerData.originalImageUrl.split('/').pop()
        }
      : null
  );
  const [newImage, setNewImage] = useState<NewImage>(null);
  const [imageDeleted, setImageDeleted] = useState(false);
  useEffect(() => {
    if (imageDeleted) {
      setCurrentImage(null);
      setNewImage(null);
    }
  }, [imageDeleted]);

  // Style Editor
  const [editStyle, setEditStyle] = useState(false);
  const onEditStyle = () => {
    setEditStyle(true);
  };
  const onCancelStyle = () => {
    setBannerValues({ ...bannerValues, count: Math.random() });
    setEditStyle(false);
  };

  // Image Editor
  const [editImage, setEditImage] = useState(false);
  const onEditImage = () => {
    setEditImage(true);
  };
  const onCancelImage = () => {
    setImageDeleted(false);
    setEditImage(false);
    setNewImage(null);
    setCurrentImage(
      bannerData.originalImageUrl
        ? {
            url: bannerData.originalImageUrl,
            croppedUrl: bannerData.imageUrl,
            filename: bannerData.originalImageUrl.split('/').pop()
          }
        : null
    );
    setBannerValues({ ...bannerValues, count: Math.random() });
  };
  const onSubmitImage = async () => {
    // no-op
  };

  const bannerPreviewProps = {
    title: bannerValues[BANNER_TITLE_FIELD],
    body: bannerValues[BANNER_BODY_FIELD],
    buttonText: bannerValues[BANNER_BUTTON_TEXT_FIELD],
    alignment: bannerValues[TEXT_ALIGNMENT],
    imageURL: newImage?.croppedUrl || newImage?.url || currentImage?.croppedUrl || currentImage?.url,
    altText: bannerValues[ALT_TEXT_FIELD],
    imageAlignment: bannerValues[IMAGE_ALIGNMENT]?.toLowerCase(),
    fontColor: bannerValues[FONT_COLOR],
    buttonHref: bannerValues[BANNER_BUTTON_DESTINATION_URL] || bannerValues[VIDEO_CENTER_PAGE]
  };
  const bannerPreviewTemplateProps = {
    [TEXT_COLOR]: {
      type: 'text',
      ...bannerPreviewProps
    },
    [INSET_IMAGE]: {
      type: 'image-inlay',
      ...bannerPreviewProps
    },
    [FULL_IMAGE]: {
      type: 'full-image',
      ...bannerPreviewProps
    }
  };
  // these values are passed through to Image.recommendedText which calls translate()
  const fileSizeDescriptions = {
    [INSET_IMAGE]: 'Banners-Image-Upload-Section-Supported-File-Size-Inset-Image',
    [FULL_IMAGE]: 'Banners-Image-Upload-Section-Supported-File-Size'
  };
  // these values populate some pre-amble above the upload button
  const imageUploadDescriptions = {
    [INSET_IMAGE]: 'Banners-Image-Upload-Section-Description-Inset',
    [FULL_IMAGE]: 'Banners-Image-Upload-Section-Description-Full-Image'
  };
  const aspectRatios = {
    [INSET_IMAGE]: {
      label: translations.crop3By2,
      value: aspectRatioTypes.threeByTwo
    },
    [FULL_IMAGE]: {
      label: translations.crop16By9,
      value: aspectRatioTypes.sixteenByNine
    }
  };

  const bannerPreview = (
    <BlockThemeProvider
      primary={centerTheme?.mainColor}
      secondary={centerTheme?.actionColor}
      background={centerTheme?.backgroundColor}
      mood={centerTheme?.moodColor}
      safeMode={centerTheme?.safeMode}
      blockColorKey="primary"
      headingFont={HELVETICA_BLOCKS_FONT}
      bodyFont={HELVETICA_BLOCKS_FONT}
    >
      <PageBanner
        type={bannerPreviewTemplateProps[template].type}
        testID="banner-preview"
        buttonAction={() => null}
        banner={bannerValues}
        {...bannerPreviewTemplateProps[template]}
        backgroundColor={centerTheme?.mainColor}
      />
    </BlockThemeProvider>
  );

  return (
    <Form
      readOnly={!editStyle && !editContent && !editImage}
      name="bannerContent"
      testID="banner-content-form"
      initialValues={bannerValues}
      initializationMode="reinitialize"
      onSubmit={onSaveBanner}
      validateOnInitialization
    >
      <div css={{ paddingLeft: '1.5rem' }}>
        <h2 css={bannerPreviewText}>{translate('banner-setup-title')}</h2>
        <p css={bannerPreviewDesc}>{translate('banner-setup-details')}</p>
      </div>
      <div css={{ padding: '1.5rem' }}>{bannerPreview}</div>
      <div css={bannerContent}>
        {template === INSET_IMAGE || template === FULL_IMAGE ? (
          <CardContainer
            testID="banner-images"
            enabled={editImage}
            onEdit={onEditImage}
            onCancel={onCancelImage}
            onSubmit={onSubmitImage}
            disabled={editStyle || editContent}
          >
            <BannerImageUpload
              editMode={editImage}
              imageDeleted={imageDeleted}
              setImageDeleted={setImageDeleted}
              newImage={newImage}
              setNewImage={setNewImage}
              currentImage={currentImage}
              videoCenterId={videoCenterId}
              imageUploadDescription={imageUploadDescriptions[template]}
              fileSizeDescription={fileSizeDescriptions[template]}
              aspectRatio={aspectRatios[template].value}
              aspectRatioOptions={Array.of(aspectRatios[template].label)}
            />
          </CardContainer>
        ) : null}
        <CardContainer
          testID="banner-content"
          enabled={editContent}
          onEdit={onEditContent}
          onCancel={onCancelContent}
          disabled={editStyle || editImage}
          onSubmit={() => {
            setContentSectionUpdated(true);
          }}
        >
          <BannerContent
            css={bannerCards}
            titleRequired={template === TEXT_COLOR && editContent}
            hubPagesListData={hubPagesListData}
            showAIAssistant={editContent && isAIAssistantEnabled}
            setIsValueChangedByAI={setIsValueChangedByAI}
          />
        </CardContainer>
        <CardContainer
          testID="banner-style"
          enabled={editStyle}
          onEdit={onEditStyle}
          onCancel={onCancelStyle}
          disabled={editContent || editImage}
          onSubmit={() => {
            setDesignSectionUpdated(true);
          }}
        >
          <BannerStyling
            readOnly={!editStyle}
            css={bannerCards}
            showFontColorSection={template === FULL_IMAGE}
            showImageAlignmentSection={template === INSET_IMAGE}
          />
        </CardContainer>
        <CardContainer testID="banner-pages" disabled={editContent || editImage || editStyle}>
          <PagesSection />
        </CardContainer>
      </div>
    </Form>
  );
}

export default BannerContentForm;

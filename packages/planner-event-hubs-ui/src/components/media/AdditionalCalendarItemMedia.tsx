import React, { useState, useCallback } from 'react';
import { XIcon } from '@cvent/carina/components/Icon';
import { useStyle } from '@hooks/useStyle';
import { CardBody, CardContainer } from '@cvent/carina/components/Card';
import { deleteEntityImage, getEntityImage, uploadEntityImage } from '@cvent/planner-event-hubs-model/operations/media';
import Loading from '@components/common/loading/LoadingWrapper';
import { useTranslate } from 'nucleus-text';
import { getAdditionalCalendarItemMediaPageUrl } from '@utils/appConfig';
import { IMAGE_MAXIMUM_SIZE, IMAGE_MAXIMUM_SIZE_IN_MB } from '@utils/constants';
import { injectTestId } from '@cvent/nucleus-test-automation';
import Button from '@cvent/carina/components/Button';
import { Image } from '@components/common/imageUpload/Image';
import { aspectRatioTypes, translations } from '@cvent/image-editor';
import { useMutation, useQuery } from '@apollo/client';
import { MediaUploadStyles } from '@components/media/style';

/**
 * Additional Calendar Item Media Component
 * to be used to display the card for media upload
 */

interface Props {
  additionalCalendarId: string;
}

function AdditionalCalendarItemMedia({ additionalCalendarId }: Props): React.JSX.Element {
  const { translate } = useTranslate();
  const {
    iconStyle,
    container,
    buttonStyle,
    cancelButtonStyle,
    imageContainer,
    cardContainer,
    imageLabelStyle,
    imageDescriptionStyle,
    imageHeader
  } = useStyle(MediaUploadStyles);
  const [newImage, setNewImage] = useState(null);
  const [imageDeleted, setImageDeleted] = useState(false);
  const additionalCalendarItemMediaPageUrl = getAdditionalCalendarItemMediaPageUrl(additionalCalendarId);
  const [currentImage, setCurrentImage] = useState(null);
  const [saveDisabled, setSaveDisabled] = useState(true);
  const entityInput = {
    id: additionalCalendarId,
    type: 'CALENDAR_ADDITIONAL_ITEM'
  };

  const { loading: loadingImage } = useQuery(getEntityImage, {
    variables: {
      entity: entityInput
    },
    onCompleted: imageData => {
      if (imageData) {
        setCurrentImage({
          ...imageData?.getEntityImage
        });
      }
    }
  });

  const [uploadImage, { loading: uploadingImage }] = useMutation(uploadEntityImage, {
    variables: {
      imageInput: {
        name: newImage?.filename,
        previousImageId: currentImage?.id || null,
        size: newImage?.size,
        url: newImage?.croppedUrl || newImage?.url,
        entity: entityInput
      }
    },
    onCompleted: imageData => {
      setCurrentImage({
        ...imageData?.uploadEntityImage
      });
    }
  });

  const [deleteImage, { loading: deletingImage }] = useMutation(deleteEntityImage, {
    variables: { imageId: currentImage?.id },
    onCompleted: () => {
      setCurrentImage(null);
      setNewImage(null);
    }
  });

  const onCancel = useCallback(() => {
    window.location.href = additionalCalendarItemMediaPageUrl;
  }, [additionalCalendarItemMediaPageUrl]);

  const onSave = useCallback(async () => {
    if (currentImage && imageDeleted) {
      await deleteImage();
    }
    if (newImage) {
      await uploadImage();
    }

    window.location.href = additionalCalendarItemMediaPageUrl;
  }, [newImage, imageDeleted, currentImage, additionalCalendarItemMediaPageUrl, deleteImage, uploadImage]);

  const renderer = (): React.JSX.Element => (
    <div>
      <div css={iconStyle} {...injectTestId('media-file-cancel-icon')}>
        <Button
          element="a"
          href={additionalCalendarItemMediaPageUrl}
          appearance="ghost"
          icon={XIcon}
          aria-label={translate('close_button_label')}
        />
      </div>
      <div css={container}>
        <CardContainer width="100%" height="100%" responsive>
          <div css={cardContainer}>
            <CardBody>
              <div css={imageContainer} {...injectTestId('additional-calendar-item-media-card')}>
                <h2 css={imageHeader}>{translate('additional_calendar_item_media_page_title')}</h2>
                <div css={imageDescriptionStyle}>{translate('additional_calendar_item_image_description')}</div>
                <div css={imageLabelStyle}>{`${translate('additional_calendar_item_image_label')}:`}</div>
                <Image
                  editMode
                  allowImageEdit
                  currentImage={currentImage}
                  setNewImage={newImageParam => {
                    setNewImage(newImageParam);
                    setSaveDisabled(false);
                  }}
                  newImage={newImage}
                  entityId={entityInput.id}
                  entityType={entityInput.type}
                  setImageDeleted={imageDeletedParam => {
                    setImageDeleted(imageDeletedParam);
                    setSaveDisabled(false);
                  }}
                  imageDeleted={imageDeleted}
                  aspectRatio={aspectRatioTypes.sixteenByNine}
                  aspectRatioOptions={Array.of(translations.crop16By9)}
                  imageAltText="channel_image_alt_text"
                  imageMaximumSize={IMAGE_MAXIMUM_SIZE}
                  incorrectImageUploadText={translate('channel_image_supported_fileType_text', {
                    maxSize: IMAGE_MAXIMUM_SIZE_IN_MB
                  })}
                  maxWidthImage={16}
                  noImageTitleText="channel_empty_image_alt_text"
                  noImageUploadedText="channel_empty_image_alt_text"
                  recommendedText="channel_image_recommended_dimension_text"
                  showPlaceHolderInReadMode
                  supportedText={translate('channel_image_supported_fileType_text', {
                    maxSize: IMAGE_MAXIMUM_SIZE_IN_MB
                  })}
                />
              </div>
            </CardBody>
          </div>
        </CardContainer>
        <span css={buttonStyle}>
          <span css={cancelButtonStyle}>
            <Button
              appearance="lined"
              text={translate('cancel_button_label')}
              onClick={(): void => {
                onCancel();
              }}
              size="s"
              testID="media-cancel-button"
            />
          </span>

          <Button
            appearance="filled"
            text={translate('save_button_label')}
            disabled={saveDisabled}
            onClick={onSave}
            size="s"
            testID="media-save-button"
          />
        </span>
      </div>
    </div>
  );
  return <Loading loading={loadingImage || uploadingImage || deletingImage} renderer={renderer} />;
}

export default AdditionalCalendarItemMedia;

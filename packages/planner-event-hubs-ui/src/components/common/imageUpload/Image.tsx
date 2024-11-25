import React, { useCallback, useMemo } from 'react';
import { ImageIcon } from '@cvent/carina/components/Icon';
import { injectTestId } from '@cvent/nucleus-test-automation';
import { useStyle } from '@hooks/useStyle';
import { ActionButtons } from '@components/common/imageUpload/ActionButtons';
import { useTranslate } from 'nucleus-text';
import { CurrentImage, NewImage } from '@components/common/imageUpload/types';
import { ImageUploadStyles } from '@components/common/imageUpload/style';
import thumbnailPlaceholder from '@components/images/videoThumbnailPlaceholder.png';
import { useTheme } from '@cvent/carina/components/ThemeProvider/useTheme';

/**
 * Image Component to be used to display the image
 */

export function Image({
  preSignedUpload,
  videoCenterId,
  isBanner,
  isLogo = false,
  editMode,
  setNewImage,
  newImage,
  currentImage,
  imageDeleted,
  setImageDeleted,
  supportedText,
  recommendedText,
  incorrectImageUploadText,
  maxWidthImage,
  noImageTitleText,
  imageAltText,
  noImageUploadedText,
  showPlaceHolderInReadMode,
  imageMaximumSize,
  entityId,
  aspectRatio,
  aspectRatioOptions,
  disableDelete,
  acceptedFileFormats,
  useCroppedImage = false,
  maxFileNameLength,
  allowImageEdit = false,
  fileNameWidth,
  entityType = '',
  imageUploadTriggerLocation,
  showImageName = true,
  showUploadTips = true,
  useFileUpload = false,
  recommendationTextForFileUpload = ''
}: Props): React.JSX.Element {
  const { translate } = useTranslate();
  const { backgroundColor } = useTheme();
  const imageUrl = useMemo(
    () => !imageDeleted && (newImage?.croppedUrl || newImage?.url || currentImage?.croppedUrl || currentImage?.url),
    [currentImage, imageDeleted, newImage]
  );
  const imageUrlForEdit = useMemo(
    () => !imageDeleted && (newImage?.url || currentImage?.url),
    [currentImage, imageDeleted, newImage]
  );

  const {
    imageStyles,
    imageStylesLogo,
    imageIconStyles,
    supportFileTextStyles,
    RecommendedFileTextStyles,
    fileNameStyles,
    imagePlaceHolderStyles,
    imageAvailableStyles,
    imageMaxWidthStyles,
    noImageText,
    customFilenameWidthStyles
  } = useStyle(ImageUploadStyles, { imageAspectRatio: aspectRatio, maxWidthImage, fileNameWidth });

  const ImagePlaceHolder = useMemo(
    () => (
      <>
        {!isBanner && (showPlaceHolderInReadMode || editMode) && (
          <div css={imageMaxWidthStyles}>
            <div css={imagePlaceHolderStyles}>
              <div css={imageStyles}>
                <div
                  css={imageIconStyles}
                  {...injectTestId('image-icon')}
                  title={translate(noImageTitleText)}
                  aria-label={translate(noImageTitleText)}
                  role="img"
                >
                  <ImageIcon size="m" />
                </div>
              </div>
            </div>
          </div>
        )}
        {!editMode && <p css={noImageText}>{translate(noImageUploadedText)}</p>}
      </>
    ),
    [
      isBanner,
      showPlaceHolderInReadMode,
      editMode,
      imageMaxWidthStyles,
      imagePlaceHolderStyles,
      imageStyles,
      imageIconStyles,
      translate,
      noImageTitleText,
      noImageText,
      noImageUploadedText
    ]
  );

  const onImageLoadError = useCallback(
    element => {
      // eslint-disable-next-line no-param-reassign
      element.currentTarget.src = thumbnailPlaceholder.src;
      // eslint-disable-next-line no-param-reassign
      element.currentTarget.style.backgroundColor = backgroundColor.hover;
    },
    [backgroundColor.hover]
  );

  const ImageAvailable = useMemo(
    () => (
      <div css={fileNameWidth ? customFilenameWidthStyles : imageMaxWidthStyles}>
        <div css={imageMaxWidthStyles}>
          {!isBanner ? (
            <div css={imageAvailableStyles} {...injectTestId('uploaded-image')}>
              <img
                css={isLogo ? imageStylesLogo : imageStyles}
                src={imageUrl}
                title={translate(imageAltText)}
                alt={translate(imageAltText)}
                onError={onImageLoadError}
                {...injectTestId('uploaded-image-element')}
              />
            </div>
          ) : null}
        </div>
        {showImageName && (
          <p css={fileNameStyles}>{newImage?.filename || (currentImage?.url ? currentImage?.filename : '')}</p>
        )}
      </div>
    ),
    [
      fileNameWidth,
      customFilenameWidthStyles,
      imageMaxWidthStyles,
      isBanner,
      imageAvailableStyles,
      isLogo,
      imageStylesLogo,
      imageStyles,
      imageUrl,
      translate,
      imageAltText,
      onImageLoadError,
      fileNameStyles,
      newImage?.filename,
      currentImage?.url,
      currentImage?.filename,
      showImageName
    ]
  );

  const UploadTips = useMemo(
    () => (
      <div>
        <p css={supportFileTextStyles}>{supportedText}</p>
        <p css={RecommendedFileTextStyles}>{translate(recommendedText)}</p>
      </div>
    ),
    [RecommendedFileTextStyles, recommendedText, supportFileTextStyles, supportedText, translate]
  );

  return (
    <div>
      {imageUrl ? ImageAvailable : ImagePlaceHolder}
      {
        // banner design, display tips above buttons
        isBanner && editMode && showUploadTips && UploadTips
      }
      {editMode && (
        <ActionButtons
          isLogo={isLogo}
          preSignedUpload={preSignedUpload}
          videoCenterId={videoCenterId}
          imageUrl={imageUrlForEdit}
          setNewImage={setNewImage}
          newImage={newImage}
          currentImage={currentImage}
          setImageDeleted={setImageDeleted}
          incorrectImageUploadText={incorrectImageUploadText}
          imageMaximumSize={imageMaximumSize}
          entityId={entityId}
          aspectRatio={aspectRatio}
          aspectRatioOptions={aspectRatioOptions}
          disableDelete={disableDelete}
          acceptedFileFormats={acceptedFileFormats}
          useCroppedImage={useCroppedImage}
          maxFileNameLength={maxFileNameLength}
          allowImageEdit={allowImageEdit}
          entityType={entityType}
          imageUploadTriggerLocation={imageUploadTriggerLocation}
          useFileUpload={useFileUpload}
          recommendationTextForFileUpload={recommendationTextForFileUpload}
        />
      )}
      {
        // channel design, display tips below buttons
        !isBanner && editMode && showUploadTips && UploadTips
      }
    </div>
  );
}

interface Props {
  // prop used to determine of the image upload should follow a pre-signed workflow
  preSignedUpload?: boolean;
  // prop used to generate pre-signed url (used when preSignedUpload is true)
  videoCenterId?: string;
  // prop used to determine of the image upload is from banners page
  isBanner?: boolean;
  // prop used to determine of the image upload is a theme logo
  isLogo?: boolean;
  // prop used to determine if the image is in edit mode or not
  editMode: boolean;
  // prop used to set new image
  setNewImage: (newImage: NewImage) => void;
  // prop used for uploading a new image
  newImage: NewImage;
  // prop used for current image
  currentImage: CurrentImage;
  // prop used to check if the image has been deleted
  imageDeleted: boolean;
  // prop used as a state to change image deleted value
  setImageDeleted: (imageDeleted: boolean) => void;
  // prop to be passed a string message to be shown for supported file types & size
  // Example: Supported file types: JPEG, JPG, PNG. File size up to 2 MB.
  supportedText: string;
  // prop to be passed a string message to be shown for recommended file types & size
  // Example: Recommended size: 1280 x 720 pixels. Aspect ratio must be 16:9.
  recommendedText: string;
  // Prop to be passed as an error message to be displayed when image is uploaded of unsupported type/size
  incorrectImageUploadText: string;
  // max width of the image in rem. example: 20
  maxWidthImage: number;
  // Prop to be passed as a string message to be shown as a title for the empty image thumbnail
  noImageTitleText: string;
  // Prop to be passed as a string message to be shown as an alt text for the image
  imageAltText: string;
  // prop to be passed as a string message when image is not uploaded
  noImageUploadedText: string;
  // boolean prop to be passed to enable/disable placeHolder on ReadOnly mode.
  showPlaceHolderInReadMode: boolean;
  // Maximum supported size for the image in bytes
  imageMaximumSize: number;
  // EntityId to be passed to the image editor to upload image to a temporary path.
  entityId: string;
  // Aspect ratio of the image to be shown on the image card & Dropdown option to be provided to the imageEditor
  // Example: Supported aspect ratios in ImageEditor: 16:9, 4:3, 1:1
  aspectRatio: number;
  // Aspect Ratio Options for the image
  aspectRatioOptions?: string[];
  // boolean prop to be passed to disable Delete button
  disableDelete?: boolean;
  // string comma-separated list of supported file extensions for upload limits
  acceptedFileFormats?: string;
  // boolean prop to be passed if croppedImage is to be displayed on clicking Edit button
  useCroppedImage?: boolean;
  // maximum length for filename, file base name will be trimmed such that final filename will be of maximum length
  maxFileNameLength?: number;
  // should allow image editing
  allowImageEdit?: boolean;
  // Custom width, interpreted in percentages of parent, for the file name, if not set, max image width provided in component is used
  fileNameWidth?: number;
  entityType?: string;
  imageUploadTriggerLocation?: string;
  showImageName?: boolean;
  showUploadTips?: boolean;
  // Use FileUpload carina component to upload images instead of button and input
  useFileUpload?: boolean;
  // Recommendation text to show below file uploader
  recommendationTextForFileUpload?: string;
}

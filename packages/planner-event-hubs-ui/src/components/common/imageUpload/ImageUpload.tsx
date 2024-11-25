import React from 'react';
import { HelpCirclePopper } from '@components/tracking-codes/HelpCirclePopper';
import { Image } from '@components/common/imageUpload/Image';
import { CurrentImage, NewImage } from '@components/common/imageUpload/types';
import { Col } from '@cvent/carina/components/Col';
import { useField, useWatchField } from '@cvent/carina/components/Forms';
import { Textbox } from '@cvent/carina/components/Forms/BasicFields/Textbox';
import { Row } from '@cvent/carina/components/Row';
import { IMAGE_MAXIMUM_SIZE } from '@utils/constants';
import { useTranslate } from 'nucleus-text';
import { injectTestId } from '@cvent/nucleus-test-automation';
import { CSSObject } from '@emotion/react';

type ImageUploadProps = {
  fileSizeDescription: string;
  currentImage: CurrentImage;
  imageDeleted: boolean;
  setImageDeleted: (boolean) => void;
  newImage: NewImage;
  setNewImage: (NewImage) => void;
  entityId: string;
  aspectRatio: number;
  aspectRatioOptions?: string[];
  videoCenterId: string;
  altTextField: string;
  imageField: string;
  maxWidthImage: number;
  acceptedFileFormats: string;
  entityType: string;
  supportedText: string;
  incorrectImageUploadText: string;
  imageUploadTriggerLocation: string;
  altTextStyle: CSSObject;
  altTextLimit: number;
  editMode: boolean;
  showUploadTips?: boolean;
  useFileUpload?: boolean;
  recommendationTextForFileUpload?: string;
};

function ImageUpload({
  fileSizeDescription,
  currentImage,
  imageDeleted,
  setImageDeleted,
  newImage,
  setNewImage,
  entityId,
  aspectRatio,
  aspectRatioOptions,
  videoCenterId,
  altTextField,
  imageField,
  maxWidthImage,
  acceptedFileFormats,
  entityType,
  imageUploadTriggerLocation,
  incorrectImageUploadText,
  supportedText,
  altTextStyle,
  altTextLimit,
  editMode,
  showUploadTips = true,
  useFileUpload = false,
  recommendationTextForFileUpload
}: ImageUploadProps): React.JSX.Element {
  const { translate } = useTranslate();
  const { setFieldValue } = useField({
    name: imageField
  });
  const onSetFieldValue = (selectedFile): void => {
    setFieldValue(selectedFile);
    setNewImage(selectedFile);
  };
  const dependencyValues: { [key: string]: string } = useWatchField([altTextField]);
  const remainingLengthMessage = (maxLength: number, value: string): string =>
    `${translate('characters_left_label', {
      characterCount: maxLength - value.length
    })}`;

  return (
    <div>
      <Row>
        <Col padding={0}>
          <div>
            <Image
              isBanner
              preSignedUpload={false}
              editMode={editMode}
              setNewImage={onSetFieldValue}
              newImage={newImage}
              currentImage={currentImage}
              imageDeleted={imageDeleted}
              setImageDeleted={setImageDeleted}
              supportedText={supportedText}
              recommendedText={fileSizeDescription}
              incorrectImageUploadText={incorrectImageUploadText}
              maxWidthImage={maxWidthImage}
              noImageTitleText="banner_empty_image_alt_text"
              imageAltText={dependencyValues[altTextField]}
              noImageUploadedText="banner_empty_image_alt_text"
              showPlaceHolderInReadMode
              imageMaximumSize={IMAGE_MAXIMUM_SIZE}
              entityId={entityId}
              aspectRatio={aspectRatio}
              aspectRatioOptions={aspectRatioOptions}
              disableDelete={null}
              acceptedFileFormats={acceptedFileFormats}
              allowImageEdit
              entityType={entityType}
              imageUploadTriggerLocation={imageUploadTriggerLocation}
              showImageName={false}
              videoCenterId={videoCenterId}
              showUploadTips={showUploadTips}
              useFileUpload={useFileUpload}
              recommendationTextForFileUpload={recommendationTextForFileUpload}
            />
          </div>
        </Col>
        {editMode || newImage || currentImage ? (
          <Col padding={{ start: 0, end: 32 }}>
            <div css={{ paddingTop: '1rem' }}>
              <div css={{ display: 'flex', gap: 8 }}>
                <div css={altTextStyle} {...injectTestId('banner-image-alt-text')}>
                  {translate('theme_image_alt_label')}
                </div>
                <HelpCirclePopper
                  testID="banner_alt_image"
                  helpText={translate('banner_image_alt_text_tooltip')}
                  accessibilityLabel={translate('Banners-Content-Banner-Image-Upload-Accessibility-Text')}
                />
              </div>
              <Textbox
                label=""
                maxLength={altTextLimit}
                name={altTextField}
                messages={remainingLengthMessage(altTextLimit, dependencyValues[altTextField])}
                aria-label={translate('Banner-Image-Alt-Text-Input')}
              />
            </div>
          </Col>
        ) : null}
      </Row>
    </div>
  );
}

export default ImageUpload;

import React, { useState } from 'react';
import ImageEditor, { aspectRatioTypes, ImageEditorClient, translations } from '@cvent/image-editor';
import Modal from '@cvent/carina/components/Modal';
import ScrollViewWithBars from '@cvent/carina/components/ScrollViewWithBars/ScrollViewWithBars';
import { useTranslate } from 'nucleus-text';
import { LoadingSpinner } from '@cvent/carina/components/LoadingSpinner';
import { getImageProcessingUrl, getBearerToken } from '@utils/appConfig';
import { CurrentImage, NewImage } from '@components/common/imageUpload/types';
import { CSSObject } from '@emotion/react';
import { ACCOUNT_STUB, CHANNEL_PAGE_MODAL_Z_INDEX } from '@utils/constants';
import { eq, isEmpty } from 'lodash';

/**
 * ImageEditorWrapper Component
 * to be used to display the card for image editor to adjust the dimensions of the image
 */

type LoaderProps = {
  style: CSSObject;
};

function Loader({ style }: LoaderProps): React.JSX.Element {
  return (
    <Modal
      isOpen
      format="l"
      height="85vh"
      testID="image-editor-loader-modal"
      disableFocusTrap
      zIndex={CHANNEL_PAGE_MODAL_Z_INDEX}
    >
      <div css={style}>
        <LoadingSpinner size="l" />
      </div>
    </Modal>
  );
}

export const aspectRatioOptions = [
  {
    label: translations.freeForm,
    value: aspectRatioTypes.freeForm
  },
  {
    label: translations.cropSquare,
    value: aspectRatioTypes.oneByOne
  },
  {
    label: translations.crop3By2,
    value: aspectRatioTypes.threeByTwo
  },
  {
    label: translations.crop4By3,
    value: aspectRatioTypes.fourByThree
  },
  {
    label: translations.crop16By9,
    value: aspectRatioTypes.sixteenByNine
  }
];

function filterAspectRatioByLabels(labels: string[]) {
  if (!isEmpty(labels)) {
    const filteredAspectRatios = aspectRatioOptions.filter(item => labels.includes(item.label));
    return filteredAspectRatios.length === 0 ? null : filteredAspectRatios;
  }
  return null;
}

export const ImageEditorWrapper = React.memo(
  ({
    currentImage,
    imageData,
    setNewImage,
    setIsOpen,
    entityId,
    isLoading,
    style,
    aspectRatioOptionList,
    aspectRatio,
    useCroppedImage
  }: Props): React.JSX.Element => {
    const { translate } = useTranslate();
    const { imageEditorStyle } = style;
    // ACCOUNT_STUB: Hard-coded account stub to store the image in S3 to a temp folder
    const [imageEditorClient] = useState(
      () => new ImageEditorClient(getImageProcessingUrl(), entityId, ACCOUNT_STUB, getBearerToken())
    );

    if (isLoading) {
      return (
        <div css={imageEditorStyle}>
          <Loader style={imageEditorStyle} />
        </div>
      );
    }

    return (
      <Modal
        format="l"
        zIndex={CHANNEL_PAGE_MODAL_Z_INDEX}
        height="85vh"
        isOpen
        disableFocusTrap
        onDismiss={(): void => {
          setIsOpen(false);
        }}
      >
        <ScrollViewWithBars>
          <div css={imageEditorStyle}>
            <ImageEditor
              imageUrl={
                useCroppedImage
                  ? imageData?.croppedUrl || imageData?.url || currentImage?.url
                  : imageData?.url || currentImage?.url
              }
              initialAspectRatio={aspectRatio || aspectRatioTypes.freeForm}
              enableApplyBtn
              onApply={(url): void => {
                setNewImage({
                  ...imageData,
                  croppedUrl: url
                });
                setIsOpen(false);
              }}
              translate={translate}
              onCancel={(): void => {
                if (currentImage && eq(currentImage, imageData) && isEmpty(imageData?.croppedUrl)) {
                  setNewImage(null);
                }
                setIsOpen(false);
              }}
              testID="image-editor"
              client={imageEditorClient}
              aspectRatioOptions={
                filterAspectRatioByLabels(aspectRatioOptionList)
                  ? filterAspectRatioByLabels(aspectRatioOptionList)
                  : aspectRatioOptions
              }
            />
          </div>
        </ScrollViewWithBars>
      </Modal>
    );
  }
);

interface Props {
  currentImage: CurrentImage;
  imageData: NewImage;
  setNewImage: (NewImage) => void;
  setIsOpen: (boolean) => void;
  entityId: string;
  isLoading: boolean;
  style: Record<string, CSSObject>;
  aspectRatioOptionList?: string[];
  aspectRatio: number;
  useCroppedImage: boolean;
}

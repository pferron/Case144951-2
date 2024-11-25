import React from 'react';
import { CurrentImage, NewImage } from '@components/common/imageUpload/types';
import { CardContainerStyles } from '@components/common/style';
import useQueryParams from '@hooks/useQueryParam';
import { useStyle } from '@hooks/useStyle';
import { BANNERS_PATH_PARAM, IMAGE_MAXIMUM_SIZE_IN_MB } from '@utils/constants';
import { useTranslate } from 'nucleus-text';
import ImageUpload from '@components/common/imageUpload/ImageUpload';
import { ImageStyle } from '@components/videoCenters/style';
import { ALT_TEXT_FIELD, IMAGE_FIELD } from './BannerConstants';

type BannerImageUploadProps = {
  imageUploadDescription: string;
  fileSizeDescription: string;
  editMode: boolean;
  currentImage: CurrentImage;
  imageDeleted: boolean;
  setImageDeleted: (boolean) => void;
  newImage: NewImage;
  setNewImage: (NewImage) => void;
  videoCenterId: string;
  aspectRatio: number;
  aspectRatioOptions: string[];
};

function BannerImageUpload({
  imageUploadDescription,
  fileSizeDescription,
  editMode,
  currentImage,
  imageDeleted,
  setImageDeleted,
  setNewImage,
  newImage,
  videoCenterId,
  aspectRatio,
  aspectRatioOptions
}: BannerImageUploadProps): React.JSX.Element {
  const { translate } = useTranslate();
  const { cardTitle, cardText } = useStyle(CardContainerStyles);
  const { bannerImageAltText } = useStyle(ImageStyle);
  const query = useQueryParams();
  const bannerId = query[BANNERS_PATH_PARAM] as string;

  return (
    <>
      <div>
        <h3 css={cardTitle}>{translate('Banners-Image-Upload-Section-Title')}</h3>
        <p css={cardText}>{translate(imageUploadDescription)}</p>
      </div>

      <div>
        <ImageUpload
          fileSizeDescription={fileSizeDescription}
          currentImage={currentImage}
          imageDeleted={imageDeleted}
          setImageDeleted={setImageDeleted}
          newImage={newImage}
          setNewImage={setNewImage}
          entityId={bannerId}
          aspectRatio={aspectRatio}
          aspectRatioOptions={aspectRatioOptions}
          videoCenterId={videoCenterId}
          altTextField={ALT_TEXT_FIELD}
          altTextStyle={bannerImageAltText}
          imageField={IMAGE_FIELD}
          maxWidthImage={20}
          acceptedFileFormats=".jpeg,.jpg,.png"
          entityType="Banner"
          imageUploadTriggerLocation="Banner-image"
          altTextLimit={100}
          supportedText={translate('Banners-Image-Upload-Section-Supported-File-Types', {
            maxSize: IMAGE_MAXIMUM_SIZE_IN_MB
          })}
          incorrectImageUploadText={translate('Banners-Image-Upload-Section-Supported-File-Types', {
            maxSize: IMAGE_MAXIMUM_SIZE_IN_MB
          })}
          editMode={editMode}
        />
      </div>
    </>
  );
}

export default BannerImageUpload;

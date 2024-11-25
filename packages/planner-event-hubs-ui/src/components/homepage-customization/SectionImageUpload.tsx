import React from 'react';
import { CurrentImage, NewImage } from '@components/common/imageUpload/types';
import { ImageStyle } from '@components/videoCenters/style';
import { useStyle } from '@hooks/useStyle';
import { HC_NEW_SECTION_IMAGE_ALT_TEXT_LIMIT } from '@utils/constants';
import { useTranslate } from 'nucleus-text';
import { injectTestId } from '@cvent/nucleus-test-automation';
import {
  PAGE_SECTION_IMAGE_ALT_TEXT,
  PAGE_SECTION_IMAGE_FIELD
} from '@components/homepage-customization/HomePageSectionMeta';
import ImageUpload from '@components/common/imageUpload/ImageUpload';
import FormElement from '@cvent/carina/components/FormElement';

type SectionImageUploadProps = {
  fileSizeDescription: string;
  currentImage: CurrentImage;
  imageDeleted: boolean;
  setImageDeleted: (boolean) => void;
  newImage: NewImage;
  setNewImage: (NewImage) => void;
  sectionId: string;
  aspectRatio: number;
  aspectRatioOptions: string[];
  videoCenterId: string;
  entityType: string;
  recommendationTextForFileUpload?: string;
};

function SectionImageUpload({
  fileSizeDescription,
  currentImage,
  imageDeleted,
  setImageDeleted,
  setNewImage,
  newImage,
  sectionId,
  aspectRatio,
  aspectRatioOptions,
  videoCenterId,
  entityType,
  recommendationTextForFileUpload
}: SectionImageUploadProps): React.JSX.Element {
  const { translate } = useTranslate();
  const { sectionImageAltText } = useStyle(ImageStyle);

  return (
    <>
      <FormElement.Label
        label={translate('Banners-Image-Upload-Section-Title')}
        labelFor="first_name_example"
        required
      />
      <div css={{ paddingBottom: newImage || currentImage ? 0 : 16 }}>
        <ImageUpload
          fileSizeDescription={fileSizeDescription}
          currentImage={currentImage}
          imageDeleted={imageDeleted}
          setImageDeleted={setImageDeleted}
          newImage={newImage}
          setNewImage={setNewImage}
          entityId={sectionId}
          aspectRatio={aspectRatio}
          aspectRatioOptions={aspectRatioOptions}
          videoCenterId={videoCenterId}
          altTextField={PAGE_SECTION_IMAGE_ALT_TEXT}
          imageField={PAGE_SECTION_IMAGE_FIELD}
          maxWidthImage={16}
          acceptedFileFormats=".jpeg,.jpg,.png,.gif"
          entityType={entityType}
          imageUploadTriggerLocation="Section-image"
          altTextLimit={HC_NEW_SECTION_IMAGE_ALT_TEXT_LIMIT}
          altTextStyle={sectionImageAltText}
          supportedText={translate('home_page_new_section_supported_file_types_label')}
          incorrectImageUploadText={translate('home_page_new_section_supported_file_types_label')}
          editMode
          showUploadTips={false}
          useFileUpload
          recommendationTextForFileUpload={translate(recommendationTextForFileUpload)}
        />
        {(imageDeleted || (newImage === null && currentImage === null)) && (
          <FormElement.Message
            text={translate('Banners-Form-Image-Required-Error')}
            {...injectTestId('banner-image-required-error')}
            type="error"
          />
        )}
      </div>
    </>
  );
}

export default SectionImageUpload;

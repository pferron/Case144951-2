import React from 'react';
import { injectTestId } from '@cvent/nucleus-test-automation';
import BannerText from './BannerText';
import BannerImageInlay from './BannerImageInlay';
import BannerFullImage from './BannerFullImage';

interface Props {
  type: 'text' | 'image-inlay' | 'full-image';
  testID: string;
  title?: string;
  body?: string;
  buttonAction?: () => void;
  buttonText?: string;
  alignment?: string;
  imageURL?: string;
  altText?: string;
  imageAlignment?: string;
  fontColor?: string;
  buttonHref?: string;
  backgroundColor?: string;
  buttonColor?: string;
  titleField?: string;
  bodyField?: string;
  buttonTextField?: string;
  internalTargetField?: string;
  externalTargetField?: string;
  textAlignmentField?: string;
  imageAlignmentField?: string;
  buttonTargetType?: string;
  originalImageUrl?: string;
  imageAltTextField?: string;
  imageURLField?: string;
  textColor?: string;
}

function PageBanner({
  type,
  testID,
  title = '',
  body = '',
  buttonAction,
  buttonText = '',
  alignment = 'Left',
  imageURL,
  altText,
  imageAlignment = 'right',
  fontColor = 'white',
  buttonHref = '',
  backgroundColor,
  buttonColor,
  titleField,
  bodyField,
  buttonTextField,
  internalTargetField,
  externalTargetField,
  textAlignmentField,
  imageAlignmentField,
  buttonTargetType,
  originalImageUrl,
  imageAltTextField,
  imageURLField,
  textColor
}: Props): React.JSX.Element {
  const baseProps = {
    title,
    body,
    buttonAction,
    buttonText,
    buttonHref,
    alignment,
    testID
  };

  const getBannerComponent = () => {
    switch (type) {
      case 'image-inlay':
        return (
          <BannerImageInlay
            {...baseProps}
            imageURL={imageURL}
            altText={altText}
            imageAlignment={imageAlignment}
            backgroundColor={backgroundColor}
            buttonColor={buttonColor}
            titleField={titleField}
            bodyField={bodyField}
            buttonTextField={buttonTextField}
            internalTargetField={internalTargetField}
            externalTargetField={externalTargetField}
            textAlignmentField={textAlignmentField}
            imageAlignmentField={imageAlignmentField}
            buttonTargetType={buttonTargetType}
            originalImageUrl={originalImageUrl}
            imageAltTextField={imageAltTextField}
            imageURLField={imageURLField}
          />
        );
      case 'full-image':
        return (
          <BannerFullImage
            {...baseProps}
            imageURL={imageURL}
            altText={altText}
            fontColor={fontColor}
            titleField={titleField}
            bodyField={bodyField}
            buttonTextField={buttonTextField}
            internalTargetField={internalTargetField}
            externalTargetField={externalTargetField}
            textAlignmentField={textAlignmentField}
            imageAlignmentField={imageAlignmentField}
            buttonTargetType={buttonTargetType}
            originalImageUrl={originalImageUrl}
            imageAltTextField={imageAltTextField}
            imageURLField={imageURLField}
            textColor={textColor}
          />
        );
      default:
        return (
          <BannerText
            {...baseProps}
            backgroundColor={backgroundColor}
            buttonColor={buttonColor}
            titleField={titleField}
            bodyField={bodyField}
            buttonTextField={buttonTextField}
            internalTargetField={internalTargetField}
            externalTargetField={externalTargetField}
            textAlignmentField={textAlignmentField}
            buttonTargetType={buttonTargetType}
          />
        );
    }
  };

  return (
    <article style={{ display: 'block' }} {...injectTestId(testID)}>
      {getBannerComponent()}
    </article>
  );
}

export default PageBanner;

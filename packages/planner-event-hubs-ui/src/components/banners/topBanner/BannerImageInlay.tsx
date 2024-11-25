import React from 'react';
import { injectTestId } from '@cvent/nucleus-test-automation';
import { useBreakpoints } from '@cvent/carina/components/Breakpoints';
import { useTheme } from '@cvent/carina/components/ThemeProvider/useTheme';
import { Button } from '@cvent/carina/components/Button';
import { useWatchDirty, useWatchField } from '@cvent/carina/components/Forms';
import { useTranslate } from 'nucleus-text';
import { CSSObject } from '@emotion/react';
import {
  BANNER_TITLE_FIELD,
  BANNER_BODY_FIELD,
  BANNER_BUTTON_TEXT_FIELD,
  BANNER_BUTTON_DESTINATION_TYPE,
  BANNER_BUTTON_DESTINATION_URL,
  VIDEO_CENTER_PAGE,
  buttonLinkDestinations,
  IMAGE_ALIGNMENT,
  TEXT_ALIGNMENT,
  IMAGE_FIELD,
  ALT_TEXT_FIELD
} from '../BannerConstants';
import colorIsLight from '../utils/colorIsLight';

const useStyles = (alignment, bgColor, buttonColor): Record<string, CSSObject> => {
  const { m, l, widthWindow } = useBreakpoints();
  const { font, backgroundColor } = useTheme();

  // determine content alignment
  let contentAlignment = 'flex-start';
  if (alignment === 'Right') contentAlignment = 'flex-end';
  if (alignment === 'Center') contentAlignment = 'center';

  // determine font color based on contrast
  const bannerBackgroundColor = bgColor || backgroundColor.brand.fill.base;
  const lightBG = colorIsLight(bannerBackgroundColor);
  const textColor = lightBG ? '#000000' : '#FFFFFF';
  const btnColor = buttonColor !== '' ? buttonColor : backgroundColor.interactive.fill;

  const mediaIsLorXL = `@media (min-width: ${l}px)`;

  return {
    wrapper: {
      fontFamily: font.base.family,
      height: widthWindow > l ? 500 : 300,
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      backgroundColor: bannerBackgroundColor,
      color: textColor,
      fontWeight: font.base.weight.regular
    },
    content: {
      display: 'flex',
      maxWidth: widthWindow > l ? 1420 : 960,
      width: '100%',
      height: '100%',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxSizing: 'border-box',
      padding: widthWindow < m ? '20px 54px' : '20px 80px',
      gap: '24px'
    },
    textContainer: {
      maxHeight: widthWindow > l ? 430 : 220,
      overflow: 'hidden',
      width: '100%'
    },
    titleStyles: {
      color: textColor,
      width: '100%',
      fontSize: font.base.size[6],
      margin: 0,
      textAlign: alignment,
      fontWeight: font.base.weight.bold,
      [mediaIsLorXL]: { fontSize: font.base.size[8] }
    },
    bodyStyles: {
      fontSize: font.base.size[3],
      width: '100%',
      padding: '8px 0 20px',
      margin: 0,
      textAlign: alignment,
      color: textColor,
      [mediaIsLorXL]: { fontSize: font.base.size[5] }
    },
    bannerText: {
      display: 'flex',
      flexWrap: 'wrap',
      width: widthWindow > 750 ? '50%' : '100%',
      justifyContent: contentAlignment,
      button: {
        backgroundColor: btnColor,
        borderColor: btnColor,
        '&:hover': {
          backgroundColor: btnColor,
          borderColor: btnColor
        }
      }
    },
    bannerImage: {
      width: '50%',
      textAlign: 'center',
      height: widthWindow > l ? 380 : 220,
      display: widthWindow > 750 ? 'flex' : 'none',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '0 16px',
      img: {
        height: '100%',
        width: '100%',
        objectFit: 'contain'
      }
    }
  };
};

interface Props {
  title?: string;
  body?: string;
  buttonText?: string;
  buttonAction?: () => void;
  buttonColor: string;
  alignment: string;
  imageURL: string;
  altText: string;
  imageAlignment: string;
  testID: string;
  backgroundColor: string;
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
}

function BannerImageInlay({
  buttonAction,
  imageURL,
  altText,
  testID,
  backgroundColor = 'black',
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
  imageURLField
}: Props): React.JSX.Element {
  const { translate } = useTranslate();

  // RED
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const dependencyValues: Record<string, any> = useWatchField([
    BANNER_TITLE_FIELD,
    BANNER_BODY_FIELD,
    BANNER_BUTTON_TEXT_FIELD,
    BANNER_BUTTON_DESTINATION_TYPE,
    BANNER_BUTTON_DESTINATION_URL,
    VIDEO_CENTER_PAGE,
    IMAGE_ALIGNMENT,
    TEXT_ALIGNMENT,
    IMAGE_FIELD,
    ALT_TEXT_FIELD,
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
    imageURLField
  ]);

  const imageUrl =
    dependencyValues[IMAGE_FIELD]?.croppedUrl ||
    dependencyValues[IMAGE_FIELD]?.url ||
    dependencyValues[IMAGE_FIELD] ||
    dependencyValues[imageURLField] ||
    dependencyValues[originalImageUrl] ||
    imageURL;
  const imageAlignment = dependencyValues[IMAGE_ALIGNMENT] || dependencyValues[imageAlignmentField] || 'right';
  const buttonText = dependencyValues[BANNER_BUTTON_TEXT_FIELD] || dependencyValues[buttonTextField];
  const title = dependencyValues[BANNER_TITLE_FIELD] || dependencyValues[titleField];
  const body = dependencyValues[BANNER_BODY_FIELD] || dependencyValues[bodyField];
  const alignment = dependencyValues[TEXT_ALIGNMENT] || dependencyValues[textAlignmentField] || 'Left';
  const altTextField = dependencyValues[ALT_TEXT_FIELD] || dependencyValues[imageAltTextField] || altText;
  const internalDestination = dependencyValues[VIDEO_CENTER_PAGE] || dependencyValues[internalTargetField];
  const externalDestination = dependencyValues[BANNER_BUTTON_DESTINATION_URL] || dependencyValues[externalTargetField];
  const optionalProps = externalDestination ? { href: externalDestination } : {};
  const hrefField =
    dependencyValues[BANNER_BUTTON_DESTINATION_TYPE] === buttonLinkDestinations.INTERNAL ||
    dependencyValues[buttonTargetType] === buttonLinkDestinations.INTERNAL
      ? internalDestination
      : externalDestination;
  const { wrapper, content, textContainer, titleStyles, bodyStyles, bannerText, bannerImage } = useStyles(
    alignment,
    backgroundColor,
    buttonColor
  );

  const imageElement = (
    <div css={bannerImage}>
      {imageUrl && <img src={imageUrl} alt={altTextField} {...injectTestId(`${testID}-image-inlay-element`)} />}
    </div>
  );

  const isDirty = useWatchDirty();
  return (
    <div css={wrapper} {...injectTestId(`${testID}-image-inlay`)}>
      {(isDirty && (title || body)) || imageUrl || (buttonText && hrefField) ? (
        <div css={content}>
          {imageAlignment.toLowerCase() === 'left' && imageUrl ? imageElement : null}
          <div css={bannerText}>
            <div css={textContainer}>
              {title && <h2 css={titleStyles}>{title}</h2>}
              {body && <p css={bodyStyles}>{body}</p>}
            </div>
            {buttonText && hrefField && (
              <Button
                element="button"
                appearance="filled"
                text={buttonText}
                onClick={buttonAction}
                size="s"
                aria-label={buttonText}
                {...optionalProps}
              />
            )}
          </div>
          {imageAlignment.toLowerCase() === 'right' ? imageElement : null}
        </div>
      ) : (
        <div css={content}>
          {imageAlignment === 'left' ? imageElement : null}
          <div css={bannerText}>
            <div css={textContainer}>
              <h2 css={titleStyles}>{translate('Banners-Form-BannerPreview-Title')}</h2>
              <p css={bodyStyles}>{translate('Banners-Form-BannerPreview-Body')}</p>
            </div>
            {hrefField && (
              <Button
                element="button"
                appearance="filled"
                text={translate('Banners-Form-BannerPreview-Button')}
                onClick={buttonAction}
                size="s"
                aria-label={translate('Banners-Form-BannerPreview-Button')}
                {...optionalProps}
              />
            )}
          </div>
          {imageAlignment === 'right' ? imageElement : null}
        </div>
      )}
    </div>
  );
}

export default BannerImageInlay;

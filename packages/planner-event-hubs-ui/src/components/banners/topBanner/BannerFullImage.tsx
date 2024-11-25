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
  IMAGE_ALIGNMENT,
  FONT_COLOR,
  TEXT_ALIGNMENT,
  IMAGE_FIELD,
  ALT_TEXT_FIELD,
  VIDEO_CENTER_PAGE,
  BANNER_BUTTON_DESTINATION_URL,
  buttonLinkDestinations
} from '../BannerConstants';

const useStyles = (alignment, imageURL, fontColor): Record<string, CSSObject> => {
  const { m, l, widthWindow } = useBreakpoints();
  const { font, backgroundColor } = useTheme();

  // determine content alignment
  let contentAlignment = 'flex-start';
  if (alignment === 'Right') contentAlignment = 'flex-end';
  if (alignment === 'Center') contentAlignment = 'center';

  // determine font color based on contrast
  const bgColor = backgroundColor.neutral.surface;
  let btnColor;
  let btnBgColor;
  if (fontColor === '#ffffff') {
    btnColor = '#000000';
    btnBgColor = '#FFFFFF';
  } else {
    btnColor = '#FFFFFF';
    btnBgColor = '#000000';
  }

  const mediaIsLorXL = `@media (min-width: ${l}px)`;

  return {
    wrapperContainer: {
      height: widthWindow > l ? 500 : 300,
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      backgroundColor: bgColor,
      backgroundImage: `url(${imageURL})`,
      backgroundSize: 'cover',
      fontWeight: font.base.weight.regular
    },
    wrapper: {
      fontFamily: font.base.family,
      height: widthWindow > l ? 500 : 300,
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      backgroundImage: `url(${imageURL})`,
      backgroundSize: 'contain',
      backgroundPosition: 'center center',
      fontWeight: font.base.weight.regular,
      backgroundRepeat: 'no-repeat',
      backdropFilter: 'blur(16px)',
      filter: 'blur(0px)'
    },
    content: {
      display: 'flex',
      maxWidth: widthWindow > l ? 1464 : 960,
      width: '100%',
      height: '100%',
      alignItems: 'center',
      justifyContent: contentAlignment,
      boxSizing: 'border-box',
      padding: widthWindow < m ? 30 : '20px 80px',
      gap: '24px'
    },
    textContainer: {
      maxHeight: widthWindow > l ? 400 : 200,
      overflow: 'hidden',
      width: '100%'
    },
    titleStyles: {
      width: '100%',
      fontSize: font.base.size[6],
      margin: 0,
      textAlign: alignment,
      fontWeight: font.base.weight.bold,
      color: fontColor,
      [mediaIsLorXL]: { fontSize: font.base.size[8] }
    },
    bodyStyles: {
      fontSize: font.base.size[3],
      width: '100%',
      padding: '20px 0',
      margin: 0,
      textAlign: alignment,
      color: fontColor,
      [mediaIsLorXL]: { fontSize: font.base.size[5] }
    },
    bannerText: {
      display: 'flex',
      flexWrap: 'wrap',
      width: widthWindow > l ? '55%' : '100%',
      justifyContent: contentAlignment,
      background: fontColor === '#ffffff' ? 'rgba(0,0,0,.5)' : 'rgba(255,255,255,0.62)',
      padding: 24,
      boxSizing: 'border-box',
      backdropFilter: 'blur(8px)',
      button: {
        backgroundColor: btnBgColor,
        borderColor: btnBgColor,
        color: btnColor,
        '&:hover': {
          backgroundColor: btnBgColor,
          borderColor: btnBgColor
        }
      }
    },
    backgroundAltText: {
      width: 0,
      height: 0
    }
  };
};

interface Props {
  title?: string;
  body?: string;
  buttonText?: string;
  buttonAction?: () => void;
  alignment: string;
  imageURL: string;
  altText: string;
  testID: string;
  fontColor: string;
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

function BannerFullImage({
  buttonAction,
  imageURL,
  altText,
  testID,
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
}: Props): JSX.Element {
  // RED
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const dependencyValues: Record<string, any> = useWatchField([
    BANNER_TITLE_FIELD,
    BANNER_BODY_FIELD,
    BANNER_BUTTON_TEXT_FIELD,
    BANNER_BUTTON_DESTINATION_TYPE,
    IMAGE_ALIGNMENT,
    TEXT_ALIGNMENT,
    FONT_COLOR,
    IMAGE_FIELD,
    ALT_TEXT_FIELD,
    VIDEO_CENTER_PAGE,
    BANNER_BUTTON_DESTINATION_URL,
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
  ]);
  const isDirty = useWatchDirty();

  const imageUrl =
    dependencyValues[IMAGE_FIELD]?.croppedUrl ||
    dependencyValues[IMAGE_FIELD]?.url ||
    dependencyValues[IMAGE_FIELD] ||
    dependencyValues[imageURLField] ||
    dependencyValues[originalImageUrl] ||
    imageURL;
  const alignment = dependencyValues[TEXT_ALIGNMENT] || dependencyValues[textAlignmentField] || 'Right';
  const buttonText = dependencyValues[BANNER_BUTTON_TEXT_FIELD] || dependencyValues[buttonTextField];
  const title = dependencyValues[BANNER_TITLE_FIELD] || dependencyValues[titleField];
  const body = dependencyValues[BANNER_BODY_FIELD] || dependencyValues[bodyField];
  const fontColor = dependencyValues[FONT_COLOR] || dependencyValues[textColor] || '#ffffff';
  const altTextField = dependencyValues[ALT_TEXT_FIELD] || dependencyValues[imageAltTextField] || altText;
  const internalDestination = dependencyValues[VIDEO_CENTER_PAGE] || dependencyValues[internalTargetField];
  const externalDestination = dependencyValues[BANNER_BUTTON_DESTINATION_URL] || dependencyValues[externalTargetField];
  const optionalProps = externalDestination ? { href: externalDestination } : {};
  const hrefField =
    dependencyValues[BANNER_BUTTON_DESTINATION_TYPE] === buttonLinkDestinations.INTERNAL ||
    dependencyValues[buttonTargetType] === buttonLinkDestinations.INTERNAL
      ? internalDestination
      : externalDestination;

  const { wrapperContainer, wrapper, content, textContainer, titleStyles, bodyStyles, bannerText, backgroundAltText } =
    useStyles(alignment, imageUrl, fontColor?.toLowerCase());

  const { translate } = useTranslate();

  return (
    <div css={wrapperContainer} {...injectTestId(`${testID}-full-image`)}>
      {altTextField && <span css={backgroundAltText} role="img" aria-label={altTextField} />}
      {(isDirty && (title || body)) || buttonText || imageUrl || (buttonText && hrefField) ? (
        <div css={wrapper}>
          {(title || body || (buttonText && hrefField)) && (
            <div css={content} {...injectTestId(`${testID}-full-image-content`)}>
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
            </div>
          )}
        </div>
      ) : (
        <div css={content} {...injectTestId(`${testID}-full-image-content`)}>
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
        </div>
      )}
    </div>
  );
}

export default BannerFullImage;

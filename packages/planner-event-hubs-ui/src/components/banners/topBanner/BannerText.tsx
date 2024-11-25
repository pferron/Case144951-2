import React from 'react';
import { injectTestId } from '@cvent/nucleus-test-automation';
import { useBreakpoints } from '@cvent/carina/components/Breakpoints';
import { useTheme } from '@cvent/carina/components/ThemeProvider/useTheme';
import { Button } from '@cvent/carina/components/Button';
import { CSSObject } from '@emotion/react';
import { useWatchDirty, useWatchField } from '@cvent/carina/components/Forms';
import { useTranslate } from 'nucleus-text';
import {
  BANNER_TITLE_FIELD,
  BANNER_BODY_FIELD,
  BANNER_BUTTON_TEXT_FIELD,
  BANNER_BUTTON_DESTINATION_TYPE,
  TEXT_ALIGNMENT,
  BANNER_BUTTON_DESTINATION_URL,
  VIDEO_CENTER_PAGE,
  buttonLinkDestinations
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
      flexWrap: 'wrap',
      maxWidth: widthWindow > l ? 860 : 820,
      height: '100%',
      alignContent: 'center',
      justifyContent: contentAlignment,
      boxSizing: 'border-box',
      padding: widthWindow < m ? '20px 54px' : '20px 80px',
      width: '100%',
      button: {
        backgroundColor: btnColor,
        borderColor: btnColor,
        '&:hover': {
          backgroundColor: btnColor,
          borderColor: btnColor
        }
      }
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
    }
  };
};

interface Props {
  title?: string;
  body?: string;
  buttonText?: string;
  buttonAction?: () => void;
  buttonHref?: string;
  buttonColor: string;
  alignment: string;
  testID: string;
  backgroundColor: string;
  titleField?: string;
  bodyField?: string;
  buttonTextField?: string;
  internalTargetField?: string;
  externalTargetField?: string;
  textAlignmentField?: string;
  buttonTargetType?: string;
}
function BannerText({
  buttonAction,
  testID,
  backgroundColor = 'black',
  buttonColor,
  titleField,
  bodyField,
  buttonTextField,
  internalTargetField,
  externalTargetField,
  textAlignmentField,
  buttonTargetType
}: Props): JSX.Element {
  const { translate } = useTranslate();

  // RED
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const dependencyValues: Record<string, any> = useWatchField([
    BANNER_TITLE_FIELD,
    BANNER_BODY_FIELD,
    BANNER_BUTTON_TEXT_FIELD,
    BANNER_BUTTON_DESTINATION_TYPE,
    TEXT_ALIGNMENT,
    BANNER_BUTTON_DESTINATION_URL,
    VIDEO_CENTER_PAGE,
    titleField,
    bodyField,
    buttonTextField,
    internalTargetField,
    externalTargetField,
    textAlignmentField,
    buttonTargetType
  ]);
  const isDirty = useWatchDirty();
  const title = dependencyValues[BANNER_TITLE_FIELD] || dependencyValues[titleField];
  const body = dependencyValues[BANNER_BODY_FIELD] || dependencyValues[bodyField];
  const buttonText = dependencyValues[BANNER_BUTTON_TEXT_FIELD] || dependencyValues[buttonTextField];
  const alignment = dependencyValues[TEXT_ALIGNMENT] || dependencyValues[textAlignmentField] || 'left';
  const { wrapper, content, textContainer, titleStyles, bodyStyles } = useStyles(
    alignment,
    backgroundColor,
    buttonColor
  );
  const internalDestination = dependencyValues[VIDEO_CENTER_PAGE] || dependencyValues[internalTargetField];
  const externalDestination = dependencyValues[BANNER_BUTTON_DESTINATION_URL] || dependencyValues[externalTargetField];
  const optionalProps = externalDestination ? { href: externalDestination } : {};
  const hrefField =
    dependencyValues[BANNER_BUTTON_DESTINATION_TYPE] === buttonLinkDestinations.INTERNAL ||
    dependencyValues[buttonTargetType] === buttonLinkDestinations.INTERNAL
      ? internalDestination
      : externalDestination;

  return (
    <div css={wrapper} {...injectTestId(`${testID}-text`)}>
      {(isDirty && (title || body)) || (buttonText && hrefField) ? (
        <div css={content}>
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
              accessibilityLabel={buttonText}
              {...optionalProps}
            />
          )}
        </div>
      ) : (
        <div css={content}>
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
              {...optionalProps}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default BannerText;

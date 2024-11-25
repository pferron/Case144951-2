import React, { useRef } from 'react';
import { useTheme } from '@cvent/carina/components/ThemeProvider/useTheme';
import { Col } from '@cvent/carina/components/Col';
import { Row } from '@cvent/carina/components/Row';
import { BannerStyles } from '@components/videoCenters/style';
import { useField } from '@cvent/carina/components/Forms';
import { useStyle } from '@hooks/useStyle';
import { CardContainerStyles } from '@components/common/style';
import { AlignObjectsCenterIcon, AlignObjectsLeftIcon, AlignObjectsRightIcon } from '@cvent/carina/components/Icon';
import { useTranslate } from 'nucleus-text';
import { TEXT_ALIGNMENT, FONT_COLOR, ALIGN_LEFT, ALIGN_RIGHT, ALIGN_CENTER, IMAGE_ALIGNMENT } from '../BannerConstants';
import { VisualSelectorRadio } from './VisualSelectorRadio';

type BannerStylingProps = {
  showFontColorSection: boolean;
  showImageAlignmentSection: boolean;
  readOnly: boolean;
};

function BannerStyling({ showFontColorSection, showImageAlignmentSection, readOnly }: BannerStylingProps): JSX.Element {
  const { translate } = useTranslate();
  const { borderLine } = useStyle(BannerStyles);
  const { cardTitle, cardText } = useStyle(CardContainerStyles);

  const ref = useRef(null);

  const { fieldValue: textAlignment, setFieldValue: setTextAlignment } = useField({
    name: TEXT_ALIGNMENT
  });

  const { fieldValue: imageAlignment, setFieldValue: setImageAlignment } = useField({
    name: IMAGE_ALIGNMENT
  });

  const { fieldValue: fontColor, setFieldValue: setFontColor } = useField({
    name: FONT_COLOR
  });

  const theme = useTheme();

  const alignIcons = {
    [ALIGN_LEFT]: <AlignObjectsLeftIcon size="l" color={theme.font.color.soft} />,
    [ALIGN_CENTER]: <AlignObjectsCenterIcon size="l" color={theme.font.color.soft} />,
    [ALIGN_RIGHT]: <AlignObjectsRightIcon size="l" color={theme.font.color.soft} />
  };
  const textAlignments = [
    {
      content: alignIcons[ALIGN_LEFT],
      label: translate('Banners-Text-Alignment-Left-Label'),
      value: ALIGN_LEFT
    },
    {
      content: alignIcons[ALIGN_CENTER],
      label: translate('Banners-Text-Alignment-Center-Label'),
      value: ALIGN_CENTER
    },
    {
      content: alignIcons[ALIGN_RIGHT],
      label: translate('Banners-Text-Alignment-Right-Label'),
      value: ALIGN_RIGHT
    }
  ];

  const alignmentVal = () => textAlignment || 'Left';

  const textAlignmentsReadOnly = [
    {
      content: alignIcons[String(textAlignment)],
      label: translate(`Banners-Text-Alignment-${alignmentVal()}-Label`),
      value: `${textAlignment}`
    }
  ];

  // Image Alignment
  const imageAlignments = [
    {
      content: alignIcons[ALIGN_LEFT],
      label: translate('Banners-Image-Alignment-Left-Label'),
      value: ALIGN_LEFT
    },
    {
      content: alignIcons[ALIGN_RIGHT],
      label: translate('Banners-Image-Alignment-Right-Label'),
      value: ALIGN_RIGHT
    }
  ];

  const imageAlignmentVal = () => imageAlignment || 'Right';

  const imageAlignmentsReadOnly = [
    {
      content: alignIcons[String(imageAlignment)],
      label: translate(`Banners-Image-Alignment-${imageAlignmentVal()}-Label`),
      value: `${imageAlignment}`
    }
  ];

  const fontColors = [
    {
      styledContent: {
        backgroundColor: theme.backgroundColor.base,
        border: `solid ${theme.borderColor.soft}`,
        borderWidth: theme.size.border.base
      },
      label: translate('Banners-Font-Color-White-Label'),
      value: '#ffffff'
    },
    {
      styledContent: { backgroundColor: theme.backgroundColor.neutral.surface },
      label: translate('Banners-Font-Color-Black-Label'),
      value: '#000000'
    }
  ];

  const fontColorName = () => {
    if (fontColor === '#000000') {
      return translate('Banners-Font-Color-Black-Label');
    }
    return translate('Banners-Font-Color-White-Label');
  };

  const fontColorsReadOnly = [
    {
      styledContent: {
        backgroundColor: fontColor,
        border: `solid ${theme.borderColor.soft}`,
        borderWidth: theme.size.border.base
      },
      label: translate(`Banners-Font-Color-${fontColorName()}-Label`),
      value: String(fontColor)
    }
  ];

  return (
    <>
      <div>
        <h3 css={cardTitle} ref={ref}>
          {translate('Banners-Styling-Section-Title')}
        </h3>
        <p css={cardText} className="paragraphMarginOverride">
          {showFontColorSection
            ? translate('Banners-Styling-Section-Description')
            : translate('Banners-Styling-Section-Description-TextOnly')}
        </p>
      </div>
      <Row>
        <Col padding={0}>
          {showImageAlignmentSection && (
            <div css={borderLine}>
              <h4>{translate('Banners-Styling-Image-Alignment-Heading')}</h4>
              <VisualSelectorRadio
                readOnly={readOnly}
                itemContents={readOnly ? imageAlignmentsReadOnly : imageAlignments}
                onUpdateSelection={setImageAlignment}
                currentSelectionValue={imageAlignment as string}
                testID="banner-styling-image-alignment"
                name="banner-styling-image-alignment"
              />
            </div>
          )}
        </Col>
      </Row>
      <Row>
        <Col padding={0}>
          <div css={borderLine}>
            <h4>{translate('Banners-Styling-Text-Alignment-Heading')}</h4>
            <VisualSelectorRadio
              readOnly={readOnly}
              itemContents={readOnly ? textAlignmentsReadOnly : textAlignments}
              onUpdateSelection={setTextAlignment}
              currentSelectionValue={textAlignment as string}
              testID="banner-styling-text-alignment"
              name="banner-styling-text-alignment"
            />
          </div>
        </Col>
      </Row>
      <Row>
        <Col padding={0}>
          {showFontColorSection && (
            <div css={borderLine}>
              <h4>{translate('Banners-Styling-Font-Color-Heading')}</h4>
              <VisualSelectorRadio
                readOnly={readOnly}
                itemContents={readOnly ? fontColorsReadOnly : fontColors}
                onUpdateSelection={setFontColor}
                currentSelectionValue={fontColor as string}
                testID="banner-styling-font-color"
                name="banner-styling-font-color"
              />
            </div>
          )}
        </Col>
      </Row>
    </>
  );
}

export default BannerStyling;

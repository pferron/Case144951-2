import React from 'react';
import { Row } from '@cvent/carina/components/Row';
import { Col } from '@cvent/carina/components/Col';
import { useMoodsStyles } from '@components/videoCenters/branding/styles';
import { Dropdown } from '@cvent/carina/components/Dropdown';
import { ThemeWithBlockStack } from '@cvent/blocks/utils/types';
import useTheme from '@cvent/blocks/hooks/useTheme';
import { CustomFont } from '@cvent/planner-event-hubs-model/types';
import { InfoCirclePopper } from '@components/shared/InfoCirclePopper';
import { useTranslate } from 'nucleus-text';
import { DEFAULT_FONT_ID } from './constants';

interface FontDropDownProps {
  theme: ThemeWithBlockStack;
  labelText: string;
}

function FontDropDownLabel({ theme, labelText }: FontDropDownProps): JSX.Element {
  return <div style={{ fontWeight: theme.font.base.weight.bold }}>{labelText}</div>;
}

interface Props {
  customFonts: Array<CustomFont>;
  headingsFont: string;
  setHeadingsFont: (CustomFont) => void;
  bodyTextFont: string;
  setBodyTextFont: (CustomFont) => void;
}

function FontsSection({
  customFonts,
  headingsFont,
  setHeadingsFont,
  bodyTextFont,
  setBodyTextFont
}: Props): JSX.Element {
  const { subtitle, subtext } = useMoodsStyles();
  const theme = useTheme();
  const { translate: t } = useTranslate();

  const defaultFontDropdownOptions = [
    {
      label: <FontDropDownLabel theme={theme} labelText={t('events_plus_custom_font_standard_dropdown_header')} />,
      value: 'heading-2',
      heading: true
    },
    {
      label: t('events_plus_custom_font_default_font_helvetica'),
      value: DEFAULT_FONT_ID
    }
  ];

  const customFontDropdownOptions = [
    {
      label: <FontDropDownLabel theme={theme} labelText={t('events_plus_custom_font_custom_dropdown_header')} />,
      value: 'heading-1',
      heading: true
    }
  ];

  const options = customFonts?.length
    ? []
        .concat(customFontDropdownOptions)
        .concat(
          customFonts
            ?.sort((a, b) => a.fontFamily.localeCompare(b.fontFamily))
            .map(customFont => ({
              label: customFont.fontFamily,
              value: customFont.id
            }))
        )
        .concat(defaultFontDropdownOptions)
    : defaultFontDropdownOptions;

  return (
    <Row margin={0}>
      <Col padding={0}>
        <div style={{ display: 'flex', flexDirection: 'row', columnGap: '0.25rem', alignItems: 'center' }}>
          <h4 css={subtitle}>{t('events_plus_custom_font_title')}</h4>
          <div style={{ marginBottom: '0.75rem', marginTop: '1.75rem', marginLeft: '0.5rem' }}>
            <InfoCirclePopper
              testID="custom-font"
              maxWidth="13.938rem"
              infoText={t('events_plus_custom_font_info_text')}
            />
          </div>
        </div>
        <div css={subtext}>{t('events_plus_custom_font_description')}</div>
        <Row margin={{ top: 12 }}>
          <Dropdown
            accessibilityLabel={t('events_plus_custom_font_headings_dropdown_accessibility_label')}
            id="headings-font-dropdown"
            testID="headings-font-dropdown"
            labelText={t('events_plus_custom_font_headings_dropdown_label')}
            onUpdate={value => setHeadingsFont(value)}
            selected={headingsFont}
            options={options}
            portal
            maxHeight={152}
          />
        </Row>
        <Row margin={{ top: 12 }}>
          <Dropdown
            accessibilityLabel={t('events_plus_custom_font_body_text_dropdown_accessibility_label')}
            id="body-text-font-dropdown"
            testID="body-font-dropdown"
            labelText={t('events_plus_custom_font_body_text_dropdown_label')}
            onUpdate={value => setBodyTextFont(value)}
            selected={bodyTextFont}
            options={options}
            portal
            maxHeight={152}
          />
        </Row>
      </Col>
    </Row>
  );
}

export default FontsSection;

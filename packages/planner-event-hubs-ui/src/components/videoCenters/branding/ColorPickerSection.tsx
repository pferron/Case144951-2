import React from 'react';
import { Col } from '@cvent/carina/components/Col';
import { Row } from '@cvent/carina/components/Row';
import { useTranslate } from 'nucleus-text';
import InfoIcon from '@cvent/carina/components/Icon/Info';
import ColorBox from '@cvent/blocks-preview/components/ColorBox';
import { injectTestId } from '@cvent/nucleus-test-automation';
import hasColorWarning from '@cvent/blocks/utils/hasColorWarning';
import { Theme } from '@cvent/planner-event-hubs-model/types';
import ColorSwapIcon from '@cvent/blocks-preview/components/ColorBox/SwapIcon';
import { useColorPickerStyles } from './styles';
import { getActiveMoodAndBgColors } from './utils';

type ColorPickerSectionProps = {
  themeState: Theme;
  moodTheme: string;
  isBgOverridden: boolean;
  setThemeState?: (arg: Theme) => void;
};

function ColorPickerSection({
  themeState,
  isBgOverridden,
  setThemeState,
  moodTheme
}: ColorPickerSectionProps): JSX.Element {
  const { translate } = useTranslate();
  const { mainColor: primaryColor, actionColor: secondaryColor, backgroundColor, safeMode, moodColor } = themeState;

  const showContrastWarning =
    !safeMode &&
    hasColorWarning({
      primary: primaryColor,
      secondary: secondaryColor,
      background: backgroundColor,
      mood: moodColor
    });

  const onPrimaryChange = (newPrimaryColor: string): void => {
    const { moodColor: mdColor, backgroundColor: bgColor } = getActiveMoodAndBgColors({
      safeMode,
      primaryColor: newPrimaryColor,
      moodTheme
    });

    setThemeState({
      ...themeState,
      mainColor: newPrimaryColor,
      moodColor: mdColor,
      backgroundColor: isBgOverridden ? backgroundColor : bgColor
    });
  };

  const toggleColors = (): void => {
    const selectedPrimary = primaryColor;
    const selectedSecondary = secondaryColor;
    const { moodColor: mdColor, backgroundColor: bgColor } = getActiveMoodAndBgColors({
      primaryColor: selectedSecondary,
      safeMode,
      moodTheme
    });

    setThemeState({
      ...themeState,
      mainColor: selectedSecondary,
      actionColor: selectedPrimary,
      moodColor: mdColor,
      backgroundColor: isBgOverridden ? backgroundColor : bgColor
    });
  };

  const { container, contrastWarning, constrastWarningText, subtitle, subtext, colorBoxStyle, swapIcon } =
    useColorPickerStyles();

  return (
    <div {...injectTestId('branding-theming-color-picker')}>
      <Row margin={0}>
        <Col padding={0}>
          <h4 css={subtitle}>{translate('video_hub_theming_select_color_title')}</h4>
          <div css={subtext}>{translate('video_hub_theming_select_color_subtitle')}</div>
        </Col>
      </Row>
      <div css={container}>
        <ColorBox
          color={primaryColor}
          colorLabel={translate('video_hub_preview_color_change_accessibility_label', {
            type: 'primary',
            color: primaryColor
          })}
          pickerLabel={translate('video_hub_preview_color_change_accessibility_label', {
            type: 'primary',
            color: primaryColor
          })}
          hoverText={translate('video_hub_preview_change_color')}
          onChange={onPrimaryChange}
          title={translate('video_hub_preview_color_title_primary')}
          testID="mood-theme-primary-color"
          css={colorBoxStyle}
        />
        <div css={swapIcon}>
          <ColorSwapIcon
            onClick={toggleColors}
            accessibilityLabel={translate('video_hub_preview_swap_colors_accessibility_label')}
          />
        </div>
        <ColorBox
          color={secondaryColor}
          colorLabel={translate('video_hub_preview_color_change_accessibility_label', {
            type: 'secondary',
            color: secondaryColor
          })}
          pickerLabel={translate('video_hub_preview_color_change_accessibility_label', {
            type: 'secondary',
            color: secondaryColor
          })}
          hoverText={translate('video_hub_preview_change_color')}
          onChange={color => setThemeState({ ...themeState, actionColor: color })}
          title={translate('video_hub_preview_color_title_secondary')}
          testID="mood-theme-secondary-color"
          css={colorBoxStyle}
        />
      </div>
      {showContrastWarning ? (
        <div css={contrastWarning}>
          <InfoIcon size="xl" />
          <div css={constrastWarningText}>{translate('video_hub_colorPicker_modal_contrast_warning')}</div>
        </div>
      ) : null}
    </div>
  );
}

export default ColorPickerSection;

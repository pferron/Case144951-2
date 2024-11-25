import React, { useState } from 'react';
import { injectTestId } from '@cvent/nucleus-test-automation';
import ColorPicker from '@cvent/carina/components/ColorPicker';
import Button from '@cvent/carina/components/Button';
import { useTranslate } from 'nucleus-text';
import { Flyout } from '@cvent/carina/components/Flyout';
import { Col } from '@cvent/carina/components/Col';
import { Row } from '@cvent/carina/components/Row';
import { Theme } from '@cvent/planner-event-hubs-model/types';
import { useMoodThemeModalStyles } from './styles';

type AdvancedSettingsProp = {
  bgColor: string;
  isBgColorOverridden: boolean;
  onBgColorChange: (color: string) => void;
  restoreDefault: () => void;
  setThemeState?: (arg: Theme) => void;
  themeState: Theme;
};

type ColorPickerFlyoutProps = {
  color: string;
  setColor: (color) => void;
  onChangeComplete: (color) => void;
  children: JSX.Element;
};

function ColorPickerFlyout({ color, setColor, onChangeComplete, children }: ColorPickerFlyoutProps): JSX.Element {
  return (
    <Flyout
      content={<ColorPicker onChange={setColor} color={color} disableAlpha onChangeComplete={onChangeComplete} />}
      noPadding
      trigger={children}
      placement="end-top"
    />
  );
}

function AdvancedSettings({
  bgColor,
  onBgColorChange,
  themeState,
  isBgColorOverridden,
  restoreDefault,
  setThemeState
}: AdvancedSettingsProp): JSX.Element {
  const {
    checkboxTitle,
    checkboxInput,
    checkboxSubtitle,
    safeModeSection,
    buttonsContainer,
    backgroundSettings,
    backgroundColorBox,
    backgroundTitle,
    backgroundSubTitle,
    subtitle
  } = useMoodThemeModalStyles(bgColor);
  const { translate } = useTranslate();

  const [color, setColor] = useState(bgColor);

  const onChangeComplete = (changedColor): void => {
    onBgColorChange(changedColor.hex);
  };

  const onSafeModeChange = event => {
    setThemeState({
      ...themeState,
      safeMode: event?.target?.checked
    });
  };

  return (
    <div {...injectTestId('branding-theming-advanced-setting')}>
      <Row margin={0}>
        <Col padding={0}>
          <h4 css={subtitle}>{translate('video_hub_branding_page_advanced_settings')}</h4>
        </Col>
      </Row>
      <Row>
        <Col css={{ width: '100%' }} padding={0}>
          <div css={safeModeSection}>
            <label css={checkboxTitle} htmlFor="safeMode">
              <input
                type="checkbox"
                name="safeMode"
                id="safeMode"
                onChange={onSafeModeChange}
                checked={themeState?.safeMode}
                {...injectTestId('safe-mode-preview')}
                css={checkboxInput}
              />
              {translate('video_hub_branding_safe_mode_title')}
            </label>
            <div css={checkboxSubtitle}>{translate('video_hub_branding_safe_mode_description')}</div>
          </div>
        </Col>
        <Col css={{ width: '100%' }} padding={0}>
          <div css={backgroundSettings}>
            <ColorPickerFlyout color={color} setColor={setColor} onChangeComplete={onChangeComplete}>
              <div
                css={backgroundColorBox}
                aria-label={translate('video_hub_branding_background_change_accessibility_label')}
                tabIndex={0}
                role="button"
              />
            </ColorPickerFlyout>
            <div>
              <div css={backgroundTitle}>{translate('video_hub_branding_override_background')}</div>
              <div css={backgroundSubTitle}>{translate('video_hub_branding_override_background_description')}</div>
            </div>
          </div>
          <div css={buttonsContainer}>
            <ColorPickerFlyout color={color} setColor={setColor} onChangeComplete={onChangeComplete}>
              <Button
                text={translate('video_hub_branding_change_background')}
                appearance="ghost"
                size="s"
                accessibilityLabel={translate('video_hub_branding_background_change_accessibility_label')}
              />
            </ColorPickerFlyout>

            {isBgColorOverridden ? (
              <Button
                text={translate('video_hub_branding_restore_default')}
                appearance="ghost"
                size="s"
                onClick={restoreDefault}
                accessibilityLabel={translate('video_hub_branding_background_restore_accessibility_label')}
              />
            ) : null}
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default AdvancedSettings;

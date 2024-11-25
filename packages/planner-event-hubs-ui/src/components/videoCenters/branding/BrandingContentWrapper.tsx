import React, { useState } from 'react';
import { Col } from '@cvent/carina/components/Col';
import { Row } from '@cvent/carina/components/Row';
import CardContainer from '@components/common/CardContainer';
import { useTranslate } from 'nucleus-text';
import { CustomFont, Theme } from '@cvent/planner-event-hubs-model/types';
import Button from '@cvent/carina/components/Button';
import Preview from '@cvent/blocks-preview/components/Preview';
import ColorPickerSection from './ColorPickerSection';
import { isBackgroundColorOverridden, getActiveMoodAndBgColors, getMoodText } from './utils';
import MoodsSection from './MoodsSection';
import AdvancedSettings from './AdvancedSettings';
import { useBrandContentStyles } from './styles';
import ThemeChangePreview from './preview';
import FontsSection from './FontsSection';

export interface ColorsProps {
  themeState: Theme;
  setThemeState: (args: Theme) => void;
  onSaveTheme: () => void;
  isThemeUpdated: boolean;
  customFonts: Array<CustomFont>;
}

function BrandingContentWrapper({ themeState, setThemeState, onSaveTheme, isThemeUpdated, customFonts }: ColorsProps) {
  const { translate } = useTranslate();
  const { mainColor: primaryColor, actionColor: secondaryColor, backgroundColor, moodColor, safeMode } = themeState;
  const { headerContainer, title } = useBrandContentStyles();
  const moodText = getMoodText(moodColor);
  const [moodTheme, setMoodTheme] = useState(moodText);

  const setHeadingsFont = (fontValue: string) => {
    setThemeState({
      ...themeState,
      headingsFont: fontValue
    });
  };
  const setBodyTextFont = (fontValue: string) => {
    setThemeState({
      ...themeState,
      bodyFont: fontValue
    });
  };
  const isBgOverridden = isBackgroundColorOverridden({
    bgColor: backgroundColor,
    primaryColor,
    safeMode,
    moodTheme
  });

  const onBgColorChange = (hexCode: string): void => {
    setThemeState({
      ...themeState,
      backgroundColor: hexCode
    });
  };

  const restoreDefaultBgColor = (): void => {
    const { moodColor: mdColor, backgroundColor: bgColor } = getActiveMoodAndBgColors({
      primaryColor: themeState?.mainColor,
      safeMode: themeState?.safeMode,
      moodTheme
    });

    setThemeState({
      ...themeState,
      backgroundColor: bgColor,
      moodColor: mdColor
    });
  };

  return (
    <CardContainer testID="block-theming-selection">
      <Row margin={0}>
        <Col css={headerContainer}>
          <h3 css={title}>{translate('video_hub_branding_page_section_title')}</h3>
          <Button
            text={translate('video_hub_branding_page_save_changes')}
            appearance="filled"
            size="s"
            disabled={!isThemeUpdated}
            onClick={onSaveTheme}
            testID="save-theme-button"
          />
        </Col>
      </Row>
      <Row margin={0}>
        <Col {...{ l: { width: 4 / 12 } }}>
          <ColorPickerSection
            themeState={themeState}
            moodTheme={moodTheme}
            isBgOverridden={isBgOverridden}
            setThemeState={setThemeState}
          />
          <MoodsSection
            themeState={themeState}
            moodTheme={moodTheme}
            isBgOverridden={isBgOverridden}
            setThemeState={setThemeState}
            setMoodTheme={setMoodTheme}
          />
          {customFonts && (
            <FontsSection
              customFonts={customFonts}
              headingsFont={themeState?.headingsFont}
              setHeadingsFont={setHeadingsFont}
              bodyTextFont={themeState?.bodyFont}
              setBodyTextFont={setBodyTextFont}
            />
          )}
          <AdvancedSettings
            themeState={themeState}
            bgColor={themeState?.backgroundColor}
            isBgColorOverridden={isBgOverridden}
            onBgColorChange={onBgColorChange}
            restoreDefault={restoreDefaultBgColor}
            setThemeState={setThemeState}
          />
        </Col>
        <Col css={{ height: 'fit-content' }} {...{ l: { width: 8 / 12 } }}>
          <Preview css={{ background: backgroundColor }}>
            <ThemeChangePreview
              primary={primaryColor}
              secondary={secondaryColor}
              background={backgroundColor}
              mood={moodColor}
              safeMode={safeMode}
              headingsFont={customFonts?.find(customFont => customFont.id === themeState.headingsFont)}
              bodyTextFont={customFonts?.find(customFont => customFont.id === themeState.bodyFont)}
              testID="theme-change-preview"
            />
          </Preview>
        </Col>
      </Row>
    </CardContainer>
  );
}

export default BrandingContentWrapper;

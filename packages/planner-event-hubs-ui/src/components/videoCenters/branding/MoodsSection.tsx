import React from 'react';
import { Col } from '@cvent/carina/components/Col';
import { Row } from '@cvent/carina/components/Row';
import { useTranslate } from 'nucleus-text';
import { injectTestId } from '@cvent/nucleus-test-automation';
import { Theme } from '@cvent/planner-event-hubs-model/types';
import Tile from '@cvent/carina/components/Tile/Tile';
import { THEME_MOODS } from './constants';
import { getActiveMoodAndBgColors } from './utils';
import { useMoodsStyles } from './styles';

type MoodsSectionProps = {
  themeState: Theme;
  moodTheme: string;
  isBgOverridden: boolean;
  setMoodTheme: (arg: string) => void;
  setThemeState: (arg) => void;
};

function MoodsSection({
  themeState,
  moodTheme,
  isBgOverridden,
  setMoodTheme,
  setThemeState
}: MoodsSectionProps): JSX.Element {
  const { mainColor: primaryColor, backgroundColor, safeMode } = themeState;

  const { subtitle, subtext } = useMoodsStyles();

  const handleMoodChange = (selectedMood: string): void => {
    setMoodTheme(selectedMood);
    const { moodColor, backgroundColor: bgColor } = getActiveMoodAndBgColors({
      primaryColor,
      safeMode,
      moodTheme: selectedMood
    });
    setThemeState({
      ...themeState,
      backgroundColor: isBgOverridden ? backgroundColor : bgColor,
      moodColor
    });
  };

  const { translate } = useTranslate();

  return (
    <div {...injectTestId('branding-theming-moods')}>
      <Row margin={0}>
        <Col padding={0}>
          <h4 css={subtitle}>{translate('video_hub_branding_page_mood_select_title')}</h4>
          <div css={subtext}>{translate('video_hub_branding_page_mood_select_description')}</div>
        </Col>
      </Row>
      <Row>
        <Col padding={0}>
          <Tile
            clickable
            onClick={() => {
              handleMoodChange(THEME_MOODS.LIGHT);
            }}
            isSelected={moodTheme === THEME_MOODS.LIGHT}
            isDisabled={moodTheme === THEME_MOODS.LIGHT}
            padding={16}
            selectable
            selectedIndicatorPlacement="top-end"
            testID="brand-mood-light"
          >
            <div css={{ marginTop: 0, fontSize: '1.25rem' }}>{translate('video_hub_branding_page_mood_light')}</div>
          </Tile>
        </Col>
        <Col css={{ paddingTop: 16 }} padding={0}>
          <Tile
            clickable
            onClick={() => {
              handleMoodChange(THEME_MOODS.NIGHT);
            }}
            isSelected={moodTheme === THEME_MOODS.NIGHT}
            isDisabled={moodTheme === THEME_MOODS.NIGHT}
            padding={16}
            selectable
            selectedIndicatorPlacement="top-end"
            testID="brand-mood-night"
          >
            <div css={{ marginTop: 0, fontSize: '1.25rem' }}>{translate('video_hub_branding_page_mood_night')}</div>
          </Tile>
        </Col>
        <Col css={{ paddingTop: 16 }} padding={0}>
          <Tile
            clickable
            onClick={() => {
              handleMoodChange(THEME_MOODS.COLOR);
            }}
            isSelected={moodTheme === THEME_MOODS.COLOR}
            isDisabled={moodTheme === THEME_MOODS.COLOR}
            padding={16}
            selectable
            selectedIndicatorPlacement="top-end"
            testID="brand-mood-color"
          >
            <div css={{ marginTop: 0, fontSize: '1.25rem' }}>{translate('video_hub_branding_page_mood_color')}</div>
          </Tile>
        </Col>
      </Row>
    </div>
  );
}

export default MoodsSection;

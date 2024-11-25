import { pickShadesFromStack } from '@cvent/blocks/formulas';
import { createColorStack } from '@cvent/carina/utils/themeBuilder';
import chroma from 'chroma-js';
import { CustomFont, AccountSnapshot, AccountVideoCenterConfig } from '@cvent/planner-event-hubs-model/types';
import { THEME_MOODS, THEME_MOOD_COLORS } from './constants';

export const getMoodText = (mood: string): string => {
  const normalizeMood = mood?.toUpperCase();
  switch (normalizeMood) {
    case THEME_MOOD_COLORS.LIGHT.MOOD:
      return THEME_MOODS.LIGHT;
    case THEME_MOOD_COLORS.NIGHT.MOOD:
      return THEME_MOODS.NIGHT;
    default:
      return THEME_MOODS.COLOR;
  }
};

export const getColorMoodThemeColors = (primaryColor: string, safeMode = false): Record<string, string> => {
  const { accent, container } = pickShadesFromStack(createColorStack(primaryColor, 'block', true)?.default, safeMode);
  return {
    accent: chroma(accent).hex().toUpperCase(),
    container: chroma(container).hex().toUpperCase()
  };
};

export const isBackgroundColorOverridden = ({
  bgColor,
  moodTheme,
  primaryColor,
  safeMode
}: {
  bgColor: string;
  moodTheme: string;
  primaryColor: string;
  safeMode: boolean;
}): boolean => {
  const { container } = pickShadesFromStack(createColorStack(primaryColor, 'block', true)?.default, safeMode);

  if (moodTheme === THEME_MOODS.LIGHT && bgColor.toUpperCase() !== THEME_MOOD_COLORS.LIGHT.BACKGROUND.toUpperCase()) {
    return true;
  }
  if (moodTheme === THEME_MOODS.NIGHT && bgColor.toUpperCase() !== THEME_MOOD_COLORS.NIGHT.BACKGROUND.toUpperCase()) {
    return true;
  }
  return moodTheme === THEME_MOODS.COLOR && bgColor.toUpperCase() !== chroma(container).hex().toUpperCase();
};

export const getActiveMoodAndBgColors = ({
  primaryColor,
  moodTheme,
  safeMode = false
}: {
  primaryColor: string;
  moodTheme: string;
  safeMode?: boolean;
}): { moodColor: string; backgroundColor: string } => {
  let moodColor = '';
  let backgroundColor = '';

  const { accent, container } = getColorMoodThemeColors(primaryColor, safeMode);
  if (moodTheme === THEME_MOODS.LIGHT) {
    moodColor = THEME_MOOD_COLORS.LIGHT.MOOD;
    backgroundColor = THEME_MOOD_COLORS.LIGHT.BACKGROUND;
  } else if (moodTheme === THEME_MOODS.NIGHT) {
    moodColor = THEME_MOOD_COLORS.NIGHT.MOOD;
    backgroundColor = THEME_MOOD_COLORS.NIGHT.BACKGROUND;
  } else {
    moodColor = accent;
    backgroundColor = container;
  }
  return {
    moodColor,
    backgroundColor
  };
};

export const getCustomFonts = (customFontAndAccountInformation: {
  accountConfig?: AccountVideoCenterConfig;
  getAccountSnapshot?: AccountSnapshot;
}): CustomFont[] => {
  const allowCustomFonts =
    customFontAndAccountInformation?.accountConfig?.AccountFeatures?.GeneralFeatures?.AllowCustomFonts;
  const activeCustomFonts = customFontAndAccountInformation?.getAccountSnapshot?.customFonts?.filter(
    (customFont: { isActive: boolean }) => customFont.isActive
  );
  return allowCustomFonts ? activeCustomFonts || [] : undefined;
};

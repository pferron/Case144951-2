import { useCallback, useEffect } from 'react';
import { themeValues, setThemeValues, ThemeValues } from '@components/ThemeValues';
import createColorStack from '@cvent/carina/utils/themeBuilder/colorStack';
import { pickShadesFromStack } from '@cvent/blocks/formulas';

type Presets = Record<string, Omit<ThemeValues, 'safeMode'>>;

declare global {
  interface Window {
    /** For debugging purposes ONLY */
    cvent?: {
      getThemeHelp?: () => void;
      getTheme?: () => ThemeValues;
      setTheme?: (values: Partial<ThemeValues>) => void;
      setThemeLightMood?: () => void;
      setThemeNightMood?: () => void;
      setThemeColorMood?: () => void;
      getThemePresets?: () => Presets;
      setThemePreset?: (presetKey: string) => void;
    };
  }
}

function getThemeHelp() {
  // eslint-disable-next-line no-console
  console.log(`
    Set theme seed colors through the console. Theme colors are set in memory and do not get saved. 
    Note: these values may get reset when navigating between pages.

    Get the current theme values:

      window.cvent.getTheme()

    Set all theme values:

      window.cvent.setTheme({ 
        primary: '#4A154B',
        secondary: '#E01E5A',
        mood: '#FFFFFF',
        background: '#F4EDE4'
      })

    Set partial theme values:

      window.cvent.setTheme({ primary: '#006AE1' }) 

    Switch current theme values to 'light' mood (keeps primary and secondary):

      window.cvent.setThemeLightMood()

    Switch current theme values to 'night' mood (keeps primary and secondary):

      window.cvent.setThemeNightMood()

    Switch current theme values to 'color' mood based on current primary color:

      window.cvent.setThemeColorMood()

    Get a list of preset themes:

      window.cvent.getThemePresets()

    Set theme values to a preset:

      window.cvent.setThemePreset('bright')
  `);
}

const presets: Presets = {
  bright: {
    primary: '#E3AFBC',
    secondary: '#EE4C7C',
    background: '#E3E2DF',
    mood: '#FFFFFF'
  },
  dark: {
    primary: '#272727',
    secondary: '#FF652F',
    background: '#000000',
    mood: '#262626'
  },
  soft: {
    primary: '#E85A4F',
    secondary: '#E98074',
    background: '#EAE7DC',
    mood: '#D8C3A5'
  }
};

/**
 * Change theme from the console for testing different color combinations.
 * See `getThemeHelp` function for more info.
 */
function ThemeSwitcher(): JSX.Element {
  const printThemeValues = (values: ThemeValues) => {
    // eslint-disable-next-line no-console
    console.log(
      `Theme Seed Values:
      primary:    [%c   %c]   ${values.primary}
      secondary:  [%c   %c]   ${values.secondary}
      background: [%c   %c]   ${values.background}
      mood:       [%c   %c]   ${values.mood}
      safeMode:           ${String(values.safeMode)}`,
      `background: ${values.primary};`,
      'background: initial;',
      `background: ${values.secondary};`,
      'background: initial;',
      `background: ${values.background};`,
      'background: initial;',
      `background: ${values.mood};`,
      'background: initial;'
    );
  };

  const getTheme = useCallback((): ThemeValues => {
    const values = themeValues();
    printThemeValues(values);
    return values;
  }, []);

  const setTheme = useCallback((values: Partial<ThemeValues>) => {
    const newThemeValues = { ...themeValues(), ...values };
    setThemeValues(newThemeValues);
    printThemeValues(newThemeValues);
  }, []);

  const setThemeLightMood = useCallback(() => {
    setTheme({
      mood: '#FFFFFF',
      background: '#F7F8F9'
    });
  }, [setTheme]);

  const setThemeNightMood = useCallback(() => {
    setTheme({
      mood: '#262626',
      background: '#000000'
    });
  }, [setTheme]);

  const setThemeColorMood = useCallback(() => {
    const values = themeValues();
    const swatches = createColorStack(values.primary, 'block', true).default;
    const primaryShades = pickShadesFromStack(swatches, values.safeMode);
    setTheme({
      mood: primaryShades.accent,
      background: primaryShades.container
    });
  }, [setTheme]);

  const getThemePresets = () => {
    // eslint-disable-next-line no-console
    console.log(`Presets: ${Object.keys(presets).join(', ')}`);
    return presets;
  };

  const setThemePreset = useCallback(
    (presetKey: string) => {
      const preset = presets[presetKey];
      if (preset) {
        setTheme(preset);
      } else {
        // eslint-disable-next-line no-console
        console.log(`Preset not found: ${presetKey}. See window.cvent.getThemePresets for valid presets.`);
      }
    },
    [setTheme]
  );

  useEffect(() => {
    window.cvent = {
      ...window.cvent,
      getTheme,
      getThemeHelp,
      setTheme,
      setThemeLightMood,
      setThemeNightMood,
      setThemeColorMood,
      getThemePresets,
      setThemePreset
    };
  }, [getTheme, setTheme, setThemeColorMood, setThemeLightMood, setThemeNightMood, setThemePreset]);

  return null;
}

export default ThemeSwitcher;

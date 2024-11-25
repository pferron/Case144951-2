import { makeVar, useReactiveVar } from '@apollo/client';

export interface ThemeValues {
  primary: string;
  secondary: string;
  background: string;
  mood: string;
  safeMode: boolean;
}

export const themeValues = makeVar<ThemeValues>({
  primary: '#182261',
  secondary: '#006AE1',
  background: '#F4F4F4',
  mood: '#FFFFFF',
  safeMode: true
});
export const useThemeValues = () => useReactiveVar(themeValues);
export const setThemeValues = (values: ThemeValues) => themeValues(values);

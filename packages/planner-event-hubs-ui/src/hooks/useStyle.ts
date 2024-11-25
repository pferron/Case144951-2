import { useTheme } from '@cvent/carina/components/ThemeProvider/useTheme';
import { Theme } from '@cvent/carina/types/theme';
import { Theme as V1Theme, useTheme as useV1Theme } from '@cvent/carina/components/ThemeProvider';
import { CSSObject } from '@emotion/react';

function useStyle(
  useBuildStyle: (theme: Theme, additionalParams?: Record<string, number | string>) => Record<string, CSSObject>,
  additionalParams: Record<string, number | string> = {}
): Record<string, CSSObject> {
  // Calling useBreakpoints in here will cause the component where useStyle is imported to render on resize. Negatively affecting performance.
  return useBuildStyle(useTheme(), additionalParams);
}

function useLibraryStyle(
  useBuildStyle: (theme: V1Theme, additionalParams?: Record<string, number | string>) => Record<string, CSSObject>,
  additionalParams: Record<string, number | string> = {}
): Record<string, CSSObject> {
  // Calling useBreakpoints in here will cause the component where useStyle is imported to render on resize. Negatively affecting performance.
  return useBuildStyle(useV1Theme(), additionalParams);
}

export { useStyle, useLibraryStyle };

import { useContext } from 'react';
import { BreakpointsContext } from '@cvent/carina/components/Breakpoints/BreakpointsProvider';

/**
 * Hook for reading up the device screen sizes and 'BreakpointsContext' data
 */
const useBreakpoints = (): Breakpoints => {
  const breakpoints = useContext(BreakpointsContext);
  return {
    ...breakpoints,
    isMobile: breakpoints.isDefaultSize || breakpoints.isS,
    isDesktop: breakpoints.isM || breakpoints.isL || breakpoints.isXL,
    isMobileOrTablet: breakpoints.isDefaultSize || breakpoints.isS || breakpoints.isM,
    /*
            Since BreakpointsProvider only supplies isS, isM, isL
            therefore isL & isXL can be true simultaneously
           */
    isXL: breakpoints.widthWindow > 1464
  };
};

export interface Breakpoints {
  s: number | string;
  m: number | string;
  l: number | string;
  xl: number | string;
  isDefaultSize?: boolean;
  isS?: boolean;
  isM?: boolean;
  isL?: boolean;
  isXL?: boolean;
  heightWindow?: number;
  widthWindow?: number;
  heightScreen?: number;
  widthScreen?: number;
  landscapeWindow?: boolean;
  portraitWindow?: boolean;
  landscapeScreen?: boolean;
  portraitScreen?: boolean;
  isMobile: boolean;
  isDesktop: boolean;
  isMobileOrTablet: boolean;
}

export default useBreakpoints;

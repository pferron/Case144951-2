import React from 'react';
import { BreakpointsContext } from '@cvent/carina/components/Breakpoints/BreakpointsProvider';

const defaultBreakpoints = { s: 336, m: 560, l: 1080, xl: 1464 };

export function BreakpointMocker({
  children,
  isS = false,
  isDefaultSize = false,
  isM = false,
  isL = false,
  isXL = false
}: Props): JSX.Element {
  // FIREBALL
  // eslint-disable-next-line react/jsx-no-constructed-context-values
  const req = {
    isS,
    isDefaultSize,
    isM,
    isL,
    isXL,
    ...defaultBreakpoints
  };
  return <BreakpointsContext.Provider value={req}>{children}</BreakpointsContext.Provider>;
}

interface Props {
  children: JSX.Element;
  isDefaultSize?: boolean;
  isS?: boolean;
  isM?: boolean;
  isL?: boolean;
  isXL?: boolean;
}

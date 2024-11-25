/* eslint-disable */
import React, { useCallback, useMemo, useState } from 'react';
import { MAX_WIDTH } from '@utils/constants';
import { Tooltip } from '@cvent/carina/components/Tooltip';
import { Placements } from '@cvent/carina/components/Popper';
import { injectTestId } from '@cvent/nucleus-test-automation';

interface ToolTipWrapperProps {
  button: JSX.Element;
  text: string;
  copiedText: string;
}

export function ToolTipWrapper({ button, text, copiedText }: ToolTipWrapperProps): JSX.Element {
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const trigger = useCallback(
    (openTooltip, closeTooltip, button) => (
      <div
        role="tooltip"
        tabIndex={-1}
        aria-label={isCopied ? copiedText : text}
        {...injectTestId('tooltip-container')}
        onMouseEnter={() => {
          openTooltip();
        }}
        onMouseLeave={() => {
          closeTooltip();
        }}
        onFocus={() => {
          openTooltip();
        }}
        onBlur={() => {
          closeTooltip();
        }}
        onClick={() => {
          if (isTooltipOpen) {
            setIsTooltipOpen(false);
            closeTooltip();
          } else {
            setIsTooltipOpen(true);
            openTooltip();
          }
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
        }}
        onKeyDown={(event): void => {
          if (event.code === 'Enter') {
            if (isTooltipOpen) {
              setIsTooltipOpen(false);
              closeTooltip();
            } else {
              setIsTooltipOpen(true);
              openTooltip();
            }
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
          }
        }}
      >
        {button}
      </div>
    ),
    [isTooltipOpen, text, isCopied]
  );

  return useMemo(
    () => (
      <Tooltip
        portal
        maxWidth={MAX_WIDTH}
        placement={Placements.auto}
        aria-label={isCopied ? copiedText : text}
        text={isCopied ? copiedText : text}
        trigger={(openTooltip, closeTooltip) => trigger(openTooltip, closeTooltip, button)}
      />
    ),
    [button, text, trigger, isCopied]
  );
}

export default ToolTipWrapper;

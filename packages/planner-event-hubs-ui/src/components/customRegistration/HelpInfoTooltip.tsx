import React, { useState } from 'react';
import { PlacementProp } from '@cvent/carina/src/components/Popper/Placements';
import { useTheme } from '@cvent/carina/components/ThemeProvider/useTheme';
import { InfoIcon } from '@cvent/carina/components/Icon';
import { Tooltip } from '@cvent/carina/components/Tooltip';
import { injectTestId } from '@cvent/nucleus-test-automation';
import { useStyle } from '@hooks/useStyle';
import { EditSsoLoginStyle } from '@components/customRegistration/style';

export function HelpInfoToolTip({
  testId,
  helpText,
  placement = 'right-start',
  accessibilityLabel,
  tabIndex
}: Props): JSX.Element {
  const { font } = useTheme();
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const styles = useStyle(EditSsoLoginStyle);
  const trigger = (openTooltip, closeTooltip) => (
    <div
      role="button"
      tabIndex={tabIndex}
      aria-label={accessibilityLabel}
      {...injectTestId(`${testId}-container`)}
      onMouseEnter={() => {
        setIsTooltipOpen(true);
        openTooltip();
      }}
      onMouseLeave={() => {
        setIsTooltipOpen(false);
        closeTooltip();
      }}
      onFocus={() => {
        setIsTooltipOpen(true);
        openTooltip();
      }}
      onBlur={() => {
        setIsTooltipOpen(false);
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
        }
      }}
      css={styles.tooltipStyle}
    >
      <div>
        <InfoIcon size="s" color={font.color.soft} />
      </div>
    </div>
  );

  return (
    <Tooltip
      testID={testId}
      placement={placement}
      text={helpText}
      aria-label={accessibilityLabel}
      css={{ maxWidth: 'fit-content' }}
      trigger={(openTooltip, closeTooltip) => trigger(openTooltip, closeTooltip)}
    />
  );
}

interface Props {
  testId: string;
  helpText: string;
  placement?: PlacementProp;
  accessibilityLabel?: string;
  tabIndex?: number;
}

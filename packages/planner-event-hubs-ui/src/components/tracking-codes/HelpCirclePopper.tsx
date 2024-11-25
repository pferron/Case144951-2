import HelpCircleIcon from '@cvent/carina/components/Icon/HelpCircle';
import { Popper } from '@cvent/carina/components/Popper';
import React, { useRef, useState } from 'react';
import { PlacementProp } from '@cvent/carina/src/components/Popper/Placements';
import { PopperStyles } from '@components/tracking-codes/styles';
import { useStyle } from '@hooks/useStyle';
import { injectTestId } from '@cvent/nucleus-test-automation';
import { useTheme } from '@cvent/carina/components/ThemeProvider/useTheme';

export function HelpCirclePopper({
  testID,
  helpText,
  placement = 'right-start',
  maxWidth = '19rem',
  accessibilityLabel,
  preventOverflow = true,
  isFixed = false
}: Props): React.JSX.Element {
  const styles = useStyle(PopperStyles);
  const { font } = useTheme();
  const triggerRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const handleOpen = () => setIsOpen(prevIsOpen => !prevIsOpen);

  return (
    <>
      <span
        id={`${testID}-help-circle-icon`}
        {...injectTestId(`${testID}-help-circle-icon`)}
        role="button"
        tabIndex={0}
        ref={triggerRef}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setIsOpen(false)}
        onMouseOver={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onClick={handleOpen}
        onKeyDown={(event): void => {
          if (event.code === 'Enter') {
            handleOpen();
          }
        }}
        aria-label={accessibilityLabel}
      >
        <HelpCircleIcon size="s" color={font.color.soft} />
      </span>
      <Popper
        css={{ borderRadius: '0.625rem' }}
        testID={`${testID}-popper`}
        placement={placement}
        hasShadow
        isOpen={isOpen}
        triggerRef={triggerRef}
        preventOverflow={preventOverflow}
        isFixed={isFixed}
      >
        <div id={`${testID}-help-text`} css={{ ...styles.popperBodyStyles, maxWidth }}>
          {helpText}
        </div>
      </Popper>
    </>
  );
}

interface Props {
  testID: string;
  helpText: string;
  placement?: PlacementProp;
  preventOverflow?: boolean;
  isFixed?: boolean;
  maxWidth?: string;
  accessibilityLabel?: string;
}

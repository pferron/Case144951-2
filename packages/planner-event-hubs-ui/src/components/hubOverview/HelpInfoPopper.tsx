import { Popper } from '@cvent/carina/components/Popper';
import React, { CSSProperties, useRef, useState } from 'react';
import { PlacementProp } from '@cvent/carina/src/components/Popper/Placements';
import { PopperStyles } from '@components/tracking-codes/styles';
import { useStyle } from '@hooks/useStyle';
import { injectTestId } from '@cvent/nucleus-test-automation';

export function HelpInfoPopper({
  testID,
  helpText,
  placement = 'right-start',
  maxWidth = '19rem',
  accessibilityLabel,
  hoverElement,
  style
}: Props): JSX.Element {
  const styles = useStyle(PopperStyles);
  const triggerRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const handleOpen = () => setIsOpen(prevIsOpen => !prevIsOpen);

  return (
    <>
      <span
        {...injectTestId(testID)}
        id={testID}
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
        style={style}
      >
        {hoverElement}
      </span>
      <Popper
        id={`${testID}-tooltip`}
        css={{ borderRadius: '0.625rem' }}
        testID={`${testID}-popper`}
        placement={placement}
        hasShadow
        isOpen={isOpen}
        triggerRef={triggerRef}
        preventOverflow
      >
        <div css={{ ...styles.popperBodyStyles, maxWidth }}>{helpText}</div>
      </Popper>
    </>
  );
}

interface Props {
  testID: string;
  helpText: string;
  placement?: PlacementProp;
  maxWidth?: string;
  accessibilityLabel: string;
  hoverElement: JSX.Element;
  style?: CSSProperties;
}

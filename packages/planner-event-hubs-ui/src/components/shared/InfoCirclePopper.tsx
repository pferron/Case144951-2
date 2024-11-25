import InfoIcon from '@cvent/carina/components/Icon/Info';
import { Popper } from '@cvent/carina/components/Popper';
import React, { useRef, useState } from 'react';
import { PlacementProp } from '@cvent/carina/src/components/Popper/Placements';
import { useStyle } from '@hooks/useStyle';
import { useTheme } from '@cvent/carina/components/ThemeProvider/useTheme';
import { Theme } from '@cvent/carina/types/theme';
import { CSSObject } from '@emotion/react';

const InfoCirclePopperStyles = (theme: Theme): Record<string, CSSObject> => ({
  popperBodyStyles: {
    padding: '1rem',
    backgroundColor: theme.backgroundColor.base
  }
});

export function InfoCirclePopper({
  testID,
  infoText,
  placement = 'right-start',
  maxWidth = '19rem'
}: Props): JSX.Element {
  const styles = useStyle(InfoCirclePopperStyles);
  const { font } = useTheme();
  const triggerRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const handleOpen = () => setIsOpen(prevIsOpen => !prevIsOpen);

  return (
    <>
      <span
        id={`${testID}-info-circle-icon`}
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
        aria-label={`${testID}-info-text`}
      >
        <InfoIcon size="s" color={font.color.soft} />
      </span>
      <Popper
        testID={`${testID}-popper`}
        placement={placement}
        hasShadow
        isOpen={isOpen}
        triggerRef={triggerRef}
        preventOverflow
      >
        <div id={`${testID}-info-text`} css={{ ...styles.popperBodyStyles, maxWidth }}>
          {infoText}
        </div>
      </Popper>
    </>
  );
}

interface Props {
  testID: string;
  infoText: string;
  placement?: PlacementProp;
  maxWidth?: string;
}

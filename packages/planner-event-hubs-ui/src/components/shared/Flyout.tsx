import React, { useEffect, useRef, useMemo, ReactNode } from 'react';
import { injectTestId } from '@cvent/nucleus-test-automation';
import useBreakpoints from '@hooks/useBreakpoints';
import Panel from '@cvent/carina/components/Panel';
import { CLICK, HOVER } from '@utils/constants';

const Keys = {
  ENTER: 'Enter',
  ESCAPE: 'Escape',
  TAB: 'Tab',
  ARROW_DOWN: 'ArrowDown',
  ARROW_UP: 'ArrowUp'
};

interface TriggerType {
  toggleOpen: () => void;
}

interface Props {
  trigger: ({ toggleOpen }: TriggerType) => ReactNode;
  children: ReactNode | ((...args) => ReactNode);
  isVisible: boolean;
  toggleVisible: (boolean) => void;
  triggerMethod: string;
  hasSpacerAfterTrigger: boolean;
}

/**
 * Component to display content -
 * 1. As a flyout below the trigger component for desktop view
 * 2. As a slide panel for mobile view
 */
function Flyout({
  trigger,
  children,
  isVisible,
  toggleVisible,
  triggerMethod = CLICK,
  hasSpacerAfterTrigger
}: Props): JSX.Element {
  const flyoutContainerRef = useRef(null);
  const flyoutRef = useRef();
  const toggleVisibleRef = useRef(toggleVisible);
  const { isMobile } = useBreakpoints();

  const handlers = useMemo(() => {
    // Memoize these handlers so the allowScroll/blockScroll effect can have one less dependency
    if (isMobile) {
      return {
        handleClickOutside: (event): void => {
          if (flyoutContainerRef?.current && !flyoutContainerRef?.current.contains(event.target)) {
            if (typeof toggleVisibleRef.current === 'function') toggleVisibleRef.current(false);
          }
        },
        onKeyDown: (event): void => {
          if (event.key === Keys.ESCAPE) {
            if (typeof toggleVisibleRef.current === 'function') toggleVisibleRef.current(false);
          }
        }
      };
    }
    return {
      handleClickOutside: (event): void => {
        if (flyoutContainerRef?.current && !flyoutContainerRef?.current.contains(event.target)) {
          toggleVisibleRef.current(false);
        }
      },
      onKeyDown: (event): void => {
        if (event.key === Keys.ESCAPE) {
          toggleVisibleRef.current(false);
        }
      }
    };
  }, [isMobile]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (isVisible) {
        document.addEventListener('click', handlers.handleClickOutside);
        document.addEventListener('keydown', handlers.onKeyDown);
      } else {
        document.removeEventListener('click', handlers.handleClickOutside);
        document.removeEventListener('keydown', handlers.onKeyDown);
      }
    }
  }, [isVisible, handlers.handleClickOutside, handlers.onKeyDown]);

  // Setting ref is technically a side-effect
  useEffect(() => {
    toggleVisibleRef.current = toggleVisible;
  }, [toggleVisible]);

  const component =
    typeof children === 'function' ? children({ toggleOpen: () => toggleVisible(!isVisible) }) : children;

  return (
    <div
      onMouseEnter={
        triggerMethod === HOVER
          ? (): void => {
              if (!isVisible) {
                toggleVisible(true);
              }
            }
          : null
      }
      onMouseLeave={triggerMethod === HOVER ? (): void => toggleVisible(false) : null}
      ref={flyoutContainerRef}
      {...injectTestId('flyout-container')}
    >
      <div>{trigger({ toggleOpen: () => toggleVisible(!isVisible) })}</div>
      {hasSpacerAfterTrigger ? <div /> : null}
      {isMobile ? (
        <div ref={flyoutRef}>
          <Panel elevated isOpen={isVisible} testID="mobile-navigation-panel">
            {component}
          </Panel>
        </div>
      ) : (
        <div {...injectTestId('navigation-panel')}>
          <div ref={flyoutRef}>{component}</div>
        </div>
      )}
    </div>
  );
}

export default Flyout;

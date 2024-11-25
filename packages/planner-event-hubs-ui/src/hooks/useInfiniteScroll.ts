/* eslint-disable */
import { useEffect, useRef } from 'react';

/**
 * Hook to fire a throttled function whenever scrolling past a specific point on the page
 *
 * @param func Function to be fired
 * @param elementRef React ref of element that scrolls
 * @param wait Time to wait after action is finished
 * @param bottomScrollLeft Scroll height from bottom at which event should be fired
 * @param immediate Calls `func` immediately as well as after debounced wait - i.e. leading debounce
 */
const useInfiniteScroll = (
  func: () => void,
  elementRef: React.MutableRefObject<HTMLDivElement>,
  { wait = 100, bottomScrollLeft = 100, immediate = false } = {}
): void => {
  // Put these values in refs so we can mutate them without having to rerun the effect
  const debouncedFn = useRef<() => void>();
  const timeout = useRef<NodeJS.Timeout>();

  debouncedFn.current = func;

  useEffect(() => {
    if (!elementRef?.current) {
      return;
    }
    const element = elementRef.current;

    const handleScroll = () => {
      if (Math.abs(element.scrollHeight - element.clientHeight - element.scrollTop) < bottomScrollLeft) {
        // immediate calls are debounced with callNow value
        const callNow = immediate && !timeout.current;

        clearTimeout(timeout.current);
        timeout.current = setTimeout(() => {
          timeout.current = null;
          // The debounced function needs to be called even when immediate is true
          // because the user may continue scrolling
          debouncedFn.current();
        }, wait);

        if (callNow) {
          debouncedFn.current();
        }
      }
    };

    element.addEventListener('scroll', handleScroll);

    return () => {
      element.removeEventListener('scroll', handleScroll);
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wait, bottomScrollLeft, immediate]);
};

export default useInfiniteScroll;

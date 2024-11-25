import { useCallback, useEffect, useState, useRef } from 'react';
import { LoggerFactory } from '@cvent/logging/LoggerFactory';
import { storage, shouldHandleNormandySession } from './utils';

const LOG = LoggerFactory.create('SessionHandler');

/**
 * Track the user's last interaction so we can use it to determine the keepAlive offset
 * and issue requests at the maximum interval instead of every single time the user
 * interacts with the application.
 */
export const useLastInteraction = isModalOpen => {
  const handler = useRef(null);

  // Some helpers

  const setLastInteraction = useCallback(
    initialTime => {
      const time = initialTime || new Date().getTime();
      if (!isModalOpen) storage.setItem('lastInteraction', time);
    },
    [isModalOpen]
  );

  const getLastInteraction = useCallback(() => storage.getItem('lastInteraction'), []);

  const clearLastInteraction = useCallback(() => storage.removeItem('lastInteraction'), []);

  // Debouncer
  const handleInteraction = useCallback(() => {
    clearTimeout(handler.current);
    handler.current = setTimeout(setLastInteraction, 250);
  }, [setLastInteraction]);

  // Track user interactions
  useEffect(() => {
    setLastInteraction(undefined);

    document.body.addEventListener('scroll', handleInteraction, true);
    document.body.addEventListener('keydown', handleInteraction);
    document.body.addEventListener('click', handleInteraction);
    document.body.addEventListener('touchstart', handleInteraction);

    return () => {
      clearLastInteraction();

      document.body.removeEventListener('scroll', handleInteraction, true);
      document.body.removeEventListener('keydown', handleInteraction);
      document.body.removeEventListener('click', handleInteraction);
      document.body.removeEventListener('touchstart', handleInteraction);
    };
  }, [clearLastInteraction, handleInteraction, setLastInteraction]);

  return [getLastInteraction, setLastInteraction];
};

// Send request to normandy endpoint to extend session expiration time
export const useKeepAlive = ({ interval, getLastInteraction, makeKeepAliveRequest, normandyEndpoint }) => {
  const [ready, setReady] = useState(false);
  const [timeLeft, setTimeLeft] = useState(Infinity);
  const heartbeatInterval = useRef(null);
  const timeLeftInterval = useRef(null);

  // Poll storage to get an accurate time left in the session
  const getTimeLeft = useCallback(() => {
    const time = new Date().getTime();
    const timeoutDate = storage.getItem('timeoutDate') || Infinity;

    const lastInteraction = getLastInteraction();
    const interactedWithinInterval = time - lastInteraction <= interval;

    let _timeLeft = Math.floor((timeoutDate - time) / 1000);
    if (interactedWithinInterval) _timeLeft += interval * 1000;
    setTimeLeft(_timeLeft);
  }, [getLastInteraction, interval]);

  // Check if the session is still alive
  const heartbeat = useCallback(
    async force => {
      const time = new Date().getTime();
      const lastInteraction = getLastInteraction();
      const interactedWithinInterval = time - lastInteraction <= interval;

      try {
        if (interactedWithinInterval || force) {
          if (shouldHandleNormandySession(normandyEndpoint)) {
            const keepAliveResponse = await makeKeepAliveRequest(normandyEndpoint);
            // Reduce login timeout by 1 minute to ensure session can be refreshed
            const timeout = keepAliveResponse.SecuritySettings.LoginTimeout - 1;
            const timeoutDate = time + timeout * 60000;
            storage.setItem('timeoutDate', timeoutDate);
          }

          setReady(true);

          // Allow us to force reset the interval (for when a user hits "Keep working")
          if (force) {
            clearInterval(heartbeatInterval.current);
            heartbeatInterval.current = setInterval(heartbeat, interval);
          }
        }
      } catch (error) {
        LOG.error('[SessionHandler] service request failed', error);
      }
    },
    [getLastInteraction, interval, makeKeepAliveRequest, normandyEndpoint]
  );

  useEffect(() => {
    // Prepare
    storage.removeItem('timeoutDate');
    heartbeat(false);
    getTimeLeft();
    heartbeatInterval.current = setInterval(heartbeat, interval);
    timeLeftInterval.current = setInterval(getTimeLeft, 250);

    // Unmount
    return (): void => {
      storage.removeItem('timeoutDate');
      clearInterval(heartbeatInterval.current);
      clearInterval(timeLeftInterval.current);
    };
  }, [heartbeat, getTimeLeft, interval]);

  // Returns the heartbeat function (for "Keep working") & timeLeft
  return { heartbeat: ready && heartbeat, timeLeft };
};

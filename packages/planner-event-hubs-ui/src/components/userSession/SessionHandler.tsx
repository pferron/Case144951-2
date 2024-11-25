import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { SessionNotice } from './SessionNotice';
import { redirectToLogin, logOut, makeKeepAliveRequest } from './utils';
import { useKeepAlive, useLastInteraction } from './hooks';

export function SessionHandler({
  keepAliveInterval = 5 * 60,
  showNoticeWhenUnder = 5 * 60,
  stillThereText,
  noticeText,
  timeLeftText,
  keepWorkingText,
  logOutText,
  refreshErrorText,
  normandyEndpoint
}): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const [getLastInteraction] = useLastInteraction(isOpen);
  const [hasRefreshError, setHasRefreshError] = useState(false);
  const { heartbeat, timeLeft } = useKeepAlive({
    interval: keepAliveInterval * 1000,
    getLastInteraction,
    makeKeepAliveRequest,
    normandyEndpoint
  });
  const logOutHandler = useCallback(() => logOut(normandyEndpoint), [normandyEndpoint]);

  // Handle showing/hiding the notice based on time left in the session
  useEffect(() => {
    if (timeLeft <= 0) redirectToLogin(normandyEndpoint);
    if (timeLeft <= showNoticeWhenUnder) setIsOpen(true);
    else setIsOpen(false);
  }, [showNoticeWhenUnder, timeLeft, normandyEndpoint]);

  if (typeof window !== 'undefined' && !heartbeat) {
    return null;
  }
  /*
   * This provider was to allow handling of dirty forms
   * Since that's no longer a requirement, we don't need it, but I'm going to leave
   * it in here just in case since it has no negative side-effects
   */
  return (
    <SessionNotice
      isOpen={isOpen}
      onKeepWorking={(): void => {
        try {
          setHasRefreshError(false);
          heartbeat(true);
          setIsOpen(false);
        } catch (err) {
          setHasRefreshError(true);
        }
      }}
      onLogout={logOutHandler}
      timeLeft={timeLeft}
      stillThereText={stillThereText}
      noticeText={noticeText}
      timeLeftText={timeLeftText}
      logOutText={logOutText}
      keepWorkingText={keepWorkingText}
      refreshErrorText={refreshErrorText}
      hasRefreshError={hasRefreshError}
    />
  );
}

SessionHandler.propTypes = {
  /** The number of seconds that should elapse between keep-alive requests */
  keepAliveInterval: PropTypes.number,
  /** The number of seconds remaining in the session before a notice appears to the user */
  showNoticeWhenUnder: PropTypes.number,
  /** A localized string to the effect of "Are you still there?" */
  stillThereText: PropTypes.string,
  /** A localized string to the effect of "You are about to be logged out due to inactivity" */
  noticeText: PropTypes.string,
  /** A function that accepts an argument representing the time remaining in the session and returning a localized string to the effect of "<time left> remaining" */
  timeLeftText: PropTypes.func,
  /** A localized string to the effect of "Keep working" */
  keepWorkingText: PropTypes.string,
  /** A localized string to the effect of "Log out" */
  logOutText: PropTypes.string,
  /** A localized string to the effect of "Failed to refresh your session; try again" */
  refreshErrorText: PropTypes.string,
  /** Normandy Base url */
  normandyEndpoint: PropTypes.string
};

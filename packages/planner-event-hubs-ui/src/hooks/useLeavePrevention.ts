import { useEffect, useRef, useMemo, useCallback } from 'react';
import { useRouter } from 'next/router';
import { BroadcastChannel } from 'broadcast-channel';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();
/**
 * Prevents leaving the page if `preventLeave` is true.
 *
 * If the route is changed from within the app (Next.js routing)
 * the `onPreventRouteChange` function is called.
 *
 * If the page is unloaded (browser refresh, close tab) we have
 * much less control. We simply tell the browser to prevent navigation
 * which will prompt the browser to prevent the action and show an alert.
 *
 * Returns a function `leavePage` that forces the router to push the
 * previously prevented path.
 */
const useLeavePrevention = ({
  preventLeave,
  onPreventRouteChange
}: {
  preventLeave: boolean;
  onPreventRouteChange: () => void;
}): { leavePage: () => void } => {
  const router = useRouter();

  const nextPath = useRef(null);
  const allowLeave = useRef(false);
  const isLogout = useRef(false);
  const leavePage = () => {
    if (nextPath.current) {
      allowLeave.current = true;
      router.push(nextPath.current);
    }
  };

  // Listen for logout broadcasts
  const channel = useMemo(() => {
    if (typeof window !== 'undefined') {
      return new BroadcastChannel('logout');
    }
    return null;
  }, []);

  const onLogoutMessage = useCallback(() => {
    isLogout.current = true;
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      channel.addEventListener('message', onLogoutMessage);
      return () => {
        channel.removeEventListener('message', onLogoutMessage);
      };
    }
    return null;
  }, [channel, onLogoutMessage]);

  useEffect(() => {
    const handleWindowClose = evt => {
      // ignore leave prevention if we are logging out
      if (preventLeave && !isLogout.current) {
        evt.preventDefault();
        // eslint-disable-next-line no-param-reassign
        evt.returnValue = '';
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', handleWindowClose);
    }

    const onRouteChangeStart = path => {
      const isSamePageNav = router.asPath === path.replace(publicRuntimeConfig.BASE_PATH, '');
      if (preventLeave && !allowLeave.current && !isSamePageNav) {
        nextPath.current = path.replace(publicRuntimeConfig.BASE_PATH, '');
        onPreventRouteChange();
        router.events.emit('routeChangeError');
        // Throwing a string instead of a new Error prevents the dev server from blowing up
        // eslint-disable-next-line no-throw-literal
        throw 'Aborting route change';
      }
    };
    if (router.events) {
      router.events.on('routeChangeStart', onRouteChangeStart);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('beforeunload', handleWindowClose);
      }
      if (router.events) {
        router.events.off('routeChangeStart', onRouteChangeStart);
      }
    };
  }, [router, preventLeave, onPreventRouteChange]);

  return { leavePage };
};

export default useLeavePrevention;

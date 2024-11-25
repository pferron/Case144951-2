import { LoggerFactory } from '@cvent/logging/LoggerFactory';
import { Logger } from '@cvent/logging/types';
// FIREBALL
// eslint-disable-next-line no-restricted-imports
import { httpLogPageLoadId } from '@cvent/nucleus-networking';

const isBrowser = (): boolean => typeof window !== 'undefined';
/**
 * Add a unhandled promise rejection handler that will log messages with the provided logger
 * @param unhandledLogger Logger to log unhandled promise rejection events to
 */
const addUnhandledPromiseRejectionHandler = (unhandledLogger: Logger): void => {
  if (typeof window !== 'undefined') {
    window.onunhandledrejection = async (event: PromiseRejectionEvent): Promise<void> => {
      let reason;
      try {
        reason = await event.reason;
        if (!reason) {
          reason = {
            message: 'unhandledrejection event had no reason',
            event
          };
        }
      } catch (error) {
        reason = error;
        if (!reason) {
          reason = {
            message: 'unhandledrejection event reason promise rejected with no value',
            event
          };
        }
      }
      unhandledLogger.error('Global Unhandled Promise Rejection', reason);
    };
  }
};

/**
 * Add a unhandled error handler that will log messages with the provided logger
 * @param unhandledLogger Logger to log unhandled errors to
 */
const addUnhandledErrorHandler = (unhandledLogger: Logger): void => {
  if (typeof window !== 'undefined') {
    window.onerror = (
      message: string | Event,
      source?: string,
      lineno?: number,
      colno?: number,
      error?: Error
    ): void => {
      if (lineno === 0 && colno === 0 && (!error || !error.stack)) {
        /*
         * Error in a cross-origin script that we aren't allowed to see any information about. Usually
         * users blocking some stupid tracking script. We aren't responsible for these errors, so don't
         * spam the logs.
         */
        return;
      }
      unhandledLogger.error(
        'Global Unhandled Error',
        { message, source, lineno, colno, pageLoadId: httpLogPageLoadId },
        error
      );
    };
  }
};

export interface LoggerContext {
  httpLogPageLoadId?: string;
  httpLogRequestId?: string;
  environment?: string;
  centerId?: string;
  windowLocation?: string;
  browserInfo?: {
    fullVersion?: string;
    name?: string;
    os?: string;
    version?: string;
  };
}

export const initializeClientLogging = (): void => {
  if (!isBrowser()) {
    return;
  }
  global.Request = Request;
  global.fetch = fetch;

  const LOG = LoggerFactory.create('app');
  addUnhandledErrorHandler(LOG);
  addUnhandledPromiseRejectionHandler(LOG);
};

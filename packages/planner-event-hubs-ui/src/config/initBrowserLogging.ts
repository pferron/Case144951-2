import getConfig from 'next/config';
import { LoggerFactory } from '@cvent/logging/LoggerFactory';
import { DefaultPrivacyLevel } from '@datadog/browser-rum';
import { TraceContextInjection } from '@datadog/browser-core';

const { publicRuntimeConfig } = getConfig();

export const datadogOptions = {
  applicationId: publicRuntimeConfig.DD_APP_ID,
  clientToken: publicRuntimeConfig.DD_CLIENT_TOKEN,
  service: publicRuntimeConfig.DD_SERVICE,
  env: publicRuntimeConfig.DD_ENV,
  version: publicRuntimeConfig.DD_VERSION,
  trackUserInteractions: true,
  trackResources: true,
  trackLongTasks: true,
  defaultPrivacyLevel: DefaultPrivacyLevel.ALLOW,
  sessionSampleRate: Number(publicRuntimeConfig.DD_SESSION_SAMPLE_RATE),
  sessionReplaySampleRate: Number(publicRuntimeConfig.DD_SESSION_REPLAY_SAMPLE_RATE),
  trackSessionAcrossSubdomains: true,
  allowedTracingUrls: [typeof window !== 'undefined' ? window.location.origin : ''],
  useSecureSessionCookie: true,
  useCrossSiteSessionCookie: true,
  traceSampleRate: 25,
  traceContextInjection: TraceContextInjection.SAMPLED,
  excludedActivityUrls: [
    // Heartbeat +
    /cvent.pubnubapi.com/,
    /stream-io-api.com/,
    // Analytics
    /api-js.mixpanel.com/,
    /batch_facts/,
    /analytics/,
    // Video
    /video.app.cvent.com/,
    /video-edge/,
    /live-video.net/,
    /video-sync-upload-bucket/,
    /ingest.chime.aws/,
    /brightcove/,
    /bcove/,
    /bcovlive/,
    /api.brightcove/,
    /api.bcovlive/,
    // Others
    /salesforceliveagent.com/
  ]
};

if (typeof window !== 'undefined') {
  LoggerFactory.initConfig({
    loggerOptions: {
      level: publicRuntimeConfig.LOG_LEVEL?.toLowerCase() || 'warn'
    },
    ...(process.env.NODE_ENV === 'production'
      ? { datadogOptions }
      : {
          browserTransport: () => {
            // do nothing
          } // for developement env configure a noop browser transport so that it logs to console instead of trying to send logs to DD
        })
  });
}

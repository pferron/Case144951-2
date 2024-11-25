// FIREBALL
/* eslint-disable no-restricted-properties */
import '@cvent/app-config/initAppConfig';
import path from 'path';
import { createRequire } from 'module';
import {
  recommendedSecurityHeaders,
  contentSecurityPolicy
} from '@cvent/nextjs/server/securityHeaders';
import { withNoPublicEnvironmentVariables } from '@cvent/nextjs/utils/withNoPublicEnvironmentVariables';
import { recommendedProfilingHeaders } from '@cvent/nextjs/server/profilingHeaders';

const require = createRequire(import.meta.url);

const { PHASE_DEVELOPMENT_SERVER } = require('next/constants');

const { name: packageName, version } = require('./package.json');

export default async phase => {
  /** @type {import('next').NextConfig} */
  const configs = {
    // let cloudfront do this
    compress: false,
    poweredByHeader: false,
    productionBrowserSourceMaps: true,
    /* eslint-disable no-restricted-properties */
    publicRuntimeConfig: {
      BASE_URL: process.env.EVENT_HUBS_WEB,
      LOGIN_URL: process.env.LOGIN_URL,
      PLANNER_VIDEO_SOLUTION_URL: process.env.PLANNER_VIDEO_SOLUTION_URL,
      LOG_LEVEL: process.env.LOG_LEVEL || 'WARN',
      CLIENT_VERSION: version,
      IS_DEV: process.env.IS_DEV,
      ENVIRONMENT_KEY: process.env.ENVIRONMENT_KEY,
      NORMANDY_BASE_URL: process.env.normandyBaseUrl,
      DD_APP_ID: process.env.DD_APP_ID || '',
      DD_CLIENT_TOKEN: process.env.DD_CLIENT_TOKEN || '',
      DD_ENV: process.env.DD_ENV || '',
      DD_SERVICE: process.env.DD_SERVICE || packageName.replace(/^@.+\//, ''),
      DD_VERSION: process.env.DD_VERSION,
      DD_SESSION_SAMPLE_RATE: process.env.DD_SESSION_SAMPLE_RATE,
      DD_SESSION_REPLAY_SAMPLE_RATE: process.env.DD_SESSION_REPLAY_SAMPLE_RATE,
      ATTENDEE_EXPERIENCE_URL: process.env.ATTENDEE_EXPERIENCE_URL,
      METRICS_ENABLED: process.env.METRICS_ENABLED,
      EVENT_HUBS_WEB: process.env.EVENT_HUBS_WEB,
      ENVIRONMENT_NAME: process.env.ENVIRONMENT_NAME,
      VIDEO_HUB_WEB: process.env.VIDEO_HUB_WEB,
      ENVIRONMENT_TYPE: process.env.ENVIRONMENT_TYPE,
      WRITING_ASSISTANT_URL: process.env.WRITING_ASSISTANT_URL,
      RUDDER_WRITE_KEY: process.env.RUDDER_WRITE_KEY,
      RUDDER_DATA_PLANE_URL: process.env.RUDDER_DATA_PLANE_URL,
      RUDDER_AUTOMATION_SYNTHETIC_WRITE_KEY:
        process.env.RUDDER_AUTOMATION_SYNTHETIC_WRITE_KEY,
      CVENT_SHORT_URL: process.env.WEE_SERVICE_REDIRECT_DOMAIN,
      FILE_IMPORT_URL: process.env.FILE_IMPORT_SERVICE_URL
      /* eslint-enable */
    },

    eslint: {
      ignoreDuringBuilds: true
    },

    output: 'standalone',

    experimental: {
      outputFileTracingRoot: path.resolve('../../')
    },

    async redirects() {
      const redirects = [];
      redirects.push({
        source: '/video-centers/:slug*',
        destination: '/eventsplus/:slug*',
        permanent: true
      });
      return redirects;
    },

    async headers() {
      return [
        {
          source: '/cvent-logo.png',
          headers: [
            {
              key: 'cache-control',
              value: 'public, max-age=3600, stale-while-revalidate=300'
            }
          ]
        },
        {
          source: '/(.*)',
          headers: [
            ...recommendedSecurityHeaders,
            ...recommendedProfilingHeaders
          ]
        },
        {
          source: '/storybook/:path*',
          headers: [
            {
              key: 'Content-Security-Policy',
              value: `script-src 'self' 'unsafe-inline' 'unsafe-eval';frame-ancestors 'self';${
                contentSecurityPolicy().value
              }`
            }
          ]
        },
        ...(phase === PHASE_DEVELOPMENT_SERVER
          ? [
              {
                source: '/api/graphql/:path*',

                headers: [
                  {
                    key: 'Content-Security-Policy',
                    value: `script-src 'self' 'unsafe-inline' 'unsafe-eval' cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' fonts.googleapis.com cdn.jsdelivr.net; font-src 'self' https://fonts.gstatic.com;${
                      contentSecurityPolicy(['cdn.jsdelivr.net']).value
                    }`
                  }
                ]
              }
            ]
          : [])
      ];
    }
  };
  return withNoPublicEnvironmentVariables(configs);
};

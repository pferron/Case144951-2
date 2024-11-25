import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';
import { loadEnvConfig } from '@next/env';
// import 'jest-axe/extend-expect';
import { TextEncoder } from 'util';
import ResizeObserver from 'resize-observer-polyfill';

// Configure testID attribute
configure({ testIdAttribute: 'data-cvent-id' });

// Load Next.js env files -- mock don't load
loadEnvConfig(process.cwd(), false);

global.TextEncoder = TextEncoder;
global.ResizeObserver = ResizeObserver;

jest.mock('@cvent/logging/LoggerFactory', () => {
  return {
    LoggerFactory: {
      create: jest.fn().mockImplementation(() => {
        return {
          debug: jest.fn(),
          info: jest.fn(),
          warn: jest.fn(),
          error: jest.fn()
        };
      }),
      initConfig: jest.fn()
    }
  };
});

jest.mock('@cvent/logging/LibraryLoggerFactory', () => {
  const mockLogger = {
    create: jest.fn().mockImplementation(() => ({
      debug: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      child: jest.fn().mockReturnThis()
    })),
    createLoggerFactory: jest.fn()
  };
  return {
    __esModule: true,
    createLoggerFactory: () => mockLogger,
    LibraryLoggerFactory: () => mockLogger
  };
});

jest.mock('next/config', () => (): unknown => ({
  publicRuntimeConfig: {
    IS_DEV: true
  }
}));

/* eslint-disable @typescript-eslint/no-explicit-any */
const getBaseProps = jest.fn();
const trackAction = jest.fn();

jest.mock('@cvent/sli-nextjs-metrics', () => {
  return {
    usePageActions(): any {
      return {
        getBaseProps,
        trackAction
      };
    },
    useMeasurePageLoad: jest.fn()
  };
});

jest.mock('nucleus-text', () =>
  jest
    .requireActual('nucleus-text/testing-library/nucleusTextMock')
    .nucleusTextMock(jest.requireActual('../planner-event-hubs-ui/locales/en-US.json'))
);

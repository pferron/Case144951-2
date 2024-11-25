import { Component, ReactNode } from 'react';
import { LoggerFactory } from '@cvent/logging/LoggerFactory';
import { httpLogPageLoadId } from '@cvent/nucleus-networking/lib';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

const LOG = LoggerFactory.create('ErrorBoundary');

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

const isDevMode = (): boolean => publicRuntimeConfig.IS_DEV === 'true';

/**
 * A component that catches JavaScript errors that occur in child components, logs the error and redirects to the error page
 * See https://reactjs.org/docs/error-boundaries.html
 */
export default class ErrorBoundary extends Component<Props, State> {
  // eslint-disable-next-line react/state-in-constructor
  public state: State = { hasError: false };

  public static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error): void {
    LOG.error(error);
    if (!isDevMode()) {
      setTimeout(() => {
        window.location.href = `/error?httpLogPageLoadId=${httpLogPageLoadId}&date=${new Date().toUTCString()}`;
      }, 500);
    }
  }

  public render(): ReactNode {
    const { hasError } = this.state;
    if (hasError) {
      return '';
    }
    const { children } = this.props;
    return children;
  }
}

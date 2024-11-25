import React from 'react';
import ErrorBoundary from '@components/ErrorBoundary';
import { httpLogPageLoadId } from '@cvent/nucleus-networking/lib';
import { render } from '@testing-library/react';

describe('ErrorBoundary', () => {
  it('redirects with an Instance ID corresponding to the same httpLogPageLoadId shared with related requests', () => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { href: '' }
    });

    const FakeComponent = (): JSX.Element => {
      throw new Error('Fake Error');
    };

    jest.useFakeTimers();
    jest.spyOn(global, 'setTimeout');

    render(
      <ErrorBoundary>
        <FakeComponent />
      </ErrorBoundary>
    );

    jest.runAllTimers();

    expect(window.location.href).toContain(`/error?httpLogPageLoadId=${httpLogPageLoadId}`);
  });
});

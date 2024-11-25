import React, { useEffect, useState } from 'react';
import { ApolloError } from '@apollo/client';
import { useMeasurePageLoad, usePageActions } from '@cvent/sli-nextjs-metrics';
import Loading from './Loading';

const DELAYED_SPINNER_TIMEOUT = 500;

// Helper function to combine all the graph errors
const combinedErrors = errors => {
  const hasErrors = errors?.find(err => typeof err !== 'undefined');
  if (!hasErrors) {
    return undefined;
  }
  return new ApolloError({
    errorMessage: 'one of the main queries failed',
    graphQLErrors: errors
  });
};

/**
 * Wrapper component that shows a loading spinner
 * until the child components are ready to be rendered
 */
function LoadingWrapper({
  loading,
  renderer,
  forceSpinner = false,
  errors = undefined,
  id,
  testID,
  ariaLabel
}: Props): JSX.Element {
  const [hydrated, setHydrated] = useState(false);
  const [showSpinnerComponent, setShowSpinnerComponent] = useState(false);
  const { getBaseProps } = usePageActions();
  const baseProps = getBaseProps();

  useEffect(() => {
    const timeOutId = setTimeout(() => setShowSpinnerComponent(true), DELAYED_SPINNER_TIMEOUT);
    return (): void => clearTimeout(timeOutId);
  }, []);
  const LoaderComponent =
    showSpinnerComponent || forceSpinner ? <Loading id={id} testID={testID} ariaLabel={ariaLabel} /> : null;

  useEffect(() => {
    setHydrated(true);
  }, [setHydrated]);

  // Measure page load. We can't track page loads in intercom until its initialized
  // So "loading" in terms of tracking means its value is true until either the page is loading OR intercom has not been initialized
  const isLoading = !hydrated || loading;

  useMeasurePageLoad({
    pageIsLoading: (): boolean => isLoading,
    pageError: () => combinedErrors(errors),
    data: { ...baseProps }
  });

  return !hydrated || loading ? LoaderComponent : renderer();
}

interface Props {
  /** Whether to show the loading spinner or not */
  loading: boolean;
  /** Child components renderer */
  renderer: () => JSX.Element;
  /** Whether we should force a spinner as the loader irrespective of any other conditions */
  forceSpinner?: boolean;
  /** Whether or not the page load ended in an error or not */
  errors?: ApolloError[] | undefined;
  /** The id attribute passed to the LoadingSpinner element. */
  id?: string;
  /** ID used primarily for e2e tests (maps to `data-cvent-id`). */
  testID?: string;
  /** Aria-label for accessibility */
  ariaLabel?: string;
}

export default LoadingWrapper;

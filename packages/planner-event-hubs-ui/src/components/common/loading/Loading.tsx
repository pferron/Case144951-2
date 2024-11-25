import React from 'react';
import { LoadingSpinner } from '@cvent/carina/components/LoadingSpinner';
import { useStyle } from '@hooks/useStyle';
import { Style } from './style';

/**
 * Loading component
 * to be used whenever data is being loaded on a page
 */
function Loading({ id, testID, ariaLabel }: Props): JSX.Element {
  const { loadingWrapper } = useStyle(Style);
  const styles = useStyle(Style);
  return (
    <div css={loadingWrapper}>
      <LoadingSpinner {...styles.loadSpinner} aria-label={ariaLabel} id={id} testID={testID} />
    </div>
  );
}

interface Props {
  /** The id attribute passed to the LoadingSpinner element. */
  id?: string;
  /** ID used primarily for e2e tests (maps to `data-cvent-id`). */
  testID?: string;
  /** Aria label for loading spinner. */
  ariaLabel?: string;
}

export default Loading;

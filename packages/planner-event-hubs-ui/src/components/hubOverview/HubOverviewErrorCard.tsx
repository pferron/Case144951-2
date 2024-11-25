import { SpotWarning } from '@cvent/carina/components/Illustrations';
import FormElement from '@cvent/carina/components/FormElement/FormElement';
import Button from '@cvent/carina/components/Button';
import React from 'react';
import { useTranslate } from 'nucleus-text';
import { injectTestId } from '@cvent/nucleus-test-automation';
import { useStyle } from '@hooks/useStyle';
import { HubOverviewStyle } from '@components/hubOverview/style';

export function HubOverviewErrorCard({ testId, tryAgain }: Props): JSX.Element {
  const { translate } = useTranslate();
  const styles = useStyle(HubOverviewStyle);
  return (
    <div css={styles.errorContainer} {...injectTestId(testId)}>
      <SpotWarning width={120} height={120} title="test" />
      <div css={styles.errorCardContainer}>
        <FormElement.Label label={translate('hub_overview_card_error_text')} labelFor="error" />
        <Button
          css={{ paddingTop: '0.5rem' }}
          appearance="ghost"
          onClick={tryAgain}
          aria-label={translate('hub_overview_card_try_again_button')}
          text={translate('hub_overview_card_try_again_button')}
          testID={`${testId}-try-again-button`}
        />
      </div>
    </div>
  );
}

interface Props {
  testId: string;
  tryAgain: () => void;
}

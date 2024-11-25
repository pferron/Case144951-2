import React from 'react';
import { MeasurementIdStyles } from '@components/tracking-codes/styles';
import { useStyle } from '@hooks/useStyle';
import { useTranslate } from 'nucleus-text';
import { injectTestId } from '@cvent/nucleus-test-automation';
import { HelpCirclePopper } from '@components/tracking-codes/HelpCirclePopper';

export function ViewMeasurementId({ measurementId }: Props): JSX.Element {
  const styles = useStyle(MeasurementIdStyles);
  const { translate } = useTranslate();

  return (
    <div>
      {measurementId ? (
        <>
          <div css={styles.labelHeader}>
            <div css={styles.label} {...injectTestId('measurement-id-label-text')}>
              {translate('google_analytics_measurement_id_label')}
            </div>
            <div css={{ marginTop: '0.25rem' }}>
              <HelpCirclePopper
                testID="google-measurement-id"
                helpText={translate('google_analytics_measurement_id_tooltip')}
                accessibilityLabel={translate('google_analytics_measurement_id_tooltip')}
              />
            </div>
          </div>
          <div css={styles.textValueStyle}>{measurementId}</div>
        </>
      ) : (
        <p css={styles.noCodeMessage}>{translate('google_analytics_no_id_message')}</p>
      )}
    </div>
  );
}

interface Props {
  measurementId: string;
}

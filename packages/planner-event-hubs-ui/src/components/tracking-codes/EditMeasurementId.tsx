import React, { Ref, useEffect, useState } from 'react';
import FormElement from '@cvent/carina/components/FormElement/FormElement';
import Textbox from '@cvent/carina/components/Textbox/Textbox';
import { MeasurementIdStyles } from '@components/tracking-codes/styles';
import { useStyle } from '@hooks/useStyle';
import { useTranslate } from 'nucleus-text';
import { HelpCirclePopper } from '@components/tracking-codes/HelpCirclePopper';
import { isEqual } from 'lodash';

export const EditMeasurementId = React.forwardRef((props: Props, ref: Ref<HTMLInputElement>): React.JSX.Element => {
  const styles = useStyle(MeasurementIdStyles);
  const { originalMeasurementId, hasInvalidId, setHasInvalidId, onSave, setIsPageEdited, setIsMeasurementIDEdited } =
    props;
  const [measurementId, setMeasurementId] = useState(originalMeasurementId);
  const { translate } = useTranslate();

  useEffect(() => {
    setIsMeasurementIDEdited(!isEqual(measurementId, originalMeasurementId));
  }, [measurementId, originalMeasurementId, setIsMeasurementIDEdited]);

  return (
    <>
      <div css={styles.labelHeader}>
        <FormElement.Label label={translate('google_analytics_measurement_id_label')} labelFor="measurementId" />
        <HelpCirclePopper
          testID="google-measurement-id"
          helpText={translate('google_analytics_measurement_id_tooltip')}
          accessibilityLabel={translate('google_analytics_measurement_id_tooltip')}
        />
      </div>
      <div css={styles.textboxStyle}>
        <Textbox
          id="measurementId"
          value={measurementId}
          onChange={({ target }): void => {
            setHasInvalidId(false);
            setMeasurementId(target.value);
            setIsPageEdited(true);
          }}
          onKeyDown={(e): void => {
            if (e.key === 'Enter') {
              onSave();
            }
          }}
          testID="google-measurement-id-textbox"
          hasError={hasInvalidId}
          maxLength={100}
          ref={ref}
        />
        {hasInvalidId && <FormElement.Message text={translate('google_analytics_invalid_id_error')} type="error" />}
      </div>
      <div css={{ marginTop: '0.25rem' }}>{translate('google_analytics_measurement_id_example')}</div>
    </>
  );
});

interface Props {
  originalMeasurementId: string;
  hasInvalidId: boolean;
  setHasInvalidId: (val: boolean) => void;
  onSave: () => void;
  setIsPageEdited: (isPageEdited: boolean) => void;
  setIsMeasurementIDEdited: (isMeasurementIDEdited: boolean) => void;
}

import React, { useEffect, useRef, useState } from 'react';
import { TrackingCodesStyle } from '@components/tracking-codes/styles';
import { useStyle } from '@hooks/useStyle';
import { isValidMeasurementId } from '@utils/measurementIdValidation';
import { EditMeasurementId } from '@components/tracking-codes/EditMeasurementId';
import CardContainer from '@components/common/CardContainer';
import { useTranslate } from 'nucleus-text';
import Button from '@cvent/carina/components/Button';
import { Col } from '@cvent/carina/components/Col';

export function NewGoogleAnalytics({
  measurementId,
  editMeasurementId,
  setEditMeasurementId,
  onSaveMeasurementId,
  isMeasurementIDEdited,
  setIsMeasurementIDEdited,
  setIsPageEdited
}: Props): React.JSX.Element {
  const styles = useStyle(TrackingCodesStyle);
  const [hasInvalidId, setHasInvalidId] = useState(false);
  const measurementRef = useRef(null);
  const { translate } = useTranslate();

  useEffect(() => {
    if (editMeasurementId && measurementRef.current) {
      measurementRef.current.focus();
    }
  }, [editMeasurementId]);

  const onSave = () => {
    setIsPageEdited(false);
    const updatedId = measurementRef.current.value;
    if (isValidMeasurementId(updatedId)) {
      setHasInvalidId(false);
      setEditMeasurementId(false);
      onSaveMeasurementId(updatedId);
    } else {
      setHasInvalidId(true);
    }
  };

  return (
    <div
      css={{
        margin: '1.5rem',
        marginBottom: 0
      }}
    >
      <CardContainer
        testID="google-measurement-id"
        enabled={editMeasurementId}
        saveAccessibilitylabel={translate('google_analytics_save_button_label')}
      >
        <Col css={styles.saveButtonStyle} padding={{ paddingLeft: 0 }}>
          <h2 css={styles.headerContainer}>{translate('google_analytics_set_id_header')}</h2>
          <Button
            text={translate('tracking_codes_save_button')}
            appearance="filled"
            size="s"
            disabled={!isMeasurementIDEdited}
            onClick={onSave}
            aria-label={translate('tracking_codes_save_button')}
            testID="google-analytics-card-save-button"
          />
        </Col>
        <p css={styles.descriptionStyle}>{translate('google_analytics_sub_header')}</p>
        <EditMeasurementId
          originalMeasurementId={measurementId}
          setIsMeasurementIDEdited={setIsMeasurementIDEdited}
          hasInvalidId={hasInvalidId}
          setHasInvalidId={setHasInvalidId}
          onSave={onSave}
          ref={measurementRef}
          setIsPageEdited={setIsPageEdited}
        />
      </CardContainer>
    </div>
  );
}

interface Props {
  measurementId: string;
  editMeasurementId: boolean;
  isMeasurementIDEdited: boolean;
  setEditMeasurementId: (value: boolean) => void;
  onSaveMeasurementId: (newMeasurementId: string) => Promise<void>;
  setIsPageEdited: (isPageEdited: boolean) => void;
  setIsMeasurementIDEdited: (isMeasurementIDEdited: boolean) => void;
}

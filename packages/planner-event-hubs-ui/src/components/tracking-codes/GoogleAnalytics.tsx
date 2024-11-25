import React, { useEffect, useRef, useState } from 'react';
import { TrackingCodesStyle } from '@components/tracking-codes/styles';
import { useStyle } from '@hooks/useStyle';
import { isValidMeasurementId } from '@utils/measurementIdValidation';
import { EditMeasurementId } from '@components/tracking-codes/EditMeasurementId';
import { ViewMeasurementId } from '@components/tracking-codes/ViewMeasurementId';
import CardContainer from '@components/common/CardContainer';
import { useTranslate } from 'nucleus-text';

export function GoogleAnalytics({
  measurementId,
  editMeasurementId,
  setEditMeasurementId,
  cardDisabled,
  setIsMeasurementIDEdited,
  onSaveMeasurementId,
  setIsPageEdited
}: Props): JSX.Element {
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

  const onEdit = () => {
    setEditMeasurementId(true);
  };

  const onCancel = () => {
    setHasInvalidId(false);
    setEditMeasurementId(false);
    setIsPageEdited(false);
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
        onEdit={onEdit}
        onSubmit={onSave}
        onCancel={onCancel}
        enabled={editMeasurementId}
        disabled={cardDisabled}
        editAccessibilityLabel={translate('google_analytics_edit_button_label')}
        saveAccessibilitylabel={translate('google_analytics_save_button_label')}
        cancelAccessibilitylabel={translate('google_analytics_cancel_button_label')}
      >
        <h2 css={styles.headerContainer}>{translate('google_analytics_set_id_header')}</h2>
        <p css={styles.descriptionStyle}>{translate('google_analytics_sub_header')}</p>
        {editMeasurementId ? (
          <EditMeasurementId
            originalMeasurementId={measurementId}
            hasInvalidId={hasInvalidId}
            setHasInvalidId={setHasInvalidId}
            onSave={onSave}
            setIsMeasurementIDEdited={setIsMeasurementIDEdited}
            ref={measurementRef}
            setIsPageEdited={setIsPageEdited}
          />
        ) : (
          <ViewMeasurementId measurementId={measurementId} />
        )}
      </CardContainer>
    </div>
  );
}

interface Props {
  measurementId: string;
  editMeasurementId: boolean;
  setEditMeasurementId: (value: boolean) => void;
  cardDisabled: boolean;
  onSaveMeasurementId: (newMeasurementId: string) => Promise<void>;
  setIsPageEdited: (isPageEdited: boolean) => void;
  setIsMeasurementIDEdited: (isMeasurementIDEdited: boolean) => void;
}

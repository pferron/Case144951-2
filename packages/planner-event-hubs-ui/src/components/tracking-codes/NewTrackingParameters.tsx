import React, { useEffect, useState } from 'react';
import { useTranslate } from 'nucleus-text';
import CardContainer from '@components/common/CardContainer';
import { useStyle } from '@hooks/useStyle';
import { Config, UtmOverride } from '@cvent/planner-event-hubs-model/types';
import Button from '@cvent/carina/components/Button';
import { Col } from '@cvent/carina/components/Col';
import { isEqual } from 'lodash';
import { CodeSnippetsStyle, TrackingParametersStyle } from './styles';
import { EditTrackingParameters } from './EditTrackingParameters';

interface Props {
  trackingParametersdata?: Array<UtmOverride>;
  editTrackingParameters?: boolean;
  setEditTrackingParameters?: (val: boolean) => void;
  onSave?: (added: Array<UtmOverride>) => void;
  onDelete?: (key: string) => void;
  existingParam?: Config;
  hubConfig?: Config;
  setExistingParam?: (configData) => void;
  setIsEdited?: (isPageEdited: boolean) => void;
  allowCodeSnippets?: boolean;
  allowGoogleAnalytics?: boolean;
  isEdited?: boolean;
  setIsPageEdited: (isPageEdited: boolean) => void;
}

function NewTrackingParameters({
  trackingParametersdata,
  editTrackingParameters,
  setEditTrackingParameters,
  isEdited,
  onSave,
  onDelete,
  existingParam,
  setExistingParam,
  setIsEdited,
  hubConfig,
  allowCodeSnippets,
  allowGoogleAnalytics,
  setIsPageEdited
}: Props): React.JSX.Element {
  const { translate } = useTranslate();
  const styles = useStyle(CodeSnippetsStyle);

  const { headerContainer, descriptionStyle } = useStyle(TrackingParametersStyle);

  const [trackingParametersList, setTrackingParametersList] = useState(trackingParametersdata);

  const onSaveForm = (): void => {
    onSave(trackingParametersList);
    setIsEdited(false);
  };

  useEffect(() => {
    if (
      isEqual(trackingParametersdata, trackingParametersList) &&
      isEqual(hubConfig?.utmOverride, existingParam.utmOverride)
    ) {
      setIsEdited(false);
    } else {
      setIsEdited(true);
    }
  }, [trackingParametersdata, trackingParametersList, hubConfig?.utmOverride, existingParam.utmOverride, setIsEdited]);

  return (
    <div css={[styles.bodyListStyle, { marginTop: allowGoogleAnalytics || allowCodeSnippets ? 0 : '1.5rem' }]}>
      <CardContainer
        testID="tracking-parameters"
        enabled={editTrackingParameters}
        saveAccessibilitylabel={translate('tracking_parameters_save_button_label')}
        cancelAccessibilitylabel={translate('edit_tracking_parameters_cancel_button_label')}
        editAccessibilityLabel={translate('tracking_parameters_edit_button_label')}
      >
        <Col css={styles.saveButtonStyle} padding={{ paddingLeft: 0 }}>
          <h2 css={headerContainer}>{translate('add_url_tracking_parameters_text')}</h2>
          <Button
            text={translate('tracking_codes_save_button')}
            appearance="filled"
            size="s"
            disabled={!isEdited}
            onClick={onSaveForm}
            aria-label={translate('tracking_codes_save_button')}
            testID="tracking-parameter-card-save-button"
          />
        </Col>
        <div css={descriptionStyle}>{translate('tracking_parameters_description')}</div>
        <EditTrackingParameters
          setIsEdited={setIsEdited}
          setTrackingParametersList={setTrackingParametersList}
          trackingParametersList={trackingParametersList}
          editTrackingParameters
          setEditTrackingParameters={setEditTrackingParameters}
          onDelete={onDelete}
          existingParam={existingParam}
          setExistingParam={setExistingParam}
          setIsPageEdited={setIsPageEdited}
        />
      </CardContainer>
    </div>
  );
}

export default NewTrackingParameters;

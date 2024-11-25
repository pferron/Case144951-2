import React, { useState } from 'react';
import { useTranslate } from 'nucleus-text';
import CardContainer from '@components/common/CardContainer';
import { useStyle } from '@hooks/useStyle';
import { Config, UtmOverride } from '@cvent/planner-event-hubs-model/types';
import { CodeSnippetsStyle, TrackingParametersStyle } from './styles';
import { ViewTrackingParameters } from './ViewTrackingParameters';
import { EditTrackingParameters } from './EditTrackingParameters';

interface Props {
  trackingParametersdata?: Array<UtmOverride>;
  editTrackingParameters?: boolean;
  setEditTrackingParameters?: (val: boolean) => void;
  cardDisabled?: boolean;
  onSave?: (added: Array<UtmOverride>) => void;
  onDelete?: (key: string) => void;
  existingParam?: Config;
  hubConfig?: Config;
  setExistingParam?: (configData) => void;
  setIsEdited?: (isPageEdited: boolean) => void;
  allowCodeSnippets?: boolean;
  allowGoogleAnalytics?: boolean;
  setIsPageEdited: (isPageEdited: boolean) => void;
}

function TrackingParameters({
  trackingParametersdata,
  editTrackingParameters,
  setEditTrackingParameters,
  cardDisabled,
  onSave,
  onDelete,
  existingParam,
  setExistingParam,
  setIsEdited,
  hubConfig,
  allowCodeSnippets,
  allowGoogleAnalytics,
  setIsPageEdited
}: Props): JSX.Element {
  const { translate } = useTranslate();
  const styles = useStyle(CodeSnippetsStyle);

  const { headerContainer, descriptionStyle } = useStyle(TrackingParametersStyle);

  const onEdit = (): void => {
    setEditTrackingParameters(true);
    setTrackingParametersList(trackingParametersdata);
  };
  const [trackingParametersList, setTrackingParametersList] = useState(trackingParametersdata);

  const onCancelOrSave = (): void => {
    setEditTrackingParameters(false);
    setTrackingParametersList(trackingParametersdata);
    setExistingParam(hubConfig);
    setIsPageEdited(false);
  };

  const onSaveForm = (): void => {
    onSave(trackingParametersList);
    setIsPageEdited(false);
  };

  return (
    <div css={[styles.bodyListStyle, { marginTop: allowGoogleAnalytics || allowCodeSnippets ? 0 : '1.5rem' }]}>
      <CardContainer
        testID="tracking-parameters"
        onCancel={onCancelOrSave}
        onSubmit={onSaveForm}
        onEdit={onEdit}
        disabled={cardDisabled}
        enabled={editTrackingParameters}
        saveAccessibilitylabel={translate('tracking_parameters_save_button_label')}
        cancelAccessibilitylabel={translate('edit_tracking_parameters_cancel_button_label')}
        editAccessibilityLabel={translate('tracking_parameters_edit_button_label')}
      >
        <h2 css={headerContainer}>{translate('add_url_tracking_parameters_text')}</h2>
        <div css={descriptionStyle}>{translate('tracking_parameters_description')}</div>
        {editTrackingParameters ? (
          <EditTrackingParameters
            setIsEdited={setIsEdited}
            setTrackingParametersList={setTrackingParametersList}
            trackingParametersList={trackingParametersList}
            editTrackingParameters={editTrackingParameters}
            setEditTrackingParameters={setEditTrackingParameters}
            onDelete={onDelete}
            existingParam={existingParam}
            setExistingParam={setExistingParam}
            setIsPageEdited={setIsPageEdited}
          />
        ) : (
          <ViewTrackingParameters trackingParameterData={trackingParametersdata} existingParam={hubConfig} />
        )}
      </CardContainer>
    </div>
  );
}

export default TrackingParameters;

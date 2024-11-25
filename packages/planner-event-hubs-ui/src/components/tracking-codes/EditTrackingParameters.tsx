import React, { Dispatch, SetStateAction, useCallback, useState } from 'react';
import { TrackingParametersStyle } from '@components/tracking-codes/styles';
import { useStyle } from '@hooks/useStyle';
import { useTranslate } from 'nucleus-text';
import Table, { TableColumn } from '@cvent/carina/components/Table';
import useBreakpoints from '@hooks/useBreakpoints';
import Button from '@cvent/carina/components/Button';
import { EditPencilIcon, TrashIcon } from '@cvent/carina/components/Icon';
import { ViewChannelsStyle } from '@components/channels/style';
import { Config, UtmOverride } from '@cvent/planner-event-hubs-model/types';
import Row from '@cvent/carina/components/Row';
import Col from '@cvent/carina/components/Col';
import { RadioGroup } from '@cvent/carina/components/RadioGroup';
import { MAX_TRACKING_PARAMETERS, duplicateKeyChoices } from '@utils/constants';
import Tooltip from '@cvent/carina/components/Tooltip';
import AddTrackingParameterModal from './AddTrackingParameterModal';
import TrackingParameterDeleteModal from './TrackingParameterDeleteModal';

export function EditTrackingParameters({
  trackingParametersList,
  setTrackingParametersList,
  editTrackingParameters,
  setEditTrackingParameters,
  onDelete,
  setExistingParam,
  existingParam,
  setIsEdited,
  setIsPageEdited
}: Props): JSX.Element {
  const { translate } = useTranslate();
  const convertedParams = trackingParametersList?.map(obj => ({ ...obj, rowName: `${obj.key}` }));
  const { isMobileOrTablet } = useBreakpoints();
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [trackingParamDelete, setTrackingParamDelete] = useState<string>(null);
  const { tableFont, trashContainer, footer } = useStyle(ViewChannelsStyle);
  const { headerContainer, duplicateKeyDescriptionStyle, noParametersTextStyle } = useStyle(TrackingParametersStyle);
  const [isOpen, setIsOpen] = useState(false);
  const [editParametersKeyAndValue, setEditParametersKeyAndValue] = useState({ key: '', value: '' });

  const handleDeleteTrackingParameter = () => {
    setTrackingParametersList(trackingParametersList.filter(row => row.key !== trackingParamDelete));
    setIsPageEdited(true);
    setDeleteModal(false);
    onDelete(trackingParamDelete);
  };

  const keyCellRenderer = useCallback(
    (_cellData, { rowData }) => {
      if (!rowData.key) {
        return <p css={tableFont}>{rowData.key}</p>;
      }
      return <p css={tableFont}>{`${rowData.key}`}</p>;
    },
    [tableFont]
  );

  const valueCellRenderer = useCallback(
    (_cellData, { rowData }) => {
      const trashIcon = () => (
        <div css={{ marginLeft: 'auto' }}>
          <Button
            appearance="ghost"
            icon={EditPencilIcon}
            testID={`pencil-icon-${rowData.rowName}`}
            aria-label={translate('tracking_parameters_edit_icon_label')}
            onClick={() => {
              setEditParametersKeyAndValue({ key: rowData.key, value: rowData.value });
              setIsOpen(true);
            }}
          />
          <Button
            variant="danger"
            appearance="ghost"
            icon={TrashIcon}
            testID={`trash-icon-${rowData.rowName}`}
            aria-label={translate('tracking_parameters_list_trash_label')}
            onClick={() => {
              setDeleteModal(true);
              setTrackingParamDelete(rowData.rowName);
              setEditTrackingParameters(true);
            }}
          />
        </div>
      );
      if (editTrackingParameters) {
        return (
          <div css={[trashContainer, tableFont]}>
            <p>{rowData.value}</p>
            {trashIcon()}
          </div>
        );
      }
      return <p>{rowData.value}</p>;
    },
    [editTrackingParameters, tableFont, trashContainer, setEditTrackingParameters, translate]
  );
  const [submittedParams, setSubmittedParams] = useState(false);

  const isTooltipEnabled = trackingParametersList.length >= MAX_TRACKING_PARAMETERS;

  const trigger = useCallback(
    (handleOpen, handleClose): JSX.Element => (
      <div
        onMouseOver={isTooltipEnabled ? handleOpen : null}
        onMouseLeave={isTooltipEnabled ? handleClose : null}
        onMouseOutCapture={isTooltipEnabled ? handleClose : null}
        onFocus={isTooltipEnabled ? handleOpen : null}
        onBlur={isTooltipEnabled ? handleClose : null}
      >
        <Button
          text={translate('Add-Tracking-Parameters-Button')}
          appearance="lined"
          onClick={() => {
            setIsOpen(true);
            setSubmittedParams(false);
          }}
          testID="add-tracking-parameters-btn"
          disabled={isTooltipEnabled}
        />
      </div>
    ),
    [isTooltipEnabled, translate]
  );

  return (
    <div>
      <div>
        <div css={{ paddingBottom: '1rem', display: 'inline-block' }}>
          <Tooltip
            placement="bottom-start"
            portal
            text={translate('tracking_parameters_add_button_tooltip')}
            trigger={trigger}
            preventOverflow={false}
          />

          <AddTrackingParameterModal
            submittedParams={submittedParams}
            setSubmittedParams={setSubmittedParams}
            setIsEdited={setIsEdited}
            isModalOpen={isOpen}
            setIsModalOpen={setIsOpen}
            setTrackingParametersList={setTrackingParametersList}
            trackingParamsList={trackingParametersList}
            setIsPageEdited={setIsPageEdited}
            editParametersKeyAndValue={editParametersKeyAndValue}
            setEditParametersKeyAndValue={setEditParametersKeyAndValue}
          />
        </div>
      </div>
      <Table
        empty={
          trackingParametersList.length === 0 && (
            <div css={noParametersTextStyle}>{translate('zero_tracking_parameters_text')}</div>
          )
        }
        data={convertedParams}
        testID="tracking-parameters-table"
        externallySorted
      >
        <TableColumn
          name="key"
          dataKey="key"
          heading={translate('tracking_parameters_key')}
          minWidth={(isMobileOrTablet && 80) || 320}
          cellRenderer={keyCellRenderer}
        />
        <TableColumn
          name="value"
          dataKey="value"
          heading={translate('tracking_parameters_value')}
          hideWhenCollapsed
          cellRenderer={valueCellRenderer}
        />
      </Table>
      <div css={footer}>
        {translate('TrackingParameters-NumAssigned-Footer', {
          numParametersAssigned: trackingParametersList.length.toString(),
          totalNumParameters: MAX_TRACKING_PARAMETERS
        })}
      </div>
      <Row>
        <Col padding={{ paddingTop: 32, paddingLeft: 0 }}>
          <h3 css={headerContainer}>{translate('tracking_params_duplicate_key_names')}</h3>
          <div css={duplicateKeyDescriptionStyle}>{translate('tracking_params_duplicate_key_names_description')}</div>
          <RadioGroup
            disabled={trackingParametersList.length === 0}
            id="duplicateKeyNames"
            name="Duplicate Key Names"
            options={[
              {
                label: translate('tracking_params_existing'),
                value: duplicateKeyChoices.EXISTING
              },
              {
                label: translate('tracking_params_custom'),
                value: duplicateKeyChoices.CUSTOM
              }
            ]}
            selected={existingParam?.utmOverride ? existingParam?.utmOverride : duplicateKeyChoices.EXISTING}
            onUpdate={selectedOption => {
              setExistingParam(prev => ({ ...prev, utmOverride: selectedOption }));
              setIsPageEdited(true);
            }}
            testID="duplicate-key-names-section"
          />
        </Col>
      </Row>
      {deleteModal && (
        <TrackingParameterDeleteModal
          setIsModalOpen={setDeleteModal}
          deleteTrackingParameter={handleDeleteTrackingParameter}
        />
      )}
    </div>
  );
}

interface Props {
  trackingParametersList: Array<UtmOverride>;
  setTrackingParametersList: Dispatch<SetStateAction<UtmOverride[]>>;
  editTrackingParameters: boolean;
  setEditTrackingParameters: (val: boolean) => void;
  onDelete: (key: string) => void;
  setExistingParam: (configData) => void;
  existingParam: Config;
  setIsEdited: (isPageEdited: boolean) => void;
  setIsPageEdited: (isPageEdited: boolean) => void;
}

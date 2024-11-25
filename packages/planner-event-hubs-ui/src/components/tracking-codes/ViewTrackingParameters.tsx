import React, { useCallback } from 'react';
import { TrackingParametersStyle } from '@components/tracking-codes/styles';
import { useStyle } from '@hooks/useStyle';
import { useTranslate } from 'nucleus-text';
import Table, { TableColumn } from '@cvent/carina/components/Table';
import { Config, UtmOverride } from '@cvent/planner-event-hubs-model/types';
import Row from '@cvent/carina/components/Row';
import Col from '@cvent/carina/components/Col';
import { duplicateKeyChoices } from '@utils/constants';

export function ViewTrackingParameters({ trackingParameterData, existingParam }: Props): JSX.Element {
  const { translate } = useTranslate();
  const convertedParams = trackingParameterData.map(obj => ({ ...obj, rowName: `${obj.key}` }));
  const { noParametersTextStyle, headerContainer, duplicateKeyDescriptionStyle, tableFont } =
    useStyle(TrackingParametersStyle);

  const keyCellRenderer = useCallback(
    (_cellData, { rowData }) => {
      if (!rowData.key) {
        return <p css={tableFont}>{`${rowData.key}`}</p>;
      }
      return <p css={tableFont}>{`${rowData.key}`}</p>;
    },
    [tableFont]
  );

  const valueCellRenderer = useCallback(
    (_cellData, { rowData }) => {
      if (!rowData.value) {
        return <p css={tableFont}>{`${rowData.value}`}</p>;
      }
      return <p css={tableFont}>{`${rowData.value}`}</p>;
    },
    [tableFont]
  );

  return (
    <div>
      <Table
        empty={
          trackingParameterData.length === 0 && (
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
          cellRenderer={keyCellRenderer}
        />
        <TableColumn
          name="value"
          dataKey="value"
          heading={translate('tracking_parameters_value')}
          cellRenderer={valueCellRenderer}
        />
      </Table>
      <Row>
        {trackingParameterData.length > 0 && (
          <Col padding={{ paddingTop: 32, paddingLeft: 0 }}>
            <h3 css={headerContainer}>{translate('tracking_params_duplicate_key_names')}</h3>
            <div css={duplicateKeyDescriptionStyle}>
              {existingParam?.utmOverride === duplicateKeyChoices.EXISTING
                ? translate('tracking_params_existing')
                : translate('tracking_params_custom')}
            </div>
          </Col>
        )}
      </Row>
    </div>
  );
}

interface Props {
  trackingParameterData: Array<UtmOverride>;
  existingParam: Config;
}

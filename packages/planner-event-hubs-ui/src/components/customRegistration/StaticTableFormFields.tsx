import React from 'react';
import CheckBox from '@cvent/carina/components/Checkbox/Checkbox';
import { Row } from '@cvent/carina/components/Row';
import { Col } from '@cvent/carina/components/Col';
import { useStyle } from '@hooks/useStyle';
import { Table, TableColumn } from '@cvent/carina/components/Table';
import { StaticFormFieldsStyle } from '@components/customRegistration/style';
import { useTranslate } from 'nucleus-text';
import { FieldData } from '@components/customRegistration/FormEditorCard';
import { formContent, LockedContactFields } from '@components/customRegistration/FormCustomisationConstants';

function StaticTableFormFields(): JSX.Element {
  const styles = useStyle(StaticFormFieldsStyle);
  const { translate } = useTranslate();

  const renderRowActions = (fieldData: FieldData, index: number): JSX.Element => {
    const reqOrOptionalText = fieldData.required
      ? translate('custom_registration_form_required_text')
      : translate('custom_registration_form_optional_text');
    return (
      <Row justifyContent="flex-end">
        <Col width="content">
          <div css={styles.checkboxLabelStyle}>
            <div css={{ paddingRight: '0.5rem', marginRight: '-1.5rem' }}>
              <CheckBox id={`custom-reg-static-field-checkbox-${index}`} checked disabled>
                <span css={styles.checkBoxLabelText}>{reqOrOptionalText}</span>
              </CheckBox>
            </div>
          </div>
        </Col>
      </Row>
    );
  };

  const tableRowData = (fieldData: FieldData) => (
    <h3 css={fieldData.isLocked ? styles.tableLabelStyleLockedFields : styles.tableLabelStyle}>
      {translate(formContent.get(fieldData.code))}
    </h3>
  );

  const tableData = LockedContactFields.map((fieldData, index) => ({
    fieldName: tableRowData(fieldData),
    rowName: `${index}`,
    actions: renderRowActions(fieldData, index)
  }));

  return (
    <Table css={styles.nonInteractiveTable} hideHeader hideSideBorders data={tableData} paddingMode="condensed">
      <TableColumn name="fieldName" />
      <TableColumn name="actions" minWidth={1} />
    </Table>
  );
}

export default StaticTableFormFields;

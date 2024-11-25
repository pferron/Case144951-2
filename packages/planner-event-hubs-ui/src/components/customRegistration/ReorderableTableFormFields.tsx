import React, { Dispatch, SetStateAction } from 'react';
import CheckBox from '@cvent/carina/components/Checkbox/Checkbox';
import { Row } from '@cvent/carina/components/Row';
import { Col } from '@cvent/carina/components/Col';
import { useStyle } from '@hooks/useStyle';
import { ReorderableTableFormFieldsStyle } from '@components/customRegistration/style';
import { useTranslate } from 'nucleus-text';
import { useTable } from '@cvent/carina/components/Table/useTable';
import { DraggableTableProps } from '@cvent/carina/components/Table/DraggableTable';
import dynamic from 'next/dynamic';
import { FieldData } from '@components/customRegistration/FormEditorCard';
import { TrashIcon } from '@cvent/carina/components/Icon';
import { Button } from '@cvent/carina/components/Button';
import { formContent } from '@components/customRegistration/FormCustomisationConstants';

const DraggableTable = dynamic<DraggableTableProps>(() =>
  import('@cvent/carina/components/Table/DraggableTable').then(mod => mod.DraggableTable)
);

function ReorderableTableFormFields({ selectedFields, setSelectedFields }: Props): JSX.Element {
  const styles = useStyle(ReorderableTableFormFieldsStyle);
  const { translate } = useTranslate();

  function onChangeCheckbox(checked: boolean, fieldData: FieldData) {
    setSelectedFields(prevState =>
      [...prevState].map(obj => ({
        code: obj.code,
        order: obj.order,
        required: fieldData.code === obj.code ? checked : obj.required,
        included: obj.included
      }))
    );
  }

  const onClickTrash = (fieldData: FieldData) => {
    setSelectedFields(prevState => [...prevState].filter(obj => fieldData.code !== obj.code));
  };

  const renderRowActions = (fieldData: FieldData, index: number): JSX.Element => {
    const requiredText = translate('custom_registration_form_required_text');
    return (
      <Row justifyContent="flex-end">
        <Col width="content" padding={0}>
          <div css={styles.checkboxLabelStyle}>
            <div css={styles.editCheckBoxStyles}>
              <CheckBox
                id={`custom-reg-reorderable-field-checkbox-${index}`}
                checked={fieldData.required}
                disabled={false}
                onChange={({ target }: React.ChangeEvent<HTMLInputElement>) =>
                  onChangeCheckbox(target.checked, fieldData)
                }
              >
                {requiredText}
              </CheckBox>
            </div>
            <Button
              css={styles.trashButtonStyles}
              appearance="ghost"
              variant="neutral"
              aria-label={translate('custom_registration_form_delete_field_button_aria_text')}
              icon={TrashIcon}
              onClick={() => onClickTrash(fieldData)}
              testID={`custom-reg-reorderable-delete-button-${fieldData.code}`}
            />
          </div>
        </Col>
      </Row>
    );
  };

  const tableData = selectedFields.map((fieldData, index) => ({
    rowName: `${index}`,
    fieldName: <h3 css={styles.tableLabelStyle}>{translate(formContent.get(fieldData.code))}</h3>,
    order: fieldData.order,
    isRequired: fieldData.required,
    fieldCode: fieldData.code,
    actions: renderRowActions(fieldData, index)
  }));

  const [Table, TableColumn] = useTable({
    data: tableData,
    isDraggable: true,
    DraggableTable
  });

  return (
    <Table
      css={styles.appendedTable}
      hideHeader
      hideSideBorders
      testID="reorderable-table-fields"
      allowDragAndDrop
      paddingMode="condensed"
      rowMode="drag-and-drop"
      onDragEnd={({ fromIndex, toIndex }: { fromIndex?: number; toIndex?: number }) => {
        const existingData = [...tableData];
        existingData.splice(toIndex, 0, existingData.splice(fromIndex, 1)[0]);
        const newState: FieldData[] = existingData.map(
          field =>
            ({
              code: field.fieldCode,
              order: field.order,
              required: field.isRequired
            } as FieldData)
        );
        setSelectedFields(newState);
      }}
    >
      <TableColumn name="fieldName" minWidth={1} />
      <TableColumn name="actions" minWidth={1} width={230} />
    </Table>
  );
}
interface Props {
  selectedFields: FieldData[];
  setSelectedFields: Dispatch<SetStateAction<FieldData[]>>;
}

export default ReorderableTableFormFields;

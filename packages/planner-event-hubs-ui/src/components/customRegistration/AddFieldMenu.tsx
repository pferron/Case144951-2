import React, { Dispatch, SetStateAction, useMemo } from 'react';
import Flyout from '@cvent/carina/components/Flyout';
import Button from '@cvent/carina/components/Button';
import Magazine from '@cvent/carina/components/Magazine';
import { useTheme } from '@cvent/carina/components/ThemeProvider';
import ChevronDown from '@cvent/carina/components/Icon/ChevronDown';
import { useTranslate } from 'nucleus-text';
import { useStyle } from '@hooks/useStyle';
import { AddFieldMenuStyle } from '@components/customRegistration/style';
import { FieldData } from '@components/customRegistration/FormEditorCard';
import { formContent, StandardContactFields } from '@components/customRegistration/FormCustomisationConstants';

interface AddFieldMenuProps {
  setSelectedFields: Dispatch<SetStateAction<FieldData[]>>;
  selectedFields: FieldData[];
}

export default function AddFieldMenu({ setSelectedFields, selectedFields }: AddFieldMenuProps): JSX.Element {
  const theme = useTheme();
  const { translate } = useTranslate();
  const { magazineStyle, addFieldButtonStyle } = useStyle(AddFieldMenuStyle);

  const fieldOptions = useMemo(
    () =>
      StandardContactFields.map(fieldData => ({
        value: fieldData.code,
        label: translate(formContent.get(fieldData.code)),
        disabled: !!selectedFields.some(field => fieldData.code === field.code)
      })),
    [selectedFields, translate]
  );

  function handleSelect(value: string) {
    setSelectedFields(prevState =>
      [...prevState].concat({
        code: value,
        order: prevState.length,
        required: false,
        isLocked: false,
        included: true
      })
    );
  }

  const buttonTrigger = (handleClick): JSX.Element => (
    <Button
      text={translate('custom_registration_form_add_field_button_text')}
      appearance="lined"
      icon={ChevronDown}
      iconAlign="end"
      onClick={handleClick}
      disabled={false}
      testID="custom-registration-form-add-field-button"
      css={addFieldButtonStyle}
    />
  );

  const content = (closeFlyout): JSX.Element => (
    <Magazine
      testID="registration-form-field-magazine"
      magazineStyleObject={magazineStyle}
      handleClose={closeFlyout}
      onUpdate={({ value }): void => {
        handleSelect(value);
        closeFlyout();
      }}
      options={[...fieldOptions]}
      theme={theme}
      focusOnMount
    />
  );

  return (
    <Flyout trigger={buttonTrigger} content={content} arrowSize={null} noPadding portal placement="bottom-start" />
  );
}

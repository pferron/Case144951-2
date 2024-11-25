import React, { useCallback, useState } from 'react';
import { useTranslate } from 'nucleus-text';
import { Textbox, useField, useWatchField } from '@cvent/carina/components/Forms';
import { Col } from '@cvent/carina/components/Col';
import { Row } from '@cvent/carina/components/Row';
import { Button } from '@cvent/carina/components/Button';
import FormElement from '@cvent/carina/components/FormElement';
import { injectTestId } from '@cvent/nucleus-test-automation';
import { PREFILLED_PARAMS, UTM_FORBIDDEN_KEY, UTM_KEY_MAX_LENGTH, UTM_VALUE_MAX_LENGTH } from '@utils/constants';

export function ParameterFormData({
  onCancel,
  setIsEdited,
  currentKeyList,
  submittedParams,
  editParametersKeyAndValue
}: Props): React.JSX.Element {
  const { translate } = useTranslate();

  const parameterKey = 'key';
  const parameterVal = 'value';

  const { [parameterKey]: parameterKeyValue = '' } = useWatchField([parameterKey]);
  const { [parameterVal]: parameterValValue = '' } = useWatchField([parameterVal]);
  const { fieldValue: trackingParamKey, setFieldValue: setTrackingParamKey } = useField({
    name: parameterKey
  });
  const keyString = trackingParamKey as string;

  const keyInvalid =
    currentKeyList.some(val => val.toLowerCase() === keyString?.toLowerCase()) &&
    keyString !== editParametersKeyAndValue.key;
  const forbiddenKey = keyString?.toLocaleLowerCase().startsWith(UTM_FORBIDDEN_KEY);
  const keyNotAllowed = PREFILLED_PARAMS.includes(keyString);

  const [keyTextLength, setKeyTextLength] = useState(0);
  const [valueTextLength, setValueTextLength] = useState(0);

  const saveOrAddBtnText = editParametersKeyAndValue.key ? 'save_button_label' : 'add_button_label';
  const keyUpdateTransform = useCallback(
    (key: string): string => {
      setIsEdited(true);
      setTrackingParamKey(key);
      setKeyTextLength(key.length || 0);
      return key.trimStart();
    },
    [setIsEdited, setTrackingParamKey]
  );

  const valueUpdateTransform = useCallback(
    (value: string): string => {
      setIsEdited(true);
      setValueTextLength(value.length || 0);
      return value.trimStart();
    },
    [setIsEdited]
  );

  return (
    <>
      <Textbox
        id="tracking-parameter-key-form-input-key"
        name={parameterKey}
        maxLength={UTM_KEY_MAX_LENGTH}
        label={translate('tracking-parameter-key')}
        hasError={(keyInvalid && !submittedParams) || forbiddenKey || keyNotAllowed}
        onUpdateTransform={keyUpdateTransform}
        messages={translate('characters_left_label', {
          characterCount: UTM_KEY_MAX_LENGTH - keyTextLength
        })}
        isRequired
      />
      {keyInvalid && !submittedParams && (
        <div css={{ paddingBottom: '1rem', marginTop: '-1rem' }}>
          <FormElement.Message
            text={translate('tracking_parameter_key_already_taken')}
            {...injectTestId('same-key-error')}
            type="error"
          />
        </div>
      )}
      {forbiddenKey && (
        <div css={{ paddingBottom: '1rem', marginTop: '-1rem' }}>
          <FormElement.Message
            text={translate('tracking_parameter_forbidden_key')}
            {...injectTestId('forbidden-key-error')}
            type="error"
          />
        </div>
      )}
      {keyNotAllowed && (
        <div css={{ paddingBottom: '1rem', marginTop: '-1rem' }}>
          <FormElement.Message
            text={translate('tracking_parameter_key_not_allowed')}
            {...injectTestId('key-not-allowed-error')}
            type="error"
          />
        </div>
      )}
      <Textbox
        id="tracking-parameter-key-form-input-value"
        name={parameterVal}
        maxLength={UTM_VALUE_MAX_LENGTH}
        label={translate('tracking-parameter-value')}
        onUpdateTransform={valueUpdateTransform}
        messages={translate('characters_left_label', {
          characterCount: UTM_VALUE_MAX_LENGTH - valueTextLength
        })}
        isRequired
      />
      <Row margin={-8} justifyContent="flex-end">
        <Col width="content">
          <Button
            type="reset"
            text={translate('cancel_button_label')}
            appearance="ghost"
            aria-label={translate('cancel_button_label')}
            testID="tracking-parameters-cancel-button"
            onClick={onCancel}
          />
        </Col>
        <Col width="content">
          <Button
            type="submit"
            text={translate(saveOrAddBtnText)}
            aria-label={translate(saveOrAddBtnText)}
            appearance="filled"
            testID="add-tracking-parameters-save-button"
            disabled={
              parameterKeyValue.length === 0 ||
              parameterValValue.length === 0 ||
              keyInvalid ||
              forbiddenKey ||
              keyNotAllowed
            }
          />
        </Col>
      </Row>
    </>
  );
}

interface Props {
  onCancel: () => void;
  setIsEdited: (isPageEdited: boolean) => void;
  currentKeyList: Array<string>;
  submittedParams: boolean;
  setSubmittedParams: (isParamsAdded: boolean) => void;
  editParametersKeyAndValue: { key: string; value: string };
}

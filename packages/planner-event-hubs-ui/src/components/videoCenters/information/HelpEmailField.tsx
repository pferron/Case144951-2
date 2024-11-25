import Col from '@cvent/carina/components/Col';
import React, { useMemo } from 'react';
import Row from '@cvent/carina/components/Row';
import FormElement from '@cvent/carina/components/FormElement/FormElement';
import { HelpCirclePopper } from '@components/tracking-codes/HelpCirclePopper';
import { useTranslate } from 'nucleus-text';
import { RadioGroup, Textbox, useField, useWatchField } from '@cvent/carina/components/Forms';
import { CENTER_EMAIL_MAX_LENGTH, TextContent } from '@utils/constants';
import { useStyle } from '@hooks/useStyle';
import { CommonFormStyles } from '@components/videoCenters/style';
import isEmail from 'validator/lib/isEmail';

interface Props {
  isEdit: boolean;
  setTempValues: (tempValues: object) => void;
  setHasErrorForBasicInformation?: (hasErrorForBasicInformation: boolean) => void;
}

function HelpEmailField({ isEdit, setTempValues, setHasErrorForBasicInformation }: Props): JSX.Element {
  const { translate } = useTranslate();
  const { tabletWidth, popOverStyles } = useStyle(CommonFormStyles);
  const dependencyValues = useWatchField(['ownerEmail', 'displayHelpEmail']);
  const { fieldValue: helpEmail, setFieldValue } = useField({
    name: 'helpEmailAddress'
  });
  const showHelpEmail = useMemo(
    () => !isEdit || Boolean(dependencyValues.displayHelpEmail),
    [dependencyValues.displayHelpEmail, isEdit]
  );

  const emailValidation = email => {
    if (isEmail(email)) {
      setHasErrorForBasicInformation(false);
      return undefined;
    }
    setHasErrorForBasicInformation(true);
    return [translate('video_hub_form_ownerEmail_error')];
  };
  const handleChange = values => {
    let emailToSet = helpEmail;

    if (values.target.textContent === TextContent.YES) {
      if (!emailToSet) {
        emailToSet = dependencyValues.ownerEmail;
        setFieldValue(emailToSet);
      }
      setTempValues(prevValues => ({
        ...prevValues,
        helpEmailAddress: emailToSet,
        displayHelpEmail: 1
      }));
    } else {
      setTempValues(prevValues => ({
        ...prevValues,
        displayHelpEmail: 0,
        helpEmailAddress: null
      }));
    }
  };

  const displayHelpEmailLabel: JSX.Element = (
    <div id="display-help-email-label" css={{ display: 'flex', gap: 8 }}>
      <FormElement.Label label={translate('video_center_display_help_email_label')} labelFor="displayHelpEmail" />
      <HelpCirclePopper
        testID="video-center-help-email"
        helpText={translate('video_center_help_email_tooltip')}
        accessibilityLabel={translate('video_center_display_help_email_label')}
      />
    </div>
  );

  return (
    <div css={tabletWidth}>
      <Row margin={-8}>
        {isEdit && (
          <Col>
            <RadioGroup
              label={displayHelpEmailLabel}
              aria-labelledby="display-help-email-label"
              name="displayHelpEmail"
              id="displayHelpEmail"
              options={[
                {
                  label: translate('help_email_option_yes '),
                  value: 1
                },
                {
                  label: translate('help_email_option_no'),
                  value: 0
                }
              ]}
              onChange={handleChange}
              onUpdate={selectedOption => {
                if (!helpEmail && Boolean(selectedOption)) {
                  setFieldValue(dependencyValues.ownerEmail);
                }
              }}
              testID="help-email-radio"
            />
          </Col>
        )}
        {showHelpEmail && (
          <Col>
            <div css={popOverStyles}>
              <FormElement.Label
                label={translate('video_hub_form_help_email_label')}
                labelFor="video-center-form-help-email"
                required={isEdit}
              />
              {!isEdit && (
                <HelpCirclePopper
                  testID="video-center"
                  helpText={translate('video_center_help_email_tooltip')}
                  accessibilityLabel={translate('video_center_display_help_email_label')}
                />
              )}
            </div>
            <Textbox
              id="video-center-form-help-email"
              name="helpEmailAddress"
              label=""
              maxLength={CENTER_EMAIL_MAX_LENGTH}
              validate={emailValidation}
              readOnlyRenderer={value => value || translate('video_center_help_email_hidden_text')}
              data-dd-privacy="mask"
            />
          </Col>
        )}
      </Row>
    </div>
  );
}

export default HelpEmailField;

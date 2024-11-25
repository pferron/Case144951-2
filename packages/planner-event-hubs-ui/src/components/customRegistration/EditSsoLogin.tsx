import React from 'react';
import { RadioGroup } from '@cvent/carina/components/RadioGroup';
import { Col } from '@cvent/carina/components/Col';
import { Row } from '@cvent/carina/components/Row';
import { Form } from '@cvent/carina/components/Forms';
import FormElement from '@cvent/carina/components/FormElement/FormElement';
import { useStyle } from '@hooks/useStyle';
import { useTranslate } from 'nucleus-text';
import CardContainerEditEnabled from '@components/customRegistration/CardContainerEditEnabled';
import { LoginMethodFields } from '@components/customRegistration/FormEditorCard';
import Textbox from '@cvent/carina/components/Textbox/Textbox';
import { EditSsoLoginStyle } from '@components/customRegistration/style';
import { Placements } from '@cvent/carina/components/Popover';
import { HelpInfoToolTip } from '@components/customRegistration/HelpInfoTooltip';
import { LoginType } from '@cvent/planner-event-hubs-model/types';
import { ORGANIZATION_ID_LIMIT } from '@utils/constants';

function EditSsoLogin({ ssoSettings, setSsoSettings, isOrganisationIdValid, error, serverError }: Props): JSX.Element {
  const styles = useStyle(EditSsoLoginStyle);
  const { translate } = useTranslate();
  return (
    <CardContainerEditEnabled testID="edit-sso-login-fields">
      <div>
        <h2 css={styles.title}>{translate('sso_login_tab_text')}</h2>
        <p css={styles.infoText}>{translate('sso_login_info_text')}</p>
        <Form testID="sso-login-edit-form">
          <Row margin={{ start: -11 }}>
            <Col>
              <FormElement css={ssoSettings.loginMethod === LoginType.Sso ? { padding: '0 0 1rem 0' } : { padding: 0 }}>
                <FormElement.Label label={translate('sso_login_login_type_text')} labelFor="ssoLoginMethodRadioGroup" />
                <div css={{ display: 'flex' }}>
                  <RadioGroup
                    id="ssoLoginMethodRadioGroup"
                    name="Login Method"
                    css={{ maxWidth: 'max-content' }}
                    options={[
                      {
                        label: translate('sso_login_login_type_magic_link_option'),
                        value: LoginType.MagicLink
                      },
                      {
                        label: translate('sso_login_login_type_sso_login_option'),
                        value: LoginType.Sso
                      }
                    ]}
                    selected={ssoSettings.loginMethod}
                    onUpdate={selectedOption => {
                      setSsoSettings(prev => ({ ...prev, loginMethod: selectedOption }));
                    }}
                    testID="sso-login-method-settings-radio"
                  />
                  <HelpInfoToolTip
                    testId="magic-link-info-tooltip"
                    helpText={translate('sso_login_magic_link_tooltip')}
                    placement={Placements.topStart}
                    accessibilityLabel={translate('sso_login_magic_link_tooltip')}
                    tabIndex={ssoSettings.loginMethod === LoginType.MagicLink ? 0 : null}
                  />
                </div>
              </FormElement>
              {ssoSettings.loginMethod === LoginType.Sso && (
                <>
                  <FormElement.Label label={translate('sso_login_organisation_id_label')} labelFor="organisationId" />
                  <div css={styles.textboxStyle}>
                    <Textbox
                      id="organisationId"
                      value={ssoSettings.organisationId}
                      onChange={({ target }): void => {
                        setSsoSettings(prev => ({ ...prev, organisationId: target.value }));
                      }}
                      testID="sso-login-organisation-id"
                      hasError={serverError || (error && !isOrganisationIdValid)}
                      aria-label={translate('sso_login_organisation_id_label')}
                      maxLength={ORGANIZATION_ID_LIMIT}
                    />
                    {(serverError || (error && !isOrganisationIdValid)) && (
                      <FormElement.Message text={translate('sso_login_invalid_organisation_id_error')} type="error" />
                    )}
                  </div>
                </>
              )}
            </Col>
          </Row>
        </Form>
      </div>
    </CardContainerEditEnabled>
  );
}

interface Props {
  ssoSettings: LoginMethodFields;
  setSsoSettings: (settings) => void;
  isOrganisationIdValid: string | boolean;
  error: boolean;
  serverError: boolean;
}

export default EditSsoLogin;

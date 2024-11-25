import React from 'react';
import CardContainerEditEnabled from '@components/privacy/CardContainerEditEnabled';
import { RadioGroup } from '@cvent/carina/components/RadioGroup';
import { Col } from '@cvent/carina/components/Col';
import { Row } from '@cvent/carina/components/Row';
import { Form } from '@cvent/carina/components/Forms';
import Textbox from '@cvent/carina/components/Textbox/Textbox';
import FormElement from '@cvent/carina/components/FormElement/FormElement';
import { PrivacySettings } from '@components/privacy/type/PrivacySettings';
import { useTranslate } from 'nucleus-text';
import { useStyle } from '@hooks/useStyle';
import { EditPrivacyPolicyFieldsStyle } from '@components/privacy/style';
import { HelpCirclePopper } from '@components/tracking-codes/HelpCirclePopper';

import useBreakpoints from '@hooks/useBreakpoints';
import isURL from 'validator/lib/isURL';

function EditPrivacyPolicyFields({
  privacySettings: originalSettings,
  infoContent,
  setPrivacySettings,
  setIsPageEdited,
  error
}: Props): JSX.Element {
  const styles = useStyle(EditPrivacyPolicyFieldsStyle);
  const { isMobile } = useBreakpoints();
  const { translate } = useTranslate();

  const onChange = evt => {
    const { id, value } = evt.target;
    setPrivacySettings(prev => ({ ...prev, [id]: value }));
    setIsPageEdited(true);
  };

  // validations
  const isCventLinkTextValid =
    Boolean(originalSettings.cventPrivacyPolicyLinkText) && originalSettings.cventPrivacyPolicyLinkText.trim();
  const isPrivacyUrlValid = Boolean(originalSettings.privacyPolicyUrl) && isURL(originalSettings.privacyPolicyUrl);
  const isPrivacyLinkTextValid =
    Boolean(originalSettings.privacyPolicyLinkText) && originalSettings.privacyPolicyLinkText.trim();

  return (
    <CardContainerEditEnabled testID="edit-privacy-policy-fields">
      <div>
        <h2 css={styles.title}>{translate('privacy_policy_heading')}</h2>
        <Form testID="privacy-fields-form">
          <Row margin={{ start: -11, top: 16 }}>
            <Col>
              <FormElement>
                <FormElement.Label
                  label={translate('privacy_display_cvent_privacy')}
                  labelFor="displayCventPrivacyPolicy"
                />
                <RadioGroup
                  id="displayCventPrivacyPolicy"
                  name="Cvent Privacy Policy"
                  options={[
                    {
                      label: translate('privacy_setttings_option_yes'),
                      value: 1
                    },
                    {
                      label: translate('privacy_setttings_option_no'),
                      value: 0
                    }
                  ]}
                  selected={originalSettings.displayCventPrivacyPolicy ? 1 : 0}
                  onUpdate={selectedOption => {
                    setPrivacySettings(prev => ({ ...prev, displayCventPrivacyPolicy: Boolean(selectedOption) }));
                    setIsPageEdited(true);
                  }}
                  testID="cvent-privacy-radio"
                />
              </FormElement>
            </Col>
          </Row>

          {originalSettings.displayCventPrivacyPolicy ? (
            <Row margin={{ start: -11 }}>
              <Col width={isMobile ? 1 : 1 / 2}>
                <FormElement>
                  <div css={styles.questionContainer}>
                    <div>
                      <FormElement.Label
                        label={translate('privacy_cvent_privacy_link_text')}
                        labelFor="cventPrivacyPolicyLinkText"
                        required
                      />
                    </div>

                    <div css={styles.flyout}>
                      <HelpCirclePopper
                        testID="privacy-cvent-policy-link-text"
                        helpText={translate(infoContent.get('cventPrivacyPolicyLinkText'))}
                        accessibilityLabel={translate(infoContent.get('cventPrivacyPolicyLinkText'))}
                      />
                    </div>
                  </div>
                  <Textbox
                    id="cventPrivacyPolicyLinkText"
                    value={originalSettings.cventPrivacyPolicyLinkText || ''}
                    onChange={onChange}
                    accessibilityLabel="cvent-privacy-link-text-input"
                    hasError={error && !isCventLinkTextValid}
                    maxLength={100}
                  />
                </FormElement>
              </Col>
            </Row>
          ) : null}

          <Row margin={{ start: -11 }}>
            <Col>
              <FormElement>
                <FormElement.Label label={translate('privacy_display_your_privacy')} labelFor="displayPrivacyPolicy" />
                <RadioGroup
                  id="displayPrivacyPolicy"
                  name="Your Privacy Policy"
                  options={[
                    {
                      label: translate('privacy_setttings_option_yes'),
                      value: 1
                    },
                    {
                      label: translate('privacy_setttings_option_no'),
                      value: 0
                    }
                  ]}
                  selected={originalSettings.displayPrivacyPolicy ? 1 : 0}
                  onUpdate={selectedOption => {
                    setPrivacySettings(prev => ({ ...prev, displayPrivacyPolicy: Boolean(selectedOption) }));
                    setIsPageEdited(true);
                  }}
                  testID="your-privacy-radio"
                />
              </FormElement>
            </Col>
          </Row>

          {originalSettings.displayPrivacyPolicy ? (
            <div>
              <Row margin={{ start: -11 }}>
                <Col width={isMobile ? 1 : 1 / 2}>
                  <FormElement>
                    <FormElement.Label
                      label={translate('privacy_your_privacy_link_label')}
                      labelFor="privacyPolicyUrl"
                      required
                    />
                    <Textbox
                      id="privacyPolicyUrl"
                      value={originalSettings.privacyPolicyUrl || ''}
                      accessibilityLabel={translate('privacy_your_privacy_link_label')}
                      onChange={onChange}
                      hasError={error && !isPrivacyUrlValid}
                    />
                    {error && !isPrivacyUrlValid && (
                      <FormElement.Message text={translate('privacy_policy_invalid_url')} type="error" />
                    )}
                  </FormElement>
                </Col>
              </Row>

              <Row margin={{ start: -11 }}>
                <Col width={isMobile ? 1 : 1 / 2}>
                  <FormElement>
                    <div css={styles.questionContainer}>
                      <div>
                        <FormElement.Label
                          label={translate('privacy_your_privacy_link_text')}
                          labelFor="privacyPolicyLinkText"
                          required
                        />
                      </div>

                      <div css={styles.flyout}>
                        <HelpCirclePopper
                          testID="privacy-policy-link-text"
                          helpText={translate(infoContent.get('privacyPolicyLinkText'))}
                          accessibilityLabel={translate(infoContent.get('privacyPolicyLinkText'))}
                        />
                      </div>
                    </div>
                    <Textbox
                      id="privacyPolicyLinkText"
                      value={originalSettings.privacyPolicyLinkText || ''}
                      onChange={onChange}
                      accessibilityLabel="privacy-link-text-input"
                      hasError={error && !isPrivacyLinkTextValid}
                      maxLength={100}
                    />
                  </FormElement>
                </Col>
              </Row>
            </div>
          ) : null}
        </Form>
      </div>
    </CardContainerEditEnabled>
  );
}

interface Props {
  privacySettings: PrivacySettings;
  infoContent: Map<string, string>;
  error: boolean;
  setIsPageEdited: (isPageEdited: boolean) => void;
  setPrivacySettings: React.Dispatch<React.SetStateAction<PrivacySettings>>;
}

export default EditPrivacyPolicyFields;

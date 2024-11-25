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

import Textarea from '@cvent/carina/components/Textarea/Textarea';

import useBreakpoints from '@hooks/useBreakpoints';

function EditPrivacyPolicyFields({
  privacySettings: originalSettings,
  infoContent,
  setPrivacySettings,
  allowTermsEdit,
  setIsPageEdited,
  errorTermsOfUse
}: Props): JSX.Element {
  const styles = useStyle(EditPrivacyPolicyFieldsStyle);
  const { isMobile } = useBreakpoints();
  const { translate } = useTranslate();
  const maxCharacters = 20000;
  const onChange = evt => {
    const { id, value } = evt.target;
    setPrivacySettings(prev => ({ ...prev, [id]: value }));
    setIsPageEdited(true);
  };
  const charLeft = maxCharacters - (originalSettings.termsText?.length || 0);

  // validations
  const isTermsLinkTextValid = Boolean(originalSettings.termsLinkText) && originalSettings.termsLinkText.trim();
  const isTermsBodyValid = Boolean(originalSettings.termsText) && charLeft >= 0;

  return (
    <CardContainerEditEnabled testID="edit-termsofuse-fields">
      <div>
        <h2 css={styles.title}>{translate('privacy_termsofuse_heading')}</h2>
        <Form testID="termsofuse-fields-form">
          <Row margin={{ start: -11, top: 16 }}>
            <Col>
              <FormElement>
                <div css={styles.questionContainer}>
                  <div>
                    <FormElement.Label
                      label={translate('privacy_termsofuse_displayfooterlink')}
                      labelFor="displayTermsLinkOnFooter"
                    />
                  </div>
                  <div css={styles.flyout}>
                    <HelpCirclePopper
                      testID="privacy_termsofuse_displayfooterlink"
                      helpText={translate(infoContent.get('uniqueTermsOfUse'))}
                      accessibilityLabel={translate(infoContent.get('uniqueTermsOfUse'))}
                    />
                  </div>
                </div>

                <RadioGroup
                  id="displayTermsLinkOnFooter"
                  name="Display Link on footer"
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
                  selected={originalSettings.displayTermsLinkOnFooter ? 1 : 0}
                  onUpdate={selectedOption => {
                    setPrivacySettings(prev => ({ ...prev, displayTermsLinkOnFooter: Boolean(selectedOption) }));
                    setIsPageEdited(true);
                  }}
                  testID="termsofuse-linkinfooter-radio"
                  disabled={!allowTermsEdit}
                />
              </FormElement>
            </Col>
          </Row>

          {originalSettings.displayTermsLinkOnFooter ? (
            <Row margin={{ start: -11 }}>
              <Col width={isMobile ? 1 : 1 / 2}>
                <FormElement>
                  <FormElement.Label
                    label={translate('privacy_termsofuse_linktext')}
                    labelFor="termsLinkText"
                    required
                  />
                  <Textbox
                    id="termsLinkText"
                    value={originalSettings.termsLinkText || ''}
                    onChange={onChange}
                    accessibilityLabel="cvent-termsofuse-link-text-input"
                    hasError={errorTermsOfUse && !isTermsLinkTextValid}
                    maxLength={100}
                  />
                </FormElement>
              </Col>
            </Row>
          ) : null}

          {originalSettings.displayTermsLinkOnFooter ? (
            <div>
              <Row margin={{ start: -11 }}>
                <Col width={isMobile ? 1 : 1 / 2}>
                  <FormElement>
                    <FormElement.Label label={translate('privacy_termsofuse_content')} labelFor="termsText" required />
                    <Textarea
                      id="termsText"
                      value={originalSettings.termsText || ''}
                      onChange={onChange}
                      hasError={errorTermsOfUse && !isTermsBodyValid}
                      disabled={!allowTermsEdit}
                    />
                    <div css={[styles.characterCount, charLeft < 0 ? styles.negativeCharCount : null]}>
                      {translate('privacy_termsofuse_charactersleft', { charLeft })}
                    </div>
                  </FormElement>
                </Col>
              </Row>
            </div>
          ) : null}

          {originalSettings.displayTermsLinkOnFooter ? (
            <Row margin={{ start: -11 }}>
              <Col>
                <FormElement>
                  <FormElement.Label
                    label={translate('privacy_termsofuse_displayvisitorlogin')}
                    labelFor="displayTermsOnLogin"
                  />
                  <RadioGroup
                    id="displayTermsOnLogin"
                    name="Display terms on visitor login"
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
                    selected={originalSettings.displayTermsOnLogin ? 1 : 0}
                    onUpdate={selectedOption => {
                      setPrivacySettings(prev => ({ ...prev, displayTermsOnLogin: Boolean(selectedOption) }));
                      setIsPageEdited(true);
                    }}
                    testID="termsofuse-displayvisitorlogin-radio"
                    disabled={!allowTermsEdit}
                  />
                </FormElement>
              </Col>
            </Row>
          ) : null}
        </Form>
      </div>
    </CardContainerEditEnabled>
  );
}

interface Props {
  privacySettings: PrivacySettings;
  infoContent: Map<string, string>;
  allowTermsEdit: boolean;
  errorTermsOfUse: boolean;
  setIsPageEdited: (isPageEdited: boolean) => void;
  setPrivacySettings: React.Dispatch<React.SetStateAction<PrivacySettings>>;
}

export default EditPrivacyPolicyFields;

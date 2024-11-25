import React from 'react';
import CardContainerEditEnabled from '@components/privacy/CardContainerEditEnabled';
import { RadioGroup } from '@cvent/carina/components/RadioGroup';
import { Col } from '@cvent/carina/components/Col';
import { Row } from '@cvent/carina/components/Row';
import { Form } from '@cvent/carina/components/Forms';
import FormElement from '@cvent/carina/components/FormElement/FormElement';
import { PrivacySettings } from '@components/privacy/type/PrivacySettings';
import { useStyle } from '@hooks/useStyle';
import { useTranslate } from 'nucleus-text';
import { EditPrivacyPolicyFieldsStyle } from '@components/privacy/style';
import TextContainer from '@components/privacy/TextContainer';
import Textarea from '@cvent/carina/components/Textarea/Textarea';
import { CCPA_EXPLANATION_TEXT_MAX_LIMIT } from '@components/constants';
import Textbox from '@cvent/carina/components/Textbox/Textbox';
import { isMobile } from 'react-device-detect';
import { useAppFeatures } from '@components/AppFeaturesProvider';
import { HelpCirclePopper } from '@components/tracking-codes/HelpCirclePopper';
import isURL from 'validator/lib/isURL';

function EditCCPAFields({
  privacySettings: originalSettings,
  infoContent,
  setPrivacySettings,
  setIsPageEdited,
  errorCcpa
}: Props): JSX.Element {
  const styles = useStyle(EditPrivacyPolicyFieldsStyle);
  const { translate } = useTranslate();
  const { cookieNotificationFeature } = useAppFeatures();

  const isCcpaBodyValid =
    originalSettings.ccpaLinkExplanationText && originalSettings.ccpaLinkExplanationText.trim().length > 0;
  const isCcpaLinkTextValid = originalSettings.ccpaLinkText && originalSettings.ccpaLinkText.trim().length > 0;
  const isCcpaButtonTextValid =
    originalSettings.ccpaSubmitButtonText && originalSettings.ccpaSubmitButtonText.trim().length > 0;
  const isCcpaConfirmationTextValid =
    originalSettings.ccpaConfirmationText && originalSettings.ccpaConfirmationText.trim().length > 0;
  const isCcpaDnsUrlValid = Boolean(originalSettings.ccpaDoNotSellUrl) && isURL(originalSettings.ccpaDoNotSellUrl);

  return (
    <CardContainerEditEnabled testID="edit-ccpa-fields">
      <div>
        <h2 css={styles.title}>{translate('privacy_ccpa_heading')}</h2>
        <Form testID="ccpa-fields-form">
          <Row margin={{ start: -11 }}>
            <Col>
              <FormElement>
                <div css={styles.questionContainer}>
                  <div>
                    <FormElement.Label label={translate('privacy_ccpa_donotsell')} labelFor="ccpaEnableDoNotSell" />
                  </div>
                  <div css={styles.flyout}>
                    <HelpCirclePopper
                      testID="ccpa-dns-link-text"
                      helpText={translate(infoContent.get('linkAttendeesDoNotSell'))}
                      accessibilityLabel={translate(infoContent.get('linkAttendeesDoNotSell'))}
                    />
                  </div>
                </div>
                <RadioGroup
                  id="ccpaEnableDoNotSell"
                  name="enableDoNotSell"
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
                  selected={originalSettings.ccpaEnableDoNotSell ? 1 : 0}
                  onUpdate={selectedOption => {
                    setPrivacySettings(prev => ({ ...prev, ccpaEnableDoNotSell: Boolean(selectedOption) }));
                    setIsPageEdited(true);
                  }}
                  testID="ccpa-radio-group"
                />
              </FormElement>
            </Col>
          </Row>

          {originalSettings.ccpaEnableDoNotSell && (
            <div>
              {cookieNotificationFeature ? (
                <Row margin={{ start: -11 }}>
                  <Col width={isMobile ? 1 : 1 / 2}>
                    <FormElement>
                      <div css={styles.questionContainer}>
                        <div>
                          <FormElement.Label
                            label={translate('privacy_ccpa_link_text')}
                            labelFor="privacyCcpaLinkText"
                            required
                          />
                        </div>
                      </div>
                      <Textbox
                        id="privacy-ccpa-link-text-input"
                        value={originalSettings.ccpaLinkText || ''}
                        onChangeText={onChangeText => {
                          setPrivacySettings(prev => ({ ...prev, ccpaLinkText: onChangeText }));
                          setIsPageEdited(true);
                        }}
                        aria-label={translate('privacy_ccpa_link_text')}
                        maxLength={100}
                        hasError={errorCcpa && !isCcpaLinkTextValid}
                      />
                    </FormElement>
                  </Col>
                </Row>
              ) : (
                <Row margin={{ start: -11 }}>
                  <Col css={{ paddingBottom: '1rem' }}>
                    <TextContainer
                      testID="editCcpaText"
                      question={translate('privacy_ccpa_link_text')}
                      answer={translate('privacy_ccpa_donotsellmyinfo')}
                    />
                  </Col>
                </Row>
              )}
              <Row margin={{ start: -11 }}>
                <Col width={isMobile ? 1 : 1 / 2}>
                  <FormElement>
                    <FormElement.Label
                      label={translate('ccpa_explanation_text')}
                      labelFor="ccpaExplanationText"
                      required
                      accessibilityLabel={translate('ccpa_explanation_text')}
                    />
                    <div css={{ height: '100%' }}>
                      <Textarea
                        id="ccpa-explanation-text"
                        value={originalSettings.ccpaLinkExplanationText || ''}
                        onChangeText={onChangeText => {
                          setPrivacySettings(prev => ({ ...prev, ccpaLinkExplanationText: onChangeText }));
                          setIsPageEdited(true);
                        }}
                        minHeight="l"
                        maxLength={CCPA_EXPLANATION_TEXT_MAX_LIMIT}
                        hasError={errorCcpa && !isCcpaBodyValid}
                        aria-label={translate('ccpa_explanation_text')}
                      />
                    </div>
                  </FormElement>
                </Col>
              </Row>
              {cookieNotificationFeature && (
                <div>
                  <Row margin={{ start: -11 }}>
                    <Col width={isMobile ? 1 : 1 / 2}>
                      <FormElement>
                        <div css={styles.questionContainer}>
                          <FormElement.Label
                            label={translate('privacy_ccpa_button_text')}
                            labelFor="privacyCcpaButtonText"
                            required
                          />
                        </div>
                        <Textbox
                          id="ccpa-button-text"
                          value={originalSettings.ccpaSubmitButtonText || ''}
                          onChangeText={onChangeText => {
                            setPrivacySettings(prev => ({ ...prev, ccpaSubmitButtonText: onChangeText }));
                            setIsPageEdited(true);
                          }}
                          aria-label={translate('privacy_ccpa_button_text')}
                          maxLength={50}
                          hasError={errorCcpa && !isCcpaButtonTextValid}
                        />
                      </FormElement>
                    </Col>
                  </Row>
                  <Row margin={{ start: -11 }}>
                    <Col width={isMobile ? 1 : 1 / 2}>
                      <FormElement>
                        <div css={styles.questionContainer}>
                          <FormElement.Label
                            label={translate('privacy_ccpa_confirmation_text')}
                            labelFor="privacyCcpaConfirmationText"
                            required
                          />
                        </div>
                        <Textbox
                          id="privacy-ccpa-confirmation-text-input"
                          value={originalSettings.ccpaConfirmationText || ''}
                          onChangeText={onChangeText => {
                            setPrivacySettings(prev => ({ ...prev, ccpaConfirmationText: onChangeText }));
                            setIsPageEdited(true);
                          }}
                          aria-label={translate('privacy_ccpa_confirmation_text')}
                          maxLength={300}
                          hasError={errorCcpa && !isCcpaConfirmationTextValid}
                        />
                      </FormElement>
                    </Col>
                  </Row>
                  <Row margin={{ start: -11 }}>
                    <Col>
                      <FormElement>
                        <div css={styles.questionContainer}>
                          <FormElement.Label
                            label={translate('ccpa_enable_dns_link_text')}
                            labelFor="ccpaDnsLinkText"
                          />
                          <div css={styles.flyout}>
                            <HelpCirclePopper
                              testID="ccpa-enable-dns-link-text"
                              helpText={translate(infoContent.get('ccpaEnableDnslinkText'))}
                              accessibilityLabel={translate(infoContent.get('ccpaEnableDnslinkText'))}
                            />
                          </div>
                        </div>
                        <RadioGroup
                          id="ccpaDnsLinkText"
                          name="CCPA Enable DNS"
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
                          selected={originalSettings.ccpaDoNotSellUrlEnabled ? 1 : 0}
                          onUpdate={selectedOption => {
                            setPrivacySettings(prev => ({ ...prev, ccpaDoNotSellUrlEnabled: Boolean(selectedOption) }));
                            setIsPageEdited(true);
                          }}
                          testID="ccpa-dns-link-radio"
                        />
                      </FormElement>
                    </Col>
                  </Row>
                  {originalSettings.ccpaDoNotSellUrlEnabled && (
                    <Row margin={{ start: -11 }}>
                      <Col width={isMobile ? 1 : 1 / 2}>
                        <FormElement>
                          <div css={styles.questionContainer}>
                            <FormElement.Label
                              label={translate('ccpa_dns_share_url_text')}
                              labelFor="ccpaDnsShareUrlText"
                              required
                            />
                            <div css={styles.flyout}>
                              <HelpCirclePopper
                                testID="ccpa-dns-share-url-text"
                                helpText={translate(infoContent.get('ccpaDnsShareUrlText'))}
                                accessibilityLabel={translate(infoContent.get('ccpaDnsShareUrlText'))}
                              />
                            </div>
                          </div>
                          <Textbox
                            id="ccpa-dns-url"
                            value={originalSettings.ccpaDoNotSellUrl || ''}
                            onChangeText={onChangeText => {
                              setPrivacySettings(prev => ({ ...prev, ccpaDoNotSellUrl: onChangeText }));
                              setIsPageEdited(true);
                            }}
                            aria-label={translate('ccpa_dns_share_url_text')}
                            hasError={errorCcpa && !isCcpaDnsUrlValid}
                          />
                          {errorCcpa && !isCcpaDnsUrlValid && (
                            <FormElement.Message text={translate('privacy_policy_invalid_url')} type="error" />
                          )}
                        </FormElement>
                      </Col>
                    </Row>
                  )}
                </div>
              )}
            </div>
          )}
        </Form>
      </div>
    </CardContainerEditEnabled>
  );
}

interface Props {
  privacySettings: PrivacySettings;
  infoContent: Map<string, string>;
  errorCcpa: boolean;
  setIsPageEdited: (isPageEdited: boolean) => void;
  setPrivacySettings: React.Dispatch<React.SetStateAction<PrivacySettings>>;
}

export default EditCCPAFields;

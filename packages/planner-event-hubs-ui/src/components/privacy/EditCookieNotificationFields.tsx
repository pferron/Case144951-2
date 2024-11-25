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
import { useAppFeatures } from '@components/AppFeaturesProvider';
import { HelpCirclePopper } from '@components/tracking-codes/HelpCirclePopper';
import { Checkbox } from '@cvent/carina/components/Checkbox';
import Textbox from '@cvent/carina/components/Textbox/Textbox';
import isURL from 'validator/lib/isURL';
import { PRIVACY_COOKIE_TEXT_FIELD_LENGTH } from '@utils/constants';

function EditCookieNotificationFields({
  privacySettings: originalSettings,
  infoContent,
  setPrivacySettings,
  setIsPageEdited,
  error,
  errorCustomCookieList
}: Props): JSX.Element {
  const styles = useStyle(EditPrivacyPolicyFieldsStyle);
  const { translate } = useTranslate();
  const { cookieNotificationFeature, cookieListFeature } = useAppFeatures();

  const isCustomCookieLinkTextValid =
    Boolean(originalSettings?.cookieLists?.customLinkText) && originalSettings?.cookieLists?.customLinkText.trim();
  const isCustomCookieUrlValid =
    Boolean(originalSettings?.cookieLists?.customUrl) && isURL(originalSettings?.cookieLists?.customUrl);
  const isPrivacyUrlValid = Boolean(originalSettings.privacyPolicyUrl) && isURL(originalSettings.privacyPolicyUrl);
  const isPrivacyLinkTextValid =
    Boolean(originalSettings.privacyPolicyLinkText) && originalSettings.privacyPolicyLinkText.trim();

  return (
    <CardContainerEditEnabled testID="edit-cookie-notification-fields">
      <div>
        <h2 css={styles.title}>{translate('privacy_cookie_notification_heading')}</h2>
        <Form testID="cookie-fields-form">
          <Row margin={{ start: -11 }}>
            <Col>
              <FormElement>
                <div css={styles.questionContainer}>
                  <div>
                    <FormElement.Label
                      label={translate('privacy_notify_users_about_cookies')}
                      labelFor="notifyUsersAboutCookie"
                    />
                  </div>
                  <div css={styles.flyout}>
                    <HelpCirclePopper
                      testID="privacy_cookieNotification_displayfooterlink"
                      helpText={translate(infoContent.get('notifyUsersAboutCookie'))}
                      accessibilityLabel={translate(infoContent.get('notifyUsersAboutCookie'))}
                    />
                  </div>
                </div>
                <RadioGroup
                  id="notifyUsersAboutCookie"
                  name="Notify Visitors"
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
                  selected={originalSettings.notifyUsersAboutCookie ? 1 : 0}
                  onUpdate={selectedOption => {
                    setPrivacySettings(prev => ({ ...prev, notifyUsersAboutCookie: Boolean(selectedOption) }));
                    setIsPageEdited(true);
                  }}
                  testID="cvent-cookie-radio"
                />
              </FormElement>
            </Col>
          </Row>

          {cookieListFeature && (
            <Row margin={{ start: -11 }}>
              <Col>
                <FormElement>
                  <div css={styles.questionContainer}>
                    <div>
                      <FormElement.Label
                        label={translate('cookie_notification_display_cookie_text')}
                        labelFor="notifyUsersAboutCookie"
                      />
                    </div>
                    <div css={styles.flyout}>
                      <HelpCirclePopper
                        testID="privacy-cookie-Notification"
                        helpText={translate('display_cookie_list_popover_text')}
                        accessibilityLabel={translate(infoContent.get('notifyUsersAboutCookie'))}
                      />
                    </div>
                  </div>
                  <div css={{ width: '50%' }}>
                    <Checkbox
                      aria-label={translate('privacy_policy_checkbox_aria_label')}
                      checked={originalSettings.displayCventPrivacyPolicyInCookie}
                      id="cvent-privacy-policy-checkbox"
                      onChange={({ target }: React.ChangeEvent<HTMLInputElement>) => {
                        setPrivacySettings(prev => ({
                          ...prev,
                          displayCventPrivacyPolicyInCookie: target.checked
                        }));
                        setIsPageEdited(true);
                      }}
                    >
                      {translate('cookie_notification_cvent_privacy_policy_text')}
                    </Checkbox>
                    <Checkbox
                      aria-label={translate('privacy_cvent_cookie_list_checkbox_aria_label')}
                      checked={originalSettings.cookieLists.enableCvent}
                      id="cvent-cookie-list-checkbox"
                      onChange={({ target }: React.ChangeEvent<HTMLInputElement>) => {
                        setPrivacySettings(prev => ({
                          ...prev,
                          cookieLists: {
                            ...prev.cookieLists,
                            enableCvent: target.checked
                          }
                        }));
                        setIsPageEdited(true);
                      }}
                    >
                      {translate('cvent_cookie_list_text')}
                    </Checkbox>
                    <div>
                      <Checkbox
                        aria-label={translate('your_company_privacy_policy_checkbox_aria_label')}
                        checked={originalSettings.displayPrivacyPolicy}
                        id="your-company-privacy-policy-checkbox"
                        onChange={({ target }: React.ChangeEvent<HTMLInputElement>) => {
                          setPrivacySettings(prev => ({
                            ...prev,
                            displayPrivacyPolicy: target.checked
                          }));
                          setIsPageEdited(true);
                        }}
                      >
                        {translate('your_company_privacy_policy_text')}
                      </Checkbox>
                    </div>

                    {originalSettings.displayPrivacyPolicy && (
                      <>
                        <div style={{ marginBottom: '1rem', marginTop: '0.5rem' }}>
                          <Textbox
                            id="cventPrivacyPolicyUrl"
                            name="cvent-privacy-url-input"
                            value={originalSettings.privacyPolicyUrl || ''}
                            onChange={event => {
                              setPrivacySettings(prev => ({
                                ...prev,
                                privacyPolicyUrl: event.target.value
                              }));
                              setIsPageEdited(true);
                            }}
                            aria-label={translate('privacy_your_privacy_link_label')}
                            maxLength={PRIVACY_COOKIE_TEXT_FIELD_LENGTH}
                            labelText={translate('privacy_your_privacy_link_label')}
                            isRequired
                            hasError={error && !isPrivacyUrlValid}
                          />
                          {error && !isPrivacyUrlValid && (
                            <FormElement.Message text={translate('privacy_policy_invalid_url')} type="error" />
                          )}
                        </div>
                        <div style={{ marginBottom: '0.5rem' }}>
                          <Textbox
                            id="cventPrivacyPolicyLinkText"
                            value={originalSettings.privacyPolicyLinkText || ''}
                            onChange={event => {
                              setPrivacySettings(prev => ({
                                ...prev,
                                privacyPolicyLinkText: event.target.value
                              }));
                              setIsPageEdited(true);
                            }}
                            aria-label={translate('privacy_your_privacy_link_text')}
                            maxLength={PRIVACY_COOKIE_TEXT_FIELD_LENGTH}
                            labelText={translate('privacy_your_privacy_link_text')}
                            isRequired
                            hasError={error && !isPrivacyLinkTextValid}
                          />
                        </div>
                      </>
                    )}
                    <div>
                      <Checkbox
                        aria-label={translate('your_company_cookie_list_checkbox_aria_label')}
                        checked={originalSettings.cookieLists.enableCustom}
                        id="your-company-cookie-list-checkbox"
                        onChange={({ target }: React.ChangeEvent<HTMLInputElement>) => {
                          setPrivacySettings(prev => ({
                            ...prev,
                            cookieLists: {
                              ...prev.cookieLists,
                              enableCustom: target.checked
                            }
                          }));
                          setIsPageEdited(true);
                        }}
                      >
                        {translate('your_company_cookie_list_text')}
                      </Checkbox>
                    </div>

                    {originalSettings.cookieLists.enableCustom && (
                      <>
                        <div style={{ marginBottom: '1rem', marginTop: '0.5rem' }}>
                          <Textbox
                            id="customCookieListUrl"
                            value={originalSettings.cookieLists.customUrl || ''}
                            onChange={event => {
                              setPrivacySettings(prev => ({
                                ...prev,
                                cookieLists: {
                                  ...prev.cookieLists,
                                  customUrl: event.target.value
                                }
                              }));
                              setIsPageEdited(true);
                            }}
                            aria-label={translate('privacy_your_cookie_list_url_label')}
                            maxLength={PRIVACY_COOKIE_TEXT_FIELD_LENGTH}
                            labelText={translate('privacy_your_cookie_list_url_label')}
                            isRequired
                            hasError={errorCustomCookieList && !isCustomCookieUrlValid}
                          />
                          {errorCustomCookieList && !isCustomCookieUrlValid && (
                            <FormElement.Message
                              text={translate('your_company_cookie_list_url_invalid_text')}
                              type="error"
                            />
                          )}
                        </div>
                        <div style={{ marginBottom: '0.5rem' }}>
                          <Textbox
                            id="customCookieLinkText"
                            value={originalSettings.cookieLists.customLinkText || ''}
                            onChange={event => {
                              setPrivacySettings(prev => ({
                                ...prev,
                                cookieLists: {
                                  ...prev.cookieLists,
                                  customLinkText: event.target.value
                                }
                              }));
                              setIsPageEdited(true);
                            }}
                            aria-label={translate('privacy_your_cookie_list_link_text_label')}
                            maxLength={PRIVACY_COOKIE_TEXT_FIELD_LENGTH}
                            labelText={translate('privacy_your_cookie_list_link_text_label')}
                            isRequired
                            hasError={errorCustomCookieList && !isCustomCookieLinkTextValid}
                          />
                        </div>
                      </>
                    )}
                  </div>
                </FormElement>
              </Col>
            </Row>
          )}

          {cookieNotificationFeature || originalSettings.notifyUsersAboutCookie ? (
            <div>
              {!cookieListFeature && (
                <Row margin={{ start: -11 }}>
                  <Col>
                    <FormElement>
                      <div css={styles.questionContainer}>
                        <div>
                          <FormElement.Label
                            label={translate('privacy_display_link_cookie')}
                            labelFor="displayCventPrivacyPolicyInCookie"
                          />
                        </div>
                      </div>
                      <RadioGroup
                        id="displayCventPrivacyPolicyInCookie"
                        name="Cvents Privacy Policy"
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
                        selected={originalSettings.displayCventPrivacyPolicyInCookie ? 1 : 0}
                        onUpdate={selectedOption => {
                          setPrivacySettings(prev => ({
                            ...prev,
                            displayCventPrivacyPolicyInCookie: Boolean(selectedOption)
                          }));
                          setIsPageEdited(true);
                        }}
                        testID="cvent-privacy-radio"
                      />
                    </FormElement>
                  </Col>
                </Row>
              )}
              <Row margin={{ start: -11 }}>
                <Col>
                  <FormElement>
                    <div css={styles.questionContainer}>
                      <div>
                        <FormElement.Label
                          label={translate('privacy_allow_turnoff_google_analytics')}
                          labelFor="allowTurnOffGoogleAnalytics"
                        />
                      </div>
                      <div css={styles.flyout}>
                        <HelpCirclePopper
                          testID="privacy_cookieNotification_allowTurnOffGoogleAnalytics"
                          helpText={translate(infoContent.get('allowTurnOffGoogleAnalytics'))}
                          accessibilityLabel={translate(infoContent.get('allowTurnOffGoogleAnalytics'))}
                        />
                      </div>
                    </div>
                    <RadioGroup
                      id="allowTurnOffGoogleAnalytics"
                      name="Cvent Allow turn off google analytics"
                      options={[
                        {
                          label: translate('privacy_allow_turnoff_google_analytics_yes'),
                          value: 1
                        },
                        {
                          label: translate('privacy_allow_turnoff_google_analytics_no'),
                          value: 0
                        }
                      ]}
                      selected={originalSettings.allowTurnOffGoogleAnalytics ? 1 : 0}
                      onUpdate={selectedOption => {
                        setPrivacySettings(prev => ({
                          ...prev,
                          allowTurnOffGoogleAnalytics: Boolean(selectedOption)
                        }));
                        setIsPageEdited(true);
                      }}
                      testID="cvent-google-analytics-radio"
                    />
                  </FormElement>
                </Col>
              </Row>
              <Row margin={{ start: -11 }}>
                <Col>
                  <FormElement>
                    <div css={styles.questionContainer}>
                      <div>
                        <FormElement.Label
                          label={translate('privacy_allow_turnoff_cookies')}
                          labelFor="allowTurnOffCookies"
                        />
                      </div>
                      <div css={styles.flyout}>
                        <HelpCirclePopper
                          testID="privacy_cookieNotification_allowTurnOffCookies"
                          helpText={translate(infoContent.get('allowTurnOffCookies'))}
                          accessibilityLabel={translate(infoContent.get('allowTurnOffCookies'))}
                        />
                      </div>
                    </div>
                    <RadioGroup
                      id="allowTurnOffCookies"
                      name="Cvents Non-essential Cookies"
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
                      selected={originalSettings.allowTurnOffCookies ? 1 : 0}
                      onUpdate={selectedOption => {
                        setPrivacySettings(prev => ({ ...prev, allowTurnOffCookies: Boolean(selectedOption) }));
                        setIsPageEdited(true);
                      }}
                      testID="cvent-non-essential-radio"
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
  error: boolean;
  errorCustomCookieList: boolean;
  privacySettings: PrivacySettings;
  infoContent: Map<string, string>;
  setIsPageEdited: (isPageEdited: boolean) => void;
  setPrivacySettings: React.Dispatch<React.SetStateAction<PrivacySettings>>;
}

export default EditCookieNotificationFields;

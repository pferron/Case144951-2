import React, { useEffect, useRef, useState } from 'react';
import { Col } from '@cvent/carina/components/Col';
import { Row } from '@cvent/carina/components/Row';
import { Form } from '@cvent/carina/components/Forms';
import FormElement from '@cvent/carina/components/FormElement/FormElement';
import { useStyle } from '@hooks/useStyle';
import { useTranslate } from 'nucleus-text';
import { VisitorPermissionsProps } from '@components/visitor-permissions/type/VisitorPermissionsProps';
import CardContainer from '@components/visitor-permissions/CardContainer';
import useBreakpoints from '@hooks/useBreakpoints';
import { EditEmailDomainFieldsStyle } from '@components/visitor-permissions/style';
import { Textarea } from '@cvent/carina/components/Textarea';
import { MAX_EMAIL_DOMAINS_COUNT } from '@utils/constants';
import { isValidDomains } from '@utils/domainValidation';
import VisitorPermissionsEditModal from '@components/visitor-permissions/VisitorPermissionConfirmationModal';
import AllowedEmailDomainList from '@components/visitor-permissions/AllowedEmailDomainList';
import { Button } from '@cvent/carina/components/Button';
import RadioButton from '@cvent/carina/components/RadioGroup/components/RadioButton';
import HelpCircleIcon from '@cvent/carina/components/Icon/HelpCircle';
import { AllowedEmailDomain } from '@cvent/planner-event-hubs-model/types';
import { injectTestId } from '@cvent/nucleus-test-automation';
import { Popper } from '@cvent/carina/components/Popper';
import { getEmailDomainsOptions } from './EmailDomainsOptions';

export function EmailDomainPopover() {
  const styles = useStyle(EditEmailDomainFieldsStyle);
  const { translate } = useTranslate();
  const triggerRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const handleOpen = () => setIsOpen(prevIsOpen => !prevIsOpen);

  return (
    <div css={styles.popoverStyle} {...injectTestId('business-email-domains-type-popover')}>
      <span
        id="business-domains-help-circle-icon"
        role="button"
        tabIndex={0}
        aria-label="help-text"
        ref={triggerRef}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setIsOpen(false)}
        onMouseOver={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onClick={handleOpen}
        onKeyDown={(event): void => {
          if (event.code === 'Enter') {
            handleOpen();
          }
        }}
      >
        <HelpCircleIcon size="s" />
      </span>
      <Popper
        testID="business-email-domains-popper"
        placement="bottom-start"
        hasShadow
        isOpen={isOpen}
        triggerRef={triggerRef}
        preventOverflow
      >
        <div css={{ ...styles.popperBodyStyles }}>
          <div css={styles.popoverBoldStyle}>
            {translate('registration_settings_domain_type_business_domain_label_popover_t1')}
          </div>
          <div>{translate('registration_settings_domain_type_business_domain_label_popover_t2')}</div>
        </div>
      </Popper>
    </div>
  );
}

function EditEmailDomainField({
  saveChangesModalOpen,
  setSaveChangesModalOpen,
  registrationSettings: originalSettings,
  onSave: originalOnSave,
  onCancel,
  isEdit,
  setIsPageEdited
}: Props): JSX.Element {
  const styles = useStyle(EditEmailDomainFieldsStyle);
  const { translate } = useTranslate();
  const [emailDomainsText, setEmailDomainsText] = useState(originalSettings.emailDomains.join(', '));
  const [emailDomainsLeftCount, setEmailDomainsLeftCount] = useState(
    MAX_EMAIL_DOMAINS_COUNT - originalSettings.emailDomains.length
  );
  const [error, setError] = useState(false);
  const { isMobile } = useBreakpoints();

  const isSameEmailDomain = (arr, target) => target.every(v => arr.includes(v)) && arr.every(v => target.includes(v));
  const [emailDomainsArray, setEmailDomainsArray] = useState<string[]>(originalSettings.emailDomains);
  const [registrationSettings, setRegistrationSettings] = useState(originalSettings);

  useEffect(() => {
    const emailDomainsFilterArray = emailDomainsArray.filter(emailDomain => emailDomain !== '');
    setEmailDomainsLeftCount(MAX_EMAIL_DOMAINS_COUNT - emailDomainsFilterArray.length);
    setEmailDomainsText('');
  }, [emailDomainsArray]);

  const emailDomainOptions = getEmailDomainsOptions(translate);

  const onSave = () => {
    if (
      !isSameEmailDomain(originalSettings.emailDomains, emailDomainsArray) ||
      originalSettings.registrationSettingConfigs.allowedEmailDomain !==
        registrationSettings.registrationSettingConfigs.allowedEmailDomain
    ) {
      setSaveChangesModalOpen(true);
    } else {
      originalOnSave({
        ...originalSettings,
        emailDomains: emailDomainsArray,
        registrationSettingConfigs: registrationSettings.registrationSettingConfigs
      });
    }
  };

  const onChange = target => {
    setIsPageEdited(true);
    const len = target.value.length;
    const lastChar = target.value[len - 1];
    let domainText = target.value;
    if (lastChar === '\n') {
      domainText = target.value.slice(0, -1);
    }
    const emailDomainsCount = domainText.split(',').length;
    if (emailDomainsCount <= MAX_EMAIL_DOMAINS_COUNT - emailDomainsArray.length) {
      setEmailDomainsText(domainText);
    }
    if (lastChar !== '\n') {
      setError(false);
    }
  };
  const handleKeyPress = event => {
    if (event.key === 'Enter') {
      handleAddEmailDomain();
    }
  };
  const validateDomains = emailDomainsText !== null ? isValidDomains(emailDomainsText) : true;
  const addEmailDomainsText = editEmailDomainsText => {
    if (editEmailDomainsText !== '') {
      let domains = editEmailDomainsText.split(',').map(domain => domain.trim());
      domains = Array.from(new Set(domains.map(item => item.toLowerCase())));
      const uniqueDomains = {};
      domains.forEach(domain => {
        uniqueDomains[domain] = true;
      });
      const uniqueTarget = emailDomainsArray.filter(email => !domains.includes(email));
      const uniqueTargetToAdd = {};
      uniqueTarget.forEach(email => {
        uniqueTargetToAdd[email] = true;
      });
      const totalEmailDomains = [...Object.keys(uniqueDomains), ...Object.keys(uniqueTargetToAdd)].sort((a, b) =>
        a.localeCompare(b)
      );
      setEmailDomainsArray(totalEmailDomains);
      setIsPageEdited(true);
    }
  };
  const handleAddEmailDomain = () => {
    if (validateDomains) {
      addEmailDomainsText(emailDomainsText);
      setEmailDomainsText('');
    } else {
      setError(true);
    }
  };
  const removeEmailDomain = index => {
    const updatedList = [...emailDomainsArray];
    updatedList.splice(index, 1);
    setEmailDomainsArray([...updatedList]);
    setIsPageEdited(true);
  };
  return (
    <CardContainer testID="edit-email-domains-fields" onSave={onSave} onCancel={onCancel} isEdit={isEdit}>
      <VisitorPermissionsEditModal
        onSaveButtonContent={translate('registration_settings_save_modal_save_button')}
        onCancelButtonContent={translate('registration_settings_save_modal_cancel_button')}
        isModalOpen={saveChangesModalOpen}
        setIsModalOpen={setSaveChangesModalOpen}
        onSave={() => {
          originalOnSave({
            ...originalSettings,
            emailDomains: emailDomainsArray.filter((item, index) => emailDomainsArray.indexOf(item) === index),
            registrationSettingConfigs: registrationSettings.registrationSettingConfigs
          });
          setIsPageEdited(false);
        }}
        onCancel={() => {
          setSaveChangesModalOpen(false);
          setIsPageEdited(false);
        }}
        heading={translate('registration_settings_save_modal_heading')}
        content={translate('registration_settings_save_modal_description')}
      />
      <div>
        <h2 css={styles.title}>{translate('registration_settings_allowed_email_domains')}</h2>
        <Form testID="email-domain-fields-form">
          <p css={styles.description}>{translate('registration_settings_specify_who_can_register_by_email_domain')}</p>
          <div>
            <Row margin={{ start: -11 }}>
              <Col width={isMobile ? 1 : 1 / 2}>
                <div>
                  <FormElement.Label
                    css={styles.smallHeading}
                    label={translate('registration_settings_email_domain_type')}
                    labelFor="addEmailDomains"
                  />
                </div>
                {emailDomainOptions.map((option, index) => (
                  <div css={styles.publicRadio}>
                    <RadioButton
                      id={`emailDomainOptions-${index}`}
                      name="emailDomainOptions"
                      option={{
                        ...option,
                        checked: registrationSettings.registrationSettingConfigs.allowedEmailDomain === option.value
                      }}
                      testID={`email-domain-type-${index}-radio`}
                      onUpdate={(selectedOption: AllowedEmailDomain) => {
                        setRegistrationSettings(prev => ({
                          ...prev,
                          registrationSettingConfigs: {
                            ...prev.registrationSettingConfigs,
                            allowedEmailDomain: selectedOption
                          }
                        }));
                        setIsPageEdited(true);
                      }}
                    />
                    {option.value === 'BUSINESS_DOMAINS' && <EmailDomainPopover />}
                  </div>
                ))}
                {registrationSettings.registrationSettingConfigs.allowedEmailDomain ===
                  AllowedEmailDomain.CustomDomains && (
                  <div>
                    <div>
                      <FormElement.Label
                        css={styles.smallHeading}
                        label={translate('registration_settings_add_email_domains')}
                        labelFor="addEmailDomains"
                      />
                    </div>
                    <span css={styles.span}>
                      <Textarea
                        id="emailDomains"
                        value={emailDomainsText}
                        onChange={({ target }) => {
                          onChange(target);
                          setIsPageEdited(true);
                        }}
                        aria-label={translate('registration-settings-email-domains-input')}
                        testID="cvent-email-domains-input"
                        hasError={error || !isValidDomains}
                        onKeyPress={(event): void => {
                          setError(false);
                          handleKeyPress(event);
                        }}
                      />
                      <Button
                        css={styles.button2}
                        element="button"
                        text={translate('registration_settings_email_add_button')}
                        aria-label={translate('registration_settings_email_add_button')}
                        appearance="filled"
                        onClick={(): void => {
                          handleAddEmailDomain();
                        }}
                      />
                    </span>
                    {(emailDomainsText !== '' || emailDomainsArray.length !== 0) && !error && (
                      <div>
                        <FormElement.Label
                          css={styles.smallHeading}
                          label={translate('visitor_permissions_email_domains_remaining_message', {
                            emailDomainsCount: emailDomainsLeftCount
                          })}
                          labelFor="allowedEmailDomainsRemainingMessage"
                        />
                      </div>
                    )}

                    {(error || !isValidDomains) && (
                      <div>
                        <FormElement.Message
                          text={translate('registration_settings_invalid_Domain')}
                          type="error"
                          testID="invalid-email-domain-error-message"
                          accessibilityLabel={translate('registration_settings_invalid_Domain')}
                        />
                      </div>
                    )}
                  </div>
                )}
              </Col>
            </Row>
          </div>
        </Form>
        {registrationSettings.registrationSettingConfigs.allowedEmailDomain === AllowedEmailDomain.CustomDomains && (
          <div>
            {emailDomainsText === '' && emailDomainsArray.length === 0 && (
              <div>
                <FormElement.Label
                  css={styles.smallHeading}
                  label={translate('registration_settings_enter_multiple_domain_names')}
                  labelFor="enter multiple domain names"
                />
              </div>
            )}
            {emailDomainsArray.length > 0 && (
              <div>
                <FormElement.Label
                  css={styles.smallHeading}
                  label={translate('registration_settings_allowed_email_domains')}
                  labelFor="allowedEmailDomains"
                />
              </div>
            )}
            <div css={styles.pills}>
              {emailDomainsArray.map((listItem, i) => (
                <AllowedEmailDomainList
                  key={listItem}
                  index={i}
                  item={listItem}
                  removeEmailDomain={removeEmailDomain}
                />
              ))}
            </div>
            {emailDomainsArray.length > 0 && (
              <Button
                css={styles.button}
                type="button"
                element="button"
                text={translate('registration_settings_email_clear_all_button')}
                aria-label={translate('registration_settings_email_clear_all_button')}
                appearance="ghost"
                onClick={(): void => {
                  setEmailDomainsArray([]);
                  setIsPageEdited(true);
                }}
              />
            )}
          </div>
        )}
      </div>
    </CardContainer>
  );
}

interface Props {
  saveChangesModalOpen: boolean;
  setSaveChangesModalOpen: (value: boolean) => void;
  registrationSettings: VisitorPermissionsProps;
  onSave: (settings) => void;
  onCancel: (settings) => void;
  isEdit: boolean;
  setIsPageEdited: (isPageEdited: boolean) => void;
}

export default EditEmailDomainField;

import React, { useEffect, useRef, useState } from 'react';
import { Col } from '@cvent/carina/components/Col';
import { Row } from '@cvent/carina/components/Row';
import { Form } from '@cvent/carina/components/Forms';
import FormElement from '@cvent/carina/components/FormElement/FormElement';
import { useStyle } from '@hooks/useStyle';
import { useTranslate } from 'nucleus-text';
import { VisitorPermissionsProps } from '@components/visitor-permissions/type/VisitorPermissionsProps';
import CardContainerEditEnabled from '@components/privacy/CardContainerEditEnabled';
import useBreakpoints from '@hooks/useBreakpoints';
import { EditEmailDomainFieldsStyle } from '@components/visitor-permissions/style';
import { Textarea } from '@cvent/carina/components/Textarea';
import { MAX_EMAIL_DOMAINS_COUNT } from '@utils/constants';
import { isValidDomains } from '@utils/domainValidation';
import AllowedEmailDomainList from '@components/visitor-permissions/AllowedEmailDomainList';
import { Button } from '@cvent/carina/components/Button';
import RadioButton from '@cvent/carina/components/RadioGroup/components/RadioButton';
import HelpCircleIcon from '@cvent/carina/components/Icon/HelpCircle';
import { AllowedEmailDomain, GuestVisibility } from '@cvent/planner-event-hubs-model/types';
import { injectTestId } from '@cvent/nucleus-test-automation';
import { Popper } from '@cvent/carina/components/Popper';
import { getEmailDomainsOptions } from './EmailDomainsOptions';

export function EmailDomainPopover({ disabled = false }: EmailDomainProps): JSX.Element {
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
        isOpen={!disabled && isOpen}
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

function NewEditEmailDomainField({ registrationSettings, setRegistrationSettings, disabled }: Props): JSX.Element {
  const styles = useStyle(EditEmailDomainFieldsStyle);
  const { translate } = useTranslate();
  const [emailDomainsText, setEmailDomainsText] = useState(registrationSettings.emailDomains.join(', '));
  const [emailDomainsLeftCount, setEmailDomainsLeftCount] = useState(
    MAX_EMAIL_DOMAINS_COUNT - registrationSettings.emailDomains.length
  );
  const [error, setError] = useState(false);
  const { isMobile } = useBreakpoints();

  const [emailDomainsArray, setEmailDomainsArray] = useState<string[]>(registrationSettings.emailDomains);

  const tooltipText =
    registrationSettings.guestVisibility === GuestVisibility.Public &&
    translate('visitor_permissions_new_registration_rules_tooltip_text');

  useEffect(() => {
    const emailDomainsFilterArray = emailDomainsArray.filter(emailDomain => emailDomain !== '');
    setEmailDomainsLeftCount(MAX_EMAIL_DOMAINS_COUNT - emailDomainsFilterArray.length);
    setEmailDomainsText('');
    setRegistrationSettings(prev => ({
      ...prev,
      emailDomains: emailDomainsArray
    }));
  }, [emailDomainsArray, setRegistrationSettings]);

  const emailDomainOptions = getEmailDomainsOptions(translate);

  const onChange = target => {
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
  };
  return (
    <CardContainerEditEnabled testID="edit-email-domains-fields" disabled={disabled} tooltipText={tooltipText}>
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
                  <div key={option.value} css={styles.publicRadio}>
                    <RadioButton
                      id={`emailDomainOptions-${index}`}
                      name="emailDomainOptions"
                      option={{
                        disabled,
                        ...option,
                        checked: registrationSettings.registrationSettingConfigs.allowedEmailDomain === option.value
                      }}
                      testID={`email-domain-type-${index}-radio`}
                      disabled={disabled}
                      onUpdate={(selectedOption: AllowedEmailDomain) => {
                        setRegistrationSettings(prev => ({
                          ...prev,
                          registrationSettingConfigs: {
                            ...prev.registrationSettingConfigs,
                            allowedEmailDomain: selectedOption
                          }
                        }));
                      }}
                    />
                    {option.value === 'BUSINESS_DOMAINS' && <EmailDomainPopover disabled={disabled} />}
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
                        }}
                        disabled={disabled}
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
                        disabled={disabled}
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
                  disabled={disabled}
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
                disabled={disabled}
                onClick={(): void => {
                  setEmailDomainsArray([]);
                }}
              />
            )}
          </div>
        )}
      </div>
    </CardContainerEditEnabled>
  );
}

interface Props {
  registrationSettings: VisitorPermissionsProps;
  setRegistrationSettings: React.Dispatch<React.SetStateAction<VisitorPermissionsProps>>;
  disabled: boolean;
}

interface EmailDomainProps {
  disabled?: boolean;
}

export default NewEditEmailDomainField;

import { useTranslate } from 'nucleus-text';
import { useStyle } from '@hooks/useStyle';
import { Row } from '@cvent/carina/components/Row';
import { Col } from '@cvent/carina/components/Col';
import { Dropdown, Textbox, useFormContext, useWatchField } from '@cvent/carina/components/Forms';
import { CENTER_CUSTOM_DOMAIN_MAX_LENGTH, CVENT_DOMAIN_VALUE } from '@utils/constants';
import React, { useMemo } from 'react';
import { Theme } from '@cvent/carina/components/ThemeProvider';
import { CSSObject } from '@emotion/react';
import { injectTestId } from '@cvent/nucleus-test-automation';
import { DropdownOptionShape } from '@cvent/carina/components/Dropdown';
import getConfig from 'next/config';

const EditCustomDomainStyles = (theme: Theme): Record<string, CSSObject> =>
  useMemo(
    () => ({
      fieldContainer: {
        maxWidth: 632
      },
      sectionTitle: {
        marginTop: 0,
        maxWidth: '80%',
        fontSize: theme.font.base.size.h2,
        marginBottom: theme.spacing['5']
      },
      urlLabel: {
        fontSize: theme.font.base.size.m,
        marginBottom: theme.spacing['5']
      },
      exampleLabel: {
        color: theme.font.color.soft,
        padding: 0,
        marginTop: '-0.7rem',
        fontSize: theme.font.base.size.xxs
      }
    }),
    [theme]
  );

const INPUT_TRAILING_NAME_MIN_LENGTH = 2;

interface CustomDomainProps {
  customDomains: Array<DropdownOptionShape>;
  setTempCustomDomain: (tempCustomDomain: object) => void;
  setHasErrorForBasicInformation?: (hasErrorForBasicInformation: boolean) => void;
}
function CustomDomainWeblinkEdit({
  customDomains,
  setTempCustomDomain,
  setHasErrorForBasicInformation
}: CustomDomainProps): JSX.Element {
  const { translate } = useTranslate();
  const { fieldContainer, sectionTitle, urlLabel, exampleLabel } = useStyle(EditCustomDomainStyles);
  const [showExampleCustomDomain, setShowExampleCustomDomain] = React.useState(true);

  const { customDomain: domainValue } = useWatchField(['customDomain']);

  const formContext = useFormContext();
  const { publicRuntimeConfig } = getConfig();

  const trailingNameValidation = (inputTrailingName, dependencies) => {
    if (dependencies.customDomain === CVENT_DOMAIN_VALUE) {
      setHasErrorForBasicInformation(false);
      return undefined;
    }
    if (inputTrailingName.trim() === '') {
      setShowExampleCustomDomain(false);
      setHasErrorForBasicInformation(true);
      return [translate('events_plus_trailing_name_missing')];
    }
    if (inputTrailingName.length < INPUT_TRAILING_NAME_MIN_LENGTH) {
      setShowExampleCustomDomain(false);
      setHasErrorForBasicInformation(true);
      return [translate('events_plus_trailing_name_minlength_error')];
    }
    if (!/^[A-Za-z]*$/.test(inputTrailingName)) {
      setShowExampleCustomDomain(false);
      setHasErrorForBasicInformation(true);
      return [translate('events_plus_trailing_name_error')];
    }
    setHasErrorForBasicInformation(false);
    setShowExampleCustomDomain(true);
    return undefined;
  };

  const handleChange = values => {
    setTempCustomDomain(prevValues => ({
      ...prevValues,
      trailingName: values.target.value
    }));
  };

  return (
    <div css={fieldContainer} {...injectTestId('edit-custom-domain')}>
      <h2 css={sectionTitle}>{translate('video_hub_copy_weblink_header')}</h2>
      <div css={urlLabel}>{translate('events_plus_homepage')}</div>
      <Row margin={-13}>
        <Col width={332} padding={{ end: 20 }}>
          <Dropdown
            id="video-hub-form-custom-domain"
            name="customDomain"
            label={translate('events_plus_custom_domain')}
            options={customDomains}
            accessibilityLabel={translate('events_plus_custom_domain')}
            maxHeight={95}
            onUpdate={value => {
              setTempCustomDomain(prevValues => ({
                ...prevValues,
                customDomain: value
              }));
              const initialValues = formContext.getInitialValues();
              formContext.setValue(
                'trailingName',
                initialValues.customDomain === value ? initialValues.trailingName : ''
              );
            }}
          />
        </Col>
        <Col width={324}>
          <Textbox
            id="video-hub-form-trailing-name"
            name="trailingName"
            label={translate('events_plus_trailing_name')}
            maxLength={CENTER_CUSTOM_DOMAIN_MAX_LENGTH}
            validate={trailingNameValidation}
            dependencies={['customDomain']}
            readOnly={domainValue === CVENT_DOMAIN_VALUE}
            onChange={handleChange}
          />
          {domainValue !== CVENT_DOMAIN_VALUE && showExampleCustomDomain ? (
            <div css={exampleLabel}>
              {translate('events_plus_custom_domain_example', {
                cventDomain: new URL(publicRuntimeConfig.CVENT_SHORT_URL).hostname
              })}
            </div>
          ) : null}
        </Col>
      </Row>
    </div>
  );
}

export default CustomDomainWeblinkEdit;

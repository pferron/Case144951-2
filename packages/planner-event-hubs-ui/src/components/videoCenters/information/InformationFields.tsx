import React, { useMemo } from 'react';
import { CENTER_TITLE_MAX_LENGTH, CENTER_NAME_MAX_LENGTH, CENTER_EMAIL_MAX_LENGTH } from '@utils/constants';
import { Col } from '@cvent/carina/components/Col';
import { Row } from '@cvent/carina/components/Row';
import { Dropdown, Textbox } from '@cvent/carina/components/Forms';
import useBreakpoints from '@hooks/useBreakpoints';
import { useStyle } from '@hooks/useStyle';
import { useTranslate } from 'nucleus-text';
import { CommonFormStyles } from '@components/videoCenters/style';
import { accountLocale } from '@cvent/planner-event-hubs-model/operations/coreSOA';
import { AVAILABLE_LOCALES } from '@components/constants';
import { useAppFeatures } from '@components/AppFeaturesProvider';
import { useQuery } from '@apollo/client';
import isEmail from 'validator/lib/isEmail';

type Props = {
  tabletMaxWidth?: boolean;
  setHasErrorForBasicInformation?: (hasErrorForBasicInformation: boolean) => void;
  setTempValues?: (tempValues: object) => void;
};

function InformationFields({
  tabletMaxWidth = false,
  setHasErrorForBasicInformation = () => null,
  setTempValues = () => null
}: Props): JSX.Element {
  const { tabletWidth, sectionTitle } = useStyle(CommonFormStyles);
  const { translate } = useTranslate();
  const { isMobileOrTablet } = useBreakpoints();
  const { languageManagementFeature } = useAppFeatures();

  const { data: accountSupportedLocales, loading: loadingLocales } = useQuery(accountLocale, {
    skip: !languageManagementFeature
  });

  const localeOptionsFromAccount = useMemo(
    () =>
      accountSupportedLocales?.accountLocale?.map(locale => ({
        label: locale.Locale.CountryLanguage,
        value: locale.Locale.CultureCode
      })),
    [accountSupportedLocales]
  );

  const localeOptions = languageManagementFeature ? localeOptionsFromAccount : AVAILABLE_LOCALES;

  const titleValidation = (title = '') => {
    if (title.trim() === '') {
      setHasErrorForBasicInformation(true);
      return [translate('video_hub_form_title_error')];
    }
    setHasErrorForBasicInformation(false);
    return undefined;
  };

  const firstNameValidation = (firstName = '') => {
    if (firstName.trim() === '') {
      setHasErrorForBasicInformation(true);
      return [translate('video_hub_form_first_name_error')];
    }
    setHasErrorForBasicInformation(false);
    return undefined;
  };

  const lastNameValidation = (lastName = '') => {
    if (lastName.trim() === '') {
      setHasErrorForBasicInformation(true);
      return [translate('video_hub_form_last_name_error')];
    }
    setHasErrorForBasicInformation(false);
    return undefined;
  };

  const emailValidation = email => {
    if (isEmail(email)) {
      setHasErrorForBasicInformation(false);
      return undefined;
    }
    setHasErrorForBasicInformation(true);
    return [translate('video_hub_form_ownerEmail_error')];
  };

  const responsiveColPropsName = {
    s: { width: 1 },
    m: { width: 1 / 2 },
    l: { width: tabletMaxWidth ? 0.5 : 0.25 },
    xl: { width: tabletMaxWidth ? 0.5 : 0.25 }
  };

  const handleChange = values => {
    setTempValues(prevValues => ({
      ...prevValues,
      locale: values
    }));
  };

  return (
    <div css={tabletMaxWidth ? tabletWidth : null}>
      <h2 css={sectionTitle}>{translate('video_hub_form_section_info_header')}</h2>
      <Row margin={-8}>
        <Col>
          <Textbox
            id="video-hub-form-title"
            name="title"
            label={translate('video_hub_form_title_label')}
            maxLength={CENTER_TITLE_MAX_LENGTH}
            required
            validate={titleValidation}
          />
        </Col>
      </Row>
      <Row margin={-8}>
        <Col>
          {!loadingLocales && (
            <Dropdown
              id="video-hub-form-language"
              accessibilityLabel="language"
              name="locale"
              required
              onUpdate={handleChange}
              label={translate('video_hub_form_language_label')}
              options={localeOptions}
            />
          )}
        </Col>
      </Row>
      <Row margin={-8}>
        <Col {...responsiveColPropsName}>
          <Textbox
            id="video-hub-form-ownerFirstName"
            name="ownerFirstName"
            label={translate('video_hub_form_owner_first_name_label')}
            placeholder={translate('video_hub_form_first_name_placeholder')}
            maxLength={CENTER_NAME_MAX_LENGTH}
            required
            validate={firstNameValidation}
          />
        </Col>
        <Col {...responsiveColPropsName}>
          <Textbox
            id="video-hub-form-ownerLastName"
            name="ownerLastName"
            label={translate('video_hub_form_owner_last_name_label')}
            placeholder={translate('video_hub_form_last_name_placeholder')}
            required
            maxLength={CENTER_NAME_MAX_LENGTH}
            validate={lastNameValidation}
          />
        </Col>
        <Col width={tabletMaxWidth || isMobileOrTablet ? 1 : 0.5}>
          <Textbox
            id="video-hub-form-ownerEmail"
            name="ownerEmail"
            label={translate('video_hub_form_ownerEmail_label')}
            required
            maxLength={CENTER_EMAIL_MAX_LENGTH}
            validate={emailValidation}
            data-dd-privacy="mask"
          />
        </Col>
      </Row>
    </div>
  );
}

export default InformationFields;

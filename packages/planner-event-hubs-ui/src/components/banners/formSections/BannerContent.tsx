import { HelpCirclePopper } from '@components/tracking-codes/HelpCirclePopper';
import WritingAssistant from '@components/common/WritingAssistant';
import { CardContainerStyles } from '@components/common/style';
import { BannerStyles } from '@components/videoCenters/style';
import { Col } from '@cvent/carina/components/Col';
import { RadioGroup, Textarea, Textbox, useFormContext, useWatchField } from '@cvent/carina/components/Forms';
import { Row } from '@cvent/carina/components/Row';
import { HubPage } from '@cvent/planner-event-hubs-model/types';
import { CSSObject } from '@emotion/react';
import { useStyle } from '@hooks/useStyle';
import getConfig from 'next/config';
import { useTranslate } from 'nucleus-text';
import { useCallback } from 'react';
import {
  BANNER_BODY_FIELD,
  BANNER_BUTTON_DESTINATION_TYPE,
  BANNER_BUTTON_DESTINATION_URL,
  BANNER_BUTTON_TEXT_FIELD,
  BANNER_TITLE_FIELD,
  VIDEO_CENTER_PAGE,
  buttonLinkDestinations
} from '../BannerConstants';
import ButtonDestinationType from './ButtonDestinationType';

type BannerContentProps = {
  titleRequired: boolean;
  bannerTitleMaxLength?: number;
  bannerBodyMaxLength?: number;
  bannerButtonTextMaxLength?: number;
  hubPagesListData: HubPage[];
  showAIAssistant?: boolean;
  setIsValueChangedByAI?: (boolean) => void;
};

const useStyles = (): Record<string, CSSObject> => ({
  buttonDestinationLabelContainer: {
    display: 'flex',
    gap: 8
  }
});

function BannerContent({
  titleRequired,
  bannerTitleMaxLength = 60,
  bannerBodyMaxLength = 120,
  bannerButtonTextMaxLength = 35,
  hubPagesListData,
  showAIAssistant = false,
  setIsValueChangedByAI
}: BannerContentProps): JSX.Element {
  const { locale, translate } = useTranslate();
  const { setValue } = useFormContext();

  const onAIGeneratedText = (generatedText: string, field: string) => {
    setValue(field, generatedText);
    setIsValueChangedByAI(true);
  };

  const { buttonDestinationLabelContainer } = useStyles();
  const { cardTitle, cardText, subSectionTitle } = useStyle(CardContainerStyles);
  const { sectionTextBanner, borderLine } = useStyle(BannerStyles);

  const { publicRuntimeConfig } = getConfig();

  const validateTitle = (title = '') => {
    if (title.length < 1) {
      return [translate('Banners-FormErrors-Title')];
    }
    return undefined;
  };

  const dependencyValues = useWatchField([
    BANNER_TITLE_FIELD,
    BANNER_BODY_FIELD,
    BANNER_BUTTON_TEXT_FIELD,
    BANNER_BUTTON_DESTINATION_TYPE,
    BANNER_BUTTON_DESTINATION_URL,
    VIDEO_CENTER_PAGE
  ]);

  const bannerTitleLength = dependencyValues[BANNER_TITLE_FIELD] ? dependencyValues[BANNER_TITLE_FIELD].length : 0;
  const bannerBodyLength = dependencyValues[BANNER_BODY_FIELD] ? dependencyValues[BANNER_BODY_FIELD].length : 0;
  const bannerButtonTextLength = dependencyValues[BANNER_BUTTON_TEXT_FIELD]
    ? dependencyValues[BANNER_BUTTON_TEXT_FIELD].length
    : 0;

  const buttonTextRequired =
    dependencyValues[BANNER_BUTTON_DESTINATION_TYPE] === buttonLinkDestinations.EXTERNAL ||
    (dependencyValues[BANNER_BUTTON_DESTINATION_TYPE] === buttonLinkDestinations.INTERNAL &&
      dependencyValues[VIDEO_CENTER_PAGE]?.length);

  const validateButtonText = (buttonText, dep) => {
    if (
      (buttonText === '' || !buttonText) &&
      (dep[BANNER_BUTTON_DESTINATION_URL] !== '' || dep[VIDEO_CENTER_PAGE] !== '')
    ) {
      return [translate('Banners-FormErrors-ButtonText')];
    }
    return undefined;
  };

  const destinationLabel: JSX.Element = (
    <div css={buttonDestinationLabelContainer}>
      <p css={sectionTextBanner}>{translate('Banners-Content-Banner-Button-Destination-Type-Label')}</p>
      <HelpCirclePopper
        testID="destination-type"
        helpText={translate('Banners-Content-Banner-Button-Destination-Tooltip-Text')}
        accessibilityLabel={translate('banner_destination_type_help_accessibility_label')}
        placement="end-top"
      />
    </div>
  );

  const validateBannerBody = useCallback(
    value => {
      const errors = [];
      const remainingCharCount = bannerBodyMaxLength - (value?.length || 0);
      if (!!value && remainingCharCount < 0) {
        errors.push(translate('Banners-Text-Field-Remaining-Characters', { count: remainingCharCount }));
      }
      return errors.length === 0 ? undefined : errors;
    },
    [translate, bannerBodyMaxLength]
  );

  const titleValidateProps = titleRequired ? { validate: validateTitle } : null;

  const writingAssistanttextArea: JSX.Element = (
    <Textarea
      label={translate('Banners-Content-Banner-Body-Label')}
      name={BANNER_BODY_FIELD}
      messages={
        bannerBodyMaxLength - bannerBodyLength < 0
          ? ''
          : translate('Banners-Text-Field-Remaining-Characters', {
              count: (bannerBodyMaxLength - bannerBodyLength).toString()
            })
      }
      validate={validateBannerBody}
    />
  );

  return (
    <>
      <div>
        <h3 css={cardTitle}>{translate('Banners-Content-Section-Title')}</h3>
        <p css={cardText}>{translate('Banners-Content-Section-Description')}</p>
      </div>
      <Row>
        <Col padding={0}>
          <div css={borderLine}>
            <h4 css={subSectionTitle}>{translate('Banners-Content-Text-Heading')}</h4>
            <p css={sectionTextBanner}>{translate('Banners-Content-Text-Description')}</p>
            <Textbox
              label={translate('Banners-Content-Banner-Title-Label')}
              maxLength={bannerTitleMaxLength}
              name={BANNER_TITLE_FIELD}
              messages={translate('Banners-Text-Field-Remaining-Characters', {
                count: (bannerTitleMaxLength - bannerTitleLength).toString()
              })}
              {...titleValidateProps}
              required={titleRequired}
            />
            <WritingAssistant
              showAIAssistant={showAIAssistant}
              saveWritingAssistantText={({ generatedText }) => onAIGeneratedText(generatedText, BANNER_BODY_FIELD)}
              fieldIdentifier="PlannerEventHubs.BannerContent"
              fieldTitle={translate('Banners-Content-Banner-Body-Label')}
              inputText={dependencyValues[BANNER_BODY_FIELD]}
              maxTextLength={bannerBodyMaxLength}
              assistantUrl={publicRuntimeConfig?.WRITING_ASSISTANT_URL}
              locale={locale}
              wrappedTextArea={writingAssistanttextArea}
            />
          </div>
        </Col>
      </Row>
      <Row>
        <Col padding={0}>
          <div css={borderLine}>
            <h4 css={subSectionTitle}>{translate('Banners-Content-Button-Heading')}</h4>
            <p css={sectionTextBanner}>{translate('Banners-Content-Button-Description')}</p>
            <Textbox
              label={translate('Banners-Content-Banner-Button-Text-Label')}
              maxLength={bannerButtonTextMaxLength}
              name={BANNER_BUTTON_TEXT_FIELD}
              dependencies={[BANNER_BUTTON_DESTINATION_TYPE, VIDEO_CENTER_PAGE, BANNER_BUTTON_DESTINATION_URL]}
              validate={validateButtonText}
              messages={translate('Banners-Text-Field-Remaining-Characters', {
                count: (bannerButtonTextMaxLength - bannerButtonTextLength).toString()
              })}
              required={!!buttonTextRequired}
            />
            <RadioGroup
              name={BANNER_BUTTON_DESTINATION_TYPE}
              label={destinationLabel}
              dependencies={[BANNER_BUTTON_TEXT_FIELD]}
              readOnlyRenderer={value => {
                if (value === buttonLinkDestinations.INTERNAL) {
                  return translate('Banners-Form-Video-Center-Page');
                }
                return translate('Banners-Content-Banner-Button-Destination-Type-External-Link-Label');
              }}
              inline
              options={[
                {
                  label: translate('Banners-Form-Video-Center-Page'),
                  value: buttonLinkDestinations.INTERNAL
                },
                {
                  label: translate('Banners-Content-Banner-Button-Destination-Type-External-Link-Label'),
                  value: buttonLinkDestinations.EXTERNAL
                }
              ]}
            />
            <ButtonDestinationType hubPagesListData={hubPagesListData} />
          </div>
        </Col>
      </Row>
    </>
  );
}

export default BannerContent;

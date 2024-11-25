import React, { useMemo } from 'react';
import { Form } from '@cvent/carina/components/Forms';
import Modal from '@cvent/carina/components/Modal';
import { useTranslate } from 'nucleus-text';
import { XIcon } from '@cvent/carina/components/Icon';
import { Button } from '@cvent/carina/components/Button';
import { BackGroundPreviewData } from '@components/customRegistration/BackgroundAppearanceCard';
import ResponsiveImage from '@cvent/carina/components/legacy/Image/ResponsiveImage';
import { useCenterInfo } from '@hooks/useCenterInfo';
import { injectTestId } from '@cvent/nucleus-test-automation';
import useBreakpoints from '@hooks/useBreakpoints';
import { CardBody, CardContainer } from '@cvent/carina/components/Card';
import { Col } from '@cvent/carina/components/Col';
import LoginTextBox from '@components/customRegistration/LoginTextBox';
import { Row } from '@cvent/carina/components/Row';
import { Settings } from '@cvent/planner-event-hubs-model/types';
import BlockThemeProvider, {
  MoodThemeProvider,
  PrimaryThemeProvider
} from '@cvent/blocks/components/BlockThemeProvider';
import ScrollViewWithBars from '@cvent/carina/components/ScrollViewWithBars';
import { PreviewModalStyles } from '@components/customRegistration/style';
import { CustomFont } from '@utils/fontUtils';
import { useStyle } from '@hooks/useStyle';
import { HELVETICA_BLOCKS_FONT } from '@utils/constants';
import { useAppFeatures } from '@components/AppFeaturesProvider';
import Footer from './Footer';

interface Props {
  isOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  backGroundPreviewDetails: BackGroundPreviewData;
  privacySettings: Settings;
  isAllowTurnOffCodeSnippets: boolean;
  headingsFont: CustomFont;
  bodyFont: CustomFont;
}
function PreviewModal({
  isOpen,
  setIsModalOpen,
  backGroundPreviewDetails,
  privacySettings,
  isAllowTurnOffCodeSnippets,
  headingsFont,
  bodyFont
}: Props): JSX.Element {
  const { translate } = useTranslate();
  const centerInfo = useCenterInfo();
  const logoImageUrl = centerInfo?.theme?.logoImageUrl;
  const { m, l, isMobile } = useBreakpoints();
  const logoAltText = centerInfo?.theme?.logoAltText;
  const videoCenterTitle = centerInfo?.centerTitle;
  const backgroundImageAltText = backGroundPreviewDetails?.backgroundImageAltText;
  const { theme: centerTheme } = useCenterInfo();
  const { cookieNotificationFeature } = useAppFeatures();
  const backgroundImageUrl = useMemo(
    () => backGroundPreviewDetails?.newBackgroundImage?.croppedUrl || backGroundPreviewDetails?.newBackgroundImage?.url,
    [backGroundPreviewDetails]
  );
  const styles = useStyle(PreviewModalStyles);
  const displayManagePreferencesModal =
    privacySettings.allowTurnOffCookies || privacySettings.allowTurnOffGoogleAnalytics || isAllowTurnOffCodeSnippets;
  const displayCcpaLinkText =
    cookieNotificationFeature && privacySettings.ccpaEnableDoNotSell && privacySettings.ccpaDoNotSellUrlEnabled;

  const previewModalHeader = useMemo(
    () => (
      <div css={styles.headerContainer} {...injectTestId('background-preview-modal-header')}>
        <div css={styles.headerInnerContainer}>
          <h3 css={styles.previewText}>{translate('background_image_preview_heading')}</h3>
          <Button
            appearance="ghost"
            icon={XIcon}
            aria-label={translate('close_modal_button_label')}
            onClick={() => {
              setIsModalOpen(false);
            }}
            variant={backgroundImageUrl ? 'neutral-white' : 'neutral'}
            testID="preview-modal-cross-button"
          />
        </div>
      </div>
    ),
    [styles, backgroundImageUrl, setIsModalOpen, translate]
  );

  const previewModalFooter = useMemo(
    () => (
      <BlockThemeProvider
        primary={centerTheme?.mainColor}
        secondary={centerTheme?.actionColor}
        background={centerTheme?.backgroundColor}
        mood={centerTheme?.moodColor}
        safeMode={centerTheme?.safeMode}
        headingFont={headingsFont ?? HELVETICA_BLOCKS_FONT}
        bodyFont={bodyFont ?? HELVETICA_BLOCKS_FONT}
        {...injectTestId('background-preview-modal-footer')}
      >
        <MoodThemeProvider>
          <Footer
            termsOfUseText={privacySettings.termsLinkText}
            cventPrivacyPolicyText={
              privacySettings.displayCventPrivacyPolicy ? privacySettings.cventPrivacyPolicyLinkText : null
            }
            customPrivacyPolicyText={privacySettings.privacyPolicyLinkText}
            displayManagePreferencesModal={displayManagePreferencesModal}
            ccpaLinkText={privacySettings.ccpaLinkText}
            displayCcpaLinkText={displayCcpaLinkText}
          />
        </MoodThemeProvider>
      </BlockThemeProvider>
    ),
    [centerTheme, privacySettings, displayManagePreferencesModal, bodyFont, headingsFont, displayCcpaLinkText]
  );

  const previewModalBody = useMemo(
    () => (
      <ScrollViewWithBars
        css={{ height: '100vh' }}
        forceStickyFooter
        header={previewModalHeader}
        footer={previewModalFooter}
      >
        <div
          {...injectTestId('registration-form-container')}
          css={
            backGroundPreviewDetails.showLogo && logoImageUrl
              ? [styles.containerStyle]
              : [{ ...styles.containerStyle, paddingTop: '12.5rem' }]
          }
          aria-label={
            !backGroundPreviewDetails.decorativeImage && backgroundImageUrl && backgroundImageAltText
              ? backgroundImageAltText
              : null
          }
          {...injectTestId('background-image')}
        >
          {backGroundPreviewDetails.showLogo && logoImageUrl && (
            <div css={{ height: '5.625rem' }} {...injectTestId('registration-form-logo')}>
              <ResponsiveImage
                src={logoImageUrl}
                css={styles.logoStyle}
                alt={logoAltText}
                srcSet={`${logoImageUrl}?d=640&unique=true ${m}w, ${logoImageUrl}?d=1280&unique=true ${l}w`}
                sizes={`(max-width: ${m}px) 50vw, (max-width: ${l}px) 25vw`}
              />
            </div>
          )}
          <div css={styles.cardContainerStyle} {...injectTestId('registration-form-card-container')}>
            <BlockThemeProvider
              primary={centerTheme?.mainColor}
              secondary={centerTheme?.actionColor}
              background={centerTheme?.backgroundColor}
              mood={centerTheme?.moodColor}
              safeMode={centerTheme?.safeMode}
              headingFont={headingsFont ?? HELVETICA_BLOCKS_FONT}
              bodyFont={bodyFont ?? HELVETICA_BLOCKS_FONT}
              css={{ borderRadius: '0.625rem' }}
            >
              <PrimaryThemeProvider css={{ borderRadius: '0.625rem' }}>
                <CardContainer width={isMobile ? '100vw' : '31.5rem'}>
                  <CardBody>
                    <div css={{ width: '100%', margin: isMobile ? '1rem' : '2rem 1.5rem' }}>
                      <h2 css={styles.title}>{videoCenterTitle}</h2>
                      <h2 css={styles.heading}>{translate('registration_form_signup_or_login_text')}</h2>
                      <Col>
                        <Form>
                          <LoginTextBox
                            id="firstName"
                            testID="firstName"
                            label={translate('registration_form_first_name_text')}
                            isRequired
                          />
                          <LoginTextBox
                            id="lastName"
                            testID="lastName"
                            label={translate('registration_form_last_name_text')}
                            isRequired
                          />
                          <LoginTextBox
                            id="email"
                            testID="email"
                            label={translate('registration_form_email_text')}
                            isRequired
                          />
                          <Row justifyContent="center">
                            <Col
                              padding={{ top: 8 }}
                              flex={{ display: 'flex', justifyContent: 'center' }}
                              css={isMobile ? { paddingLeft: '0rem', paddingRight: '0rem' } : null}
                            >
                              <Button
                                name="registration-form-submit"
                                testID="registration-form-submit"
                                appearance="filled"
                                size="l"
                                css={styles.nextButton}
                                aria-label={translate('registration_form_next_button')}
                                text={translate('registration_form_next_button')}
                                type="submit"
                              />
                            </Col>
                          </Row>
                        </Form>
                      </Col>
                    </div>
                  </CardBody>
                </CardContainer>
              </PrimaryThemeProvider>
            </BlockThemeProvider>
          </div>
        </div>
      </ScrollViewWithBars>
    ),
    [
      previewModalHeader,
      previewModalFooter,
      backGroundPreviewDetails.showLogo,
      backGroundPreviewDetails.decorativeImage,
      logoImageUrl,
      styles.containerStyle,
      styles.logoStyle,
      styles.cardContainerStyle,
      styles.title,
      styles.heading,
      styles.nextButton,
      backgroundImageUrl,
      backgroundImageAltText,
      logoAltText,
      m,
      l,
      centerTheme?.mainColor,
      centerTheme?.actionColor,
      centerTheme?.backgroundColor,
      centerTheme?.moodColor,
      centerTheme?.safeMode,
      headingsFont,
      bodyFont,
      isMobile,
      videoCenterTitle,
      translate
    ]
  );

  const displayContent = useMemo(() => {
    if (backgroundImageUrl) {
      return previewModalBody;
    }
    return (
      <BlockThemeProvider
        primary={centerTheme?.mainColor}
        secondary={centerTheme?.actionColor}
        background={centerTheme?.backgroundColor}
        mood={centerTheme?.moodColor}
        safeMode={centerTheme?.safeMode}
        headingFont={headingsFont ?? HELVETICA_BLOCKS_FONT}
        bodyFont={bodyFont ?? HELVETICA_BLOCKS_FONT}
        {...injectTestId('background-preview-modal-theming')}
      >
        <PrimaryThemeProvider>{previewModalBody}</PrimaryThemeProvider>
      </BlockThemeProvider>
    );
  }, [centerTheme, backgroundImageUrl, previewModalBody, headingsFont, bodyFont]);

  return (
    <Modal
      format="fullscreen"
      isOpen={isOpen}
      testID="background-image-preview-modal"
      portal
      aria-label={translate('background_image_preview_modal_label')}
      css={backgroundImageUrl ? [{ backgroundImage: `url(${backgroundImageUrl})` }, styles.modal] : null}
    >
      {displayContent}
    </Modal>
  );
}

export default PreviewModal;

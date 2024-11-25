import React, { ReactNode, useState } from 'react';
import { useTranslate } from 'nucleus-text';
import { useStyle } from '@hooks/useStyle';
import { CustomRegistrationCardContainerStyle, FormEditorCardStyle } from '@components/customRegistration/style';
import { injectTestId } from '@cvent/nucleus-test-automation';
import { Button } from '@cvent/carina/components/Button';
import { EyeIcon } from '@cvent/carina/components/Icon';
import { EntityType, Settings } from '@cvent/planner-event-hubs-model/types';
import {
  BACKGROUND_IMAGE_ACCEPTED_FILE_FORMAT,
  CUSTOM_REGISTRATION_IMAGE_FILE_NAME_MAX_LENGTH,
  CUSTOM_REGISTRATION_IMAGE_MAXIMUM_SIZE,
  CUSTOM_REGISTRATION_IMAGE_MAXIMUM_SIZE_IN_MB
} from '@utils/constants';
import { Image } from '@components/common/imageUpload/Image';
import Checkbox from '@cvent/carina/components/Checkbox';
import { NewImage } from '@components/common/imageUpload/types';
import PreviewModal from '@components/customRegistration/PreviewModal';
import { CustomFont } from '@utils/fontUtils';
import { aspectRatioTypes, translations } from '@cvent/image-editor';
import FormElement from '@cvent/carina/components/FormElement';
import { Row } from '@cvent/carina/components/Row';
import { Col } from '@cvent/carina/components/Col';
import { RadioGroup } from '@cvent/carina/components/RadioGroup';
import { HelpCirclePopper } from '@components/tracking-codes/HelpCirclePopper';
import Textarea from '@cvent/carina/components/Textarea/Textarea';
import { isMobile } from 'react-device-detect';
import { BACKGROUND_IMAGE_ALT_TEXT_MAX_LIMIT } from '@components/constants';

function BackgroundAppearanceCard({
  hubId,
  originalSettings,
  setOriginalSettings,
  setIsPreviewModalOpen,
  isPreviewModalOpen,
  privacySettings,
  isAllowTurnOffCodeSnippets,
  headingsFont,
  bodyFont,
  errorAltText
}: Props): React.JSX.Element {
  const styles = useStyle(FormEditorCardStyle);
  const [imageDeleted, setImageDeleted] = useState(false);
  const { translate } = useTranslate();
  return (
    <PreviewCardContainer testID="background-preview-card-container">
      {isPreviewModalOpen && (
        <PreviewModal
          isOpen={isPreviewModalOpen}
          setIsModalOpen={setIsPreviewModalOpen}
          backGroundPreviewDetails={originalSettings}
          privacySettings={privacySettings}
          isAllowTurnOffCodeSnippets={isAllowTurnOffCodeSnippets}
          headingsFont={headingsFont}
          bodyFont={bodyFont}
        />
      )}
      <div>
        <div css={{ display: 'flex', justifyContent: 'space-between' }}>
          <h2 css={{ marginTop: '0', fontSize: '1.5rem' }}>{translate('custom_registration_appearance_heading')}</h2>
          <Button
            text={translate('custom_registration_appearance_preview_button_text')}
            appearance="lined"
            icon={EyeIcon}
            onClick={() => setIsPreviewModalOpen(true)}
            {...injectTestId('Background-preview')}
          />
        </div>
        <div css={styles.previewCardTextStyle}>{translate('custom_registration_appearance_text')}</div>
        <div>
          <h3 css={styles.previewCardHeadingStyle}>{translate('custom_registration_logo')}</h3>
          <div>
            <Checkbox
              id="Background-Preview-Logo"
              testID="Background-Preview-Logo"
              name="Logo"
              value="Logo"
              checked={originalSettings.showLogo}
              aria-label={translate('custom_registration_checkbox_showlogo_text')}
              onChange={({ target }: React.ChangeEvent<HTMLInputElement>) => {
                setOriginalSettings(prevState => ({
                  ...prevState,
                  showLogo: target.checked
                }));
              }}
            >
              {translate('custom_registration_checkbox_showlogo_text')}
            </Checkbox>
          </div>
          <div css={{ marginBottom: '1rem' }}>
            <h3 css={styles.previewCardHeadingStyle}>{translate('custom_registration_background')}</h3>
            <div css={styles.previewCardTextStyle}>{translate('custom_registration_background_style')}</div>
          </div>
        </div>
      </div>
      <div css={styles.decorativeImageTextStyle}> {translate('background_image_text_default')} </div>
      <div>
        <Image
          showImageName={false}
          editMode
          videoCenterId={hubId}
          setNewImage={newImageParam => {
            setOriginalSettings(prevState => ({
              ...prevState,
              newBackgroundImage: newImageParam
            }));
          }}
          newImage={originalSettings.newBackgroundImage}
          currentImage={originalSettings.backgroundImage}
          imageDeleted={imageDeleted}
          setImageDeleted={setImageDeleted}
          supportedText={translate('custom_registration_background_image_supported_fileType_text', {
            maxSize: CUSTOM_REGISTRATION_IMAGE_MAXIMUM_SIZE_IN_MB
          })}
          recommendedText="custom_registration_background_image_recommended_dimension_text"
          incorrectImageUploadText={translate('custom_registration_background_image_supported_fileType_text', {
            maxSize: CUSTOM_REGISTRATION_IMAGE_MAXIMUM_SIZE_IN_MB
          })}
          maxWidthImage={20}
          noImageTitleText="custom_registration_background_empty_image_alt_text"
          imageAltText="custom_registration_background_image_alt_text"
          noImageUploadedText="custom_registration_background_empty_image_alt_text"
          showPlaceHolderInReadMode
          imageMaximumSize={CUSTOM_REGISTRATION_IMAGE_MAXIMUM_SIZE}
          entityId={hubId}
          aspectRatio={aspectRatioTypes.sixteenByNine}
          aspectRatioOptions={Array.of(
            translations.crop16By9,
            translations.crop4By3,
            translations.crop3By2,
            translations.cropSquare,
            translations.freeForm
          )}
          disableDelete={false}
          maxFileNameLength={CUSTOM_REGISTRATION_IMAGE_FILE_NAME_MAX_LENGTH}
          allowImageEdit
          entityType={EntityType.BackgroundImage}
          imageUploadTriggerLocation="Form-BackGround-Preview"
          acceptedFileFormats={BACKGROUND_IMAGE_ACCEPTED_FILE_FORMAT}
        />
      </div>
      {(originalSettings?.newBackgroundImage?.url || originalSettings?.backgroundImage?.url) && !imageDeleted && (
        <>
          <div css={styles.decorativeImageTextStyle}>{translate('decorative_image')}</div>
          <Row margin={{ start: -11 }}>
            <Col>
              <FormElement>
                <div css={styles.questionContainer}>
                  <FormElement.Label
                    label={translate('decorative_image_question_text')}
                    labelFor="decorativeImageText"
                    required
                  />
                  <div css={styles.flyout}>
                    <HelpCirclePopper
                      testID="decorative-image-tooltip"
                      aria-label={translate('decorative_image_tooltip_body')}
                      helpText={translate('decorative_image_tooltip_body')}
                      accessibilityLabel={translate('decorative_image_tooltip_body')}
                    />
                  </div>
                </div>
                <RadioGroup
                  name={translate('decorative_image_question_text')}
                  id="decorative-image"
                  testID="decorative-image"
                  aria-label={translate('decorative_image_question_text')}
                  options={[
                    {
                      label: translate('decorative_image_option_yes'),
                      value: 1
                    },
                    {
                      label: translate('decorative_image_option_no'),
                      value: 0
                    }
                  ]}
                  onUpdate={selectedOption => {
                    setOriginalSettings(prevState => ({
                      ...prevState,
                      decorativeImage: Boolean(selectedOption)
                    }));
                  }}
                  selected={originalSettings.decorativeImage ? 1 : 0}
                />
              </FormElement>
            </Col>
          </Row>
          {!originalSettings.decorativeImage && (
            <Row margin={{ start: -11 }}>
              <Col width={isMobile ? 1 : 1 / 2}>
                <FormElement>
                  <div css={styles.questionContainer}>
                    <FormElement.Label
                      label={translate('background_image_alt_text')}
                      labelFor="backgroundImageAltText"
                      required
                    />
                    <div css={styles.flyout}>
                      <HelpCirclePopper
                        testID="background-image-alt-text-help"
                        aria-label={translate('background_image_alt_text_help_icon')}
                        helpText={translate('background_image_alt_text_help_icon')}
                        accessibilityLabel={translate('background_image_alt_text_help_icon')}
                      />
                    </div>
                  </div>
                  <div>
                    <Textarea
                      id="backgroundImageAltText"
                      value={originalSettings.backgroundImageAltText || ''}
                      onChange={({ target }): void => {
                        setOriginalSettings(prev => ({
                          ...prev,
                          backgroundImageAltText: target.value
                        }));
                      }}
                      maxLength={BACKGROUND_IMAGE_ALT_TEXT_MAX_LIMIT}
                      hasError={errorAltText}
                      testID="background-image-alt-text-input"
                    />
                  </div>
                </FormElement>
              </Col>
            </Row>
          )}
        </>
      )}
    </PreviewCardContainer>
  );
}

function PreviewCardContainer({ children, testID }: CardProps): React.JSX.Element {
  const styles = useStyle(CustomRegistrationCardContainerStyle);
  return (
    <div css={styles.bodyContainerEdit} {...injectTestId(testID)}>
      <div css={styles.childrenContainer}>{children}</div>
      <div css={styles.buttonContainer} />
    </div>
  );
}
interface CardProps {
  children: ReactNode;
  testID: string;
}

interface Props {
  hubId: string;
  originalSettings: BackGroundPreviewData;
  isPreviewModalOpen: boolean;
  setIsPreviewModalOpen: (boolean) => void;
  privacySettings: Settings;
  isAllowTurnOffCodeSnippets: boolean;
  headingsFont: CustomFont;
  bodyFont: CustomFont;
  setOriginalSettings: (settings) => void;
  errorAltText: boolean;
  setErrorAltText: (errorAltText: boolean) => void;
}

export interface BackGroundPreviewData {
  showLogo: boolean;
  backgroundImage: NewImage;
  newBackgroundImage: NewImage;
  decorativeImage: boolean;
  backgroundImageAltText: string;
}
export default BackgroundAppearanceCard;

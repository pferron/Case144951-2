import React from 'react';
import { HelpCirclePopper } from '@components/tracking-codes/HelpCirclePopper';
import { Image } from '@components/common/imageUpload/Image';
import { CurrentImage, NewImage } from '@components/common/imageUpload/types';
import { CardContainerStyles } from '@components/common/style';
import { ImageStyle } from '@components/videoCenters/style';
import { Button } from '@cvent/carina/components/Button';
import { Col } from '@cvent/carina/components/Col';
import FormElement from '@cvent/carina/components/FormElement/FormElement';
import { CheckIcon, PencilIcon, XIcon } from '@cvent/carina/components/Icon';
import { Row } from '@cvent/carina/components/Row';
import Textbox from '@cvent/carina/components/Textbox/Textbox';
import { Theme } from '@cvent/planner-event-hubs-model/types';
import { useStyle } from '@hooks/useStyle';
import { IMAGE_MAXIMUM_SIZE, IMAGE_MAXIMUM_SIZE_IN_MB } from '@utils/constants';
import { useTranslate } from 'nucleus-text';

const MAX_LENGTH_ALT_TEXT = 100;

export function ImageFields({
  cancel,
  editMode,
  setEditMode,
  currentImage,
  imageDeleted,
  setImageDeleted,
  newImage,
  setNewImage,
  hubId,
  themeState,
  onThemeImageChange
}: Props): React.JSX.Element {
  const { translate } = useTranslate();
  const { sectionHeader, sectionTitle, sectionText, cardTitle, cardText } = useStyle(CardContainerStyles);
  const { imageAltText, formStyles, buttonStyles, cancelButtonStyles } = useStyle(ImageStyle);
  const { logoAltText } = themeState;

  const remainingLengthMessage = translate('characters_left_label', {
    characterCount: MAX_LENGTH_ALT_TEXT - (logoAltText?.length || 0)
  });

  return (
    <Row>
      <Col padding={0}>
        <div css={formStyles}>
          <h3 css={cardTitle}>{translate('video_hub_theming_images_header')}</h3>

          <div css={{ padding: 0 }}>
            {!editMode ? (
              <Button
                testID="theming-page-edit-form-button"
                icon={PencilIcon}
                appearance="ghost"
                accessibilityLabel={translate('theming_edit_accessibility_button_label')}
                onClick={(): void => {
                  setEditMode(true);
                }}
              />
            ) : (
              <span css={buttonStyles}>
                <span css={cancelButtonStyles}>
                  <Button
                    icon={XIcon}
                    type="reset"
                    appearance="ghost"
                    accessibilityLabel={translate('theming_edit_cancel_accessibility_button_label')}
                    testID="theming-cancel-edit-form-button"
                    onClick={cancel}
                    variant="neutral"
                  />
                </span>
                <Button
                  icon={CheckIcon}
                  type="submit"
                  appearance="ghost"
                  accessibilityLabel={translate('theming_edit_save_accessibility_button_label')}
                  testID="theming-page-save-edit-form-button"
                  disabled={logoAltText?.length === 0 || logoAltText === null}
                />
              </span>
            )}
          </div>
        </div>
      </Col>
      <Col padding={0}>
        <div>
          <p css={cardText}>{translate('video_hub_theming_images_content')}</p>
          <div css={sectionHeader}>
            <Row>
              <Col padding={0}>
                <h5 css={sectionTitle}>{translate('video_hub_theming_logo_image_header')}</h5>
                <p css={sectionText}>{translate('video_hub_theming_logo_image_text')}</p>
              </Col>

              <Col padding={0}>
                <div css={{ paddingTop: '1.5rem' }}>
                  <Image
                    isLogo
                    preSignedUpload
                    editMode={editMode}
                    setNewImage={setNewImage}
                    newImage={newImage}
                    currentImage={currentImage}
                    imageDeleted={imageDeleted}
                    setImageDeleted={setImageDeleted}
                    supportedText={translate('logo_image_supported_fileType_text', {
                      maxSize: IMAGE_MAXIMUM_SIZE_IN_MB
                    })}
                    recommendedText="logo_image_recommended_dimension_text"
                    incorrectImageUploadText={translate('logo_image_supported_fileType_text', {
                      maxSize: IMAGE_MAXIMUM_SIZE_IN_MB
                    })}
                    maxWidthImage={20}
                    noImageTitleText="theming_empty_image_alt_text"
                    imageAltText={logoAltText}
                    noImageUploadedText="theming_empty_image_alt_text"
                    showPlaceHolderInReadMode={false}
                    imageMaximumSize={IMAGE_MAXIMUM_SIZE}
                    entityId={hubId}
                    videoCenterId={hubId}
                    aspectRatio={5.33}
                    disableDelete={null}
                    allowImageEdit
                    entityType="Logo"
                    imageUploadTriggerLocation="Branding-logo"
                  />
                </div>
              </Col>
              <Col padding={{ start: 0, end: 32 }}>
                <div>
                  <FormElement>
                    <div css={{ ...imageAltText, gap: 8 }}>
                      <div>
                        <FormElement.Label
                          label={translate('theme_image_alt_label')}
                          labelFor="logo_alt_image"
                          required
                        />
                      </div>
                      <div>
                        <HelpCirclePopper
                          testID="logo_alt_image"
                          helpText={translate('logo_image_alt_text_tooltip_body')}
                          accessibilityLabel={translate('logo_image_alt_text_tooltip_body')}
                        />
                      </div>
                    </div>
                    {!editMode ? (
                      <p css={{ margin: 0 }}>{logoAltText}</p>
                    ) : (
                      <>
                        <Textbox
                          id="logoAltText"
                          name="logoAltText"
                          value={logoAltText}
                          onChangeText={alt =>
                            onThemeImageChange({ ...themeState, logoAltText: alt.length !== 0 ? alt : null })
                          }
                          maxLength={100}
                        />
                        <FormElement.Message text={remainingLengthMessage} />
                      </>
                    )}
                  </FormElement>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </Col>
    </Row>
  );
}

interface Props {
  cancel: () => void;
  editMode: boolean;
  setEditMode: (boolean) => void;
  currentImage: CurrentImage;
  imageDeleted: boolean;
  setImageDeleted: (boolean) => void;
  newImage: NewImage;
  setNewImage: (NewImage) => void;
  hubId: string;
  themeState: Theme;
  onThemeImageChange: (arg0: Theme) => void;
}

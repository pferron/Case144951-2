import { useTranslate } from 'nucleus-text';
import { RadioGroup, Textarea, useFormContext, useWatchField, Textbox } from '@cvent/carina/components/Forms';
import { Col } from '@cvent/carina/components/Col';
import { Row } from '@cvent/carina/components/Row';
import { HelpCircleIcon } from '@cvent/carina/components/Icon';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  CHANNEL_DESCRIPTION_MAX_LENGTH,
  CHANNEL_IMAGE_FILE_NAME_MAX_LENGTH,
  CHANNEL_NAME_MAX_LENGTH,
  IMAGE_MAXIMUM_SIZE,
  IMAGE_MAXIMUM_SIZE_IN_MB,
  VIDEO_HUB_PATH_PARAM
} from '@utils/constants';
import { FormElement } from '@cvent/carina/components/FormElement';
import { Popover } from '@cvent/carina/components/Popover';
import { ChannelInformationModalStyles } from '@components/channels/information/style';
import { useStyle } from '@hooks/useStyle';
import { Image } from '@components/common/imageUpload/Image';
import { NewImage } from '@components/common/imageUpload/types';
import { ChannelInformationType } from '@components/channels/type/channel';
import { isChannelActive } from '@utils/channelHelper';
import { useTheme } from '@cvent/carina/components/ThemeProvider/useTheme';
import { useRouter } from 'next/router';
import { ChannelStatus } from '@cvent/planner-event-hubs-model/types';
import { CventWritingAssistant, TextType } from '@cvent/writing-assistant-component';
import getConfig from 'next/config';
import { aspectRatioTypes, translations } from '@cvent/image-editor';

export function ChannelInformationFormData({
  channelData,
  imageDeleted,
  setImageDeleted,
  newImage,
  setNewImage,
  setIsPageEdited,
  channelStatus,
  setChannelStatus
}: Props): React.JSX.Element {
  const { translate } = useTranslate();
  const router = useRouter();
  const { query = {} } = router;
  const videoCenterId = query[VIDEO_HUB_PATH_PARAM] as string;
  const { font } = useTheme();
  const { publicRuntimeConfig } = getConfig();

  const active = translate('channel_status_active');
  const inactive = translate('channel_status_inactive');

  const { title: currentChannelName = '' } = useWatchField(['title']);
  const { description: currentChannelDescription = '' } = useWatchField(['description']);
  const channelActiveStatus = useCallback(() => channelStatus === ChannelStatus.Active, [channelStatus]);
  const [disableDeleteButton, setDisableDeleteButton] = useState<boolean>(channelActiveStatus);
  const [imageChange, setImageChange] = useState<boolean>(false);
  const { setValue } = useFormContext();

  const remainingLengthMessage = useCallback(
    (maxLength: number, value: string): string =>
      `${translate('characters_left_label', {
        characterCount: maxLength - value.length
      })}`,
    [translate]
  );

  const updateTransform = useCallback((value: string): string => value.trimStart(), []);

  const { formStyles, imageLabelStyles, tooltipButtonStyles } = useStyle(ChannelInformationModalStyles);
  // FIREBALL
  /* eslint-disable */
  function PopOverHelper({ popOverText }): React.JSX.Element {
    return (
      <Popover
        placement="start-top"
        accessible
        portal
        accessibilityLabel={translate('channel_status_help_accessibility_label')}
        // FIREBALL
        /* eslint-disable */
        trigger={({ toggleOpen, isOpen, closePopover }): React.JSX.Element => (
          <span
            id="channel_status_help_circle_icon"
            role="tooltip"
            css={tooltipButtonStyles}
            tabIndex={0}
            onClick={toggleOpen}
            onFocus={isOpen ? undefined : toggleOpen}
            onBlur={isOpen ? closePopover : undefined}
            onMouseOver={isOpen ? undefined : toggleOpen}
            onMouseLeave={isOpen ? closePopover : undefined}
          >
            <HelpCircleIcon color={font.color.soft} />
          </span>
        )}
      >
        <p id="channel_status_help_circle_icon_description" style={{ margin: '0rem', maxWidth: '18rem' }}>
          {translate(popOverText)}
        </p>
      </Popover>
    );
  }

  const channelStatusLabel: React.JSX.Element = (
    <div css={{ display: 'flex' }}>
      <FormElement.Label label={translate('channel_status_label')} labelFor="status" required />
      <PopOverHelper popOverText="channel_status_tooltip_body" />
    </div>
  );

  const requiredNameValidation = (name, dependencies) => {
    if (name.trim() === '') {
      return [translate('channel_name_required')];
    }
    return undefined;
  };

  const requiredDescriptionValidation = (description, dependencies) => {
    if (description.trim() === '') {
      return [translate('channel_description_required')];
    }
    return undefined;
  };

  const description = (
    <Textarea
      id="channel-description-input-field"
      name="description"
      label={translate('channel_description_label')}
      aria-label={translate('channel_description_label')}
      onUpdateTransform={updateTransform}
      required
      validate={requiredDescriptionValidation}
      hasError={!currentChannelDescription.length}
      minHeight="l"
      maxLength={currentChannelDescription.length ? CHANNEL_DESCRIPTION_MAX_LENGTH : null}
    />
  );

  const isEdited = useMemo(() => {
    const edited =
      currentChannelName.trim() !== '' &&
      currentChannelDescription.trim() !== '' &&
      (currentChannelName.trim() !== channelData.title ||
        currentChannelDescription.trim() !== channelData.description ||
        channelStatus !== channelData.status ||
        imageChange);
    return edited;
  }, [
    currentChannelName,
    channelData.title,
    channelData.description,
    channelData.status,
    currentChannelDescription,
    channelStatus,
    imageChange
  ]);

  useEffect(() => {
    setIsPageEdited(isEdited);
  }, [isEdited, setIsPageEdited]);

  return (
    <Row>
      <Col>
        <div css={formStyles}>
          <h2>{translate('channel_basic_information_header')}</h2>
        </div>
      </Col>
      <Col width={2 / 3}>
        <div>
          <Textbox
            id="channel-name-input-field"
            name="title"
            label={translate('channel_name_label')}
            aria-label={translate('channel_name_label')}
            isRequired
            maxLength={CHANNEL_NAME_MAX_LENGTH}
            onUpdateTransform={updateTransform}
            validate={requiredNameValidation}
            messages={
              currentChannelName.length ? remainingLengthMessage(CHANNEL_NAME_MAX_LENGTH, currentChannelName) : ''
            }
            onChange={() => console.log(currentChannelName)}
            hasError={currentChannelName.length === 0}
          />
        </div>
        <CventWritingAssistant
          fieldIdentifier="PlannerEventHubs.ChannelInformationDescriptionInputField"
          fieldTitle={translate('channel_description_label')}
          inputText={currentChannelDescription}
          maxTextLength={CHANNEL_DESCRIPTION_MAX_LENGTH}
          onDone={({ generatedText }) => {
            if (generatedText !== currentChannelDescription) {
              setValue('description', generatedText);
            }
          }}
          textType={TextType.Description}
          assistantUrl={publicRuntimeConfig?.WRITING_ASSISTANT_URL}
        >
          {description}
        </CventWritingAssistant>
        <RadioGroup
          label={channelStatusLabel}
          name="status"
          id="channel-status-input-field"
          options={[
            { label: inactive, value: ChannelStatus.Inactive },
            { label: active, value: ChannelStatus.Active }
          ]}
          onUpdate={value => {
            setChannelStatus(value);
            setDisableDeleteButton(value === ChannelStatus.Active);
          }}
          disabled={
            imageDeleted ||
            (!isChannelActive(channelData) && !(channelData.catalogId && (channelData.image || newImage)))
          }
        />
        <div css={imageLabelStyles}>
          <FormElement.Label label={translate('channel_image_label')} labelFor="" />
          <PopOverHelper popOverText="channel_image_tooltip_text" />
        </div>
        <Image
          editMode={true}
          videoCenterId={videoCenterId}
          setNewImage={newImageParam => {
            setNewImage(newImageParam);
            setImageChange(true);
          }}
          newImage={newImage}
          currentImage={channelData?.image}
          imageDeleted={imageDeleted}
          setImageDeleted={imageDeletedParam => {
            setImageDeleted(imageDeletedParam);
            setImageChange(true);
          }}
          supportedText={translate('channel_image_supported_fileType_text', { maxSize: IMAGE_MAXIMUM_SIZE_IN_MB })}
          recommendedText="channel_image_recommended_dimension_text"
          incorrectImageUploadText={translate('channel_image_supported_fileType_text', {
            maxSize: IMAGE_MAXIMUM_SIZE_IN_MB
          })}
          maxWidthImage={20}
          noImageTitleText="channel_empty_image_alt_text"
          imageAltText="channel_image_alt_text"
          noImageUploadedText="channel_empty_image_alt_text"
          showPlaceHolderInReadMode
          imageMaximumSize={IMAGE_MAXIMUM_SIZE}
          entityId={channelData?.id}
          aspectRatio={aspectRatioTypes.sixteenByNine}
          aspectRatioOptions={Array.of(translations.crop16By9)}
          disableDelete={disableDeleteButton}
          useCroppedImage
          maxFileNameLength={CHANNEL_IMAGE_FILE_NAME_MAX_LENGTH}
          allowImageEdit
          entityType={'Channel'}
          imageUploadTriggerLocation="Channels-image"
        />
      </Col>
    </Row>
  );
}

interface Props {
  channelData: ChannelInformationType;
  imageDeleted: boolean;
  setImageDeleted: (boolean) => void;
  newImage: NewImage;
  setNewImage: (NewImage) => void;
  setIsPageEdited: (isPageEdited: boolean) => void;
  channelStatus: ChannelStatus;
  setChannelStatus: (channelStatus: ChannelStatus) => void;
}

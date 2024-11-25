import React, { useCallback } from 'react';
import { useTranslate } from 'nucleus-text';
import { Textarea, Textbox, useWatchField } from '@cvent/carina/components/Forms';
import { Col } from '@cvent/carina/components/Col';
import { Row } from '@cvent/carina/components/Row';
import { Button } from '@cvent/carina/components/Button';
import { CHANNEL_DESCRIPTION_MAX_LENGTH, CHANNEL_NAME_MAX_LENGTH } from '@utils/constants';

export function ChannelFormData({ onCancel }: Props): JSX.Element {
  const { translate } = useTranslate();

  const channelName = 'channelName';
  const channelDescription = 'channelDescription';

  const { [channelName]: channelNameValue = '' } = useWatchField([channelName]);
  const { [channelDescription]: channelDescriptionValue = '' } = useWatchField([channelDescription]);

  const remainingLengthMessage = (maxLength: number, value: string): string =>
    `${translate('characters_left_label', {
      characterCount: maxLength - value.length
    })}`;

  const updateTransform = (value: string): string => value.trimStart();

  const characterCountMessage = useCallback(
    (count: number): string =>
      translate('characters_left_label', {
        characterCount: count
      }),
    [translate]
  );

  return (
    <>
      <Textbox
        id="channel-name-form-input-name"
        name={channelName}
        label={translate('channel_name_label')}
        maxLength={CHANNEL_NAME_MAX_LENGTH}
        onUpdateTransform={updateTransform}
        required
        messages={remainingLengthMessage(CHANNEL_NAME_MAX_LENGTH, channelNameValue)}
      />
      <Textarea
        id="channel-name-form-input-description"
        name={channelDescription}
        label={translate('channel_description_label')}
        onUpdateTransform={updateTransform}
        required
        maxLength={CHANNEL_DESCRIPTION_MAX_LENGTH}
        remainingCharactersMessage={characterCountMessage}
        minHeight="l"
      />
      <Row margin={-8} justifyContent="flex-end">
        <Col width="content">
          <Button
            type="reset"
            text={translate('cancel_button_label')}
            appearance="ghost"
            accessibilityLabel={translate('cancel_button_label')}
            testID="channel-page-cancel-channel-button"
            onClick={onCancel}
          />
        </Col>
        <Col width="content">
          <Button
            type="submit"
            text={translate('create_button_label')}
            accessibilityLabel={translate('create_button_label')}
            appearance="filled"
            testID="create-channel-save-channel-button"
            disabled={channelNameValue.length === 0 || channelDescriptionValue.length === 0}
          />
        </Col>
      </Row>
    </>
  );
}

interface Props {
  onCancel: () => void;
}

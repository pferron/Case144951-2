import React from 'react';
import { BannerNameFormStyle } from '@components/videoCenters/style';
import { Button } from '@cvent/carina/components/Button';
import { FormElement } from '@cvent/carina/components/FormElement';
import { injectTestId } from '@cvent/nucleus-test-automation';
import { Row } from '@cvent/carina/components/Row';
import { Textbox, useField } from '@cvent/carina/components/Forms';
import { useStyle } from '@hooks/useStyle';
import { useTranslate } from 'nucleus-text';
import { BANNER_NAME_FIELD, BANNER_NAME_MAX_LENGTH } from '../BannerConstants';

type BannerNameFieldProps = {
  secondaryButtonText: string;
  saveButtonText: string;
  onDismiss: () => void;
  currentNames: Array<string>;
};

function BannerNameField({
  secondaryButtonText,
  saveButtonText,
  onDismiss,
  currentNames = []
}: BannerNameFieldProps): JSX.Element {
  const { translate } = useTranslate();
  const { bodyStyling, buttonDone } = useStyle(BannerNameFormStyle);

  const { fieldValue: bannerNameValue, setFieldValue: setBannerName } = useField({
    name: BANNER_NAME_FIELD
  });
  const bannerName = bannerNameValue as string;

  const bannerNameInvalid = currentNames.some(val => val.toLowerCase() === bannerName.toLowerCase());

  const remainingLengthMessage = (maxLength: number, value: string): string =>
    `${translate('Banners-Text-Field-Remaining-Characters', {
      count: maxLength - value.length
    })}`;

  return (
    <div
      css={{
        flex: 1,
        marginBottom: 0,
        alignSelf: 'center'
      }}
      {...injectTestId('template-selection-modal-header')}
    >
      <p css={bodyStyling}>{translate('Banner-Name-Selection-Description')}</p>
      <div>
        <Textbox
          label={translate('Banner-Name-Selection-Text-Input-Label')}
          id="banner_name"
          testID="banner_name"
          name={BANNER_NAME_FIELD}
          maxLength={BANNER_NAME_MAX_LENGTH}
          onChange={e => setBannerName(e.target.value)}
          hasError={bannerNameInvalid}
          messages={remainingLengthMessage(BANNER_NAME_MAX_LENGTH, bannerName)}
          autoFocus
          required
        />
        {bannerNameInvalid && (
          <FormElement.Message
            text={translate('Banners-Form-NameAlreadyTaken')}
            {...injectTestId('banner-name-description-same-name-error')}
            type="error"
          />
        )}
        <Row justifyContent="flex-end">
          <Button text={secondaryButtonText} appearance="ghost" onClick={onDismiss} />
          <div css={buttonDone}>
            <Button
              type="submit"
              text={saveButtonText}
              appearance="lined"
              disabled={
                !bannerName.trim().length || bannerName.trim().length > BANNER_NAME_MAX_LENGTH || bannerNameInvalid
              }
              {...injectTestId('Banner-Name-Form-Done')}
            />
          </div>
        </Row>
      </div>
    </div>
  );
}

export default BannerNameField;

import React, { useState } from 'react';
import { useTranslate } from 'nucleus-text';
import { injectTestId } from '@cvent/nucleus-test-automation';
import { Row } from '@cvent/carina/components/Row';
import { Button } from '@cvent/carina/components/Button';
import { FormElement } from '@cvent/carina/components/FormElement';
import { Textbox } from '@cvent/carina/components/Forms';
import { BannerNameFormStyle } from '@components/videoCenters/style';
import { useStyle } from '@hooks/useStyle';
import { BANNER_NAME_FIELD, BANNER_NAME_MAX_LENGTH } from './BannerConstants';

type BannerNameFormProps = {
  secondaryButtonText: string;
  saveButtonText: string;
  onDismiss: () => void;
  currentNames: Array<string>;
};

function BannerNameForm({
  secondaryButtonText,
  saveButtonText,
  onDismiss,
  currentNames = []
}: BannerNameFormProps): JSX.Element {
  const { translate } = useTranslate();
  const { bodyStyling, buttonDone } = useStyle(BannerNameFormStyle);

  const remainingLengthMessage = (maxLength: number, value: string): string =>
    `${translate('Banners-Text-Field-Remaining-Characters', {
      count: maxLength - value.length
    })}`;

  const [bannerName, setBannerName] = useState('');
  const bannerNameInvalid = currentNames.some(val => val.toLowerCase() === bannerName.toLowerCase());

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

export default BannerNameForm;

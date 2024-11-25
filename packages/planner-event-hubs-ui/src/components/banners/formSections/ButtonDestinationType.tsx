import React, { memo } from 'react';
import { Textbox, useWatchField, Dropdown } from '@cvent/carina/components/Forms';
import { useTranslate } from 'nucleus-text';
import { useStyle } from '@hooks/useStyle';
import { CardContainerStyles } from '@components/common/style';
import { HubPage } from '@cvent/planner-event-hubs-model/types';
import {
  BANNER_BUTTON_DESTINATION_TYPE,
  BANNER_BUTTON_DESTINATION_URL,
  buttonLinkDestinations,
  VIDEO_CENTER_PAGE,
  BANNER_BTN_EXTERNAL_URL_LENGTH
} from '../BannerConstants';

type ButtonDestinationTypeProps = {
  hubPagesListData: HubPage[];
};

function ButtonDestinationType({ hubPagesListData }: ButtonDestinationTypeProps): JSX.Element {
  const depValues = useWatchField([BANNER_BUTTON_DESTINATION_TYPE, BANNER_BUTTON_DESTINATION_URL]);
  const { sectionText } = useStyle(CardContainerStyles);
  const { translate } = useTranslate();

  const validateButtonURL = (buttonURL, dependencyValues) => {
    if (dependencyValues[BANNER_BUTTON_DESTINATION_TYPE] === buttonLinkDestinations.EXTERNAL) {
      if (buttonURL === '' || !buttonURL) {
        return translate('Banners-FormErrors-ExternalURL');
      }
      if (buttonURL.substring(0, 8) !== 'https://') {
        return translate('Banners-FormErrors-ExternalURLhttps');
      }
    }
    return undefined;
  };

  const pageOptions = [
    {
      value: '',
      label: translate('Banners-Content-Banner-Button-Destination-Type-None')
    }
  ]
    .concat(
      hubPagesListData?.map(q => ({
        value: q.entityId,
        label: q.name
      }))
    )
    .filter(item => item?.value && item?.label);

  const chosenDestinationType = depValues[BANNER_BUTTON_DESTINATION_TYPE];
  switch (chosenDestinationType) {
    case buttonLinkDestinations.INTERNAL:
      return (
        <Dropdown
          id="banner_link_internal_destination_select"
          css={sectionText}
          label={translate('Banners-Content-Banner-Button-Destination-Type-Page-Selection-Label')}
          accessibilityLabel={translate('Banners-Content-Banner-Button-Destination-Type-Page-Selection-Label')}
          name={VIDEO_CENTER_PAGE}
          options={pageOptions}
          dependencies={[BANNER_BUTTON_DESTINATION_TYPE]}
        />
      );
    case buttonLinkDestinations.EXTERNAL:
      return (
        <div css={{ wordBreak: 'break-all' }}>
          <Textbox
            name={BANNER_BUTTON_DESTINATION_URL}
            label={translate('Banners-Form-ExternalURL')}
            dependencies={[BANNER_BUTTON_DESTINATION_TYPE]}
            validate={validateButtonURL}
            isRequired
            messages={translate('characters_left_label', {
              characterCount: (
                BANNER_BTN_EXTERNAL_URL_LENGTH - (depValues[BANNER_BUTTON_DESTINATION_URL]?.length || 0)
              ).toString()
            })}
            maxLength={BANNER_BTN_EXTERNAL_URL_LENGTH}
          />
        </div>
      );
    default:
      return null;
  }
}

export default memo(ButtonDestinationType);

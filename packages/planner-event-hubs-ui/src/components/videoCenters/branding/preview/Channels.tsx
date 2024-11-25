import React from 'react';
import { Col } from '@cvent/carina/components/Col';
import { Row } from '@cvent/carina/components/Row';
import { useTranslate } from 'nucleus-text';
import { useBrandingPreview } from '@hooks/BrandingPreviewProvider';
import { PreviewSize } from '@utils/types';
import ChannelsOne from './images/cn1.png';
import ChannelsTwo from './images/cn2.png';
import ChannelsThree from './images/cn3.png';
import ChannelsFour from './images/cn4.png';
import { usePreviewCarousleStyles } from './styles';
import Item from './Item';

function Channels(): JSX.Element {
  const { itemContainer, itemTitle } = usePreviewCarousleStyles('center');
  const { translate } = useTranslate();
  const { headingsFontFamily, bodyTextFontFamily, previewSize } = useBrandingPreview();
  return (
    <>
      <Row>
        <Col css={{ ...itemTitle, fontFamily: headingsFontFamily }}>
          {translate('video_hub_branding_preview_channels_title')}
        </Col>
      </Row>
      <Row justifyContent="center">
        <Col css={{ ...itemContainer, fontFamily: bodyTextFontFamily }}>
          <Item imageSrc={ChannelsOne.src} title={translate('video_hub_branding_preview_channels_carousel_title')} />
          <Item imageSrc={ChannelsTwo.src} title={translate('video_hub_branding_preview_channels_carousel_title')} />
          {previewSize !== PreviewSize.s && previewSize !== PreviewSize.l && (
            <>
              <Item
                imageSrc={ChannelsThree.src}
                title={translate('video_hub_branding_preview_channels_carousel_title')}
              />
              <Item
                imageSrc={ChannelsFour.src}
                title={translate('video_hub_branding_preview_channels_carousel_title')}
              />
            </>
          )}
        </Col>
      </Row>
    </>
  );
}

export default Channels;

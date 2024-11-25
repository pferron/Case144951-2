import React from 'react';
import { Col } from '@cvent/carina/components/Col';
import { Row } from '@cvent/carina/components/Row';
import { useTranslate } from 'nucleus-text';
import { useBrandingPreview } from '@hooks/BrandingPreviewProvider';
import { PreviewSize } from '@utils/types';
import whatsNewOne from './images/wn1.png';
import whatsNewTwo from './images/wn2.png';
import whatsNewThree from './images/wn3.png';
import whatsNewFour from './images/wn4.png';
import whatsNewFive from './images/wn5.png';
import { usePreviewCarousleStyles } from './styles';
import Item from './Item';

function WhatsNew(): JSX.Element {
  const { translate } = useTranslate();
  const { itemContainer, itemTitle } = usePreviewCarousleStyles('flex-start');
  const { headingsFontFamily, bodyTextFontFamily, previewSize } = useBrandingPreview();
  return (
    <>
      <Row>
        <Col css={{ ...itemTitle, fontFamily: headingsFontFamily }}>
          {translate('video_hub_branding_preview_whats_new_title')}
        </Col>
      </Row>
      <Row justifyContent="center">
        <Col css={{ ...itemContainer, fontFamily: bodyTextFontFamily }}>
          <Item
            imageSrc={whatsNewOne.src}
            title={translate('video_hub_branding_preview_whats_new_carousel_title')}
            subtitle={translate('video_hub_branding_preview_whats_new_carousel_subtitle')}
            alignItem="flex-start"
          />
          <Item
            imageSrc={whatsNewTwo.src}
            title={translate('video_hub_branding_preview_whats_new_carousel_title')}
            subtitle={translate('video_hub_branding_preview_whats_new_carousel_subtitle')}
            alignItem="flex-start"
          />
          <Item
            imageSrc={whatsNewThree.src}
            title={translate('video_hub_branding_preview_whats_new_carousel_title')}
            subtitle={translate('video_hub_branding_preview_whats_new_carousel_subtitle')}
            alignItem="flex-start"
          />
          {previewSize !== PreviewSize.s && previewSize !== PreviewSize.l && (
            <>
              <Item
                imageSrc={whatsNewFour.src}
                title={translate('video_hub_branding_preview_whats_new_carousel_title')}
                subtitle={translate('video_hub_branding_preview_whats_new_carousel_subtitle')}
                alignItem="flex-start"
              />
              <Item
                imageSrc={whatsNewFive.src}
                title={translate('video_hub_branding_preview_whats_new_carousel_title')}
                subtitle={translate('video_hub_branding_preview_whats_new_carousel_subtitle')}
                alignItem="flex-start"
              />
            </>
          )}
        </Col>
      </Row>
    </>
  );
}

export default WhatsNew;

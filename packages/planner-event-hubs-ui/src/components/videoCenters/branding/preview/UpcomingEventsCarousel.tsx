import React from 'react';
import { Col } from '@cvent/carina/components/Col';
import { Row } from '@cvent/carina/components/Row';
import { useTranslate } from 'nucleus-text';
import { useBrandingPreview } from '@hooks/BrandingPreviewProvider';
import { PreviewSize } from '@utils/types';
import upcomingOne from './images/uc1.png';
import upcomingTwo from './images/uc2.png';
import upcomingThree from './images/uc3.png';
import { usePreviewCarousleStyles } from './styles';
import Item from './Item';

function UpcomingEventsCarousel(): JSX.Element {
  const { itemContainer, itemTitle } = usePreviewCarousleStyles('center');
  const { translate } = useTranslate();
  const { headingsFontFamily, bodyTextFontFamily, previewSize } = useBrandingPreview();
  return (
    <>
      <Row>
        <Col css={{ ...itemTitle, fontFamily: headingsFontFamily }}>
          {translate('video_hub_branding_preview_upcoming_events_title')}
        </Col>
      </Row>
      <Row justifyContent="center">
        <Col css={{ ...itemContainer, fontFamily: bodyTextFontFamily }}>
          <Item
            useCardStyle
            imageSrc={upcomingOne.src}
            title={translate('video_hub_branding_preview_upcoming_events_carousel_title')}
            subtitle={translate('video_hub_branding_preview_upcoming_events_carousel_subtitle')}
            borderBottom={false}
          />
          {previewSize !== PreviewSize.s && (
            <Item
              useCardStyle
              imageSrc={upcomingTwo.src}
              title={translate('video_hub_branding_preview_upcoming_events_carousel_title')}
              subtitle={translate('video_hub_branding_preview_upcoming_events_carousel_subtitle')}
              borderBottom={false}
            />
          )}
          {previewSize !== PreviewSize.s && previewSize !== PreviewSize.l && (
            <Item
              useCardStyle
              imageSrc={upcomingThree.src}
              title={translate('video_hub_branding_preview_upcoming_events_carousel_title')}
              subtitle={translate('video_hub_branding_preview_upcoming_events_carousel_subtitle')}
              borderBottom={false}
            />
          )}
        </Col>
      </Row>
    </>
  );
}

export default UpcomingEventsCarousel;

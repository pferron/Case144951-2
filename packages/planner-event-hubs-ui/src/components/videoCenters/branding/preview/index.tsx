import React from 'react';
import Button from '@cvent/carina/components/Button';
import { Col } from '@cvent/carina/components/Col';
import { Row } from '@cvent/carina/components/Row';
import { useTranslate } from 'nucleus-text';
import { injectTestId } from '@cvent/nucleus-test-automation';
import BlockThemeProvider, {
  BackgroundThemeProvider,
  PrimaryThemeProvider
} from '@cvent/blocks/components/BlockThemeProvider';
import useCardStyles from '@cvent/blocks/hooks/useCardStyles';
import { CustomFont } from '@cvent/planner-event-hubs-model/types';
import { BrandingPreviewProvider, useBrandingPreview } from '@hooks/BrandingPreviewProvider';
import { getFontCss } from '@utils/commonComponentsUtils';
import { HeaderSkeleton } from '@components/videoCenters/branding/preview/HeaderSkeleton';
import { PreviewSize } from '@utils/types';
import { THEME_MOODS } from '../constants';
import { getMoodText } from '../utils';
import { useThemeChangePreviewStyles } from './styles';
import UpcomingEventsCarousel from './UpcomingEventsCarousel';
import WhatsNew from './WhatsNew';
import Channels from './Channels';

type PreviewTypes = {
  primary: string;
  secondary: string;
  background: string;
  mood: string;
  safeMode: boolean;
  headingsFont?: CustomFont;
  bodyTextFont?: CustomFont;
  testID?: string;
};

export function PrimaryBlock({
  mood,
  testID,
  headerElement
}: {
  mood: string;
  testID: string;
  headerElement: JSX.Element;
}): JSX.Element {
  const { bannerSection, bannerTitle, bannerSubTitle, bannerBtnContainer } = useThemeChangePreviewStyles();
  const { translate } = useTranslate();

  let moodThemeText = '';
  let moodSubtitle = '';
  if (mood === THEME_MOODS.LIGHT) {
    moodThemeText = translate('video_hub_branding_preview_light');
    moodSubtitle = translate('video_hub_branding_preview_subtitle_light');
  } else if (mood === THEME_MOODS.NIGHT) {
    moodThemeText = translate('video_hub_branding_preview_night');
    moodSubtitle = translate('video_hub_branding_preview_subtitle_night');
  } else {
    moodThemeText = translate('video_hub_branding_preview_color');
    moodSubtitle = translate('video_hub_branding_preview_subtitle_color');
  }
  const cardStyles = useCardStyles();

  const { headingsFontFamily, bodyTextFontFamily, previewSize } = useBrandingPreview();

  return (
    <section style={{ padding: previewSize ? 0 : 24 }} {...injectTestId(`${testID}-primary`)}>
      {headerElement}
      <div style={{ padding: previewSize ? 24 : 0 }}>
        <div css={[bannerSection, cardStyles]}>
          <Row justifyContent="center" flexGrow="row">
            <Col css={{ ...bannerTitle, fontFamily: headingsFontFamily }} padding={0}>
              {moodThemeText}
            </Col>
            <Col css={{ ...bannerSubTitle, fontFamily: bodyTextFontFamily }} padding={0}>
              {moodSubtitle}
            </Col>
          </Row>
          <Row>
            <Col css={bannerBtnContainer} padding={0}>
              <Button
                tabIndex={-1}
                text={translate('video_hub_branding_preview_filled_btn')}
                appearance="filled"
                size="s"
                css={{ fontFamily: bodyTextFontFamily }}
              />
              {previewSize !== PreviewSize.s && (
                <Button
                  tabIndex={-1}
                  text={translate('video_hub_branding_preview_lined_btn')}
                  appearance="lined"
                  size="s"
                  css={{ fontFamily: bodyTextFontFamily }}
                />
              )}
              <Button
                tabIndex={-1}
                text={translate('video_hub_branding_preview_ghost_btn_example')}
                appearance="ghost"
                size="s"
                css={{ fontFamily: bodyTextFontFamily }}
              />
            </Col>
          </Row>
        </div>
      </div>
    </section>
  );
}

export function BackgroundBlock({ testID }: { testID: string }): JSX.Element {
  const { backGroundSection } = useThemeChangePreviewStyles();
  return (
    <section css={backGroundSection} {...injectTestId(`${testID}-background`)}>
      <Row style={{ alignItems: 'center' }}>
        <Col>
          <UpcomingEventsCarousel />
        </Col>
      </Row>
      <Row style={{ alignItems: 'center' }}>
        <Col padding={{ top: 24 }}>
          <Channels />
        </Col>
      </Row>
      <Row style={{ alignItems: 'center' }}>
        <Col padding={{ top: 24, bottom: 24 }}>
          <WhatsNew />
        </Col>
      </Row>
    </section>
  );
}

function ThemeChangePreview(props: PreviewTypes): JSX.Element {
  const {
    primary,
    secondary,
    background,
    mood,
    safeMode,
    testID = 'theme-change-preview',
    headingsFont,
    bodyTextFont
  } = props;
  const moodText = getMoodText(mood);
  const { backgroundBlock } = useThemeChangePreviewStyles();

  const fontCss = getFontCss(headingsFont).concat(getFontCss(bodyTextFont));

  return (
    <div {...injectTestId(testID)}>
      {fontCss && <style>{fontCss}</style>}
      <BlockThemeProvider
        primary={primary}
        secondary={secondary}
        background={background}
        mood={mood}
        safeMode={safeMode}
      >
        <BrandingPreviewProvider
          headingsFontFamily={headingsFont?.fontFamily}
          bodyTextFontFamily={bodyTextFont?.fontFamily}
        >
          <>
            <PrimaryThemeProvider>
              <PrimaryBlock headerElement={<HeaderSkeleton />} mood={moodText} testID={testID} />
            </PrimaryThemeProvider>
            <BackgroundThemeProvider css={backgroundBlock} {...injectTestId(`${testID}-background-container`)}>
              <BackgroundBlock testID={testID} />
            </BackgroundThemeProvider>
          </>
        </BrandingPreviewProvider>
      </BlockThemeProvider>
    </div>
  );
}

export default ThemeChangePreview;

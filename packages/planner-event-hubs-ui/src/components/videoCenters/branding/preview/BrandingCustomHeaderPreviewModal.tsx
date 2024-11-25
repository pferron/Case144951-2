import React, { useMemo, useState } from 'react';
import { Modal } from '@cvent/carina/components/Modal';
import { DismissButton, ScrollViewWithBars } from '@cvent/carina/components/ScrollViewWithBars';
import ButtonGroup from '@cvent/carina/components/ButtonGroup';
import { ComputerIcon, PhoneIcon, TabletIcon } from '@cvent/carina/components/Icon';
import { BackgroundBlock, PrimaryBlock } from '@components/videoCenters/branding/preview/index';
import BlockThemeProvider, {
  BackgroundThemeProvider,
  PrimaryThemeProvider
} from '@cvent/blocks/components/BlockThemeProvider';
import { injectTestId } from '@cvent/nucleus-test-automation';
import { useCenterInfo } from '@hooks/useCenterInfo';
import { useThemeChangePreviewStyles } from '@components/videoCenters/branding/preview/styles';
import { Header } from '@components/videoCenters/branding/preview/NavigationHeader';
import { BrandingAdvancedOptions, BrandingCustomNavigation, PreviewSize } from '@utils/types';
import { CustomFont, NavigationAlignment, NavigationLinkHighlightStyle } from '@cvent/planner-event-hubs-model/types';
import { getFontCss } from '@utils/commonComponentsUtils';
import { useQuery } from '@apollo/client';
import { getAccountAndCustomFontInformation } from '@cvent/planner-event-hubs-model/operations/hub';
import { BrandingPreviewProvider } from '@hooks/BrandingPreviewProvider';
import { getMoodText } from '@components/videoCenters/branding/utils';
import { useTheme } from '@cvent/carina/components/ThemeProvider/useTheme';
import { useTranslate } from 'nucleus-text';
import Preview from '@cvent/blocks-preview/components/Preview';
import { MODAL_ZINDEX } from '@components/constants';
import ShadowDOMComponent from '@components/common/ShadowDOMComponent';
import IframeWithCarinaContext from '@components/common/IframeWithCarinaContext';

interface BrandingCustomHeaderPreviewModal {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  customNavigation: BrandingCustomNavigation;
  advancedOptions?: BrandingAdvancedOptions;
  customizations?: { headerHtml?: string; headerCss?: string; headerJavascript?: string };
  showNavigation?: boolean;
}

function BrandingCustomHeaderPreviewModal({
  isOpen,
  setIsOpen,
  customNavigation,
  advancedOptions = {
    navigationAlignment: NavigationAlignment.Center,
    navigationLinkHighlightStyle: NavigationLinkHighlightStyle.Filled,
    navigationLinkTextSize: '12'
  },
  customizations = {},
  showNavigation = true
}: BrandingCustomHeaderPreviewModal): JSX.Element {
  const [selectedPreview, setSelectedPreview] = useState<number>(2);
  const { theme: centerTheme } = useCenterInfo();
  const theme = useTheme();
  const { backgroundBlock } = useThemeChangePreviewStyles();
  const moodText = getMoodText(centerTheme?.moodColor);
  const [headingsFont, setHeadingsFont] = useState<CustomFont>({});
  const [bodyFont, setBodyFont] = useState<CustomFont>({});
  const fontCss = useMemo(() => getFontCss(headingsFont).concat(getFontCss(bodyFont)), [bodyFont, headingsFont]);
  const { data: customFontInformation } = useQuery(getAccountAndCustomFontInformation, {
    onCompleted: () => {
      const activeFonts =
        customFontInformation?.getAccountSnapshot?.customFonts?.filter(customFont => customFont.isActive) || [];
      const activeHeadingFont = activeFonts.find(customFont => customFont.id === centerTheme?.headingsFont);
      const activeBodyFont = activeFonts.find(customFont => customFont.id === centerTheme?.bodyFont);
      setBodyFont(activeBodyFont);
      setHeadingsFont(activeHeadingFont);
    }
  });
  const [previewSize, setPreviewSize] = useState<PreviewSize>(PreviewSize.xl);
  const { translate: t } = useTranslate();

  const updateSelectedPreview = (index: number) => {
    setSelectedPreview(index);
    if (index === 0) {
      setPreviewSize(PreviewSize.s);
    } else if (index === 1) {
      setPreviewSize(PreviewSize.l);
    } else {
      setPreviewSize(PreviewSize.xl);
    }
  };

  const previewMaxWidth = () => {
    if (previewSize === PreviewSize.xl) {
      return '67.5rem';
    }
    if (previewSize === PreviewSize.l) {
      return '35rem';
    }
    return '21rem';
  };

  const PreviewComp = useMemo(
    () => (
      <>
        {fontCss && <style>{fontCss}</style>}
        <BrandingPreviewProvider
          headingsFontFamily={headingsFont?.fontFamily}
          bodyTextFontFamily={bodyFont?.fontFamily}
          previewSize={previewSize}
        >
          <BlockThemeProvider
            primary={centerTheme?.mainColor}
            secondary={centerTheme?.actionColor}
            background={centerTheme?.backgroundColor}
            mood={centerTheme?.moodColor}
            safeMode={centerTheme?.safeMode}
          >
            <div>
              <PrimaryThemeProvider>
                {customizations?.headerHtml && (
                  <ShadowDOMComponent
                    id="custom-header"
                    customHtml={customizations?.headerHtml}
                    customCss={customizations.headerCss}
                    customJs={customizations.headerJavascript}
                  />
                )}
                <PrimaryBlock
                  headerElement={
                    <div>
                      {showNavigation && (
                        <Header
                          customNavigation={customNavigation}
                          logoImageUrl={centerTheme?.logoImageUrl}
                          logoAltText={centerTheme?.logoAltText}
                          advancedOptions={advancedOptions}
                          scrollInSmallDevice={false}
                        />
                      )}
                    </div>
                  }
                  mood={moodText}
                  testID="header-preview-testId"
                />
              </PrimaryThemeProvider>
              <BackgroundThemeProvider css={backgroundBlock} {...injectTestId(`background-container`)}>
                <BackgroundBlock testID="body-preview-testId" />
              </BackgroundThemeProvider>
            </div>
          </BlockThemeProvider>
        </BrandingPreviewProvider>
      </>
    ),
    [
      advancedOptions,
      backgroundBlock,
      bodyFont,
      centerTheme,
      customNavigation,
      customizations,
      fontCss,
      headingsFont?.fontFamily,
      moodText,
      previewSize,
      showNavigation
    ]
  );

  return (
    <Modal
      isOpen={isOpen}
      format="fullscreen"
      zIndex={MODAL_ZINDEX}
      onDismiss={() => setIsOpen(false)}
      testID="custom-header-preview-modal"
      portal
      title="custom header preview modal"
    >
      <ScrollViewWithBars
        header={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div
              style={{
                width: 'fill',
                paddingTop: 24,
                paddingLeft: 24,
                paddingRight: 0
              }}
            >
              <h2 style={{ margin: 0, color: theme.font.color.base }}>
                {t('events_plus_custom_header_preview_modal_heading')}
              </h2>
            </div>
            <div style={{ width: 'content', paddingTop: 24, paddingLeft: 0, paddingRight: 24 }}>
              <DismissButton
                aria-label={t('events_plus_custom_header_preview_modal_dismiss_aria_label')}
                onClick={() => setIsOpen(false)}
                testID="custom-header-preview-modal-close-button"
              />
            </div>
          </div>
        }
        forceStickyHeader
        forceStickyFooter
      >
        <div style={{ paddingTop: 9, display: 'flex', justifyContent: 'center' }}>
          <ButtonGroup selected={selectedPreview} onChange={updateSelectedPreview}>
            <ButtonGroup.Item
              text={t('events_plus_custom_header_preview_modal_mobile_view_button_text')}
              icon={PhoneIcon}
            />
            <ButtonGroup.Item
              text={t('events_plus_custom_header_preview_modal_tablet_view_button_text')}
              icon={TabletIcon}
            />
            <ButtonGroup.Item
              text={t('events_plus_custom_header_preview_modal_desktop_view_button_text')}
              icon={ComputerIcon}
            />
          </ButtonGroup>
        </div>
        <div style={{ paddingTop: 32, display: 'flex', justifyContent: 'center' }}>
          <div css={{ maxWidth: previewMaxWidth() }}>
            <Preview>
              <IframeWithCarinaContext
                code={PreviewComp}
                height="82.5rem"
                width={previewMaxWidth()}
                title={t('custom_header_tab_preview_iframe_title')}
                testId="custom-header-preview-iframe"
              />
            </Preview>
          </div>
        </div>
      </ScrollViewWithBars>
    </Modal>
  );
}

export default BrandingCustomHeaderPreviewModal;

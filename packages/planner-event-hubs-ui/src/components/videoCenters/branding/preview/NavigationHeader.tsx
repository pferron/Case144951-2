import React, { useMemo, useState } from 'react';
import { useTranslate } from 'nucleus-text';
import { BrandingPreviewProvider, useBrandingPreview } from '@hooks/BrandingPreviewProvider';
import BlockThemeProvider, { PrimaryThemeProvider } from '@cvent/blocks/components/BlockThemeProvider';
import { useCenterInfo } from '@hooks/useCenterInfo';
import { useQuery } from '@apollo/client';
import { getAccountAndCustomFontInformation } from '@cvent/planner-event-hubs-model/operations/hub';
import { CustomFont, NavigationAlignment } from '@cvent/planner-event-hubs-model/types';
import { ResponsiveImage } from '@cvent/nucleus-image';
import { getFontCss } from '@utils/commonComponentsUtils';
import { BrandingAdvancedOptions, BrandingCustomNavigation, PreviewSize } from '@utils/types';
import { useNavigationPreviewStyles } from '@components/videoCenters/branding/preview/styles';
import { injectTestId } from '@cvent/nucleus-test-automation';
import { Button } from '@cvent/carina/components/Button';
import { AppSwitcherIcon } from '@cvent/carina/components/Icon';
import { isNull } from 'lodash';

interface headerProps {
  customNavigation: BrandingCustomNavigation;
  logoImageUrl: string;
  logoAltText: string;
  advancedOptions: BrandingAdvancedOptions;
  scrollInSmallDevice?: boolean;
}

/* The array define the elements present in menu of events+ navigation
   - This order will be maintained in preview for menu items
   - menuItem name should match with their property names in BrandingCustomNavigation to handle hide from toggle button
 */
const headerMenuItems = [
  {
    name: 'homePage',
    label: 'custom_navigation_header_preview_home_text'
  },
  {
    name: 'channels',
    label: 'custom_navigation_header_preview_channels_text'
  },
  {
    name: 'upcomingEvents',
    label: 'custom_navigation_header_preview_upcoming_events_text'
  },
  {
    name: 'videos',
    label: 'custom_navigation_header_preview_videos_text'
  }
];
export function Header({
  customNavigation,
  logoImageUrl,
  logoAltText,
  advancedOptions,
  scrollInSmallDevice = true
}: headerProps) {
  const { translate } = useTranslate();
  const { bodyTextFontFamily } = useBrandingPreview();
  const {
    headerContainer,
    headerContent,
    logoImageSize,
    menuContainer,
    menuList,
    menuListItem,
    menuLink,
    loginContainer,
    loginLink,
    loginLinkCenterAlignmentStyles
  } = useNavigationPreviewStyles(advancedOptions, bodyTextFontFamily);

  const updatedLeftPadding =
    (advancedOptions.navigationHeaderLeftPadding && `${advancedOptions.navigationHeaderLeftPadding}px`) || '1rem';
  const updatedPaddingRight =
    (advancedOptions.navigationHeaderRightPadding && `${advancedOptions.navigationHeaderRightPadding}px`) || '1rem';
  const headerMaxWidth =
    (advancedOptions.navigationHeaderMaxWidth && `${advancedOptions.navigationHeaderMaxWidth}px`) || '100%';

  const menu = useMemo(
    () =>
      headerMenuItems.map(menuItem =>
        customNavigation[menuItem.name]?.isEnabled ? (
          <li css={menuListItem} role="menuitem" key={menuItem.name}>
            <p css={menuLink}>{translate(menuItem.label)}</p>
          </li>
        ) : null
      ),
    [customNavigation, menuLink, menuListItem, translate]
  );

  const paddingLeft = (
    <div {...injectTestId('navigation-left-padding-container')} css={{ paddingLeft: updatedLeftPadding }} />
  );

  const paddingRight = (
    <div {...injectTestId('navigation-right-padding-container')} css={{ paddingRight: updatedPaddingRight }} />
  );

  const FixedWidthPlaceHolderDivForDesktop =
    customNavigation?.logo?.isEnabled && logoImageUrl ? (
      <div id="navigation-logo-preview" {...injectTestId('navigation-logo-preview')} style={{ minWidth: '10.5rem' }}>
        <ResponsiveImage src={`${logoImageUrl}?d=280`} css={logoImageSize} alt={logoAltText} />
      </div>
    ) : (
      <div css={{ paddingLeft: '10.5rem' }} />
    );

  const buildIconButton = (): JSX.Element => <AppSwitcherIcon size="xl" />;
  const { previewSize } = useBrandingPreview();
  const isMobileOrTablet = previewSize === PreviewSize.l || previewSize === PreviewSize.s;

  return (
    <div
      css={{ ...headerContainer, overflowX: scrollInSmallDevice ? 'auto' : 'hidden' }}
      {...injectTestId('navigation-header-preview')}
    >
      <div
        css={
          previewSize
            ? { ...headerContent, padding: '0.625rem 0rem', alignItems: 'center' }
            : {
                ...headerContent,
                minWidth: '67.5rem',
                maxWidth: headerMaxWidth,
                padding: isMobileOrTablet ? '10px 1rem' : '0'
              }
        }
        {...injectTestId('navigation-header-preview-content')}
      >
        {!isMobileOrTablet && paddingLeft}
        {!isMobileOrTablet &&
          advancedOptions.navigationAlignment === NavigationAlignment.Center &&
          FixedWidthPlaceHolderDivForDesktop}
        {!isMobileOrTablet &&
          advancedOptions.navigationAlignment !== NavigationAlignment.Center &&
          customNavigation?.logo?.isEnabled &&
          logoImageUrl && (
            <div id="navigation-logo-preview" {...injectTestId('navigation-logo-preview')}>
              <ResponsiveImage src={`${logoImageUrl}?d=280`} css={logoImageSize} alt={logoAltText} />
            </div>
          )}
        {isMobileOrTablet && customNavigation?.logo?.isEnabled && logoImageUrl && (
          <div id="navigation-logo-preview" css={{ padding: '1rem' }} {...injectTestId('navigation-logo-preview')}>
            <ResponsiveImage src={`${logoImageUrl}?d=280`} css={logoImageSize} alt={logoAltText} />
          </div>
        )}
        {previewSize === PreviewSize.xl || previewSize === undefined ? (
          <div id="navigation-menu-preview" css={[menuContainer]} {...injectTestId('navigation-menu-preview')}>
            {!menu?.every(isNull) && (
              <ul role="menu" css={menuList}>
                {menu}
              </ul>
            )}
          </div>
        ) : null}
        {customNavigation?.loginRegistration?.isEnabled ||
        previewSize === PreviewSize.l ||
        previewSize === PreviewSize.s ? (
          <div id="navigation-login-preview" css={[loginContainer]} {...injectTestId('navigation-login-preview')}>
            {!previewSize || previewSize === PreviewSize.xl ? (
              <div>
                <span css={loginLink}>{translate('custom_navigation_header_preview_login_link_text')}</span>
                <span>&nbsp; | &nbsp;</span>
                <span css={loginLink}>{translate('custom_navigation_header_preview_register_link_text')}</span>
              </div>
            ) : (
              <div css={loginLinkCenterAlignmentStyles}>
                <Button
                  appearance="ghost"
                  testID="global-nav-mobile-menu"
                  size="l"
                  icon={buildIconButton}
                  aria-label={translate('video_center_mobile_menu_accessibility')}
                />
              </div>
            )}
          </div>
        ) : (
          advancedOptions.navigationAlignment === NavigationAlignment.Center && (
            <div css={{ paddingLeft: '11.574rem' }} />
          )
        )}
        {!isMobileOrTablet && paddingRight}
      </div>
    </div>
  );
}

interface NavigationHeaderProps {
  customNavigation: BrandingCustomNavigation;
  advancedOptions: BrandingAdvancedOptions;
}
function NavigationHeader({ customNavigation, advancedOptions }: NavigationHeaderProps): JSX.Element {
  const { theme: centerTheme } = useCenterInfo();
  const [headingsFont, setHeadingsFont] = useState<CustomFont>({});
  const [bodyFont, setBodyFont] = useState<CustomFont>({});
  const fontCss = useMemo(() => getFontCss(headingsFont).concat(getFontCss(bodyFont)), [bodyFont, headingsFont]);
  const { data: customFontInformation } = useQuery(getAccountAndCustomFontInformation, {
    onCompleted: () => {
      const activeFonts =
        (customFontInformation?.accountConfig?.AccountFeatures?.GeneralFeatures?.AllowCustomFonts &&
          customFontInformation?.getAccountSnapshot?.customFonts?.filter(customFont => customFont.isActive)) ||
        [];
      const activeHeadingFont = activeFonts.find(customFont => customFont.id === centerTheme?.headingsFont);
      const activeBodyFont = activeFonts.find(customFont => customFont.id === centerTheme?.bodyFont);
      setBodyFont(activeBodyFont);
      setHeadingsFont(activeHeadingFont);
    }
  });

  return (
    <BlockThemeProvider
      primary={centerTheme?.mainColor}
      secondary={centerTheme?.actionColor}
      background={centerTheme?.backgroundColor}
      mood={centerTheme?.moodColor}
      safeMode={centerTheme?.safeMode}
    >
      <BrandingPreviewProvider headingsFontFamily={headingsFont?.fontFamily} bodyTextFontFamily={bodyFont?.fontFamily}>
        <PrimaryThemeProvider>
          {fontCss && <style>{fontCss}</style>}
          <Header
            customNavigation={customNavigation}
            logoImageUrl={centerTheme?.logoImageUrl}
            logoAltText={centerTheme?.logoAltText}
            advancedOptions={advancedOptions}
          />
        </PrimaryThemeProvider>
      </BrandingPreviewProvider>
    </BlockThemeProvider>
  );
}

export default NavigationHeader;

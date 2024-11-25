import React, { useMemo } from 'react';
import { TextLink } from '@cvent/carina/components/TextLink';
import { injectTestId } from '@cvent/nucleus-test-automation';
import { useTranslate } from 'nucleus-text';
import { FooterStyles } from '@components/customRegistration/style';
import { useStyle } from '@hooks/useStyle';

interface FooterProps {
  termsOfUseText?: string;
  cventPrivacyPolicyText?: string;
  customPrivacyPolicyText?: string;
  displayManagePreferencesModal?: boolean;
  displayCcpaLinkText?: boolean;
  ccpaLinkText?: string;
}

function Footer({
  termsOfUseText,
  cventPrivacyPolicyText,
  customPrivacyPolicyText,
  displayCcpaLinkText,
  displayManagePreferencesModal,
  ccpaLinkText
}: FooterProps): JSX.Element {
  const { containerStyle, rightContainerStyle, linkTextStyle } = useStyle(FooterStyles);
  const { translate } = useTranslate();
  const linkText = useMemo(
    () => ({
      termsOfUse: termsOfUseText && (
        <TextLink element="button" neutral testID="footer-terms-of-use" css={linkTextStyle}>
          {termsOfUseText}
        </TextLink>
      ),
      cventPrivacyPolicy: cventPrivacyPolicyText && (
        <TextLink neutral target="_blank" rel="noopener noreferrer" testID="footer-privacy-policy" css={linkTextStyle}>
          {cventPrivacyPolicyText}
        </TextLink>
      ),
      customPrivacy: customPrivacyPolicyText && (
        <TextLink
          neutral
          target="_blank"
          rel="noopener noreferrer"
          testID="footer-custom-privacy-policy"
          css={linkTextStyle}
        >
          {customPrivacyPolicyText}
        </TextLink>
      ),
      ccpaDoNotSell: displayCcpaLinkText && (
        <TextLink neutral target="_blank" rel="noopener noreferrer" testID="footer-ccpa-dns-url" css={linkTextStyle}>
          {ccpaLinkText}
        </TextLink>
      ),
      cookiePreferences: displayManagePreferencesModal && (
        <TextLink element="button" neutral testID="footer-manage-cookie-preferences" css={linkTextStyle}>
          {translate('registration_form_footer_manage_preference_modal_link_text')}
        </TextLink>
      )
    }),
    [
      termsOfUseText,
      cventPrivacyPolicyText,
      customPrivacyPolicyText,
      linkTextStyle,
      displayManagePreferencesModal,
      translate,
      ccpaLinkText,
      displayCcpaLinkText
    ]
  );

  return (
    <div id="footer" css={containerStyle} {...injectTestId('footer')}>
      <div css={rightContainerStyle}>
        {linkText.termsOfUse}
        {termsOfUseText && (cventPrivacyPolicyText || customPrivacyPolicyText) && <span>&nbsp; | &nbsp;</span>}
        {linkText.cventPrivacyPolicy}
        {cventPrivacyPolicyText && customPrivacyPolicyText && <span>&nbsp; | &nbsp;</span>}
        {linkText.customPrivacy}
        {displayCcpaLinkText && (termsOfUseText || cventPrivacyPolicyText || customPrivacyPolicyText) && (
          <span>&nbsp; | &nbsp;</span>
        )}
        {linkText.ccpaDoNotSell}
        {displayManagePreferencesModal &&
          (termsOfUseText || cventPrivacyPolicyText || customPrivacyPolicyText || displayCcpaLinkText) && (
            <span>&nbsp; | &nbsp;</span>
          )}
        {linkText.cookiePreferences}
      </div>
    </div>
  );
}

export default Footer;

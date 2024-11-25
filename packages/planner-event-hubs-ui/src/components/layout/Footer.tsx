import React, { useMemo } from 'react';
import TextLink from '@cvent/carina/components/TextLink';
import { useTranslate } from 'nucleus-text';
import { injectTestId } from '@cvent/nucleus-test-automation';
import { FooterStyles } from '@components/layout/style';
import { useStyle } from '@hooks/useStyle';
import Image from 'next/image';

function Footer(): JSX.Element {
  const year: number = useMemo(() => new Date().getFullYear(), []);
  const { translate } = useTranslate();
  const { containerStyle, leftContainerStyle, rightContainerStyle, cventTextStyle, linkTextStyle, divider } =
    useStyle(FooterStyles);

  const termsOfUseText = translate('theming_footer_terms_of_use_link_text');
  const cventPrivacyPolicyText = translate('theming_footer_privacy_policy_link_text');
  const helpLinkText = translate('theming_footer_help_and_support_link_text');

  return (
    <footer css={containerStyle} {...injectTestId('footer')}>
      <div css={leftContainerStyle}>
        <Image
          layout="fixed"
          alt="Cvent"
          src="/cvent-logo.png"
          width={65}
          height={19}
          {...injectTestId('footer-logo')}
        />
        <div css={cventTextStyle}>{translate('theming_footer_copyright', { year })}</div>
      </div>
      <div css={rightContainerStyle}>
        <TextLink
          href="https://www.cvent.com/en/cvent-general-terms-of-use"
          neutral
          target="_blank"
          rel="noopener noreferrer"
          testID="footer-terms-of-use"
          css={linkTextStyle}
        >
          {termsOfUseText}
        </TextLink>
        <span css={divider}>&nbsp; | &nbsp;</span>
        <TextLink
          href="https://www.cvent.com/en/cvent-global-privacy-policy#cookies"
          neutral
          target="_blank"
          rel="noopener noreferrer"
          testID="footer-privacy-policy"
          css={linkTextStyle}
        >
          {cventPrivacyPolicyText}
        </TextLink>
        <span css={divider}>&nbsp; | &nbsp;</span>
        <TextLink
          href="https://www.cvent.com/en/contact/support"
          neutral
          target="_blank"
          rel="noopener noreferrer"
          testID="footer-help-and-support"
          css={linkTextStyle}
        >
          {helpLinkText}
        </TextLink>
      </div>
    </footer>
  );
}

export default Footer;

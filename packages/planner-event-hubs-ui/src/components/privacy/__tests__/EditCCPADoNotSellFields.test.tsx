import React from 'react';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import { render } from '@testing-library/react';
import { screen } from 'nucleus-text/testing-library/screen';
import 'jest-axe/extend-expect';
import EditCCPAFields from '@components/privacy/EditCCPAFields';

const privacySettings = {
  allowHubSearchEngineIndexing: true,
  displayPrivacyPolicy: true,
  allowTurnOffGoogleAnalytics: true,
  privacyPolicyUrl: 'privacyPolicyUrl',
  displayCventPrivacyPolicy: true,
  cventPrivacyPolicyLinkText: 'cventPrivacyPolicyLinkText',
  privacyPolicyLinkText: 'privacyPolicyLinkText',
  ccpaLinkText: 'Do Not Sell or Share My Personal Information',
  ccpaDoNotSellUrl: 'http://cvent.com',
  ccpaLinkExplanationText: 'Explanation Text here',
  allowTurnOffCookies: true,
  termsText: 'termsText',
  termsLinkText: 'termsLinkText',
  displayTermsOnLogin: true,
  ccpaEnableDoNotSell: true,
  ccpaConfirmationText: 'confirmation text',
  ccpaSubmitButtonText: 'Do Not Sell/Share',
  ccpaDoNotSellUrlEnabled: true,
  notifyUsersAboutCookie: true,
  displayTermsLinkOnFooter: true,
  displayCventPrivacyPolicyInCookie: true
};

const infoContent = new Map([
  ['key1', 'value1'],
  ['key2', 'value2']
]);

const appFeatures = [
  {
    name: 'cookieNotificationFeature',
    enabled: true,
    experimentVersion: '1001'
  }
];

describe('CookieNotificationFields', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockFn = jest.fn();

  it('renders ccpa enabled page edit enabled', async () => {
    const setPrivacySettings = jest.fn();
    render(
      <TestWrapper appFeatures={appFeatures}>
        <EditCCPAFields
          setPrivacySettings={setPrivacySettings}
          infoContent={infoContent}
          privacySettings={privacySettings}
          setIsPageEdited={mockFn}
          errorCcpa={false}
        />
      </TestWrapper>
    );
    expect(await screen.findByTestId('edit-ccpa-fields')).toBeInTheDocument();
    expect(await screen.findByTextKey('privacy_ccpa_donotsell')).toBeInTheDocument();
    expect(await screen.findByTextKey('privacy_ccpa_link_text')).toBeInTheDocument();
    expect(await screen.findByTextKey('ccpa_explanation_text')).toBeInTheDocument();
    expect(await screen.findByTextKey('privacy_ccpa_button_text')).toBeInTheDocument();
    expect(await screen.findByTextKey('privacy_ccpa_confirmation_text')).toBeInTheDocument();
    expect(await screen.findByTextKey('ccpa_dns_share_url_text')).toBeInTheDocument();
    expect(await screen.findByTextKey('ccpa_enable_dns_link_text')).toBeInTheDocument();
  });

  it('renders ccpa enabled page - disable ccpa dns url', async () => {
    render(
      <TestWrapper appFeatures={appFeatures}>
        <EditCCPAFields
          infoContent={infoContent}
          errorCcpa={false}
          setPrivacySettings={mockFn}
          privacySettings={{ ...privacySettings, ccpaDoNotSellUrlEnabled: false }}
          setIsPageEdited={mockFn}
        />
      </TestWrapper>
    );
    expect(await screen.findByTestId('edit-ccpa-fields')).toBeInTheDocument();
    expect(await screen.findByTextKey('privacy_ccpa_donotsell')).toBeInTheDocument();

    const ccpaEnabledDnsLinkNo = await screen.findByTestId('ccpa-dns-link-radio__div__0');
    expect(ccpaEnabledDnsLinkNo).toBeEnabled();
    expect(screen.queryByTextKey('ccpa_dns_share_url_text')).not.toBeInTheDocument();
  });
});

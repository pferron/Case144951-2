import React from 'react';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import { fireEvent, render } from '@testing-library/react';
import EditCookieNotificationFields from '@components/privacy/EditCookieNotificationFields';
import { screen } from 'nucleus-text/testing-library/screen';
import 'jest-axe/extend-expect';
import userEvent from '@testing-library/user-event';

const privacySettings = {
  allowHubSearchEngineIndexing: true,
  displayPrivacyPolicy: true,
  allowTurnOffGoogleAnalytics: true,
  privacyPolicyUrl: 'privacyPolicyUrl',
  displayCventPrivacyPolicy: true,
  cventPrivacyPolicyLinkText: 'cventPrivacyPolicyLinkText',
  privacyPolicyLinkText: 'privacyPolicyLinkText',
  ccpaLinkText: 'ccpaLinkText',
  ccpaDoNotSellUrl: 'ccpaDoNotSellUrl',
  ccpaLinkExplanationText: 'ccpaLinkExplanationText',
  ccpaConfirmationText: 'confirmation Text',
  ccpaSubmitButtonText: 'Submit',
  ccpaDoNotSellUrlEnabled: true,
  allowTurnOffCookies: true,
  termsText: 'termsText',
  termsLinkText: 'termsLinkText',
  displayTermsOnLogin: true,
  ccpaEnableDoNotSell: true,
  notifyUsersAboutCookie: true,
  displayTermsLinkOnFooter: true,
  displayCventPrivacyPolicyInCookie: true,
  cookieLists: {
    enableCvent: true,
    cventUrl: 'https://www.cvent.com/en/appcookies',
    enableCustom: true,
    customUrl: 'https://www.customCookieUrl.com',
    customLinkText: 'Custom cookie link'
  }
};

const cookieListFeature = [
  {
    name: 'cookieListFeature',
    enabled: true,
    experimentVersion: '1001'
  }
];

const infoContent = new Map([
  ['key1', 'value1'],
  ['key2', 'value2']
]);

describe('CookieNotificationFields', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Renders EditCookieNotificationFields component with google analytics radio', async () => {
    const setIsPageEdited = jest.fn();
    const setPrivacySettings = jest.fn();
    render(
      <TestWrapper>
        <EditCookieNotificationFields
          privacySettings={privacySettings}
          infoContent={infoContent}
          setIsPageEdited={setIsPageEdited}
          setPrivacySettings={setPrivacySettings}
          error={false}
          errorCustomCookieList={false}
        />
      </TestWrapper>
    );

    expect(await screen.findByTextKey('privacy_allow_turnoff_google_analytics')).toBeInTheDocument();

    const radioOptionNo = await screen.findByTextKey('privacy_allow_turnoff_google_analytics_no');
    expect(radioOptionNo).toBeInTheDocument();
    fireEvent.click(radioOptionNo);
    expect(await screen.findByTextKey('privacy_allow_turnoff_google_analytics_no')).toBeEnabled();
    // HUB-151797
    // expect(await axe(container)).toHaveNoViolations();
  });

  it('Renders CookieNotificationFields component with google analytics radio', async () => {
    const setIsPageEdited = jest.fn();
    const setPrivacySettings = jest.fn();
    render(
      <TestWrapper>
        <EditCookieNotificationFields
          privacySettings={{ ...privacySettings, allowTurnOffGoogleAnalytics: false }}
          infoContent={infoContent}
          setIsPageEdited={setIsPageEdited}
          setPrivacySettings={setPrivacySettings}
          error={false}
          errorCustomCookieList={false}
        />
      </TestWrapper>
    );

    expect(await screen.findByTextKey('privacy_allow_turnoff_google_analytics')).toBeInTheDocument();
    expect(await screen.findByTextKey('privacy_allow_turnoff_google_analytics_no')).toBeInTheDocument();
    // HUB-151797
    // expect(await axe(container)).toHaveNoViolations();
  });

  it('Renders cookie list fields', async () => {
    const setIsPageEdited = jest.fn();
    const setPrivacySettings = jest.fn();
    render(
      <TestWrapper appFeatures={cookieListFeature}>
        <EditCookieNotificationFields
          privacySettings={privacySettings}
          infoContent={infoContent}
          setIsPageEdited={setIsPageEdited}
          setPrivacySettings={setPrivacySettings}
          error={false}
          errorCustomCookieList={false}
        />
      </TestWrapper>
    );

    expect(await screen.findByTextKey('cookie_notification_display_cookie_text')).toBeInTheDocument();
    expect(await screen.findByTextKey('cookie_notification_cvent_privacy_policy_text')).toBeInTheDocument();
    expect(await screen.findByTextKey('your_company_privacy_policy_text')).toBeInTheDocument();
    const privacyPolicyUrlInput = await screen.findByRole('textbox', {
      key: 'privacy_your_privacy_link_label'
    });
    expect(privacyPolicyUrlInput).toHaveValue('privacyPolicyUrl');
    const cookieListUrlInput = await screen.findByRole('textbox', {
      key: 'privacy_your_cookie_list_url_label'
    });
    expect(cookieListUrlInput).toHaveValue('https://www.customCookieUrl.com');
    await userEvent.clear(privacyPolicyUrlInput);
    await userEvent.type(privacyPolicyUrlInput, 'www.newPrivacyUrl.com');
    await userEvent.clear(cookieListUrlInput);
    await userEvent.type(privacyPolicyUrlInput, 'www.newCookieListUrl.com');
    expect(await screen.findByTextKey('your_company_cookie_list_text')).toBeInTheDocument();
    expect(await screen.findByTextKey('cvent_cookie_list_text')).toBeInTheDocument();
  });

  it('Renders cookie list fields with cookie list invalid fields', async () => {
    const setIsPageEdited = jest.fn();
    const setPrivacySettings = jest.fn();
    render(
      <TestWrapper appFeatures={cookieListFeature}>
        <EditCookieNotificationFields
          privacySettings={{
            ...privacySettings,
            cookieLists: {
              ...privacySettings.cookieLists,
              customUrl: ''
            }
          }}
          infoContent={infoContent}
          setIsPageEdited={setIsPageEdited}
          setPrivacySettings={setPrivacySettings}
          error={false}
          errorCustomCookieList
        />
      </TestWrapper>
    );
    expect(await screen.findByTextKey('your_company_cookie_list_url_invalid_text')).toBeInTheDocument();
  });

  it('Renders cookie list fields with privacy policy invalid fields', async () => {
    const setIsPageEdited = jest.fn();
    const setPrivacySettings = jest.fn();
    render(
      <TestWrapper appFeatures={cookieListFeature}>
        <EditCookieNotificationFields
          privacySettings={{
            ...privacySettings,
            privacyPolicyUrl: ''
          }}
          infoContent={infoContent}
          setIsPageEdited={setIsPageEdited}
          setPrivacySettings={setPrivacySettings}
          error
          errorCustomCookieList={false}
        />
      </TestWrapper>
    );
    expect(await screen.findByTextKey('privacy_policy_invalid_url')).toBeInTheDocument();
  });
});

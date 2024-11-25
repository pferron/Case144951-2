import React from 'react';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import { fireEvent, render } from '@testing-library/react';
import { screen } from 'nucleus-text/testing-library/screen';
import 'jest-axe/extend-expect';
import EditSearchEngineVisibilityFields from '@components/privacy/EditSearchEngineVisibilityFields';

const privacySettings = {
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
  displayCventPrivacyPolicyInCookie: true
};

describe('EditSearchEngineVisibilityFields', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Renders EditSearchEngineVisibilityFields component in edit state and confirms no axe violations', async () => {
    const setIsPageEdited = jest.fn();
    const setPrivacySettings = jest.fn();
    render(
      <TestWrapper>
        <EditSearchEngineVisibilityFields
          privacySettings={{ ...privacySettings, allowHubSearchEngineIndexing: true }}
          setPrivacySettings={setPrivacySettings}
          setIsPageEdited={setIsPageEdited}
        />
      </TestWrapper>
    );

    expect(await screen.findByTextKey('privacy_search_engine_visibility_heading')).toBeInTheDocument();
    expect(await screen.findByTextKey('privacy_search_engine_visibility_sub_heading')).toBeInTheDocument();
    const radioOptionNo = await screen.findByTextKey('privacy_search_engine_visibility_option_no');
    expect(radioOptionNo).toBeInTheDocument();
    fireEvent.click(radioOptionNo);
    expect(await screen.findByTextKey('privacy_search_engine_visibility_option_no')).toBeEnabled();
    expect(await screen.findByTextKey('privacy_search_engine_visibility_option_yes')).toBeEnabled();
  });
});

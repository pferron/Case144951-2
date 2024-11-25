import React from 'react';
import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import Page from '@components/Page';

const centerSettings = {
  privacySettings: {},
  features: {}
};

describe('Page component', () => {
  it('renders without crashing and does not show the terms of use modal if showTermsModalOnLogin is false', async () => {
    const props = {
      children: <div />,
      navMetadata: {},
      pageTitle: 'Title',
      showLoginModal: false,
      setShowLoginModal: jest.fn(),
      showSideNav: true,
      showFooter: true
    };
    render(
      <MockedProvider>
        <TestWrapper centerSettings={centerSettings}>
          <Page {...props} />
        </TestWrapper>
      </MockedProvider>
    );
    expect(screen.queryByText('Terms of Use')).not.toBeInTheDocument();
  });
});

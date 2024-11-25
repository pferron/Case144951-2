import { render, waitFor } from '@testing-library/react';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import { screen } from 'nucleus-text/testing-library/screen';
import React from 'react';
import { HubOverviewErrorCard } from '@components/hubOverview/HubOverviewErrorCard';
import 'jest-axe/extend-expect';
import { axe } from 'jest-axe';

const tryAgain = jest.fn();
describe('HubOverviewErrorCard', () => {
  it('Renders HubOverviewErrorCard component', async () => {
    const { container } = render(
      <TestWrapper>
        <HubOverviewErrorCard testId="test-video-hub" tryAgain={tryAgain} />
      </TestWrapper>
    );
    await waitFor(() => {
      expect(screen.getByTextKey('hub_overview_card_error_text')).toBeInTheDocument();
    });
    const tryAgainBtn = await screen.findByRole('button', { key: 'hub_overview_card_try_again_button' });
    expect(tryAgainBtn).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });
});

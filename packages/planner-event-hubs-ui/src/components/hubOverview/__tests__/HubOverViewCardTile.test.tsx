import { render, waitFor } from '@testing-library/react';
import { screen } from 'nucleus-text/testing-library/screen';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import React from 'react';
import { HubOverViewCardTile } from '@components/hubOverview/HubOverViewCardTile';
import 'jest-axe/extend-expect';
import { axe } from 'jest-axe';

describe('Hub Overview Card Tile', () => {
  it('renders hub overview card tile component', async () => {
    const { container } = render(
      <TestWrapper>
        <HubOverViewCardTile
          testId="testId"
          title="OverViewCardTile"
          body="OverViewCardBody"
          footer={1}
          helpText="Unique views counted after 30 seconds of watch time"
        />
      </TestWrapper>
    );
    await waitFor(() => {
      expect(screen.getByText('OverViewCardTile')).toBeInTheDocument();
    });
    expect(screen.getByText('OverViewCardBody')).toBeInTheDocument();
    expect(screen.getByText('Unique views counted after 30 seconds of watch time')).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders hub overview card tile component when footer is 0', async () => {
    const { container } = render(
      <TestWrapper>
        <HubOverViewCardTile
          testId="testId"
          title="OverViewCardTile"
          body="OverViewCardBody"
          footer={0}
          helpText="Unique views counted after 30 seconds of watch time"
        />
      </TestWrapper>
    );
    await waitFor(() => {
      expect(screen.getByText('OverViewCardTile')).toBeInTheDocument();
    });
    expect(screen.getByText('OverViewCardBody')).toBeInTheDocument();
    expect(screen.getByText('Unique views counted after 30 seconds of watch time')).toBeInTheDocument();
    expect(screen.getByText('--%')).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders loading spinner when data is being fetched', async () => {
    const { container } = render(
      <TestWrapper>
        <HubOverViewCardTile
          isLoading
          testId="testId"
          title="OverViewCardTile"
          body="OverViewCardBody"
          footer={1}
          helpText="Unique views counted after 30 seconds of watch time"
        />
      </TestWrapper>
    );
    expect(screen.getByTextKey('hub_overview_loading_text')).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders error message', async () => {
    const { container } = render(
      <TestWrapper>
        <HubOverViewCardTile
          testId="testId"
          title="OverViewCardTile"
          body="OverViewCardBody"
          footer={1}
          error
          helpText="Unique views counted after 30 seconds of watch time"
        />
      </TestWrapper>
    );
    expect(screen.getByTextKey('hub_overview_card_error_text')).toBeInTheDocument();
    const tryAgainBtn = await screen.findByRole('button', { key: 'hub_overview_card_try_again_button' });
    expect(tryAgainBtn).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });
});

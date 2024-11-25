import { fireEvent, render, waitFor } from '@testing-library/react';
import { screen } from 'nucleus-text/testing-library/screen';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import React from 'react';
import 'jest-axe/extend-expect';
import { axe } from 'jest-axe';
import { TopMetricsCard } from '@components/hubOverview/TopMetricsCard';

const tryAgain = jest.fn();
describe('Hub Overview Card Tile', () => {
  it('renders hub overview card tile component', async () => {
    const { container } = render(
      <TestWrapper>
        <TopMetricsCard
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
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders hub overview card tile component when footer is 0', async () => {
    const { container } = render(
      <TestWrapper>
        <TopMetricsCard
          testId="testId"
          title="OverViewCardTile"
          body="OverViewCardBody"
          footer={0}
          helpText="Unique views counted after 30 seconds of watch time"
          showDivider
          tryAgain={tryAgain}
          isLoading={false}
        />
      </TestWrapper>
    );
    await waitFor(() => {
      expect(screen.getByText('OverViewCardTile')).toBeInTheDocument();
    });
    expect(screen.getByText('OverViewCardBody')).toBeInTheDocument();
    expect(screen.getByText('--')).toBeInTheDocument();
    fireEvent.click(screen.getByText('OverViewCardTile'));
    expect(screen.getByTestId('testId-divider')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText('Unique views counted after 30 seconds of watch time')).toBeInTheDocument();
    });
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders hub overview card tile component when footer is positive number', async () => {
    const { container } = render(
      <TestWrapper>
        <TopMetricsCard
          testId="testId"
          title="OverViewCardTile"
          body="OverViewCardBody"
          footer={3}
          helpText="Unique views counted after 30 seconds of watch time"
          showDivider={false}
          tryAgain={tryAgain}
          isLoading={false}
        />
      </TestWrapper>
    );
    await waitFor(() => {
      expect(screen.getByText('OverViewCardTile')).toBeInTheDocument();
    });
    expect(screen.getByText('OverViewCardBody')).toBeInTheDocument();
    expect(screen.getByText('+3%')).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders hub overview card tile component when footer is negative number', async () => {
    const { container } = render(
      <TestWrapper>
        <TopMetricsCard
          testId="testId"
          title="OverViewCardTile"
          body="OverViewCardBody"
          footer={-3}
          helpText="Unique views counted after 30 seconds of watch time"
          showDivider
          tryAgain={tryAgain}
          isLoading={false}
        />
      </TestWrapper>
    );
    await waitFor(() => {
      expect(screen.getByText('OverViewCardTile')).toBeInTheDocument();
    });
    expect(screen.getByTestId('testId-divider')).toBeInTheDocument();
    expect(screen.getByText('OverViewCardBody')).toBeInTheDocument();
    expect(screen.getByText('-3%')).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders loading spinner when data is being fetched', async () => {
    const { container } = render(
      <TestWrapper>
        <TopMetricsCard
          isLoading
          testId="testId"
          title="OverViewCardTile"
          body="OverViewCardBody"
          footer={1}
          helpText="Unique views counted after 30 seconds of watch time"
          tryAgain={tryAgain}
          showDivider
        />
      </TestWrapper>
    );
    expect(screen.getByTextKey('hub_overview_loading_text')).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders error message', async () => {
    const { container } = render(
      <TestWrapper>
        <TopMetricsCard
          testId="testId"
          title="OverViewCardTile"
          body="OverViewCardBody"
          footer={1}
          error
          helpText="Unique views counted after 30 seconds of watch time"
          tryAgain={tryAgain}
          showDivider={false}
        />
      </TestWrapper>
    );
    expect(screen.getByTextKey('hub_overview_card_error_text')).toBeInTheDocument();
    const tryAgainBtn = await screen.findByRole('button', { key: 'hub_overview_card_try_again_button' });
    expect(tryAgainBtn).toBeInTheDocument();
    fireEvent.click(tryAgainBtn);
    expect(tryAgain).toHaveBeenCalled();
    expect(await axe(container)).toHaveNoViolations();
  });
});

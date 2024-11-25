import React from 'react';
import { screen, render, within, waitFor } from '@testing-library/react';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import ViewProfileHeader from '@components/member-profile/ViewProfileHeader';
import 'jest-axe/extend-expect';
import { axe } from 'jest-axe';

describe('View Profile', () => {
  it('renders dummy header component', async () => {
    const { container } = render(
      <TestWrapper>
        <ViewProfileHeader logoImageUrl="test" logoAltText="test-alt" />
      </TestWrapper>
    );
    await waitFor(() => {
      expect(screen.getByTestId('view-profile-header')).toBeInTheDocument();
    });
    const headerComponent = within(screen.getByTestId('view-profile-header'));

    // logo
    const image = await headerComponent.findAllByRole('img');
    expect(image[0]).toHaveAttribute('alt', 'test-alt');
    expect(image[1]).toHaveAttribute('alt', 'member-profile-avtar-image');

    await waitFor(() => {
      expect(headerComponent.getByText(/Channels/i)).toBeInTheDocument();
    });
    expect(headerComponent.getByText(/Upcoming Events/i)).toBeInTheDocument();
    expect(headerComponent.getByText(/Videos/i)).toBeInTheDocument();
    expect(headerComponent.getByTestId('header-logo')).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });
});

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import { MockedProvider as ApolloProvider } from '@apollo/client/testing';
import 'jest-axe/extend-expect';
import { axe } from 'jest-axe';
import DragAndDropBannerPlacements from '../DragAndDropBannerPlacements';
import bannersAssociationList from '../fixtures/bannersAssociationList.json';

const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
  useHistory: () => ({
    push: mockHistoryPush
  })
}));

describe('DragAndDropBannerPlacements', () => {
  it('should render correct elements on page with no violations', async () => {
    const { container } = render(
      <ApolloProvider>
        <TestWrapper>
          <DragAndDropBannerPlacements
            data={bannersAssociationList.data.bannerAssociations.data}
            totalBannersNumber={6}
          />
        </TestWrapper>
      </ApolloProvider>
    );
    expect(container).toMatchSnapshot();
    await waitFor(() => expect(screen.getAllByTestId('banner-placement-table-row').length).toEqual(4));
    expect(await axe(container)).toHaveNoViolations();
  });
  it('should render banner placements in correct order', async () => {
    const { container } = render(
      <ApolloProvider>
        <TestWrapper>
          <DragAndDropBannerPlacements
            data={bannersAssociationList.data.bannerAssociations.data}
            totalBannersNumber={6}
          />
        </TestWrapper>
      </ApolloProvider>
    );
    expect(screen.getByTestId('banner-placement-table-row-0')).toHaveTextContent(/Gogogo new banner/);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('should have edit link on the banner item', async () => {
    const { container } = render(
      <ApolloProvider>
        <TestWrapper>
          <DragAndDropBannerPlacements
            data={bannersAssociationList.data.bannerAssociations.data}
            totalBannersNumber={6}
          />
        </TestWrapper>
      </ApolloProvider>
    );
    const editLinks = await screen.findAllByText('Edit'); // findAllByText returns an array
    expect(editLinks.length > 0).toBeTruthy();
    const editLink = editLinks[0];
    expect(editLink).toBeInTheDocument();
    fireEvent.click(editLink);
    expect(await axe(container)).toHaveNoViolations();
  });
});

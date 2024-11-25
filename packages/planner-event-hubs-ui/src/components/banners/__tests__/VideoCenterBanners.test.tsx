import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { screen } from 'nucleus-text/testing-library/screen';
import VideoCenterBanners from '@components/banners/VideoCenterBanners';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import { GET_BANNERS } from '@cvent/planner-event-hubs-model/operations/banner';
import { MockedProvider } from '@apollo/client/testing';
import 'jest-axe/extend-expect';
import { axe } from 'jest-axe';

interface RouterProps {
  pathname: string;
  route: string;
  query: {
    isSuccess: boolean;
  };
  replace: () => void;
}

jest.mock('next/router', () => ({
  useRouter(): RouterProps {
    return {
      pathname: '/path',
      route: '/route',
      query: { isSuccess: true },
      replace: jest.fn()
    };
  }
}));

const mockHub = {
  id: 'test-video-hub',
  status: 'Inactive',
  config: {
    ownerEmail: 'have@colors.com',
    ownerFirstName: 'Will',
    ownerLastName: 'It',
    title: 'Colorful Center test',
    url: null
  },
  theme: {}
};

const mockData = [
  {
    request: {
      query: GET_BANNERS,
      context: { clientName: 'video-hub' },
      fetchPolicy: 'cache-and-network',
      variables: {
        bannerFilter: {
          centerId: 'test-video-hub',
          filterInput: {}
        }
      }
    },
    result: {
      data: {
        banners: {
          data: [
            {
              id: '55c14aa2-963e-41ae-ba1f-0104954b7d36',
              name: 'Test Banner created',
              layout: 'TEXT_AND_COLOR',
              __typename: 'ExistingBanner'
            }
          ],
          paging: {
            currentToken: '',
            nextToken: null,
            limit: 100,
            __typename: 'Paging'
          },
          __typename: 'BannerPagingResponse'
        }
      },
      loading: false,
      refetch: jest.fn()
    }
  }
];
describe('Video Hub Banners', () => {
  it('render correctly with no banners', async () => {
    const { container } = render(
      <MockedProvider>
        <TestWrapper>
          <VideoCenterBanners videoCenterTitle={mockHub.config.title} videoCenterId={mockHub.id} />
        </TestWrapper>
      </MockedProvider>
    );

    expect(await screen.findByTestId('banner-list')).toBeInTheDocument();
    expect(await screen.findByTestId('header-actions')).toBeInTheDocument();
    expect(await screen.findByTestId('empty-channel-page-container')).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('Should show template for banner when clicked on create banner button', async () => {
    const { container } = render(
      <MockedProvider>
        <TestWrapper>
          <VideoCenterBanners videoCenterTitle={mockHub.config.title} videoCenterId={mockHub.id} />
        </TestWrapper>
      </MockedProvider>
    );

    expect(await screen.findByTestId('banner-list')).toBeInTheDocument();
    const createButton = screen.getByTestId('header-actions__create-banner');
    fireEvent.click(createButton);

    expect(await screen.findByTestId('banners-template-selection')).toBeInTheDocument();
    expect(screen.getByTextKey('Banners-Template-Selection-Color-Background-Body')).toBeInTheDocument();
    expect(screen.getByTextKey('Banners-Template-Selection-Inset-Image-Body')).toBeInTheDocument();
    expect(screen.getByTextKey('Banners-Template-Selection-Full-Image-Body')).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();

    // Closing
    fireEvent.click(screen.getByRole('button', { key: 'Banners-Template-Selection-Close-Button' }));
  });

  it('Should render the list of Banners and show two tabs banners and pages association', async () => {
    const { container } = render(
      <MockedProvider mocks={mockData}>
        <TestWrapper>
          <VideoCenterBanners videoCenterTitle={mockHub.config.title} videoCenterId={mockHub.id} />
        </TestWrapper>
      </MockedProvider>
    );
    expect(await screen.findByTestId('banner-list')).toBeInTheDocument();
    expect(screen.getByText('Test Banner created')).toBeInTheDocument();
    expect(screen.getByTestId('banners-and-pages')).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
    const bannersTab = screen.getByRole('tab', { key: 'Banners-Tab-Label' });
    const pagesTab = screen.getByRole('tab', { key: 'Banners-Pages-Tab-Label' });
    fireEvent.click(pagesTab);
    expect(await screen.findByTestId('banner-page-list')).toBeInTheDocument();
    fireEvent.click(bannersTab);
  });
});

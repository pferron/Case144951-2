import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { screen } from 'nucleus-text/testing-library/screen';
import VideoCenterBanners from '@components/banners/VideoCenterBanners';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import {
  GET_BANNERS,
  GET_BANNERS_ASSOCIATIONS,
  HUB_PAGES_WITH_BANNER,
  DELETE_BANNER_MUTATION
} from '@cvent/planner-event-hubs-model/operations/banner';
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
  push: () => void;
}
const mockedPush = jest.fn();

jest.mock('next/router', () => ({
  useRouter(): RouterProps {
    return {
      pathname: '/path',
      route: '/route',
      query: { isSuccess: true },
      replace: jest.fn(),
      push: mockedPush
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
  },
  {
    request: {
      query: GET_BANNERS_ASSOCIATIONS,
      context: { clientName: 'video-hub' },
      fetchPolicy: 'cache-and-network',
      variables: {
        bannerAssociationSearch: {
          centerId: 'test-video-hub'
        }
      }
    },
    result: {
      data: {
        bannerAssociations: {
          data: [],
          paging: {
            currentToken: '55c14aa2-963e-41ae-ba1f-0104954b7d36',
            nextToken: null,
            limit: 100,
            __typename: 'Paging'
          },
          __typename: 'BannerAssociationPaging'
        }
      },
      loading: false,
      refetch: jest.fn()
    }
  },
  {
    request: {
      query: HUB_PAGES_WITH_BANNER,
      context: { clientName: 'video-hub' },
      fetchPolicy: 'cache-and-network',
      variables: {
        input: {
          bannerId: '55c14aa2-963e-41ae-ba1f-0104954b7d36'
        }
      }
    },
    result: {
      data: {
        hubPagesWithBanner: {
          data: [],
          __typename: 'HubPages'
        }
      },
      loading: false,
      refetch: jest.fn()
    }
  },
  {
    request: {
      query: DELETE_BANNER_MUTATION,
      context: { clientName: 'video-hub' },
      fetchPolicy: 'cache-and-network',
      variables: {
        bannersSearch: {
          bannerId: '55c14aa2-963e-41ae-ba1f-0104954b7d36'
        }
      }
    },
    result: {
      data: {
        bannerDelete: '55c14aa2-963e-41ae-ba1f-0104954b7d36'
      },
      loading: false,
      refetch: jest.fn()
    }
  }
];
describe('Video Hub Banners', () => {
  it('Open menu for this banner then click the button to Edit banner', async () => {
    const { container } = render(
      <MockedProvider mocks={mockData}>
        <TestWrapper>
          <VideoCenterBanners videoCenterTitle={mockHub.config.title} videoCenterId={mockHub.id} />
        </TestWrapper>
      </MockedProvider>
    );
    expect(await screen.findByTestId('banner-list')).toBeInTheDocument();
    expect(await screen.findByTestId('0-banners-listItem')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('0-banner-item-overflow-menu-button'));
    await waitFor(() => {
      expect(screen.getByTestId('0-banner-list-option-menu-magazine')).toBeInTheDocument();
    });
    expect(await axe(container)).toHaveNoViolations();
    // Click the button Edit banner
    fireEvent.click(screen.getByTestId('0-banner-list-option-menu-option-0'));
    // Should go to banner detail page
    await waitFor(() => {
      expect(mockedPush).toHaveBeenCalled();
    });
  });
  it('Open menu for this banner then click the button to Delete banner and cancel on confirmation modal', async () => {
    const { container } = render(
      <MockedProvider mocks={mockData}>
        <TestWrapper>
          <VideoCenterBanners videoCenterTitle={mockHub.config.title} videoCenterId={mockHub.id} />
        </TestWrapper>
      </MockedProvider>
    );
    expect(await screen.findByTestId('banner-list')).toBeInTheDocument();
    expect(await screen.findByTestId('0-banners-listItem')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('0-banner-item-overflow-menu-button'));
    await waitFor(() => {
      expect(screen.getByTestId('0-banner-list-option-menu-magazine')).toBeInTheDocument();
    });
    // Click the button Delete banner
    fireEvent.click(screen.getByTestId('0-banner-list-option-menu-option-1'));
    await waitFor(() => {
      expect(screen.getByTextKey('Banner-Delete-Menu-Option')).toBeInTheDocument();
    });
    expect(await axe(container)).toHaveNoViolations();
    // Choose Cancel on the confirmation modal
    fireEvent.click(screen.getByTextKey('Banner-Delete-Menu-Option'));
    await waitFor(() => {
      expect(screen.getByTextKey('delete_banner_instruction_text')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTextKey('cancel_button'));
    await waitFor(() => {
      expect(screen.queryByTestId('confirmation-modal')).not.toBeInTheDocument();
    });
    // The banner is still present
    expect(await screen.findByTestId('0-banners-listItem')).toBeInTheDocument();
  });
  it('Open menu for this banner then click the button to Delete banner and delete on confirmation modal', async () => {
    render(
      <MockedProvider mocks={mockData}>
        <TestWrapper>
          <VideoCenterBanners videoCenterTitle={mockHub.config.title} videoCenterId={mockHub.id} />
        </TestWrapper>
      </MockedProvider>
    );
    expect(await screen.findByTestId('banner-list')).toBeInTheDocument();
    expect(await screen.findByTestId('0-banners-listItem')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('0-banner-item-overflow-menu-button'));
    await waitFor(() => {
      expect(screen.getByTestId('0-banner-list-option-menu-magazine')).toBeInTheDocument();
    });
    // Click the button Delete banner
    fireEvent.click(screen.getByTestId('0-banner-list-option-menu-option-1'));
    await waitFor(() => {
      expect(screen.getByTextKey('Banner-Delete-Menu-Option')).toBeInTheDocument();
    });
    // Choose Delete on the confirmation modal
    fireEvent.click(screen.getByTextKey('Banner-Delete-Menu-Option'));
    await waitFor(() => {
      expect(screen.getByTextKey('delete_banner_instruction_text')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTextKey('delete_banner_button'));
    await waitFor(() => {
      expect(screen.queryByTestId('confirmation-modal')).not.toBeInTheDocument();
    });
    expect(await screen.findByTestId('banner-list')).toBeInTheDocument();
  });
});

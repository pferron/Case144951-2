import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { screen } from 'nucleus-text/testing-library/screen';
import PagesSection from '@components/banners/formSections/PagesSection';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import { MockedProvider } from '@apollo/client/testing';
import {
  HUB_PAGES_WITH_BANNER,
  HUB_PAGES,
  GET_BANNERS_ASSOCIATIONS,
  UPDATE_BANNER_ASSOCIATIONS
} from '@cvent/planner-event-hubs-model/operations/banner';
import 'jest-axe/extend-expect';
import { axe } from 'jest-axe';

jest.mock('@hooks/useQueryParam', () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue({
    banner: 'banner_id',
    'video-center': 'video_center'
  })
}));

const mocks = [
  {
    request: {
      query: HUB_PAGES_WITH_BANNER,
      context: { clientName: 'video-hub' },
      variables: {
        input: {
          hubId: 'video_center',
          bannerId: 'banner_id'
        }
      }
    },
    result: {
      data: {
        hubPagesWithBanner: {
          data: [
            {
              centerId: 'video_center',
              entityType: 'Homepage',
              entityId: 'video_center',
              name: 'banner name',
              displayOrder: 1,
              banner: {
                id: 'banner_id',
                name: 'test',
                layout: 'FULL_IMAGE',
                text: {
                  title: null,
                  body: null,
                  alignment: null,
                  color: null,
                  __typename: 'BannerText'
                },
                button: {
                  enabled: false,
                  text: null,
                  target: null,
                  __typename: 'BannerButton'
                },
                __typename: 'ExistingBanner'
              },
              __typename: 'ExistingBannerAssociationWithBanner'
            }
          ]
        },
        paging: {
          currentToken: '3d8f88e7-0707-44d7-8fc3-7dc04a2c3ee5',
          nextToken: null,
          limit: 100,
          __typename: 'Paging'
        },
        __typename: 'BannerAssociationPaging'
      },
      loading: false,
      refetch: jest.fn()
    }
  },
  {
    request: {
      query: HUB_PAGES,
      variables: {
        id: {
          id: 'video_center'
        }
      }
    },
    result: {
      data: {
        hubPages: {
          data: [
            {
              __typename: 'HubPage',
              entityType: 'Channel',
              entityId: '87544b4f-e158-4681-87e0-6a6df8085b01',
              name: 'Channel 1'
            },
            {
              __typename: 'HubPage',
              entityType: 'Channel',
              entityId: '72d56910-0a64-4cda-96ce-0db27b835f38',
              name: 'Channel 2'
            },
            {
              __typename: 'HubPage',
              entityType: 'Homepage',
              entityId: '55113f0a-9f28-4257-8c0e-3ca34f44c4b9',
              name: 'Homepage'
            }
          ]
        }
      }
    }
  },
  {
    request: {
      query: GET_BANNERS_ASSOCIATIONS,
      variables: {
        bannerAssociationSearch: {
          centerId: 'video_center',
          limit: 100
        }
      }
    },
    result: {
      data: {
        bannerAssociations: {
          __typename: 'BannerAssociationPaging',
          data: [
            {
              __typename: 'ExistingBannerAssociationWithBanner',
              centerId: '55113f0a-9f28-4257-8c0e-3ca34f44c4b9',
              entityType: 'Homepage',
              entityId: '55113f0a-9f28-4257-8c0e-3ca34f44c4b9',
              displayOrder: 1,
              banner: {
                __typename: 'ExistingBanner',
                id: '48b8279e-36af-4324-b5b3-2055911a815a',
                name: 'test',
                layout: 'FULL_IMAGE',
                text: {
                  __typename: 'BannerText',
                  title: 'Banner Title',
                  body: 'Banner Body',
                  alignment: 'Left',
                  color: null
                },
                button: {
                  __typename: 'BannerButton',
                  enabled: false,
                  text: 'Button',
                  target: ''
                }
              }
            }
          ],
          paging: {
            __typename: 'Paging',
            currentToken: '89de6fa8-efda-47f6-b15d-0cd2ef8d31ce',
            nextToken: null,
            limit: 100
          }
        }
      }
    }
  },
  {
    request: {
      query: UPDATE_BANNER_ASSOCIATIONS,
      context: { clientName: 'video-hub' },
      variables: {
        input: {
          centerId: 'video_center',
          entityType: 'Channel',
          entityId: '87544b4f-e158-4681-87e0-6a6df8085b01',
          bannerAssociation: [{ banner: 'banner_id', displayOrder: 1 }]
        }
      },
      refetchQueries: [HUB_PAGES_WITH_BANNER, GET_BANNERS_ASSOCIATIONS]
    },
    result: {
      data: {}
    }
  }
];

describe('Testing PagesSection', () => {
  it('Should render the PagesSection fine', async () => {
    const { container } = render(
      <MockedProvider mocks={mocks}>
        <TestWrapper>
          <PagesSection />
        </TestWrapper>
      </MockedProvider>
    );
    expect(await screen.findByTextKey('Banners-Pages-Section-Description')).toBeInTheDocument();
    expect(screen.getByRole('button', { key: 'Banners-Assign-Pages-Button' })).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('Testig assign Page Button and modal', async () => {
    const { container } = render(
      <MockedProvider mocks={mocks}>
        <TestWrapper>
          <PagesSection />
        </TestWrapper>
      </MockedProvider>
    );
    expect(await screen.findByTextKey('Banners-Pages-Section-Description')).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
    const assignPagesBtn = screen.getByRole('button', { key: 'Banners-Assign-Pages-Button' });
    fireEvent.click(assignPagesBtn);
    expect(await screen.findByTestId('banner-pages-modalId')).toBeInTheDocument();

    // Dropdown
    const pagesDropDown = await screen.findByTestId('banner_placement');

    const mockHandler = jest.fn();
    pagesDropDown.addEventListener('click', mockHandler);
    fireEvent.click(pagesDropDown);
    const bannerOption = await screen.findByTestId('banner_placement-option-0');
    expect(bannerOption).toBeInTheDocument();
    fireEvent.click(bannerOption);

    // Assign Button should not be disabled
    const assignBtn = await screen.findByRole('button', { key: 'assign_button_label' });
    await waitFor(() => {
      expect(assignBtn).toBeEnabled();
    });
    fireEvent.click(assignBtn);
  });

  it('Should be able to delete the existing page association', async () => {
    const { container } = render(
      <MockedProvider mocks={mocks}>
        <TestWrapper>
          <PagesSection />
        </TestWrapper>
      </MockedProvider>
    );
    expect(await screen.findByText('Select where you want to display this banner.')).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
    const associatedPage = await screen.findByTestId('banner-placement-table-row');
    expect(associatedPage).toBeInTheDocument();

    // Delete Button
    const deleteBtn = screen.getByRole('button', { key: 'delete_button' });
    fireEvent.click(deleteBtn);
  });
});

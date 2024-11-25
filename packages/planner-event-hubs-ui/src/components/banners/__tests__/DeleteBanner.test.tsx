import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import DeleteBanner from '@components/banners/DeleteBanner';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import { MockedProvider } from '@apollo/client/testing';
import { HUB_PAGES_WITH_BANNER } from '@cvent/planner-event-hubs-model/operations/banner';
import 'jest-axe/extend-expect';
import { axe } from 'jest-axe';

const mockSetIsModalOpen = jest.fn();
const mockDeleteBanner = jest.fn();

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
  }
];
describe('Testing DeleteBanners', () => {
  it('Should render the confirmation modal fine without associations', async () => {
    const { container } = render(
      <MockedProvider>
        <TestWrapper>
          <DeleteBanner
            setIsModalOpen={mockSetIsModalOpen}
            videoCenterId="video_center"
            bannerId="banner_id"
            deleteBanner={mockDeleteBanner}
          />
        </TestWrapper>
      </MockedProvider>
    );
    expect(await screen.findByTestId('confirmation-modal')).toBeInTheDocument();
    expect(screen.getByTestId('confirmation-modal-cancel-button')).toBeInTheDocument();
    expect(screen.getByTestId('confirmation-modal-confirmation-button')).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('Should render the confirmation modal fine with associations', async () => {
    const { container } = render(
      <MockedProvider mocks={mocks}>
        <TestWrapper>
          <DeleteBanner
            setIsModalOpen={mockSetIsModalOpen}
            videoCenterId="video_center"
            bannerId="banner_id"
            deleteBanner={mockDeleteBanner}
          />
        </TestWrapper>
      </MockedProvider>
    );
    expect(await screen.findByTestId('confirmation-modal')).toBeInTheDocument();
    expect(screen.getByTestId('confirmation-modal-cancel-button')).toBeInTheDocument();
    expect(screen.getByTestId('confirmation-modal-confirmation-button')).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('Should call mockSetIsModalOpen to close the modal when cancel button is clicked', async () => {
    const { container } = render(
      <MockedProvider>
        <TestWrapper>
          <DeleteBanner
            setIsModalOpen={mockSetIsModalOpen}
            videoCenterId="video_center"
            bannerId="banner_id"
            deleteBanner={mockDeleteBanner}
          />
        </TestWrapper>
      </MockedProvider>
    );
    expect(await screen.findByTestId('confirmation-modal')).toBeInTheDocument();
    const cancelBtn = screen.getByTestId('confirmation-modal-cancel-button');
    fireEvent.click(cancelBtn);
    expect(mockSetIsModalOpen).toHaveBeenCalled();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('Should call deleteBanner when delete button is clicked', async () => {
    const { container } = render(
      <MockedProvider>
        <TestWrapper>
          <DeleteBanner
            setIsModalOpen={mockSetIsModalOpen}
            videoCenterId="video_center"
            bannerId="banner_id"
            deleteBanner={mockDeleteBanner}
          />
        </TestWrapper>
      </MockedProvider>
    );
    expect(await screen.findByTestId('confirmation-modal')).toBeInTheDocument();
    const deleteBtn = screen.getByTestId('confirmation-modal-confirmation-button');
    fireEvent.click(deleteBtn);
    expect(mockDeleteBanner).toHaveBeenCalled();
    expect(await axe(container)).toHaveNoViolations();
  });
});

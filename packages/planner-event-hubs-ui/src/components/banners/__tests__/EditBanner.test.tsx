import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import EditBanner from '@components/banners/EditBanner';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import { MockedProvider } from '@apollo/client/testing';
import { GET_BANNER, DELETE_BANNER_MUTATION } from '@cvent/planner-event-hubs-model/operations/banner';
import { screen } from 'nucleus-text/testing-library/screen';
import 'jest-axe/extend-expect';
import { axe } from 'jest-axe';

jest.mock('@hooks/useCenterInfo', () => {
  const originalModule = jest.requireActual('@hooks/useCenterInfo');
  return {
    __esModule: true,
    ...originalModule,
    useCenterInfo: jest.fn().mockReturnValue({
      theme: {
        actionColor: '#1a6137',
        backgroundColor: '#1ce6e6',
        logoImageRelativePath: null,
        logoImageUrl: null,
        logoAltText: null,
        mainColor: '#1622e6',
        logoOriginalImageUrl: '',
        moodColor: 'white',
        safeMode: false,
        faviconUrl: '',
        headingsFont: null,
        bodyFont: null
      }
    })
  };
});

const mocks = [
  {
    request: {
      query: GET_BANNER,
      context: { clientName: 'video-hub' },
      variables: {
        bannersSearch: {
          centerId: 'video_center',
          bannerId: 'banner_id'
        }
      }
    },
    result: {
      data: {
        banner: {
          centerId: 'video_center',
          id: 'banner_id',
          name: 'test',
          layout: 'FULL_IMAGE',
          imageAlignment: null,
          imageUrl: null,
          originalImageUrl: null,
          imageAltText: null,
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
            targetType: null,
            internalTarget: null,
            target: null,
            __typename: 'BannerButton'
          },
          __typename: 'ExistingBanner'
        }
      },
      loading: false
    }
  },
  {
    request: {
      query: DELETE_BANNER_MUTATION,
      context: { clientName: 'video-hub' },
      variables: {
        bannersSearch: {
          centerId: 'video_center',
          bannerId: 'banner_id'
        }
      }
    },
    result: {
      data: {}
    }
  }
];

describe('Testing EditBanner', () => {
  it('Should render the edit banner component', async () => {
    const { container } = render(
      <MockedProvider mocks={mocks}>
        <TestWrapper>
          <EditBanner videoCenterId="video_center" videoCenterTitle="Video center Title" bannerId="banner_id" />
        </TestWrapper>
      </MockedProvider>
    );

    expect(await screen.findByTestId('banner-preview')).toBeInTheDocument();
    expect(screen.getByTestId('banner-content-form')).toBeInTheDocument();
    expect(screen.getByTestId('banner-images')).toBeInTheDocument();
    expect(screen.getByTestId('banner-content')).toBeInTheDocument();
    expect(screen.getByTestId('banner-style')).toBeInTheDocument();
    expect(screen.getByTestId('banner-pages')).toBeInTheDocument();
    expect(screen.getByTestId('banner-images-edit-button')).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('Should show modal to rename the banner when clicked on rename banner button', async () => {
    const { container } = render(
      <MockedProvider mocks={mocks}>
        <TestWrapper>
          <EditBanner videoCenterId="video_center" videoCenterTitle="Video center Title" bannerId="banner_id" />
        </TestWrapper>
      </MockedProvider>
    );
    expect(await screen.findByTestId('banner-preview')).toBeInTheDocument();
    const renameBannerBtn = screen.getByRole('button', { key: 'banner_rename_button_label' });
    fireEvent.click(renameBannerBtn);
    const renameForm = await screen.findByTestId('banner-name-form');
    expect(renameForm).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('Should show modal to delete a banner when delete banner is clicked', async () => {
    const { container } = render(
      <MockedProvider mocks={mocks}>
        <TestWrapper>
          <EditBanner videoCenterId="video_center" videoCenterTitle="Video center Title" bannerId="banner_id" />
        </TestWrapper>
      </MockedProvider>
    );
    expect(await screen.findByTestId('banner-preview')).toBeInTheDocument();
    const deleteBannerBtn = await screen.findByRole('button', { key: 'Banner-Delete-Menu-Option' });
    fireEvent.click(deleteBannerBtn);
    expect(await screen.findByTextKey('delete_banner_instruction_text')).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();

    // Delete Button
    const deleteBtn = await screen.findByTestId('confirmation-modal-confirmation-button');
    fireEvent.click(deleteBtn);
    expect(screen.queryByTextKey('delete_banner_instruction_text')).not.toBeInTheDocument();
  });
});

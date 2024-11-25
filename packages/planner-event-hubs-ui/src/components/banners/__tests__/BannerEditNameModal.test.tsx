import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { screen } from 'nucleus-text/testing-library/screen';
import BannerEditNameModal from '@components/banners/BannerEditNameModal';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import { MockedProvider } from '@apollo/client/testing';
import { axe } from 'jest-axe';
import 'jest-axe/extend-expect';
import { UPDATE_BANNER_MUTATION } from '@cvent/planner-event-hubs-model/operations/banner';

const mockOnDismiss = jest.fn();
const mockBannerData = {
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
    color: null
  },
  button: {
    enabled: false,
    text: null,
    targetType: null,
    internalTarget: null,
    target: null
  }
};
const mocks = [
  {
    request: {
      query: UPDATE_BANNER_MUTATION,
      context: { clientName: 'video-hub' },
      variables: {
        input: { ...mockBannerData, name: 'New Banner Name' }
      },
      refetchQueries: jest.fn(),
      onCompleted: () => {
        jest.fn();
      }
    },
    result: {
      data: {}
    }
  }
];
describe('Testing BannerEditNameModal', () => {
  it('Should render the modal fine', async () => {
    const { container } = render(
      <MockedProvider>
        <TestWrapper>
          <BannerEditNameModal showEditNameModal onDismiss={mockOnDismiss} bannerData={mockBannerData} />
        </TestWrapper>
      </MockedProvider>
    );
    expect(await screen.findByTextKey('Banners-Name-Selection-Title')).toBeInTheDocument();
    expect(screen.getByTextKey('Banner-Name-Selection-Description')).toBeInTheDocument();
    expect(screen.getByTextKey('cancel_button')).toBeInTheDocument();
    expect(screen.getByTextKey('Banner-Name-Save-Button')).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('Should call onDismiss when close button is clicked', async () => {
    const { container } = render(
      <MockedProvider>
        <TestWrapper>
          <BannerEditNameModal showEditNameModal onDismiss={mockOnDismiss} bannerData={mockBannerData} />
        </TestWrapper>
      </MockedProvider>
    );
    expect(await screen.findByTextKey('Banners-Name-Selection-Title')).toBeInTheDocument();
    const cancelBtn = screen.getByRole('button', { key: 'cancel_button' });
    fireEvent.click(cancelBtn);
    expect(mockOnDismiss).toHaveBeenCalled();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('Should call mutation with the new name when Done button is clicked', async () => {
    const { container } = render(
      <MockedProvider mocks={mocks}>
        <TestWrapper>
          <BannerEditNameModal showEditNameModal onDismiss={mockOnDismiss} bannerData={mockBannerData} />
        </TestWrapper>
      </MockedProvider>
    );
    expect(await screen.findByTextKey('Banners-Name-Selection-Title')).toBeInTheDocument();
    const nameInput = screen.getByTestId('banner_name-input');
    fireEvent.change(nameInput, { target: { value: 'New Banner Name' } });
    const doneButton = screen.getByRole('button', { key: 'Banner-Name-Save-Button' });
    fireEvent.click(doneButton);
    expect(await screen.findByTestId('banner_name-input')).toHaveValue('New Banner Name');
    expect(await axe(container)).toHaveNoViolations();
  });
});

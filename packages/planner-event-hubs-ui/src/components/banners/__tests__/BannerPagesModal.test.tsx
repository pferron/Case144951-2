import React from 'react';
import { fireEvent, render, waitFor, within } from '@testing-library/react';
import { screen } from 'nucleus-text/testing-library/screen';
import BannerPagesModal from '@components/banners/formSections/BannerPagesModal';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import { MockedProvider } from '@apollo/client/testing';
import 'jest-axe/extend-expect';
import { axe } from 'jest-axe';

describe('Testing BannerPagesModal', () => {
  const mockPagesData = [
    {
      entityType: 'Channel',
      entityId: '87544b4f-e158-4681-87e0-6a6df8085b01',
      name: 'Channel 1'
    },
    {
      entityType: 'Channel',
      entityId: '72d56910-0a64-4cda-96ce-0db27b835f38',
      name: 'Channel 2'
    }
  ];
  const mockSetSelectedPageOption = jest.fn();
  const mockSetIsModalOpen = jest.fn();
  const mockOnSave = jest.fn();

  it('Should render the component fine', async () => {
    const { container } = render(
      <MockedProvider>
        <TestWrapper>
          <BannerPagesModal
            pagesData={mockPagesData}
            isModalOpen
            setSelectedPageOption={mockSetSelectedPageOption}
            setIsModalOpen={mockSetIsModalOpen}
            onSave={mockOnSave}
            selectedPageOption
          />
        </TestWrapper>
      </MockedProvider>
    );
    expect(await screen.findByTestId('banner-pages-modalId')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByTestId('banner_placement-label')).toBeInTheDocument();
    });
    expect(await axe(container)).toHaveNoViolations();
  });

  it('Should call the method to close the modal when cancel is clicked', async () => {
    const { container } = render(
      <MockedProvider>
        <TestWrapper>
          <BannerPagesModal
            pagesData={mockPagesData}
            isModalOpen
            setSelectedPageOption={mockSetSelectedPageOption}
            setIsModalOpen={mockSetIsModalOpen}
            onSave={mockOnSave}
            selectedPageOption
          />
        </TestWrapper>
      </MockedProvider>
    );
    expect(await screen.findByTestId('banner-pages-modalId')).toBeInTheDocument();
    const cancelBtn = await screen.findByTestId('banner-pages-cancel-channel-button');
    fireEvent.click(cancelBtn);
    expect(mockSetIsModalOpen).toHaveBeenCalled();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('Should select the page selected upon selecting in the dropdown', async () => {
    const { container } = render(
      <MockedProvider>
        <TestWrapper>
          <BannerPagesModal
            pagesData={mockPagesData}
            isModalOpen
            setSelectedPageOption={mockSetSelectedPageOption}
            setIsModalOpen={mockSetIsModalOpen}
            onSave={mockOnSave}
            selectedPageOption
          />
        </TestWrapper>
      </MockedProvider>
    );
    expect(await screen.findByTestId('banner-pages-modalId')).toBeInTheDocument();
    const dropDown = await screen.findByTestId('banner_placement');
    fireEvent.click(dropDown);
    const channelOne = await screen.findByTestId('banner_placement-option-0');
    fireEvent.click(channelOne);
    const assignBtn = await screen.findByTestId('banner-pages-save-pages-button');
    fireEvent.click(assignBtn);
    const dropdownButton = await screen.findByRole('button', { key: 'banner_placement_label' });
    expect(await within(dropdownButton).findByText('Channel 1')).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });
});

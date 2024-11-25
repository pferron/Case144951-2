import { MockedProvider } from '@apollo/client/testing';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import { axe } from 'jest-axe';
import 'jest-axe/extend-expect';
import { screen } from 'nucleus-text/testing-library/screen';
import { BreakpointMocker } from '@utils/testUtil/BreakpointMocker';
import userEvent from '@testing-library/user-event';
import { v4 as uuidV4 } from 'uuid';
import ChannelsListSection from '../ChannelsListSection';

const channelsListSection = {
  sectionId: '513d724f-f4c6-4b39-a110-3a91a8424870',
  originPageId: 'c1153be4-34e9-41f1-8d2c-74273f5a7011',
  pageSectionTemplate: 'DefaultChannels',
  title: 'Channels List Title',
  visibleFields: ['description', 'image'],
  contentLimitOnInitialLoad: 6,
  featuredContentType: null,
  featuredContentTypeId: null,
  contentType: null,
  contentIds: null,
  contentFilterDateAbstract: null,
  alignment: 'Left',
  layout: null,
  textBody: 'Channels Description',
  textColor: null,
  buttonEnabled: null,
  buttonText: null,
  buttonExternalTarget: null,
  buttonInternalTarget: null,
  buttonTargetType: null,
  imageUrl: null,
  originalImageUrl: null,
  imageAltText: null,
  rowName: '513d724f-f4c6-4b39-a110-3a91a8424870'
};

const mockSetIsPageEdited = jest.fn();
const mockOnSectionUpdate = jest.fn();
const mockGetUpdatedSectionIds = jest.fn().mockReturnValue({
  temporarySectionId: uuidV4(),
  updatedSectionIds: []
});
const mockSetSelectedSection = jest.fn();

jest.mock('@hooks/useCenterInfo', () => ({
  useCenterInfo: () => {
    return {
      calendarId: 'calendarId-1'
    };
  }
}));

describe('Channels List Section', () => {
  it('Should render without errors', async () => {
    const { container } = render(
      <MockedProvider>
        <TestWrapper>
          <ChannelsListSection
            pageSection={{
              ...channelsListSection,
              __typename: 'PageSection'
            }}
            setIsPageEdited={mockSetIsPageEdited}
            onSectionUpdate={mockOnSectionUpdate}
            getUpdatedSectionIds={mockGetUpdatedSectionIds}
            setSelectedSection={mockSetSelectedSection}
            setShowSectionTemplate={jest.fn()}
          />
        </TestWrapper>
      </MockedProvider>
    );
    const channelsSection = screen.getByTextKey('home_page_custom_channels_list_section_description');
    expect(channelsSection).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it(
    'Should call setIsPageEdited, onSectionUpdate, and getUpdatedSectionIds when a form is edited and clicked on' +
      ' Done',
    async () => {
      render(
        <MockedProvider>
          <TestWrapper>
            <ChannelsListSection
              pageSection={{
                ...channelsListSection,
                __typename: 'PageSection'
              }}
              setIsPageEdited={mockSetIsPageEdited}
              onSectionUpdate={mockOnSectionUpdate}
              getUpdatedSectionIds={mockGetUpdatedSectionIds}
              setSelectedSection={mockSetSelectedSection}
              setShowSectionTemplate={jest.fn()}
            />
          </TestWrapper>
        </MockedProvider>
      );
      const noOfChannelsRadioOption3 = screen.getByRole('radio', {
        key: 'home_page_custom_channels_list_number_of_channels_four'
      });
      expect(noOfChannelsRadioOption3).toBeInTheDocument();
      const doneBtn = screen.getByTextKey('home_page_sections_add_section_modal_footer_btn_done');
      expect(doneBtn).toBeInTheDocument();
      fireEvent.click(doneBtn);
      expect(mockSetIsPageEdited).toHaveBeenCalled();
      expect(mockGetUpdatedSectionIds).toHaveBeenCalled();
      await waitFor(() => {
        expect(mockOnSectionUpdate).toHaveBeenCalled();
      });
    }
  );

  it('should not show previewer on Mobile screens', async () => {
    render(
      <MockedProvider>
        <TestWrapper>
          <BreakpointMocker isS>
            <ChannelsListSection
              pageSection={{
                ...channelsListSection,
                __typename: 'PageSection'
              }}
              setIsPageEdited={mockSetIsPageEdited}
              onSectionUpdate={mockOnSectionUpdate}
              getUpdatedSectionIds={mockGetUpdatedSectionIds}
              setSelectedSection={mockSetSelectedSection}
              setShowSectionTemplate={jest.fn()}
            />
          </BreakpointMocker>
        </TestWrapper>
      </MockedProvider>
    );
    expect(screen.queryByTestId('channels-list-section-previewer')).not.toBeInTheDocument();
    const previewText = screen.getByTextKey('home_page_sections_mobile_preview_text');
    expect(previewText).toBeInTheDocument();
  });

  it('Should display the default Channels value in title when title is null', async () => {
    render(
      <MockedProvider>
        <TestWrapper>
          <ChannelsListSection
            pageSection={{
              ...channelsListSection,
              title: null,
              __typename: 'PageSection'
            }}
            setIsPageEdited={mockSetIsPageEdited}
            onSectionUpdate={mockOnSectionUpdate}
            getUpdatedSectionIds={mockGetUpdatedSectionIds}
            setSelectedSection={mockSetSelectedSection}
            setShowSectionTemplate={jest.fn()}
          />
        </TestWrapper>
      </MockedProvider>
    );
    const titleInput = await screen.findByTestId('title-input');
    expect(titleInput).toHaveValue('Channels');
  });

  it('Should display the Channel title when title is not null', async () => {
    render(
      <MockedProvider>
        <TestWrapper>
          <ChannelsListSection
            pageSection={{
              ...channelsListSection,
              __typename: 'PageSection'
            }}
            setIsPageEdited={mockSetIsPageEdited}
            onSectionUpdate={mockOnSectionUpdate}
            getUpdatedSectionIds={mockGetUpdatedSectionIds}
            setSelectedSection={mockSetSelectedSection}
            setShowSectionTemplate={jest.fn()}
          />
        </TestWrapper>
      </MockedProvider>
    );
    const titleInput = await screen.findByTestId('title-input');
    expect(titleInput).toHaveValue('Channels List Title');
  });

  it('Should disable the done button when title is empty', async () => {
    render(
      <MockedProvider>
        <TestWrapper>
          <ChannelsListSection
            pageSection={{
              ...channelsListSection,
              title: '',
              __typename: 'PageSection'
            }}
            setIsPageEdited={mockSetIsPageEdited}
            onSectionUpdate={mockOnSectionUpdate}
            getUpdatedSectionIds={mockGetUpdatedSectionIds}
            setSelectedSection={mockSetSelectedSection}
            setShowSectionTemplate={jest.fn()}
          />
        </TestWrapper>
      </MockedProvider>
    );
    const titleInput = await screen.findByTestId('title-input');
    await userEvent.clear(titleInput);
    const doneBtn = await screen.findByRole('button', { key: 'home_page_sections_add_section_modal_footer_btn_done' });
    expect(doneBtn).toBeDisabled();
  });
});

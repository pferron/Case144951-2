import { MockedProvider } from '@apollo/client/testing';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import { axe } from 'jest-axe';
import 'jest-axe/extend-expect';
import { screen } from 'nucleus-text/testing-library/screen';
import { BreakpointMocker } from '@utils/testUtil/BreakpointMocker';
import userEvent from '@testing-library/user-event';
import { v4 as uuidV4 } from 'uuid';
import MyEventsSection from '../MyEventsSection';

const myEventsSection = {
  sectionId: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  originPageId: '6d3d0b64-2c6f-4d5b-8d4a-1a0a9e6ae0e2',
  pageSectionTemplate: 'MyEventCalendar',
  title: 'My Events Title',
  contentLimitOnInitialLoad: 3,
  featuredContentType: null,
  featuredContentTypeId: null,
  contentType: null,
  contentIds: null,
  contentFilterDateAbstract: null,
  alignment: 'Left',
  layout: 'Tile',
  textBody: 'My Events Description',
  textColor: null,
  buttonEnabled: null,
  buttonText: null,
  buttonExternalTarget: null,
  buttonInternalTarget: null,
  buttonTargetType: null,
  imageUrl: null,
  originalImageUrl: null,
  imageAltText: null,
  rowName: '2ff9b4d1-3b53-4b2c-8f3f-9e1eb2d51a6e'
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

describe('My Events Section', () => {
  it('Should render without errors', async () => {
    const { container } = render(
      <MockedProvider>
        <TestWrapper>
          <MyEventsSection
            pageSection={{
              ...myEventsSection,
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
    const myEventsSectionDesc = screen.getByTextKey('home_page_default_my_events_purpose');
    expect(myEventsSectionDesc).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('Should be able to make changes to the form', async () => {
    render(
      <MockedProvider>
        <TestWrapper>
          <MyEventsSection
            pageSection={{
              ...myEventsSection,
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
    const noOfEventsRadioOption6 = screen.getByRole('radio', {
      key: 'home_page_custom_channels_list_number_of_channels_six'
    });
    expect(noOfEventsRadioOption6).toBeInTheDocument();
  });
  it(
    'Should call onSectionUpdate, getUpdatedSectionIds, setIsPageEdited and setUpdatedSectionIds when changes are' +
      ' made and clicked' +
      ' Done',
    async () => {
      render(
        <MockedProvider>
          <TestWrapper>
            <MyEventsSection
              pageSection={{
                ...myEventsSection,
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
      const noOfEventsRadioOption6 = screen.getByRole('radio', {
        key: 'home_page_custom_channels_list_number_of_channels_six'
      });
      expect(noOfEventsRadioOption6).toBeInTheDocument();
      const descriptionElement = screen.getByTextKey('home_page_default_my_events_purpose');
      expect(descriptionElement).toBeInTheDocument();
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
            <MyEventsSection
              pageSection={{
                ...myEventsSection,
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
    expect(screen.queryByTestId('events-section-previewer')).not.toBeInTheDocument();
    const previewText = screen.getByTextKey('home_page_sections_mobile_preview_text');
    expect(previewText).toBeInTheDocument();
  });

  it('Should display the default Your Events value in title when title is null', async () => {
    render(
      <MockedProvider>
        <TestWrapper>
          <MyEventsSection
            pageSection={{
              ...myEventsSection,
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
    expect(titleInput).toHaveValue('Your Events');
  });

  it('Should display the Your Events title when title is not null', async () => {
    render(
      <MockedProvider>
        <TestWrapper>
          <MyEventsSection
            pageSection={{
              ...myEventsSection,
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
    expect(titleInput).toHaveValue('My Events Title');
  });

  it('Should disable the done button when title is empty', async () => {
    render(
      <MockedProvider>
        <TestWrapper>
          <MyEventsSection
            pageSection={{
              ...myEventsSection,
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

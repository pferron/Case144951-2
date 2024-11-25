import { MockedProvider } from '@apollo/client/testing';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import { axe } from 'jest-axe';
import 'jest-axe/extend-expect';
import { screen } from 'nucleus-text/testing-library/screen';
import { BreakpointMocker } from '@utils/testUtil/BreakpointMocker';
import { v4 as uuidV4 } from 'uuid';
import EventCalendarSection from '../EventCalendarSection';

const eventCalendarSection = {
  sectionId: 'f47ac10b-58cc-4372-a567-0e02b2c3d478',
  originPageId: '6d3d0b64-2c6f-4d5b-8d4a-1a0a9e6ae0ef',
  pageSectionTemplate: 'EventCalendar',
  title: 'Event Calendar',
  contentLimitOnInitialLoad: 3,
  featuredContentType: 'calendarName-1',
  featuredContentTypeId: 'calendarId-1',
  contentType: null,
  contentIds: null,
  contentFilterDateAbstract: null,
  alignment: 'Left',
  layout: 'Tile',
  textBody: 'Calendar Description',
  textColor: null,
  buttonEnabled: null,
  buttonText: null,
  buttonExternalTarget: null,
  buttonInternalTarget: null,
  buttonTargetType: null,
  imageUrl: null,
  originalImageUrl: null,
  imageAltText: null,
  rowName: '2ff9b4d1-3b53-4b2c-8f3f-9e1eb2d51a6d'
};

const eventCalendarSectionRequiredFieldEmpty = {
  sectionId: 'f47ac10b-58cc-4372-a567-0e02b2c3d478',
  originPageId: '6d3d0b64-2c6f-4d5b-8d4a-1a0a9e6ae0ef',
  pageSectionTemplate: 'EventCalendar',
  title: 'Event Calendar',
  contentLimitOnInitialLoad: 3,
  featuredContentType: '',
  featuredContentTypeId: '',
  contentType: null,
  contentIds: null,
  contentFilterDateAbstract: null,
  alignment: 'Left',
  layout: 'Tile',
  textBody: 'Calendar Description',
  textColor: null,
  buttonEnabled: null,
  buttonText: null,
  buttonExternalTarget: null,
  buttonInternalTarget: null,
  buttonTargetType: null,
  imageUrl: null,
  originalImageUrl: null,
  imageAltText: null,
  rowName: '2ff9b4d1-3b53-4b2c-8f3f-9e1eb2d51a6d'
};

const calendarListData = [
  {
    id: 'calendarId-1',
    name: 'calendarName-1'
  },
  {
    id: 'calendarId-2',
    name: 'calendarName-2'
  }
];

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

describe('Event Calendar Section', () => {
  it('Should render without errors', async () => {
    const { container } = render(
      <MockedProvider>
        <TestWrapper>
          <EventCalendarSection
            pageSection={{
              ...eventCalendarSection,
              __typename: 'PageSection'
            }}
            setIsPageEdited={mockSetIsPageEdited}
            onSectionUpdate={mockOnSectionUpdate}
            getUpdatedSectionIds={mockGetUpdatedSectionIds}
            setSelectedSection={mockSetSelectedSection}
            calendarListData={calendarListData}
            setShowSectionTemplate={jest.fn()}
          />
        </TestWrapper>
      </MockedProvider>
    );
    const eventCalendarSectionDesc = screen.getByTextKey('home_page_custom_event_calendar_section_description');
    expect(eventCalendarSectionDesc).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('Should be able to update the form and make changes to it', async () => {
    render(
      <MockedProvider>
        <TestWrapper>
          <EventCalendarSection
            pageSection={{
              ...eventCalendarSection,
              __typename: 'PageSection'
            }}
            setIsPageEdited={mockSetIsPageEdited}
            onSectionUpdate={mockOnSectionUpdate}
            getUpdatedSectionIds={mockGetUpdatedSectionIds}
            setSelectedSection={mockSetSelectedSection}
            calendarListData={calendarListData}
            setShowSectionTemplate={jest.fn()}
          />
        </TestWrapper>
      </MockedProvider>
    );
    const displayNameTextbox = screen.getAllByRole('textbox');
    expect(displayNameTextbox[0]).toBeInTheDocument();
    fireEvent.change(displayNameTextbox[0], { target: { value: 'New Display Name' } });
    expect(screen.getByTestId('title-input')).toHaveValue('New Display Name');
  });

  it('Should call setIsPageEdited, onSectionUpdate, and getUpdatedSectionIds when changes are made and clicked Done', async () => {
    render(
      <MockedProvider>
        <TestWrapper>
          <EventCalendarSection
            pageSection={{
              ...eventCalendarSection,
              __typename: 'PageSection'
            }}
            setIsPageEdited={mockSetIsPageEdited}
            onSectionUpdate={mockOnSectionUpdate}
            getUpdatedSectionIds={mockGetUpdatedSectionIds}
            setSelectedSection={mockSetSelectedSection}
            calendarListData={calendarListData}
            setShowSectionTemplate={jest.fn()}
          />
        </TestWrapper>
      </MockedProvider>
    );
    const calendarDropdown = screen.getAllByRole('button')[0];
    expect(calendarDropdown).toBeInTheDocument();
    fireEvent.click(calendarDropdown);
    const newCalendarOption = screen.getByRole('menuitemradio', { name: 'calendarName-2' });
    expect(newCalendarOption).toBeInTheDocument();
    fireEvent.click(newCalendarOption);

    const descriptionElement = await screen.findByTextKey('home_page_custom_event_calendar_section_description');
    expect(descriptionElement).toBeInTheDocument();
    const doneBtn = screen.getByTextKey('home_page_sections_add_section_modal_footer_btn_done');
    expect(doneBtn).toBeInTheDocument();
    fireEvent.click(doneBtn);
    expect(mockSetIsPageEdited).toHaveBeenCalled();
    expect(mockGetUpdatedSectionIds).toHaveBeenCalled();
    await waitFor(() => {
      expect(mockOnSectionUpdate).toHaveBeenCalled();
    });
  });

  it('Should render with validation error for empty required fields', async () => {
    render(
      <MockedProvider>
        <TestWrapper>
          <EventCalendarSection
            pageSection={{
              ...eventCalendarSectionRequiredFieldEmpty,
              __typename: 'PageSection'
            }}
            setIsPageEdited={mockSetIsPageEdited}
            onSectionUpdate={mockOnSectionUpdate}
            getUpdatedSectionIds={mockGetUpdatedSectionIds}
            setSelectedSection={mockSetSelectedSection}
            calendarListData={calendarListData}
            setShowSectionTemplate={jest.fn()}
          />
        </TestWrapper>
      </MockedProvider>
    );
    const eventCalendarValidationError = await screen.findByTextKey('home_page_sections_validation_error');
    expect(eventCalendarValidationError).toBeInTheDocument();
  });

  it('should not show previewer on Mobile screens', async () => {
    render(
      <MockedProvider>
        <TestWrapper>
          <BreakpointMocker isS>
            <EventCalendarSection
              pageSection={{
                ...eventCalendarSectionRequiredFieldEmpty,
                __typename: 'PageSection'
              }}
              setIsPageEdited={mockSetIsPageEdited}
              onSectionUpdate={mockOnSectionUpdate}
              getUpdatedSectionIds={mockGetUpdatedSectionIds}
              setSelectedSection={mockSetSelectedSection}
              calendarListData={calendarListData}
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
});

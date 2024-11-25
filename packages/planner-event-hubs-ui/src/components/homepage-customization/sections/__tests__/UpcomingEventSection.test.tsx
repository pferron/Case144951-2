import { MockedProvider } from '@apollo/client/testing';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import { axe } from 'jest-axe';
import 'jest-axe/extend-expect';
import { screen } from 'nucleus-text/testing-library/screen';
import { BreakpointMocker } from '@utils/testUtil/BreakpointMocker';
import { v4 as uuidV4 } from 'uuid';
import UpcomingEventSection from '../UpcomingEventSection';

const upcomingEventsPageSection = {
  sectionId: '513d724f-f4c6-4b39-a110-3a91a8424870',
  originPageId: 'c1153be4-34e9-41f1-8d2c-74273f5a7011',
  pageSectionTemplate: 'DefaultUpcomingEvents',
  title: 'Display Name for UC',
  visibleFields: null,
  contentLimitOnInitialLoad: 3,
  featuredContentType: null,
  featuredContentTypeId: null,
  contentType: null,
  contentIds: null,
  contentFilterType: null,
  contentFilterDateAbstract: null,
  alignment: 'Left',
  layout: null,
  textBody: 'Upcoming events Description',
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
const mockSetSelectedSection = jest.fn();
const mockGetUpdatedSectionIds = jest.fn().mockReturnValue({
  temporarySectionId: uuidV4(),
  updatedSectionIds: []
});

jest.mock('@hooks/useCenterInfo', () => ({
  useCenterInfo: () => {
    return {
      calendarId: 'calendarId-1'
    };
  }
}));

const mockCalendarListData = [
  {
    id: 'calendarId-1',
    name: 'calendarName-1'
  },
  {
    id: 'calendarId-2',
    name: 'calendarName-2'
  }
];

describe('UpcomingEventSection', () => {
  it('Should render without errors', async () => {
    const { container } = render(
      <MockedProvider>
        <TestWrapper>
          <UpcomingEventSection
            pageSection={{
              ...upcomingEventsPageSection,
              __typename: 'PageSection'
            }}
            setIsPageEdited={mockSetIsPageEdited}
            onSectionUpdate={mockOnSectionUpdate}
            getUpdatedSectionIds={mockGetUpdatedSectionIds}
            setSelectedSection={mockSetSelectedSection}
            calendarListData={mockCalendarListData}
            setShowSectionTemplate={jest.fn()}
          />
        </TestWrapper>
      </MockedProvider>
    );
    const calendarNameDisplayed = await screen.findByText('calendarName-1');
    expect(calendarNameDisplayed).toBeInTheDocument();
    expect(await screen.findByTestId('upcoming-events-section-form')).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('Should render radio options 4 and 8 when alignment is Top', async () => {
    render(
      <MockedProvider>
        <TestWrapper>
          <UpcomingEventSection
            pageSection={{
              ...upcomingEventsPageSection,
              __typename: 'PageSection'
            }}
            setIsPageEdited={mockSetIsPageEdited}
            onSectionUpdate={mockOnSectionUpdate}
            getUpdatedSectionIds={mockGetUpdatedSectionIds}
            setSelectedSection={mockSetSelectedSection}
            calendarListData={mockCalendarListData}
            setShowSectionTemplate={jest.fn()}
          />
        </TestWrapper>
      </MockedProvider>
    );
    const calendarNameDisplayed = await screen.findByText('calendarName-1');
    expect(calendarNameDisplayed).toBeInTheDocument();
    const alignmentRadioOptionRight = screen.getByRole('radio', {
      key: 'home_page_custom_upcoming_events_alignment_top'
    });
    fireEvent.click(alignmentRadioOptionRight);
    expect(await screen.findByTextKey('home_page_custom_upcoming_events_number_of_events_three')).toBeInTheDocument();
    expect(await screen.findByTextKey('home_page_custom_upcoming_events_number_of_events_six')).toBeInTheDocument();
  });

  it('Should be able to make changes to the form', async () => {
    render(
      <MockedProvider>
        <TestWrapper>
          <UpcomingEventSection
            pageSection={{
              ...upcomingEventsPageSection,
              __typename: 'PageSection'
            }}
            setIsPageEdited={mockSetIsPageEdited}
            onSectionUpdate={mockOnSectionUpdate}
            getUpdatedSectionIds={mockGetUpdatedSectionIds}
            setSelectedSection={mockSetSelectedSection}
            calendarListData={mockCalendarListData}
            setShowSectionTemplate={jest.fn()}
          />
        </TestWrapper>
      </MockedProvider>
    );
    const calendarNameDisplayed = await screen.findByText('calendarName-1');
    expect(calendarNameDisplayed).toBeInTheDocument();
    const alignmentRadioOptionRight = screen.getByRole('radio', {
      key: 'home_page_custom_upcoming_events_alignment_top'
    });
    expect(alignmentRadioOptionRight).toBeInTheDocument();
  });
  it(
    'Should call onSectionUpdate, setIsPageEdited and getUpdatedSectionIds when changes are' +
      ' made and clicked out of the form',
    async () => {
      render(
        <MockedProvider>
          <TestWrapper>
            <UpcomingEventSection
              pageSection={{
                ...upcomingEventsPageSection,
                __typename: 'PageSection'
              }}
              setIsPageEdited={mockSetIsPageEdited}
              onSectionUpdate={mockOnSectionUpdate}
              getUpdatedSectionIds={mockGetUpdatedSectionIds}
              setSelectedSection={mockSetSelectedSection}
              calendarListData={mockCalendarListData}
              setShowSectionTemplate={jest.fn()}
            />
          </TestWrapper>
        </MockedProvider>
      );
      const calendarNameDisplayed = await screen.findByText('calendarName-1');
      expect(calendarNameDisplayed).toBeInTheDocument();

      const alignmentRadioOptionTop = await screen.findByTestId('up-events-section-alignement__Top');
      fireEvent.click(alignmentRadioOptionTop);
      // Clicking outside form
      fireEvent.mouseDown(screen.getByTextKey('home_page_custom_upcoming_events_section_description'));
      await new Promise(resolve => {
        setTimeout(resolve, 1000);
      });
      const descriptionElement = await screen.findByTextKey('home_page_custom_upcoming_events_section_description');
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
            <UpcomingEventSection
              pageSection={{
                ...upcomingEventsPageSection,
                __typename: 'PageSection'
              }}
              setIsPageEdited={mockSetIsPageEdited}
              onSectionUpdate={mockOnSectionUpdate}
              getUpdatedSectionIds={mockGetUpdatedSectionIds}
              setSelectedSection={mockSetSelectedSection}
              calendarListData={mockCalendarListData}
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

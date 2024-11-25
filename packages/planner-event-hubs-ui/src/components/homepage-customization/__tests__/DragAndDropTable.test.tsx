import { MockedProvider } from '@apollo/client/testing';
import { fireEvent, render } from '@testing-library/react';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import { getPlannerPaginatedChannelsQuery } from '@cvent/planner-event-hubs-model/operations/channel';
import { axe } from 'jest-axe';
import 'jest-axe/extend-expect';
import { screen } from 'nucleus-text/testing-library/screen';
import DragAndDropTable from '../DragAndDropTable';

const mockSetIsPageEdited = jest.fn();
const mockOnDragAndDropHandler = jest.fn();
const mockOnSectionUpdate = jest.fn();
const mockSetHomePageSections = jest.fn();
const mockSetUpdatedSectionIds = jest.fn();
const mockOnDeleteHandler = jest.fn();
const mockGetUpdatedSectionIds = jest.fn();

jest.mock('@hooks/useCenterInfo', () => ({
  useCenterInfo: () => {
    return {
      calendarId: 'upcomingEventsCalendarId-1',
      hubData: {
        id: 'hubId'
      }
    };
  }
}));

const mockPaginatedChannelsData = {
  request: {
    query: getPlannerPaginatedChannelsQuery,
    variables: {
      hubId: 'hubId'
    }
  },
  result: {
    data: {
      getPlannerPaginatedChannels: {
        data: [
          {
            id: 'channelId-1',
            title: 'Channel title',
            description: 'explain plan test description',
            status: 'INACTIVE',
            catalogId: 'f3699bf6-f58b-4430-b872-966f2b572a96',
            imageUrl: null,
            order: 1,
            videoCount: 0,
            __typename: 'PlannerChannelListObject'
          }
        ],
        paging: {
          currentToken: '4718cbb4-0517-4d59-b232-d4cf4dae973a',
          nextToken: '23a228a3-fa65-4b8c-87c1-576bb49659ad',
          limit: 15,
          __typename: 'Paging'
        },
        __typename: 'PlannerPaginatedChannels'
      }
    }
  }
};

const mockHomePageSections = [
  {
    sectionId: 'myeventsid',
    originPageId: 'page-id',
    pageSectionTemplate: 'MyEventCalendar',
    title: 'Section My events title',
    rowName: 'myeventsid'
  },
  {
    sectionId: 'eventid',
    originPageId: 'page-id',
    pageSectionTemplate: 'EventCalendar',
    title: 'Section Events title',
    rowName: 'eventsid'
  }
];

const mockUpdatedSectionIds = ['ucid', 'eventid'];

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

const mockHomePageSectionsForCalendar = [
  {
    sectionId: 'upEventsid',
    originPageId: 'page-id',
    pageSectionTemplate: 'DefaultUpcomingEvents',
    title: '',
    rowName: 'upEventsid',
    featuredContentTypeId: 'upcomingEventsCalendarId-1'
  },
  {
    sectionId: 'eventid',
    originPageId: 'page-id',
    pageSectionTemplate: 'EventCalendar',
    title: '',
    rowName: 'eventsid',
    featuredContentTypeId: 'eventsCalendarId-1'
  },
  {
    sectionId: 'yourEventsId',
    originPageId: 'page-id',
    pageSectionTemplate: 'MyEventCalendar',
    title: '',
    rowName: 'eventsid',
    featuredContentTypeId: 'yourEventsCalendarId-1'
  }
];
const mockCalendarListDataForCalendarNoMatch = [
  {
    id: 'upcomingEventsCalendarId-nomatch',
    name: 'UpcomingEvents title'
  },
  {
    id: 'eventsCalendarId-nomatch',
    name: 'Events calendar title'
  }
];

const mockCalendarListDataForCalendar = [
  {
    id: 'upcomingEventsCalendarId-1',
    name: 'UpcomingEvents title'
  },
  {
    id: 'eventsCalendarId-1',
    name: 'Events calendar title'
  }
];

describe('DragAndDropTable', () => {
  it('Should render the table with sections', async () => {
    const { container } = render(
      <MockedProvider mocks={[mockPaginatedChannelsData]}>
        <TestWrapper>
          <DragAndDropTable
            setIsPageEdited={mockSetIsPageEdited}
            onDragAndDropHandler={mockOnDragAndDropHandler}
            onSectionUpdate={mockOnSectionUpdate}
            setHomePageSections={mockSetHomePageSections}
            setUpdatedSectionIds={mockSetUpdatedSectionIds}
            updatedSectionIds={mockUpdatedSectionIds}
            homePageSections={mockHomePageSections}
            onDeleteHandler={mockOnDeleteHandler}
            calendarListData={mockCalendarListData}
            getUpdatedSectionIds={mockGetUpdatedSectionIds}
          />
        </TestWrapper>
      </MockedProvider>
    );
    const myEventsSection = await screen.findByTestId('reorderable-table-fields-row-1');
    expect(myEventsSection).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('Should show title of the section in the table', async () => {
    render(
      <MockedProvider mocks={[mockPaginatedChannelsData]}>
        <TestWrapper>
          <DragAndDropTable
            setIsPageEdited={mockSetIsPageEdited}
            onDragAndDropHandler={mockOnDragAndDropHandler}
            onSectionUpdate={mockOnSectionUpdate}
            setHomePageSections={mockSetHomePageSections}
            setUpdatedSectionIds={mockSetUpdatedSectionIds}
            updatedSectionIds={mockUpdatedSectionIds}
            homePageSections={mockHomePageSections}
            onDeleteHandler={mockOnDeleteHandler}
            calendarListData={mockCalendarListData}
            getUpdatedSectionIds={mockGetUpdatedSectionIds}
          />
        </TestWrapper>
      </MockedProvider>
    );
    expect(await screen.findByTextKey('home_page_sections_add_section_my_events')).toBeInTheDocument();
  });

  it('Should show the calendarName as title for upcomingEvents and EventCalendar sections', async () => {
    render(
      <MockedProvider mocks={[mockPaginatedChannelsData]}>
        <TestWrapper>
          <DragAndDropTable
            setIsPageEdited={mockSetIsPageEdited}
            onDragAndDropHandler={mockOnDragAndDropHandler}
            onSectionUpdate={mockOnSectionUpdate}
            setHomePageSections={mockSetHomePageSections}
            setUpdatedSectionIds={mockSetUpdatedSectionIds}
            updatedSectionIds={mockUpdatedSectionIds}
            homePageSections={mockHomePageSectionsForCalendar}
            onDeleteHandler={mockOnDeleteHandler}
            calendarListData={mockCalendarListDataForCalendar}
            isUpcomingEventsEnabled
            getUpdatedSectionIds={mockGetUpdatedSectionIds}
          />
        </TestWrapper>
      </MockedProvider>
    );
    expect(await screen.findByText('Upcoming Events: UpcomingEvents title')).toBeInTheDocument();
    expect(await screen.findByText('Event Calendar: Events calendar title')).toBeInTheDocument();
  });

  it(
    'Should show phrase translations for upcomingEvents and EventCalendar sections when title is null and' +
      ' featuredContentTypeId is null or not matched',
    async () => {
      render(
        <MockedProvider mocks={[mockPaginatedChannelsData]}>
          <TestWrapper>
            <DragAndDropTable
              setIsPageEdited={mockSetIsPageEdited}
              onDragAndDropHandler={mockOnDragAndDropHandler}
              onSectionUpdate={mockOnSectionUpdate}
              setHomePageSections={mockSetHomePageSections}
              setUpdatedSectionIds={mockSetUpdatedSectionIds}
              updatedSectionIds={mockUpdatedSectionIds}
              homePageSections={mockHomePageSectionsForCalendar}
              onDeleteHandler={mockOnDeleteHandler}
              calendarListData={mockCalendarListDataForCalendarNoMatch}
              isUpcomingEventsEnabled
              getUpdatedSectionIds={mockGetUpdatedSectionIds}
            />
          </TestWrapper>
        </MockedProvider>
      );
      expect(await screen.findByTextKey('home_page_sections_add_section_event_calendar')).toBeInTheDocument();
      expect(await screen.findByTextKey('home_page_sections_add_section_upcmg_events')).toBeInTheDocument();
    }
  );

  it('Should show channel name as title for SingleChannel sections', async () => {
    const mockHomePageSectionsForSingleChannel = [
      {
        sectionId: 'channelId',
        originPageId: 'page-id',
        pageSectionTemplate: 'SingleChannel',
        title: '',
        rowName: 'upEventsid',
        featuredContentTypeId: 'channelId-1'
      }
    ];
    render(
      <MockedProvider mocks={[mockPaginatedChannelsData]}>
        <TestWrapper>
          <DragAndDropTable
            setIsPageEdited={mockSetIsPageEdited}
            onDragAndDropHandler={mockOnDragAndDropHandler}
            onSectionUpdate={mockOnSectionUpdate}
            setHomePageSections={mockSetHomePageSections}
            setUpdatedSectionIds={mockSetUpdatedSectionIds}
            updatedSectionIds={mockUpdatedSectionIds}
            homePageSections={mockHomePageSectionsForSingleChannel}
            onDeleteHandler={mockOnDeleteHandler}
            calendarListData={mockCalendarListData}
            getUpdatedSectionIds={mockGetUpdatedSectionIds}
          />
        </TestWrapper>
      </MockedProvider>
    );
    expect(await screen.findByText('Channel: Channel title')).toBeInTheDocument();
  });

  it(
    'Should show phrase translations for channel name as title for SingleChannel sections when title is null and' +
      ' featuredContentTypeId does not match',
    async () => {
      const mockHomePageSectionsForSingleChannel = [
        {
          sectionId: 'channelId',
          originPageId: 'page-id',
          pageSectionTemplate: 'SingleChannel',
          title: '',
          rowName: 'upEventsid',
          featuredContentTypeId: 'channelId-111'
        }
      ];
      render(
        <MockedProvider mocks={[mockPaginatedChannelsData]}>
          <TestWrapper>
            <DragAndDropTable
              setIsPageEdited={mockSetIsPageEdited}
              onDragAndDropHandler={mockOnDragAndDropHandler}
              onSectionUpdate={mockOnSectionUpdate}
              setHomePageSections={mockSetHomePageSections}
              setUpdatedSectionIds={mockSetUpdatedSectionIds}
              updatedSectionIds={mockUpdatedSectionIds}
              homePageSections={mockHomePageSectionsForSingleChannel}
              onDeleteHandler={mockOnDeleteHandler}
              calendarListData={mockCalendarListData}
              getUpdatedSectionIds={mockGetUpdatedSectionIds}
            />
          </TestWrapper>
        </MockedProvider>
      );
      expect(await screen.findByTextKey('home_page_sections_add_section_channel')).toBeInTheDocument();
    }
  );

  it('Should show the hidden pill and tooltip when isUpcomingEventsEnabled is false', async () => {
    render(
      <MockedProvider mocks={[mockPaginatedChannelsData]}>
        <TestWrapper>
          <DragAndDropTable
            setIsPageEdited={mockSetIsPageEdited}
            onDragAndDropHandler={mockOnDragAndDropHandler}
            onSectionUpdate={mockOnSectionUpdate}
            setHomePageSections={mockSetHomePageSections}
            setUpdatedSectionIds={mockSetUpdatedSectionIds}
            updatedSectionIds={mockUpdatedSectionIds}
            homePageSections={mockHomePageSectionsForCalendar}
            onDeleteHandler={mockOnDeleteHandler}
            calendarListData={mockCalendarListDataForCalendar}
            isUpcomingEventsEnabled={false}
            getUpdatedSectionIds={mockGetUpdatedSectionIds}
          />
        </TestWrapper>
      </MockedProvider>
    );
    const hiddenToolTip = await screen.findByRole('tooltip', { key: 'home_page_hidden_upcoming_event_tooltip_msg' });
    expect(hiddenToolTip).toBeInTheDocument();
  });

  it('Should show the hidden pill and tooltip when isYourEventsEnabled is false', async () => {
    render(
      <MockedProvider mocks={[mockPaginatedChannelsData]}>
        <TestWrapper>
          <DragAndDropTable
            setIsPageEdited={mockSetIsPageEdited}
            onDragAndDropHandler={mockOnDragAndDropHandler}
            onSectionUpdate={mockOnSectionUpdate}
            setHomePageSections={mockSetHomePageSections}
            setUpdatedSectionIds={mockSetUpdatedSectionIds}
            updatedSectionIds={mockUpdatedSectionIds}
            homePageSections={mockHomePageSectionsForCalendar}
            onDeleteHandler={mockOnDeleteHandler}
            calendarListData={mockCalendarListDataForCalendar}
            isYourEventsEnabled={false}
            getUpdatedSectionIds={mockGetUpdatedSectionIds}
          />
        </TestWrapper>
      </MockedProvider>
    );
    const hiddenToolTip = await screen.findByRole('tooltip', { key: 'home_page_hidden_your_event_tooltip_msg' });
    expect(hiddenToolTip).toBeInTheDocument();
  });

  it('Should show the confirmation modal upon deleting a section', async () => {
    render(
      <MockedProvider mocks={[mockPaginatedChannelsData]}>
        <TestWrapper>
          <DragAndDropTable
            setIsPageEdited={mockSetIsPageEdited}
            onDragAndDropHandler={mockOnDragAndDropHandler}
            onSectionUpdate={mockOnSectionUpdate}
            setHomePageSections={mockSetHomePageSections}
            setUpdatedSectionIds={mockSetUpdatedSectionIds}
            updatedSectionIds={mockUpdatedSectionIds}
            homePageSections={mockHomePageSectionsForCalendar}
            onDeleteHandler={mockOnDeleteHandler}
            calendarListData={mockCalendarListDataForCalendar}
            isUpcomingEventsEnabled={false}
            getUpdatedSectionIds={mockGetUpdatedSectionIds}
          />
        </TestWrapper>
      </MockedProvider>
    );
    const hiddenToolTip = await screen.findByRole('tooltip', { key: 'home_page_hidden_upcoming_event_tooltip_msg' });
    expect(hiddenToolTip).toBeInTheDocument();
    const upcomingEventsSectionMenu = screen.getByTestId('section-item-overflow-menu-button-EventCalendar');
    fireEvent.click(upcomingEventsSectionMenu);
    const deleteMenuItem = await screen.findByRole('menuitem', { key: 'home_page_sections_delete_menu' });
    fireEvent.click(deleteMenuItem);
    const confirmationModalContent = await screen.findByTextKey('home_page_delete_section_confirmation_header_content');
    expect(confirmationModalContent).toBeInTheDocument();
  });
});

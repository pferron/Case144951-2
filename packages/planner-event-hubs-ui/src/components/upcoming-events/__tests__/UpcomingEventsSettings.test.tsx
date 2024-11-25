import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { screen } from 'nucleus-text/testing-library/screen';
import { MockedProvider as ApolloProvider } from '@apollo/client/testing';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import 'jest-axe/extend-expect';
import { axe } from 'jest-axe';
import { UPDATE_VIDEO_HUB } from '@cvent/planner-event-hubs-model/operations/hub';
import UpcomingEventsSettings from '../UpcomingEventsSettings';

const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
  useHistory: () => ({
    push: mockHistoryPush
  })
}));
const mockError = new Error('An error occurred');

const mockHub = {
  id: '81ce6133-e96b-41c4-9761-fbba0e14ca54',
  status: 'Inactive',
  config: {
    ownerEmail: 'have@colors.com',
    ownerFirstName: 'Will',
    ownerLastName: 'It',
    title: 'Colorful Center test',
    url: null
  },
  theme: {}
};

const mocks = [
  {
    request: {
      query: UPDATE_VIDEO_HUB,
      variables: {
        input: {
          id: 'test-video-hub-with-logo'
        }
      }
    },
    error: mockError
  }
];

describe('Upcoming Events on set up', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('Show the calendar selection card on the page', async () => {
    const { container } = render(
      <ApolloProvider>
        <TestWrapper>
          <UpcomingEventsSettings
            videoCenterTitle={mockHub.config.title}
            videoCenterId={mockHub.id}
            calendarId="B257A972-A07E-491A-85CE-350ED4C70FD3"
          />
        </TestWrapper>
      </ApolloProvider>
    );
    expect(await screen.findByTestId('upcoming-events-calendar-title')).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
    const editButton = screen.getByTestId('upcoming-events-calendar-selection-edit-button');
    expect(editButton).toBeInTheDocument();
    fireEvent.click(editButton);
  });

  it('Show manage calendar selection card on the page', async () => {
    const { container } = render(
      <ApolloProvider>
        <TestWrapper>
          <UpcomingEventsSettings
            videoCenterTitle={mockHub.config.title}
            videoCenterId={mockHub.id}
            calendarId="B257A972-A07E-491A-85CE-350ED4C70FD3"
          />
        </TestWrapper>
      </ApolloProvider>
    );
    expect(await screen.findByText('Calendars')).toBeInTheDocument();
    expect(screen.getByTestId('calendar-core-reference-title')).toHaveTextContent('Calendars');
    expect(screen.getByTestId('calendar-core-reference-description')).toHaveTextContent(
      'Add a calendar or edit existing ones to showcase different types of events.'
    );
    expect(await axe(container)).toHaveNoViolations();
    const manageCalendarsButton = screen.getByText('Manage calendars');
    await fireEvent.click(manageCalendarsButton);
    expect(screen.getByTestId('calendar-core-reference-link')).toHaveAttribute(
      'href',
      '/Subscribers/Events2/EventCalendar/EventCalendarGrid'
    );
  });

  // RED
  // eslint-disable-next-line jest/no-disabled-tests
  it.skip('Show Tracking parameters card on the page', async () => {
    render(
      <ApolloProvider>
        <TestWrapper>
          <UpcomingEventsSettings
            videoCenterTitle={mockHub.config.title}
            videoCenterId={mockHub.id}
            calendarId="B257A972-A07E-491A-85CE-350ED4C70FD3"
          />
        </TestWrapper>
      </ApolloProvider>
    );
    expect(await screen.findByText('Tracking Parameters')).toBeInTheDocument();
    expect(screen.getByTestId('tracking-parameters-reference-title')).toHaveTextContent('Tracking Parameters');
    expect(screen.getByTestId('tracking-parameters-reference-description')).toHaveTextContent(
      'Manage custom URL tracking parameters for Upcoming Events links'
    );
    const manageCalendarsButton = await screen.findByTextKey('Settings-Tracking-Parameters-Card-Parameters-Button');
    await fireEvent.click(manageCalendarsButton);
    expect(screen.getByTestId('tracking-parameters-reference-link')).toHaveAttribute(
      'href',
      '/eventsplus/81ce6133-e96b-41c4-9761-fbba0e14ca54/marketing/tracking-codes'
    );
  });

  it('should handle error during saveCalendar mutation', async () => {
    const { container } = render(
      <ApolloProvider mocks={mocks}>
        <TestWrapper>
          <UpcomingEventsSettings
            videoCenterTitle={mockHub.config.title}
            videoCenterId={mockHub.id}
            calendarId="B257A972-A07E-491A-85CE-350ED4C70FD3"
          />
        </TestWrapper>
      </ApolloProvider>
    );
    expect(await screen.findByTestId('upcoming-events-calendar-title')).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
    const editButton = screen.getByTestId('upcoming-events-calendar-selection-edit-button');
    expect(editButton).toBeInTheDocument();
    fireEvent.click(editButton);

    const saveButton = screen.getByTestId('upcoming-events-calendar-selection-edit-save-button');
    fireEvent.click(saveButton);
    await waitFor(() => {
      expect(screen.getByTestId('upcomingEvents-settings-alert-form-error')).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByTestId('upcomingEvents-settings-alert-form-error')).toHaveTextContent(
        'Couldn’t save changes. Please refresh the page and try again.'
      );
    });
  });
});

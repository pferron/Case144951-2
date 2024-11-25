import React from 'react';
import { screen, render, fireEvent } from '@testing-library/react';
import { MockedProvider as ApolloProvider } from '@apollo/client/testing';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import 'jest-axe/extend-expect';
import { axe } from 'jest-axe';
import CalendarSelection from '../CalendarSelection';
import calendarList from '../fixtures/calendarsList.json';

jest.mock('next/router', () => ({
  useRouter: jest.fn()
}));

describe('Select Calendars from dropdown memu', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should render successfully - calendar dropdown on screen', async () => {
    const { container } = render(
      <ApolloProvider>
        <TestWrapper>
          <CalendarSelection
            editMode
            calendarList={calendarList.data.calendars.data}
            calendarId="B257A972-A07E-491A-85CE-350ED4C70FD3"
            onSelection="B257A972-A07E-491A-85CE-350ED4C70FD3"
          />
        </TestWrapper>
      </ApolloProvider>
    );
    expect(screen.getByTestId('upcoming-events-calendar-title')).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
    const calendarDropdownLink = screen.getByTestId('upcoming-events-calendar');
    expect(calendarDropdownLink).toBeInTheDocument();
    fireEvent.click(calendarDropdownLink);
  });
});

import React from 'react';
import { Col } from '@cvent/carina/components/Col';
import { Row } from '@cvent/carina/components/Row';
import { injectTestId } from '@cvent/nucleus-test-automation';
import Dropdown from '@cvent/carina/components/Dropdown/Dropdown';
import FormElement from '@cvent/carina/components/FormElement/FormElement';
import { useTranslate } from 'nucleus-text';
import { UpcomingEventsStyle } from '@components/upcoming-events/style';
import { useStyle } from '@hooks/useStyle';
import { EventCalendar } from '@cvent/planner-event-hubs-model/types';
import { Theme } from '@cvent/carina/components/ThemeProvider';

interface Props {
  calendarList: Array<EventCalendar>;
  calendarId: string;
  onSelection: (val1: string, val2: string | JSX.Element | ((theme: Theme) => string | JSX.Element)) => void;
  editMode: boolean;
}

function CalendarSelection({ calendarList, calendarId, onSelection, editMode }: Props) {
  const { translate } = useTranslate();

  const { body, form, title } = useStyle(UpcomingEventsStyle);

  const options = calendarList?.map(calendar => ({
    label: calendar.name,
    value: calendar.id
  }));

  const calendarName = calendarList
    ?.filter(cal => cal.id === calendarId)
    .map(cal => cal.name)
    .toString();

  return (
    <Row>
      <Col width="fill">
        <div css={title} {...injectTestId('upcoming-events-calendar-title')}>
          {translate('Settings-Upcoming-Events-Card-Header')}
        </div>
        <div css={body}>{translate('Settings-Upcoming-Events-Card-Body')}</div>
        <div css={body}>{translate('Settings-Upcoming-Events-Card-New-Calendar')}</div>
        <div css={form}>
          <FormElement>
            {editMode ? (
              <>
                <FormElement.Label
                  label={translate('Settings-Upcoming-Events-Card-Edit-Label')}
                  labelFor="upcoming-events-calendar-ddl"
                />
                <Dropdown
                  testID="upcoming-events-calendar"
                  id="upcoming-events-calendar"
                  options={options}
                  selected={calendarId}
                  onUpdate={(value, { label: selectedCalendarName }) => onSelection(value, selectedCalendarName)}
                />
              </>
            ) : (
              <>
                <FormElement.Label
                  label={translate('Settings-Upcoming-Events-Card-Selected-Label')}
                  labelFor="upcoming-events-calendar-ddl"
                />
                <p css={{ margin: 0 }}>{calendarName || '-'}</p>
              </>
            )}
          </FormElement>
        </div>
      </Col>
    </Row>
  );
}

export default CalendarSelection;

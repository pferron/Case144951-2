import { ChainablePromiseElement } from 'webdriverio';

class UpcomingEventsPage {
  get upcomingEventCalendarDropdown(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="upcoming-events-calendar"]');
  }

  get upcomingEventChooseCalendar(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="upcoming-events-calendar-option-0"]');
  }

  get editUpcomingevent(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="upcoming-events-calendar-selection-edit-button"]');
  }

  get saveUpcomingevent(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="upcoming-events-calendar-selection-edit-save-button"]');
  }

  get CancelUpcomingeventIcon(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="upcoming-events-calendar-selection-edit-cancel-button"]');
  }

  get trackingParametersTitle(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="tracking-parameters-reference-title"]');
  }

  get addTrackingParamters(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="tracking-parameters-reference-link"]');
  }
}

export default new UpcomingEventsPage();

import Modal from '@cvent/carina/components/Modal';
import React, { useRef, useState } from 'react';
import { injectTestId } from '@cvent/nucleus-test-automation';
import Button from '@cvent/carina/components/Button';
import { useTranslate } from 'nucleus-text';
import { XIcon } from '@cvent/carina/components/Icon';
import ScrollViewWithBars from '@cvent/carina/components/ScrollViewWithBars';
import Col from '@cvent/carina/components/Col';
import Row from '@cvent/carina/components/Row';
import { DateRangePicker } from '@cvent/carina/components/DateRangePicker_NEXT';
import { addDays, isAfter, isBefore, isValid, format } from 'date-fns';
import { isMatch } from 'lodash';
import { utcToZonedTime } from 'date-fns-tz';
import { useStyle } from '@hooks/useStyle';
import { DatePickerModalStyle } from '@components/hubOverview/style';
import useBreakpoints from '@hooks/useBreakpoints';

interface DatePickerModalProps {
  testID?: string;
  isOpen: boolean;
  disableFocusTrap?: boolean;
  onApply: (startDate: Date, endDate: Date) => void;
  onCancel: () => void;
  earliestDate?: Date;
}

const DATE_PICKER_MODAL_HEIGHT = 655;
const DATE_PICKER_MODAL_WIDTH = 800;
const DATE_PICKER_MODAL_TABLET_WIDTH = 430;
function DatePickerModal({
  testID,
  isOpen,
  disableFocusTrap = false,
  onApply,
  earliestDate,
  onCancel
}: DatePickerModalProps): JSX.Element {
  const styles = useStyle(DatePickerModalStyle);
  const { translate } = useTranslate();
  const portalRef = useRef<HTMLDivElement>(null);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const dateInThePast = { before: new Date() };
  const today = new Date();
  const maxDate = addDays(today, 1);
  const minDate = new Date(earliestDate);
  // Check the validity of selected dates
  const isStartDateValid = startDate && isValid(startDate) && !isMatch(startDate, [dateInThePast, today]);
  const isEndDateValid = endDate && isValid(endDate) && !isMatch(endDate, [dateInThePast, today]);
  const isStartAfterEnd = isStartDateValid && isEndDateValid && isAfter(startDate, endDate);
  const isStartBeforeEarliestDate = isStartDateValid && isBefore(startDate, minDate);
  const isEndAfterToday = isEndDateValid && isAfter(endDate, today);
  const { isMobileOrTablet } = useBreakpoints();
  const handleChange = (start: Date, end: Date) => {
    setStartDate(start);
    setEndDate(end);
  };

  const convertToUTCDate = (date: string | Date): Date => {
    const dateInput = new Date(date);
    return utcToZonedTime(dateInput, 'UTC');
  };

  const helperText = () => {
    const invalidDateFormat = (startDate && !isValid(startDate)) || (endDate && !isValid(endDate));
    const futureDate =
      (startDate && isValid(startDate) && isMatch({ isGreater: isAfter(startDate, today) }, { isGreater: true })) ||
      (endDate && isValid(endDate) && isMatch({ isGreater: isAfter(endDate, today) }, { isGreater: true }));

    const formattedEarliestDate = earliestDate ? format(convertToUTCDate(earliestDate), 'MM/dd/yyyy') : null;

    if (invalidDateFormat) {
      return translate('hub_overview_date_picker_date_format_invalid_error');
    }
    if (futureDate) {
      return translate('hub_overview_date_picker_future_date_error');
    }
    if (isStartAfterEnd) {
      return translate('hub_overview_date_picker_start_before_end_error');
    }
    if (isStartBeforeEarliestDate) {
      return translate('hub_overview_date_picker_start_before_earliest_date_error', { date: formattedEarliestDate });
    }
    return '';
  };

  return (
    <Modal
      css={{ width: isMobileOrTablet ? DATE_PICKER_MODAL_TABLET_WIDTH : DATE_PICKER_MODAL_WIDTH }}
      format="l"
      isOpen={isOpen}
      testID="date-picker-modal"
      disableFocusTrap={disableFocusTrap}
      height={DATE_PICKER_MODAL_HEIGHT}
      aria-label={translate('shared_upload_analytics_date_picker_modal_title')}
    >
      <ScrollViewWithBars
        forceStickyFooter
        header={
          <Row margin={{ top: 24, bottom: 16, start: 24, end: 24 }}>
            <Col
              width="fill"
              flex={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}
              padding={0}
            >
              <h2 {...injectTestId(`${testID}-date-picker-modal-header`)} css={styles.datePickerModalTitle}>
                {`${translate('hub_overview_date_picker_modal_title')}`}
              </h2>
            </Col>
            <Col
              width="content"
              flex={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}
              padding={0}
            >
              <Button
                accessibilityLabel={translate(
                  'shared_upload_analytics_date_picker_modal_exit_button_accessibility_label'
                )}
                appearance="ghost"
                icon={XIcon}
                isPill
                onClick={onCancel}
                testID={`${testID}-date-picker-modal-close-button`}
                variant="neutral"
              />
            </Col>
          </Row>
        }
        footer={
          <Row margin={{ top: 24, bottom: 24, start: 24, end: 24 }}>
            <Col width="fill" flex={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
              <Button
                appearance="lined"
                text={translate('hub_overview_date_picker_cancel_button')}
                onClick={onCancel}
                testID={`${testID}-date-picker-modal-cancel-button`}
              />
            </Col>
            <Col width="content" padding={0}>
              <Button
                aria-haspopup="dialog"
                appearance="filled"
                text={translate('hub_overview_date_picker_apply_button')}
                disabled={
                  !isStartDateValid ||
                  !isEndDateValid ||
                  isStartAfterEnd ||
                  isStartBeforeEarliestDate ||
                  isEndAfterToday
                }
                onClick={() => {
                  if (isStartDateValid && isEndDateValid) {
                    onApply(startDate, endDate);
                  }
                }}
                testID={`${testID}-date-picker-modal-apply-button`}
              />
            </Col>
          </Row>
        }
      >
        <div css={styles.datePickerContainer}>
          <div
            ref={portalRef}
            {...injectTestId(`${testID}-date-picker-container`)}
            css={styles.datePickerContentContainer}
          >
            <DateRangePicker
              css={{ marginTop: '2rem' }}
              testID={testID}
              dialogAriaLabel={translate('shared_upload_analytics_date_picker_aria_label')}
              endDate={endDate}
              numberOfMonths={isMobileOrTablet ? 1 : 2}
              endDialogToggleLabel=""
              endInputLabel={translate('hub_overview_date_picker_end_input_label')}
              hasError={
                (startDate && !isStartDateValid) ||
                (endDate && !isEndDateValid) ||
                isStartAfterEnd ||
                isStartBeforeEarliestDate ||
                isEndAfterToday
              }
              helperText={helperText()}
              id="date-range-picker"
              labelText=""
              nextButtonAriaLabel={translate('shared_upload_analytics_date_picker_next_button_aria_label')}
              onChange={handleChange}
              prevButtonAriaLabel={translate('shared_upload_analytics_date_picker_previous_button_aria_label')}
              startDate={startDate}
              startDialogToggleLabel=""
              startInputLabel={translate('hub_overview_date_picker_start_input_label')}
              isOpen
              canSelectPastDate
              blockedDays={[minDate, maxDate, { before: minDate, after: maxDate }]}
            />
          </div>
        </div>
      </ScrollViewWithBars>
    </Modal>
  );
}

export default DatePickerModal;

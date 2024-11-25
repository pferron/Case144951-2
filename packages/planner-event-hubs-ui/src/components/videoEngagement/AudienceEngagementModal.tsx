import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useStyle } from '@hooks/useStyle';
import { useTranslate } from 'nucleus-text';
import { ASC } from '@utils/constants';
import ScrollViewWithBars from '@cvent/carina/components/ScrollViewWithBars/ScrollViewWithBars';
import LoadingWrapper from '@components/common/loading/LoadingWrapper';
import { AudienceEngagementStyles } from '@components/videoEngagement/style';
import { SearchBar } from '@cvent/carina/components/FilterControlBar';
import { injectTestId } from '@cvent/nucleus-test-automation';
import DatePickerModal from '@components/hubOverview/DatePickerModal';
import { subMonths } from 'date-fns';
import { IllustrationHeader, IllustrationNotice } from '@cvent/carina/components/Templates';
import SpotWarning from '@cvent/carina/components/Illustrations/SpotWarning';
import AudienceList from '@components/videoEngagement/AudienceList';
import Modal from '@cvent/carina/components/Modal';
import TextLink from '@cvent/carina/components/TextLink';
import { getDateRangeOptions, getStartDate, onDateApplyHandler } from '@components/videoEngagement/DateRangeOptions';
import type { MemberVideoWatchData } from '@cvent/planner-event-hubs-model/src/types';
import { getDatetimesForAnalytics } from '@utils/analyticsUtil';
import { useQuery } from '@apollo/client';
import { memberVideoWatchDurationByHubId } from '@cvent/planner-event-hubs-model/src/operations/analytics';
import { Dropdown } from '@cvent/carina/components/Dropdown';

function AudienceEngagementModal({
  hubId,
  isModalOpen,
  setIsModalOpen,
  video,
  testId,
  dateFilter
}: Props): React.JSX.Element {
  const {
    pagesModal,
    outerContainer,
    listContainer,
    filterBarContainer,
    mostEngagedTitle,
    modalTopStyle,
    downloadCsvButtonStyle,
    dateFilterDropdownStyle
  } = useStyle(AudienceEngagementStyles);
  const { translate } = useTranslate();
  const today = new Date();
  const { id, name, duration } = video;
  const [searchText, setSearchText] = useState('');
  const [noRecordFoundTerm, setNoRecordFoundTerm] = useState('');
  const [dateForAnalytics, setDateForAnalytics] = useState(dateFilter.dateForAnalytics);
  const [selectedTimeFrame, setSelectedTimeFrame] = useState<string>(dateFilter.selectedTimeFrame);
  const [selectedDateRange, setSelectedDateRange] = useState(dateFilter.selectedDateRange);
  const [datePickerModalIsOpen, setDatePickerModalIsOpen] = useState(false);
  const [audienceData, setAudienceData] = useState<MemberVideoWatchData[]>([]);
  const [filteredData, setFilteredData] = useState<MemberVideoWatchData[]>([]);
  const dateRangeOptions = useMemo(() => getDateRangeOptions(translate), [translate]);
  const { currentStartDate, currentEndDate } = getDatetimesForAnalytics(dateForAnalytics, selectedTimeFrame);

  useEffect(() => {
    if (dateFilter.selectedDateRange.value === 'custom_date_range') {
      const customDateRangeOption = dateRangeOptions.find(option => option.value === 'custom_date_range');
      if (customDateRangeOption) {
        customDateRangeOption.label = dateFilter.selectedTimeFrame;
      }
    }
  }, [dateFilter.selectedDateRange, dateFilter.selectedTimeFrame, dateRangeOptions]);

  const { loading } = useQuery(memberVideoWatchDurationByHubId, {
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-and-network',
    variables: {
      input: {
        videoId: id,
        videoDuration: duration,
        filter: {
          hubId,
          startDate: currentStartDate,
          endDate: currentEndDate
        }
      }
    },
    onCompleted: data => {
      if (data?.memberVideoWatchDurationByHubId?.data) {
        setAudienceData(data?.memberVideoWatchDurationByHubId?.data);
        if (noRecordFoundTerm !== '') {
          setFilteredData(
            data?.memberVideoWatchDurationByHubId?.data.filter(
              audience =>
                audience.firstName.toLowerCase().includes(noRecordFoundTerm.toLowerCase()) ||
                audience.lastName.toLowerCase().includes(noRecordFoundTerm.toLowerCase()) ||
                audience.email.toLowerCase().includes(noRecordFoundTerm.toLowerCase())
            )
          );
        } else {
          setFilteredData(data?.memberVideoWatchDurationByHubId?.data);
        }
      }
    }
  });

  const onSort = useCallback(
    (sortColumn, sortOrder) => {
      const sorted = [...audienceData].sort((a, b) => {
        if (sortOrder === ASC) {
          return a[sortColumn].localeCompare(b[sortColumn]);
        }
        return b[sortColumn].localeCompare(a[sortColumn]);
      });
      setFilteredData(
        noRecordFoundTerm && noRecordFoundTerm !== ''
          ? sorted.filter(
              audience =>
                audience.firstName.toLowerCase().includes(noRecordFoundTerm.toLowerCase()) ||
                audience.lastName.toLowerCase().includes(noRecordFoundTerm.toLowerCase()) ||
                audience.email.toLowerCase().includes(noRecordFoundTerm.toLowerCase())
            )
          : sorted
      );
    },
    [audienceData, noRecordFoundTerm, setFilteredData]
  );

  const handleOnSubmit = useCallback(
    (text: string): void => {
      setNoRecordFoundTerm(text);
      setFilteredData(
        audienceData.filter(
          audience =>
            audience.firstName.toLowerCase().includes(text.toLowerCase()) ||
            audience.lastName.toLowerCase().includes(text.toLowerCase()) ||
            audience.email.toLowerCase().includes(text.toLowerCase())
        )
      );
    },
    [audienceData]
  );

  const handleClearSearchText = useCallback(() => {
    setSearchText('');
    setNoRecordFoundTerm('');
    setFilteredData(audienceData);
  }, [audienceData]);

  const handleDateSelection = useCallback(
    selection => {
      if (selection === 'custom_date_range') {
        setDatePickerModalIsOpen(true);
      } else {
        const newStartDate = getStartDate(selection);
        setDateForAnalytics(newStartDate);
        const selectedOption = dateRangeOptions.find(option => option.value === selection);
        setSelectedTimeFrame(selectedOption.label);
        const customDateRangeOption = dateRangeOptions.find(option => option.value === 'custom_date_range');
        if (customDateRangeOption) {
          customDateRangeOption.label = translate('video_list_date_picker_custom_date_range');
        }
      }
    },
    [setDatePickerModalIsOpen, setDateForAnalytics, setSelectedTimeFrame, dateRangeOptions, translate]
  );

  const noDataPage: JSX.Element = useMemo(
    () => (
      <IllustrationNotice
        testID="no_video_list_page_container"
        illustration={SpotWarning}
        aria-label={translate('video_list_empty_page_message_header')}
        title={translate('video_list_empty_page_message_header')}
      >
        <IllustrationHeader>
          {translate('video_list_no_data_message_header', { searchText: noRecordFoundTerm })}
        </IllustrationHeader>
      </IllustrationNotice>
    ),
    [translate, noRecordFoundTerm]
  );

  const audienceListBody = useCallback(
    () => (
      <div css={outerContainer}>
        <div css={modalTopStyle}>
          <h4 css={{ marginTop: '0', marginBottom: '0' }}>{name}</h4>
          <TextLink element="button" css={downloadCsvButtonStyle} onClick={() => {}}>
            {translate('download_csv_button')}
          </TextLink>
        </div>
        <div css={{ ...mostEngagedTitle, marginBottom: '2rem', marginTop: '0.5rem' }}>
          {translate('most_engaged_title')}
        </div>
        <div
          css={{ ...filterBarContainer, display: 'flex', alignItems: 'center' }}
          {...injectTestId('video-list-filter-desktop')}
        >
          <div css={{ marginRight: '1rem', marginLeft: '0.15rem' }}>
            <SearchBar
              testID="search-audience-filter-bar"
              onSubmit={handleOnSubmit}
              placeholder={translate('video_list_search_text')}
              clearSearchText={handleClearSearchText}
              searchText={searchText}
              onTextChange={setSearchText}
            />
          </div>
          <div css={dateFilterDropdownStyle}>
            <Dropdown
              id="audience-engagement-date-range-dropdown"
              testID="audience-engagement-date-range-dropdown"
              variant="outline"
              labelText={translate('hub_overview_date_range_dropdown_label')}
              onUpdate={value => {
                setSelectedDateRange({ value });
                handleDateSelection(value);
              }}
              options={dateRangeOptions}
              selected={selectedDateRange}
            />
          </div>
        </div>
        <div css={listContainer}>
          {filteredData.length === 0 ? noDataPage : <AudienceList audienceList={filteredData} onSort={onSort} />}
        </div>
      </div>
    ),
    [
      outerContainer,
      modalTopStyle,
      name,
      downloadCsvButtonStyle,
      translate,
      mostEngagedTitle,
      filterBarContainer,
      handleOnSubmit,
      handleClearSearchText,
      searchText,
      dateFilterDropdownStyle,
      dateRangeOptions,
      selectedDateRange,
      listContainer,
      filteredData,
      noDataPage,
      onSort,
      handleDateSelection
    ]
  );

  // Delay focus trap check due to loading spinner
  const checkCanFocusTrap = (): Promise<void> =>
    new Promise(resolve => {
      setTimeout(resolve, 10000);
    });

  return (
    <Modal
      css={pagesModal}
      format="l"
      testID={testId}
      isOpen={isModalOpen}
      onDismiss={() => {
        setIsModalOpen(false);
      }}
      zIndex={1000}
      scrollLock={false}
      focusTrapOptions={{ checkCanFocusTrap }}
      portal
    >
      <div css={outerContainer}>
        <ScrollViewWithBars forceStickyHeader>
          <LoadingWrapper
            loading={loading}
            renderer={audienceListBody}
            id="video-highlights-loading-spinner"
            ariaLabel={translate('video_highlights_side_nav_text')}
            testID="video-highlights-loading-spinner"
          />
        </ScrollViewWithBars>
        <DatePickerModal
          testID="audience-list-date-picker-modal"
          isOpen={datePickerModalIsOpen}
          earliestDate={subMonths(today, 11)}
          onApply={(startDate, endDate) => {
            onDateApplyHandler(
              startDate,
              endDate,
              setSelectedTimeFrame,
              setDatePickerModalIsOpen,
              setDateForAnalytics,
              dateRangeOptions,
              setSelectedDateRange
            );
          }}
          onCancel={() => {
            setDatePickerModalIsOpen(false);
            setSelectedDateRange({
              value: dateRangeOptions.find(option => option.label === selectedTimeFrame).value
            });
          }}
        />
      </div>
    </Modal>
  );
}

interface Props {
  hubId: string;
  isModalOpen: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void;
  video: {
    id: string;
    name: string;
    duration: number;
  };
  testId: string;
  dateFilter: {
    dateForAnalytics:
      | {
          type: string;
          value: { startDate: Date; endDate: Date };
        }
      | number
      | null;
    selectedTimeFrame: string;
    selectedDateRange: {
      value: string;
    };
  };
}

export default AudienceEngagementModal;

import React, { useCallback, useMemo, useState } from 'react';
import { useStyle } from '@hooks/useStyle';
import { useTranslate } from 'nucleus-text';
import Header from '@components/Header';
import { useAppFeatures } from '@components/AppFeaturesProvider';
import Tabs from '@cvent/carina/components/Tabs/Tabs';
import useQueryParams from '@hooks/useQueryParam';
import { useRouter } from 'next/router';
import { updateUrlQueryParam } from '@utils/redirect';
import {
  ASC,
  HUB_OVERVIEW_URL,
  TAB,
  VIDEO_HIGHLIGHTS_URL,
  VIDEO_HUB_PATH_PARAM_KEY,
  VIDEO_HUBS_URL
} from '@utils/constants';
import ScrollViewWithBars from '@cvent/carina/components/ScrollViewWithBars/ScrollViewWithBars';
import { Breadcrumbs } from '@cvent/carina/components/Breadcrumbs';
import { BreadCrumb } from '@components/common/BreadCrumb';
import LoadingWrapper from '@components/common/loading/LoadingWrapper';
import { VideoHighlightsStyle } from '@components/videoEngagement/style';
import { SearchBar } from '@cvent/carina/components/FilterControlBar';
import { injectTestId } from '@cvent/nucleus-test-automation';
import DatePickerModal from '@components/hubOverview/DatePickerModal';
import { subMonths } from 'date-fns';
import { IllustrationContent, IllustrationHeader, IllustrationNotice } from '@cvent/carina/components/Templates';
import SpotWarning from '@cvent/carina/components/Illustrations/SpotWarning';
import { getDateRangeOptions, getStartDate, onDateApplyHandler } from '@components/videoEngagement/DateRangeOptions';
import { Dropdown } from '@cvent/carina/components/Dropdown';
import { getDatetimesForAnalytics } from '@utils/analyticsUtil';
import { useQuery } from '@apollo/client';
import { videosViewDetailsByHubId } from '@cvent/planner-event-hubs-model/src/operations/analytics';
import type { VideoAnalyticsItem } from '@cvent/planner-event-hubs-model/src/types';
import VideoTable from './VideoTable';

function VideoHighlights({ hubId, hubTitle }: Props): React.JSX.Element {
  const { outerContainer, innerContainer, listContainer, titleContainer, filterBarContainer, dateFilterDropdownStyle } =
    useStyle(VideoHighlightsStyle);
  const { translate } = useTranslate();
  const { renovateHubOverviewFeature } = useAppFeatures();
  const { tab } = useQueryParams();
  const router = useRouter();
  const today = new Date();
  const [searchText, setSearchText] = useState('');
  const [noRecordFoundTerm, setNoRecordFoundTerm] = useState('');
  const [dateForAnalytics, setDateForAnalytics] = useState(null);
  const [selectedTimeFrame, setSelectedTimeFrame] = useState<string>(translate('video_list_date_picker_last_30_days'));
  const [selectedDateRange, setSelectedDateRange] = useState({ value: 'last_30_days' });
  const [datePickerModalIsOpen, setDatePickerModalIsOpen] = useState(false);
  const [videoData, setVideoData] = useState<VideoAnalyticsItem[]>([]);
  const [filteredData, setFilteredData] = useState<VideoAnalyticsItem[]>([]);
  const dateRangeOptions = useMemo(() => getDateRangeOptions(translate), [translate]);
  const filterDates = getDatetimesForAnalytics(dateForAnalytics, selectedTimeFrame);

  const { loading } = useQuery(videosViewDetailsByHubId, {
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-and-network',
    variables: {
      input: {
        hubId,
        startDate: filterDates.currentStartDate,
        endDate: filterDates.currentEndDate
      }
    },
    onCompleted: data => {
      if (data?.videosViewDetailsByHubId?.data) {
        setVideoData(data?.videosViewDetailsByHubId?.data);
        if (noRecordFoundTerm !== '') {
          setFilteredData(
            data?.videosViewDetailsByHubId?.data.filter(video =>
              video.videoTitle.toLowerCase().includes(noRecordFoundTerm.toLowerCase())
            )
          );
        } else {
          setFilteredData(data?.videosViewDetailsByHubId?.data);
        }
      }
    }
  });

  const onSort = useCallback(
    (sortColumn, sortOrder) => {
      const sorted = [...videoData].sort((a, b) => {
        if (sortOrder === ASC) {
          return a[sortColumn] > b[sortColumn] ? 1 : -1;
        }
        return a[sortColumn] < b[sortColumn] ? 1 : -1;
      });
      setFilteredData(
        noRecordFoundTerm && noRecordFoundTerm !== ''
          ? sorted.filter(video => video.videoTitle.toLowerCase().includes(noRecordFoundTerm.toLowerCase()))
          : sorted
      );
    },
    [videoData, noRecordFoundTerm]
  );

  const handleOnSubmit = useCallback(
    (text: string): void => {
      setNoRecordFoundTerm(text);
      setFilteredData(videoData.filter(video => video.videoTitle.toLowerCase().includes(text.toLowerCase())));
    },
    [videoData]
  );

  const handleClearSearchText = useCallback(() => {
    setSearchText('');
    setNoRecordFoundTerm('');
    setFilteredData(videoData);
  }, [videoData]);

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

  const tabOptions = [{ label: translate('video_highlights_tab_title'), value: 0, testID: 'videos_tab' }];
  const getSelectedTab = useCallback(
    (loadedTab): number => (renovateHubOverviewFeature && loadedTab === '0' ? 0 : null),
    [renovateHubOverviewFeature]
  );

  const switchTab = useCallback(
    (value): void => {
      const newUrl = updateUrlQueryParam(router.asPath, TAB, value);
      setSelectedTab(value);
      window.history.replaceState({ ...window.history.state }, '', newUrl);
    },
    [router.asPath]
  );

  const noDataPage: React.JSX.Element = useMemo(
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
        <IllustrationContent>{translate('video_list_engagement_content')}</IllustrationContent>
      </IllustrationNotice>
    ),
    [translate, noRecordFoundTerm]
  );

  const videoListBody = useCallback(
    () => (
      <div css={innerContainer}>
        <h2 css={{ marginTop: '0' }}>{translate('video_highlights_tab_title')}</h2>
        <div
          css={{ ...filterBarContainer, display: 'flex', alignItems: 'center' }}
          {...injectTestId('video-list-filter-desktop')}
        >
          <div css={{ marginRight: '1rem' }}>
            <SearchBar
              testID="search-video-filter-bar"
              searchAriaLabel={translate('video_list_search_text')}
              submitSearchTextLabel={translate('video_list_search_text')}
              onSubmit={handleOnSubmit}
              placeholder={translate('video_list_search_text')}
              clearSearchText={handleClearSearchText}
              searchText={searchText}
              onTextChange={setSearchText}
            />
          </div>
          <div css={dateFilterDropdownStyle}>
            <Dropdown
              id="video-engagement-date-range-dropdown"
              testID="video-engagement-date-range-dropdown"
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
          {filteredData.length === 0 ? (
            noDataPage
          ) : (
            <VideoTable
              hubId={hubId}
              videoList={filteredData}
              onSort={onSort}
              dateFilter={{
                dateForAnalytics,
                selectedTimeFrame,
                selectedDateRange
              }}
            />
          )}
        </div>
      </div>
    ),
    [
      innerContainer,
      translate,
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
      hubId,
      onSort,
      dateForAnalytics,
      selectedTimeFrame,
      handleDateSelection
    ]
  );

  const [selectedTab, setSelectedTab] = useState<number | string>(getSelectedTab(tab));

  const headerBreadCrumbs: JSX.Element = (
    <Breadcrumbs>
      <BreadCrumb url={VIDEO_HUBS_URL}>{translate('video_hubs_header_title')}</BreadCrumb>
      <BreadCrumb url={HUB_OVERVIEW_URL.replace(VIDEO_HUB_PATH_PARAM_KEY, hubId)}>{hubTitle}</BreadCrumb>
      <BreadCrumb url={VIDEO_HIGHLIGHTS_URL.replace(VIDEO_HUB_PATH_PARAM_KEY, hubId)}>
        {translate('video_highlights_side_nav_text')}
      </BreadCrumb>
    </Breadcrumbs>
  );

  const tabs = <Tabs options={tabOptions} selected={selectedTab} onUpdate={switchTab} removeBottomBorder />;

  const videoHighlightsHeader: JSX.Element = (
    <div css={titleContainer}>
      <Header title={translate('video_highlights_side_nav_text')} tabs={tabs} breadCrumbs={headerBreadCrumbs} />
    </div>
  );

  return (
    <div css={outerContainer}>
      <ScrollViewWithBars forceStickyHeader header={videoHighlightsHeader}>
        <div>
          <LoadingWrapper
            loading={loading}
            renderer={videoListBody}
            id="video-highlights-loading-spinner"
            ariaLabel={translate('video_highlights_side_nav_text')}
            testID="video-highlights-loading-spinner"
          />
        </div>
      </ScrollViewWithBars>
      <DatePickerModal
        testID="video-list-date-picker-modal"
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
  );
}

interface Props {
  hubId: string;
  hubTitle: string;
}

export default VideoHighlights;

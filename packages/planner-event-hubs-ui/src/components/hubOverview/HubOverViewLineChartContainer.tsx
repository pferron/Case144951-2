import Tabs, { TabsContextProvider, TabsPanel } from '@cvent/carina/components/Tabs';
import {
  TOTAL_VIEWS_TAB_ORDER,
  TOTAL_REGISTRATION_TAB_ORDER,
  AVERAGE_DURATION_TAB_ORDER,
  MONTHS_LIMIT_FOR_DATE_FORMAT
} from '@utils/constants';
import { Row } from '@cvent/carina/components/Row';
import { Col } from '@cvent/carina/components/Col';
import { CardBody, CardContainer } from '@cvent/carina/components/Card';
import React, { useState } from 'react';
import { useTranslate } from 'nucleus-text';
import { injectTestId } from '@cvent/nucleus-test-automation';
import HubOverViewLineChart from '@components/hubOverview/HubOverViewLineChart';
import { AnalyticsDataItem } from '@cvent/planner-event-hubs-model/src/types';
import { differenceInCalendarMonths, format } from 'date-fns';
import { getCategory } from '@utils/analyticsUtil';
import { HubOverviewErrorCard } from '@components/hubOverview/HubOverviewErrorCard';
import { useAppFeatures } from '@components/AppFeaturesProvider';
import { utcToZonedTime } from 'date-fns-tz';

function HubOverViewLineChartCard({ children }: VideoAnalyticsCardProps): JSX.Element {
  return (
    <div style={{ margin: '0 1.5rem 1.5rem 1.5rem' }}>
      <CardContainer responsive>
        <div style={{ margin: '1rem', width: '100%' }}>
          <CardBody>{children}</CardBody>
        </div>
      </CardContainer>
    </div>
  );
}

function HubOverViewLineChartContainer({
  isLoadingData = false,
  currentViewsData,
  previousViewsData,
  currentViewDurationData,
  previousViewDurationData,
  currentRegistrationCountData,
  previousRegistrationCountData,
  error,
  tryAgain
}: Props) {
  const [selected, setSelected] = useState<string | number>(TOTAL_VIEWS_TAB_ORDER);
  const { translate } = useTranslate();
  const currentDataCategory = getCategory(
    currentViewsData[0]?.date,
    currentViewsData[currentViewsData.length - 1]?.date
  );
  const previousDataCategory = getCategory(
    previousViewsData[0]?.date,
    previousViewsData[previousViewsData.length - 1]?.date
  );
  const { renovateHubOverviewFeature } = useAppFeatures();

  const currentViewDurationCategory = getCategory(
    currentViewDurationData[0]?.date,
    currentViewDurationData[currentViewDurationData.length - 1]?.date
  );
  const previousViewDurationCategory = getCategory(
    previousViewDurationData[0]?.date,
    previousViewDurationData[previousViewDurationData.length - 1]?.date
  );

  const currentDataArray = currentViewsData.map(val => ({
    ...val,
    category: currentDataCategory
  }));
  const previousDataArray = previousViewsData.map(val => ({
    ...val,
    category: previousDataCategory
  }));

  const totalHubViewsDataArray = previousDataArray.concat(currentDataArray);
  const currentViewDurationDataArray = currentViewDurationData.map(data => ({
    ...data,
    category: currentViewDurationCategory
  }));
  const previousViewDurationDataArray = previousViewDurationData.map(data => ({
    ...data,
    category: previousViewDurationCategory
  }));
  const ViewDurationDataArray = previousViewDurationDataArray.concat(currentViewDurationDataArray);

  const earliestDate = new Date(currentViewsData[0]?.date);
  const latestDate = new Date(currentViewsData[currentViewsData.length - 1]?.date);
  const monthDifference = differenceInCalendarMonths(latestDate, earliestDate);

  const getDataPoints = dataPointsArray =>
    dataPointsArray.map(d => ({
      group:
        monthDifference < MONTHS_LIMIT_FOR_DATE_FORMAT
          ? format(utcToZonedTime(new Date(d.date), 'UTC'), 'MMM dd')
          : format(utcToZonedTime(new Date(d.date), 'UTC'), 'MMM'),
      category: d.category,
      value: d.value
    }));

  const dataPoints = totalHubViewsDataArray && getDataPoints(totalHubViewsDataArray);
  const currentRegistrationCountCategory = getCategory(
    currentRegistrationCountData[0]?.date,
    currentRegistrationCountData[currentRegistrationCountData.length - 1]?.date
  );
  const previousRegistrationCountCategory = getCategory(
    previousRegistrationCountData[0]?.date,
    previousRegistrationCountData[previousRegistrationCountData.length - 1]?.date
  );

  const currentRegistrationCountArray = currentRegistrationCountData.map(val => ({
    ...val,
    category: currentRegistrationCountCategory
  }));
  const previousRegistrationCountArray = previousRegistrationCountData.map(val => ({
    ...val,
    category: previousRegistrationCountCategory
  }));
  const registrationCountDataArray = previousRegistrationCountArray.concat(currentRegistrationCountArray);

  const registrationCountDataPoints = registrationCountDataArray && getDataPoints(registrationCountDataArray);
  const ViewDurationDataPoints = ViewDurationDataArray && getDataPoints(ViewDurationDataArray);

  const displayLineCharts = (
    <Row>
      <Col>
        <div {...injectTestId('line-charts-container')}>
          <TabsContextProvider value={selected}>
            <div style={{ paddingBottom: '2rem' }}>
              <Tabs
                onUpdate={setSelected}
                equalWidthTabs
                css={{ paddingBottom: '2rem' }}
                options={[
                  {
                    label: translate('hub_overview_total_view_graph_tab'),
                    value: TOTAL_VIEWS_TAB_ORDER,
                    testID: 'total-views-tab-header'
                  },
                  {
                    label: translate('hub_overview_total_registration_graph_tab'),
                    value: TOTAL_REGISTRATION_TAB_ORDER,
                    testID: 'total-registrations-tab-header'
                  },
                  {
                    label: translate('hub_overview_average_duration_graph_tab'),
                    value: AVERAGE_DURATION_TAB_ORDER,
                    testID: 'average-duration-tab-header'
                  }
                ]}
              />
            </div>
            <TabsPanel value="1">
              {error.prevTotalViewsError || error.totalViewsError ? (
                <HubOverviewErrorCard testId="total-view-line-graph-error" tryAgain={tryAgain} />
              ) : (
                <HubOverViewLineChart
                  data={dataPoints}
                  category="total-view"
                  yAxisLabel={translate('hub_overview_total_view_graph_y_axis_label')}
                  isLoadingData={isLoadingData}
                />
              )}
            </TabsPanel>
            <TabsPanel value="2">
              {error.prevRegistrationCountError || error.registrationCountError ? (
                <HubOverviewErrorCard testId="total-registration-line-graph-error" tryAgain={tryAgain} />
              ) : (
                <HubOverViewLineChart
                  data={registrationCountDataPoints}
                  category="total-registration"
                  yAxisLabel={translate('hub_overview_total_registration_graph_y_axis_label')}
                  isLoadingData={isLoadingData}
                />
              )}
            </TabsPanel>
            <TabsPanel value="3">
              {error.viewDurationError || error.prevViewDurationError ? (
                <HubOverviewErrorCard testId="view-duration-line-graph-error" tryAgain={tryAgain} />
              ) : (
                <HubOverViewLineChart
                  data={ViewDurationDataPoints}
                  category="average-duration"
                  yAxisLabel={translate('hub_overview_average_duration_graph_y_axis_label')}
                  isLoadingData={isLoadingData}
                />
              )}
            </TabsPanel>
          </TabsContextProvider>
        </div>
      </Col>
    </Row>
  );
  return renovateHubOverviewFeature ? (
    displayLineCharts
  ) : (
    <HubOverViewLineChartCard>{displayLineCharts}</HubOverViewLineChartCard>
  );
}

interface VideoAnalyticsCardProps {
  children: JSX.Element;
}

interface Props {
  isLoadingData?: boolean;
  currentViewsData: AnalyticsDataItem[];
  previousViewsData: AnalyticsDataItem[];
  currentViewDurationData: AnalyticsDataItem[];
  previousViewDurationData: AnalyticsDataItem[];
  currentRegistrationCountData: AnalyticsDataItem[];
  previousRegistrationCountData: AnalyticsDataItem[];
  error?: Record<string, boolean>;
  tryAgain?: () => void;
}

export default HubOverViewLineChartContainer;

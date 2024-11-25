// MAUVE
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Row } from '@cvent/carina/components/Row';
import { Col } from '@cvent/carina/components/Col';
import { CardBody, CardContainer } from '@cvent/carina/components/Card';
import { injectTestId } from '@cvent/nucleus-test-automation';
import { useTranslate } from 'nucleus-text';
import useBreakpoints from '@hooks/useBreakpoints';
import { useStyle } from '@hooks/useStyle';
import { HubOverviewStyle } from '@components/hubOverview/style';
import { LoadingSpinner } from '@cvent/carina/components/LoadingSpinner';
import React from 'react';
import { HubOverviewErrorCard } from '@components/hubOverview/HubOverviewErrorCard';
import { Dropdown } from '@cvent/carina/components/Dropdown';
import PieChart from '@components/hubOverview/PieChart';

function HubOverViewPieChartCard({ children }: VideoAnalyticsCardProps): JSX.Element {
  const { isMobileOrTablet } = useBreakpoints();
  return (
    <div style={{ margin: '0 1.5rem 1.5rem 1.5rem', width: isMobileOrTablet ? 'auto' : '50%', display: 'flex' }}>
      <CardContainer responsive>
        <div style={{ margin: '1.5rem 1.25rem', width: '100%' }}>
          <CardBody>{children}</CardBody>
        </div>
      </CardContainer>
    </div>
  );
}
function NewPieChartContainer({
  isLoadingData,
  pieChartData,
  error,
  tryAgain,
  dateRangeOptions,
  selectedDateRange,
  setSelectedDateRange,
  handleDateSelection,
  totalViews
}: Props) {
  const { translate } = useTranslate();
  const styles = useStyle(HubOverviewStyle);
  const pieChartProps: any = {
    autoSize: true,
    data: pieChartData,
    isRtl: true,
    name: 'hub-overview-pie-chart',
    legendPosition: 'right',
    legendOrientation: 'vertical',
    initializationMode: 'reinitialize',
    Divider: '3rem',
    showLegend: true,
    formatPieLabels: (value, ratio) => `${Math.round(ratio * 100)}%`,
    formatTooltipValue: (value, ratio) => `${value}/${totalViews} (${Math.round(ratio * 100)}%)`,
    options: {
      padding: {
        bottom: 2,
        left: 4,
        right: 50,
        top: 0
      },
      barSpace: 80
    }
  };
  return (
    <HubOverViewPieChartCard>
      <Row>
        <Col>
          {error ? (
            <HubOverviewErrorCard testId="pie-chart-error" tryAgain={tryAgain} />
          ) : (
            <div css={{ minHeight: '18rem' }} {...injectTestId('pie-chart-container')}>
              <div css={styles.pieChartHeaderContainer}>
                <div css={styles.totalViewByDeviceTextStyle}>{translate('hub_overview_pie_chart_card_heading')}</div>
                <div
                  css={{
                    marginTop: '-0.5rem',
                    width: selectedDateRange.value === 'custom_date_range' ? '15.5rem' : '10.333rem'
                  }}
                >
                  <Dropdown
                    id="pie-chart-date-range-dropdown"
                    labelText={translate('hub_overview_date_range_dropdown_label')}
                    onUpdate={value => {
                      setSelectedDateRange({ value });
                      handleDateSelection(value);
                    }}
                    options={dateRangeOptions}
                    selected={selectedDateRange}
                    variant="outline"
                    testID="pie-chart-date-range-dropdown"
                  />
                </div>
              </div>
              {isLoadingData ? (
                <LoadingSpinner
                  size="m"
                  testID="loading-overview-pie-chart-spinner"
                  id="loading-overview-pie-chart-spinner"
                  aria-label={translate('hub_overview_loading_text')}
                />
              ) : (
                <PieChart pieChartProps={pieChartProps} totalViews={totalViews} />
              )}
            </div>
          )}
        </Col>
      </Row>
    </HubOverViewPieChartCard>
  );
}

interface VideoAnalyticsCardProps {
  children: JSX.Element;
}
interface Props {
  isLoadingData?: boolean;
  pieChartData: any;
  error?: boolean;
  tryAgain?: () => void;
  dateRangeOptions: { label: string; value: string }[];
  selectedDateRange: { value: string };
  setSelectedDateRange: (dateRange) => void;
  handleDateSelection: (value) => void;
  totalViews: number;
}
export interface PieChartProps {
  totalViews: number;
  pieChartProps: any;
}

export default NewPieChartContainer;

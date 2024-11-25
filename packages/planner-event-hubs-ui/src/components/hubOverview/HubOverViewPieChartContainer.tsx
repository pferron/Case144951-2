// MAUVE
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Row } from '@cvent/carina/components/Row';
import { Col } from '@cvent/carina/components/Col';
import { CardBody, CardContainer } from '@cvent/carina/components/Card';
import { injectTestId } from '@cvent/nucleus-test-automation';
import dynamic from 'next/dynamic';
import { useTranslate } from 'nucleus-text';
import { DESKTOP_DEVICE_TYPE, DEVICE_TYPE, MOBILE_DEVICE_TYPE, TABLET_DEVICE_TYPE } from '@utils/constants';
import useBreakpoints from '@hooks/useBreakpoints';
import { useStyle } from '@hooks/useStyle';
import { HubOverviewStyle } from '@components/hubOverview/style';
import { ViewsBySourceResponse } from '@cvent/planner-event-hubs-model/types';
import { LoadingSpinner } from '@cvent/carina/components/LoadingSpinner';
import React from 'react';
import { HubOverviewErrorCard } from '@components/hubOverview/HubOverviewErrorCard';

const PieChartComponent = dynamic(() => import('@cvent/carina-charts-pie') as any, {
  ssr: false
});

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

interface Props {
  isLoadingData?: boolean;
  viewsByDeviceTypeData: ViewsBySourceResponse;
  error?: boolean;
  tryAgain?: () => void;
}

interface PieChartProps {
  totalViews: number;
  pieChartProps: any;
}

function PieChart({ totalViews, pieChartProps }: PieChartProps): JSX.Element {
  const styles = useStyle(HubOverviewStyle);

  if (totalViews === 0) return <div css={styles.emptyStateStyle}>--</div>; // empty state

  return (
    <div css={styles.pieChartComponentStyles}>
      <PieChartComponent {...pieChartProps} />
    </div>
  );
}

function HubOverViewPieChartContainer({ isLoadingData, viewsByDeviceTypeData, error, tryAgain }: Props) {
  const { translate } = useTranslate();
  const styles = useStyle(HubOverviewStyle);
  const pieChartData = [
    {
      value: viewsByDeviceTypeData?.desktopViews || 0,
      group: DEVICE_TYPE,
      category: DESKTOP_DEVICE_TYPE
    },
    {
      value: viewsByDeviceTypeData?.tabletViews || 0,
      group: DEVICE_TYPE,
      category: TABLET_DEVICE_TYPE
    },
    {
      value: viewsByDeviceTypeData?.mobileViews || 0,
      group: DEVICE_TYPE,
      category: MOBILE_DEVICE_TYPE
    }
  ];
  const totalViews = viewsByDeviceTypeData?.totalViews || 0;
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
    formatTooltipValue: value => `${value}/${totalViews}`,
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
            <div {...injectTestId('pie-chart-container')}>
              <div css={styles.totalViewByDeviceTextStyle}>{translate('hub_overview_pie_chart_heading')}</div>

              {isLoadingData ? (
                <LoadingSpinner
                  size="m"
                  testID="loading-overview-pie-chart-spinner"
                  aria-label={translate('hub_overview_loading_text')}
                  id="loading-overview-pie-chart-spinner"
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

export default HubOverViewPieChartContainer;

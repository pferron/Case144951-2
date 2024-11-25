// MAUVE
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo } from 'react';
import { injectTestId } from '@cvent/nucleus-test-automation';
import dynamic from 'next/dynamic';
import { getYAxisTickValues } from '@utils/analyticsUtil';
import { LoadingSpinner } from '@cvent/carina/components/LoadingSpinner';
import { useAppFeatures } from '@components/AppFeaturesProvider';
import { useTranslate } from 'nucleus-text';

const Line = dynamic(() => import('@cvent/carina-charts-line') as any, {
  ssr: false
});

export interface AnalyticsDataPoint {
  value: number;
  group: string;
  category: string;
}

interface HubOverViewLineChartProps {
  data: AnalyticsDataPoint[];
  category: string;
  yAxisLabel: string;
  isLoadingData?: boolean;
}

function HubOverViewLineChart({
  data,
  category,
  yAxisLabel,
  isLoadingData = false
}: HubOverViewLineChartProps): JSX.Element {
  const { translate } = useTranslate();
  const yAxisTickValues = useMemo(() => getYAxisTickValues(data), [data]);
  const { renovateHubOverviewFeature } = useAppFeatures();

  const lineChartProps: any = {
    name: 'hub-overview-line-graph',
    data,
    showLegend: true,
    legendOrientation: 'vertical',
    legendPosition: 'right',
    groupMode: 'show',
    lineStyles: 'default',
    markerStyles: 'circle',
    tooltip: 'consolidated',
    options: {
      padding: {
        left: renovateHubOverviewFeature ? 50 : 100
      }
    },
    yAxisTickValues: yAxisTickValues ?? [0, 2000, 4500, 6000, 8000, 10000],
    yAxisLabel
  };

  return (
    <div {...injectTestId(`hub-overview-${category}-graph`)}>
      {isLoadingData ? (
        <LoadingSpinner
          size="m"
          aria-label={translate('hub_overview_loading_text')}
          id={`hub-overview-${category}-loading-spinner`}
        />
      ) : (
        <Line {...lineChartProps} />
      )}
    </div>
  );
}
export default React.memo(HubOverViewLineChart);

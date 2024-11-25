// MAUVE
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useStyle } from '@hooks/useStyle';
import { HubOverviewStyle } from '@components/hubOverview/style';
import React from 'react';
import dynamic from 'next/dynamic';
import { PieChartProps } from '@components/hubOverview/NewPieChartContainer';

const PieChartComponent = dynamic(() => import('@cvent/carina-charts-pie') as any, {
  ssr: false
});
function PieChart({ totalViews, pieChartProps }: PieChartProps): JSX.Element {
  const styles = useStyle(HubOverviewStyle);
  if (totalViews === 0) return <div css={styles.emptyStateStyle}>--</div>; // empty state
  return (
    <div css={styles.pieChartComponentStyles}>
      <PieChartComponent {...pieChartProps} />
    </div>
  );
}
export default PieChart;

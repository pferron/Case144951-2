import React from 'react';
import { StatusLabel } from '@cvent/carina/components/StatusLabel';
import { useTranslate } from 'nucleus-text';

interface Props {
  isActive: boolean;
  activeLabelTextKey?: string;
  inactiveLabelTextKey?: string;
}
function StatusText({
  isActive,
  activeLabelTextKey = 'channel_status_active',
  inactiveLabelTextKey = 'channel_status_inactive'
}: Props): JSX.Element {
  const { translate } = useTranslate();
  return isActive ? (
    <StatusLabel variant="positive">{translate(activeLabelTextKey)}</StatusLabel>
  ) : (
    <StatusLabel variant="neutral">{translate(inactiveLabelTextKey)}</StatusLabel>
  );
}
export default StatusText;

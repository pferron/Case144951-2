import React, { useState } from 'react';
import { useTranslate } from 'nucleus-text';
import { Row } from '@cvent/carina/components/Row';
import { Col } from '@cvent/carina/components/Col';
import { injectTestId } from '@cvent/nucleus-test-automation';
import { httpLogPageLoadId } from '@cvent/nucleus-networking/lib';

interface ErrorContentProps {
  requestId?: string;
  testID?: string;
}
interface RowProps {
  title: string;
  value: string;
  testID?: string;
}

export function ErrorInfoRow({ title, value, testID }: RowProps): JSX.Element {
  return (
    <>
      <h2 {...injectTestId(testID)}>{title}</h2>
      <span {...injectTestId(`${testID}-value`)}>{value}</span>
    </>
  );
}

function ErrorContent({ requestId, testID }: ErrorContentProps): JSX.Element {
  const [time] = useState(new Date());
  const { date } = useTranslate();
  const { translate } = useTranslate();
  return (
    <div {...injectTestId(testID)}>
      <div>
        <Row justifyContent="center">
          <Col width="fill" padding={{ top: 8, end: 0, start: 0 }}>
            {requestId && (
              <ErrorInfoRow title={translate('error_heading')} value={requestId} testID={`${testID}-requestId`} />
            )}
            <ErrorInfoRow
              title={translate('unexpected_error_page_load_id')}
              value={httpLogPageLoadId}
              testID={`${testID}-pageLoadId`}
            />
            <ErrorInfoRow
              title={translate('error_time_title')}
              value={date(time, {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                timeZoneName: 'short'
              })}
              testID={`${testID}-time`}
            />
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default ErrorContent;

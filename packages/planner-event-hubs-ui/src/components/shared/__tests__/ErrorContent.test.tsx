import React from 'react';
import { render, screen } from '@testing-library/react';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import ErrorContent, { ErrorInfoRow } from '../ErrorContent';

jest.mock('@cvent/nucleus-networking', () => {
  return { httpLogPageLoadId: 'my-page-load-id' };
});

describe('ErrorState', () => {
  const testID = 'default-test-id';
  const testReqId = '123';

  it('Renders error content', async () => {
    render(
      <TestWrapper>
        <ErrorContent requestId={testReqId} testID={testID} />
      </TestWrapper>
    );

    expect(screen.getByTestId(testID)).toBeInTheDocument();
    expect(screen.getByText('123')).toBeInTheDocument();
    expect(screen.getByTestId(`${testID}-requestId`)).toBeInTheDocument();
    expect(screen.getByTestId(`${testID}-pageLoadId`)).toBeInTheDocument();
  });

  it('Renders error content with no fields', async () => {
    render(
      <TestWrapper>
        <ErrorContent testID={testID} />
      </TestWrapper>
    );

    const errorReqId = screen.queryByText('Instance ID');
    expect(errorReqId).not.toBeInTheDocument();
    const errorPageId = screen.queryByTestId(`${testID}-pageLoadId`);
    expect(errorPageId).toBeInTheDocument();
  });
});

describe('ErrorInfoRow', () => {
  const testID = 'instance-id';

  it('Renders error info row', async () => {
    render(
      <TestWrapper>
        <ErrorInfoRow title="Instance ID" value="12345" testID={testID} />
      </TestWrapper>
    );
    expect(screen.getByTestId(testID)).toBeInTheDocument();
    expect(screen.getByText('Instance ID')).toBeInTheDocument();
    expect(screen.getByText('12345')).toBeInTheDocument();
  });
});

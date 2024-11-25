import React from 'react';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import { render, fireEvent, screen } from '@testing-library/react';
import CodeSnippetsTable from '@components/tracking-codes/CodeSnippetsTable';
import { accountCodeSnippet } from '@components/tracking-codes/fixtures/CodeSnippetData';
import 'jest-axe/extend-expect';

describe('CodeSnippetsTable', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockFn = jest.fn();

  it('Renders CodeSnippets Table with headers', async () => {
    const { baseElement } = render(
      <TestWrapper>
        <CodeSnippetsTable dataList={[]} selected={null} setSelected={mockFn} />
      </TestWrapper>
    );

    expect(baseElement).toMatchSnapshot();
    expect(await screen.findByText('Name')).toBeInTheDocument();
    expect(await screen.findByText('Data Tag Code')).toBeInTheDocument();
    expect(await screen.findByText('Status')).toBeInTheDocument();
    expect(await screen.findByText('Visitors can turn off')).toBeInTheDocument();
    // HUB-151797
    // expect(await axe(baseElement)).toHaveNoViolations();
  });

  it('Renders CodeSnippets Table with data', async () => {
    const { baseElement } = render(
      <TestWrapper>
        <CodeSnippetsTable dataList={accountCodeSnippet} selected={null} setSelected={mockFn} />
      </TestWrapper>
    );

    expect(baseElement).toMatchSnapshot();
    expect(await screen.findByText('TEST')).toBeInTheDocument();
    expect(await screen.findByText('Test-code-snippet')).toBeInTheDocument();
    expect(await screen.findByText('TEST2')).toBeInTheDocument();
    expect(await screen.findByText('Marketo2')).toBeInTheDocument();
    // HUB-151797
    // expect(await axe(baseElement)).toHaveNoViolations();
  });

  it('CodeSnippets on select', async () => {
    render(
      <TestWrapper>
        <CodeSnippetsTable dataList={accountCodeSnippet} selected={null} setSelected={mockFn} />
      </TestWrapper>
    );

    const element = await screen.findByText('Test-code-snippet');
    fireEvent.click(element);
    expect(mockFn).toHaveBeenCalledWith('Test-code-snippet-id');
    // HUB-151797
    // expect(await axe(baseElement)).toHaveNoViolations();
  });
});

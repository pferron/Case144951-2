import React from 'react';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import { render, screen } from '@testing-library/react';
import SelectCodeSnippetsModal from '@components/tracking-codes/SelectCodeSnippetsModal';
import { MockedProvider } from '@apollo/client/testing';
import { accountCodeSnippet } from '@components/tracking-codes/fixtures/CodeSnippetData';
import { ApplicableOn } from '@cvent/planner-event-hubs-model/types';
import 'jest-axe/extend-expect';

const setModalOpen = jest.fn();
const onSave = jest.fn();
const mockfn = jest.fn();

const configureSnippetSetting = {
  codeSnippetId: 'Test-code-snippet-id',
  addToAllPages: true,
  addToLoginPage: true,
  addToSingleVideoPage: false,
  applicableOn: ApplicableOn.Initialization
};

describe('SelectCodeSnippetModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Renders SelectCodeSnippets Modal', async () => {
    const { baseElement } = render(
      <MockedProvider>
        <TestWrapper>
          <SelectCodeSnippetsModal
            isOpen
            setIsModalOpen={setModalOpen}
            codeSnippetList={accountCodeSnippet}
            testId="test-select-code-snippet-modal"
            onSave={onSave}
            setConfigureSnippetSetting={mockfn}
            configureSnippetSetting={configureSnippetSetting}
          />
        </TestWrapper>
      </MockedProvider>
    );
    expect(baseElement).toMatchSnapshot();
    expect(await screen.findByTestId('test-select-code-snippet-modal')).toBeInTheDocument();
    // cross button without a button text
    expect(await screen.findByTestId('test-select-code-snippet-modal-cross-button')).toBeInTheDocument();
    expect(await screen.findByRole('button', { name: 'Next' })).toBeInTheDocument();
    expect(await screen.findByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    // HUB-151797
    // expect(await axe(baseElement)).toHaveNoViolations();
  });

  it('Renders SelectCodeSnippets Modal with table headers', async () => {
    const { baseElement } = render(
      <MockedProvider>
        <TestWrapper>
          <SelectCodeSnippetsModal
            isOpen
            setIsModalOpen={setModalOpen}
            codeSnippetList={accountCodeSnippet}
            testId="test-select-code-snippet-modal"
            onSave={onSave}
            setConfigureSnippetSetting={mockfn}
            configureSnippetSetting={configureSnippetSetting}
          />
        </TestWrapper>
      </MockedProvider>
    );
    expect(baseElement).toMatchSnapshot();
    expect(await screen.findByText('Name')).toBeInTheDocument();
    expect(await screen.findByText('Data Tag Code')).toBeInTheDocument();
    expect(await screen.findByText('Status')).toBeInTheDocument();
    expect(await screen.findByText('Visitors can turn off')).toBeInTheDocument();
    // HUB-151797
    // expect(await axe(baseElement)).toHaveNoViolations();
  });

  it('Renders SelectCodeSnippets Modal with data', async () => {
    const { baseElement } = render(
      <MockedProvider>
        <TestWrapper>
          <SelectCodeSnippetsModal
            isOpen
            setIsModalOpen={setModalOpen}
            testId="test-select-code-snippet-modal"
            codeSnippetList={accountCodeSnippet}
            onSave={onSave}
            setConfigureSnippetSetting={mockfn}
            configureSnippetSetting={configureSnippetSetting}
          />
        </TestWrapper>
      </MockedProvider>
    );
    await new Promise(resolve => {
      setTimeout(resolve, 0);
    });
    expect(baseElement).toMatchSnapshot();
    expect(await screen.findByText('TEST')).toBeInTheDocument();
    expect(await screen.findByText('Test-code-snippet')).toBeInTheDocument();
    expect(await screen.findByText('TEST2')).toBeInTheDocument();
    expect(await screen.findByText('Marketo2')).toBeInTheDocument();
    // HUB-151797
    // expect(await axe(baseElement)).toHaveNoViolations();
  });
});

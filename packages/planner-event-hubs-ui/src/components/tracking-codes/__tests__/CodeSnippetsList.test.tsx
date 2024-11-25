import { fireEvent, render } from '@testing-library/react';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import React from 'react';
import CodeSnippetsList from '@components/tracking-codes/CodeSnippetsList';
import { screen } from 'nucleus-text/testing-library/screen';
import {
  accountCodeSnippet,
  codeSnippets,
  codeSnippetsDataList
} from '@components/tracking-codes/fixtures/CodeSnippetData';
import { updateCodeSnippet } from '@cvent/planner-event-hubs-model/operations/trackingCodes';
import { MockedProvider } from '@apollo/client/testing';
import 'jest-axe/extend-expect';

const mockfn = jest.fn();

const appFeatures = [
  {
    name: 'videoCenterInformationFeature',
    enabled: false,
    experimentVersion: '1001'
  }
];

const mocks = [
  {
    request: {
      query: updateCodeSnippet,
      variables: {
        input: {
          hubId: 'test-hub-id',
          codeSnippetId: 'Test-code-snippet-id',
          applicableOn: 'INITIALIZATION',
          addToAllPages: true,
          addToLoginPage: true,
          addToSingleVideoPage: true
        }
      }
    },
    result: {
      data: {
        updateCodeSnippet: {
          codeSnippetId: 'Test-code-snippet-id',
          applicableOn: 'INITIALIZATION',
          addToAllPages: true,
          addToLoginPage: true,
          addToSingleVideoPage: true
        }
      }
    }
  }
];

describe('Code Snippet list', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders code snippet list', async () => {
    render(
      <TestWrapper>
        <MockedProvider>
          <CodeSnippetsList
            dataList={codeSnippetsDataList}
            accountCodeSnippets={accountCodeSnippet}
            codeSnippets={codeSnippets}
            onSave={mockfn}
            onUpdate={mockfn}
            onNext={mockfn}
            onPrevious={mockfn}
            isNext={false}
            isPrevious={false}
            onRemove={mockfn}
            editCodeSnippet
            setEditCodeSnippet={mockfn}
            cardDisabled={false}
          />
        </MockedProvider>
      </TestWrapper>
    );
    expect(await screen.findByTextKey('add_code_snippets_text')).toBeInTheDocument();
    const addSnippetButton = await screen.findByRole('button', { key: 'add_code_snippets_button_label' });
    expect(addSnippetButton).toBeInTheDocument();
    expect(addSnippetButton).toBeEnabled();
    // HUB-151797
    // expect(await axe(container)).toHaveNoViolations();
  });

  it('renders code snippet list with disabled add code snippet button', async () => {
    render(
      <TestWrapper>
        <MockedProvider>
          <CodeSnippetsList
            dataList={[]}
            accountCodeSnippets={[]}
            codeSnippets={codeSnippets}
            onSave={mockfn}
            onUpdate={mockfn}
            onNext={mockfn}
            onPrevious={mockfn}
            isNext={false}
            isPrevious={false}
            onRemove={mockfn}
            editCodeSnippet
            setEditCodeSnippet={mockfn}
            cardDisabled={false}
          />
        </MockedProvider>
      </TestWrapper>
    );
    expect(await screen.findByTextKey('add_code_snippets_text')).toBeInTheDocument();
    const addSnippetButton = await screen.findByRole('button', { key: 'add_code_snippets_button_label' });
    expect(addSnippetButton).toBeInTheDocument();
    expect(addSnippetButton).toBeDisabled();
    // HUB-151797
    // expect(await axe(container)).toHaveNoViolations();
  });

  it('renders view code snippet modal on code snippet name click', async () => {
    render(
      <TestWrapper>
        <MockedProvider mocks={mocks}>
          <CodeSnippetsList
            dataList={codeSnippetsDataList}
            accountCodeSnippets={accountCodeSnippet}
            codeSnippets={codeSnippets}
            onSave={mockfn}
            onUpdate={mockfn}
            onNext={mockfn}
            onPrevious={mockfn}
            isNext={false}
            isPrevious={false}
            editCodeSnippet={false}
            setEditCodeSnippet={mockfn}
            cardDisabled={false}
            onRemove={mockfn}
          />
        </MockedProvider>
      </TestWrapper>
    );
    expect(await screen.findByTextKey('add_code_snippets_text')).toBeInTheDocument();
    const codeSnippetName = await screen.findByText('Test-code-snippet');
    expect(codeSnippetName).toBeInTheDocument();
    fireEvent.click(codeSnippetName);
    expect(await screen.findByTestId('view-code-snippet-modal')).toBeInTheDocument();

    const codeSnippetModalCancelButton = await screen.findByRole('button', { key: 'view_code_snippet_close_button' });
    expect(codeSnippetModalCancelButton).toBeInTheDocument();
    fireEvent.click(codeSnippetModalCancelButton);
    await new Promise(resolve => {
      setTimeout(resolve, 100);
    });
    fireEvent.keyPress(await screen.findByText('Test-code-snippet'), { key: 'Enter', code: 'Enter', charCode: 13 });
    expect(await screen.findByTestId('view-code-snippet-modal')).toBeInTheDocument();
    // HUB-151797
    // expect(await axe(container)).toHaveNoViolations();
  });

  it('renders edit code snippet modal on code snippet edit button click', async () => {
    render(
      <TestWrapper>
        <MockedProvider mocks={mocks}>
          <CodeSnippetsList
            dataList={codeSnippetsDataList}
            accountCodeSnippets={accountCodeSnippet}
            codeSnippets={codeSnippets}
            onSave={mockfn}
            onUpdate={mockfn}
            onNext={mockfn}
            onPrevious={mockfn}
            isNext={false}
            isPrevious={false}
            editCodeSnippet={false}
            setEditCodeSnippet={mockfn}
            cardDisabled={false}
            onRemove={mockfn}
          />
        </MockedProvider>
      </TestWrapper>
    );
    expect(await screen.findByTextKey('add_code_snippets_text')).toBeInTheDocument();
    const codeSnippetName = await screen.findByText('Test-code-snippet');
    expect(codeSnippetName).toBeInTheDocument();
    fireEvent.click(codeSnippetName);
    await new Promise(resolve => {
      setTimeout(resolve, 100);
    });
    expect(await screen.findByTestId('view-code-snippet-modal')).toBeInTheDocument();

    const editButton = await screen.findByRole('button', {
      key: 'edit_code_snippet_button_text'
    });
    expect(editButton).toBeInTheDocument();
    fireEvent.click(editButton);
    expect(await screen.findByTextKey('tracking_code_configure_code_snippet_modal_title')).toBeInTheDocument();
    expect(await screen.findByTestId('snippet-settings-modal')).toBeInTheDocument();
    const editSnippetDoneButton = await screen.findByRole('button', {
      key: 'tracking_code_configure_code_snippet_done_button'
    });
    expect(editSnippetDoneButton).toBeInTheDocument();
    // HUB-151797
    // expect(await axe(container)).toHaveNoViolations();
  });

  it('renders code snippet list edit', async () => {
    render(
      <TestWrapper>
        <MockedProvider mocks={mocks}>
          <CodeSnippetsList
            dataList={codeSnippetsDataList}
            accountCodeSnippets={accountCodeSnippet}
            codeSnippets={codeSnippets}
            onSave={mockfn}
            onUpdate={mockfn}
            onNext={mockfn}
            onPrevious={mockfn}
            isNext={false}
            isPrevious={false}
            editCodeSnippet={false}
            setEditCodeSnippet={mockfn}
            cardDisabled={false}
            onRemove={mockfn}
          />
        </MockedProvider>
      </TestWrapper>
    );
    expect(await screen.findByTextKey('add_code_snippets_text')).toBeInTheDocument();
    const snippetActionButton = await screen.findByRole('button', { name: /Row actions/i });
    expect(snippetActionButton).toBeInTheDocument();
    fireEvent.click(snippetActionButton);
    const snippetEditActionButton = await screen.findByRole('menuitem', { key: 'edit_code_snippet_button_text' });
    expect(snippetEditActionButton).toBeInTheDocument();
    fireEvent.click(snippetEditActionButton);
    expect(await screen.findByTextKey('tracking_code_configure_code_snippet_modal_title')).toBeInTheDocument();
    expect(await screen.findByTestId('snippet-settings-modal')).toBeInTheDocument();
    // HUB-151797
    // expect(await axe(container)).toHaveNoViolations();
  });

  it('renders disabled code snippet card', async () => {
    render(
      <TestWrapper appFeatures={appFeatures}>
        <MockedProvider mocks={mocks}>
          <CodeSnippetsList
            dataList={codeSnippetsDataList}
            accountCodeSnippets={accountCodeSnippet}
            codeSnippets={codeSnippets}
            onSave={mockfn}
            onUpdate={mockfn}
            onNext={mockfn}
            onPrevious={mockfn}
            isNext={false}
            isPrevious={false}
            editCodeSnippet={false}
            setEditCodeSnippet={mockfn}
            onRemove={mockfn}
            cardDisabled
          />
        </MockedProvider>
      </TestWrapper>
    );
    expect(await screen.findByTextKey('add_code_snippets_text')).toBeInTheDocument();
    const codeSnippetsEditButton = await screen.findByTestId('code-snippets-edit-button');
    expect(codeSnippetsEditButton).toBeInTheDocument();
    expect(codeSnippetsEditButton).toBeDisabled();
    // HUB-151797
    // expect(await axe(container)).toHaveNoViolations();
  });

  it('renders code snippet list and deletes a snippet', async () => {
    render(
      <TestWrapper>
        <MockedProvider mocks={mocks}>
          <CodeSnippetsList
            dataList={codeSnippetsDataList}
            accountCodeSnippets={accountCodeSnippet}
            codeSnippets={codeSnippets}
            onSave={mockfn}
            onUpdate={mockfn}
            onNext={mockfn}
            onPrevious={mockfn}
            isNext={false}
            isPrevious={false}
            onRemove={mockfn}
            editCodeSnippet={false}
            setEditCodeSnippet={mockfn}
            cardDisabled={false}
          />
        </MockedProvider>
      </TestWrapper>
    );
    expect(await screen.findByText('Code Snippets')).toBeInTheDocument();
    const snippetActionButton = await screen.findByRole('button', { name: /Row actions/i });
    expect(snippetActionButton).toBeInTheDocument();
    fireEvent.click(snippetActionButton);
    const snippetDeleteActionButton = await screen.findByRole('menuitem', { name: /Delete/i });
    expect(snippetDeleteActionButton).toBeInTheDocument();
    fireEvent.click(snippetDeleteActionButton);
    expect(await screen.findByRole('button', { name: 'Delete' })).toBeInTheDocument();
    expect(await screen.findByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    expect(await screen.findByText('Delete code snippet?')).toBeInTheDocument();
    expect(await screen.findByText('This code snippet will be removed from this hub.')).toBeInTheDocument();
    // HUB-151797
    // expect(await axe(container)).toHaveNoViolations();
  });
});

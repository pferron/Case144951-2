import { fireEvent, render } from '@testing-library/react';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import React from 'react';
import { screen } from 'nucleus-text/testing-library/screen';
import { codeSnippets } from '@components/tracking-codes/fixtures/CodeSnippetData';
import ViewCodeSnippetModal from '@components/tracking-codes/ViewCodeSnippetModal';
import 'jest-axe/extend-expect';
import { axe } from 'jest-axe';

const mockfn = jest.fn();

describe('View Code Snippet Modal', () => {
  it('renders Code Snippet Modal', async () => {
    const { container } = render(
      <TestWrapper>
        <ViewCodeSnippetModal
          codeSnippets={codeSnippets}
          codeSnippetId="Test-code-snippet-id"
          viewCodeSnippetModalOpen
          setViewCodeSnippetModalOpen={mockfn}
          testId="view-code-snippet-modal"
          setSnippetSettingsModalIsOpen={mockfn}
          setConfigureSnippetSetting={mockfn}
        />
      </TestWrapper>
    );
    expect(await screen.findByText('Test-code-snippet')).toBeInTheDocument();
    expect(await screen.findByTextKey('tracking_code_configure_code_snippet_all_pages_label')).toBeInTheDocument();
    const codeSnippetsEditButton = await screen.findByTestId('view-code-snippet-modal-edit-button');
    fireEvent.click(codeSnippetsEditButton);
    const editSnippetButton = await screen.findByRole('button', { key: 'view_code_snippet_edit_button' });
    expect(editSnippetButton).toBeInTheDocument();
    const cancelButton = await screen.findByRole('button', { key: 'view_code_snippet_close_button' });
    expect(cancelButton).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('On edit button snippet settings modal is opened', async () => {
    const { container } = render(
      <TestWrapper>
        <ViewCodeSnippetModal
          codeSnippets={codeSnippets}
          codeSnippetId="Test-code-snippet-id"
          viewCodeSnippetModalOpen
          setViewCodeSnippetModalOpen={mockfn}
          testId="view-code-snippet-modal"
          setSnippetSettingsModalIsOpen={mockfn}
          setConfigureSnippetSetting={mockfn}
        />
      </TestWrapper>
    );
    const editSnippetButton = await screen.findByRole('button', { name: /Edit/i });
    fireEvent.click(editSnippetButton);
    expect(mockfn).toHaveBeenCalledWith({
      addToAllPages: true,
      addToSingleVideoPage: true,
      applicableOn: 'INITIALIZATION',
      codeSnippetId: 'Test-code-snippet-id'
    });
    expect(mockfn).toHaveBeenCalledWith(true);
    expect(await axe(container)).toHaveNoViolations();
  });
});

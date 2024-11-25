import React from 'react';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import { render, fireEvent, waitFor } from '@testing-library/react';
import SnippetSettingsModal from '@components/tracking-codes/SnippetsSettingsModal';
import { ApplicableOn } from '@cvent/planner-event-hubs-model/types';
import { screen } from 'nucleus-text/testing-library/screen';
import 'jest-axe/extend-expect';
import { axe } from 'jest-axe';

describe('SnippetSettingsModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockFn = jest.fn();

  const configureSnippetSetting = {
    codeSnippetId: 'testSnippetId',
    addToAllPages: true,
    addToLoginPage: true,
    addToSingleVideoPage: false,
    applicableOn: ApplicableOn.Initialization
  };

  it('Renders SnippetSettingsModal Modal in default state', async () => {
    const { baseElement, container } = render(
      <TestWrapper>
        <SnippetSettingsModal
          isNewSnippetAdded={false}
          snippetSettingsModalIsOpen
          setSnippetSettingsModalIsOpen={mockFn}
          testId="test-snippet-settings-modal"
          codeSnippetName="Code-Snippet"
          selectedSnippet={null}
          setSelectCodeSnippetModelOpen={mockFn}
          onSave={mockFn}
          setConfigureSnippetSetting={mockFn}
          configureSnippetSetting={configureSnippetSetting}
        />
      </TestWrapper>
    );

    expect(baseElement).toMatchSnapshot();
    // cross button without a button text
    expect(await screen.findByTestId('test-snippet-settings-modal-cross-button')).toBeInTheDocument();
    expect(await screen.findByRole('button', { name: 'Done' })).toBeInTheDocument();
    expect(await screen.findByRole('button', { name: 'Cancel' })).toBeInTheDocument();

    expect(await screen.findByText('Code Snippet')).toBeInTheDocument();
    expect(screen.getByTextKey('tracking_code_configure_code_snippet_all_pages_label')).toBeInTheDocument();
    expect(screen.getByTextKey('view_code_snippet_add_to_all_pages_yes_text')).toBeInTheDocument();
    expect(screen.getByTextKey('view_code_snippet_add_to_all_pages_no_text')).toBeInTheDocument();

    // These options should not be visible in default state
    expect(screen.queryByText('Snippet type')).not.toBeInTheDocument();
    expect(screen.queryByText('Track on launch')).not.toBeInTheDocument();
    expect(screen.queryByText('Always track')).not.toBeInTheDocument();

    expect(await axe(container)).toHaveNoViolations();
  });

  it('Renders SnippetSettingsModal Modal with passed in Code snippet Name', async () => {
    const { baseElement } = render(
      <TestWrapper>
        <SnippetSettingsModal
          isNewSnippetAdded={false}
          snippetSettingsModalIsOpen
          setSnippetSettingsModalIsOpen={mockFn}
          testId="test-snippet-settings-modal"
          codeSnippetName="Test-code-snippet"
          selectedSnippet={null}
          setSelectCodeSnippetModelOpen={mockFn}
          onSave={mockFn}
          setConfigureSnippetSetting={mockFn}
          configureSnippetSetting={configureSnippetSetting}
        />
      </TestWrapper>
    );

    expect(baseElement).toMatchSnapshot();
    expect(await screen.findByRole('dialog', { name: 'Configure Settings' })).toBeInTheDocument();
    expect(await screen.findByText('Test-code-snippet')).toBeInTheDocument();
    // HUB-151797
    // expect(await axe(baseElement)).toHaveNoViolations();
  });

  it('Renders SnippetSettingsModal Modal with Snippet type when Add to login is yes', async () => {
    const { baseElement } = render(
      <TestWrapper>
        <SnippetSettingsModal
          isNewSnippetAdded={false}
          snippetSettingsModalIsOpen
          setSnippetSettingsModalIsOpen={mockFn}
          testId="test-snippet-settings-modal"
          codeSnippetName="Test-code-snippet"
          selectedSnippet={null}
          setSelectCodeSnippetModelOpen={mockFn}
          onSave={mockFn}
          setConfigureSnippetSetting={mockFn}
          configureSnippetSetting={configureSnippetSetting}
        />
      </TestWrapper>
    );

    expect(baseElement).toMatchSnapshot();

    const addToAllPages = await screen.findByTestId('where_does_it_run-radio__div__1');
    fireEvent.click(addToAllPages);

    // These options should be visible and clickable now
    const snippetTypeRadio = await screen.findByTestId('snippet-type-radio__INITIALIZATION');
    fireEvent.click(snippetTypeRadio);
    await waitFor(() => {
      expect(screen.getByTextKey('tracking_code_configure_code_snippet_add_snippet_type_label')).toBeInTheDocument();
    });
    expect(
      screen.getByTextKey('tracking_code_configure_code_snippet_add_snippet_type_track_on_launch_label')
    ).toBeInTheDocument();
    expect(
      screen.getByTextKey('tracking_code_configure_code_snippet_add_snippet_type_track_all_launch_label')
    ).toBeInTheDocument();
    // HUB-151797
    // expect(await axe(baseElement)).toHaveNoViolations();
  });

  it('SnippetSettings Modal on dismiss', async () => {
    const { container } = render(
      <TestWrapper>
        <SnippetSettingsModal
          isNewSnippetAdded={false}
          snippetSettingsModalIsOpen
          setSnippetSettingsModalIsOpen={mockFn}
          testId="test-snippet-settings-modal"
          codeSnippetName="Test-code-snippet"
          selectedSnippet={null}
          setSelectCodeSnippetModelOpen={mockFn}
          onSave={mockFn}
          setConfigureSnippetSetting={mockFn}
          configureSnippetSetting={configureSnippetSetting}
        />
      </TestWrapper>
    );

    await waitFor(
      async () => {
        expect(await screen.findByTestId('test-snippet-settings-modal-cross-button')).toBeInTheDocument();
      },
      {
        timeout: 5000,
        interval: 100
      }
    );

    const dismissButton = await screen.findByTestId('test-snippet-settings-modal-cross-button');
    fireEvent.click(dismissButton);

    await waitFor(
      async () => {
        expect(await screen.findByTestId('snippet-settings-configure-confirmation-cancel-button')).toBeInTheDocument();
      },
      {
        timeout: 5000,
        interval: 100
      }
    );

    const dismissConfirmation = await screen.findByTestId('snippet-settings-configure-confirmation-cancel-button');
    fireEvent.click(dismissConfirmation);

    expect(mockFn).toHaveBeenCalledWith(false);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('SnippetSettings Modal on save', async () => {
    const { container } = render(
      <TestWrapper>
        <SnippetSettingsModal
          isNewSnippetAdded={false}
          snippetSettingsModalIsOpen
          setSnippetSettingsModalIsOpen={mockFn}
          testId="test-snippet-settings-modal"
          codeSnippetName="Test-code-snippet"
          selectedSnippet={null}
          setSelectCodeSnippetModelOpen={mockFn}
          onSave={mockFn}
          setConfigureSnippetSetting={mockFn}
          configureSnippetSetting={configureSnippetSetting}
        />
      </TestWrapper>
    );
    const addToLoginYesRadio = await screen.findByTestId('where_does_it_run-radio__div__1');
    fireEvent.click(addToLoginYesRadio);

    const saveButton = await screen.findByTestId('test-snippet-settings-modal-save-button');
    fireEvent.click(saveButton);
    await new Promise(resolve => {
      setTimeout(resolve, 0);
    });
    expect(mockFn).toHaveBeenCalledWith(false);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('SnippetSettings Modal on dismiss on change should show confirmation screen', async () => {
    const { container } = render(
      <TestWrapper>
        <SnippetSettingsModal
          isNewSnippetAdded={false}
          snippetSettingsModalIsOpen
          setSnippetSettingsModalIsOpen={mockFn}
          testId="test-snippet-settings-modal"
          codeSnippetName="Test-code-snippet"
          selectedSnippet={null}
          setSelectCodeSnippetModelOpen={mockFn}
          onSave={mockFn}
          setConfigureSnippetSetting={mockFn}
          configureSnippetSetting={configureSnippetSetting}
        />
      </TestWrapper>
    );

    const addToAllPagesRadio = await screen.findByTestId('where_does_it_run-radio__div__1');
    fireEvent.click(addToAllPagesRadio);

    const crossButton = screen.getByRole('button', {
      name: 'close modal'
    });
    fireEvent.click(crossButton);

    // Expect confirmation modal to show up
    await waitFor(() => {
      const cancelButton = screen.getByRole('button', {
        key: 'tracking_code_configure_code_snippet_cancel_button'
      });
      expect(cancelButton).toBeInTheDocument();
    });
    expect(await axe(container)).toHaveNoViolations();
  });
});

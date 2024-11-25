import React from 'react';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import { render, screen } from '@testing-library/react';
import SnippetSettingsConfirmationModal from '@components/tracking-codes/SnippetsSettingsConfirmatonModal';
import 'jest-axe/extend-expect';
import { axe } from 'jest-axe';

describe('SnippetSettingsConfirmationModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockFn = jest.fn();

  it('Renders SnippetSettingsConfirmation Modal', async () => {
    const { baseElement } = render(
      <TestWrapper>
        <SnippetSettingsConfirmationModal
          isNewSnippetAdded
          isOpen
          setIsModalOpen={mockFn}
          setSelectCodeSnippetModelOpen={mockFn}
          setSnippetSettingsModalIsOpen={mockFn}
        />
      </TestWrapper>
    );

    expect(baseElement).toMatchSnapshot();

    // Verify elements
    expect(await screen.findByRole('button', { name: 'Leave' })).toBeInTheDocument();
    expect(await screen.findByRole('button', { name: 'Stay' })).toBeInTheDocument();

    // Verify text
    expect(await screen.findByText('Leave without saving?')).toBeInTheDocument();
    expect(await screen.findByText('Leave')).toBeInTheDocument();
    expect(await screen.findByText('Stay')).toBeInTheDocument();
    expect(
      await screen.findByText('If you leave, your changes won’t be saved. Stay here to save them.')
    ).toBeInTheDocument();
    expect(await axe(baseElement)).toHaveNoViolations();
  });
});

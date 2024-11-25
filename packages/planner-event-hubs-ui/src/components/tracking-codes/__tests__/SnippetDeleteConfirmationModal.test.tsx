import React from 'react';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import { fireEvent, render, screen } from '@testing-library/react';
import SnippetDeleteConfirmationModal from '@components/tracking-codes/SnippetDeleteConfirnationModal';
import 'jest-axe/extend-expect';
import { axe } from 'jest-axe';

describe('SnippetDeleteConfirmationModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockFn = jest.fn();

  it('Renders SnippetDeleteConfirmationModal Modal', async () => {
    const { baseElement } = render(
      <TestWrapper>
        <SnippetDeleteConfirmationModal isOpen setIsModalOpen={mockFn} onRemove={mockFn} snippetId="1234-5678-abcd" />
      </TestWrapper>
    );

    expect(baseElement).toMatchSnapshot();

    expect(await screen.findByRole('button', { name: 'Delete' })).toBeInTheDocument();
    expect(await screen.findByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    expect(await screen.findByText('Delete code snippet?')).toBeInTheDocument();
    expect(await screen.findByText('Delete')).toBeInTheDocument();
    expect(await screen.findByText('Cancel')).toBeInTheDocument();
    expect(await screen.findByText('This code snippet will be removed from this hub.')).toBeInTheDocument();
    expect(await screen.findByText('This code snippet will be removed from this hub.')).toBeInTheDocument();
    expect(await axe(baseElement)).toHaveNoViolations();
  });

  it('Renders SnippetDeleteConfirmationModal Modal and clicks Cancel/Delete button', async () => {
    const { baseElement } = render(
      <TestWrapper>
        <SnippetDeleteConfirmationModal isOpen setIsModalOpen={mockFn} onRemove={mockFn} snippetId="1234-5678-abcd" />
      </TestWrapper>
    );
    fireEvent.click(await screen.findByRole('button', { name: 'Cancel' }));
    const deleteButton = await screen.findByRole('button', { name: 'Delete' });
    expect(deleteButton).toBeInTheDocument();
    fireEvent.click(deleteButton);
    await new Promise(resolve => {
      setTimeout(resolve, 0);
    });
    expect(mockFn).toHaveBeenCalledWith('1234-5678-abcd');
    expect(await axe(baseElement)).toHaveNoViolations();
  });
});

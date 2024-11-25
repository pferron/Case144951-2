import { render, screen, within } from '@testing-library/react';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import React from 'react';
import VisitorPermissionConfirmationModal from '@components/visitor-permissions/VisitorPermissionConfirmationModal';
import 'jest-axe/extend-expect';
import { axe } from 'jest-axe';

const mockFn = jest.fn();

it('renders visibility settings edit modal', async () => {
  const { container } = render(
    <TestWrapper>
      <VisitorPermissionConfirmationModal
        onSaveButtonContent="Override rules"
        onCancelButtonContent="Cancel"
        isModalOpen
        setIsModalOpen={mockFn}
        onSave={mockFn}
        onCancel={mockFn}
        heading="Override registration rules?"
        content="content"
      />
    </TestWrapper>
  );
  await new Promise(resolve => {
    setTimeout(resolve, 500);
  });

  const visibilitySettingsEditModal = within(screen.getByTestId('visitor-permissions-confirmation-modal'));
  expect(screen.getByText('Override registration rules?')).toBeInTheDocument();
  const OverrideRulesButton = visibilitySettingsEditModal.getByRole('button', { name: /Override rules/i });
  expect(OverrideRulesButton).toBeInTheDocument();
  expect(await axe(container)).toHaveNoViolations();
});

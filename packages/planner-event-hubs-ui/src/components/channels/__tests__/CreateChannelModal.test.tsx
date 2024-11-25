import React from 'react';
import { fireEvent, screen, render } from '@testing-library/react';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import ChannelModal from '@components/channels/create/ChannelModal';
import 'jest-axe/extend-expect';
import { axe } from 'jest-axe';

const setModalOpen = (): void => {
  /* empty */
};
const onSave = (): void => {
  /* empty */
};

describe('Create Channel Modal Test', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Render Open modal and check header', async () => {
    const { container } = render(
      <TestWrapper>
        <ChannelModal isModalOpen setIsModalOpen={setModalOpen} onSave={onSave} />
      </TestWrapper>
    );

    expect(screen.getByTestId('create-channel-modal-header')).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('Render Closed modal and check header should not be visible', async () => {
    const { container } = render(
      <TestWrapper>
        <ChannelModal isModalOpen={false} setIsModalOpen={setModalOpen} onSave={onSave} />
      </TestWrapper>
    );

    expect(screen.queryByTestId('create-channel-modal-header')).not.toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('Render open modal and check button only visible after adding data in both fields', async () => {
    const { container } = render(
      <TestWrapper>
        <ChannelModal isModalOpen setIsModalOpen={setModalOpen} onSave={onSave} />
      </TestWrapper>
    );

    expect(screen.getByTestId('create-channel-save-channel-button')).toBeDisabled();
    const nameField = screen.getByTestId('channel-name-form-input-name-input');
    const descriptionField = screen.getByTestId('channel-name-form-input-description-textarea');

    fireEvent.change(nameField, { target: { value: 'test channel' } });
    fireEvent.change(descriptionField, { target: { value: 'Its a good channel . very very good channel' } });

    expect(screen.getByTestId('create-channel-save-channel-button')).toBeEnabled();
    expect(await axe(container)).toHaveNoViolations();
  });
});

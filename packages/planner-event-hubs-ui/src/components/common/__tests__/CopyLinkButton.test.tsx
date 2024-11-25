import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import CopyLinkButton from '@components/common/CopyLinkButton';

describe('Test Copy Link icon button', () => {
  it('should render copy button with icon and copy when clicked', async () => {
    render(
      <TestWrapper>
        <CopyLinkButton url="https://example.com" title="Home Page" testID="testId" />
      </TestWrapper>
    );
    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn().mockImplementation(() => Promise.resolve())
      }
    });
    jest.spyOn(navigator.clipboard, 'writeText');

    const copyHomePageButton = screen.getByTestId('testId-link-copy-button');
    expect(copyHomePageButton).toBeInTheDocument();
    fireEvent.click(copyHomePageButton);

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('https://example.com');
  });
});

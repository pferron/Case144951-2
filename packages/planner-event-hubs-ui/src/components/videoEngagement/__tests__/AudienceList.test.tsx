import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { screen } from 'nucleus-text/testing-library/screen';
import 'jest-axe/extend-expect';
import AudienceList from '@components/videoEngagement/AudienceList';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import { ASC, DESC, FIRST_NAME } from '@utils/constants';

const mockAudienceList = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    duration: 60,
    percentage: 75
  },
  {
    id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    duration: 120,
    percentage: 85.944
  }
];

const mockOnSort = jest.fn();

describe('AudienceList', () => {
  it('renders audience list correctly', () => {
    render(
      <TestWrapper>
        <AudienceList audienceList={mockAudienceList} onSort={mockOnSort} />
      </TestWrapper>
    );

    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByTestId('audience_list_table-table-header')).toBeInTheDocument();
    const row1 = screen.getByTestId('audience_list_table-row-0');
    expect(row1).toBeInTheDocument();
    expect(row1).toHaveTextContent('John');
    const row2 = screen.getByTestId('audience_list_table-row-1');
    expect(row2).toBeInTheDocument();
    expect(row2).toHaveTextContent('Jane');
  });

  it('calls onSort with correct arguments when a column header is clicked', () => {
    render(
      <TestWrapper>
        <AudienceList audienceList={mockAudienceList} onSort={mockOnSort} />
      </TestWrapper>
    );

    fireEvent.click(screen.getByText('First Name'));
    expect(mockOnSort).toHaveBeenCalledWith(FIRST_NAME, ASC);

    fireEvent.click(screen.getByText('First Name'));
    expect(mockOnSort).toHaveBeenCalledWith(FIRST_NAME, DESC);
  });

  it('handles empty audience list correctly', () => {
    render(
      <TestWrapper>
        <AudienceList audienceList={[]} onSort={mockOnSort} />
      </TestWrapper>
    );

    expect(screen.getByTestId('audience_list_table')).toBeInTheDocument();
    expect(screen.queryByText('John')).not.toBeInTheDocument();
  });

  it('renders audience details correctly', () => {
    render(
      <TestWrapper>
        <AudienceList audienceList={mockAudienceList} onSort={mockOnSort} />
      </TestWrapper>
    );
    expect(screen.getByText('john.doe@example.com')).toBeInTheDocument();
    expect(screen.getByText('01:00')).toBeInTheDocument();
    expect(screen.getByText('75%')).toBeInTheDocument();
  });
});

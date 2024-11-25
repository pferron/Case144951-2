import { fireEvent, render, waitFor } from '@testing-library/react';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import { axe } from 'jest-axe';
import 'jest-axe/extend-expect';
import { screen } from 'nucleus-text/testing-library/screen';
import LanguageManagementImportHistory from '../LanguageManagementImportHistory';

jest.mock('@utils/dateTimeUtils', () => {
  const originalModule = jest.requireActual('@utils/dateTimeUtils');
  return {
    __esModule: true,
    ...originalModule,
    formatDateTimeStamp: jest.fn().mockReturnValue('2/7/2024 7:12:52 PM CST')
  };
});

const mockSetOpenImportHistory = jest.fn();
const mockSetDisplaySuccess = jest.fn();
const mockSetSuccessMessage = jest.fn();

describe('LanguageManagementImportHistory', () => {
  const importHistory = [
    {
      accountId: 123456,
      locale: 'en-US',
      errorCount: 2,
      successCount: 10,
      totalCount: 12,
      fileName: 'test-file.csv',
      createdAt: '2024-02-07T19:12:52.637Z',
      createdBy: 'Red-User',
      userId: '789012',
      status: 'COMPLETED'
    },
    {
      accountId: 123456,
      locale: 'en-US',
      errorCount: 0,
      successCount: 12,
      totalCount: 12,
      fileName: 'test-file1.csv',
      createdAt: '2024-02-07T19:12:52.637Z',
      createdBy: 'Red-User',
      userId: '789012',
      status: 'PROCESSING'
    },
    {
      accountId: 123456,
      locale: 'en-US',
      errorCount: 12,
      successCount: 0,
      totalCount: 12,
      fileName: 'test-file2.csv',
      createdAt: '2024-02-07T19:12:52.637Z',
      createdBy: 'Red-User',
      userId: '789012',
      status: 'FAILED'
    }
  ];

  it('renders the import history modal', async () => {
    const { container } = render(
      <TestWrapper>
        <LanguageManagementImportHistory
          importHistory={importHistory}
          setOpenImportHistory={mockSetOpenImportHistory}
          setDisplaySuccess={mockSetDisplaySuccess}
          setSuccessMessage={mockSetSuccessMessage}
          loading={false}
        />
      </TestWrapper>
    );
    expect(await screen.findByTextKey('language_management_import_history_modal_header')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { key: 'language_management_import_history_modal_close_button_label' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { key: 'language_management_import_history_modal_cancel_button_accessibility_label' })
    ).toBeInTheDocument();
    await waitFor(async () => {
      expect(await axe(container)).toHaveNoViolations();
    });
  });

  it('sets openImportHistory to false and clears success message when cancel button is clicked', async () => {
    render(
      <TestWrapper>
        <LanguageManagementImportHistory
          importHistory={importHistory}
          setOpenImportHistory={mockSetOpenImportHistory}
          setDisplaySuccess={mockSetDisplaySuccess}
          setSuccessMessage={mockSetSuccessMessage}
          loading={false}
        />
      </TestWrapper>
    );

    const cancelButton = await screen.findByRole('button', {
      key: 'language_management_import_history_modal_cancel_button_accessibility_label'
    });
    expect(cancelButton).toBeInTheDocument();
    fireEvent.click(cancelButton);
    expect(mockSetOpenImportHistory).toHaveBeenCalledWith(false);
    expect(mockSetDisplaySuccess).toHaveBeenCalledWith(false);
    expect(mockSetSuccessMessage).toHaveBeenCalledWith('');
  });

  it('sets openImportHistory to false and clears success message when close button is clicked', async () => {
    render(
      <TestWrapper>
        <LanguageManagementImportHistory
          importHistory={importHistory}
          setOpenImportHistory={mockSetOpenImportHistory}
          setDisplaySuccess={mockSetDisplaySuccess}
          setSuccessMessage={mockSetSuccessMessage}
          loading={false}
        />
      </TestWrapper>
    );

    const closeButton = await screen.findByRole('button', {
      key: 'language_management_import_history_modal_close_button_label'
    });
    expect(closeButton).toBeInTheDocument();
    fireEvent.click(closeButton);
    expect(mockSetOpenImportHistory).toHaveBeenCalledWith(false);
    expect(mockSetDisplaySuccess).toHaveBeenCalledWith(false);
    expect(mockSetSuccessMessage).toHaveBeenCalledWith('');
  });

  it('renders table rows correctly', async () => {
    const { container } = render(
      <TestWrapper>
        <LanguageManagementImportHistory
          importHistory={importHistory}
          setOpenImportHistory={mockSetOpenImportHistory}
          setDisplaySuccess={mockSetDisplaySuccess}
          setSuccessMessage={mockSetSuccessMessage}
          loading={false}
        />
      </TestWrapper>
    );

    const table = await screen.findByRole('table');
    expect(table).toBeInTheDocument();

    const rows = await screen.findAllByRole('row');
    expect(rows).toHaveLength(4); // 3 rows + 1 header

    expect(screen.getByTextKey('language_management_import_history_uploaded_by_column_label')).toBeInTheDocument();
    expect(screen.getByTextKey('language_management_import_history_uploaded_on_column_label')).toBeInTheDocument();
    expect(screen.getByTextKey('language_management_import_history_source_column_label')).toBeInTheDocument();
    expect(screen.getByTextKey('language_management_import_history_successful_rows_column_label')).toBeInTheDocument();
    expect(screen.getByTextKey('language_management_import_history_skipped_rows_column_label')).toBeInTheDocument();
    expect(screen.getByTextKey('language_management_import_history_status_column_label')).toBeInTheDocument();
    expect(screen.getByText('test-file.csv')).toBeInTheDocument();
    expect(screen.getByText('test-file1.csv')).toBeInTheDocument();
    expect(screen.getByText('test-file2.csv')).toBeInTheDocument();
    expect(screen.getAllByText('Red-User')).toHaveLength(3);
    expect(screen.getAllByText('2/7/2024 7:12:52 PM CST')).toHaveLength(3);
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getAllByText('12')).toHaveLength(2);
    expect(screen.getByTextKey('language_management_import_history_status_success')).toBeInTheDocument();
    expect(screen.getByTextKey('language_management_import_history_status_in_progress')).toBeInTheDocument();
    expect(screen.getByTextKey('language_management_import_history_status_failed')).toBeInTheDocument();
    await waitFor(async () => {
      expect(await axe(container)).toHaveNoViolations();
    });
  });

  it('renders empty table message if import history is empty', async () => {
    render(
      <TestWrapper>
        <LanguageManagementImportHistory
          importHistory={[]}
          setOpenImportHistory={mockSetOpenImportHistory}
          setDisplaySuccess={mockSetDisplaySuccess}
          setSuccessMessage={mockSetSuccessMessage}
          loading={false}
        />
      </TestWrapper>
    );

    expect(
      await screen.findByTextKey('language_management_import_history_uploaded_by_column_label')
    ).toBeInTheDocument();
    expect(screen.getByTextKey('language_management_import_history_uploaded_on_column_label')).toBeInTheDocument();
    expect(screen.getByTextKey('language_management_import_history_source_column_label')).toBeInTheDocument();
    expect(screen.getByTextKey('language_management_import_history_status_column_label')).toBeInTheDocument();
    expect(screen.getByTextKey('language_management_import_history_successful_rows_column_label')).toBeInTheDocument();
    expect(screen.getByTextKey('language_management_import_history_skipped_rows_column_label')).toBeInTheDocument();
    expect(screen.getByTextKey('language_management_import_history_table_empty_state')).toBeInTheDocument();
    expect(screen.queryByRole('cell')).not.toBeInTheDocument();
  });
});

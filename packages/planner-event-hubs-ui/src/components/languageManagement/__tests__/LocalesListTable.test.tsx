import { render, waitFor } from '@testing-library/react';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import { axe } from 'jest-axe';
import 'jest-axe/extend-expect';
import { screen } from 'nucleus-text/testing-library/screen';
import { AppFeaturesProvider } from '@components/AppFeaturesProvider';
import userEvent from '@testing-library/user-event';
import LocalesListTable from '../LocalesListTable';

describe('LocalesListTable', () => {
  const tableData = [
    {
      rowName: 'Row 1',
      locale: 'en-US',
      default: true,
      customized: 'true',
      lastModified: '2024-02-07T19:12:52.637Z',
      lastModifiedBy: 'Red-User',
      translationStatus: 'In-Progress'
    },
    {
      rowName: 'Row 2',
      locale: 'fr-FR',
      default: false,
      customized: 'false',
      lastModified: null,
      lastModifiedBy: null,
      translationStatus: 'Not-Started'
    }
  ];
  const languageMap = {
    'en-US': 'English',
    'fr-FR': 'French'
  };

  const mockSetShowLocalesListTable = jest.fn();
  const mockSetSelectedLocale = jest.fn();
  const mockSetSelectedLocaleTitle = jest.fn();
  const mockOnExport = jest.fn();
  const mockSetWizardOpen = jest.fn();

  const appFeatures = [
    {
      name: 'languageManagementImportFeature',
      enabled: true,
      experimentVersion: '1001'
    }
  ];

  it('renders table rows correctly', async () => {
    const { container } = render(
      <TestWrapper>
        <LocalesListTable
          tableData={tableData}
          languageMap={languageMap}
          setShowLocalesListTable={mockSetShowLocalesListTable}
          setSelectedLocale={mockSetSelectedLocale}
          setSelectedLocaleTitle={mockSetSelectedLocaleTitle}
          onExport={mockOnExport}
          setWizardOpen={mockSetWizardOpen}
        />
      </TestWrapper>
    );

    const table = await screen.findByRole('table');
    expect(table).toBeInTheDocument();

    const rows = await screen.findAllByRole('row');
    expect(rows).toHaveLength(3); // 2 rows + 1 header

    expect(screen.getByText('English')).toBeInTheDocument();
    expect(screen.getByText('In-Progress')).toBeInTheDocument();
    expect(screen.getByText('02/07/2024')).toBeInTheDocument();
    expect(screen.getByText('Red-User')).toBeInTheDocument();
    expect(screen.getByText('French')).toBeInTheDocument();
    expect(screen.getByTextKey('language_management_locale_list_default_tag')).toBeInTheDocument();
    await waitFor(
      async () => {
        expect(await axe(container)).toHaveNoViolations();
      },
      { timeout: 5000 }
    );
  });

  it('renders table rows with actions menu', async () => {
    const { container } = render(
      <TestWrapper>
        <LocalesListTable
          tableData={tableData}
          languageMap={languageMap}
          setShowLocalesListTable={mockSetShowLocalesListTable}
          setSelectedLocale={mockSetSelectedLocale}
          setSelectedLocaleTitle={mockSetSelectedLocaleTitle}
          onExport={mockOnExport}
          setWizardOpen={mockSetWizardOpen}
        />
      </TestWrapper>
    );

    const table = await screen.findByRole('table');
    expect(table).toBeInTheDocument();

    const rows = await screen.findAllByRole('row');
    expect(rows).toHaveLength(3); // 2 rows + 1 header
    const menuButtons = screen.getAllByTestId('language-management-actions-menu-button');
    const menuButton = await menuButtons[0];
    expect(menuButton).toBeInTheDocument();
    await userEvent.click(menuButton);
    const exportButton = await screen.findByTextKey('language_management_export_text');
    expect(exportButton).toBeInTheDocument();
    await waitFor(
      async () => {
        expect(await axe(container)).toHaveNoViolations();
      },
      { timeout: 5000 }
    );
  });

  it('calls onExport when export button is clicked', async () => {
    const { container } = render(
      <TestWrapper>
        <LocalesListTable
          tableData={tableData}
          languageMap={languageMap}
          setShowLocalesListTable={mockSetShowLocalesListTable}
          setSelectedLocale={mockSetSelectedLocale}
          setSelectedLocaleTitle={mockSetSelectedLocaleTitle}
          onExport={mockOnExport}
          setWizardOpen={mockSetWizardOpen}
        />
      </TestWrapper>
    );
    const table = await screen.findByRole('table');
    expect(table).toBeInTheDocument();
    const rows = await screen.findAllByRole('row');
    expect(rows).toHaveLength(3); // 2 rows + 1 header
    const menuButtons = screen.getAllByTestId('language-management-actions-menu-button');
    const menuButton = await menuButtons[0];
    expect(menuButton).toBeInTheDocument();
    await userEvent.click(menuButton);
    const exportButton = await screen.findByTextKey('language_management_export_text');
    expect(exportButton).toBeInTheDocument();
    await userEvent.click(exportButton);
    expect(mockOnExport).toHaveBeenCalled();
    await waitFor(
      async () => {
        expect(await axe(container)).toHaveNoViolations();
      },
      { timeout: 5000 }
    );
  });

  it('sets wizardOpen to true when import button is clicked', async () => {
    const { container } = render(
      <TestWrapper>
        <AppFeaturesProvider value={appFeatures}>
          <LocalesListTable
            tableData={tableData}
            languageMap={languageMap}
            setShowLocalesListTable={mockSetShowLocalesListTable}
            setSelectedLocale={mockSetSelectedLocale}
            setSelectedLocaleTitle={mockSetSelectedLocaleTitle}
            onExport={mockOnExport}
            setWizardOpen={mockSetWizardOpen}
          />
        </AppFeaturesProvider>
      </TestWrapper>
    );
    const table = await screen.findByRole('table');
    expect(table).toBeInTheDocument();
    const rows = await screen.findAllByRole('row');
    expect(rows).toHaveLength(3); // 2 rows + 1 header
    const menuButtons = screen.getAllByTestId('language-management-actions-menu-button');
    const menuButton = await menuButtons[0];
    expect(menuButton).toBeInTheDocument();
    await userEvent.click(menuButton);
    const importButton = await screen.findByTextKey('language_management_import_text');
    expect(importButton).toBeInTheDocument();
    await userEvent.click(importButton);
    expect(mockSetWizardOpen).toHaveBeenCalledWith(true);
    await waitFor(
      async () => {
        expect(await axe(container)).toHaveNoViolations();
      },
      { timeout: 5000 }
    );
  });
});

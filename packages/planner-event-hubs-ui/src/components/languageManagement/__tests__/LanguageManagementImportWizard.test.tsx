import { MockedProvider } from '@apollo/client/testing';
import { act, render, renderHook } from '@testing-library/react';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import 'jest-axe/extend-expect';
import LanguageManagementImportWizard, {
  useEventHandler
} from '@components/languageManagement/LanguageManagementImportWizard';
import { EXIT, ImportWizard, SUCCESS } from '@cvent/import-wizard';

jest.mock('@cvent/import-wizard', () => ({
  ImportWizard: jest.fn(() => null),
  EXIT: { EXIT_WIZARD: 'exit-wizard' },
  SUCCESS: {
    REVIEW: {
      SUCCESS_GET_VALIDATION_ERRORS: 'success-get-validation-errors',
      SUCCESS_IMPORT_FILE_DATA: 'success-import-file-data'
    }
  }
}));

describe('LanguageManagementImportWizard', () => {
  const mockOnWizardOpen = jest.fn();
  const mockSetOpenImportHistory = jest.fn();
  const mockFetchImportHistory = jest.fn();
  const mockSetDisplaySuccess = jest.fn();
  const mockSetSuccessMessage = jest.fn();
  const mockSetDisplayWarning = jest.fn();
  const mockSetWarningMessage = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should render the ImportWizard component with correct props', async () => {
    render(
      <MockedProvider>
        <TestWrapper>
          <LanguageManagementImportWizard
            onWizardOpen={mockOnWizardOpen}
            setOpenImportHistory={mockSetOpenImportHistory}
            fetchImportHistory={mockFetchImportHistory}
            centerId="test-event-plus"
          />
        </TestWrapper>
      </MockedProvider>
    );

    expect(ImportWizard).toHaveBeenCalledWith(
      expect.objectContaining({
        eventId: 'test-event-plus',
        onEvent: expect.any(Function)
      }),
      {}
    );
  });
  it('should handle EXIT.EXIT_WIZARD event', () => {
    const { result } = renderHook(() =>
      useEventHandler(
        mockOnWizardOpen,
        mockSetOpenImportHistory,
        mockFetchImportHistory,
        mockSetDisplaySuccess,
        mockSetSuccessMessage,
        mockSetDisplayWarning,
        mockSetWarningMessage
      )
    );

    act(() => {
      result.current(EXIT.EXIT_WIZARD);
    });

    expect(mockOnWizardOpen).toHaveBeenCalledWith(false);
  });
  it('should handle SUCCESS.REVIEW.SUCCESS_GET_VALIDATION_ERRORS event', () => {
    const { result } = renderHook(() =>
      useEventHandler(
        mockOnWizardOpen,
        mockSetOpenImportHistory,
        mockFetchImportHistory,
        mockSetDisplaySuccess,
        mockSetSuccessMessage,
        mockSetDisplayWarning,
        mockSetWarningMessage
      )
    );

    act(() => {
      result.current(SUCCESS.REVIEW.SUCCESS_GET_VALIDATION_ERRORS);
    });

    expect(mockSetDisplayWarning).toHaveBeenCalledWith(true);
    expect(mockSetWarningMessage).toHaveBeenCalled();
  });
  it('should handle SUCCESS.REVIEW.SUCCESS_IMPORT_FILE_DATA event', () => {
    const { result } = renderHook(() =>
      useEventHandler(
        mockOnWizardOpen,
        mockSetOpenImportHistory,
        mockFetchImportHistory,
        mockSetDisplaySuccess,
        mockSetSuccessMessage,
        mockSetDisplayWarning,
        mockSetWarningMessage
      )
    );

    act(() => {
      result.current(SUCCESS.REVIEW.SUCCESS_IMPORT_FILE_DATA);
    });

    expect(mockSetDisplaySuccess).toHaveBeenCalledWith(true);
    expect(mockSetSuccessMessage).toHaveBeenCalled();
  });
});

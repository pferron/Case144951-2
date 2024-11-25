import { MockedProvider } from '@apollo/client/testing';
import { GetTranslationsDocument } from '@cvent/planner-event-hubs-model/operations';
import { fireEvent, render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import { axe } from 'jest-axe';
import 'jest-axe/extend-expect';
import { screen } from 'nucleus-text/testing-library/screen';
import { AppFeaturesProvider } from '@components/AppFeaturesProvider';
import { getFileImportHistory } from '@cvent/planner-event-hubs-model/operations/fileImport';
import LanguageManagement from '../LanguageManagement';
import { mockHub, queryMocks as queryLocaleMocks } from './fixtures/queryMocks';

let mockMutationHandlerCalled = false;
jest.mock('@hooks/useUpdateTranslation', () => {
  const originalModule = jest.requireActual('@hooks/useUpdateTranslation');
  return {
    __esModule: true,
    ...originalModule,
    default: jest.fn().mockReturnValue({
      updateTranslationHandler: jest.fn().mockImplementation(() => {
        mockMutationHandlerCalled = true;
      }),
      showSavedMessage: true,
      saving: false,
      error: null
    })
  };
});

jest.mock('@hooks/useCenterInfo', () => ({
  useCenterInfo: () => {
    return {
      hubData: mockHub.hub
    };
  }
}));

interface RouterProps {
  pathname: string;
  route: string;
  query: {
    isSuccess: boolean;
  };
  replace: () => void;
}

jest.mock('next/router', () => ({
  useRouter(): RouterProps {
    return {
      pathname: '/path',
      route: '/route',
      query: { isSuccess: true },
      replace: jest.fn()
    };
  }
}));

const getTranslationsDocumentDefault = {
  request: {
    query: GetTranslationsDocument,
    variables: {
      input: {
        hubId: 'test-event-plus',
        locale: 'en-US',
        limit: 25,
        sort: 'id:ASC',
        type: 'custom-translation',
        translationText: '',
        token: ''
      }
    },
    fetchPolicy: 'cache-and-network'
  },
  result: {
    data: {
      getTranslations: {
        data: [
          {
            __typename: 'Translation',
            type: 'Banner-Button',
            locale: 'en-US',
            id: 'show_less_button',
            translatedValue: 'Show less translated',
            defaultValue: 'Show less'
          },
          {
            __typename: 'Translation',
            type: 'Channel-Name',
            locale: 'en-US',
            id: 'single_video_page_speakers_carousel_next',
            translatedValue: 'Next Translated',
            defaultValue: 'Next'
          }
        ],
        paging: {
          nextToken: null,
          totalCount: 30
        }
      }
    },
    loading: false
  }
};
const getTranslationsDocumentMorePageLimit = {
  request: {
    query: GetTranslationsDocument,
    variables: {
      input: {
        hubId: 'test-event-plus',
        locale: 'en-US',
        limit: 100,
        sort: 'id:ASC',
        type: 'custom-translation',
        translationText: '',
        token: ''
      }
    },
    fetchPolicy: 'cache-and-network'
  },
  result: {
    data: {
      getTranslations: {
        data: [
          {
            __typename: 'Translation',
            type: 'Banner-Button',
            locale: 'en-US',
            id: 'show_less_button',
            translatedValue: 'Show less translated',
            defaultValue: 'Show less'
          },
          {
            __typename: 'Translation',
            type: 'Channel-Name',
            locale: 'en-US',
            id: 'single_video_page_speakers_carousel_next',
            translatedValue: 'Next Translated',
            defaultValue: 'Next'
          }
        ],
        paging: {
          nextToken: null,
          totalCount: 30
        }
      }
    },
    loading: false
  }
};
const getImportHistory = {
  request: {
    query: getFileImportHistory,
    variables: {
      hubId: 'test-event-plus',
      fileImportHistoryInput: {
        schemaName: 'video-hub-translation-import',
        locale: 'en-US'
      }
    }
  },
  result: {
    data: {
      fileImportHistory: [
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
          __typename: 'FileImportHistory'
        }
      ]
    },
    loading: false
  }
};

const appFeatures = [
  {
    name: 'languageManagementImportFeature',
    enabled: true,
    experimentVersion: '1001'
  }
];

describe('LanguageManagement', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should render the locale list table component initially', async () => {
    const { container } = render(
      <MockedProvider mocks={[getTranslationsDocumentDefault, ...queryLocaleMocks]}>
        <TestWrapper>
          <LanguageManagement centerId="test-event-plus" centerTitle="centerTitle" />
        </TestWrapper>
      </MockedProvider>
    );
    expect(await screen.findByTextKey('language_management_page_title')).toBeInTheDocument();
    expect(await screen.findByText('centerTitle')).toBeInTheDocument();
    await waitFor(async () => {
      expect(await axe(container)).toHaveNoViolations();
    });
  });

  it('Should render the translation table when a language is selected', async () => {
    const { container } = render(
      <MockedProvider mocks={[getTranslationsDocumentDefault, ...queryLocaleMocks]}>
        <TestWrapper>
          <LanguageManagement centerId="test-event-plus" centerTitle="centerTitle" />
        </TestWrapper>
      </MockedProvider>
    );
    expect(await screen.findByTextKey('language_management_page_title')).toBeInTheDocument();

    const englishLang = await screen.findByText('English');
    expect(englishLang).toBeInTheDocument();
    fireEvent.click(englishLang);
    const translationList = await screen.findByTextKey('language_management_locale_page_title', { locale: 'English' });
    expect(translationList).toBeInTheDocument();
    await waitFor(
      async () => {
        expect(await axe(container)).toHaveNoViolations();
      },
      { timeout: 10000 }
    );
  });

  it('Should switch between tabs for original and phrase key text', async () => {
    render(
      <MockedProvider mocks={[getTranslationsDocumentDefault, ...queryLocaleMocks]}>
        <TestWrapper>
          <LanguageManagement centerId="test-event-plus" centerTitle="centerTitle" />
        </TestWrapper>
      </MockedProvider>
    );
    expect(await screen.findByTextKey('language_management_page_title')).toBeInTheDocument();

    const englishLang = await screen.findByText('English');
    expect(englishLang).toBeInTheDocument();
    fireEvent.click(englishLang);
    const translationList = await screen.findByTextKey('language_management_locale_page_title', { locale: 'English' });
    expect(translationList).toBeInTheDocument();
    const originalKeyTab = screen.getByRole('tab', { key: 'language_management_original_text_tab' });
    fireEvent.click(originalKeyTab);
    expect(await screen.findByTextKey('language_management_original_text_subtitle')).toBeInTheDocument();
  });

  it('Should keep same page limit when switching between tabs', async () => {
    render(
      <MockedProvider mocks={[getTranslationsDocumentDefault, ...queryLocaleMocks]}>
        <TestWrapper>
          <LanguageManagement centerId="test-event-plus" centerTitle="centerTitle" />
        </TestWrapper>
      </MockedProvider>
    );
    expect(await screen.findByTextKey('language_management_page_title')).toBeInTheDocument();

    const englishLang = await screen.findByText('English');
    expect(englishLang).toBeInTheDocument();
    fireEvent.click(englishLang);
    const translationList = await screen.findByTextKey('language_management_locale_page_title', { locale: 'English' });
    expect(translationList).toBeInTheDocument();

    const changePageLimit = await screen.findByRole('button', {
      key: 'language_management_page_limit_accessibility_label'
    });
    fireEvent.click(changePageLimit);
    fireEvent.click(await screen.findByText('100'));
    expect(await screen.findByTextKey('language_management_page_title')).toBeInTheDocument();

    const originalKeyTab = screen.getByRole('tab', { key: 'language_management_original_text_tab' });
    fireEvent.click(originalKeyTab);
    expect(await screen.findByTextKey('language_management_original_text_subtitle')).toBeInTheDocument();
    expect(await screen.findByText('100')).toBeInTheDocument();
  });

  it(
    'Should show modal asking for confirmation when there are unsaved changes and page limit change action is' +
      ' clicked and call the mutation upon saving',
    async () => {
      render(
        <MockedProvider mocks={[getTranslationsDocumentDefault, ...queryLocaleMocks]}>
          <TestWrapper>
            <LanguageManagement centerId="test-event-plus" centerTitle="centerTitle" />
          </TestWrapper>
        </MockedProvider>
      );
      const englishLang = await screen.findByText('English');
      expect(englishLang).toBeInTheDocument();
      fireEvent.click(englishLang);
      const translationList = await screen.findByTextKey('language_management_locale_page_title', {
        locale: 'English'
      });
      expect(translationList).toBeInTheDocument();

      const editableTextArea = await screen.findByText('Show less translated');
      fireEvent.change(editableTextArea, { target: { value: 'New value' } });
      expect(await screen.findByText('New value')).toBeInTheDocument();

      const changePageLimit = await screen.findByRole('button', {
        key: 'language_management_page_limit_accessibility_label'
      });
      fireEvent.click(changePageLimit);
      fireEvent.click(await screen.findByText('100'));
      expect(await screen.findByTextKey('language_management_confirmation_modal_header')).toBeInTheDocument();

      const saveBtn = await screen.findByTestId('confirmation-modal-save-button');
      fireEvent.click(saveBtn);
      expect(mockMutationHandlerCalled).toBeTruthy();
    }
  );

  it(
    'Should show modal asking for confirmation when there are unsaved changes and pagination action is clicked and' +
      ' call the mutation upon saving',
    async () => {
      render(
        <MockedProvider
          mocks={[getTranslationsDocumentMorePageLimit, getTranslationsDocumentDefault, ...queryLocaleMocks]}
        >
          <TestWrapper>
            <LanguageManagement centerId="test-event-plus" centerTitle="centerTitle" />
          </TestWrapper>
        </MockedProvider>
      );
      expect(await screen.findByTextKey('language_management_page_title')).toBeInTheDocument();

      const englishLang = await screen.findByText('English');
      expect(englishLang).toBeInTheDocument();
      fireEvent.click(englishLang);
      const translationList = await screen.findByTextKey('language_management_locale_page_title', {
        locale: 'English'
      });
      expect(translationList).toBeInTheDocument();

      const editableTextArea = await screen.findByText('Next Translated');
      fireEvent.change(editableTextArea, { target: { value: 'New value for pagination' } });
      expect(await screen.findByText('New value for pagination')).toBeInTheDocument();

      const nextPageBtn = await screen.findByRole('button', {
        key: 'language_management_pagination_accessibility_next_btn'
      });
      fireEvent.click(nextPageBtn);
      expect(await screen.findByTextKey('language_management_confirmation_modal_header')).toBeInTheDocument();

      const saveBtn = await screen.findByTestId('confirmation-modal-save-button');
      fireEvent.click(saveBtn);
      expect(mockMutationHandlerCalled).toBeTruthy();
    }
  );

  it('Should show modal asking for confirmation when there are unsaved changes and dropdown filter change is clicked and call the mutation upon saving', async () => {
    render(
      <MockedProvider mocks={[getTranslationsDocumentDefault, ...queryLocaleMocks]}>
        <TestWrapper>
          <LanguageManagement centerId="test-event-plus" centerTitle="centerTitle" />
        </TestWrapper>
      </MockedProvider>
    );
    expect(await screen.findByTextKey('language_management_page_title')).toBeInTheDocument();

    const englishLang = await screen.findByText('English');
    expect(englishLang).toBeInTheDocument();
    fireEvent.click(englishLang);
    const translationList = await screen.findByTextKey('language_management_locale_page_title', { locale: 'English' });
    expect(translationList).toBeInTheDocument();

    const editableTextArea = await screen.findByText('Next Translated');
    fireEvent.change(editableTextArea, { target: { value: 'New value for pagination' } });
    expect(await screen.findByText('New value for pagination')).toBeInTheDocument();

    const filterByTypeBtn = await screen.findByRole('button', {
      key: 'language_management_filter_by_type_accessibility_label'
    });
    await waitFor(() => {
      expect(filterByTypeBtn).toBeInTheDocument();
    });
    fireEvent.click(filterByTypeBtn);
    fireEvent.click(
      await screen.findByRole('menuitemradio', { key: 'language_management_filter_type_option_channel' })
    );
    expect(await screen.findByTextKey('language_management_confirmation_modal_header')).toBeInTheDocument();

    const saveBtn = await screen.findByTestId('confirmation-modal-save-button');
    fireEvent.click(saveBtn);
    expect(mockMutationHandlerCalled).toBeTruthy();
  });

  it('Should show modal asking for confirmation when there are unsaved changes and search for new labels and call the mutation upon saving', async () => {
    render(
      <MockedProvider mocks={[getTranslationsDocumentDefault, ...queryLocaleMocks]}>
        <TestWrapper>
          <LanguageManagement centerId="test-event-plus" centerTitle="centerTitle" />
        </TestWrapper>
      </MockedProvider>
    );
    expect(await screen.findByTextKey('language_management_page_title')).toBeInTheDocument();

    const englishLang = await screen.findByText('English');
    expect(englishLang).toBeInTheDocument();
    fireEvent.click(englishLang);
    const translationList = await screen.findByTextKey('language_management_locale_page_title', { locale: 'English' });
    expect(translationList).toBeInTheDocument();

    const editableTextArea = await screen.findByText('Next Translated');
    fireEvent.change(editableTextArea, { target: { value: 'New value for pagination' } });
    expect(await screen.findByText('New value for pagination')).toBeInTheDocument();

    const searchInput = await screen.findByRole('textbox', {
      key: 'language_management_search_input_accessibility'
    });
    fireEvent.change(searchInput, { target: { value: 'new key' } });
    fireEvent.click(
      await screen.findByRole('button', { key: 'language_management_search_filter_search_btn_accessibility' })
    );
    expect(await screen.findByTextKey('language_management_confirmation_modal_header')).toBeInTheDocument();

    const saveBtn = await screen.findByTestId('confirmation-modal-save-button');
    fireEvent.click(saveBtn);
    expect(mockMutationHandlerCalled).toBeTruthy();
  });

  it('Should show modal asking for confirmation when there are unsaved changes and switch tab is called', async () => {
    render(
      <MockedProvider mocks={[getTranslationsDocumentDefault, ...queryLocaleMocks]}>
        <TestWrapper>
          <LanguageManagement centerId="test-event-plus" centerTitle="centerTitle" />
        </TestWrapper>
      </MockedProvider>
    );
    expect(await screen.findByTextKey('language_management_page_title')).toBeInTheDocument();

    const englishLang = await screen.findByText('English');
    expect(englishLang).toBeInTheDocument();
    fireEvent.click(englishLang);
    const translationList = await screen.findByTextKey('language_management_locale_page_title', { locale: 'English' });
    expect(translationList).toBeInTheDocument();

    const editableTextArea = await screen.findByText('Next Translated');
    fireEvent.change(editableTextArea, { target: { value: 'New value for pagination' } });
    expect(await screen.findByText('New value for pagination')).toBeInTheDocument();

    const originalKeyTab = screen.getByRole('tab', { key: 'language_management_original_text_tab' });
    fireEvent.click(originalKeyTab);
    expect(await screen.findByTextKey('language_management_confirmation_modal_header')).toBeInTheDocument();

    const saveBtn = await screen.findByTestId('confirmation-modal-save-button');
    fireEvent.click(saveBtn);
    expect(mockMutationHandlerCalled).toBeTruthy();
  });

  it('Should show options to Reset and Export within more dropdown', async () => {
    render(
      <MockedProvider mocks={[...queryLocaleMocks]}>
        <TestWrapper>
          <LanguageManagement centerId="test-event-plus" centerTitle="centerTitle" />
        </TestWrapper>
      </MockedProvider>
    );
    expect(await screen.findByTextKey('language_management_page_title')).toBeInTheDocument();

    const englishLang = await screen.findByText('English');
    expect(englishLang).toBeInTheDocument();
    fireEvent.click(englishLang);
    const translationList = await screen.findByTextKey('language_management_locale_page_title', { locale: 'English' });
    expect(translationList).toBeInTheDocument();

    const moreBtn = screen.getByRole('button', { key: 'show_more_button_text' });
    fireEvent.click(moreBtn);
    const resetBtn = await screen.findByTextKey('language_management_reset_action');
    const exportBtn = await screen.findByTextKey('language_management_export_action');
    expect(resetBtn).toBeInTheDocument();
    expect(exportBtn).toBeInTheDocument();
    await userEvent.click(resetBtn);
    const resetModal = await screen.findByTextKey('language_management_confirm_reset_header');
    expect(resetModal).toBeInTheDocument();
    await userEvent.click(await screen.findByTextKey('language_management_cancel_reset_button'));
    // Export
    fireEvent.click(await screen.findByRole('button', { key: 'show_more_button_text' }));
    await userEvent.click(await screen.findByTextKey('language_management_export_action'));
  });

  it('Should show options to Import, Revert, View history and Export within Actions dropdown', async () => {
    render(
      <MockedProvider mocks={[...queryLocaleMocks]}>
        <TestWrapper>
          <AppFeaturesProvider value={appFeatures}>
            <LanguageManagement centerId="test-event-plus" centerTitle="centerTitle" />
          </AppFeaturesProvider>
        </TestWrapper>
      </MockedProvider>
    );
    expect(await screen.findByTextKey('language_management_page_title')).toBeInTheDocument();

    const englishLang = await screen.findByText('English');
    expect(englishLang).toBeInTheDocument();
    fireEvent.click(englishLang);
    const translationList = await screen.findByTextKey('language_management_locale_page_title', { locale: 'English' });
    expect(translationList).toBeInTheDocument();

    const moreBtn = screen.getByRole('button', { key: 'language_management_actions_button_text' });
    fireEvent.click(moreBtn);
    const resetBtn = await screen.findByTextKey('language_management_revert_action');
    const exportBtn = await screen.findByTextKey('language_management_export_text');
    const importBtn = await screen.findByTextKey('language_management_import_text');
    const importHistoryBtn = await screen.findByTextKey('language_management_view_history_action');
    expect(resetBtn).toBeInTheDocument();
    expect(exportBtn).toBeInTheDocument();
    expect(importBtn).toBeInTheDocument();
    expect(importHistoryBtn).toBeInTheDocument();
    await userEvent.click(resetBtn);
    const resetModal = await screen.findByTextKey('language_management_confirm_reset_header');
    expect(resetModal).toBeInTheDocument();
    await userEvent.click(await screen.findByTextKey('language_management_cancel_reset_button'));
    // Export
    fireEvent.click(await screen.findByRole('button', { key: 'language_management_actions_button_text' }));
    await userEvent.click(await screen.findByTextKey('language_management_export_text'));
    // Import
    fireEvent.click(await screen.findByRole('button', { key: 'language_management_actions_button_text' }));
    await userEvent.click(await screen.findByTextKey('language_management_import_text'));
    // Import history
    fireEvent.click(await screen.findByRole('button', { key: 'language_management_actions_button_text' }));
    await userEvent.click(await screen.findByTextKey('language_management_view_history_action'));
  });

  it('opens LanguageManagementImportHistory on button click', async () => {
    const { container } = render(
      <MockedProvider mocks={[getTranslationsDocumentDefault, getImportHistory, ...queryLocaleMocks]}>
        <TestWrapper>
          <AppFeaturesProvider value={appFeatures}>
            <LanguageManagement centerId="test-event-plus" centerTitle="centerTitle" />
          </AppFeaturesProvider>
        </TestWrapper>
      </MockedProvider>
    );

    expect(await screen.findByTextKey('language_management_page_title')).toBeInTheDocument();

    const englishLang = await screen.findByText('English');
    expect(englishLang).toBeInTheDocument();
    fireEvent.click(englishLang);
    const translationList = await screen.findByTextKey('language_management_locale_page_title', { locale: 'English' });
    expect(translationList).toBeInTheDocument();

    const moreBtn = screen.getByRole('button', { key: 'language_management_actions_button_text' });
    fireEvent.click(moreBtn);

    const importHistory = await screen.findByTextKey('language_management_view_history_action');
    expect(importHistory).toBeInTheDocument();
    fireEvent.click(importHistory);

    expect(await screen.findByTextKey('language_management_import_history_modal_header')).toBeInTheDocument();
    const importHistoryModal = await screen.findByTestId('import-history-modal');
    expect(importHistoryModal).toBeInTheDocument();

    await waitFor(async () => {
      expect(await axe(container)).toHaveNoViolations();
    });
  });

  it('opens LanguageManagementImportWizard on button click', async () => {
    render(
      <MockedProvider mocks={[...queryLocaleMocks]}>
        <TestWrapper>
          <AppFeaturesProvider value={appFeatures}>
            <LanguageManagement centerId="test-event-plus" centerTitle="centerTitle" />
          </AppFeaturesProvider>
        </TestWrapper>
      </MockedProvider>
    );

    expect(await screen.findByTextKey('language_management_page_title')).toBeInTheDocument();

    const englishLang = await screen.findByText('English');
    expect(englishLang).toBeInTheDocument();
    fireEvent.click(englishLang);
    const translationList = await screen.findByTextKey('language_management_locale_page_title', { locale: 'English' });
    expect(translationList).toBeInTheDocument();

    const moreBtn = screen.getByRole('button', { key: 'language_management_actions_button_text' });
    fireEvent.click(moreBtn);

    const importText = await screen.findByTextKey('language_management_import_text');
    expect(importText).toBeInTheDocument();
    fireEvent.click(importText);

    expect(await screen.findByTextKey('language_management_import_text')).toBeInTheDocument();
    const importWizard = await screen.findByTestId('import-wizard');
    expect(importWizard).toBeInTheDocument();
  });
});

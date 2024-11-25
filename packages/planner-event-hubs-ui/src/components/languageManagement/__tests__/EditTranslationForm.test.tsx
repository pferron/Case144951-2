import { MockedProvider } from '@apollo/client/testing';
import { SET_TRANSLATIONS } from '@cvent/planner-event-hubs-model/operations/languageManagement';
import { Translation } from '@cvent/planner-event-hubs-model/types';
import { fireEvent, render } from '@testing-library/react';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import { axe } from 'jest-axe';
import 'jest-axe/extend-expect';
import { screen } from 'nucleus-text/testing-library/screen';
import EditTranslationForm from '../EditTranslationForm';

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

const queryMocks = [
  {
    request: {
      query: SET_TRANSLATIONS,
      variables: {
        input: { id: 'testCenterId' },
        locale: 'en-US',
        data: [
          {
            type: 'PhraseApp-Key',
            locale: 'en-US',
            id: 'upcoming_events_register_btn_text',
            translatedValue: 'New Register Button Text'
          }
        ]
      },
      result: {
        data: {
          setTranslations: {
            Failure: [],
            Success: [
              {
                type: 'PhraseApp-Key',
                locale: 'en-US',
                id: 'upcoming_events_register_btn_text',
                translatedValue: 'New Register Button Text',
                __typename: 'Translation'
              }
            ],
            __typename: 'TranslationUpdateResponse'
          }
        }
      }
    }
  }
];

describe('EditTranslationForm', () => {
  const mockRowData = {
    __typename: 'Translation',
    type: 'PhraseApp-Key',
    locale: 'en-US',
    id: 'upcoming_events_register_btn_text-PhraseApp-Key-0',
    itemId: 'upcoming_events_register_btn_text',
    translatedValue: 'Register Translated',
    defaultValue: 'Register',
    rowName: 'upcoming_events_register_btn_text-PhraseApp-Key-0'
  } as Translation & { itemId: string };
  const mockTracker = {
    current: {}
  };
  const mockSetShowErrorInSavingAlert = jest.fn();
  const mockSetDirtyFormTrackerMapRef = jest.fn();
  const mockMutationHandler = jest.fn();
  const mockSetIsPageEdited = jest.fn();

  jest.mock('@hooks/useUpdateTranslation', () => {
    const originalModule = jest.requireActual('@hooks/useUpdateTranslation');
    return {
      __esModule: true,
      ...originalModule,
      useTranslationUpdater: jest.fn().mockReturnValue({
        updateTranslationHandler: mockMutationHandler,
        showSavedMessage: true,
        saving: false,
        error: null
      })
    };
  });

  it('Should render the component fine', async () => {
    const { container } = render(
      <MockedProvider>
        <TestWrapper>
          <EditTranslationForm
            value={mockRowData}
            centerId="testCenterId"
            locale="en-US"
            dirtyFormTrackerMapRef={mockTracker}
            setShowErrorInSavingAlert={mockSetShowErrorInSavingAlert}
            setDirtyFormTrackerMapRef={mockSetDirtyFormTrackerMapRef}
            setIsPageEdited={mockSetIsPageEdited}
          />
        </TestWrapper>
      </MockedProvider>
    );
    expect(await screen.findByText('Register Translated')).toBeInTheDocument();
    expect(
      await screen.findByRole('button', { key: 'language_management_save_translation_btn_accessibility' })
    ).toBeInTheDocument();
    expect(
      await screen.findByRole('button', { key: 'language_management_cancel_translation_btn_accessibility' })
    ).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('Should call a mutation to save when clicked on save button', async () => {
    render(
      <MockedProvider mocks={queryMocks}>
        <TestWrapper>
          <EditTranslationForm
            value={mockRowData}
            centerId="testCenterId"
            locale="en-US"
            dirtyFormTrackerMapRef={mockTracker}
            setShowErrorInSavingAlert={mockSetShowErrorInSavingAlert}
            setDirtyFormTrackerMapRef={mockSetDirtyFormTrackerMapRef}
            setIsPageEdited={mockSetIsPageEdited}
          />
        </TestWrapper>
      </MockedProvider>
    );
    expect(await screen.findByText('Register Translated')).toBeInTheDocument();
    const textAreaInput = await screen.findByRole('textbox', { key: 'language_management_edit_area_accessibility' });
    expect(textAreaInput).toBeInTheDocument();
    fireEvent.change(textAreaInput, { target: { value: 'New Register Button Text' } });
    expect(await screen.findByTextKey('language_management_form_save_your_changes_message')).toBeInTheDocument();

    const saveBtn = await screen.findByRole('button', {
      key: 'language_management_save_translation_btn_accessibility'
    });
    fireEvent.click(saveBtn);
    expect(mockSetDirtyFormTrackerMapRef).toHaveBeenCalled();
  });

  it('Should reset to last entry when cancel button is clicked', async () => {
    render(
      <MockedProvider mocks={queryMocks}>
        <TestWrapper>
          <EditTranslationForm
            value={mockRowData}
            centerId="testCenterId"
            locale="en-US"
            dirtyFormTrackerMapRef={mockTracker}
            setShowErrorInSavingAlert={mockSetShowErrorInSavingAlert}
            setDirtyFormTrackerMapRef={mockSetDirtyFormTrackerMapRef}
            setIsPageEdited={mockSetIsPageEdited}
          />
        </TestWrapper>
      </MockedProvider>
    );
    expect(await screen.findByText('Register Translated')).toBeInTheDocument();
    const textAreaInput = await screen.findByRole('textbox', { key: 'language_management_edit_area_accessibility' });
    expect(textAreaInput).toBeInTheDocument();
    fireEvent.change(textAreaInput, { target: { value: 'New Register Button Text' } });
    const cancelBtn = await screen.findByRole('button', {
      key: 'language_management_cancel_translation_btn_accessibility'
    });
    fireEvent.click(cancelBtn);
    expect(await screen.findByText('Register Translated')).toBeInTheDocument();
  });
});

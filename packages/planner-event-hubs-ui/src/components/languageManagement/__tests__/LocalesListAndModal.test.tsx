import { MockedProvider } from '@apollo/client/testing';
import { addHubLocales } from '@cvent/planner-event-hubs-model/operations/hub';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import { axe } from 'jest-axe';
import 'jest-axe/extend-expect';
import { screen } from 'nucleus-text/testing-library/screen';
import LocalesListAndModal from '../LocalesListAndModal';
import { queryMocks, mockHub } from './fixtures/queryMocks';

const extendedMocks = [
  ...queryMocks,
  {
    request: {
      query: addHubLocales,
      variables: {
        id: {
          id: 'test-event-plus'
        },
        hubLocales: { data: ['de-DE', 'en-US', 'da-DK'] }
      }
    },
    result: () => {
      return {
        data: [
          {
            locale: 'en-US',
            default: true,
            __typename: 'HubLocaleWithDefault'
          },
          {
            locale: 'de-DK',
            default: false,
            __typename: 'HubLocaleWithDefault'
          }
        ],
        __typename: 'HubLocalesWithDefault'
      };
    }
  }
];

jest.mock('@hooks/useCenterInfo', () => ({
  useCenterInfo: () => {
    return {
      hubData: mockHub.hub
    };
  }
}));

const mockSetShowLocalesListTable = jest.fn();
const mockSetSelectedLocale = jest.fn();
const mockSetSelectedLocaleTitle = jest.fn();
const mockOnExport = jest.fn();
const mockSetWizardOpen = jest.fn();

describe('LocalesListWrapper', () => {
  it('Should render the component fine', async () => {
    const { container } = render(
      <MockedProvider mocks={queryMocks}>
        <TestWrapper>
          <LocalesListAndModal
            centerId="test-event-plus"
            setShowLocalesListTable={mockSetShowLocalesListTable}
            setSelectedLocale={mockSetSelectedLocale}
            setSelectedLocaleTitle={mockSetSelectedLocaleTitle}
            onExport={mockOnExport}
            setWizardOpen={mockSetWizardOpen}
          />
        </TestWrapper>
      </MockedProvider>
    );
    // Button
    expect(await screen.findByRole('button', { key: 'language_management_add_language_btn' })).toBeInTheDocument();
    expect(await screen.findByTextKey('language_management_languages_list_title')).toBeInTheDocument();
    await waitFor(async () => {
      expect(await axe(container)).toHaveNoViolations();
    });
  });

  it('Should open the modal when clicked on add language button', async () => {
    const { container } = render(
      <MockedProvider mocks={queryMocks}>
        <TestWrapper>
          <LocalesListAndModal
            centerId="test-event-plus"
            setShowLocalesListTable={mockSetShowLocalesListTable}
            setSelectedLocale={mockSetSelectedLocale}
            setSelectedLocaleTitle={mockSetSelectedLocaleTitle}
            onExport={mockOnExport}
            setWizardOpen={mockSetWizardOpen}
          />
        </TestWrapper>
      </MockedProvider>
    );
    // Button
    const addLanguageBtn = await screen.findByRole('button', { key: 'language_management_add_language_btn' });
    expect(addLanguageBtn).toBeInTheDocument();
    fireEvent.click(addLanguageBtn);
    expect(await screen.findByTextKey('language_management_locales_modal_title')).toBeInTheDocument();
    expect(await screen.findByTextKey('language_management_locales_modal_subTitle')).toBeInTheDocument();
    await waitFor(async () => {
      expect(await axe(container)).toHaveNoViolations();
    });
  });

  it('Should enable the Add button when a locale is added', async () => {
    render(
      <MockedProvider mocks={extendedMocks}>
        <TestWrapper>
          <LocalesListAndModal
            centerId="test-event-plus"
            setShowLocalesListTable={mockSetShowLocalesListTable}
            setSelectedLocale={mockSetSelectedLocale}
            setSelectedLocaleTitle={mockSetSelectedLocaleTitle}
            onExport={mockOnExport}
            setWizardOpen={mockSetWizardOpen}
          />
        </TestWrapper>
      </MockedProvider>
    );
    // Button
    const addLanguageBtn = await screen.findByRole('button', { key: 'language_management_add_language_btn' });
    expect(addLanguageBtn).toBeInTheDocument();
    fireEvent.click(addLanguageBtn);
    expect(await screen.findByTextKey('language_management_locales_modal_title')).toBeInTheDocument();
    fireEvent.click(await screen.findByRole('checkbox', { name: 'Danish' }));
    const addBtn = await screen.findByRole('button', {
      key: 'language_management_locales_modal_add_btn_accessibility'
    });
    expect(addBtn).toBeInTheDocument();
    fireEvent.click(addBtn);
    expect(addBtn).toBeEnabled();
  });
});

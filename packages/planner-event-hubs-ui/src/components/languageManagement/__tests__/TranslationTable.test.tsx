import { MockedProvider } from '@apollo/client/testing';
import { GetTranslationsDocument } from '@cvent/planner-event-hubs-model/operations';
import { render } from '@testing-library/react';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import { axe } from 'jest-axe';
import 'jest-axe/extend-expect';
import { screen } from 'nucleus-text/testing-library/screen';
import TranslationTable from '../TranslationTable';
import { TranslationTypes } from '../LanguageManagement';

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
      query: GetTranslationsDocument,
      variables: {
        input: {
          hubId: 'testCenterId',
          locale: 'en-US',
          limit: 25,
          type: 'PhraseApp-Key',
          sort: 'id:ASC',
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
              type: 'PhraseApp-Key',
              locale: 'en-US',
              id: 'show_less_button',
              translatedValue: 'Show less translated',
              defaultValue: 'Show less'
            },
            {
              __typename: 'Translation',
              type: 'PhraseApp-Key',
              locale: 'en-US',
              id: 'single_video_page_speakers_carousel_next',
              translatedValue: 'Next Translated',
              defaultValue: 'Next'
            }
          ],
          paging: {
            nextToken: null,
            currentToken: '123',
            previousToken: null,
            totalCount: 2,
            limit: 25
          }
        }
      },
      loading: false
    }
  }
];

describe('TranslationTable', () => {
  const mockCheckForUnsavedChanges = jest.fn();
  const mockSetDirtyFormTrackerMapRef = jest.fn();
  const mockSetSearchedTranslation = jest.fn();
  const mockSetSortColumn = jest.fn();
  const mockSetSortDirection = jest.fn();
  const mockSetSelectedFilterByType = jest.fn();
  const mockPageLimit = 25;
  const mockSetPageLimit = jest.fn();
  const mockSetDisplaySuccess = jest.fn();

  const mockTracker = {
    current: {}
  };
  it('Should render the component fine', async () => {
    const { container } = render(
      <MockedProvider mocks={queryMocks}>
        <TestWrapper>
          <TranslationTable
            translationType={TranslationTypes.phraseAppKeys}
            centerId="testCenterId"
            locale="en-US"
            title="phraseKeys-title"
            subTitle="phraseKeys-subtitle"
            dirtyFormTrackerMapRef={mockTracker}
            setDirtyFormTrackerMapRef={mockSetDirtyFormTrackerMapRef}
            checkForUnsavedChanges={mockCheckForUnsavedChanges}
            searchedTranslation=""
            setSearchedTranslation={mockSetSearchedTranslation}
            sortColumn="itemId"
            setSortColumn={mockSetSortColumn}
            sortDirection="ASC"
            setSortDirection={mockSetSortDirection}
            selectedFilterByType={TranslationTypes.phraseAppKeys}
            setSelectedFilterByType={mockSetSelectedFilterByType}
            pageLimit={mockPageLimit}
            setPageLimit={mockSetPageLimit}
            setDisplaySuccess={mockSetDisplaySuccess}
          />
        </TestWrapper>
      </MockedProvider>
    );
    expect(await screen.findByText('phraseKeys-title')).toBeInTheDocument();
    expect(screen.getByText('phraseKeys-subtitle')).toBeInTheDocument();
    expect(await screen.findByTextKey('language_management_table_column_base_text')).toBeInTheDocument();
    expect(await screen.findByTextKey('language_management_table_column_custom_text')).toBeInTheDocument();
    // Edit Form
    expect(screen.getByText('Show less translated')).toBeInTheDocument();
    expect(screen.getByText('Next Translated')).toBeInTheDocument();

    // Footer
    expect(screen.getByTextKey('language_management_page_limit_title')).toBeInTheDocument();
    expect(screen.getByText('Displaying results 1 - 2 of 2')).toBeInTheDocument();
    expect(
      screen.getByRole('navigation', { key: 'language_management_pagination_accessibility_label' })
    ).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('Should show text id and text type column for custom translation', async () => {
    const { container } = render(
      <MockedProvider mocks={queryMocks}>
        <TestWrapper>
          <TranslationTable
            translationType={TranslationTypes.customKeys}
            centerId="testCenterId"
            locale="en-US"
            title="custom-title"
            subTitle="custom-subtitle"
            dirtyFormTrackerMapRef={mockTracker}
            setDirtyFormTrackerMapRef={mockSetDirtyFormTrackerMapRef}
            checkForUnsavedChanges={mockCheckForUnsavedChanges}
            searchedTranslation=""
            setSearchedTranslation={mockSetSearchedTranslation}
            sortColumn="itemId"
            setSortColumn={mockSetSortColumn}
            sortDirection="ASC"
            setSortDirection={mockSetSortDirection}
            selectedFilterByType={TranslationTypes.customKeys}
            setSelectedFilterByType={mockSetSelectedFilterByType}
            pageLimit={mockPageLimit}
            setPageLimit={mockSetPageLimit}
            setDisplaySuccess={mockSetDisplaySuccess}
          />
        </TestWrapper>
      </MockedProvider>
    );
    expect(await screen.findByText('custom-title')).toBeInTheDocument();
    expect(await screen.findByTextKey('language_management_table_column_text_id')).toBeInTheDocument();
    expect(await screen.findByTextKey('language_management_table_column_text_type')).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });
});

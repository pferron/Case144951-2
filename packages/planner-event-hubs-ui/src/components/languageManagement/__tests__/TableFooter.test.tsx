import { MockedProvider } from '@apollo/client/testing';
import { GetTranslationsDocument } from '@cvent/planner-event-hubs-model/operations';
import { fireEvent, render } from '@testing-library/react';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import { axe } from 'jest-axe';
import 'jest-axe/extend-expect';
import { screen } from 'nucleus-text/testing-library/screen';
import TableFooter from '../TableFooter';

const queryMocks = [
  {
    request: {
      query: GetTranslationsDocument,
      variables: {
        input: {
          hubId: 'testCenterId',
          locale: 'en-US',
          limit: 25,
          sort: 'id:ASC',
          type: 'PhraseApp-Key',
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
            totalCount: 2
          }
        }
      },
      loading: false
    }
  }
];

describe('TableFooter', () => {
  const mockSetPageSelected = jest.fn();
  const mockSetToken = jest.fn();
  const mockCheckForUnsavedChanges = jest.fn();
  const mockSetPageLimit = jest.fn();
  const mockSetShowErrorInSavingAlert = jest.fn();

  it('Should render the component fine', async () => {
    const { container } = render(
      <MockedProvider>
        <TestWrapper>
          <TableFooter
            selectedPage={1}
            setPageSelected={mockSetPageSelected}
            selectedPageLimit={25}
            setPageLimit={mockSetPageLimit}
            totalCount={2}
            setToken={mockSetToken}
            nextToken="nextToken"
            previousToken=""
            resultsCount={2}
            setShowErrorInSavingAlert={mockSetShowErrorInSavingAlert}
            checkForUnsavedChanges={mockCheckForUnsavedChanges}
          />
        </TestWrapper>
      </MockedProvider>
    );
    const pageLimit = await screen.findAllByText('25');
    expect(pageLimit[0]).toBeInTheDocument();
    expect(await screen.findByText('Displaying results 1 - 2 of 2')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { key: 'language_management_pagination_accessibility_next_btn' })
    ).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('Should check for unsaved changes when next page button is clicked', async () => {
    const { container } = render(
      <MockedProvider>
        <TestWrapper>
          <TableFooter
            selectedPage={1}
            setPageSelected={mockSetPageSelected}
            selectedPageLimit={25}
            setToken={mockSetToken}
            totalCount={30}
            nextToken="nextToken"
            previousToken=""
            resultsCount={2}
            setPageLimit={mockSetPageLimit}
            setShowErrorInSavingAlert={mockSetShowErrorInSavingAlert}
            checkForUnsavedChanges={mockCheckForUnsavedChanges}
          />
        </TestWrapper>
      </MockedProvider>
    );
    const pageLimit = await screen.findAllByText('25');
    expect(pageLimit[0]).toBeInTheDocument();
    const nextBtn = await screen.findByRole('button', { key: 'language_management_pagination_accessibility_next_btn' });
    fireEvent.click(nextBtn);
    expect(mockCheckForUnsavedChanges).toHaveBeenCalled();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('Should check for unsaved changes when page limit is changed  when there are unsaved changes', async () => {
    const { container } = render(
      <MockedProvider mocks={queryMocks}>
        <TestWrapper>
          <TableFooter
            selectedPage={1}
            setPageSelected={mockSetPageSelected}
            selectedPageLimit={25}
            totalCount={2}
            setToken={mockSetToken}
            nextToken="nextToken"
            previousToken=""
            resultsCount={2}
            setPageLimit={mockSetPageLimit}
            setShowErrorInSavingAlert={mockSetShowErrorInSavingAlert}
            checkForUnsavedChanges={mockCheckForUnsavedChanges}
          />
        </TestWrapper>
      </MockedProvider>
    );
    const pageLimitDropDown = await screen.findByRole('button', {
      key: 'language_management_page_limit_accessibility_label'
    });
    expect(pageLimitDropDown).toBeInTheDocument();
    fireEvent.click(pageLimitDropDown);

    const item50 = await screen.findByRole('menuitemradio', { name: '50' });
    expect(item50).toBeInTheDocument();
    fireEvent.click(item50);
    expect(mockCheckForUnsavedChanges).toHaveBeenCalled();
    expect(await axe(container)).toHaveNoViolations();
  });
});

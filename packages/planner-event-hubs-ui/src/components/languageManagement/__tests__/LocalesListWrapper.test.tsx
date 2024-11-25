import { InMemoryCache } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import { axe } from 'jest-axe';
import 'jest-axe/extend-expect';
import { screen } from 'nucleus-text/testing-library/screen';
import LocalesListWrapper from '../LocalesListWrapper';
import { queryMocks, mockHub } from './fixtures/queryMocks';

jest.mock('@hooks/useCenterInfo', () => ({
  useCenterInfo: () => {
    return {
      hubData: mockHub.hub
    };
  }
}));

const appFeatures = [
  {
    name: 'enableMultiLanguageFeature',
    enabled: true,
    experimentVersion: '1'
  }
];

const mockSetShowLocalesListTable = jest.fn();
const mockSetSelectedLocale = jest.fn();
const mockSetSelectedLocaleTitle = jest.fn();
const mockOnExport = jest.fn();
const mockSetWizardOpen = jest.fn();

describe('LocalesListWrapper', () => {
  it('Should render the component fine', async () => {
    const { container } = render(
      <MockedProvider mocks={queryMocks}>
        <TestWrapper appFeatures={appFeatures}>
          <LocalesListWrapper
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
    expect(await screen.findByTextKey('language_management_manage_languages_page_title')).toBeInTheDocument();
    expect(screen.getByTextKey('language_management_detect_browser_radio_title')).toBeInTheDocument();
    // Button
    expect(screen.getByRole('button', { key: 'language_management_add_language_btn' })).toBeInTheDocument();
    await waitFor(async () => {
      expect(await axe(container)).toHaveNoViolations();
    });
  });

  it('Should call the mutation when radio options for browser detect is changed', async () => {
    const cache = new InMemoryCache();
    const { container } = render(
      <MockedProvider mocks={queryMocks} cache={cache}>
        <TestWrapper appFeatures={appFeatures}>
          <LocalesListWrapper
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
    const writeQueryMock = jest.spyOn(cache, 'writeQuery');

    expect(await screen.findByTextKey('language_management_manage_languages_page_title')).toBeInTheDocument();
    const radioNoBtn = screen.getByRole('radio', { key: 'language_management_detect_browser_option_no' });
    fireEvent.click(radioNoBtn);
    expect(await screen.findByRole('button', { key: 'language_management_add_language_btn' })).toBeInTheDocument();
    expect(writeQueryMock).toHaveBeenCalled();
    await waitFor(async () => {
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});

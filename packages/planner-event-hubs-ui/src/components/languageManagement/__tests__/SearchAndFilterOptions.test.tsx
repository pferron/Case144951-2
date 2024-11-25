import { fireEvent, render, waitFor } from '@testing-library/react';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import { axe } from 'jest-axe';
import 'jest-axe/extend-expect';
import { screen } from 'nucleus-text/testing-library/screen';
import SearchAndFilterOptions from '../SearchAndFilterOptions';

const mockHandleTypeFilterChange = jest.fn();
const mockHandleSearchUpdate = jest.fn();

describe('SearchAndFilterOptions', () => {
  it('Should render the component fine', async () => {
    const { container } = render(
      <TestWrapper>
        <SearchAndFilterOptions
          selectedFilterByType="All"
          showDropDownFilterByType
          searchedTranslation=""
          handleTypeFilterChange={mockHandleTypeFilterChange}
          handleSearchUpdate={mockHandleSearchUpdate}
        />
      </TestWrapper>
    );

    // Search
    expect(
      await screen.findByRole('textbox', { key: 'language_management_search_input_accessibility' })
    ).toBeInTheDocument();

    // Dropdown
    expect(
      await screen.findByRole('button', { key: 'language_management_filter_by_type_accessibility_label' })
    ).toBeInTheDocument();

    expect(await axe(container)).toHaveNoViolations();
  });

  it('Should not show dropdown when showDropDownFilterByType is false', async () => {
    render(
      <TestWrapper>
        <SearchAndFilterOptions
          selectedFilterByType="All"
          showDropDownFilterByType={false}
          searchedTranslation=""
          handleTypeFilterChange={mockHandleTypeFilterChange}
          handleSearchUpdate={mockHandleSearchUpdate}
        />
      </TestWrapper>
    );

    // Search
    expect(
      await screen.findByRole('textbox', { key: 'language_management_search_input_accessibility' })
    ).toBeInTheDocument();

    expect(
      screen.queryByRole('button', { key: 'language_management_filter_by_type_accessibility_label' })
    ).not.toBeInTheDocument();
  });

  it('Should call handleTypeFilterChange when a value is changed in dropdown', async () => {
    const { container } = render(
      <TestWrapper>
        <SearchAndFilterOptions
          selectedFilterByType="All"
          showDropDownFilterByType
          searchedTranslation=""
          handleTypeFilterChange={mockHandleTypeFilterChange}
          handleSearchUpdate={mockHandleSearchUpdate}
        />
      </TestWrapper>
    );

    expect(
      await screen.findByRole('textbox', { key: 'language_management_search_input_accessibility' })
    ).toBeInTheDocument();

    const dropdownBtn = await screen.findByRole('button', {
      key: 'language_management_filter_by_type_accessibility_label'
    });
    expect(dropdownBtn).toBeInTheDocument();
    fireEvent.click(dropdownBtn);

    const hubItem = await screen.findByRole('menuitemradio', { key: 'language_management_filter_type_option_hub' });
    fireEvent.click(hubItem);

    await waitFor(async () => {
      expect(mockHandleTypeFilterChange).toHaveBeenCalled();
    });
    await waitFor(async () => {
      expect(await axe(container)).toHaveNoViolations();
    });
  });
  it('Should call handleSearchUpdate when searched for a string', async () => {
    render(
      <TestWrapper>
        <SearchAndFilterOptions
          selectedFilterByType="All"
          showDropDownFilterByType
          searchedTranslation=""
          handleTypeFilterChange={mockHandleTypeFilterChange}
          handleSearchUpdate={mockHandleSearchUpdate}
        />
      </TestWrapper>
    );
    const searchInput = await screen.findByRole('textbox', { key: 'language_management_search_input_accessibility' });
    expect(searchInput).toBeInTheDocument();
    fireEvent.change(searchInput, { target: { value: 'New Hub' } });

    const searchIconButton = await screen.findByRole('button', {
      key: 'language_management_search_filter_search_btn_accessibility'
    });
    fireEvent.click(searchIconButton);
    await waitFor(async () => {
      expect(mockHandleTypeFilterChange).toHaveBeenCalled();
    });
  });
});

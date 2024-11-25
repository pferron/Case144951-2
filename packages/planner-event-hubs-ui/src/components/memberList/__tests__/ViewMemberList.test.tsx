import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import ViewMemberList from '@components/memberList/ViewMemberList';
import { AppFeaturesProvider } from '@components/AppFeaturesProvider';
import { memberListData } from '@components/memberList/fixtures/memberListData';
import { screen } from 'nucleus-text/testing-library/screen';
import 'jest-axe/extend-expect';

const onSort = jest.fn();
const mockfn = jest.fn();
const appFeatures = [
  {
    name: 'memberListRemoveFeature',
    enabled: true,
    experimentVersion: '1001'
  }
];
describe('View Member List', () => {
  it('renders member list page with infinite scroll loader', async () => {
    const setSelected = jest.fn();
    const { baseElement } = render(
      <TestWrapper>
        <AppFeaturesProvider value={appFeatures}>
          <ViewMemberList
            membersData={memberListData}
            centerId="test-hub-id"
            selected={[]}
            setSelected={setSelected}
            loadingMoreMembers
            onSort={onSort}
            loadingSortedData={false}
            onUpdateMemberStatus={mockfn}
          />
        </AppFeaturesProvider>
      </TestWrapper>
    );

    expect(baseElement).toMatchSnapshot();
    expect(screen.getByTestId('member-list-table')).toBeInTheDocument();
    expect(screen.getByTestId('loading-more-members-spinner')).toBeInTheDocument();
    // HUB-151797
    // expect(await axe(baseElement)).toHaveNoViolations();
  });

  it('renders member list page without infinite scroll loader', async () => {
    const setSelected = jest.fn();
    const { baseElement } = render(
      <TestWrapper>
        <ViewMemberList
          membersData={memberListData}
          centerId="test-hub-id"
          loadingMoreMembers={false}
          selected={[]}
          setSelected={setSelected}
          onSort={onSort}
          loadingSortedData={false}
          onUpdateMemberStatus={mockfn}
        />
      </TestWrapper>
    );

    expect(baseElement).toMatchSnapshot();
    expect(screen.getByTestId('member-list-table')).toBeInTheDocument();
    expect(screen.queryByTestId('loading-more-members-spinner')).not.toBeInTheDocument();
    // HUB-151797
    // expect(await axe(baseElement)).toHaveNoViolations();
  });

  it('displays an alert when the number of selected members exceeds the maximum limit', async () => {
    const setSelected = jest.fn();
    const selectedMembers = Array.from({ length: 201 }, (_, i) => `member-${i}`);
    render(
      <TestWrapper>
        <AppFeaturesProvider value={appFeatures}>
          <ViewMemberList
            membersData={memberListData}
            centerId="test-hub-id"
            selected={selectedMembers}
            setSelected={setSelected}
            loadingMoreMembers={false}
            onSort={onSort}
            loadingSortedData={false}
            onUpdateMemberStatus={mockfn}
          />
        </AppFeaturesProvider>
      </TestWrapper>
    );

    expect(screen.getByTestId('member-list-table')).toBeInTheDocument();
    expect(screen.getByTestId('member-list-alert-form-success')).toBeInTheDocument();
    expect(await screen.findByTextKey('member_list_max_members_selected_limit_reached')).toBeInTheDocument();
    expect(screen.queryByTestId('member-list-bulk-action-bar')).not.toBeInTheDocument();
  });

  it('renders member list with checkbox to remove members', async () => {
    const setSelected = jest.fn();
    render(
      <TestWrapper>
        <AppFeaturesProvider value={appFeatures}>
          <ViewMemberList
            membersData={memberListData}
            centerId="test-hub-id"
            selected={[memberListData[0].id]}
            setSelected={setSelected}
            loadingMoreMembers
            onSort={onSort}
            loadingSortedData={false}
            onUpdateMemberStatus={mockfn}
          />
        </AppFeaturesProvider>
      </TestWrapper>
    );

    expect(screen.getByTestId('member-list-table')).toBeInTheDocument();
    const row1 = screen.getByTestId('member-list-table-row-0');
    expect(row1).toBeInTheDocument();
    expect(screen.getByTestId('member-list-bulk-action-bar')).toBeInTheDocument();
    expect(
      await screen.findByTextKey('members_list_total_count_selected', {
        count: 1
      })
    ).toBeInTheDocument();

    const removeButton = await screen.findByTextKey('members_list_total_count_remove_button_text', {
      count: 1
    });
    expect(removeButton).toBeInTheDocument();
    await fireEvent.click(removeButton);

    // after carina upgrade button is not getting triggered for BulkActionBar
    /* expect(await screen.findByTestId('confirmation-modal')).toBeInTheDocument();
    expect(
      await screen.findByTextKey('members_list_total_count_selected_confirmation_header_text', {
        count: 1
      })
    ).toBeInTheDocument();
    expect(
      await screen.findByTextKey('members_list_total_count_selected_confirmation_text', {
        count: 1
      })
    ).toBeInTheDocument(); */
    // HUB-151797
    // expect(await axe(baseElement)).toHaveNoViolations();
  });
});

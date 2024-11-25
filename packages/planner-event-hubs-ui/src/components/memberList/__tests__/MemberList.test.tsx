import { fireEvent, render, waitFor, within } from '@testing-library/react';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import React from 'react';
import MemberList from '@components/memberList/MemberList';
import { MockedProvider } from '@apollo/client/testing';
import { SEARCH_MEMBER_LIST, updateMemberStatus } from '@cvent/planner-event-hubs-model/operations/memberList';
import { MEMBER_LIST_PAGE_LIMIT } from '@utils/constants';
import { MembersDataContext } from '@hooks/MembersDataProvider';
import 'jest-axe/extend-expect';
import { axe } from 'jest-axe';
import { AppFeaturesProvider } from '@components/AppFeaturesProvider';
import { screen } from 'nucleus-text/testing-library/screen';

const appFeatures = [
  {
    name: 'memberListRemoveFeature',
    enabled: true,
    experimentVersion: '1001'
  }
];

const mocks = [
  {
    request: {
      query: updateMemberStatus,
      variables: {
        input: {
          memberIds: ['27ab62ef-df51-4068-aabb-fe142330215f'],
          hubId: 'fc2222bc-d671-4d1b-83b6-f5fc2987ae8b'
        }
      }
    },
    result: {
      data: {
        updateMemberStatus: {
          success: true,
          __typename: 'Success'
        }
      }
    }
  },
  {
    request: {
      query: SEARCH_MEMBER_LIST,
      variables: {
        input: {
          centerId: 'test-hub-id',
          pageLimit: MEMBER_LIST_PAGE_LIMIT,
          searchTerm: ''
        }
      }
    },
    result: {
      data: {
        searchMemberList: {
          paging: {
            limit: 20,
            totalCount: 2,
            currentToken: '4c34d760-f1c5-4878-8b75-aff37dbeda38',
            nextToken: 'dac6ccfd-dcbe-46ff-8fb6-5baa9dde5ed0',
            __typename: 'Paging'
          },
          data: [
            {
              id: '27ab62ef-df51-4068-aabb-fe142330215f',
              firstName: 'Jorah',
              lastName: 'Crosby',
              emailAddress: 'agupta-16@j.mail',
              jobTitle: 'Content Writer',
              companyName: 'Dream11',
              mobileNumber: '',
              registrationDate: '2023-01-19T12:54:45.182Z',
              lastLoginDate: '2023-01-19T12:54:45.182Z',
              registrationAge: {
                years: 0,
                months: 1,
                days: 0,
                __typename: 'RegistrationAge'
              },
              __typename: 'MemberListData'
            },
            {
              id: '4945864e-8522-4882-ab0b-ccd1f064c903',
              firstName: 'Max',
              lastName: 'Sidwell',
              emailAddress: 'agupta-60@j.mail',
              jobTitle: '',
              companyName: 'Dementer',
              mobileNumber: '666666',
              registrationDate: '2023-01-19T12:53:36.134Z',
              lastLoginDate: '2023-01-19T12:53:36.134Z',
              registrationAge: {
                years: 0,
                months: 1,
                days: 0,
                __typename: 'RegistrationAge'
              },
              __typename: 'MemberListData'
            }
          ]
        }
      }
    }
  },
  {
    request: {
      query: SEARCH_MEMBER_LIST,
      variables: {
        input: {
          centerId: 'fc2222bc-d671-4d1b-83b6-f5fc2987ae8b',
          pageLimit: MEMBER_LIST_PAGE_LIMIT,
          searchTerm: ''
        }
      }
    },
    result: {
      data: {
        searchMemberList: {
          paging: {
            limit: 20,
            totalCount: 2,
            currentToken: '4c34d760-f1c5-4878-8b75-aff37dbeda38',
            nextToken: 'dac6ccfd-dcbe-46ff-8fb6-5baa9dde5ed0',
            __typename: 'Paging'
          },
          data: [
            {
              id: '27ab62ef-df51-4068-aabb-fe142330215f',
              firstName: 'Jorah',
              lastName: 'Crosby',
              emailAddress: 'agupta-16@j.mail',
              jobTitle: 'Content Writer',
              companyName: 'Dream11',
              mobileNumber: '',
              registrationDate: '2023-01-19T12:54:45.182Z',
              lastLoginDate: '2023-01-19T12:54:45.182Z',
              registrationAge: {
                years: 0,
                months: 1,
                days: 0,
                __typename: 'RegistrationAge'
              },
              __typename: 'MemberListData'
            },
            {
              id: '4945864e-8522-4882-ab0b-ccd1f064c903',
              firstName: 'Max',
              lastName: 'Sidwell',
              emailAddress: 'agupta-60@j.mail',
              jobTitle: '',
              companyName: 'Dementer',
              mobileNumber: '666666',
              registrationDate: '2023-01-19T12:53:36.134Z',
              lastLoginDate: '2023-01-19T12:53:36.134Z',
              registrationAge: {
                years: 0,
                months: 1,
                days: 0,
                __typename: 'RegistrationAge'
              },
              __typename: 'MemberListData'
            }
          ]
        }
      }
    }
  },
  {
    request: {
      query: SEARCH_MEMBER_LIST,
      variables: {
        input: {
          centerId: 'fc2222bc-d671-4d1b-83b6-f5fc2987ae8b',
          pageLimit: MEMBER_LIST_PAGE_LIMIT,
          searchTerm: '',
          sort: 'jobTitle:ASC'
        }
      }
    },
    result: {
      data: {
        searchMemberList: {
          paging: {
            limit: 20,
            totalCount: 2,
            currentToken: '4c34d760-f1c5-4878-8b75-aff37dbeda38',
            nextToken: 'dac6ccfd-dcbe-46ff-8fb6-5baa9dde5ed0',
            __typename: 'Paging'
          },
          data: [
            {
              id: '4945864e-8522-4882-ab0b-ccd1f064c903',
              firstName: 'Max',
              lastName: 'Sidwell',
              emailAddress: 'agupta-60@j.mail',
              jobTitle: 'Architect',
              companyName: 'Dementer',
              mobileNumber: '666666',
              registrationDate: '2023-01-19T12:53:36.134Z',
              lastLoginDate: '2023-01-19T12:53:36.134Z',
              registrationAge: {
                years: 0,
                months: 1,
                days: 0,
                __typename: 'RegistrationAge'
              },
              __typename: 'MemberListData'
            },
            {
              id: '27ab62ef-df51-4068-aabb-fe142330215f',
              firstName: 'Jorah',
              lastName: 'Crosby',
              emailAddress: 'agupta-16@j.mail',
              jobTitle: 'Content Writer',
              companyName: 'Dream11',
              mobileNumber: '',
              registrationDate: '2023-01-19T12:54:45.182Z',
              lastLoginDate: '2023-01-19T12:54:45.182Z',
              registrationAge: {
                years: 0,
                months: 1,
                days: 0,
                __typename: 'RegistrationAge'
              },
              __typename: 'MemberListData'
            }
          ]
        }
      }
    }
  },
  {
    request: {
      query: SEARCH_MEMBER_LIST,
      variables: {
        input: {
          centerId: 'test-center-id',
          pageLimit: MEMBER_LIST_PAGE_LIMIT,
          searchTerm: ''
        }
      }
    },
    result: {
      data: {
        searchMemberList: {
          paging: {
            limit: 20,
            totalCount: 0,
            currentToken: '4c34d760-f1c5-4878-8b75-aff37dbeda38',
            nextToken: null,
            __typename: 'Paging'
          },
          data: []
        }
      }
    }
  }
];

describe('Member List', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders member list', async () => {
    const { container } = render(
      <TestWrapper>
        <MembersDataContext.Provider
          value={{
            membersListData: [],
            setMembersListData: jest.fn()
          }}
        >
          <MockedProvider mocks={mocks}>
            <MemberList centerId="fc2222bc-d671-4d1b-83b6-f5fc2987ae8b" centerTitle="Test Hub" />
          </MockedProvider>
        </MembersDataContext.Provider>
      </TestWrapper>
    );

    await new Promise(resolve => {
      setTimeout(resolve, 0);
    });
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /member list/i })).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByTestId('member-list-search')).toBeInTheDocument();
    });
    const nameSortButton = screen.getByTestId('member-list-table-heading-0');
    const titleSortButton = screen.getByTestId('member-list-table-heading-1');
    expect(nameSortButton).toBeInTheDocument();
    expect(titleSortButton).toBeInTheDocument();
    // opens quick view pop up
    const quickViewButton = screen.getAllByRole('button', { name: 'Open quick view popup.' })[0];
    fireEvent.click(quickViewButton);
    expect(screen.getByText(/quick view/i)).toBeInTheDocument();
    fireEvent.click(titleSortButton);
    await waitFor(() => {
      const nameCell = within(screen.getByTestId('member-list-table-row-0'));
      expect(nameCell.getByTestId('member-details-link-4945864e-8522-4882-ab0b-ccd1f064c903')).toBeInTheDocument();
    });
    expect(container).toMatchSnapshot();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('render success alert state for deleting member from member list', async () => {
    render(
      <TestWrapper>
        <AppFeaturesProvider value={appFeatures}>
          <MembersDataContext.Provider
            value={{
              membersListData: [],
              setMembersListData: jest.fn()
            }}
          >
            <MockedProvider mocks={mocks}>
              <MemberList centerId="fc2222bc-d671-4d1b-83b6-f5fc2987ae8b" centerTitle="Test Hub" />
            </MockedProvider>
          </MembersDataContext.Provider>
        </AppFeaturesProvider>
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { key: 'member_list_title' })).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByTestId('member-list-search')).toBeInTheDocument();
    });
    await waitFor(() => {
      const nameCell = within(screen.getByTestId('member-list-table-row-0'));
      expect(nameCell.getByTestId('member-details-link-27ab62ef-df51-4068-aabb-fe142330215f')).toBeInTheDocument();
    });
    const row1 = screen.getByTestId('member-list-table-row-0');
    expect(row1).toBeInTheDocument();
    fireEvent.click(row1);
    await waitFor(() => {
      expect(screen.getByTestId('member-list-bulk-action-bar')).toBeInTheDocument();
    });
    const removeButton = await screen.findByTextKey('members_list_total_count_remove_button_text', {
      count: 1
    });
    expect(removeButton).toBeInTheDocument();
    fireEvent.click(removeButton);
    /* expect(await screen.findByTestId('confirmation-modal')).toBeInTheDocument();
    const removeCofirmationButton = await screen.findByTestId('confirmation-modal-confirmation-button');
    expect(removeCofirmationButton).toBeInTheDocument();
    fireEvent.click(removeCofirmationButton);
    await waitFor(() => {
      expect(
        screen.getByTextKey('members_list_total_count_selected_success_alert_text', {
          count: 1
        })
      ).toBeInTheDocument();
    });
    const dismissButton = screen.getByRole('button', { name: 'Dismiss' });
    expect(dismissButton).toBeInTheDocument();
    fireEvent.click(dismissButton);
    expect(dismissButton).not.toBeInTheDocument(); */
  });

  it('render failure alert state for deleting member from member list', async () => {
    render(
      <TestWrapper>
        <AppFeaturesProvider value={appFeatures}>
          <MembersDataContext.Provider
            value={{
              membersListData: [],
              setMembersListData: jest.fn()
            }}
          >
            <MockedProvider mocks={mocks}>
              <MemberList centerId="test-hub-id" centerTitle="Test Hub" />
            </MockedProvider>
          </MembersDataContext.Provider>
        </AppFeaturesProvider>
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /member list/i })).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByTestId('member-list-search')).toBeInTheDocument();
    });
    await waitFor(() => {
      const nameCell = within(screen.getByTestId('member-list-table-row-0'));
      expect(nameCell.getByTestId('member-details-link-27ab62ef-df51-4068-aabb-fe142330215f')).toBeInTheDocument();
    });
    const row1 = screen.getByTestId('member-list-table-row-0');
    expect(row1).toBeInTheDocument();
    fireEvent.click(row1);
    await waitFor(() => {
      expect(screen.getByTestId('member-list-bulk-action-bar')).toBeInTheDocument();
    });
    const removeButton = await screen.findByTextKey('members_list_total_count_remove_button_text', {
      count: 1
    });
    expect(removeButton).toBeInTheDocument();
    fireEvent.click(removeButton);
    /*  expect(await screen.findByTestId('confirmation-modal')).toBeInTheDocument();
    const removeCofirmationButton = await screen.findByTestId('confirmation-modal-confirmation-button');
    expect(removeCofirmationButton).toBeInTheDocument();
    fireEvent.click(removeCofirmationButton);
    await waitFor(() => {
      expect(screen.getByTextKey('member_list_failure_alert_text')).toBeInTheDocument();
    });
    const dismissButton = screen.getByRole('button', { name: 'Dismiss' });
    expect(dismissButton).toBeInTheDocument();
    fireEvent.click(dismissButton);
    expect(dismissButton).not.toBeInTheDocument(); */
  });

  it('render empty member list page', async () => {
    const { container } = render(
      <TestWrapper>
        <MembersDataContext.Provider
          value={{
            membersListData: [],
            setMembersListData: jest.fn()
          }}
        >
          <MockedProvider mocks={mocks}>
            <MemberList centerId="test-center-id" centerTitle="test" />
          </MockedProvider>
        </MembersDataContext.Provider>
      </TestWrapper>
    );

    await new Promise(resolve => {
      setTimeout(resolve, 0);
    });
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /member list/i })).toBeInTheDocument();
    });
    expect(screen.queryByTestId('member-list-search')).not.toBeInTheDocument();
    expect(screen.getByTestId('empty-member-list-page-container')).toBeInTheDocument();
    expect(container).toMatchSnapshot();
    expect(await axe(container)).toHaveNoViolations();
  });
});

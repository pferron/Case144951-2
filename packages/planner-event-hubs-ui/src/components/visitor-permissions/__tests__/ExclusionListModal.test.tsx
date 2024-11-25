import { render, screen, within } from '@testing-library/react';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import React from 'react';
import { VisitorPermissionsProps } from '@components/visitor-permissions/type/VisitorPermissionsProps';
import { GuestVisibility } from '@cvent/planner-event-hubs-model/types';
import ExclusionListModal from '@components/visitor-permissions/ExclusionListModal';
import { MockedProvider } from '@apollo/client/testing';
import userEvent from '@testing-library/user-event';
import { searchContactGroupsQuery } from '@cvent/planner-event-hubs-model/operations/contacts';
import { CONTACT_GROUP_TYPE } from '@utils/constants';
import 'jest-axe/extend-expect';
import { axe } from 'jest-axe';

const mockFunction = jest.fn();
const visitorPermissions: VisitorPermissionsProps = {
  guestVisibility: GuestVisibility.Public,
  emailDomains: [],
  registrationSettingConfigs: {
    allowAllContactsRegistration: false,
    allowContactGroupsRegistration: false,
    allowContactTypesRegistration: false,
    blockListRegistration: false
  },
  contactGroups: [],
  contactTypes: [],
  blockedContacts: [],
  blockedContactGroups: []
};

const searchBlockedContactGroupsMock = [
  {
    request: {
      query: searchContactGroupsQuery,
      variables: {
        input: {
          limit: 100,
          searchTerm: '',
          token: null,
          type: CONTACT_GROUP_TYPE.BLACKLIST
        }
      }
    },
    result: {
      data: {
        searchContactGroups: {
          paging: {
            currentToken: '01359068-064c-479f-b171-7057c11004d6',
            limit: 100,
            totalCount: 2,
            nextToken: null
          },
          data: [
            {
              id: '68585c5e-e4ef-4e55-aa44-dc7cbb265486',
              name: 'Contact exclusion list'
            },
            {
              id: 'dcef630b-42c2-4ef4-8718-c2fcf3093b1b',
              name: 'Excluded People'
            }
          ]
        }
      }
    }
  }
];

const noDataSearchBlockedContactGroupsMock = [
  {
    request: {
      query: searchContactGroupsQuery,
      variables: {
        input: {
          limit: 100,
          searchTerm: '',
          token: null,
          type: CONTACT_GROUP_TYPE.BLACKLIST
        }
      }
    },
    result: {
      data: {
        searchContactGroups: {
          paging: {
            currentToken: '01359068-064c-479f-b171-7057c11004d6',
            limit: 100,
            totalCount: 0,
            nextToken: null
          },
          data: []
        }
      }
    }
  }
];

const randomSearchTermSearchBlockedContactGroupsMock = [
  {
    request: {
      query: searchContactGroupsQuery,
      variables: {
        input: {
          limit: 100,
          searchTerm: 'random',
          token: null,
          type: CONTACT_GROUP_TYPE.BLACKLIST
        }
      }
    },
    result: {
      data: {
        searchContactGroups: {
          paging: {
            currentToken: '01359068-064c-479f-b171-7057c11004d6',
            limit: 100,
            totalCount: 0,
            nextToken: null
          },
          data: []
        }
      }
    }
  }
];

describe('Contact Group Modal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders contact group modal', async () => {
    const setIsPageEdited = jest.fn();
    const { container, baseElement } = render(
      <TestWrapper>
        <MockedProvider mocks={searchBlockedContactGroupsMock}>
          <ExclusionListModal
            isOpen
            setIsModalOpen={mockFunction}
            exclusionListSelected={[]}
            setExclusionListSelected={mockFunction}
            testId="exclusion-lists-modal"
            modalTitle="title"
            tableHeading="name"
            searchBoxLabel="Search Input"
            originalExclusionLists={visitorPermissions.blockedContactGroups}
            setIsPageEdited={setIsPageEdited}
          />
        </MockedProvider>
      </TestWrapper>
    );
    await new Promise(resolve => {
      setTimeout(resolve, 0);
    });
    expect(baseElement).toMatchSnapshot();
    const blockedContactGroupModal = within(screen.getByTestId('exclusion-lists-modal'));
    expect(screen.getByText('title')).toBeInTheDocument();
    expect(blockedContactGroupModal.getByRole('textbox', { name: /Search Input/i })).toBeInTheDocument();
    expect(await blockedContactGroupModal.findByTestId('exclusion-lists-modal-table')).toBeInTheDocument();
    expect(blockedContactGroupModal.getByRole('button', { name: /Search/i })).toBeInTheDocument();
    expect(blockedContactGroupModal.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();
    expect(blockedContactGroupModal.getByRole('button', { name: /Save/i })).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders contact group modal - no data', async () => {
    const setIsPageEdited = jest.fn();
    const { container, baseElement } = render(
      <TestWrapper>
        <MockedProvider mocks={noDataSearchBlockedContactGroupsMock}>
          <ExclusionListModal
            isOpen
            setIsModalOpen={mockFunction}
            exclusionListSelected={[]}
            setExclusionListSelected={mockFunction}
            testId="exclusion-lists-modal"
            modalTitle="title"
            tableHeading="name"
            searchBoxLabel="Search Input"
            originalExclusionLists={visitorPermissions.blockedContactGroups}
            setIsPageEdited={setIsPageEdited}
          />
        </MockedProvider>
      </TestWrapper>
    );
    await new Promise(resolve => {
      setTimeout(resolve, 0);
    });
    expect(baseElement).toMatchSnapshot();
    const blockedContactGroupModal = within(screen.getByTestId('exclusion-lists-modal'));
    expect(screen.getByText('title')).toBeInTheDocument();
    expect(blockedContactGroupModal.getByRole('textbox', { name: /Search Input/i })).toBeInTheDocument();
    expect(blockedContactGroupModal.getByTestId('exclusion-lists-modal-empty-page-container')).toBeInTheDocument();
    expect(screen.getByText("You haven't added any contacts yet")).toBeInTheDocument();
    expect(blockedContactGroupModal.getByRole('button', { name: /Search/i })).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders contact group modal - no search result', async () => {
    const setIsPageEdited = jest.fn();
    const { baseElement } = render(
      <TestWrapper>
        <MockedProvider mocks={randomSearchTermSearchBlockedContactGroupsMock}>
          <ExclusionListModal
            isOpen
            setIsModalOpen={mockFunction}
            exclusionListSelected={[]}
            setExclusionListSelected={mockFunction}
            testId="exclusion-lists-modal"
            modalTitle="title"
            tableHeading="name"
            searchBoxLabel="Search Input"
            originalExclusionLists={visitorPermissions.blockedContactGroups}
            setIsPageEdited={setIsPageEdited}
          />
        </MockedProvider>
      </TestWrapper>
    );
    await new Promise(resolve => {
      setTimeout(resolve, 0);
    });
    expect(baseElement).toMatchSnapshot();
    const blockedContactGroupModal = within(screen.getByTestId('exclusion-lists-modal'));
    expect(screen.getByText('title')).toBeInTheDocument();
    const searchBox = blockedContactGroupModal.getByRole('textbox', { name: /Search Input/i });
    expect(searchBox).toBeInTheDocument();
    userEvent.type(searchBox, 'random');
    const searchButton = blockedContactGroupModal.getByRole('button', { name: /Search/i });
    userEvent.click(searchButton);
    await new Promise(resolve => {
      setTimeout(resolve, 0);
    });
    // HUB-151797
    // expect(await axe(baseElement)).toHaveNoViolations();
    /*  expect(
     await blockedContactGroupModal.findByTestId('exclusion-lists-modal-no-search-result-container')
    ).toBeInTheDocument(); */
    // eslint-disable-next-line @typescript-eslint/quotes
    //  expect(screen.getByText(`We couldn't find any results for "random"`)).toBeInTheDocument();
  });
});

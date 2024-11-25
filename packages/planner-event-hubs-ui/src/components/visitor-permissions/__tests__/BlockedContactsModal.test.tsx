import { searchContactsQuery } from '@cvent/planner-event-hubs-model/operations/contacts';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import { MockedProvider } from '@apollo/client/testing';
import React from 'react';
import { VisitorPermissionsProps } from '@components/visitor-permissions/type/VisitorPermissionsProps';
import { GuestVisibility } from '@cvent/planner-event-hubs-model/types';
import userEvent from '@testing-library/user-event';
import BlockedContactsModal from '@components/visitor-permissions/BlockedContactsModal';
import 'jest-axe/extend-expect';

const mockFunction = jest.fn();
const visitorPermissions: VisitorPermissionsProps = {
  guestVisibility: GuestVisibility.Public,
  emailDomains: [],
  registrationSettingConfigs: {
    allowAllContactsRegistration: false,
    allowContactGroupsRegistration: false,
    allowContactTypesRegistration: false,
    blockContactsRegistration: false,
    blockListRegistration: false
  },
  contactGroups: [],
  contactTypes: [],
  blockedContacts: [],
  blockedContactGroups: []
};
const searchContactsMock = [
  {
    request: {
      query: searchContactsQuery,
      variables: {
        input: {
          limit: 100,
          searchTerm: '',
          token: null
        }
      }
    },
    result: {
      data: {
        searchContacts: {
          paging: {
            currentToken: '01359068-064c-479f-b171-7057c11004d6',
            limit: 100,
            totalCount: 1,
            nextToken: null
          },
          data: [
            {
              id: '68585c5e-e4ef-4e55-aa44-dc7cbb265486',
              firstName: 'Amrinder',
              lastName: 'Gill',
              email: 'amrindergill@gmail.com'
            },
            {
              id: 'dcef630b-42c2-4ef4-8718-c2fcf3093b1b',
              firstName: 'Sonam',
              lastName: 'Bajwa',
              email: 'sonambajwa@gmail.com'
            },
            {
              id: '4b5d9bff-fe7c-4cc8-939a-b78a605a3b9b',
              firstName: 'Neeru',
              lastName: 'Bajwa',
              email: 'neerubajwa@gmail.com'
            }
          ]
        }
      }
    }
  }
];

const noDataSearchContactsMock = [
  {
    request: {
      query: searchContactsQuery,
      variables: {
        input: {
          limit: 100,
          searchTerm: '',
          token: null
        }
      }
    },
    result: {
      data: {
        searchContacts: {
          paging: {
            currentToken: '01359068-064c-479f-b171-7057c11004d6',
            limit: 100,
            totalCount: 1,
            nextToken: null
          },
          data: []
        }
      }
    }
  }
];

const randomSearchTermSearchContactsMock = [
  {
    request: {
      query: searchContactsQuery,
      variables: {
        input: {
          limit: 100,
          searchTerm: 'random',
          token: null
        }
      }
    },
    result: {
      data: {
        searchContacts: {
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

const nullFirstNameMock = [
  {
    request: {
      query: searchContactsQuery,
      variables: {
        input: {
          limit: 100,
          searchTerm: '',
          token: null
        }
      }
    },
    result: {
      data: {
        searchContacts: {
          paging: {
            currentToken: '01359068-064c-479f-b171-7057c11004d6',
            limit: 100,
            totalCount: 1,
            nextToken: null
          },
          data: [
            {
              id: '68585c5e-e4ef-4e55-aa44-dc7cbb265486',
              firstName: null,
              lastName: 'Gill',
              email: 'amrindergill@gmail.com'
            },
            {
              id: 'dcef630b-42c2-4ef4-8718-c2fcf3093b1b',
              firstName: 'Sonam',
              lastName: 'Bajwa',
              email: 'sonambajwa@gmail.com'
            },
            {
              id: '4b5d9bff-fe7c-4cc8-939a-b78a605a3b9b',
              firstName: 'Neeru',
              lastName: 'Bajwa',
              email: 'neerubajwa@gmail.com'
            }
          ]
        }
      }
    }
  }
];

describe('Blocked Contacts Modal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('renders blocked contacts modal', async () => {
    const setIsPageEdited = jest.fn();
    const { baseElement } = render(
      <TestWrapper>
        <MockedProvider mocks={searchContactsMock}>
          <BlockedContactsModal
            isOpen
            setIsModalOpen={mockFunction}
            contactSelected={[]}
            setContactSelected={mockFunction}
            testId="blocked-contacts-modal"
            modalTitle="title"
            tableHeading="name"
            searchBoxLabel="Search Input"
            originalBlockedContacts={visitorPermissions.blockedContacts}
            setIsPageEdited={setIsPageEdited}
          />
        </MockedProvider>
      </TestWrapper>
    );
    await new Promise(resolve => {
      setTimeout(resolve, 0);
    });
    expect(await screen.findByText('title')).toBeInTheDocument();
    const blockedContactModal = within(screen.getByTestId('blocked-contacts-modal'));
    expect(blockedContactModal.getByRole('textbox', { name: /Search Input/i })).toBeInTheDocument();
    expect(await blockedContactModal.findByRole('button', { name: /Search/i })).toBeInTheDocument();
    expect(await blockedContactModal.findByRole('button', { name: /Cancel/i })).toBeInTheDocument();
    expect(await blockedContactModal.findByRole('button', { name: /Save/i })).toBeInTheDocument();
    expect(blockedContactModal.getByText('amrindergill@gmail.com')).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
    // HUB-151797
    // expect(await axe(baseElement)).toHaveNoViolations();
  });

  it('renders blocked contact modal - no data', async () => {
    const setIsPageEdited = jest.fn();
    const { baseElement } = render(
      <TestWrapper>
        <MockedProvider mocks={noDataSearchContactsMock}>
          <BlockedContactsModal
            isOpen
            setIsModalOpen={mockFunction}
            contactSelected={[]}
            setContactSelected={mockFunction}
            testId="blocked-contacts-modal"
            modalTitle="title"
            tableHeading="name"
            searchBoxLabel="Search Input"
            originalBlockedContacts={visitorPermissions.blockedContacts}
            setIsPageEdited={setIsPageEdited}
          />
        </MockedProvider>
      </TestWrapper>
    );
    await new Promise(resolve => {
      setTimeout(resolve, 0);
    });
    expect(baseElement).toMatchSnapshot();
    const blockedContactModal = within(screen.getByTestId('blocked-contacts-modal'));
    expect(screen.getByText('title')).toBeInTheDocument();
    expect(blockedContactModal.getByRole('textbox', { name: /Search Input/i })).toBeInTheDocument();
    expect(blockedContactModal.getByTestId('blocked-contacts-modal-empty-page-container')).toBeInTheDocument();
    expect(screen.getByText("You haven't added any contacts yet")).toBeInTheDocument();
    expect(blockedContactModal.getByRole('button', { name: /Search/i })).toBeInTheDocument();
    // HUB-151797
    // expect(await axe(baseElement)).toHaveNoViolations();
  });

  it('renders blocked contact modal modal - no search result', async () => {
    const setIsPageEdited = jest.fn();
    const { baseElement } = render(
      <TestWrapper>
        <MockedProvider mocks={randomSearchTermSearchContactsMock}>
          <BlockedContactsModal
            isOpen
            setIsModalOpen={mockFunction}
            contactSelected={[]}
            setContactSelected={mockFunction}
            testId="blocked-contacts-modal"
            modalTitle="title"
            tableHeading="name"
            searchBoxLabel="Search Input"
            originalBlockedContacts={visitorPermissions.blockedContacts}
            setIsPageEdited={setIsPageEdited}
          />
        </MockedProvider>
      </TestWrapper>
    );
    await new Promise(resolve => {
      setTimeout(resolve, 0);
    });
    expect(baseElement).toMatchSnapshot();
    const blockedContactModal = within(screen.getByTestId('blocked-contacts-modal'));
    expect(screen.getByText('title')).toBeInTheDocument();
    const searchBox = blockedContactModal.getByRole('textbox', { name: /Search Input/i });
    expect(searchBox).toBeInTheDocument();
    await userEvent.type(searchBox, 'random');
    const searchButton = blockedContactModal.getByRole('button', { name: /Search/i });
    fireEvent.click(searchButton);
    await new Promise(resolve => {
      setTimeout(resolve, 0);
    });

    expect(await screen.findByTestId('blocked-contacts-modal')).toBeInTheDocument();
    expect(blockedContactModal.queryByRole('button', { name: /Save/i })).not.toBeInTheDocument();
  });

  it('renders blocked contacts modal with null first name', async () => {
    const setIsPageEdited = jest.fn();
    const { baseElement } = render(
      <TestWrapper>
        <MockedProvider mocks={nullFirstNameMock}>
          <BlockedContactsModal
            isOpen
            setIsModalOpen={mockFunction}
            contactSelected={[]}
            setContactSelected={mockFunction}
            testId="blocked-contacts-modal"
            modalTitle="title"
            tableHeading="name"
            searchBoxLabel="Search Input"
            originalBlockedContacts={visitorPermissions.blockedContacts}
            setIsPageEdited={setIsPageEdited}
          />
        </MockedProvider>
      </TestWrapper>
    );

    await new Promise(resolve => {
      setTimeout(resolve, 0);
    });

    expect(await screen.findByText('title')).toBeInTheDocument();
    const modalContent = within(screen.getByTestId('blocked-contacts-modal'));
    expect(modalContent.getByRole('textbox', { name: /Search Input/i })).toBeInTheDocument();
    expect(await modalContent.findByTestId('blocked-contacts-modal-table')).toBeInTheDocument();
    expect(modalContent.getByRole('button', { name: /Search/i })).toBeInTheDocument();
    expect(modalContent.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();
    expect(modalContent.getByRole('button', { name: /Save/i })).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();

    const contactRows = modalContent.getAllByRole('row');
    expect(contactRows.length).toBe(4); // Including table header row
    expect(within(contactRows[1]).getByText('Gill')).toBeInTheDocument();
    expect(within(contactRows[2]).getByText('Sonam Bajwa')).toBeInTheDocument();
    expect(within(contactRows[3]).getByText('Neeru Bajwa')).toBeInTheDocument();
    // HUB-151797
    // expect(await axe(baseElement)).toHaveNoViolations();
  });
});

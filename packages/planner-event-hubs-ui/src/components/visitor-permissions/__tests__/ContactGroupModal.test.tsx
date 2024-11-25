import { searchContactGroupsQuery } from '@cvent/planner-event-hubs-model/operations/contacts';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import { MockedProvider } from '@apollo/client/testing';
import React from 'react';
import ContactGroupModal from '@components/visitor-permissions/ContactGroupModal';
import { VisitorPermissionsProps } from '@components/visitor-permissions/type/VisitorPermissionsProps';
import { GuestVisibility } from '@cvent/planner-event-hubs-model/types';
import userEvent from '@testing-library/user-event';
import { CONTACT_GROUP_TYPE } from '@utils/constants';
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
const searchContactGroupsMock = [
  {
    request: {
      query: searchContactGroupsQuery,
      variables: {
        input: {
          limit: 100,
          searchTerm: '',
          token: null,
          type: CONTACT_GROUP_TYPE.STANDARD
        }
      }
    },
    result: {
      data: {
        searchContactGroups: {
          paging: {
            currentToken: '01359068-064c-479f-b171-7057c11004d6',
            limit: 100,
            totalCount: 1,
            nextToken: null
          },
          data: [
            {
              id: '68585c5e-e4ef-4e55-aa44-dc7cbb265486',
              name: 'Summer Camp'
            },
            {
              id: 'dcef630b-42c2-4ef4-8718-c2fcf3093b1b',
              name: 'Contact Inf'
            },
            {
              id: '4b5d9bff-fe7c-4cc8-939a-b78a605a3b9b',
              name: 'New VIP Members'
            }
          ]
        }
      }
    }
  }
];

const noDataSearchContactGroupsMock = [
  {
    request: {
      query: searchContactGroupsQuery,
      variables: {
        input: {
          limit: 100,
          searchTerm: '',
          token: null,
          type: CONTACT_GROUP_TYPE.STANDARD
        }
      }
    },
    result: {
      data: {
        searchContactGroups: {
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

const randomSearchTermSearchContactGroupsMock = [
  {
    request: {
      query: searchContactGroupsQuery,
      variables: {
        input: {
          limit: 100,
          searchTerm: 'random',
          token: null,
          type: CONTACT_GROUP_TYPE.STANDARD
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
    const { baseElement } = render(
      <TestWrapper>
        <MockedProvider mocks={searchContactGroupsMock}>
          <ContactGroupModal
            isOpen
            setIsModalOpen={mockFunction}
            contactGroupSelected={[]}
            setContactGroupSelected={mockFunction}
            testId="contact-group-modal"
            modalTitle="title"
            tableHeading="name"
            searchBoxLabel="Search Input"
            registrationSettings={visitorPermissions}
            setIsPageEdited={setIsPageEdited}
            originalContactGroupSelected={[]}
          />
        </MockedProvider>
      </TestWrapper>
    );
    await new Promise(resolve => {
      setTimeout(resolve, 0);
    });
    expect(baseElement).toMatchSnapshot();
    const contactGroupModal = within(screen.getByTestId('contact-group-modal'));
    expect(screen.getByText('title')).toBeInTheDocument();
    expect(contactGroupModal.getByRole('textbox', { name: /Search Input/i })).toBeInTheDocument();
    expect(await contactGroupModal.findByTestId('contact-group-modal-table')).toBeInTheDocument();
    expect(contactGroupModal.getByRole('button', { name: /Search/i })).toBeInTheDocument();
    expect(contactGroupModal.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();
    expect(contactGroupModal.getByRole('button', { name: /Save/i })).toBeInTheDocument();
    // HUB-151797
    // expect(await axe(baseElement)).toHaveNoViolations();
  });

  it('renders contact group modal - no data', async () => {
    const setIsPageEdited = jest.fn();
    const { baseElement } = render(
      <TestWrapper>
        <MockedProvider mocks={noDataSearchContactGroupsMock}>
          <ContactGroupModal
            isOpen
            setIsModalOpen={mockFunction}
            contactGroupSelected={[]}
            setContactGroupSelected={mockFunction}
            testId="contact-group-modal"
            modalTitle="title"
            tableHeading="name"
            searchBoxLabel="Search Input"
            registrationSettings={visitorPermissions}
            setIsPageEdited={setIsPageEdited}
            originalContactGroupSelected={[]}
          />
        </MockedProvider>
      </TestWrapper>
    );
    await new Promise(resolve => {
      setTimeout(resolve, 0);
    });
    expect(baseElement).toMatchSnapshot();
    const contactGroupModal = within(screen.getByTestId('contact-group-modal'));
    expect(screen.getByText('title')).toBeInTheDocument();
    expect(contactGroupModal.getByRole('textbox', { name: /Search Input/i })).toBeInTheDocument();
    expect(contactGroupModal.getByTestId('contact-group-modal-empty-page-container')).toBeInTheDocument();
    expect(screen.getByText("You haven't added any contact groups yet")).toBeInTheDocument();
    expect(contactGroupModal.getByRole('button', { name: /Search/i })).toBeInTheDocument();
    // HUB-151797
    // expect(await axe(baseElement)).toHaveNoViolations();
  });

  // MAUVE
  // eslint-disable-next-line jest/no-disabled-tests
  it.skip('renders contact group modal - no search result', async () => {
    const setIsPageEdited = jest.fn();
    const { baseElement } = render(
      <TestWrapper>
        <MockedProvider mocks={randomSearchTermSearchContactGroupsMock}>
          <ContactGroupModal
            isOpen
            setIsModalOpen={mockFunction}
            contactGroupSelected={[]}
            setContactGroupSelected={mockFunction}
            testId="contact-group-modal"
            modalTitle="title"
            tableHeading="name"
            searchBoxLabel="Search Input"
            registrationSettings={visitorPermissions}
            setIsPageEdited={setIsPageEdited}
            originalContactGroupSelected={[]}
          />
        </MockedProvider>
      </TestWrapper>
    );
    await new Promise(resolve => {
      setTimeout(resolve, 0);
    });
    expect(baseElement).toMatchSnapshot();
    const contactGroupModal = within(screen.getByTestId('contact-group-modal'));
    expect(screen.getByText('title')).toBeInTheDocument();
    const searchBox = contactGroupModal.getByRole('textbox', { name: /Search Input/i });
    expect(searchBox).toBeInTheDocument();
    userEvent.type(searchBox, 'random');
    const searchButton = contactGroupModal.getByRole('button', { name: /Search/i });
    fireEvent.click(searchButton);
    await new Promise(resolve => {
      setTimeout(resolve, 0);
    });
    expect(await contactGroupModal.findByTestId('contact-group-modal-no-search-result-container')).toBeInTheDocument();
    // eslint-disable-next-line @typescript-eslint/quotes
    expect(screen.getByText(`We couldn't find any results for "random"`)).toBeInTheDocument();
  });
});

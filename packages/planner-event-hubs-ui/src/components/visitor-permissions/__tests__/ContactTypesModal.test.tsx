import { searchContactTypesQuery } from '@cvent/planner-event-hubs-model/operations/contacts';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import { MockedProvider } from '@apollo/client/testing';
import React from 'react';
import { VisitorPermissionsProps } from '@components/visitor-permissions/type/VisitorPermissionsProps';
import { GuestVisibility } from '@cvent/planner-event-hubs-model/types';
import userEvent from '@testing-library/user-event';
import ContactTypesModal from '@components/visitor-permissions/ContactTypesModal';
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
const searchContactTypesMock = [
  {
    request: {
      query: searchContactTypesQuery,
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
        searchContactTypes: {
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

const noDataSearchContactTypesMock = [
  {
    request: {
      query: searchContactTypesQuery,
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
        searchContactTypes: {
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

const randomSearchTermSearchContactTypesMock = [
  {
    request: {
      query: searchContactTypesQuery,
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
        searchContactTypes: {
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

describe('Contact Types Modal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('renders contact Types modal', async () => {
    const setIsPageEdited = jest.fn();
    const { baseElement } = render(
      <TestWrapper>
        <MockedProvider mocks={searchContactTypesMock}>
          <ContactTypesModal
            isOpen
            setIsModalOpen={mockFunction}
            contactTypesSelected={[]}
            setContactTypesSelected={mockFunction}
            testId="contact-types-modal"
            modalTitle="title"
            tableHeading="name"
            searchBoxLabel="Search Input"
            originalContactTypes={visitorPermissions.contactTypes}
            setIsPageEdited={setIsPageEdited}
          />
        </MockedProvider>
      </TestWrapper>
    );
    await new Promise(resolve => {
      setTimeout(resolve, 0);
    });
    expect(baseElement).toMatchSnapshot();
    const contactTypeModal = within(screen.getByTestId('contact-types-modal'));
    expect(screen.getByText('title')).toBeInTheDocument();
    expect(contactTypeModal.getByRole('textbox', { name: /Search Input/i })).toBeInTheDocument();
    await waitFor(() => {
      expect(contactTypeModal.getByTestId('contact-types-modal-table')).toBeInTheDocument();
    });
    expect(contactTypeModal.getByRole('button', { name: /Search/i })).toBeInTheDocument();
    expect(contactTypeModal.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();
    expect(contactTypeModal.getByRole('button', { name: /Save/i })).toBeInTheDocument();
    // HUB-151797
    // expect(await axe(baseElement)).toHaveNoViolations();
  });

  it('renders contact types modal - no data', async () => {
    const setIsPageEdited = jest.fn();
    const { baseElement } = render(
      <TestWrapper>
        <MockedProvider mocks={noDataSearchContactTypesMock}>
          <ContactTypesModal
            isOpen
            setIsModalOpen={mockFunction}
            contactTypesSelected={[]}
            setContactTypesSelected={mockFunction}
            testId="contact-types-modal"
            modalTitle="title"
            tableHeading="name"
            searchBoxLabel="Search Input"
            originalContactTypes={visitorPermissions.contactTypes}
            setIsPageEdited={setIsPageEdited}
          />
        </MockedProvider>
      </TestWrapper>
    );
    await new Promise(resolve => {
      setTimeout(resolve, 0);
    });
    expect(baseElement).toMatchSnapshot();
    const contactTypesModal = within(screen.getByTestId('contact-types-modal'));
    expect(screen.getByText('title')).toBeInTheDocument();
    expect(contactTypesModal.getByRole('textbox', { name: /Search Input/i })).toBeInTheDocument();
    expect(contactTypesModal.getByTestId('contact-types-modal-empty-page-container')).toBeInTheDocument();
    expect(screen.getByText("You haven't added any contact types yet")).toBeInTheDocument();
    expect(contactTypesModal.getByRole('button', { name: /Search/i })).toBeInTheDocument();
    // HUB-151797
    // expect(await axe(baseElement)).toHaveNoViolations();
  });

  // fireball
  // eslint-disable-next-line jest/no-disabled-tests
  it.skip('renders contact types modal - no search result', async () => {
    const setIsPageEdited = jest.fn();
    const { baseElement } = render(
      <TestWrapper>
        <MockedProvider mocks={randomSearchTermSearchContactTypesMock}>
          <ContactTypesModal
            isOpen
            setIsModalOpen={mockFunction}
            contactTypesSelected={[]}
            setContactTypesSelected={mockFunction}
            testId="contact-types-modal"
            modalTitle="title"
            tableHeading="name"
            searchBoxLabel="Search Input"
            originalContactTypes={visitorPermissions.contactTypes}
            setIsPageEdited={setIsPageEdited}
          />
        </MockedProvider>
      </TestWrapper>
    );
    await new Promise(resolve => {
      setTimeout(resolve, 0);
    });
    expect(baseElement).toMatchSnapshot();
    const contactTypesModal = within(screen.getByTestId('contact-types-modal'));
    expect(screen.getByText('title')).toBeInTheDocument();
    const searchBox = contactTypesModal.getByRole('textbox', { name: /Search Input/i });
    expect(searchBox).toBeInTheDocument();
    userEvent.type(searchBox, 'random');
    const searchButton = contactTypesModal.getByRole('button', { name: /Search/i });
    fireEvent.click(searchButton);
    await new Promise(resolve => {
      setTimeout(resolve, 0);
    });

    await waitFor(() => {
      expect(contactTypesModal.getByTestId('contact-types-modal-no-search-result-container')).toBeInTheDocument();
    });

    // eslint-disable-next-line @typescript-eslint/quotes
    expect(screen.getByText(`We couldn't find any results for "random"`)).toBeInTheDocument();
  });
});

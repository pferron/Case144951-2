import { fireEvent, render, waitFor } from '@testing-library/react';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import React from 'react';
import MemberDetails from '@components/memberList/MemberDetails';
import { MockedProvider } from '@apollo/client/testing';
import { GET_VIDEO_HUB } from '@cvent/planner-event-hubs-model/operations/hub';
import { memberLogin } from '@cvent/planner-event-hubs-model/operations/login';
import { GraphQLError } from 'graphql/error';
import { GET_MEMBER_PROFILE_DATA } from '@cvent/planner-event-hubs-model/operations/profile';
import { AppFeaturesProvider } from '@components/AppFeaturesProvider';
import { screen } from 'nucleus-text/testing-library/screen';
import { MembersDataContext } from '@hooks/MembersDataProvider';
import { memberListData } from '@components/memberList/fixtures/memberListData';
import 'jest-axe/extend-expect';
import { axe } from 'jest-axe';

jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '',
      query: {
        'member-id': '1',
        'video-center': 'test'
      },
      asPath: '',
      replace: jest.fn()
      // replace: async () => new Promise<boolean>(resolve => resolve(true))
    };
  }
}));

const appFeatures = [
  {
    name: 'memberListRemoveFeature',
    enabled: true,
    experimentVersion: '1001'
  }
];

jest.mock('next/config', () => () => ({
  publicRuntimeConfig: {
    VIDEO_HUB_WEB: process.env.VIDEO_HUB_WEB,
    ENVIRONMENT_TYPE: 'T2',
    ENVIRONMENT_NAME: 'T2',
    ENVIRONMENT: process.env.ENVIRONMENT
  }
}));

const videoHubMock = {
  request: {
    query: GET_VIDEO_HUB,
    variables: { hubID: { id: 'test' } }
  },
  result: {
    data: {
      hub: {
        id: 'test-video-hub',
        status: 'Inactive',
        config: {
          ownerEmail: 'mbrady@cvent.com',
          ownerFirstName: 'Mike',
          ownerLastName: 'Brady',
          title: 'Test Video Center One',
          url: 'https://google.com',
          locale: 'en-US',
          helpEmailAddress: 'help@cvent.com'
        },
        theme: {
          actionColor: '',
          backgroundColor: '',
          logoImageRelativePath: '',
          logoImageUrl: '',
          logoOriginalImageUrl: '',
          mainColor: ''
        }
      }
    }
  }
};

const memberLoginQueryRequest = {
  query: memberLogin,
  variables: {
    memberLoginInput: {
      hubId: 'test',
      memberInfo: {
        firstName: 'Vincent',
        lastName: 'Coral',
        email: 'asd@test.mail'
      }
    }
  }
};

const mocks = [
  {
    request: memberLoginQueryRequest,
    result: {
      data: {
        memberLogin: {
          id: '7d5c2f12-716a-4032-9acc-58bb2123d1f1',
          emailLocked: null,
          expirationDate: '2023-01-10T13:36:13.000Z'
        }
      }
    }
  },
  {
    request: {
      query: GET_MEMBER_PROFILE_DATA,
      variables: {
        input: {
          centerId: 'test',
          contactId: '1'
        }
      }
    },
    result: {
      data: {
        getMemberData: {
          profile: {
            firstName: 'Jorah',
            lastName: 'Crosby',
            emailAddress: 'agupta-16@j.mail',
            jobTitle: 'Content Writer',
            companyName: 'Dream11',
            mobileNumber: ''
          }
        }
      }
    }
  },
  { ...videoHubMock }
];

const emailExpiredMocks = [
  {
    request: memberLoginQueryRequest,
    result: {
      data: {
        memberLogin: {
          id: null,
          emailLocked: true,
          expirationDate: null
        }
      }
    }
  },
  { ...videoHubMock }
];

const errorMocks = [
  {
    request: memberLoginQueryRequest,
    result: {
      errors: [new GraphQLError('Error generating in login link!')]
    }
  },
  { ...videoHubMock }
];

describe('Member Details', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders member details and login link component', async () => {
    const { container } = render(
      <TestWrapper>
        <MembersDataContext.Provider
          value={{
            membersListData: memberListData,
            setMembersListData: jest.fn()
          }}
        >
          <MockedProvider mocks={mocks}>
            <MemberDetails centerId="test" />
          </MockedProvider>
        </MembersDataContext.Provider>
      </TestWrapper>
    );

    expect(await screen.findByText('Basic Information')).toBeInTheDocument();
    expect(screen.getByText('Vincent')).toBeInTheDocument();
    expect(screen.getByText('Company')).toBeInTheDocument();
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Generate Login Link')).toBeInTheDocument();
    const loginLinkButton = screen.getByText('Generate link');
    expect(loginLinkButton).toBeInTheDocument();
    expect(screen.getByText('This is a one-time link. It’ll be valid for 24 hours.')).toBeInTheDocument();
    fireEvent.click(loginLinkButton);
    await waitFor(async () => {
      expect(await screen.findByTestId('weblink')).toBeInTheDocument();
    });
    // the login url is build upon the short url provided for the hub
    expect(screen.getByTestId('weblink')).toHaveTextContent(
      'https://google.com?env=T2&requestId=7d5c2f12-716a-4032-9acc-58bb2123d1f1'
    );
    const regenerateButton = await screen.findByText('Regenerate');
    expect(regenerateButton).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  }, 10000);

  it('renders member info from graph call and login link component', async () => {
    render(
      <TestWrapper>
        <MembersDataContext.Provider
          value={{
            membersListData: [],
            setMembersListData: jest.fn()
          }}
        >
          <MockedProvider mocks={mocks}>
            <MemberDetails centerId="test" />
          </MockedProvider>
        </MembersDataContext.Provider>
      </TestWrapper>
    );

    await new Promise(resolve => {
      setTimeout(resolve, 200);
    });
    const basicInformationText = await screen.findByText('Basic Information');
    expect(basicInformationText).toBeInTheDocument();
    expect(screen.getByText('Jorah')).toBeInTheDocument();
    expect(screen.getByText('Company')).toBeInTheDocument();
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Generate Login Link')).toBeInTheDocument();
    expect(await screen.findByText('Generate link')).toBeInTheDocument();
    const loginLinkButton = screen.getByText('Generate link');
    expect(loginLinkButton).toBeInTheDocument();
    expect(screen.getByText('This is a one-time link. It’ll be valid for 24 hours.')).toBeInTheDocument();
    // HUB-151797
    // expect(await axe(container)).toHaveNoViolations();
  });

  it('renders login link component with limit exceed warning', async () => {
    const { container } = render(
      <TestWrapper>
        <MembersDataContext.Provider
          value={{
            membersListData: memberListData,
            setMembersListData: jest.fn()
          }}
        >
          <MockedProvider mocks={emailExpiredMocks}>
            <MemberDetails centerId="test" />
          </MockedProvider>
        </MembersDataContext.Provider>
      </TestWrapper>
    );
    await new Promise(resolve => {
      setTimeout(resolve, 200);
    });
    expect(await screen.findByText('Generate link')).toBeInTheDocument();
    const loginLinkButton = await screen.findByText('Generate link');
    await fireEvent.click(loginLinkButton);
    await waitFor(() => {
      expect(screen.getByText('You’ve exceeded the link generation limit')).toBeInTheDocument();
    });
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders login link component with generate error warning', async () => {
    const { container } = render(
      <TestWrapper>
        <MembersDataContext.Provider
          value={{
            membersListData: memberListData,
            setMembersListData: jest.fn()
          }}
        >
          <MockedProvider mocks={errorMocks}>
            <MemberDetails centerId="test" />
          </MockedProvider>
        </MembersDataContext.Provider>
      </TestWrapper>
    );

    expect(await screen.findByText('Generate link')).toBeInTheDocument();
    const loginLinkButton = screen.getByText('Generate link');
    await fireEvent.click(loginLinkButton);
    await waitFor(() => {
      expect(screen.getByText('Couldn’t generate link. Refresh the page and try again.')).toBeInTheDocument();
    });
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders remove button and confirmation modal', async () => {
    const { container } = render(
      <TestWrapper>
        <AppFeaturesProvider value={appFeatures}>
          <MembersDataContext.Provider
            value={{
              membersListData: memberListData,
              setMembersListData: jest.fn()
            }}
          >
            <MockedProvider mocks={mocks}>
              <MemberDetails centerId="test" />
            </MockedProvider>
          </MembersDataContext.Provider>
        </AppFeaturesProvider>
      </TestWrapper>
    );

    const removeButton = screen.getByRole('button', { name: 'Remove member' });
    expect(removeButton).toBeInTheDocument();
    fireEvent.click(removeButton);
    expect(await screen.findByTestId('confirmation-modal')).toBeInTheDocument();
    expect(
      await screen.findByTextKey('members_list_total_count_selected_confirmation_header_text', {
        count: 1
      })
    ).toBeInTheDocument();
    expect(
      await screen.findByTextKey('members_list_total_count_selected_confirmation_text', {
        count: 1
      })
    ).toBeInTheDocument();
    const removeBtn = screen.getByRole('button', { key: 'member_list_confirmation_remove_text' });
    expect(removeBtn).toBeInTheDocument();
    fireEvent.click(removeBtn);
    await waitFor(() => {
      expect(screen.getByTextKey('member_list_failure_alert_text')).toBeInTheDocument();
    });
    const dismissButton = screen.getByRole('button', { name: 'Dismiss' });
    expect(dismissButton).toBeInTheDocument();
    fireEvent.click(dismissButton);
    expect(await axe(container)).toHaveNoViolations();
  });
});

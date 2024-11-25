import React from 'react';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import { screen, render, fireEvent } from '@testing-library/react';
import { TrackingCodes } from '@components/tracking-codes/TrackingCodes';
import { MockedProvider } from '@apollo/client/testing';
import { getHubCodeSnippets } from '@cvent/planner-event-hubs-model/operations/hub';
import { getAccountCodeSnippets } from '@cvent/planner-event-hubs-model/operations/snapshot';
import { accountCodeSnippet } from '@components/tracking-codes/fixtures/CodeSnippetData';
import { accountConfig } from '@cvent/planner-event-hubs-model/src/operations/coreSOA';
import 'jest-axe/extend-expect';

interface RouterProps {
  pathname: string;
  route: string;
  query: {
    isSuccess: boolean;
  };
  replace: () => void;
}

jest.mock('next/router', () => ({
  useRouter(): RouterProps {
    return {
      pathname: '/path',
      route: '/route',
      query: { isSuccess: true },
      replace: jest.fn()
    };
  }
}));

const mocks = [
  {
    request: {
      query: accountConfig
    },
    result: {
      data: {
        accountConfig: {
          AccountFeatures: {
            GeneralFeatures: {
              AllowCodeSnippets: true,
              AllowGoogleAnalytics: true
            }
          }
        }
      }
    }
  },
  {
    request: {
      query: getAccountCodeSnippets
    },
    result: {
      data: {
        getAccountCodeSnippets: {
          allowCodeSnippets: true,
          accountCodeSnippets: accountCodeSnippet
        }
      }
    }
  },
  {
    request: {
      query: getHubCodeSnippets,
      variables: {
        hubId: 'Demo Video Center'
      }
    },
    result: {
      data: {
        getHubCodeSnippets: [
          {
            codeSnippetId: '3ce1554f-5ecc-4182-b838-e20ad46c8a7b',
            applicableOn: 'ALL_PAGES',
            targetWebPages: ['ALL_VC_PAGES', 'LOGIN']
          }
        ]
      }
    }
  }
];

describe('Tracking Codes', () => {
  it('renders Tracking code page', async () => {
    render(
      <MockedProvider mocks={mocks}>
        <TestWrapper>
          <TrackingCodes videoCenterTitle="test-video-center" videoCenterId="Demo Video Center" />
        </TestWrapper>
      </MockedProvider>
    );
    expect(await screen.findByRole('heading', { name: /Tracking codes/i })).toBeInTheDocument();
    expect(await screen.findByText('Code Snippets')).toBeInTheDocument();
    expect(await screen.findByText('Set Google Measurement ID')).toBeInTheDocument();
    expect(await screen.findByText('URL Tracking Parameters')).toBeInTheDocument();
    // HUB-151797
    // expect(await axe(container)).toHaveNoViolations();
  });

  it('render Tracking code modal', async () => {
    render(
      <MockedProvider mocks={mocks}>
        <TestWrapper>
          <TrackingCodes videoCenterTitle="test-video-center" videoCenterId="Demo Video Center" />
        </TestWrapper>
      </MockedProvider>
    );
    expect(await screen.findByText('Code Snippets')).toBeInTheDocument();
    const editButton = await screen.findByRole('button', { name: /Edit Code Snippets/i });
    expect(editButton).toBeInTheDocument();
    fireEvent.click(editButton);
    const addCodeSnippetButton = await screen.findByRole('button', { name: /Add code snippet/i });
    expect(addCodeSnippetButton).toBeInTheDocument();
    fireEvent.click(addCodeSnippetButton);
    expect(await screen.findByRole('heading', { name: /Select Code Snippet/i })).toBeInTheDocument();
    const dismissButton = await screen.findByRole('button', { name: /close modal/i });
    expect(dismissButton).toBeInTheDocument();
    fireEvent.click(dismissButton);
    const saveButton = await screen.findByRole('button', { name: /Save code snippets/i });
    expect(saveButton).toBeInTheDocument();
    // HUB-151797
    // expect(await axe(container)).toHaveNoViolations();
  });

  it('render Tracking parameters card', async () => {
    render(
      <MockedProvider mocks={mocks}>
        <TestWrapper>
          <TrackingCodes videoCenterTitle="test-video-center" videoCenterId="Demo Video Center" />
        </TestWrapper>
      </MockedProvider>
    );
    expect(await screen.findByText('URL Tracking Parameters')).toBeInTheDocument();
    // HUB-151797
    // expect(await axe(container)).toHaveNoViolations();
  });
});

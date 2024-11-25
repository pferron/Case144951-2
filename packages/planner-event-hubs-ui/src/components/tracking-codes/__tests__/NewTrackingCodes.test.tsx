import React from 'react';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { screen } from 'nucleus-text/testing-library/screen';
import { TrackingCodes } from '@components/tracking-codes/TrackingCodes';
import { MockedProvider } from '@apollo/client/testing';
import { getAccountCodeSnippets } from '@cvent/planner-event-hubs-model/operations/snapshot';
import { getHubCodeSnippets } from '@cvent/planner-event-hubs-model/operations/hub';
import { accountCodeSnippet } from '@components/tracking-codes/fixtures/CodeSnippetData';
import { accountConfig } from '@cvent/planner-event-hubs-model/src/operations/coreSOA';
import 'jest-axe/extend-expect';
import { getGoogleMeasurementQuery } from '@cvent/planner-event-hubs-model/operations/trackingCodes';
import userEvent from '@testing-library/user-event';

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

const appFeatures = [
  {
    name: 'videoCenterInformationFeature',
    enabled: true,
    experimentVersion: '1001'
  }
];

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
      query: getGoogleMeasurementQuery,
      variables: {
        input: {
          hubId: 'test-hub-id'
        }
      }
    },
    result: {
      data: {
        getGoogleMeasurementQuery: {
          measurementId: '123456'
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

const saveFailedParameterMocks = [
  ...mocks,
  {
    request: {
      query: getGoogleMeasurementQuery,
      variables: {
        input: {
          hubId: 'test-hub-id'
        }
      }
    },
    result: {
      data: {
        errors: [new Error('some error occurred')]
      }
    }
  }
];

describe('Tracking Codes', () => {
  it('renders Tracking code page', async () => {
    render(
      <MockedProvider mocks={mocks}>
        <TestWrapper appFeatures={appFeatures}>
          <TrackingCodes videoCenterTitle="test-video-center" videoCenterId="Demo Video Center" />
        </TestWrapper>
      </MockedProvider>
    );
    expect(await screen.findByRole('heading', { name: /Tracking codes/i })).toBeInTheDocument();
    expect(await screen.findByTextKey('code_snippets_text')).toBeInTheDocument();
    expect(await screen.findByRole('heading', { key: 'google_analytics_set_id_header' })).toBeInTheDocument();
    expect(await screen.findByTextKey('add_url_tracking_parameters_text')).toBeInTheDocument();
    // HUB-151797
    // expect(await axe(container)).toHaveNoViolations();
  });

  it('renders Tracking code page save google analytics card', async () => {
    render(
      <MockedProvider mocks={saveFailedParameterMocks}>
        <TestWrapper appFeatures={appFeatures}>
          <TrackingCodes videoCenterTitle="test-video-center" videoCenterId="Demo Video Center" />
        </TestWrapper>
      </MockedProvider>
    );
    expect(await screen.findByRole('heading', { key: 'google_analytics_set_id_header' })).toBeInTheDocument();
    const saveButton = await screen.findByTestId('google-analytics-card-save-button');
    expect(saveButton).toBeInTheDocument();
    const idTextbox = await screen.findByRole('textbox', { key: 'google_analytics_measurement_id_label' });
    expect(idTextbox).toBeInTheDocument();
    await userEvent.clear(idTextbox);
    await userEvent.type(idTextbox, 'abcd');
    fireEvent.click(saveButton);
    await waitFor(() => {
      expect(screen.getByTextKey('tracking_codes_failure_alert_text')).toBeInTheDocument();
    });
    const dismissButton = screen.getByRole('button', { name: 'Dismiss' });
    fireEvent.click(dismissButton);
    // HUB-151797
    // expect(await axe(container)).toHaveNoViolations();
  });
  it('renders Tracking code page google analytics card', async () => {
    render(
      <MockedProvider mocks={mocks}>
        <TestWrapper appFeatures={appFeatures}>
          <TrackingCodes videoCenterTitle="test-video-center" videoCenterId="Demo Video Center" />
        </TestWrapper>
      </MockedProvider>
    );
    expect(await screen.findByRole('heading', { key: 'google_analytics_set_id_header' })).toBeInTheDocument();
    const saveButton = await screen.findByTestId('google-analytics-card-save-button');
    expect(saveButton).toBeInTheDocument();
    const idTextbox = await screen.findByRole('textbox', { key: 'google_analytics_measurement_id_label' });
    expect(idTextbox).toBeInTheDocument();
    await userEvent.clear(idTextbox);
    await userEvent.type(idTextbox, 'abcd');
    fireEvent.click(saveButton);
    await waitFor(() => {
      expect(idTextbox).toHaveValue('abcd');
    });
    // HUB-151797
    // expect(await axe(container)).toHaveNoViolations();
  });

  it('render Tracking code modal', async () => {
    render(
      <MockedProvider mocks={mocks}>
        <TestWrapper appFeatures={appFeatures}>
          <TrackingCodes videoCenterTitle="test-video-center" videoCenterId="Demo Video Center" />
        </TestWrapper>
      </MockedProvider>
    );
    expect(await screen.findByText('Code Snippets')).toBeInTheDocument();
    const addCodeSnippetButton = await screen.findByRole('button', { name: /Add code snippet/i });
    expect(addCodeSnippetButton).toBeInTheDocument();
    fireEvent.click(addCodeSnippetButton);
    expect(await screen.findByRole('heading', { name: /Select Code Snippet/i })).toBeInTheDocument();
    const dismissButton = await screen.findByRole('button', { name: /close modal/i });
    expect(dismissButton).toBeInTheDocument();
    fireEvent.click(dismissButton);
    // HUB-151797
    // expect(await axe(container)).toHaveNoViolations();
  });

  it('render Tracking parameters card', async () => {
    render(
      <MockedProvider mocks={mocks}>
        <TestWrapper appFeatures={appFeatures}>
          <TrackingCodes videoCenterTitle="test-video-center" videoCenterId="Demo Video Center" />
        </TestWrapper>
      </MockedProvider>
    );
    expect(await screen.findByTextKey('add_url_tracking_parameters_text')).toBeInTheDocument();
    expect(await screen.findByTextKey('tracking_parameters_description')).toBeInTheDocument();
    expect(await screen.findByTextKey('tracking_params_duplicate_key_names')).toBeInTheDocument();
    expect(await screen.findByTextKey('tracking_params_duplicate_key_names_description')).toBeInTheDocument();
    expect(await screen.findByTextKey('tracking_params_existing')).toBeInTheDocument();
    expect(await screen.findByTextKey('tracking_params_custom')).toBeInTheDocument();
    const saveButton = await screen.findByTestId('tracking-parameter-card-save-button');
    expect(saveButton).toBeInTheDocument();
    // HUB-151797
    // expect(await axe(container)).toHaveNoViolations();
  });
});

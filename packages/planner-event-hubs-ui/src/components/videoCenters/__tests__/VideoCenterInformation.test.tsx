import React from 'react';
import { render, fireEvent, waitFor, within } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import { getCustomDomains, GET_VIDEO_HUB } from '@cvent/planner-event-hubs-model/operations/hub';
import VideoCenterInformation from '@components/videoCenters/information/VideoCenterInformation';
import { AppFeaturesProvider } from '@components/AppFeaturesProvider';
import {
  createHubCustomDomainMapping,
  deleteHubCustomDomainMapping,
  updateHubCustomDomainMapping
} from '@cvent/planner-event-hubs-model/operations/customDomain';
import { InMemoryCache } from '@apollo/client';
import 'jest-axe/extend-expect';
import { axe } from 'jest-axe';
import { GraphQLError } from 'graphql/error';
import { screen } from 'nucleus-text/testing-library/screen';

const mock = jest.fn();
jest.mock('next/config', () => () => ({
  publicRuntimeConfig: {
    CVENT_SHORT_URL: 'https://staging.cvent.me'
  }
}));

jest.mock('next/router', () => ({
  useRouter() {
    return {
      pathname: '/path',
      route: '/route',
      query: { isSuccess: true },
      replace: jest.fn()
    };
  }
}));
const testHubId = 'test-video-hub';
const customDomainId = 'f144c0aa-f6a2-447d-b845-fc4b9610711b';
const customDomainId2 = 'b48fcc78-a4fc-4a82-b250-242927ef676d';
const testDomainName = 'test-domain';
const testTrailingName = 'updatetest';
const updateCustomDomainQuery = {
  query: updateHubCustomDomainMapping,
  variables: {
    input: {
      entityId: testHubId,
      customDomainId,
      trailingName: testTrailingName
    }
  }
};
const getCustomDomainForAccount = [
  {
    customDomainId: customDomainId2,
    domainName: 't2-penguin.seevent.com',
    __typename: 'CustomDomain'
  },
  {
    customDomainId,
    domainName: testDomainName,
    __typename: 'CustomDomain'
  }
];
const appFeatures = [
  {
    name: 'videoCenterInformationFeature',
    enabled: true,
    experimentVersion: '1001'
  }
];
const customDomainMock = {
  request: {
    query: getCustomDomains,
    variables: { hubId: testHubId }
  },
  result: {
    data: {
      getCustomDomainForHub: {
        entityId: testHubId,
        customDomainId,
        trailingName: 'test',
        __typename: 'CustomDomainMapping'
      },
      getCustomDomainForAccount
    }
  }
};

const customDomainMockNotAssociatedWithHub = {
  request: {
    query: getCustomDomains,
    variables: { hubId: testHubId }
  },
  result: {
    data: {
      getCustomDomainForHub: null,
      getCustomDomainForAccount
    }
  }
};

const createCustomDomainMock = {
  request: {
    query: createHubCustomDomainMapping,
    variables: {
      input: {
        entityId: testHubId,
        customDomainId: customDomainId2,
        trailingName: 'test'
      }
    }
  },
  result: {
    data: {
      createHubCustomDomainMapping: {
        entityId: testHubId,
        customDomainId: customDomainId2,
        trailingName: 'test',
        __typename: 'CustomDomainMapping'
      }
    }
  }
};
const deleteCustomDomainMock = {
  request: {
    query: deleteHubCustomDomainMapping,
    variables: { hubId: testHubId }
  },
  result: {
    data: {
      deleteHubCustomDomainMapping: true
    }
  }
};
const updateCustomDomainMock = {
  request: updateCustomDomainQuery,
  result: {
    data: {
      updateHubCustomDomainMapping: {
        entityId: testHubId,
        customDomainId,
        trailingName: 'updatetest',
        __typename: 'CustomDomainMapping'
      }
    }
  }
};
const updateCustomDomainFailureMock = {
  request: updateCustomDomainQuery,
  result: {
    errors: [new GraphQLError('some error occured')]
  }
};
describe('Video Center Information', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mocks = [
    {
      request: {
        query: GET_VIDEO_HUB,
        context: { clientName: 'video-hub' },
        variables: { hubID: { id: testHubId } }
      },
      result: {
        data: {
          hub: {
            id: testHubId,
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
    }
  ];

  it('Render Video Center Basic Information View Page', async () => {
    const { container } = render(
      <TestWrapper appFeatures={appFeatures}>
        <MockedProvider mocks={mocks}>
          <AppFeaturesProvider value={appFeatures}>
            <VideoCenterInformation
              centerId="test-video-hub"
              centerTitle="Test Video Center One"
              setCenterTitle={mock}
            />
          </AppFeaturesProvider>
        </MockedProvider>
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId('center-information-form')).toBeInTheDocument();
    });

    // Information Card
    const infoCard = within(screen.getByTestId('center-information-card'));
    expect(infoCard).toBeDefined();
    const formFields = infoCard.getAllByRole('textbox');
    expect(formFields).toHaveLength(5);
    const helpEmailRadioButtons = infoCard.getAllByRole('radio');
    expect(helpEmailRadioButtons).toHaveLength(2);
    expect(infoCard.getByTestId('video-hub-form-title')).toBeInTheDocument();
    expect(infoCard.getByTestId('video-hub-form-language')).toBeInTheDocument();
    // Weblink card
    const weblinkCard = within(screen.getByTestId('center-custom-domain-card'));
    expect(weblinkCard).toBeDefined();
    const webLink = weblinkCard.getByTestId('custom-domain');
    expect(webLink).toBeInTheDocument();
    const copybutton = weblinkCard.getByTestId('custom-domain-url-copy-button');
    expect(copybutton).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('Render Video Center Status Component', async () => {
    const { container } = render(
      <TestWrapper appFeatures={appFeatures}>
        <MockedProvider mocks={mocks}>
          <AppFeaturesProvider value={appFeatures}>
            <VideoCenterInformation
              centerId="test-video-hub"
              centerTitle="Test Video Center One"
              setCenterTitle={mock}
            />
          </AppFeaturesProvider>
        </MockedProvider>
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId('center-information-form')).toBeInTheDocument();
    });

    // Status Card
    const statusCard = within(screen.getByTestId('center-status-card'));
    expect(statusCard).toBeDefined();
    expect(statusCard.getByTestId('video-center-status-options')).toBeInTheDocument();
    // Weblink card
    const weblinkCard = within(screen.getByTestId('center-custom-domain-card'));
    expect(weblinkCard).toBeDefined();
    const webLink = weblinkCard.getByTestId('custom-domain');
    expect(webLink).toBeInTheDocument();
    const copybutton = weblinkCard.getByTestId('custom-domain-url-copy-button');
    expect(copybutton).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('Render Video Center Component for Custom Domain - View Mode', async () => {
    const { container } = render(
      <TestWrapper>
        <MockedProvider mocks={[...mocks, customDomainMock]}>
          <VideoCenterInformation centerId="test-video-hub" centerTitle="Test Video Center One" setCenterTitle={mock} />
        </MockedProvider>
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId('center-information-form')).toBeInTheDocument();
    });

    // Custom Domain card
    const weblinkCard = within(screen.getByTestId('center-custom-domain-card'));
    expect(weblinkCard).toBeDefined();
    const webLink = await weblinkCard.findByText('https://google.com');
    expect(webLink).toBeInTheDocument();
    const copybutton = await screen.findByRole('button', { key: 'video_hub_copy_weblink_button_accessibility_label' });
    expect(copybutton).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('Render Video Center Component for Custom Domain - Edit Mode - Validations', async () => {
    const { container } = render(
      <TestWrapper>
        <MockedProvider mocks={[...mocks, customDomainMock]}>
          <VideoCenterInformation centerId="test-video-hub" centerTitle="Test Video Center One" setCenterTitle={mock} />
        </MockedProvider>
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId('center-information-form')).toBeInTheDocument();
    });

    // Custom Domain card
    let weblinkCard = within(screen.getByTestId('center-custom-domain-card'));
    const editbutton = await weblinkCard.findByRole('button', {
      name: /Edit/i
    });
    expect(editbutton).toBeInTheDocument();
    fireEvent.click(editbutton);
    expect(weblinkCard).toBeDefined();
    weblinkCard = within(screen.getByTestId('center-custom-domain-card'));
    const trailingName = await screen.findByLabelTextKey('events_plus_trailing_name');
    expect(trailingName).toBeInTheDocument();
    fireEvent.change(trailingName, { target: { value: '' } });
    expect(await screen.findByTextKey('events_plus_trailing_name_missing')).toBeInTheDocument();
    fireEvent.change(trailingName, { target: { value: 'a' } });
    expect(await screen.findByTextKey('events_plus_trailing_name_minlength_error')).toBeInTheDocument();
    fireEvent.change(trailingName, { target: { value: 'abc123' } });
    expect(await screen.findByTextKey('events_plus_trailing_name_error')).toBeInTheDocument();
    fireEvent.change(trailingName, { target: { value: 'abc' } });
    expect(await weblinkCard.findByText('Example: staging.cvent.me/trailingname')).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('Render Video Center Component for Custom Domain - add custom domain', async () => {
    const cache = new InMemoryCache();
    const { container } = render(
      <TestWrapper>
        <MockedProvider mocks={[...mocks, customDomainMockNotAssociatedWithHub, createCustomDomainMock]} cache={cache}>
          <VideoCenterInformation centerId="test-video-hub" centerTitle="Test Video Center One" setCenterTitle={mock} />
        </MockedProvider>
      </TestWrapper>
    );

    const writeQueryMock = jest.spyOn(cache, 'writeQuery');

    await waitFor(() => {
      expect(screen.getByTestId('center-information-form')).toBeInTheDocument();
    });

    // Custom Domain card
    let weblinkCard = within(screen.getByTestId('center-custom-domain-card'));
    const editbutton = await weblinkCard.findByRole('button', {
      name: /Edit/i
    });
    expect(editbutton).toBeInTheDocument();
    fireEvent.click(editbutton);
    expect(weblinkCard).toBeDefined();
    weblinkCard = within(screen.getByTestId('center-custom-domain-card'));
    expect(await weblinkCard.findByTestId('center-custom-domain-card-edit-cancel-button')).toBeInTheDocument();
    expect(
      await screen.findByRole('button', { key: 'card_edit_cancel_accessibility_button_label' })
    ).toBeInTheDocument();
    expect(await screen.findByRole('button', { key: 'card_edit_save_accessibility_button_label' })).toBeInTheDocument();
    expect(await screen.findByTextKey('events_plus_trailing_name')).toBeInTheDocument();
    const dropDownButton = await screen.findByLabelTextKey('events_plus_custom_domain');
    expect(dropDownButton).toBeInTheDocument();
    expect(dropDownButton).toHaveTextContent('staging.cvent.me');
    fireEvent.click(dropDownButton);
    const menuItems = await weblinkCard.findAllByRole('menuitemradio');
    expect(menuItems.length).toBe(3);
    fireEvent.click(menuItems[0]);
    const trailingName = await screen.findByLabelTextKey('events_plus_trailing_name');
    expect(trailingName).toBeInTheDocument();
    fireEvent.change(trailingName, {
      target: { value: 'test' }
    });
    fireEvent.click(await screen.findByRole('button', { key: 'card_edit_save_accessibility_button_label' }));
    expect(writeQueryMock).toHaveBeenCalledTimes(2);
    weblinkCard = within(screen.getByTestId('center-custom-domain-card'));
    expect(await weblinkCard.findByRole('button', { name: /Edit/i })).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('Render Video Center Component for Custom Domain -  update trailing name', async () => {
    const cache = new InMemoryCache();
    const { container } = render(
      <TestWrapper>
        <MockedProvider mocks={[...mocks, customDomainMock, updateCustomDomainMock]} cache={cache}>
          <VideoCenterInformation centerId="test-video-hub" centerTitle="Test Video Center One" setCenterTitle={mock} />
        </MockedProvider>
      </TestWrapper>
    );
    const writeQueryMock = jest.spyOn(cache, 'writeQuery');

    await waitFor(() => {
      expect(screen.getByTestId('center-information-form')).toBeInTheDocument();
    });

    // Custom Domain card
    let weblinkCard = within(screen.getByTestId('center-custom-domain-card'));
    const editbutton = await weblinkCard.findByRole('button', {
      name: /Edit/i
    });
    expect(editbutton).toBeInTheDocument();
    fireEvent.click(editbutton);
    weblinkCard = within(screen.getByTestId('center-custom-domain-card'));
    expect(await weblinkCard.findByTestId('center-custom-domain-card-edit-cancel-button')).toBeInTheDocument();
    expect(await weblinkCard.findByTestId('center-custom-domain-card-edit-cancel-button')).toBeInTheDocument();
    expect(
      await screen.findByRole('button', { key: 'card_edit_cancel_accessibility_button_label' })
    ).toBeInTheDocument();
    expect(await screen.findByRole('button', { key: 'card_edit_save_accessibility_button_label' })).toBeInTheDocument();
    const trailingName = await screen.findByLabelTextKey('events_plus_trailing_name');
    expect(trailingName).toBeInTheDocument();
    const dropDownButton = await screen.findByLabelTextKey('events_plus_custom_domain');
    expect(dropDownButton).toBeInTheDocument();
    expect(dropDownButton).toHaveTextContent(testDomainName);
    fireEvent.click(dropDownButton);
    const menuItems = await weblinkCard.findAllByRole('menuitemradio');
    expect(menuItems.length).toBe(3);
    fireEvent.change(trailingName, {
      target: { value: testTrailingName }
    });
    fireEvent.click(await screen.findByRole('button', { key: 'card_edit_save_accessibility_button_label' }));
    expect(writeQueryMock).toHaveBeenCalledTimes(2);
    expect(await weblinkCard.findByRole('button', { name: /Edit/i })).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('Render Video Center Component for Custom Domain - delete custom domain', async () => {
    const cache = new InMemoryCache();
    const { container } = render(
      <TestWrapper>
        <MockedProvider mocks={[...mocks, customDomainMock, deleteCustomDomainMock]} cache={cache}>
          <VideoCenterInformation centerId="test-video-hub" centerTitle="Test Video Center One" setCenterTitle={mock} />
        </MockedProvider>
      </TestWrapper>
    );
    const writeQueryMock = jest.spyOn(cache, 'writeQuery');

    await waitFor(() => {
      expect(screen.getByTestId('center-information-form')).toBeInTheDocument();
    });

    // Custom Domain card
    let weblinkCard = within(screen.getByTestId('center-custom-domain-card'));
    const editbutton = await weblinkCard.findByRole('button', {
      name: /Edit/i
    });
    expect(editbutton).toBeInTheDocument();
    fireEvent.click(editbutton);
    expect(weblinkCard).toBeDefined();
    weblinkCard = within(screen.getByTestId('center-custom-domain-card'));
    expect(await weblinkCard.findByTestId('center-custom-domain-card-edit-cancel-button')).toBeInTheDocument();
    expect(await weblinkCard.findByTestId('center-custom-domain-card-edit-cancel-button')).toBeInTheDocument();
    expect(
      await screen.findByRole('button', { key: 'card_edit_cancel_accessibility_button_label' })
    ).toBeInTheDocument();
    const trailingName = await screen.findByLabelTextKey('events_plus_trailing_name');
    expect(trailingName).toHaveValue('test');
    const dropDownButton = await screen.findByLabelTextKey('events_plus_custom_domain');
    expect(dropDownButton).toBeInTheDocument();
    expect(dropDownButton).toHaveTextContent(testDomainName);
    fireEvent.click(dropDownButton);
    const menuItems = await weblinkCard.findAllByRole('menuitemradio');
    expect(menuItems.length).toBe(3);
    fireEvent.click(menuItems[2]);
    expect(await screen.findByTextKey('events_plus_trailing_name')).toBeInTheDocument();
    fireEvent.click(await screen.findByRole('button', { key: 'card_edit_save_accessibility_button_label' }));
    expect(writeQueryMock).toHaveBeenCalled();
    expect(await weblinkCard.findByRole('button', { name: /Edit/i })).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('Render Video Center Component for Custom Domain -  update trailing name failure', async () => {
    const cache = new InMemoryCache();
    const { container } = render(
      <TestWrapper>
        <MockedProvider mocks={[...mocks, customDomainMock, updateCustomDomainFailureMock]} cache={cache}>
          <VideoCenterInformation centerId="test-video-hub" centerTitle="Test Video Center One" setCenterTitle={mock} />
        </MockedProvider>
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId('center-information-form')).toBeInTheDocument();
    });

    // Custom Domain card
    let weblinkCard = within(screen.getByTestId('center-custom-domain-card'));
    const editbutton = await weblinkCard.findByRole('button', {
      name: /Edit/i
    });
    expect(editbutton).toBeInTheDocument();
    fireEvent.click(editbutton);
    weblinkCard = within(screen.getByTestId('center-custom-domain-card'));
    expect(await weblinkCard.findByTestId('center-custom-domain-card-edit-cancel-button')).toBeInTheDocument();
    expect(await weblinkCard.findByTestId('center-custom-domain-card-edit-cancel-button')).toBeInTheDocument();
    expect(
      await screen.findByRole('button', { key: 'card_edit_cancel_accessibility_button_label' })
    ).toBeInTheDocument();
    const trailingName = await screen.findByLabelTextKey('events_plus_trailing_name');
    expect(trailingName).toBeInTheDocument();
    const dropDownButton = await screen.findByLabelTextKey('events_plus_custom_domain');
    expect(dropDownButton).toBeInTheDocument();
    expect(dropDownButton).toHaveTextContent(testDomainName);
    fireEvent.click(dropDownButton);
    const menuItems = await weblinkCard.findAllByRole('menuitemradio');
    expect(menuItems.length).toBe(3);
    fireEvent.change(trailingName, {
      target: { value: testTrailingName }
    });
    fireEvent.click(await screen.findByRole('button', { key: 'card_edit_save_accessibility_button_label' }));
    expect(await weblinkCard.findByRole('button', { name: /Edit/i })).toBeInTheDocument();
    expect(await screen.findByRole('alert')).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('Render Video Center Component for Custom Domain - Edit Mode - trailing name updation', async () => {
    const { container } = render(
      <TestWrapper>
        <MockedProvider mocks={[...mocks, customDomainMock]}>
          <AppFeaturesProvider value={appFeatures}>
            <VideoCenterInformation
              centerId="test-video-hub"
              centerTitle="Test Video Center One"
              setCenterTitle={mock}
            />
          </AppFeaturesProvider>
        </MockedProvider>
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId('center-information-form')).toBeInTheDocument();
    });

    // Custom Domain card
    let weblinkCard = within(screen.getByTestId('center-custom-domain-card'));
    expect(weblinkCard).toBeDefined();
    weblinkCard = within(screen.getByTestId('center-custom-domain-card'));
    const trailingName = await screen.findByLabelTextKey('events_plus_trailing_name');
    expect(trailingName).toBeInTheDocument();
    fireEvent.change(trailingName, { target: { value: '' } });
    expect(await screen.findByTextKey('events_plus_trailing_name_missing')).toBeInTheDocument();
    expect(await screen.findByTextKey('video_hub_information_web_link_unsaved_changes_text')).toBeInTheDocument();
    const saveButton = await screen.findByRole('button', { key: 'video_hub_information_save_button' });
    expect(saveButton).toBeEnabled();
    expect(saveButton).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });
});

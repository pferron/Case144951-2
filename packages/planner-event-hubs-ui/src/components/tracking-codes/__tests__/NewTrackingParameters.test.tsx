import userEvent from '@testing-library/user-event';
import { fireEvent, render, waitFor, within } from '@testing-library/react';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import { screen } from 'nucleus-text/testing-library/screen';
import { MockedProvider } from '@apollo/client/testing';
import { GET_UTM_OVERRIDES, SET_UTM_OVERRIDES } from '@cvent/planner-event-hubs-model/operations/hub';
import { axe } from 'jest-axe';
import { UTM_KEY_MAX_LENGTH, UTM_VALUE_MAX_LENGTH } from '@utils/constants';
import NewTrackingParameters from '../NewTrackingParameters';
import { utmTrackingParametersList, utmTrackingParametersMaxList } from '../fixtures/CodeSnippetData';
import 'jest-axe/extend-expect';

const mockfn = jest.fn();
const mockDelete = jest.fn();

const appFeatures = [
  {
    name: 'videoCenterInformationFeature',
    enabled: true,
    experimentVersion: '1001'
  }
];

const mockConfigData = {
  ownerEmail: 'owner@example.com',
  ownerFirstName: 'OwnerFirstName',
  ownerLastName: 'OwnerLastName',
  title: 'Hub Title',
  utmOverride: 'use-custom-parameter'
};
const mockExistingParamData = {
  ownerEmail: 'owner@example.com',
  ownerFirstName: 'OwnerFirstName',
  ownerLastName: 'OwnerLastName',
  title: 'Hub Title',
  utmOverride: 'use-existing-parameter'
};

const mocks = [
  {
    request: {
      query: GET_UTM_OVERRIDES,
      variables: {
        input: {
          id: 'test-hub-id'
        }
      }
    },
    result: {
      data: utmTrackingParametersList
    }
  },
  {
    request: {
      query: SET_UTM_OVERRIDES,
      variables: {
        input: {
          id: 'test-hub-id'
        },
        data: [{ key: 'key2', value: 'value2' }]
      }
    },
    result: {
      data: { setUtmOverrides: [{ key: 'key1', value: 'value1', __typename: 'UtmOverride' }] }
    }
  }
];

const mocksWithMaxParams = [
  {
    request: {
      query: GET_UTM_OVERRIDES,
      variables: {
        input: {
          id: 'test-hub-id'
        }
      }
    },
    result: {
      data: utmTrackingParametersMaxList
    }
  }
];

describe('Tracking Parameters list', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders tracking parameters list in non edit state', async () => {
    const setIsPageEdited = jest.fn();
    const { container } = await render(
      <TestWrapper appFeatures={appFeatures}>
        <MockedProvider mocks={mocks}>
          <NewTrackingParameters
            trackingParametersdata={utmTrackingParametersList}
            editTrackingParameters={false}
            setEditTrackingParameters={mockfn}
            onSave={mockfn}
            onDelete={mockfn}
            existingParam={mockExistingParamData}
            setExistingParam={mockfn}
            setIsEdited={mockfn}
            setIsPageEdited={setIsPageEdited}
            isEdited={false}
            hubConfig={mockConfigData}
            allowGoogleAnalytics
            allowCodeSnippets
          />
        </MockedProvider>
      </TestWrapper>
    );
    expect(await screen.findByTextKey('add_url_tracking_parameters_text')).toBeInTheDocument();
    expect(await screen.findByTextKey('tracking_params_duplicate_key_names')).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders tracking parameters list with add parameters button and duplicate keys section', async () => {
    const setIsPageEdited = jest.fn();
    const { container } = await render(
      <TestWrapper appFeatures={appFeatures}>
        <MockedProvider mocks={mocks}>
          <NewTrackingParameters
            trackingParametersdata={utmTrackingParametersList}
            editTrackingParameters
            setEditTrackingParameters={mockfn}
            onSave={mockfn}
            onDelete={mockfn}
            existingParam={mockExistingParamData}
            setExistingParam={mockfn}
            setIsEdited={mockfn}
            setIsPageEdited={setIsPageEdited}
            isEdited={false}
            hubConfig={mockConfigData}
            allowGoogleAnalytics
            allowCodeSnippets
          />
        </MockedProvider>
      </TestWrapper>
    );
    expect(await screen.findByTextKey('add_url_tracking_parameters_text')).toBeInTheDocument();

    expect(await screen.findByText('Add parameters')).toBeInTheDocument();

    const addParamsButton = await screen.findByRole('button', { key: 'Add-Tracking-Parameters-Button' });
    expect(addParamsButton).toBeInTheDocument();
    expect(addParamsButton).toBeEnabled();

    fireEvent.click(addParamsButton);

    expect(await screen.findByTestId('add-or-edit-parameters-modal')).toBeInTheDocument();

    expect(screen.getByRole('radiogroup')).toBeInTheDocument();
    const radioButtons = screen.getAllByRole('radio');
    expect(radioButtons).toHaveLength(2);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('opens a modal to add parameters and save them', async () => {
    const setIsPageEdited = jest.fn();
    const { container } = await render(
      <TestWrapper appFeatures={appFeatures}>
        <MockedProvider mocks={mocks}>
          <NewTrackingParameters
            trackingParametersdata={utmTrackingParametersList}
            editTrackingParameters
            setEditTrackingParameters={mockfn}
            onSave={mockfn}
            onDelete={mockfn}
            existingParam={mockExistingParamData}
            setExistingParam={mockfn}
            setIsEdited={mockfn}
            setIsPageEdited={setIsPageEdited}
            isEdited={false}
            hubConfig={mockConfigData}
            allowGoogleAnalytics
            allowCodeSnippets
          />
        </MockedProvider>
      </TestWrapper>
    );
    expect(await screen.findByTextKey('add_url_tracking_parameters_text')).toBeInTheDocument();
    expect(await screen.findByTextKey('tracking_parameters_description')).toBeInTheDocument();
    expect(await screen.findByText('Add parameters')).toBeInTheDocument();

    const addParamsButton = await screen.findByRole('button', { key: 'Add-Tracking-Parameters-Button' });
    expect(addParamsButton).toBeInTheDocument();
    expect(addParamsButton).toBeEnabled();

    fireEvent.click(addParamsButton);

    expect(await screen.findByTestId('add-or-edit-parameters-modal')).toBeInTheDocument();

    const key3Text = 'key3';
    const value3Text = 'value3';

    const keyInput = screen.getByTestId('tracking-parameter-key-form-input-key-input');
    expect(keyInput).toBeInTheDocument();
    fireEvent.change(keyInput, { target: { value: key3Text } });

    const valueInput = screen.getByTestId('tracking-parameter-key-form-input-value-input');
    expect(valueInput).toBeInTheDocument();
    fireEvent.change(valueInput, { target: { value: value3Text } });

    // Remaining characters
    expect(
      screen.getByTextKey('characters_left_label', { characterCount: UTM_KEY_MAX_LENGTH - key3Text.length })
    ).toBeInTheDocument();
    expect(
      screen.getByTextKey('characters_left_label', { characterCount: UTM_VALUE_MAX_LENGTH - value3Text.length })
    ).toBeInTheDocument();

    const addBtn = await screen.findByRole('button', { key: 'add_button_label' });
    expect(addBtn).toBeInTheDocument();
    expect(addBtn).toBeEnabled();

    fireEvent.click(addBtn);

    expect(mockfn).toHaveBeenCalled();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('opens modal to add parameters, disables save button, renders error if key field entry already exists', async () => {
    const setIsPageEdited = jest.fn();
    const { container } = await render(
      <TestWrapper appFeatures={appFeatures}>
        <MockedProvider mocks={mocks}>
          <NewTrackingParameters
            trackingParametersdata={utmTrackingParametersList}
            editTrackingParameters
            setEditTrackingParameters={mockfn}
            onSave={mockfn}
            onDelete={mockfn}
            existingParam={mockExistingParamData}
            setExistingParam={mockfn}
            setIsEdited={mockfn}
            setIsPageEdited={setIsPageEdited}
            isEdited={false}
            hubConfig={mockConfigData}
            allowGoogleAnalytics
            allowCodeSnippets
          />
        </MockedProvider>
      </TestWrapper>
    );
    expect(await screen.findByTextKey('add_url_tracking_parameters_text')).toBeInTheDocument();

    expect(await screen.findByText('Add parameters')).toBeInTheDocument();

    const addParamsButton = await screen.findByRole('button', { key: 'Add-Tracking-Parameters-Button' });
    expect(addParamsButton).toBeInTheDocument();
    expect(addParamsButton).toBeEnabled();

    fireEvent.click(addParamsButton);

    expect(await screen.findByTestId('add-or-edit-parameters-modal')).toBeInTheDocument();

    const key4Text = 'key2';
    const value4Text = 'value2';

    const keyInput = screen.getByTestId('tracking-parameter-key-form-input-key-input');
    expect(keyInput).toBeInTheDocument();
    fireEvent.change(keyInput, { target: { value: key4Text } });

    const valueInput = screen.getByTestId('tracking-parameter-key-form-input-value-input');
    expect(valueInput).toBeInTheDocument();
    fireEvent.change(valueInput, { target: { value: value4Text } });

    expect(screen.getByTextKey('tracking_parameter_key_already_taken')).toBeInTheDocument();

    const addBtn = await screen.findByRole('button', { key: 'add_button_label' });
    expect(addBtn).toBeInTheDocument();
    expect(addBtn).toBeDisabled();

    expect(await axe(container)).toHaveNoViolations();
  });

  it('opens modal to add parameters, disables save button, renders error if key field entry is not allowed', async () => {
    const setIsPageEdited = jest.fn();
    const { container } = await render(
      <TestWrapper appFeatures={appFeatures}>
        <MockedProvider mocks={mocks}>
          <NewTrackingParameters
            trackingParametersdata={utmTrackingParametersList}
            editTrackingParameters
            setEditTrackingParameters={mockfn}
            onSave={mockfn}
            onDelete={mockfn}
            existingParam={mockExistingParamData}
            setExistingParam={mockfn}
            setIsEdited={mockfn}
            setIsPageEdited={setIsPageEdited}
            isEdited={false}
            hubConfig={mockConfigData}
            allowGoogleAnalytics
            allowCodeSnippets
          />
        </MockedProvider>
      </TestWrapper>
    );
    expect(await screen.findByTextKey('add_url_tracking_parameters_text')).toBeInTheDocument();

    expect(await screen.findByText('Add parameters')).toBeInTheDocument();

    const addParamsButton = await screen.findByRole('button', { key: 'Add-Tracking-Parameters-Button' });
    expect(addParamsButton).toBeInTheDocument();
    expect(addParamsButton).toBeEnabled();

    fireEvent.click(addParamsButton);

    expect(await screen.findByTestId('add-or-edit-parameters-modal')).toBeInTheDocument();

    const key5Text = 'centerId';
    const value5Text = 'value5';

    const keyInput = screen.getByTestId('tracking-parameter-key-form-input-key-input');
    expect(keyInput).toBeInTheDocument();
    fireEvent.change(keyInput, { target: { value: key5Text } });

    const valueInput = screen.getByTestId('tracking-parameter-key-form-input-value-input');
    expect(valueInput).toBeInTheDocument();
    fireEvent.change(valueInput, { target: { value: value5Text } });

    expect(screen.getByTextKey('tracking_parameter_key_not_allowed')).toBeInTheDocument();

    const addBtn = await screen.findByRole('button', { key: 'add_button_label' });
    expect(addBtn).toBeInTheDocument();
    expect(addBtn).toBeDisabled();

    expect(await axe(container)).toHaveNoViolations();
  });

  it('opens modal to add parameters, disables save button, renders error if key field entry is forbidden', async () => {
    const setIsPageEdited = jest.fn();
    const { container } = await render(
      <TestWrapper appFeatures={appFeatures}>
        <MockedProvider mocks={mocks}>
          <NewTrackingParameters
            trackingParametersdata={utmTrackingParametersList}
            editTrackingParameters
            setEditTrackingParameters={mockfn}
            onSave={mockfn}
            onDelete={mockfn}
            existingParam={mockExistingParamData}
            setExistingParam={mockfn}
            setIsEdited={mockfn}
            setIsPageEdited={setIsPageEdited}
            isEdited={false}
            hubConfig={mockConfigData}
            allowGoogleAnalytics
            allowCodeSnippets
          />
        </MockedProvider>
      </TestWrapper>
    );
    expect(await screen.findByTextKey('add_url_tracking_parameters_text')).toBeInTheDocument();

    expect(await screen.findByText('Add parameters')).toBeInTheDocument();

    const addParamsButton = await screen.findByRole('button', { key: 'Add-Tracking-Parameters-Button' });
    expect(addParamsButton).toBeInTheDocument();
    expect(addParamsButton).toBeEnabled();

    fireEvent.click(addParamsButton);

    expect(await screen.findByTestId('add-or-edit-parameters-modal')).toBeInTheDocument();

    const key6Text = 'cvt_cal';
    const value6Text = 'value6';

    const keyInput = screen.getByTestId('tracking-parameter-key-form-input-key-input');
    expect(keyInput).toBeInTheDocument();
    fireEvent.change(keyInput, { target: { value: key6Text } });

    const valueInput = screen.getByTestId('tracking-parameter-key-form-input-value-input');
    expect(valueInput).toBeInTheDocument();
    fireEvent.change(valueInput, { target: { value: value6Text } });

    expect(screen.getByTextKey('tracking_parameter_forbidden_key')).toBeInTheDocument();

    const addBtn = await screen.findByRole('button', { key: 'add_button_label' });
    expect(addBtn).toBeInTheDocument();
    expect(addBtn).toBeDisabled();

    expect(await axe(container)).toHaveNoViolations();
  });

  it('should open delete confirmation modal and show cancel button on modal', async () => {
    const setIsPageEdited = jest.fn();
    const { container } = await render(
      <TestWrapper appFeatures={appFeatures}>
        <MockedProvider mocks={mocks}>
          <NewTrackingParameters
            trackingParametersdata={utmTrackingParametersList}
            editTrackingParameters
            setEditTrackingParameters={mockfn}
            onSave={mockfn}
            onDelete={mockfn}
            existingParam={mockExistingParamData}
            setExistingParam={mockfn}
            setIsEdited={mockfn}
            setIsPageEdited={setIsPageEdited}
            isEdited={false}
            hubConfig={mockConfigData}
            allowGoogleAnalytics
            allowCodeSnippets
          />
        </MockedProvider>
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId('tracking-parameters-table')).toBeInTheDocument();
    });
    expect(await screen.findByTestId('trash-icon-key2')).toBeInTheDocument();
    const deleteButton = screen.getByTestId('trash-icon-key2');
    fireEvent.click(deleteButton);
    expect(await screen.findByTestId('confirmation-modal-header')).toBeInTheDocument();

    const cancelBtn = await screen.findByRole('button', { name: 'Cancel' });
    expect(cancelBtn).toBeInTheDocument();
    fireEvent.click(cancelBtn);
    await waitFor(() => {
      expect(screen.queryByTestId('confirmation-modal-header')).not.toBeInTheDocument();
    });
    expect(await axe(container)).toHaveNoViolations();
  });

  it('should open delete confirmation modal and deletes it successfully', async () => {
    const setIsPageEdited = jest.fn();
    const { container } = await render(
      <TestWrapper appFeatures={appFeatures}>
        <MockedProvider mocks={mocks}>
          <NewTrackingParameters
            trackingParametersdata={utmTrackingParametersList}
            editTrackingParameters
            setEditTrackingParameters={mockfn}
            onSave={mockfn}
            onDelete={mockDelete}
            existingParam={mockExistingParamData}
            setExistingParam={mockfn}
            setIsEdited={mockfn}
            setIsPageEdited={setIsPageEdited}
            isEdited={false}
            hubConfig={mockConfigData}
            allowGoogleAnalytics
            allowCodeSnippets
          />
        </MockedProvider>
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId('tracking-parameters-table')).toBeInTheDocument();
    });
    expect(screen.getAllByRole('row')).toHaveLength(3);
    expect(await screen.findByTestId('trash-icon-key2')).toBeInTheDocument();
    const deleteButton = screen.getByTestId('trash-icon-key2');
    fireEvent.click(deleteButton);
    expect(await screen.findByTestId('confirmation-modal-header')).toBeInTheDocument();
    const cancelBtn = await screen.findByRole('button', { name: 'Cancel' });
    expect(cancelBtn).toBeInTheDocument();
    const deleteBtn = screen.getByTestId('confirmation-modal-confirmation-button');
    fireEvent.click(deleteBtn);
    expect(mockDelete).toHaveBeenCalled();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders tracking parameters list with add parameters button and disables when reached max', async () => {
    const setIsPageEdited = jest.fn();
    const { container } = render(
      <TestWrapper appFeatures={appFeatures}>
        <MockedProvider mocks={mocksWithMaxParams}>
          <NewTrackingParameters
            trackingParametersdata={utmTrackingParametersMaxList}
            editTrackingParameters
            setEditTrackingParameters={mockfn}
            onSave={mockfn}
            onDelete={mockfn}
            existingParam={mockExistingParamData}
            setExistingParam={mockfn}
            setIsEdited={mockfn}
            setIsPageEdited={setIsPageEdited}
            isEdited={false}
            hubConfig={mockConfigData}
            allowGoogleAnalytics
            allowCodeSnippets
          />
        </MockedProvider>
      </TestWrapper>
    );
    expect(await screen.findByTextKey('add_url_tracking_parameters_text')).toBeInTheDocument();

    expect(await screen.findByText('Add parameters')).toBeInTheDocument();

    const addParamsButton = await screen.findByRole('button', { key: 'Add-Tracking-Parameters-Button' });
    expect(addParamsButton).toBeInTheDocument();
    expect(addParamsButton).toBeDisabled();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('Should be to edit the existing parameter', async () => {
    const setIsPageEdited = jest.fn();
    render(
      <TestWrapper appFeatures={appFeatures}>
        <MockedProvider mocks={mocks}>
          <NewTrackingParameters
            trackingParametersdata={utmTrackingParametersList}
            editTrackingParameters
            setEditTrackingParameters={mockfn}
            onSave={mockfn}
            onDelete={mockfn}
            existingParam={mockExistingParamData}
            setExistingParam={mockfn}
            setIsEdited={mockfn}
            setIsPageEdited={setIsPageEdited}
            isEdited={false}
            hubConfig={mockConfigData}
            allowGoogleAnalytics
            allowCodeSnippets
          />
        </MockedProvider>
      </TestWrapper>
    );
    const addParamsBtn = await screen.findByRole('button', { key: 'Add-Tracking-Parameters-Button' });
    expect(addParamsBtn).toBeInTheDocument();
    const editPencilKey1 = await screen.findByTestId('pencil-icon-key1');
    expect(editPencilKey1).toBeInTheDocument();
    fireEvent.click(editPencilKey1);
    expect(await screen.findByTestId('add-or-edit-parameters-modal')).toBeInTheDocument();
    const editTrackingParamsModal = within(screen.getByTestId('add-or-edit-parameters-modal'));
    const keyInput = screen.getByTestId('tracking-parameter-key-form-input-key-input');
    expect(keyInput).toBeInTheDocument();
    await userEvent.type(keyInput, 'newKeyValue');
    const saveButton = editTrackingParamsModal.getByRole('button', { name: 'Save' });
    fireEvent.click(saveButton);
    const changedKeyValue = await screen.findByText('key1newKeyValue');
    expect(changedKeyValue).toBeInTheDocument();
  });
});

import React from 'react';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { screen } from 'nucleus-text/testing-library/screen';
import { NewGoogleAnalytics } from '@components/tracking-codes/NewGoogleAnalytics';
import userEvent from '@testing-library/user-event';
import 'jest-axe/extend-expect';
import { axe } from 'jest-axe';

const mockFn = jest.fn();

const appFeatures = [
  {
    name: 'videoCenterInformationFeature',
    enabled: true,
    experimentVersion: '1001'
  }
];

describe('Google Analytics', () => {
  it('renders Google analytics component', async () => {
    const setIsPageEdited = jest.fn();
    const { container } = render(
      <TestWrapper appFeatures={appFeatures}>
        <NewGoogleAnalytics
          measurementId="12345"
          onSaveMeasurementId={mockFn}
          editMeasurementId={false}
          setEditMeasurementId={mockFn}
          setIsPageEdited={setIsPageEdited}
          setIsMeasurementIDEdited={mockFn}
          isMeasurementIDEdited={false}
        />
      </TestWrapper>
    );
    expect(await screen.findByRole('heading', { key: 'google_analytics_set_id_header' })).toBeInTheDocument();
    expect(await screen.findByTextKey('google_analytics_measurement_id_label')).toBeInTheDocument();
    expect(await screen.findByTextKey('google_analytics_set_id_header')).toBeInTheDocument();
    expect(await screen.findByTextKey('google_analytics_sub_header')).toBeInTheDocument();
    expect(await screen.findByTextKey('google_analytics_measurement_id_example')).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders Google Analytics component in edit state', async () => {
    const setIsPageEdited = jest.fn();
    const { container } = render(
      <TestWrapper appFeatures={appFeatures}>
        <NewGoogleAnalytics
          measurementId="12345"
          onSaveMeasurementId={mockFn}
          editMeasurementId
          setEditMeasurementId={mockFn}
          setIsMeasurementIDEdited={mockFn}
          setIsPageEdited={setIsPageEdited}
          isMeasurementIDEdited={false}
        />
      </TestWrapper>
    );
    expect(await screen.findByRole('heading', { key: 'google_analytics_set_id_header' })).toBeInTheDocument();
    expect(await screen.findByRole('textbox', { key: 'google_analytics_measurement_id_label' })).toBeInTheDocument();
    expect(await screen.findByRole('button', { key: 'tracking_codes_save_button' })).toBeInTheDocument();
    expect(await screen.findByTextKey('google_analytics_measurement_id_example')).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders error on wrong measurement id input', async () => {
    const setIsPageEdited = jest.fn();
    const { container } = render(
      <TestWrapper appFeatures={appFeatures}>
        <NewGoogleAnalytics
          measurementId="12345"
          onSaveMeasurementId={mockFn}
          editMeasurementId
          setEditMeasurementId={mockFn}
          isMeasurementIDEdited
          setIsMeasurementIDEdited={mockFn}
          setIsPageEdited={setIsPageEdited}
        />
      </TestWrapper>
    );
    expect(await screen.findByRole('heading', { key: 'google_analytics_set_id_header' })).toBeInTheDocument();
    const saveButton = await screen.findByRole('button', { key: 'tracking_codes_save_button' });
    expect(saveButton).toBeInTheDocument();
    const idTextbox = await screen.findByRole('textbox', { key: 'google_analytics_measurement_id_label' });
    expect(idTextbox).toBeInTheDocument();
    await userEvent.clear(idTextbox);
    await userEvent.type(idTextbox, 'SAN1234-1');
    fireEvent.click(saveButton);
    await waitFor(() => {
      expect(screen.getByTextKey('google_analytics_invalid_id_error')).toBeInTheDocument();
    });
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders google analytics card on save measurement id input', async () => {
    const setIsPageEdited = jest.fn();
    const { container } = render(
      <TestWrapper appFeatures={appFeatures}>
        <NewGoogleAnalytics
          measurementId="12345"
          onSaveMeasurementId={mockFn}
          editMeasurementId
          setEditMeasurementId={mockFn}
          isMeasurementIDEdited
          setIsMeasurementIDEdited={mockFn}
          setIsPageEdited={setIsPageEdited}
        />
      </TestWrapper>
    );
    expect(await screen.findByRole('heading', { key: 'google_analytics_set_id_header' })).toBeInTheDocument();
    const saveButton = await screen.findByRole('button', { key: 'tracking_codes_save_button' });
    expect(saveButton).toBeInTheDocument();
    const idTextbox = await screen.findByRole('textbox', { key: 'google_analytics_measurement_id_label' });
    expect(idTextbox).toBeInTheDocument();
    await userEvent.clear(idTextbox);
    await userEvent.type(idTextbox, 'abcd');
    fireEvent.click(saveButton);
    await waitFor(() => {
      expect(idTextbox).toHaveValue('abcd');
    });
    expect(await axe(container)).toHaveNoViolations();
  });
});

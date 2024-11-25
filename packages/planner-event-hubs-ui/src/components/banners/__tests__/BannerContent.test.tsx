import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { screen } from 'nucleus-text/testing-library/screen';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import { Form } from '@cvent/carina/components/Forms/Form';
import { axe } from 'jest-axe';
import 'jest-axe/extend-expect';
import BannerContent from '../formSections/BannerContent';

const bannerProps = {
  bannerBodyMaxLength: 10,
  bannerButtonTextMaxLength: 10,
  bannertitleMaxLength: 10,
  titleRequired: false,
  hubPagesListData: [
    {
      entityType: 'Channel',
      entityId: '87544b4f-e158-4681-87e0-6a6df8085b01',
      name: 'Channel 1'
    },
    {
      entityType: 'Channel',
      entityId: '72d56910-0a64-4cda-96ce-0db27b835f38',
      name: 'Channel 2'
    },
    {
      entityType: 'Homepage',
      entityId: '55113f0a-9f28-4257-8c0e-3ca34f44c4b9',
      name: 'Homepage'
    }
  ]
};

jest.mock('next/config', () => () => ({
  publicRuntimeConfig: {
    WRITING_ASSISTANT_URL: 'testingAIUrl.com'
  }
}));

function queryIframe(container) {
  return container.querySelector('iframe');
}

const mockInitialValues = {
  imageAlignment: 'Right',
  imageAsset: null,
  altText: '',
  textAlignment: 'Left',
  fontColor: null,
  bannerBody:
    'Baseball is a sport that involves two teams, each comprising of nine players. The teams take turns to bat and field.',
  bannerTitle: 'Testing AI Sample',
  bannerButtonEnabled: false,
  bannerButtonText: '',
  bannerButtonDestinationType: 'Internal',
  VideoCenterPage: '',
  bannerButtonDestinationURL: '',
  count: 1
};

describe('BannerContent', () => {
  it('has all of the correct elements', async () => {
    const { container } = render(
      <TestWrapper>
        <Form>
          <BannerContent {...bannerProps} />
        </Form>
      </TestWrapper>
    );
    expect(await screen.findByTestId('bannerButtonDestinationType')).toBeInTheDocument();
    expect(screen.getByTestId('bannerTitle-input')).toBeInTheDocument();
    expect(screen.getByTestId('bannerTitle')).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('should show helper text in popover', async () => {
    const { container } = render(
      <TestWrapper>
        <Form>
          <BannerContent {...bannerProps} />
        </Form>
      </TestWrapper>
    );
    expect(await screen.findByTestId('bannerButtonDestinationType')).toBeInTheDocument();
    const helperTextToolTip = screen.getByTestId('destination-type-help-circle-icon');
    fireEvent.click(helperTextToolTip);
    expect(await screen.findByTextKey('Banners-Content-Banner-Button-Destination-Tooltip-Text')).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('Should render aiWriting assistant if showAIAssistant is true', async () => {
    const onAIGeneratedTextMock = jest.fn();
    const { container } = render(
      <TestWrapper>
        <Form initialValues={mockInitialValues}>
          <BannerContent {...bannerProps} showAIAssistant onAIGeneratedText={onAIGeneratedTextMock} />
        </Form>
      </TestWrapper>
    );
    expect(await screen.findByTestId('bannerButtonDestinationType')).toBeInTheDocument();
    const assistantIframe = queryIframe(container) as HTMLIFrameElement;
    expect(assistantIframe.src).toContain('testingAIUrl.com');
  });

  it('Should show pages in dropDown when button points to Events+hub option', async () => {
    const { container } = render(
      <TestWrapper>
        <Form>
          <BannerContent {...bannerProps} />
        </Form>
      </TestWrapper>
    );
    expect(await screen.findByTestId('bannerButtonDestinationType')).toBeInTheDocument();
    expect(await screen.findByTextKey('Banners-Form-Video-Center-Page')).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();

    const eventsPlusHubRadio = screen.getByTextKey('Banners-Form-Video-Center-Page');
    fireEvent.click(eventsPlusHubRadio);
    const dropDown = await screen.findByTestId('banner_link_internal_destination_select');
    expect(dropDown).toBeInTheDocument();

    // contents in dropdown
    fireEvent.click(dropDown);
    expect(await screen.findByText('Channel 1')).toBeInTheDocument();
  });

  it('Should an option to take the link for button destination when external option is selected', async () => {
    const { container } = render(
      <TestWrapper>
        <Form>
          <BannerContent {...bannerProps} />
        </Form>
      </TestWrapper>
    );
    expect(await screen.findByTestId('bannerButtonDestinationType')).toBeInTheDocument();
    expect(
      await screen.findByTextKey('Banners-Content-Banner-Button-Destination-Type-External-Link-Label')
    ).toBeInTheDocument();
    const externalLinkRadio = screen.getByTextKey('Banners-Content-Banner-Button-Destination-Type-External-Link-Label');
    fireEvent.click(externalLinkRadio);
    await waitFor(() => {
      expect(screen.getAllByTextKey('Banners-Form-ExternalURL')[0]).toBeInTheDocument();
    });
    // Can be editable
    const textField = screen.getByTestId('bannerButtonDestinationURL-input');
    fireEvent.change(textField, { target: { value: 'www.externallink.com' } });
    expect(await axe(container)).toHaveNoViolations();
  });
});

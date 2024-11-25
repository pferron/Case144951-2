import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { screen } from 'nucleus-text/testing-library/screen';
import BannerTemplates from '@components/banners/BannerTemplates';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import { MockedProvider } from '@apollo/client/testing';
import 'jest-axe/extend-expect';
import { axe } from 'jest-axe';

function querySelectorButton(container) {
  return container.querySelector('button');
}

describe('BannerTemplates', () => {
  const mockOnDismiss = jest.fn();
  it('renders the correct number of banner templates', async () => {
    const { container } = render(
      <TestWrapper>
        <BannerTemplates onDismiss={mockOnDismiss} currentNames={[]} />
      </TestWrapper>
    );

    expect(await screen.findByTestId('text-color-background-banner-template-image')).toBeInTheDocument();

    expect(screen.getByTestId('Banners-Template-Card-TextOnly')).toBeInTheDocument();

    expect(screen.getByTestId('inset-image-banner-template-image')).toBeInTheDocument();

    expect(screen.getByTestId('Banners-Template-Card-InsetImage')).toBeInTheDocument();

    expect(screen.getByTestId('Banners-Template-Card-FullImage')).toBeInTheDocument();

    expect(screen.getByTestId('full-image-banner-template-image')).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('Should call onDismiss when the close button is clicked', async () => {
    const { container } = render(
      <TestWrapper>
        <BannerTemplates onDismiss={mockOnDismiss} currentNames={[]} />
      </TestWrapper>
    );
    expect(await screen.findByTestId('template-selection-modal-header')).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
    const closeBtn = await screen.findByRole('button', { key: 'Banners-Template-Selection-Close-Button' });
    fireEvent.click(closeBtn);
    expect(mockOnDismiss).toHaveBeenCalled();
  });

  it('Should open a creation form when a template has been selected', async () => {
    const { container } = render(
      <MockedProvider>
        <TestWrapper>
          <BannerTemplates onDismiss={mockOnDismiss} currentNames={[]} />
        </TestWrapper>
      </MockedProvider>
    );
    expect(await screen.findByTestId('template-selection-modal-header')).toBeInTheDocument();

    // Text + Color background template
    const textOnlyTemplate = screen.getByTestId('Banners-Template-Card-TextOnly');
    const textOnlyTemplateChoosebtn = querySelectorButton(textOnlyTemplate);
    fireEvent.click(textOnlyTemplateChoosebtn);
    expect(await screen.findByTextKey('Banners-Name-Selection-Title')).toBeInTheDocument();
    fireEvent.click(await screen.findByRole('button', { key: 'Banner-Name-Selection-Back-Button' }));
    expect(await screen.findByTestId('template-selection-modal-header')).toBeInTheDocument();

    // Inset image Template
    const insetImageTemplate = screen.getByTestId('Banners-Template-Card-InsetImage');
    const insetImageTemplateChoosebtn = querySelectorButton(insetImageTemplate);
    fireEvent.click(insetImageTemplateChoosebtn);
    expect(await screen.findByTextKey('Banners-Name-Selection-Title')).toBeInTheDocument();
    fireEvent.click(await screen.findByRole('button', { key: 'Banner-Name-Selection-Back-Button' }));
    expect(await screen.findByTestId('template-selection-modal-header')).toBeInTheDocument();

    // Full image background Template
    const fullImageTemplate = screen.getByTestId('Banners-Template-Card-FullImage');
    const fullImageTemplateChoosebtn = querySelectorButton(fullImageTemplate);
    fireEvent.click(fullImageTemplateChoosebtn);
    expect(await screen.findByTextKey('Banners-Name-Selection-Title')).toBeInTheDocument();
    fireEvent.click(await screen.findByRole('button', { key: 'Banner-Name-Selection-Back-Button' }));
    expect(await screen.findByTestId('template-selection-modal-header')).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });
});

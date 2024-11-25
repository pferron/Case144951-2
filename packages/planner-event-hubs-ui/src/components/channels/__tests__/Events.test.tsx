import { render, screen } from '@testing-library/react';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import React from 'react';
import Events from '@components/channels/events/Events';
import 'jest-axe/extend-expect';
import { axe } from 'jest-axe';
import CatalogDataWithoutSection from '../../../stories/fixtures/DummyCatalogDataFileWithoutSection.json';

const onEdit = (): void => {
  /* empty */
};
const onSave = (): void => {
  /* empty */
};
const onCancel = (): void => {
  /* empty */
};

describe('Channel Events', () => {
  it('Render Channel Events', async () => {
    const { container } = render(
      <TestWrapper>
        <Events eventCatalog={CatalogDataWithoutSection} editMode onEdit={onEdit} onSave={onSave} onCancel={onCancel} />
      </TestWrapper>
    );
    expect(await screen.findByTestId('Catalog-Video-Skeleton')).toBeInTheDocument();
    expect(await screen.findByTestId('catalog-preview')).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });
});

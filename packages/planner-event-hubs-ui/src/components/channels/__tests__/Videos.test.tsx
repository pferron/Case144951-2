import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import React from 'react';
import Videos from '@components/channels/videos/Videos';
import CatalogDataWithoutSection from '../../../stories/fixtures/DummyCatalogDataFileWithoutSection.json';
import CatalogDataWithSection from '../../../stories/fixtures/DummyCatalogDataFileWithSection.json';
import 'jest-axe/extend-expect';

const onVideoCatalogUpdate = () => {
  /**/
};

jest.mock('next/config', () => () => ({
  publicRuntimeConfig: {
    PLANNER_VIDEO_SOLUTION_URL: 'https://video-solution.app.T2.cvent.com'
  }
}));

describe('Test Channel Videos', () => {
  it('Render Channel Videos without section', async () => {
    const { baseElement } = render(
      <TestWrapper>
        <Videos
          videoCatalog={CatalogDataWithoutSection}
          onVideoCatalogUpdate={onVideoCatalogUpdate}
          containerRef={null}
          setIsPageEdited={jest.fn()}
          isSuccess
          setIsSuccess={jest.fn()}
          submitRef={null}
        />
      </TestWrapper>
    );

    const sectionId = CatalogDataWithoutSection.sections[0].id;

    expect(baseElement).toMatchSnapshot();
    expect(screen.queryByTestId(`section-${sectionId}`)).not.toBeInTheDocument();
    expect(screen.getAllByAltText(/Video A/i).length).toBeGreaterThan(0);
    expect(screen.queryAllByAltText(/Section A/i).length).toBe(0);
    expect(baseElement).toMatchSnapshot();
    // HUB-137682
    // expect(await axe(baseElement)).toHaveNoViolations();
  });

  it('Render Channel Videos with section', async () => {
    const { baseElement } = render(
      <TestWrapper>
        <Videos
          videoCatalog={CatalogDataWithSection}
          onVideoCatalogUpdate={onVideoCatalogUpdate}
          containerRef={null}
          setIsPageEdited={jest.fn()}
          isSuccess
          setIsSuccess={jest.fn()}
          submitRef={null}
        />
      </TestWrapper>
    );

    const sectionId = CatalogDataWithSection.sections[0].id;
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByTestId(`section-${sectionId}`)).toBeInTheDocument();
    expect(screen.getAllByAltText(/Video A/i).length).toBeGreaterThan(0);
    expect(baseElement).toMatchSnapshot();
    // HUB-137682
    // expect(await axe(baseElement)).toHaveNoViolations();
  });

  it('Render Channel Videos with section and open create section modal', async () => {
    render(
      <TestWrapper>
        <Videos
          videoCatalog={CatalogDataWithSection}
          onVideoCatalogUpdate={onVideoCatalogUpdate}
          containerRef={null}
          setIsPageEdited={jest.fn()}
          isSuccess
          setIsSuccess={jest.fn()}
          submitRef={null}
        />
      </TestWrapper>
    );

    expect(screen.getAllByAltText(/Video A/i).length).toBeGreaterThan(0);
    expect(await screen.findByText('Build your channel by adding videos from your library.')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /create a section/i })).toBeInTheDocument();
    });
    const cancelBtn = await screen.findByRole('button', { name: /create a section/i });
    fireEvent.click(cancelBtn);
    expect(screen.getByRole('heading', { name: /create section/i })).toBeInTheDocument();
    // HUB-137682
    // expect(await axe(baseElement)).toHaveNoViolations();
  });

  it('Render Channel Videos without data', async () => {
    render(
      <TestWrapper>
        <Videos
          videoCatalog={null}
          onVideoCatalogUpdate={onVideoCatalogUpdate}
          containerRef={null}
          setIsPageEdited={jest.fn()}
          isSuccess
          setIsSuccess={jest.fn()}
          submitRef={null}
        />
      </TestWrapper>
    );
    expect(screen.getByTestId('Catalog-Video-Skeleton')).toBeInTheDocument();
    // HUB-137682
    // expect(await axe(baseElement)).toHaveNoViolations();
  });
});

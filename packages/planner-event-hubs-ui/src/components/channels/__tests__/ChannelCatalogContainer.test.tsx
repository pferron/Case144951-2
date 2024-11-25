import { render, screen } from '@testing-library/react';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import React from 'react';
import ChannelCatalogContainer from '@components/channels/videos/ChannelCatalogContainer';
import { MockedProvider } from '@apollo/client/testing';

import { getCatalogQuery } from '@cvent/planner-event-hubs-model/operations/channel';
import { ChannelStatus } from '@cvent/planner-event-hubs-model/types';
import CatalogDataWithoutSection from '../../../stories/fixtures/DummyCatalogDataFileWithoutSection.json';
import 'jest-axe/extend-expect';

const mock = [
  {
    request: {
      query: getCatalogQuery,
      variables: { catalogId: '12392258-cee6-4e11-97d5-f90a48412395' }
    },
    result: {
      data: {
        getCatalog: CatalogDataWithoutSection
      }
    }
  }
];

const channelData = {
  id: '',
  title: 'test title',
  description: 'test desc',
  status: ChannelStatus.Inactive,
  catalogId: '12392258-cee6-4e11-97d5-f90a48412395'
};

describe('Test Channel Catalog container', () => {
  it('Render Channel Videos without sections', async () => {
    const { baseElement } = render(
      <MockedProvider mocks={mock}>
        <TestWrapper>
          <ChannelCatalogContainer
            setCatalogInChannelData={jest.fn()}
            channelData={channelData}
            containerRef={null}
            setIsPageEdited={null}
            submitRef={null}
          />
        </TestWrapper>
      </MockedProvider>
    );

    await new Promise(resolve => {
      setTimeout(resolve, 0);
    });
    const sectionId = CatalogDataWithoutSection.sections[0].id;

    expect(baseElement).toMatchSnapshot();
    expect(screen.queryByTestId(`section-${sectionId}`)).not.toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
    // HUB-137682
    // expect(await axe(baseElement)).toHaveNoViolations();
  });
});

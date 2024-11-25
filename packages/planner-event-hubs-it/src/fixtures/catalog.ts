import { CatalogInput, CatalogOwnerType, CatalogType, SectionType } from '@cvent/planner-event-hubs-model/operations';
import { v4 as uuidV4 } from 'uuid';
import { videoDataSet } from './videoData';

export const catalogInputData: CatalogInput = {
  sections: [
    {
      id: uuidV4(),
      title: 'default section',
      videos: [{ videoId: videoDataSet.videoId }],
      sectionType: SectionType.Default
    }
  ],
  catalogType: CatalogType.List,
  catalogOwner: CatalogOwnerType.VideoHub
};
export const updateCatalogInputData: CatalogInput = {
  sections: [
    {
      id: uuidV4(),
      title: 'section 1',
      videos: [{ videoId: videoDataSet.videoId }],
      sectionType: SectionType.Default
    },
    {
      id: uuidV4(),
      title: 'section 2',
      videos: [],
      sectionType: SectionType.Custom
    },
    {
      id: uuidV4(),
      title: 'section 3',
      videos: [{ videoId: videoDataSet.videoId }],
      sectionType: SectionType.Custom
    }
  ],
  catalogType: CatalogType.Sections,
  catalogOwner: CatalogOwnerType.VideoHub
};

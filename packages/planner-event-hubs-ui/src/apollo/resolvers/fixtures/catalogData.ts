import { CatalogOwnerType, CatalogType, SectionType, VideoStatus } from '@cvent/planner-event-hubs-model/types';

export const catalogId = '8fd7f50c-6903-4f66-8661-d1c6b180b078';
export const videoId = 'fa05c0a2-b710-11ec-9cf6-4fcef4e44b4e';

export const catalogOutput = {
  id: catalogId,
  sectionCount: 1,
  sections: [
    {
      id: '04ca6ae2-0dc3-487b-953e-86d6abbdf7d6',
      videoCount: 1,
      title: 'default section',
      videos: [
        {
          id: '05fa6ae2-0dc3-487b-953e-86d6abbdf7d6',
          displayName: 'Video display name',
          duration: 3600000,
          thumbnail: '?token=90c5f062-76ad-4ea4-aa53-00eb698d9262',
          status: 'Available',
          order: 1,
          sessionId: '05ca6ae2-0dc3-487b-953e-86d6abbdf7d6',
          videoId,
          webcastId: '45fa6ae2-0dc3-487b-953e-78d6abbdf7d6'
        }
      ],
      sectionType: SectionType.Default,
      order: 1
    },
    {
      id: '04ca6ae2-0dc3-487b-953e-86d6abbdf7d5',
      videoCount: 0,
      title: 'new section',
      videos: [],
      sectionType: SectionType.Custom,
      order: 2
    },
    {
      id: '04ca6ae2-0dc3-487b-953e-86d6abbdf7d5',
      videoCount: 0,
      title: 'new section2',
      videos: null,
      sectionType: SectionType.Custom,
      order: 3
    }
  ],
  catalogType: CatalogType.Sections,
  catalogOwner: CatalogOwnerType.VideoHub
};

export const videoData = {
  data: [
    {
      id: videoId,
      title: 'Video name',
      status: VideoStatus.Available,
      generatedThumbnail: { url: { href: '?token=90c5f062-76ad-4ea4-aa53-00eb698d9262' } },
      date: '2022-02-02'
    }
  ]
};

export const catalogWithEmptySections = {
  id: catalogId,
  sectionCount: 1,
  sections: [
    {
      id: '04ca6ae2-0dc3-487b-953e-86d6abbdf7d6',
      videoCount: 0,
      title: 'default section',
      videos: [],
      sectionType: SectionType.Default,
      order: 1
    },
    {
      id: '04ca6ae2-0dc3-487b-953e-86d6abbdf7d5',
      videoCount: 0,
      title: 'new section',
      videos: [],
      sectionType: SectionType.Custom,
      order: 2
    }
  ],
  catalogType: CatalogType.Sections,
  catalogOwner: CatalogOwnerType.VideoHub
};

export const listCatalogWithVideos = {
  paging: {
    limit: 100,
    totalCount: 20,
    currentToken: '4cb17e75-f492-4e1a-a952-a47e02415ec7'
  },
  data: [catalogOutput]
};

export const listCatalogWithoutVideos = {
  paging: {
    limit: 100,
    totalCount: 20,
    currentToken: '4cb17e75-f492-4e1a-a952-a47e02415ec7'
  },
  data: [catalogWithEmptySections]
};

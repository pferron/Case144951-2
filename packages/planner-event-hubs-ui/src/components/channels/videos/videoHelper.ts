import { CatalogPreview } from '@cvent/preview-skeleton/src/catalog-video-skeleton/type/type';
import { AccessibilityLabels } from '@cvent/drag-and-drop-catalog/dist/types/accessibilityTypes';
import {
  ExtendedItem,
  ExtendedItemCatalog,
  ExtendedSection,
  ChannelCatalog
} from '@components/channels/type/channelCatalog';
import { CATALOG_OWNER, CATALOG_TYPE_LIST, CATALOG_TYPE_SECTIONS, DEFAULT_SECTION_TYPE } from '@utils/constants';

export const EMPTY_CATALOG = {
  id: null,
  sections: [],
  catalogType: CATALOG_TYPE_LIST
};

export const convertCatalogToCatalogPreview = (catalog: ExtendedItemCatalog | ChannelCatalog): CatalogPreview => {
  if (catalog === undefined || catalog === null) {
    return EMPTY_CATALOG;
  }
  const sections = catalog.sections?.map(section => {
    const itemList = section.items === undefined ? section.videos : section.items;
    const items = itemList?.map(item => {
      return {
        id: item.id,
        videoId: item.videoId
      };
    });
    return {
      id: section.id,
      title: section.title,
      videoCount: items?.length || 0,
      videos: items
    };
  });
  return {
    id: catalog.id,
    sections,
    catalogType: (sections.length > 1 && CATALOG_TYPE_SECTIONS) || CATALOG_TYPE_LIST
  };
};

export const convertItemCatalogToVideoCatalog = (itemCatalog: ExtendedItemCatalog): ChannelCatalog => {
  if (!itemCatalog) {
    return null;
  }
  const sections = itemCatalog.sections?.map(section => {
    const itemList = section?.items;
    const items = itemList
      ?.filter(item => !!item)
      ?.map(item => {
        return {
          videoId: item.videoId
        };
      });
    return {
      id: section.id,
      title: section.title,
      videos: items,
      sectionType: section.sectionType
    };
  });
  return {
    sections,
    catalogType: (sections.length > 1 && CATALOG_TYPE_SECTIONS) || CATALOG_TYPE_LIST,
    catalogOwner: CATALOG_OWNER
  };
};

/**
 * Provide whether to show catalog
 * @param itemCatalog
 */
export const showSection = (itemCatalog: ExtendedItemCatalog): boolean => {
  return itemCatalog?.sections?.length > 1;
};

export const labels: AccessibilityLabels = {
  keyBoardAccessibilityLabels: {
    section: {
      focus: 'channel_video_section_focus',
      selected: 'channel_video_section_selected',
      deselected: 'channel_video_section_deselected',
      moved: 'channel_video_section_moved'
    },
    item: {
      focus: 'channel_video_section_item_Focus',
      selected: 'channel_video_section_item_selected',
      deselected: 'channel_video_section_item_deselected',
      moved: 'channel_video_section_item_moved',
      sectionChanged: 'channel_video_section_item_section_changed'
    }
  },
  dragHandleButton: 'channel_video_section_drag_handle_button',
  chevronButton: 'channel_video_section_chevron'
};

export const formatHoursFromMilliseconds = (milliseconds = 0): string => {
  if (Number.isNaN(milliseconds)) {
    return '';
  }

  if (milliseconds < 0) {
    return '';
  }

  const seconds = milliseconds / 1000;
  const HH = `${Math.floor(seconds / 3600)}`.padStart(2, '0');
  const mm = `${Math.floor((seconds % 3600) / 60)}`.padStart(2, '0');
  const ss = `${Math.floor((seconds % 3600) % 60)}`.padStart(2, '0');

  const formatString = HH === '00' ? 'mm:ss' : 'HH:mm:ss';
  return formatString.replace('HH', HH).replace('mm', mm).replace('ss', ss);
};

export const getDefaultSection = (itemCatalog: ExtendedItemCatalog): ExtendedSection => {
  return itemCatalog?.sections?.find(section => section.sectionType === DEFAULT_SECTION_TYPE);
};

export const getSection = (itemCatalog: ExtendedItemCatalog, sectionId: string): ExtendedSection => {
  return itemCatalog?.sections?.find(section => section.id === sectionId);
};

export const getAndRemoveVideosFromSection = (
  section: ExtendedSection,
  videoIds: Array<string>
): {
  removedVideos: Array<ExtendedItem>;
  updatedSection: ExtendedSection;
} => {
  if (!section) {
    return null;
  }
  const removedVideos = section.items.filter(video => videoIds.includes(video.id));
  const notRemovedVideos = section.items.filter(video => !videoIds.includes(video.id));
  const updatedSection: ExtendedSection = {
    ...section,
    itemCount: notRemovedVideos.length,
    items: notRemovedVideos
  };

  return {
    removedVideos,
    updatedSection
  };
};

export const addVideoInSection = (section: ExtendedSection, videos: Array<ExtendedItem>): ExtendedSection => {
  if (!section) {
    return null;
  }
  const updateVideos = [...section.items, ...videos];
  return {
    ...section,
    itemCount: updateVideos.length,
    items: updateVideos
  };
};

export const createSectionWithVideos = (
  sectionId: string,
  sectionName: string,
  videos: Array<ExtendedItem>,
  sectionType: string
): ExtendedSection => {
  return {
    id: sectionId,
    title: sectionName,
    itemCount: videos.length,
    items: videos,
    content: null,
    sectionType
  };
};

export const getItemIds = (items: ExtendedItemCatalog): Array<string> => {
  const itemsIds = [];
  items?.sections?.forEach(section => {
    if (section) {
      // itemsIds.push(...section?.items?.filter(item => !!item?.videoId).map(item => item.videoId));
      itemsIds.push(...(section?.items || []).filter(item => item && item.videoId).map(item => item.videoId));
    }
  });
  return itemsIds;
};

export const getVideoIds = (channelCatalog: ChannelCatalog): Array<string> => {
  const videoIds = [];
  channelCatalog?.sections?.forEach(section => {
    if (section) {
      // videoIds.push(...section?.videos?.filter(video => !!video?.videoId).map(video => video.videoId));
      videoIds.push(...(section?.videos || []).filter(video => video && video.videoId).map(video => video.videoId));
    }
  });
  return videoIds;
};

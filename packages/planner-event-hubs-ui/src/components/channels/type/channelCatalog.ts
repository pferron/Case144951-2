import { Catalog as ItemCatalog } from '@cvent/drag-and-drop-catalog/dist/types/catalogTypes';
import { Item, Section as ItemSection } from '@cvent/drag-and-drop-catalog/src/types/catalogTypes';

export interface ChannelCatalogVideo {
  id?: string;
  displayName?: string;
  duration?: number;
  thumbnail?: string;
  videoId: string;
}

export interface ChannelCatalogSection {
  id: string;
  title: string;
  videoCount?: number;
  videos: Array<ChannelCatalogVideo>;
  sectionType: string;
}

export interface ChannelCatalog {
  id?: string;
  sections: Array<ChannelCatalogSection>;
  catalogType: string;
  catalogOwner: string;
}

/**
 * Extended types Generic catalog interface to provide some local properties
 * */
export interface ExtendedItem extends Item {
  duration?: number;
  thumbnail?: string;
  videoId: string;
}

export interface ExtendedSection extends ItemSection {
  items: Array<ExtendedItem>;
  sectionType?: string;
}

export interface ExtendedItemCatalog extends ItemCatalog {
  sections: Array<ExtendedSection>;
}

export interface MenuActionData {
  sectionId: string;
  itemId?: string;
  isBefore?: boolean;
}

import { EntityType, PageSection, PageSectionInput } from '@cvent/planner-event-hubs-model/types';
import { publishImage } from './upload';

export const processNewSectionImage = async (
  section: PageSectionInput,
  centerId: string,
  accountMappingId: string,
  // RED
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dataSources: Record<string, any>
): Promise<PageSection> => {
  if (section?.newImageUrl) {
    const processedSection = section;
    const { originalImageUrl, optimizedImageUrl } = await publishImage(
      {
        newImageUrl: section.newImageUrl,
        newOriginalImageUrl: section.newOriginalImageUrl,
        imageUrl: section.imageUrl,
        originalImageUrl: section.originalImageUrl
      },
      {
        accountMappingId,
        centerId,
        entityId: section.sectionId,
        entityType: EntityType.Section
      },
      dataSources
    );

    processedSection.imageUrl = optimizedImageUrl;
    processedSection.originalImageUrl = originalImageUrl;

    return processedSection as PageSection;
  }

  return section as PageSection;
};

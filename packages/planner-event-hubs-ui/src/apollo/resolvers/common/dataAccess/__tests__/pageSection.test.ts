import { EntityType } from '@cvent/planner-event-hubs-model/types';
import { publishImage } from '../upload';
import { processNewSectionImage } from '../pageSection';

jest.mock('../upload', () => ({
  publishImage: jest
    .fn()
    .mockResolvedValue({ optimizedImageUrl: 'optimizedImageUrl', originalImageUrl: 'processedOriginalImageUrl' })
}));

describe('processNewSectionImage(section, centerId, accountMappingId, dataSources)', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('when section.newImageUrl is present: publish the new image and update the section with the new image URLs', async () => {
    const section = {
      newImageUrl: 'newImageUrl',
      newOriginalImageUrl: 'newOriginalImageUrl',
      imageUrl: 'imageUrl',
      originalImageUrl: 'originalImageUrl',
      sectionId: 'sectionId',
      originPageId: 'originPageId'
    };
    const dataSources = {};
    const accountMappingId = 'accountMappingId';
    const centerId = 'centerId';
    const processedSection = await processNewSectionImage(section, centerId, accountMappingId, dataSources);
    expect(processedSection.imageUrl).toEqual('optimizedImageUrl');
    expect(processedSection.originalImageUrl).toEqual('processedOriginalImageUrl');
  });

  it('when section.newImageUrl is not present: return the section as is', async () => {
    const section = {
      imageUrl: 'imageUrl',
      originalImageUrl: 'originalImageUrl',
      sectionId: 'sectionId',
      originPageId: 'originPageId'
    };
    const dataSources = {};
    const accountMappingId = 'accountMappingId';
    const centerId = 'centerId';
    const processedSection = await processNewSectionImage(section, centerId, accountMappingId, dataSources);
    expect(processedSection).toEqual(section);
  });

  it('when section.newImageUrl is present: call publishImage with the correct parameters', async () => {
    const section = {
      newImageUrl: 'newImageUrl',
      newOriginalImageUrl: 'newOriginalImageUrl',
      imageUrl: 'imageUrl',
      originalImageUrl: 'originalImageUrl',
      sectionId: 'sectionId',
      originPageId: 'originPageId'
    };
    const dataSources = {};
    const accountMappingId = 'accountMappingId';
    const centerId = 'centerId';
    await processNewSectionImage(section, centerId, accountMappingId, dataSources);
    expect(publishImage).toHaveBeenCalledWith(
      {
        newImageUrl: 'newImageUrl',
        newOriginalImageUrl: 'newOriginalImageUrl',
        imageUrl: 'imageUrl',
        originalImageUrl: 'originalImageUrl'
      },
      {
        accountMappingId: 'accountMappingId',
        centerId: 'centerId',
        entityId: 'sectionId',
        entityType: EntityType.Section
      },
      {}
    );
  });
});

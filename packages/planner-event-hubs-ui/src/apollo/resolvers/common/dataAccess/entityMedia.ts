import { EntityImage, EntityImageInput, EntityInput } from '@cvent/planner-event-hubs-model/types';
import { EntityImagesServiceClient } from '@dataSources/entityImagesService/client';

export const deleteEntityImage = async (
  entityImagesClient: EntityImagesServiceClient,
  imageId: string
): Promise<boolean> => {
  await entityImagesClient.deleteEntityImage(imageId);
  return true;
};

export const uploadEntityImage = async (
  entityImagesClient: EntityImagesServiceClient,
  imageInput: EntityImageInput
): Promise<EntityImage> => {
  if (imageInput?.previousImageId) {
    await deleteEntityImage(entityImagesClient, imageInput?.previousImageId);
  }
  const entityImageData = await entityImagesClient.uploadEntityImage(imageInput);
  return {
    id: entityImageData.id,
    url: entityImageData.optimizedUrl,
    filename: entityImageData.name,
    size: entityImageData.size,
    entityId: entityImageData.entityId,
    entityType: entityImageData.entityType,
    createdAt: entityImageData.createdAt
  };
};

export const getEntityImage = async (
  entityImagesClient: EntityImagesServiceClient,
  entity: EntityInput
): Promise<EntityImage> => {
  const entityImageData = await entityImagesClient.getEntityImage(entity);
  const entityImage = entityImageData?.data[0];
  if (!entityImage) {
    return null;
  }
  return {
    id: entityImage.id,
    url: entityImage.optimizedUrl,
    filename: entityImage.name,
    size: entityImage.size,
    entityId: entityImage.entityId,
    entityType: entityImage.entityType,
    createdAt: entityImage.createdAt
  };
};

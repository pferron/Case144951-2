import {
  CREATE_BANNER_MUTATION,
  DELETE_BANNER_MUTATION,
  UPDATE_BANNER_ASSOCIATIONS,
  UPDATE_BANNER_MUTATION
} from '@cvent/planner-event-hubs-model/operations/banner';
import { BannerAssociationPaging, ExistingBanner } from '@cvent/planner-event-hubs-model/src/types';
import { connectToApiAsPlanner } from '../../utils/authUtils';

export const newBannerTextInput = {
  title: '[Video Hub UI E2E] New Banner Title',
  body: '[Video Hub UI E2E] New Banner Body',
  alignment: 'Center'
};

export const createBanner = async (hubId: string, bannerName: string, bannerType: string): Promise<string> => {
  const client = await connectToApiAsPlanner();

  return (
    await client.mutate({
      mutation: CREATE_BANNER_MUTATION,
      variables: {
        input: {
          centerId: hubId,
          name: bannerName,
          layout: bannerType,
          text: newBannerTextInput
        }
      }
    })
  ).data.bannerCreate as string;
};

export const updateBannerImage = async (
  hubId: string,
  bannerId: string,
  bannerName: string,
  bannerType: string,
  imageUrl: string,
  imageAltText: string
): Promise<ExistingBanner> => {
  const client = await connectToApiAsPlanner();

  return (
    await client.mutate({
      mutation: UPDATE_BANNER_MUTATION,
      variables: {
        input: {
          id: bannerId,
          centerId: hubId,
          name: bannerName,
          layout: bannerType,
          imageAltText,
          imageUrl,
          text: newBannerTextInput
        }
      }
    })
  ).data.bannerUpdate;
};

export const deleteBanner = async (centerId: string, bannerId: string): Promise<string> => {
  const bannersSearch = {
    centerId,
    bannerId
  };

  const client = await connectToApiAsPlanner();

  return (
    await client.mutate({
      mutation: DELETE_BANNER_MUTATION,
      variables: {
        bannersSearch
      }
    })
  ).data.bannerDelete as string;
};

export const associateBanner = async (
  centerId: string,
  banner: string,
  entityType: string
): Promise<BannerAssociationPaging> => {
  const bannerIdAssociation = [
    {
      banner,
      displayOrder: 1
    }
  ];

  const bannerIdAssociationCreate = {
    centerId,
    entityId: centerId,
    entityType,
    bannerAssociation: bannerIdAssociation
  };

  const client = await connectToApiAsPlanner();
  return (
    await client.mutate({
      mutation: UPDATE_BANNER_ASSOCIATIONS,
      variables: {
        input: bannerIdAssociationCreate
      }
    })
  ).data.setBannerAssociations;
};

export const removeAssociateBanner = async (centerId: string, entityType: string): Promise<BannerAssociationPaging> => {
  const bannerIdAssociation = [];

  const bannerIdAssociationCreate = {
    centerId,
    entityId: centerId,
    entityType,
    bannerAssociation: bannerIdAssociation
  };

  const client = await connectToApiAsPlanner();
  return (
    await client.mutate({
      mutation: UPDATE_BANNER_ASSOCIATIONS,
      variables: {
        input: bannerIdAssociationCreate
      }
    })
  ).data.setBannerAssociations;
};

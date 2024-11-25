import { gql } from '@apollo/client';

export const getEntityImage = gql`
  query getEntityImage($entity: EntityInput!) {
    getEntityImage(entity: $entity) {
      id
      entityId
      entityType
      filename
      size
      url
      createdAt
    }
  }
`;

export const uploadEntityImage = gql`
  mutation uploadEntityImage($imageInput: EntityImageInput!) {
    uploadEntityImage(imageInput: $imageInput) {
      id
      entityId
      entityType
      filename
      size
      url
      createdAt
    }
  }
`;

export const deleteEntityImage = gql`
  mutation deleteEntityImage($imageId: String!) {
    deleteEntityImage(imageId: $imageId)
  }
`;

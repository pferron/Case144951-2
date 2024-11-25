import { CvestDataSource } from '@dataSources/CvestDataSource';
import { EntityImageInput, EntityInput } from '@cvent/planner-event-hubs-model/types';
import { NOT_FOUND_ERROR_CODE } from '@utils/constants';
import { getAccountMappingId } from '@resolvers/common/utils/authMetadataUtils';

export interface ImageResponse {
  id: string;
  entityId: string;
  entityType: string;
  name: string;
  relativePath: string;
  optimizedUrl: string;
  createdAt: string;
  filename: string;
  size: number;
  isPrimary: boolean;
}

export interface Paging {
  limit: number;
  currentToken: string;
}

export interface ImageFilterResponse {
  paging?: Paging;
  data: ImageResponse[];
}

export class EntityImagesServiceClient extends CvestDataSource {
  constructor() {
    super();
    this.baseURL = `${process.env.EVENT_IMAGES_SERVICE_URL}/v1/`;
  }

  createEntityFilter = (entity: EntityInput): string => {
    return `primary eq 'true' and entity.type eq '${entity.type}' and entity.id eq '${entity.id}'`;
  };

  getEntityImage = async (entity): Promise<ImageFilterResponse> => {
    try {
      return await this.get(
        `images?filter=${this.createEntityFilter(entity)}`,
        {},
        {
          headers: {
            authorization: `API_KEY ${process.env.API_KEY}`,
            'cvent-account-mapping-id': getAccountMappingId(this.context.auth)
          }
        }
      );
    } catch (e) {
      // We don't want to throw error if no image is added to a channel
      if (e.code === NOT_FOUND_ERROR_CODE) {
        return null;
      }
      throw e;
    }
  };

  deleteEntityImage = async (imageId: string): Promise<void> => {
    return this.delete(`images/${imageId}`);
  };

  uploadEntityImage = async (imageInput: EntityImageInput): Promise<ImageResponse> => {
    return this.post(`images`, imageInput);
  };
}

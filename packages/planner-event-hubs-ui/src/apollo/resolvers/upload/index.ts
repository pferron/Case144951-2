import { PreSignedResponse, Resolvers, S3ProxyCallbackPayload } from '@cvent/planner-event-hubs-model/types';
import { checkScanStatus, generatePreSignedUrl } from '@resolvers/common/dataAccess/upload';
import { getAccountMappingId, getEnvironment } from '@resolvers/common/utils/authMetadataUtils';
import { RedisCache } from '@server/cache/RedisCache';

const resolver: Resolvers = {
  Query: {
    checkScanStatus: async (_parent, args, _context): Promise<S3ProxyCallbackPayload> => {
      return checkScanStatus(RedisCache.redisClient, args.input.filePath);
    },
    generatePreSignedUrl: async (_parent, args, { dataSources, auth }): Promise<PreSignedResponse> => {
      const accountMappingId = getAccountMappingId(auth);
      const environment = getEnvironment(auth);
      return generatePreSignedUrl(
        dataSources.s3ProxyServiceClient,
        RedisCache.redisClient,
        accountMappingId,
        environment,
        args.input.centerId,
        args.input.entityId,
        args.input.entityType,
        args.input.fileName,
        args.input.fileExtension
      );
    }
  }
};

export default resolver;

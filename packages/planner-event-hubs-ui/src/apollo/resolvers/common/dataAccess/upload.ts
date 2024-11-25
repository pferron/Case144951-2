import { LoggerFactory } from '@cvent/logging/LoggerFactory';
import { S3ProxyClient } from '@dataSources/s3ProxyService/client';
import { ImageLookupClient } from '@dataSources/imageLookupService/client';
import {
  EntityType,
  ImageFieldDelta,
  PreSignedResponse,
  PublishImageInput,
  S3ProxyCallbackPayload
} from '@cvent/planner-event-hubs-model/types';
import { extractFileBaseName, extractFileExtension, extractFileName } from '@server/utils';
import { ACCOUNT_STUB } from '@utils/constants';
import { URLSearchParams } from 'apollo-server-env';
import Redis from 'ioredis';
import { isEmpty } from 'lodash';
import { RedisCache } from '@server/cache/RedisCache';
import { CacheConfig, getS3ProxyCacheKey } from '@server/cache/CacheConfigs';

const LOG = LoggerFactory.create('dataAccess-upload');

// Full File path Format will be like -> <account_mapping_Id>/video-center/<video_center_id>/<entity_type>/<entity_id>/<file_name>.<extension>
// ex - f6d74648-2c09-496f-a3e3-e3f6cd1503a0/video-center/8a6fcea8-b967-40b9-9c71-ff9e1023fc68/banner/5e6fcea8-b967-40b9-9c71-ff9e1023fc29/image.png
const s3Path = (config: PublishImageInput): string => {
  let fullFilePath = `video-center/${config.centerId}/${config.entityType.toString()}/${config.entityId}/${
    config.fileName
  }.${config.fileExtension}`;
  fullFilePath =
    config.entityType === EntityType.Temp
      ? `${ACCOUNT_STUB}/${fullFilePath}`
      : `${config.accountMappingId}/${fullFilePath}`;
  return fullFilePath.toLowerCase();
};

/**
 * Builds URLs compatible with s3proxy-service in order to move files from temp locations under ACCOUNT_STUB to final, GDPR-compliant locations in S3.
 *
 * @param newUrl String URL of existing s3 file, may be direct to s3 via amazonaws.com or hosted on a cvent domain e.g. images.cvent.com
 * @param config PublishImageInput used to build file names
 * @returns An object with from property corresponding to an existing temp file location in s3 and a to property corresponding to a desired final GDPR-compliant file location in s3
 */
const targetS3Paths = (newUrl: string, config: PublishImageInput): { from: string; to: string } => {
  if (isEmpty(newUrl)) {
    return { from: null, to: null };
  }
  const fromUrl = new URL(newUrl);
  const _fileName = extractFileName(fromUrl.pathname);
  const fileName = extractFileBaseName(_fileName);
  const fileExtension = extractFileExtension(_fileName);
  const _config = { fileName, fileExtension, ...config };
  // fromPath that does not startWith ACCOUNT_STUB is a direct s3 URL
  const from = fromUrl.pathname.startsWith(`/${ACCOUNT_STUB}`)
    ? fromUrl.pathname
    : fromUrl.pathname.substring(fromUrl.pathname.indexOf(`/${ACCOUNT_STUB}`));
  const to = s3Path(_config);
  return { from, to };
};

/**
 * Looksup a hashedURL for CDN-optimized, cache-bustable image references to use in front-ends.
 *
 * @param masterImageUrl String URL pointing to a file uploaded to s3proxy-service
 * @param imageLookupClient Node client for Image Lookup Service
 * @returns hashedURL property from the Image Lookup Service response
 */
export const imageLookup = async (masterImageUrl: string, imageLookupClient: ImageLookupClient): Promise<string> => {
  LOG.info('looking up image url for ', masterImageUrl);
  const response = await imageLookupClient.lookup([masterImageUrl]);
  LOG.info(`looked up image url for ${masterImageUrl}, got`, response);
  const imageData = response?.data[masterImageUrl];
  if (imageData && imageData.hashedURL && imageData.height && masterImageUrl !== imageData.hashedURL) {
    return imageData.hashedURL;
  }
  // successful responses will
  // - return height/width for each hashedURL
  // - return CDN-backed & optimized (scaled) hashedURLs
  // unsuccessful responses may
  // - return a CDN-backed domain with viable URL to non-optimized image
  // - omit height/width properties
  // - return the same masterImageUrl as the hashedURL
  // - return only an errorDetails property
  LOG.error(
    `Failed to look up image url for ${masterImageUrl}. Planner will have trouble uploading images to VideoCenter.`,
    response
  );
  throw Error(`An error occurred while optimizing ${masterImageUrl}. ${response.data.toString()}`);
};

/**
 * Take a tempUrlToOptimize and tempUrlToOriginal, which may point to the same file, and move them to a GDPR-compliant location under the Planner account-identifier.
 * If they point to the same file, the move operation is performed only once.
 *
 * @param tempUrlToOptimize string of the url where the file currently resides
 * @param tempUrlToEdit string of the url where the original file currently resides (may equal newMaybeCroppedUrl when Planner Cancels ImageEditor but saves image)
 * @param config PublishImageInput used to build filepaths, urls, etc
 * @param dataSources Passed through from resolver
 * @returns { originalImageUrl: string; optimizedImageUrl: string }
 */
export const publishImage = async (
  files: ImageFieldDelta,
  config: PublishImageInput,
  // RED
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  dataSources: any
): Promise<{ originalImageUrl: string; optimizedImageUrl: string }> => {
  LOG.info(`Publishing image ${files.newImageUrl} / ${files.newOriginalImageUrl || 'Original URL not sent'}`, config);
  if (config.entityType === EntityType.Temp) {
    throw Error('ArgumentError: Cannot publish an Image for "Temp" EntityType.');
  }

  const pathsToOriginal = targetS3Paths(files.newOriginalImageUrl, config);
  const pathsToOptimize = targetS3Paths(files.newImageUrl, config);

  // don't move this file when newImageUrl === originalImageUrl === newOriginalImageUrl
  // this happens when the planner edits cropping and submits an uncropped image
  const pathToOptimize =
    files.newImageUrl === files.originalImageUrl && files.originalImageUrl === files.newOriginalImageUrl
      ? files.newImageUrl
      : await dataSources.s3ProxyServiceClient.moveFile(pathsToOptimize.from, pathsToOptimize.to);

  // Handle different PVS versions: currently PVS will not submit the files.originalImageUrl when submitting files.newImageUrl, but soon it will
  // When PVS does not send the files.originalImageUrl, we want to return null for it from here because we don't know if it's cropped or actual original
  // When PVS does send the originalImageUrl, images without it will continue with current behavior (no edit allowed, only upload again) and as PVS processes new uploads, desired behavior will occur allowing edit of existing originals
  let originalImageUrl = null;

  // will be null when files.newOriginalImageUrl is empty
  if (pathsToOriginal.from) {
    if (files.originalImageUrl === files.newOriginalImageUrl) {
      // this will happen when updating the cropping of an existing image
      // it's an existing cropped or uncropped file; assume it's already moved and return the same
      originalImageUrl = files.originalImageUrl;
    } else if (pathsToOriginal.from === pathsToOptimize.from) {
      // the existing originalImageUrl doesn't match the new one but both from paths match
      // it's a new uncropped file which was already moved in order to populate pathToOptimize
      originalImageUrl = pathToOptimize;
    } else {
      // the existing originalImageUrl doesn't match the new one, and from paths are different
      // it's a new cropped file in a temp s3 location, move it and return the final location
      originalImageUrl = await dataSources.s3ProxyServiceClient.moveFile(pathsToOriginal.from, pathsToOriginal.to);
    }
  }

  // We only want a CDN-optimized image URL for the image that may've been cropped; this will still optimize uncropped images
  const optimizedImageUrl = await imageLookup(pathToOptimize, dataSources.imageLookupClient);
  return { originalImageUrl, optimizedImageUrl };
};

export const moveResource = async (
  imageUrl: string,
  config: PublishImageInput,
  s3ProxyClient: S3ProxyClient
): Promise<string> => {
  const pathsToOriginal = targetS3Paths(imageUrl, config);
  return s3ProxyClient.moveFile(pathsToOriginal.from, pathsToOriginal.to);
};

export const checkScanStatus = async (redisClient: Redis, fullFilePath: string): Promise<S3ProxyCallbackPayload> => {
  const tempImageCache = new RedisCache(redisClient);
  const s3ProxyCacheConfigs: CacheConfig = getS3ProxyCacheKey(fullFilePath);
  let s3ProxyPayload: S3ProxyCallbackPayload = JSON.parse(await tempImageCache.get(s3ProxyCacheConfigs.key));
  if (isEmpty(s3ProxyPayload)) {
    s3ProxyPayload = {};
  }
  return s3ProxyPayload;
};

export const generatePreSignedUrl = async (
  s3ProxyClient: S3ProxyClient,
  redisClient: Redis,
  accountMappingId: string,
  environment: string,
  centerId: string,
  entityId: string,
  entityType: EntityType,
  fileName: string,
  fileExtension: string
): Promise<PreSignedResponse> => {
  const fullFilePath = s3Path({
    accountMappingId,
    centerId,
    entityId,
    entityType,
    fileName,
    fileExtension
  });

  const params = new URLSearchParams({
    environment,
    entityType,
    centerId,
    entityId
  });

  // Create callback Url which will save relative path and image url to corresponding entity
  const callBackUrl = `${process.env.EVENT_HUBS_WEB}/api/s3ProxyUploadCallback?${params.toString()}`;

  LOG.info('Requesting PreSigned URL with Callback', { callBackUrl });
  // Clear any previous cache data for clean results when FE starts polling
  const tempImageCache = new RedisCache(redisClient);
  const s3ProxyCacheConfigs: CacheConfig = getS3ProxyCacheKey(fullFilePath);
  await tempImageCache.delete(s3ProxyCacheConfigs.key);
  // Generate presigned Url
  const response = await s3ProxyClient.generatePreSignedUrl(fullFilePath, callBackUrl);
  const url = new URL(response.location);
  const urlParams = url.searchParams;
  LOG.info(`Generated PreSigned URL: ${url}`);
  LOG.info(`Generated PreSigned urlParams: ${urlParams}`);
  return {
    uploadUrl: response.location,
    fileId: urlParams.get('fileId'),
    fullFilePath
  };
};

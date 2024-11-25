import { ImageLookupClient } from '@dataSources/imageLookupService/client';
import { S3ProxyClient } from '@dataSources/s3ProxyService/client';
import { EntityType, ImageFieldDelta, PublishImageInput } from '@cvent/planner-event-hubs-model/types';
import { ACCOUNT_STUB } from '@utils/constants';
import { imageLookup, publishImage } from '../upload';

const hashedURL = 'https://images.cvent.com/IODJFIOW/EJFEOWIJ/WOEIJFOWEIJF!_!JIOWJEFLKJ832.jpg';
const fromOriginalPath = `/bucket/${ACCOUNT_STUB}/video-center/abcd-1234/temp/image.jpg`;
const tempOriginalUrl = `https://s3.amazonaws.com${fromOriginalPath}`;
const finalOriginalUrl = 'https://custom.cvent.com/account/context/image.ext';
const fromCroppedPath = `/bucket/${ACCOUNT_STUB}/video-center/abcd-1234/random/random.jpg`;
const tempCroppedUrl = `https://image-processing.test.com${fromCroppedPath}`;
const finalCroppedUrl = 'https://image-processing.cvent.com/account/video-center/abcd-1234/random/random.jpg';

describe('dataAccess/upload', () => {
  let mockImageClient: ImageLookupClient;
  let mockS3ProxyClient: S3ProxyClient;
  let newImageFields: ImageFieldDelta;
  let replacingImageFields: ImageFieldDelta;
  let updatingImageFields: ImageFieldDelta;
  let updatingImageToUncroppedFields: ImageFieldDelta;
  let replacingImageToUncroppedFields: ImageFieldDelta;

  beforeEach(() => {
    mockImageClient = new ImageLookupClient();
    mockS3ProxyClient = new S3ProxyClient();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('imageLookup(finalCroppedUrl, imageLookupClient)', () => {
    it('when hashedURL/height are present & hashedURL !== finalCroppedUrl, return the hashedURL for the given finalCroppedUrl', async () => {
      mockImageClient.lookup = jest.fn().mockImplementation(async () => {
        return {
          data: {
            [finalCroppedUrl]: { hashedURL, height: 1268 }
          }
        };
      });
      const response = await imageLookup(finalCroppedUrl, mockImageClient);
      expect(response).toEqual(hashedURL);
    });

    it('when hashedURL is NOT present, throw an Error', async () => {
      mockImageClient.lookup = jest.fn().mockImplementation(async () => {
        return {
          data: {
            [finalCroppedUrl]: { errorDetails: 'Oops!' }
          }
        };
      });
      await expect(imageLookup(finalCroppedUrl, mockImageClient)).rejects.toThrow(
        `An error occurred while optimizing ${finalCroppedUrl}`
      );
    });
  });

  describe('publishImage(tempUrlToOptimize, tempUrlToOriginal, config, dataSources)', () => {
    let dataSources;
    let config: PublishImageInput;
    let finalPath: string;

    beforeEach(() => {
      dataSources = {};
      // Stub s3Proxy call to move the optimized file
      mockS3ProxyClient.moveFile = jest.fn().mockImplementationOnce(async () => {
        return finalCroppedUrl;
      });
      mockImageClient.lookup = jest.fn().mockImplementation(async () => {
        return {
          data: {
            [finalCroppedUrl]: { hashedURL, height: 1268 }
          }
        };
      });
      dataSources.s3ProxyServiceClient = mockS3ProxyClient;
      dataSources.imageLookupClient = mockImageClient;
      config = {
        accountMappingId: 'account-abcd-efgh',
        entityType: EntityType.Banner,
        entityId: 'banner-1234-abcd',
        centerId: 'center-abcd-1234'
      };
      finalPath = `${config.accountMappingId}/video-center/${config.centerId}/${config.entityType.toString()}/${
        config.entityId
      }`.toLowerCase();
      newImageFields = {
        newOriginalImageUrl: tempOriginalUrl,
        newImageUrl: tempCroppedUrl,
        imageUrl: null,
        originalImageUrl: null
      };
      replacingImageFields = {
        originalImageUrl: finalOriginalUrl,
        newOriginalImageUrl: tempOriginalUrl,
        imageUrl: finalCroppedUrl,
        newImageUrl: tempCroppedUrl
      };
      replacingImageToUncroppedFields = {
        originalImageUrl: finalOriginalUrl,
        newOriginalImageUrl: tempOriginalUrl,
        imageUrl: finalCroppedUrl,
        newImageUrl: tempOriginalUrl
      };
      updatingImageFields = {
        originalImageUrl: finalOriginalUrl,
        newOriginalImageUrl: finalOriginalUrl,
        imageUrl: finalCroppedUrl,
        newImageUrl: tempCroppedUrl
      };
      updatingImageToUncroppedFields = {
        originalImageUrl: finalOriginalUrl,
        newOriginalImageUrl: finalOriginalUrl,
        imageUrl: finalCroppedUrl,
        newImageUrl: finalOriginalUrl
      };
    });

    describe('when planner-video client submits a newOriginalImageUrl', () => {
      beforeEach(() => {
        mockS3ProxyClient.moveFile = jest
          .fn()
          .mockImplementationOnce(async () => {
            return finalCroppedUrl;
          })
          .mockImplementationOnce(async () => {
            return finalOriginalUrl;
          });
      });
      it('calls moveFile on dataSources.s3ProxyServiceClient for both the original and cropped images', async () => {
        await publishImage(newImageFields, config, dataSources);
        expect(dataSources.s3ProxyServiceClient.moveFile).toHaveBeenCalledWith(
          fromOriginalPath.replace('/bucket', ''),
          `${finalPath}/image.jpg`
        );
        expect(dataSources.s3ProxyServiceClient.moveFile).toHaveBeenCalledWith(
          fromCroppedPath.replace('/bucket', ''),
          `${finalPath}/random.jpg`
        );
      });

      it('returns the optimizedImageUrl for the potentially cropped image and originalImageUrl for the original', async () => {
        expect(await publishImage(newImageFields, config, dataSources)).toEqual({
          optimizedImageUrl: hashedURL,
          originalImageUrl: finalOriginalUrl
        });
      });
    });

    describe('when planner-video client submits an originalImageUrl, newOriginalImageUrl and newImageUrl that all match', () => {
      beforeEach(() => {
        mockImageClient.lookup = jest.fn().mockImplementation(async () => {
          return {
            data: {
              [finalOriginalUrl]: { hashedURL, height: 1268 }
            }
          };
        });
      });

      it('does not move any file', async () => {
        await publishImage(updatingImageToUncroppedFields, config, dataSources);
        expect(dataSources.s3ProxyServiceClient.moveFile).not.toHaveBeenCalled();
      });

      it('returns the optimizedImageUrl for the uncropped image and the originalImageUrl', async () => {
        expect(await publishImage(updatingImageToUncroppedFields, config, dataSources)).toEqual({
          optimizedImageUrl: hashedURL,
          originalImageUrl: finalOriginalUrl
        });
      });
    });

    describe('when planner-video client submits an originalImageUrl and newOriginalImageUrl that match', () => {
      it('calls moveFile on dataSources.s3ProxyServiceClient for only the potentially cropped image', async () => {
        await publishImage(updatingImageFields, config, dataSources);
        expect(dataSources.s3ProxyServiceClient.moveFile).toHaveBeenCalledTimes(1);
        expect(dataSources.s3ProxyServiceClient.moveFile).toHaveBeenCalledWith(
          fromCroppedPath.replace('/bucket', ''),
          `${finalPath}/random.jpg`
        );
      });

      it('returns the optimizedImageUrl for the potentially cropped image and the current original image', async () => {
        expect(await publishImage(updatingImageFields, config, dataSources)).toEqual({
          optimizedImageUrl: hashedURL,
          originalImageUrl: finalOriginalUrl
        });
      });
    });

    describe('when planner-video client submits an originalImageUrl and newOriginalImageUrl that differ', () => {
      beforeEach(() => {
        mockS3ProxyClient.moveFile = jest
          .fn()
          .mockImplementationOnce(async () => {
            return finalCroppedUrl;
          })
          .mockImplementationOnce(async () => {
            return finalOriginalUrl;
          });
      });

      it('calls moveFile on dataSources.s3ProxyServiceClient for both the original and cropped images', async () => {
        await publishImage(replacingImageFields, config, dataSources);
        expect(dataSources.s3ProxyServiceClient.moveFile).toHaveBeenCalledWith(
          fromOriginalPath.replace('/bucket', ''),
          `${finalPath}/image.jpg`
        );
        expect(dataSources.s3ProxyServiceClient.moveFile).toHaveBeenCalledWith(
          fromCroppedPath.replace('/bucket', ''),
          `${finalPath}/random.jpg`
        );
      });

      it('returns the optimizedImageUrl for the potentially cropped image and the new original image', async () => {
        expect(await publishImage(replacingImageFields, config, dataSources)).toEqual({
          optimizedImageUrl: hashedURL,
          originalImageUrl: finalOriginalUrl
        });
      });

      describe('when planner-video client submits an uncropped new image', () => {
        beforeEach(() => {
          mockS3ProxyClient.moveFile = jest.fn().mockImplementationOnce(async () => {
            return finalOriginalUrl;
          });
          mockImageClient.lookup = jest.fn().mockImplementation(async () => {
            return {
              data: {
                [finalOriginalUrl]: { hashedURL, height: 1268 }
              }
            };
          });
        });

        it('calls moveFile on dataSources.s3ProxyServiceClient once for the uncropped image', async () => {
          await publishImage(replacingImageToUncroppedFields, config, dataSources);
          expect(dataSources.s3ProxyServiceClient.moveFile).toHaveBeenCalledWith(
            fromOriginalPath.replace('/bucket', ''),
            `${finalPath}/image.jpg`
          );
          expect(dataSources.s3ProxyServiceClient.moveFile).toHaveBeenCalledTimes(1);
        });

        it('returns the optimizedImageUrl for the uncropped image and the new original image', async () => {
          expect(await publishImage(replacingImageToUncroppedFields, config, dataSources)).toEqual({
            optimizedImageUrl: hashedURL,
            originalImageUrl: finalOriginalUrl
          });
        });
      });
    });

    describe('when planner-video client does not submit a newOriginalImageUrl', () => {
      it('calls moveFile on dataSources.s3ProxyServiceClient for only the potentially cropped image', async () => {
        await publishImage({ newImageUrl: tempCroppedUrl }, config, dataSources);
        expect(dataSources.s3ProxyServiceClient.moveFile).not.toHaveBeenCalledWith(
          fromOriginalPath.replace('/bucket', ''),
          `${finalPath}/image.jpg`
        );
        expect(dataSources.s3ProxyServiceClient.moveFile).toHaveBeenCalledWith(
          fromCroppedPath.replace('/bucket', ''),
          `${finalPath}/random.jpg`
        );
      });

      it('returns the optimizedImageUrl for the cropped image and null for the originalImageUrl', async () => {
        expect(await publishImage({ newImageUrl: tempCroppedUrl }, config, dataSources)).toEqual({
          optimizedImageUrl: hashedURL,
          originalImageUrl: null
        });
      });
    });

    it('throws an error when EntityType == Temp', async () => {
      config.entityType = EntityType.Temp;
      await expect(publishImage(newImageFields, config, dataSources)).rejects.toThrow(
        'ArgumentError: Cannot publish an Image for "Temp" EntityType'
      );
    });
  });
});

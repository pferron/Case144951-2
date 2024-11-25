import {
  connectToApiAsPlanner,
  authOptions,
  authATestAccountOptions,
  unauthOptions
} from '@helpers/connectToApiAsPlanner';
import { deleteEntityImage, getEntityImage, uploadEntityImage } from '@cvent/planner-event-hubs-model/operations/media';
import { v4 } from 'uuid';
import { expect } from '@jest/globals';
import { skipDescribeIfProdEnvironment } from '@utils/commonUtils';

let client;
let clientWithIncorrectRole;

beforeAll(async () => {
  [client, clientWithIncorrectRole] = await Promise.all([
    connectToApiAsPlanner(authOptions),
    connectToApiAsPlanner(authATestAccountOptions),
    connectToApiAsPlanner(unauthOptions)
  ]);
});

skipDescribeIfProdEnvironment()('Additional Calendar Item Media GQL IT', () => {
  const entityInput = {
    id: '03055e30-eb1f-4a8b-87cc-d25adc381c5d',
    type: 'CALENDAR_ADDITIONAL_ITEM'
  };

  it('should provide handled user permission error while uploading', async () => {
    const imageName = `test_${v4()}.png`;
    await expect(async () =>
      client.mutate({
        mutation: uploadEntityImage,
        variables: {
          imageInput: {
            name: imageName,
            size: 323,
            url: 'https://silo460-custom.core.cvent.org/asset/image/companywide%20-%20teal.png',
            entity: entityInput
          }
        }
      })
    ).rejects.toThrow('403');
  });

  it("should fail while uploading as user doesn't have permission to access additional calendar page", async () => {
    const imageName = `test_${v4()}.png`;
    await expect(async () =>
      clientWithIncorrectRole.mutate({
        mutation: uploadEntityImage,
        variables: {
          imageInput: {
            name: imageName,
            size: 323,
            url: 'https://silo460-custom.core.cvent.org/asset/image/companywide%20-%20teal.png',
            entity: entityInput
          }
        }
      })
    ).rejects.toThrow('403');
  });

  it('should fail while uploading due to missing size input', async () => {
    const imageName = `test_${v4()}.png`;
    await expect(async () =>
      client.mutate({
        mutation: uploadEntityImage,
        variables: {
          imageInput: {
            name: imageName,
            url: 'https://silo460-custom.core.cvent.org/asset/image/companywide%20-%20teal.png',
            entity: entityInput
          }
        }
      })
    ).rejects.toThrow('400');
  });

  it('should fail while uploading due to missing url input', async () => {
    const imageName = `test_${v4()}.png`;
    await expect(async () =>
      client.mutate({
        mutation: uploadEntityImage,
        variables: {
          imageInput: {
            name: imageName,
            size: 323,
            entity: entityInput
          }
        }
      })
    ).rejects.toThrow('400');
  });

  it('should provide handled error while deleting image which does not exist', async () => {
    await expect(async () =>
      client.mutate({
        mutation: deleteEntityImage,
        variables: {
          imageId: '7e93ccc5-84a3-4648-8870-25bcf3a116e7'
        }
      })
    ).rejects.toThrow('403');
  });

  it("should provide permission error while deleting event as user doesn't have proper permissions", async () => {
    await expect(async () =>
      clientWithIncorrectRole.mutate({
        mutation: deleteEntityImage,
        variables: {
          imageId: '7e93ccc5-84a3-4648-8870-25bcf3a116e7'
        }
      })
    ).rejects.toThrow('403');
  });

  it("should throw permission error while fetching the image as user doesn't have proper permissions.", async () => {
    const getEntityImageResponse = await clientWithIncorrectRole.query({
      query: getEntityImage,
      variables: {
        entity: entityInput
      }
    });

    expect(getEntityImageResponse.data.getEntityImage).toBe(null);
  });

  it('should return empty response when no image associated with an event', async () => {
    const eventMediaResponse = await client.query({
      query: getEntityImage,
      variables: {
        entity: entityInput
      }
    });
    expect(eventMediaResponse.data.getEntityImage).toBeNull();
  });
});

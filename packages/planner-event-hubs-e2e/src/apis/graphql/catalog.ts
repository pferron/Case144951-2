import { FetchResult } from '@apollo/client';
import { createCatalogMutation } from '@cvent/planner-event-hubs-model/operations/channel';
import { Catalog, CatalogInput } from '@cvent/planner-event-hubs-model/types';
import { connectToApiAsPlanner } from '../../utils/authUtils';

export const createCatalog = async (channelId: string, catalogInput: CatalogInput): Promise<FetchResult<Catalog>> => {
  const client = await connectToApiAsPlanner();
  return (
    await client.mutate({
      mutation: createCatalogMutation,
      variables: {
        channelId,
        catalogInput
      }
    })
  ).data.createCatalog;
};

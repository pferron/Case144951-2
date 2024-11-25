import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { ContactInformation } from '@cvent/planner-event-hubs-model/types';
import { getContactQuery } from '@cvent/planner-event-hubs-model/operations/contacts';

export const getContact = async (
  client: ApolloClient<NormalizedCacheObject>,
  contactId: string
): Promise<ContactInformation> => {
  const response = await client.query({
    query: getContactQuery,
    variables: {
      contactId
    }
  });
  expect(response).toBeTruthy();
  expect(response.data).toBeTruthy();
  return response.data.getContact;
};

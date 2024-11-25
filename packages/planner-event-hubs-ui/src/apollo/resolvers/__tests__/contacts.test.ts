import { VideoCenterClient } from '@dataSources/videoCenterService/client';
import {
  getMockResolverRequestWithDataSources,
  mockDataSource,
  mockDataSourceError
} from '@resolvers/common/testUtils/mockRequestData';
import contactsResolver from '@resolvers/contacts';
import { resolveMutationResponse, resolveQueryResponse } from '@resolvers/common/testUtils/mockFunction';
import { contactTypesData } from '@dataSources/__tests__/fixtures/contactTypesData';
import { contactsData } from '@dataSources/__tests__/fixtures/contactsData';
import { contactGroupsData } from '@dataSources/__tests__/fixtures/contactGroupsData';
import { UniversalContactsClient } from '@dataSources/universalContactsService/client';
import { contactGroupsAllowlist } from './fixtures/contactGroupsAllowList';
import { blockedContactsList } from './fixtures/blockedContactsList';
import { blockedContactGroups } from './fixtures/blockedContactGroups';
import { allowedContactTypesData } from './fixtures/allowedContactTypes';
import { deleteBlockedContacts } from './fixtures/deleteBlockedContacts';
import { deleteAllowedContactTypesData } from './fixtures/deleteAllowedContactTypesData';
import { allowedContactGroupsData } from './fixtures/allowedContactGroupsData';

const saveContactGroupsResponse = {
  contactGroups: [
    'dcef630b-42c2-4ef4-8718-c2fcf3093b1b',
    '4d216d63-91cb-4ff7-8dfd-49b741b631b9',
    '68585c5e-e4ef-4e55-aa44-dc7cbb265486'
  ]
};

const saveBlockedContactsResponse = {
  blockedContacts: [
    '3c9fba72-5018-4448-9f6e-a6c25c752b89',
    'c5199eb0-9624-4d0d-bce4-0360e5303152',
    'c8eb6810-814b-46d8-920c-9d342ce459b3'
  ]
};

const saveAllowedContactTypesResponse = {
  contactTypes: [
    '0bbe47d5-1c46-47c4-b848-df9c868e2e39',
    'afd160df-9fcf-4540-aa34-cfcf22782cc1',
    '7f56a9b0-455c-4f58-82af-1941c5da2e2c',
    '71508eca-04af-4f2a-9166-01b1a0f7a946'
  ]
};

const saveBlockedContactGroupsResponse = {
  contactGroups: ['dcef630b-42c2-4ef4-8718-c2fcf3093b1b', '4d216d63-91cb-4ff7-8dfd-49b741b631b9']
};

const getBlockedContactsResponse = {
  blockedContacts: [
    '3c9fba72-5018-4448-9f6e-a6c25c752b89',
    'c5199eb0-9624-4d0d-bce4-0360e5303152',
    'c8eb6810-814b-46d8-920c-9d342ce459b3'
  ]
};

const getBlockedContactGroupsResponse = {
  contactGroups: ['dcef630b-42c2-4ef4-8718-c2fcf3093b1b', '4d216d63-91cb-4ff7-8dfd-49b741b631b9']
};

const getAllowedContactTypesResponse = {
  contactTypes: [
    '0bbe47d5-1c46-47c4-b848-df9c868e2e39',
    'afd160df-9fcf-4540-aa34-cfcf22782cc1',
    '7f56a9b0-455c-4f58-82af-1941c5da2e2c',
    '71508eca-04af-4f2a-9166-01b1a0f7a946'
  ]
};

const deleteBlockedContactsResponse = {
  success: true
};

const deleteAllowedContactTypesResponse = {
  deleteContactTypes: true
};

const contactTypesList = [
  {
    id: '68585c5e-e4ef-4e55-aa44-dc7cbb265486',
    name: 'Rabbit Fan'
  },
  {
    id: '187e3ff5-cc88-4917-8769-37a3be1a0460',
    name: 'Silver VIP'
  }
];

const contactList = [
  {
    id: '26bd6cca-b552-4d00-8ab7-062ee1f3b60f',
    firstName: 'Cvent',
    lastName: 'Eng',
    email: 'cventeng@j.mail'
  },
  {
    id: '7589dfd9-1f9f-4746-86f6-030ccfbac69e',
    firstName: 'Wanda',
    lastName: 'Hilpert',
    email: 'WandaHilpert28@cvent.mail'
  }
];

const contactGroupsList = [
  {
    id: '68585c5e-e4ef-4e55-aa44-dc7cbb265486',
    name: 'Summer Camp'
  },
  {
    id: '187e3ff5-cc88-4917-8769-37a3be1a0460',
    name: 'Sample Winter Camp'
  }
];

const getAllowedContactGroupsResponse = {
  contactGroups: [
    'dcef630b-42c2-4ef4-8718-c2fcf3093b1b',
    '4d216d63-91cb-4ff7-8dfd-49b741b631b9',
    '68585c5e-e4ef-4e55-aa44-dc7cbb265486'
  ]
};

const dataSources = {
  videoCenterClient: new VideoCenterClient(),
  universalContactsClient: new UniversalContactsClient()
};

describe('Save Contact Groups Mutation Resolver', () => {
  it('resolves save contact groups mutation', async () => {
    mockDataSource(dataSources.videoCenterClient, 'put', contactGroupsAllowlist);
    const resolverRequest = getMockResolverRequestWithDataSources('Mutation.saveContactGroups', dataSources, {
      input: {
        contactGroups: [
          'dcef630b-42c2-4ef4-8718-c2fcf3093b1b',
          '4d216d63-91cb-4ff7-8dfd-49b741b631b9',
          '68585c5e-e4ef-4e55-aa44-dc7cbb265486'
        ],
        id: '74b3cf7a-c49e-446b-8469-215c1ffcdab5'
      }
    });
    dataSources.videoCenterClient.context = resolverRequest.context;
    const contactGroups = await resolveMutationResponse(contactsResolver, 'saveContactGroups', resolverRequest, null);
    expect(contactGroups).toBeTruthy();
    expect(contactGroups).toEqual(saveContactGroupsResponse);
  });

  it('throws error if failed to save contact groups', async () => {
    mockDataSourceError(dataSources.videoCenterClient, 'put', 'failed to save contact groups', '400');
    const resolverRequest = getMockResolverRequestWithDataSources('Mutation.saveContactGroups', dataSources, {
      input: {
        contactGroups: [
          'dcef630b-42c2-4ef4-8718-c2fcf3093b1b',
          '4d216d63-91cb-4ff7-8dfd-49b741b631b9',
          '68585c5e-e4ef-4e55-aa44-dc7cbb265486'
        ],
        id: '74b3cf7a-c49e-446b-8469-215c1ffcdab5'
      }
    });
    dataSources.videoCenterClient.context = resolverRequest.context;
    await expect(resolveMutationResponse(contactsResolver, 'saveContactGroups', resolverRequest, null)).rejects.toThrow(
      'failed to save contact groups'
    );
  });
});

describe('Save Blocked Contacts Mutation Resolver', () => {
  it('resolves save blocked contacts mutation', async () => {
    mockDataSource(dataSources.videoCenterClient, 'post', blockedContactsList);
    const resolverRequest = getMockResolverRequestWithDataSources('Mutation.saveBlockedContacts', dataSources, {
      input: {
        blockedContacts: [
          '3c9fba72-5018-4448-9f6e-a6c25c752b89',
          'c5199eb0-9624-4d0d-bce4-0360e5303152',
          'c8eb6810-814b-46d8-920c-9d342ce459b3'
        ],
        id: '74b3cf7a-c49e-446b-8469-215c1ffcdab5'
      }
    });
    dataSources.videoCenterClient.context = resolverRequest.context;
    const blockedContacts = await resolveMutationResponse(
      contactsResolver,
      'saveBlockedContacts',
      resolverRequest,
      null
    );
    expect(blockedContacts).toBeTruthy();
    expect(blockedContacts).toEqual(saveBlockedContactsResponse);
  });

  it('throws error if failed to save blocked contacts', async () => {
    mockDataSourceError(dataSources.videoCenterClient, 'post', 'failed to save blocked contacts', '400');
    const resolverRequest = getMockResolverRequestWithDataSources(
      'Mutation.saveBlockedContacts',
      dataSources,
      {
        input: {
          blockedContacts: [
            '3c9fba72-5018-4448-9f6e-a6c25c752b89',
            'c5199eb0-9624-4d0d-bce4-0360e5303152',
            'c8eb6810-814b-46d8-920c-9d342ce459b3'
          ],
          id: '74b3cf7a-c49e-446b-8469-215c1ffcdab5'
        }
      },
      { environment: 'test' }
    );
    dataSources.videoCenterClient.context = resolverRequest.context;
    await expect(
      resolveMutationResponse(contactsResolver, 'saveBlockedContacts', resolverRequest, null)
    ).rejects.toThrow('failed to save blocked contacts');
  });
});

describe('Save Blocked Contact Groups Mutation Resolver', () => {
  it('resolves save blocked contact groups mutation', async () => {
    mockDataSource(dataSources.videoCenterClient, 'post', blockedContactGroups);
    const resolverRequest = getMockResolverRequestWithDataSources('Mutation.saveBlockedContactGroups', dataSources, {
      input: {
        contactGroups: ['dcef630b-42c2-4ef4-8718-c2fcf3093b1b', '4d216d63-91cb-4ff7-8dfd-49b741b631b9'],
        id: '74b3cf7a-c49e-446b-8469-215c1ffcdab5'
      }
    });
    dataSources.videoCenterClient.context = resolverRequest.context;
    const contactGroups = await resolveMutationResponse(
      contactsResolver,
      'saveBlockedContactGroups',
      resolverRequest,
      null
    );
    expect(contactGroups).toBeTruthy();
    expect(contactGroups).toEqual(saveBlockedContactGroupsResponse);
  });

  it('throws error if failed to save blocked contact groups', async () => {
    mockDataSourceError(dataSources.videoCenterClient, 'post', 'failed to save blocked contact groups', '400');
    const resolverRequest = getMockResolverRequestWithDataSources(
      'Mutation.saveBlockedContactGroups',
      dataSources,
      {
        input: {
          contactGroups: ['dcef630b-42c2-4ef4-8718-c2fcf3093b1b', '4d216d63-91cb-4ff7-8dfd-49b741b631b9'],
          id: '74b3cf7a-c49e-446b-8469-215c1ffcdab5'
        }
      },
      { environment: 'test' }
    );
    dataSources.videoCenterClient.context = resolverRequest.context;
    await expect(
      resolveMutationResponse(contactsResolver, 'saveBlockedContactGroups', resolverRequest, null)
    ).rejects.toThrow('failed to save blocked contact groups');
  });
});

describe('Save allowed contact types resolver', () => {
  it('resolves save allowed contact types mutation', async () => {
    mockDataSource(dataSources.videoCenterClient, 'post', allowedContactTypesData);
    const resolverRequest = getMockResolverRequestWithDataSources('Mutation.saveAllowedContactTypes', dataSources, {
      input: {
        id: '74b3cf7a-c49e-446b-8469-215c1ffcdab5',
        contactTypes: [
          '0bbe47d5-1c46-47c4-b848-df9c868e2e39',
          'afd160df-9fcf-4540-aa34-cfcf22782cc1',
          '7f56a9b0-455c-4f58-82af-1941c5da2e2c',
          '71508eca-04af-4f2a-9166-01b1a0f7a946'
        ]
      }
    });
    dataSources.videoCenterClient.context = resolverRequest.context;
    const allowedContactTypes = await resolveMutationResponse(
      contactsResolver,
      'saveContactTypes',
      resolverRequest,
      null
    );
    expect(allowedContactTypes).toBeTruthy();
    expect(allowedContactTypes).toEqual(saveAllowedContactTypesResponse);
  });

  it('throws error if failed to save allowed contact types', async () => {
    mockDataSourceError(dataSources.videoCenterClient, 'post', 'failed to save allowed contact types', '400');
    const resolverRequest = getMockResolverRequestWithDataSources('Mutation.saveAllowedContactTypes', dataSources, {
      input: {
        id: '74b3cf7a-c49e-446b-8469-215c1ffcdab5',
        contactTypes: [
          '0bbe47d5-1c46-47c4-b848-df9c868e2e39',
          'afd160df-9fcf-4540-aa34-cfcf22782cc1',
          '7f56a9b0-455c-4f58-82af-1941c5da2e2c',
          '71508eca-04af-4f2a-9166-01b1a0f7a946'
        ]
      }
    });
    dataSources.videoCenterClient.context = resolverRequest.context;
    await expect(resolveMutationResponse(contactsResolver, 'saveContactTypes', resolverRequest, null)).rejects.toThrow(
      'failed to save allowed contact types'
    );
  });
});

describe('Blocked contacts query resolver', () => {
  it('resolves get blocked contacts query', async () => {
    mockDataSource(dataSources.videoCenterClient, 'get', blockedContactsList);
    const resolverRequest = getMockResolverRequestWithDataSources('Query.getBlockedContacts', dataSources, {
      input: {
        id: '74b3cf7a-c49e-446b-8469-215c1ffcdab5'
      }
    });
    const blockedContacts = await resolveQueryResponse(contactsResolver, 'getBlockedContacts', resolverRequest, null);
    expect(blockedContacts).toBeTruthy();
    expect(blockedContacts).toEqual(getBlockedContactsResponse);
  });

  it('throws error if fails to get blocked contacts', async () => {
    mockDataSourceError(dataSources.videoCenterClient, 'get', 'failed to get blocked contacts', '400');
    const resolverRequest = getMockResolverRequestWithDataSources('Query.getBlockedContacts', dataSources, {
      input: {
        id: '74b3cf7a-c49e-446b-8469-215c1ffcdab5'
      }
    });
    await expect(resolveQueryResponse(contactsResolver, 'getBlockedContacts', resolverRequest, null)).rejects.toThrow(
      'failed to get blocked contacts'
    );
  });
});

describe('Blocked contact groups query resolver', () => {
  it('resolves get blocked contact groups query', async () => {
    mockDataSource(dataSources.videoCenterClient, 'get', blockedContactGroups);
    const resolverRequest = getMockResolverRequestWithDataSources('Query.getBlockedContactGroups', dataSources, {
      input: {
        id: '74b3cf7a-c49e-446b-8469-215c1ffcdab5'
      }
    });
    const blockedContacts = await resolveQueryResponse(
      contactsResolver,
      'getBlockedContactGroups',
      resolverRequest,
      null
    );
    expect(blockedContacts).toBeTruthy();
    expect(blockedContacts).toEqual(getBlockedContactGroupsResponse);
  });

  it('throws error if fails to get blocked contact groups', async () => {
    mockDataSourceError(dataSources.videoCenterClient, 'get', 'failed to get blocked contact groups', '400');
    const resolverRequest = getMockResolverRequestWithDataSources('Query.getBlockedContactGroups', dataSources, {
      input: {
        id: '74b3cf7a-c49e-446b-8469-215c1ffcdab5'
      }
    });
    await expect(
      resolveQueryResponse(contactsResolver, 'getBlockedContactGroups', resolverRequest, null)
    ).rejects.toThrow('failed to get blocked contact groups');
  });
});

describe('Allowed contacts types query resolver', () => {
  it('resolves get allowed contact types query', async () => {
    mockDataSource(dataSources.videoCenterClient, 'get', allowedContactTypesData);
    const resolverRequest = getMockResolverRequestWithDataSources('Query.getAllowedContactTypes', dataSources, {
      input: {
        id: '74b3cf7a-c49e-446b-8469-215c1ffcdab5'
      }
    });
    const allowedContactTypes = await resolveQueryResponse(
      contactsResolver,
      'getAllowedContactTypes',
      resolverRequest,
      null
    );
    expect(allowedContactTypes).toBeTruthy();
    expect(allowedContactTypes).toEqual(getAllowedContactTypesResponse);
  });

  it('throws error if fails to get allowed contact types', async () => {
    mockDataSourceError(dataSources.videoCenterClient, 'get', 'failed to get allowed contact types', '400');
    const resolverRequest = getMockResolverRequestWithDataSources(
      'Query.getAllowedContactTypes',
      dataSources,
      {
        input: {
          id: '74b3cf7a-c49e-446b-8469-215c1ffcdab5'
        }
      },
      { environment: 'test' }
    );
    await expect(
      resolveQueryResponse(contactsResolver, 'getAllowedContactTypes', resolverRequest, null)
    ).rejects.toThrow('failed to get allowed contact types');
  });
});

describe('Delete Blocked Contacts Mutation Resolver', () => {
  it('resolves delete blocked contacts mutation', async () => {
    mockDataSource(dataSources.videoCenterClient, 'delete', deleteBlockedContacts);
    const resolverRequest = getMockResolverRequestWithDataSources('Mutation.deleteBlockedContacts', dataSources, {
      input: {
        blockedContacts: [
          '3c9fba72-5018-4448-9f6e-a6c25c752b89',
          'c5199eb0-9624-4d0d-bce4-0360e5303152',
          'c8eb6810-814b-46d8-920c-9d342ce459b3'
        ],
        id: '74b3cf7a-c49e-446b-8469-215c1ffcdab5'
      }
    });
    dataSources.videoCenterClient.context = resolverRequest.context;
    const blockedContacts = await resolveMutationResponse(
      contactsResolver,
      'deleteBlockedContacts',
      resolverRequest,
      null
    );
    expect(blockedContacts).toBeTruthy();
    expect(blockedContacts).toEqual(deleteBlockedContactsResponse);
  });

  it('throws error if failed to delete blocked contacts', async () => {
    mockDataSourceError(dataSources.videoCenterClient, 'delete', 'failed to delete blocked contacts', '400');
    const resolverRequest = getMockResolverRequestWithDataSources('Mutation.deleteBlockedContacts', dataSources, {
      input: {
        blockedContacts: [
          '3c9fba72-5018-4448-9f6e-a6c25c752b89',
          'c5199eb0-9624-4d0d-bce4-0360e5303152',
          'c8eb6810-814b-46d8-920c-9d342ce459b3'
        ],
        id: '74b3cf7a-c49e-446b-8469-215c1ffcdab5'
      }
    });
    dataSources.videoCenterClient.context = resolverRequest.context;
    await expect(
      resolveMutationResponse(contactsResolver, 'deleteBlockedContacts', resolverRequest, null)
    ).rejects.toThrow('failed to delete blocked contacts');
  });
});

describe('Delete allowed contact types resolver', () => {
  it('resolves delete allowed contact types mutation', async () => {
    mockDataSource(dataSources.videoCenterClient, 'delete', deleteAllowedContactTypesData);
    const resolverRequest = getMockResolverRequestWithDataSources('Mutation.deleteAllowedContactTypes', dataSources, {
      input: {
        id: '74b3cf7a-c49e-446b-8469-215c1ffcdab5',
        contactTypes: [
          '0bbe47d5-1c46-47c4-b848-df9c868e2e39',
          'afd160df-9fcf-4540-aa34-cfcf22782cc1',
          '7f56a9b0-455c-4f58-82af-1941c5da2e2c',
          '71508eca-04af-4f2a-9166-01b1a0f7a946'
        ]
      }
    });
    dataSources.videoCenterClient.context = resolverRequest.context;
    const allowedContactTypes = await resolveMutationResponse(
      contactsResolver,
      'deleteContactTypes',
      resolverRequest,
      null
    );
    expect(allowedContactTypes).toBeTruthy();
    expect(allowedContactTypes).toEqual(deleteAllowedContactTypesResponse);
  });

  it('throws error if failed to delete allowed contact types', async () => {
    mockDataSourceError(dataSources.videoCenterClient, 'delete', 'failed to delete allowed contact types', '400');
    const resolverRequest = getMockResolverRequestWithDataSources('Mutation.deleteAllowedContactTypes', dataSources, {
      input: {
        id: '74b3cf7a-c49e-446b-8469-215c1ffcdab5',
        contactTypes: [
          '0bbe47d5-1c46-47c4-b848-df9c868e2e39',
          'afd160df-9fcf-4540-aa34-cfcf22782cc1',
          '7f56a9b0-455c-4f58-82af-1941c5da2e2c',
          '71508eca-04af-4f2a-9166-01b1a0f7a946'
        ]
      }
    });
    dataSources.videoCenterClient.context = resolverRequest.context;
    await expect(
      resolveMutationResponse(contactsResolver, 'deleteContactTypes', resolverRequest, null)
    ).rejects.toThrow('failed to delete allowed contact types');
  });
});

describe('Contact Types query resolver', () => {
  it('resolves filter contact types query', async () => {
    mockDataSource(dataSources.universalContactsClient, 'get', contactTypesData);
    const resolverRequest = getMockResolverRequestWithDataSources('Query.searchContactsTypes', dataSources, {
      input: { limit: 100, searchTerm: 'silver' }
    });
    const contactGroups = await resolveQueryResponse(contactsResolver, 'searchContactTypes', resolverRequest, null);
    expect(contactGroups).toBeTruthy();
    expect(contactGroups.data).toEqual(contactTypesList);
  });

  it('throws error if fails to search contact types', async () => {
    mockDataSourceError(dataSources.universalContactsClient, 'get', 'search contact types failed', '400');
    const resolverRequest = getMockResolverRequestWithDataSources('Query.searchContactTypes', dataSources, {
      input: { limit: 100, searchTerm: 'camp' }
    });
    await expect(resolveQueryResponse(contactsResolver, 'searchContactTypes', resolverRequest, null)).rejects.toThrow(
      'search contact types failed'
    );
  });
});

describe('Contacts query resolver', () => {
  it('resolves filter contacts query', async () => {
    mockDataSource(dataSources.universalContactsClient, 'post', contactsData);
    const resolverRequest = getMockResolverRequestWithDataSources('Query.searchContacts', dataSources, {
      input: { limit: 100, searchTerm: 'cvent' }
    });
    const contacts = await resolveQueryResponse(contactsResolver, 'searchContacts', resolverRequest, null);
    expect(contacts).toBeTruthy();
    expect(contacts.data).toEqual(contactList);
  });

  it('throws error if fails to search contacts', async () => {
    mockDataSourceError(dataSources.universalContactsClient, 'post', 'filter contacts failed', '400');
    const resolverRequest = getMockResolverRequestWithDataSources('Query.searchContacts', dataSources, {
      input: { limit: 100, searchTerm: 'cvent' }
    });
    await expect(resolveQueryResponse(contactsResolver, 'searchContacts', resolverRequest, null)).rejects.toThrow(
      'filter contacts failed'
    );
  });
});

describe('Contact Groups query resolver', () => {
  it('resolves filter contact groups query', async () => {
    mockDataSource(dataSources.universalContactsClient, 'get', contactGroupsData);
    const resolverRequest = getMockResolverRequestWithDataSources(
      'Query.searchContactsGroups',
      dataSources,
      { input: { limit: 100, searchTerm: 'camp' } },
      { environment: 'test' }
    );
    const contactGroups = await resolveQueryResponse(contactsResolver, 'searchContactGroups', resolverRequest, null);
    expect(contactGroups).toBeTruthy();
    expect(contactGroups.data).toEqual(contactGroupsList);
  });

  it('throws error if fails to search contact groups', async () => {
    mockDataSourceError(dataSources.universalContactsClient, 'get', 'search contact groups failed', '400');
    const resolverRequest = getMockResolverRequestWithDataSources('Query.searchContactGroups', dataSources, {
      input: { limit: 100, searchTerm: 'camp' }
    });
    await expect(resolveQueryResponse(contactsResolver, 'searchContactGroups', resolverRequest, null)).rejects.toThrow(
      'search contact groups failed'
    );
  });
});

describe('Allowed contacts groups query resolver', () => {
  it('resolves get allowed contact groups query', async () => {
    mockDataSource(dataSources.videoCenterClient, 'get', allowedContactGroupsData);
    const resolverRequest = getMockResolverRequestWithDataSources('Query.getAllowedContactGroups', dataSources, {
      input: {
        id: '74b3cf7a-c49e-446b-8469-215c1ffcdab5'
      }
    });
    const allowedContactGroups = await resolveQueryResponse(
      contactsResolver,
      'getAllowedContactGroups',
      resolverRequest,
      null
    );
    expect(allowedContactGroups).toBeTruthy();
    expect(allowedContactGroups).toEqual(getAllowedContactGroupsResponse);
  });

  it('throws error if fails to get allowed contact groups', async () => {
    mockDataSourceError(dataSources.videoCenterClient, 'get', 'failed to get allowed contact groups', '400');
    const resolverRequest = getMockResolverRequestWithDataSources('Query.getAllowedContactGroups', dataSources, {
      input: {
        id: '74b3cf7a-c49e-446b-8469-215c1ffcdab5'
      }
    });
    await expect(
      resolveQueryResponse(contactsResolver, 'getAllowedContactGroups', resolverRequest, null)
    ).rejects.toThrow('failed to get allowed contact groups');
  });
});

import { LoggerFactory } from '@cvent/logging/LoggerFactory';
import { CvestDataSource } from '@dataSources/CvestDataSource';

const LOG = LoggerFactory.create('universal-contact-client');

interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  deleted: boolean;
  created: string;
  lastModified: string;
  createdBy: string;
  lastModifiedBy: string;
  optOut: {
    optedOut: boolean;
    by: string;
  };
}
export interface ContactsListData {
  paging: {
    _links: {
      self?: {
        href: string;
      };
    };
    limit?: number;
    nextToken?: string;
    totalCount?: number;
    currentToken?: string;
  };
  data: Contact[];
}

interface ContactGroup {
  id: string;
  name: string;
  type: string;
  distributionListInfo: {
    securityType?: string;
    internalNote?: string;
    status?: string;
  };
  shortDescription?: string;
  description?: string;
  note?: string;
  created: string;
  lastModified: string;
  createdBy: string;
  lastModifiedBy: string;
}

interface ContactType {
  id: string;
  name: string;
  code: string;
  description?: string;
}

export interface ContactGroupsResponse {
  paging: {
    _links: {
      self?: {
        href: string;
      };
    };
    limit?: number;
    nextToken?: string;
    totalCount?: number;
    currentToken?: string;
  };
  data: ContactGroup[];
}

export interface ContactTypeResponse {
  paging: {
    _links: {
      self?: {
        href: string;
      };
    };
    limit?: number;
    nextToken?: string;
    totalCount?: number;
    currentToken?: string;
  };
  data: ContactType[];
}

/**
 * Client class interacting with universal contact service
 */
export class UniversalContactsClient extends CvestDataSource {
  constructor() {
    super();
    this.baseURL = `${process.env.UNIVERSAL_CONTACTS_SERVICE_URL}/v1`;
  }

  public async filterContacts(filter?: string, nextToken?: string, limit?: number): Promise<ContactsListData> {
    LOG.debug('filterContacts', filter);
    const queryMap: URLSearchParams = new URLSearchParams({ limit: `${limit || 100}` });
    let body = null;

    if (nextToken) {
      queryMap.set('token', nextToken);
    }
    if (filter) {
      body = { filter };
    }
    const params = new URLSearchParams(queryMap);
    return this.post(`/contacts/filter?${params.toString()}`, body);
  }

  public async filterContactGroups(
    filter?: string,
    nextToken?: string,
    limit?: number
  ): Promise<ContactGroupsResponse> {
    LOG.debug('filterContactGroups', filter);
    const queryMap: URLSearchParams = new URLSearchParams({ limit: `${limit || 100}` });

    if (nextToken) {
      queryMap.set('token', nextToken);
    }
    if (filter) {
      queryMap.set('filter', filter);
    }
    return this.get('/contact-groups', queryMap);
  }

  public async filterContactTypes(filter?: string, nextToken?: string, limit?: number): Promise<ContactTypeResponse> {
    LOG.debug('filterContactTypes', filter);
    const queryMap: URLSearchParams = new URLSearchParams({ limit: `${limit || 100}` });

    if (nextToken) {
      queryMap.set('token', nextToken);
    }
    if (filter) {
      queryMap.set('filter', filter);
    }
    return this.get('/contact-types', queryMap);
  }
}

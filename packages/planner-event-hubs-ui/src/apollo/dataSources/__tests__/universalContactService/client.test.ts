import { UniversalContactsClient } from '@dataSources/universalContactsService/client';
import { mockDataSource } from '@resolvers/common/testUtils/mockRequestData';
import { contactGroupsData } from '../fixtures/contactGroupsData';
import { contactsData } from '../fixtures/contactsData';
import { contactTypesData } from '../fixtures/contactTypesData';

const dataSource = new UniversalContactsClient();

describe('Universal Contacts Client', () => {
  beforeEach(() => {
    dataSource.get = jest.fn().mockImplementation(async () => null);
    dataSource.post = jest.fn().mockImplementation(async () => null);
  });

  describe('filterContactGroups', () => {
    it('should fetch contact groups list', async () => {
      mockDataSource(dataSource, 'get', contactGroupsData);

      const response = await dataSource.filterContactGroups('name contains camp', null, 10);
      const params = new URLSearchParams({ limit: '10' });
      params.set('filter', 'name contains camp');
      expect(response).toEqual(contactGroupsData);
      expect(dataSource.get).toHaveBeenCalledWith('/contact-groups', params);
    });
  });

  describe('filterContacts', () => {
    it('should fetch contacts list', async () => {
      mockDataSource(dataSource, 'post', contactsData);

      const response = await dataSource.filterContacts('email contains cvent', null, 10);
      const params = new URLSearchParams({ limit: '10' });
      // params.set('filter', 'email contains cvent');
      expect(response).toEqual(contactsData);
      expect(dataSource.post).toHaveBeenCalledWith(`/contacts/filter?${params.toString()}`, {
        filter: 'email contains cvent'
      });
    });
  });

  describe('filterContactTypes', () => {
    it('should fetch contact types list', async () => {
      mockDataSource(dataSource, 'get', contactTypesData);
      const response = await dataSource.filterContactTypes('name contains camp', null, 10);
      const params = new URLSearchParams({ limit: '10' });
      params.set('filter', 'name contains camp');
      expect(response).toEqual(contactTypesData);
      expect(dataSource.get).toHaveBeenCalledWith('/contact-types', params);
    });
  });
});

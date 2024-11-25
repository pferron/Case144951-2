import { mockDataSource } from '@resolvers/common/testUtils/mockRequestData';
import { EventNavigationClient } from '@dataSources/eventNavigationService/client';

describe('eventNavigationService/client', () => {
  let dataSource: EventNavigationClient;

  beforeEach(() => {
    dataSource = new EventNavigationClient();
    dataSource.initialize({ context: { headers: {}, environment: 'unit-test' }, cache: undefined });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getGlobalNavigationItems', () => {
    it('calls GET global-navigation-items', () => {
      mockDataSource(dataSource, 'get', []);
      dataSource.getGlobalNavigationItems();
      expect(dataSource.get).toHaveBeenCalledWith('global-navigation-items');
    });
  });
});

import {
  getMockResolverRequestWithDataSources,
  mockDataSource,
  mockDataSourceError
} from '@resolvers/common/testUtils/mockRequestData';
import { VideoCenterClient } from '@dataSources/videoCenterService/client';
import { resolveQueryResponse } from '@resolvers/common/testUtils/mockFunction';
import profileResolver from '@resolvers/profile';
import { GraphQLResolveInfo } from 'graphql';
import { registrationAgeCalculation } from '@utils/registrationAgeCalculation';
import expectedMemberProfile from './fixtures/expectedMemberData.json';

const centerId = 'testCenterId';
const contactId = 'testContactId';

describe('resolvers/profile/index', () => {
  let dataSources;

  beforeEach(() => {
    dataSources = {
      videoCenterClient: new VideoCenterClient()
    };
  });

  describe('getMemberData', () => {
    it('Should get member data for contactId', async () => {
      mockDataSource(dataSources.videoCenterClient, 'getMemberProfileVisibility', {
        visible: true
      });
      mockDataSource(dataSources.videoCenterClient, 'getMemberProfile', {
        emailAddress: 'test@test.com',
        firstName: 'test',
        lastName: 'user',
        prefix: 'prefix',
        profileImageUrl: {
          href: 'profileImageUrl'
        },
        registrationDate: '2017-10-11T13:16:09.765Z',
        lastLoginDate: '2017-10-11T13:16:09.765Z',
        mobileNumber: '1234567890'
      });
      mockDataSource(dataSources.videoCenterClient, 'getHubTermsOfUse', {
        termsAccepted: true
      });
      const info: GraphQLResolveInfo = {
        fieldName: null,
        returnType: null,
        parentType: null,
        path: null,
        schema: null,
        fragments: null,
        rootValue: null,
        operation: null,
        variableValues: null,
        cacheControl: null,
        fieldNodes: [
          {
            kind: 'Field',
            name: null,
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: {
                    kind: 'Name',
                    value: 'termsAccepted'
                  }
                },
                {
                  kind: 'Field',
                  name: {
                    kind: 'Name',
                    value: 'visibility'
                  }
                }
              ]
            }
          }
        ]
      };
      const resolverRequest = getMockResolverRequestWithDataSources('Query.getMemberData', dataSources, {
        input: {
          centerId,
          contactId
        }
      });

      const response = await resolveQueryResponse(profileResolver, 'getMemberData', resolverRequest, info);
      expect(response).toBeTruthy();
      expect(response.profile.emailAddress).toEqual(expectedMemberProfile.profile.emailAddress);
      expect(response.profile.registrationDate).toEqual(expectedMemberProfile.profile.registrationDate);
      expect(response).toMatchObject(expectedMemberProfile);
      expect(response.profile.registrationAge).toEqual(registrationAgeCalculation(response.profile.registrationDate));
    });

    it('Should get member profile and visibility only for contactId', async () => {
      mockDataSource(dataSources.videoCenterClient, 'getMemberProfileVisibility', {
        visible: true
      });
      mockDataSource(dataSources.videoCenterClient, 'getMemberProfile', {
        emailAddress: 'test@test.com',
        firstName: 'test',
        lastName: 'user',
        prefix: 'prefix',
        profileImageUrl: {
          href: 'profileImageUrl'
        },
        registrationDate: '2017-10-11T13:16:09.765Z',
        lastLoginDate: '2017-10-11T13:16:09.765Z',
        mobileNumber: '1234567890'
      });
      const info: GraphQLResolveInfo = {
        fieldName: null,
        returnType: null,
        parentType: null,
        path: null,
        schema: null,
        fragments: null,
        rootValue: null,
        operation: null,
        variableValues: null,
        cacheControl: null,
        fieldNodes: [
          {
            kind: 'Field',
            name: null,
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: {
                    kind: 'Name',
                    value: 'visibility'
                  }
                }
              ]
            }
          }
        ]
      };
      const resolverRequest = getMockResolverRequestWithDataSources('Query.getMemberData', dataSources, {
        input: {
          centerId,
          contactId
        }
      });

      const response = await resolveQueryResponse(profileResolver, 'getMemberData', resolverRequest, info);
      expect(response).toBeTruthy();
      expect(response.profile).toMatchObject(expectedMemberProfile.profile);
      expect(response.profile.registrationAge).toEqual(registrationAgeCalculation(response.profile.registrationDate));
      expect(response.visibility).toEqual(expectedMemberProfile.visibility);
    });

    it('Should get member profile only for contactId', async () => {
      mockDataSource(dataSources.videoCenterClient, 'getMemberProfile', {
        emailAddress: 'test@test.com',
        firstName: 'test',
        lastName: 'user',
        prefix: 'prefix',
        profileImageUrl: {
          href: 'profileImageUrl'
        },
        registrationDate: '2017-10-11T13:16:09.765Z',
        lastLoginDate: '2017-10-11T13:16:09.765Z',
        mobileNumber: '1234567890'
      });
      const info: GraphQLResolveInfo = {
        fieldName: null,
        returnType: null,
        parentType: null,
        path: null,
        schema: null,
        fragments: null,
        rootValue: null,
        operation: null,
        variableValues: null,
        cacheControl: null,
        fieldNodes: [
          {
            kind: 'Field',
            name: null,
            selectionSet: {
              kind: 'SelectionSet',
              selections: []
            }
          }
        ]
      };
      const resolverRequest = getMockResolverRequestWithDataSources('Query.getMemberData', dataSources, {
        input: {
          centerId,
          contactId
        }
      });

      const response = await resolveQueryResponse(profileResolver, 'getMemberData', resolverRequest, info);
      expect(response).toBeTruthy();
      expect(response.profile).toMatchObject(expectedMemberProfile.profile);
      expect(response.profile.registrationAge).toEqual(registrationAgeCalculation(response.profile.registrationDate));
    });

    it('Should return unauthorised for a contact id', async () => {
      mockDataSourceError(dataSources.videoCenterClient, 'get', 'Unauthorized', '401');
      const resolverRequest = getMockResolverRequestWithDataSources('Query.getMemberData', dataSources, {
        input: {
          centerId,
          contactId
        }
      });
      await expect(async () => {
        await resolveQueryResponse(profileResolver, 'getMemberData', resolverRequest);
      }).rejects.toThrow('Unauthorized');
    });

    it('Should return not found for an invalid contact id', async () => {
      mockDataSourceError(dataSources.videoCenterClient, 'get', 'Not Found', '404');
      const resolverRequest = getMockResolverRequestWithDataSources('Query.getMemberData', dataSources, {
        input: {
          centerId,
          contactId
        }
      });
      await expect(async () => {
        await resolveQueryResponse(profileResolver, 'getMemberData', resolverRequest);
      }).rejects.toThrow('Not Found');
    });
  });
});

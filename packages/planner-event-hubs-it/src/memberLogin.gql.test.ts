// FIREBALL
/* eslint-disable jest/no-standalone-expect */
import { GuestVisibility, MemberLoginInput } from '@cvent/planner-event-hubs-model/types';
import { authOptions, connectToApiAsPlanner } from '@helpers/connectToApiAsPlanner';
import { createHub, hubPublish, initiateMemberLogin, rawDeleteHub, rawUpdateHubSettings } from '@helpers/hubFunctions';
import { newHubData } from '@fixtures/hubData';
import { ApolloClient, NormalizedCacheObject } from '@apollo/client';

let client: ApolloClient<NormalizedCacheObject>;
let hubId: string;
let memberLoginInput: MemberLoginInput;

beforeAll(async () => {
  client = await connectToApiAsPlanner(authOptions);
  hubId = await createHub(client, newHubData);
  await hubPublish(client, { id: hubId });
  memberLoginInput = {
    hubId,
    memberInfo: {
      firstName: 'test',
      lastName: 'user',
      email: 'test.user@cvent.com'
    }
  };
}, 20000);

afterAll(async () => {
  await rawDeleteHub(client, { id: hubId });
});

describe('Member Login GQL IT', () => {
  it('planner successfully sends login email to member', async () => {
    // send login request
    const loginResponse = await initiateMemberLogin(client, memberLoginInput);

    expect(loginResponse.email).toEqual(memberLoginInput.memberInfo.email);
    expect(loginResponse.firstName).toEqual(memberLoginInput.memberInfo.firstName);
    expect(loginResponse.lastName).toEqual(memberLoginInput.memberInfo.lastName);
    expect(loginResponse.emailLocked).toBeFalsy();
    // expect(loginResponse.expirationDate).toBeDefined();
    expect(loginResponse.maxEmailSent).toBeFalsy();
    expect(loginResponse.userRestricted).toBeFalsy();
  }, 50000);

  // MAUVE
  // TODO: Write an IT for planner request to initiate restricted member login
  // There don't seem to be any examples in video-hub-service ITs of how to get a 403 response from /login-request
  // eslint-disable-next-line jest/no-disabled-tests
  it.skip('returns user restricted when registration settings are set', async () => {
    // set registration settings for video center
    const input = {
      id: hubId,
      hubSettings: {
        guestVisibility: GuestVisibility.Private,
        registrationSettings: {
          allowAllContactsRegistration: false,
          allowContactGroupsRegistration: true
        }
      }
    };
    await rawUpdateHubSettings(client, input);

    // member login is restricted
    const memberLoginResponse = await initiateMemberLogin(client, memberLoginInput);
    expect(memberLoginResponse).toEqual({});
    expect(memberLoginResponse).toBeTruthy();
    expect(memberLoginResponse.userRestricted).toBeTruthy();
  });
});

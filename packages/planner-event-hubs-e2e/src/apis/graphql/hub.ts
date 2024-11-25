import { FetchResult, gql } from '@apollo/client';
import {
  CREATE_VIDEO_HUB,
  DELETE_VIDEO_HUB,
  PUBLISH_VIDEO_HUB,
  UPDATE_CENTER_FEATURE,
  UPDATE_HUB_SETTINGS,
  UPDATE_VIDEO_HUB
} from '@cvent/planner-event-hubs-model/operations/hub';
import {
  CalendarInput,
  Feature,
  ProfileCard,
  RegistrationSettingsInput,
  Settings
} from '@cvent/planner-event-hubs-model/src/types';
import { faker } from '@faker-js/faker';
import { connectToApiAsPlanner } from '../../utils/authUtils';

export const newHub = gql`
  mutation hubCreate($input: HubCreate!) {
    hubCreate(input: $input)
  }
`;

export const newHubData = {
  config: {
    title: `[PEH] E2e ${faker.company.name()}`,
    ownerFirstName: faker.person.firstName(),
    ownerLastName: faker.person.lastName(),
    ownerEmail: faker.internet.email(),
    locale: ['es-ES', 'en-US'][Math.round(Math.random())]
  },
  theme: {
    backgroundColor: '#F4F4F4',
    moodColor: '#FFFFFF',
    mainColor: '#182261',
    actionColor: '#006AE1',
    safeMode: true,
    logoAltText: '[PEH] e2e',
    logoImageRelativePath: null,
    logoImageUrl:
      'https://images-lower.cvent.com/T2/612584d1969d4c7192212eedda896de6/video-center/90abfb32-ff46-40f0-8724-85fa07be3d32/logo/90abfb32-ff46-40f0-8724-85fa07be3d32/4975d566ae4d10ce54230cfe3433b30b!_!7932edef552231220db8048138681f9d.jpeg',
    logoOriginalImageUrl: null,
    backgroundImageUrl:
      'https://images-lower.cvent.com/T2/612584d1969d4c7192212eedda896de6/video-center/ba00a044-5202-4b3e-b7c2-b54740553501/backgroundimage/ba00a044-5202-4b3e-b7c2-b54740553501/99f22677b673efd3baa03b6b2781fa82!_!30a833ca15eb1b1fa73cff154adaeb9f.jpeg',
    backgroundOriginalImageUrl:
      'https://images-lower.cvent.com/T2/612584d1969d4c7192212eedda896de6/video-center/ba00a044-5202-4b3e-b7c2-b54740553501/backgroundimage/ba00a044-5202-4b3e-b7c2-b54740553501/99f22677b673efd3baa03b6b2781fa82!_!30a833ca15eb1b1fa73cff154adaeb9f.jpeg'
  }
};

export const createHub = async (hubConfigOverrides = {}, hubThemeOverrides = {}): Promise<string> => {
  const client = await connectToApiAsPlanner();
  return (
    await client.mutate({
      mutation: CREATE_VIDEO_HUB,
      variables: {
        hubUpdate: {
          config: { ...newHubData.config, ...hubConfigOverrides },
          theme: { ...newHubData.theme, ...hubThemeOverrides }
        }
      }
    })
  ).data.hubCreate as string;
};

export const publishHub = async (hubId: string): Promise<void> => {
  const client = await connectToApiAsPlanner();
  await client.mutate({
    mutation: PUBLISH_VIDEO_HUB,
    variables: {
      input: {
        id: hubId
      }
    }
  });
};

export const deleteHub = async (hubId: string): Promise<FetchResult<void>> => {
  const client = await connectToApiAsPlanner();
  return client.mutate({
    mutation: DELETE_VIDEO_HUB,
    variables: {
      input: {
        id: hubId
      }
    }
  });
};

export const hubUpdateSettings = async (
  hubId: string,
  profileSettings: ProfileCard = {},
  registrationSettings: RegistrationSettingsInput = {}
): Promise<FetchResult<Settings>> => {
  const client = await connectToApiAsPlanner();
  return client.mutate({
    mutation: UPDATE_HUB_SETTINGS,
    variables: {
      input: {
        id: hubId,
        hubSettings: {
          ccpaEnableDoNotSell: true,
          displayTermsLinkOnFooter: true,
          displayPrivacyPolicy: true,
          termsLinkText: 'terms link',
          ccpaLinkExplanationText: 'ccpa Link Explanantion Text',
          ccpaDoNotSellUrl: 'www.google.com',
          displayCventPrivacyPolicy: true,
          privacyPolicyLinkText: 'My Company Policy',
          termsText: 'terms text',
          displayTermsOnLogin: true,
          profileCard: {
            ...profileSettings
          },
          registrationSettings
        }
      }
    }
  });
};

export const updateCenterFeature = async (hubId: string, code: string): Promise<FetchResult<Feature>> => {
  const client = await connectToApiAsPlanner();
  return client.mutate({
    mutation: UPDATE_CENTER_FEATURE,
    variables: {
      input: {
        centerId: hubId,
        code,
        enabled: true
      }
    }
  });
};

export const updateHub = async (hubId: string, calendarInput: CalendarInput): Promise<string> => {
  const client = await connectToApiAsPlanner();
  return (
    await client.mutate({
      mutation: UPDATE_VIDEO_HUB,
      variables: {
        input: {
          id: hubId,
          config: newHubData.config,
          theme: newHubData.theme,
          calendar: calendarInput
        }
      }
    })
  ).data.hubUpdate as string;
};

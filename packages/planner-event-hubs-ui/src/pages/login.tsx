import React, { useCallback } from 'react';
import { useRouter } from 'next/router';
import { DevLoginForm, defaultAuthorizationPersonas } from '@cvent/nextjs';
import { GetServerSidePropsResult } from 'next';
import { FetchClient } from '@cvent/fetch';

const client = new FetchClient();

export const getServerSideProps = (): GetServerSidePropsResult<NonNullable<unknown>> => {
  if (process.env.DEV_LOGIN === 'true' || process.env.ENVIRONMENT_TYPE === 'dev') {
    return { props: {} };
  }
  return {
    notFound: true
  };
};

const roles = [
  'IS_PLANNER',
  'videos:read',
  'videos:write',
  'account-config:read',
  'user-permissions:read',
  'contacts:read',
  'contact-groups:read',
  'contact-types:read',
  'video-center:read',
  'video-center:write'
];
const grantedAuthorizations = [
  {
    // universal-video-service
    appId: 3020,
    roles: ['videos:read', 'videos:write']
  },
  {
    // video-hub-service
    appId: 3513,
    roles: ['video-hubs:write', 'video-hubs:read', 'video-center:write', 'video-center:read', 'video-center:anonymous']
  },
  // { // Webcast service - not sure if we will need this for planners
  //   appId: 2789,
  //   roles: ['players:delete', 'players:read', 'players:write', 'webcasts:read']
  // },
  {
    // universal-event-service
    appId: 2082,
    roles: ['events:read']
  },
  {
    // universal-contacts-service
    appId: 2748,
    roles: ['contacts:read', 'contact-groups:read', 'contact-types:read']
  },
  {
    appId: 5491, // writing assistant
    roles: ['assistant:write']
  },
  // custom domain service
  {
    appId: 1749,
    roles: ['DOMAIN_READ_WRITE', 'DOMAIN_DELETE']
  }
];

// TODO: setup personas for T2 since this project is trunk-based and will not deploy to 606
const initialPersonas = {
  ...defaultAuthorizationPersonas,
  'Fireball T2': {
    authorization: {
      metadata: {
        UserStub: 'd6026791-4d65-45f5-acc4-41942bfe1ccd',
        UserLoginName: '(Cvent - hhimani) hhimani',
        LocaleId: 1033,
        AccountId: 801546609,
        IsLoggedInFromCvii: true,
        isSelfServiceLicense: false,
        environment: 'T2',
        accountStub: '807375f2-05ae-484b-973e-19c4467da80f',
        platformUserId: '',
        accountMappingId: 'a5d2b9bb-ad7a-4afa-81b9-915692481089',
        locale: 'en-US'
      },
      roles,
      grantedAuthorizations
    }
  },
  'Red S606 AutoRed': {
    authorization: {
      metadata: {
        UserStub: '2844256e-9d1d-4ed9-b031-5d32540b21e0',
        UserLoginName: 'AutoRedUser (local dev)',
        LocaleId: 1033,
        AccountId: 801538997,
        IsLoggedInFromCvii: true,
        isSelfServiceLicense: false,
        isWebinarAllowed: true,
        environment: 'S606',
        accountStub: '643b952c-c66a-4ecb-b4b0-9e873bd46306',
        platformUserId: '',
        accountMappingId: '6b019113-9f5a-4b78-bb0f-56892fa115b6',
        locale: 'en-US',
        core: {
          id: '801538997',
          userId: '2844256e-9d1d-4ed9-b031-5d32540b21e0',
          username: 'AutoRedUser (local dev)'
        }
      },
      roles,
      grantedAuthorizations
    }
  },
  'Red T2 AutoRed': {
    authorization: {
      metadata: {
        UserStub: '78ff5610-6809-4b9f-8fe7-5397dbbca94e',
        UserLoginName: 'AutoRedUser (local dev)',
        LocaleId: 1033,
        AccountId: 801572097,
        IsLoggedInFromCvii: true,
        isSelfServiceLicense: false,
        isWebinarAllowed: true,
        environment: 'T2',
        accountStub: '895e6d16-c643-4a30-8919-c5b3fe8fbe80',
        platformUserId: '00u1bn1mb0xfDJ5xg0h8',
        accountMappingId: '7f378243-2c62-49fa-82e9-90e5498d30c3',
        locale: 'en-US',
        surveyTypeAccess: ['basic', 'premium', 'assessment'],
        accountId: 801572097,
        userStub: '78ff5610-6809-4b9f-8fe7-5397dbbca94e',
        core: {
          id: '801572097',
          username: 'AutoRedUser (local dev)',
          userId: '78ff5610-6809-4b9f-8fe7-5397dbbca94e'
        }
      },
      roles,
      grantedAuthorizations
    }
  },
  // This account will query AppSwitcher links dynamically
  'CVENTENG - S606': {
    authorization: {
      metadata: {
        UserStub: '128c21a7-48bd-41a1-a5d0-ba00d39da589',
        UserLoginName: 'vroom',
        LocaleId: 1033,
        AccountId: 801538722,
        IsLoggedInFromCvii: true,
        isSelfServiceLicense: false,
        environment: 'S606',
        accountStub: 'f5b731d1-3ad5-4026-8149-c5a81269bedf',
        platformUserId: '00u17z1iaffHRkjUl0h8',
        accountMappingId: 'f6d74648-2c09-496f-a3e3-e3f6cd1503a0',
        locale: 'en-US'
      },
      roles,
      grantedAuthorizations
    }
  },
  'Vroom - S606': {
    authorization: {
      metadata: {
        UserStub: '33a64124-a4dc-44a1-82e2-e6771d62aa93',
        UserLoginName: 'Event Builder ((Cvent - eduardop) )',
        LocaleId: 1033,
        AccountId: 801535726,
        IsLoggedInFromCvii: true,
        isSelfServiceLicense: false,
        environment: 'S606',
        accountStub: '2c296e4d-1375-49c8-ad05-684cff68ec09',
        platformUserId: '',
        accountMappingId: 'f5aa5f0b-9ede-4cdf-968e-d0ee147201bf',
        locale: 'en-US'
      },
      roles,
      grantedAuthorizations
    }
  },
  'local-red': {
    authorization: {
      metadata: {
        UserStub: 'c1c7447b-f726-4f01-934e-24e3e30ade59',
        UserLoginName: 'kelly.yao@j.mail (local dev)',
        LocaleId: 1033,
        AccountId: 801579193,
        IsLoggedInFromCvii: true,
        isSelfServiceLicense: false,
        isWebinarAllowed: false,
        environment: 'S606',
        accountStub: '82e4b078-1f8b-403e-a284-e9da96af5f47',
        platformUserId: '',
        accountMappingId: '2f078084-74a1-4ea2-926d-a32dc7e73c74',
        locale: 'en-US',
        accountId: 801579193,
        userLoginName: '(Cvent - vsubbanna) kelly.yao@j.mail',
        userStub: 'c1c7447b-f726-4f01-934e-24e3e30ade59',
        core: {
          id: '801579193',
          userId: 'c1c7447b-f726-4f01-934e-24e3e30ade59',
          username: 'kelly.yao@j.mail (local dev)'
        }
      },
      roles,
      grantedAuthorizations
    }
  },
  'Mauve T2': {
    authorization: {
      metadata: {
        UserStub: '8cdb4896-4f6c-487f-bd68-e501fa827540',
        UserLoginName: 'abhijeet.rathore@j.mail',
        LocaleId: 1033,
        AccountId: 801614096,
        IsLoggedInFromCvii: true,
        isSelfServiceLicense: false,
        environment: 'T2',
        accountStub: '4CDB1541-4CBD-4518-B627-3AEAE07EA24F',
        platformUserId: '',
        accountMappingId: '612584d1-969d-4c71-9221-2eedda896de6',
        locale: 'en-US'
      },
      roles,
      grantedAuthorizations
    }
  }
};

function LoginPage(): JSX.Element {
  const router = useRouter();
  const { query } = router;

  const login = useCallback(
    async tokenOptions => {
      await client.json().post('/api/login', { accessTokenOptions: tokenOptions });
      router.push((query.returnUrl as string) || '/');
    },
    [query.returnUrl, router]
  );

  return <DevLoginForm login={login} initialPersonas={initialPersonas} />;
}

LoginPage.navMetadata = {
  url: '/login',
  staticRouteId: '/login',
  topParentId: ''
};

export default LoginPage;

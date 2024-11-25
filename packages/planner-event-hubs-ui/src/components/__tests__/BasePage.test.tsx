import React from 'react';
import { render } from '@testing-library/react';
import { BasePage } from '@components/BasePage';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import { MockedProvider } from '@apollo/client/testing';
import { GetHubSettingsDocument } from '@cvent/planner-event-hubs-model/operations';
import { useUserPermissions } from '@hooks/UserPermissionsProvider';
import { screen } from 'nucleus-text/testing-library/screen';

jest.mock('next/router', () => ({
  useRouter: (): { route: string; pathname: string; query: { centerId: string } } => {
    return {
      route: '/[centerId]',
      pathname: '/[centerId]',
      query: {
        centerId: '00000000-0000-0000-000000000000'
      }
    };
  }
}));

jest.mock('@hooks/UserPermissionsProvider', () => {
  const originalModule = jest.requireActual('@hooks/UserPermissionsProvider');
  return {
    __esModule: true,
    ...originalModule,
    useUserPermissions: jest.fn().mockReturnValue({
      VideoCenter: true,
      VideoLibrary: true,
      VideoStorage: true
    })
  };
});

jest.mock('@cvent/carina/components/Navigation/NavigationProvider', () => {
  const originalModule = jest.requireActual('@cvent/carina/components/Navigation/NavigationProvider');
  return {
    __esModule: true,
    ...originalModule,
    useNavigation: jest.fn().mockReturnValue({
      logo: {
        src: '/video-hub/cvent-logo.png',
        url: '/',
        title: 'Video Center'
      },
      page: 'demo',
      appSwitcher: {
        __typename: 'CarinaAppSwitcher',
        title: 'Developer Resources',
        defaultOpen: false,
        items: [
          {
            icon: 'PagesIcon',
            title: 'Cvent Technology',
            status: 'enabled',
            url: {
              href: 'https://technology.docs.cvent.org'
            }
          }
        ]
      },
      title: 'demo',
      globalNav: [
        {
          current: null,
          title: 'Home',
          titleKey: null,
          url: {
            __typename: 'CarinaLink',
            href: '/[centerId]'
          },
          items: []
        }
      ]
    })
  };
});

const appFeatures = [
  {
    name: 'memberLogin',
    enabled: true,
    experimentVersion: '1000'
  }
];

const mocks = [
  {
    request: {
      query: GetHubSettingsDocument,
      id: {
        id: '00000000-0000-0000-000000000000'
      }
    },
    result: {
      data: {
        getHubSettings: {}
      }
    }
  }
];
describe('Base Page tests', () => {
  it('should render provided child with top nav and footer', async () => {
    function FakeComponent(): JSX.Element {
      return <div>FAKE COMPONENT</div>;
    }

    const { baseElement } = render(
      <MockedProvider mocks={mocks}>
        <TestWrapper appFeatures={appFeatures}>
          <BasePage showSideNav showFooter>
            <FakeComponent />
          </BasePage>
        </TestWrapper>
      </MockedProvider>
    );
    expect(baseElement).toMatchSnapshot();
    expect(await screen.findByText('FAKE COMPONENT')).toBeInTheDocument();
  });

  it('Should render no permissions message when user has no video center permissions', async () => {
    function FakeComponent(): JSX.Element {
      return <div>FAKE COMPONENT</div>;
    }
    // Mock the useUserPermissions hook to return different permissions
    (useUserPermissions as jest.Mock).mockReturnValue({
      VideoCenter: false,
      VideoLibrary: false,
      VideoStorage: false
    });

    render(
      <MockedProvider mocks={mocks}>
        <TestWrapper appFeatures={appFeatures}>
          <BasePage showFooter={false}>
            <FakeComponent />
          </BasePage>
        </TestWrapper>
      </MockedProvider>
    );
    expect(await screen.findByTextKey('video_library_no_permission_empty_page_message_header')).toBeInTheDocument();
  });
});

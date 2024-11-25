import { resolveTemplateUrl } from './environmentUtil';

const { normandyBaseUrl } = process.env;
const loginApiServiceBaseUrl = process.env.LOGIN_API_SERVICE_BASE_URL;
const plannerAccountAppBaseUrl = process.env.PLANNER_ACCOUNT_APP_BASE_URL;

// RED
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockProductData = (environment): any => ({
  data: [
    {
      id: 'event',
      icon: 'EventIcon',
      title: 'Events',
      url: `${normandyBaseUrl}/Subscribers/Events2/EventSelection`,
      status: 'ENABLED'
    },
    {
      id: 'contact',
      icon: 'ContactsIcon',
      title: 'Contacts',
      url: `${resolveTemplateUrl(normandyBaseUrl, environment)}/Subscribers/ContactMgmt/AddressBook/AddressBookList`,
      status: 'ENABLED'
    },
    {
      id: 'admin',
      icon: 'SettingsIcon',
      title: 'Admin',
      url: `${resolveTemplateUrl(normandyBaseUrl, environment)}/Subscribers/Admin/Overview/Index`,
      status: 'ENABLED'
    }
  ]
});

// RED
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockUtilitiesData = (environment, isWebinar): any => ({
  profile: {
    title: 'My Profile',
    url: `${resolveTemplateUrl(normandyBaseUrl, environment)}/Subscribers/Admin/MyProfile/UserDetails/Index/View`,
    icon: 'UserIcon'
  },
  logout: {
    title: 'Log Out',
    url: `${resolveTemplateUrl(normandyBaseUrl, environment)}/Subscribers/Logout.aspx`,
    icon: 'LogOutIcon'
  },
  help: {
    title: 'Support',
    url: `${loginApiServiceBaseUrl}/authorize?targetProductId=0oah54int1B6ZX18r0h7&state=/knowledgebase`,
    icon: 'InfoIcon'
  },
  community: {
    title: 'Community',
    url: `${loginApiServiceBaseUrl}/authorize?targetProductId=0oah54int1B6ZX18r0h7`,
    icon: 'MessageBubblesIcon'
  },
  ...(isWebinar
    ? {
        account: {
          title: 'Manage Account',
          url: `${plannerAccountAppBaseUrl}/account`,
          icon: 'PersonAccountIcon'
        }
      }
    : {})
});

// RED
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockBrandingResponse = (environment): any => ({
  logo: `${resolveTemplateUrl(normandyBaseUrl, environment)}/a/planner-side/images/cvent-logo.svg`,
  footer: '',
  favicon: `${resolveTemplateUrl(normandyBaseUrl, environment)}/favicon.ico`
});

const mockRecentItemsResponse = {
  data: [
    {
      id: 'e6ff5895-e5a6-4c28-b7f3-e40e02c32ef0',
      type: 'EVENT',
      title: 'new container event for Reg',
      url: 'https://events-silo606.core.cvent.org/events/registration/registrationSettings?evtstub=e6ff5895-e5a6-4c28-b7f3-e40e02c32ef0',
      icon: 'EventIcon'
    }
  ]
};

const mockHelpCommunityLinks = {
  href: '#'
};

export { mockProductData, mockUtilitiesData, mockBrandingResponse, mockRecentItemsResponse, mockHelpCommunityLinks };

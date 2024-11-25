import { accountLocale } from '@cvent/planner-event-hubs-model/operations/coreSOA';
import { SET_TRANSLATIONS } from '@cvent/planner-event-hubs-model/operations/languageManagement';
import { GET_VIDEO_HUB, hubLocales, UPDATE_VIDEO_HUB } from '@cvent/planner-event-hubs-model/operations/hub';

export const mockHub = {
  hub: {
    id: 'test-event-plus',
    status: 'Active',
    config: {
      title: 'test',
      ownerFirstName: 'firstName',
      ownerLastName: 'lastName',
      ownerEmail: 'firstName.lastName@cvent.com',
      url: null,
      locale: 'en-US',
      autoDetectBrowserLocale: true,
      helpEmailAddress: '',
      utmOverride: ''
    },
    theme: {
      actionColor: '#1a6137',
      backgroundColor: '#1ce6e6',
      logoImageRelativePath: null,
      logoImageUrl: null,
      logoAltText: null,
      mainColor: '#1622e6',
      logoOriginalImageUrl: '',
      moodColor: 'white',
      safeMode: false,
      faviconUrl: '',
      headingsFont: null,
      bodyFont: null
    },
    calendar: {
      id: null
    }
  }
};

export const queryMocks = [
  {
    request: {
      query: SET_TRANSLATIONS,
      variables: {
        input: { id: 'test-event-plus' },
        locale: 'en-US',
        data: [
          {
            type: 'PhraseApp-Key',
            locale: 'en-US',
            id: 'upcoming_events_register_btn_text',
            translatedValue: 'New Register Button Text'
          }
        ]
      },
      result: {
        data: {
          setTranslations: {
            Failure: [],
            Success: [
              {
                type: 'PhraseApp-Key',
                locale: 'en-US',
                id: 'upcoming_events_register_btn_text',
                translatedValue: 'New Register Button Text',
                __typename: 'Translation'
              }
            ],
            __typename: 'TranslationUpdateResponse'
          }
        }
      }
    }
  },
  {
    request: {
      query: hubLocales,
      variables: {
        id: {
          id: 'test-event-plus'
        }
      }
    },
    result: {
      data: {
        getHubLocales: {
          data: [
            {
              locale: 'de-DE',
              default: false,
              __typename: 'HubLocaleWithDefault'
            },
            {
              locale: 'en-US',
              default: true,
              __typename: 'HubLocaleWithDefault'
            }
          ],
          __typename: 'HubLocalesWithDefault'
        }
      }
    }
  },
  {
    request: {
      query: accountLocale,
      variables: {}
    },
    result: {
      data: {
        accountLocale: [
          {
            Locale: {
              Id: 2052,
              LanguageName: '中文（简体）',
              CountryLanguage: 'Chinese (China)',
              CultureCode: 'zh-CN',
              IsDefault: true,
              AvailableCultures: [
                {
                  LocaleId: 2052,
                  CultureCountryId: 49,
                  IsDefaultCulture: true,
                  CultureCode: 'zh-cn',
                  __typename: 'Culture'
                }
              ],
              LocalizationFlag: true,
              __typename: 'Locale'
            },
            IsDefault: false,
            __typename: 'AccountLocale'
          },
          {
            Locale: {
              Id: 1030,
              LanguageName: 'Dansk',
              CountryLanguage: 'Danish',
              CultureCode: 'da-DK',
              IsDefault: true,
              AvailableCultures: [
                {
                  LocaleId: 1030,
                  CultureCountryId: 60,
                  IsDefaultCulture: false,
                  CultureCode: 'da',
                  __typename: 'Culture'
                }
              ],
              LocalizationFlag: true,
              __typename: 'Locale'
            },
            IsDefault: false,
            __typename: 'AccountLocale'
          },
          {
            Locale: {
              Id: 1033,
              LanguageName: 'English',
              CountryLanguage: 'English',
              CultureCode: 'en-US',
              IsDefault: true,
              LocalizationFlag: true,
              __typename: 'Locale'
            },
            IsDefault: false,
            __typename: 'AccountLocale'
          }
        ]
      },
      refetch: jest.fn()
    }
  },
  {
    request: {
      query: GET_VIDEO_HUB,
      variables: {
        hubID: {
          id: 'test-event-plus'
        }
      }
    },
    result: {
      data: mockHub
    }
  },
  {
    request: {
      variables: {
        input: {
          id: 'test-event-plus',
          config: {
            title: 'test',
            ownerFirstName: 'firstName',
            ownerLastName: 'lastName',
            ownerEmail: 'firstName.lastName@cvent.com',
            url: null,
            locale: 'en-US',
            autoDetectBrowserLocale: false,
            helpEmailAddress: '',
            utmOverride: ''
          },
          theme: {
            actionColor: '#1a6137',
            backgroundColor: '#1ce6e6',
            logoImageRelativePath: null,
            logoImageUrl: null,
            logoAltText: null,
            mainColor: '#1622e6',
            logoOriginalImageUrl: '',
            moodColor: 'white',
            safeMode: false,
            faviconUrl: '',
            headingsFont: null,
            bodyFont: null
          },
          calendar: {
            id: null
          }
        }
      },
      query: UPDATE_VIDEO_HUB
    },
    result: {
      data: mockHub
    }
  }
];

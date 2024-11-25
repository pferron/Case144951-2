import { MockedProvider } from '@apollo/client/testing';
import { AppFeaturesProvider } from '@components/AppFeaturesProvider';
import { Form } from '@cvent/carina/components/Forms';
import { accountLocale } from '@cvent/planner-event-hubs-model/operations/coreSOA';
import { render, screen } from '@testing-library/react';
import { TestWrapper } from '@utils/testUtil/TestWrapper';
import 'jest-axe/extend-expect';
import { axe } from 'jest-axe';
import InformationFields from '../information/InformationFields';

const accountLocalesMock = {
  request: {
    query: accountLocale,
    variable: {}
  },
  result: {
    data: {
      accountLocale: [
        {
          Locale: {
            Id: 1030,
            LanguageName: 'Dansk',
            CountryLanguage: 'Testing Danish',
            CultureCode: 'da-DK',
            IsDefault: true,
            AvailableCultures: [
              {
                LocaleId: 1030,
                CultureCountryId: 60,
                IsDefaultCulture: true,
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
            AvailableCultures: [
              {
                LocaleId: 1033,
                CultureCountryId: 14,
                IsDefaultCulture: false,
                CultureCode: 'en-au',
                __typename: 'Culture'
              }
            ],
            LocalizationFlag: true,
            __typename: 'Locale'
          },
          IsDefault: true,
          __typename: 'AccountLocale'
        }
      ]
    }
  }
};

describe('Information Fields', () => {
  it('Should render fine with default information', async () => {
    const appFeatures = [];
    const { container } = render(
      <TestWrapper>
        <MockedProvider mocks={[accountLocalesMock]}>
          <AppFeaturesProvider value={appFeatures}>
            <Form initialValues={{ locale: 'en-US' }}>
              <InformationFields />
            </Form>
          </AppFeaturesProvider>
        </MockedProvider>
      </TestWrapper>
    );

    expect(await screen.findByTestId('video-hub-form-title')).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('Should use locales list from account to show in information page dropdown', async () => {
    const languageManagementFeature = [
      {
        name: 'languageManagementFeature',
        enabled: true,
        experimentVersion: '1001'
      }
    ];

    const { container } = render(
      <TestWrapper>
        <MockedProvider mocks={[accountLocalesMock]}>
          <AppFeaturesProvider value={languageManagementFeature}>
            <Form initialValues={{ locale: 'da-DK' }}>
              <InformationFields />
            </Form>
          </AppFeaturesProvider>
        </MockedProvider>
      </TestWrapper>
    );

    expect(await screen.findByTestId('video-hub-form-title')).toBeInTheDocument();
    const locale = await screen.findAllByText('Testing Danish');
    expect(locale[0]).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });
});

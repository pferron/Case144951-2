/* eslint-disable @typescript-eslint/no-empty-function */
// TODO: move this css boilerplate into a next.js plugin
import 'normalize.css'; // css reset
import '@cvent/carina/fonts/fonts.web.css';

import React from 'react';
import { ThemeProvider as V0ThemeProvider } from '@cvent/carina-theme-provider';
import { ThemeProvider as V1ThemeProvider } from '@cvent/carina/components/ThemeProvider';
import { getDefaultTheme } from '@cvent/carina/utils/tokens';
import { Breakpoints as BreakpointsV0 } from '@cvent/carina/components/Breakpoints/Breakpoints';
import { GlobalStyles } from '@utils/GlobalStyles';
import { LocalizationProvider } from 'nucleus-text';
import { AppFeaturesProvider } from '@components/AppFeaturesProvider';
import { AppFeature, UserPermissions } from '@cvent/planner-event-hubs-model/types';
import { appConfigsVar } from '@pages/_app';
import { Breakpoints as BreakpointsV1 } from '@cvent/carina/components/Breakpoints';
import BlockWithTypography from '@cvent/blocks/components/BlockWithTypography';
import { UserPermissionsProvider } from '@hooks/UserPermissionsProvider';
import { NormandySession } from './userSession/NormandySession';
import locales, { switchChineseLocale } from '../../locales';

export default function AppProviders({ children, appFeatures, normandyBaseUrl, userPermissions }: Props): JSX.Element {
  const { locale: userLocale } = appConfigsVar();
  const locale = switchChineseLocale(userLocale);

  return (
    <V0ThemeProvider theme={getDefaultTheme()}>
      <V1ThemeProvider theme={getDefaultTheme()}>
        <LocalizationProvider locale={locale} clientSideLocales={locales} serverSideLocales={locales}>
          <GlobalStyles />
          <BreakpointsV0 ssrSize="m" key={typeof window === 'undefined' ? 'ssr' : 'csr'}>
            <BreakpointsV1 ssrSize="m" key={typeof window === 'undefined' ? 'ssr' : 'csr'}>
              <AppFeaturesProvider value={appFeatures}>
                <UserPermissionsProvider value={userPermissions}>
                  <>
                    {/* Ensure typography doesn't get overwritten by inner uses of BlockThemeProvider */}
                    {/* Can be removed once CarinaThemeProvider above is replaced with BlockThemeProvider */}
                    <BlockWithTypography css={{ height: '100%' }}>{children}</BlockWithTypography>
                    <NormandySession normandyBaseUrl={normandyBaseUrl} />
                  </>
                </UserPermissionsProvider>
              </AppFeaturesProvider>
            </BreakpointsV1>
          </BreakpointsV0>
        </LocalizationProvider>
      </V1ThemeProvider>
    </V0ThemeProvider>
  );
}

interface Props {
  children: JSX.Element;
  appFeatures: AppFeature[];
  normandyBaseUrl: string;
  userPermissions: UserPermissions;
}

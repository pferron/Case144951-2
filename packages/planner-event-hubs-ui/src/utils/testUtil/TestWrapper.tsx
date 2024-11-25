import React, { useMemo } from 'react';
import { LocalizationProvider } from 'nucleus-text';
import { Breakpoints } from '@cvent/carina/components/Breakpoints';
import { AppFeature } from '@cvent/planner-event-hubs-model/types';
import { ThemeProvider } from '@cvent/carina/components/ThemeProvider/ThemeProvider';
import { getDefaultTheme } from '@cvent/carina/utils/tokens';
import { AppFeaturesProvider } from '@components/AppFeaturesProvider';
import { UserPermissionsContext } from '@hooks/UserPermissionsProvider';
import locales, { defaultLocale } from '../../../locales';

export function TestWrapper({ children, appFeatures }: Props): JSX.Element {
  const userPermissionsValue = useMemo(() => ({ VideoCenter: true }), []);
  return (
    <ThemeProvider theme={getDefaultTheme()}>
      <LocalizationProvider locale={defaultLocale} locales={locales}>
        <Breakpoints ssrSize="m" key={typeof window === 'undefined' ? 'ssr' : 'csr'}>
          <AppFeaturesProvider value={appFeatures}>
            <UserPermissionsContext.Provider value={userPermissionsValue}>{children}</UserPermissionsContext.Provider>
          </AppFeaturesProvider>
        </Breakpoints>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

interface Props {
  children: JSX.Element;
  appFeatures?: AppFeature[];
}

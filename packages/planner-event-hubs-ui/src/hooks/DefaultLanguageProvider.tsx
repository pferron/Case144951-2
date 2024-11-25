import React, { createContext, useContext, ReactNode } from 'react';
import { GetAccountConfigDocument } from '@cvent/planner-event-hubs-model/operations';
import { AccountConfigInternationalSettings } from '@cvent/planner-event-hubs-model/types';
import { useClientLoadingQuery } from './useClientLoadingQuery';

const ERROR_MESSAGE = 'useDefaultLanguageSetting must be used within a DefaultLanguageProvider';

export const DefaultLanguageContext = createContext({});

export const useDefaultLanguageSetting = (): AccountConfigInternationalSettings => {
  const context = useContext(DefaultLanguageContext);

  if (!context) {
    throw new Error(`${ERROR_MESSAGE}`);
  }
  return context;
};

interface Props {
  children: ReactNode;
}

export function DefaultLanguageProvider({ children }: Props): JSX.Element {
  const { data: defaultLanguageData } = useClientLoadingQuery(GetAccountConfigDocument, null);

  return (
    <DefaultLanguageContext.Provider value={defaultLanguageData?.accountConfig?.InternationalSettings}>
      {children}
    </DefaultLanguageContext.Provider>
  );
}

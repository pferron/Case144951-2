import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import { MemberListData } from '@cvent/planner-event-hubs-model/types';

const ERROR_MESSAGE = 'useMembersData must be used within a MembersDataProvider';
export const MembersDataContext = createContext<MembersDataContextProps>(null);

export const useMembersData = (): MembersDataContextProps => {
  const context = useContext(MembersDataContext);
  if (!context) {
    throw new Error(`${ERROR_MESSAGE}`);
  }
  return context;
};

interface Props {
  children: ReactNode;
}

export function MembersDataProvider({ children }: Props): JSX.Element {
  const [membersListData, setMembersListData] = useState<Array<MemberListData>>([]);
  // Wrap the value in useMemo to memoize it
  const contextValue = useMemo(() => ({ membersListData, setMembersListData }), [membersListData, setMembersListData]);
  return <MembersDataContext.Provider value={contextValue}>{children}</MembersDataContext.Provider>;
}

export interface MembersDataContextProps {
  membersListData: Array<MemberListData>;
  setMembersListData: React.Dispatch<React.SetStateAction<Array<MemberListData>>>;
}

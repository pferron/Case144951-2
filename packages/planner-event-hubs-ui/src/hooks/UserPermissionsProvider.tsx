import React, { createContext, useContext, useState, ReactNode } from 'react';
import { UserPermissions } from '@cvent/planner-event-hubs-model/types';

export const UserPermissionsContext = createContext({});

export const useUserPermissions = (): UserPermissions => useContext(UserPermissionsContext);

interface Props {
  children: ReactNode;
  value: UserPermissions;
}

export function UserPermissionsProvider({ children, value }: Props): JSX.Element {
  const [userPerm] = useState<UserPermissions | undefined>(value);
  return <UserPermissionsContext.Provider value={userPerm}>{children}</UserPermissionsContext.Provider>;
}

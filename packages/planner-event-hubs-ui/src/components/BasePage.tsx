import React, { useState } from 'react';
import { TemplatePanel as Panel } from '@cvent/carina/components/Templates/TemplatePanel';
import { Body } from '@cvent/carina/components/Templates/Body';
import { Main } from '@cvent/carina/components/Templates/Main';
import { ContentArea } from '@cvent/carina/components/Templates/ContentArea';
import { Page as TemplatePage } from '@cvent/carina/components/Templates/Page';
import { Header } from '@cvent/carina/components/Templates/Header';
import { useNavigation } from '@cvent/carina/components/Navigation/NavigationProvider';
import Footer from '@components/layout/Footer';
import { useUserPermissions } from '@hooks/UserPermissionsProvider';
import NoPermissionEmptyPage from '@components/videoCenters/NoPermissionEmptyPage';
import { TopNavigation } from './TopNavigation';
import { SideNavigation } from './SideNavigation';

export function BasePage({
  children,
  overrideSideNavSelection,
  zIndex = 10,
  testID,
  displayHeader = true,
  showSideNav = true,
  showFooter = true
}: Props): JSX.Element {
  const [isLocalNavOpen, setLocalNavOpen] = useState(true);
  const { localNav } = useNavigation();
  const userPermission = useUserPermissions();

  return (
    <TemplatePage testID={testID}>
      <Main as="div">
        {displayHeader && (
          <Header>
            <div css={{ position: 'relative', zIndex }}>
              <TopNavigation
                hasLocalNav={localNav?.length > 0}
                toggleNav={(): void => setLocalNavOpen(curr => !curr)}
                isLocalNavOpen={isLocalNavOpen}
              />
            </div>
          </Header>
        )}
        <Body>
          {localNav?.length > 0 && isLocalNavOpen && showSideNav && (
            <Panel>
              <SideNavigation isOpen={isLocalNavOpen} overrideSideNavSelection={overrideSideNavSelection} />
            </Panel>
          )}
          <ContentArea>
            <div
              css={{
                flexGrow: 1,
                overflowY: 'auto'
              }}
            >
              <div css={{ height: '100%' }}>
                {userPermission?.VideoCenter && userPermission?.VideoLibrary ? children : <NoPermissionEmptyPage />}
              </div>
            </div>
            {showFooter && <Footer />}
          </ContentArea>
        </Body>
      </Main>
    </TemplatePage>
  );
}

interface Props {
  children: JSX.Element;
  overrideSideNavSelection?: string;
  zIndex?: number;
  testID?: string;
  displayHeader?: boolean;
  showSideNav?: boolean;
  showFooter?: boolean;
}

import React from 'react';
import { useNavigation } from '@cvent/carina/components/Navigation/NavigationProvider';
import { SideNavigationMenu } from '@cvent/carina/components/Navigation/SideNavigationMenu';
import { SideNavigationLink } from '@cvent/carina/components/Navigation/SideNavigationLink';
import { SideNavigation as SideNav } from '@cvent/carina/components/Navigation/SideNavigation';
import { useRouter } from 'next/router';
import { TextLink } from '@cvent/carina/components/TextLink';

export function SideNavigation({ isOpen, overrideSideNavSelection }: Props): JSX.Element | null {
  const { localNav } = useNavigation();
  const router = useRouter();

  return (
    <SideNav isOpen={isOpen}>
      {localNav[0].items.map(topLevelNavItem => {
        if (topLevelNavItem.items.length <= 0) {
          return (
            <SideNavigationLink
              key={`${topLevelNavItem.title}`}
              isCurrent={
                overrideSideNavSelection
                  ? topLevelNavItem.url.href === overrideSideNavSelection
                  : topLevelNavItem.url.href === router.asPath
              }
            >
              {/* TODO: revert with https://jira.cvent.com/browse/HUB-109149 */}
              <TextLink href={topLevelNavItem.url?.href} style={{ textDecoration: 'none' }}>
                {topLevelNavItem.title}
              </TextLink>
            </SideNavigationLink>
          );
        }
        return (
          <SideNavigationMenu
            title={topLevelNavItem.title}
            key={`${topLevelNavItem.title}`}
            isOpen={router?.asPath.includes(topLevelNavItem?.url?.href)}
          >
            {topLevelNavItem.items?.map(subItem => (
              <SideNavigationLink
                key={`${subItem.title}`}
                isCurrent={
                  overrideSideNavSelection
                    ? subItem.url.href === overrideSideNavSelection
                    : subItem.url.href === router.asPath
                }
                isDisabled={subItem.disabled || false}
                disabledText="This feature has not been enabled for this event. You can manage your event features in the configuration area."
              >
                <TextLink href={subItem.url?.href} style={{ textDecoration: 'none' }}>
                  {subItem.title}
                </TextLink>
              </SideNavigationLink>
            ))}
          </SideNavigationMenu>
        );
      })}
    </SideNav>
  );
}

interface Props {
  isOpen: boolean;
  overrideSideNavSelection?: string;
}

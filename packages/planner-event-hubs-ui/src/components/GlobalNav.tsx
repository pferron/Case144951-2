import { GlobalNavigationMenu as GlobalNavMenu } from '@cvent/carina/components/Navigation/GlobalNavigationMenu';
import { GlobalNavigationMenuItem as GlobalNavMenuItem } from '@cvent/carina/components/Navigation/GlobalNavigationMenuItem';
import { injectTestId } from '@cvent/nucleus-test-automation';
import { useStyle } from '@hooks/useStyle';
import { useState } from 'react';
import { CarinaNavItem } from '@cvent/planner-navigation/types';
import { GlobalNavLink } from './GlobalNavLink';
import { useNavStyles } from './style';

type Props = {
  globalNav: Array<CarinaNavItem>;
};
export function GlobalNav({ globalNav }: Props): JSX.Element {
  const navStyles = useStyle(useNavStyles);
  // Global Nav menu set up
  const [isGlobalNavOpen, setIsGlobalNavOpen] = useState({});
  return (
    <ul role="menu" css={navStyles.globalNav.menu}>
      {globalNav.map(item => {
        if (item?.url?.href) {
          return (
            <GlobalNavLink testID={`global-nav-item-${item.title}`} key={item.title}>
              <a {...injectTestId(`nav-link-${item.title}`)} href={item?.url?.href}>
                {item.title}
              </a>
            </GlobalNavLink>
          );
        }
        return (
          <GlobalNavMenu
            key={item.title}
            onMouseOver={(): void => {
              setIsGlobalNavOpen(existing => ({
                ...existing,
                [item.title]: true
              }));
            }}
            onMouseLeave={(): void =>
              setIsGlobalNavOpen(existing => ({
                ...existing,
                [item.title]: false
              }))
            }
            onFocus={(): void =>
              setIsGlobalNavOpen(existing => ({
                ...existing,
                [item.title]: true
              }))
            }
            isOpen={isGlobalNavOpen[item.title]}
            trigger={
              <GlobalNavLink testID={`global-nav-item-${item.title}-trigger`} hasDropdown>
                <div css={navStyles.globalNav.linkTrigger}>{item.title}</div>
              </GlobalNavLink>
            }
          >
            {item?.items?.map((i, idx) => (
              <GlobalNavMenuItem testID={`global-nav-item-${item.title}-item-${idx}`} key={i.title}>
                <a
                  href={i?.url?.href}
                  {...injectTestId(`nav-link-${i.title}`)}
                  onBlur={
                    idx + 1 >= item.items.length
                      ? (): void => {
                          setIsGlobalNavOpen(existing => ({
                            ...existing,
                            [item.title]: false
                          }));
                        }
                      : null
                  }
                >
                  {i.title}
                </a>
              </GlobalNavMenuItem>
            ))}
          </GlobalNavMenu>
        );
      })}
    </ul>
  );
}

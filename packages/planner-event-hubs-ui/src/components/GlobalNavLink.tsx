import { injectTestId } from '@cvent/nucleus-test-automation';
import ChevronDownIcon from '@cvent/carina/components/Icon/ChevronDown';
import { useStyle } from '@hooks/useStyle';
import { useNavStyles } from './style';

export type GlobalNavLinkProps = {
  hasDropdown?: boolean;
  testID?: string;
};

export function GlobalNavLink({
  testID,
  children,
  hasDropdown
}: React.PropsWithChildren<GlobalNavLinkProps>): JSX.Element {
  const navStyles = useStyle(useNavStyles);
  const Element = hasDropdown ? 'div' : 'li';

  /* eslint-disable jsx-a11y/no-noninteractive-tabindex */
  return (
    <Element
      css={navStyles.globalNav.navLinkStyles}
      {...injectTestId(testID)}
      role={hasDropdown ? undefined : 'menuitem'}
    >
      {hasDropdown ? (
        <div tabIndex={0}>
          {children}
          <ChevronDownIcon size="m" />
        </div>
      ) : (
        children
      )}
    </Element>
  );
}

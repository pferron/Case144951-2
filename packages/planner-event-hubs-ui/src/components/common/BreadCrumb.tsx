import React, { useMemo } from 'react';
import { Breadcrumb as Crumb } from '@cvent/carina/components/Breadcrumbs/Breadcrumb/Breadcrumb';
import Link from 'next/link';
import { Theme } from '@cvent/carina/components/ThemeProvider';
import { CSSObject } from '@emotion/react/dist/emotion-react.cjs';
import { useStyle } from '@hooks/useStyle';

const BreadCrumbStyles = (theme: Theme): Record<string, CSSObject> =>
  useMemo(
    () => ({
      breadcrumbStyle: {
        'a, a:link, a:visited': {
          color: theme.font.color.interactive.base,
          textDecorationLine: 'none'
        },
        'a:hover': {
          color: theme.font.color.interactive.hover,
          textDecorationLine: 'underline'
        }
      }
    }),

    [theme]
  );

interface BreadcrumbProps {
  url: string;
  children: string;
}

/**
 * This Bread Crumb renders carina breadcrumb with next link
 * @param url
 * @param children
 * @constructor
 */
export function BreadCrumb({ url, children }: BreadcrumbProps): JSX.Element {
  const { breadcrumbStyle } = useStyle(BreadCrumbStyles);

  return (
    <Crumb>
      <div css={breadcrumbStyle}>
        <Link href={url}>
          <a href={url}>{children}</a>
        </Link>
      </div>
    </Crumb>
  );
}

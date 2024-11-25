import React, { ReactNode, CSSProperties } from 'react';
import { CSSObject } from '@emotion/react';
import { useBuildStyleWithTheme } from '@cvent/carina/components/ThemeProvider';

export interface IStoryBlockProps {
  children: ReactNode;
  /** Inline overrides, for the container div */
  style?: CSSProperties;
  /** Whether to align vertically (vertical by default) */
  stack?: boolean;
  /** Render a `<style>` block to simulate an unfriendly environment */
  hostile?: boolean;
}

interface IStoryBlockStyles {
  container: CSSObject;
}

function buildStyle({ backgroundColor }): IStoryBlockStyles {
  return {
    container: {
      padding: '0.5rem',
      display: 'flex',
      flex: '1 1 auto',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: backgroundColor.base
    }
  } as IStoryBlockStyles;
}

function useStyle(): IStoryBlockStyles {
  const { container } = useBuildStyleWithTheme(buildStyle);
  return {
    container
  } as IStoryBlockStyles;
}

function getHostileStyles(): string {
  return `<style>
/* Hostile Sink Page styles */

html,
body {
  /* Reset margin and padding */
  margin: 0;
  padding: 0;

  /* Hostile inherited styles*/
  color: darkorange;
  font-family: Georgia;
  font-style: italic;
  font-weight: bold;
  letter-spacing: 0.5em;
  line-height: 3.2;
  text-align: center;
  text-indent: 103px;
  text-transform: uppercase;
  text-shadow: 0 2px 1px red;
  vertical-align: middle;
}

h1,
h2,
h3,
h4,
h5,
h6,
p,
input,
button,
select,
optgroup,
textarea {
  margin-bottom: 21px;
  margin-top: 11px;
}

ul,
ol {
  list-style: lower-greek;
  margin-bottom: 64px;
  padding: 18px;
}

table {
  border-collapse: separate;
  border-spacing: 12px 23px;
}

</style>`;
}

function HostileStyleBlock(): JSX.Element {
  /* eslint-disable react/no-danger */
  return <div dangerouslySetInnerHTML={{ __html: getHostileStyles() }} />;
}

export default function StoryBlock({ children, style, stack = true, hostile }: IStoryBlockProps): JSX.Element {
  const { container } = useStyle();
  const containerStyles = {
    ...container,
    ...(stack ? { flexDirection: 'column' } : {}),
    ...style
  } as CSSObject;
  return (
    <div css={containerStyles}>
      {hostile ? <HostileStyleBlock /> : null}
      {children}
    </div>
  );
}

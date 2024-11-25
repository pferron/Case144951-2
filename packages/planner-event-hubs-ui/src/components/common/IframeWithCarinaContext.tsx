import { ThemeProvider } from '@cvent/carina/components/ThemeProvider';
import { getDefaultTheme } from '@cvent/carina/utils/tokens';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import weakMemoize from '@emotion/weak-memoize';
import Frame, { FrameContextConsumer } from 'react-frame-component';
import { injectTestId } from '@cvent/nucleus-test-automation';

const containerCache = weakMemoize((container: Node) => createCache({ key: 'carina', container }));

function FrameProvider({ children }: { children: JSX.Element }) {
  return (
    <FrameContextConsumer>
      {({ document }) => {
        // Reset css
        const iframeStyles = document.createElement('style');
        iframeStyles.textContent = `body { margin:0; }`;
        document.head.appendChild(iframeStyles);

        return <CacheProvider value={containerCache(document.head)}>{children}</CacheProvider>;
      }}
    </FrameContextConsumer>
  );
}

interface IframeWithCarinaContextProps {
  title: string;
  testId: string;
  code: JSX.Element;
  width?: string;
  height?: string;
}

// https://carina.docs.cvent.org/docs/recipes/iframes
function IframeWithCarinaContext({
  title = 'iframe',
  testId = 'iframe',
  code,
  width = '80vw',
  height = '80vh'
}: IframeWithCarinaContextProps) {
  return (
    <Frame title={title} {...injectTestId(testId)} aria-label={title} style={{ width, height, border: 'none' }}>
      <FrameProvider>
        <ThemeProvider theme={getDefaultTheme()}>{code}</ThemeProvider>
      </FrameProvider>
    </Frame>
  );
}

export default IframeWithCarinaContext;

import React, { useEffect, useRef } from 'react';
import { injectTestId } from '@cvent/nucleus-test-automation';

interface ShadowDOMComponentProps {
  id: string;
  customHtml: string;
  customCss: string;
  customJs: string;
  shadowMode?: 'open' | 'closed';
}

const scriptToStopOpeningLinksInIframe = `
  document.querySelector('#custom-header').shadowRoot.addEventListener('click', event => {
    event.preventDefault();
  });
`;

function ShadowDOMComponent({ id, customHtml, customCss, customJs, shadowMode = 'open' }: ShadowDOMComponentProps) {
  const shadowRootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const shadowRoot = shadowRootRef.current?.attachShadow({ mode: shadowMode }) ?? null;
    if (shadowRoot) {
      const style = document.createElement('style');
      style.textContent = customCss;
      shadowRoot.appendChild(style);

      const parser = new DOMParser();
      const parsedHTML = parser.parseFromString(customHtml, 'text/html');
      shadowRoot.appendChild(parsedHTML.body);

      const script = document.createElement('script');
      script.textContent = customJs;
      shadowRoot.appendChild(script);

      const script2 = document.createElement('script');
      script2.textContent = scriptToStopOpeningLinksInIframe;
      shadowRoot.appendChild(script2);
    }
  }, [customHtml, customCss, shadowMode, customJs]);

  return <div {...injectTestId(id)} id={id} ref={shadowRootRef} />;
}

export default ShadowDOMComponent;

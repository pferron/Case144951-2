import React from 'react';
import IframeWithCarinaContext from '@components/common/IframeWithCarinaContext';
import { render } from '@testing-library/react';

function querySelectorIframe(container) {
  return container.querySelector('iframe');
}

describe('Iframe with carina context', () => {
  it('renders the iframe with correct title and dimensions', () => {
    const code = <h1>Hello from the iframe!</h1>;
    const { container } = render(<IframeWithCarinaContext code={code} title="My Iframe" testId="my-iframe" />);

    const iframe = querySelectorIframe(container) as HTMLIFrameElement;
    expect(iframe).toHaveAttribute('title', 'My Iframe');
    expect(iframe).toHaveStyle(`width: 80vw; height: 80vh;`);
  });
});

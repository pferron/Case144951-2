import React from 'react';
import { injectTestId } from '@cvent/nucleus-test-automation';

/* eslint-disable func-names */
export default function (): JSX.Element {
  return (
    <svg
      width="190"
      height="80"
      viewBox="0 0 190 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...injectTestId('full-image-banner-template-image')}
    >
      <g clipPath="url(#clip0_702_196737)">
        <rect y="0.550781" width="190" height="79" rx="4" fill="#69717A" />
        <rect x="18" y="16.5508" width="106.271" height="6.17856" rx="3.08928" fill="white" />
        <rect x="18" y="30.4658" width="82" height="2" rx="1" fill="white" />
        <rect x="18" y="36.4658" width="82" height="2" rx="1" fill="white" />
        <rect x="18" y="42.4658" width="43" height="2" rx="1" fill="white" />
        <rect x="18" y="52.4658" width="35" height="11" rx="5.5" fill="white" />
      </g>
      <defs>
        <clipPath id="clip0_702_196737">
          <rect width="190" height="79" fill="white" transform="translate(0 0.550781)" />
        </clipPath>
      </defs>
    </svg>
  );
}

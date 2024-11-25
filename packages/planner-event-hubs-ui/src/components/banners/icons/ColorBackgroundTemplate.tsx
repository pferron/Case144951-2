import React from 'react';
import { injectTestId } from '@cvent/nucleus-test-automation';

/* eslint-disable func-names */
export default function (): JSX.Element {
  return (
    <svg
      width="190"
      height="79"
      viewBox="0 0 190 79"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...injectTestId('text-color-background-banner-template-image')}
    >
      <rect width="190" height="79" rx="4" fill="#EEEFF0" />
      <rect x="18" y="16" width="106.271" height="6.17856" rx="3.08928" fill="#9A9FA6" />
      <rect x="18" y="29.915" width="82" height="2" rx="1" fill="#A6ABB1" />
      <rect x="18" y="35.915" width="82" height="2" rx="1" fill="#A6ABB1" />
      <rect x="18" y="41.915" width="43" height="2" rx="1" fill="#A6ABB1" />
      <rect x="18" y="51.915" width="35" height="11" rx="5.5" fill="#A6ABB1" />
    </svg>
  );
}

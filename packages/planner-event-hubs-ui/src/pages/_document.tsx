import React from 'react';
import Document, { Html, Main, NextScript, Head } from 'next/document';
import { defaultLocale } from '../../locales';

export const determineLocale = (NEXT_DATA): string => NEXT_DATA?.props?.pageProps?.locale || defaultLocale;

class CustomDocument extends Document {
  public render(): JSX.Element {
    const locale = determineLocale(this.props.__NEXT_DATA__);
    /*
    In case of error pages, set the runtimeConfig to an empty object in order to prevent exposer of config data.
    */
    const errorPage = ['/404', '/500', '/_error'];
    if (errorPage.includes(this.props.__NEXT_DATA__?.page)) {
      this.props.__NEXT_DATA__.runtimeConfig = {};
    }
    return (
      <Html lang={locale}>
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default CustomDocument;

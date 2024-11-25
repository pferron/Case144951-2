import { determineLocale } from '../../src/pages/_document';
import { defaultLocale } from '../../locales';

describe('<CustomDocument>', () => {
  it('determines the locale correctly', () => {
    const mockNextData1 = { props: { pageProps: { locale: 'en-US' } } };
    const mockNextData2 = { props: { pageProps: {} } };
    const mockNextData3 = {};
    expect(determineLocale(mockNextData1)).toBe('en-US');
    expect(determineLocale(mockNextData2)).toBe(defaultLocale);
    expect(determineLocale(mockNextData3)).toBe(defaultLocale);
  });
});

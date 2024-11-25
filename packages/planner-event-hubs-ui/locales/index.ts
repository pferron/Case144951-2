export const defaultLocale = 'en-US';

export interface LocaleEntry {
  default?: Record<string, string>;
}

const defaultLocaleImport = import('./en-US.json');
const defaultLocaleImportImageEditor = import('@cvent/image-editor/resources/locales/en-US.json');

export const resolveLocales =
  (...localeImports: Array<Promise<LocaleEntry>>) =>
  async (): Promise<LocaleEntry> => {
    const resolvedImports = await Promise.all([defaultLocaleImport, ...localeImports]);
    return resolvedImports.reduce(
      (acc, value) => ({
        ...acc,
        ...value,
        default: {
          ...acc.default,
          ...value.default
        }
      }),
      {}
    );
  };

const locales = {
  'en-US': resolveLocales(defaultLocaleImport, defaultLocaleImportImageEditor),
  'de-DE': resolveLocales(import('./de-DE.json'), import('@cvent/image-editor/resources/locales/de-DE.json')),
  'es-ES': resolveLocales(import('./es-ES.json'), import('@cvent/image-editor/resources/locales/es-ES.json')),
  'fi-FI': resolveLocales(import('./fi-FI.json'), import('@cvent/image-editor/resources/locales/fi-FI.json')),
  'fr-CA': resolveLocales(import('./fr-CA.json'), import('@cvent/image-editor/resources/locales/fr-CA.json')),
  'fr-FR': resolveLocales(import('./fr-FR.json'), import('@cvent/image-editor/resources/locales/fr-FR.json')),
  'it-IT': resolveLocales(import('./it-IT.json'), import('@cvent/image-editor/resources/locales/it-IT.json')),
  'ja-JP': resolveLocales(import('./ja-JP.json'), import('@cvent/image-editor/resources/locales/ja-JP.json')),
  'ko-KR': resolveLocales(import('./ko-KR.json'), import('@cvent/image-editor/resources/locales/ko-KR.json')),
  'nl-NL': resolveLocales(import('./nl-NL.json'), import('@cvent/image-editor/resources/locales/nl-NL.json')),
  'pt-BR': resolveLocales(import('./pt-BR.json'), import('@cvent/image-editor/resources/locales/pt-BR.json')),
  'pt-PT': resolveLocales(import('./pt-PT.json'), import('@cvent/image-editor/resources/locales/pt-PT.json')),
  'ru-RU': resolveLocales(import('./ru-RU.json'), import('@cvent/image-editor/resources/locales/ru-RU.json')),
  'sv-SE': resolveLocales(import('./sv-SE.json'), import('@cvent/image-editor/resources/locales/sv-SE.json')),
  'th-TH': resolveLocales(import('./th-TH.json'), import('@cvent/image-editor/resources/locales/th-TH.json')),
  'tr-TR': resolveLocales(import('./tr-TR.json'), import('@cvent/image-editor/resources/locales/tr-TR.json')),
  'zh-Hans': resolveLocales(import('./zh-Hans.json'), import('@cvent/image-editor/resources/locales/zh-Hans.json')),
  'zh-Hant': resolveLocales(import('./zh-Hant.json'), import('@cvent/image-editor/resources/locales/zh-Hant.json'))
};

export const switchChineseLocale = (locale: string): string => {
  // Intl.DateTimeFormat does not work with zh-cht nor zh-chs
  switch (locale.toLowerCase()) {
    case 'zh-cht':
      return 'zh-Hant';
    case 'zh-chs':
    case 'zh-cn':
      return 'zh-Hans';
    default:
      return locale;
  }
};

export default locales;

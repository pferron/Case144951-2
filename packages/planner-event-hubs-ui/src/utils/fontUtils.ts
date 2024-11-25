import { isEmpty } from 'lodash';

export interface AccountCustomFont {
  id: string;
  fontFamily: string;
  fallbackFontId: number;
  fallbackFont: string;
  files: Array<FontFile>;
  isActive: boolean;
}

interface FontFile {
  url: string;
  fontStyle: string;
  fontWeight: number;
}

export interface CustomFont {
  fallbackFont?: string;
  name: string;
  styles: Array<CustomFontStyle>;
}

interface CustomFontStyle {
  style: CustomFontStyleFormat;
  url: string;
  weight: number;
}

export enum CustomFontStyleFormat {
  Italic = 'italic',
  Normal = 'normal'
}
export const convertFont = (customFont: AccountCustomFont): CustomFont => {
  if (!isEmpty(customFont)) {
    return {
      name: customFont?.fontFamily,
      fallbackFont: customFont?.fallbackFont,
      styles: customFont?.files?.map(file => ({
        url: file.url,
        weight: file.fontWeight,
        style: getCustomFontStyleFormat(file.fontStyle)
      }))
    };
  }
  return null;
};

const getCustomFontStyleFormat = (style: string): CustomFontStyleFormat => {
  switch (style) {
    case 'italic':
      return CustomFontStyleFormat.Italic;
    case 'normal':
    default:
      return CustomFontStyleFormat.Normal;
  }
};

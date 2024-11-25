import { convertFont, CustomFontStyleFormat } from '@utils/fontUtils';

describe('convert Font util test', () => {
  const customFont = {
    id: 'eabe1e7e-fd73-4b68-bf49-b6423f5d69da',
    fontFamily: 'Fireball',
    fallbackFontId: 4,
    fallbackFont: 'Arial',
    files: [
      {
        url: 'https://custom.t2.cvent.com/D3F4F6FF65B64E99A58CEF1D8F73A6E9/files/67ccc3a44045461ba2cbd1df6d7e7c5a.woff',
        fontStyle: 'normal',
        fontWeight: 900
      },
      {
        url: 'https://custom.t2.cvent.com/D3F4F6FF65B64E99A58CEF1D8F73A6E9/files/67ccc3a44045461ba2cbd1df6d7e7c5a.woff',
        fontStyle: 'italic',
        fontWeight: 900
      }
    ],
    isActive: true
  };
  it('returns empty object when passed null', () => {
    expect(convertFont(null)).toStrictEqual(null);
  });

  it('returns empty object when passed undefined', () => {
    expect(convertFont(undefined)).toStrictEqual(null);
  });
  it('returns font object when custom font is passed', () => {
    const expectedFontOutput = {
      name: customFont.fontFamily,
      fallbackFont: customFont.fallbackFont,
      styles: [
        {
          url: 'https://custom.t2.cvent.com/D3F4F6FF65B64E99A58CEF1D8F73A6E9/files/67ccc3a44045461ba2cbd1df6d7e7c5a.woff',
          style: CustomFontStyleFormat.Normal,
          weight: 900
        },
        {
          url: 'https://custom.t2.cvent.com/D3F4F6FF65B64E99A58CEF1D8F73A6E9/files/67ccc3a44045461ba2cbd1df6d7e7c5a.woff',
          style: CustomFontStyleFormat.Italic,
          weight: 900
        }
      ]
    };
    expect(convertFont(customFont)).toEqual(expectedFontOutput);
  });
});

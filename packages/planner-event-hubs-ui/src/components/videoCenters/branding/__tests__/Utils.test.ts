import { getCustomFonts } from '@components/videoCenters/branding/utils';

describe('Testing getCustomFonts', () => {
  it('should return an empty array when custom FontAndAccountInformation is null', async () => {
    const customFontAndAccountInformation = null;
    const result = getCustomFonts(customFontAndAccountInformation);
    expect(result).toBeUndefined();
  });

  it('should return undefined when allowCustomFonts is false', async () => {
    const customFontAndAccountInformation = {
      accountConfig: {
        AccountFeatures: {
          GeneralFeatures: {
            AllowCustomFonts: false
          }
        }
      },
      getAccountSnapshot: {
        customFonts: [
          { isActive: true, name: 'Font 1' },
          { isActive: true, name: 'Font 2' }
        ]
      }
    };

    const result = getCustomFonts(customFontAndAccountInformation);

    expect(result).toBeUndefined();
  });

  it('should return an empty array when there are no active custom fonts', async () => {
    const customFontAndAccountInformation = {
      accountConfig: {
        AccountFeatures: {
          GeneralFeatures: {
            AllowCustomFonts: true
          }
        }
      },
      getAccountSnapshot: {
        customFonts: [
          { isActive: false, name: 'Font 1' },
          { isActive: false, name: 'Font 2' }
        ]
      }
    };

    const result = getCustomFonts(customFontAndAccountInformation);

    expect(result).toEqual([]);
  });

  it('should return an array of active custom fonts when allowCustomFonts is true and there are active custom fonts', async () => {
    const customFontAndAccountInformation = {
      accountConfig: {
        AccountFeatures: {
          GeneralFeatures: {
            AllowCustomFonts: true
          }
        }
      },
      getAccountSnapshot: {
        customFonts: [
          { isActive: true, name: 'Font 1' },
          { isActive: false, name: 'Font 2' },
          { isActive: true, name: 'Font 3' }
        ]
      }
    };

    const result = getCustomFonts(customFontAndAccountInformation);

    expect(result).toEqual([
      { isActive: true, name: 'Font 1' },
      { isActive: true, name: 'Font 3' }
    ]);
  });
});

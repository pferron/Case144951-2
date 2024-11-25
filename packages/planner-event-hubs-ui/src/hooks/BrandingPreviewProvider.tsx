import React, { useContext, useMemo } from 'react';
import { DEFAULT_FONT_FAMILY } from '@utils/constants';
import { PreviewSize } from '@utils/types';

interface Props {
  headingsFontFamily?: string;
  bodyTextFontFamily?: string;
  previewSize?: PreviewSize;
  children: JSX.Element;
}

interface BrandingPreviewSettings {
  headingsFontFamily: string;
  bodyTextFontFamily: string;
  previewSize: PreviewSize;
}

const BrandingPreviewContext = React.createContext<BrandingPreviewSettings>({
  headingsFontFamily: '',
  bodyTextFontFamily: '',
  previewSize: PreviewSize.xl
});

function BrandingPreviewProvider({
  headingsFontFamily = '',
  bodyTextFontFamily = '',
  previewSize = undefined,
  children
}: Props): JSX.Element {
  return useMemo(
    () => (
      <BrandingPreviewContext.Provider
        value={{
          headingsFontFamily: [headingsFontFamily, DEFAULT_FONT_FAMILY].filter(e => e).join(','),
          bodyTextFontFamily: [bodyTextFontFamily, DEFAULT_FONT_FAMILY].filter(e => e).join(','),
          previewSize
        }}
      >
        {children}
      </BrandingPreviewContext.Provider>
    ),
    [bodyTextFontFamily, children, headingsFontFamily, previewSize]
  );
}

const useBrandingPreview = (): BrandingPreviewSettings => {
  const { headingsFontFamily, bodyTextFontFamily, previewSize } = useContext(BrandingPreviewContext);
  return {
    headingsFontFamily,
    bodyTextFontFamily,
    previewSize
  };
};

export { BrandingPreviewProvider, useBrandingPreview };

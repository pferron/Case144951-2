import { CSSObject } from '@emotion/react';
import { useMemo } from 'react';
import { Theme } from '@cvent/carina/components/ThemeProvider';
import useBreakpoints from '@hooks/useBreakpoints';

export const ImageUploadStyles = (
  theme: Theme,
  additionalParams: Record<string, string>
): Record<string, CSSObject> => {
  const { isXL } = useBreakpoints();
  const { font, backgroundColor } = theme;
  return useMemo(
    () => ({
      imagePlaceHolderStyles: {
        overflow: 'hidden',
        aspectRatio: additionalParams.imageAspectRatio,
        position: 'relative',
        backgroundColor: backgroundColor.hover
      },
      imageAvailableStyles: {
        overflow: 'hidden',
        aspectRatio: additionalParams.imageAspectRatio,
        position: 'relative'
      },
      imageStylesLogo: {
        position: 'absolute',
        top: 0,
        left: 0,
        objectFit: 'cover',
        height: '100%'
      },
      imageStyles: {
        position: 'absolute',
        top: 0,
        left: 0,
        objectFit: 'cover',
        width: '100%',
        height: '100%'
      },
      imageIconStyles: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%'
      },
      noImageText: {
        fontSize: font.base.size.m
      },
      imageMaxWidthStyles: {
        maxWidth: `${additionalParams.maxWidthImage}rem`
      },
      customFilenameWidthStyles: {
        maxWidth: `${additionalParams.fileNameWidth}%`
      },
      actionButtonStyles: {
        marginTop: '1rem',
        marginRight: '1rem'
      },
      deleteButtonStyles: {
        marginTop: '1rem'
      },
      supportFileTextStyles: {
        fontSize: '0.75rem',
        color: font.color.soft,
        lineHeight: '1.125rem',
        fontWeight: font.base.weight.regular,
        marginBottom: '0.125rem',
        marginTop: '1rem'
      },
      imageEditorStyle: {
        height: '100%',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      },
      RecommendedFileTextStyles: {
        fontSize: '0.75rem',
        color: font.color.soft,
        lineHeight: '1.125rem',
        fontWeight: font.base.weight.regular,
        marginTop: '0rem'
      },
      fileNameStyles: {
        marginTop: '1rem',
        marginBottom: '0rem',
        fontSize: '1rem',
        wordBreak: 'break-all'
      },
      alertStyle: {
        marginTop: '0.5rem',
        width: isXL ? '75%' : '100%'
      },
      imageLabelStyles: {
        display: 'flex',
        color: font.color.disabled,
        paddingBottom: '0.5rem'
      }
    }),
    [additionalParams.imageAspectRatio, additionalParams.maxWidthImage, backgroundColor.hover, font, isXL]
  );
};

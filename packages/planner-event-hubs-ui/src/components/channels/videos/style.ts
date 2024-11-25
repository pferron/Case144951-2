import { CSSObject } from '@emotion/react';
import { Theme } from '@cvent/carina/types/theme';
import { Theme as V1Theme } from '@cvent/carina/components/ThemeProvider';
import { useMemo } from 'react';
import useBreakpoints from '@hooks/useBreakpoints';

export const VideoListStyles = (theme: Theme): Record<string, CSSObject> => {
  const { backgroundColor, font } = theme;

  const imageSize = useMemo(() => {
    return { width: '5.3rem', height: '2.96rem' };
  }, []);

  return useMemo(() => {
    return {
      contentContainer: {
        padding: '1.5rem',
        margin: 0
      },
      tableContainer: {
        marginTop: 8
      },
      itemContainerStyle: {
        wordBreak: 'break-word',
        display: 'flex',
        alignItems: 'center',
        width: '100%'
      },
      itemThumbnailLink: {
        ...imageSize
      },
      itemThumbnail: {
        ...imageSize,
        objectFit: 'cover',
        borderRadius: '4px'
      },
      itemTextEditModeStyle: {
        marginLeft: '1rem',
        color: font.color.base
      },
      itemTextReadModeStyle: {
        marginLeft: '1rem',
        ':hover': {
          textDecoration: 'underline'
        },
        color: font.color.base
      },
      sectionTextStyle: {
        wordBreak: 'break-word',
        padding: '0.5rem 0',
        margin: 0
      },
      placeholderImage: {
        ...imageSize,
        backgroundColor: backgroundColor.active,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '4px'
      },
      placeholderFailedImage: {
        ...imageSize,
        backgroundColor: backgroundColor.danger.active,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '4px'
      },
      videoTileContainer: {
        wordBreak: 'break-word'
      },
      titleTextStyles: {
        fontSize: theme.font.base.size.m,
        paddingLeft: '0.5rem'
      },
      videoTitleTextStyles: {
        fontSize: theme.font.base.size.m,
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden'
      },
      menuText: {
        margin: 0,
        fontSize: font.base.size.m
      },
      titleStatusStyles: {
        fontSize: font.base.size['1'],
        color: font.color.soft
      },
      searchLabelStyles: {
        marginTop: 24,
        fontSize: font.base.size.m
      },
      videoTableEmptyStyles: {
        width: '100%',
        height: '100%',
        backgroundColor: backgroundColor.base
      }
    };
  }, [
    imageSize,
    font.color.base,
    font.color.soft,
    font.base.size,
    backgroundColor.active,
    backgroundColor.base,
    backgroundColor.danger.active,
    theme.font.base.size.m
  ]);
};

export const VideoLibraryListStyles = (theme: V1Theme): Record<string, CSSObject> => {
  const { backgroundColor, font } = theme;

  const imageSize = useMemo(() => {
    return { width: '5.3rem', height: '2.96rem' };
  }, []);

  return useMemo(() => {
    return {
      contentContainer: {
        padding: '1.5rem',
        margin: 0
      },
      tableContainer: {
        marginTop: 8
      },
      itemContainerStyle: {
        wordBreak: 'break-word',
        display: 'flex',
        alignItems: 'center',
        width: '100%'
      },
      itemThumbnailLink: {
        ...imageSize
      },
      itemThumbnail: {
        ...imageSize,
        objectFit: 'cover',
        borderRadius: '4px'
      },
      itemTextEditModeStyle: {
        marginLeft: '1rem',
        color: font.color.base
      },
      itemTextReadModeStyle: {
        marginLeft: '1rem',
        ':hover': {
          textDecoration: 'underline'
        },
        color: font.color.base
      },
      sectionTextStyle: {
        wordBreak: 'break-word',
        padding: '0.5rem 0',
        margin: 0
      },
      placeholderImage: {
        ...imageSize,
        backgroundColor: backgroundColor.active,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '4px'
      },
      placeholderFailedImage: {
        ...imageSize,
        backgroundColor: backgroundColor.danger.active,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '4px'
      },
      videoTileContainer: {
        wordBreak: 'break-word'
      },
      titleTextStyles: {
        fontSize: theme.font.base.size.m,
        paddingLeft: '0.5rem'
      },
      videoTitleTextStyles: {
        fontSize: theme.font.base.size.m,
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden'
      },
      menuText: {
        margin: 0,
        fontSize: font.base.size.m
      },
      titleStatusStyles: {
        fontSize: font.base.size['1'],
        color: font.color.soft
      },
      searchLabelStyles: {
        marginTop: 24,
        fontSize: font.base.size.m
      },
      videoTableEmptyStyles: {
        width: '100%',
        height: '100%',
        backgroundColor: backgroundColor.base
      }
    };
  }, [
    imageSize,
    font.color.base,
    font.color.soft,
    font.base.size,
    backgroundColor.active,
    backgroundColor.base,
    backgroundColor.danger.active,
    theme.font.base.size.m
  ]);
};

export const VideoStyles = (theme: Theme): Record<string, CSSObject> => {
  const { font } = theme;
  const { isMobileOrTablet, isMobile, isDefaultSize, isM } = useBreakpoints();
  return useMemo(() => {
    return {
      container: {
        backgroundColor: theme.backgroundColor.base,
        borderRadius: theme.size.border.radius.fiveX,
        offset: theme.depth.boxShadow.soft.xOffset,
        width: '100%',
        height: 'fit-content'
      },
      catalogContainer: {
        display: 'flex',
        flexDirection: isMobileOrTablet ? 'column-reverse' : 'row',
        height: 'fit-content',
        flexWrap: isMobileOrTablet ? 'wrap' : 'nowrap',
        justifyContent: 'flex-end'
      },
      previewContainer: {
        width: 'stretch',
        maxWidth: isMobileOrTablet ? '100%' : '45%',
        height: 'max-content',
        paddingLeft: isMobileOrTablet ? '0rem' : '1.5rem',
        paddingBottom: isMobileOrTablet ? '1.5rem' : '0rem'
      },
      textStyle: {
        marginTop: 0,
        color: theme.font.color.soft,
        fontSize: theme.font.base.size.m,
        lineHeight: theme.font.lineHeight.base,
        fontWeight: theme.font.base.weight.regular
      },
      sectionFlyoutText: {
        maxWidth: (isMobile && 'min-content') || (isM && '15rem') || '20rem',
        color: font.color.soft,
        lineHeight: font.lineHeight.base,
        fontWeight: font.base.weight.regular
      },
      editContentHeaderText: {
        width: isDefaultSize ? 'min-content' : 'max-content'
      },
      cardContainerStyleEditMode: {
        width: 'stretch',
        overflow: 'auto',
        paddingBottom: '2rem'
      },
      cardContainerStyleReadMode: {
        width: 'stretch',
        overflow: 'auto',
        height: 'fit-content',
        borderRadius: '0.5rem'
      },
      catalogButtonStyles: {
        display: 'flex',
        alignItems: 'center',
        padding: '0.5rem 0rem',
        flexWrap: 'wrap'
      }
    };
  }, [theme, isMobileOrTablet, isMobile, isM, isDefaultSize, font]);
};

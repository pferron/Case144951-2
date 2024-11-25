import { useMemo } from 'react';
import { CSSObject } from '@emotion/react';
import { Theme, useReadingDirections } from '@cvent/carina/components/ThemeProvider';
import { useBreakpoints } from '@cvent/carina/components/Breakpoints';
import { rgba } from '@cvent/carina/utils/styleUtils';

export const VIDEO_LIBRARY_PAGE_PADDING_LEFT_RIGHT = 24;

export const VideoLibraryPageStyle = (theme: Theme): Record<string, CSSObject> => {
  const { backgroundColor, font } = theme;
  return useMemo(
    () => ({
      container: {
        flexGrow: 1,
        overflowY: 'auto',
        height: '100%',
        backgroundColor: backgroundColor.neutral.focus,
        padding: `0 ${String(VIDEO_LIBRARY_PAGE_PADDING_LEFT_RIGHT)}px`
      },
      alertWrapperStyles: {
        marginTop: 25
      },
      belowAddButtonText: {
        maxWidth: '225px',
        textAlign: 'center',
        display: 'flex',
        margin: '0 auto',
        color: font.color.soft,
        fontSize: font.base.size['1'],
        flexDirection: 'column'
      },
      manageStorageButtonStyles: {
        minWidth: 'max-content',
        marginTop: '0.5rem',
        marginBottom: '0.375rem'
      },
      failedTableContainer: {
        width: 577,
        maxHeight: 200
      },
      failedCountLink: {
        marginLeft: 9,
        fontSize: font.base.size.m,
        fontWeight: font.mono.weight.regular,
        color: font.color.danger.base,
        textDecoration: 'underline'
      },
      failedCountLinkContainer: {
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
        marginTop: 25
      },
      failedCountLinkIcon: {
        width: 24,
        height: 24,
        display: 'inline-block',
        position: 'relative'
      },
      placeholderFailedImage: {
        width: '5.3rem',
        height: '2.96rem',
        backgroundColor: backgroundColor.danger.active,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '4px'
      },
      titleTextStyles: {
        fontSize: font.base.size.m,
        paddingLeft: '0.5rem',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden'
      },
      titleStatusStyles: {
        fontSize: font.base.size['1'],
        color: font.color.soft,
        paddingLeft: '0.5rem'
      },
      videoTileContainer: {
        wordBreak: 'break-word',
        cursor: 'pointer'
      }
    }),
    [backgroundColor, font]
  );
};

export const AddVideoPageStyle = (theme: Theme): Record<string, CSSObject> => {
  const { backgroundColor } = theme;
  return useMemo(
    () => ({
      container: {
        flexGrow: 1,
        overflowY: 'auto',
        height: '100%',
        backgroundColor: backgroundColor.neutral.focus,
        padding: '0px 30px 0px 30px'
      },
      alert: {
        marginTop: 20,
        marginBottom: 15
      },
      spinner: {
        position: 'absolute',
        zIndex: 1000,
        width: '100%',
        height: '100%'
      }
    }),
    [backgroundColor]
  );
};

export const VideoDetailsPageStyle = (): Record<string, CSSObject> => {
  return useMemo(
    () => ({
      alert: {
        marginTop: 20,
        marginBottom: 15,
        padding: '0px 30px 0px 30px'
      }
    }),
    []
  );
};

export const VideoAnalyticsPageStyle = (): Record<string, CSSObject> => {
  return useMemo(
    () => ({
      audienceRetentionCardStyles: {
        padding: '16px',
        paddingLeft: '32px',
        paddingRight: '26px',
        paddingTop: '24px',
        paddingBottom: '344.66px',
        width: '100%'
      },
      audienceRetentionContentStyles: {
        margin: '0px',
        marginBottom: '28px'
      },
      audienceRetentionVideoStyles: {
        display: 'flex',
        justifyContent: 'center'
      },
      audienceRetentionGraphStyles: {
        position: 'relative',
        right: '30px',
        paddingTop: 20
      }
    }),
    []
  );
};

export const EmptyRecentItemsStyles = ({ font }: Theme): Record<string, CSSObject> => {
  const { readingDirection } = useReadingDirections(false);
  return useMemo(
    () => ({
      wrapper: {
        ...readingDirection,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 42,
        '& svg': {
          width: '24px !important',
          height: '24px !important',
          '& g': {
            fill: `${font.color.soft} !important`
          }
        }
      },
      message: {
        marginTop: 8,
        fontFamily: font.base.family,
        fontWeight: font.base.weight.regular,
        fontSize: font.base.size.m,
        lineHeight: font.lineHeight.base,
        color: font.color.soft
      }
    }),
    [
      font.base.family,
      font.base.weight.regular,
      font.base.size.m,
      font.lineHeight.base,
      font.color.soft,
      readingDirection
    ]
  );
};

export const useNavStyles = ({ font, backgroundColor, depth }: Theme): Record<string, CSSObject> => {
  // RED
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  const readingDirection: any = useReadingDirections(false);
  const { isM } = useBreakpoints();
  return useMemo(
    () => ({
      globalNav: {
        linkTrigger: { paddingRight: '8' },
        menu: { display: 'flex', paddingLeft: 0, marginLeft: isM ? -24 : 0 },
        navLinkStyles: {
          cursor: 'pointer',
          fontFamily: font.base.family,
          ...readingDirection,
          textDecoration: 'none',
          height: 56,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: font.color.base,
          fontSize: font.base.size.m,
          fontWeight: font.base.weight.light,
          padding: '0px 24px',
          '&:hover': {
            backgroundColor: rgba(backgroundColor.selectList.hover, depth.opacity.light)
          },
          div: {
            ...readingDirection,
            width: '100%',
            paddingRight: '8px',
            whiteSpace: 'nowrap',
            textDecoration: 'none',
            fontFamily: font.base.family,
            color: font.color.base,
            fontSize: font.base.size.m,
            fontWeight: font.base.weight.light,
            height: 56,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          },
          a: {
            ...readingDirection,
            width: '100%',
            whiteSpace: 'nowrap',
            textDecoration: 'none',
            fontFamily: font.base.family,
            color: font.color.base,
            fontSize: font.base.size.m,
            fontWeight: font.base.weight.light,
            height: 56,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }
        },
        navDownIconColor: font.color.base
      }
    }),
    [
      backgroundColor.selectList.hover,
      depth.opacity.light,
      font.base.family,
      font.base.size.h4,
      font.base.size.m,
      font.base.weight.light,
      font.base.weight.regular,
      font.color.base,
      readingDirection,
      isM
    ]
  );
};

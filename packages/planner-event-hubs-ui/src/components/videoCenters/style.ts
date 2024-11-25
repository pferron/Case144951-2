import { useMemo } from 'react';
import useBreakpoints from '@hooks/useBreakpoints';
import { CSSObject } from '@emotion/react';
import { Theme } from '@cvent/carina/components/ThemeProvider';

export const VideoCenterPageStyle = (theme: Theme): Record<string, CSSObject> => {
  const { backgroundColor } = theme;
  return useMemo(
    () => ({
      container: {
        flexGrow: 1,
        overflowY: 'auto',
        height: '100%',
        backgroundColor: backgroundColor.neutral.focus
      }
    }),
    [backgroundColor]
  );
};

export const CreateModalStyles = (theme: Theme): Record<string, CSSObject> => {
  const { backgroundColor } = theme;
  const { isS } = useBreakpoints();

  return useMemo(
    () => ({
      container: {
        padding: isS ? 0 : '1.5rem',
        backgroundColor: backgroundColor.neutral.focus,
        height: '100%'
      },
      navHeader: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
      },
      videoCenterCard: {
        maxWidth: 918,
        margin: 'auto'
      },
      modalHeader: {
        padding: isS ? '0 1.75rem' : 0,
        'h2, p': {
          margin: '0.5rem 0'
        }
      },
      alertContainer: {
        paddingTop: '1rem'
      },
      formContainer: {
        padding: isS ? '2rem 1.75rem .75rem 1.75rem' : '2rem 2rem 1rem 2rem',
        backgroundColor: backgroundColor.neutral.base,
        height: '100%',
        margin: isS ? '2rem 0' : '2rem 0'
      }
    }),
    [backgroundColor, isS]
  );
};

export const VideoCenterListingStyles = (theme: Theme): Record<string, CSSObject> => {
  const { backgroundColor } = theme;
  return useMemo(
    () => ({
      container: {
        padding: 24,
        backgroundColor: backgroundColor.neutral.focus,
        height: '100%'
      },
      hubTitleLink: {
        textDecoration: 'none',
        color: theme.font.color.brand.base,
        '&: hover': {
          textDecoration: 'underline'
        }
      }
    }),
    [backgroundColor]
  );
};

export const InformationStyles = (theme: Theme): Record<string, CSSObject> => {
  const { isS } = useBreakpoints();

  return useMemo(
    () => ({
      container: {
        flexGrow: 1,
        overflowY: 'auto',
        height: '100%',
        backgroundColor: theme.backgroundColor.focus
      },
      url: {
        fontSize: theme.font.base.size.s,
        marginTop: '0.5rem',
        wordBreak: 'break-all'
      },
      urlLabel: {
        fontSize: theme.font.base.size.xs,
        color: theme.font.color.soft,
        marginTop: '1rem'
      },
      bodyContainer: {
        flexGrow: 1,
        overflowY: 'auto',
        minHeight: '100%',
        backgroundColor: theme.backgroundColor.neutral.focus,
        padding: isS ? '1.5rem 0' : '1.5rem '
      },
      alertContainer: {
        paddingBottom: '1.5rem'
      },
      messageText: {
        color: theme.font.color.soft,
        fontSize: theme.font.base.size.s
      }
    }),
    [theme, isS]
  );
};

export const ImageStyle = (theme: Theme): Record<string, CSSObject> => {
  const { isMobile } = useBreakpoints();

  return useMemo(
    () => ({
      imageAltText: {
        display: 'flex',
        padding: '1.5rem',
        fontSize: theme.font.base.size[2],
        color: theme.font.color.disabled
      },
      bannerImageAltText: {
        marginRight: 2,
        display: 'inline',
        fontSize: '1rem',
        color: theme.font.color.soft
      },
      sectionImageAltText: {
        marginRight: 2,
        display: 'inline',
        fontSize: theme.font.base.size.s,
        color: theme.font.color.soft
      },
      sectionImageHeader: {
        fontSize: theme.font.base.size.s,
        color: theme.font.color.soft,
        marginBottom: 16
      },
      formStyles: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
      },
      cancelButtonStyles: {
        marginRight: isMobile ? '0rem' : '1rem'
      },
      buttonStyles: {
        display: 'flex'
      },
      imageAltContainer: { display: 'flex', alignItems: 'center' }
    }),
    [theme, isMobile]
  );
};

export const BannerStyles = (theme: Theme): Record<string, CSSObject> => {
  const { isS, isM, isXL } = useBreakpoints();
  const modalWidth = (isS && '') || (isM && '35rem') || '60rem';
  return useMemo(
    () => ({
      container: {
        flexGrow: 1,
        overflowY: 'auto',
        height: '100%',
        backgroundColor: theme.backgroundColor.focus,
        width: isS || isM ? '100%' : ''
      },
      bannerFormContainer: {
        backgroundColor: theme.backgroundColor.focus
      },
      bannerContent: {
        width: isXL ? '56.25rem' : '100%',
        flexGrow: 1,
        overflowY: 'auto',
        minHeight: '100%',
        backgroundColor: theme.backgroundColor.neutral.focus,
        padding: isS ? '1.5rem 0' : '1.5rem '
      },
      pagesContent: {
        width: isXL ? '56.25rem' : '100%',
        flexGrow: 1,
        overflowY: 'auto',
        minHeight: '100%',
        backgroundColor: theme.backgroundColor.neutral.focus,
        padding: isS ? '1.5rem 0' : '0 1.5rem '
      },
      bannerCards: { maxWidth: '80%', margin: '0.25rem 0 0.5rem 0' },
      modalContent: {
        width: modalWidth,
        position: isS ? 'absolute' : 'fixed'
      },
      borderLine: {
        borderTop: `0.063rem solid ${theme.borderColor.soft}`,
        paddingBottom: '1.5rem'
      },
      sectionTextBanner: {
        margin: 0,
        color: theme.font.color.soft,
        paddingBottom: '1.5rem',
        fontSize: theme.font.base.size.m
      },
      bannerPreviewText: {
        fontSize: theme.font.base.size.h2
      },
      bannerPreviewDesc: {
        fontSize: theme.font.base.size[4],
        color: theme.font.color.soft,
        marginBottom: '0.5rem'
      }
    }),
    [isS, isM, isXL, theme, modalWidth]
  );
};

export const BannerPageModalStyles = (theme: Theme): Record<string, CSSObject> => {
  const { font } = theme;
  return useMemo(
    () => ({
      container: {
        padding: '1.5rem'
      },
      headerStyle: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
      },
      titleStyle: {
        color: font.color.base,
        marginLeft: 4
      },
      disabledText: {
        marginTop: 0,
        fontSize: font.base.size.s,
        color: font.color.disabled
      },
      pagesModal: {
        overflow: 'visible',
        '& > div:first-of-type': {
          overflow: 'visible'
        }
      }
    }),
    [font]
  );
};

export const BannerNameFormStyle = (theme: Theme): Record<string, CSSObject> => {
  return useMemo(
    () => ({
      bodyStyling: {
        color: theme.font.color.soft,
        marginTop: 0,
        alignSelf: 'start'
      },
      buttonDone: {
        marginLeft: 8
      }
    }),
    [theme]
  );
};

export const BannerTemplatesStyle = (theme: Theme): Record<string, CSSObject> => {
  const { isS, isM } = useBreakpoints();
  return useMemo(
    () => ({
      modalHeader: {
        padding: '1.5rem',
        display: 'flex'
      },
      modalHeaderTitle: {
        flex: 1,
        marginBottom: 0,
        alignSelf: 'center',
        fontSize: theme.font.base.size.h2,
        color: theme.font.color.base
      },
      modalContent: {
        display: isS || isM ? 'grid' : 'flex',
        justifyContent: 'center',
        gridGap: '1.5rem',
        gridTemplateColumns: 'repeat(auto-fit, minmax(20rem, auto));',
        padding: '0.3rem 1.5rem 1.5rem 1.5rem'
      }
    }),
    [theme, isS, isM]
  );
};

export const BannerTemplatesCardStyle = (theme: Theme): Record<string, CSSObject> => {
  const { isS } = useBreakpoints();
  return useMemo(
    () => ({
      template: {
        backgroundColor: theme.backgroundColor.base,
        boxShadow: `0rem 0.25rem 1rem -0.25rem ${theme.depth.boxShadow[1].color}`,
        borderRadius: theme.size.border.radius.fiveX,
        borderSize: theme.size.border.base,
        borderColor: theme.borderColor.soft,
        padding: 24,
        width: '100%',

        display: 'flex',
        flexDirection: 'column',
        maxWidth: '100%'
      },
      centeredContent: {
        margin: '0 auto'
      },
      titleStyling: {
        fontSize: theme.font.base.size[5]
      },
      bodyStyling: {
        color: theme.font.color.soft,
        marginTop: 0
      },
      buttonStyle: {
        width: isS ? '19rem' : ''
      }
    }),
    [theme, isS]
  );
};

export const BannerListStyle = (theme: Theme): Record<string, CSSObject> => {
  return useMemo(
    () => ({
      bannerList: {
        listStyleType: 'none',
        padding: 24,
        backgroundColor: theme.backgroundColor.base,
        '&>li': {
          padding: '21px 0px',
          borderTop: `1px solid ${theme.borderColor.soft}`,
          borderColor: theme.borderColor.soft,
          backgroundColor: theme.backgroundColor.base,
          fontSize: theme.font.base.size.m
        },
        '&>li:last-child': {
          borderBottom: `1px solid ${theme.borderColor.soft}`
        }
      },
      assignPages: {
        padding: '21px 0px',
        borderTop: `1px solid ${theme.borderColor.soft}`
      },
      bannerPagesList: {
        listStyleType: 'none',
        marginLeft: '-14px',
        backgroundColor: theme.backgroundColor.base,
        '&>li': {
          padding: '21px 0px',
          borderTop: `1px solid ${theme.borderColor.soft}`,
          borderColor: theme.borderColor.soft,
          backgroundColor: theme.backgroundColor.base,
          fontSize: theme.font.base.size.m
        },
        '&>li:last-child': {
          borderBottom: `1px solid ${theme.borderColor.soft}`
        }
      },
      listItemContent: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        wordBreak: 'break-all'
      }
    }),
    [theme]
  );
};

export const PagesSectionStyle = (theme: Theme): Record<string, CSSObject> => {
  return useMemo(
    () => ({
      description: {
        borderTop: `1px solid ${theme.borderColor.soft}`,
        borderColor: theme.borderColor.soft,
        display: 'flex',
        fontSize: theme.font.base.size.s,
        color: theme.font.color.soft,
        paddingTop: '1.5rem',
        justifyContent: 'center'
      },
      buttonAlign: {
        display: 'flex',
        textAlign: 'center',
        paddingTop: '1.5rem'
      }
    }),
    [theme]
  );
};

export const CommonFormStyles = (theme: Theme): Record<string, CSSObject> => {
  return useMemo(
    () => ({
      tabletWidth: {
        maxWidth: 590
      },
      sectionTitle: {
        marginTop: 0,
        maxWidth: '80%'
      },
      popOverStyles: {
        color: theme.font.color.soft,
        display: 'flex',
        gap: 8
      }
    }),
    []
  );
};

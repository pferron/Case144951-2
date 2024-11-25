import { CSSObject } from '@emotion/react';
import { useMemo } from 'react';
import { Theme } from '@cvent/carina/components/ThemeProvider';
import { ThemeWithBlockStack } from '@cvent/blocks/utils/types';
import useBreakpoints from '@hooks/useBreakpoints';
import { containerWidths } from '@cvent/multi-dimensional-profile/hub/view/ProfileCard';
import { PROFILE_MOBILE_WIDTH } from '@utils/constants';

export const MemberProfileStyle = (theme: Theme): Record<string, CSSObject> => {
  return useMemo(
    () => ({
      container: {
        flexGrow: 1,
        overflowY: 'auto',
        height: '100%',
        backgroundColor: theme.backgroundColor.focus
      }
    }),
    [theme]
  );
};

export const MemberProfileHeaderStyle = (theme: Theme): Record<string, CSSObject> => {
  const { font } = theme;
  return useMemo(
    () => ({
      headerContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
        height: '100%'
      },
      logoStyle: {
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginLeft: '1.5rem'
      },
      headerListStyle: {
        display: 'flex',
        alignItems: 'center',
        width: '24.625rem',
        transform: 'translate(-0.195rem, 0)',
        justifyContent: 'space-between'
      },
      headerItemStyle: {
        fontSize: font.base.size.m,
        borderBottom: '0.125rem solid',
        borderColor: 'transparent'
      },
      headerItemContainer: {
        display: 'flex',
        flexDirection: 'column',
        rowGap: '0.1875rem'
      },
      profileIconStyle: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginRight: '1.44rem',
        marginLeft: '7.5rem'
      },
      profileAvtarButtonStyle: {
        background: 'transparent',
        border: 0,
        padding: '0.25rem',
        cursor: 'pointer',
        paddingRight: '1.5rem'
      },
      avatarContainer: {
        width: '2rem',
        height: '2rem',
        borderRadius: '50%',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      },
      avatarImage: {
        width: '100%',
        height: '100%',
        objectFit: 'cover'
      },
      appSwitcherStyle: { display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: '1.0625rem' }
    }),
    [theme]
  );
};

export const MemberVisibilityFieldsStyle = (theme: Theme): Record<string, CSSObject> => {
  const { font } = theme;
  const { isMobile } = useBreakpoints();
  return useMemo(
    () => ({
      title: {
        fontWeight: font.base.weight.regular,
        fontSize: '1.5rem',
        margin: 0,
        padding: 0,
        maxWidth: isMobile ? '65%' : '80%',
        marginBottom: '1.5rem'
      },
      sectionContainer: {
        display: 'flex',
        flexDirection: 'column',
        rowGap: '1rem'
      },
      footerContainer: {
        display: 'flex',
        color: font.color.soft,
        marginTop: '1rem'
      }
    }),
    [isMobile, font]
  );
};

export const EditMemberVisibilityFieldsStyle = (theme: Theme): Record<string, CSSObject> => {
  const { font } = theme;
  const { isMobile } = useBreakpoints();
  return useMemo(
    () => ({
      title: {
        fontWeight: font.base.weight.regular,
        fontSize: '1.5rem',
        margin: 0,
        padding: 0,
        marginBottom: '1.5rem',
        maxWidth: isMobile ? '65%' : '80%'
      },
      footerContainer: {
        color: font.color.soft
      },
      optionsText: {
        color: font.color.soft,
        maxWidth: '25rem',
        marginTop: '0.3rem'
      }
    }),
    [isMobile, font]
  );
};

export const EditMemberProfileFieldsStyle = (theme: Theme): Record<string, CSSObject> => {
  const { font } = theme;
  const { isMobile } = useBreakpoints();
  return useMemo(
    () => ({
      title: {
        fontWeight: font.base.weight.regular,
        fontSize: '1.5rem',
        maxWidth: isMobile ? '65%' : '80%'
      }
    }),
    [isMobile, font]
  );
};

export const MemberProfileFieldsStyle = (theme: Theme): Record<string, CSSObject> => {
  const { font } = theme;
  const { isMobile } = useBreakpoints();
  return useMemo(
    () => ({
      title: {
        fontWeight: font.base.weight.regular,
        fontSize: '1.5rem',
        maxWidth: isMobile ? '65%' : '80%'
      },
      sectionContainer: {
        display: 'flex',
        flexDirection: 'column',
        rowGap: '1rem',
        marginTop: '0.5rem'
      }
    }),
    [isMobile, font]
  );
};

export const ProfileCardDesignStyle = (theme: Theme): Record<string, CSSObject> => {
  const { font } = theme;
  const { isMobile } = useBreakpoints();
  return useMemo(
    () => ({
      title: {
        fontWeight: font.base.weight.regular,
        fontSize: '1.5rem',
        margin: 0,
        padding: 0,
        maxWidth: isMobile ? '65%' : '80%',
        marginBottom: '1.5rem'
      },
      sectionContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }
    }),
    [isMobile, font]
  );
};

export const EditProfileCardDesignStyle = (theme: Theme): Record<string, CSSObject> => {
  const { font } = theme;
  const { isMobile } = useBreakpoints();
  return useMemo(
    () => ({
      title: {
        fontWeight: font.base.weight.regular,
        fontSize: '1.5rem',
        margin: 0,
        padding: 0,
        marginBottom: '1.5rem',
        maxWidth: isMobile ? '65%' : '80%'
      },
      sectionContainer: {
        display: 'flex',
        flexDirection: 'column',
        rowGap: '1.5rem',
        marginTop: '1.5rem'
      },
      sectionContainerNew: {
        display: 'inline-block',
        flexDirection: 'column',
        rowGap: '1.5rem',
        marginTop: '1.5rem',
        marginRight: '3rem'
      },
      footerContainer: {
        color: font.color.soft,
        marginTop: '2rem',
        marginLeft: '14rem',
        justifyContent: 'center'
      },
      cardStyles: {
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap'
      },
      optionsText: {
        color: font.color.soft,
        maxWidth: '25rem',
        marginTop: '0.3rem'
      }
    }),
    [isMobile, font]
  );
};

export const ProfileCardModalStyles = (theme: Theme): Record<string, CSSObject> => {
  const { isMobileOrTablet } = useBreakpoints();
  const { font } = theme;
  return useMemo(
    () => ({
      header: {
        fontSize: font.base.size.h2,
        color: font.color.base,
        wordWrap: 'break-word',
        padding: 0,
        margin: 0
      },
      headerContainer: {
        margin: '1.5rem',
        flexDirection: 'row',
        display: 'flex',
        justifyContent: 'space-between',
        button: {
          cursor: 'pointer'
        }
      },
      cardContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        paddingTop: isMobileOrTablet ? 0 : '2rem',
        paddingBottom: '2rem'
      }
    }),
    [font.base.size.h2, font.color.base, isMobileOrTablet]
  );
};

export const ProfileStyles = (theme: ThemeWithBlockStack): Record<string, CSSObject> => {
  const { widthWindow, isXL, isS } = useBreakpoints();
  const { font, borderColor, colors } = theme;
  const {
    xlWidth: profileCardXL,
    medAndLargeWidth: profileCardMedAndLarge,
    smallWidth: profileCardSmallWidth
  } = containerWidths;
  let cardWidth: number = profileCardMedAndLarge;
  const isMobile = widthWindow <= PROFILE_MOBILE_WIDTH;
  if (isXL) cardWidth = profileCardXL;
  else if (isS) cardWidth = profileCardSmallWidth;

  return useMemo(() => {
    const sharedMarginTop = isMobile ? '5rem' : null;
    const mobileButtonPadding = isMobile ? '1rem' : 0;
    const buttonStyles: CSSObject = isMobile
      ? {
          display: 'flex',
          justifyContent: 'flex-start',
          flexDirection: 'column',
          columnGap: '1rem',
          rowGap: '1rem'
        }
      : {
          display: 'flex',
          justifyContent: 'flex-end',
          flexDirection: 'row',
          columnGap: '1.5rem',
          rowGap: 0
        };

    return {
      bottomContainer: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'column'
      },
      whiteRect: isMobile
        ? {
            marginTop: '1.5rem',
            marginLeft: 0,
            marginRight: 0,
            height: '45vh',
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'row',
            padding: '1.5rem',
            flexWrap: 'wrap'
          }
        : {
            marginTop: '1.5rem',
            marginLeft: '1rem',
            marginRight: '1rem',
            height: '11rem',
            display: 'flex',
            justifyContent: 'space-between',
            flexDirection: 'row-reverse',
            padding: '1.5rem',
            flexWrap: 'wrap'
          },
      buttonStyle: {
        ...buttonStyles,
        width: isMobile ? '100%' : 'auto',
        maxWidth: '30rem'
      },
      editButtonStyle: {
        ...buttonStyles,
        padding: '1.5rem',
        position: 'absolute',
        top: '1rem',
        right: '1rem'
      },
      bottomSection: isMobile
        ? {
            display: 'flex',
            flexDirection: 'column',
            columnGap: '2rem',
            flexWrap: 'wrap',
            marginTop: '4rem',
            flex: '1 1 auto',
            alignItems: 'center',
            rowGap: '2rem',
            marginLeft: 0,
            marginRight: 0
          }
        : {
            display: 'flex',
            flexDirection: 'row',
            columnGap: '2rem',
            flexWrap: 'wrap',
            marginTop: '1.5rem',
            flex: '1 1 auto',
            alignItems: null,
            rowGap: '2rem',
            marginLeft: '2.5rem',
            marginRight: '2.5rem'
          },
      cardStyle: {
        display: 'flex',
        flexDirection: 'column',
        rowGap: '1rem',
        marginTop: sharedMarginTop
      },
      bottomLeft: {
        display: 'flex',
        flexDirection: 'column',
        rowGap: '1rem',
        marginTop: sharedMarginTop
      },
      ccpaTextStyle: {
        display: 'flex',
        maxWidth: '26.5rem',
        fontSize: font.base.size[3],
        justifyContent: 'center',
        marginTop: '0.6rem'
      },
      message: {
        zIndex: 10
      },
      bottomRight: isMobile
        ? {
            marginLeft: '0rem',
            marginTop: '1.5rem',
            zIndex: 10,
            maxWidth: '70%',
            paddingTop: '1rem'
          }
        : {
            marginLeft: '3rem',
            marginTop: '0rem',
            zIndex: 10,
            maxWidth: '32%',
            paddingTop: 0
          },
      partialEditMessage: {
        marginLeft: -10
      },
      editMobileButtons: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        marginTop: '0.5rem',
        alignItems: 'center',
        rowGap: '1rem',
        maxWidth: '30rem',
        paddingLeft: mobileButtonPadding,
        paddingRight: mobileButtonPadding,
        marginBottom: '1.5rem'
      },
      cardWidthStyle: {
        width: cardWidth
      },
      additionalDetailsStyle: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      },
      mobileSocialLinks: {
        width: 'fit-content',
        marginRight: 'auto',
        marginLeft: 'auto',
        marginBottom: '1.5rem'
      },
      privacyContainer: {
        borderBottom: isS ? 'none' : `solid 0.063rem ${borderColor.soft}`,
        overflow: 'hidden',
        backgroundColor: colors.neutral.zero
      }
    };
  }, [isMobile, font.base.size, cardWidth, borderColor, colors, isS]);
};

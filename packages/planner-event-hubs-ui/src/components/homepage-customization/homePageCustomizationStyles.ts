import { Theme } from '@cvent/carina/components/ThemeProvider';
import { CSSObject } from '@emotion/react';
import useBreakpoints from '@hooks/useBreakpoints';
import { useMemo } from 'react';

export const HomePageCustomizationStyles = (theme: Theme): Record<string, CSSObject> => {
  return useMemo(
    () => ({
      containerStyles: {
        flexGrow: 1,
        overflowY: 'auto',
        height: '100%',
        backgroundColor: theme.backgroundColor.focus
      },
      contentStyles: {
        maxWidth: 1200,
        margin: '0 auto'
      },
      formContainerStyles: {
        minHeight: '83vh',
        display: 'flex',
        flexDirection: 'column'
      },
      formButtonsStyle: {
        alignSelf: 'flex-end',
        marginTop: 'auto'
      },
      formButtonStylesWithFloat: {
        float: 'right',
        marginTop: 24
      },
      title: {
        fontSize: theme.font.base.size.s,
        fontWeight: theme.font.base.weight.regular
      },
      description: {
        fontSize: theme.font.base.size.m,
        color: theme.font.color.soft
      },
      listTitle: {
        fontSize: theme.font.base.size.s,
        color: theme.font.color.soft
      },
      horizontalLine: {
        width: '100%',
        height: '0rem',
        borderTop: `0.065rem solid ${theme.borderColor.soft}`
      },
      sectionTitleContainer: {
        display: 'flex',
        padding: 32,
        paddingBottom: 10,
        justifyContent: 'space-between'
      },
      sectionTitle: {
        fontSize: theme.font.base.size.s,
        fontWeight: theme.font.base.weight.bold
      },
      hiddenToolTioContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      },
      hiddenToolTip: {
        display: 'flex',
        borderRadius: 22,
        background: theme.colors.neutral[45],
        color: theme.colors.neutral.zero,
        fontSize: theme.font.base.size.xxs,
        gap: 4,
        padding: '4px 12px'
      }
    }),
    [theme]
  );
};

// Banner section
export const BannerSectionStyles = (theme: Theme): Record<string, CSSObject> => {
  const { isS } = useBreakpoints();
  return useMemo(
    () => ({
      outerContainer: {
        display: 'flex',
        flexDirection: 'column',
        padding: '0px 42px'
      },
      titleContainer: {
        display: 'flex',
        alignItems: 'center',
        gap: 24,
        marginLeft: 16
      },
      modalTitleContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1.5rem',
        marginRight: 16
      },
      listItem: {
        listStyle: 'none',
        fontSize: theme.font.base.size.m
      },
      accordionContainer: {
        margin: isS ? '0' : '0rem 2rem',
        border: 'none',
        backgroundColor: theme.backgroundColor.base,
        padding: '8px 16px 8px 12px',
        'div[role=button]:hover': {
          backgroundColor: theme.backgroundColor.base
        }
      }
    }),
    [theme, isS]
  );
};

// Drag and Drop - added styles to custimize the carina draggableTable to meet the design requirements
export const ReorderableTableStyle = (theme: Theme): Record<string, CSSObject> => {
  const { isS } = useBreakpoints();
  return useMemo(
    () => ({
      tableLabelStyle: {
        color: theme.font.color.base,
        fontSize: theme.font.base.size.s
      },
      tableHandleStyle: {
        padding: isS ? '0' : '0 2rem',
        'div[role=rowgroup]': {
          borderTop: 'none'
        }
      }
    }),
    [theme, isS]
  );
};

// Upcoming events section
export const UpcomingEventsSection = (theme: Theme): Record<string, CSSObject> => {
  const { isM, isS, isMobile } = useBreakpoints();

  return useMemo(
    () => ({
      outerContainer: {
        display: 'flex',
        flexDirection: 'column'
      },
      textBoxAndTextarea: {
        maxWidth: isMobile ? '100%' : '40%',
        marginLeft: isS || isM ? '0rem' : '12rem'
      },
      optionsAndPreviewContainer: {
        display: 'flex',
        flexDirection: isS || isM ? 'column-reverse' : 'row',
        flex: '40% 60%'
      },
      optionsContainer: {
        width: '25%',
        marginLeft: isS || isM ? '0rem' : '12rem'
      },
      viewOptionsAndPreview: {
        margin: '16px 0',
        fontWeight: theme.font.base.weight.bold,
        color: theme.font.color.soft
      },
      previewContainer: {
        flex: '70%',
        padding: '0 16px'
      }
    }),
    [theme, isM, isS]
  );
};

// Single Channel Section
export const SingleChannelSectionStyles = (theme: Theme): Record<string, CSSObject> => {
  const { isM, isS, isMobile } = useBreakpoints();

  return useMemo(
    () => ({
      outerContainer: {
        display: 'flex',
        flexDirection: 'column'
      },
      textBoxAndTextarea: {
        maxWidth: isMobile ? '100%' : '40%',
        marginLeft: isS || isM ? '0rem' : '12rem'
      },
      optionsAndPreviewContainer: {
        display: 'flex',
        flexDirection: isS || isM ? 'column-reverse' : 'row',
        flex: '40% 60%'
      },
      optionsContainer: {
        maxWidth: '40%',
        marginLeft: isS || isM ? '0rem' : '12rem'
      },
      viewOptionsAndPreview: {
        margin: '16px 0',
        fontWeight: theme.font.base.weight.bold,
        color: theme.font.color.soft
      },
      previewContainer: {
        flex: '70%',
        padding: '0 16px'
      }
    }),
    [theme, isM, isS]
  );
};

// Add Section modals
export const AddSectionModalStyles = (
  theme: Theme,
  additionalParams: Record<string, string>
): Record<string, CSSObject> => {
  const { isMobileOrTablet } = useBreakpoints();
  return useMemo(
    () => ({
      titleContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        margin: 32,
        marginBottom: 0
      },
      titleStyle: {
        fontSize: theme.font.base.size.h2
      },
      subtitleStyle: {
        fontSize: theme.font.base.size.s,
        color: theme.font.color.soft,
        marginBottom: 24
      },
      tileTitle: {
        fontSize: theme.font.base.size.l,
        fontWeight: theme.font.base.weight.bold,
        paddingLeft: 12,
        color: additionalParams.disabled === 'true' ? theme.font.color.disabled : theme.font.color.base
      },
      tileDescription: {
        fontSize: theme.font.base.size.s,
        color: additionalParams.disabled === 'true' ? theme.font.color.disabled : theme.font.color.soft,
        paddingLeft: 12
      },
      addBtnStyle: {
        display: 'flex',
        justifyContent: 'flex-end',
        margin: 32,
        marginTop: 24
      },
      sectionHeading: {
        fontSize: theme.font.base.size.s,
        fontWeight: theme.font.base.weight.bold,
        color: theme.font.color.soft,
        paddingBottom: 16
      },
      sectionModalContainer: {
        maxHeight: '90vh',
        margin: '0 32px'
      },
      templateContainer: {
        width: isMobileOrTablet ? '100%' : '33%'
      },
      templateTitle: {
        fontSize: theme.font.base.size.m,
        margin: '0 auto'
      },
      tileTemplateDescription: {
        fontSize: theme.font.base.size.s,
        color: theme.font.color.soft,
        marginBottom: 16,
        textAlign: isMobileOrTablet ? 'center' : 'left'
      },
      sectionContainerMargin: {
        margin: !isMobileOrTablet ? '0px 24px 24px 48px' : '0px 24px 24px 32px'
      }
    }),
    [theme, isMobileOrTablet]
  );
};

// Video section
export const VideosSectionStyles = (theme: Theme): Record<string, CSSObject> => {
  const { isMobileOrTablet } = useBreakpoints();
  return useMemo(
    () => ({
      outerContainer: {
        display: 'flex',
        flexDirection: 'column'
      },
      timeFrameContainer: {
        width: '300px'
      },
      optionsContainer: {
        width: isMobileOrTablet ? '100%' : '40%',
        marginLeft: isMobileOrTablet ? 0 : '12rem'
      },
      viewOptionsAndPreview: {
        marginTop: '16px',
        fontWeight: theme.font.base.weight.bold,
        color: theme.font.color.soft
      }
    }),
    [theme, isMobileOrTablet]
  );
};

// Video Table in Single Channel block style
export const VideoTableStyle = (theme: Theme): Record<string, CSSObject> => {
  return useMemo(
    () => ({
      tableVideoStyle: {
        'div[role=rowgroup]': {
          gap: 0,
          padding: '0',
          borderTop: `1px solid ${theme.borderColor.soft}`
        },
        'div[role=rowgroup] > div': {
          borderBottom: `1px solid ${theme.borderColor.soft}`,
          borderRadius: 0
        },
        'div[role=row]': {
          borderLeft: 0,
          borderRight: 0,
          borderTop: 0
        }
      }
    }),
    [theme]
  );
};

// New Section
export const NewSectionStyles = (theme: Theme): Record<string, CSSObject> => {
  const { isMobileOrTablet } = useBreakpoints();
  return useMemo(
    () => ({
      optionsContainer: {
        display: 'flex',
        gap: isMobileOrTablet ? 0 : '12rem',
        flexDirection: isMobileOrTablet ? 'column' : 'row'
      },
      radioGroupContainer: {
        marginTop: 16,
        width: isMobileOrTablet ? '100%' : '35%'
      }
    }),
    [theme, isMobileOrTablet]
  );
};

// Your Events section And Channels List Section
export const SectionCommonStyles = (theme: Theme): Record<string, CSSObject> => {
  const { isMobile, isMobileOrTablet } = useBreakpoints();
  return useMemo(
    () => ({
      optionsContainer: {
        width: isMobile ? '100%' : '25%',
        marginLeft: isMobileOrTablet ? 0 : '10%',
        paddingRight: 24
      },
      titleInput: {
        maxWidth: 300
      }
    }),
    [theme, isMobile, isMobileOrTablet]
  );
};
